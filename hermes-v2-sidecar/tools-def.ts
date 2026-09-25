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
      '🔴 SE A BUSCA RETORNAR VAZIA: NUNCA presuma que a casa atende. Se não encontrou, você não sabe. Responda que não encontrou a profissão pelo nome e peça para o cliente detalhar o que faz no dia a dia. ' +
      /* 🔴 Os dois campos que a doc do vault nao conhecia ate 25/09, e por isso
         voltavam no payload sem ninguem dizer o que fazer com eles. O
         `motivo_nao_atende` e o pior dos dois: e a RESPOSTA da recusa, e sem
         ele o agente dizia "nao atendemos" e improvisava o porque. */
      '🔴 QUANDO `casa_atende_me` FOR false, O CAMPO `motivo_nao_atende` E A RESPOSTA. ' +
      'Ele vem numa palavra fechada (comercio-ou-industria, paga-icms, anexo-iv, vedado-simples, ' +
      'ambiguo-simples, exige-alvara-previo, exige-conselho, exige-registro-setorial). Diga o ' +
      'limite a partir dele, em portugues de gente, e NUNCA leia a palavra tecnica para o ' +
      'cliente. Se vier `ambiguo-simples`, nao decida: escale. ' +
      '🔴 O CAMPO `achou_por` DIZ O QUANTO O CASAMENTO E FORTE. `codigo` e `sinonimo` sao ' +
      'exatos. `titulo` e forte. `termos` e FRACO: bateu numa palavra solta da lista do IBGE, ' +
      'e ai voce confirma a atividade com a pessoa antes de concluir qualquer coisa. ' +
      '🔴 DÚVIDA DE CNAE: Se o título retornado não for EXATAMENTE o que o cliente disse (ex: pediu "médico" e voltou "Aluguel de material médico"), NUNCA crave que atende ou não atende. Devolva a dúvida dizendo: "Você quis dizer [Nome do Título Retornado]?". Se o cliente disser que não, diga: "Me conta mais um pouco do seu dia a dia pra eu procurar novamente sua atividade". ' +
      /* 🔴 O VERBO MANDA, e esta regra nasceu de um caso medido em 24/09.
         "vendo roupa" devolvia `7723-3/00 Aluguel de roupa, fantasia, traje
         de noiva` com `casa_atende_me: true` — e o casamento era legitimo,
         "roupa" esta mesmo no titulo. O que a busca nao sabe e que VENDER e
         comercio e ALUGAR e servico. A camada de sinonimos cobre as frases
         mais comuns; o resto e voce quem pega. */
      '🔴 O VERBO DA PESSOA MANDA MAIS QUE O SUBSTANTIVO. Se ela disse VENDO, VENDA ou REVENDO ' +
      'e o titulo que voltou fala em ALUGUEL, CONSERTO, PRODUCAO ou AULA, o objeto bateu e a ' +
      'ATIVIDADE nao. NUNCA confirme nesse caso: pergunte "voce VENDE ou voce [verbo do titulo]?". ' +
      'Vender mercadoria e comercio, e a casa nao atende comercio — mas quem vende ESPACO ' +
      'PUBLICITARIO ou faz PROMOCAO DE VENDAS presta servico e a casa atende. Sao coisas ' +
      'diferentes, e so a pessoa pode desempatar. ' +
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
    // 🔴 21/09: no turno 7 da maratona o cliente disse "fechou, quero assinar" e a
    //    resposta saiu SEM plano e SEM preco, em 3 de 3 rodadas. Na rodada 3 a rota
    //    ja estava certa (`comercial`), o que isolou o defeito aqui: a descricao
    //    cobria a PERGUNTA de preco e nao o MOMENTO do fechamento. Quem ja decidiu
    //    nao pergunta "quanto custa", diz "quero assinar", e precisa do valor na
    //    mesma mensagem para fechar.
    descricao:
      'O preco do plano, o que inclui, o que NAO inclui e ate quando vale a promocao ' +
      '(campo vigencia_ate). Unico lugar de onde sai valor de plano. Confirme o regime ' +
      'antes: o certificado digital e incluso no ME e nao existe no MEI, e esse erro ja ' +
      'foi para producao. ' +
      '🔴 Citou o preco promocional? A DATA ATE QUANDO ELE VALE sai na mesma mensagem. ' +
      'Promocao sem prazo parece preco normal, e a pessoa descobre o valor cheio depois, ' +
      'achando que foi enganada. A data e real e pode ser usada como motivo para decidir ' +
      'agora; inventar escassez ("so hoje", "ultimas vagas") continua proibido. ' +
      'OBRIGATORIA no MOMENTO DO FECHAMENTO, nao so quando perguntam o valor: ' +
      '"quero assinar", "fechou", "vamos fechar", "quero contratar", "quero comprar", ' +
      '"como faco para contratar", "como finalizo", "onde eu assino", "bora", "topo". ' +
      '🔴 Quem ja decidiu precisa do plano e do valor NA MESMA MENSAGEM. Confirmar a ' +
      'decisao sem dizer qual plano e por quanto deixa a venda sem numero e obriga a ' +
      'pessoa a perguntar de novo o que ela ja tinha dado como resolvido.',
    parametros: {
      type: 'object',
      properties: { regime: { type: 'string', enum: ['mei', 'me_simples'] } },
      required: ['regime'],
    },
  },
  {
    nome: 'estimar_das',
    descricao:
      'Estimativa aproximada do imposto do mes sobre um faturamento que A PESSOA informou, ' +
      'E TAMBEM os parametros da regra fiscal: limiar do Fator R, margem que a Legalizai ' +
      'trabalha, piso do pro-labore e INSS do socio. Chame tambem quando a pergunta for ' +
      'sobre Fator R, pro-labore ou INSS, mesmo sem faturamento na conversa. ' +
      'Tres obrigacoes ao usar a estimativa: dizer que e aproximada, mostrar o que SOBRA na ' +
      'mesma frase, e nunca inventar o faturamento dela. Se ela recusa a estimativa e exige ' +
      'o numero fechado, isso e escalonamento, nao uma segunda chamada.',
    parametros: {
      type: 'object',
      properties: {
        anexo: { type: 'string', enum: ['III', 'V'] },
        rbt12: { type: 'string', description: 'Receita dos ultimos doze meses, em reais.' },
        receita_mes: { type: 'string', description: 'A receita do mes, em reais.' },
      },
      // 🔑 Nada e obrigatorio: sem faturamento, a chamada devolve so os
      //    parametros da regra (Fator R, pro-labore, INSS). Exigir os tres
      //    campos deixava a pergunta "o que e Fator R" sem tool que a
      //    respondesse, e o numero esta apagado das notas de proposito.
      required: [],
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
    // 🔴 22/09: a palavra "OBRIGATORIA" na descricao NAO segurou. Medido com a
    //    instrumentacao de chamada: oferecida em 28 de 28 turnos, chamada em 0.
    //    Dos 4 turnos que afirmaram sem base, 2 eram endereco inventado —
    //    `legalizai.com.br/lista-de-espera/` (caminho que nao existe) e
    //    `legalizai.com.br/.` (sem o www, com ponto no fim). E "Lista VIP"
    //    apareceu em 3 turnos: nome de canal inventado, vizinho de link
    //    inventado, que nem estava na conta.
    //
    //    🔑 O que mudou aqui: a descricao passou a seguir o molde do
    //    `consultar_escopo`, que e a UNICA tool que o modelo chama. A diferenca
    //    nao e a palavra "obrigatoria" — quatro tools a tem e estao em zero. E
    //    nomear o GATILHO na lingua do cliente e a FRASE PROIBIDA, literal.
    descricao:
      'Os QUATRO unicos enderecos que voce pode escrever: site, lista de espera, Instagram ' +
      'e o e-mail de contato. Telefone nao existe nesta lista de proposito: o WhatsApp da ' +
      'Legalizai e a propria conversa. ' +
      '🔴 CHAME ESTA FERRAMENTA PRIMEIRO, e so depois escreva, sempre que a conversa ' +
      'chegar a qualquer uma destas: a pessoa pedir o site, o link, o Instagram, o ' +
      'e-mail ou "onde eu acompanho"; a pessoa perguntar como entra na lista de espera; ' +
      'voce for oferecer a lista de espera; ou voce estiver fechando um gate de saida, ' +
      'que termina SEMPRE com o site E o Instagram. ' +
      '🔴 Escrever endereco, nome de canal ou caminho de pagina sem ter chamado esta tool ' +
      'NO MESMO TURNO e alucinacao, mesmo que voce ache que lembra. Errar uma letra nao ' +
      'e detalhe: o cliente clica e cai em lugar nenhum, e foi exatamente isso que ' +
      'aconteceu. ' +
      'Frases que ja sairam erradas por memoria, e que so podem sair depois da chamada: ' +
      '"o endereco e este", "o site e", "no Instagram a gente posta", "se quiser entrar, ' +
      'o link e", "entra na lista". ' +
      '🔴 O canal chama LISTA DE ESPERA. Nao existe "Lista VIP", "lista de prioridade", ' +
      '"lista de lancamento" nem qualquer outro nome: nome de canal tambem se le aqui, ' +
      'nao se inventa. ' +
      '🔴 COPIE O ENDERECO CARACTERE POR CARACTERE, inteiro, do campo `url`. Nao reescreva ' +
      'de cabeca, nao encurte, nao tire o `www.`, nao tire o https, nao troque por arroba, ' +
      'nao invente caminho de pagina e nao "limpe" nem acrescente nada no final: o site ' +
      'tem `www.`, a lista termina em `/em-breve` e o Instagram termina em `.app/`. Essas ' +
      'sao justamente as partes que somem quando se digita de memoria. ' +
      'Citar o canal sem colar o endereco na mesma mensagem e o mesmo que nao ter dado o ' +
      'link. O e-mail (tipo `email`) vai como endereco puro: sem mailto, sem markdown.',
    parametros: { type: 'object', properties: {} },
  },
  {
    nome: 'buscar_base',
    descricao:
      'Busca por assunto no texto da base de conhecimento. Use SEMPRE para confirmar regras ' +
      'de orgaos publicos (prefeitura, junta, receita), datas de campanha, condicoes de ' +
      'promocao, lista de espera, e procedimentos de atendimento ou regras de negocio. ' +
      'Na duvida entre esta e as outras, chame esta tambem para evitar inventar informacao.',
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
    // 🔴 21/09: no turno 8 da maratona o cliente disse "tenho medo de ficar preso e
    //    tomar multa, tem fidelidade?" e o Leo NEGOU a fidelidade de 12 meses, nas
    //    duas rodadas, com `tecnicaOk=false` e zero tool chamada. A descricao antiga
    //    nomeava os ASSUNTOS ('fidelidade, multa') mas nao a SITUACAO, e objecao
    //    chega em linguagem de medo, nao de contrato. Os gatilhos abaixo existem
    //    para essa falha, e negar fidelidade e o erro mais caro da venda: a pessoa
    //    fecha e descobre a multa no contrato.
    descricao:
      'Fidelidade, multa, prazo de arrependimento e reajuste. ' +
      'OBRIGATORIA sempre que o cliente demonstrar OBJECAO ou receio de se comprometer, ' +
      'perguntar de "multa", "fidelidade", "cancelamento" ou "ficar preso". ' +
      'NUNCA responda de memoria. SO NO TURNO DA PERGUNTA.',
    parametros: { type: 'object', properties: {} },
  },
  {
    nome: 'consultar_escopo',
    // 🔴 21/09: a regra NEGATIVA nao segurou. O `RULES.md` §3.2 proibia, com o
    //    exemplo literal, dizer "pelo que voce fatura", e em producao o agente
    //    escreveu exatamente essa frase 40 segundos depois da regra entrar no ar.
    //    Regra negativa em prompt nao impede alucinacao de memoria; o que impede
    //    e obrigar a tool ANTES da afirmacao. Ver
    //    `reports/evolucao-2026-09-21-whatsapp-manual-v2.md` §4.1.
    descricao:
      'A lista do que a casa atende e do que nao atende, com a saida sugerida para quem ' +
      'cai fora, E OS DOIS TETOS DE FATURAMENTO com valor. Fora do escopo NAO e ' +
      'escalonamento: nenhum atendente resolve o que o produto nao faz. ' +
      '🔴 NUNCA diagnostique MEI ou ME sem antes chamar esta ferramenta. Se a pessoa ' +
      'falar de faturamento, em qualquer forma (valor, faixa, teto, "no maximo", "uns", ' +
      '"por volta de"), OBRIGATORIAMENTE chame esta ferramenta PRIMEIRO e so depois ' +
      'escreva a resposta. Dizer "com esse faturamento", "pelo que voce fatura" ou ' +
      '"entao voce e MEI" sem ter chamado esta tool no mesmo turno e alucinacao de ' +
      'memoria, e ja foi para producao. ' +
      '⚠️ E o teto NAO fecha o diagnostico sozinho: a ATIVIDADE pode vedar o MEI mesmo ' +
      'com faturamento baixo. Sem CNAE confirmado por `consultar_cnae`, a resposta e ' +
      'provisoria e voce diz isso. ' +
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
