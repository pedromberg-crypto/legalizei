/**
 * ════════════════════════════════════════════════════════════════════════════
 *  scripts/rodar-sql.mjs  ·  roda um arquivo .sql sem precisar de psql
 *
 *  Nasceu em 24/09/2026, quando a migration `06-cnae-18-colunas.sql` precisou
 *  subir e a VPS respondeu `Command 'psql' not found`. Instalar o
 *  `postgresql-client` resolveria, mas e mudanca de sistema para rodar um
 *  arquivo — e o driver `pg` ja esta aqui, pela mesma conexao que o sidecar usa
 *  em producao.
 *
 *  ── 🔴 O QUE ESTE SCRIPT NAO FAZ, E POR QUE IMPORTA ───────────────────────
 *
 *  Ele NAO interpreta comando de cliente psql: `\copy`, `\i`, `\set`. Esses sao
 *  do binario `psql`, nao sao SQL, e nenhum driver os entende. Rodar
 *  `02-cnae.sql` por aqui deixaria `fatos.cnae` com ZERO linhas **sem erro
 *  claro** — foi exatamente o que aconteceu em 20/09 e o unico sintoma foi um
 *  teste falhando la na frente.
 *
 *  Por isso o script RECUSA arquivo com `\copy` ou `\i`, em vez de rodar pela
 *  metade. Para carga de CSV, o caminho e `npm run seed:cnae`.
 *
 *  ── COMO RODA ─────────────────────────────────────────────────────────────
 *
 *    node --env-file=.env scripts/rodar-sql.mjs seed/06-cnae-18-colunas.sql
 *
 *  O arquivo inteiro vai numa unica chamada, de proposito: ele ja traz o seu
 *  proprio `BEGIN`/`COMMIT`, e mandar assim preserva o bloco `DO $$ ... $$`
 *  com o dollar-quoting intacto. Quebrar por `;` estouraria dentro do bloco.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs'
import pg from 'pg'

const arquivo = process.argv[2]
if (!arquivo) {
  console.error('uso: node --env-file=.env scripts/rodar-sql.mjs <arquivo.sql>')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL nao definida — faltou o --env-file=.env')
  process.exit(1)
}

const sql = readFileSync(arquivo, 'utf8')

// 🔴 A recusa que evita a carga silenciosamente vazia.
const meta = sql.match(/^\s*\\(copy|i|set|connect)\b/im)
if (meta) {
  console.error(
    `🔴 ${arquivo} usa o comando de cliente "\\${meta[1]}", que NENHUM driver interpreta.\n` +
      '   Rodar assim deixaria a carga vazia sem erro claro. Use psql, ou o\n' +
      '   caminho por rede: npm run seed:cnae',
  )
  process.exit(1)
}

const cliente = new pg.Client({ connectionString: process.env.DATABASE_URL })

// Os RAISE NOTICE do arquivo sao o relatorio da migration: mostrar todos.
cliente.on('notice', (n) => console.log(`  ${n.message}`))

try {
  await cliente.connect()
  console.log(`rodando ${arquivo} (${sql.length} caracteres)`)
  await cliente.query(sql)
  console.log('✅ ok')
} catch (erro) {
  console.error(`🔴 ${erro.message}`)
  if (erro.hint) console.error(`   dica: ${erro.hint}`)
  if (erro.position) console.error(`   posicao: ${erro.position}`)
  process.exitCode = 1
} finally {
  await cliente.end()
}
