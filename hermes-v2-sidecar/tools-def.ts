/**
 * ════════════════════════════════════════════════════════════════════════════
 *  tools-def.ts  ·  a DEFINICAO das tools, sem nenhuma execucao
 *
 *  Separado do `tools.ts` por um motivo pratico, achado ao escrever os testes:
 *  `tools.ts` importa `db.ts`, que abre um Pool do Postgres no carregamento do
 *  modulo. Enquanto a definicao morava junto da execucao, importar o roteador
 *  exigia `pg` instalado e banco de pe, inclusive para testar funcao pura.
 *
 *  🔑 A separacao tambem esta certa por si: definicao de tool e DADO, e o que
 *  vai no prompt. Execucao e I/O. Misturar as duas foi o que tornou o roteador
 *  intestavel offline.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { DefinicaoTool } from './tipos.js'

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
      properties: { regime: { type: 'string', enum: ['mei', 'me_simples'] } },
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
        situacao: { type: 'string', description: 'A situacao da pessoa, nas palavras dela.' },
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

export const NOMES_DE_TOOL = TOOLS.map((t) => t.nome)
