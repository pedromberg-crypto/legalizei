"use client";

import { DADOS } from "@/components/lab/nexo-shell";
import { CategoryCircles, PromoDebito, ContaSwipe } from "@/components/lab/ref12-blocks";

/**
 * INÍCIO — REF. HEALTH/AI WARM. Composta pelos blocos validados (category
 * circles + promo + conta/swipe, em ref12-blocks) + AI hero search e o
 * "próximos compromissos" inline (ainda não validados).
 */
export default function InicioRef12() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          {/* Saudação (inline) */}
          <div className="flex items-center justify-between">
            <h1 className="text-h1 text-text-primary">Oi, {DADOS.primeiroNome}</h1>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
              AB
            </span>
          </div>

          {/* AI hero search (inline) */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border-hairline bg-surface-card p-2 pl-4">
            <span className="flex-1 text-caption text-text-muted">
              Pergunte qualquer coisa sobre seus impostos…
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-action-primary text-text-on-brand">
              <Estrela />
            </span>
          </div>

          {/* Category circles (validado) */}
          <div className="mt-5">
            <CategoryCircles />
          </div>

          {/* Próximos compromissos (inline, não validado) */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">Próximos compromissos</p>
              <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
            </div>
            <div className="flex gap-3">
              <button className="text-left">
                <div className="flex h-full w-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong p-4 text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                    <Mais />
                  </span>
                  <span className="text-micro font-semibold text-text-secondary">Novo lembrete</span>
                </div>
              </button>
              <div className="flex-1 rounded-2xl border border-border-hairline bg-surface-card p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                    <IconeBanco />
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption font-semibold text-text-primary">DAS de junho</p>
                    <p className="text-micro text-text-tertiary">Imposto do mês</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-state-warning-tint px-2.5 py-0.5 text-micro font-semibold text-state-warning-text">
                    Hoje
                  </span>
                  <span className="text-micro text-text-secondary">Vence 20/07</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo (validado) */}
          <div className="mt-6">
            <PromoDebito />
          </div>

          {/* Conta + swipe (validado) */}
          <div className="mt-6">
            <ContaSwipe />
          </div>
        </div>
      </div>
    </main>
  );
}

function Estrela() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l1.8 4.6L18 9l-3.6 2.7L15 16l-3-2.4L9 16l.6-4.3L6 9l4.2-1.4z" /></svg>;
}
function Mais() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>;
}
function IconeBanco() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
