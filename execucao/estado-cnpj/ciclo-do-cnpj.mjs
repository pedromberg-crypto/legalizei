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
    automatico: "🔴 NÃO RESOLVIDO — não há API nossa para isso hoje",
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
    automatico: "🔴 NÃO RESOLVIDO — sem API nossa",
    seNaoFizer: "Impede a transmissão do PGDAS-D das competências seguintes.",
    nota: "⚠️ Extinta a partir de 2027, absorvida pelo PGDAS-D (ver VENCIMENTOS).",
  },
  {
    id: "A2",
    nome: "Fechar o Informe de Rendimentos de cada sócio",
    vence: "defis",
    dono: DONO.CASA,
    precisaDe: ["pró-labore pago no ano, por sócio", "lucro distribuído, por sócio", "IRRF retido"],
    motor: "darfDaFolha() acumulado no ano",
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
