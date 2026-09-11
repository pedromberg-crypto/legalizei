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
    titulo: "Confirma, com dupla checagem",
    quem: "cliente",
    faz: "Antes de aceitar, diz o preço, quando será cobrado e avisa que o trabalho começa na hora. Só então libera o botão.",
    fala: "só a nossa casa",
    ve: "Sheet de detalhe com 'Solicitar serviço' e um segundo toque de confirmação.",
    luz: "verde",
    forma: "passo",
    fonte: "Balde vendável, ADR 22/07. O double-check existe porque o pedido é IRREVERSÍVEL (ver P4.7).",
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
  {
    id: "P4.4",
    processo: "P4",
    titulo: "Aceite no ato (acima de R$ 50)",
    quem: "cliente",
    faz: "Registra um aceite com data e hora, guardando o preço exibido e o texto que a pessoa leu.",
    fala: "só a nossa casa",
    ve: "nada: a tela não existe",
    luz: "vermelho",
    forma: "passo",
    fonte: "Cláusula 6.3 obriga. Nenhuma tela cobre.",
    duvida:
      "O aceite acima de R$ 50 é EXIGÊNCIA DO NOSSO CONTRATO e não existe em lugar nenhum do app. Como ele se parece? É o mesmo double-check do P4.2 com texto diferente, ou é uma tela de aceite com trilha própria (data, IP, navegador), como a do contrato? A minuta trata aceite de serviço como coisa formal, então provavelmente é a segunda.",
  },

  // ── o registro ────────────────────────────────────────────────────────────
  {
    id: "P4.5",
    processo: "P4",
    titulo: "Guarda o pedido e trava o preço",
    quem: "a casa",
    faz: "Cria o pedido com o preço do dia congelado, para que reajuste posterior não mude o que já foi contratado.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "amarelo",
    forma: "passo",
    fonte: "Decorre da cláusula 6.3, que manda exibir o preço antes. Preço exibido e preço cobrado têm que ser o mesmo.",
    duvida:
      "O preço congela no PEDIDO ou no FECHAMENTO da competência? Se o reajuste anual cair entre os dois, a pessoa paga o que viu ou o novo? O contrato manda exibir antes, o que aponta pro pedido — mas isso precisa ser dito, não deduzido.",
  },

  // ── onde o item cai ───────────────────────────────────────────────────────
  {
    id: "P4.6",
    processo: "P4",
    titulo: "Existe fatura ABERTA na competência?",
    quem: "a casa",
    faz: "Procura a fatura do mês corrente que ainda não fechou.",
    fala: "só a nossa casa",
    ve: "nada, acontece por baixo",
    luz: "vermelho",
    forma: "decisao",
    fonte: "Modelo de fatura por competência, travado em 11/09.",
    duvida:
      "🔑 O BURACO CENTRAL DESTE PROCESSO. Se a competência já fechou (pedido no dia 30, fatura fechou no dia 28), o item vai pra competência SEGUINTE, ou abre uma cobrança avulsa? A cláusula 6.3 diz 'fatura da competência seguinte', o que sugere a primeira. Mas aí um pedido feito no dia 1º espera quase 60 dias pra ser cobrado, e o trabalho já foi entregue. Precisa de decisão do Pedro + Mauro.",
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
    titulo: "E se o serviço não puder ser entregue?",
    quem: "a casa",
    faz: "ainda não sabemos",
    fala: "ainda não sabemos",
    ve: "ainda não sabemos",
    luz: "vermelho",
    forma: "decisao",
    fonte: "—",
    duvida:
      "Certidão que volta negada, órgão fora do ar, documento que o cliente não mandou. O item já está na fatura e o trabalho já começou. Estorna, vira crédito na fatura seguinte, ou cobra assim mesmo porque o trabalho foi feito? Isso NÃO está no nosso contrato, e o do líder também não responde.",
  },
  {
    id: "P4.10",
    processo: "P4",
    titulo: "E se cancelar o plano com avulso em andamento?",
    quem: "cliente",
    faz: "ainda não sabemos",
    fala: "só a nossa casa",
    ve: "ainda não sabemos",
    luz: "vermelho",
    forma: "decisao",
    fonte: "—",
    duvida:
      "A cláusula 7.4 do líder cobra tudo que está em aberto no aviso prévio. A nossa minuta não trata de avulso em andamento no cancelamento. Cobra, entrega mesmo assim, ou cancela o serviço junto?",
  },

  // ── o fecho ───────────────────────────────────────────────────────────────
  {
    id: "P4.11",
    processo: "P4",
    titulo: "A competência fecha e a fatura soma tudo",
    quem: "o relógio",
    faz: "No fechamento, a fatura para de aceitar item novo e vira o total que será cobrado.",
    fala: "só a nossa casa",
    falaNota: "O fechamento em si é o processo P1, que ainda não foi desenhado.",
    ve: "O total no /mais/plano deixa de mudar.",
    luz: "amarelo",
    forma: "fim",
    fonte: "Modelo de fatura por competência (ADR 11/09).",
    duvida:
      "Em que DIA a competência fecha? A cláusula 3.4 fixa o vencimento no dia 15, mas vencimento e fechamento são coisas diferentes. O líder tem `jaFechada` e `fechada` no objeto da fatura, então o conceito existe do lado dele — mas o dia é decisão nossa.",
  },
];

export const ARESTAS = [
  { de: "P4.1", para: "P4.2" },
  { de: "P4.2", para: "P4.3" },
  { de: "P4.3", para: "P4.4", label: "acima de R$ 50" },
  { de: "P4.3", para: "P4.5", label: "até R$ 50" },
  { de: "P4.4", para: "P4.5" },
  { de: "P4.5", para: "P4.6" },
  { de: "P4.6", para: "P4.7", label: "fatura aberta" },
  { de: "P4.6", para: "P4.11", label: "já fechou · ❓", tracejado: true },
  { de: "P4.7", para: "P4.8" },
  { de: "P4.8", para: "P4.9", label: "não deu certo", tracejado: true },
  { de: "P4.8", para: "P4.10", label: "cancelou o plano", tracejado: true },
  { de: "P4.8", para: "P4.11", label: "correu bem" },
];
