// TESTE 1 · a busca do `buscar_base` ACHA? — sem modelo no laço.
//
// 🧭 O `buscar_base` deu ZERO chamada em quatro medições seguidas. Três causas
// são possíveis, e só uma delas é barata de testar:
//
//   A) o modelo não ESCOLHE a ferramenta   → precisa de conversa (E2E, caro)
//   B) o roteador não OFERECE a ferramenta → precisa de conversa (E2E, caro)
//   C) a busca não ACHA                    → é ISTO AQUI, e custa centavos
//
// Uma chamada de embedding por pergunta, nenhuma geração de texto.
//
// 🔑 Por que vem primeiro: se a busca não acha, chamar a ferramenta não
// adiantaria — e nos relatórios "chamou e voltou vazio" aparece igual a "não
// chamou". Eram quatro medições em zero; podem não ser a mesma coisa.
//
// 🔴 RODA NA VPS. O banco do sidecar (`db.*.supabase.co`) só resolve em IPv6 e
// a máquina do Pedro não alcança — foi isso que fez o E2E local dar falso
// negativo em 21/09.
//
// 📄 A saída vai para ARQUIVO, não para a conversa: `reports/busca-*.md` mais
// uma linha em `reports/_historico-busca.jsonl`. Relatório relido num contexto
// de modelo é token queimado a cada turno; em disco, é evidência que dá para
// comparar com a rodada seguinte.
//
//   cd /opt/hermes-v2-sidecar && npm run build
//   node --env-file=.env scripts/provar-busca.mjs
//
// As perguntas moram em `scripts/perguntas-busca.json` — acrescentar caso não
// exige tocar neste arquivo.

import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const carregar = (p) => import(pathToFileURL(join(RAIZ, '.build', p)).href)

const { perguntas: PERGUNTAS } = JSON.parse(
  readFileSync(join(RAIZ, 'scripts', 'perguntas-busca.json'), 'utf8'),
)

const LIMITE = 4 // o mesmo que a tool usa em `tools.ts`

// ── execução ────────────────────────────────────────────────────────────────
const { criarEmbedder } = await carregar('llm/gemini.js')
const db = await carregar('db.js')
const embedder = criarEmbedder()

console.log(`🔎 ${PERGUNTAS.length} perguntas · ${LIMITE} trechos por busca`)

const linhas = []
for (const { pergunta, esperado } of PERGUNTAS) {
  const vetor = await embedder.gerar(pergunta)
  const achados = await db.buscarNota(vetor, LIMITE)
  const fontes = achados.map((a) => String(a.id).split('#')[0])
  const posicao = fontes.findIndex((f) => f.includes(esperado))

  linhas.push({
    pergunta,
    esperado,
    posicao: posicao + 1, // 0 = não veio
    marca: posicao === 0 ? '✅' : posicao > 0 ? '🟡' : '🔴',
    veio: fontes,
    distancia: Number(achados[0]?.distancia?.toFixed(3) ?? 0),
    assuntoDoPrimeiro: achados[0]?.assunto ?? null,
  })
  process.stdout.write(linhas.at(-1).marca)
}
console.log('')

const noTopo = linhas.filter((l) => l.posicao === 1).length
const entreOs4 = linhas.filter((l) => l.posicao >= 1).length
const falhas = linhas.filter((l) => l.posicao === 0)

// ── relatório ───────────────────────────────────────────────────────────────
const agora = new Date().toISOString().slice(0, 16).replace('T', ' ')
const carimbo = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '').replace(' ', '-')
let commit = '(sem git)'
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: RAIZ, encoding: 'utf8' }).trim()
} catch {}

const md = `# 🔎 A busca acha? — ${agora} UTC

> **GERADO** por \`scripts/provar-busca.mjs\` · commit \`${commit}\` · ${PERGUNTAS.length} perguntas · ${LIMITE} trechos por busca.
>
> 🧭 **O que este relatório responde, e só isto:** se o texto da base é
> ALCANÇÁVEL pela pergunta do cliente. Ele **não** diz se o Léo chama a
> ferramenta — isso é o E2E, e é outro custo.
>
> **Como ler:** ✅ veio em 1º · 🟡 veio entre os ${LIMITE} (a tool devolve ${LIMITE}, então o
> Léo recebe o trecho certo mesmo assim) · 🔴 não veio, e aí **chamar a tool não
> adiantaria**.

## Placar

| | |
|---|---:|
| Em 1º lugar | **${noTopo}/${PERGUNTAS.length}** |
| Entre os ${LIMITE} | **${entreOs4}/${PERGUNTAS.length}** |
| Não achou | **${falhas.length}** |

${
  falhas.length === 0
    ? '✅ **A busca acha.** Então `buscar_base` em zero não é problema de busca — é escolha do modelo (descrição da tool) ou oferta do roteador. O teste caro agora sabe o que medir.'
    : `🔴 **${falhas.length} pergunta(s) não acham o trecho certo.** Aqui a tool voltaria conteúdo errado. O conserto é de **conteúdo** (a nota não cobre o assunto na língua do cliente) ou de **fatia** (o trecho é grande e o vetor virou média de vários assuntos).`
}

## Pergunta a pergunta

| | Pergunta | Esperado | Posição | O que voltou | Distância do 1º |
|:--:|---|---|:--:|---|---:|
${linhas
  .map(
    (l) =>
      `| ${l.marca} | ${l.pergunta} | \`${l.esperado}\` | ${l.posicao || '—'} | ${l.veio.map((v) => `\`${v}\``).join(' · ')} | ${l.distancia} |`,
  )
  .join('\n')}

${
  falhas.length
    ? `## O que não achou\n\n${falhas
        .map(
          (f) =>
            `### 🔴 "${f.pergunta}"\n\n| | |\n|---|---|\n| Esperava | \`${f.esperado}\` |\n| Veio | ${f.veio.map((v) => `\`${v}\``).join(' · ')} |\n| Assunto do 1º | ${f.assuntoDoPrimeiro ?? '—'} |\n| Distância do 1º | ${f.distancia} |\n`,
        )
        .join('\n')}`
    : ''
}
## O que este teste NÃO prova

- **Que o Léo chama a ferramenta.** Prova que, se chamasse, viria conteúdo útil.
- **Que o trecho responde bem.** Prova que ele é alcançado, não que está certo.
- **Nada sobre as outras 7 tools** — só o \`buscar_base\`.
`

const pasta = join(RAIZ, 'reports')
mkdirSync(pasta, { recursive: true })
const arquivo = join(pasta, `busca-${carimbo}.md`)
writeFileSync(arquivo, md, 'utf8')

appendFileSync(
  join(pasta, '_historico-busca.jsonl'),
  JSON.stringify({
    quando: new Date().toISOString(),
    commit,
    perguntas: PERGUNTAS.length,
    noTopo,
    entreOs4,
    falhas: falhas.map((f) => f.pergunta),
  }) + '\n',
  'utf8',
)

console.log(`\n📄 ${arquivo}`)
console.log(`   em 1º: ${noTopo}/${PERGUNTAS.length} · entre os ${LIMITE}: ${entreOs4}/${PERGUNTAS.length} · não achou: ${falhas.length}`)

await db.pool.end()
process.exit(falhas.length ? 1 : 0)
