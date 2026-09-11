/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROPOSTAS — o que EU sugiro, separado do que o Pedro já decidiu.
 * ═══════════════════════════════════════════════════════════════════════════
 * Combinado em 11/09: *"quando eu te pedir sugestão de como você resolveria os
 * gargalos, quero que você de fato valide e dê opiniões… se vir necessidade de
 * resolver criando uma tela, coloque a sugestão no card; se achar pertinente
 * adicionar mais uma ramificação, crie a ramificação… mas TODAS em cinza
 * claro, com um X e um check pra eu clicar."*
 *
 * 🔴 POR QUE ARQUIVO SEPARADO, e não um campo no `processos-data.mjs`.
 *
 * O `processos-data.mjs` é o que a casa DECIDIU. Isto aqui é o que eu ACHO.
 * Misturar os dois faria três estragos de uma vez:
 *   1. descartar deixaria cicatriz no arquivo de verdade (linha removida,
 *      diff sujo, e um dia alguém reabre a discussão sem saber que morreu);
 *   2. o placar 🟢🟡🔴 passaria a contar opinião minha como estado do produto,
 *      que é exatamente a mentira que a doutrina §3 existe pra evitar;
 *   3. o arquivo que a doutrina §5 reserva pra edição humana viraria pasto de
 *      texto gerado.
 *
 * Proposta aceita **não se promove sozinha**: ela vira sólida no board na
 * hora, e eu escrevo no `processos-data.mjs` no fecho do flow, junto com a
 * linha no ADR. Decisão travada tem que passar por registro — foi o Pedro que
 * escolheu assim quando montamos esta dinâmica.
 *
 * ── COMO SE ESCREVE UMA PROPOSTA ───────────────────────────────────────────
 *
 * 🔴 UMA PROPOSTA É UM PATCH, não um tipo (refeito em 11/09).
 *
 * Ela nasceu com UM tipo por proposta — "passo", "aresta", "campo" ou
 * "remover". Aí o Pedro pediu uma mudança que era as quatro coisas ao mesmo
 * tempo: completar uma tela, criar um passo, tirar outro e religar o desenho.
 * Com tipo único isso vira quatro propostas, e aceitar três delas quebra o
 * processo — exatamente o que a §6.4 acabou de proibir. Então uma proposta
 * carrega as partes que precisar:
 *
 *   passos    · cartões novos (cada um com `id` "S<n>" ou "S<n><letra>")
 *   mudancas  · [{ passo, campo, valor }] em passos que já existem. NÃO
 *               aparecem no cartão (altura é fixa, §5.1): vão pro painel
 *               lateral, e o cartão ganha um selo de "tem sugestão"
 *   remove    · ids de passos que saem do processo
 *   arestas   · ligações novas, com `label` quando houver condição
 *   substitui · ligações que morrem quando a proposta é aceita
 *   rotula    · [{ de, para, label }] pra aresta que só troca de NOME.
 *               🔴 Nunca escrever renomeação como substitui + arestas com as
 *               mesmas pontas: é ambíguo por construção, e em 11/09 desenhou
 *               linha duplicada no board e apagou as duas no simulador
 *
 * Obrigatórios:
 *   id     · "S<n>", único e ESTÁVEL. É por ele que a decisão fica gravada:
 *            reusar um id descartado ressuscita um "não" do Pedro.
 *   porque · o raciocínio, em português. É o que ele lê pra decidir.
 *
 * Opcional, e vale a pena quando é verdade:
 *   depende · ids de outras propostas que precisam existir pra esta fazer
 *             sentido. Serve pra eu avisar o que ficou solto quando ele
 *             descarta uma da cadeia — aviso factual, não argumento.
 *
 * 🔴 O TAMANHO CERTO DE UMA PROPOSTA é a mudança que deixa o grafo VÁLIDO
 * quando aceita sozinha. Nem maior (o Pedro perde granularidade), nem menor
 * (ele aceita um pedaço e fica com um beco). Quem confere é o simulador de
 * caminhos do `gerar-processos.mjs` — não a minha impressão.
 *
 * ⚠️ Descarte NÃO é contrariedade. Ele descartar é dado novo: quer dizer que
 * vai trabalhar melhor em cima, e a justificativa vem no chat. Se o descarte
 * soltar uma ponta, eu digo QUAL ponta em uma linha e proponho de novo em cima
 * da razão dele — sem defender a versão morta.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ── LEVA 1 · 11/09 — os 4 vermelhos e os 2 amarelos do P4 ──────────────────
 *
 * Pedido: *"traga a sugestão para os 6, os 4 vermelhos e os 2 amarelos."*
 *
 * 🔑 O ACHADO QUE ORGANIZA TUDO: quatro das seis dúvidas **já estão
 * respondidas dentro da nossa própria minuta**, e ficaram abertas porque o
 * processo foi desenhado antes de alguém cruzar com o contrato. Li as 16
 * cláusulas e o Anexo I inteiros (47.136 caracteres, 100%) e as respostas
 * estavam em 6.3, 6.4, 9.5 e 12.6.
 *
 * Isso muda a natureza do trabalho: não é inventar regra, é **parar de
 * inventar** onde já decidimos. Só duas das seis pedem decisão nova de fato
 * (S2 e S6), e as duas estão marcadas.
 *
 * ⚠️ A minuta está com a advogada e pode voltar mudada. Se uma cláusula que
 * sustenta uma proposta cair no parecer, a proposta cai junto — está dito em
 * cada `porque` de qual cláusula ela depende.
 */
export const PROPOSTAS = [
  /* ═══════════════════════════════════════════════════════════════════════
   * S1 · P4.5 🟡 → 🟢 — o preço congela no PEDIDO. Está escrito na 6.4.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S1",
    titulo: "O preço congela no pedido, e a 6.4 já diz isso",
    mudancas: [
      {
        passo: "P4.5",
        campo: "faz",
        valor:
          "Cria o pedido e congela o preço da tabela vigente NA DATA DO PEDIDO, guardando junto a versão da tabela que a pessoa viu. Reajuste posterior não alcança o que já foi pedido.",
      },
      {
        passo: "P4.5",
        campo: "fonte",
        valor:
          "Cláusula 6.4: aplica-se “a versão vigente na data da contratação de cada serviço, que ficará registrada na Plataforma”. A 6.3 reforça, exigindo exibição prévia do preço.",
      },
      { passo: "P4.5", campo: "luz", valor: "verde" },
    ],
    porque:
      "A dúvida era “congela no pedido ou no fechamento?”. A 6.4 responde sem margem: vale a tabela da DATA DA CONTRATAÇÃO, e ela fica registrada na Plataforma. Não é interpretação — é o texto. O passo estava amarelo porque foi desenhado antes de alguém cruzar com o contrato, não porque falte decisão. Aceitar isto também cria uma obrigação técnica que hoje não está declarada: guardar a VERSÃO da tabela junto do pedido, não só o número do preço. Sem a versão, “a tabela que ele viu” não é provável depois.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S2 · P4.11 🟡 → 🟢 — o dia do fechamento. DECISÃO NOVA, derivada da 3.4.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S2",
    titulo: "O ciclo é o ANIVERSÁRIO do contrato, não uma data fixa do mês",
    mudancas: [
      {
        passo: "P4.11",
        campo: "titulo",
        valor: "O ciclo vira e a fatura soma tudo",
      },
      {
        passo: "P4.11",
        campo: "faz",
        valor:
          "No dia do aniversário do contrato, fecha a janela de itens do ciclo que terminou e emite a fatura. Assinou dia 8, o ciclo vira todo dia 8.",
      },
      {
        passo: "P4.11",
        campo: "ve",
        valor:
          "A fatura muda de “Próxima fatura” para “Fatura de <ciclo>” e para de aceitar item novo. A data do próximo fechamento aparece o tempo todo.",
      },
      {
        passo: "P4.11",
        campo: "fonte",
        valor:
          "Decisão do Pedro em 11/09: cobrança por aniversário, no dia em que o cliente fechou, no mês seguinte, como o padrão de mercado de assinatura. 🔴 Contradiz a cláusula 3.4 da minuta, que fixa o pagamento “até o 15º dia de cada mês”.",
      },
      { passo: "P4.11", campo: "luz", valor: "verde" },
    ],
    porque:
      "🔄 REESCRITO em 11/09. A versão anterior propunha data fixa (fecha no último dia do mês, vence dia 15) e o Pedro travou o contrário: o ciclo é o aniversário do contrato. Ele está certo, e o motivo é operacional: com data fixa, quem assina dia 28 paga um mês cheio por três dias de serviço, ou a gente inventa cálculo proporcional — que é trabalho a mais pra resolver um problema criado pela própria régua. Por aniversário, todo cliente recebe 30 dias pelo preço de 30 dias, e a oferta de lançamento da 3.6 (“3 primeiras competências contadas da ativação”) passa a bater exatamente com o ciclo, sem tradução. O que continua valendo do desenho anterior é a descoberta que destrava o processo: a fatura carrega DUAS temporalidades — a mensalidade do ciclo que começa (antecipada) e os avulsos do ciclo que terminou (vencidos). Só que agora o corte é o aniversário, não a virada do mês. 🔴 A 3.4 precisa mudar, e a minuta está com a advogada desde 10/09.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S3 · P4.6 🔴 → 🟢 — a pergunta do nó está errada. Não é estado, é VALOR.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S3",
    titulo: "P4.6 deixa de ser decisão e vira passo, só no ramo de até R$ 50",
    mudancas: [
      { passo: "P4.6", campo: "titulo", valor: "Acha ou abre a fatura do próximo ciclo" },
      {
        passo: "P4.6",
        campo: "faz",
        valor:
          "Procura a fatura do próximo ciclo. Se ela ainda não existir, abre uma, e é nela que o item entra.",
      },
      { passo: "P4.6", campo: "forma", valor: "passo" },
      {
        passo: "P4.6",
        campo: "fonte",
        valor:
          "Cláusula 6.3 e Anexo A-I.1: item de até R$ 50 é lançado na fatura da competência seguinte. Com o ciclo por aniversário (S2), qual fatura recebe o item deixa de ser pergunta e vira consequência.",
      },
      { passo: "P4.6", campo: "luz", valor: "verde" },
    ],
    // só a “já fechou · ❓” morre de fato: ela era o buraco que o S2 fechou
    substitui: [{ de: "P4.6", para: "P4.11" }],
    // 🔴 as outras duas NÃO trocam, só mudam de nome. Quando eu escrevi isso
    // como apagar-e-recriar, o board desenhou linha duplicada e o simulador
    // apagou as duas pontas. Renomear é primitivo próprio.
    rotula: [{ de: "P4.6", para: "P4.7", label: "" }],
    depende: ["S2"],
    porque:
      "🔄 REESCRITO TRÊS VEZES em 11/09, e cada vez por uma correção do Pedro. (1ª) Eu virava o P4.6 em “o item passa de R$ 50?” — que é literalmente o P4.3, já existente: a mesma decisão duas vezes no mesmo caminho. (2ª) Virava no desvio do pagamento, e o Pedro mostrou que o desvio pode sair direto do P4.5, sem nó no meio — e ele tem o precedente a favor: o P4.8 já é um passo comum com TRÊS saídas rotuladas. (3ª) Eu então propus REMOVER o nó, e o Pedro perguntou se ele não continuava vivo para os serviços de até R$ 50. Continua. 🔑 O que morre aqui é a PERGUNTA (“existe fatura aberta?”), que o S2 tornou determinística. O TRABALHO não morre: alguém tem que achar a fatura do próximo ciclo e, se ela ainda não existir, abrir. Isso acontece no primeiro mês do cliente e em todo pedido feito logo depois de um fechamento. Remover o nó teria jogado esses dois casos pra debaixo do tapete do P4.7, que diz “soma à fatura” sem dizer a qual nem o que fazer quando não há nenhuma. Por isso ele é rebaixado, não removido: vira passo, no ramo de até R$ 50, e as arestas velhas são refeitas com os rótulos certos, no mesmo pacote.",
  },



  /* ═══════════════════════════════════════════════════════════════════════
   * S6 · P4.9 🔴 — não entregue. DECISÃO NOVA, espelhando a 9.5.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S6",
    titulo: "Não entregue: primeiro a causa, depois a trilha",
    mudancas: [
      { passo: "P4.9", campo: "titulo", valor: "O serviço não pôde ser entregue" },
      {
        passo: "P4.9",
        campo: "faz",
        valor:
          "Separa por CAUSA: falha nossa ou do órgão de um lado, falta de documento do cliente do outro. O que acontece com o dinheiro depende de como ele entrou.",
      },
      {
        passo: "P4.9",
        campo: "ve",
        valor: "Aviso no item dizendo por que não deu e o que vai acontecer com o valor.",
      },
      { passo: "P4.9", campo: "fala", valor: "só a nossa casa" },
      { passo: "P4.9", campo: "forma", valor: "decisao" },
      {
        passo: "P4.9",
        campo: "fonte",
        valor:
          "Espelha a cláusula 9.5 (não realizado o ato, o valor volta, salvo taxa já retida pelo órgão) e a 1.4 (a Legalizai não responde por documentação não apresentada pelo Cliente). Regra nova: a 9.5 trata de taxa pública, não de serviço adicional.",
      },
      { passo: "P4.9", campo: "luz", valor: "amarelo" },
    ],
    passos: [
      {
        id: "S6a",
        processo: "P4",
        titulo: "A cobrança fica de pé",
        quem: "a casa",
        faz: "Não devolve nada: o trabalho foi feito e a entrega não saiu porque faltou documento do cliente. O item segue cobrado, do jeito que já estava.",
        fala: "só a nossa casa",
        ve: "O item fica com o aviso de por que não deu, e o valor permanece.",
        luz: "verde",
        forma: "fim",
        fonte: "Cláusula 1.4: a Legalizai não responde pelas consequências de documentação não apresentada pelo Cliente.",
      },
      {
        id: "S6b",
        processo: "P4",
        titulo: "Tira da fatura, ou credita na seguinte",
        quem: "a casa",
        faz: "Se a fatura ainda não fechou, tira o item dela. Se já fechou, lança um crédito do mesmo valor na fatura seguinte.",
        fala: "só a nossa casa",
        ve: "O item some da próxima fatura, ou aparece um crédito com o motivo escrito.",
        luz: "verde",
        forma: "fim",
        fonte: "Princípio da cláusula 9.5 aplicado ao avulso: o que não foi realizado não é devido.",
      },
      {
        id: "S6c",
        processo: "P4",
        titulo: "Estorna o que já foi pago",
        quem: "a casa",
        faz: "O dinheiro já entrou, então devolver é uma operação no provedor, não um ajuste de fatura. Pede o estorno e acompanha até cair.",
        fala: "gateway de pagamento (ainda não escolhido)",
        ve: "O item mostra o estorno em andamento e o prazo de devolução.",
        luz: "vermelho",
        forma: "fim",
        fonte: "Mesmo princípio da 9.5, mas com dinheiro já compensado — situação que a minuta não trata.",
        duvida:
          "Três perguntas, e nenhuma tem resposta hoje. (1) A taxa que o gateway reteve volta? Na maioria dos provedores, não — então estorno integral sai do nosso bolso. (2) Estorno ou crédito na próxima fatura? Crédito não custa taxa e é mais rápido, mas prende o cliente. (3) Qual o prazo, e quem avisa quando cai. Tudo isso depende do provedor, que ainda não foi escolhido.",
      },
    ],
    arestas: [
      { de: "P4.9", para: "S6a", label: "o cliente deu causa" },
      { de: "P4.9", para: "S6b", label: "falha nossa ou do órgão", quando: "fatura" },
      { de: "P4.9", para: "S6c", label: "falha nossa ou do órgão", quando: "pago" },
    ],
    depende: [],
    porque:
      "🔄 REESCRITO em 11/09, aplicando a trilha a pedido do Pedro — e aqui ela muda mais do que o texto. A versão anterior dizia “tira o item da fatura” como se fosse a única resolução possível, mas isso só vale na trilha da FATURA. Na trilha do PAGO o dinheiro já foi compensado: devolver deixa de ser ajuste de fatura e vira operação no provedor. 🔑 E aí aparece o que só o corte por trilha revela: naquele ramo o passo deixa de ser “só a nossa casa” e passa a FALAR COM O GATEWAY. Um passo que era 🟢 de um lado é 🔴 do outro, pelo mesmo evento. O corte de CAUSA continua valendo nas duas trilhas e por isso tem saída única: se o cliente deu causa, a cobrança fica de pé, e tanto faz se ela está na fatura ou já foi paga — não há o que fazer em nenhum dos dois casos. ⚠️ O S6c traz três perguntas novas e caras: a taxa retida pelo gateway volta? estorno ou crédito? qual prazo? Nenhuma tem resposta antes de escolher o provedor.",
    },

  /* ═══════════════════════════════════════════════════════════════════════
   * S7 · P4.10 🔴 → 🟢 — cancelamento com avulso: a 12.6 já responde.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S7",
    titulo: "Cancelou com avulso na fatura: entrega e cobra, pela 12.6",
    mudancas: [
      { passo: "P4.10", campo: "titulo", valor: "Cancelou com avulso na fatura" },
      {
        passo: "P4.10",
        campo: "faz",
        valor:
          "O contrato segue vivo nos 30 dias de aviso prévio, então o avulso continua normalmente. A única pergunta é se o serviço sobrevive ao fim do CNPJ: o que precisa de empresa ativa tem que sair ANTES da baixa.",
      },
      {
        passo: "P4.10",
        campo: "ve",
        valor:
          "Na tela de cancelamento, a lista do que continua em andamento e o valor que vai na fatura final, antes de confirmar.",
      },
      {
        passo: "P4.10",
        campo: "fonte",
        valor:
          "Cláusula 12.6: quitar todos os valores em aberto até a data do encerramento, incluindo faturas de serviços adicionais. Cláusula 12.1: aviso prévio de 30 dias.",
      },
      { passo: "P4.10", campo: "forma", valor: "decisao" },
      // a dúvida morre com a decisão: passo verde não carrega pergunta aberta
      { passo: "P4.10", campo: "duvida", valor: "" },
      { passo: "P4.10", campo: "luz", valor: "verde" },
    ],
    passos: [
      {
        id: "S7a",
        processo: "P4",
        titulo: "Entrega e cobra na fatura final",
        quem: "a casa",
        faz: "Entrega o serviço dentro do aviso prévio e lança o valor na fatura final, que é quitada até a data do encerramento.",
        fala: "só a nossa casa",
        ve: "O item segue em andamento normalmente, e aparece na fatura final com a data de encerramento junto.",
        luz: "verde",
        forma: "fim",
        fonte: "Cláusula 12.6 (quitar tudo em aberto até o encerramento, incluindo serviços adicionais) e 12.1 (aviso prévio de 30 dias).",
      },
    ],
    arestas: [
      { de: "P4.10", para: "S7a", label: "o serviço sobrevive ao fim do CNPJ" },
    ],
    depende: ["S6"],
    porque:
      "🔄 REESCRITO em 11/09 com a decisão do Pedro, que trocou a régua por uma melhor. Eu tinha desenhado isto como “quem deu causa”, herdando o corte do S6. Ele cortou por outro eixo: o avulso CONTINUA normalmente, porque foi contratado e, na trilha da fatura, ainda vai ser cobrado (12.6) — a única pergunta é se o serviço sobrevive ao fim do CNPJ. 🔑 E dentro disso vem uma ordem de execução que não estava em lugar nenhum: o que precisa de empresa ativa tem que sair ANTES da baixa. Se o cliente pediu uma certidão e a baixa na mesma leva, a certidão vem primeiro ou não vem. Isso deixa o P4.10 verde: não é mais “não sabemos o que fazer”, é uma decisão com duas saídas — sobrevive (entrega e cobra na fatura final) ou morre com a baixa (cai na régua da causa, pelo S8). ⚠️ Vale lembrar que cancelar o PLANO e dar BAIXA no CNPJ são coisas diferentes: sair da Legalizai não encerra a empresa. A régua só morde quando a baixa também foi pedida — e a baixa é ela mesma um avulso do catálogo (§8.2). Antes de confirmar o cancelamento, a tela precisa dizer o que ainda vai ser entregue, o que não vai, e por quê; senão o cliente descobre depois, que é onde nasce reclamação.",
    },

  /* ═══════════════════════════════════════════════════════════════════════
   * S9 · passo NOVO — o dia 31 num mês de 30. Âncora fixa, recuo temporário.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S9",
    titulo: "O ciclo vira no aniversário — e o que fazer quando o mês não tem aquele dia",
    passos: [{
      id: "S9",
      processo: "P4",
      titulo: "O ciclo vira no dia do aniversário",
      quem: "o relógio",
      faz: "Usa o dia do aniversário. Se o mês não tiver esse dia, recua pro último dia daquele mês e volta pro dia original no mês seguinte que comportar. A âncora nunca muda: 31/01 vira 28/02 e volta a 31/03.",
      fala: "só a nossa casa",
      ve: "A data do próximo fechamento sempre escrita por extenso, nunca “daqui a um mês”.",
      luz: "amarelo",
      forma: "passo",
      fonte:
        "Padrão de mercado de assinatura (âncora de ciclo com recuo pro último dia do mês). 🕓 Citado de memória da documentação da Stripe e do padrão Chargebee/Recurly, NÃO conferido em fonte primária. ⚠️ O Código Civil, art. 132 §3º, resolve prazo em mês pelo caminho oposto (“ou no imediato, se faltar exata correspondência”), o que daria 1º/03.",
    }],
    arestas: [
      { de: "P4.8", para: "S9", label: "correu bem", quando: "fatura" },
      { de: "S9", para: "P4.11" },
    ],
    substitui: [{ de: "P4.8", para: "P4.11" }],
    depende: ["S2"],
    porque:
      "A pergunta do Pedro: “fecha dia 31 e o mês seguinte só tem 30, o que o mercado faz?”. Faz recuo pro último dia, mantendo a âncora — 31/01 cobra 28/02 e volta a cobrar 31/03. A alternativa que parece mais simples (mover a âncora pra 28 pra sempre) tira 3 dias de ciclo do cliente todo ano sem ele ter pedido, e o erro se acumula. Fica 🟡 por dois motivos, e nenhum deles é o desenho: (1) a régua de mercado está citada de MEMÓRIA, e número sem fonte não entra — conferir na doc do gateway escolhido, conversa que já vai acontecer com o Pagar.me; (2) falta decidir o que acontece quando o dia cai em fim de semana ou feriado, que é pergunta de meio de pagamento, não de calendário: boleto costuma prorrogar pro próximo dia útil, cartão cobra no dia mesmo. Vira passo próprio porque é cálculo que o app faz sozinho toda competência, e cálculo que mora só na cabeça de alguém vira bug de fevereiro.",
  },




  /* ═══════════════════════════════════════════════════════════════════════
   * S8 · aresta NOVA — a ponte que fecha o desenho.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S8",
    titulo: "A ponte do cancelamento pro “não entregue”",
    arestas: [
      { de: "P4.10", para: "P4.9", label: "o serviço morre com a baixa do CNPJ" },
    ],
    depende: ["S6", "S7"],
    porque:
      "Hoje o P4.10 é uma ponta solta: o processo entra nele e não sai. Com o S7, o caso normal se resolve (entrega e cobra na fatura final), e sobra exatamente um caso — o serviço que não cabe nos 30 dias do aviso prévio. Esse não pede regra nova, pede ligação: é a mesma pergunta do S6, “quem deu causa?”. A ramificação existe pra que ninguém volte a tratar isso como buraco separado daqui a um mês.",
  },
];
