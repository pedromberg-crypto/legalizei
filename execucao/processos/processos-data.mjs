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
 *   id     · P<processo>.<passo> — o número diz onde ele NASCEU, não onde vive
 *   processos · a que processos o passo pertence. Lista, não texto: desde
 *            11/09 um passo pode ser COMPARTILHADO (decisão do Pedro). O
 *            fechamento do ciclo é o fim do P4 e o começo do P1 — duplicá-lo
 *            criaria duas fontes pro mesmo fato, que foi a raiz de 5 dos 10
 *            defeitos daquele dia
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
    id: "P1",
    titulo: "A competência fecha, a fatura é emitida e cobrada",
    resumo:
      "O ciclo do cliente vira no dia da assinatura, a fatura soma o que se acumulou e a cobrança sai na forma cadastrada. Daqui em diante o processo trata do dinheiro: pagou, não pagou, o que muda no preço, e o que a casa faz com quem atrasa.",
    porqueImporta:
      "É pra onde o P4 entrega, e era caixa preta declarada. É onde moram as cláusulas 3.5, 3.6, 3.7, 3.14 e 3.15 da minuta, que hoje não têm desenho nenhum — e onde se decide o que a casa faz com quem atrasa, que é posicionamento, não sistema. ⚠️ NÃO confundir com o pagamento da GUIA (linha 2.4 do catálogo): aqui quem recebe somos nós e o trilho é nosso; lá quem recebe é o governo e a gente nem vê o dinheiro.",
  },
  {
    id: "P2",
    titulo: "Emitir a guia do DAS e saber que ela foi paga",
    resumo:
      "A casa apura e emite a guia todo mês. O cliente pode marcar que pagou, mas quem confirma é a casa: passado o vencimento, ela consulta a arrecadação e descobre sozinha. Não pagou, oferece refazer a guia com o valor de hoje.",
    porqueImporta:
      "Carrega o diferencial nº 1 do teardown: a linha 2.4 do catálogo, “saber que foi pago SEM perguntar ao cliente”, que era 🔴 sem caminho. 🔑 O desenho do Pedro colapsa o problema: a gente não precisa saber em tempo real, precisa saber UMA VEZ, logo depois do vencimento — e a guia sai sempre no mesmo dia, com o mesmo prazo, então essa data é conhecida desde a emissão.",
  },
  {
    id: "P3",
    titulo: "Emitir a nota fiscal",
    resumo:
      "A pessoa presta o serviço e fatura. A casa pede só o valor e o cliente, transmite ao Emissor Nacional e devolve a nota pronta. A receita que nasce aqui é o que alimenta o resto do produto.",
    porqueImporta:
      "É o processo que os OUTROS consomem: a receita define o DAS (P2.1), a faixa de RBT12 (P1.2), o Fator R e o teto do Simples. ⏱ E é o único com relógio correndo: a Res. CGSN 191/2026 obriga toda ME/EPP do Simples ao Emissor Nacional a partir de 01/11/2026. 🔑 O caminho técnico é o mais resolvido do produto — API nacional RESTful, gratuita, com Swagger público — então o que sobra aqui é desenho, não integração.",
  },
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4", "P1"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4"],
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
    processos: ["P4", "P1"],
    titulo: "O ciclo vira no dia da assinatura",
    quem: "o relógio",
    faz: "Conta a partir do dia da assinatura. Se o mês não tiver esse dia, cobra no último dia dele e volta pro dia original no mês seguinte que tiver. Se a data cair em fim de semana, joga pro próximo dia útil. A âncora nunca muda.",
    fala: "só a nossa casa",
    ve: "A data da próxima cobrança sempre escrita por extenso, nunca “daqui a um mês”.",
    luz: "verde",
    forma: "passo",
    fonte: "Decisão do Pedro em 11/09, e ela é REGRA NOSSA, não régua de mercado: conta do dia da assinatura · fim de semana joga pro próximo dia útil · dia que o mês não tem cobra no último dia, e volta ao original no mês seguinte que tiver. ⚠️ O Código Civil, art. 132 §3º, resolve prazo em mês pelo caminho oposto (“ou no imediato, se faltar exata correspondência”), o que daria 1º/03 — a advogada precisa ver essa diferença, porque a regra vai pro contrato. ⚠️ Ele disse “fim de semana”; eu escrevi “dia útil”, que estende a FERIADO. Se não for isso, muda aqui.",
  },

  // ══ P1 · A competência fecha, a fatura é emitida e cobrada ════════════════
  // O P4 entrega aqui, pelo P4.11. Os dois passos do ciclo (P4.24 e P4.11)
  // são COMPARTILHADOS: mesmo fato, lido por dois processos. Duplicá-los
  // criaria duas fontes pro mesmo fato — a raiz de 5 dos 10 defeitos de 11/09.
  {
    id: "P1.1",
    processos: ["P1"],
    titulo: "Monta a fatura do ciclo",
    quem: "a casa",
    faz: "Soma a mensalidade do ciclo que começa, os avulsos de até R$ 50 do ciclo que terminou, a folha por colaborador ativo e o endereço fiscal, se tiver.",
    fala: "só a nossa casa",
    ve: "A fatura aberta em /mais/plano, com cada linha nomeada e o total.",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 6.3 e Anexo A-I.1 (avulso até R$ 50 na competência seguinte), 7.2 e 7.4 (folha R$ 39 por colaborador ATIVO, mesmo sem movimento) e Anexo I (endereço fiscal R$ 49/mês). As duas temporalidades da fatura foram travadas pelo Pedro em 11/09.",
  },
  {
    id: "P1.2",
    processos: ["P1"],
    titulo: "O preço mudou neste ciclo?",
    quem: "a casa",
    faz: "Antes de fechar o valor, confere se a faixa de RBT12 mudou, se a oferta de lançamento acabou ou se houve reajuste anual.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "amarelo",
    forma: "decisao",
    fonte: "Cláusula 3.6 (oferta de lançamento: 3 competências, término avisado com 30 dias), 3.7 (RBT12: elevação com aviso de 30 dias, redução automática) e 3.8 (reajuste anual, também com 30 dias).",
    duvida:
      "As três regras exigem aviso prévio de 30 dias e nenhuma tem tela ou disparo hoje. Quem avisa, por qual canal, e o que acontece se o aviso não sair a tempo — a fatura sobe assim mesmo, ou o preço velho vale mais um ciclo? A 3.8 ainda dá ao cliente o direito de encerrar SEM MULTA se não concordar, e esse caminho não existe em lugar nenhum do produto.",
  },
  {
    id: "P1.3",
    processos: ["P1"],
    titulo: "Avisa o preço novo, 30 dias antes",
    quem: "a casa",
    faz: "Dispara o aviso da mudança com pelo menos 30 dias de antecedência, dizendo o valor novo, a razão e a partir de qual ciclo vale.",
    fala: "só a nossa casa",
    ve: "Aviso na central, na categoria “precisa de você”, e o valor novo marcado na fatura seguinte.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Cláusulas 3.6, 3.7 e 3.8 — as três exigem o mesmo aviso de 30 dias.",
    duvida:
      "O aviso vive só no app, ou também sai por e-mail e WhatsApp? Aviso de preço que a pessoa não vê é o mesmo que aviso nenhum, e a 3.8 dá a ela o direito de sair sem multa. Se ela não soube, a gente perde o direito de cobrar o valor novo.",
  },
  {
    id: "P1.4",
    processos: ["P1"],
    titulo: "Emite a fatura e cobra na forma cadastrada",
    quem: "a casa",
    faz: "Fecha o valor, emite a fatura e dispara a cobrança recorrente na forma que o cliente cadastrou.",
    fala: "Stone",
    ve: "A fatura muda de “Próxima” para “Em aberto”, com a data de vencimento e a forma de pagamento à vista.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Decisão do Pedro em 11/09: gateway Stone, ciclo por aniversário, vencimento no dia da assinatura, jogando pro próximo dia útil quando cair em fim de semana.",
    duvida:
      "Cobrança RECORRENTE é integração diferente da avulsa do P4.14: exige tokenizar o cartão e guardar o mandato, e isso muda o escopo PCI — exatamente o que derrubou o Asaas em 08/09. Precisa entrar na pauta da reunião com a Stone junto com o avulso, não depois.",
  },
  {
    id: "P1.5",
    processos: ["P1"],
    titulo: "A fatura foi paga?",
    quem: "o gateway",
    faz: "Espera a captura. Mesmo gate do avulso: não vale a autorização, não se espera a liquidação.",
    fala: "Stone (webhook de captura)",
    ve: "A fatura vira “paga” sozinha, sem a pessoa precisar avisar.",
    luz: "amarelo",
    forma: "decisao",
    fonte: "Decisão do Pedro em 11/09: o gate é a captura.",
    duvida:
      "⚠️ CORRIGIDO em 11/09, achado do Pedro: eu tinha escrito aqui o buraco da linha 2.4 do catálogo, e é OUTRO problema. Aqui QUEM RECEBE somos nós — a mensalidade entra pelo nosso trilho, e o webhook da Stone responde. A pergunta que sobra é só de escopo: TODO meio que a gente oferecer passa pela Stone? Boleto emitido por ela compensa de volta por ela, Pix com QR dela também. Se em algum momento a gente aceitar transferência direta pra conta da Legalizai, aí sim nasce um caminho cego — e a recomendação é não aceitar. O buraco da 2.4 é o pagamento da GUIA, onde quem recebe é o governo e a gente nem vê o dinheiro: processo próprio, ainda não desenhado."
  },
  {
    id: "P1.6",
    processos: ["P1"],
    titulo: "Dá baixa e o ciclo segue",
    quem: "a casa",
    faz: "Marca a fatura como paga, guarda o comprovante e abre o ciclo seguinte.",
    fala: "só a nossa casa",
    ve: "Histórico de faturas com a paga no topo, e a próxima já anunciada com a data.",
    luz: "verde",
    forma: "fim",
    fonte: "Cláusula 3.4 e o histórico de faturas que já existe em /mais/plano.",
  },
  {
    id: "P1.7",
    processos: ["P1"],
    titulo: "Venceu: entra multa e juros",
    quem: "o relógio",
    faz: "Passado o vencimento, aplica multa de 2% e juros de 0,033% por dia de atraso, e mostra o valor atualizado.",
    fala: "só a nossa casa",
    ve: "A fatura fica “vencida”, com o valor de hoje e a conta aberta: original, multa e juros separados.",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 3.5: multa de 2% e juros de mora de 0,033% por dia de atraso.",
  },
  {
    id: "P1.8",
    processos: ["P1"],
    titulo: "Tenta de novo, e avisa sem assustar",
    quem: "a casa",
    faz: "Repete a cobrança em dias combinados e avisa o cliente com o que ele precisa fazer, sem falar em exclusão do Simples nem em multa da Receita.",
    fala: "Stone",
    ve: "Aviso com o valor, a data da próxima tentativa e um botão pra pagar agora ou trocar a forma.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Posicionamento travado: “não vender pânico”. O dunning por medo do líder está na lista do que a gente NÃO faz (§9 do catálogo). A retentativa em si é mecanismo do gateway.",
    duvida:
      "Quantas tentativas, em que dias, e por quais canais. O número não é estético: cartão recusado por saldo costuma passar em D+3, mas tentativa demais queima o cartão na antifraude do emissor. Depende da política da Stone.",
  },
  {
    id: "P1.9",
    processos: ["P1"],
    titulo: "Suspende o acesso, sem apagar o dado",
    quem: "a casa",
    faz: "Persistindo a falta de pagamento, suspende os serviços e o acesso ao software. O dado do cliente continua lá e volta assim que ele quitar.",
    fala: "só a nossa casa",
    ve: "Tela dizendo o que está suspenso, o que continua funcionando, e exatamente o que fazer pra voltar.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Cláusula 3.14 (a ausência de pagamento pode suspender os serviços e o acesso ao software) e 12.7 (a reativação depende de quitação integral).",
    duvida:
      "Depois de quantos dias, e o que EXATAMENTE fica suspenso. Cortar a emissão de nota trava o faturamento do cliente e pode virar dano; cortar a obrigação acessória vira risco fiscal dele e responsabilidade técnica nossa (cláusula 2.3, Res. CFC 1.590/2020). Essa linha precisa do Mauro — não é decisão de produto.",
  },
  {
    id: "P1.10",
    processos: ["P1"],
    titulo: "Duas mensalidades: a casa pode encerrar",
    quem: "a casa",
    faz: "Com duas mensalidades consecutivas em aberto, a Legalizai pode encerrar o contrato sem aviso prévio e cobrar o que está em aberto.",
    fala: "só a nossa casa",
    ve: "Aviso formal do encerramento, com o que ainda é devido e como quitar.",
    luz: "amarelo",
    forma: "fim",
    fonte: "Cláusula 12.3 (ausência de pagamento de 2 mensalidades consecutivas) e 3.15 (protesto, órgãos de proteção ao crédito e cessão do crédito a terceiros).",
    duvida:
      "A 12.3 diz que a casa PODE — falta decidir se a gente faz, e quando. E a 3.15 permite protestar e inscrever em órgão de proteção ao crédito: isso é decisão de POSICIONAMENTO, não de sistema, e bate de frente com o “não punir a saída” que a gente travou em 27/07. Pergunta pro Mauro.",
  },


  // ══ P2 · Emitir a guia do DAS e saber que ela foi paga ════════════════════
  // O desenho é do Pedro (11/09), e ele COLAPSA um problema que parecia
  // impossível: a gente não precisa saber em tempo real se a guia foi paga —
  // precisa saber UMA VEZ, logo depois do vencimento. Isso troca "vigilância
  // contínua" por "uma consulta agendada", e muda o problema de categoria.
  {
    id: "P2.1",
    processos: ["P2"],
    titulo: "Apura e emite a guia do mês",
    quem: "o relógio",
    faz: "No fechamento da competência, apura o DAS com a receita do mês e emite a guia, sempre no mesmo dia e com o mesmo prazo.",
    fala: "Serpro Integra Contador (PGDAS-D)",
    ve: "A guia aparece em /impostos com valor, vencimento e código de barras.",
    luz: "verde",
    forma: "passo",
    fonte: "Matriz de dependência, linha 2.2 (resolvida em 09/09): o Integra Contador tem API REST oficial pro PGDAS-D e não exige procuração e-CAC com o A1 da própria empresa.",
  },
  {
    id: "P2.2",
    processos: ["P2"],
    titulo: "Marca “já paguei”, se quiser",
    quem: "cliente",
    faz: "Deixa a pessoa dizer que pagou, e passa a mostrar a guia como quitada na hora.",
    fala: "só a nossa casa",
    ve: "Um toque em “já paguei” na guia, sem formulário e sem anexo.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Decisão do Pedro em 11/09. ⚠️ Isto NÃO reabre o que foi rejeitado em 27/07. Lá, “informe se você pagou” era a ÚNICA fonte — o cliente fazendo o trabalho da casa. Aqui é conveniência: ele ganha a guia quitada na hora se quiser, e a casa confere sozinha depois (P2.4). A marcação não é a verdade; é um atalho.",
  },
  {
    id: "P2.3",
    processos: ["P2"],
    titulo: "Passou o vencimento?",
    quem: "o relógio",
    faz: "Espera o vencimento passar. Como a guia sai sempre no mesmo dia e com o mesmo prazo, a data da conferência é conhecida desde a emissão.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Decisão do Pedro em 11/09: conferir perto do vencimento, não continuamente.",
  },
  {
    id: "P2.4",
    processos: ["P2"],
    titulo: "Consulta a arrecadação e descobre sozinha",
    quem: "a casa",
    faz: "Consulta se a guia daquela competência foi quitada, sem perguntar nada ao cliente.",
    fala: "Serpro (consulta de arrecadação)",
    ve: "nada, acontece por baixo",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "Caminho (b) da linha 2.4 da matriz de dependência: consulta de arrecadação no e-CAC via Serpro. 🔑 O contrato do Integra Contador já está previsto para a emissão (2.2), então o custo marginal desta consulta tende a ser baixo.",
    duvida:
      "🔴 FALTA CONFIRMAR COM O SERPRO se o Integra Contador expõe a consulta de arrecadação por competência, e a que custo por chamada. É a única peça técnica do desenho — o resto é nosso. Se não expuser, os caminhos que sobram são Open Finance read-only (exige consentimento do cliente) ou conciliação manual, que não escala.",
  },
  {
    id: "P2.5",
    processos: ["P2"],
    titulo: "A guia foi paga?",
    quem: "a casa",
    faz: "Compara o que a consulta respondeu com o que está na tela, e resolve a divergência.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "amarelo",
    forma: "decisao",
    fonte: "Decisão do Pedro em 11/09.",
    duvida:
      "O que acontece quando o cliente marcou “já paguei” e a consulta diz que não. O líder tem esse caso e resolve derrubando a marcação com ~30 dias de atraso (evidência de tela, 09/09) — o que é desmentir o cliente, tarde. A gente confere em dias, não em 30, mas a pergunta continua: a casa corrige em silêncio, ou avisa? E se a consulta é que estiver desatualizada?",
  },
  {
    id: "P2.6",
    processos: ["P2"],
    titulo: "Guia quitada, e o mês fecha",
    quem: "a casa",
    faz: "Marca a guia como paga com a data real do pagamento e guarda no histórico.",
    fala: "só a nossa casa",
    ve: "A guia vira “paga” com a data, e entra no histórico de guias pagas.",
    luz: "verde",
    forma: "fim",
    fonte: "Linha 2.5 do catálogo (histórico de guias pagas), tela já construída em /impostos/guias.",
  },
  {
    id: "P2.7",
    processos: ["P2"],
    titulo: "Venceu sem pagar: oferece refazer a guia",
    quem: "a casa",
    faz: "Avisa que a guia venceu e oferece refazê-la com o valor de hoje, já com multa e juros, por R$ 9,90.",
    fala: "só a nossa casa",
    ve: "Aviso na guia vencida com o CTA “Recalcular por R$ 9,90”, dizendo o que muda e por quê.",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "Decisão do Pedro em 11/09: R$ 9,90, contra R$ 15,90 do líder. Por estar abaixo de R$ 50, entra na fatura do próximo ciclo pela cláusula 6.3 — não cobra na hora.",
    duvida:
      "⚠️ A COPY decide se isto é serviço ou chantagem. O §9 do catálogo rejeita o “dunning por medo” do líder, e oferecer um pago no exato momento em que a pessoa está em falta é a hora mais fácil de escorregar pra isso. A regra tem que ser: avisar do vencimento é GRÁTIS e incondicional; o recálculo é conveniência opcional, e a guia velha continua paga­vel com os acréscimos por conta dela. Falta escrever o texto e ratificar com o Pedro.",
  },


  // ══ P3 · Emitir a nota fiscal ═════════════════════════════════════════════
  // 🔑 É o processo que os outros CONSOMEM: a receita que nasce aqui define o
  // DAS (P2.1), a faixa de RBT12 (P1.2) e o Fator R. Estava sendo tratado como
  // caixa preta a montante — o mesmo padrão que o P4 tinha com o P1.
  //
  // ⏱ E é o único com RELÓGIO CORRENDO: a Res. CGSN 191/2026 obriga toda
  // ME/EPP do Simples ao Emissor Nacional a partir de 01/11/2026.
  {
    id: "P3.1",
    processos: ["P3"],
    titulo: "Prestou o serviço e precisa faturar",
    quem: "cliente",
    faz: "Nada ainda: é o fato gerador acontecendo. A casa só entra quando a pessoa vem emitir.",
    fala: "só a nossa casa",
    ve: "O CTA de emitir, fixo no centro da barra de abas.",
    luz: "verde",
    forma: "passo",
    fonte: "Cláusula 5.4: o Cliente se compromete a emitir as notas “imediatamente após o fato gerador”, pela Plataforma, ou nela importá-las quando emitidas por outro sistema.",
  },
  {
    id: "P3.2",
    processos: ["P3"],
    titulo: "Emite aqui, ou já emitiu fora?",
    quem: "a casa",
    faz: "Separa os dois caminhos: a nota nasce no app, ou nasceu fora e precisa entrar aqui pra receita fechar.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Cláusula 5.4, que prevê os dois casos com todas as letras.",
  },
  {
    id: "P3.3",
    processos: ["P3"],
    titulo: "Pede só o valor e o cliente",
    quem: "cliente",
    faz: "Pergunta o valor e para quem é. Os três códigos que o órgão exige já vêm preenchidos do cadastro, e a pessoa não precisa saber que existem.",
    fala: "só a nossa casa",
    ve: "A tela /emitir, com valor, tomador e o resumo do que vai ser emitido.",
    luz: "verde",
    forma: "passo",
    fonte: "Catálogo 3.1 (construída) e 3.5 (cadastro de tomadores). Doutrina: o líder pede 3 códigos (CNAE, LC116, municipal); a gente pede 2 campos.",
  },
  {
    id: "P3.4",
    processos: ["P3"],
    titulo: "Sugere o código do serviço",
    quem: "a casa",
    faz: "Olha a atividade da empresa e propõe o código municipal do serviço, deixando a pessoa trocar se for outro.",
    fala: "só a nossa casa",
    ve: "O código já escolhido, com uma linha dizendo em português o que ele significa.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Catálogo 3.6, hoje 🔴 sem tela. A matriz CNAE já tem o de-para, então é engine nossa, sem IA e sem dependência externa.",
    duvida:
      "A matriz cobre o de-para de CNAE para o código municipal de BH, mas quem emite pra fora precisa do código do MUNICÍPIO DO TOMADOR em alguns casos. Falta decidir se a sugestão cobre só BH no MVP e o resto cai em escolha manual, ou se a gente mapeia mais municípios antes de lançar.",
  },
  {
    id: "P3.5",
    processos: ["P3"],
    titulo: "Transmite ao Emissor Nacional",
    quem: "a casa",
    faz: "Assina com o certificado da empresa e transmite ao Ambiente de Dados Nacional, esperando o número, o PDF e o XML.",
    fala: "Emissor Nacional (ADN, Serpro/RFB)",
    ve: "Um “emitindo…” curto, e a nota pronta em seguida.",
    luz: "verde",
    forma: "passo",
    fonte: "Matriz 3.1, resolvida em 09/09: API RESTful, GRATUITA, com Swagger público, autenticada por token e usando o A1 da empresa. ⚠️ Não comparar mais fornecedores — o caminho é a API nacional.",
  },
  {
    id: "P3.6",
    processos: ["P3"],
    titulo: "O órgão aceitou?",
    quem: "a casa",
    faz: "Lê a resposta do ADN e decide se a nota está autorizada ou se voltou com erro.",
    fala: "Emissor Nacional (ADN)",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Retorno síncrono da API nacional.",
  },
  {
    id: "P3.7",
    processos: ["P3"],
    titulo: "Nota emitida, e a receita entra na conta",
    quem: "a casa",
    faz: "Guarda número, PDF e XML, entrega a nota ao cliente e soma o valor à receita do mês e ao acumulado de 12 meses.",
    fala: "só a nossa casa",
    ve: "A nota na lista, pronta pra baixar ou enviar, e o valor já refletido no resumo do mês.",
    luz: "verde",
    forma: "fim",
    fonte:
      "Catálogo 3.2 e 3.3 (telas construídas). 🔑 É AQUI que os outros processos se abastecem: a receita do mês vira o DAS no P2.1, e o acumulado de 12 meses decide a faixa de RBT12 no P1.2, o Fator R e o teto do Simples. Não há aresta entre os processos porque não há salto — é DADO que atravessa, não caminho.",
  },
  {
    id: "P3.8",
    processos: ["P3"],
    titulo: "Voltou com erro, e a pessoa entende o porquê",
    quem: "a casa",
    faz: "Traduz o erro do órgão pra português comum, diz o que corrigir e deixa tentar de novo sem redigitar tudo.",
    fala: "só a nossa casa",
    ve: "A mensagem do que está errado, no campo que está errado, e o botão de tentar de novo.",
    luz: "amarelo",
    forma: "passo",
    fonte: "Doutrina anti-jargão do projeto: erro de órgão não se repassa cru.",
    duvida:
      "Falta a lista de erros que o ADN devolve e o de-para pra português. Sem ela, ou a gente mostra o código cru do órgão (que é o que todo mundo faz e a gente critica) ou inventa um texto genérico que não ajuda. É trabalho de leitura do manual do ADN, não de decisão.",
  },
  {
    id: "P3.9",
    processos: ["P3"],
    titulo: "O certificado está válido?",
    quem: "a casa",
    faz: "Antes de transmitir, confere se o certificado da empresa está válido. Sem ele não existe emissão.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Cláusula 5.3: é condição essencial que o Cliente mantenha o certificado digital válido."
  },
  {
    id: "P3.10",
    processos: ["P3"],
    titulo: "Emitiu fora: a nota precisa entrar aqui",
    quem: "cliente",
    faz: "Recebe a nota emitida em outro sistema pra que a receita do mês feche. Sem isso, o DAS sai errado.",
    fala: "ainda não sabemos",
    ve: "nada: a tela não existe",
    luz: "vermelho",
    forma: "passo",
    fonte: "Cláusula 5.4, que obriga o Cliente a importar na Plataforma a nota emitida por outro sistema. Catálogo 3.7, hoje 🔴.",
    duvida:
      "🔑 É O BURACO REAL DESTE PROCESSO, e não é de API: é de RESPONSABILIDADE. Se a pessoa emite fora e não traz, a receita fica menor do que é, o DAS sai a menor, e quem responde pelo imposto é ela (5.4 e 13.8) — mas quem calculou fomos nós. Três caminhos: (a) puxar do ADN as notas do CNPJ, já que a partir de 01/11/2026 TODAS passam por lá, e aí o problema pode sumir sozinho; (b) upload de XML; (c) digitação. O (a) é o que muda o jogo e precisa ser confirmado no manual do ADN.",
  },

  {
    id: "P3.11",
    processos: ["P3"],
    titulo: "Emissão parada: falta o certificado",
    quem: "a casa",
    faz: "Segura a emissão e leva pro que resolve: agendar a videochamada, se ele nunca fez, ou renovar, se venceu.",
    fala: "só a nossa casa",
    ve: "Aviso dizendo que a emissão está parada, por quê, e o botão que resolve.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Decisão do Pedro em 11/09: o certificado é BRINDE do plano, pagamento único nosso (R$ 209/ano, Anexo I), e vale 1 ano — então não falta certificado durante os 12 meses de fidelidade. ⚠️ Restam DOIS casos, e nenhum é “venceu no meio do caminho”: (a) o titular não compareceu à videochamada e nunca teve certificado — a 8.3 diz que a ausência não devolve valor nem prorroga prazo, e esse caso acontece logo no começo; (b) a partir do 13º mês, quando a renovação entra e a 8.6 a suspende por inadimplência. O caso (b) fica FORA do MVP, e está registrado aqui pra não virar surpresa no ano 2."
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

  // ══ P1 · do fechamento à cobrança ════════════════════════════════════════
  // 🔑 a entrada do P1 é o MESMO passo que fecha o P4: o ciclo virando. Não há
  // salto entre processos porque não há dois fatos — há um, lido por dois.
  { de: "P4.11", para: "P1.1" },
  { de: "P1.1", para: "P1.2" },
  { de: "P1.2", para: "P1.4", label: "o preço é o mesmo" },
  { de: "P1.2", para: "P1.3", label: "mudou de faixa, acabou a oferta ou teve reajuste" },
  { de: "P1.3", para: "P1.4" },
  { de: "P1.4", para: "P1.5" },
  { de: "P1.5", para: "P1.6", label: "pagou" },
  { de: "P1.5", para: "P1.7", label: "não pagou", tracejado: true },
  { de: "P1.7", para: "P1.8" },
  { de: "P1.8", para: "P1.5", label: "tentou de novo" },
  { de: "P1.8", para: "P1.9", label: "segue sem pagar", tracejado: true },
  { de: "P1.9", para: "P1.10", label: "2 mensalidades em aberto", tracejado: true },

  // ══ P2 · da guia emitida ao recálculo ════════════════════════════════════
  { de: "P2.1", para: "P2.2" },
  { de: "P2.2", para: "P2.3" },
  { de: "P2.3", para: "P2.4", label: "venceu" },
  { de: "P2.4", para: "P2.5" },
  { de: "P2.5", para: "P2.6", label: "foi paga" },
  { de: "P2.5", para: "P2.7", label: "não foi paga", tracejado: true },
  /**
   * 🔑 HANDOFF ENTRE PROCESSOS, e é diferente do passo compartilhado do P4/P1.
   * Lá era o MESMO fato lido por dois processos. Aqui são dois fatos: a guia
   * venceu (P2) e a pessoa contrata um avulso (P4). Salto real, então aresta.
   */
  { de: "P2.7", para: "P4.2", label: "aceitou recalcular", abre: "fatura" },

  // ══ P3 · do fato gerador à nota emitida ══════════════════════════════════
  { de: "P3.1", para: "P3.2" },
  { de: "P3.2", para: "P3.3", label: "emite aqui" },
  { de: "P3.2", para: "P3.10", label: "já emitiu fora", tracejado: true },
  { de: "P3.3", para: "P3.4" },
  { de: "P3.4", para: "P3.9" },
  { de: "P3.9", para: "P3.5", label: "válido" },
  { de: "P3.9", para: "P3.11", label: "vencido ou ausente", tracejado: true },
  { de: "P3.5", para: "P3.6" },
  { de: "P3.6", para: "P3.7", label: "autorizada" },
  { de: "P3.6", para: "P3.8", label: "voltou com erro", tracejado: true },
  { de: "P3.8", para: "P3.3", label: "corrigiu e tenta de novo" },
  { de: "P3.10", para: "P3.7", label: "a nota entrou" },
  { de: "P3.11", para: "P3.9", label: "renovou o certificado" },

];
