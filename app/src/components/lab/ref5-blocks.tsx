"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTES VALIDADOS DA ref5 (agenda + ticket + blog). Extraídos pra fonte
 * única — usados na página ref5 E no acervo /componentes.
 * Ajuste do Pedro: o DAS-ticket perdeu o código de barras (não condiz), fica só
 * a moldura de ticket + chips fiscais + Pagar com Pix.
 * 28/07: DayStripFiscal e ProximasObrigacoes ATUALIZADOS pra bater com o
 * /obrigacoes aprovado (círculo+dot embaixo em vez de pill, timeline dark
 * agrupada por dia em vez de cards claros por mês).
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

type EstadoObrigacao = "feito" | "girando" | "pagar" | "aberto";

const EVENTOS: { dia: string; titulo: string; sub: string; estado: EstadoObrigacao }[] = [
  { dia: "15/07", titulo: "Declaração mensal", sub: "A gente entrega, nada a fazer", estado: "feito" },
  { dia: "20/07", titulo: "DAS de junho", sub: "R$ 178,31 · a pagar", estado: "pagar" },
  { dia: "31/07", titulo: "Emitir notas de julho", sub: "Conforme você faturar", estado: "aberto" },
  { dia: "31/07", titulo: "Declaração de julho", sub: "Em preparação pela gente", estado: "girando" },
];

const POSTS = [
  { titulo: "Entenda o Fator R sem dor de cabeça", meta: "3 min", Icone: IconeLivro },
  { titulo: "Sua 1ª nota fiscal, passo a passo", meta: "2 min", Icone: IconeNota },
  { titulo: "Reforma tributária 2026: o que muda", meta: "5 min", Icone: IconeAlerta },
];

/* ─── 1. Day-strip fiscal (círculo + dot embaixo — bate com /obrigacoes) ──── */
export function DayStripFiscal() {
  return (
    <div className="-mx-6 flex justify-between gap-1 px-6">
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
            className={`h-1.5 w-1.5 rounded-full ${d.obr && !d.ativo ? "bg-action-primary" : "bg-transparent"}`}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── 2. DAS ticket (SEM barcode — ajuste do Pedro) ───────────────────────── */
export function DasTicket() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tint-brand text-action-primary-sm">
            <IconeBanco />
          </span>
          <div>
            <p className="text-body font-bold text-text-primary">DAS de junho</p>
            <p className="text-micro text-text-tertiary">Competência jun/2026</p>
          </div>
        </div>
        <p className="text-h2 text-text-primary">R$ 178,31</p>
      </div>

      {/* perfuração do ticket (mantém o "ar" de comprovante, sem o barcode) */}
      <div className="relative">
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface-page" />
        <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface-page" />
        <div className="border-t border-dashed border-border-strong" />
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-micro text-text-tertiary">Vence 20/07 ·</span>
          <Chip>Fator R 37%</Chip>
          <Chip>Anexo III · 6%</Chip>
        </div>
        <div className="mt-3">
          <Button variant="primarySm" full>
            Pagar com Pix
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Stat cards com chip coral ────────────────────────────────────────── */
export function StatsCoral() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat Icone={IconeGrafico} numero="R$ 4.200" rotulo="No mês" />
      <Stat Icone={IconeTeto} numero="11%" rotulo="Do teto" />
      <Stat Icone={IconePercent} numero="6%" rotulo="Alíquota" />
    </div>
  );
}

/* ─── 4. Próximas obrigações (timeline dark, agrupada por dia — /obrigacoes) ─ */
export function ProximasObrigacoes() {
  return (
    <div className="rounded-3xl bg-surface-alt p-4">
      <p className="mb-4 text-center text-body-strong font-semibold text-text-primary">
        Obrigações do mês
      </p>
      <div className="flex flex-col">
        {EVENTOS.map((e, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-11 shrink-0 pt-4 text-right">
              <span className="text-micro font-medium text-text-tertiary">{e.dia}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="mt-5 h-2.5 w-2.5 shrink-0 rounded-full bg-surface-dark" />
              {i < EVENTOS.length - 1 && <span className="w-px flex-1 bg-border-strong" />}
            </div>
            <div className="flex-1 pb-3">
              <EventoObrigacaoCard e={e} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventoObrigacaoCard({
  e,
}: {
  e: { titulo: string; sub: string; estado: EstadoObrigacao };
}) {
  return (
    <div className="rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-bold">{e.titulo}</p>
          <p className="text-micro text-text-on-dark/70 mt-1">{e.sub}</p>
        </div>
        <MarcadorObrigacao estado={e.estado} />
      </div>
      {e.estado === "pagar" && (
        <button className="mt-3 rounded-lg bg-action-primary px-3 py-1.5 text-micro font-semibold text-text-on-brand">
          Ver a guia
        </button>
      )}
    </div>
  );
}

function MarcadorObrigacao({ estado }: { estado: EstadoObrigacao }) {
  if (estado === "feito") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
        <IconeCheckSm />
      </span>
    );
  }
  if (estado === "girando") {
    return <span className="h-8 w-8 shrink-0 rounded-full border-2 border-white/25 border-t-white" />;
  }
  if (estado === "pagar") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
        <IconeBancoSm />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-text-on-dark">
      <IconeNotaSm />
    </span>
  );
}

/* ─── 5. Blog carousel "Aprenda com a gente" ──────────────────────────────── */
export function BlogCarousel() {
  return (
    <div>
      <p className="text-body-strong font-semibold text-text-primary mb-2">Aprenda com a gente</p>
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {POSTS.map((p) => (
          <button key={p.titulo} className="text-left">
            <div className="w-[168px] shrink-0 overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
              <div className="flex h-20 items-center justify-center bg-surface-tint-brand text-action-primary-sm">
                <p.Icone />
              </div>
              <div className="p-3">
                <p className="text-caption font-semibold leading-snug text-text-primary">{p.titulo}</p>
                <p className="text-micro text-text-tertiary mt-1">{p.meta} de leitura</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── auxiliares ──────────────────────────────────────────────────────────── */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg bg-surface-alt px-2 py-1 text-micro font-medium text-text-secondary">
      {children}
    </span>
  );
}

function Stat({ Icone, numero, rotulo }: { Icone: () => ReactNode; numero: string; rotulo: string }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tint-brand text-action-primary-sm">
        <Icone />
      </span>
      <p className="text-body-strong font-bold text-text-primary mt-2">{numero}</p>
      <p className="text-micro text-text-tertiary">{rotulo}</p>
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function i20() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconeBanco() {
  return <svg {...i20()} width={20} height={20}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeGrafico() {
  return <svg {...i20()}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>;
}
function IconeTeto() {
  return <svg {...i20()}><path d="M12 3v18M4 12h16" /><path d="m8 8 4-4 4 4" /></svg>;
}
function IconePercent() {
  return <svg {...i20()}><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
}
function IconeLivro() {
  return <svg {...i20()} width={26} height={26}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" /><path d="M9 3v18" /></svg>;
}
function IconeNota() {
  return <svg {...i20()} width={26} height={26}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeAlerta() {
  return <svg {...i20()} width={26} height={26}><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17v.01" /></svg>;
}
function IconeCheckSm() {
  return <svg {...i20()} width={16} height={16}><path d="m6 12 4 4 8-9" /></svg>;
}
function IconeBancoSm() {
  return <svg {...i20()} width={16} height={16}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeNotaSm() {
  return <svg {...i20()} width={16} height={16}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>;
}
