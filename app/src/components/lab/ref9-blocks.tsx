"use client";

/**
 * COMPONENTES VALIDADOS DA ref9 (wellness). Fonte única.
 * próximo-compromisso (featured dark) · quem-cuida-de-você (time + avatars).
 */

/* ─── 1. Próximo compromisso (featured dark) ──────────────────────────────── */
export function ProximoCompromisso() {
  return (
    <div>
      <Cabecalho titulo="Seu próximo compromisso" />
      <div className="rounded-2xl bg-surface-dark p-5 text-text-on-dark">
        <p className="text-caption text-text-on-dark/70">Hoje · vence 20/07</p>
        <p className="mt-1 text-h2">DAS de junho</p>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-action-primary text-body font-bold text-text-on-brand">
              L
            </span>
            <div>
              <p className="text-caption font-semibold">R$ 178,31</p>
              <p className="text-micro text-text-on-dark/60">A gente já gerou pra você</p>
            </div>
          </div>
          <button className="rounded-xl bg-white px-4 py-2 text-caption font-semibold text-text-primary">
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Quem cuida de você (time + pilha de avatars) ─────────────────────── */
export function QuemCuida() {
  return (
    <div>
      <Cabecalho titulo="Quem cuida de você" />
      <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
        <p className="text-caption text-text-tertiary">Seu time</p>
        <p className="mt-0.5 text-body font-semibold text-text-primary">
          Contadores cuidando do seu CNPJ
        </p>
        <p className="mt-1 text-caption text-text-secondary">
          Impostos, declarações e prazos, por nossa conta. Você só aprova.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <PilhaAvatares />
          <button className="text-caption font-semibold text-action-primary-sm">
            Falar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── auxiliares ──────────────────────────────────────────────────────────── */
function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="text-body-strong font-semibold text-text-primary">{titulo}</p>
      <button className="text-caption font-semibold text-action-primary-sm">
        Ver tudo
      </button>
    </div>
  );
}

function PilhaAvatares() {
  const av = ["JS", "MF", "CL"];
  return (
    <div className="flex items-center">
      {av.map((a, i) => (
        <span
          key={a}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-card bg-surface-alt text-micro font-bold text-text-secondary"
          style={{ marginLeft: i === 0 ? 0 : -10 }}
        >
          {a}
        </span>
      ))}
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-card bg-surface-dark text-micro font-bold text-text-on-dark"
        style={{ marginLeft: -10 }}
      >
        +5
      </span>
    </div>
  );
}
