// A TRAVA DOCUMENTAL — daqui para a VPS, nunca ao contrário.
//
// 🧭 O Obsidian é a fonte. Este script leva o que mudou até a VPS e faz a
// operação certa para cada tipo de documento:
//
//   CARTOES-PRODUTO.md · references/*.md  →  conhecimento  →  `npm run seed:rag`
//   PERSONA.md · RULES.md                 →  prompt        →  build + restart
//
// 🔴 Por que os dois caminhos existem: os prompts são COPIADOS para `.build/`
// pelo `copiar-prompts.mjs` e lidos pelo `router.js`; os cartões e as notas são
// fatiados, vetorizados e gravados no Postgres. Mandar o arquivo e rodar a
// carga não atualiza o prompt, e recompilar não atualiza o banco. Quem trocou
// o `RULES.md` e não viu efeito caiu nessa.
//
// Uso:
//   node scripts/deploy-docs.mjs            # mostra o que faria
//   node scripts/deploy-docs.mjs --aplicar  # faz

import { execFileSync, execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const VPS = 'legalize-vps'
const REMOTO = '/opt/hermes-v2-sidecar'
const VAULT_REMOTO = '/opt/legalizei-vault'
const REFERENCES = join('_origem', 'vault-v12', 'skills-legalizai', 'base-legalizai', 'references')

const APLICAR = process.argv.includes('--aplicar')

const passo = (t) => console.log(`\n\x1b[1m▸ ${t}\x1b[0m`)
const ok = (t) => console.log(`  ✅ ${t}`)
const aviso = (t) => console.log(`  ⚠️  ${t}`)
const morre = (t) => {
  console.error(`\n🔴 ${t}\n`)
  process.exit(1)
}

/* 🔴 ESTE SCRIPT RODA DA MAQUINA DO PEDRO, NUNCA DE DENTRO DA VPS (25/09).
   `legalize-vps` e apelido do `~/.ssh/config` local: dentro da VPS ele nao
   resolve, e o que aparece e `Temporary failure in name resolution` com stack
   trace de 15 linhas, que nao diz o que fazer. E o pior e que a pessoa ja fez
   a coisa certa antes de chegar aqui: o `git pull` na VPS ja colocou os
   arquivos no lugar, entao o envio e redundante e so falta a carga. */
if (existsSync(VAULT_REMOTO)) {
  console.error(
    `\n🔴 Este script roda da máquina local, não de dentro da VPS.\n\n` +
      `   Ele existe para LEVAR o conteúdo daqui para lá, e aqui é lá.\n` +
      `   O \`git pull\` que você já deu colocou os arquivos no lugar.\n\n` +
      `   O que falta é só a carga:\n\n` +
      `       npm run seed:rag       # cartões e notas, vetorizados\n\n` +
      `   Se você mexeu em PERSONA.md ou RULES.md, eles são prompt e não banco:\n` +
      `   aí é \`npm run build\` e reiniciar o serviço.\n`,
  )
  process.exit(1)
}

const noVps = (cmd) =>
  execFileSync('ssh', ['-o', 'ConnectTimeout=20', VPS, cmd], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })

// 🔴 md5 do conteudo SEM os retornos de carro, e nao dos bytes crus. A copia
// de trabalho do Windows fica em CRLF; a da VPS, em LF. Comparar byte a byte
// marcaria os 5 arquivos como "mudaram" em toda execucao — e, pior, o envio
// empurraria CRLF para dentro do Linux, que e o mesmo defeito que ja custou
// um conflito falso de 520 linhas em 21/09.
const CR = String.fromCharCode(13)
const semCR = (buf) => Buffer.from(buf.toString('utf8').split(CR).join(''), 'utf8')
const md5 = (buf) => createHash('md5').update(semCR(buf)).digest('hex')

// ── 1 · o parser estrito, antes de qualquer rede ────────────────────────────
passo('1 · validando o conteúdo com o MESMO parser da carga')

execSync('npm run build', { cwd: RAIZ, stdio: 'pipe' })

let contagemLocal
try {
  const saida = execSync('node .build/seed/carregar-conhecimento.js --so-validar', {
    cwd: RAIZ,
    encoding: 'utf8',
  })
  const linha = saida.split('\n').find((l) => l.startsWith('CONTAGEM '))
  contagemLocal = JSON.parse(linha.slice('CONTAGEM '.length))
  ok(
    `parse limpo · ${contagemLocal.cartoes} cartões · ${contagemLocal.arquivos} arquivos de nota · ` +
      `${contagemLocal.trechos} trechos`,
  )
} catch (e) {
  morre(
    'o conteúdo NÃO passa no parser estrito. Nada foi enviado.\n\n' +
      String(e.stdout ?? '') + String(e.stderr ?? ''),
  )
}

try {
  execSync('node .build/seed/verificar-carga.js', { cwd: RAIZ, stdio: 'pipe' })
  ok('os dois CHECKs do schema passariam')
} catch (e) {
  morre(
    'o banco recusaria este conteúdo (verificar-carga). Nada foi enviado.\n\n' +
      String(e.stdout ?? ''),
  )
}

// ── 2 · a VPS não pode ter trabalho pendente ────────────────────────────────
passo('2 · conferindo que a VPS não tem trabalho não commitado')

const sujo = noVps(
  `cd ${VAULT_REMOTO} && git status --porcelain hermes-v2-sidecar | grep -v '\\.bak' || true`,
).trim()

if (sujo) {
  morre(
    'a VPS tem mudança não commitada no sidecar. Enviar por cima APAGA esse trabalho.\n' +
      'Resolva lá primeiro (commit + push, ou descarte consciente):\n\n' +
      sujo,
  )
}
ok('árvore da VPS limpa (os .bak-pre-* não contam)')

// ── 3 · o que mudou, medido por md5 ─────────────────────────────────────────
passo('3 · comparando arquivo a arquivo')

const conhecimento = [
  'CARTOES-PRODUTO.md',
  ...readdirSync(join(RAIZ, REFERENCES))
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => join(REFERENCES, f).replaceAll('\\', '/')),
]
const prompts = ['PERSONA.md', 'RULES.md']
const todos = [...conhecimento, ...prompts]

// O `tr -d \\r` do lado de lá é o espelho do `semCR` daqui.
const md5Remoto = Object.fromEntries(
  noVps(
    `cd ${REMOTO} && for f in ${todos.map((f) => `'${f}'`).join(' ')}; do ` +
      `[ -f "$f" ] && echo "$(tr -d '\\r' < "$f" | md5sum | cut -d" " -f1)  $f"; done || true`,
  )
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [hash, ...resto] = l.trim().split(/\s+/)
      return [resto.join(' '), hash]
    }),
)

const mudaram = todos.filter((f) => {
  const local = md5(readFileSync(join(RAIZ, f)))
  return local !== md5Remoto[f]
})

if (!mudaram.length) {
  ok('nada mudou — a VPS já está com o conteúdo desta máquina')
  process.exit(0)
}

const mudouConhecimento = mudaram.some((f) => conhecimento.includes(f))
const mudouPrompt = mudaram.some((f) => prompts.includes(f))

for (const f of mudaram) console.log(`  📝 ${f}${md5Remoto[f] ? '' : '  (novo lá)'}`)
console.log(
  `\n  → conhecimento: ${mudouConhecimento ? 'SIM · roda seed:rag' : 'não'}` +
    `\n  → prompt: ${mudouPrompt ? 'SIM · build + restart' : 'não'}`,
)

if (!APLICAR) {
  console.log('\n\x1b[2m(ensaio. rode com --aplicar para valer)\x1b[0m')
  process.exit(0)
}

// ── 4 · envio ───────────────────────────────────────────────────────────────
// `tar` por ssh em vez de rsync: o Git Bash do Windows não traz rsync, e um
// caminho que só funciona em uma máquina é um caminho que vai falhar na outra.
passo('4 · enviando os arquivos que mudaram')

// Arquivo a arquivo, convertendo CRLF → LF no caminho. Markdown que chega em
// CRLF no Linux não quebra o parser, mas suja todo `git status` e todo diff
// futuro — e foi assim que um conflito de 520 linhas nasceu sem uma linha de
// conteúdo ter mudado.
for (const f of mudaram) {
  const conteudo = semCR(readFileSync(join(RAIZ, f)))
  execFileSync(
    'ssh',
    ['-o', 'ConnectTimeout=20', VPS, `mkdir -p "${REMOTO}/${dirname(f)}" && cat > "${REMOTO}/${f}"`],
    { input: conteudo },
  )
  console.log(`  ↑ ${f}`)
}
ok(`${mudaram.length} arquivo(s) enviado(s), em LF`)

// ── 5 · a operação certa para cada tipo ─────────────────────────────────────
if (mudouPrompt) {
  passo('5a · prompt mudou → build + restart')
  console.log(noVps(`cd ${REMOTO} && npm run check >/dev/null && npm run build 2>&1 | tail -2`))
  console.log(
    noVps(
      'export XDG_RUNTIME_DIR=/run/user/0; systemctl --user restart leo-sidecar; sleep 4; ' +
        'systemctl --user is-active leo-sidecar; ' +
        'journalctl --user -u leo-sidecar -n 2 --no-pager | tail -1',
    ),
  )
}

if (mudouConhecimento) {
  passo('5b · conhecimento mudou → carga no Postgres')
  aviso('cada cartão custa uma chamada de embedding; o commit é por lote de 10')
  console.log(noVps(`cd ${REMOTO} && npm run seed:rag 2>&1 | tail -4`))
}

// ── 6 · a prova: o banco tem o que o parser contou? ─────────────────────────
passo('6 · conferindo o banco contra a contagem local')

const contagemRemota = JSON.parse(
  noVps(
    `cd ${REMOTO} && node --env-file=.env --input-type=module -e ` +
      `"const {pool}=await import('${REMOTO}/.build/db.js');` +
      `const r=await pool.query('select (select count(*)::int from conhecimento.cartao) cartoes,` +
      ` (select count(*)::int from conhecimento.nota) trechos');` +
      `console.log(JSON.stringify(r.rows[0]));await pool.end()"`,
  )
    .trim()
    .split('\n')
    .pop(),
)

const bateCartoes = contagemRemota.cartoes === contagemLocal.cartoes
const bateTrechos = contagemRemota.trechos === contagemLocal.trechos

console.log(
  `  cartões · aqui ${contagemLocal.cartoes} · lá ${contagemRemota.cartoes} ${bateCartoes ? '✅' : '🔴'}\n` +
    `  trechos · aqui ${contagemLocal.trechos} · lá ${contagemRemota.trechos} ${bateTrechos ? '✅' : '🔴'}`,
)

if (!bateCartoes || !bateTrechos) {
  morre(
    'o banco não tem o que o parser contou. Alguma linha foi recusada na carga — ' +
      'procure `[recusado]` na saída do passo 5b.',
  )
}

console.log('\n✅ documentação da VPS em dia com esta máquina.\n')
