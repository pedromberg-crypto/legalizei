/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUALIFICAÇÃO CIVIL — as listas que o dossiê pergunta e o recap relê.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 03/09 — estavam dentro de `wizard-dossie.tsx` como consts locais. O A1
 * (`/revisar`) passou a mostrar estado civil, regime de bens e tipo de imóvel
 * pra conferência, e precisa do MESMO rótulo que a pessoa viu ao responder.
 *
 * Não dá pra importar de `wizard-dossie` porque o ciclo já existe do outro
 * lado (`wizard-dossie` → `wizard-dinheiro` → `wizard-cauda`), então a saída é
 * a de sempre neste repo: dado que 2 telas leem vira fonte única em `lib/`.
 *
 * ⚠️ `separacao` é o nosso rótulo; a JUCEMG chama de "Separação Convencional
 * de Bens" e a tradução acontece no RPA, não aqui (ver PREENCHIDOS_INTERNAMENTE
 * em `produto/_flow/flow-data.mjs`). A lista tem 4 dos 5 regimes do Integrador
 * por decisão do Pedro em 01/09.
 */

export interface Opcao {
  v: string;
  label: string;
}

export const ESTADO_CIVIL: Opcao[] = [
  { v: "solteiro", label: "Solteiro(a)" },
  { v: "casado", label: "Casado(a)" },
  { v: "uniao", label: "União estável" },
  { v: "divorciado", label: "Divorciado(a)" },
  { v: "viuvo", label: "Viúvo(a)" },
];

export const REGIME_BENS: Opcao[] = [
  { v: "parcial", label: "Comunhão parcial de bens" },
  { v: "universal", label: "Comunhão universal de bens" },
  { v: "separacao", label: "Separação total de bens" },
  { v: "final", label: "Participação final nos aquestos" },
];

export const TIPO_IMOVEL: Opcao[] = [
  { v: "casa", label: "Casa" },
  { v: "apartamento", label: "Apartamento" },
  { v: "outro", label: "Outro" },
];

/**
 * Rótulo humano de um valor interno. Devolve string vazia quando não achou —
 * quem exibe decide o que fazer com o vazio (o recap esconde a linha).
 */
export function rotuloDe(lista: Opcao[], valor: string | undefined | null): string {
  if (!valor) return "";
  return lista.find((o) => o.v === valor)?.label ?? "";
}
