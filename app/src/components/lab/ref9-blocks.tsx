"use client";

/**
 * COMPONENTES VALIDADOS DA ref9 (wellness). Fonte única.
 * próximo-compromisso (featured dark) · quem-cuida-de-você (time + avatars).
 */

/* ─── 1. Próximo compromisso (cartão de saldo, aprovado 28/08) ─────────────
   Substitui o antigo "featured dark". Origem: `components/lab/validados.tsx`
   (asset "Cartão de saldo — DAS + Pagar", `CartaoSaldo`+`BotaoLaranja`),
   promovido pra produção aqui — cópia própria em Tailwind puro, sem o objeto
   `Paleta` do lab (esta tela é light-only). */
export function ProximoCompromisso() {
  return (
    <div>
      <Cabecalho titulo="Seu próximo compromisso" />
      {/* 🧪 28/08 (pedido do Pedro) — "só pra eu ver", preview em modo escuro.
         Fora do padrão light-only desta tela — não é decisão travada, só
         experimento visual pontual neste card. Brilho coral sutil no canto,
         igual à referência (radial-gradient com a cor de marca, baixa
         opacidade, sobre o fundo escuro do DS). */}
      <div
        className="rounded-[24px] border border-white/10 p-5"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-text-on-dark">
            <IconeCalendario />
            <span className="text-micro font-semibold text-text-on-dark">Vence 20/07</span>
          </span>
          <span className="text-caption font-bold text-text-on-dark/60">DAS</span>
        </div>
        <p className="mt-4 text-caption text-text-on-dark/60">DAS de junho</p>
        <p className="text-h1 font-bold leading-tight text-text-on-dark">R$ 178,31</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-micro text-text-on-dark/60">Status</p>
            <p className="text-caption font-semibold text-text-on-dark">Gerado</p>
          </div>
          <button className="rounded-xl bg-action-primary px-5 py-2.5 text-caption font-bold text-text-on-brand">
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

function IconeCalendario() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
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
