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

/* ─── Checkbox de aceite — promovido ao DS (K4, 21/07) ─────────────────────
   Antes cada tela de aceite tinha o seu: o N8 usava `<input>` nativo (accent
   coral), o N20 um botão custom com check verde. São telas-IRMÃS (as duas de
   aceite do flow) e o usuário vê as duas — dois padrões pro mesmo gesto é
   incoerência de DS. Um só, usado nos dois.

   Visual custom + input nativo escondido (`sr-only`) = semântica de verdade
   (teclado, leitor de tela) com controle de estilo. A caixa inteira é o alvo
   (o <label> embrulha tudo). Marcado = fill de AÇÃO (coral-600), não estado-
   sucesso: aceitar é um ATO, não um "deu certo" — verde é token de estado, e
   gastá-lo aqui enfraqueceria o verde onde ele importa (CNPJ ativo). */
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-surface-card p-3">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-action-primary bg-action-primary"
            : "border-border-strong bg-surface-card"
        }`}
        aria-hidden
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5 9.5 18 20 6"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-caption text-text-secondary">{children}</span>
      {/* Input real, invisível: dá a semântica e o toggle por teclado. */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
