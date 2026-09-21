/**
 * ════════════════════════════════════════════════════════════════════════════
 *  scripts/ponte-falsa.mjs  ·  a ponte Baileys, de mentira
 *
 *  Fala o mesmo contrato da ponte real (`GET /messages`, `POST /send`,
 *  `/typing`, `/read`, `GET /health`), lido do `bridge.js` em 21/09.
 *
 *  🔴 EXISTE POR UM MOTIVO DE SEGURANCA, NAO DE CONVENIENCIA.
 *
 *  A fila da ponte real e de leitura DESTRUTIVA. Apontar o `server.ts` para a
 *  producao "so para testar" ROUBA mensagens de clientes de verdade: elas somem
 *  da fila e o cerebro em producao nunca as ve. Nao existe teste inofensivo
 *  contra aquela porta.
 *
 *  Uso:
 *    node scripts/ponte-falsa.mjs 3999 "quanto custa abrir empresa?"
 * ════════════════════════════════════════════════════════════════════════════
 */
import { createServer } from 'node:http'

const porta = Number(process.argv[2] ?? 3999)
const textos = process.argv.slice(3)

const fila = textos.map((body, i) => ({
  messageId: `falso-${i}`,
  chatId: '5531999999999@s.whatsapp.net',
  senderId: '5531999999999@s.whatsapp.net',
  senderName: 'Teste',
  chatName: 'Teste',
  isGroup: false,
  body,
  hasMedia: false,
  readReceiptKey: {
    remoteJid: '5531999999999@s.whatsapp.net',
    id: `falso-${i}`,
    participant: '5531999999999@s.whatsapp.net',
    fromMe: false,
  },
  timestamp: Math.floor(Date.now() / 1000),
}))

const enviadas = []

createServer((req, res) => {
  const responder = (obj) => {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(obj))
  }

  if (req.url === '/health') {
    return responder({ status: 'connected', queueLength: fila.length, uptime: 1 })
  }

  if (req.url === '/messages') {
    // 🔑 `splice`, igual a real: leitura destrutiva. Se o laco do server tiver
    //    bug de reentrancia, ele aparece AQUI e nao em producao.
    const lote = fila.splice(0, fila.length)
    if (lote.length) console.log(`[ponte-falsa] entregou ${lote.length} mensagem(ns)`)
    return responder(lote)
  }

  let corpo = ''
  req.on('data', (c) => { corpo += c })
  req.on('end', () => {
    const dados = corpo ? JSON.parse(corpo) : {}
    if (req.url === '/send') {
      enviadas.push(dados.message)
      console.log(`\n[${enviadas.length}] ${'─'.repeat(58)}\n${dados.message}\n`)
      return responder({ success: true, messageId: `saida-${enviadas.length}` })
    }
    if (req.url === '/typing') { console.log('[ponte-falsa] digitando...'); return responder({ success: true }) }
    if (req.url === '/read')   { console.log('[ponte-falsa] marcada como lida'); return responder({ success: true }) }
    responder({ error: 'rota desconhecida' })
  })
}).listen(porta, '127.0.0.1', () => {
  console.log(`[ponte-falsa] 127.0.0.1:${porta} · ${fila.length} mensagem(ns) na fila`)
})
