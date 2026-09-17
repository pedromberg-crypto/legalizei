/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏛 IMPOSTOS — varredura crua (12/09), 1ª passada
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Regras do modo: `cru/_como-funciona.md`. Só O QUE PRECISA ACONTECER e O QUE
 * DECIDE O CAMINHO. Sem quem executa, sem tela, sem API, sem semáforo.
 *
 * 🔒 ESCOPO: ME optante do Simples, Anexos III e V, com ou sem Fator R. Ver
 * `_escopo.mjs`. FORA DO ESCOPO: comércio, regulamentadas, lucro presumido.
 *
 * ── 🔑 TRÊS COISAS QUE ESTA CATEGORIA TEM E A LISTA DE 8 NÃO DIZ ───────────
 *
 * 1. **NÃO É SÓ O DAS.** O teardown de 09/09 achou duas guias fora do radar:
 *    a TFE (taxa municipal de BH, anual, vencimento próprio) e o DARF do INSS
 *    do pró-labore. São três calendários diferentes, e o P2 só conhece um.
 *
 * 2. **A APURAÇÃO TEM ESTADO, e o líder já modelou em 10 status:** Calculando ·
 *    Pendente · Prorrogada · Postergada · Pagamento agendado · Verificando
 *    pagamento · Paga · Paga via parcelamento · Vencida · Recalculando.
 *    🔑 Isso responde o P6.15, que estava 🔴 dizendo "o estado que essa decisão
 *    precisa ler não existe". Existe — do lado deles.
 *
 * 3. **AS QUATRO BORDAS DE NOTAS CAEM AQUI INTEIRAS** (virada de ano · perto do
 *    teto · virada de faixa ou anexo · primeiro e último mês). Não são detalhe:
 *    são a VIGÍLIA, que é o diferencial nº 2 do produto.
 *
 * 🔄 BACKFILL 13/09: o teardown do PGDAS-D da conta real caiu depois desta
 *    varredura e mexeu em dois nós — `I6` (a ordem da conta: arredonda por
 *    TRIBUTO, não no total) e `I30` (a composição são 6 linhas, não uma
 *    alíquota). Corrige de quebra a conclusão de 09/09 que dizia que o centavo
 *    "não era arredondamento".
 *
 * ⚠️ 1ª PASSADA. Escrita para o Pedro lapidar, não para ser obedecida.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const CATEGORIA = {
  id: "impostos",
  nome: "Impostos",
  emoji: "🏛",
  itens: ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"],
};

export const NOS = [
  // ── A · A APURAÇÃO, a espinha ────────────────────────────────────────────
  {
    entrada: true,
    id: "I1",
    o: "A competência fecha e é hora de apurar",
    saidas: [{ se: "", vai: "I2" }],
    nota: "🔑 A competência de uma nota é a data em que ela foi EMITIDA, não o mês do serviço (travado em 12/09, visto na nota real). Então o que entra aqui é tudo que foi faturado no mês, independente de quando o serviço aconteceu.",
  },
  {
    id: "I2",
    o: "Reúne o que a competência tem",
    variavel: "Teve faturamento nesta competência?",
    saidas: [
      { se: "teve receita", vai: "I4" },
      { se: "nenhuma nota emitida no mês", vai: "I3" },
    ],
    saiPara: "notas · a receita vem de lá, pela competência de cada nota",
  },
  {
    id: "I3",
    o: "Mês sem faturamento: apura zero, e a obrigação não pausa",
    saidas: [{ se: "", vai: "I6" }],
    nota: "🔴 Declarar zero é obrigação, não cortesia: quem não declara paga multa mesmo sem ter faturado. E o app precisa dizer isso ANTES, porque a pessoa sem receita é justamente a que acha que não tem nada a fazer.",
  },
  {
    id: "I4",
    o: "Soma a receita da competência e desconta o que reduz a base",
    saidas: [{ se: "", vai: "I5" }],
    saiPara: "notas · o desconto incondicionado de cada nota reduz a base de cálculo",
    nota: "🆕 12/09 — o desconto incondicionado entrou no mapa de Notas justamente porque termina aqui: ele abate da base, e a guia é calculada sobre a base, não sobre o valor bruto.",
  },
  {
    id: "I5",
    o: "Resolve qual anexo vale nesta competência",
    variavel: "O Fator R dos últimos 12 meses fechou em quanto?",
    saidas: [
      { se: "28% ou mais: tributa pelo Anexo III", vai: "I6" },
      { se: "abaixo de 28%: tributa pelo Anexo V", vai: "I6" },
      { se: "não há mês anterior: faturou no mês em que abriu", vai: "I5b" },
    ],
    saiPara: "pró-labore · a folha dos 12 meses é o numerador, e só entra o que foi efetivamente pago",
    nota: "🔑 É a decisão mais cara da categoria: Anexo III começa em 6% e Anexo V em 15,5%. E o anexo apurado aqui é o mesmo que cada nota congela no campo `anexoEscolhido` — confirmado em produção em 12/09. ⚠️ O limiar de 28% é seco, sem margem legal: 27,99% é Anexo V.",
  },
  {
    id: "I5b",
    o: "Faturou no mês em que abriu: tributa pelo Anexo V e a casa liga",
    saidas: [{ se: "", vai: "I6" }],
    saiPara: "pró-labore · a folha desta competência é o que salva a competência SEGUINTE",
    nota: "🆕 NASCEU EM 16/09. Até 15/09 o motor GRITAVA aqui, porque não podia escolher entre 6% e 15,5% sem informação. O contador deu a informação: *'para reduzir de 15,5 para 6 naquele faturamento do mês 8, eu teria que ter uma folha no mês 7. O mês 7 a empresa não existia. Então ali ela vai ser tributada normal, nos 15,5'*. 🔒 O Pedro travou: a competência da constituição fica em 15,5%, sem promessa de reverter. ⚠️ NÃO É 'V POR PRECAUÇÃO', que continua proibido — é a regra: quem não tem competência anterior não tem como exibir folha, e sem folha no numerador o resultado é o Anexo V. 🔴 O QUE AINDA DÁ PRA SALVAR é o mês SEGUINTE, e é por isso que este nó dispara ALERTA INTERNO, não tela: a casa liga e oferece gerar a folha desta competência. 🔑 E ISSO NÃO É RETROATIVO — cabe no prazo normal do eSocial, até o dia 15 do mês seguinte, sem retificação, juros ou multa. Por isso o alerta tem que disparar na EMISSÃO DA NOTA, não no fechamento do mês: é a emissão que abre a janela de 15 dias. ⚠️ Raro por construção: prestador de serviço cumpre 30 dias de competência antes de emitir, e o contador disse que *'dificilmente eu pegaria um cara que faturava no mesmo mês'*. Sobre R$12.000 a diferença é R$1.860 contra R$720.",
  },
  {
    id: "I6",
    o: "Calcula o imposto da competência",
    saidas: [{ se: "", vai: "I7" }],
    nota: "🔴 O motor de cálculo NÃO EXISTE — é o buraco declarado na nota da funcionalidade. E ele precisa saber: receita do mês, RBT12, anexo, alíquota efetiva, a parcela de ISS e a repartição do DAS. 🔑 A ORDEM DA CONTA É REGRA, não detalhe de implementação (13/09, recibo do PGDAS-D da conta real): base → reparte nos 6 tributos → **arredonda CADA parcela** → soma. Quem faz `receita × alíquota` e arredonda no fim erra centavo em toda guia: 7.910 × 6% dá 474,60, e a Receita cobra 474,59 (IRPJ 18,98 + CSLL 16,61 + COFINS 60,84 + PIS 13,19 + CPP 205,98 + ISS 158,99). Guia diferente do PGDAS-D é divergência com a Receita, e o cliente descobre pela Receita, não por nós. ⚠️ Empresa com menos de 12 meses tem RBT12 proporcionalizado, e essa regra nunca foi escrita (pergunta aberta com o Mauro desde 12/09). ✅ A metade da FOLHA dessa pergunta já fechou em 13/09: empresa com menos de 13 meses anualiza a folha junto com a receita (Res. CGSN 140/2018 art. 26 §4º) — ver `L4b` em pró-labore. Falta só a metade da RECEITA.",
  },
  {
    id: "I7",
    o: "A guia existe, mas ainda não está disponível",
    saidas: [{ se: "", vai: "I8" }],
    nota: "🔑 ESTADO PRÓPRIO, copiado do líder: a guia é criada ANTES de poder ser paga. Ele mostra o botão de pagar desabilitado com a frase 'Disponível até o dia 15'. Sem esse estado, a pessoa acha que a casa esqueceu dela.",
  },
  {
    id: "I8",
    o: "A guia fica disponível, com valor, vencimento e código de barras",
    saidas: [{ se: "", vai: "I9" }],
    cobre: ["2.1", "2.2"],
    ja: "P2.1",
    nota: "⚠️ TRÊS DATAS DIFERENTES, e o líder mistura as três na mesma palavra: quando a guia fica DISPONÍVEL (dias 15-16), quando ela VENCE (18-21), e a janela genérica que a tela dele chama de 'entre 15 e 20'. O nosso desenho tem que separar disponibilização de vencimento — é a confusão nº 1 da categoria.",
  },

  // ── B · O PAGAMENTO, E DESCOBRIR SOZINHO ─────────────────────────────────
  {
    id: "I9",
    o: "A pessoa paga a guia fora do app",
    variavel: "O que ela faz agora?",
    saidas: [
      { se: "paga e avisa que pagou", vai: "I10" },
      { se: "paga e não avisa nada", vai: "I11" },
      { se: "não paga", vai: "I11" },
    ],
    ja: "P2.2",
    nota: "🔴 A CASA NÃO INTERMEDIA O PAGAMENTO — travado em 27/07. Quem recebe é o governo, e a gente nem vê o dinheiro. Por isso 'a pessoa disse que pagou' e 'a casa sabe que foi pago' são duas coisas diferentes, e a segunda é o diferencial nº 1.",
  },
  {
    id: "I10",
    o: "Marca como quitada na palavra da pessoa, e segue conferindo por baixo",
    saidas: [{ se: "", vai: "I11" }],
    nota: "Um toque, sem formulário e sem anexo. ⚠️ Mas a marcação é provisória: quem confirma é a consulta do I12, e o desenho precisa aguentar a divergência entre o que a pessoa disse e o que o órgão diz.",
  },
  {
    id: "I11",
    o: "Espera o vencimento passar",
    variavel: "Já passou o vencimento?",
    saidas: [
      { se: "ainda não", vai: "I11" },
      { se: "passou", vai: "I12" },
    ],
    ja: "P2.3",
    nota: "🔑 A data é conhecida desde a emissão, porque a guia sai sempre no mesmo dia com o mesmo prazo. Não precisa vigiar em tempo real: precisa acordar UMA vez, no dia certo.",
  },
  {
    id: "I12",
    o: "Consulta a arrecadação e descobre sozinha",
    variavel: "O órgão diz que foi paga?",
    saidas: [
      { se: "foi paga", vai: "I13" },
      { se: "não foi paga", vai: "I14" },
      { se: "a consulta não respondeu", vai: "I12" },
    ],
    cobre: ["2.4"],
    ja: "P2.4",
    nota: "🔴 É O MAIOR BURACO DA CATEGORIA, E NÃO É TÉCNICO — É DECISÃO. A nota da funcionalidade diz com todas as letras: 'não é descoberta, é decisão: ou a gente consulta arrecadação com atraso, ou possui o trilho'. O líder resolveu tendo banco próprio; a casa travou em 09/09 que NÃO seremos uma financeira. Então sobra a consulta com atraso — e o atraso precisa ser aceitável.",
  },
  {
    id: "I13",
    o: "Guia quitada: a competência fecha com a data real do pagamento",
    fim: true,
    cobre: ["2.3"],
    ja: "P2.6",
    saiPara: "estar em dia · é isto que sustenta o 'você está em dia'",
  },
  {
    id: "I14",
    o: "Venceu sem pagar: o valor de hoje não é mais o da guia",
    variavel: "A pessoa quer a guia refeita?",
    saidas: [
      { se: "quer, com multa e juros já calculados", vai: "I15" },
      { se: "não agora", vai: "I16" },
    ],
    cobre: ["2.6"],
    ja: "P2.7",
    saiPara: "plano e cobrança · refazer guia é serviço avulso, e abaixo de R$ 50 entra na fatura",
  },
  {
    id: "I15",
    o: "Refaz a guia com o valor atualizado",
    saidas: [{ se: "", vai: "I11" }],
    nota: "Volta a esperar o vencimento novo. 🔑 O ciclo pode repetir, e o desenho precisa aguentar a segunda e a terceira rodada sem virar labirinto.",
  },
  {
    id: "I16",
    o: "A guia segue vencida, e a dívida cresce todo dia",
    fim: true,
    saiPara: "estar em dia · guia vencida derruba a prova de regularidade e aparece na vigília",
    nota: "⚠️ Aqui mora uma decisão de POSICIONAMENTO que a casa já travou: não vender pânico. O líder faz dunning por medo, e isso está na lista do que a gente NÃO faz.",
  },

  // ── C · AS OUTRAS GUIAS, que o P2 não conhece ────────────────────────────
  {
    entrada: true,
    id: "I17",
    o: "Chega o prazo de uma taxa municipal",
    saidas: [{ se: "", vai: "I18" }],
    nota: "🔴 ACHADO DE 09/09 QUE NÃO ESTAVA NO RADAR: a TFE — Taxa de Fiscalização de Estabelecimentos — é municipal de BH, aparece na mesma lista das guias federais no líder, e tem vencimento próprio (visto: competência abril, vencimento 11/05, R$ 168,48). 🟡 Regra, base de cálculo e periodicidade em BH NÃO estão mapeadas.",
  },
  {
    id: "I18",
    o: "A guia da taxa entra na mesma lista das outras",
    fim: true,
    cobre: ["2.1", "2.3"],
    nota: "🔑 Decisão de desenho: uma lista só. Separar 'imposto' de 'taxa' é vocabulário de contador; pra quem paga, é tudo conta com data.",
  },
  {
    entrada: true,
    id: "I19",
    o: "Chega a guia do INSS do pró-labore",
    saidas: [{ se: "", vai: "I18" }],
    saiPara: "pró-labore · a guia nasce lá, na declaração do mês, e aparece aqui",
    nota: "⚠️ A guia do INSS não é apurada aqui: ela vem do pró-labore declarado. Mas chega na mesma lista e no mesmo lugar, e a pessoa não distingue. 🕓 E tem um achado esquisito esperando ratificação: o `DARF_UNIFICADO_ATIVACAO_FATOR_R` de R$ 11,00, que seria um pró-labore simbólico de R$ 100 no primeiro mês só pra abrir a contagem do Fator R. Observado em produção, nunca ratificado, e fica abaixo do mínimo do INSS.",
  },

  // ── D · A VIGÍLIA, e as quatro bordas ────────────────────────────────────
  {
    entrada: true,
    id: "I20",
    o: "Acompanha o acumulado da empresa, mês a mês",
    variavel: "O acumulado encosta em alguma borda?",
    saidas: [
      { se: "está longe de tudo", vai: "I21" },
      { se: "o Fator R está perto de virar a faixa", vai: "I22" },
      { se: "o faturamento está perto do teto do Simples", vai: "I23" },
      { se: "a virada de ano muda o acumulado", vai: "I24" },
    ],
    cobre: ["2.5"],
    nota: "🔑 É O DIFERENCIAL Nº 2 e a razão de a categoria existir além da guia: avisar ANTES. O líder tem o cálculo e não tem o alerta. ⚠️ As quatro bordas vieram da varredura de Notas: elas são onde o deslocamento da competência deixa de ser neutro e passa a mudar o valor do imposto.",
  },
  { id: "I21", o: "Nada a avisar neste mês", fim: true },
  {
    id: "I22",
    o: "Avisa que o Anexo pode virar, e quanto falta pra evitar",
    fim: true,
    cobre: ["2.5"],
    saiPara: "pró-labore · o que resolve é aumentar a folha, e a decisão mora lá",
    nota: "🔑 Aviso sem o número que resolve é susto. Tem que dizer quanto falta de folha, não que 'o Fator R está caindo'.",
  },
  {
    id: "I23",
    o: "Avisa que o teto está perto, e o que acontece se estourar",
    fim: true,
    saiPara: "estar em dia · a vigília do teto mora lá · plano e cobrança · estourar muda o enquadramento e o preço",
    nota: "⚠️ Estourar o teto não é multa, é mudança de regime — e o efeito é retroativo em parte dos casos. Dizer 'você estourou' depois não serve pra nada.",
  },
  {
    id: "I24",
    o: "A virada de ano mexe no acumulado e na declaração",
    fim: true,
    saiPara: "estar em dia · a declaração anual é obrigação com data própria",
    nota: "🔴 É a borda mais silenciosa: serviço de dezembro faturado em janeiro joga receita pro exercício seguinte, mexe no RBT12 e na declaração anual. Ninguém percebe no mês, só no fechamento.",
  },

  // ── E · A RECEITA MUDOU DEPOIS DE APURADA ────────────────────────────────
  {
    entrada: true,
    id: "I25",
    o: "A receita de uma competência já apurada mudou",
    variavel: "A guia daquela competência está em que pé?",
    saidas: [
      { se: "ainda não foi apurada", vai: "I6" },
      { se: "foi apurada mas não foi paga", vai: "I26" },
      { se: "já foi paga", vai: "I27" },
    ],
    nota: "🔴 CHEGA DE NOTAS, pelo único caminho do produto que anda PRA TRÁS: nota cancelada, substituída ou importada tarde. 🔑 Esta decisão é a que o P6.15 procurava e não achava — e a resposta é que o estado da competência precisa existir do NOSSO lado. O líder modela em 10 status; a casa não modela nenhum.",
  },
  {
    id: "I26",
    o: "Refaz a apuração antes de a guia virar dinheiro",
    saidas: [{ se: "", vai: "I7" }],
    nota: "🔑 É a janela barata, e o desenho anterior não a distinguia: entre o fecho contábil e a disponibilização da guia dá pra recalcular sem retificar nada.",
  },
  {
    id: "I27",
    o: "Retifica a declaração de uma competência já paga",
    fim: true,
    saiPara: "plano e cobrança · retificação pode ser serviço avulso · estar em dia · a declaração retificada entra no histórico",
    nota: "🔴 QUATRO PERGUNTAS ABERTAS, e nenhuma é de tela. (1) o PGDAS-D aceita retificação por API ou é trabalho humano no e-CAC? (2) se o imposto foi pago a maior, vira crédito ou pedido de restituição, e quem conduz? (3) é serviço avulso ou entra no plano? (4) quem assina, já que é responsabilidade técnica do contador e a Carta do CFC encosta aqui.",
  },

  // ── F · O QUE A PESSOA VEM VER ───────────────────────────────────────────
  {
    entrada: true,
    id: "I28",
    o: "A pessoa abre para entender quanto vai pagar",
    variavel: "O que ela quer saber?",
    saidas: [
      { se: "quanto é a guia deste mês", vai: "I29" },
      { se: "por que a alíquota é essa", vai: "I30" },
      { se: "o que já foi pago", vai: "I31" },
      { se: "quanto vai pagar no mês que vem", vai: "I32" },
    ],
    cobre: ["2.1", "2.3", "2.5", "2.7"],
  },
  { id: "I29", o: "Mostra a guia do mês com valor, vencimento e o que fazer", fim: true, cobre: ["2.1", "2.2"] },
  {
    id: "I30",
    o: "Abre a composição da alíquota: anexo, ISS e Fator R",
    fim: true,
    cobre: ["2.5"],
    nota: "🔑 É o que separa a casa do líder: ele mostra o número, a gente mostra a conta. E a conta são SEIS LINHAS, não uma alíquota (13/09): IRPJ · CSLL · COFINS · PIS · CPP · ISS, cada uma já arredondada, somando o valor da guia. Mostrar só `6%` é o que obriga o cliente a ligar perguntando o centavo. ⚠️ E a parcela de ISS que aparece na nota NÃO é cobrança separada — é a fatia de ISS que já está dentro do DAS. Confirmado três vezes no teardown.",
  },
  { id: "I31", o: "Mostra o histórico do que já foi pago", fim: true, cobre: ["2.3"] },
  {
    id: "I32",
    o: "Simula o mês seguinte com o que ela imaginar faturar",
    fim: true,
    cobre: ["2.7"],
    nota: "🔑 Mesma engine da apuração rodando com notas hipotéticas — sem dependência de terceiro, é trabalho nosso. ⚠️ E é a resposta à pergunta que a pessoa realmente faz, que nunca é 'qual minha alíquota' e sim 'se eu fechar esse contrato, quanto sobra'.",
  },

  // ── G · O QUE A CASA DECIDIU NÃO FAZER ───────────────────────────────────
  {
    entrada: true,
    id: "I33",
    o: "A pessoa pede para o app pagar por ela",
    variavel: "Dá pra fazer isso?",
    saidas: [
      { se: "pagar a guia dentro do app: não fazemos", vai: "I34" },
      { se: "débito automático: benefício de plano, não existe ainda", vai: "I35" },
    ],
    cobre: ["2.8"],
    nota: "⚠️ Este nó existe para o caminho recusado ficar VISÍVEL. 'Pagar o DAS pelo app' foi decidido NÃO fazer em 27/07, e some da lista de 58; o débito automático sobrevive como benefício de plano e exige mandato bancário.",
  },
  {
    id: "I34",
    o: "Explica por que a casa não paga a guia, e o que ela faz no lugar",
    fim: true,
    nota: "🔑 Recusar sem explicar é o que a gente critica no líder. A resposta honesta é: a gente não toca no seu dinheiro, mas descobre sozinha que você pagou — que é o 2.4.",
  },
  {
    id: "I35",
    o: "Débito automático: registra o interesse e diz que ainda não existe",
    fim: true,
    cobre: ["2.8"],
    saiPara: "plano e cobrança · exige mandato bancário, e é o mesmo problema da cobrança recorrente",
  },
];
