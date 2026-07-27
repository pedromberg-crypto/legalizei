"use client";

import type { ReactNode } from "react";
import Link from "next/link";

/**
 * CALENDÁRIO DE OBRIGAÇÕES · página (ref. schedule odontológico).
 * Adapta o ref pro fiscal:
 *   · header mês + prev/next
 *   · day-strip da semana (dia com DOT = tem obrigação)
 *   · painel com TIMELINE vertical: prazos do mês (DAS, declaração, notas)
 *   · cards dark (título + o que é + ícone de status)
 *   · slot dashed "adicionar lembrete"
 */

const SEMANA = [
  { d: "Seg", n: "14" },
  { d: "Ter", n: "15", obr: true },
  { d: "Qua", n: "16", ativo: true },
  { d: "Qui", n: "17" },
  { d: "Sex", n: "18" },
  { d: "Sáb", n: "19" },
  { d: "Dom", n: "20", obr: true },
];

type Estado = "feito" | "girando" | "pagar" | "aberto";

const EVENTOS: { dia: string; titulo: string; sub: string; estado: Estado }[] = [
  { dia: "15/07", titulo: "Declaração mensal", sub: "A gente entrega, nada a fazer", estado: "feito" },
  { dia: "20/07", titulo: "DAS de junho", sub: "R$ 178,31 · a pagar", estado: "pagar" },
  { dia: "31/07", titulo: "Emitir notas de julho", sub: "Conforme você faturar", estado: "aberto" },
  { dia: "31/07", titulo: "Declaração de julho", sub: "Em preparação pela gente", estado: "girando" },
];

export default function ObrigacoesPage() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-[calc(100px+var(--safe-bottom))] pt-4">
          {/* Voltar pra aba Impostos (de onde o calendário é aberto) */}
          <Link
            href="/impostos"
            className="-ml-1.5 mb-3 inline-flex items-center gap-1 text-caption font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            <SetaEsq /> Impostos
          </Link>

          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-micro font-semibold tracking-wide text-text-tertiary">CALENDÁRIO</p>
              <h1 className="text-h1 text-text-primary">Julho 2026</h1>
            </div>
            <div className="flex gap-2">
              <Redondo><SetaEsq /></Redondo>
              <Redondo><SetaDir /></Redondo>
            </div>
          </div>

          {/* Day strip */}
          <div className="-mx-6 mt-5 flex justify-between gap-1 px-6">
            {SEMANA.map((d) => (
              <div key={d.n} className="flex flex-col items-center gap-1.5">
                <span className="text-micro text-text-tertiary">{d.d}</span>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-caption font-semibold ${
                    d.ativo
                      ? "bg-action-primary text-text-on-brand"
                      : "border border-border-hairline bg-surface-card text-text-primary"
                  }`}
                >
                  {d.n}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    d.obr && !d.ativo ? "bg-action-primary" : "bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Painel com timeline */}
          <div className="mt-4 rounded-3xl bg-surface-alt p-4">
            <p className="mb-4 text-center text-body-strong font-semibold text-text-primary">
              Obrigações do mês
            </p>

            <div className="flex flex-col">
              {EVENTOS.map((e, i) => (
                <div key={i} className="flex gap-3">
                  {/* dia */}
                  <div className="w-11 shrink-0 pt-4 text-right">
                    <span className="text-micro font-medium text-text-tertiary">{e.dia}</span>
                  </div>
                  {/* linha + dot */}
                  <div className="flex flex-col items-center">
                    <span className="mt-5 h-2.5 w-2.5 shrink-0 rounded-full bg-surface-dark" />
                    {i < EVENTOS.length - 1 && <span className="w-px flex-1 bg-border-strong" />}
                  </div>
                  {/* card */}
                  <div className="flex-1 pb-3">
                    <EventoCard e={e} />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function EventoCard({ e }: { e: { titulo: string; sub: string; estado: Estado } }) {
  return (
    <div className="rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-bold">{e.titulo}</p>
          <p className="text-micro text-text-on-dark/70 mt-1">{e.sub}</p>
        </div>
        <Marcador estado={e.estado} />
      </div>
      {e.estado === "pagar" && (
        <button className="mt-3 rounded-lg bg-action-primary px-3 py-1.5 text-micro font-semibold text-text-on-brand">
          Ver a guia
        </button>
      )}
    </div>
  );
}

function Marcador({ estado }: { estado: Estado }) {
  if (estado === "feito") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
        <Check />
      </span>
    );
  }
  if (estado === "girando") {
    return (
      <span className="h-8 w-8 shrink-0 rounded-full border-2 border-white/25 border-t-white" />
    );
  }
  if (estado === "pagar") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
        <IconeBanco />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-text-on-dark">
      <IconeNota />
    </span>
  );
}

function Redondo({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary">
      {children}
    </span>
  );
}

/* ─── ícones ─── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function SetaEsq() {
  return <svg {...ic()}><path d="m15 18-6-6 6-6" /></svg>;
}
function SetaDir() {
  return <svg {...ic()}><path d="m9 18 6-6-6-6" /></svg>;
}
function Check() {
  return <svg {...ic()} width={16} height={16}><path d="m6 12 4 4 8-9" /></svg>;
}
function IconeBanco() {
  return <svg {...ic()} width={16} height={16}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeNota() {
  return <svg {...ic()} width={16} height={16}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>;
}
