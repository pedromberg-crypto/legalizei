// ONDA 1 · o preâmbulo deixa de ser invisível.
//
// 🔴 O problema, medido em 22/09: `fatiarNota` corta no `##` e descarta tudo
// que vem antes do primeiro — `.slice(1)`. São 5.922 caracteres que nunca
// entraram na busca, e é no preâmbulo que moram as regras mais vermelhas: a
// tabela inteira dos 14 campos do dossiê (`08`), o aviso de que a ferramenta
// de CNAE não está ligada (`11`) e o "R$ 19 e R$ 79 expiraram" (`01`).
//
// 🔑 **Nenhuma palavra é reescrita.** O script só insere uma linha `## ` logo
// depois do `# Título`, e o preâmbulo passa a ser o corpo dessa seção. É a
// mudança de menor risco que existe nesta base: não muda conteúdo, não muda
// decisão, não precisa de contador.
//
// O título de cada seção é escolha de curadoria e está na tabela abaixo. Ele
// entra no vetor junto com o texto (`assunto + trecho`), então descrever o que
// a seção diz vale metade da chance de ser encontrada.
//
//   node scripts/onda1-preambulo.mjs            # ensaio
//   node scripts/onda1-preambulo.mjs --aplicar

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const REFERENCES = join(RAIZ, '_origem/vault-v12/skills-legalizai/base-legalizai/references')
const APLICAR = process.argv.includes('--aplicar')

/**
 * O título que cada preâmbulo ganha.
 *
 * Escritos como ASSUNTO, não como capítulo: "Os valores válidos hoje" é o que
 * alguém procura; "Introdução" não é procurado por ninguém.
 */
const TITULOS = {
  '00-DIRETRIZES-SEGURANCA': null, // preâmbulo é só o título do doc
  '01-PLANOS-E-OFERTAS': '0. Os valores válidos hoje, e os que expiraram',
  '02-PRODUTO-E-USABILIDADE': '0. O app está em pré-lançamento',
  '03-REGRAS-DOS-ORGAOS': '0. Por que cada pergunta do app existe',
  '04-QUEBRA-OBJECOES': '0. Como usar estes exemplos de resposta',
  '05-DICIONARIO-CNAE-TRIBUTARIO': '0. O que este dicionário decide, e o que não decide',
  '06-CALCULO-FISCAL': '0. Para que serve esta nota, e o que você nunca faz com ela',
  '07-OBRIGACOES-MENSAIS': null, // preâmbulo é só o título do doc
  '08-MAPA-DO-DOSSIE': '1. O que o app pede, campo a campo, e por quê',
  '09-ESCOPO-E-LIMITES': '0. Leia antes de qualquer promessa de venda',
  '10-CONTRATO-GARANTIA-CANCELAMENTO': '0. Como falar de contrato, garantia e cancelamento',
  '11-COMO-CONSULTAR-CNAE': '0. A ferramenta de CNAE ainda não está ligada',
  '12-GATE-DE-SAIDA': '0. Quando usar o gate de saída',
}

let tocados = 0
let caracteres = 0

for (const arquivo of readdirSync(REFERENCES).filter((f) => f.endsWith('.md')).sort()) {
  const base = arquivo.replace('.md', '')
  const titulo = TITULOS[base]
  const caminho = join(REFERENCES, arquivo)
  const texto = readFileSync(caminho, 'utf8')

  // o corpo, sem frontmatter
  const semFront = texto.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const inicioCorpo = texto.length - semFront.length

  const mTitulo = semFront.match(/^#\s+.+$/m)
  if (!mTitulo) {
    console.log(`  ⚠️  ${base}: sem título de documento, pulado`)
    continue
  }

  const depoisDoTitulo = mTitulo.index + mTitulo[0].length
  const atePrimeiroH2 = semFront.indexOf('\n## ', depoisDoTitulo)
  const preambulo = semFront
    .slice(depoisDoTitulo, atePrimeiroH2 < 0 ? undefined : atePrimeiroH2)
    .trim()

  if (!preambulo) {
    console.log(`  ⏭️  ${base}: preâmbulo vazio, nada a fazer`)
    continue
  }
  if (!titulo) {
    console.log(`  ⚠️  ${base}: tem ${preambulo.length} chars de preâmbulo e nenhum título na tabela`)
    continue
  }
  if (semFront.slice(depoisDoTitulo).trimStart().startsWith('## ')) {
    console.log(`  ⏭️  ${base}: já começa com seção`)
    continue
  }

  // 🔑 A única mudança: a linha do cabeçalho entra depois do título do doc.
  const corte = inicioCorpo + depoisDoTitulo
  const novo = texto.slice(0, corte) + `\n\n## ${titulo}\n` + texto.slice(corte)

  tocados++
  caracteres += preambulo.length
  console.log(`  📝 ${base}: ${preambulo.length} chars viram "## ${titulo}"`)

  if (APLICAR) writeFileSync(caminho, novo, 'utf8')
}

console.log(
  `\n${tocados} nota(s) · ${caracteres} caracteres saindo da invisibilidade` +
    (APLICAR ? '' : '\n\x1b[2m(ensaio. rode com --aplicar para valer)\x1b[0m'),
)
