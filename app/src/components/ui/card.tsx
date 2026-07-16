import type { ReactNode } from "react";

/**
 * Card — promovido ao DS porque aparece nas 2 telas-farol (regra dos 3).
 *
 * ⚠️ SEM SOMBRA por padrão (design-system.md §1). O fundo da página é papel
 * quente (ink-50), não branco: card branco + hairline já separa, e é coerente
 * com a metáfora de papel que a paleta escolheu. Sombra só onde algo precisa
 * flutuar de verdade (sheet/modal) — e nenhuma das 2 farol precisa.
 *
 * `tint` usa coral-50 pra destaque suave. Note que ele NÃO é "cor de aviso":
 * coral nunca é erro (regra dura da paleta).
 */

interface Props {
  children: ReactNode;
  tint?: boolean;
  className?: string;
}

export function Card({ children, tint = false, className = "" }: Props) {
  return (
    <div
      className={
        `rounded-lg border border-border-hairline p-4 ` +
        `${tint ? "bg-surface-tint-brand" : "bg-surface-card"} ` +
        className
      }
    >
      {children}
    </div>
  );
}
