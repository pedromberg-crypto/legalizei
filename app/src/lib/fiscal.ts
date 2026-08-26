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
  /** 🟢 RATIFICADO 19/07 em fonte primária. O "~R$288" que a gente repetia
   *  desde 09/07 estava errado — era o número mais citado e menos verificado
   *  do projeto. Repasse ao Estado: não é margem nossa e não é reembolsável. */
  DAE_JUCEMG: 268.51,
  /** 🔴 FAKE. Placeholder de benchmark (plano Padrão da Contabilizei), NÃO o
   *  nosso preço. Travado como deferido até haver custo unitário real (DB+API).
   *  Não reabrir sem o Pedro puxar. Aparece na tela com marca de provisório. */
  MENSALIDADE: 195,
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
  MENSALIDADE_MEI: 49.9,
  /** 🔴 FAKE — mesma origem do MENSALIDADE_MEI. Certificado digital incluso
   *  (pago por nós) é a contrapartida da fidelidade: precisamos do
   *  certificado pra fazer movimentações em nome do cliente (emitir NF,
   *  etc.), então o custo do certificado é nosso, não repassado por fora.
   */
  FIDELIDADE_MEI_MESES: 12,
  /** 🔴 FAKE — valor de referência (`plano-padrao-195-referencia.md`, custo do
   *  líder), não preço nosso fechado. Cobrança RECORRENTE mensal (não é taxa
   *  única): quem escolhe endereço fiscal paga isso TODO mês, somado à
   *  mensalidade do plano. */
  ENDERECO_FISCAL: 60,
} as const;

export const FAIXA_MEDIA: Record<string, number> = {
  "ate 10k": 7000,
  "10-20k": 15000,
  "20-30k": 25000,
  "30k+": 40000,
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
