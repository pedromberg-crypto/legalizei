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
      const linha = await db.estimarDas(
        argumentos.anexo,
        String(argumentos.rbt12),
        String(argumentos.receita_mes),
      )
      return { conteudo: linha, cartoes: [], fatos: ['estimativa_das'] }
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
