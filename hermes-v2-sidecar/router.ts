/**
 * ════════════════════════════════════════════════════════════════════════════
 *  router.ts  ·  o orquestrador Sidecar
 *
 *  Implementa `RULES.md` §5. O arquivo faz quatro coisas e nenhuma a mais:
 *
 *    1. classifica a mensagem em SINAIS (semantico, via LLM)
 *    2. aplica a PRECEDENCIA em codigo (deterministico, nunca no modelo)
 *    3. resolve pela trilha escolhida, carregando so o documento daquela trilha
 *    4. grava o que a pessoa viu e o que o roteador pensou, em tabelas separadas
 *
 *  🔴 A TRAVA COMERCIAL VIVE EM TRES LUGARES, de proposito redundante:
 *     aqui em `podeInjetarGancho`, na constraint `comercial_exige_tecnica_ok`
 *     do banco, e na regra escrita do `RULES.md` §5.1. Regra que so existe em
 *     prompt e regra que o modelo pode desobedecer, e o unico defeito de
 *     qualidade medido neste agente foi de ADERENCIA, nao de recuperacao.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type {
  Embedder, Entrada, FalhaTipo, Llm, Resolucao, Resposta, Saida, Sinais,
  PacoteEscalonamento,
} from './tipos.js'
import { TOOLS } from './tools-def.js'

const AQUI = dirname(fileURLToPath(import.meta.url))

// ════════════════════════════════════════════════════════════════════════════
//  0. AS DEPENDENCIAS DE I/O, TARDIAS E INJETAVEIS
//
//  🔑 Isto nasceu dos testes, nao do desenho. Enquanto o roteador importava
//  `db.ts` no topo, importar este arquivo abria um Pool do Postgres no
//  carregamento do modulo: nenhum teste rodava sem `pg` instalado e banco de
//  pe, nem mesmo o de funcao pura.
//
//  Agora o acesso a banco e a execucao de tool entram por `Deps`, com o modulo
//  real carregado sob demanda. Em producao nada muda. No teste, a trava
//  comercial pode ser provada offline, que e o unico jeito de ela virar
//  regressao de verdade em vez de intencao.
// ════════════════════════════════════════════════════════════════════════════

export interface Deps {
  carregarHistorico(sessaoId: string, limite?: number): Promise<{ papel: 'cliente' | 'leo'; texto: string }[]>
  gravarTurno(
    sessaoId: string,
    textoCliente: string,
    textoLeo: string,
    medicao: {
      saida: Saida
      tecnicaOk: boolean
      falhaTipo: FalhaTipo | null
      cartoesUsados: string[]
      fatosLidos: string[]
      tokensEntrada: number
      tokensSaida: number
    },
  ): Promise<void>
  atualizarClassificacao(contatoId: string, campos: Record<string, unknown>, mensagemId: number | null): Promise<void>
  executarTool(
    nome: string,
    argumentos: Record<string, any>,
    embedder: Embedder,
  ): Promise<{ conteudo: unknown; cartoes: string[]; fatos: string[] }>
}

let depsCache: Deps | null = null

async function depsPadrao(): Promise<Deps> {
  if (depsCache) return depsCache
  const [db, tools] = await Promise.all([import('./db.js'), import('./tools.js')])
  depsCache = {
    carregarHistorico: db.carregarHistorico,
    gravarTurno: db.gravarTurno,
    atualizarClassificacao: db.atualizarClassificacao as Deps['atualizarClassificacao'],
    executarTool: tools.executarTool,
  }
  return depsCache
}

// ════════════════════════════════════════════════════════════════════════════
//  1. OS DOCUMENTOS, CARREGADOS POR TRILHA
//
//  🔑 E aqui que a quebra do SOUL em PERSONA + RULES se paga. Somados, os dois
//  sao maiores que o arquivo unico que substituiram. So compensa porque cada
//  trilha carrega o que precisa: o roteador nao le nenhum dos dois, e a trilha
//  tecnica nao carrega o banco de falas.
//
//  ⚠️ Se algum dia todas as trilhas carregarem os dois inteiros, a quebra virou
//  custo puro. Medir isso e olhar `tokens_entrada` por `saida` em
//  `conversa.turno_interno`.
// ════════════════════════════════════════════════════════════════════════════

const PERSONA = readFileSync(join(AQUI, 'PERSONA.md'), 'utf8')
const RULES = readFileSync(join(AQUI, 'RULES.md'), 'utf8')

/** Recorta secoes de nivel `##` de um markdown, preservando as subsecoes. */
function secoes(markdown: string, titulos: string[]): string {
  const blocos = markdown.split(/^## /m).slice(1)
  return blocos
    .filter((b) => titulos.some((t) => b.startsWith(t)))
    .map((b) => `## ${b.trimEnd()}`)
    .join('\n\n')
}

const SISTEMA: Record<Saida, string> = {
  // Voz completa: quem esta com medo ou prejuizo precisa do Leo inteiro.
  escalonamento: [PERSONA, secoes(RULES, ['1.', '5.', '7.', '9.'])].join('\n\n'),

  // O gate de saida e copy de despedida: precisa de tom, e de pouca regra.
  fora_escopo: [PERSONA, secoes(RULES, ['2.', '5.', '9.'])].join('\n\n'),

  // 🔑 A trilha mais frequente carrega o MENOS possivel de persona: so o que
  // governa forma. O banco de falas, o humor e a calibragem ficam de fora.
  tecnico: [
    secoes(PERSONA, ['Ritmo', 'Formato WhatsApp', 'Calibragem de tamanho']),
    RULES,
  ].join('\n\n'),

  // Venda pede o Leo inteiro: e onde o tom decide.
  comercial: [PERSONA, RULES].join('\n\n'),
}

// ════════════════════════════════════════════════════════════════════════════
//  2. CLASSIFICACAO E PRECEDENCIA
// ════════════════════════════════════════════════════════════════════════════

const PROMPT_ROTEADOR = `Voce classifica a mensagem de um cliente para um atendimento de
contabilidade digital. Voce NAO responde ao cliente e NAO escolhe a rota: devolve sinais.

Marque \`gatilho_escalonamento\` quando aparecer: multa recebida, cobranca indevida ou em
duplicidade, guia paga errada, cancelamento, reembolso, negociacao de multa, desconto fora
da tabela, interpretacao de clausula, empresa com pendencia antiga, dado errado depois do
envio ao orgao, irritacao escalando, ameaca, pedido de falar com humano, insistencia no
valor fechado de imposto depois de recusar a estimativa, ou insistencia no anexo exato de
um codigo de CNAE.

NAO sao gatilho: profissao, MEI ou ME, faturamento, "voces atendem?", conceito, preco,
prazo de vencimento, como o app funciona, e perguntar sobre fidelidade, multa contratual,
garantia ou cancelamento em tese, que sao consulta.

Marque \`fora_do_escopo\` quando: comercio, industria, EPP, Lucro Presumido, Lucro Real,
cidade fora de Belo Horizonte sem aceitar endereco fiscal, mais de quatro socios, ou
regularizacao de passivo.

Marque \`tensao\` quando houver medo, prejuizo ja ocorrido ou irritacao.

Responda so o JSON.`

async function classificar(llm: Llm, entrada: Entrada, historico: { papel: 'cliente' | 'leo'; texto: string }[]) {
  const r = await llm.completar({
    sistema: PROMPT_ROTEADOR,
    mensagens: [...historico.slice(-6), { papel: 'cliente', texto: entrada.texto }],
    jsonSchema: {
      type: 'object',
      properties: {
        gatilho_escalonamento: { type: 'boolean' },
        fora_do_escopo: { type: 'boolean' },
        pergunta_tecnica: { type: 'boolean' },
        interesse_comercial: { type: 'boolean' },
        tensao: { type: 'boolean' },
        resumo: { type: 'string' },
        revelou: {
          type: 'object',
          properties: {
            regime_alvo: { type: 'string', enum: ['mei', 'me_simples'] },
            atividade: { type: 'string' },
            cidade: { type: 'string' },
          },
        },
      },
      required: [
        'gatilho_escalonamento', 'fora_do_escopo',
        'pergunta_tecnica', 'interesse_comercial', 'tensao', 'resumo',
      ],
    },
  })
  return {
    sinais: JSON.parse(r.texto) as Sinais,
    tokensEntrada: r.tokensEntrada,
    tokensSaida: r.tokensSaida,
  }
}

/**
 * 🔴 A PRECEDENCIA, EM CODIGO. `RULES.md` §5.1.
 *
 * O modelo devolve sinais; quem ordena e esta funcao. Pedir ao modelo que
 * ordene e abrir mao de determinismo justamente na regra que mais custa quando
 * falha: foi por ordem errada que o agente respondeu preco para quem tinha
 * acabado de contar um prejuizo.
 *
 * ⚠️ `comercial` so aparece aqui quando NAO ha pergunta tecnica junto. Quando
 * ha as duas, a saida e `tecnico` e o comercial entra como SIDECAR, depois do
 * sucesso. E por isso que nao existe empate entre as duas.
 */
export function decidirSaida(sinais: Sinais): Saida {
  if (sinais.gatilho_escalonamento) return 'escalonamento'
  if (sinais.fora_do_escopo) return 'fora_escopo'
  if (sinais.pergunta_tecnica) return 'tecnico'
  if (sinais.interesse_comercial) return 'comercial'
  return 'tecnico'
}

/**
 * 🔴 A TRAVA COMERCIAL.
 *
 * Espelha a constraint `comercial_exige_tecnica_ok`. Tres condicoes, e as tres
 * precisam valer:
 *   1. a resolucao tecnica fechou
 *   2. o classificador viu interesse comercial
 *   3. nao ha tensao (medo, prejuizo, irritacao)
 *
 * A terceira nao esta no banco porque o banco nao ve tensao. Ela esta aqui
 * porque vender por cima de uma dor e o mesmo erro de vender por cima de um
 * "nao sei", so que pior.
 */
export function podeInjetarGancho(resolucao: Resolucao, sinais: Sinais): boolean {
  return resolucao.ok && sinais.interesse_comercial && !sinais.tensao
}

// ════════════════════════════════════════════════════════════════════════════
//  3. AS TRILHAS
// ════════════════════════════════════════════════════════════════════════════

/** Exportada porque o teste precisa forcar a declaracao de lacuna sem adivinhar a string. */
export const MARCA_LACUNA = '[LACUNA]'

/**
 * Resolve com tool calling. O Node nao calcula: so repassa, coleta o que foi
 * lido e devolve o veredito.
 *
 * `ok` e o campo que a trava comercial le. Ele e false quando o modelo declarou
 * lacuna, quando nenhuma tool sustentou a resposta, ou quando uma tool estourou.
 */
async function resolver(
  llm: Llm,
  embedder: Embedder,
  deps: Deps,
  saida: Saida,
  entrada: Entrada,
  historico: { papel: 'cliente' | 'leo'; texto: string }[],
  linhaDeContexto: string | null,
  maxVoltas = 4,
): Promise<Resolucao> {
  const sistema = [
    SISTEMA[saida],
    linhaDeContexto,
    `Se a resposta depender de algo que nenhuma tool devolveu, escreva ${MARCA_LACUNA} ` +
      `no inicio da mensagem e diga em uma linha que vai confirmar com o time. ` +
      `Nao preencha o buraco com conhecimento geral.`,
  ].filter(Boolean).join('\n\n')

  const mensagens = [...historico, { papel: 'cliente' as const, texto: entrada.texto }]
  const cartoesUsados: string[] = []
  const fatosLidos: string[] = []
  let tokensEntrada = 0
  let tokensSaida = 0
  let falhaTipo: FalhaTipo | null = null

  for (let volta = 0; volta < maxVoltas; volta++) {
    const r = await llm.completar({ sistema, mensagens, tools: TOOLS })
    tokensEntrada += r.tokensEntrada
    tokensSaida += r.tokensSaida

    if (r.chamadas.length === 0) {
      const declarouLacuna = r.texto.includes(MARCA_LACUNA)
      const semLastro = cartoesUsados.length === 0 && fatosLidos.length === 0
      if (declarouLacuna || semLastro) falhaTipo = 'lacuna_da_base'
      return {
        texto: r.texto.replace(MARCA_LACUNA, '').trim(),
        ok: falhaTipo === null,
        falhaTipo,
        cartoesUsados, fatosLidos, tokensEntrada, tokensSaida,
      }
    }

    for (const chamada of r.chamadas) {
      try {
        const res = await deps.executarTool(chamada.nome, chamada.argumentos, embedder)
        cartoesUsados.push(...res.cartoes)
        fatosLidos.push(...res.fatos)
        mensagens.push({ papel: 'leo', texto: JSON.stringify(res.conteudo) })
      } catch (erro) {
        // 🔴 Tool que falha nao vira silencio nem improviso. Vira lacuna
        // declarada, e a trava comercial fecha por consequencia.
        falhaTipo = 'lacuna_da_base'
        mensagens.push({
          papel: 'leo',
          texto: JSON.stringify({ erro: erro instanceof Error ? erro.message : 'consulta falhou' }),
        })
      }
    }
  }

  // Estourou as voltas sem fechar: e lacuna, nao resposta.
  return {
    texto: '',
    ok: false,
    falhaTipo: 'lacuna_da_base',
    cartoesUsados, fatosLidos, tokensEntrada, tokensSaida,
  }
}

/**
 * O SIDECAR COMERCIAL.
 *
 * Roda depois, ve a resposta tecnica pronta, e devolve UMA batida curta. Sai
 * como segunda mensagem no WhatsApp: a linha em branco e o separador (PERSONA,
 * "Duas batidas, duas mensagens").
 *
 * ⚠️ Ele e condicional de proposito. Rodando em todo turno, adicionaria uma
 * chamada por turno, e o piso e quase todo o custo: a diferenca medida entre a
 * pergunta mais facil e a mais dificil e de vinte e sete por cento.
 */
async function ganchoComercial(
  llm: Llm,
  respostaTecnica: string,
  entrada: Entrada,
): Promise<{ texto: string; tokensEntrada: number; tokensSaida: number }> {
  const r = await llm.completar({
    sistema: [
      secoes(PERSONA, ['Ritmo', 'Fechar com pergunta e frequente, nao obrigatorio']),
      secoes(RULES, ['6.']),
      'Voce recebe uma resposta tecnica que JA foi dada e esta correta. Acrescente no ' +
        'maximo uma linha de convite, com as suas palavras. Se a resposta ja fecha o ' +
        'assunto, ou se a pessoa recusou oferta nas duas ultimas respostas, devolva vazio. ' +
        'Nao repita nada do que ja foi dito. Nao cite numero.',
    ].join('\n\n'),
    mensagens: [
      { papel: 'cliente', texto: entrada.texto },
      { papel: 'leo', texto: respostaTecnica },
    ],
  })
  return { texto: r.texto.trim(), tokensEntrada: r.tokensEntrada, tokensSaida: r.tokensSaida }
}

/**
 * O pacote da escalacao. `escalacao` SKILL §3.
 * 🔴 Sem dado sensivel: o humano puxa CPF e afins pelo sistema.
 */
function montarPacote(sinais: Sinais, entrada: Entrada, historico: { papel: string; texto: string }[]): PacoteEscalonamento {
  return {
    oQueElaQuer: entrada.texto,
    ondeEstaNaJornada: null,
    oQueJaFoiDito: historico.slice(-6).map((m) => `${m.papel}: ${m.texto}`).join('\n'),
    urgencia: sinais.tensao ? 'tensao declarada na conversa' : null,
    assunto: sinais.resumo,
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  4. A ORQUESTRACAO
// ════════════════════════════════════════════════════════════════════════════

export async function responder(
  entrada: Entrada,
  llm: Llm,
  embedder: Embedder,
  opcoes: { memoriaLigada?: boolean; deps?: Deps } = {},
): Promise<Resposta> {
  const deps = opcoes.deps ?? (await depsPadrao())
  const historico = await deps.carregarHistorico(entrada.sessaoId)

  const { sinais, tokensEntrada: tkEntradaRoteador, tokensSaida: tkSaidaRoteador } =
    await classificar(llm, entrada, historico)

  let saida = decidirSaida(sinais)

  /**
   * A linha injetada da classificacao.
   *
   * 🔴 Uma linha no sistema, NUNCA um turno no historico. Derivado nao se
   * guarda como mensagem: reenviado como texto, vira verdade congelada e o
   * agente para de reclassificar quando a pessoa muda de assunto.
   *
   * ⚠️ Desligado por padrao. Isto e memoria entre conversas, e o toolset de
   * memoria foi removido de proposito no runtime anterior. Ligar e decisao de
   * produto.
   */
  const linhaDeContexto = opcoes.memoriaLigada
    ? `Contexto do contato: ${sinais.revelou?.regime_alvo ?? 'regime nao declarado'}` +
      `${sinais.revelou?.atividade ? `, atividade ${sinais.revelou.atividade}` : ''}` +
      `${sinais.revelou?.cidade ? `, ${sinais.revelou.cidade}` : ''}.`
    : null

  let resolucao = await resolver(llm, embedder, deps, saida, entrada, historico, linhaDeContexto)

  /**
   * 🔑 A CONSEQUENCIA DA CONSTRAINT.
   *
   * Uma pergunta puramente comercial cuja consulta de preco falhou nao pode ser
   * gravada como `comercial`: a constraint do banco recusa
   * (`comercial_exige_tecnica_ok`). E ela esta certa. Uma resposta comercial sem
   * lastro e exatamente o que vira numero inventado.
   *
   * Entao a saida CAI para `tecnico` com a falha declarada, e a pessoa ouve
   * "vou confirmar com o time" em vez de um preco de memoria.
   */
  if (saida === 'comercial' && !resolucao.ok) saida = 'tecnico'

  let texto = resolucao.texto
  let tokensEntrada = tkEntradaRoteador + resolucao.tokensEntrada
  let tokensSaida = tkSaidaRoteador + resolucao.tokensSaida

  // ── A TRAVA COMERCIAL ────────────────────────────────────────────────────
  if (saida === 'tecnico' && podeInjetarGancho(resolucao, sinais)) {
    const gancho = await ganchoComercial(llm, texto, entrada)
    tokensEntrada += gancho.tokensEntrada
    tokensSaida += gancho.tokensSaida
    // Linha em branco: duas batidas, duas mensagens no WhatsApp.
    if (gancho.texto) texto = `${texto}\n\n${gancho.texto}`
  }

  const pacote = saida === 'escalonamento'
    ? montarPacote(sinais, entrada, historico)
    : undefined

  // ── A GRAVACAO, EM DUAS TABELAS E UMA TRANSACAO ──────────────────────────
  await deps.gravarTurno(entrada.sessaoId, entrada.texto, texto, {
    saida,
    tecnicaOk: resolucao.ok,
    falhaTipo: resolucao.falhaTipo,
    cartoesUsados: resolucao.cartoesUsados,
    fatosLidos: resolucao.fatosLidos,
    tokensEntrada,
    tokensSaida,
  })

  if (opcoes.memoriaLigada && sinais.revelou) {
    await deps.atualizarClassificacao(
      entrada.contatoId,
      {
        regimeAlvo: sinais.revelou.regime_alvo,
        cidade: sinais.revelou.cidade,
        dentroEscopo: !sinais.fora_do_escopo,
        confianca: 'media',
      },
      null,
    )
  }

  return { texto, saida, pacoteEscalonamento: pacote }
}
