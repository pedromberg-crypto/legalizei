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
      'USE SEMPRE que a pessoa perguntar o que o app FAZ, se ele resolve alguma coisa, ou ' +
      'descrever uma situacao do dia a dia da empresa (perdi o prazo, preciso emitir nota, ' +
      'quero contratar alguem, como funciona tal parte). Devolve Estado, Acao e Restricao ' +
      'juntos, e o campo promessa: pode (fale em primeira pessoa), parcial (fale so da ' +
      'parte que existe) e nao (nao prometa e nao descreva como se existisse). Atencao: ' +
      'promessa nao NAO autoriza negar de cabeca. ' +
      'Esta tool e sobre CAPACIDADE do produto e nao tem preco, link nem data: numero vem ' +
      'de consultar_preco ou consultar_contrato, link e regra vem de buscar_base.',
    parametros: {
      type: 'object',
      properties: {
        situacao: { type: 'string', description: 'A situacao da pessoa, nas palavras dela.' },
      },
      required: ['situacao'],
    },
  },
  {
    nome: 'buscar_base',
    descricao:
      'OBRIGATORIA antes de escrever qualquer LINK, endereco de site, rede social, data de ' +
      'campanha, condicao de promocao, o que a lista de espera garante, regra de orgao ' +
      'publico (prefeitura, junta, receita), regra de atendimento ou procedimento que as ' +
      'outras tools nao cobrem. Busca por assunto no texto da base de conhecimento. ' +
      'REGRA DURA: voce nao escreve link, endereco nem data que nao tenha lido AGORA aqui. ' +
      'Nao existe link que voce saiba de cabeca. Se a busca nao trouxer, diga que vai ' +
      'confirmar com o time. ' +
      'Na duvida entre esta e as outras, chame esta tambem: uma consulta a mais custa pouco, ' +
      'uma frase inventada custa o cliente.',
    parametros: {
      type: 'object',
      properties: {
        assunto: {
          type: 'string',
          description:
            'O que voce precisa saber, em palavras: "links oficiais e lista de espera", ' +
            '"regra da prefeitura sobre apartamento", "ate quando vale a promocao".',
        },
      },
      required: ['assunto'],
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
      'cai fora, E OS DOIS TETOS DE FATURAMENTO com valor. Fora do escopo NAO e ' +
      'escalonamento: nenhum atendente resolve o que o produto nao faz. ' +
      'OBRIGATORIA sempre que a pessoa disser quanto fatura ou perguntar ate quanto pode ' +
      'faturar. 🔴 O teto que importa e o do ME que A CASA atende, nao o teto do Simples ' +
      'Nacional: acima do nosso, vira EPP e a casa NAO atende. Nunca diga que ela "ainda ' +
      'tem chao" com base no limite da lei.',
    parametros: { type: 'object', properties: {} },
  },
]

export const NOMES_DE_TOOL = TOOLS.map((t) => t.nome)
