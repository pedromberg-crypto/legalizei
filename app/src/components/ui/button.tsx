import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button — promovido ao DS porque aparece nas 2 telas-farol (regra dos 3).
 *
 * ⚠️ As regras de AA aqui NÃO são estilo, são a decisão travada em 12/07
 * (marca/decisoes-marca.md): branco sobre coral-600 dá 4,04:1, o que passa AA
 * **somente em texto grande** (≥18,66px bold). Por isso:
 *   - `primary`  → texto ≥18,66px bold (text-lg font-bold) sobre coral-600 ✅
 *   - `primarySm`→ texto menor exige fill mais escuro: coral-700
 *   - hover      → SEMPRE escurece (coral-700). Nunca clareia pra coral-500.
 * Codificar isso aqui é o que impede a regra de depender de memória.
 *
 * Altura mínima 48px = alvo de toque confortável (UX-12: botão grande com
 * rótulo literal, universal pra todos — UX-48).
 */

/**
 * 🆕 05/09 (pedido do Pedro) — `travado`: o CTA CINZA.
 *
 * ⚠️ NÃO confundir com `primary` + `disabled`. São dois "não dá pra clicar"
 * com sentidos diferentes, e o app precisava dos dois:
 *   · **coral apagado** (`disabled`, opacity-40) = ESPERA CURTA, a ação volta.
 *     "Aguardando compensação", "Marcado pra hoje às 15:00" — o botão continua
 *     sendo aquela ação, só que ainda não.
 *   · **cinza** (`travado`) = TRANCADO até outra coisa acontecer, e não é esta
 *     tela que destranca. Mesmo tratamento do menu e do avatar da home dia-1,
 *     que estão trancados pelo mesmo motivo (`bg-surface-alt`/`text-text-muted`).
 * Coral apagado aqui leria como "quase lá, tenta de novo"; cinza lê como
 * "existe, e não é agora" — que é a verdade.
 */
type Variant =
  "primary" | "primarySm" | "dark" | "secondary" | "ghost" | "travado";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md transition-colors " +
  "disabled:cursor-not-allowed select-none";

/* A opacidade do desabilitado vale pras variantes COLORIDAS. O `travado` já
   nasce cinza: apagar de novo o deixaria quase invisível, e ele precisa ser
   lido — é ele que conta o que vem depois. */
const APAGA_DESABILITADO = "disabled:opacity-40";

const variants: Record<Variant, string> = {
  // texto grande + bold é REQUISITO de AA sobre coral-600
  primary:
    "bg-action-primary text-text-on-brand text-lg font-bold min-h-12 px-6 " +
    "hover:bg-action-primary-hover active:bg-action-primary-hover",
  // texto menor → fill escurece pra manter AA
  primarySm:
    "bg-action-primary-sm text-text-on-brand text-body font-semibold min-h-10 px-4 " +
    "hover:bg-action-primary-hover",
  // CTA escuro: "séria no motor"
  dark:
    "bg-action-dark text-text-on-dark text-lg font-bold min-h-12 px-6 " +
    "hover:opacity-90",
  secondary:
    "bg-transparent text-text-primary text-body font-semibold min-h-12 px-6 " +
    "border border-border-strong hover:bg-surface-alt",
  ghost:
    "bg-transparent text-text-secondary text-body font-medium min-h-10 px-3 " +
    "hover:text-text-primary underline underline-offset-4",
  /* Mesma altura e peso do `primary`: ele ocupa o lugar do CTA principal e
     precisa ter o tamanho de um, senão a tela perde a âncora do rodapé. Sem
     `hover`, porque não há o que responder. */
  travado:
    "bg-surface-alt text-text-muted text-lg font-bold min-h-12 px-6 cursor-not-allowed",
};

export function Button({
  variant = "primary",
  full = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${variant === "travado" ? "" : APAGA_DESABILITADO} ${
        variants[variant]
      } ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
