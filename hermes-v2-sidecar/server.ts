/**
 * ════════════════════════════════════════════════════════════════════════════
 *  server.ts  ·  a boca e o ouvido do Leo
 *
 *  Liga o `router.ts` a ponte Baileys que ja roda na VPS. E o unico arquivo do
 *  projeto que fala com o mundo externo.
 *
 *  🔴 ELE NAO ABRE PORTA NENHUMA, E ISSO NAO E DESCUIDO.
 *
 *  A ponte nao chama ninguem de volta: nao existe webhook. Quem consome faz
 *  polling em `GET /messages`, e a ponte so aceita requisicao de loopback. Um
 *  `listen()` aqui seria superficie de ataque sem nenhuma funcao.
 *
 *  🔴 E A LEITURA DA FILA E DESTRUTIVA (`splice`). Duas consequencias que mandam
 *  no desenho inteiro:
 *
 *    a favor   mensagem que chega durante a troca de cerebro FICA na fila e o
 *              proximo consumidor a recebe. E o que permite virada sem perda.
 *    contra    dois consumidores NUNCA podem rodar ao mesmo tempo: quem chegar
 *              primeiro leva a mensagem e o outro nunca a ve. Por isso o
 *              `swap.sh` para o azul ANTES de subir o verde, e nao ao contrario.
 *
 *  Uso:
 *    node --env-file=.env .build/server.js
 * ════════════════════════════════════════════════════════════════════════════
 */

import { responder } from './router.js'
import { criarLlm, criarEmbedder } from './llm/gemini.js'
import { garantirContatoESessao, pool } from './db.js'

// ════════════════════════════════════════════════════════════════════════════
//  CONFIGURACAO
// ════════════════════════════════════════════════════════════════════════════

const PONTE = process.env.PONTE_URL ?? 'http://127.0.0.1:3000'
const INTERVALO_MS = Number(process.env.POLL_MS ?? 1500)
const OCIOSIDADE_MIN = Number(process.env.SESSAO_OCIOSIDADE_MIN ?? 120)

/**
 * 🔴 Grupo fica de fora por padrao.
 *
 * O Leo e atendimento 1 a 1. Num grupo ele responderia a conversa dos outros,
 * e o `PERSONA` inteiro foi escrito para dois interlocutores. Ligar isso exige
 * decidir antes quando ele fala e quando fica quieto, que e desenho de produto,
 * nao variavel de ambiente.
 */
const RESPONDER_GRUPO = process.env.RESPONDER_GRUPO === '1'

/** Pausa entre as duas batidas, para nao chegarem coladas no aparelho. */
const PAUSA_ENTRE_BATIDAS_MS = 1200

// ════════════════════════════════════════════════════════════════════════════
//  O CONTRATO DA PONTE
//
//  Lido do `bridge.js` em 21/09, nao suposto. Campos que este arquivo usa; o
//  evento real tem mais (midia, citacao, mencoes, enquete).
// ════════════════════════════════════════════════════════════════════════════

interface EventoDaPonte {
  messageId: string
  chatId: string
  senderId: string
  senderName: string
  isGroup: boolean
  body: string
  hasMedia: boolean
  /** O que o `POST /read` espera no campo `key`. */
  readReceiptKey?: { remoteJid: string; id: string; participant: string; fromMe: boolean }
  timestamp: number
}

async function daPonte<T>(rota: string, corpo?: unknown): Promise<T> {
  const r = await fetch(`${PONTE}${rota}`, {
    method: corpo === undefined ? 'GET' : 'POST',
    headers: corpo === undefined ? {} : { 'content-type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(20_000),
  })
  if (!r.ok) {
    // 503 = ponte viva e WhatsApp desconectado. E diferente de ponte morta, e
    // quem chama precisa distinguir para nao tratar queda de rede como bug.
    throw new ErroDaPonte(r.status, `${rota} devolveu ${r.status}`)
  }
  return (await r.json()) as T
}

class ErroDaPonte extends Error {
  constructor(public readonly status: number, mensagem: string) {
    super(mensagem)
  }
  get desconectado(): boolean {
    return this.status === 503
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  SAIDA  ·  o que o `leo-formatador` e o `leo-cadencia` faziam no Hermes
// ════════════════════════════════════════════════════════════════════════════

/**
 * 🔑 Os dois plugins do runtime antigo viram funcao aqui, e de proposito.
 *
 * No Hermes eles eram camada separada, e foi justamente isso que produziu o
 * defeito de 20/09: tres camadas discordando sobre formato, com o trailer da
 * plataforma mandando escrever markdown enquanto o SOUL o proibia e o plugin
 * desfazia depois. Aqui a regra mora no prompt e a limpeza e a ultima rede,
 * nao uma segunda opiniao.
 */
function limparSaida(texto: string): string {
  return texto
    // Travessao e meia-risca: o RULES proibe, e o filtro e a rede de baixo.
    .replace(/\s*[—–]\s*/g, ', ')
    // Titulo markdown e linha de tabela nao existem no WhatsApp.
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*\|.*\|\s*$/gm, '')
    // Tres ou mais quebras viram duas: a linha em branco e o separador de batida.
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Duas batidas, duas mensagens.
 *
 * O `PERSONA` trata a linha em branco como separador: a informacao e depois o
 * convite saem como mensagens diferentes no WhatsApp. ⚠️ Teto de duas: mais que
 * isso vira metralhadora de notificacao, e o proprio PERSONA limita a resposta
 * a duas batidas.
 */
function emBatidas(texto: string): string[] {
  const partes = texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (partes.length <= 1) return partes
  return [partes[0], partes.slice(1).join('\n\n')]
}

async function enviar(chatId: string, texto: string): Promise<void> {
  const batidas = emBatidas(limparSaida(texto))
  for (const [i, batida] of batidas.entries()) {
    if (i > 0) await dormir(PAUSA_ENTRE_BATIDAS_MS)
    await daPonte('/send', { chatId, message: batida })
  }
}

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ════════════════════════════════════════════════════════════════════════════
//  O ATENDIMENTO DE UMA MENSAGEM
// ════════════════════════════════════════════════════════════════════════════

const llm = criarLlm({ cache: process.env.SEM_CACHE !== '1' })
const embedder = criarEmbedder()

/**
 * 🔴 Uma fila por chat, e nao uma global.
 *
 * Duas mensagens seguidas da mesma pessoa precisam ser atendidas em ordem, ou o
 * historico grava invertido e a segunda resposta responde a primeira pergunta.
 * Chats DIFERENTES, ao contrario, nao tem motivo para esperar um pelo outro.
 */
const filaPorChat = new Map<string, Promise<void>>()

function enfileirar(chatId: string, tarefa: () => Promise<void>): void {
  const anterior = filaPorChat.get(chatId) ?? Promise.resolve()
  const proxima = anterior.then(tarefa, tarefa).catch((erro) => {
    console.error(`[chat] falha nao tratada: ${erro instanceof Error ? erro.message : erro}`)
  })
  filaPorChat.set(chatId, proxima)
  // Limpa a entrada quando a fila daquele chat esvazia, para o Map nao crescer.
  proxima.finally(() => {
    if (filaPorChat.get(chatId) === proxima) filaPorChat.delete(chatId)
  })
}

async function atender(evento: EventoDaPonte): Promise<void> {
  const inicio = Date.now()

  // ⚠️ `chatId` contem o telefone. Nos logs vai so o final, nunca inteiro.
  const rotulo = `...${evento.chatId.slice(-8)}`

  try {
    const { contatoId, sessaoId, nova } = await garantirContatoESessao(
      evento.chatId,
      OCIOSIDADE_MIN,
    )

    // "Digitando" antes de pensar: a resposta leva segundos, e silencio nesse
    // tempo e o que faz a pessoa mandar a mensagem de novo.
    await daPonte('/typing', { chatId: evento.chatId }).catch(() => {})

    const resposta = await responder(
      { contatoId, sessaoId, texto: evento.body },
      llm,
      embedder,
    )

    await enviar(evento.chatId, resposta.texto)

    // 🔑 A confirmacao de leitura vai DEPOIS do envio, nunca antes. Marcar como
    //    lida e depois falhar deixa a pessoa vendo "visto" sem resposta, que e
    //    pior do que parecer que a mensagem nao chegou.
    if (evento.readReceiptKey) {
      await daPonte('/read', { key: evento.readReceiptKey }).catch(() => {})
    }

    console.log(
      `[${rotulo}] ${resposta.saida}${nova ? ' (sessao nova)' : ''} · ` +
      `${resposta.texto.length}c · ${Date.now() - inicio}ms`,
    )

    // 🔴 Escalonamento nao termina aqui. O pacote existe e ninguem o consome:
    //    a fila humana e a pendencia declarada do projeto. Enquanto nao houver
    //    destino, ele ao menos aparece no log, em vez de sumir.
    if (resposta.pacoteEscalonamento) {
      console.warn(`[${rotulo}] ESCALONAMENTO: ${resposta.pacoteEscalonamento.assunto}`)
    }
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro)
    console.error(`[${rotulo}] erro: ${msg}`)

    /**
     * 🔴 SILENCIO E PIOR QUE ERRO ASSUMIDO.
     *
     * Em 20/09 a producao ficou sem credito no provedor e o agente simplesmente
     * parou de responder, com a conexao de pe. Do lado do cliente isso e
     * abandono. Uma linha honesta custa nada e preserva a relacao.
     *
     * ⚠️ A mensagem NAO diz o motivo tecnico: cliente nao precisa saber de cota
     * de API, e "bastidor fica no bastidor" e regra do RULES.
     */
    await daPonte('/send', {
      chatId: evento.chatId,
      message: 'Deu um problema aqui do meu lado agora. Já estou vendo isso, me manda de novo em alguns minutos.',
    }).catch(() => {})
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  O LACO
// ════════════════════════════════════════════════════════════════════════════

let rodando = true
let lendo = false
let quedasSeguidas = 0

/**
 * 🔴 A trava de reentrancia nao e detalhe.
 *
 * `setInterval` nao espera a execucao anterior terminar. Sem a trava, uma
 * leitura lenta deixaria duas chamadas simultaneas a `GET /messages`, e como a
 * leitura e destrutiva as duas dividiriam a fila entre si: mensagens atendidas
 * fora de ordem, e o risco de duas respostas ao mesmo tempo no mesmo chat.
 */
async function tick(): Promise<void> {
  if (!rodando || lendo) return
  lendo = true
  try {
    const eventos = await daPonte<EventoDaPonte[]>('/messages')
    quedasSeguidas = 0

    for (const evento of eventos) {
      if (evento.isGroup && !RESPONDER_GRUPO) continue
      if (!evento.body?.trim()) continue   // midia pura, sem legenda
      enfileirar(evento.chatId, () => atender(evento))
    }
  } catch (erro) {
    quedasSeguidas++
    const daPonteErro = erro instanceof ErroDaPonte
    // Ruido controlado: avisa na primeira e depois a cada vinte tentativas.
    if (quedasSeguidas === 1 || quedasSeguidas % 20 === 0) {
      const motivo = daPonteErro && erro.desconectado
        ? 'ponte viva, WhatsApp desconectado'
        : erro instanceof Error ? erro.message : String(erro)
      console.error(`[ponte] ${motivo} (tentativa ${quedasSeguidas})`)
    }
  } finally {
    lendo = false
  }
}

/**
 * Encerramento limpo.
 *
 * 🔑 Para de LER antes de morrer, e espera quem ja estava sendo atendido. E o
 * que torna a virada do `swap.sh` sem perda: o que ficou na fila da ponte
 * continua la, em memoria, esperando o proximo consumidor.
 *
 * ⚠️ A unidade systemd usa `KillMode=mixed`, entao o SIGTERM chega aqui e o
 * prazo e o `TimeoutStopSec`. Demorar mais que isso vira SIGKILL no meio de uma
 * resposta.
 */
async function encerrar(sinal: string): Promise<void> {
  if (!rodando) return
  rodando = false
  console.log(`[${sinal}] parando de ler a fila, terminando o que esta em andamento...`)
  await Promise.allSettled([...filaPorChat.values()])
  await pool.end().catch(() => {})
  console.log('[fim] encerrado sem deixar resposta pela metade')
  process.exit(0)
}

async function principal(): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao definida')
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY nao definida')

  // Falha de cobranca ou de modelo aparece AQUI, na subida, e nao na primeira
  // mensagem de um cliente real.
  const { verificarAcesso } = await import('./llm/gemini.js')
  await verificarAcesso()

  const saude = await daPonte<{ status: string; queueLength: number }>('/health')
  console.log(
    `[inicio] ponte ${PONTE} · status ${saude.status} · fila ${saude.queueLength} · ` +
    `polling a cada ${INTERVALO_MS}ms`,
  )
  if (saude.status !== 'connected') {
    console.warn('[inicio] ⚠️ a ponte nao esta conectada ao WhatsApp. Subindo assim mesmo: ela reconecta sozinha.')
  }

  process.on('SIGTERM', () => void encerrar('SIGTERM'))
  process.on('SIGINT', () => void encerrar('SIGINT'))

  setInterval(() => void tick(), INTERVALO_MS)
}

principal().catch((e) => {
  console.error('\n🔴', e instanceof Error ? e.message : e)
  process.exit(1)
})
