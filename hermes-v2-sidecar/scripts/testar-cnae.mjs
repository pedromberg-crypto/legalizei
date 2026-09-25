/**
 * ════════════════════════════════════════════════════════════════════════════
 *  scripts/testar-cnae.mjs  ·  a busca de CNAE contra o BANCO DE VERDADE
 *
 *  Roda os casos do criterio de aceite do vault
 *  (`execucao/agente-whatsapp-vault/_aceite-busca-de-cnae.md`) contra
 *  `fatos.consultar_cnae`, e devolve veredito por caso.
 *
 *  🔑 POR QUE AQUI E NAO NO VAULT. O vault tem um simulador do `pg_trgm`
 *  (`pesquisa/cnae-matriz/testar-busca.mjs`) que serve para escolher entre dois
 *  titulos — e so. Ele nao reproduz `to_tsvector`, nao reproduz `ts_rank`, e
 *  nao ve o indice. Quem mede de verdade e este, contra o banco, na maquina que
 *  alcanca o banco (ele resolve so em IPv6).
 *
 *  ── 🔴 O CRITERIO QUE MAIS IMPORTA, e e o A3 ──────────────────────────────
 *
 *  Nunca devolver um CNAE que a casa ATENDE em primeiro lugar para quem
 *  descreveu atividade que a casa NAO atende. Medido em 24/09, antes desta
 *  migration: "tenho um restaurante" devolvia Restauracao de obras de arte e
 *  "vendo roupa" devolvia Aluguel de roupas — as duas com `atende_me = true`.
 *  O agente lia o topo e dizia que atendia.
 *
 *      Errar para "nao atendemos" e barato.
 *      Errar para "atendemos" abre empresa errada.
 *
 *  Uso:  node --env-file=.env scripts/testar-cnae.mjs
 * ════════════════════════════════════════════════════════════════════════════
 */

import pg from 'pg'

/* `espera` diz o que precisa ser verdade, nao qual linha tem que vir. Amarrar
   no codigo exato engessaria a busca; o que nao pode mudar e o COMPORTAMENTO. */
const CASOS = [
  // ── quem a casa NAO atende: tem que achar, e tem que recusar ──────────────
  { q: 'sou psicologo', espera: { codigo: '8650003', atende: false, via: 'sinonimo' } },
  { q: 'sou personal trainer', espera: { codigo: '9313100', atende: false, via: 'sinonimo' } },
  { q: 'sou advogado', espera: { codigo: '6911701', atende: false } },
  { q: 'sou engenheiro', espera: { atende: false } },
  { q: 'sou dentista', espera: { atende: false } },
  { q: 'tenho um restaurante', espera: { atende: false } },
  { q: 'vendo roupa', espera: { atende: false, podeSerVazio: true } },

  // ── quem a casa atende: tem que achar pelo nome que a pessoa usa ──────────
  { q: 'sou sapateiro', espera: { codigo: '9529101', atende: true } },
  { q: 'relojoeiro', espera: { codigo: '9529103', atende: true } },
  { q: 'sou cantor', espera: { codigo: '9001902', atende: true } },
  { q: 'conserto notebook', espera: { codigo: '9511800', atende: true } },
  { q: 'dou aula de ingles', espera: { codigo: '8593700', atende: true } },
  { q: 'cursinho pra concurso', espera: { codigo: '8599605', atende: true } },
  { q: 'sou cabeleireira', espera: { codigo: '9602501', atende: true } },
  { q: 'alugo fantasia', espera: { codigo: '7723300', atende: true } },
  { q: 'cuido de redes sociais', espera: { codigo: '6319400', atende: true } },
  { q: 'sou tradutor', espera: { codigo: '7490101', atende: true } },

  // 🔴 Este falha hoje e o vault sabe: "faco sites" devolve Hospedagem e Portal
  //    (Anexo III fixo) e o Web design (FATOR R) fica atras. Nao e UX, e a
  //    diferenca entre 6% e 15,5%. Fica na lista para nao sumir do radar.
  { q: 'faco sites', espera: { codigo: '6201502', atende: true } },
]

const cliente = new pg.Client({ connectionString: process.env.DATABASE_URL })
await cliente.connect()

let ok = 0
let a3 = 0
const falhas = []

for (const caso of CASOS) {
  const { rows } = await cliente.query('SELECT * FROM fatos.consultar_cnae($1)', [caso.q])
  const topo = rows[0]
  const e = caso.espera

  let veredito = 'ok'
  if (!topo) {
    veredito = e.podeSerVazio ? 'ok' : 'vazio'
  } else {
    // 🔴 A3 primeiro, porque errar aqui e o erro caro.
    if (e.atende === false && topo.casa_atende_me === true) veredito = 'A3'
    else if (e.codigo && topo.codigo.trim() !== e.codigo) veredito = 'outro'
    else if (e.via && topo.achou_por !== e.via) veredito = 'via'
  }

  if (veredito === 'ok') ok++
  else {
    falhas.push({ ...caso, topo, veredito })
    if (veredito === 'A3') a3++
  }

  const marca = veredito === 'ok' ? '✅' : veredito === 'A3' ? '🔴' : '🟡'
  const linha = topo
    ? `${topo.codigo} ${String(topo.titulo).slice(0, 40).padEnd(42)} ` +
      `${topo.casa_atende_me ? 'ATENDE ' : 'nao    '} ${String(topo.achou_por).padEnd(8)} ` +
      `${Number(topo.semelhanca).toFixed(2)}  ${topo.casa_atende_me ? '' : topo.motivo_nao_atende}`
    : '(vazio)'
  console.log(`${marca} "${caso.q}"`.padEnd(32) + linha)
}

console.log('\n' + '─'.repeat(78))
console.log(`${ok} de ${CASOS.length} casos passaram`)
if (a3 > 0) {
  console.log(
    `\n🔴 ${a3} VIOLACAO(OES) DO CRITERIO A3 — a busca devolveu um CNAE que a casa\n` +
      '   ATENDE em 1o lugar para quem a casa NAO atende. Isso abre empresa errada.\n' +
      '   Nao subir o servico com isso aberto.',
  )
}
for (const f of falhas.filter((x) => x.veredito !== 'A3')) {
  console.log(`🟡 "${f.q}" — esperava ${f.espera.codigo ?? '?'}, veio ${f.topo?.codigo ?? 'vazio'}`)
}

await cliente.end()
process.exitCode = a3 > 0 ? 1 : 0
