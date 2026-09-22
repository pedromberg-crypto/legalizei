/**
 * ════════════════════════════════════════════════════════════════════════════
 *  db.ts  ·  a unica porta para o PostgreSQL
 *
 *  🔴 REGRA DURA DESTE ARQUIVO: nenhuma conta acontece aqui.
 *
 *  Toda funcao abaixo e um involucro fino sobre uma function do `schema.sql`.
 *  Se um dia aparecer um `*`, um `+` ou um `Math.round` neste arquivo, a
 *  arquitetura foi rompida: o calculo do imposto tem uma fonte so, e ela e o
 *  banco, que por sua vez espelha o motor fiscal do repo. Dois motores fiscais
 *  ja existiram neste projeto, com 7 de 7 constantes duplicadas, e um deles
 *  divergiu.
 *
 *  A outra regra: o agente NAO escreve SQL. Ele chama tool, a tool chama uma
 *  destas funcoes, e esta funcao chama a function do banco. Tres camadas, cada
 *  uma com uma responsabilidade.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { Pool, type PoolClient } from 'pg'
import type { Confianca, Promessa, Regime, Resolucao, Saida, FalhaTipo } from './tipos.js'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
})

/** pgvector espera o literal `[0.1,0.2,...]`, nao um array do Postgres. */
function comoVetor(v: number[]): string {
  return `[${v.join(',')}]`
}

// ── FATOS · tool calling ─────────────────────────────────────────────────────

export interface LinhaCnae {
  codigo: string
  titulo: string
  /**
   * 🔴 "a CASA atende", nunca "a lei permite".
   *
   * O nome antigo era `atende_mei`, e o agente leu `false` como "esta atividade
   * nao pode ser MEI", afirmando regra federal falsa a um cliente. A matriz
   * dizia `mei_permitido: true` na MESMA linha. Nome ambiguo em campo que o
   * modelo le nao e detalhe de estilo: vira frase errada na boca do agente.
   */
  casa_atende_me: boolean
  casa_atende_mei: boolean
  anexo: string | null
  /** 🔴 O gate do anexo. false significa: nao crave anexo nem aliquota. */
  pode_afirmar_anexo: boolean
  /** 🔴 Sempre false: a lista de ocupacoes do MEI e do governo e nao esta aqui. */
  pode_afirmar_lista_mei: boolean
  exige_conselho: boolean
  semelhanca: number
}

export async function consultarCnae(busca: string): Promise<LinhaCnae[]> {
  const { rows } = await pool.query<LinhaCnae>(
    'SELECT * FROM fatos.consultar_cnae($1)',
    [busca],
  )
  return rows
}

export interface LinhaPreco {
  nome: string
  /** 🔴 Centavos inteiros. Nunca converter para float aqui: formatar e do texto. */
  valor_centavos: number
  promocional: boolean
  vigencia_ate: string | null
  inclui: string[]
  nao_inclui: string[]
}

export async function consultarPreco(regime: Regime): Promise<LinhaPreco[]> {
  const { rows } = await pool.query<LinhaPreco>(
    'SELECT * FROM fatos.consultar_preco($1)',
    [regime],
  )
  return rows
}

export interface LinhaEstimativa {
  faixa: number
  nominal: string
  efetiva: string
  das_centavos: string
  sobra_centavos: string
  /** Sempre true. Existe para o texto nunca esquecer de dizer que e aproximado. */
  e_estimativa: boolean
}

/**
 * Os parametros da regra fiscal que a sanitizacao apaga das notas.
 *
 * 🔑 Voltam JUNTOS com a estimativa, numa chamada so, pela mesma razao que
 * escopo e teto voltam juntos: quem pergunta "quanto pago" e quem pergunta
 * "o que e Fator R" esta na mesma conversa, e separado o modelo le um e
 * responde sem o outro.
 */
export async function consultarParametroFiscal() {
  const { rows } = await pool.query(
    `SELECT id, nome, texto, valor_numerico, unidade, vigencia, fonte
       FROM fatos.parametro_fiscal ORDER BY id`,
  )
  return rows
}

export async function estimarDas(
  anexo: 'III' | 'V',
  rbt12: string,
  receitaMes: string,
): Promise<LinhaEstimativa | null> {
  const { rows } = await pool.query<LinhaEstimativa>(
    'SELECT * FROM fatos.estimar_das($1, $2, $3)',
    [anexo, rbt12, receitaMes],
  )
  return rows[0] ?? null
}

export interface LinhaEscopo {
  id: string
  dentro: boolean
  dimensao: string
  valor: string
  motivo: string
  saida_sugerida: string | null
}

export async function consultarEscopo(): Promise<LinhaEscopo[]> {
  const { rows } = await pool.query<LinhaEscopo>(
    'SELECT id, dentro, dimensao, valor, motivo, saida_sugerida FROM fatos.escopo_regra',
  )
  return rows
}

export interface LinhaTeto {
  id: string
  nome: string
  valor_centavos: string
  periodicidade: string
  acima_disso: string
  atendemos_acima: boolean
}

/**
 * Os dois tetos, com valor.
 *
 * 🔴 Existe porque a rodada de E2E de 20/09 mostrou o agente dizendo que "o
 * limite do Simples Nacional e de R$ 4,8 milhoes por ano, entao voce ainda tem
 * bastante chao pela frente" para quem estava ACIMA do nosso teto. O numero e
 * verdadeiro na lei e falso para o produto: o teto do ME que a casa atende e
 * outro, e acima dele vira EPP, que esta fora.
 *
 * Nenhuma tool devolvia estes numeros. Sem dado, o modelo usou o da lei, que e
 * o que ele sabe de cabeca. Nao foi alucinacao livre: foi buraco de ferramenta.
 */
export async function consultarTeto(): Promise<LinhaTeto[]> {
  const { rows } = await pool.query<LinhaTeto>(
    `SELECT id, nome, valor_centavos, periodicidade, acima_disso, atendemos_acima
       FROM fatos.teto ORDER BY valor_centavos`,
  )
  return rows
}

export interface LinhaContrato {
  id: string
  texto: string
  valor_numerico: string | null
  unidade: string | null
}

export async function consultarContrato(): Promise<LinhaContrato[]> {
  const { rows } = await pool.query<LinhaContrato>(
    'SELECT id, texto, valor_numerico, unidade FROM fatos.contrato_regra',
  )
  return rows
}

// ── CONHECIMENTO · busca semantica ───────────────────────────────────────────

export interface LinhaCartao {
  id: string
  titulo: string
  estado: string
  acao: string
  /** 🔴 Volta sempre junto da acao. Nunca buscar a restricao numa segunda ida. */
  restricao: string
  promessa: Promessa
  onde_no_app: string | null
  distancia: number
}

export async function buscarCartao(embedding: number[], limite = 3): Promise<LinhaCartao[]> {
  const { rows } = await pool.query<LinhaCartao>(
    'SELECT * FROM conhecimento.buscar_cartao($1::vector, $2)',
    [comoVetor(embedding), limite],
  )
  return rows
}

export async function buscarNota(embedding: number[], limite = 3) {
  const { rows } = await pool.query(
    `SELECT id, assunto, trecho, (embedding <=> $1::vector)::real AS distancia
       FROM conhecimento.nota
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2`,
    [comoVetor(embedding), limite],
  )
  return rows as { id: string; assunto: string; trecho: string; distancia: number }[]
}

// ── CONVERSA · as duas tabelas que nao se misturam ───────────────────────────

/**
 * 🔴 `conversa.mensagem` e a UNICA tabela reenviada ao modelo como historico.
 * So o que a pessoa viu entra aqui.
 */
export async function salvarMensagem(
  sessaoId: string,
  papel: 'cliente' | 'leo' | 'humano',
  texto: string,
  cliente: PoolClient | Pool = pool,
): Promise<number> {
  const { rows } = await cliente.query<{ id: string }>(
    'INSERT INTO conversa.mensagem (sessao_id, papel, texto) VALUES ($1, $2, $3) RETURNING id',
    [sessaoId, papel, texto],
  )
  return Number(rows[0].id)
}

export async function carregarHistorico(sessaoId: string, limite = 40) {
  const { rows } = await pool.query<{ papel: 'cliente' | 'leo'; texto: string }>(
    `SELECT papel, texto FROM conversa.mensagem
      WHERE sessao_id = $1 AND papel <> 'humano'
      ORDER BY id DESC LIMIT $2`,
    [sessaoId, limite],
  )
  return rows.reverse()
}

/**
 * 🔴 `conversa.turno_interno` NUNCA volta para o prompt.
 *
 * Existe para medicao, auditoria e depuracao. Duas constraints do banco fazem a
 * guarda que o codigo tambem faz, de proposito redundante:
 *
 *   comercial_exige_tecnica_ok  saida comercial exige tecnica_ok
 *   falha_coerente              tecnica falhou obriga a declarar QUAL falha
 *
 * Se o Node deixar passar, o INSERT estoura. A trava do banco e a rede embaixo
 * da rede, nao a rede principal.
 */
export async function salvarTurnoInterno(
  sessaoId: string,
  mensagemId: number | null,
  dados: {
    saida: Saida
    tecnicaOk: boolean
    falhaTipo: FalhaTipo | null
    cartoesUsados: string[]
    fatosLidos: string[]
    tokensEntrada: number
    tokensSaida: number
    /** 🔑 SUBCONJUNTO de `tokensEntrada`. Opcional para nao quebrar chamador antigo. */
    tokensCache?: number
  },
  cliente: PoolClient | Pool = pool,
): Promise<void> {
  await cliente.query(
    `INSERT INTO conversa.turno_interno
       (sessao_id, mensagem_id, saida, tecnica_ok, falha_tipo,
        cartoes_usados, fatos_lidos, tokens_entrada, tokens_saida, tokens_cache)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      sessaoId,
      mensagemId,
      dados.saida,
      dados.tecnicaOk,
      dados.falhaTipo,
      dados.cartoesUsados,
      dados.fatosLidos,
      dados.tokensEntrada,
      dados.tokensSaida,
      dados.tokensCache ?? null,
    ],
  )
}

/**
 * A classificacao do contato.
 *
 * 🔴 Nao e mensagem, e fato sobre a pessoa. Volta ao prompt como UMA LINHA
 * injetada, nunca como turno de historico. E isto e memoria persistente entre
 * conversas: ligar a chamada desta funcao e decisao de produto, nao detalhe
 * tecnico. Ver o comentario da tabela no `schema.sql`.
 */
export async function atualizarClassificacao(
  contatoId: string,
  campos: {
    regimeAlvo?: Regime
    atividadeCnae?: string
    cidade?: string
    dentroEscopo?: boolean
    confianca?: Confianca
  },
  mensagemId: number | null,
): Promise<void> {
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    const { rows: antes } = await cliente.query(
      'SELECT * FROM conversa.classificacao WHERE contato_id = $1',
      [contatoId],
    )
    await cliente.query(
      `INSERT INTO conversa.classificacao
         (contato_id, regime_alvo, atividade_cnae, cidade, dentro_escopo, confianca)
       VALUES ($1, $2, $3, $4, $5, coalesce($6, 'baixa'))
       ON CONFLICT (contato_id) DO UPDATE SET
         regime_alvo    = coalesce(excluded.regime_alvo, conversa.classificacao.regime_alvo),
         atividade_cnae = coalesce(excluded.atividade_cnae, conversa.classificacao.atividade_cnae),
         cidade         = coalesce(excluded.cidade, conversa.classificacao.cidade),
         dentro_escopo  = coalesce(excluded.dentro_escopo, conversa.classificacao.dentro_escopo),
         confianca      = excluded.confianca,
         atualizada_em  = now()`,
      [
        contatoId,
        campos.regimeAlvo ?? null,
        campos.atividadeCnae ?? null,
        campos.cidade ?? null,
        campos.dentroEscopo ?? null,
        campos.confianca ?? null,
      ],
    )
    // Toda mudanca fica auditavel contra o que a pessoa de fato disse.
    for (const [campo, valor] of Object.entries(campos)) {
      if (valor === undefined) continue
      const anterior = antes[0]?.[campoNoBanco(campo)] ?? null
      if (String(anterior) === String(valor)) continue
      await cliente.query(
        `INSERT INTO conversa.classificacao_historico (contato_id, campo, de, para, mensagem_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [contatoId, campo, anterior, String(valor), mensagemId],
      )
    }
    await cliente.query('COMMIT')
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}

function campoNoBanco(campo: string): string {
  return (
    {
      regimeAlvo: 'regime_alvo',
      atividadeCnae: 'atividade_cnae',
      cidade: 'cidade',
      dentroEscopo: 'dentro_escopo',
      confianca: 'confianca',
    } as Record<string, string>
  )[campo] ?? campo
}

/**
 * Grava o turno inteiro numa transacao so.
 *
 * 🔑 Mensagem e turno interno sao tabelas diferentes, mas sao o mesmo evento.
 * Gravar em transacoes separadas produz historico sem medicao (ou medicao sem
 * historico) quando alguma coisa falha no meio, e ai o placar mente.
 */
export async function gravarTurno(
  sessaoId: string,
  textoCliente: string,
  textoLeo: string,
  medicao: Parameters<typeof salvarTurnoInterno>[2],
): Promise<void> {
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    await salvarMensagem(sessaoId, 'cliente', textoCliente, cliente)
    const idLeo = await salvarMensagem(sessaoId, 'leo', textoLeo, cliente)
    await salvarTurnoInterno(sessaoId, idLeo, medicao, cliente)
    await cliente.query('COMMIT')
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}

export interface LinhaLink {
  id: string
  nome: string
  url: string
  quando_usar: string
}

/**
 * Os tres links oficiais, como STRING EXATA.
 *
 * 🔴 Nasceu do E2E de 20/09: o agente escreveu
 * `https://www.instagram.com/legalizai` quando o endereco e
 * `https://www.instagram.com/legalizai.app/`. Ele nao inventou do nada, leu o
 * trecho da nota e reescreveu de cabeca, que e o que um modelo faz com texto
 * corrido. String exata nao admite parafrase.
 */
export async function consultarLinks(): Promise<LinhaLink[]> {
  const { rows } = await pool.query<LinhaLink>(
    'SELECT id, nome, url, quando_usar FROM fatos.link ORDER BY id',
  )
  return rows
}

// ── IDENTIDADE: do WhatsApp para as tabelas de conversa ──────────────────────

/**
 * Garante contato e sessao para um `chatId` do WhatsApp.
 *
 * 🔑 A sessao NAO e eterna e nao e por mensagem: ela expira por ociosidade.
 * Sessao unica por contato faria o historico crescer sem fim e o custo junto,
 * porque historico e reenviado inteiro a cada turno. Sessao por mensagem faria
 * o Leo esquecer o que a pessoa acabou de dizer.
 *
 * ⚠️ `identificador` guarda o `chatId` cru. Ele contem o telefone, entao NAO
 * deve ser logado em claro nem sair em relatorio.
 */
export async function garantirContatoESessao(
  chatId: string,
  ociosidadeMinutos = 120,
): Promise<{ contatoId: string; sessaoId: string; nova: boolean }> {
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')

    const { rows: contatos } = await cliente.query<{ id: string }>(
      `INSERT INTO conversa.contato (canal, identificador)
       VALUES ('whatsapp', $1)
       ON CONFLICT (canal, identificador) DO UPDATE SET identificador = excluded.identificador
       RETURNING id`,
      [chatId],
    )
    const contatoId = contatos[0].id

    // Reaproveita a sessao aberta se a ultima mensagem for recente.
    const { rows: abertas } = await cliente.query<{ id: string }>(
      `SELECT s.id
         FROM conversa.sessao s
        WHERE s.contato_id = $1
          AND s.fechada_em IS NULL
          AND coalesce(
                (SELECT max(m.criada_em) FROM conversa.mensagem m WHERE m.sessao_id = s.id),
                s.aberta_em
              ) > now() - ($2 || ' minutes')::interval
        ORDER BY s.aberta_em DESC
        LIMIT 1`,
      [contatoId, String(ociosidadeMinutos)],
    )

    if (abertas[0]) {
      await cliente.query('COMMIT')
      return { contatoId, sessaoId: abertas[0].id, nova: false }
    }

    // Fecha o que ficou aberto e ocioso, para nao acumular sessao zumbi.
    await cliente.query(
      `UPDATE conversa.sessao SET fechada_em = now()
        WHERE contato_id = $1 AND fechada_em IS NULL`,
      [contatoId],
    )
    const { rows: novas } = await cliente.query<{ id: string }>(
      'INSERT INTO conversa.sessao (contato_id) VALUES ($1) RETURNING id',
      [contatoId],
    )
    await cliente.query('COMMIT')
    return { contatoId, sessaoId: novas[0].id, nova: true }
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}
