/**
 * ════════════════════════════════════════════════════════════════════════════
 *  llm/gemini.ts  ·  o Gemini falando os contratos do roteador
 *
 *  Duas implementacoes, e nenhuma logica de produto: `Embedder` e `Llm` do
 *  `tipos.ts`. O roteador nao sabe que existe Gemini, e trocar de provedor nao
 *  toca em nada fora desta pasta. Foi por isso que os contratos nasceram
 *  minimos na Tarefa 3.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto'

import { GoogleGenAI, Type, type Content, type FunctionDeclaration } from '@google/genai'

import type { DefinicaoTool, Embedder, Llm, MensagemLlm } from '../tipos.js'

/**
 * 🔴 768, E ISSO TEM QUE BATER COM O SCHEMA.
 *
 * `vector(768)` nas colunas de embedding. Divergencia aqui nao da erro de
 * compilacao nem de carga: da erro do Postgres na primeira busca, ja em uso.
 * Por isso o numero e exportado e a carga confere o tamanho do vetor antes de
 * gravar a primeira linha.
 */
export const DIMENSAO = 768

/**
 * ⚠️ O nome do modelo se CONFERE contra a chave, nao se supoe.
 *
 * A primeira versao deste arquivo apontava para `text-embedding-004`, que
 * devolveu 404: a chave nao o oferece. O catalogo real (`ListModels`) tem
 * `gemini-embedding-001`. Modelo que a documentacao lista nao e modelo que a
 * SUA chave atende, e isso ja mordeu antes neste projeto: `gemini-2.5-flash` e
 * `gemini-2.5-flash-lite` davam 404 com "no longer available to new users"
 * aparecendo no ListModels mesmo assim.
 */
const MODELO_EMBEDDING = 'gemini-embedding-001'

/** O mesmo que roda em producao no Leo hoje, para o E2E medir o que existe. */
const MODELO_PADRAO = process.env.GEMINI_MODELO ?? 'gemini-3.1-flash-lite'

function cliente(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY nao definida (use `node --env-file=.env`)')
  return new GoogleGenAI({ apiKey })
}

/**
 * Uma chamada minima antes de comecar, para a falha aparecer na primeira linha
 * e em portugues.
 *
 * 🔴 Existe porque em 20/09 a carga vetorial morreu com `402 Payment Required`
 * ("prepayment credits are depleted") **depois** de ja ter aberto transacao no
 * banco. Sem isto, um problema de cobranca chega como stack trace do SDK no
 * meio de um loop, e parece bug de codigo.
 *
 * ⚠️ Erro de provedor nao e falha de qualidade. O runner antigo pontuava a
 * mensagem de erro como se fosse resposta do Leo, e placar ruim por 429 passava
 * por regressao.
 */
export async function verificarAcesso(): Promise<void> {
  const ai = cliente()
  try {
    await ai.models.embedContent({
      model: MODELO_EMBEDDING,
      contents: 'teste',
      config: { outputDimensionality: DIMENSAO },
    })
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro)
    if (msg.includes('402') || /credits are depleted|RESOURCE_EXHAUSTED/i.test(msg)) {
      throw new Error(
        'A conta do Gemini esta sem credito (HTTP 402). Nada foi gravado.\n' +
        'Resolva a cobranca em ai.studio e rode de novo: a carga e idempotente.',
      )
    }
    if (msg.includes('404')) {
      throw new Error(
        `O modelo "${MODELO_EMBEDDING}" nao existe para esta chave (HTTP 404).\n` +
        'Confira o catalogo real com ListModels: modelo que a documentacao lista\n' +
        'nao e modelo que a sua chave atende.',
      )
    }
    throw erro
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  EMBEDDER
// ════════════════════════════════════════════════════════════════════════════

export function criarEmbedder(): Embedder {
  const ai = cliente()
  return {
    async gerar(texto: string): Promise<number[]> {
      const r = await ai.models.embedContent({
        model: MODELO_EMBEDDING,
        contents: texto,
        config: { outputDimensionality: DIMENSAO },
      })
      const v = r.embeddings?.[0]?.values
      if (!v) throw new Error('o provedor devolveu resposta sem embedding')

      // 🔴 Confere a dimensao NA ORIGEM. Vetor do tamanho errado so seria
      //    recusado la no INSERT, com mensagem de tipo, longe da causa.
      if (v.length !== DIMENSAO) {
        throw new Error(
          `o modelo devolveu ${v.length} dimensoes e o schema espera ${DIMENSAO}. ` +
          'Trocar de modelo de embedding e migracao com recarga, nao um ALTER.',
        )
      }
      return normalizar(v)
    },
  }
}

/**
 * 🔑 O `gemini-embedding-001` so devolve vetor normalizado na dimensao cheia.
 * Truncado para 768 ele vem SEM normalizar, e a propria documentacao do Google
 * manda normalizar a mao nesse caso.
 *
 * Para a busca que usamos (`<=>`, distancia de cosseno) isso seria indiferente,
 * porque cosseno ja divide pelas normas. Normalizamos mesmo assim por um motivo
 * pratico: com vetor unitario, cosseno e distancia euclidiana passam a dar a
 * MESMA ordem. Quem um dia trocar `<=>` por `<->` no `buscar_cartao`, por
 * habito ou por copiar exemplo, nao quebra a busca em silencio.
 */
function normalizar(v: number[]): number[] {
  const norma = Math.sqrt(v.reduce((a, x) => a + x * x, 0))
  return norma === 0 ? v : v.map((x) => x / norma)
}

// ════════════════════════════════════════════════════════════════════════════
//  LLM
// ════════════════════════════════════════════════════════════════════════════

/**
 * Traduz o historico do roteador para o formato do Gemini.
 *
 * 🔴 O ponto delicado e a ferramenta. O Gemini exige a dupla: um turno do
 * MODELO com `functionCall` e, logo depois, um turno do USUARIO com
 * `functionResponse` de mesmo nome. Mandar o retorno como texto do assistente
 * parece funcionar e envenena o loop: o modelo passa a achar que ele proprio
 * disse aquele JSON ao cliente, e chega a repetir o JSON na resposta final.
 */
function comoContents(mensagens: MensagemLlm[]): Content[] {
  const contents: Content[] = []

  for (let i = 0; i < mensagens.length; i++) {
    const m = mensagens[i]

    if (m.papel !== 'ferramenta') {
      contents.push({
        role: m.papel === 'cliente' ? 'user' : 'model',
        parts: [{ text: m.texto }],
      })
      continue
    }

    /**
     * 🔴 CHAMADAS PARALELAS VAO NO MESMO TURNO, NAO EM TURNOS SEGUIDOS.
     *
     * Quando o modelo decide chamar tres tools de uma vez, ele emite UM turno
     * com tres partes `functionCall`, e espera de volta UM turno com tres
     * `functionResponse`. Quebrar isso em tres pares seguidos parece
     * equivalente e nao e: o Gemini casa chamada com resposta por POSICAO, e
     * devolveu HTTP 400 dizendo "missing a thought_signature ... position 4".
     *
     * A mensagem do erro fala de assinatura e engana: a assinatura estava la.
     * O que estava errado era o AGRUPAMENTO. Por isso o laco junta todas as
     * mensagens de ferramenta consecutivas antes de emitir qualquer coisa.
     */
    const bloco: MensagemLlm[] = []
    while (i < mensagens.length && mensagens[i].papel === 'ferramenta') {
      bloco.push(mensagens[i])
      i++
    }
    i-- // o `for` volta a incrementar

    contents.push({
      role: 'model',
      parts: bloco.map((f) => ({
        functionCall: { name: f.nome ?? 'desconhecida', args: f.argumentos ?? {} },
        // A assinatura que o modelo emitiu junto da chamada. Sem ela, o Gemini
        // 3.x recusa o reenvio com 400, e toda conversa que usa tool morre no
        // segundo turno.
        ...(f.assinatura ? { thoughtSignature: f.assinatura } : {}),
      })),
    })

    contents.push({
      role: 'user',
      parts: bloco.map((f) => ({
        functionResponse: {
          name: f.nome ?? 'desconhecida',
          response: seguroComoObjeto(f.texto),
        },
      })),
    })
  }

  return contents
}

/** `functionResponse.response` precisa ser objeto. Lista e texto vao embrulhados. */
function seguroComoObjeto(texto: string): Record<string, unknown> {
  try {
    const v = JSON.parse(texto)
    return v !== null && typeof v === 'object' && !Array.isArray(v) ? v : { resultado: v }
  } catch {
    return { resultado: texto }
  }
}

function comoFunctionDeclarations(tools: DefinicaoTool[]): FunctionDeclaration[] {
  return tools.map((t) => ({
    name: t.nome,
    description: t.descricao,
    parameters: t.parametros as FunctionDeclaration['parameters'],
  }))
}

export interface OpcoesGemini {
  modelo?: string
  temperatura?: number
  /** Liga o cache explicito do prompt de sistema. Ver o bloco abaixo. */
  cache?: boolean
  /** Quanto tempo o cache vive. Padrao 15 min, que cobre uma rodada de E2E. */
  cacheTtlSegundos?: number
}

// ════════════════════════════════════════════════════════════════════════════
//  CACHE EXPLICITO DO PROMPT DE SISTEMA
//
//  🔑 POR QUE VALE: medido em 7 rodadas, ~99% do input e o prompt de sistema
//  reenviado inteiro a cada chamada. Token em cache custa um decimo do token de
//  entrada normal, e o prompt de sistema e ESTAVEL por trilha: e exatamente o
//  caso de uso do cache, e o unico cuja economia escala com volume.
//
//  🔴 O QUE MUDA NA CHAMADA: com `cachedContent`, o `systemInstruction` e as
//  `tools` NAO podem ser reenviados na mesma requisicao. Eles ja vivem no
//  cache. Mandar os dois derruba a chamada, entao o adaptador tem dois caminhos
//  e nao um com `if` no meio.
//
//  ⚠️ CACHE E POR (modelo + sistema + tools). Trilhas diferentes carregam
//  documentos diferentes, entao cada uma tem o seu. A chave e um hash do
//  conteudo: mudou uma linha do RULES.md, nasce cache novo, e o antigo expira
//  sozinho. Sem isso, editar o prompt e continuar rodando o cache velho seria um
//  bug invisivel, do pior tipo: o teste mediria a versao anterior.
//
//  ⚠️ E CACHE TEM CUSTO DE ARMAZENAMENTO POR HORA, que nao esta medido neste
//  repo. Por isso o TTL e curto e a coisa e OPCIONAL: numa rodada de teste ele
//  quase certamente compensa, em producao 24/7 a conta e outra e precisa ser
//  feita com o preco na mao.
// ════════════════════════════════════════════════════════════════════════════

interface CacheVivo {
  nome: string
  expiraEm: number
}

const caches = new Map<string, CacheVivo>()

function chaveDoCache(modelo: string, sistema: string, tools: DefinicaoTool[]): string {
  return createHash('sha256')
    .update(modelo).update('\u0000')
    .update(sistema).update('\u0000')
    .update(JSON.stringify(tools.map((t) => t.nome)))
    .digest('hex')
}

/**
 * Devolve o nome do cache para este conjunto, criando se preciso.
 *
 * 🔴 Devolve `null` em vez de estourar quando o provedor recusa. Cache e
 * otimizacao, nao funcionalidade: se ele falhar (conteudo abaixo do minimo de
 * tokens, cota, indisponibilidade), a rodada TEM que continuar pelo caminho
 * normal. Otimizacao que derruba producao quando falha nao e otimizacao.
 */
async function pegarCache(
  ai: GoogleGenAI,
  modelo: string,
  sistema: string,
  tools: DefinicaoTool[],
  ttlSegundos: number,
): Promise<string | null> {
  const chave = chaveDoCache(modelo, sistema, tools)
  const vivo = caches.get(chave)
  // Margem de 60s: cache que expira entre a decisao e a chamada vira erro.
  if (vivo && vivo.expiraEm > Date.now() + 60_000) return vivo.nome

  try {
    const criado = await ai.caches.create({
      model: modelo,
      config: {
        systemInstruction: sistema,
        ...(tools.length ? { tools: [{ functionDeclarations: comoFunctionDeclarations(tools) }] } : {}),
        ttl: `${ttlSegundos}s`,
        displayName: `leo-${chave.slice(0, 12)}`,
      },
    })
    if (!criado.name) return null
    caches.set(chave, { nome: criado.name, expiraEm: Date.now() + ttlSegundos * 1000 })
    return criado.name
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro)
    console.warn(`[cache] nao criado, seguindo sem: ${msg.slice(0, 160)}`)
    // Marca como indisponivel por um tempo, para nao tentar criar a cada chamada
    // e pagar uma ida de rede extra por turno.
    caches.set(chave, { nome: '', expiraEm: Date.now() + 120_000 })
    return null
  }
}

export function criarLlm(opcoes: OpcoesGemini = {}): Llm {
  const ai = cliente()
  const modelo = opcoes.modelo ?? MODELO_PADRAO

  const ttl = opcoes.cacheTtlSegundos ?? 900

  return {
    async completar({ sistema, mensagens, tools, jsonSchema }) {
      // 🔴 Cache so entra quando NAO ha `jsonSchema`. A chamada do classificador
      //    pede saida estruturada e usa um prompt curto proprio: cachear ali nao
      //    economiza nada e complica a combinacao de configs.
      const nomeDoCache = opcoes.cache && !jsonSchema
        ? await pegarCache(ai, modelo, sistema, tools ?? [], ttl)
        : null

      const r = await ai.models.generateContent({
        model: modelo,
        contents: comoContents(mensagens),
        config: {
          temperature: opcoes.temperatura ?? 0.7,
          // Com cache, sistema e tools JA ESTAO nele e reenvia-los derruba a
          // chamada. Sem cache, os dois vao normalmente.
          ...(nomeDoCache
            ? { cachedContent: nomeDoCache }
            : {
                systemInstruction: sistema,
                ...(tools?.length
                  ? { tools: [{ functionDeclarations: comoFunctionDeclarations(tools) }] }
                  : {}),
              }),
          ...(jsonSchema
            ? {
                responseMimeType: 'application/json',
                responseSchema: jsonSchema as { type: Type },
              }
            : {}),
        },
      })

      // A assinatura vem na PARTE, nao no `functionCalls` resumido do SDK.
      //
      // ⚠️ O casamento e POSICIONAL, nao por nome: o modelo pode chamar a mesma
      // tool duas vezes no mesmo turno com argumentos diferentes, e um mapa por
      // nome daria a assinatura da segunda para a primeira. `functionCalls`
      // preserva a ordem das parts, entao basta zipar pelo indice.
      const assinaturas = (r.candidates?.[0]?.content?.parts ?? [])
        .filter((p) => p.functionCall)
        .map((p) => p.thoughtSignature)

      const chamadas = (r.functionCalls ?? []).map((c, i) => ({
        nome: c.name ?? '',
        argumentos: (c.args ?? {}) as Record<string, unknown>,
        assinatura: assinaturas[i],
      }))

      return {
        texto: r.text ?? '',
        chamadas,
        // ⚠️ Vem do provedor, nao e estimativa nossa. E o que alimenta
        //    `conversa.turno_interno`, que e onde se mede se a quebra do SOUL
        //    em trilhas de fato reduziu o piso de custo.
        tokensEntrada: r.usageMetadata?.promptTokenCount ?? 0,
        tokensSaida: r.usageMetadata?.candidatesTokenCount ?? 0,
        // Subconjunto de , nao parcela a somar.
        tokensCache: r.usageMetadata?.cachedContentTokenCount ?? 0,
      }
    },
  }
}
