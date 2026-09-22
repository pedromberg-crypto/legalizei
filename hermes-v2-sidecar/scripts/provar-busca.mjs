// TESTE 1 · a busca do `buscar_base` ACHA? — sem modelo no laço.
//
// 🧭 O `buscar_base` deu ZERO chamada em quatro medições seguidas. Três causas
// são possíveis, e só uma delas é cara de testar:
//
//   A) o modelo não ESCOLHE a ferramenta   → precisa de conversa (E2E, caro)
//   B) o roteador não OFERECE a ferramenta → precisa de conversa (E2E, caro)
//   C) a busca não ACHA                    → é ISTO AQUI, e custa centavos
//
// Este script responde só o (C): para cada pergunta, gera o vetor e pergunta ao
// Postgres quais trechos voltam. Uma chamada de embedding por pergunta, nenhuma
// geração de texto.
//
// 🔑 Por que isto vem primeiro: se a busca não acha, chamar a ferramenta não
// adiantaria — e nos relatórios "chamou e voltou vazio" aparece igual a "não
// chamou". Eram quatro medições em zero; podem não ser a mesma coisa.
//
// 🔴 RODA NA VPS. O banco do sidecar (`db.*.supabase.co`) só resolve em IPv6, e
// a máquina do Pedro não alcança — foi isso que fez o E2E local dar falso
// negativo em 21/09.
//
//   cd /opt/hermes-v2-sidecar && npm run build
//   node --env-file=.env scripts/provar-busca.mjs

import { pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const carregar = (p) => import(pathToFileURL(join(RAIZ, '.build', p)).href)

// ── as perguntas ────────────────────────────────────────────────────────────
//
// Escritas a partir do que as 13 notas de referência COBREM, não do que eu
// imagino que elas cobrem — cada `esperado` é o arquivo que deveria responder.
// Redação de cliente, não de documentação: é assim que a pergunta chega.
const PERGUNTAS = [
  { pergunta: 'preciso de alvará da prefeitura pra abrir a empresa?', esperado: '03-REGRAS-DOS-ORGAOS' },
  { pergunta: 'quanto tempo a junta comercial demora pra registrar?', esperado: '03-REGRAS-DOS-ORGAOS' },
  { pergunta: 'quais planos vocês têm e o que vem em cada um?', esperado: '01-PLANOS-E-OFERTAS' },
  { pergunta: 'essa promoção vale até quando?', esperado: '01-PLANOS-E-OFERTAS' },
  { pergunta: 'se eu quiser cancelar depois de três meses, pago multa?', esperado: '10-CONTRATO-GARANTIA-CANCELAMENTO' },
  { pergunta: 'tá caro, o contador aqui do bairro cobra menos', esperado: '04-QUEBRA-OBJECOES' },
  { pergunta: 'o que eu preciso pagar todo mês depois que abrir?', esperado: '07-OBRIGACOES-MENSAIS' },
  { pergunta: 'quais documentos vocês vão me pedir?', esperado: '08-MAPA-DO-DOSSIE' },
  { pergunta: 'vocês atendem quem tem loja de roupa?', esperado: '09-ESCOPO-E-LIMITES' },
  { pergunta: 'como faço pra entrar na lista de espera?', esperado: '12-GATE-DE-SAIDA' },
]

// ── execução ────────────────────────────────────────────────────────────────
const { criarEmbedder } = await carregar('llm/gemini.js')
const db = await carregar('db.js')

const embedder = criarEmbedder()
const LIMITE = 4 // o mesmo que a tool usa em `tools.ts`

console.log(`\n🔎 ${PERGUNTAS.length} perguntas · ${LIMITE} trechos por busca · fonte: conhecimento.nota\n`)

let acertos = 0
let noTopo = 0
const falhas = []

for (const { pergunta, esperado } of PERGUNTAS) {
  const vetor = await embedder.gerar(pergunta)
  const linhas = await db.buscarNota(vetor, LIMITE)

  const fontes = linhas.map((l) => String(l.id).split('#')[0])
  const posicao = fontes.findIndex((f) => f.includes(esperado))

  const marca = posicao === 0 ? '✅' : posicao > 0 ? '🟡' : '🔴'
  if (posicao === 0) { acertos++; noTopo++ } else if (posicao > 0) acertos++
  else falhas.push({ pergunta, esperado, veio: fontes })

  const dist = linhas[0]?.distancia?.toFixed(3) ?? '—'
  console.log(`${marca} ${pergunta}`)
  console.log(`   esperado: ${esperado}${posicao >= 0 ? ` · voltou na posição ${posicao + 1}` : ' · NÃO VOLTOU'}`)
  console.log(`   veio: ${fontes.join(' · ') || '(nada)'}  ·  distância do 1º: ${dist}\n`)
}

// ── veredito ────────────────────────────────────────────────────────────────
console.log('─'.repeat(70))
console.log(
  `achou em algum lugar dos ${LIMITE}: ${acertos}/${PERGUNTAS.length}  ·  ` +
    `achou em 1º: ${noTopo}/${PERGUNTAS.length}`,
)

if (falhas.length === 0) {
  console.log(
    '\n✅ A BUSCA ACHA. Então o `buscar_base` em zero NÃO é problema de busca —\n' +
      '   é escolha do modelo (descrição da tool) ou oferta do roteador.\n' +
      '   O próximo teste é o caro, e agora se sabe o que ele tem de medir.\n',
  )
} else {
  console.log(`\n🔴 ${falhas.length} pergunta(s) não acharam o trecho certo:\n`)
  for (const f of falhas) console.log(`   "${f.pergunta}"\n     esperava ${f.esperado}, veio ${f.veio.join(' · ')}`)
  console.log(
    '\n   Aqui chamar a tool não adiantaria: ela voltaria o trecho errado.\n' +
      '   O conserto é de CONTEÚDO (a nota não cobre o assunto) ou de FATIA\n' +
      '   (o trecho é grande demais e o vetor virou média de vários assuntos).\n',
  )
}

await db.pool.end()
process.exit(falhas.length ? 1 : 0)
