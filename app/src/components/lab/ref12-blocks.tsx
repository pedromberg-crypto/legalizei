"use client";

/**
 * COMPONENTES VALIDADOS DA ref12 (health/AI warm). Fonte única.
 * category-circles · promo-débito · conta + swipe-to-pay.
 */

const CIRCULOS = [
  { label: "Emitir", Icone: IconeNota, tint: "brand" },
  { label: "Pagar", Icone: IconeBanco, tint: "info" },
  { label: "Pró-labore", Icone: IconeCarteira, tint: "success" },
  { label: "Mais", Icone: IconeGrade, tint: "alt" },
];

const TINT: Record<string, string> = {
  brand: "bg-surface-tint-brand text-action-primary-sm",
  info: "bg-state-info-tint text-state-info-text",
  success: "bg-state-success-tint text-state-success-text",
  alt: "bg-surface-alt text-text-secondary",
};

/* ─── 1. Category circles ─────────────────────────────────────────────────── */
export function CategoryCircles() {
  return (
    <div className="flex justify-between">
      {CIRCULOS.map((c) => (
        <button key={c.label} className="flex flex-col items-center gap-2">
          <span className={`flex h-16 w-16 items-center justify-center rounded-full ${TINT[c.tint]}`}>
            <c.Icone />
          </span>
          <span className="text-micro font-medium text-text-secondary">{c.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── 2. Promo débito automático ──────────────────────────────────────────── */
export function PromoDebito() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <div className="min-w-0">
        <p className="text-body font-bold">Nunca mais esqueça o imposto</p>
        <p className="mt-0.5 text-caption text-text-on-dark/70">
          Ative o débito automático e a gente paga por você, no prazo.
        </p>
        <button className="mt-2 text-caption font-semibold text-action-primary">
          Ativar débito automático
        </button>
      </div>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-action-primary text-text-on-brand">
        <Raio />
      </span>
    </div>
  );
}

/* ─── 3. Conta do imposto (card do carrossel real — swipe-to-pay ABANDONADO,
   28/07: bate com impostos/page.tsx CardImposto — badge "Vence" + valor
   grande + Pagar sólido, sem breakdown itemizado nem gesto de arrastar) ──── */
export function ContaSwipe() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Seu imposto de junho</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
      </div>
      <div className="flex flex-col rounded-2xl border border-border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-caption text-text-secondary">Imposto do mês</p>
          <span className="shrink-0 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
            Vence 20/07
          </span>
        </div>
        <p className="mt-1 text-display font-bold text-text-primary">R$ 178,31</p>
        <p className="mt-1 text-micro text-text-tertiary">Faturou R$ 4.200 · 6% do Simples.</p>
        <button className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-action-primary text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover">
          Pagar
        </button>
      </div>
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function Raio() {
  return <svg {...ic()}><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>;
}
function IconeNota() {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeBanco() {
  return <svg {...ic()} width={18} height={18}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeCarteira() {
  return <svg {...ic()}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1.1" /></svg>;
}
function IconeGrade() {
  return <svg {...ic()}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></svg>;
}
