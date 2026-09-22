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
 *    node --env-file=.env .build/testes/e2e.js --arquivo <caminho.yaml>
 *
 *  🔑 CHECAGEM POR TURNO. Um turno pode ser uma string, e ai so alimenta a
 *  sessao, ou um objeto `{ diz, rota, deve, nao_deve }`, e ai a resposta DELE
 *  e checada sozinha: globais, `faltou`, `proibido` e a trilha escolhida. E o
 *  que torna util um caso de dez turnos, onde antes so o ultimo era medido.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
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
import { escreverRelatorio } from './relatorio.js'

// ⚠️ RAIZ vem do modulo que sobe a arvore ate achar o arquivo de cartoes. Nao
//    e `join(AQUI, '..')` porque, rodando de `.build/testes/`, isso aponta para
//    dentro do proprio `.build`, onde `_origem/` nao existe. Ja quebrou o
//    verificador do mesmo jeito.
import { RAIZ } from '../seed/carregar-conhecimento.js'
const CASOS_PADRAO = join(RAIZ, '_origem', 'vault-v12', '_testes', 'casos.yaml')
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
  // ['travessao', /[—–]/], // Removido: server.ts já filtra antes de enviar
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

/**
 * Um turno com checagem propria.
 *
 * 🔑 POR QUE ISTO EXISTE. Ate 21/09 um caso era `turnos: string[]` e so a
 * ULTIMA resposta era checada. Num caso de 10 turnos isso validava o turno 10
 * e deixava os outros nove passarem sem ninguem olhar, que e o oposto do que
 * uma conversa longa deveria provar.
 *
 * ⚠️ RETROCOMPATIVEL DE PROPOSITO. Turno que continua sendo `string` se
 * comporta exatamente como antes: entra na sessao e nao e checado sozinho. O
 * `casos.yaml` do v12 roda sem uma linha de edicao, e o placar dele nao muda.
 */
interface Turno {
  /** A mensagem do cliente. */
  diz: string
  /** A trilha esperada para ESTE turno. Sem isto, a rota nao e checada. */
  rota?: Saida
  /** Regex que a resposta DESTE turno precisa conter. */
  deve?: string[]
  /** Regex que a resposta DESTE turno nao pode conter. */
  nao_deve?: string[]
  /** Criterio de leitura humana. Nao e checado. */
  avaliar?: string
}

interface Caso {
  id: string
  turnos: (string | Turno)[]
  deve?: string[]
  nao_deve?: string[]
  min_chars?: number
  max_chars?: number
  avaliar?: string
  descricao?: string
}

const textoDoTurno = (t: string | Turno): string => (typeof t === 'string' ? t : t.diz)
const temChecagemPropria = (t: string | Turno): t is Turno => typeof t !== 'string'

function carregarCasos(arquivo: string): Caso[] {
  const doc = yaml.load(readFileSync(arquivo, 'utf8')) as { casos: Caso[] }
  if (!doc?.casos) throw new Error(`${arquivo} nao tem a chave \`casos\``)
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

  /**
   * 🔑 OS NOMES DAS TOOLS CHAMADAS, e nao o efeito delas.
   *
   * 🔴 `cartoes` e `fatos` sao EFEITO. Tool que roda e volta vazia nao aparece
   * em nenhum dos dois, entao ate 22/09 "chamou e voltou vazio" era lido como
   * "nao chamou" — a mesma armadilha que o cabecalho do `provar-busca.mjs`
   * descreve, morando dentro do medidor. Com este campo os dois casos se
   * separam, e a pergunta "a tool e oferecida, e e chamada?" passa a ter
   * resposta.
   */
  chamadas: string[]

  /**
   * O que o filtro de enderecos trocou ou removeu neste turno.
   *
   * 🔑 O filtro roda DENTRO do `responder()`, entao o E2E o exercita sem
   * arranjo especial. Quando ele morava no `server.ts` a suite passava ao
   * largo dele e mediria o texto cru do modelo, relatando zero correcoes
   * enquanto producao corrigia.
   */
  correcoes: { acao: string; antes: string; depois: string | null }[]

  /**
   * Os ids que o LASTRO AUTOMATICO entregou. Vazio quando a mensagem era curta
   * demais para vetorizar ("ok", "Oi") ou quando a base nao devolveu nada.
   */
  lastro: string[]

  tokensEntrada: number
  tokensSaida: number

  /**
   * 🔑 O TEXTO DE CADA TURNO, e nao so o do ultimo.
   *
   * Ate 21/09 o JSON guardava apenas `resultado.resposta`, que e a resposta do
   * ULTIMO turno. Num caso de dez turnos isso deixava nove respostas sem
   * registro: dava para saber QUE regex falhou, nunca para LER o que o agente
   * escreveu. Qualidade de texto so se audita lendo, e o relatorio da rodada 3
   * nao conseguiu citar a resposta de fidelidade justamente por isso.
   *
   * ⚠️ Estes dois campos guardam conversa integral. O JSON de saida ja vive em
   * `_testes-saida/`, que esta fora do git pela mesma razao.
   */
  pergunta: string
  resposta: string
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
function depsDeTeste(
  medicoes: Medicao[],
  executarTool: Deps['executarTool'],
  conferirEnderecos: Deps['conferirEnderecos'],
  buscarLastro: Deps['buscarLastro'],
): Deps {
  const historico: { papel: 'cliente' | 'leo'; texto: string }[] = []
  return {
    async carregarHistorico() { return [...historico] },
    async gravarTurno(_s, textoCliente, textoLeo, m) {
      historico.push({ papel: 'cliente', texto: textoCliente })
      historico.push({ papel: 'leo', texto: textoLeo })
      medicoes.push({
        pergunta: textoCliente,
        resposta: textoLeo,
        saida: m.saida,
        tecnicaOk: m.tecnicaOk,
        falhaTipo: m.falhaTipo,
        cartoes: m.cartoesUsados,
        fatos: m.fatosLidos,
        chamadas: m.toolsChamadas,
        correcoes: m.correcoesDeEndereco ?? [],
        lastro: m.lastroInjetado ?? [],
        tokensEntrada: m.tokensEntrada,
        tokensSaida: m.tokensSaida,
      })
    },
    async atualizarClassificacao() {},
    executarTool,
    conferirEnderecos,
    buscarLastro,
  }
}

/** O runner legado usa 8 linhas como teto duro de resposta. */
const LIMITE_LINHAS = 8

/**
 * 🔴 OS TRES LINKS OFICIAIS SAEM DO TEXTO ANTES DA CHECAGEM DE LINK INVENTADO.
 *
 * Isto estava no `rodar_testes.py` do v12 e a minha porta inicial esqueceu.
 * Consequencia medida: a checagem `link ou e-mail` pega qualquer dominio solto,
 * entao o agente que escrevia a URL CERTA era reprovado por link inventado, e
 * tres casos do `casos.yaml` que EXIGEM o link ficavam impossiveis de passar.
 *
 * ⚠️ O Instagram sai primeiro de proposito: o handle no caminho da URL
 * (`legalizai.app`) dispararia a regra de dominio solto, que foi exatamente o
 * mesmo bug que o filtro de saida do runtime antigo teve.
 */
function semLinksOficiais(resposta: string): string {
  return resposta
    .replace(/(https?:\/\/)?(www\.)?instagram\.com\/legalizai\.app\/?/gi, '')
    .replace(/(https?:\/\/)?(www\.)?legalizai\.com\.br(\/em-breve)?\/?(?![\w/-])/gi, '')
}

/** As checagens que valem para QUALQUER resposta, venha de que turno vier. */
function checagensGlobais(resposta: string): string[] {
  const falhas: string[] = []

  const semOficiais = semLinksOficiais(resposta)
  for (const [nome, re] of CHECAGENS_GLOBAIS) {
    const alvo = nome === 'link ou e-mail' ? semOficiais : resposta
    if (re.test(alvo)) falhas.push(`global:${nome}`)
  }

  // Tambem do runner legado, e tambem esquecidas na primeira porta.
  if (!resposta.trim()) falhas.push('global:vazia')
  const linhas = resposta.split('\n').filter((l) => l.trim()).length
  if (linhas > LIMITE_LINHAS) falhas.push(`global:longa (${linhas} linhas)`)
  return falhas
}

/** `deve` e `nao_deve`, que valem igual para um turno e para o caso inteiro. */
function checagensDeTexto(resposta: string, deve?: string[], naoDeve?: string[]): string[] {
  const falhas: string[] = []
  for (const padrao of deve ?? []) {
    if (!new RegExp(padrao, 'i').test(resposta)) falhas.push(`faltou:/${padrao}/`)
  }
  for (const padrao of naoDeve ?? []) {
    if (new RegExp(padrao, 'i').test(resposta)) falhas.push(`proibido:/${padrao}/`)
  }
  return falhas
}

/**
 * As checagens do CASO, sobre a ultima resposta.
 *
 * ⚠️ `globaisJaRodaram` existe para nao contar a mesma falha duas vezes. Se o
 * ultimo turno tem checagem propria, as globais ja rodaram sobre ele no laco,
 * e repetir aqui produziria `global:longa` duplicado no relatorio.
 */
function checar(caso: Caso, resposta: string, globaisJaRodaram: boolean): string[] {
  const falhas: string[] = []
  if (!globaisJaRodaram) falhas.push(...checagensGlobais(resposta))
  falhas.push(...checagensDeTexto(resposta, caso.deve, caso.nao_deve))
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
  conferirEnderecos: Deps['conferirEnderecos'],
  buscarLastro: Deps['buscarLastro'],
): Promise<Resultado> {
  const inicio = Date.now()
  const medicoes: Medicao[] = []
  const deps = depsDeTeste(medicoes, executarTool, conferirEnderecos, buscarLastro)


  // Sessao nova por caso. Os turnos de um mesmo caso compartilham a sessao,
  // porque varios casos do v12 existem justamente para medir o que o agente faz
  // no SEGUNDO turno ("ai vc mentiu").
  const contatoId = randomUUID()
  const sessaoId = randomUUID()

  let ultima = ''
  const falhasDeTurno: string[] = []
  try {
    let n = 0
    for (const turno of caso.turnos) {
      n += 1
      const r = await responder(
        { contatoId, sessaoId, texto: textoDoTurno(turno) }, llm, embedder, { deps },
      )
      ultima = r.texto

      // Turno sem checagem propria continua so alimentando a sessao, como antes.
      if (!temChecagemPropria(turno)) continue

      const marca = `t${n}`
      for (const f of checagensGlobais(r.texto)) falhasDeTurno.push(`${marca} ${f}`)
      for (const f of checagensDeTexto(r.texto, turno.deve, turno.nao_deve)) {
        falhasDeTurno.push(`${marca} ${f}`)
      }

      // 🔑 A ROTA E A MEDICAO QUE SEPARA "respondeu mal" DE "respondeu mal
      //    PORQUE foi pela trilha errada". A medicao do turno acabou de ser
      //    empilhada por `gravarTurno`, entao e sempre a ultima.
      const medicao = medicoes[medicoes.length - 1]
      if (turno.rota && medicao && medicao.saida !== turno.rota) {
        falhasDeTurno.push(`${marca} rota:esperava ${turno.rota}, veio ${medicao.saida}`)
      }
    }
  } catch (erro) {
    return {
      id: caso.id,
      passou: false,
      // 🔴 Erro de provedor NAO vira caso reprovado disfarcado. O runner legado
      //    pontuava a mensagem de erro como se fosse resposta do Leo, e placar
      //    ruim por 429 parecia regressao de qualidade.
      falhas: [
        ...falhasDeTurno,
        `ERRO DE EXECUCAO: ${erro instanceof Error ? erro.message : String(erro)}`,
      ],
      resposta: '',
      chars: 0,
      ms: Date.now() - inicio,
      medicoes,
      avaliar: caso.avaliar,
    }
  }

  const ultimoTurno = caso.turnos[caso.turnos.length - 1]
  const falhas = [
    ...falhasDeTurno,
    ...checar(caso, ultima, temChecagemPropria(ultimoTurno)),
  ]
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

  // ⚠️ `--arquivo` DESLIGA o filtro da suite `curta`. A suite nomeia ids que so
  //    existem no `casos.yaml`; aplica-la a outro arquivo nao filtraria nada,
  //    zeraria a selecao e a rodada morreria em "nenhum caso selecionado".
  const iArquivo = argv.indexOf('--arquivo')
  const arquivoProprio = iArquivo >= 0
  if (arquivoProprio && !argv[iArquivo + 1]) throw new Error('--arquivo exige um caminho')
  const arquivoCasos = arquivoProprio ? resolve(argv[iArquivo + 1]) : CASOS_PADRAO

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao definida (use --env-file=.env)')
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY nao definida')

  // Falha de cobranca aparece antes do primeiro caso, nao no meio da rodada.
  const { verificarAcesso } = await import('../llm/gemini.js')
  await verificarAcesso()

  const todosOsCasos = carregarCasos(arquivoCasos)
  let casos = todosOsCasos

  if (escolhidos.length > 0) {
    casos = todosOsCasos.filter((c) => escolhidos.includes(c.id))
  } else if (!todos && !arquivoProprio) {
    const daSuite = carregarSuite('curta')
    if (daSuite) casos = todosOsCasos.filter((c) => daSuite.includes(c.id))
  }

  if (casos.length === 0) throw new Error('nenhum caso selecionado')

  // ⚠️ O aviso existe porque a suite `acervo` (60 casos) e para conferencia
  //    anual, nao para rodada de trabalho: 44 dos 51 casos antigos passaram 9 de
  //    9 rodadas, ou seja, custam e nao discriminam.
  const turnosTotais = casos.reduce((a, c) => a + c.turnos.length, 0)
  console.log(
    `rodando ${casos.length} caso(s), ${turnosTotais} turno(s)` +
    `${arquivoProprio ? ` de ${basename(arquivoCasos)}` : ''}` +
    `${todos ? ' (ACERVO INTEIRO, caro)' : ''}\n`,
  )

  // 🔑 O envelope conta na BORDA DO PROVEDOR: o roteador so enxerga as chamadas
  //    que passam por ele, e as de embedding ficariam de fora.
  const consumo = novoConsumo()
  const llm = contarLlm(criarLlm({ cache: process.env.SEM_CACHE !== '1' }), consumo)
  const embedder = contarEmbedder(criarEmbedder(), consumo)
  const { executarTool, montarLastro } = await import('../tools.js')

  // 🔑 A MESMA conferencia de producao, com a MESMA tabela. Nao e um duble:
  //    `fatos.link` e lido do banco de verdade, como toda tool nesta suite.
  const { linksParaFiltro } = await import('../db.js')
  const { corrigirEnderecos } = await import('../filtro-enderecos.js')
  const linksOficiais = await linksParaFiltro()
  const conferirEnderecos: Deps['conferirEnderecos'] = async (texto) =>
    linksOficiais.length ? corrigirEnderecos(texto, linksOficiais) : { texto, correcoes: [] }

  const resultados: Resultado[] = []
  for (const caso of casos) {
    const r = await rodarCaso(caso, llm, embedder, executarTool, conferirEnderecos, montarLastro)
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

  // 🔴 UM carimbo para os dois arquivos, com SEGUNDOS e o nome da suite. O JSON
  //    usava so a data e o markdown so o minuto, entao duas suites seguidas
  //    sobrescreviam uma a outra. Aconteceu em 21/09 e custou a rodada 1 da
  //    maratona, que ficou so no console.
  const quando = new Date().toISOString()
  const nomeDaSuite = arquivoProprio
    ? basename(arquivoCasos, '.yaml')
    : todos ? 'acervo' : escolhidos.length > 0 ? 'avulsa' : 'curta'
  const carimbo = quando.slice(0, 19).replace('T', '-').replace(/:/g, '')

  const dir = join(RAIZ, '_testes-saida')
  mkdirSync(dir, { recursive: true })
  const arquivo = join(dir, `e2e-${carimbo}-${nomeDaSuite}.json`)
  writeFileSync(
    arquivo,
    JSON.stringify(
      {
        quando,
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
  console.log(`\nJSON: ${arquivo}`)

  // 🔑 O markdown e o que alguem LE para decidir; o JSON e para maquina
  //    reprocessar. Os dois saem da mesma rodada, sempre, porque relatorio que
  //    depende de alguem lembrar de gerar e relatorio que nao existe.
  const md = escreverRelatorio({
    quando,
    placar: `${passaram}/${resultados.length}`,
    consumo,
    custo: calcularCusto(consumo, cambio),
    cambio,
    preco: PRECO,
    modelo: PRECO.modelo,
    suite: nomeDaSuite,
    resultados,
  }, `-${nomeDaSuite}`)
  console.log(`relatorio: ${md}`)

  const { pool } = await import('../db.js')
  await pool.end()
  process.exit(passaram === resultados.length ? 0 : 1)
}

principal().catch((e) => {
  console.error('\n', e)
  process.exit(1)
})
