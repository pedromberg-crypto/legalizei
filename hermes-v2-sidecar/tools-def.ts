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
      'Descobre se A CASA atende uma atividade, e qual o anexo dela. Use ANTES de dizer ' +
      'que atende ou que nao atende. O campo pode_afirmar_anexo manda: quando vier false, ' +
      'nao crave anexo nem aliquota, pergunte o que a pessoa faz no dia a dia e oriente ' +
      'por ai. ' +
      '🔴 LEIA COM CUIDADO: `casa_atende_mei: false` significa QUE A CASA NAO CONFIRMOU ' +
      'essa atividade no MEI, e NUNCA que a atividade e proibida no MEI. Sao coisas ' +
      'diferentes: uma e escopo comercial nosso, a outra e regra federal. Por isso vem ' +
      'junto `pode_afirmar_lista_mei`, sempre false: a lista de ocupacoes do MEI e do ' +
      'governo, e fechada, e nao esta aqui. ' +
      '🔴 VOCE NUNCA DIZ QUE UMA PROFISSAO NAO PODE SER MEI. Nao e cautela, e que voce ' +
      'nao tem como saber, e afirmar isso e inventar regra juridica na cara do cliente. ' +
      'Oriente por FATURAMENTO, que e verificavel, e diga que a ocupacao exata se confirma ' +
      'no app.',
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
      'O preco do plano, o que inclui, o que NAO inclui e ate quando vale a promocao ' +
      '(campo vigencia_ate). Unico lugar de onde sai valor de plano. Confirme o regime ' +
      'antes: o certificado digital e incluso no ME e nao existe no MEI, e esse erro ja ' +
      'foi para producao. ' +
      '🔴 Citou o preco promocional? A DATA ATE QUANDO ELE VALE sai na mesma mensagem. ' +
      'Promocao sem prazo parece preco normal, e a pessoa descobre o valor cheio depois, ' +
      'achando que foi enganada. A data e real e pode ser usada como motivo para decidir ' +
      'agora; inventar escassez ("so hoje", "ultimas vagas") continua proibido.',
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
      'USO OBRIGATORIO. Voce DEVE chamar esta ferramenta ANTES de responder sempre que a ' +
      'conversa tocar no APLICATIVO: o que ele faz, o que ele resolve, como ele resolve na ' +
      'pratica, o que a pessoa consegue fazer sozinha nele, onde cada coisa acontece, e o ' +
      'que ele NAO faz. ' +
      'Chame TAMBEM quando a pessoa apenas descrever uma situacao do dia a dia da empresa ' +
      'sem perguntar nada ("perdi o prazo", "preciso emitir nota", "quero contratar ' +
      'alguem", "nao sei qual codigo usar", "recebi uma cobranca"): a situacao dela e ' +
      'exatamente a chave de busca desta tool. ' +
      'Sao 58 capacidades do produto, e voce NAO as conhece de memoria. Descrever o que o ' +
      'app faz sem ter chamado esta ferramenta e inventar funcionalidade, que e o erro que ' +
      'mais custa caro na venda: a pessoa contrata por causa dele e nao encontra depois. ' +
      'Devolve Estado, Acao e Restricao juntos, e o campo promessa: pode (fale em primeira ' +
      'pessoa), parcial (fale so da parte que existe) e nao (nao prometa e nao descreva ' +
      'como se existisse). Atencao: promessa nao NAO autoriza negar de cabeca. ' +
      'LIMITE DELA, para voce nao perder chamada: nao tem preco, nao tem link, nao tem ' +
      'data e nao tem percentual. Preco e validade de promocao vem de consultar_preco; ' +
      'fidelidade e multa de consultar_contrato; endereco de consultar_links; data de ' +
      'campanha e regra de orgao de buscar_base. Esta aqui e sobre CAPACIDADE.',
    parametros: {
      type: 'object',
      properties: {
        situacao: { type: 'string', description: 'A situacao da pessoa, nas palavras dela.' },
      },
      required: ['situacao'],
    },
  },
  {
    nome: 'consultar_links',
    descricao:
      'Os TRES unicos enderecos que voce pode escrever: site, lista de espera e Instagram. ' +
      'OBRIGATORIA antes de mencionar qualquer um deles, e obrigatoria no gate de saida, ' +
      'que termina sempre com o site E o Instagram. ' +
      '🔴 COPIE A URL CARACTERE POR CARACTERE, inteira, do campo `url`. Nao reescreva de ' +
      'cabeca, nao encurte, nao tire o https, nao troque por arroba e nao "limpe" o final: ' +
      'o Instagram termina em `.app/` e essa e justamente a parte que some quando se ' +
      'digita de memoria, deixando um link que nao abre. ' +
      'Citar o canal sem colar a URL na mesma mensagem e o mesmo que nao ter dado o link.',
    parametros: { type: 'object', properties: {} },
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

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O CONJUNTO DE TOOLS POR TRILHA
 *
 *  🔑 O schema das oito tools pesa ~1.745 tokens e ia em TODA chamada, inclusive
 *  nas trilhas que nao podiam usar metade delas. Filtrar nao toca em uma linha
 *  de conteudo, entao e o corte mais seguro que existe aqui.
 *
 *  🔴 CRITERIO: sai a tool que a trilha nao pode usar POR REGRA, nunca a que
 *  ela "provavelmente nao vai precisar". Tool ausente nao vira resposta pior,
 *  vira resposta inventada: o modelo nao tem como saber que a ferramenta
 *  existia e responde de cabeca. Na duvida, a tool fica.
 *
 *  ⚠️ Por isso `tecnico` e `comercial` mantem as oito. A trilha tecnica e a
 *  porta de entrada de qualquer assunto, e a comercial precisa de escopo, CNAE
 *  e estimativa tanto quanto de preco. O corte real acontece nas duas trilhas
 *  que tem regra dura sobre o que NAO fazer.
 * ════════════════════════════════════════════════════════════════════════════
 */
export const TOOLS_POR_SAIDA: Record<string, string[]> = {
  /**
   * Gate de saida. A pergunta e uma so: a casa atende? E a resposta termina nos
   * canais oficiais.
   *
   * Fora: `estimar_das` e `consultar_preco` (nao se cotiza para quem nao se
   * atende), `consultar_contrato` (nao ha contrato a discutir) e
   * `buscar_cartao` (capacidade do produto nao interessa a quem esta fora).
   */
  fora_escopo: ['consultar_escopo', 'consultar_cnae', 'consultar_links', 'buscar_base'],

  /**
   * Escalonamento. A regra dura da trilha e "voce PARA de resolver".
   *
   * 🔑 Tirar `estimar_das` daqui nao e economia, e coerencia: a trilha existe
   * porque a conta do caso NAO e sua. Deixar a calculadora na mao de quem
   * acabou de receber ordem de nao calcular e convite a desobedecer, e
   * aderencia e o defeito de sempre deste agente.
   *
   * Fica `consultar_contrato` porque fidelidade e multa sao CONSULTA, e ficam
   * os canais para o aviso de que um atendente assume.
   */
  escalonamento: ['consultar_contrato', 'consultar_escopo', 'consultar_links', 'buscar_base'],

  tecnico: NOMES_DE_TOOL,
  comercial: NOMES_DE_TOOL,
}

/** As tools que a trilha recebe. Trilha desconhecida recebe todas, nunca nenhuma. */
export function toolsDaTrilha(saida: string): DefinicaoTool[] {
  const permitidas = TOOLS_POR_SAIDA[saida]
  if (!permitidas) return TOOLS
  return TOOLS.filter((t) => permitidas.includes(t.nome))
}
