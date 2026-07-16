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

export function brl(v: number): string {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
