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

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Embedder, Promessa } from '../tipos.js'

/**
 * Acha a raiz de `hermes-v2-sidecar/` subindo ate encontrar o arquivo de
 * cartoes.
 *
 * ⚠️ Nao e `join(AQUI, '..')` porque o codigo roda de dois lugares: do fonte
 * (`seed/*.ts`) e da saida compilada (`.build/seed/*.js`), e no segundo caso o
 * `..` aponta para dentro do `.build`, onde os markdowns nao existem. O
 * verificador quebrou exatamente assim na primeira execucao.
 */
function acharRaiz(inicio: string): string {
  let dir = inicio
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'CARTOES-PRODUTO.md'))) return dir
    dir = dirname(dir)
  }
  throw new Error(`nao achei a raiz do hermes-v2-sidecar subindo a partir de ${inicio}`)
}

const AQUI = dirname(fileURLToPath(import.meta.url))
export const RAIZ = acharRaiz(AQUI)
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
      // 🔴 O corte precisa parar TAMBEM no separador de secao (`---`) e no
      //    proximo titulo `##`, nao so no proximo campo.
      //
      //    Bug real, achado em 20/09 quando a carga no Supabase acusou
      //    violacao de CHECK: o ultimo cartao de cada secao engolia o
      //    cabecalho da secao seguinte. Sete cartoes (1.5, 2.8, 3.9, 4.7, 5.6,
      //    6.6 e 7.7) estavam com texto de outro assunto colado na restricao,
      //    e o 7.7 carregava o bloco inteiro de contexto da folha. Vetorizado
      //    assim, o cartao de reajuste de plano responderia pergunta de folha.
      const re = new RegExp(
        `\\*\\*${nome}\\.\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*(?:Estado|Ação|Restrição)\\.\\*\\*|\\n---|\\n## |$)`,
      )
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

/**
 * 🔴 O PREDICADO DO BANCO, ESCRITO UMA VEZ SO.
 *
 * E a mesma expressao dos CHECKs `cartao_sem_numero` e `nota_sem_numero`. Mora
 * aqui para que o verificador offline e a carga nunca discordem do banco: dois
 * predicados que deveriam ser iguais e um dia divergem silenciosamente sao a
 * forma classica de uma trava virar decoracao.
 */
export const PREDICADO_NUMERO = /(R\$|[0-9]+,[0-9]{2}|[0-9]+\s?%)/g

/** O travessao, proibido em todo texto que vira few-shot. */
export const PREDICADO_TRAVESSAO = /—/g

/**
 * SANITIZACAO DECLARADA, nao remocao cega.
 *
 * As notas do vault tem preco e percentual escritos dentro, e isso esta CERTO
 * la: elas sao a fonte que o humano le. O que nao pode e o numero atravessar
 * para o texto vetorizado, porque e assim que o agente para de consultar
 * `fatos` e volta a responder de memoria. Foi a regressao de 19/09, medida:
 * a nota de contrato foi aberta uma vez em seiscentas e trinta e duas chamadas
 * porque o prompt ja entregava a resposta.
 *
 * 🔑 O numero nao some, vira PONTEIRO. O trecho continua explicando a regra, e
 * a frase fica dizendo em voz alta que o valor se consulta. Apagar e sem
 * substituir produziria texto mutilado ("a multa e de sobre o saldo"), que e
 * pior: o agente completa o buraco sozinho.
 */
export function sanitizarNumeros(texto: string): string {
  return texto
    .replace(/R\$\s?[0-9][0-9.,]*/g, '«valor em fatos»')
    .replace(/[0-9]+(?:,[0-9]+)?\s?%/g, '«percentual em fatos»')
    .replace(/[0-9]+,[0-9]{2}/g, '«valor em fatos»')
    .replace(/R\$/g, '«valor em fatos»')
}

// ════════════════════════════════════════════════════════════════════════════
//  CARGA
// ════════════════════════════════════════════════════════════════════════════

export async function carregar(embedder: Embedder): Promise<void> {
  const { pool } = await import('../db.js')

  // Falha de cobranca ou de nome de modelo aparece AQUI, antes de abrir
  // transacao e antes de gastar a primeira chamada paga.
  const { verificarAcesso } = await import('../llm/gemini.js')
  await verificarAcesso()

  // ── Cartoes ───────────────────────────────────────────────────────────────
  const cartoes = parsearCartoes(readFileSync(join(RAIZ, 'CARTOES-PRODUTO.md'), 'utf8'))

  // 🔴 O portao. A lista de 58 e ratificada, e carga silenciosamente menor
  //    significa cartao que o agente deixou de enxergar sem ninguem notar.
  if (cartoes.length !== ESPERADO_CARTOES) {
    throw new Error(`esperado ${ESPERADO_CARTOES} cartoes, o parse achou ${cartoes.length}`)
  }

  /**
   * 🔑 COMMIT A CADA LOTE, nao no fim.
   *
   * Cada cartao custa uma chamada de rede ao modelo de embedding. Numa
   * transacao unica, um `402` no cartao 40 joga fora os 39 que ja tinham
   * vetor, e a proxima tentativa paga tudo de novo. Com lote pequeno, o
   * trabalho pago fica pago, e o `ON CONFLICT DO UPDATE` faz a retomada ser so
   * rodar o mesmo comando.
   */
  const LOTE = 10
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    for (const [i, c] of cartoes.entries()) {
      if (i > 0 && i % LOTE === 0) {
        await cliente.query('COMMIT')
        await cliente.query('BEGIN')
        process.stdout.write(`\r  cartoes: ${i}/${cartoes.length}`)
      }
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
  let trechosSanitizados = 0

  const clienteNotas = await pool.connect()
  try {
    await clienteNotas.query('BEGIN')
    for (const arquivo of arquivos) {
      const trechos = fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8'))
      for (const t of trechos) {
        const limpo = sanitizarNumeros(t.trecho)
        if (limpo !== t.trecho) trechosSanitizados++
        const vetor = await embedder.gerar(`${t.assunto}\n${limpo}`)

        // 🔴 SAVEPOINT por trecho, e isto nao e zelo: em PostgreSQL um
        //    statement que falha ABORTA A TRANSACAO INTEIRA. O `try/catch` do
        //    JavaScript nao desfaz esse estado, entao a versao anterior deste
        //    loop, rodando dentro de uma transacao, deixava um unico trecho
        //    recusado derrubar toda a carga, inclusive os cartoes que ja
        //    tinham entrado. Foi exatamente o que aconteceu no Supabase.
        await clienteNotas.query('SAVEPOINT trecho')
        try {
          await clienteNotas.query(
            `INSERT INTO conhecimento.nota (id, assunto, trecho, ordem, fonte, embedding)
             VALUES ($1,$2,$3,$4,$5,$6::vector)
             ON CONFLICT (id) DO UPDATE SET
               assunto = excluded.assunto, trecho = excluded.trecho,
               embedding = excluded.embedding, atualizado_em = current_date`,
            [t.id, t.assunto, limpo, t.ordem, arquivo, `[${vetor.join(',')}]`],
          )
          await clienteNotas.query('RELEASE SAVEPOINT trecho')
          trechosGravados++
        } catch (erro: any) {
          await clienteNotas.query('ROLLBACK TO SAVEPOINT trecho')
          if (erro?.constraint === 'nota_sem_numero') {
            console.warn(`[recusado] ${t.id}: sobrou numero depois da sanitizacao. Mover para fatos.`)
            continue
          }
          throw erro
        }
      }
    }
    await clienteNotas.query('COMMIT')
  } catch (erro) {
    await clienteNotas.query('ROLLBACK')
    throw erro
  } finally {
    clienteNotas.release()
  }

  console.log(
    `cartoes: ${cartoes.length} · trechos gravados: ${trechosGravados} · ` +
    `trechos sanitizados: ${trechosSanitizados}`,
  )
}

/**
 * Execucao direta: monta o Embedder de verdade e carrega.
 *
 * 🔴 Nao existe modo "sem embedder". Ja apareceu neste repo um script auxiliar
 * que carregava os cartoes com um vetor de zeros para "testar a insercao": com
 * vetor constante toda busca devolve a MESMA distancia, entao o banco enche, a
 * carga parece bem-sucedida e o agente passa a receber cartao aleatorio. Vetor
 * falso e pior que coluna vazia, porque coluna vazia o `WHERE embedding IS NOT
 * NULL` da busca exclui, e zero nao.
 */
if (process.argv[1]?.includes('carregar-conhecimento')) {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL nao definida (use `node --env-file=.env`)')
    process.exit(1)
  }
  const { criarEmbedder } = await import('../llm/gemini.js')
  carregar(criarEmbedder()).then(
    () => process.exit(0),
    (e) => { console.error('\n', e); process.exit(1) },
  )
}
