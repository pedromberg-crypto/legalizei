/**
 * ════════════════════════════════════════════════════════════════════════════
 *  scripts/ver-conversa.mjs  ·  o que a pessoa disse, o que o Leo respondeu, e
 *                               o que ele consultou por tras
 *
 *  🔴 RODA NA VPS, e nao e preferencia: o banco do sidecar resolve so em IPv6
 *     e a maquina do Pedro nao alcanca. Rodar isto de fora produz `ENOTFOUND`
 *     ou, pior, silencio — foi assim que um E2E "passou" em 21/09 sem nunca
 *     ter falado com o banco.
 *
 *  🔑 POR QUE DUAS TABELAS, E NAO UMA. `conversa.mensagem` guarda SO o que o
 *     usuario viu, de proposito: ela e reenviada inteira ao modelo a cada
 *     turno, e raciocinio interno ali multiplica o custo e faz o modelo imitar
 *     o proprio raciocinio como se fosse resposta. O que o roteador pensou vive
 *     em `conversa.turno_interno`, que nunca entra no historico.
 *
 *     Para saber POR QUE o Leo respondeu o que respondeu, precisa das duas.
 *
 *  Uso:
 *    node --env-file=.env scripts/ver-conversa.mjs            # ultima sessao
 *    node --env-file=.env scripts/ver-conversa.mjs 3          # ultimas 3
 * ════════════════════════════════════════════════════════════════════════════
 */

import pg from 'pg'

const QUANTAS = Number(process.argv[2] ?? 1)

const cliente = new pg.Client({ connectionString: process.env.DATABASE_URL })
await cliente.connect()

const { rows: sessoes } = await cliente.query(
  `SELECT s.id, s.aberta_em, count(m.id)::int AS turnos
     FROM conversa.sessao s
     LEFT JOIN conversa.mensagem m ON m.sessao_id = s.id
    GROUP BY s.id
    HAVING count(m.id) > 0
    ORDER BY max(m.criada_em) DESC
    LIMIT $1`,
  [QUANTAS],
)

if (!sessoes.length) {
  console.log('nenhuma sessao com mensagem.')
  await cliente.end()
  process.exit(0)
}

for (const s of sessoes.reverse()) {
  console.log(`\n${'═'.repeat(78)}`)
  console.log(`sessao ${s.id}  ·  ${s.turnos} mensagens  ·  aberta ${s.aberta_em.toISOString()}`)
  console.log('═'.repeat(78))

  /* O `turno_interno` se liga a mensagem do LEO (`mensagem_id`), entao o LEFT
     JOIN por id casa a resposta com o raciocinio dela. Turno do cliente vem
     com tudo nulo, que e o certo: o roteador nao pensa sobre a fala dele
     separadamente. */
  const { rows } = await cliente.query(
    `SELECT m.papel, m.texto, m.criada_em,
            t.saida, t.tools_chamadas, t.fatos_lidos, t.cartoes_usados,
            t.tecnica_ok, t.falha_tipo, t.tokens_entrada, t.tokens_saida
       FROM conversa.mensagem m
       LEFT JOIN conversa.turno_interno t ON t.mensagem_id = m.id
      WHERE m.sessao_id = $1
      ORDER BY m.id`,
    [s.id],
  )

  for (const r of rows) {
    const hora = r.criada_em.toISOString().slice(11, 19)
    const quem = r.papel === 'cliente' ? '👤 CLIENTE' : r.papel === 'leo' ? '🤖 LÉO' : '🧑 HUMANO'
    console.log(`\n${hora}  ${quem}`)
    console.log(r.texto.split('\n').map((l) => `   ${l}`).join('\n'))

    if (!r.saida) continue

    /* 🔑 A distincao que a coluna `tools_chamadas` existe para fazer: `{}` diz
       "nenhuma tool foi chamada" e NULL diz "turno gravado antes de a
       instrumentacao existir". Contar os dois como a mesma coisa reproduz
       exatamente o erro que a migration 09 veio corrigir. */
    const tools =
      r.tools_chamadas === null
        ? '(anterior à instrumentação)'
        : r.tools_chamadas.length
          ? r.tools_chamadas.join(' → ')
          : '🔴 NENHUMA'

    console.log(`      ┌ rota: ${r.saida}${r.falha_tipo ? ` · falha: ${r.falha_tipo}` : ''}`)
    console.log(`      ├ tools: ${tools}`)
    if (r.fatos_lidos?.length) console.log(`      ├ fatos: ${r.fatos_lidos.join(', ')}`)
    if (r.cartoes_usados?.length) console.log(`      ├ cartões: ${r.cartoes_usados.join(', ')}`)
    console.log(`      └ tokens: ${r.tokens_entrada ?? '?'} entrada · ${r.tokens_saida ?? '?'} saída`)
  }
}

console.log('')
await cliente.end()
