/**
 * ════════════════════════════════════════════════════════════════════════════
 *  seed/carregar-conhecimento.ts  ·  o combustivel vetorial
 *
 *  Le `CARTOES-PRODUTO.md` e as notas de `_origem/.../references/`, fatia,
 *  vetoriza e grava em `conhecimento.cartao` e `conhecimento.nota`.
 *
 *  🔴 O QUE SE EMBEDA E `titulo + estado`, E ISSO NAO E DETALHE.
 *
 *  A mensagem do cliente descreve uma SITUACAO ("perdi o prazo da guia"), nao
 *  uma funcionalidade. O campo `estado` do cartao e escrito nessa lingua. Se a
 *  `acao` entrar no vetor, ele e arrastado para o vocabulario do produto e se
 *  afasta do vocabulario de quem pergunta, que e justamente quem faz a busca.
 *  `acao` e `restricao` sao payload: voltam inteiras, nunca sao pesquisadas.
 *  A coluna gerada `busca` no schema existe para deixar isso explicito no banco.
 *
 *  Uso:
 *    DATABASE_URL=... node --experimental-strip-types seed/carregar-conhecimento.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Embedder, Promessa } from '../tipos.js'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = join(AQUI, '..')
const REFERENCES = join(RAIZ, '_origem', 'vault-v12', 'skills-legalizai', 'base-legalizai', 'references')

const ESPERADO_CARTOES = 58

// ════════════════════════════════════════════════════════════════════════════
//  PARSE  ·  funcoes puras, para poderem ser conferidas sem banco
// ════════════════════════════════════════════════════════════════════════════

export interface CartaoParseado {
  id: string
  secao: string
  titulo: string
  estado: string
  acao: string
  restricao: string
  promessa: Promessa
  ondeNoApp: string | null
}

/**
 * Formato de um cartao, exatamente como o `CARTOES-PRODUTO.md` escreve:
 *
 *   ### 2.1 · O DAS do mes
 *   `secao: impostos` · `promessa: pode` · `onde: aba de impostos`
 *
 *   **Estado.** ...
 *   **Acao.** ...
 *   **Restricao.** ...
 */
export function parsearCartoes(markdown: string): CartaoParseado[] {
  const blocos = markdown.split(/^### /m).slice(1)
  const cartoes: CartaoParseado[] = []

  for (const bloco of blocos) {
    const cabecalho = bloco.match(/^([0-9]+\.[0-9]+)\s*·\s*(.+)$/m)
    const meta = bloco.match(/`secao:\s*([^`]+)`\s*·\s*`promessa:\s*(pode|parcial|nao)`(?:\s*·\s*`onde:\s*([^`]+)`)?/)
    if (!cabecalho || !meta) continue

    const campo = (nome: string) => {
      const re = new RegExp(`\\*\\*${nome}\\.\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*(?:Estado|Ação|Restrição)\\.\\*\\*|$)`)
      const m = bloco.match(re)
      return m ? m[1].trim().replace(/\s*\n\s*/g, ' ') : ''
    }

    const estado = campo('Estado')
    const acao = campo('Ação')
    const restricao = campo('Restrição')

    // 🔴 Cartao incompleto NAO entra pela metade. Um cartao sem restricao e
    //    exatamente o cartao que faz o agente prometer o que nao existe.
    if (!estado || !acao || !restricao) {
      throw new Error(`cartao ${cabecalho[1]} esta incompleto: faltou Estado, Acao ou Restricao`)
    }

    cartoes.push({
      id: cabecalho[1],
      titulo: cabecalho[2].trim(),
      secao: meta[1].trim(),
      promessa: meta[2] as Promessa,
      ondeNoApp: meta[3]?.trim() ?? null,
      estado, acao, restricao,
    })
  }

  return cartoes
}

/** Tira o frontmatter YAML, que e metadado de vault e nao e conhecimento. */
function semFrontmatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n/, '')
}

export interface TrechoParseado {
  id: string
  assunto: string
  trecho: string
  ordem: number
}

/**
 * Fatia uma nota por secao `##`.
 *
 * 🔴 CADA TRECHO CARREGA O TITULO DO ARQUIVO JUNTO. Depois de vetorizado o
 * chunk viaja sozinho: quem o recupera nao ve o cabecalho da nota. Um trecho
 * que diz "o valor esta no §2" sem dizer de que documento e um trecho inutil,
 * e foi assim que a versao anterior do vault ficou com bastidor no corpo.
 */
export function fatiarNota(nomeArquivo: string, markdown: string): TrechoParseado[] {
  const corpo = semFrontmatter(markdown)
  const tituloDoc = corpo.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? nomeArquivo
  const base = basename(nomeArquivo, '.md')

  const blocos = corpo.split(/^## /m).slice(1)
  return blocos
    .map((b, i) => {
      const linhas = b.split('\n')
      const secao = linhas[0].trim()
      const texto = linhas.slice(1).join('\n').trim()
      return {
        id: `${base}#${i + 1}`,
        assunto: `${tituloDoc} · ${secao}`,
        trecho: texto,
        ordem: i + 1,
      }
    })
    .filter((t) => t.trecho.length > 40)
}

// ════════════════════════════════════════════════════════════════════════════
//  CARGA
// ════════════════════════════════════════════════════════════════════════════

export async function carregar(embedder: Embedder): Promise<void> {
  const { pool } = await import('../db.js')

  // ── Cartoes ───────────────────────────────────────────────────────────────
  const cartoes = parsearCartoes(readFileSync(join(RAIZ, 'CARTOES-PRODUTO.md'), 'utf8'))

  // 🔴 O portao. A lista de 58 e ratificada, e carga silenciosamente menor
  //    significa cartao que o agente deixou de enxergar sem ninguem notar.
  if (cartoes.length !== ESPERADO_CARTOES) {
    throw new Error(`esperado ${ESPERADO_CARTOES} cartoes, o parse achou ${cartoes.length}`)
  }

  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    for (const c of cartoes) {
      const vetor = await embedder.gerar(`${c.titulo}\n${c.estado}`)
      await cliente.query(
        `INSERT INTO conhecimento.cartao
           (id, secao, titulo, estado, acao, restricao, promessa, onde_no_app, fonte, embedding)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::vector)
         ON CONFLICT (id) DO UPDATE SET
           secao = excluded.secao, titulo = excluded.titulo, estado = excluded.estado,
           acao = excluded.acao, restricao = excluded.restricao,
           promessa = excluded.promessa, onde_no_app = excluded.onde_no_app,
           embedding = excluded.embedding, atualizado_em = current_date`,
        [c.id, c.secao, c.titulo, c.estado, c.acao, c.restricao, c.promessa,
         c.ondeNoApp, 'CARTOES-PRODUTO.md', `[${vetor.join(',')}]`],
      )
    }
    await cliente.query('COMMIT')
  } catch (erro) {
    await cliente.query('ROLLBACK')
    // ⚠️ O CHECK `cartao_sem_numero` estoura aqui se um valor vazou para o
    //    texto. Isso e a trava funcionando, nao falha de carga.
    throw erro
  } finally {
    cliente.release()
  }

  // ── Notas ─────────────────────────────────────────────────────────────────
  const arquivos = readdirSync(REFERENCES).filter((f) => f.endsWith('.md')).sort()
  let trechosGravados = 0

  for (const arquivo of arquivos) {
    const trechos = fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8'))
    for (const t of trechos) {
      const vetor = await embedder.gerar(`${t.assunto}\n${t.trecho}`)
      try {
        await pool.query(
          `INSERT INTO conhecimento.nota (id, assunto, trecho, ordem, fonte, embedding)
           VALUES ($1,$2,$3,$4,$5,$6::vector)
           ON CONFLICT (id) DO UPDATE SET
             assunto = excluded.assunto, trecho = excluded.trecho,
             embedding = excluded.embedding, atualizado_em = current_date`,
          [t.id, t.assunto, t.trecho, t.ordem, arquivo, `[${vetor.join(',')}]`],
        )
        trechosGravados++
      } catch (erro: any) {
        // 🔑 Aqui o CHECK `nota_sem_numero` VAI estourar, e e esperado: as notas
        //    do vault tem preco escrito dentro. Elas sao a fonte humana, nao a
        //    fonte do agente. O trecho recusado precisa ter o numero movido
        //    para `fatos` antes de entrar. Recusa ruidosa e o ponto: carga que
        //    ignora o erro repoe exatamente a regressao de 19/09.
        if (erro?.constraint === 'nota_sem_numero') {
          console.warn(`[recusado] ${t.id} tem numero no texto. Mover para fatos antes de vetorizar.`)
          continue
        }
        throw erro
      }
    }
  }

  console.log(`cartoes: ${cartoes.length} · trechos de nota gravados: ${trechosGravados}`)
}

// Execucao direta: exige um Embedder de verdade, injetado por quem chama.
if (process.argv[1] && process.argv[1].endsWith('carregar-conhecimento.ts')) {
  console.error(
    'Este script precisa de um Embedder. Importe `carregar(embedder)` do seu bootstrap,\n' +
    'onde o provedor de embedding esta configurado. A dimensao TEM que bater com\n' +
    '`vector(1536)` do schema: trocar de modelo e recarga, nao ALTER.',
  )
  process.exit(1)
}
