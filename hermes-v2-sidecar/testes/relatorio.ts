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
import { TOOLS_POR_SAIDA, NOMES_DE_TOOL } from '../tools-def.js'
import type { Consumo, Custo, Cambio } from './contador.js'

export interface MedicaoSalva {
  saida: string
  tecnicaOk: boolean
  falhaTipo: string | null
  cartoes: string[]
  fatos: string[]
  /**
   * Os NOMES das tools chamadas no turno. Opcional: rodada gravada antes de
   * 22/09 nao tem o campo, e ausente significa "nao medido", nunca "zero".
   */
  chamadas?: string[]
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
  preco: { modelo: string; entradaPorMilhao: number; saidaPorMilhao: number; cachePorMilhao?: number; fonte: string; medidoEm: string }
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

  // ── A MEDICAO POR CHAMADA (22/09) ─────────────────────────────────────────
  //
  // 🔴 TRES NUMEROS, NAO DOIS. `oferecida` sai do mapa de trilhas, `chamada`
  //    sai do nome que o router registrou, `comEfeito` sai de cartoes/fatos.
  //    A diferenca entre os dois ultimos e o caso que estava invisivel: a tool
  //    rodou e voltou vazia. Ate 22/09 ele era somado a "nao chamou".
  const oferecidas: Record<string, number> = {}
  const chamadas: Record<string, number> = {}
  const comEfeito: Record<string, number> = {}
  // Turnos em que `buscar_base` estava na mesa e nao foi escolhido: o que veio
  // no lugar, contado por tool. Turno sem tool nenhuma entra como `(nenhuma)`.
  const noLugarDaBusca: Record<string, number> = {}
  let turnosMedidos = 0
  let turnosComBusca = 0
  let turnosSemBuscaOferecida = 0

  /** De um `fato` ou cartao para o nome da tool que o produziu. */
  const toolDoEfeito = (chave: string): string | null => ({
    cnae: 'consultar_cnae',
    plano: 'consultar_preco',
    estimativa_das: 'estimar_das',
    parametro_fiscal: 'estimar_das',
    links: 'consultar_links',
    contrato: 'consultar_contrato',
    escopo: 'consultar_escopo',
    teto: 'consultar_escopo',
    nota: 'buscar_base',
  } as Record<string, string>)[chave] ?? null

  for (const res of r.resultados) {
    for (const m of res.medicoes) {
      rotas[m.saida] = (rotas[m.saida] ?? 0) + 1
      if (!m.tecnicaOk) semLastro++
      // 🔴 AS TRES COLUNAS SAO POR TURNO, e nao por ocorrencia.
      //
      // A primeira versao desta secao contava efeito por FATO, e as unidades
      // nao fechavam: `consultar_escopo` emite dois fatos por chamada (`escopo`
      // e `teto`) e `estimar_das` tambem, entao 6 chamadas viravam 12 "efeitos"
      // e a comparacao `chamada > com efeito` nunca disparava justamente nas
      // tools que ela deveria vigiar. Turno e a unidade que os tres campos
      // compartilham.
      const efeitosDoTurno = new Set<string>()
      for (const f of m.fatos) {
        const chave = f.split(':')[0]
        toolsDeFato[chave] = (toolsDeFato[chave] ?? 0) + 1
        const tool = toolDoEfeito(chave)
        if (tool) efeitosDoTurno.add(tool)
      }
      for (const c of m.cartoes) cartoes[c] = (cartoes[c] ?? 0) + 1
      if (m.cartoes.length) efeitosDoTurno.add('buscar_cartao')
      for (const tool of efeitosDoTurno) comEfeito[tool] = (comEfeito[tool] ?? 0) + 1

      // ⚠️ `undefined` e rodada antiga, sem o campo: nao entra na conta. Contar
      //    ausencia como zero e exatamente o erro que esta secao corrige.
      if (!m.chamadas) continue
      turnosMedidos++

      const naMesa = TOOLS_POR_SAIDA[m.saida] ?? NOMES_DE_TOOL
      for (const nome of naMesa) oferecidas[nome] = (oferecidas[nome] ?? 0) + 1
      for (const nome of new Set(m.chamadas)) chamadas[nome] = (chamadas[nome] ?? 0) + 1

      if (!naMesa.includes('buscar_base')) { turnosSemBuscaOferecida++; continue }
      if (m.chamadas.includes('buscar_base')) { turnosComBusca++; continue }
      if (m.chamadas.length === 0) {
        noLugarDaBusca['(nenhuma)'] = (noLugarDaBusca['(nenhuma)'] ?? 0) + 1
      } else {
        for (const nome of new Set(m.chamadas)) {
          noLugarDaBusca[nome] = (noLugarDaBusca[nome] ?? 0) + 1
        }
      }
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
  if ((r.consumo.tokensCache ?? 0) > 0) {
    const pct = r.custo.semCacheUsd ? ((r.custo.economiaUsd ?? 0) / r.custo.semCacheUsd) * 100 : 0
    p(`| **dos quais em cache** | **${n(r.consumo.tokensCache)}** (${((r.custo.taxaDeAcerto ?? 0) * 100).toFixed(1)}%) |`)
    p(`| sem cache custaria | ${usd(r.custo.semCacheUsd ?? 0)}${r.cambio ? ` · ${brl((r.custo.semCacheUsd ?? 0) * r.cambio.taxa)}` : ''} |`)
    p(`| **economia do cache** | **${usd(r.custo.economiaUsd ?? 0)}${r.cambio ? ` · ${brl((r.custo.economiaUsd ?? 0) * r.cambio.taxa)}` : ''} (${pct.toFixed(1)}%)** |`)
  }
  p(`| tokens de saida | ${n(r.consumo.tokensSaida)} |`)
  p(`| razao entrada/saida | ${r.consumo.tokensSaida > 0 ? (r.consumo.tokensEntrada / r.consumo.tokensSaida).toFixed(1) : '∞'} para 1 |`)
  p(`| chamadas de embedding | ${n(r.consumo.chamadasEmbedding)} |`)
  p(`| falhas de provedor | ${r.consumo.falhasDeProvedor} |`)
  p()
  p(`Preco de ${r.preco.entradaPorMilhao}/${r.preco.saidaPorMilhao}/${r.preco.cachePorMilhao ?? '?'} por milhao (entrada/saida/cache).`)
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
  p('### Oferecida · chamada · com efeito')
  p()
  if (turnosMedidos === 0) {
    p('⚠️ **Rodada sem medicao por chamada.** O JSON desta rodada foi gravado antes')
    p('da instrumentacao de 22/09, entao so existe o efeito. Ausencia de campo nao e')
    p('zero: nada aqui autoriza conclusao sobre a tool ter sido chamada.')
  } else {
    p('🔑 **Tres colunas, e a diferenca entre as duas ultimas e o ponto.**')
    p()
    p('- `oferecida` — a tool estava na lista que o roteador montou para a trilha')
    p('  daquele turno (`TOOLS_POR_SAIDA`). Se for zero, o modelo nao tinha como')
    p('  escolher, e nenhuma conclusao sobre "o modelo nao quis" se sustenta.')
    p('- `chamada` — o modelo escolheu, e o nome foi registrado ANTES de executar.')
    p('- `com efeito` — a chamada devolveu linha. **`chamada` > `com efeito`')
    p('  significa tool que rodou e voltou VAZIA**, que e conteudo faltando na base,')
    p('  nao ferramenta ignorada. Ate 22/09 esse caso era somado a "nao chamou".')
    p()
    p(`Turnos com medicao por chamada: **${turnosMedidos}**.`)
    p()
    p('⚠️ As tres colunas contam TURNOS, nao ocorrencias: tool chamada duas vezes')
    p('no mesmo turno conta uma. E o que torna as colunas comparaveis entre si —')
    p('`consultar_escopo` e `estimar_das` emitem dois fatos por chamada, e contar')
    p('por ocorrencia inflaria o efeito acima da chamada.')
    p()
    p('| tool | oferecida | chamada | com efeito |')
    p('|---|---:|---:|---:|')
    for (const nome of NOMES_DE_TOOL) {
      const of = oferecidas[nome] ?? 0
      const ch = chamadas[nome] ?? 0
      const ef = comEfeito[nome] ?? 0
      const marca = ch > ef ? ' ⚠️' : ''
      p(`| \`${nome}\` | ${of} | ${ch} | ${ef}${marca} |`)
    }
    p()
    p('⚠️ = chamada sem efeito em pelo menos um turno: a tool rodou e voltou vazia.')
    p()

    // ── As duas causas, separadas ──────────────────────────────────────────
    p('#### `buscar_base`: oferecido, e chamado?')
    p()
    const ofBusca = oferecidas['buscar_base'] ?? 0
    p('| | turnos |')
    p('|---|---:|')
    p(`| Oferecido (estava na mesa) | ${ofBusca} de ${turnosMedidos} |`)
    p(`| Nao oferecido pela trilha | ${turnosSemBuscaOferecida} |`)
    p(`| Chamado, tendo sido oferecido | ${turnosComBusca} |`)
    p()
    if (turnosSemBuscaOferecida === 0) {
      p('✅ **Causa B descartada nesta rodada:** em nenhum turno a trilha deixou o')
      p('`buscar_base` fora da mesa. Ele esta nas quatro trilhas de `TOOLS_POR_SAIDA`.')
    } else {
      p(`🔴 **Causa B viva:** em ${turnosSemBuscaOferecida} turno(s) a tool nao foi sequer oferecida.`)
    }
    p()
    p('#### Quando foi oferecido e NAO foi chamado, o que veio no lugar')
    p()
    if (Object.keys(noLugarDaBusca).length === 0) {
      p('_Nao houve turno assim nesta rodada._')
    } else {
      p('⚠️ Contado por TURNO, nao por chamada: uma tool chamada duas vezes no mesmo')
      p('turno conta uma. `(nenhuma)` e o turno em que o modelo respondeu de cabeca,')
      p('sem tocar em ferramenta alguma — e esse e o caso que interessa a causa A.')
      p()
      p('| veio no lugar | turnos |')
      p('|---|---:|')
      for (const [k, v] of Object.entries(noLugarDaBusca).sort((a, b) => b[1] - a[1])) {
        p(`| ${k === '(nenhuma)' ? '**(nenhuma)**' : `\`${k}\``} | ${v} |`)
      }
    }
  }
  p()
  p('### Ferramentas de fato acionadas (por efeito)')
  p()
  p('⚠️ Tabela historica, mantida para comparar com as rodadas anteriores a 22/09.')
  p('Ela conta EFEITO: tool que voltou vazia nao aparece. Para a medicao por')
  p('chamada, use a tabela de tres colunas acima.')
  p()
  if (Object.keys(toolsDeFato).length === 0) {
    p('Nenhuma com efeito. Isso **nao** significa que nenhuma foi chamada — ver acima.')
  } else {
    p('| efeito | ocorrencias |')
    p('|---|---|')
    for (const [k, v] of Object.entries(toolsDeFato).sort((a, b) => b[1] - a[1])) p(`| \`${k}\` | ${v} |`)
  }
  p()
  p('### Busca vetorial')
  p()
  p('⚠️ Sao DUAS bases vetoriais, com trabalhos diferentes, e somar as duas esconde')
  p('o que importa: `buscar_cartao` responde **o que o produto faz**, `buscar_base`')
  p('responde **link, data e regra de atendimento**. Uma pode estar viva e a outra')
  p('morta na mesma rodada.')
  p()
  const chamadasNota = Object.entries(toolsDeFato).find(([k]) => k === 'nota')?.[1] ?? 0
  p('| base | trechos recuperados |')
  p('|---|---|')
  p(`| \`buscar_cartao\` (as 58 capacidades) | ${Object.values(cartoes).reduce((a, b) => a + b, 0)} |`)
  p(`| \`buscar_base\` (as notas de conhecimento) | ${chamadasNota} |`)
  p()
  if (Object.keys(cartoes).length === 0) {
    p('🔴 **Nenhum CARTAO foi recuperado nesta rodada.** Isso e achado de arquitetura,')
    p('nao de redacao: ou a descricao de `buscar_cartao` nao compete com as tools de')
    p('fato, ou os casos desta suite nao perguntam o que um cartao responde. Os casos')
    p('do v12 sao de atendimento comercial e de regra, e capacidade do app aparece')
    p('pouco neles, entao a segunda hipotese e a mais provavel. De qualquer forma,')
    p('**nada nesta rodada autoriza conclusao sobre a qualidade dos 58 cartoes**.')
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
  // ⚠️ SEGUNDOS, nao so minutos. Em 21/09 duas suites rodaram no mesmo minuto e a
  //    segunda sobrescreveu o relatorio da primeira, que se perdeu.
  const carimbo = r.quando.slice(0, 19).replace('T', '-').replace(/:/g, '')
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
