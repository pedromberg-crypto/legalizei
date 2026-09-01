/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ESPELHO da config fiscal do motor.
 *
 * ⚠️ ESTE ARQUIVO NÃO É A FONTE DA VERDADE.
 * A fonte é `execucao/motor-testes/flow-schema.js` (const FISCAL), que por sua
 * vez é aterrado em `pesquisa/fiscal-simples-bh-2026.md` (bloco CONSOLIDADO).
 * Aqui é só o que a UI precisa pra renderizar a farol N18.
 *
 * 🔴 DÍVIDA CONHECIDA E DECLARADA: dois lugares com a mesma lógica fiscal
 * divergem, é questão de tempo. Isso é aceito AGORA porque:
 *   (a) a N18 é farol e precisa calcular pra existir;
 *   (b) o cálculo real vai vir do backend do dev, e aí este arquivo some.
 * Se este comentário ainda estiver aqui quando o backend existir, é bug.
 *
 * Hoje já aprendemos, na marra, o que custa spec e código divergirem: a
 * auditoria de 16/07 achou 5 itens ✅ na spec que nunca viraram código, e um
 * deles (UX-39) fazia o motor dar o conselho oposto ao que a spec mandava.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const FISCAL = {
  SALARIO_MIN: 1621, // pró-labore mínimo (2026)
  TETO_INSS: 8475.55,
  INSS_ALIQ: 0.11, // INSS do sócio sobre pró-labore (direto)
  IRRF_ISENCAO: 5000, // isenção efetiva/mês (Lei 15.270/2025)
  FATOR_R_LIMIAR: 0.28, // a LEI: >=28% → Anexo III
  FATOR_R_MARGEM: 0.3, // UX-39: o ALVO recomendado tem colchão. Nunca cravar 28%.
  ANEXO_III: 0.06,
  ANEXO_V: 0.155,
  /** 🟢 MEI — teto de faturamento (LC 123 art.18-A): R$81.000/ano ÷ 12.
   *  🔴 O QUE FALTA: a lista de CNAEs elegíveis pro MEI é PRÓPRIA (mais
   *  restrita que "atende Simples ME") e ainda não está no vault — fila
   *  Larissa. `elegivelParaMei()` (gate-telas.tsx) hoje só checa sócio+faixa,
   *  NÃO filtra por atividade. Não travar como fato até isso ser ratificado.
   */
  MEI_TETO_MENSAL: 6750,
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O QUE CUSTA ABRIR — os números da "conta da abertura" (N7 · UX-33).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ Cada linha carrega o próprio grau de confiança, e a UI PRECISA respeitar
 * isso. Misturar número ratificado com placeholder na mesma tela, sem marcar,
 * é exatamente o pecado anti-guru que o vault proíbe.
 */
export const CUSTOS = {
  /**
   * 🟢 VALOR REAL, visto na guia emitida no processo de verdade (01/09):
   * **R$281,08** (JUCEMG R$281,08 + CNE R$0,00 — print 125), confirmado pelo
   * PDF do DAE (print 127). Repasse ao Estado: não é margem nossa e não é
   * reembolsável.
   *
   * 🔄 Substitui os R$268,51 ratificados em 19/07 na tabela de preços da
   * JUCEMG. Os dois números provavelmente não se contradizem: a tela de
   * conferência (print 124) cobra **2 atos** — Contrato ×1 **e** Enquadramento
   * de ME ×1 (evento 315) — e a diferença de R$12,57 bate com um 2º ato
   * pequeno. Ou seja: a tabela dava o preço do contrato, e toda constituição
   * nossa paga contrato + enquadramento. 🟡 A decomposição é hipótese (não
   * conferi linha a linha na tabela vigente); o TOTAL é fato observado.
   */
  DAE_JUCEMG: 281.08,
  /** 🟢 Preço real ME (fase de lançamento), decisão 20/08 (`marca/decisoes-marca.md`):
   *  R$79/mês nos 3 primeiros meses, depois R$139/mês — este valor é o
   *  ESTÁVEL pós-promoção. Substituiu o placeholder de benchmark (R$195,
   *  Contabilizei) usado até 26/08. */
  MENSALIDADE: 139,
  /** 🟢 Decisão D1 (14/07): não se cobra o trabalho de abrir. A receita é a
   *  mensalidade. "Grátis" = honorário zero, NUNCA "governo zero". */
  HONORARIO_ABERTURA: 0,
  /** 🔴 FAKE — referência de mercado, NÃO decisão de preço nossa. Fonte:
   *  `pesquisa/concorrentes/contabilizei/pricing-snapshots/2026-07-30-tabela-real-faixas.md`
   *  (tela real de cliente, confiança alta): plano Avançado (nosso benchmark
   *  direto) cobra R$39,00 por funcionário, LINEAR (39×N). O nº de
   *  colaboradores inclusos no plano (aqui 0) é placeholder — decisão de
   *  negócio do Mauro, não travada. 03/08.
   */
  CUSTO_FUNCIONARIO: 39,
  COLABORADORES_INCLUSOS: 0,
  /** 🔴 FAKE — ponto de partida do Pedro (04/08), não preço validado (mesma
   *  disciplina do MENSALIDADE genérico). Plano MEI é LIMITADO (emitir NF +
   *  gerenciar 1 colaborador, o teto legal do MEI) — não é o plano ME
   *  completo com preço menor, é escopo menor mesmo.
   */
  MENSALIDADE_MEI: 49,
  /** 🟢 Decisão 27/08 (`marca/decisoes-marca.md`): MESMA régua pros dois
   *  regimes. Contada da EMISSÃO DO CNPJ, igual à Contabilizei (cláusula
   *  2.1-b do contrato deles).
   *
   *  🔴 28/08 — A JUSTIFICATIVA DESTA FIDELIDADE MUDOU NO MEI, e a nova ainda
   *  não existe. Até aqui a contrapartida declarada era "o certificado digital
   *  vem incluso, pago por nós" (ADR 04/08). O Pedro decidiu em 28/08 que **o
   *  plano MEI NÃO inclui certificado** — quem quiser um, providencia. Isso
   *  deixa a fidelidade de 12 meses do MEI **sem contrapartida escrita**.
   *  O número segue valendo (não foi revogado), mas precisa de justificativa
   *  nova antes de virar cláusula de contrato. Decisão do Pedro/Mauro.
   */
  FIDELIDADE_MESES: 12,
  /** 🟢 Decisão 27/08 — mesma régua da Contabilizei (cláusula 7.1-b: "30%
   *  sobre as parcelas que ainda estiverem por vencer"), pros dois regimes.
   *  Multa é sobre o SALDO restante da fidelidade, não sobre o total pago. */
  MULTA_CANCELAMENTO_PCT: 0.3,
  /** 🔴 FAKE — valor de referência (`plano-padrao-195-referencia.md`, custo do
   *  líder), não preço nosso fechado. Cobrança RECORRENTE mensal (não é taxa
   *  única): quem escolhe endereço fiscal paga isso TODO mês, somado à
   *  mensalidade do plano. Aprovação AUTOMÁTICA (decisão 27/08) — diferente
   *  da Contabilizei, que sujeita a aprovação manual. */
  ENDERECO_FISCAL: 60,
  /**
   * 🟢 FECHADO (Pedro, 30/08) — R$209/ano. Antes ficava `null` de propósito
   * (regra anti-guru: o ADR de 30/07 só citava "~R$200" dentro de uma
   * SIMULAÇÃO de custo, sem fonte fechada com a certificadora parceira).
   * Preço confirmado pelo Pedro, entra em tela como valor real agora.
   *
   * 28/08: o certificado digital deixou de vir incluso no plano MEI. Ele
   * continua sendo o que destrava a operação otimizada (a gente puxar guia,
   * mexer no FGTS Digital e agir por procuração sem pedir senha do cliente a
   * cada vez), mas o custo passa a ser do cliente.
   */
  CERTIFICADO_PRECO: 209,
} as const;

/**
 * Ponto médio de cada faixa, usado quando a pessoa não deu o valor exato.
 *
 * 🔄 01/09 — reescrito junto com o redesenho das faixas (`FAIXAS` em
 * `gate-telas.tsx`), que passou a terminar no teto real do ME (R$30 mil/mês).
 * ⚠️ As CHAVES precisam bater com os ids de `FAIXAS`: uma chave órfã aqui não
 * quebra build nem teste, só devolve `undefined` e faz o cálculo de pró-labore
 * sair errado em silêncio. Mexeu numa lista, confere a outra.
 */
export const FAIXA_MEDIA: Record<string, number> = {
  // 🔄 01/09 — "Não sei ainda" (era "Até R$ 5 mil"): sem estimativa, o valor
  // é ZERO de propósito. `proLaboreOtimo` tem piso no salário mínimo, então o
  // resultado vira o mínimo legal em vez de um número inventado a partir de um
  // chute que a pessoa disse não ter.
  "nao-sei": 0,
  "5-10k": 7500,
  "10-20k": 15000,
  "20-30k": 25000,
};

/** Pró-labore ótimo mira a MARGEM (30%), não o limiar (28%) — UX-39. */
export function proLaboreOtimo(fat: number): number {
  return Math.round(Math.max(FISCAL.SALARIO_MIN, FISCAL.FATOR_R_MARGEM * fat));
}

/** Entre 28% e 30% = tecnicamente Anexo III, mas um mês ruim derruba no ano inteiro. */
export function naBorda(folhaPct: number): boolean {
  return folhaPct >= FISCAL.FATOR_R_LIMIAR && folhaPct < FISCAL.FATOR_R_MARGEM;
}

/**
 * Custo do pró-labore CONSUMINDO o CLT declarado (UX-24: "as duas telas não
 * podem ser ilhas"). Sócio com CLT >= teto zera o INSS; com CLT parcial,
 * recolhe só sobre a folga.
 */
export function custoProLabore(proLabore: number, cltRemun = 0) {
  const folga = Math.max(0, FISCAL.TETO_INSS - cltRemun);
  if (folga <= 0) return { inss: 0, nota: "INSS zero (seu CLT já bate o teto)" };
  const base = Math.min(proLabore, folga);
  const inss = Math.round(base * FISCAL.INSS_ALIQ);
  const parcial = folga < FISCAL.TETO_INSS;
  return {
    inss,
    nota: parcial
      ? `11% sobre a folga de ${brl(folga)}, já descontado o seu CLT`
      : "11% do que você se paga",
  };
}

/**
 * Sem centavos por padrão: o número grande do N5/N18 é estimativa, e centavo em
 * estimativa finge uma precisão que não existe.
 *
 * `centavos: true` só onde o valor é EXATO e o cliente vai conferir contra a
 * guia — a taxa da JUCEMG no N7. Ali arredondar seria mentir sobre um repasse
 * de governo, que é justamente o número que precisa bater até o último dígito.
 */
export function brl(v: number, centavos = false): string {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: centavos ? 2 : 0,
    maximumFractionDigits: centavos ? 2 : 0,
  });
}
