"use client";

import type { ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPOS BÁSICOS DE FORM — promovidos ao DS em 19/07 (regra dos 3).
 * ═══════════════════════════════════════════════════════════════════════════
 * Vieram de `dossie/campos.tsx` junto com o esqueleto (`ui/tela.tsx`): o N6
 * (criar conta) e o N9 (CPF + pagamento) precisam de rótulo + input, e vivem
 * no wizard, fora do dossiê.
 *
 * Só os DOIS básicos subiram. As seleções (`OpcoesLinha`, `OpcoesColuna`,
 * `Select`) continuam locais no dossiê: ainda não apareceram fora dele, e
 * promover por antecipação é a abstração especulativa que o design-system.md
 * §6 proíbe.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Rótulo literal em cima (universal UX-48), dica opcional, filho embaixo. */
export function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-text-primary">{rotulo}</p>
      {dica && <p className="text-micro text-text-tertiary mt-0.5">{dica}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/* ─── Entrada de texto ──────────────────────────────────────────────────────
   Erro INLINE (nunca modal), microcopy que ensina, não pune. */

export function Texto({
  valor,
  onChange,
  placeholder,
  erro,
  ok,
  inputMode,
  maxLength,
  type,
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  erro?: string;
  ok?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  type?: "text" | "email" | "password";
}) {
  return (
    <>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        type={type}
        className={`w-full min-h-12 rounded-md border bg-surface-card px-3 text-body text-text-primary
          placeholder:text-text-muted focus:outline-none
          ${
            erro
              ? "border-state-danger"
              : "border-border-hairline focus:border-border-focus"
          }`}
      />
      {erro && <p className="text-micro text-state-danger-text mt-1">{erro}</p>}
      {!erro && ok && (
        <p className="text-micro text-state-success-text mt-1">{ok}</p>
      )}
    </>
  );
}
