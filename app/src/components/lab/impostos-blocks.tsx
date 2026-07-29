"use client";

import Link from "next/link";
import { StatusIcon } from "@/components/ui/status";

/**
 * COMPONENTES VALIDADOS de IMPOSTOS. Fonte única.
 * guias-recentes (transações com chips de valor verde=pago / âmbar=a vencer).
 * 28/07: GuiasRecentes e SuasGuias ATUALIZADOS pra bater com impostos/page.tsx
 * e impostos/guias/page.tsx (StatusIcon/ícone-tintado no lugar do chip
 * colorido, linha inteira vira Link, chevron-expandir abandonado).
 */

// Só histórico PAGO — o a-vencer vive no carrossel acima, na página real.
const GUIAS = [
  { comp: "Maio de 2026", valor: "R$ 152,90", quando: "Pago em 18/06" },
  { comp: "Abril de 2026", valor: "R$ 141,20", quando: "Pago em 20/05" },
  { comp: "Março de 2026", valor: "R$ 138,60", quando: "Pago em 19/04" },
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
        {GUIAS.map((g) => (
          <Link
            key={g.comp}
            href="/impostos/pagar"
            className="flex items-start gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4 transition-colors hover:border-border-strong active:bg-surface-alt"
          >
            <span className="mt-0.5">
              <StatusIcon estado="feito" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-caption font-semibold text-text-primary">{g.comp}</p>
                <p className="text-caption text-text-secondary">{g.valor}</p>
              </div>
              <p className="mt-0.5 text-micro text-text-tertiary">{g.quando}</p>
            </div>
          </Link>
        ))}
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

/* ─── Suas guias (v2 · discover) — bate com impostos/guias/page.tsx: sem
   chevron-expandir (abandonado), ícone tintado por estado + linha vira Link. */
type EstadoGuia = "a-vencer" | "paga";
const ST_TINT: Record<EstadoGuia, string> = {
  "a-vencer": "bg-state-warning-tint text-state-warning-text",
  paga: "bg-state-success-tint text-state-success-text",
};
const ST_COR: Record<EstadoGuia, string> = {
  "a-vencer": "text-state-warning-text",
  paga: "text-state-success-text",
};
const ST_LABEL: Record<EstadoGuia, string> = { "a-vencer": "A vencer", paga: "Paga" };

const GUIAS_LISTA: { comp: string; tipo: string; valor: string; data: string; estado: EstadoGuia }[] = [
  { comp: "Junho de 2026", tipo: "Imposto do mês", valor: "R$ 178,31", data: "Vence 20/07", estado: "a-vencer" },
  { comp: "Maio de 2026", tipo: "Imposto do mês", valor: "R$ 152,90", data: "Pago em 18/06", estado: "paga" },
  { comp: "Abril de 2026", tipo: "Imposto do mês", valor: "R$ 141,20", data: "Pago em 20/05", estado: "paga" },
  { comp: "Março de 2026", tipo: "Imposto do mês", valor: "R$ 138,60", data: "Pago em 19/04", estado: "paga" },
];

export function SuasGuias() {
  return (
    <div>
      <p className="mb-2 text-body-strong font-semibold text-text-primary">Suas guias</p>
      <div className="flex flex-col gap-2">
        {GUIAS_LISTA.map((g) => (
          <Link
            key={g.comp}
            href="/impostos/pagar"
            className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 transition-colors hover:border-border-strong active:bg-surface-alt"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ST_TINT[g.estado]}`}>
              <Banco />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption font-semibold text-text-primary">{g.tipo}</p>
              <p className="mt-0.5 text-micro">
                <span className={ST_COR[g.estado]}>{ST_LABEL[g.estado]}</span>
                <span className="text-text-tertiary"> · {g.data}</span>
              </p>
            </div>
            <p className="shrink-0 text-caption font-semibold text-text-tertiary">{g.valor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
