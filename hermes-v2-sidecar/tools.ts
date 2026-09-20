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

import type { DefinicaoTool, Embedder } from './tipos.js'
import * as db from './db.js'

export const TOOLS: DefinicaoTool[] = [
  {
    nome: 'consultar_cnae',
    descricao:
      'Descobre se a gente atende uma atividade, e qual o anexo dela. Use ANTES de dizer ' +
      'que atende ou que nao atende. O campo pode_afirmar manda: quando vier false, nao ' +
      'crave anexo nem aliquota, pergunte o que a pessoa faz no dia a dia e oriente por ai.',
    parametros: {
      type: 'object',
      properties: {
        busca: {
          type: 'string',
          description: 'A atividade em palavras da pessoa ("sou fotografo"), ou o codigo.',
        },
      },
      required: ['busca'],
    },
  },
  {
    nome: 'consultar_preco',
    descricao:
      'O preco do plano, o que inclui e o que NAO inclui. Unico lugar de onde sai valor de ' +
      'plano. Confirme o regime antes: o certificado digital e incluso no ME e nao existe ' +
      'no MEI, e esse erro ja foi para producao.',
    parametros: {
      type: 'object',
      properties: {
        regime: { type: 'string', enum: ['mei', 'me_simples'] },
      },
      required: ['regime'],
    },
  },
  {
    nome: 'estimar_das',
    descricao:
      'Estimativa aproximada do imposto do mes sobre um faturamento que A PESSOA informou. ' +
      'Tres obrigacoes ao usar o resultado: dizer que e aproximado, mostrar o que SOBRA na ' +
      'mesma frase, e nunca inventar o faturamento dela. Se ela recusa a estimativa e exige ' +
      'o numero fechado, isso e escalonamento, nao uma segunda chamada.',
    parametros: {
      type: 'object',
      properties: {
        anexo: { type: 'string', enum: ['III', 'V'] },
        rbt12: { type: 'string', description: 'Receita dos ultimos doze meses, em reais.' },
        receita_mes: { type: 'string', description: 'A receita do mes, em reais.' },
      },
      required: ['anexo', 'rbt12', 'receita_mes'],
    },
  },
  {
    nome: 'buscar_cartao',
    descricao:
      'O que o produto faz sobre a situacao que a pessoa descreveu. Devolve Estado, Acao e ' +
      'Restricao juntos, e o campo promessa: pode (fale em primeira pessoa), parcial (fale ' +
      'so da parte que existe) e nao (nao prometa e nao descreva como se existisse). ' +
      'Atencao: promessa nao NAO autoriza negar de cabeca.',
    parametros: {
      type: 'object',
      properties: {
        situacao: {
          type: 'string',
          description: 'A situacao da pessoa, nas palavras dela.',
        },
      },
      required: ['situacao'],
    },
  },
  {
    nome: 'consultar_contrato',
    descricao:
      'Fidelidade, multa, prazo de arrependimento e reajuste. Isto e CONSULTA, nao ' +
      'escalonamento: leia e passe a regra com os numeros, o que tranquiliza junto com o ' +
      'que pesa. Voce nao tem nenhum desses numeros em nenhum outro lugar.',
    parametros: { type: 'object', properties: {} },
  },
  {
    nome: 'consultar_escopo',
    descricao:
      'A lista do que a casa atende e do que nao atende, com a saida sugerida para quem ' +
      'cai fora. Fora do escopo NAO e escalonamento: nenhum atendente resolve o que o ' +
      'produto nao faz.',
    parametros: { type: 'object', properties: {} },
  },
]

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

    case 'consultar_contrato': {
      const linhas = await db.consultarContrato()
      return { conteudo: linhas, cartoes: [], fatos: ['contrato'] }
    }

    case 'consultar_escopo': {
      const linhas = await db.consultarEscopo()
      return { conteudo: linhas, cartoes: [], fatos: ['escopo'] }
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
