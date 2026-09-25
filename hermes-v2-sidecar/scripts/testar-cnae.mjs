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

import { existsSync, readFileSync } from 'node:fs'
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
  { q: 'vendo roupa', espera: { codigo: '4781400', atende: false, via: 'sinonimo' } },

  /* 🔴 OS QUATRO QUE PROVAM QUE O SINONIMO NAO PODE SER VERBO SOLTO.
     Estes CNAEs sao dos 87, e a atividade deles E vender. Um alias amplo em
     "vendo" mandaria cliente embora — trocaria uma violacao de A3 por um falso
     negativo pior: dizer "nao atendemos" a quem a casa atende. Se alguem
     alargar o alias um dia, estes quatro caem aqui antes de cair no cliente. */
  { q: 'vendo espaco publicitario', espera: { atende: true } },
  { q: 'faco promocao de vendas', espera: { atende: true } },
  /* 🟡 Este NAO cobra codigo, e a razao e honesta: "representante comercial"
     e ambiguo de verdade entre `7490-1/04` (representacao em geral, servico,
     a casa atende) e `4512-9/01` (representante de VEICULOS, comercio, a casa
     nao atende) — e as duas sao leituras legitimas da mesma frase. O banco
     devolve o `4512-9/01` com 0.85 porque as palavras estao literais no titulo
     dele, e isso nao e defeito de busca: e a pessoa que precisa desempatar,
     e a regra do verbo no `tools-def.ts` manda perguntar.
     🔑 O que este caso GUARDA e outra coisa: que nenhum alias amplo em "venda"
     ou "comercial" sequestre a frase. Por isso a checagem e sobre o `via`. */
  { q: 'sou representante comercial', espera: { naoPorSinonimo: true } },

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

  /* ✅ RESOLVIDO em 24/09, e vale guardar o que era: "faco sites" devolvia
     Hospedagem e Portal (Anexo III FIXO) e deixava o Web design (FATOR R)
     atras. Nao era UX — era a diferenca entre 6% e 15,5% na conta do cliente.
     Duas coisas somadas consertaram: o titulo no PLURAL ("criacao de sites")
     e o bonus de corroboracao, que premia quem casa no titulo E nos termos.
     Passa hoje com 0.55, e e justamente a margem apertada que faz este caso
     valer mais que os outros: qualquer mexida em limiar cai aqui primeiro. */
  { q: 'faco sites', espera: { codigo: '6201502', atende: true } },
]

const cliente = new pg.Client({ connectionString: process.env.DATABASE_URL })
await cliente.connect()

/* 🔴 O PRIMEIRO PORTAO E SOBRE A CARGA, NAO SOBRE A BUSCA.
   Os sinonimos sao DADO: eles vivem em `cnae-aliases.json` e so chegam ao
   banco pelo `npm run seed:cnae`. Em 24/09 quatro deles foram adicionados no
   vault, o teste rodou direto, e "vendo roupa" continuou errando — nao porque
   a busca estava ruim, mas porque a tabela de sinonimos ainda tinha os 5
   antigos. Perder uma rodada descobrindo isso e caro; avisar custa uma query. */
{
  const { rows } = await cliente.query('SELECT count(*)::int AS n FROM fatos.cnae_sinonimos')
  const noBanco = rows[0].n
  const arquivo = new URL('../../pesquisa/cnae-matriz/cnae-aliases.json', import.meta.url)
  const noArquivo = existsSync(arquivo) ? JSON.parse(readFileSync(arquivo, 'utf8')).length : null

  if (noArquivo != null && noBanco !== noArquivo) {
    console.log(
      `\n🔴 SINONIMOS DESATUALIZADOS: ${noBanco} no banco, ${noArquivo} no arquivo.\n` +
        '   Rode `npm run seed:cnae` antes — os sinonimos sao dado, nao codigo.\n',
    )
  } else {
    console.log(`sinonimos: ${noBanco} carregados\n`)
  }
}

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
    else if (e.naoPorSinonimo && topo.achou_por === 'sinonimo') veredito = 'sequestrado'
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
/* 🔑 DIAGNOSTICO, e ele existe por um motivo especifico: sem ele, ajustar
   limiar vira chute de longe, e chute de longe e o ciclo vicioso que o
   `CLAUDE.md` §1.3 descreve. Para cada caso que falhou com codigo esperado,
   mostra as metricas CRUAS daquele CNAE — assim o proximo ajuste sai de
   numero, nao de intuicao. */
for (const f of falhas.filter((x) => x.veredito !== 'A3')) {
  console.log(`\n🟡 "${f.q}" — esperava ${f.espera.codigo ?? '?'}, veio ${f.topo?.codigo ?? 'vazio'}`)
  if (!f.espera.codigo) continue
  const { rows } = await cliente.query(
    `SELECT titulo_amigavel,
            word_similarity($1, titulo_amigavel) AS ws_amig,
            word_similarity($1, titulo_oficial)  AS ws_ofic,
            similarity($1, titulo_amigavel)      AS sim_amig,
            ($1 <% titulo_amigavel)              AS passa_op,
            to_tsvector('portuguese', termos_de_busca)
              @@ plainto_tsquery('portuguese', $1) AS casa_termos
       FROM fatos.cnae WHERE codigo = $2`,
    [f.q, f.espera.codigo],
  )
  const d = rows[0]
  if (!d) { console.log('   (o codigo esperado nao existe na tabela)'); continue }
  console.log(`   alvo: ${d.titulo_amigavel}`)
  console.log(
    `   word_sim amigavel ${Number(d.ws_amig).toFixed(3)} · oficial ${Number(d.ws_ofic).toFixed(3)}` +
      ` · similarity ${Number(d.sim_amig).toFixed(3)}` +
      ` · operador <% ${d.passa_op ? 'passa' : 'NAO passa'}` +
      ` · termos ${d.casa_termos ? 'casam' : 'nao casam'}`,
  )
}

await cliente.end()
process.exitCode = a3 > 0 ? 1 : 0
