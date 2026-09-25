/**
 * ════════════════════════════════════════════════════════════════════════════
 *  seed/carregar-cnae.ts  ·  as 1.332 linhas da matriz, por rede
 *
 *  Substitui o `\copy` do `02-cnae.sql` para quem carrega em banco remoto
 *  (Supabase). `\copy` e comando do cliente `psql`: ele le o arquivo na maquina
 *  local e empurra pela conexao. Nenhum driver o interpreta, entao rodar aquele
 *  arquivo por `pg` deixa a tabela vazia sem erro claro. Foi o que aconteceu.
 *
 *  🔴 O PARSER DE CSV E PROPRIO, E ISSO E DELIBERADO.
 *
 *  Nao por avareza de dependencia: por controle. As descricoes oficiais do CNAE
 *  tem virgula, aspas e quebra de linha DENTRO do campo, e a matriz tem 40
 *  colunas. Um split por virgula entra deslocado e coloca o anexo de um CNAE no
 *  campo do outro, CALADO. Num dado que decide enquadramento, esse e o pior
 *  tipo de defeito, porque o resultado parece certo.
 *
 *  Por isso o parser e RFC 4180 de verdade (aspas, aspas escapadas, quebra de
 *  linha dentro do campo) e a carga so prossegue se TODA linha tiver exatamente
 *  o numero de colunas do cabecalho.
 *
 *  Uso:
 *    DATABASE_URL=postgres://... node .build/seed/carregar-cnae.js
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

import { RAIZ } from './carregar-conhecimento.js'

/** A raiz do repo, um nivel acima de `hermes-v2-sidecar/`. */
const REPO = dirname(RAIZ)
/**
 * 🔄 24/09 — A FONTE MUDOU, E ISSO ERA O BURACO.
 *
 * Ate aqui o loader lia `cnae-matriz.csv` e `cnae-friendly.csv`, que sao as
 * ORIGINAIS, intocadas de proposito. Todo o trabalho de curadoria de 24/09
 * aconteceu em copias (`-v2`), entao NADA dele chegava ao banco: o Leo seguia
 * rodando com a tabela de antes.
 *
 * Agora a fonte e UMA so — a tabela ja curada, de 18 colunas, gerada por
 * `pesquisa/cnae-matriz/gerar-tabela-leo.mjs` a partir das copias de trabalho.
 * O join com os titulos amigaveis acontece la, na geracao, e nao mais aqui.
 *
 * 🔑 Consequencia pratica: sumiu o `LEFT JOIN` e sumiram os casts frageis. O
 * `numeroOuNulo` sobre `iss_bh_aliquota` era o pior deles — `Number('5%')` da
 * `NaN` e virava `null` CALADO, e 524 aliquotas de BH desapareciam parecendo
 * importadas. A coluna nem sobe mais: e curadoria, fica no repo.
 */
const TABELA = join(REPO, 'pesquisa', 'cnae-matriz', '_entrega-leo', 'cnae.csv')
const SINONIMOS = join(REPO, 'pesquisa', 'cnae-matriz', 'cnae-aliases.json')

const LOTE = 200

// ════════════════════════════════════════════════════════════════════════════
//  1. O PARSER
// ════════════════════════════════════════════════════════════════════════════

/**
 * CSV conforme RFC 4180, em uma passada por caractere.
 *
 * Trata: aspas ao redor do campo, `""` como aspa literal, virgula e quebra de
 * linha dentro de campo entre aspas, CRLF e LF, e o BOM do Excel no inicio.
 */
export function parsearCsv(texto: string): string[][] {
  const t = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto
  const linhas: string[][] = []
  let campo = ''
  let linha: string[] = []
  let dentroDeAspas = false

  for (let i = 0; i < t.length; i++) {
    const c = t[i]

    if (dentroDeAspas) {
      if (c === '"') {
        if (t[i + 1] === '"') { campo += '"'; i++ }   // aspa escapada
        else dentroDeAspas = false
      } else {
        campo += c
      }
      continue
    }

    if (c === '"') { dentroDeAspas = true; continue }
    if (c === ',') { linha.push(campo); campo = ''; continue }
    if (c === '\r') continue
    if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; continue }
    campo += c
  }

  // Ultima linha sem quebra no fim do arquivo.
  if (campo !== '' || linha.length > 0) { linha.push(campo); linhas.push(linha) }

  return linhas.filter((l) => !(l.length === 1 && l[0].trim() === ''))
}

/** Converte a matriz em objetos, e RECUSA linha com numero de colunas errado. */
export function comoObjetos(texto: string, nomeArquivo: string): Record<string, string>[] {
  const linhas = parsearCsv(texto)
  if (linhas.length < 2) throw new Error(`${nomeArquivo}: sem linhas de dado`)

  const cabecalho = linhas[0].map((c) => c.trim())
  const fora: number[] = []

  const objetos = linhas.slice(1).map((l, i) => {
    // 🔴 O portao que impede o deslocamento silencioso. Linha com contagem
    //    diferente do cabecalho significa que o parser se perdeu, e uma linha
    //    perdida contamina todas as colunas dela.
    if (l.length !== cabecalho.length) fora.push(i + 2)
    return Object.fromEntries(cabecalho.map((nome, j) => [nome, l[j] ?? '']))
  })

  if (fora.length > 0) {
    throw new Error(
      `${nomeArquivo}: ${fora.length} linha(s) com numero de colunas diferente de ` +
      `${cabecalho.length}. Primeiras: ${fora.slice(0, 5).join(', ')}`,
    )
  }

  return objetos
}

// ════════════════════════════════════════════════════════════════════════════
//  2. OS CASTS  ·  a mesma regra do `02-cnae.sql`, uma vez so
// ════════════════════════════════════════════════════════════════════════════

const sim = (t: string | undefined) => ['sim', 's', 'true', '1'].includes((t ?? '').trim().toLowerCase())

/** `''` nao e `false`: e "ninguem verificou". Distinguir os dois importa. */
const simOuNulo = (t: string | undefined) => ((t ?? '').trim() === '' ? null : sim(t))

const vazioVira = (t: string | undefined) => {
  const v = (t ?? '').trim()
  return v === '' ? null : v
}

const numeroOuNulo = (t: string | undefined) => {
  const v = (t ?? '').trim().replace(',', '.')
  if (v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/**
 * 🔴 O GATE. Ausente, vazio ou desconhecido vira `nao_verificado`, NUNCA
 * `alta`. Default permissivo aqui autorizaria o agente a afirmar anexo com base
 * em celula vazia, que e pior que nao ter o dado.
 */
const confianca = (t: string | undefined) => {
  const v = (t ?? '').trim().toLowerCase()
  return v === 'alta' || v === 'media' || v === 'baixa' ? v : 'nao_verificado'
}

const soDigitos = (t: string | undefined) => (t ?? '').replace(/\D/g, '')

/** O vocabulario de ausencia. Campo dependente DECLARA que depende. */
const NSA = 'nao-se-aplica'

// ════════════════════════════════════════════════════════════════════════════
//  3. A CARGA
// ════════════════════════════════════════════════════════════════════════════

const COLUNAS = [
  'codigo', 'titulo_oficial', 'titulo_amigavel', 'descricao_oficial', 'descricao_amigavel',
  'termos_de_busca', 'familia', 'divisao_id',
  'anexo', 'anexo_inciso', 'mei_ocupacoes',
  'atende_me', 'atende_mei', 'motivo_nao_atende',
  'exige_conselho', 'conselho_qual',
] as const

/**
 * 🔑 `fator_r` e `mei_permitido` NAO estao na lista, e e de proposito: as duas
 * sao colunas GERADAS no banco (`fator_r` sai de `anexo`, `mei_permitido` sai
 * de `mei_ocupacoes`). Duas colunas que sao a mesma verdade nao podem divergir
 * se so existe uma.
 *
 * ⚠️ E o vocabulario de ausencia vem PRONTO do CSV: campo dependente traz
 * `nao-se-aplica` escrito, nunca vazio. Vazio significava quatro coisas
 * diferentes na tabela antiga, e o agente lia ausencia como negacao — foi
 * assim que ele mandou cliente de folha de pagamento procurar outro contador.
 */
export function montarLinhas(): unknown[][] {
  const tabela = comoObjetos(readFileSync(TABELA, 'utf8'), 'cnae.csv')

  const vistos = new Set<string>()
  const linhas: unknown[][] = []

  for (const c of tabela) {
    const codigo = soDigitos(c.codigo)
    if (codigo.length !== 7) continue

    // Codigo repetido nao vira UPSERT dentro do mesmo lote: o Postgres recusa
    // "ON CONFLICT DO UPDATE command cannot affect row a second time".
    if (vistos.has(codigo)) continue
    vistos.add(codigo)

    linhas.push([
      codigo,
      c.titulo_oficial ?? '',
      c.titulo_amigavel ?? NSA,
      c.descricao_oficial ?? NSA,
      c.descricao_amigavel ?? NSA,
      c.termos_de_busca ?? NSA,
      c.familia ?? NSA,
      (c.divisao_id ?? '').trim().padStart(2, '0'),
      c.anexo ?? NSA,
      c.anexo_inciso ?? NSA,
      c.mei_ocupacoes ?? NSA,
      sim(c.atende_me),
      sim(c.atende_mei),
      c.motivo_nao_atende ?? NSA,
      sim(c.exige_conselho),
      c.conselho_qual ?? NSA,
    ])
  }

  return linhas
}

/** Os sinonimos que a busca consulta ANTES de qualquer similaridade. */
export function montarSinonimos(): [string, string][] {
  const bruto = JSON.parse(readFileSync(SINONIMOS, 'utf8')) as { termo: string; codigo: string }[]
  return bruto.map((a) => [a.termo.trim().toLowerCase(), soDigitos(a.codigo)])
}

export async function carregarCnae(): Promise<void> {
  const { pool } = await import('../db.js')
  const linhas = montarLinhas()

  console.log(`matriz lida: ${linhas.length} linhas`)
  if (linhas.length < 1300) {
    throw new Error(`esperado ~1332 linhas, li ${linhas.length}: CSV truncado ou caminho errado`)
  }

  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')

    for (let i = 0; i < linhas.length; i += LOTE) {
      const lote = linhas.slice(i, i + LOTE)
      const valores: unknown[] = []
      const tuplas = lote.map((linha, l) => {
        const marcadores = linha.map((_, c) => `$${l * COLUNAS.length + c + 1}`)
        valores.push(...linha)
        return `(${marcadores.join(',')})`
      })

      await cliente.query(
        `INSERT INTO fatos.cnae (${COLUNAS.join(', ')})
         VALUES ${tuplas.join(',')}
         ON CONFLICT (codigo) DO UPDATE SET
           titulo_oficial     = excluded.titulo_oficial,
           titulo_amigavel    = excluded.titulo_amigavel,
           descricao_oficial  = excluded.descricao_oficial,
           descricao_amigavel = excluded.descricao_amigavel,
           termos_de_busca    = excluded.termos_de_busca,
           familia            = excluded.familia,
           anexo              = excluded.anexo,
           anexo_inciso       = excluded.anexo_inciso,
           mei_ocupacoes      = excluded.mei_ocupacoes,
           atende_me          = excluded.atende_me,
           atende_mei         = excluded.atende_mei,
           motivo_nao_atende  = excluded.motivo_nao_atende,
           exige_conselho     = excluded.exige_conselho,
           conselho_qual      = excluded.conselho_qual,
           atualizado_em      = current_date`,
        valores,
      )
      process.stdout.write(`\r  gravadas ${Math.min(i + LOTE, linhas.length)}/${linhas.length}`)
    }

    // ── OS SINONIMOS ────────────────────────────────────────────────────────
    // 🔑 Camada NOSSA, separada do dado do IBGE de proposito. Existe porque
    //    `psicologo` nao aparece em NENHUM campo da tabela — nem no titulo
    //    oficial, nem no amigavel, nem nos 542 caracteres de termos de busca.
    //    Nenhum peso de busca acha palavra que ninguem escreveu.
    const sinonimos = montarSinonimos()
    for (const [termo, cnae] of sinonimos) {
      await cliente.query(
        `INSERT INTO fatos.cnae_sinonimos (termo, cnae_codigo) VALUES ($1, $2)
         ON CONFLICT (termo) DO UPDATE SET cnae_codigo = excluded.cnae_codigo`,
        [termo, cnae],
      )
    }

    // ── OS PORTOES ──────────────────────────────────────────────────────────
    const { rows } = await cliente.query<{
      total: number
      me: number
      sem_anexo: number
      sem_motivo: number
      orfaos: number
    }>(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE atende_me)::int AS me,
              count(*) FILTER (WHERE atende_me AND anexo = 'nao-se-aplica')::int AS sem_anexo,
              count(*) FILTER (WHERE coalesce(motivo_nao_atende, '') = '')::int AS sem_motivo,
              (SELECT count(*)::int FROM fatos.cnae_sinonimos s
                WHERE NOT EXISTS (SELECT 1 FROM fatos.cnae c WHERE c.codigo = s.cnae_codigo)) AS orfaos
         FROM fatos.cnae`,
    )
    const { total, me, sem_anexo, sem_motivo, orfaos } = rows[0]

    if (total < 1300) throw new Error(`so ${total} linhas na tabela`)

    /* 🔴 O GATE MUDOU DE PERGUNTA em 24/09, e isso e o ponto.
       O antigo media `confianca = 'alta'` — mas essa coluna media o NOSSO dever
       de casa, e o agente a lia como incerteza da LEI. Ela virou curadoria e
       nao sobe mais. A pergunta que substitui e direta: sobrou CNAE que a casa
       atende sem anexo definido? Isso e exatamente o `requer-revisao` que
       morreu hoje, e se ele voltar a carga para AQUI, nao em producao. */
    if (sem_anexo > 0) throw new Error(`${sem_anexo} CNAE(s) atendidos SEM anexo definido`)
    if (sem_motivo > 0) throw new Error(`${sem_motivo} linha(s) sem motivo_nao_atende`)
    if (orfaos > 0) throw new Error(`${orfaos} sinonimo(s) apontam para CNAE que nao existe`)

    await cliente.query('COMMIT')
    console.log(
      `\nCNAE: ${total} linhas · ${me} atendidos no ME · ${sinonimos.length} sinonimos · ` +
        `0 sem anexo · 0 sem motivo`,
    )
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}

if (process.argv[1]?.includes('carregar-cnae')) {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL nao definida')
    process.exit(1)
  }
  carregarCnae().then(
    () => process.exit(0),
    (e) => { console.error('\n', e); process.exit(1) },
  )
}
