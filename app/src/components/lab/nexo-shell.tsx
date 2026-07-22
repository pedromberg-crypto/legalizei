"use client";

import type { ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NEXO-SHELL — casca de exploração (ref. nexobank, print do Pedro 22/07)
 * ═══════════════════════════════════════════════════════════════════════════
 * Linguagem do print: HEADER ESCURO full-bleed (logo + sino) + SHEET branco
 * arredondado por cima + título grande + card de dado em destaque + GRID de
 * ações (tiles ícone+label). É a base compartilhada das 3 versões da Início,
 * pra elas diferirem só no CORPO. Descartável: quando uma versão vencer, o
 * resto (e esta casca) saem.
 *
 * ⚠️ Regras da paleta seguem valendo: coral-500 (text-brand) SÓ na wordmark;
 * os tiles usam action (coral-700) como acento de AÇÃO. Header = surface-dark.
 * Full-bleed dentro do .app-page (padding-inline 24) via margin negativa; o
 * header sobe sob a status bar (margin-top = -safe-top) → nos mockups a tela
 * dessas versões usa statusClaro (relógio branco).
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Fonte única de mock das 3 versões (viria do motor + engine).
export const DADOS = {
  primeiroNome: "Ana",
  razao: "Ana Beatriz Ramos Desenvolvimento de Software",
  cnpj: "54.321.000/0001-09",
  foco: { titulo: "Seu imposto de junho", valor: "R$ 178,31", vence: "Vence dia 20" },
  faturamentoMes: "R$ 4.200",
  faturamento12m: "R$ 38.400 em 12 meses",
  tetoUsado: "11%",
  tetoLivre: "Faltam R$ 321.600 pro teto",
  impostoEstimado: "~R$ 252",
  aliquota: "6%",
};

export function NexoShell({
  titulo,
  children,
  headerExtra,
}: {
  titulo: string;
  children: ReactNode;
  headerExtra?: ReactNode;
}) {
  return (
    <div className="app-main">
      {/* ── HEADER ESCURO full-bleed (quebra o padding do .app-page) ──────── */}
      <div
        className="shrink-0 bg-surface-dark text-text-on-dark"
        style={{
          marginInline: -24,
          marginTop: "calc(-1 * var(--safe-top))",
          paddingTop: "calc(var(--safe-top) + 14px)",
          paddingBottom: 28,
          paddingInline: 24,
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-h2 font-bold">
            <span>Legaliz</span>
            <span className="text-brand">ai</span>
          </p>
          <Sino />
        </div>
        {headerExtra}
      </div>

      {/* ── SHEET branco: sobe por cima do header (radius + margem negativa) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="-mt-5 rounded-t-[28px] bg-surface-page px-1 pt-6"
          style={{ minHeight: "calc(100% + 20px)" }}
        >
          <h1 className="text-h1 mb-4">{titulo}</h1>
          <div className="flex flex-col gap-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Grid de ações (tiles do print) ──────────────────────────────────────── */

export type Acao = { label: string; Icone: () => ReactNode };

export function GridAcoes({ acoes }: { acoes: Acao[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {acoes.map(({ label, Icone }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-2 rounded-2xl bg-surface-alt px-3 py-5 text-center"
        >
          <span className="text-action-primary-sm">
            <Icone />
          </span>
          <span className="text-caption font-medium text-text-primary">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Card de dado em destaque (o "exchange rates" do print) ───────────────── */

export function CardDestaque({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      {children}
    </div>
  );
}

/* ─── Ícones ───────────────────────────────────────────────────────────────── */

function icon() {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function Sino() {
  return (
    <svg {...icon()}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconeEmitir() {
  return (
    <svg {...icon()}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M12 11.5v5M9.5 14h5" />
    </svg>
  );
}
export function IconeImposto() {
  return (
    <svg {...icon()}>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
      <path d="M3 20h18" />
    </svg>
  );
}
export function IconeProLabore() {
  return (
    <svg {...icon()}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.1" />
    </svg>
  );
}
export function IconeNotas() {
  return (
    <svg {...icon()}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h5" />
    </svg>
  );
}
export function IconeEmDia() {
  return (
    <svg {...icon()}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.9" />
    </svg>
  );
}
export function IconeDocs() {
  return (
    <svg {...icon()}>
      <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}
