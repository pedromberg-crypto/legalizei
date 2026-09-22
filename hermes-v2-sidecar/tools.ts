/**
 * ════════════════════════════════════════════════════════════════════════════
 *  tools.ts  ·  as tools do LLM, mapeadas 1 para 1 nas functions do Postgres
 *
 *  🔴 Nao existe tool sem function correspondente no `schema.sql`, e nao existe
 *  logica entre as duas. O Node recebe os argumentos, repassa, devolve o
 *  resultado. Isso e deliberado: no runtime anterior, a regra fiscal vivia em
 *  dois lugares e os dois divergiram.
 *
 *  🔑 A descricao de cada tool carrega a RESTRICAO junto, nao so a capacidade.
 *  Modelo pequeno le a descricao da tool muito mais vezes do que le a regra no
 *  documento: e o lugar mais barato para a regra estar.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Embedder } from './tipos.js'
import * as db from './db.js'

export { TOOLS } from './tools-def.js'

/** O que cada tool leu, para o log interno saber o que sustentou a resposta. */
export interface ResultadoTool {
  conteudo: unknown
  cartoes: string[]
  fatos: string[]
}

/**
 * Executa uma tool. Nenhum ramo aqui calcula nada: todos repassam para o banco.
 */
export async function executarTool(
  nome: string,
  argumentos: Record<string, any>,
  embedder: Embedder,
): Promise<ResultadoTool> {
  switch (nome) {
    case 'consultar_cnae': {
      const linhas = await db.consultarCnae(String(argumentos.busca ?? ''))
      return {
        conteudo: linhas,
        cartoes: [],
        fatos: linhas.map((l) => `cnae:${l.codigo}`),
      }
    }

    case 'consultar_preco': {
      const linhas = await db.consultarPreco(argumentos.regime)
      return { conteudo: linhas, cartoes: [], fatos: [`plano:${argumentos.regime}`] }
    }

    case 'estimar_das': {
      // 🔑 A estimativa vem com os PARAMETROS da regra junto (Fator R, piso do
      //    pro-labore, INSS). Eles sao exatamente os numeros que a sanitizacao
      //    apaga das notas, e sem eles o agente le «percentual em fatos», nao
      //    acha o fato e fica mudo — medido no pente fino de 22/09.
      const temFaturamento =
        argumentos.anexo != null && argumentos.rbt12 != null && argumentos.receita_mes != null
      const [linha, parametros] = await Promise.all([
        temFaturamento
          ? db.estimarDas(
              argumentos.anexo,
              String(argumentos.rbt12),
              String(argumentos.receita_mes),
            )
          : Promise.resolve(null),
        db.consultarParametroFiscal(),
      ])
      return {
        conteudo: { estimativa: linha, parametros },
        cartoes: [],
        fatos: ['estimativa_das', 'parametro_fiscal'],
      }
    }

    case 'buscar_cartao': {
      // 🔑 Embeda-se a SITUACAO da pessoa, que e o que o campo `estado` do
      // cartao descreve. O schema so vetoriza titulo + estado pelo mesmo motivo.
      const vetor = await embedder.gerar(String(argumentos.situacao ?? ''))
      const linhas = await db.buscarCartao(vetor, 3)
      return {
        conteudo: linhas,
        cartoes: linhas.map((l) => l.id),
        fatos: [],
      }
    }

    case 'consultar_links': {
      const linhas = await db.consultarLinks()
      return { conteudo: linhas, cartoes: [], fatos: ['links'] }
    }

    case 'consultar_contrato': {
      const linhas = await db.consultarContrato()
      return { conteudo: linhas, cartoes: [], fatos: ['contrato'] }
    }

    case 'consultar_escopo': {
      // 🔑 Escopo e teto voltam JUNTOS, numa chamada so. Separados, o modelo
      //    lia o escopo, via "servico em BH, tudo certo" e respondia sem nunca
      //    olhar o limite de faturamento. Quem pergunta "atende meu caso?" e
      //    quem diz quanto fatura estao fazendo a MESMA pergunta.
      const [escopo, tetos] = await Promise.all([db.consultarEscopo(), db.consultarTeto()])
      return { conteudo: { escopo, tetos }, cartoes: [], fatos: ['escopo', 'teto'] }
    }

    case 'buscar_base': {
      // A mesma doutrina do cartao: embeda-se o ASSUNTO procurado, e o trecho
      // volta inteiro como payload.
      const vetor = await embedder.gerar(String(argumentos.assunto ?? ''))
      const linhas = await db.buscarNota(vetor, 4)
      return {
        conteudo: linhas,
        cartoes: [],
        // Marcado como `nota:` e nao `fato:` de proposito: no relatorio da
        // rodada da para ver quanto da resposta veio de texto e quanto veio de
        // tabela, que e a pergunta de arquitetura que a primeira rodada abriu.
        fatos: linhas.map((l) => `nota:${l.id}`),
      }
    }

    default:
      // Tool que nao existe nao vira silencio: vira lacuna declarada, para o
      // roteador poder marcar `lacuna_da_base` em vez de fingir que respondeu.
      throw new ToolDesconhecida(nome)
  }
}

export class ToolDesconhecida extends Error {
  constructor(public readonly nome: string) {
    super(`tool desconhecida: ${nome}`)
  }
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O LASTRO AUTOMATICO
 *
 *  🔴 A MESMA BUSCA DA `buscar_base`, SO QUE SEM PEDIR LICENCA AO MODELO.
 *
 *  Medido em 22/09: `buscar_base` oferecida em 28 de 28 turnos, chamada em 0.
 *  O `consultar_links` deu 0 de 27 depois de a descricao ser reescrita no molde
 *  da tool mais chamada, com gatilho na lingua do cliente — inclusive nos
 *  quatro turnos em que o gatilho nomeado estava presente. Quatro das oito
 *  tools dizem "OBRIGATORIA" e estao em zero absoluto.
 *
 *  A recuperacao, por outro lado, esta provada: 12 de 12 perguntas acham o
 *  trecho certo entre os quatro devolvidos. O degrau quebrado nunca foi achar,
 *  foi consultar. Entao a consulta deixa de ser decisao e vira etapa.
 *
 *  ⚠️ ISTO NAO SUBSTITUI A TOOL. `buscar_base` continua na mesa das quatro
 *  trilhas: o lastro busca UMA vez, com a pergunta crua, e se o modelo precisar
 *  procurar outra coisa no meio do raciocinio a ferramenta esta la. O que mudou
 *  e o piso, nao o teto.
 * ════════════════════════════════════════════════════════════════════════════
 */
export async function montarLastro(
  texto: string,
  embedder: Embedder,
): Promise<{ bloco: string; ids: string[] }> {
  const limpo = texto.trim()
  // ⚠️ Pergunta curta demais nao tem o que vetorizar: "ok", "sim", "Oi". Buscar
  //    ali gasta um embedding para devolver ruido, e ruido no contexto e pior
  //    que contexto nenhum.
  if (limpo.length < 12) return { bloco: '', ids: [] }

  const vetor = await embedder.gerar(limpo)
  // 🔑 TRES, e nao os quatro da tool. O lastro entra em `contents`, que NAO e
  //    cacheado — so `systemInstruction` e as tools vao para o cache. Cada
  //    trecho a mais dilui a taxa de acerto sem quebrar prefixo nenhum: com
  //    quatro ela caiu de 96,4% para 88,4%, abaixo do piso de 90% do aceite.
  //    A busca ja provou que o trecho certo esta entre os quatro, e em 10 das
  //    12 perguntas medidas ele esta entre os TRES primeiros.
  const linhas = await db.buscarNota(vetor, 3)
  if (linhas.length === 0) return { bloco: '', ids: [] }

  const trechos = linhas
    .map((l, i) => `${i + 1}. [${l.id}] ${l.assunto}\n${l.trecho}`)
    .join('\n\n')

  // 🔴 O ROTULO PRECISOU DE UMA SEGUNDA VERSAO, E O MOTIVO ESTA MEDIDO.
  //
  //    A primeira so dizia "estes trechos sao da base". Resultado na rodada de
  //    19:23: as OITO tools cairam para zero — inclusive `consultar_preco` e
  //    `consultar_contrato`, que vinham funcionando — e o placar caiu de 18/20
  //    para 14/20. Com texto no contexto, o modelo parou de procurar.
  //
  //    O pior sintoma foi literal: `seed/carregar-conhecimento.ts` troca todo
  //    valor em dinheiro por «valor em fatos» ANTES de vetorizar, de proposito,
  //    para que numero so possa vir da tabela. O modelo leu o marcador no
  //    lastro e ESCREVEU ao cliente "o valor mensal e «valor em fatos»".
  //
  // 🔑 Entao o rotulo agora diz o que a base NAO tem. Lastro serve para regra,
  //    explicacao e postura; numero, endereco e condicao contratual continuam
  //    sendo tool, e o texto precisa mandar buscar em vez de deixar o silencio
  //    sugerir que ja esta tudo ali.
  const bloco =
    '[BASE DA LEGALIZAI · trechos recuperados automaticamente para esta mensagem. ' +
    'NAO sao fala do cliente e NAO devem ser citados por numero ou id.]\n\n' +
    trechos +
    '\n\n[COMO USAR · estes trechos explicam REGRA, MOTIVO e POSTURA. Eles NAO ' +
    'contem valor em dinheiro, teto, aliquota, CNAE, endereco, nem condicao de ' +
    'contrato: esses dados foram REMOVIDOS do texto de proposito e so existem nas ' +
    'ferramentas. O marcador «valor em fatos» significa exatamente isso — e ordem ' +
    'de chamar a ferramenta, e NUNCA se escreve ao cliente. Precisa de preco, ' +
    'chame `consultar_preco`; de teto ou elegibilidade, `consultar_escopo`; de ' +
    'link ou e-mail, `consultar_links`; de fidelidade ou multa, ' +
    '`consultar_contrato`; de estimativa, `estimar_das`. Se nem os trechos nem as ' +
    'ferramentas responderem, declare a lacuna em vez de completar de memoria. ' +
    'A mensagem do cliente vem a seguir.]'

  return { bloco, ids: linhas.map((l) => l.id) }
}
