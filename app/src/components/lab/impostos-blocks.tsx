"use client";

/**
 * COMPONENTES VALIDADOS de IMPOSTOS. Fonte única.
 * guias-recentes (transações com chips de valor verde=pago / âmbar=a vencer).
 */

const GUIAS = [
  { comp: "Junho de 2026", estado: "a-vencer", valor: "R$ 178,31", quando: "Vence 20/07" },
  { comp: "Maio de 2026", estado: "pago", valor: "R$ 152,90", quando: "Pago em 18/06" },
  { comp: "Abril de 2026", estado: "pago", valor: "R$ 141,20", quando: "Pago em 20/05" },
  { comp: "Março de 2026", estado: "pago", valor: "R$ 138,60", quando: "Pago em 19/04" },
];

/* ─── Guias recentes (v1 · saldo + transações) ────────────────────────────── */
export function GuiasRecentes() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Guias recentes</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver todas</button>
      </div>
      <div className="flex flex-col gap-2">
        {GUIAS.map((g) => {
          const pago = g.estado === "pago";
          const tom = pago
            ? "bg-state-success-tint text-state-success-text"
            : "bg-state-warning-tint text-state-warning-text";
          return (
            <div
              key={g.comp}
              className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tom}`}>
                <Banco />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-text-primary">{g.comp}</p>
                <p className="mt-0.5 text-micro text-text-tertiary">{g.quando}</p>
              </div>
              <span className={`rounded-lg px-2.5 py-1 text-caption font-semibold ${tom}`}>
                {g.valor}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Banco() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
      <path d="M3 20h18" />
    </svg>
  );
}

/* ─── Suas guias (v2 · discover — lista com expandir) ─────────────────────── */
const GUIAS_LISTA = [
  { comp: "Junho de 2026", valor: "R$ 178,31", estado: "A vencer 20/07", pago: false },
  { comp: "Maio de 2026", valor: "R$ 152,90", estado: "Pago", pago: true },
  { comp: "Abril de 2026", valor: "R$ 141,20", estado: "Pago", pago: true },
  { comp: "Março de 2026", valor: "R$ 138,60", estado: "Pago", pago: true },
];

export function SuasGuias() {
  return (
    <div>
      <p className="mb-2 text-body-strong font-semibold text-text-primary">Suas guias</p>
      <div className="flex flex-col gap-2">
        {GUIAS_LISTA.map((g) => (
          <div
            key={g.comp}
            className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">{g.comp}</p>
              <p
                className={`mt-0.5 text-micro ${
                  g.pago ? "text-state-success-text" : "text-state-warning-text"
                }`}
              >
                {g.estado} · {g.valor}
              </p>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-hairline text-text-tertiary">
              <ChevronBaixo />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChevronBaixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
