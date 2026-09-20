/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/e2e.ts  ·  os casos do vault v12 rodando no roteador novo
 *
 *  Le `_origem/vault-v12/_testes/casos.yaml` (60 casos, cada um vindo de uma
 *  falha real de WhatsApp), instancia o Gemini com o `router.ts` e confere.
 *
 *  🔴 ELE NAO E O `db.test.ts` NEM O `router.test.ts`, E ISSO IMPORTA.
 *
 *    router.test.ts  offline, deterministico, LLM de mentira. Prova MECANISMO.
 *    db.test.ts      banco, deterministico, zero LLM.       Prova MATEMATICA.
 *    e2e.ts          rede, NAO deterministico, custa.       Prova COMPORTAMENTO.
 *
 *  Os dois primeiros sao regressao: verde e verde, vermelho e bug. Este aqui
 *  NAO e. O placar dele tem ruido medido de ate 3 pontos (amplitude 3, sigma
 *  1,07 em nove rodadas do mesmo pacote no runner legado), entao diferenca
 *  pequena entre rodadas nao e sinal, e tratar como sinal produz a rodada
 *  infinita de "melhorar o prompt" atras de flutuacao.
 *
 *  ⚠️ CUSTA DINHEIRO E CHAMA REDE. Por regra do projeto, suite assim so roda
 *  quando pedida. Este arquivo nao e chamado por `node --test`: e um script.
 *
 *    node --env-file=.env .build/testes/e2e.js              # a suite curta
 *    node --env-file=.env .build/testes/e2e.js --todos      # os 60 casos
 *    node --env-file=.env .build/testes/e2e.js --caso valores --caso giria-cole
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import yaml from 'js-yaml'

import { responder, type Deps } from '../router.js'
import { criarLlm } from '../llm/gemini.js'
import { criarEmbedder } from '../llm/gemini.js'
import type { Embedder, FalhaTipo, Llm, Saida } from '../tipos.js'
import {
  novoConsumo, contarLlm, contarEmbedder, buscarCambio, imprimirCusto,
  calcularCusto, PRECO,
} from './contador.js'

// ⚠️ RAIZ vem do modulo que sobe a arvore ate achar o arquivo de cartoes. Nao
//    e `join(AQUI, '..')` porque, rodando de `.build/testes/`, isso aponta para
//    dentro do proprio `.build`, onde `_origem/` nao existe. Ja quebrou o
//    verificador do mesmo jeito.
import { RAIZ } from '../seed/carregar-conhecimento.js'
const CASOS = join(RAIZ, '_origem', 'vault-v12', '_testes', 'casos.yaml')
const SUITES = join(RAIZ, '_origem', 'vault-v12', '_testes', 'suites.yaml')

// ════════════════════════════════════════════════════════════════════════════
//  1. AS CHECAGENS GLOBAIS
//
//  Portadas do `rodar_testes.py` do v12, uma a uma. Cada linha e uma falha que
//  ja aconteceu em producao, e o comentario diz qual. Portar e nao remontar: a
//  lista existe porque alguem pagou por cada item dela.
// ════════════════════════════════════════════════════════════════════════════

const CHECAGENS_GLOBAIS: [string, RegExp][] = [
  ['tabela', /^\s*\|.*\|\s*$/m],
  ['titulo markdown', /^\s*#{1,6}\s/m],
  ['citacao em bloco', /^\s*>\s/m],
  ['latex', /\\\[|\\\(|\\frac|\$\$/],
  ['travessao', /[—–]/],
  ['link ou e-mail', /https?:\/\/|www\.|\b[\w.+-]+@[\w-]+\.[a-z]{2,}|\b[\w-]+\.(com|app)(\.br)?\b/i],
  // 18/09: o Leo respondeu "I speak only in Brazilian Portuguese, but I can help
  // you..." e passou na checagem antiga, que so via formula de cortesia.
  ['ingles', /\b(if you|let me know|feel free|just|please|thanks|i can|i speak|you can|your|the|we can|our)\b/i],
  ['portugues de portugal', /\b(ficheiro|telem[oó]vel|utilizador|registar|contacto)\b/i],
  ['vazamento tecnico', /invalid tool call|auto-repaired|^\s*\{\s*"|skill_view|buscar_cartao|consultar_preco|\[ERRO /im],
  ['frase proibida', /em que posso ajudar|o l[eé]o vai|incondicional|sem letra mi[uú]da/i],
  // 18/09: cobrar postura do cliente e falha grave de personagem, mesmo em tom leve.
  ['impaciencia', /testar minha paci[eê]ncia|chega de provoca|me tirar do s[eé]rio|falando sozinho|bora focar|vamos voltar pro que interessa/i],
  // 18/09: prometeu "um minuto que eu ja te mando" e nunca voltou. Ele nao fala
  // fora do turno, entao toda promessa de envio futuro morre no vazio.
  ['promete enviar depois', /(j[aá]|logo|daqui a pouco|um minuto|um instante)[^.!?]{0,30}(te )?(mando|envio)|vou (te )?(mandar|enviar|passar)[^.!?]{0,25}(dados|informa|contrato|documento|comprovante|cnpj e|crc)/i],
  // Negar fidelidade e o erro mais caro da venda: a pessoa fecha e descobre no contrato.
  ['nega fidelidade', /(n[aã]o (temos|tem|h[aá])|sem) (fidelidade|multa de cancelamento|multa por cancel)/i],
  // A casa nao faz regularizacao de passivo: escalar pode, prometer o servico nao.
  ['promete regularizacao', /(resolv\w+|cuid\w+|limp\w+)[^.!?]{0,40}(esse |o teu |o seu |teu |seu )?passivo|regulariz\w+ (isso|essa empresa|pra voc[eê])/i],
]

// ════════════════════════════════════════════════════════════════════════════
//  2. OS CASOS
// ════════════════════════════════════════════════════════════════════════════

interface Caso {
  id: string
  turnos: string[]
  deve?: string[]
  nao_deve?: string[]
  min_chars?: number
  max_chars?: number
  avaliar?: string
}

function carregarCasos(): Caso[] {
  const doc = yaml.load(readFileSync(CASOS, 'utf8')) as { casos: Caso[] }
  return doc.casos
}

function carregarSuite(nome: string): string[] | null {
  const doc = yaml.load(readFileSync(SUITES, 'utf8')) as {
    suites: Record<string, { casos?: string[] }>
  }
  return doc.suites?.[nome]?.casos ?? null
}

// ════════════════════════════════════════════════════════════════════════════
//  3. O QUE SE MEDE ALEM DO TEXTO
//
//  🔑 O runner legado so via a resposta. Este ve tambem a DECISAO, porque o
//  roteador novo tem decisao: qual saida, se a tecnica fechou, que tools
//  rodaram. Quando um caso falha, isso e a diferenca entre "a resposta saiu
//  ruim" e "a resposta saiu ruim PORQUE a rota foi a errada".
// ════════════════════════════════════════════════════════════════════════════

interface Medicao {
  saida: Saida
  tecnicaOk: boolean
  falhaTipo: FalhaTipo | null
  cartoes: string[]
  fatos: string[]
  tokensEntrada: number
  tokensSaida: number
}

interface Resultado {
  id: string
  passou: boolean
  falhas: string[]
  resposta: string
  chars: number
  ms: number
  medicoes: Medicao[]
  avaliar?: string
}

/**
 * Deps em memoria.
 *
 * ⚠️ De proposito NAO grava em `conversa.mensagem`: rodada de teste nao suja o
 * historico de producao, e o E2E precisa de sessao limpa a cada caso. O que ele
 * perde em realismo, ganha em poder repetir. As tools continuam batendo no
 * banco de verdade, que e o que este teste existe para exercitar.
 */
function depsDeTeste(medicoes: Medicao[], executarTool: Deps['executarTool']): Deps {
  const historico: { papel: 'cliente' | 'leo'; texto: string }[] = []
  return {
    async carregarHistorico() { return [...historico] },
    async gravarTurno(_s, textoCliente, textoLeo, m) {
      historico.push({ papel: 'cliente', texto: textoCliente })
      historico.push({ papel: 'leo', texto: textoLeo })
      medicoes.push({
        saida: m.saida,
        tecnicaOk: m.tecnicaOk,
        falhaTipo: m.falhaTipo,
        cartoes: m.cartoesUsados,
        fatos: m.fatosLidos,
        tokensEntrada: m.tokensEntrada,
        tokensSaida: m.tokensSaida,
      })
    },
    async atualizarClassificacao() {},
    executarTool,
  }
}

function checar(caso: Caso, resposta: string): string[] {
  const falhas: string[] = []

  for (const [nome, re] of CHECAGENS_GLOBAIS) {
    if (re.test(resposta)) falhas.push(`global:${nome}`)
  }
  for (const padrao of caso.deve ?? []) {
    if (!new RegExp(padrao, 'i').test(resposta)) falhas.push(`faltou:/${padrao}/`)
  }
  for (const padrao of caso.nao_deve ?? []) {
    if (new RegExp(padrao, 'i').test(resposta)) falhas.push(`proibido:/${padrao}/`)
  }
  if (caso.max_chars && resposta.length > caso.max_chars) {
    falhas.push(`longo demais: ${resposta.length} > ${caso.max_chars}`)
  }
  if (caso.min_chars && resposta.length < caso.min_chars) {
    falhas.push(`curto demais: ${resposta.length} < ${caso.min_chars}`)
  }
  return falhas
}

// ════════════════════════════════════════════════════════════════════════════
//  4. A RODADA
// ════════════════════════════════════════════════════════════════════════════

async function rodarCaso(
  caso: Caso,
  llm: Llm,
  embedder: Embedder,
  executarTool: Deps['executarTool'],
): Promise<Resultado> {
  const inicio = Date.now()
  const medicoes: Medicao[] = []
  const deps = depsDeTeste(medicoes, executarTool)


  // Sessao nova por caso. Os turnos de um mesmo caso compartilham a sessao,
  // porque varios casos do v12 existem justamente para medir o que o agente faz
  // no SEGUNDO turno ("ai vc mentiu").
  const contatoId = randomUUID()
  const sessaoId = randomUUID()

  let ultima = ''
  try {
    for (const turno of caso.turnos) {
      const r = await responder({ contatoId, sessaoId, texto: turno }, llm, embedder, { deps })
      ultima = r.texto
    }
  } catch (erro) {
    return {
      id: caso.id,
      passou: false,
      // 🔴 Erro de provedor NAO vira caso reprovado disfarcado. O runner legado
      //    pontuava a mensagem de erro como se fosse resposta do Leo, e placar
      //    ruim por 429 parecia regressao de qualidade.
      falhas: [`ERRO DE EXECUCAO: ${erro instanceof Error ? erro.message : String(erro)}`],
      resposta: '',
      chars: 0,
      ms: Date.now() - inicio,
      medicoes,
      avaliar: caso.avaliar,
    }
  }

  const falhas = checar(caso, ultima)
  return {
    id: caso.id,
    passou: falhas.length === 0,
    falhas,
    resposta: ultima,
    chars: ultima.length,
    ms: Date.now() - inicio,
    medicoes,
    avaliar: caso.avaliar,
  }
}

function coeficienteDeVariacao(tamanhos: number[]): number {
  if (tamanhos.length < 2) return 0
  const media = tamanhos.reduce((a, b) => a + b, 0) / tamanhos.length
  if (media === 0) return 0
  const variancia = tamanhos.reduce((a, b) => a + (b - media) ** 2, 0) / tamanhos.length
  return Math.sqrt(variancia) / media
}

async function principal(): Promise<void> {
  const argv = process.argv.slice(2)
  const todos = argv.includes('--todos')
  const escolhidos = argv.flatMap((a, i) => (a === '--caso' ? [argv[i + 1]] : []))

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao definida (use --env-file=.env)')
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY nao definida')

  // Falha de cobranca aparece antes do primeiro caso, nao no meio da rodada.
  const { verificarAcesso } = await import('../llm/gemini.js')
  await verificarAcesso()

  const todosOsCasos = carregarCasos()
  let casos = todosOsCasos

  if (escolhidos.length > 0) {
    casos = todosOsCasos.filter((c) => escolhidos.includes(c.id))
  } else if (!todos) {
    const daSuite = carregarSuite('curta')
    if (daSuite) casos = todosOsCasos.filter((c) => daSuite.includes(c.id))
  }

  if (casos.length === 0) throw new Error('nenhum caso selecionado')

  // ⚠️ O aviso existe porque a suite `acervo` (60 casos) e para conferencia
  //    anual, nao para rodada de trabalho: 44 dos 51 casos antigos passaram 9 de
  //    9 rodadas, ou seja, custam e nao discriminam.
  console.log(`rodando ${casos.length} caso(s)${todos ? ' (ACERVO INTEIRO, caro)' : ''}\n`)

  // 🔑 O envelope conta na BORDA DO PROVEDOR: o roteador so enxerga as chamadas
  //    que passam por ele, e as de embedding ficariam de fora.
  const consumo = novoConsumo()
  const llm = contarLlm(criarLlm(), consumo)
  const embedder = contarEmbedder(criarEmbedder(), consumo)
  const { executarTool } = await import('../tools.js')

  const resultados: Resultado[] = []
  for (const caso of casos) {
    const r = await rodarCaso(caso, llm, embedder, executarTool)
    resultados.push(r)
    const marca = r.passou ? '✔' : '✖'
    const rota = r.medicoes.map((m) => m.saida).join('>') || '?'
    console.log(`${marca} ${r.id.padEnd(26)} ${String(r.chars).padStart(4)}c  ${rota}`)
    for (const f of r.falhas) console.log(`    ${f}`)
  }

  // ── O relatorio ───────────────────────────────────────────────────────────
  const passaram = resultados.filter((r) => r.passou).length
  const cv = coeficienteDeVariacao(resultados.map((r) => r.chars).filter((c) => c > 0))

  console.log(`\nplacar: ${passaram}/${resultados.length}`)
  console.log(`coeficiente de variacao do tamanho: ${cv.toFixed(2)} (alvo 0.45)`)

  // ⚠️ O que o ROTEADOR reportou, que e sempre menor que o que o envelope viu:
  //    ele nao enxerga as chamadas de embedding. A diferenca aparece de
  //    proposito, porque e ela que mostra o custo que uma medicao interna
  //    esconderia.
  const tokensPeloRoteador = resultados
    .flatMap((r) => r.medicoes)
    .reduce((a, m) => a + m.tokensEntrada + m.tokensSaida, 0)
  console.log(`tokens vistos pelo roteador: ${tokensPeloRoteador.toLocaleString('pt-BR')}`)

  // 🔴 O aviso que impede a leitura errada do placar.
  console.log(
    '\n⚠️ Placar de E2E tem ruido medido de ate 3 pontos (sigma 1,07 em nove rodadas\n' +
    '   do mesmo pacote). Diferenca pequena entre rodadas NAO e sinal. O que vale\n' +
    '   olhar e a coluna de rota e o caso que falha sempre.',
  )

  // Por rota, que e o que o runner legado nao tinha.
  const porSaida = resultados.flatMap((r) => r.medicoes).reduce<Record<string, number>>(
    (a, m) => ({ ...a, [m.saida]: (a[m.saida] ?? 0) + 1 }), {},
  )
  console.log(`rotas: ${JSON.stringify(porSaida)}`)

  const semLastro = resultados.flatMap((r) => r.medicoes).filter((m) => !m.tecnicaOk).length
  if (semLastro > 0) console.log(`turnos sem lastro tecnico: ${semLastro}`)

  // ── O CUSTO ───────────────────────────────────────────────────────────────
  const cambio = await buscarCambio()
  imprimirCusto(consumo, cambio, resultados.length)

  const dir = join(RAIZ, '_testes-saida')
  mkdirSync(dir, { recursive: true })
  const arquivo = join(dir, `e2e-${new Date().toISOString().slice(0, 10)}.json`)
  writeFileSync(
    arquivo,
    JSON.stringify(
      {
        quando: new Date().toISOString(),
        placar: `${passaram}/${resultados.length}`,
        consumo,
        custo: calcularCusto(consumo, cambio),
        cambio,
        preco: PRECO,
        resultados,
      },
      null,
      2,
    ),
  )
  console.log(`\nrelatorio: ${arquivo}`)

  const { pool } = await import('../db.js')
  await pool.end()
  process.exit(passaram === resultados.length ? 0 : 1)
}

principal().catch((e) => {
  console.error('\n', e)
  process.exit(1)
})
