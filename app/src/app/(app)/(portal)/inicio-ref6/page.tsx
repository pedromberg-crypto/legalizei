"use client";

import { DADOS } from "@/components/lab/nexo-shell";
import { BarChart } from "@/components/lab/charts";
import { HeroDark, EmitirPra, MovimentacoesRecentes } from "@/components/lab/ref6-blocks";

/**
 * INÍCIO — REF. FINTECH PREMIUM (dark). Composta pelos blocos validados
 * (hero + emitir-pra + movimentações, em ref6-blocks) + os charts inline
 * (bar chart de faturamento e stacked 'pra onde vai', ainda não validados).
 */

const BARRAS = [2600, 3100, 2900, 3800, 3400, 4200, 2800, 3600, 3000, 3900, 3300, 4200];
const CATS = [
  { rotulo: "Imposto", valor: "R$ 252", pct: 6, cor: "var(--color-action-primary)" },
  { rotulo: "Pró-labore", valor: "R$ 1.621", pct: 39, cor: "var(--color-state-info)" },
  { rotulo: "Lucro", valor: "R$ 2.327", pct: 55, cor: "var(--color-state-success)" },
];

export default function InicioRef6() {
  return (
    <main className="app-main">
      {/* hero fixo full-bleed (validado) */}
      <HeroDark />

      {/* corpo rola */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pt-6 pb-4">
          <EmitirPra />
          <MovimentacoesRecentes />

          {/* Analytics: bar chart (inline, não validado) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">Faturamento</p>
              <span className="flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-micro font-semibold text-text-secondary">
                12 meses <Chevron />
              </span>
            </div>
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-baseline gap-2">
                <p className="text-h2 text-text-primary">{DADOS.faturamento12m.split(" ")[0]} mil</p>
                <p className="text-micro text-text-tertiary">no ano</p>
              </div>
              <div className="mt-2 text-action-primary-sm">
                <BarChart valores={BARRAS} media={3300} />
              </div>
              <div className="mt-1 flex justify-between text-micro text-text-tertiary">
                <span>Jan</span>
                <span>Média R$ 3,3 mil</span>
                <span>Dez</span>
              </div>
            </div>
          </div>

          {/* Pra onde vai (stacked bar + lista) — inline, não validado */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">Pra onde vai cada R$100</p>
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex h-3 w-full overflow-hidden rounded-full">
                {CATS.map((c) => (
                  <div key={c.rotulo} style={{ width: `${c.pct}%`, background: c.cor }} />
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {CATS.map((c) => (
                  <div key={c.rotulo} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.cor }} />
                      <span className="text-caption text-text-secondary">{c.rotulo}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-caption font-semibold text-text-primary">{c.valor}</span>
                      <span className="text-micro text-text-tertiary">{c.pct}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
