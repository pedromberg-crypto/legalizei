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
 * Três tipos, e o tipo diz onde ela aparece no board:
 *
 *   tipo: "passo"  → cartão novo, cinza, no lugar onde ele entraria.
 *                    Traz os campos de um passo normal + `arestas` dizendo
 *                    de onde ele vem e pra onde vai (sem isso ele flutua).
 *   tipo: "aresta" → ramificação nova entre dois passos que já existem.
 *   tipo: "campo"  → mudança num campo de um passo existente. NÃO aparece no
 *                    cartão (altura é fixa, §5.1): aparece no painel lateral,
 *                    e o cartão ganha um selo discreto de "tem sugestão".
 *
 * Campos obrigatórios em qualquer uma:
 *   id     · "S<n>", único e ESTÁVEL. É por ele que a decisão fica gravada:
 *            reusar um id descartado ressuscita um "não" do Pedro.
 *   porque · o raciocínio, em português. É o que ele lê pra decidir.
 *
 * Opcional, e vale a pena quando é verdade:
 *   depende · ids de outras propostas que precisam existir pra esta fazer
 *             sentido. Serve pra eu avisar o que ficou solto quando ele
 *             descarta uma da cadeia — aviso factual, não argumento.
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
    tipo: "campo",
    passo: "P4.5",
    titulo: "O preço congela no pedido, e a 6.4 já diz isso",
    mudancas: [
      {
        campo: "faz",
        valor:
          "Cria o pedido e congela o preço da tabela vigente NA DATA DO PEDIDO, guardando junto a versão da tabela que a pessoa viu. Reajuste posterior não alcança o que já foi pedido.",
      },
      {
        campo: "fonte",
        valor:
          "Cláusula 6.4: aplica-se “a versão vigente na data da contratação de cada serviço, que ficará registrada na Plataforma”. A 6.3 reforça, exigindo exibição prévia do preço.",
      },
      { campo: "luz", valor: "verde" },
    ],
    porque:
      "A dúvida era “congela no pedido ou no fechamento?”. A 6.4 responde sem margem: vale a tabela da DATA DA CONTRATAÇÃO, e ela fica registrada na Plataforma. Não é interpretação — é o texto. O passo estava amarelo porque foi desenhado antes de alguém cruzar com o contrato, não porque falte decisão. Aceitar isto também cria uma obrigação técnica que hoje não está declarada: guardar a VERSÃO da tabela junto do pedido, não só o número do preço. Sem a versão, “a tabela que ele viu” não é provável depois.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S2 · P4.11 🟡 → 🟢 — o dia do fechamento. DECISÃO NOVA, derivada da 3.4.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S2",
    tipo: "campo",
    passo: "P4.11",
    titulo: "O ciclo é o ANIVERSÁRIO do contrato, não uma data fixa do mês",
    mudancas: [
      {
        campo: "titulo",
        valor: "O ciclo vira e a fatura soma tudo",
      },
      {
        campo: "faz",
        valor:
          "No dia do aniversário do contrato, fecha a janela de itens do ciclo que terminou e emite a fatura. Assinou dia 8, o ciclo vira todo dia 8.",
      },
      {
        campo: "ve",
        valor:
          "A fatura muda de “Próxima fatura” para “Fatura de <ciclo>” e para de aceitar item novo. A data do próximo fechamento aparece o tempo todo.",
      },
      {
        campo: "fonte",
        valor:
          "Decisão do Pedro em 11/09: cobrança por aniversário, no dia em que o cliente fechou, no mês seguinte, como o padrão de mercado de assinatura. 🔴 Contradiz a cláusula 3.4 da minuta, que fixa o pagamento “até o 15º dia de cada mês”.",
      },
      { campo: "luz", valor: "verde" },
    ],
    porque:
      "🔄 REESCRITO em 11/09. A versão anterior propunha data fixa (fecha no último dia do mês, vence dia 15) e o Pedro travou o contrário: o ciclo é o aniversário do contrato. Ele está certo, e o motivo é operacional: com data fixa, quem assina dia 28 paga um mês cheio por três dias de serviço, ou a gente inventa cálculo proporcional — que é trabalho a mais pra resolver um problema criado pela própria régua. Por aniversário, todo cliente recebe 30 dias pelo preço de 30 dias, e a oferta de lançamento da 3.6 (“3 primeiras competências contadas da ativação”) passa a bater exatamente com o ciclo, sem tradução. O que continua valendo do desenho anterior é a descoberta que destrava o processo: a fatura carrega DUAS temporalidades — a mensalidade do ciclo que começa (antecipada) e os avulsos do ciclo que terminou (vencidos). Só que agora o corte é o aniversário, não a virada do mês. 🔴 A 3.4 precisa mudar, e a minuta está com a advogada desde 10/09.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S3 · P4.6 🔴 → 🟢 — a pergunta do nó está errada. Não é estado, é VALOR.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S3",
    tipo: "campo",
    passo: "P4.6",
    titulo: "P4.6 deixa de ser decisão e vira passo, só no ramo de até R$ 50",
    mudancas: [
      { campo: "titulo", valor: "Acha ou abre a fatura do próximo ciclo" },
      {
        campo: "faz",
        valor:
          "Procura a fatura do próximo ciclo. Se ela ainda não existir, abre uma, e é nela que o item entra.",
      },
      { campo: "forma", valor: "passo" },
      {
        campo: "fonte",
        valor:
          "Cláusula 6.3 e Anexo A-I.1: item de até R$ 50 é lançado na fatura da competência seguinte. Com o ciclo por aniversário (S2), qual fatura recebe o item deixa de ser pergunta e vira consequência.",
      },
      { campo: "luz", valor: "verde" },
    ],
    // só a “já fechou · ❓” morre de fato: ela era o buraco que o S2 fechou
    substitui: [{ de: "P4.6", para: "P4.11" }],
    // 🔴 as outras duas NÃO trocam, só mudam de nome. Quando eu escrevi isso
    // como apagar-e-recriar, o board desenhou linha duplicada e o simulador
    // apagou as duas pontas. Renomear é primitivo próprio.
    rotula: [
      { de: "P4.5", para: "P4.6", label: "até R$ 50 · vai pra fatura" },
      { de: "P4.6", para: "P4.7", label: "" },
    ],
    depende: ["S2"],
    porque:
      "🔄 REESCRITO TRÊS VEZES em 11/09, e cada vez por uma correção do Pedro. (1ª) Eu virava o P4.6 em “o item passa de R$ 50?” — que é literalmente o P4.3, já existente: a mesma decisão duas vezes no mesmo caminho. (2ª) Virava no desvio do pagamento, e o Pedro mostrou que o desvio pode sair direto do P4.5, sem nó no meio — e ele tem o precedente a favor: o P4.8 já é um passo comum com TRÊS saídas rotuladas. (3ª) Eu então propus REMOVER o nó, e o Pedro perguntou se ele não continuava vivo para os serviços de até R$ 50. Continua. 🔑 O que morre aqui é a PERGUNTA (“existe fatura aberta?”), que o S2 tornou determinística. O TRABALHO não morre: alguém tem que achar a fatura do próximo ciclo e, se ela ainda não existir, abrir. Isso acontece no primeiro mês do cliente e em todo pedido feito logo depois de um fechamento. Remover o nó teria jogado esses dois casos pra debaixo do tapete do P4.7, que diz “soma à fatura” sem dizer a qual nem o que fazer quando não há nenhuma. Por isso ele é rebaixado, não removido: vira passo, no ramo de até R$ 50, e as três arestas velhas são refeitas com os rótulos certos (S13 e S14).",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S4 · P4.4 🔴 — a tela de aceite que a 6.3 obriga e não existe.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S4",
    tipo: "campo",
    passo: "P4.4",
    titulo: "A tela de aceite: preço, momento da cobrança e o texto aceito",
    mudancas: [
      {
        campo: "ve",
        valor:
          "Tela de aceite com quatro coisas na mesma vista: o preço, a data exata em que vai ser cobrado (“entra na fatura que fecha em 08/10”), o prazo estimado de entrega, e o texto do que está sendo contratado. Botão “Aceitar e contratar”, sem pré-marcação.",
      },
      {
        campo: "faz",
        valor:
          "Mostra preço, momento da cobrança e prazo ANTES do aceite, e só cria o pedido depois do toque explícito.",
      },
      {
        campo: "fonte",
        valor:
          "Cláusula 6.3: acima de R$ 50 “exige aceite específico do Cliente no ato, com exibição prévia do preço e do momento da cobrança”. Cláusula 6.1 acrescenta o prazo estimado. Cláusula 1.6: a confirmação na Plataforma integra o contrato.",
      },
      { campo: "luz", valor: "verde" },
    ],
    depende: ["S5"],
    porque:
      "A 6.3 não pede “uma confirmação”: pede preço E momento da cobrança exibidos ANTES, e aceite específico no ato. Hoje não existe tela nenhuma — é a única obrigação do nosso próprio contrato que o app não cumpre em lugar algum. Repare que “o momento da cobrança” só é exibível depois do S2: sem saber quando a fatura fecha, não dá pra escrever “vence 15/10” na tela. E isto NÃO é o mesmo double-check do P4.2: lá a segunda confirmação é cortesia, aqui é requisito contratual com efeito jurídico (1.6).",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S5 · passo NOVO — o aceite tem que deixar rastro, ou não vale nada.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S5",
    tipo: "passo",
    passos: [{
      id: "S5",
      processo: "P4",
      titulo: "Guarda o comprovante do aceite",
      quem: "a casa",
      faz: "Grava data, hora, o texto exato que foi aceito e a versão da tabela de preços vigente, e deixa isso disponível pra consulta na Plataforma.",
      fala: "só a nossa casa",
      ve: "O aceite fica listado no histórico do serviço, com data e hora, e pode ser reaberto.",
      luz: "verde",
      forma: "passo",
      fonte:
        "Cláusula 6.4 (“que ficará registrada na Plataforma”), 1.6 (a confirmação integra o contrato) e 16.9 (registro de data e hora do aceite).",
    }],
    arestas: [
      { de: "P4.4", para: "S5" },
      { de: "S5", para: "P4.5" },
    ],
    // 🔑 entrar NO MEIO de um caminho não é só somar dois fios: o fio velho
    // tem que sair, senão o board passa a mostrar um desvio que não existe.
    substitui: [{ de: "P4.4", para: "P4.5" }],
    depende: ["S4"],
    porque:
      "Aceite sem rastro é aceite que não existe na hora da discussão. Três cláusulas nossas exigem o registro, e nenhuma delas está coberta por passo: a 6.4 manda registrar a versão da tabela na Plataforma, a 1.6 diz que a confirmação integra o contrato, e a 16.9 já usa “registro de data e hora do aceite” pro contrato principal. É o mesmo padrão, aplicado ao serviço adicional. Entra entre o P4.4 e o P4.5 porque o rastro nasce no aceite e o pedido só deve existir depois dele.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S6 · P4.9 🔴 — não entregue. DECISÃO NOVA, espelhando a 9.5.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S6",
    tipo: "campo",
    passo: "P4.9",
    titulo: "Não entregue: quem deu causa decide quem paga",
    mudancas: [
      { campo: "titulo", valor: "O serviço não pôde ser entregue" },
      {
        campo: "faz",
        valor:
          "Separa por causa. Falha nossa ou do órgão: tira o item da fatura se ela ainda não fechou, e devolve como crédito na competência seguinte se já foi cobrado. Falta de documento do cliente: mantém a cobrança, porque o trabalho foi feito. Taxa pública já retida pelo órgão não volta, e o comprovante fica na Plataforma.",
      },
      {
        campo: "ve",
        valor:
          "Aviso no item dizendo por que não deu, o que acontece com o valor, e o crédito aparecendo na próxima fatura quando for o caso.",
      },
      {
        campo: "fala",
        valor: "só a nossa casa",
      },
      {
        campo: "fonte",
        valor:
          "Espelha a cláusula 9.5 (não realizado o ato, o valor volta, salvo taxa já retida pelo órgão) e a 1.4 (a Legalizai não responde por documentação não apresentada pelo Cliente). Regra nova: a 9.5 trata de taxa pública, não de serviço adicional.",
      },
      { campo: "luz", valor: "amarelo" },
    ],
    porque:
      "A minuta não trata disso para serviço adicional, mas trata para taxa pública, e o princípio da 9.5 é limpo: o que não foi realizado volta, salvo o que o órgão reteve. Estendo isso ao avulso, com um corte que a 1.4 já autoriza: se a entrega não saiu porque o cliente não mandou documento, o trabalho foi feito e a cobrança fica de pé. Deixo em 🟡 de propósito, não em 🟢 — é analogia minha entre cláusulas, não texto expresso, e a diferença importa: quem ratifica é o Mauro ou a advogada. ⚠️ Se aceitar, isto vira cláusula na minuta, não só passo no board.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S7 · P4.10 🔴 → 🟢 — cancelamento com avulso: a 12.6 já responde.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S7",
    tipo: "campo",
    passo: "P4.10",
    titulo: "Cancelou com avulso em andamento: entrega e cobra, pela 12.6",
    mudancas: [
      { campo: "titulo", valor: "Cancelamento com avulso em andamento" },
      {
        campo: "faz",
        valor:
          "O contrato segue vivo nos 30 dias de aviso prévio. O avulso continua e é entregue dentro desse prazo, e entra na fatura final, que tem que ser quitada até a data do encerramento.",
      },
      {
        campo: "ve",
        valor:
          "Na tela de cancelamento, a lista do que continua em andamento e o valor que vai na fatura final, antes de confirmar.",
      },
      {
        campo: "fonte",
        valor:
          "Cláusula 12.6: “o Cliente deverá quitar todos os valores em aberto até a data fixada para o encerramento, incluindo faturas de serviços adicionais”. Cláusula 12.1: aviso prévio de 30 dias.",
      },
      { campo: "luz", valor: "verde" },
    ],
    depende: ["S6"],
    porque:
      "A 12.6 responde a pergunta com todas as letras, e a 12.1 dá o prazo em que a entrega ainda cabe: o contrato não morre no clique, morre 30 dias depois. Então não há “cancela o serviço junto” — há entregar dentro do aviso prévio e cobrar na fatura final. O que a 12.6 não cobre é o avulso que NÃO dá pra entregar nesses 30 dias, e esse caso não precisa de regra nova: cai na do S6, por causa. A tela precisa mostrar isso ANTES da confirmação, senão o cliente descobre a cobrança depois de cancelar, que é onde nasce reclamação.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S9 · passo NOVO — o dia 31 num mês de 30. Âncora fixa, recuo temporário.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S9",
    tipo: "passo",
    passos: [{
      id: "S9",
      processo: "P4",
      titulo: "Acha o dia do ciclo neste mês",
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
      { de: "P4.8", para: "S9", label: "correu bem" },
      { de: "S9", para: "P4.11" },
    ],
    substitui: [{ de: "P4.8", para: "P4.11" }],
    depende: ["S2"],
    porque:
      "A pergunta do Pedro: “fecha dia 31 e o mês seguinte só tem 30, o que o mercado faz?”. Faz recuo pro último dia, mantendo a âncora — 31/01 cobra 28/02 e volta a cobrar 31/03. A alternativa que parece mais simples (mover a âncora pra 28 pra sempre) tira 3 dias de ciclo do cliente todo ano sem ele ter pedido, e o erro se acumula. Fica 🟡 por dois motivos, e nenhum deles é o desenho: (1) a régua de mercado está citada de MEMÓRIA, e número sem fonte não entra — conferir na doc do gateway escolhido, conversa que já vai acontecer com o Pagar.me; (2) falta decidir o que acontece quando o dia cai em fim de semana ou feriado, que é pergunta de meio de pagamento, não de calendário: boleto costuma prorrogar pro próximo dia útil, cartão cobra no dia mesmo. Vira passo próprio porque é cálculo que o app faz sozinho toda competência, e cálculo que mora só na cabeça de alguém vira bug de fevereiro.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S10-S13 · O RAMO DO PAGAMENTO NO ATO (decisão do Pedro, 11/09).
   *
   * 🔴 Este ramo muda a natureza do P4. Até aqui, 9 dos 11 passos falavam
   * “só a nossa casa” — o processo inteiro era banco nosso, e por isso quase
   * tudo era 🟢. Com o pagamento no ato entra um TERCEIRO, e o gargalo deixa
   * de ser regra de negócio e passa a ser integração: o gateway ainda não
   * está escolhido (Asaas caiu em 08/09 por nos jogar no escopo PCI, Pagar.me
   * em avaliação). Por isso os vermelhos aqui não somem com decisão: eles
   * somem com contrato assinado com um provedor.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S10",
    tipo: "passo",
    passos: [{
      id: "S10a",
      processo: "P4",
      titulo: "Paga na hora",
      quem: "cliente",
      faz: "Gera a cobrança do valor travado no aceite e leva a pessoa pro pagamento, sem sair do app.",
      fala: "gateway de pagamento (ainda não escolhido)",
      ve: "Tela de pagamento com o valor, o serviço e o prazo estimado. Pix ou cartão.",
      luz: "vermelho",
      forma: "passo",
      fonte:
        "Decisão do Pedro em 11/09: acima de R$ 50, o pagamento acontece no ato da solicitação. Compatível com a cláusula 6.3, que exige exibir “o momento da cobrança” — aqui o momento é agora. O Anexo I já usa “no ato” para todos os itens acima de R$ 50.",
      duvida:
        "Qual gateway, e com que formato de integração. O Asaas saiu em 08/09 porque o formato dele nos jogaria pro escopo PCI; o Pagar.me está em avaliação e a reunião ainda não aconteceu. Enquanto isso não fecha, este passo não tem caminho técnico — e ele agora é bloqueante, porque sem ele o serviço acima de R$ 50 não começa.",
    },
    {
      id: "S10b",
      processo: "P4",
      titulo: "O pagamento confirmou?",
      quem: "o gateway",
      faz: "Espera a confirmação do provedor. Só com ela o pedido sai de “aguardando” e o serviço é liberado pra execução.",
      fala: "gateway de pagamento (retorno ou webhook)",
      ve: "O item mostra “aguardando pagamento” até confirmar, e muda sozinho quando confirma.",
      luz: "vermelho",
      forma: "decisao",
      fonte:
        "Decisão do Pedro em 11/09: “só será iniciado/liberado após efetuação do pagamento desse serviço.”",
      duvida:
        "Pix confirma em segundos, boleto pode levar dias e cartão pode cair em análise. A pessoa fica parada na tela esperando, ou o app deixa ela sair e avisa depois? E o que vale como “pago”: a autorização do cartão ou a liquidação? Autorizar e capturar são momentos diferentes, e escolher errado aqui gera serviço entregue sem dinheiro compensado.",
    },
    {
      id: "S10c",
      processo: "P4",
      titulo: "Fica aguardando, e nada começa",
      quem: "a casa",
      faz: "Mantém o pedido parado com o preço ainda travado, sem colocar na fila de execução. Deixa a pessoa retomar o pagamento de onde parou.",
      fala: "só a nossa casa",
      ve: "O item aparece como “aguardando pagamento”, com botão pra pagar de novo. Nada de “em andamento”.",
      luz: "amarelo",
      forma: "passo",
      fonte: "Decorre da decisão do Pedro em 11/09 (sem pagamento, não inicia).",
      duvida:
        "Por quanto tempo o pedido espera antes de expirar, e o que acontece com o preço travado quando expira. Se não expirar nunca, um pedido de seis meses atrás pode ser pago pelo preço velho; se expirar rápido demais, quem pagou boleto perde o pedido. A 6.4 trava o preço na data da contratação, então o prazo de validade é a decisão que falta.",
    }],
    // 🔑 a entrada sai do P4.5, não do P4.6 (correção do Pedro, 11/09): a
    // régua já foi aplicada no P4.3, e repetir a pergunta num nó de decisão
    // seria decidir duas vezes a mesma coisa.
    arestas: [
      { de: "P4.5", para: "S10a", label: "acima de R$ 50 · paga agora" },
      { de: "S10a", para: "S10b" },
      { de: "S10b", para: "P4.8", label: "pago" },
      { de: "S10b", para: "S10c", label: "não pagou" },
      { de: "S10c", para: "S10a", label: "tenta de novo" },
    ],
    depende: ["S3"],
    porque:
      "É a sua decisão virando processo. 🔄 Os três passos vêm numa PROPOSTA SÓ, e isso mudou hoje: eram S10, S11 e S12 separados, e o simulador mostrou que aceitar o “paga na hora” sem o “confirmou?” deixava um beco — paga e nada acontece. Ramo de pagamento não se aceita pela metade.\n\nO que a decisão traz de novo, e não é pouco: o P4 deixa de ser um processo que só conversa com a nossa própria base. Até agora eram 9 passos “só a nossa casa”, e é por isso que ele parecia quase resolvido — não havia terceiro pra falhar. Com o gateway entra tudo o que vem junto: retorno assíncrono, tentativa que expira, cobrança que confirma horas depois.\n\nOs três: (a) PAGA NA HORA — 🔴 porque o gateway não está escolhido, e agora isso é bloqueante: sem ele, serviço acima de R$ 50 não começa. (b) CONFIRMOU? — a trava que você pediu precisa de um ponto onde o pedido ESPERA; sem ele, “pagou” vira suposição do passo anterior, e pagamento é o que mais falha em silêncio, porque o dinheiro confirma depois e por outro canal. Carrega a pergunta que decide arquitetura: vale a autorização do cartão ou a liquidação? (c) FICA AGUARDANDO — o “não pagou” acontece com ou sem desenho, alguém vai abandonar a tela; sem este nó o pedido vira lixo invisível, nem cobrado nem cancelado nem visível. E ele NÃO entra na fila de execução, que é o que o separa do P4.8, onde o trabalho já começou e por isso não dá mais pra remover. Fica 🟡 porque o prazo de validade esbarra na 6.4: preço travado na data do pedido, então pedido que espera pra sempre é preço que nunca reajusta.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
   * S8 · aresta NOVA — a ponte que fecha o desenho.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "S8",
    tipo: "aresta",
    de: "P4.10",
    para: "P4.9",
    label: "não dá pra entregar no aviso prévio",
    depende: ["S6", "S7"],
    porque:
      "Hoje o P4.10 é uma ponta solta: o processo entra nele e não sai. Com o S7, o caso normal se resolve (entrega e cobra na fatura final), e sobra exatamente um caso — o serviço que não cabe nos 30 dias do aviso prévio. Esse não pede regra nova, pede ligação: é a mesma pergunta do S6, “quem deu causa?”. A ramificação existe pra que ninguém volte a tratar isso como buraco separado daqui a um mês.",
  },
];
