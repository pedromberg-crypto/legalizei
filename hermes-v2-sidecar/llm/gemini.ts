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

  for (const m of mensagens) {
    if (m.papel === 'ferramenta') {
      contents.push({
        role: 'model',
        parts: [{
          functionCall: { name: m.nome ?? 'desconhecida', args: m.argumentos ?? {} },
          // 🔴 A ASSINATURA TEM QUE VOLTAR JUNTO.
          //
          // O Gemini 3.x recusa com HTTP 400 um `functionCall` reenviado sem o
          // `thoughtSignature` que ele proprio emitiu. Medido: dos 20 casos da
          // suite curta, 8 morreram exatamente assim, todos no segundo turno,
          // sempre depois da primeira tool. Toda conversa que usa ferramenta
          // quebra sem isto.
          ...(m.assinatura ? { thoughtSignature: m.assinatura } : {}),
        }],
      })
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: m.nome ?? 'desconhecida',
            response: seguroComoObjeto(m.texto),
          },
        }],
      })
      continue
    }
    contents.push({
      role: m.papel === 'cliente' ? 'user' : 'model',
      parts: [{ text: m.texto }],
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
}

export function criarLlm(opcoes: OpcoesGemini = {}): Llm {
  const ai = cliente()
  const modelo = opcoes.modelo ?? MODELO_PADRAO

  return {
    async completar({ sistema, mensagens, tools, jsonSchema }) {
      const r = await ai.models.generateContent({
        model: modelo,
        contents: comoContents(mensagens),
        config: {
          systemInstruction: sistema,
          temperature: opcoes.temperatura ?? 0.7,
          ...(tools?.length
            ? { tools: [{ functionDeclarations: comoFunctionDeclarations(tools) }] }
            : {}),
          ...(jsonSchema
            ? {
                responseMimeType: 'application/json',
                responseSchema: jsonSchema as { type: Type },
              }
            : {}),
        },
      })

      // A assinatura vem na PARTE, nao no `functionCalls` resumido do SDK.
      // Por isso a lista sai das parts do candidato, casando pelo nome.
      const parts = r.candidates?.[0]?.content?.parts ?? []
      const assinaturaPorNome = new Map<string, string>()
      for (const p of parts) {
        if (p.functionCall?.name && p.thoughtSignature) {
          assinaturaPorNome.set(p.functionCall.name, p.thoughtSignature)
        }
      }

      const chamadas = (r.functionCalls ?? []).map((c) => ({
        nome: c.name ?? '',
        argumentos: (c.args ?? {}) as Record<string, unknown>,
        assinatura: assinaturaPorNome.get(c.name ?? ''),
      }))

      return {
        texto: r.text ?? '',
        chamadas,
        // ⚠️ Vem do provedor, nao e estimativa nossa. E o que alimenta
        //    `conversa.turno_interno`, que e onde se mede se a quebra do SOUL
        //    em trilhas de fato reduziu o piso de custo.
        tokensEntrada: r.usageMetadata?.promptTokenCount ?? 0,
        tokensSaida: r.usageMetadata?.candidatesTokenCount ?? 0,
      }
    },
  }
}
