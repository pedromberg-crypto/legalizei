/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗓️ O CICLO DO CNPJ — tudo que a casa deve fazer, quando, e com que dado.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 15/09, e é a pergunta que organiza tudo o mais:
 *
 *   *"Quero entender se no dia 1 da pessoa com o CNPJ aberto, a nossa vigia
 *   fiscal, o motor do imposto, os cálculos, as guias, os avisos, TUDO que
 *   interfira no que é nossa funcionalidade, são entregues da forma correta,
 *   nas datas corretas, consultando os dados corretos… se eu vou conseguir
 *   emitir a DAS dela e o INSS nos prazos corretos, o que preciso consultar
 *   para isso, se teremos folga para calcular, o que disso é automático."*
 *
 * ── 🔴 O QUE ESTE ARQUIVO É ────────────────────────────────────────────────
 *
 * A lista **fechada** das obrigações do nosso cliente travado — ME no Simples,
 * Anexo III ou V, serviço, BH, 1 a 4 sócios, **sem colaborador** — com, para
 * cada uma: o prazo, o que precisa ser consultado, **quanto tempo de folga
 * existe**, e quem faz.
 *
 * 🔑 **É fechada de propósito.** O pedido do Pedro no mesmo dia foi *"parar de
 * colocar dado, cálculo, guia e qualquer outra coisa onde o nosso cliente
 * travado não encaixa"*. Obrigação que não está aqui **não existe** para este
 * cliente, e quem quiser acrescentar precisa dizer de onde ela vem.
 *
 * ⚠️ **O que ele NÃO é:** não é o board de processos (`_doutrina-processos`),
 * que descreve caminhos e telas. Aqui é só **calendário e dependência de
 * dado** — a régua para responder "dá pra entregar no prazo?".
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VENCIMENTOS } from "../motor-fiscal/_tabelas.mjs";

/** Quem executa. A fronteira já estava travada em 12/09 (handoff do dev). */
export const DONO = {
  CASA: "🏢 a casa faz, o cliente não vê",
  CLIENTE: "👤 só o cliente pode fazer",
  MISTO: "🤝 a casa prepara, o cliente confirma",
};

/**
 * 🔴 CÁLCULO E CANAL SÃO COISAS DIFERENTES — e eu tinha juntado as duas.
 *
 * A 1ª versão deste arquivo marcava o M1 como *"automático: sim"* porque o
 * motor apura o PGDAS-D. Mas o nome da obrigação é *"apurar **e transmitir**"*,
 * e transmitir não é conta: é canal. Ao mesmo tempo eu marcava o M4 como
 * não resolvido **pelo canal**. Duas obrigações com o mesmo tipo de
 * dependência, dois vereditos diferentes — inconsistência minha, achada em
 * 15/09 quando o Pedro perguntou o que era a DEFIS.
 *
 * Agora toda obrigação declara as **duas** pernas. Quem responde pelo cálculo
 * é o motor; quem responde pelo canal é integração, e é trabalho do time de
 * desenvolvimento.
 */
export const CANAL = {
  ESOCIAL: {
    id: "esocial-ws",
    nome: "Web Service oficial do eSocial",
    como: "SOAP/XML assinado digitalmente, transmitido em LOTES",
    custo: "gratuito",
    doc: "https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais",
    estado: "🟢 existe e é nosso trabalho",
    // 🔴 Travado pelo Pedro em 15/09: *"a parte da complexidade será para os
    // nossos desenvolvedores e eles tiram isso de letra"*. O que falta é
    // implementação, não descoberta — e por isso não conta como buraco.
  },
  INTEGRA_CONTADOR: {
    id: "integra-contador",
    nome: "API Integra Contador (SERPRO)",
    como: "REST, por requisição paga; plataforma do próprio governo",
    custo: "pago por requisição · 🟡 R$3,20 a R$4,96 por CNPJ/mês",
    // ⚠️ O valor vem de software houses já integradas, NÃO do SERPRO. A
    // tabela oficial só aparece depois de contratar na Loja. Sobre um plano de
    // R$139 é ~3% da receita do cliente — entra no custo unitário, não é zero.
    custoConfianca: "🟡 terceiros, não oficial",
    modulos: ["Integra-SN", "Integra-DCTFWeb", "Integra-Sicalc", "Integra-Sitfis", "Integra-Pagamento"],
    // 🔑 Autenticação: mTLS + certificado ICP-Brasil (A1/A3) + Consumer
    // Key/Secret. O vínculo com o cliente sai por e-CNPJ dele OU pelo nosso
    // com **procuração eletrônica e-CAC** ativa — que é o nosso caso.
    autenticacao: "mTLS + ICP-Brasil + procuração e-CAC do cliente",
    estado: "🟢 existe e é nosso trabalho",
    // Travado pelo Pedro em 15/09: *"acabei de identificar que é uma
    // plataforma do governo que vende as requisições pelas APIs deles, e aí
    // então está tudo certo"*.
  },
  A_CONFERIR: {
    id: "a-conferir",
    nome: "canal ainda não confirmado",
    estado: "🟡 provável, não verificado",
  },
};

/**
 * 🔑 A FOLGA — o que o Pedro chamou de *"tempo de folga para calcular da
 * forma correta"*.
 *
 * A competência fecha no último dia do mês. Da virada até o vencimento é a
 * janela em que a casa tem que apurar, conferir e emitir. Ela é **curta e
 * desigual**, e a ordem importa mais que o tamanho:
 *
 *   dia 15 · eSocial/DCTFWeb ...... 15 dias de folga  ← o PRIMEIRO prazo
 *   dia 20 · DARF (INSS + IRRF) ... 20 dias
 *   dia 20 · DAS + PGDAS-D ........ 20 dias
 *
 * 🔴 **O eSocial vence ANTES do DAS, e isso decide o desenho do produto:** o
 * pró-labore precisa estar resolvido até o dia 15, não até o dia 20. Quem
 * desenhar a tela do pró-labore mirando o vencimento do DAS entrega 5 dias
 * atrasado, todo mês.
 */
export const FOLGA = {
  esocial: { dias: 15, ordem: 1 },
  darf: { dias: 20, ordem: 2 },
  das: { dias: 20, ordem: 3 },
};

/**
 * As obrigações MENSAIS. Toda competência, sem exceção.
 *
 * 🔴 `seNaoFizer` não é dramatização: é o que a lei cobra, e é o que justifica
 * a obrigação existir na lista.
 */
export const MENSAIS = [
  {
    id: "M1",
    nome: "Apurar a competência e transmitir o PGDAS-D",
    vence: "das",
    dono: DONO.CASA,
    precisaDe: [
      "receita da competência (das notas emitidas)",
      "RBT12 pela regra dos meses de atividade",
      "anexo vigente (fixo pelo CNAE, ou pelo Fator R)",
      "receita com ISS retido, se houver",
    ],
    motor: "rbt12De() · anexoDoCnae() · fatorRDeCompetencias() · apurarDAS()",
    canal: CANAL.INTEGRA_CONTADOR,
    automatico: "sim",
    seNaoFizer:
      "Multa mínima de R$200 por competência não transmitida (IN RFB 2.005/2021 art. 14 §3º I).",
    // 🔴 Visto em produção na conta real: maio/2026 teve receita ZERO e o
    // PGDAS foi transmitido igual. Mês sem faturar não pausa a obrigação.
    valeEmMesZerado: true,
  },
  {
    id: "M2",
    nome: "Emitir a guia do DAS e avisar o vencimento",
    vence: "das",
    dono: DONO.MISTO,
    precisaDe: ["o resultado do M1", "calendário com feriados nacionais"],
    motor: "apurarDAS() · vencimentoDe({tributo:'das'})",
    canal: CANAL.INTEGRA_CONTADOR,
    automatico: "sim (a emissão) · o pagamento é do cliente",
    seNaoFizer: "Multa de 0,33%/dia até 20% + juros Selic + 1% no mês do pagamento.",
    valeEmMesZerado: false, // sem receita, sem guia
  },
  {
    id: "M3",
    nome: "Decidir o pró-labore da competência",
    vence: "esocial",
    dono: DONO.CASA,
    precisaDe: [
      "receita já emitida no mês",
      "folha efetivamente PAGA nos 11 meses anteriores",
      "grupo do CNAE (só os 15 dinâmicos precisam de conta)",
    ],
    motor: "pilotar() — e devolve `atua:false` nos 65 CNAEs III-fixo",
    canal: null, // decisão interna: não sai da casa
    automatico: "sim, e o cliente pode sobrepor com alerta (avaliarProLaboreEscolhido)",
    seNaoFizer:
      "Nada imediato — mas a folha errada derruba o Anexo III 12 meses à frente, e o Fator R é retrovisor.",
    valeEmMesZerado: true, // pró-labore em mês sem receita EMPURRA o Fator R pra cima
    soDinamico: false,
  },
  {
    id: "M4",
    nome: "Transmitir o eSocial e a DCTFWeb do pró-labore",
    vence: "esocial",
    dono: DONO.CASA,
    precisaDe: ["o valor do M3", "quantos sócios recebem", "CPF de cada sócio"],
    motor: "— (é envio, não cálculo; fora do motor)",
    canal: CANAL.ESOCIAL,
    canalSecundario: CANAL.INTEGRA_CONTADOR, // módulo Integra-DCTFWeb
    automatico: "sim — canal existe, falta implementar (15/09, Pedro)",
    /**
     * 🔑 SÃO DOIS ENVIOS, E A ORDEM IMPORTA (pesquisa de 15/09).
     *
     * O eSocial e a DCTFWeb são desacoplados em protocolo (SOAP × REST) e
     * acoplados em negócio: a DCTFWeb **se preenche sozinha** quando o
     * fechamento (S-1299) chega pela fila do eSocial. Mas ainda é preciso
     * **transmitir** a DCTFWeb depois, para concluir a confissão de dívida.
     *
     * Eventos obrigatórios de uma ME sem empregados, com sócio recebendo
     * pró-labore (leiaute S-1.3):
     */
    eventosEsocial: [
      { id: "S-1000", o_que: "Tabela do empregador", quando: "uma vez" },
      { id: "S-1010", o_que: "Tabela de rubricas", quando: "uma vez" },
      { id: "S-2300", o_que: "Trabalhador sem vínculo — o sócio, categoria 721/722", quando: "na entrada do sócio" },
      { id: "S-1200", o_que: "Remuneração da competência", quando: "mensal" },
      // 🔴 O S-1210 é o evento do PAGAMENTO, e é ele que sustenta o regime
      // de CAIXA do Fator R. Não prova que o dinheiro saiu, mas é o registro
      // fiscal do que declaramos como pago — mexe com o limite PP1.
      { id: "S-1210", o_que: "Pagamento — sustenta o regime de caixa", quando: "mensal" },
      { id: "S-1299", o_que: "Fechamento dos periódicos", quando: "mensal" },
    ],
    // ⚠️ NÃO existe evento ANUAL para sócio (não há 13º nem férias).
    eventoAnual: null,
    /**
     * 🔑 SEM MOVIMENTO: manda S-1299 com a flag **só no primeiro mês** sem
     * fato gerador. A obrigação de repetir todo janeiro **foi extinta**.
     * Importa para as nossas vidas com meses zerados — quase todas têm.
     */
    semMovimento: "S-1299 com a flag, só no 1º mês; não se repete em janeiro",
    seNaoFizer: "Multa mínima de R$200 (IN RFB 2.005/2021 art. 14 §3º I).",
    valeEmMesZerado: true,
  },
  {
    id: "M5",
    nome: "Emitir o DARF do INSS e do IRRF do pró-labore",
    vence: "darf",
    dono: DONO.MISTO,
    precisaDe: [
      "o valor do M3, SÓCIO A SÓCIO",
      "CLT de cada sócio por fora, se houver",
    ],
    motor: "darfDaFolha({socios}) — nunca darfDoProLabore(soma)",
    canal: CANAL.INTEGRA_CONTADOR,
    automatico: "sim (a emissão) · o pagamento é do cliente",
    seNaoFizer: "Mesma multa e juros do DAS, e o não pagamento derruba o Fator R (caixa).",
    valeEmMesZerado: false,
  },
  {
    id: "M6",
    nome: "Vigiar o Fator R e o acumulado",
    vence: "esocial",
    dono: DONO.CASA,
    precisaDe: ["a janela de 12 meses de receita e folha paga", "o RBT12 corrente"],
    motor: "fatorRDeCompetencias() · projetarComPiloto() · aliquotaEfetiva()",
    canal: null, // vigia interna
    automatico: "sim",
    seNaoFizer:
      "O cliente descobre a virada de anexo na guia, com 12 meses de atraso para corrigir.",
    valeEmMesZerado: true,
    soDinamico: true,
    // 🔴 Nos 65 CNAEs III-fixo esta vigia NÃO EXISTE, e a tela não pode
    // sugerir que existe — falar em 28% para quem é fixo mente por omissão.
  },
  {
    id: "M7",
    nome: "Conferir se a guia do mês anterior foi paga, e recalcular se venceu",
    vence: "das",
    dono: DONO.CASA,
    precisaDe: ["a baixa do pagamento", "a Selic acumulada do período"],
    motor: "guiaVencida() — o atraso é derivado da data da baixa",
    canal: CANAL.INTEGRA_CONTADOR, // consulta de arrecadação
    automatico: "parcial — a Selic é dado externo (Ato Declaratório mensal da RFB)",
    seNaoFizer: "A dívida cresce todo dia e o cliente não sabe.",
    valeEmMesZerado: false,
  },
];

/**
 * As obrigações ANUAIS e de virada de ano.
 *
 * 🔑 A virada não é só "mais um mês": ela muda o RBT12 (que pode passar de
 * média×12 para soma), fecha o informe do sócio e abre a janela da DEFIS.
 */
export const ANUAIS = [
  {
    id: "A1",
    nome: "Transmitir a DEFIS do ano anterior",
    vence: "defis", // 31/03
    dono: DONO.CASA,
    precisaDe: ["as 12 competências fechadas", "lucro distribuído no ano", "nº de empregados (zero, no nosso caso)"],
    motor: "— (é declaração, não cálculo)",
    canal: CANAL.INTEGRA_CONTADOR, // módulo Integra-SN (pesquisa de 15/09)
    automatico: "sim — canal confirmado, endpoints só após contratar",
    // 🔑 CORRIGIDO em 15/09 pela pesquisa: **não há multa** pela DEFIS em
    // atraso. O que há é pior de administrar: trava o PGDAS-D.
    seNaoFizer:
      "Não há multa. Mas as apurações do PGDAS-D **a partir de março do ano " +
      "seguinte ficam BLOQUEADAS** — Manual do PGDAS-D e DEFIS 2018 v4, literal.",
    /**
     * 🔴 A DEFIS MORRE EM 01/01/2027 — Resolução CGSN nº 190, de 04/08/2026.
     *
     * *"As informações deverão ser prestadas uma vez por ano, entre janeiro e
     * março, dentro do próprio sistema. Com isso, a Declaração de Informações
     * Socioeconômicas e Fiscais (Defis) deixa de ser uma obrigação separada."*
     *
     * ⚠️ **A janela de convivência não está definida em fonte oficial.** O
     * ano-calendário 2026, entregue em março/2027, fica no limbo: a praxe diz
     * formato antigo, mas não há regra transitória expressa. A pesquisa marcou
     * isso como 🟡 e nós não vamos fingir que sabemos.
     *
     * 🔑 Para o código: implementar o formato atual E deixar a bifurcação
     * pronta para anexar os campos anuais ao payload do PGDAS-D de 2027.
     */
    morreEm: { data: "2027-01-01", norma: "Res. CGSN 190/2026", vai_para: "PGDAS-D" },
    campos: [
      "ganhos de capital",
      "total de despesas",
      "lucro contábil apurado (se mantiver escrituração)",
      "saldo em caixa/banco no início e no fim do período",
      "número de empregados no início e no fim (zero, no nosso caso)",
      "rendimentos ISENTOS pagos aos sócios",
      "rendimentos TRIBUTÁVEIS pagos aos sócios",
    ],
    // 🔑 Livro Caixa BASTA — salvo se distribuir lucro acima da presunção,
    // e aí a escrituração completa vira obrigatória. Amarra com o item 30.
    exigeEscrituracaoCompleta: "só se distribuir lucro acima do limite de presunção",
  },
  {
    id: "A2",
    nome: "Fechar o Informe de Rendimentos de cada sócio",
    vence: "defis",
    dono: DONO.CASA,
    precisaDe: ["pró-labore pago no ano, por sócio", "lucro distribuído, por sócio", "IRRF retido"],
    motor: "darfDaFolha() acumulado no ano",
    canal: null, // documento que a casa gera pro sócio
    automatico: "parcial — o lucro é DECLARADO pelo cliente, não inferido",
    seNaoFizer: "O sócio não consegue declarar o IRPF dele.",
  },
  {
    id: "A3",
    nome: "Virar o ano no RBT12 e reavaliar o enquadramento",
    vence: "das", // acontece na 1ª competência do ano
    dono: DONO.CASA,
    precisaDe: ["a série inteira de receita"],
    motor: "rbt12De() — a regra muda sozinha no 13º mês de atividade",
    canal: null,
    automatico: "sim",
    seNaoFizer: "RBT12 errado = faixa errada = alíquota errada em todo o ano.",
  },
];

/**
 * 🔴 O QUE ESTÁ FORA, e é decisão — não esquecimento.
 *
 * Cada linha aqui é uma obrigação que existe no mundo e **não existe para o
 * nosso cliente travado**. Ter a lista explícita é o que permite dizer "isso
 * não é nosso" sem repensar do zero toda vez.
 */
export const FORA_DO_CICLO = [
  { o_que: "Folha de colaborador (eSocial de empregado, FGTS, 13º, férias)", porque: "🔒 travado fora por decisão do Pedro em 15/09 — nenhuma persona tem colaborador" },
  { o_que: "DASN-SIMEI", porque: "é do MEI, e MEI está fora do escopo do motor" },
  { o_que: "Obrigações de ICMS, CFOP, NCM, SEFAZ, DANFE", porque: "FORA DO ESCOPO — comércio, não serviço" },
  { o_que: "ECD/ECF, Lucro Presumido/Real", porque: "FORA DO ESCOPO — outro regime" },
  { o_que: "Substituição tributária e retenção de ISS como conta do cliente", porque: "assunto encerrado, ver `_encerrados.mjs` E-ISS" },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * A CONTA DA FOLGA — e quem fecha o mês pra valer
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Devolve o calendário de uma competência: cada obrigação com o prazo real,
 * a folga em dias, e a ordem em que precisam acontecer.
 *
 * 🔑 Ele ordena por VENCIMENTO, não por importância. É assim que o mês é
 * vivido, e é assim que um atraso aparece.
 */
export function calendarioDaCompetencia({ ano, mes, dinamico = true, vencimentoDe }) {
  const itens = MENSAIS.filter((o) => !(o.soDinamico && !dinamico)).map((o) => {
    const v = vencimentoDe({ competencia: { ano, mes }, tributo: o.vence });
    return {
      ...o,
      vencimento: v.data,
      deslocou: v.deslocou,
      folgaEmDias: FOLGA[o.vence]?.dias ?? null,
    };
  });

  return itens.sort((a, b) => a.vencimento - b.vencimento);
}

/**
 * 🔴 O placar honesto: quanto do ciclo a casa resolve sozinha hoje.
 *
 * Conta `automatico` que começa com "sim". "parcial" e "NÃO RESOLVIDO" não
 * contam — e é de propósito: meia automação contada como automação inteira é
 * como o produto promete o que não entrega.
 */
export function placarDeAutomacao() {
  const todas = [...MENSAIS, ...ANUAIS];
  const automaticas = todas.filter((o) => o.automatico.startsWith("sim"));
  const parciais = todas.filter((o) => o.automatico.startsWith("parcial"));
  const naoResolvidas = todas.filter((o) => o.automatico.includes("NÃO RESOLVIDO"));

  return {
    total: todas.length,
    automaticas: automaticas.map((o) => o.id),
    parciais: parciais.map((o) => o.id),
    naoResolvidas: naoResolvidas.map((o) => o.id),
  };
}

export { VENCIMENTOS };

/* ═══════════════════════════════════════════════════════════════════════════
 * 7 · 🚪 O GATE DE ENTRADA — quem PODE ser nosso cliente
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔴 ISTO NÃO EXISTIA, e é o buraco que a pergunta do Pedro sobre "sócio em
 * outra empresa" revelou em 15/09.
 *
 * Tínhamos a triagem de impedimento do **MEI** inteira e **nada** para o ME.
 * Dava para vender um plano, abrir a empresa na Junta e a opção pelo Simples
 * ser **indeferida depois** — e aí a empresa nasce no **Lucro Presumido**, que
 * para uma ME de serviço é economicamente fatal.
 *
 * ── 🔑 O ACHADO QUE DECIDE O DESENHO ───────────────────────────────────────
 *
 * **Não existe API de consulta prévia por CPF.** A pesquisa de 15/09 declarou
 * isso como ausência normativa: nenhum serviço do governo permite testar, antes
 * de o CNPJ existir, se aquele CPF tem impeditivo. O REDESIM/SERPRO recusa
 * avaliação preditiva fora da posse do CNPJ.
 *
 * Consequência dura: **o gate é 100% autodeclaração.** Não dá para conferir.
 * O que dá é perguntar bem, registrar a resposta e deixar a responsabilidade
 * clara — mesma doutrina da Carta de Responsabilidade do lucro.
 *
 * ⚠️ Isto é **dado**, não tela. Quem constrói a pergunta é o flow de entrada.
 */
export const GATE_DE_ENTRADA = {
  fonte: "LC 123/2006 art. 3º §4º · Res. CGSN 140/2018 art. 115 §2º IV · Lei 8.112/90 art. 117 X",
  literal: "pesquisa/fontes/2026-09-15-elegibilidade-simples-LITERAL.md",
  consultaPrevia: null, // 🔴 não existe, e a pesquisa declarou a ausência

  /**
   * Dos 12 incisos do art. 3º §4º, **8 não alcançam o nosso perfil** — a
   * modelagem já os neutraliza (sócio PJ, sede no exterior, cooperativa,
   * banco, cisão, S.A., filial no exterior, participar de outra PJ).
   * Sobram estes 4, e o último é o que mais dói.
   */
  vedacoes: [
    {
      id: "V1",
      inciso: "III",
      o_que: "sócio participa de OUTRA empresa optante pelo Simples",
      // 🔑 Aqui o percentual NÃO importa: 0,1% já engatilha a soma.
      gatilho: "receita bruta global das duas > R$4.800.000/ano",
      risco: "alto",
      pergunta: "Você já é dono ou sócio de alguma outra empresa hoje?",
    },
    {
      id: "V2",
      inciso: "IV",
      o_que: "sócio participa de empresa FORA do Simples",
      // ⚠️ Aqui o percentual importa: só acima de 10%.
      gatilho: "participação > 10% E receita global > R$4.800.000/ano",
      risco: "alto",
      pergunta: "Você tem mais de 10% de alguma empresa do Lucro Presumido ou Real?",
    },
    {
      id: "V3",
      inciso: "V",
      o_que: "sócio é ADMINISTRADOR de outra empresa com fins lucrativos, mesmo sem ser sócio dela",
      gatilho: "receita global > R$4.800.000/ano",
      risco: "alto",
      pergunta: "Você é diretor ou administrador registrado em outra empresa, mesmo sem ser dono?",
    },
    {
      id: "V4",
      inciso: "XI",
      o_que: "pejotização — pessoalidade, subordinação e habitualidade com o contratante, CUMULATIVAMENTE",
      gatilho: "os três ao mesmo tempo, com o mesmo contratante",
      // 🔴 RISCO CRÍTICO, e é o nosso perfil exato: TI, design, consultoria são
      // justamente as atividades que atraem fiscalização de vínculo disfarçado.
      // ⚠️ E é o único que a autodeclaração pega mal: depende da sinceridade.
      risco: "CRÍTICO",
      pergunta:
        "Você vai prestar o serviço cumprindo horário e recebendo ordens do seu cliente, como um funcionário de carteira assinada?",
    },
  ],

  /** Impedimentos que não vêm do art. 3º §4º, e mesmo assim travam. */
  outros: [
    {
      id: "O1",
      o_que: "MEI ativo no CPF",
      // Não impede ABRIR a ME — obriga a baixar ou desenquadrar o MEI antes,
      // sob pena de exclusão de ofício.
      efeito: "obriga baixa/desenquadramento do MEI",
      norma: "Res. CGSN 140/2018 art. 115 §2º IV",
      pergunta: "Você tem um MEI aberto no seu nome?",
    },
    {
      id: "O2",
      o_que: "servidor público ativo",
      // 🔑 Não impede ser SÓCIO. Impede ADMINISTRAR — o que muda a
      // qualificação 49 × 22 e quem assina pela empresa.
      efeito: "pode ser quotista, NÃO pode ser administrador",
      norma: "Lei 8.112/90 art. 117 X · Estatuto de BH (Lei 7.169/96)",
      pergunta: "Algum sócio é servidor público ativo?",
    },
  ],

  /**
   * ✅ E o que NÃO é vedação, declarado expressamente pela pesquisa — porque
   * confirmar uma ausência vale tanto quanto achar uma regra.
   */
  naoSaoVedacao: [
    {
      o_que: "sócio com emprego CLT",
      // Confirma a nossa leitura de 15/09: o CLT toca só o teto do INSS, que é
      // da PESSOA. Não impede nada no Simples.
      porque:
        "a pesquisa varreu LC 123 arts. 3º, 15, 17, 30 e 31 e a Res. CGSN 140/2018 e declarou 'total inexistência de comando jurídico' que impeça",
    },
    { o_que: "sócio aposentado", porque: "sem restrição fiscal" },
    { o_que: "estrangeiro residente no Brasil", porque: "sem restrição fiscal" },
  ],

  /** O que acontece quando passa batido — e por que o gate importa. */
  seFalhar: {
    quando: "pendência cadastral trava na hora; estouro de faturamento global só aparece meses depois",
    consequencia: "exclusão RETROATIVA, e a empresa cai no Lucro Presumido",
    socioNovo: "sócio que entra carregando vedação exclui a empresa a partir do MÊS SEGUINTE",
  },
};

/**
 * 🔑 O QUE A PESQUISA CONFIRMOU SOBRE O NOSSO MOTOR (e não muda nada nele):
 *
 * · Sócio que **entra** no meio do ano recebe pró-labore a partir do mês da
 *   formalização, e isso afeta o Fator R **já naquela competência**.
 * · Sócio que **sai** não apaga nada: o pró-labore que ele recebeu **continua**
 *   no Fator R por até 12 meses depois do pagamento. A folha histórica não
 *   muda.
 *
 * Os dois batem com o desenho do `_modelo.mjs`, onde a série é histórica e
 * imutável. Fecha o item **B3** do `_cobertura-das-vidas` sem mexer em código.
 */
