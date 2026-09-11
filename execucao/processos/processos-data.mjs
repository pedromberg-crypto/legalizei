/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FONTE-ÚNICA DOS PROCESSOS — o que precisa acontecer, ponta a ponta.
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmã de `flow/flow-data.mjs` (o flow de abertura) e de `portal/portal-data.mjs`
 * (o grafo de navegação do portal). A diferença: aqui NÃO há tela. Aqui está o
 * PROCESSO — quem dispara, o que a casa faz, com quem ela fala, e o que a
 * pessoa vê. A tela vem depois, e é validada CONTRA isto.
 *
 * 🔴 NUNCA editar `processos-graph.json` nem `PROCESSOS.md` à mão: os dois são
 * gerados por `node execucao/processos/gerar-processos.mjs` a partir DESTE
 * arquivo. Regras completas: `_doutrina-processos.md`.
 *
 * ── ANATOMIA DE UM PASSO (5 campos, sempre os mesmos) ───────────────────────
 *   id     · P<processo>.<passo>
 *   titulo · o passo em 3 a 6 palavras
 *   quem   · quem dispara: "cliente" | "a casa" | "o relógio" | "o gateway"
 *   faz    · o que a casa faz, EM PORTUGUÊS COMUM (escrito pro Pedro)
 *   fala   · com quem a casa fala FORA dela: API, órgão, gateway
 *            (esta é a ÚNICA coluna técnica, e é técnica de propósito)
 *   falaNota · opcional: o detalhe técnico longo (endpoint, formato, evidência).
 *            Não entra no cartão — vive no painel lateral e na nota do dev
 *   ve     · o que a pessoa vê nesse passo
 *
 * ── 🔴 PALAVRA, NUNCA GLIFO (11/09, achado do Pedro) ────────────────────────
 * Ele perguntou o que o campo "fala com" queria dizer, olhando um cartão que
 * mostrava só "—". A pergunta valia: o traço não diz nada. Pior, o mesmo "—"
 * significava duas coisas diferentes ("não fala com ninguém" e "não se
 * aplica"), e "❓" significava outras duas ("não sabemos" e "não existe").
 *
 * Glifo não é resposta curta, é resposta ausente com cara de preenchida.
 * Vocabulário fechado, em português, e o gerador recusa o glifo cru:
 *
 *   fala · "só a nossa casa"   → nada externo. Banco nosso, código nosso
 *        · "ainda não sabemos" → buraco declarado (costuma ser 🔴)
 *        · qualquer outro texto → o nome do terceiro, curto
 *   ve   · "nada, acontece por baixo" → passo invisível, e isso é válido
 *        · "nada: a tela não existe"  → deveria haver tela, e não há (≠ acima)
 *   faz  · "ainda não sabemos" quando o passo é a própria pergunta
 *
 * ⚠️ "invisível de propósito" e "falta tela" NÃO são a mesma resposta. O
 * traço apagava justamente essa diferença, que é a que decide se há trabalho
 * de UX pela frente.
 *   luz    · "verde" (sabemos e dá) | "amarelo" (falta decidir)
 *            | "vermelho" (não sabemos)
 *   forma  · "passo" | "decisao" | "fim"
 *   fonte  · de onde veio a regra (decisão nossa, cláusula, lei, evidência)
 *   duvida · o que exatamente precisa ser respondido — só em amarelo/vermelho
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRILHAS — a decisão que continua valendo depois que o caminho segue.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Provocação do Pedro em 11/09, olhando o P4.8: *"uma condicional lá atrás,
 * com o título custa mais de 50 ou menos de 50, tem interferência em todo o
 * restante do processo."*
 *
 * Ele está certo, e o buraco é do MODELO. Um grafo de flow sabe dizer de onde
 * o caminho veio agora; não sabe dizer que decisão foi tomada três passos
 * atrás e ainda está valendo. Sem isso sobram duas saídas ruins: duplicar o
 * processo inteiro depois da primeira bifurcação, ou escrever condições
 * ambíguas — que foi o que aconteceu no P4.8, onde "cancelou o plano" queria
 * dizer duas coisas diferentes conforme o item estivesse na fatura ou já pago.
 *
 * Então a decisão ganha NOME e vira trilha. A aresta que a toma `abre` a
 * trilha; qualquer aresta lá na frente pode declarar `quando`, e aí ela só
 * existe dentro daquela trilha.
 *
 * ⚠️ Trilha NÃO é para toda bifurcação. Só para a decisão que **continua
 * importando** depois de tomada. "Correu bem ou não" morre no passo seguinte;
 * "está na fatura ou já foi pago" atravessa o processo inteiro. Criar trilha
 * para tudo devolveria a complexidade pela outra porta.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const TRILHAS = [
  {
    id: "fatura",
    nome: "até R$ 50 · vai pra fatura",
    curto: "na fatura",
    cor: "#5B4BC4",
  },
  {
    id: "pago",
    nome: "acima de R$ 50 · pago no ato",
    curto: "já pago",
    cor: "#0F7A63",
  },
];

export const PROCESSOS = [
  {
    id: "P4",
    titulo: "Adicionar um serviço avulso à fatura aberta",
    resumo:
      "A pessoa pede um serviço à-la-carte dentro do app. Ele não cobra na hora: entra como item de linha na fatura da competência. Atravessa /mais/servicos (onde nasce) e /mais/plano (onde aparece).",
    porqueImporta:
      "É o balde vendável inteiro. O líder fatura ~45 serviços assim, e é receita oculta do modelo dele. É também o processo que mais atravessa tela, então é onde uma incoerência aparece primeiro.",
  },
];

export const PASSOS = [
  // ── o pedido ──────────────────────────────────────────────────────────────
  {
    id: "P4.1",
    processo: "P4",
    titulo: "Escolhe o serviço",
    quem: "cliente",
    faz: "Mostra o catálogo à-la-carte com preço aberto e o prazo estimado. Um toque abre o detalhe.",
    fala: "só a nossa casa",
    ve: "A loja em /mais/servicos, com os mais pedidos em destaque.",
    luz: "verde",
    forma: "passo",
    fonte: "Tela construída em 24/07. Doutrina anti-dark-pattern: preço aparece ANTES do clique.",
  },
  {
    id: "P4.2",
    processo: "P4",
    titulo: "Aceita o serviço, na sheet",
    quem: "cliente",
    faz: "Mostra preço, o que a pessoa recebe, o prazo estimado e quando vai ser cobrado (“entra na fatura de 05/08” ou “paga agora”), e só então libera o botão. O toque no botão É o aceite.",
    fala: "só a nossa casa",
    ve: "A sheet de detalhe do serviço, com valor, a linha do momento da cobrança e “Solicitar serviço”. Falta ali o prazo estimado e o texto do que está sendo contratado.",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 6.3 (preço e momento da cobrança exibidos antes, aceite no ato), 6.1 (prazo estimado) e 1.6 (a confirmação na Plataforma integra o contrato). Decisão do Pedro em 11/09: a sheet que já existe é o nosso aceite, e o aceite vale para qualquer valor."
  },

  // ── a regra do contrato ───────────────────────────────────────────────────
  {
    id: "P4.3",
    processo: "P4",
    titulo: "Custa mais de R$ 50?",
    quem: "a casa",
    faz: "Olha o preço do serviço e decide se ele pode simplesmente cair na fatura ou se precisa de um aceite formal na hora.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Cláusula 6.3 da nossa minuta: serviço de até R$ 50 é lançado na fatura da competência seguinte; acima disso exige aceite específico no ato, com exibição prévia do preço e do momento da cobrança.",
  },

  // ── o registro ────────────────────────────────────────────────────────────
  {
    id: "P4.5",
    processo: "P4",
    titulo: "Guarda o pedido e trava o preço",
    quem: "a casa",
    faz: "Cria o pedido e congela o preço da tabela vigente NA DATA DO PEDIDO, guardando junto a versão da tabela que a pessoa viu. Reajuste posterior não alcança o que já foi pedido.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 6.4: aplica-se “a versão vigente na data da contratação de cada serviço, que ficará registrada na Plataforma”. A 6.3 reforça, exigindo exibição prévia do preço.",
  },

  // ── onde o item cai ───────────────────────────────────────────────────────
  {
    id: "P4.6",
    processo: "P4",
    titulo: "Acha ou abre a fatura do próximo ciclo",
    quem: "a casa",
    faz: "Procura a fatura do próximo ciclo. Se ela ainda não existir, abre uma, e é nela que o item entra.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 6.3 e Anexo A-I.1: item de até R$ 50 é lançado na fatura da competência seguinte. Com o ciclo por aniversário, qual fatura recebe o item deixa de ser pergunta e vira consequência.",
  },
  {
    id: "P4.7",
    processo: "P4",
    titulo: "Entra como item de linha",
    quem: "a casa",
    faz: "Soma o serviço à fatura como uma linha própria, ao lado da mensalidade, com descrição, valor e tipo.",
    fala: "só a nossa casa",
    falaNota:
      "📚 O modelo do líder confirma que fatura suporta itens: `GET /api/pagamentos/faturas/` devolve `itens[]` com `{descricao, valor, tipo}`, e a mensalidade é UM dos tipos, não o objeto.",
    ve: "O item aparece no /mais/plano, dentro de 'Próxima fatura'.",
    luz: "verde",
    forma: "passo",
    fonte: "Modelo de fatura por competência (ADR 11/09). Evidência: 2026-09-11-contabilizei-modelo-de-cobranca.",
  },
  {
    id: "P4.8",
    processo: "P4",
    titulo: "O trabalho começa. Não dá pra remover.",
    quem: "a casa",
    faz: "Marca o item como em andamento e coloca na fila de execução. A partir daqui o cliente não pode tirar da fatura.",
    fala: "só a nossa casa",
    ve: "Chip 'Em andamento' ao lado do item, com a data do pedido. Sem X de remover.",
    luz: "verde",
    forma: "passo",
    fonte: "Decisão de 27/07: 'pedir = o trabalho já começou'. Transparência sem fingir carrinho — mostrar um X que não remove seria pior.",
  },

  // ── o que ainda não tem resposta ──────────────────────────────────────────
  {
    id: "P4.9",
    processo: "P4",
    titulo: "O serviço não pôde ser entregue",
    quem: "a casa",
    faz: "Separa por CAUSA: falha nossa ou do órgão de um lado, falta de documento do cliente do outro. O que acontece com o dinheiro depende de como ele entrou.",
    fala: "só a nossa casa",
    ve: "Aviso no item dizendo por que não deu e o que vai acontecer com o valor.",
    luz: "amarelo",
    forma: "decisao",
    fonte: "Espelha a cláusula 9.5 (não realizado o ato, o valor volta, salvo taxa já retida pelo órgão) e a 1.4 (a Legalizai não responde por documentação não apresentada pelo Cliente). Regra nova: a 9.5 trata de taxa pública, não de serviço adicional.",
    duvida:
      "A régua de CAUSA é analogia minha entre a cláusula 9.5 (taxa pública não realizada volta, salvo a que o órgão reteve) e serviço adicional, que a minuta não trata. O desenho está travado; falta o Mauro ou a advogada RATIFICAREM, e provavelmente vira cláusula. As três perguntas caras moram no P4.22 (estorno).",
  },
  {
    id: "P4.10",
    processo: "P4",
    titulo: "Cancelou com avulso na fatura",
    quem: "cliente",
    faz: "O contrato segue vivo nos 30 dias de aviso prévio, então o avulso continua normalmente. A única pergunta é se o serviço sobrevive ao fim do CNPJ: o que precisa de empresa ativa tem que sair ANTES da baixa.",
    fala: "só a nossa casa",
    ve: "Na tela de cancelamento, a lista do que continua em andamento e o valor que vai na fatura final, antes de confirmar.",
    luz: "verde",
    forma: "decisao",
    fonte: "Cláusula 12.6: quitar todos os valores em aberto até a data do encerramento, incluindo serviços adicionais. Cláusula 12.1: aviso prévio de 30 dias.",
  },

  // ── o fecho ───────────────────────────────────────────────────────────────
  {
    id: "P4.11",
    processo: "P4",
    titulo: "O ciclo vira e a fatura soma tudo",
    quem: "o relógio",
    faz: "No dia do aniversário do contrato, fecha a janela de itens do ciclo que terminou e emite a fatura. Assinou dia 8, o ciclo vira todo dia 8.",
    fala: "só a nossa casa",
    falaNota: "O fechamento em si é o processo P1, que ainda não foi desenhado.",
    ve: "A fatura muda de “Próxima fatura” para “Fatura de <ciclo>” e para de aceitar item novo. A data do próximo fechamento aparece o tempo todo.",
    luz: "verde",
    forma: "fim",
    fonte: "Decisão do Pedro em 11/09, e ela MANDA: cobrança por aniversário, no dia em que o cliente fechou. ⚠️ A cláusula 3.4 da minuta fixa o pagamento “até o 15º dia de cada mês” e terá que ser ajustada ao produto, não o contrário.",
  },

  // ── promovidos em 11/09 (propostas S4, S5, S10 e S11, aceitas pelo Pedro) ──
  {
    id: "P4.12",
    processo: "P4",
    titulo: "Fechou a sheet, e nada acontece",
    quem: "cliente",
    faz: "Fecha sem pedir nada. Não cria pedido, não guarda aceite, não cobra.",
    fala: "só a nossa casa",
    ve: "Volta pra lista de serviços, no mesmo lugar onde estava.",
    luz: "verde",
    forma: "fim",
    fonte: "Decisão do Pedro em 11/09. Sem aceite não há contratação (cláusula 6.3).",
  },
  {
    id: "P4.13",
    processo: "P4",
    titulo: "Guarda o comprovante do aceite",
    quem: "a casa",
    faz: "Grava data, hora, o texto exato que foi aceito e a versão da tabela de preços vigente, e deixa isso disponível pra consulta na Plataforma.",
    fala: "só a nossa casa",
    ve: "O aceite fica listado no histórico do serviço, com data e hora, e pode ser reaberto.",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 6.4 (“que ficará registrada na Plataforma”), 1.6 (a confirmação integra o contrato) e 16.9 (registro de data e hora do aceite).",
  },
  {
    id: "P4.14",
    processo: "P4",
    titulo: "Paga na hora",
    quem: "cliente",
    faz: "Gera a cobrança do valor travado no aceite e leva a pessoa pro pagamento, sem sair do app. A forma escolhida aqui TRAVA com o pedido: ela define o prazo de validade e não muda depois.",
    fala: "Stone",
    ve: "Tela de pagamento com o valor, o serviço, o prazo estimado de entrega e até quando o pedido vale. Pix, cartão ou boleto.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Decisão do Pedro em 11/09: acima de R$ 50, o pagamento acontece no ato da solicitação. Compatível com a cláusula 6.3, que exige exibir “o momento da cobrança” — aqui o momento é agora. O Anexo I já usa “no ato” para todos os itens acima de R$ 50.",
    duvida:
      "O provedor está decidido (Stone, 11/09), mas o caminho técnico não: falta saber por qual produto da casa a integração entra (a Pagar.me é do grupo Stone) e, principalmente, se o formato nos mantém FORA do escopo PCI — foi exatamente isso que derrubou o Asaas em 08/09. Enquanto isso não estiver confirmado por escrito com eles, não é verde.",
  },
  {
    id: "P4.15",
    processo: "P4",
    titulo: "O pagamento confirmou?",
    quem: "o gateway",
    faz: "Espera a CAPTURA, não a autorização nem a liquidação. Pix confirma no webhook, boleto na compensação, cartão na captura. Só aí o serviço é liberado.",
    fala: "Stone (webhook de captura)",
    ve: "O item mostra “aguardando pagamento” até confirmar, e muda sozinho quando confirma.",
    luz: "amarelo",
    forma: "decisao",
    fonte: "Decisão do Pedro em 11/09: “só será iniciado/liberado após efetuação do pagamento” e o gate é a CAPTURA — não a autorização, que só reserva limite, nem a liquidação, que no cartão é D+30.",
    duvida:
      "O gate está decidido (captura). O que segura este passo é o mesmo do S10a: até a integração com a Stone estar confirmada, não sabemos o formato do retorno nem se ele nos mantém fora do escopo PCI. Segue aberta uma pergunta de experiência: a pessoa espera na tela até confirmar, ou o app deixa ela sair e avisa depois? Com boleto, que leva de 1 a 3 dias úteis pra compensar, esperar na tela não é opção — e é por isso que o prazo dele é o dobro (S10c).",
  },
  {
    id: "P4.16",
    processo: "P4",
    titulo: "Fica aguardando dentro do prazo",
    quem: "a casa",
    faz: "Segura o pedido pelo prazo da forma escolhida: 72 horas no Pix e no cartão, 6 dias no boleto, que precisa compensar. Preço e aceite travados, fora da fila de execução. Dentro da janela, a pessoa retoma o pagamento de onde parou, quantas vezes quiser — na MESMA forma, que não se troca.",
    fala: "só a nossa casa",
    ve: "O item aparece como “aguardando pagamento”, com o tempo que resta e o botão pra pagar sempre à mão. Pra trocar de forma de pagamento, pedir de novo. Nada de “em andamento”.",
    luz: "verde",
    forma: "passo",
    fonte: "Decisão do Pedro em 11/09: 72 horas no Pix e no cartão, 6 dias no boleto (o dobro, pela compensação), e a forma de pagamento não se altera num pedido já gerado. Decorre da 6.4, que trava o preço na data da contratação — prazo aberto seria preço que nunca reajusta.",
  },
  {
    id: "P4.17",
    processo: "P4",
    titulo: "Expirou, e vira histórico",
    quem: "o relógio",
    faz: "Vencido o prazo da forma escolhida sem captura, derruba o pedido: preço e aceite perdem validade e o item some da tela. Guarda o registro de que foi solicitado e não pago.",
    fala: "só a nossa casa",
    ve: "O item sai da lista. Pra pedir de novo — ou pra trocar a forma de pagamento — começa do zero, pelo preço do dia.",
    luz: "verde",
    forma: "fim",
    fonte: "Decisão do Pedro em 11/09: vencido o prazo (72 horas no Pix e no cartão, 6 dias no boleto), some da tela, e a ocorrência fica registrada em banco pra termos histórico de quem solicitou e não pagou.",
  },
  {
    id: "P4.18",
    processo: "P4",
    titulo: "Cancelou com o avulso já pago",
    quem: "a casa",
    faz: "Não há o que cobrar: já foi pago no ato. Entrega dentro do aviso prévio, valendo a mesma régua do P4.10 — o que precisa de CNPJ ativo tem que sair antes da baixa.",
    fala: "só a nossa casa",
    ve: "Na tela de cancelamento, o item aparece como já pago e com a data prevista de entrega, sem valor a quitar.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Cláusula 12.1 (aviso prévio de 30 dias). A 12.6 trata de valor em aberto, e aqui não há — o pagamento no ato tirou este caso do alcance dela.",
    duvida:
      "Se o serviço já pago NÃO couber nos 30 dias do aviso prévio, o dinheiro volta? A 12.6 não alcança (não há valor em aberto) e a 9.5 só fala de taxa pública. Cai na régua do S6 (quem deu causa), mas com dinheiro já compensado, que é situação diferente de item na fatura.",
  },
  {
    id: "P4.19",
    processo: "P4",
    titulo: "Entregue, e já estava pago",
    quem: "a casa",
    faz: "Encerra o item. Não há nada a lançar em fatura: o dinheiro entrou no ato do pedido.",
    fala: "só a nossa casa",
    ve: "O item vira “concluído” no histórico de serviços, com o comprovante de pagamento junto.",
    luz: "verde",
    forma: "fim",
    fonte: "Decorre do pagamento no ato (decisão do Pedro, 11/09): item pago não entra em fatura.",
  },

  // ── promovidos em 11/09, 2ª leva (S1, S2, S3, S6, S7, S8 e S9) ───────────
  {
    id: "P4.20",
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
    id: "P4.21",
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
    id: "P4.22",
    processo: "P4",
    titulo: "Estorna o que já foi pago",
    quem: "a casa",
    faz: "O dinheiro já entrou, então devolver é uma operação no provedor, não um ajuste de fatura. Pede o estorno e acompanha até cair.",
    fala: "Stone",
    ve: "O item mostra o estorno em andamento e o prazo de devolução.",
    luz: "vermelho",
    forma: "fim",
    fonte: "Mesmo princípio da 9.5, mas com dinheiro já compensado — situação que a minuta não trata.",
    duvida:
      "Três perguntas, e nenhuma tem resposta hoje. (1) A taxa que o gateway reteve volta? Na maioria dos provedores, não — então estorno integral sai do nosso bolso. (2) Estorno ou crédito na próxima fatura? Crédito não custa taxa e é mais rápido, mas prende o cliente. (3) Qual o prazo, e quem avisa quando cai. Tudo isso depende do provedor, que ainda não foi escolhido.",
  },
  {
    id: "P4.23",
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
  {
    id: "P4.24",
    processo: "P4",
    titulo: "O ciclo vira no dia da assinatura",
    quem: "o relógio",
    faz: "Conta a partir do dia da assinatura. Se o mês não tiver esse dia, cobra no último dia dele e volta pro dia original no mês seguinte que tiver. Se a data cair em fim de semana, joga pro próximo dia útil. A âncora nunca muda.",
    fala: "só a nossa casa",
    ve: "A data da próxima cobrança sempre escrita por extenso, nunca “daqui a um mês”.",
    luz: "verde",
    forma: "passo",
    fonte: "Decisão do Pedro em 11/09, e ela é REGRA NOSSA, não régua de mercado: conta do dia da assinatura · fim de semana joga pro próximo dia útil · dia que o mês não tem cobra no último dia, e volta ao original no mês seguinte que tiver. ⚠️ O Código Civil, art. 132 §3º, resolve prazo em mês pelo caminho oposto (“ou no imediato, se faltar exata correspondência”), o que daria 1º/03 — a advogada precisa ver essa diferença, porque a regra vai pro contrato. ⚠️ Ele disse “fim de semana”; eu escrevi “dia útil”, que estende a FERIADO. Se não for isso, muda aqui.",
  },
];

export const ARESTAS = [
  // ── o pedido, comum aos dois caminhos ─────────────────────────────────────
  { de: "P4.1", para: "P4.2" },
  { de: "P4.2", para: "P4.13", label: "aceitou" },
  { de: "P4.2", para: "P4.12", label: "fechou a sheet" },
  { de: "P4.13", para: "P4.5" },
  { de: "P4.5", para: "P4.3" },

  // ── a régua do valor abre as duas TRILHAS ─────────────────────────────────
  { de: "P4.3", para: "P4.6", label: "até R$ 50 · vai pra fatura", abre: "fatura" },
  { de: "P4.3", para: "P4.14", label: "acima de R$ 50 · paga agora", abre: "pago" },

  // ── trilha da fatura ──────────────────────────────────────────────────────
  { de: "P4.6", para: "P4.7" },
  { de: "P4.7", para: "P4.8" },

  // ── trilha do pago no ato ─────────────────────────────────────────────────
  { de: "P4.14", para: "P4.15" },
  { de: "P4.15", para: "P4.8", label: "pago" },
  { de: "P4.15", para: "P4.16", label: "não pagou" },
  { de: "P4.16", para: "P4.17", label: "venceu o prazo do pedido" },

  // ── depois que o trabalho começa, cada trilha responde a sua ──────────────
  { de: "P4.8", para: "P4.9", label: "não deu certo", tracejado: true },
  { de: "P4.8", para: "P4.10", label: "cancelou o plano", quando: "fatura", tracejado: true },
  { de: "P4.8", para: "P4.18", label: "cancelou o plano", quando: "pago", tracejado: true },
  { de: "P4.8", para: "P4.24", label: "correu bem", quando: "fatura" },
  { de: "P4.8", para: "P4.19", label: "correu bem", quando: "pago" },
  { de: "P4.24", para: "P4.11" },

  // ── não entregue: primeiro a CAUSA, depois a trilha ──────────────────────
  { de: "P4.18", para: "P4.9", label: "não deu pra entregar" },
  { de: "P4.9", para: "P4.20", label: "o cliente deu causa" },
  { de: "P4.9", para: "P4.21", label: "falha nossa ou do órgão", quando: "fatura" },
  { de: "P4.9", para: "P4.22", label: "falha nossa ou do órgão", quando: "pago" },

  // ── cancelamento: o serviço sobrevive ao fim do CNPJ? ────────────────────
  { de: "P4.10", para: "P4.23", label: "o serviço sobrevive ao fim do CNPJ" },
  { de: "P4.10", para: "P4.9", label: "o serviço morre com a baixa do CNPJ" },
];
