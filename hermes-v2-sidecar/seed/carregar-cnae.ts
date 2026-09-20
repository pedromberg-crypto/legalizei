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
const MATRIZ = join(REPO, 'pesquisa', 'cnae-matriz', 'cnae-matriz.csv')
const AMIGAVEL = join(REPO, 'pesquisa', 'cnae-matriz', 'cnae-friendly.csv')

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

// ════════════════════════════════════════════════════════════════════════════
//  3. A CARGA
// ════════════════════════════════════════════════════════════════════════════

const COLUNAS = [
  'codigo', 'descricao', 'titulo_amigavel', 'descricao_amigavel', 'secao_id', 'divisao_id',
  'anexo_base', 'anexo_fator_r_grupo', 'anexo_fator_r_fonte', 'anexo_fator_r_confianca',
  'vedado_simples', 'ambiguo_simples', 'mei_permitido', 'mei_ocupacoes',
  'iss_bh_aliquota', 'iss_bh_varia', 'risco_baixo_cgsim',
  'exige_conselho', 'conselho_qual', 'exige_registro_setorial',
  'atende_me_certeza', 'atende_mei_certeza',
] as const

export function montarLinhas(): unknown[][] {
  const matriz = comoObjetos(readFileSync(MATRIZ, 'utf8'), 'cnae-matriz.csv')
  const amigaveis = comoObjetos(readFileSync(AMIGAVEL, 'utf8'), 'cnae-friendly.csv')

  const porCodigo = new Map<string, Record<string, string>>()
  for (const a of amigaveis) porCodigo.set(soDigitos(a.code), a)

  const vistos = new Set<string>()
  const linhas: unknown[][] = []

  for (const m of matriz) {
    const codigo = soDigitos(m.cnae)
    if (codigo.length !== 7) continue

    // Codigo repetido nao vira UPSERT dentro do mesmo lote: o Postgres recusa
    // "ON CONFLICT DO UPDATE command cannot affect row a second time". Melhor
    // descobrir aqui, com o codigo na mao, do que na metade da carga.
    if (vistos.has(codigo)) continue
    vistos.add(codigo)

    const a = porCodigo.get(codigo)

    linhas.push([
      codigo,
      m.descricao ?? '',
      vazioVira(a?.friendly_title),
      vazioVira(a?.friendly_description),
      (m.secao_id ?? '').trim() || null,
      (m.divisao_id ?? '').trim().padStart(2, '0'),
      vazioVira(m.anexo_base),
      vazioVira(m.anexo_fator_r_grupo),
      vazioVira(m.anexo_fator_r_fonte),
      confianca(m.anexo_fator_r_confianca),
      sim(m.vedado_simples_cgsn_anexo_vi),
      sim(m.ambiguo_simples_cgsn_anexo_vii),
      sim(m.mei_permitido),
      vazioVira(m.mei_ocupacoes),
      numeroOuNulo(m.iss_bh_aliquota),
      sim(m.iss_bh_varia),
      simOuNulo(m.risco_baixo_cgsim),
      sim(m.exige_conselho),
      vazioVira(m.conselho_qual),
      sim(m.exige_registro_setorial),
      sim(m.atende_me_certeza),
      sim(m.atende_mei_certeza),
    ])
  }

  return linhas
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
           descricao               = excluded.descricao,
           titulo_amigavel         = excluded.titulo_amigavel,
           descricao_amigavel      = excluded.descricao_amigavel,
           anexo_base              = excluded.anexo_base,
           anexo_fator_r_grupo     = excluded.anexo_fator_r_grupo,
           anexo_fator_r_confianca = excluded.anexo_fator_r_confianca,
           mei_permitido           = excluded.mei_permitido,
           atende_me_certeza       = excluded.atende_me_certeza,
           atende_mei_certeza      = excluded.atende_mei_certeza,
           atualizado_em           = current_date`,
        valores,
      )
      process.stdout.write(`\r  gravadas ${Math.min(i + LOTE, linhas.length)}/${linhas.length}`)
    }

    // ── OS MESMOS PORTOES DO SQL, agora do lado de ca ────────────────────────
    const { rows } = await cliente.query<{ total: number; altos: number; me: number }>(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE anexo_fator_r_confianca = 'alta')::int AS altos,
              count(*) FILTER (WHERE atende_me_certeza)::int AS me
         FROM fatos.cnae`,
    )
    const { total, altos, me } = rows[0]

    if (total < 1300) throw new Error(`so ${total} linhas na tabela`)
    if (altos === 0 || altos > total / 2) {
      // ⚠️ Cerca de ordem de grandeza, nao valor exato: o numero muda quando a
      //    contadora fechar os codigos em conflito. O que nao pode mudar
      //    sozinho e a ORDEM: se todos virarem `alta`, o gate deixou de existir
      //    e o agente passa a afirmar anexo de qualquer codigo.
      throw new Error(`gate suspeito: ${altos} de ${total} com confianca alta`)
    }

    await cliente.query('COMMIT')
    console.log(`\nCNAE: ${total} linhas · ${altos} com confianca alta · ${me} atendidos no ME`)
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
