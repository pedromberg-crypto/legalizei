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
      "É o processo que os OUTROS consomem: a receita define o DAS (P2.1), a faixa de RBT12 (P1.2), o Fator R e o teto do Simples. ⏱ E é o único com relógio correndo: a Res. CGSN 191/2026 obriga toda ME/EPP (citacao de norma, FORA DO ESCOPO como porte atendido) do Simples ao Emissor Nacional a partir de 01/11/2026. 🔑 O caminho técnico é o mais resolvido do produto — API nacional RESTful, gratuita, com Swagger público — então o que sobra aqui é desenho, não integração.",
  },
  {
    id: "P4",
    titulo: "Adicionar um serviço avulso à fatura aberta",
    resumo:
      "A pessoa pede um serviço à-la-carte dentro do app. Ele não cobra na hora: entra como item de linha na fatura da competência. Atravessa /mais/servicos (onde nasce) e /mais/plano (onde aparece).",
    porqueImporta:
      "É o balde vendável inteiro. O líder fatura ~45 serviços assim, e é receita oculta do modelo dele. É também o processo que mais atravessa tela, então é onde uma incoerência aparece primeiro.",
  },
  {
    id: "P5",
    titulo: "Definir e pagar o pró-labore",
    resumo:
      "Todo mês a casa calcula quanto de pró-labore mantém a empresa no anexo mais barato, a pessoa mexe e vê o imposto mudar, e o valor é declarado. Só entra no Fator R o que foi efetivamente pago.",
    porqueImporta:
      "Fecha o loop mensal: a receita nasce no P3, o imposto sai no P2, e a ALÍQUOTA daquele imposto se decide aqui — Fator R ≥ 28% é Anexo III (6%), senão Anexo V (15,5%). É também o diferencial-âncora do produto (o líder tem 4 presets e esconde a conta) e carrega a armadilha mais cara que a gente mapeou: pró-labore lançado e NÃO pago vira glosa, reclassificação e multa.",
  },
  {
    id: "P6",
    titulo: "Cancelar, corrigir ou substituir uma nota já emitida",
    resumo:
      "A pessoa achou um erro numa nota que já saiu. A casa diz o que dá pra fazer, quanto custa e até quando, pede ao município, e depois acerta o que aquela nota tinha mexido: a receita da competência, o imposto e a alíquota.",
    porqueImporta:
      "É o único caminho do produto que anda PRA TRÁS. Todo o resto soma; aqui a receita da competência DIMINUI depois de já ter virado DAS, RBT12 e Fator R — e nenhum dos processos que consomem receita foi desenhado pra receber um número menor. 🔑 O P3.7 diz “soma o valor à receita do mês e ao acumulado de 12 meses”, e ninguém escreveu quem subtrai. É também o caso mais completo de evidência que a casa tem: o teardown de 09/09 entregou o modelo fiscal inteiro (75 campos), os dois caminhos de cancelamento e a regra de prazo fechada, com o Pedro conduzindo a navegação até a tela de confirmação.",
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
    falaNota: "O fechamento em si é o processo P1, desenhado em 11/09: daqui a fatura segue pro P1.1, que a monta. Este passo é a porta entre os dois — por isso ele é ■ fim no P4 (acaba o escopo do avulso) e continua vivo no P1.",
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
      "Três perguntas, e nenhuma tem resposta hoje. (1) A taxa que o gateway reteve volta? Na maioria dos provedores, não — então estorno integral sai do nosso bolso. (2) Estorno ou crédito na próxima fatura? Crédito não custa taxa e é mais rápido, mas prende o cliente. (3) Qual o prazo, e quem avisa quando cai. Tudo isso depende da política da Stone, que é o provedor nomeado nos passos de pagamento (P4.14, P4.15, P4.22). ⚠️ O que segue aberto NÃO é a escolha do provedor, é a condição comercial dele: quanto ele devolve num estorno e em que prazo. Pauta da reunião, junto com o mandato recorrente do P1.4.",
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
  // ME/EPP (citacao de norma, FORA DO ESCOPO como porte atendido) do Simples ao Emissor Nacional a partir de 01/11/2026.
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

  // ══ P5 · Definir e pagar o pró-labore ═════════════════════════════════════
  // 🔑 Fecha o loop mensal: a receita nasce no P3, o imposto sai no P2, e a
  // ALÍQUOTA daquele imposto se decide aqui. Sem este processo, a apuração do
  // P2.1 era caixa preta pela metade.
  //
  // 🔴 E carrega a armadilha mais cara do produto, registrada em 09/09: a
  // folha só conta no Fator R se foi EFETIVAMENTE PAGA (caixa), enquanto a
  // receita é competência. Recibo sem trânsito financeiro vira glosa,
  // reclassificação pro Anexo V e multa — 6% virando 15,5%.
  {
    id: "P5.1",
    processos: ["P5"],
    titulo: "Chega o mês, e o pró-labore precisa ser decidido",
    quem: "o relógio",
    faz: "Abre a decisão do mês com o valor sugerido já calculado, em vez de esperar a pessoa lembrar.",
    fala: "só a nossa casa",
    ve: "A tarefa do mês aparece na home, com o valor proposto e o prazo.",
    luz: "verde",
    forma: "passo",
    fonte: "Aferição do Fator R é MENSAL, no PGDAS-D (Res. CGSN 140/2018, art. 26). Não é decisão anual.",
  },
  {
    id: "P5.2",
    processos: ["P5"],
    titulo: "Calcula o que mantém o Anexo III",
    quem: "a casa",
    faz: "Calcula o mínimo que segura o Fator R em 28%: folha dos últimos 12 meses dividida pela receita dos últimos 12 meses, respeitando o piso do salário mínimo.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "passo",
    fonte:
      "Fórmula da matriz: folha 12m ÷ receita 12m; ≥ 28% → Anexo III (6%), senão Anexo V (15,5%). Entram salário CLT, pró-labore, 13º, férias + 1/3 e FGTS. 🔴 NÃO entra a CPP embutida no DAS: este passo afirmava que entrava, e a leitura foi refutada em 14/09 contra a Res. CGSN 140/2018 art. 26 §2º I 'a', que nomeia só o Anexo IV. Também não entram distribuição de lucros, autônomo, prestador PJ, PAT e estagiário. Evidência do líder (09/09): pró-labore do mês = max(piso; 0,28 × Σfaturamento 12m − Σpró-labore dos 11 meses anteriores).",
  },
  {
    id: "P5.3",
    processos: ["P5"],
    titulo: "Mexe e vê o imposto mudar",
    quem: "cliente",
    faz: "Deixa a pessoa mover o valor e mostra na hora o que muda: INSS, IRRF, Fator R e a alíquota do DAS.",
    fala: "só a nossa casa",
    ve: "A tela /pro-labore, com o controle e o efeito ao vivo. Sem preset, sem “confie na gente”.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Catálogo 4.1, construída. É o diferencial-âncora: o líder tem 4 presets em radio button e esconde a conta. A engine é nossa e roda 100% local, sem API.",
  },
  {
    id: "P5.4",
    processos: ["P5"],
    titulo: "Faturou neste mês?",
    quem: "a casa",
    faz: "Sem faturamento no mês, oferece não pagar pró-labore — e explica o efeito disso no Fator R dos 12 meses.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte: "Catálogo 4.3, construída: o toggle existe e vem explicado, ao contrário do switch cru do líder.",
  },
  {
    id: "P5.5",
    processos: ["P5"],
    titulo: "Sem faturamento, sem pró-labore",
    quem: "a casa",
    faz: "Registra o mês sem pró-labore e mantém a obrigação acessória em dia, porque ela não pausa.",
    fala: "só a nossa casa",
    ve: "O mês fica marcado como sem pró-labore, com o efeito no Fator R à vista.",
    luz: "amarelo",
    forma: "fim",
    fonte: "Catálogo 4.3. A obrigação mensal continua existindo mesmo sem valor — mesmo princípio do “eSocial sem movimento” da folha (7.4).",
    duvida:
      "Mês sem pró-labore derruba a média do Fator R nos 12 meses seguintes, e o efeito só aparece lá na frente. A tela precisa dizer QUANTO isso custa antes do toque — e falta decidir se a gente chega a desaconselhar, ou só informa.",
  },
  {
    id: "P5.6",
    processos: ["P5"],
    titulo: "Confirma o valor do mês",
    quem: "cliente",
    faz: "Trava o valor do mês e o manda pra transmissão.",
    fala: "só a nossa casa",
    ve: "Resumo do que vai ser declarado e quanto sai de INSS e IRRF.",
    luz: "verde",
    forma: "passo",
    fonte: "Decorre do P5.3: o valor é escolha da pessoa, e a casa só sugere.",
  },
  {
    id: "P5.7",
    processos: ["P5"],
    titulo: "Declara e gera a guia do INSS",
    quem: "a casa",
    faz: "Transmite o evento do pró-labore ao eSocial, consolida na DCTFWeb e devolve o DARF numerado.",
    fala: "Integra Contador (eSocial S-1200 → DCTFWeb)",
    ve: "A guia do INSS aparece em /impostos, junto com o DAS.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Matriz 4.5, resolvida em 09/09: o caminho é eSocial (S-1200) → DCTFWeb → DARF numerado, coberto pelo Integra Contador com o A1 da empresa. Mesmo contrato do P2.1 e do P3.5. Evidência do líder (09/09): o “DARF Unificado” é essa guia — R$ 178,31 = 11% de R$ 1.621.",
  },
  {
    id: "P5.8",
    processos: ["P5"],
    titulo: "O dinheiro saiu da conta pro sócio?",
    quem: "a casa",
    faz: "Confere se o pró-labore foi EFETIVAMENTE PAGO. Enquanto não houver trânsito financeiro, ele não pode entrar no Fator R.",
    fala: "ainda não sabemos",
    ve: "nada: a tela não existe",
    luz: "vermelho",
    forma: "decisao",
    fonte:
      "Matriz, seção do Fator R: a folha só conta em REGIME DE CAIXA, enquanto a receita é competência. A Receita cruza EFD-Reinf com DCTFWeb pra pegar isso.",
    duvida:
      "🔴 A ARMADILHA MAIS CARA DO PRODUTO, e ela é diferente do P2.4. Lá era saber que a GUIA foi paga, e existe consulta de arrecadação. Aqui é uma transferência da empresa PRO SÓCIO — o dinheiro não passa por nós nem pelo governo, e não há API nenhuma. O único rastro é o EXTRATO que o cliente envia até o 5º dia útil (cláusula 5.4). Se a gente considerar pago o que só foi lançado, o Fator R é glosado, a empresa perde a tributação pelo Anexo III (6% → 15,5%) e leva multa. Três caminhos: (a) só contar depois de casar com o extrato, atrasando o Fator R; (b) contar na hora e corrigir se o extrato desmentir; (c) Open Finance read-only. Nenhum está decidido.",
  },
  {
    id: "P5.9",
    processos: ["P5"],
    titulo: "Entra no Fator R, e a alíquota se sustenta",
    quem: "a casa",
    faz: "Soma o pró-labore pago à folha dos 12 meses, recalcula o Fator R e confirma o anexo que vale no mês.",
    fala: "só a nossa casa",
    ve: "O Fator R atualizado em /impostos/aliquotas, com quanto falta pros 28%.",
    luz: "verde",
    forma: "fim",
    fonte:
      "🔑 É daqui que o P2.1 tira a alíquota: Fator R ≥ 28% → Anexo III (6%), senão Anexo V (15,5%). Não há aresta entre os processos porque não há salto — é DADO que atravessa.",
  },
  {
    id: "P5.10",
    processos: ["P5"],
    titulo: "Lançado e não pago: avisa antes de virar multa",
    quem: "a casa",
    faz: "Marca o pró-labore como pendente de pagamento, deixa ele FORA do Fator R e avisa o que acontece se ficar assim.",
    fala: "só a nossa casa",
    ve: "Aviso dizendo que o valor foi declarado mas não pago, o que isso faz com a alíquota, e até quando dá pra resolver.",
    luz: "amarelo",
    forma: "fim",
    fonte: "Decorre do regime de caixa do Fator R. O app NÃO PODE considerar pró-labore lançado e não pago.",
    duvida:
      "Até quando o pagamento ainda conta pro mês de competência, e o que acontece se ele sair depois. Isso muda o Fator R retroativamente e pode obrigar retificação (catálogo 4.8, serviço à-la-carte). Pergunta pro Mauro: a régua é a data do pagamento ou a competência do recibo?",
  },
  {
    id: "P5.11",
    processos: ["P5"],
    titulo: "Avisa ANTES de virar a faixa",
    quem: "a casa",
    faz: "Acompanha o Fator R dos 12 meses e avisa quando a empresa está perto de perder o benefício do Anexo III, com quanto falta de pró-labore pra evitar.",
    fala: "só a nossa casa",
    ve: "Aviso com a distância pros 28% e o valor exato que resolve.",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "Catálogo 4.2, hoje 🟡: o cálculo existe, falta o gatilho do alerta. É o mesmo motor da vigília preditiva (5.4), o diferencial nº 2. O líder tem o cálculo e NÃO tem o alerta.",
    duvida:
      "Com quanta antecedência avisar, e quantas vezes. Avisar cedo demais em janeiro não ajuda; avisar em dezembro não dá tempo de corrigir, porque o Fator R é média de 12 meses. Falta a régua — e ela é a mesma do 5.4.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // P6 · CANCELAR, CORRIGIR OU SUBSTITUIR UMA NOTA JÁ EMITIDA (12/09)
  // ══════════════════════════════════════════════════════════════════════════
  //
  // 🔴 É O ÚNICO PROCESSO QUE ANDA PRA TRÁS. Todo o resto soma: o P3 soma
  // receita, o P4 soma item na fatura, o P5 soma folha no Fator R. Aqui a
  // receita de uma competência DIMINUI depois de já ter virado DAS (P2.1),
  // faixa de RBT12 (P1.2) e Fator R (P5.9) — e nenhum desses foi desenhado
  // pra receber um número menor.
  //
  // 📚 Evidência: `produto/evidencias/2026-09-09-contabilizei-nota-fiscal.md`
  // §10 (3ª rodada, o Pedro conduzindo até a tela de confirmação, sem
  // confirmar o cancelamento) + `produto/funcionalidades/emitir-nota-fiscal.md`
  // (modelo fiscal de 75 campos) + `produto/_matriz-dependencia.md` linha 3.4
  // (cancelamento por API, prazo de 730 dias com fonte).
  //
  // 🔑 TRÊS AÇÕES, NÃO UMA. A funcionalidade 3.4 junta "cancelar, corrigir e
  // reemitir" num nome só, e elas se comportam diferente:
  //   cancelar     · a nota deixa de valer; a receita cai
  //   substituir   · nasce nota nova ligada à velha nos dois sentidos
  //   corrigir     · muda o que NÃO mexe em imposto; a receita não se altera
  // 🔴 Mudar VALOR não é corrigir, é substituir. Tratar os dois como a mesma
  // coisa é o erro que faz a receita da competência mentir sem ninguém ver.
  {
    id: "P6.1",
    processos: ["P6"],
    titulo: "Achou um erro numa nota que já saiu",
    quem: "cliente",
    faz: "Nada ainda: é o problema aparecendo. A casa só entra quando a pessoa abre a nota e pede pra mexer.",
    fala: "só a nossa casa",
    ve: "O botão de mexer na nota, dentro dela. 🔑 Não é item de menu: nasce da nota, igual no líder.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Evidência §10: o caminho real de cancelamento do líder não está no menu, nasce do botão dentro da nota. A varredura de menu não achou por isso. Lição registrada: menu dá as portas, ação dá os corredores.",
  },
  {
    id: "P6.2",
    processos: ["P6"],
    titulo: "◆ A nota nasceu aqui ou veio de fora?",
    quem: "a casa",
    faz: "Separa os dois mundos. Nota emitida por nós, nós cancelamos no órgão. Nota importada, quem cancelou foi o portal do município e a casa só REGISTRA o que já aconteceu.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte:
      "Evidência §10: o líder tem DOIS caminhos distintos, `cancelamento-nota-emitida` (novo) e `sistema/informarCancelamento` (legado). Copiar essa separação está na lista do que a gente copia sem vergonha (item 11).",
  },
  {
    id: "P6.3",
    processos: ["P6"],
    titulo: "◆ Ainda está dentro do prazo legal?",
    quem: "a casa",
    faz: "Confere os 730 dias desde a emissão. É limite do município, não regra nossa, e não tem exceção que a gente possa dar.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte:
      "Portaria SMFA 075/2025 art. 5º, com a redação da 088/2025 (matriz de dependência, linha 3.4). A mesma redação REVOGOU a exigência de CPF/CNPJ do tomador: dá pra cancelar nota de tomador não identificado. 🔑 12/09, fonte primária: o prazo é **parâmetro do município emissor**, não número nacional (recusa E0822 do Sistema Nacional). Os 730 dias são o número de BH; a API do município conhece o dele, então a casa não precisa guardar a data na mão — precisa ler o parâmetro.",
  },
  {
    id: "P6.4",
    processos: ["P6"],
    titulo: "■ Passou de 2 anos: não dá mais",
    quem: "a casa",
    faz: "Diz que o prazo legal do município acabou e que nem a casa nem o cliente podem reabrir isso, e oferece o caminho que existe: conversar com a contabilidade sobre o efeito daquela nota.",
    fala: "só a nossa casa",
    ve: "A nota com o motivo em português, a data em que o prazo venceu, e a saída pelo WhatsApp. Sem botão que não leva a nada.",
    luz: "verde",
    forma: "fim",
    fonte:
      "730 dias da Portaria SMFA 075/2025. É saída terminal de propósito: caminho sem saída declarado é melhor que botão que falha no órgão.",
  },
  {
    id: "P6.5",
    processos: ["P6"],
    titulo: "◆ A competência está fechada?",
    quem: "a casa",
    faz: "Pergunta ao servidor se aquele mês contábil já fechou. 🔑 É estado da competência, não conta de data feita na tela.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "verde",
    forma: "decisao",
    fonte:
      "O flag `mesFechado` vem no payload da nota no líder (modelo fiscal de 75 campos) e é ele que governa custo de cancelar, alterar e importar. O fecho é o dia 5 do mês seguinte, e vale para as três ações. ⚠️ O rodapé de emissão do líder diz “dentro do mesmo mês” e está IMPRECISO: a janela real é até o dia 5 do mês seguinte.",
  },
  {
    id: "P6.6",
    processos: ["P6"],
    titulo: "Mês fechado: diz o custo ANTES de deixar seguir",
    quem: "a casa",
    faz: "Mostra, numa frase só, a janela sem custo, o valor da reabertura do mês contábil e o limite legal. Só então libera a ação.",
    fala: "só a nossa casa",
    ve: "Uma linha no lugar da decisão: “Cancelar até 5/10 não tem custo. Depois disso são R$ X de reabertura do mês. O limite legal é 2 anos.” Não três telas com um terço da informação cada.",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "Regra fechada na 3ª rodada do teardown: até o dia 5 grátis · depois, custo de reabertura (R$ 21,90 no líder) · 730 dias é o limite legal. 🔴 No líder a cobrança é disparada pela AÇÃO, automaticamente (`disponivelParaCliente: false`); a nossa doutrina é a oposta — preço e momento da cobrança aparecem ANTES do aceite (mesma regra do P4.2).",
    duvida:
      "Três perguntas, nenhuma respondida. (1) A gente cobra reabertura? Cobrar é honesto (tem custo de execução real), mas a régua de posicionamento diz pra não punir o erro do cliente, e o líder já é caro. (2) Se cobra, quanto? Abaixo de R$ 50 a cláusula 6.3 manda pra fatura da competência seguinte, o que casa com o P4; acima, o P4.3 exige aceite formal na hora. (3) O erro é NOSSO em parte dos casos (nota emitida com dado que a gente pré-preencheu) — nesses, cobrar é indefensável, e não existe regra separando culpa. Pergunta pro Mauro, e é de posicionamento antes de ser de preço.",
  },
  {
    id: "P6.7",
    processos: ["P6"],
    titulo: "◆ Cancelar, substituir ou corrigir?",
    quem: "cliente",
    faz: "Pergunta o que precisa acontecer com a nota, em português, e não em nome de sistema. 🔴 Mudar VALOR não é correção, é substituição: a casa decide o caminho pelo que mudou, não pelo botão que a pessoa apertou.",
    fala: "só a nossa casa",
    ve: "Três saídas nomeadas pelo efeito: “essa nota não deveria existir”, “o valor ou o serviço está errado”, “só o texto está errado”.",
    luz: "verde",
    forma: "decisao",
    fonte:
      "Decisão nossa de 12/09. A funcionalidade 3.4 do catálogo junta as três num nome só (“cancelar, corrigir e reemitir”), e o teardown mostra que elas têm caminhos, custos e consequências fiscais diferentes.",
  },
  {
    id: "P6.8",
    processos: ["P6"],
    titulo: "Confirma com a nota inteira na tela",
    quem: "cliente",
    faz: "Mostra número, código de verificação, data, cliente, o serviço e o MUNICÍPIO, e só então aceita o cancelamento.",
    fala: "só a nossa casa",
    ve: "A nota inteira relida antes do irreversível. 🔑 O município aparece porque é ele que cancela, e é ele que decide prazo e demora — não é decoração.",
    luz: "verde",
    forma: "passo",
    fonte:
      "Tela 2 do líder (`cancelamento-nota-emitida/detalhes/{codVerificacao}`), lida na 3ª rodada. Mesma doutrina da A1 do flow de abertura: a última tela antes do irreversível mostra tudo o que vai embora.",
  },
  {
    id: "P6.9",
    processos: ["P6"],
    titulo: "Pede o cancelamento e espera o município",
    quem: "a casa",
    faz: "Assina com o certificado e manda o pedido de cancelamento, sem prometer que resolve na hora: quem cancela é a prefeitura.",
    fala: "Sefin Nacional NFS-e",
    falaNota:
      "`POST /nfse/{chaveAcesso}/eventos` — a API de eventos é genérica: o cancelamento é o tipo e101101, com assinatura digital obrigatória no pedido de registro. Só o sistema que GEROU a nota recebe o evento.",
    ve: "Estado “cancelamento pedido”, com a data do pedido e a frase honesta: em algumas prefeituras isso demora.",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "✅ RESOLVIDO em 12/09 com fonte primária (`2026-09-12-nfse-nacional-eventos-cancelamento`): cancelar é REGISTRAR UM EVENTO contra a chave de acesso, e o processamento é **síncrono** — a documentação diz com estas palavras, e a transação termina em “o sistema envia comunicação de aceite ou rejeição ao solicitante”. No caminho normal NÃO nasce vigia. ⚠️ Corrigido junto: o ADN é o ambiente de COMPARTILHAMENTO e só aceita GET do contribuinte; quem recebe evento é a Sefin geradora.",
    duvida:
      "O que sobra é de município, não de API: o síncrono vale nas Sefins que seguem o padrão nacional, e BH tem sistema próprio (BHISS). O líder avisa “pode demorar em certas prefeituras”, e isso deixou de ser contradição — é a diferença entre padrão nacional e Sefin municipal. Uma chamada resolve: `GET /parametros_municipais/3106200/convenio` diz se BH é conveniada.",
  },
  {
    id: "P6.10",
    processos: ["P6"],
    titulo: "◆ O município aceitou?",
    quem: "a casa",
    faz: "Lê a resposta do órgão e decide se a nota morreu de fato ou continua valendo.",
    fala: "Sefin Nacional NFS-e",
    ve: "nada, acontece por baixo",
    luz: "amarelo",
    forma: "decisao",
    fonte:
      "✅ A LISTA DE RECUSAS EXISTE, e veio da fonte primária em 12/09 (Anexo II, aba de regras de negócio). São quatro, todas com código: **E0822** prazo expirado · **E0823** valor da nota acima do permitido · **E0824** nota sem tomador identificado · **E0827** a nota tem Evento de Tributos Recolhidos vinculado. 🔑 As quatro dependem de PARAMETRIZAÇÃO DO MUNICÍPIO — não são regra nacional fixa. Par do P3.6, do outro lado do ciclo: lá se lê se a nota foi autorizada, aqui se foi cancelada.",
    duvida:
      "O que sobra não é “quais recusas existem”, é “quais delas BH ligou”. O E0823 (teto de valor pra cancelar) não aparecia em nenhuma fonte nossa e pode travar justamente a nota grande, que é a que dói. E o E0824 parecia contradizer a nossa matriz, que registra a revogação da exigência de tomador identificado pela Portaria SMFA 088/2025 — não contradiz: a regra nacional permite o município exigir, e BH desligou a dele. Os parâmetros se leem por API, não se perguntam.",
  },
  {
    id: "P6.11",
    processos: ["P6"],
    titulo: "■ Recusou: a nota continua valendo",
    quem: "a casa",
    faz: "Diz que a nota segue de pé, por quê, e o que fazer. Nada muda na receita nem no imposto.",
    fala: "só a nossa casa",
    ve: "O motivo em português, e o caminho: resolver a pendência e tentar de novo, ou falar com a contabilidade.",
    luz: "amarelo",
    forma: "fim",
    fonte: "Saída obrigatória do P6.10 — decisão sem porta de recusa esconde o caso que mais assusta o cliente.",
    duvida:
      "Se a recusa for por pendência que a CASA resolve (inscrição municipal irregular), a gente retoma o cancelamento sozinho depois, ou a pessoa precisa pedir de novo? Retomar sozinho é melhor produto e cria uma fila que ninguém desenhou.",
  },
  {
    id: "P6.12",
    processos: ["P6"],
    titulo: "Substitui: nasce a nota nova, ligada à velha",
    quem: "a casa",
    faz: "Emite a nota correta e amarra as duas nos dois sentidos, pra que o histórico conte a verdade: a velha aponta pra substituta, a nova aponta pra substituída.",
    fala: "Sefin Nacional NFS-e",
    falaNota:
      "`POST /nfse` levando a chave de acesso da nota a substituir. Não é endpoint separado: é a MESMA emissão do P3.5, e é a presença da chave que faz a API cancelar a velha por substituição e emitir a nova numa transação só.",
    ve: "As duas notas na lista, ligadas, com a velha marcada como substituída. Nenhuma some.",
    luz: "verde",
    forma: "passo",
    fonte:
      "✅ RESOLVIDO em 12/09 com fonte primária: é UMA operação. Um `POST /nfse` carregando a chave de acesso da nota velha faz a API gerar o **Evento de Cancelamento por Substituição** (e105102) vinculado à original, cancelá-la e emitir a substituta, devolvendo o XML da nova. Não existe o instante em que a velha morreu e a nova ainda não nasceu — que era a dúvida. 🔑 O `anexoEscolhido` grava NA NOTA: se o Fator R virou no meio do ano, cada nota carrega o Anexo que valia na hora, e o histórico depende disso pra não mentir.",
  },
  {
    id: "P6.13",
    processos: ["P6"],
    titulo: "■ Corrige o que não mexe em imposto, e guarda no log",
    quem: "a casa",
    faz: "Altera só o que não muda a apuração, e registra quem mudou, o quê e quando, por nota.",
    fala: "só a nossa casa",
    ve: "A nota atualizada e o histórico de alterações dentro dela, legível.",
    luz: "amarelo",
    forma: "fim",
    fonte:
      "O `logAlteracoes` por nota está na lista do que a gente copia sem vergonha (item 10). O líder ainda diz ao usuário quais escolhas são fiscalmente neutras (“alterar não impacta nos impostos”), o que destrava quem tem medo de errar.",
    duvida:
      "Quais campos são de fato neutros. O líder afirma que certas alterações não mexem no imposto, mas não lista quais — e errar pra menos aqui é pior que errar pra mais: uma “correção” que muda a base vira receita falsa sem ninguém perceber, porque este caminho não passa pelo acerto da competência. Precisa da lista, e ela sai do Swagger do ADN mais a leitura fiscal.",
  },
  {
    id: "P6.14",
    processos: ["P6"],
    titulo: "Registra o cancelamento que o portal já fez",
    quem: "cliente",
    faz: "Recebe a informação de que uma nota importada foi cancelada lá fora, pra que a receita da competência pare de contar com ela.",
    fala: "só a nossa casa",
    ve: "Campo pra informar o cancelamento da nota que veio de fora, dizendo com todas as letras que quem cancelou foi a prefeitura, não a gente.",
    luz: "amarelo",
    forma: "passo",
    fonte:
      "É o `sistema/informarCancelamento` do líder, o caminho legado, e ele existe separado por um motivo real: em nota importada a casa não tem poder nenhum sobre o órgão. Copiar a separação está no item 11 do que a gente copia.",
    duvida:
      "O prazo desse caminho continua sem resposta — foi anotado como lacuna na 2ª rodada do teardown e não fechou. E tem uma pergunta nossa por cima: a gente aceita a palavra do cliente, ou confere no portal antes de tirar a receita da competência? Aceitar sem conferir deixa a apuração na mão de quem não responde por ela.",
  },
  {
    id: "P6.15",
    processos: ["P6"],
    titulo: "◆ Aquela competência já virou imposto?",
    quem: "a casa",
    faz: "Antes de mexer na receita, olha em que pé está a competência daquela nota: se o DAS já foi apurado e emitido, mexer no número exige desfazer o que já foi declarado.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "vermelho",
    forma: "decisao",
    fonte:
      "Cruzamento com o P2.1, que apura o DAS com a receita do mês no fechamento da competência. Ninguém tinha escrito o que acontece quando essa receita muda DEPOIS. 🔑 12/09, achado do Pedro: o estado tem DATA CONHECIDA, não é imponderável — no líder a guia fica disponível entre os dias 15 e 16 do mês seguinte, e existe o status próprio `AGUARDANDO_DISPONIBILIZACAO` com `valor.status: CALCULANDO`, ou seja, a guia existe antes de estar disponível. São 10 status no histórico dele.",
    duvida:
      "🔴 O estado que esta decisão precisa ler não existe DO NOSSO LADO: o P2 sabe emitir a guia e sabe se ela foi paga, mas nenhum passo guarda “esta competência foi apurada com estes valores”. É trabalho no P2, não aqui. 🔑 E são TRÊS janelas, não duas — antes do fecho contábil (nada acontece), entre o fecho e a apuração (custa reabertura mas a guia ainda não saiu, então basta recalcular antes de disponibilizar) e depois da apuração (aí sim é retificação). O desenho de hoje só conhece a primeira e a terceira. ⚠️ Vem de fora uma pista forte: a recusa **E0827** do Sistema Nacional bloqueia o cancelamento de nota que tenha “Evento de Tributos Recolhidos” vinculado — o órgão modela esse momento, e talvez a gente não precise inventar o nosso.",
  },
  {
    id: "P6.16",
    processos: ["P6"],
    titulo: "Refaz a apuração da competência que já tinha fechado",
    quem: "a casa",
    faz: "Recalcula o DAS daquele mês com a receita corrigida e retifica a declaração já entregue.",
    fala: "ainda não sabemos",
    ve: "nada: a tela não existe",
    luz: "vermelho",
    forma: "passo",
    fonte: "Consequência direta do P6.15. Não há decisão nem evidência sobre isso em lugar nenhum do vault.",
    duvida:
      "🔴 Quatro perguntas abertas, e a primeira é técnica. (1) O PGDAS-D aceita retificação por API no Integra Contador, ou é trabalho humano no e-CAC? (2) Se o DAS já foi PAGO a maior, vira crédito ou pedido de restituição — e quem conduz? (3) Retificação é serviço avulso (o líder cobra alteração de obrigação acessória) ou entra no plano? (4) Quem assina: é responsabilidade técnica do contador, e a Carta do CFC 1.590/2020 encosta aqui. As três primeiras são do Mauro; a primeira, do Swagger.",
  },
  {
    id: "P6.17",
    processos: ["P6"],
    titulo: "■ A receita da competência cai, e tudo que dependia dela se move",
    quem: "a casa",
    faz: "Tira o valor da receita do mês e do acumulado de 12 meses, e recalcula o que dependia disso: a faixa de RBT12, o Fator R e o anexo que vale.",
    fala: "só a nossa casa",
    ve: "nada: a tela não existe",
    luz: "vermelho",
    forma: "fim",
    fonte:
      "Espelho do P3.7, que soma a receita quando a nota nasce. É o fecho do único caminho do produto que anda pra trás.",
    duvida:
      "🔴 O efeito dominó não tem dono. Três coisas se movem e nenhuma foi desenhada pra se mover pra baixo: (1) o RBT12 muda a faixa, e a faixa muda a MENSALIDADE do cliente (P1.2) — a gente devolve a diferença de um mês já cobrado? (2) o Fator R cai e pode reclassificar do Anexo III pro V, com efeito retroativo (P5.9); (3) a nota carrega o `anexoEscolhido` da época, então o histórico precisa continuar contando a verdade do que valia naquele dia, não a de hoje. ⚠️ O caso mais barato de resolver e o mais fácil de esquecer: nota cancelada no MESMO mês, antes de qualquer apuração, não deveria disparar nada disso — e hoje o desenho não distingue.",
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

  // ══ P5 · do mês que vira ao Fator R que se sustenta ══════════════════════
  { de: "P5.1", para: "P5.2" },
  { de: "P5.2", para: "P5.4" },
  { de: "P5.4", para: "P5.3", label: "faturou" },
  { de: "P5.4", para: "P5.5", label: "não faturou", tracejado: true },
  { de: "P5.3", para: "P5.6" },
  { de: "P5.6", para: "P5.7" },
  { de: "P5.7", para: "P5.8" },
  { de: "P5.8", para: "P5.9", label: "o dinheiro saiu" },
  { de: "P5.8", para: "P5.10", label: "declarado e não pago", tracejado: true },
  { de: "P5.9", para: "P5.11" },
  { de: "P5.11", para: "P5.1", label: "perto de virar a faixa" },

  // ── P6 · o caminho que anda pra trás ──────────────────────────────────────
  { de: "P6.1", para: "P6.2" },
  { de: "P6.2", para: "P6.3", label: "a nota nasceu aqui" },
  { de: "P6.2", para: "P6.14", label: "veio de fora, importada" },
  { de: "P6.3", para: "P6.5", label: "dentro dos 2 anos" },
  { de: "P6.3", para: "P6.4", label: "passou de 730 dias" },
  { de: "P6.5", para: "P6.7", label: "mês ainda aberto" },
  { de: "P6.5", para: "P6.6", label: "mês já fechado" },
  { de: "P6.6", para: "P6.7" },
  { de: "P6.7", para: "P6.8", label: "essa nota não deveria existir" },
  { de: "P6.7", para: "P6.12", label: "o valor ou o serviço está errado" },
  { de: "P6.7", para: "P6.13", label: "só o texto está errado" },
  { de: "P6.8", para: "P6.9" },
  { de: "P6.9", para: "P6.10" },
  { de: "P6.10", para: "P6.15", label: "o município cancelou" },
  { de: "P6.10", para: "P6.11", label: "o município recusou", tracejado: true },
  { de: "P6.12", para: "P6.15" },
  { de: "P6.14", para: "P6.15" },
  { de: "P6.15", para: "P6.16", label: "o DAS daquele mês já saiu" },
  { de: "P6.15", para: "P6.17", label: "a competência ainda não apurou" },
  { de: "P6.16", para: "P6.17" },

];
