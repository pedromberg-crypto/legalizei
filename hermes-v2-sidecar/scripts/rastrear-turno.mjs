// ════════════════════════════════════════════════════════════════════════════
//  scripts/rastrear-turno.mjs  ·  UM turno, etapa por etapa, AO VIVO
//
//  🧭 Responde ao `_cadeia-da-resposta-do-leo.md`, que mapeou as 14 etapas
//  LENDO o codigo, do vault. Este aqui roda o caminho de verdade e mostra o que
//  de fato aconteceu — com o banco atras e o turno gravado.
//
//  🔴 USA AS DEPS REAIS, NAO `depsDeTeste`. O rastreio pede os valores LIDOS DO
//  BANCO (`tecnica_ok`, `falha_tipo`, `tools_chamadas`, `lastro_ids`), e o
//  `depsDeTeste` do E2E grava em memoria de proposito. Entao a sonda grava de
//  verdade, numa sessao PROPRIA e marcada, e depois le de la.
//
//  ⚠️ NAO fala com a ponte. `responder()` nao conhece `127.0.0.1:3000`: quem
//  envia e o `server.ts`, e ele nao entra aqui (CLAUDE.md §4).
//
//    node --env-file=.env scripts/rastrear-turno.mjs "pq vcs precisam do numero do meu iptu?"
// ════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const carregar = (p) => import(pathToFileURL(join(RAIZ, '.build', p)).href)

const SONDA = process.argv[2] ?? 'pq vcs precisam do numero do meu iptu?'

const { responder, decidirSaida } = await carregar('router.js')
const { criarLlm, criarEmbedder } = await carregar('llm/gemini.js')
const { toolsDaTrilha, TOOLS_POR_SAIDA } = await carregar('tools-def.js')
const db = await carregar('db.js')
const tools = await carregar('tools.js')
const { corrigirEnderecos } = await carregar('filtro-enderecos.js')

// ── O ESPIAO ────────────────────────────────────────────────────────────────
// Envolve as dependencias sem alterar nenhuma: cada uma continua fazendo o que
// fazia, e so passa a deixar registro do que entrou e do que saiu.
const diario = { chamadas: [], tools: [], lastro: null, correcoes: [], embeddings: 0 }

const llmReal = criarLlm({ cache: process.env.SEM_CACHE !== '1' })
const llm = {
  async completar(args) {
    const r = await llmReal.completar(args)
    diario.chamadas.push({
      classificador: Boolean(args.jsonSchema),
      toolsNaMesa: (args.tools ?? []).map((t) => t.nome),
      mensagensEnviadas: args.mensagens.length,
      texto: r.texto,
      chamadas: r.chamadas.map((c) => ({ nome: c.nome, argumentos: c.argumentos })),
      tokensEntrada: r.tokensEntrada,
      tokensSaida: r.tokensSaida,
      tokensCache: r.tokensCache,
    })
    return r
  },
}

const embReal = criarEmbedder()
const embedder = { async gerar(t) { diario.embeddings++; return embReal.gerar(t) } }

const deps = {
  carregarHistorico: db.carregarHistorico,
  gravarTurno: db.gravarTurno,
  atualizarClassificacao: db.atualizarClassificacao,
  async executarTool(nome, argumentos, emb) {
    const res = await tools.executarTool(nome, argumentos, emb)
    diario.tools.push({ nome, argumentos, cartoes: res.cartoes, fatos: res.fatos })
    return res
  },
  async buscarLastro(texto, emb) {
    const r = await tools.montarLastro(texto, emb)
    diario.lastro = { ids: r.ids, tamanhoDoBloco: r.bloco.length }
    return r
  },
  async conferirEnderecos(texto) {
    const links = await db.linksParaFiltro()
    if (!links.length) return { texto, correcoes: [] }
    const r = corrigirEnderecos(texto, links)
    diario.correcoes.push(...r.correcoes)
    return r
  },
}

// ── A SESSAO DE SONDA ───────────────────────────────────────────────────────
// 🔑 chatId proprio e descartavel: o rastreio precisa de historico VAZIO, ou o
//    que sair seria resposta a outra conversa.
const chatId = `sonda-rastreio-${randomUUID().slice(0, 8)}`
const { contatoId, sessaoId } = await db.garantirContatoESessao(chatId, 120)

const t0 = Date.now()
const resposta = await responder({ contatoId, sessaoId, texto: SONDA }, llm, embedder, { deps })
const ms = Date.now() - t0

// ── O TURNO, LIDO DO BANCO ──────────────────────────────────────────────────
const { rows: turnos } = await db.pool.query(
  `SELECT saida, tecnica_ok, falha_tipo, cartoes_usados, fatos_lidos,
          tools_chamadas, lastro_ids, tokens_entrada, tokens_saida, tokens_cache
     FROM conversa.turno_interno WHERE sessao_id = $1 ORDER BY id DESC LIMIT 1`,
  [sessaoId],
)
const { rows: mensagens } = await db.pool.query(
  `SELECT papel, texto FROM conversa.mensagem WHERE sessao_id = $1 ORDER BY id`,
  [sessaoId],
)

// ⚠️ COPIA FIEL de `server.ts`. As duas funcoes nao sao exportadas, e importar
//    `server.js` subiria o laco de polling. Copia pode divergir do original com
//    o tempo — achado enfileirado em `reports/_fila.md`.
const limparSaida = (t) => t
  .replace(/\s*[—–]\s*/g, ', ')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/^\s*\|.*\|\s*$/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim()
const emBatidas = (t) => {
  const partes = t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (partes.length <= 1) return partes
  return [partes[0], partes.slice(1).join('\n\n')]
}

const saida = {
  sonda: SONDA, chatId, sessaoId, ms,
  diario, resposta, turno: turnos[0] ?? null, mensagens,
  trilhaPorCodigo: null,
  toolsNaMesa: null,
  batidas: emBatidas(limparSaida(resposta.texto)),
}

// A trilha que o codigo escolheu, recalculada a partir do JSON do classificador.
const cls = diario.chamadas.find((c) => c.classificador)
if (cls) {
  try {
    const sinais = JSON.parse(cls.texto)
    saida.sinais = sinais
    saida.trilhaPorCodigo = decidirSaida(sinais)
    saida.toolsNaMesa = toolsDaTrilha(saida.trilhaPorCodigo).map((t) => t.nome)
    saida.toolsPorSaida = TOOLS_POR_SAIDA[saida.trilhaPorCodigo] ?? '(todas)'
  } catch { saida.sinais = { erroAoLer: cls.texto.slice(0, 300) } }
}

mkdirSync(join(RAIZ, 'reports'), { recursive: true })
const arquivo = join(RAIZ, 'reports', `_rastreio-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`)
writeFileSync(arquivo, JSON.stringify(saida, null, 2))
console.log(arquivo)
process.exit(0)
