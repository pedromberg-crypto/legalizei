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

const ESPERADO_CARTOES = 55

/**
 * 🔴 O PORTAO DAS NOTAS (22/09).
 *
 * Os cartoes tinham o deles desde o inicio, e ele ja pagou: `esperado 58, o
 * parse achou N` derrubou carga errada mais de uma vez. As notas nao tinham
 * nenhum — parse que achasse 40 em vez de 63 carregava em silencio, porque
 * trecho que some nao grita.
 *
 * O numero mora em arquivo, e nao no codigo, de proposito: mudar a base e
 * normal, e o commit que muda o conteudo atualiza a contagem junto. Editar
 * este arquivo sozinho e o sinal de que alguma coisa se perdeu.
 */
export interface ContagemEsperada {
  cartoes: number
  arquivosDeNota: number
  trechos: number
}

/**
 * 🔴 EXPORTADA EM 25/09, e a razao e um bloqueio real de deploy.
 *
 * O `verificar-carga.ts` tinha o numero 58 CRAVADO no codigo, enquanto este
 * arquivo dizia 55. Os dois medem a mesma coisa, entao um dos dois so podia
 * estar errado: em 23/09 o commit `5f05a1e` fundiu 4 cartoes de folha em 1, de
 * proposito, e so a contagem foi atualizada. A trava ficou para tras, e nove
 * commits depois ela derrubou o `deploy:docs` inteiro por um motivo que nao
 * tinha nada a ver com o que estava sendo entregue.
 *
 * 🔑 Mesmo principio das colunas geradas da tabela de CNAE: duas coisas que
 * sao a mesma verdade nao divergem se so uma existir. O numero mora aqui.
 */
export function contagemEsperada(): ContagemEsperada {
  return JSON.parse(readFileSync(join(RAIZ, 'seed', 'contagem-esperada.json'), 'utf8'))
}

function conferirContagem(medido: { cartoes: number; arquivos: number; trechos: number }): void {
  const esperado = contagemEsperada()
  const divergencias: string[] = []
  if (medido.cartoes !== esperado.cartoes) {
    divergencias.push(`cartoes: esperava ${esperado.cartoes}, o parse achou ${medido.cartoes}`)
  }
  if (medido.arquivos !== esperado.arquivosDeNota) {
    divergencias.push(
      `arquivos de nota: esperava ${esperado.arquivosDeNota}, achou ${medido.arquivos}`,
    )
  }
  if (medido.trechos !== esperado.trechos) {
    divergencias.push(`trechos: esperava ${esperado.trechos}, o parse achou ${medido.trechos}`)
  }
  if (divergencias.length) {
    throw new Error(
      'a contagem nao bate com `seed/contagem-esperada.json`:\n  ' +
        divergencias.join('\n  ') +
        '\n\nSe a mudanca foi de proposito, atualize o arquivo NO MESMO COMMIT do conteudo.' +
        '\nSe nao foi, alguma coisa se perdeu no parse — procure `[descartado]` acima.',
    )
  }
}

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

    // 🔴 Verifica se sobrou texto solto entre os blocos capturados
    // O unico lugar onde texto solto pode se esconder e ser descartado, dado o 
    // RegExp do campo(), e entre o final dos metadados e o inicio do **Estado.**
    const matchEstado = bloco.match(/\*\*Estado\.\*\*/)
    if (matchEstado && meta.index !== undefined) {
      const fimMeta = meta.index + meta[0].length
      const textoSolto = bloco.slice(fimMeta, matchEstado.index).trim()
      if (textoSolto && !textoSolto.startsWith('<!--')) {
        throw new Error(`cartao ${cabecalho[1]} descarta texto solto fora dos campos: "${textoSolto.substring(0, 50)}..."`)
      }
    }

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
  const vistos = new Map<string, number>()

  return blocos
    .map((b) => {
      const linhas = b.split('\n')
      const secao = linhas[0].trim()
      const texto = linhas.slice(1).join('\n').trim()

      // 🔴 ID POR CONTEUDO, NAO POR POSICAO (22/09).
      //
      //    Era `${base}#${i + 1}`. Com indice, inserir uma secao no meio
      //    renomeia todas as seguintes: o upsert grava o texto novo por cima
      //    do id de outro assunto, e a contagem continua batendo. Numa base
      //    que vai ser reestruturada de 63 para ~130 trechos, isso e
      //    contaminacao silenciosa garantida.
      const raiz = `${base}#${apelido(secao)}`
      const repetido = vistos.get(raiz) ?? 0
      vistos.set(raiz, repetido + 1)

      return {
        id: repetido ? `${raiz}-${repetido + 1}` : raiz,
        assunto: `${tituloDoc} · ${secao}`,
        trecho: texto,
        ordem: vistos.size,
      }
    })
    .filter((t) => {
      // 🟡 Fatia curta nao some mais em silencio (22/09). Ela some — porque
      //    corpo de 40 caracteres nao sustenta um vetor —, mas AVISANDO. O
      //    descarte calado e o mesmo defeito do preambulo: some a fatia mais
      //    precisa que existe, que e a regra curta e direta.
      if (t.trecho.length > 40) return true
      console.warn(
        `[descartado] ${t.id} tem ${t.trecho.length} caracteres de corpo ` +
        `(minimo 40): "${t.assunto}"`,
      )
      return false
    })
}

/** Titulo de secao vira pedaco de id: minusculo, sem acento, sem pontuacao. */
function apelido(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'sem-titulo'
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

/**
 * VALIDA sem tocar no banco e sem gastar uma chamada de embedding.
 *
 * 🔑 Reusa o MESMO parser da carga de proposito. Um validador proprio seria
 * uma segunda implementacao da mesma regra, e a que envelhece em silencio e
 * sempre a copia — o `deploy:docs` passaria verde enquanto a carga na VPS
 * quebraria.
 *
 * Devolve as contagens para quem chamou conferir depois da carga remota: se o
 * numero medido aqui nao for o numero que o banco tem no fim, alguma coisa se
 * perdeu no caminho.
 */
export function validar(): { cartoes: number; arquivos: number; trechos: number; sanitizados: number } {
  // O parse dos cartoes ja carrega o portao dos 58 e o `throw` de campo
  // faltando — texto solto para aqui, nao no meio de um deploy.
  const cartoes = parsearCartoes(readFileSync(join(RAIZ, 'CARTOES-PRODUTO.md'), 'utf8'))
  if (cartoes.length !== ESPERADO_CARTOES) {
    throw new Error(`esperado ${ESPERADO_CARTOES} cartoes, o parse achou ${cartoes.length}`)
  }

  const arquivos = readdirSync(REFERENCES).filter((f) => f.endsWith('.md')).sort()
  let trechos = 0
  let sanitizados = 0
  for (const arquivo of arquivos) {
    for (const trecho of fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8'))) {
      trechos++
      if (sanitizarNumeros(trecho.trecho) !== trecho.trecho) sanitizados++
    }
  }

  const medido = { cartoes: cartoes.length, arquivos: arquivos.length, trechos }
  conferirContagem(medido)
  return { ...medido, sanitizados }
}

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
  // 🔑 O portao roda ANTES do primeiro embedding: carga errada que falha no
  //    fim ja pagou a conta inteira.
  {
    const arquivosDeNota = readdirSync(REFERENCES).filter((f) => f.endsWith('.md')).sort()
    let trechos = 0
    for (const arquivo of arquivosDeNota) {
      trechos += fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8')).length
    }
    conferirContagem({ cartoes: cartoes.length, arquivos: arquivosDeNota.length, trechos })
  }

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

  // ── 🔴 A LIMPEZA (22/09) ──────────────────────────────────────────────────
  //
  // A carga so fazia INSERT ... ON CONFLICT DO UPDATE. Linha que deixou de
  // existir no markdown FICAVA no banco para sempre, e continuava sendo
  // devolvida pela busca — texto velho convivendo com o novo, sem ninguem
  // notar, porque a contagem de gravados continuava batendo.
  //
  // Apaga por ULTIMO e so o que nao veio nesta carga: se a carga falhou no
  // meio, o `process.exit(1)` acontece antes daqui e nada e removido.
  const idsCartoes = cartoes.map((c) => c.id)
  const idsNotas: string[] = []
  for (const arquivo of arquivos) {
    for (const t of fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8'))) {
      idsNotas.push(t.id)
    }
  }

  const limpeza = await pool.connect()
  let orfaosCartao = 0
  let orfaosNota = 0
  try {
    const c = await limpeza.query(
      'DELETE FROM conhecimento.cartao WHERE id <> ALL($1::text[]) RETURNING id',
      [idsCartoes],
    )
    const n = await limpeza.query(
      'DELETE FROM conhecimento.nota WHERE id <> ALL($1::text[]) RETURNING id',
      [idsNotas],
    )
    orfaosCartao = c.rowCount ?? 0
    orfaosNota = n.rowCount ?? 0
    for (const linha of [...c.rows, ...n.rows]) {
      console.log(`[removido] ${linha.id} nao existe mais no markdown`)
    }
  } finally {
    limpeza.release()
  }

  console.log(
    `cartoes: ${cartoes.length} · trechos gravados: ${trechosGravados} · ` +
    `trechos sanitizados: ${trechosSanitizados} · ` +
    `orfaos removidos: ${orfaosCartao} cartao(oes) e ${orfaosNota} trecho(s)`,
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
  // `--so-validar` nao precisa de banco nem de chave: e parse puro. E o modo
  // que o `deploy:docs` roda ANTES de mandar qualquer coisa para a VPS.
  if (process.argv.includes('--so-validar')) {
    try {
      const r = validar()
      console.log(
        `✅ parse limpo · cartoes: ${r.cartoes} · arquivos de nota: ${r.arquivos} · ` +
        `trechos: ${r.trechos} · sanitizados: ${r.sanitizados}`,
      )
      console.log(`CONTAGEM ${JSON.stringify(r)}`)
      process.exit(0)
    } catch (e) {
      console.error('🔴 o conteudo NAO passa no parser estrito:\n', e)
      process.exit(1)
    }
  }

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
