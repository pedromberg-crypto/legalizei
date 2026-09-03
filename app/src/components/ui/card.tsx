import type { ReactNode } from "react";

/**
 * Card — promovido ao DS porque aparece nas 2 telas-farol (regra dos 3).
 *
 * ⚠️ SEM SOMBRA por padrão (design-system.md §1). O fundo da página é papel
 * quente (ink-50), não branco: card branco + hairline já separa, e é coerente
 * com a metáfora de papel que a paleta escolheu. Sombra só onde algo precisa
 * flutuar de verdade (sheet/modal) — e nenhuma das 2 farol precisa.
 *
 * ─── `tom` (19/07) — era `tint: boolean` ──────────────────────────────────
 * Virou enum quando o N7 precisou de um terceiro fundo. Booleano só sabe
 * responder "coral ou branco", e a pergunta real é **que tipo de coisa este
 * card é**:
 *   · `neutro`  — branco. O padrão.
 *   · `marca`   — coral-50. Destaque suave. NÃO é cor de aviso: coral nunca é
 *                 erro (regra dura da paleta).
 *   · `sucesso` — verde. **Boa notícia sobre dinheiro**, não estado de
 *                 processo. Precedente: o N18 já usa `state-success-text` em
 *                 "sem imposto de renda nesse valor".
 *
 * ⚠️ Tradeoff assumido: o verde é token de ESTADO (nasceu pra estado do CNPJ).
 * Gastá-lo como destaque de venda cobra um preço — cada uso fora de estado
 * enfraquece o verde quando ele precisar dizer "deu certo". Aceito aqui porque
 * "abrir é grátis" é a única promessa financeira irrefutável do produto, e ela
 * estava lida como rodapé. Se um terceiro uso decorativo aparecer, revisar.
 */

type Tom = "neutro" | "marca" | "sucesso";

const FUNDO: Record<Tom, string> = {
  neutro: "bg-surface-card",
  marca: "bg-surface-tint-brand",
  sucesso: "bg-state-success-tint",
};

interface Props {
  children: ReactNode;
  tom?: Tom;
  className?: string;
  /** 🆕 03/09 (pedido do Pedro) — card inteiro clicável, não só um botão
   *  dentro dele. Presente = vira `<button>` (full width, texto à esquerda);
   *  ausente = `<div>` de sempre, sem mudar nenhum uso existente. */
  onClick?: () => void;
}

export function Card({ children, tom = "neutro", className = "", onClick }: Props) {
  const classe =
    `rounded-lg border border-border-hairline p-4 ` + `${FUNDO[tom]} ` + className;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full text-left ${classe}`}>
        {children}
      </button>
    );
  }

  return <div className={classe}>{children}</div>;
}
