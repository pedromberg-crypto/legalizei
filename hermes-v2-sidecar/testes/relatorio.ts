/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/relatorio.ts  ·  a rodada de E2E virando documento
 *
 *  Gera um `.md` em `reports/`, para leitura humana e para auditoria por outra
 *  IA. O JSON continua existindo, em `_testes-saida/`, e os dois tem trabalhos
 *  diferentes: o JSON e para maquina reprocessar, o markdown e para alguem
 *  decidir alguma coisa.
 *
 *  🔴 O RELATORIO DECLARA O QUE NAO PROVA.
 *
 *  Um placar de E2E lido sem contexto vira decisao errada: o numero tem ruido
 *  medido, o modelo nao e deterministico, e o que falha por falta de ferramenta
 *  parece falha de redacao. Por isso todo relatorio sai com a secao de limites,
 *  e ela vem ANTES da lista de falhas, nao no rodape.
 *
 *  Uso:
 *    node .build/testes/relatorio.js _testes-saida/e2e-2026-09-20.json
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, basename } from 'node:path'

import { RAIZ } from '../seed/carregar-conhecimento.js'
import type { Consumo, Custo, Cambio } from './contador.js'

export interface MedicaoSalva {
  saida: string
  tecnicaOk: boolean
  falhaTipo: string | null
  cartoes: string[]
  fatos: string[]
  tokensEntrada: number
  tokensSaida: number
}

export interface ResultadoSalvo {
  id: string
  passou: boolean
  falhas: string[]
  resposta: string
  chars: number
  ms: number
  medicoes: MedicaoSalva[]
  avaliar?: string
}

export interface RodadaSalva {
  quando: string
  placar: string
  consumo: Consumo
  custo: Custo
  cambio: Cambio | null
  preco: { modelo: string; entradaPorMilhao: number; saidaPorMilhao: number; fonte: string; medidoEm: string }
  resultados: ResultadoSalvo[]
  modelo?: string
  suite?: string
}

const brl = (v: number) => `R$ ${v.toFixed(4).replace('.', ',')}`
const usd = (v: number) => `US$ ${v.toFixed(6)}`
const n = (v: number) => v.toLocaleString('pt-BR')

/** Texto do modelo dentro de um bloco de citacao, sem quebrar o markdown. */
function citar(texto: string): string {
  if (!texto.trim()) return '_(vazio)_'
  return texto.trim().split('\n').map((l) => `> ${l}`).join('\n')
}

export function gerarMarkdown(r: RodadaSalva): string {
  const [passaram, total] = r.placar.split('/').map(Number)
  const falharam = r.resultados.filter((x) => !x.passou)
  const data = new Date(r.quando)

  const rotas: Record<string, number> = {}
  const toolsDeFato: Record<string, number> = {}
  const cartoes: Record<string, number> = {}
  let semLastro = 0

  for (const res of r.resultados) {
    for (const m of res.medicoes) {
      rotas[m.saida] = (rotas[m.saida] ?? 0) + 1
      if (!m.tecnicaOk) semLastro++
      for (const f of m.fatos) {
        const chave = f.split(':')[0]
        toolsDeFato[chave] = (toolsDeFato[chave] ?? 0) + 1
      }
      for (const c of m.cartoes) cartoes[c] = (cartoes[c] ?? 0) + 1
    }
  }

  const linhas: string[] = []
  const p = (s = '') => linhas.push(s)

  // ── Cabecalho ─────────────────────────────────────────────────────────────
  p('---')
  p('tipo: relatorio-teste')
  p('status: gerado')
  p(`data: ${r.quando.slice(0, 10)}`)
  p('assunto: hermes-v2-sidecar')
  p(`placar: "${r.placar}"`)
  p(`modelo: ${r.modelo ?? r.preco.modelo}`)
  p('tags: [sidecar, e2e, leo, teste, custo]')
  p('---')
  p()
  p(`# Rodada E2E · ${r.quando.slice(0, 10)} · ${r.placar}`)
  p()
  p(`**Quando:** ${data.toISOString()} · **Modelo:** \`${r.modelo ?? r.preco.modelo}\` · ` +
    `**Suite:** ${r.suite ?? 'curta'} · **Casos:** ${total}`)
  p()
  p('Os casos vem de `_origem/vault-v12/_testes/casos.yaml`. Cada um nasceu de uma')
  p('falha real vista nas conversas de WhatsApp, entao "caso" aqui nao e cenario')
  p('inventado: e defeito que ja aconteceu com gente de verdade.')
  p()

  // ── O que este relatorio NAO prova ────────────────────────────────────────
  p('## 🔴 Antes de ler o placar')
  p()
  p('Quatro limites, e eles vem antes das falhas de proposito.')
  p()
  p('1. **O placar tem ruido medido de ate 3 pontos** (amplitude 3, sigma 1,07 em')
  p('   nove rodadas do mesmo pacote no runner legado). Diferenca pequena entre')
  p('   rodadas **nao e sinal**. O que vale olhar e o caso que falha sempre.')
  p('2. **O modelo nao e deterministico.** Rodar de novo, sem mudar nada, muda o')
  p('   texto e pode mudar o placar.')
  p('3. **Falha de ferramenta se parece com falha de redacao.** Quando o agente')
  p('   nao cita um dado, a primeira pergunta nao e "o prompt esta ruim?", e sim')
  p('   "existe tool que devolva esse dado?". A secao de rotas abaixo ajuda.')
  p('4. **Isto nao mede qualidade, mede regra.** As checagens sao automaticas:')
  p('   pegam o que nao pode aparecer e o que tem que aparecer. Se a resposta')
  p('   ficou boa continua sendo olho humano, e o campo `avaliar` de cada caso e')
  p('   justamente o criterio para essa leitura.')
  p()

  // ── Resumo ────────────────────────────────────────────────────────────────
  p('## Resumo')
  p()
  p('| | |')
  p('|---|---|')
  p(`| placar | **${passaram}/${total}** |`)
  p(`| custo da rodada | ${usd(r.custo.totalUsd)}${r.custo.totalBrl !== null ? ` · ${brl(r.custo.totalBrl)}` : ''} |`)
  p(`| custo por caso | ${usd(r.custo.totalUsd / total)}${r.custo.totalBrl !== null ? ` · ${brl(r.custo.totalBrl / total)}` : ''} |`)
  p(`| chamadas ao modelo | ${n(r.consumo.chamadasLlm)} |`)
  p(`| tokens de entrada | ${n(r.consumo.tokensEntrada)} |`)
  p(`| tokens de saida | ${n(r.consumo.tokensSaida)} |`)
  p(`| razao entrada/saida | ${r.consumo.tokensSaida > 0 ? (r.consumo.tokensEntrada / r.consumo.tokensSaida).toFixed(1) : '∞'} para 1 |`)
  p(`| chamadas de embedding | ${n(r.consumo.chamadasEmbedding)} |`)
  p(`| falhas de provedor | ${r.consumo.falhasDeProvedor} |`)
  p()
  p(`Preco de ${r.preco.entradaPorMilhao}/${r.preco.saidaPorMilhao} por milhao (entrada/saida).`)
  p(`Fonte: ${r.preco.fonte}, medido em ${r.preco.medidoEm}.`)
  if (r.cambio) p(`Cambio ${r.cambio.taxa.toFixed(4)}, de ${r.cambio.fonte}, em ${r.cambio.quando}.`)
  p()
  if (r.consumo.falhasDeProvedor > 0) {
    p(`⚠️ **${r.consumo.falhasDeProvedor} chamada(s) falharam depois de aceitas.** O provedor nao`)
    p('devolve uso no erro, entao esse custo nao esta somado acima. Erro de provedor')
    p('nao e falha de qualidade e nao entra no placar como caso reprovado.')
    p()
  }

  // ── Rotas e ferramentas ───────────────────────────────────────────────────
  p('## Por onde as respostas sairam')
  p()
  p('O roteador tem quatro saidas exclusivas. Esta tabela e o que o runner legado')
  p('nao tinha: quando um caso falha, ela separa "a resposta saiu ruim" de "a')
  p('resposta saiu ruim porque a rota foi a errada".')
  p()
  p('| saida | turnos |')
  p('|---|---|')
  for (const [k, v] of Object.entries(rotas).sort((a, b) => b[1] - a[1])) p(`| \`${k}\` | ${v} |`)
  p()
  p(`Turnos sem lastro tecnico: **${semLastro}**. Cada um e um turno em que nenhuma`)
  p('tool sustentou a resposta, e por regra nenhum deles pode ter recebido gancho')
  p('comercial.')
  p()
  p('### Ferramentas de fato acionadas')
  p()
  if (Object.keys(toolsDeFato).length === 0) {
    p('Nenhuma. 🔴 Isso significa que o agente respondeu sem consultar o banco.')
  } else {
    p('| tool | chamadas |')
    p('|---|---|')
    for (const [k, v] of Object.entries(toolsDeFato).sort((a, b) => b[1] - a[1])) p(`| \`${k}\` | ${v} |`)
  }
  p()
  p('### Busca vetorial')
  p()
  if (Object.keys(cartoes).length === 0) {
    p('🔴 **Nenhum cartao foi recuperado nesta rodada.** A base vetorial existe e esta')
    p('carregada, e o modelo nao a usou uma vez sequer. Isso e achado de arquitetura,')
    p('nao de redacao: ou a descricao da tool `buscar_cartao` nao compete com as tools')
    p('de fato, ou os casos desta suite nao perguntam nada que um cartao responda.')
    p('Qualquer conclusao sobre a qualidade do RAG a partir desta rodada seria falsa,')
    p('porque o RAG nao participou.')
  } else {
    p('| cartao | vezes |')
    p('|---|---|')
    for (const [k, v] of Object.entries(cartoes).sort((a, b) => b[1] - a[1])) p(`| \`${k}\` | ${v} |`)
  }
  p()

  // ── Falhas ────────────────────────────────────────────────────────────────
  p(`## Os ${falharam.length} casos que falharam`)
  p()
  if (falharam.length === 0) {
    p('Nenhum. ⚠️ Lembrando que suite verde nao prova qualidade, so prova que nenhuma')
    p('regra automatica foi violada.')
  }
  for (const f of falharam) {
    p(`### ✖ \`${f.id}\``)
    p()
    p(`**Rota:** ${f.medicoes.map((m) => m.saida).join(' → ') || '(nenhuma)'} · ` +
      `**${f.chars} chars** · ${f.ms} ms`)
    p()
    p('**O que a checagem apontou:**')
    p()
    for (const falha of f.falhas) p(`* \`${falha}\``)
    p()
    if (f.avaliar) {
      p(`**Criterio humano do caso:** ${f.avaliar}`)
      p()
    }
    p('**O que o agente respondeu:**')
    p()
    p(citar(f.resposta))
    p()
  }

  // ── Casos que passaram ────────────────────────────────────────────────────
  p('## Os casos que passaram')
  p()
  p('⚠️ Passar quer dizer que nenhuma regra automatica foi violada. Nao quer dizer')
  p('que a resposta esta boa: o criterio de cada caso esta na coluna, para leitura.')
  p()
  p('| caso | rota | chars | criterio a conferir a olho |')
  p('|---|---|---|---|')
  for (const res of r.resultados.filter((x) => x.passou)) {
    const rota = res.medicoes.map((m) => m.saida).join(' → ') || '?'
    p(`| \`${res.id}\` | ${rota} | ${res.chars} | ${(res.avaliar ?? '').replace(/\|/g, '/')} |`)
  }
  p()

  p('## Respostas completas dos casos que passaram')
  p()
  p('Aqui para quem for auditar o tom, que nenhuma regra automatica mede.')
  p()
  for (const res of r.resultados.filter((x) => x.passou)) {
    p(`### ✔ \`${res.id}\``)
    p()
    p(citar(res.resposta))
    p()
  }

  return linhas.join('\n')
}

export function escreverRelatorio(r: RodadaSalva, sufixo = ''): string {
  const dir = join(RAIZ, 'reports')
  mkdirSync(dir, { recursive: true })
  const carimbo = r.quando.slice(0, 16).replace('T', '-').replace(':', '')
  const arquivo = join(dir, `e2e-${carimbo}${sufixo}.md`)
  writeFileSync(arquivo, gerarMarkdown(r))
  return arquivo
}

// Execucao direta: gera o markdown a partir de um JSON ja salvo, sem repetir a
// rodada. Rodada de E2E custa dinheiro, entao reprocessar nunca deve exigir
// pagar de novo.
if (process.argv[1]?.includes('relatorio')) {
  const entrada = process.argv[2]
  if (!entrada) {
    console.error('uso: node .build/testes/relatorio.js <arquivo.json>')
    process.exit(1)
  }
  const dados = JSON.parse(readFileSync(entrada, 'utf8')) as RodadaSalva
  const saida = escreverRelatorio(dados)
  console.log(`${basename(entrada)} -> ${saida}`)
}
