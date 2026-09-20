/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/db.test.ts  ·  a matematica do imposto, centavo por centavo
 *
 *  🔴 ZERO LLM AQUI. Estes testes falam so com as functions do PostgreSQL. Se
 *  um dia a conta do DAS depender de um modelo, este arquivo inteiro perdeu o
 *  sentido e a arquitetura foi rompida.
 *
 *  Os valores esperados foram calculados a mao a partir da LC 123/2006, Anexos
 *  III e V, e conferem com `produto/me/viver/motor/regra/_tabelas.mjs`:
 *
 *      efetiva = (RBT12 x nominal - deduzir) / RBT12
 *      DAS     = receita do mes x efetiva
 *
 *  ⚠️ EXIGE BANCO. Sem `DATABASE_URL`, os testes sao pulados em vez de
 *  passarem vazios: suite verde sem ter rodado nada e pior que suite vermelha,
 *  porque ela mente com cara de prova.
 *
 *  DATABASE_URL=postgres://... node --experimental-strip-types --test testes/db.test.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

const TEM_BANCO = Boolean(process.env.DATABASE_URL)
const pular = { skip: TEM_BANCO ? false : 'DATABASE_URL nao definida' }

let db: typeof import('../db.js')
let pool: import('pg').Pool

before(async () => {
  if (!TEM_BANCO) return
  db = await import('../db.js')
  pool = db.pool
})

after(async () => {
  if (!TEM_BANCO) return
  await (pool as any).end?.()
})

// ════════════════════════════════════════════════════════════════════════════
//  1. ESTIMATIVA DO DAS  ·  centavo por centavo
// ════════════════════════════════════════════════════════════════════════════

test('Anexo III faixa 1: sem parcela a deduzir, a efetiva e a nominal', pular, async () => {
  // RBT12 50.000 esta na faixa 1 (ate 180.000). nominal 6%, deduzir 0.
  // efetiva = (50000 x 0,06 - 0) / 50000 = 0,06
  // DAS sobre 5.000 = 300,00 -> 30000 centavos. Sobra 4.700,00 -> 470000.
  const r = await db.estimarDas('III', '50000', '5000')
  assert.ok(r, 'a faixa tem que ser encontrada')
  assert.equal(r.faixa, 1)
  assert.equal(Number(r.efetiva), 0.06)
  assert.equal(Number(r.das_centavos), 30000)
  assert.equal(Number(r.sobra_centavos), 470000)
  assert.equal(r.e_estimativa, true, 'o resultado sempre se declara estimativa')
})

test('Anexo III faixa 2: a parcela a deduzir derruba a carga real', pular, async () => {
  // 🔑 Este e o teste que importa. Quem calcula receita x nominal cobra 11,2%
  //    onde a lei cobra 8,08%, e assusta o cliente com um numero que ele nao paga.
  // efetiva = (300000 x 0,112 - 9360) / 300000 = 24240 / 300000 = 0,0808
  // DAS sobre 25.000 = 2.020,00 -> 202000 centavos. Sobra 22.980,00 -> 2298000.
  const r = await db.estimarDas('III', '300000', '25000')
  assert.ok(r)
  assert.equal(r.faixa, 2)
  assert.equal(Number(r.nominal), 0.112)
  assert.equal(Number(r.efetiva), 0.0808)
  assert.equal(Number(r.das_centavos), 202000)
  assert.equal(Number(r.sobra_centavos), 2298000)
  assert.ok(Number(r.efetiva) < Number(r.nominal), 'da 2a faixa em diante a efetiva e sempre menor')
})

test('Anexo V faixa 1: o mesmo faturamento custa mais fora do Anexo III', pular, async () => {
  // efetiva = 0,155. DAS sobre 5.000 = 775,00 -> 77500. Sobra 422500.
  const r = await db.estimarDas('V', '50000', '5000')
  assert.ok(r)
  assert.equal(r.faixa, 1)
  assert.equal(Number(r.efetiva), 0.155)
  assert.equal(Number(r.das_centavos), 77500)
  assert.equal(Number(r.sobra_centavos), 422500)
})

test('Anexo V faixa 2', pular, async () => {
  // efetiva = (300000 x 0,18 - 4500) / 300000 = 49500 / 300000 = 0,165
  // DAS sobre 25.000 = 4.125,00 -> 412500. Sobra 2087500.
  const r = await db.estimarDas('V', '300000', '25000')
  assert.ok(r)
  assert.equal(Number(r.efetiva), 0.165)
  assert.equal(Number(r.das_centavos), 412500)
  assert.equal(Number(r.sobra_centavos), 2087500)
})

test('a borda da faixa e inclusiva: RBT12 de exatos 180.000 ainda e faixa 1', pular, async () => {
  const dentro = await db.estimarDas('III', '180000', '15000')
  const fora = await db.estimarDas('III', '180000.01', '15000')
  assert.equal(dentro?.faixa, 1)
  assert.equal(fora?.faixa, 2, 'um centavo acima ja muda de faixa')
})

test('o Anexo IV nao existe na base, porque esta fora do escopo', pular, async () => {
  // Nao e omissao: o escopo travado e III e V. Pedir IV tem que devolver nada,
  // em vez de cair num default silencioso.
  const { rows } = await pool.query("SELECT * FROM fatos.simples_faixa WHERE anexo = 'IV'")
  assert.equal(rows.length, 0)
})

// ════════════════════════════════════════════════════════════════════════════
//  2. A REPARTICAO  ·  o que faz a guia fechar contra o PGDAS
// ════════════════════════════════════════════════════════════════════════════

test('toda faixa de toda tabela soma 1,00000', pular, async () => {
  const { rows } = await pool.query('SELECT * FROM fatos.v_reparticao_fecha')
  assert.equal(rows.length, 0, `reparticao quebrada em: ${JSON.stringify(rows)}`)
})

test('a 6a faixa nao tem ISS, e isso e a lei, nao erro de carga', pular, async () => {
  const { rows } = await pool.query(
    "SELECT anexo, fracao FROM fatos.simples_reparticao WHERE faixa = 6 AND tributo = 'iss'",
  )
  assert.equal(rows.length, 2)
  for (const r of rows) assert.equal(Number(r.fracao), 0)
})

test('o ISS do Anexo III faixa 1 e 33,5%, que e o que faz a conta da persona zero fechar', pular, async () => {
  // 6% x 33,5% = 2,010%, que bate com a nota real medida em 12/09.
  // No Anexo V daria 2,17%, que nao bate. Foi assim que o anexo da persona
  // zero foi corrigido de V para III.
  const { rows } = await pool.query(
    "SELECT fracao FROM fatos.simples_reparticao WHERE anexo = 'III' AND faixa = 1 AND tributo = 'iss'",
  )
  assert.equal(Number(rows[0].fracao), 0.335)
  assert.equal(Number((0.06 * 0.335).toFixed(5)), 0.0201)
})

// ════════════════════════════════════════════════════════════════════════════
//  3. PRECOS  ·  a unica casa do numero
// ════════════════════════════════════════════════════════════════════════════

test('plano MEI: cheio e promocional, em centavos', pular, async () => {
  const linhas = await db.consultarPreco('mei')
  const valores = linhas.map((l) => l.valor_centavos).sort((a, b) => a - b)
  assert.deepEqual(valores, [2900, 4900])
  for (const l of linhas) assert.equal(Number.isInteger(l.valor_centavos), true, 'centavos inteiros, nunca float')
})

test('🔴 o plano MEI declara que NAO inclui certificado digital', pular, async () => {
  // Este e o erro que ja foi para producao: o agente dizia que a abertura e o
  // certificado ficavam por conta da casa nos DOIS regimes.
  const linhas = await db.consultarPreco('mei')
  for (const l of linhas) {
    assert.ok(
      l.nao_inclui.some((x) => /certificado/i.test(x)),
      'sem esta linha o agente volta a prometer certificado para MEI',
    )
    assert.ok(l.nao_inclui.some((x) => /contador humano/i.test(x)))
  }
})

test('plano ME inclui o certificado digital', pular, async () => {
  const linhas = await db.consultarPreco('me_simples')
  const valores = linhas.map((l) => l.valor_centavos).sort((a, b) => a - b)
  assert.deepEqual(valores, [9900, 13900])
  for (const l of linhas) {
    assert.ok(l.inclui.some((x) => /certificado/i.test(x)))
  }
})

test('os precos promocionais expirados nao existem na base', pular, async () => {
  // R$ 19 no MEI e R$ 79 no ME expiraram. Se voltarem para a tabela, o agente
  // volta a oferecer condicao morta.
  const { rows } = await pool.query(
    'SELECT id FROM fatos.plano WHERE valor_centavos IN (1900, 7900)',
  )
  assert.equal(rows.length, 0)
})


// ════════════════════════════════════════════════════════════════════════════
//  4. A SEPARACAO ENTRE FATO E TEXTO
// ════════════════════════════════════════════════════════════════════════════

test('🔴 nenhum cartao vetorizado carrega numero no texto', pular, async () => {
  // A trava `cartao_sem_numero` ja impede a insercao. Este teste existe para o
  // caso de alguem remover o CHECK: sem ele, o agente para de consultar `fatos`
  // e passa a responder de memoria, que foi a regressao de 19/09.
  const { rows } = await pool.query(
    `SELECT id FROM conhecimento.cartao
      WHERE (estado || ' ' || acao || ' ' || restricao) ~ '(R\\$|[0-9]+,[0-9]{2}|[0-9]+\\s?%)'`,
  )
  assert.equal(rows.length, 0, `cartoes com numero: ${rows.map((r: any) => r.id).join(', ')}`)
})

test('a carga de cartoes tem os 58 da lista ratificada', pular, async () => {
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM conhecimento.cartao')
  assert.equal(rows[0].n, 58)
})

test('a distribuicao de promessa bate com a medicao: 18 pode, 28 parcial, 12 nao', pular, async () => {
  const { rows } = await pool.query(
    'SELECT promessa, count(*)::int AS n FROM conhecimento.cartao GROUP BY promessa',
  )
  const mapa = Object.fromEntries(rows.map((r: any) => [r.promessa, r.n]))
  assert.deepEqual(mapa, { pode: 18, parcial: 28, nao: 12 })
})

test('os tetos estao em centavos, e nao em reais', pular, async () => {
  // Erro pego na escrita do seed: R$ 81.000 sao 8.100.000 centavos, e eu tinha
  // escrito mil vezes mais. Numero de ordem de grandeza errada passa despercebido
  // em revisao e nao passa em teste.
  const { rows } = await pool.query('SELECT id, valor_centavos FROM fatos.teto ORDER BY valor_centavos')
  assert.deepEqual(
    rows.map((r: any) => [r.id, Number(r.valor_centavos)]),
    [['teto-mei', 8100000], ['teto-me', 36000000]],
  )
})

// ════════════════════════════════════════════════════════════════════════════
//  5. O GATE DE CONFIANCA DO CNAE
// ════════════════════════════════════════════════════════════════════════════

test('o gate existe: nem todo CNAE autoriza afirmar anexo', pular, async () => {
  const { rows } = await pool.query(
    `SELECT count(*) FILTER (WHERE anexo_fator_r_confianca = 'alta')::int AS altos,
            count(*)::int AS total
       FROM fatos.cnae`,
  )
  const { altos, total } = rows[0]
  assert.ok(total > 1300, 'a matriz precisa estar carregada')
  assert.ok(altos > 0, 'sem nenhum codigo confiavel o agente nunca responde')
  assert.ok(altos < total / 2, 'se quase todos forem confiaveis, o gate deixou de existir')
})
