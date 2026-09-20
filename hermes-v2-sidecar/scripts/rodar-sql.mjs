/**
 * Roda um arquivo .sql contra a DATABASE_URL.
 *
 * ⚠️ RECUSA arquivo que contenha `\copy`, em vez de rodar pela metade. `\copy`
 * e comando do cliente psql, nao SQL: mandar o arquivo inteiro pelo driver faz
 * o `\copy` virar erro de sintaxe no meio, e o que rodou antes dele fica
 * aplicado. Meia migracao aplicada e pior que nenhuma.
 *
 *   node --env-file=.env scripts/rodar-sql.mjs seed/03-dimensao-embedding.sql
 */
import { readFileSync } from 'node:fs'
import pg from 'pg'

const arquivo = process.argv[2]
if (!arquivo) {
  console.error('uso: node --env-file=.env scripts/rodar-sql.mjs <arquivo.sql>')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL nao definida')
  process.exit(1)
}

const sql = readFileSync(arquivo, 'utf8')

if (/^\s*\\copy/m.test(sql)) {
  console.error(
    `${arquivo} usa \\copy, que e comando do cliente psql e nenhum driver interpreta.\n` +
    'Rode com `psql -f`, ou use o carregador em Node equivalente (seed/carregar-cnae.ts).',
  )
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

try {
  const r = await pool.query(sql)
  const ultimo = Array.isArray(r) ? r[r.length - 1] : r
  if (ultimo?.rows?.length) console.table(ultimo.rows)
  console.log(`✅ ${arquivo}`)
} catch (erro) {
  console.error(`🔴 ${arquivo}:`, erro.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
