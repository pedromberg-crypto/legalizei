"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTES VALIDADOS DA ref5 (agenda + ticket + blog). Extraídos pra fonte
 * única — usados na página ref5 E no acervo /componentes.
 * Ajuste do Pedro: o DAS-ticket perdeu o código de barras (não condiz), fica só
 * a moldura de ticket + chips fiscais + Pagar com Pix.
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

const MESES = [
  {
    mes: "Julho",
    itens: [
      { dia: "20", nome: "DAS de junho", info: "Vence · R$ 178,31" },
      { dia: "31", nome: "Emitir notas de julho", info: "Conforme faturar" },
    ],
  },
  { mes: "Agosto", itens: [{ dia: "20", nome: "DAS de julho", info: "Estimado ~R$ 252" }] },
];

const POSTS = [
  { titulo: "Entenda o Fator R sem dor de cabeça", meta: "3 min", Icone: IconeLivro },
  { titulo: "Sua 1ª nota fiscal, passo a passo", meta: "2 min", Icone: IconeNota },
  { titulo: "Reforma tributária 2026: o que muda", meta: "5 min", Icone: IconeAlerta },
];

/* ─── 1. Day-strip fiscal + countdown ─────────────────────────────────────── */
export function DayStripFiscal() {
  return (
    <div>
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SEMANA.map((d) => (
          <div key={d.n} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-[68px] w-[52px] shrink-0 flex-col items-center justify-center rounded-[24px] ${
                d.ativo
                  ? "bg-action-primary text-text-on-brand"
                  : "border border-border-hairline bg-surface-card text-text-primary"
              }`}
            >
              <span className="text-body font-bold">{d.n}</span>
              <span className={`text-micro ${d.ativo ? "text-text-on-brand/80" : "text-text-tertiary"}`}>
                {d.d}
              </span>
              {d.obr && !d.ativo && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-action-primary" />}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-body-strong font-bold text-text-primary">
        Seu imposto vence em <span className="text-action-primary-sm">4 dias</span>
      </p>
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

/* ─── 4. Próximas obrigações (agrupadas por mês) ──────────────────────────── */
export function ProximasObrigacoes() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <p className="text-body-strong font-semibold text-text-primary">Próximas obrigações</p>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-tint-brand px-1.5 text-micro font-bold text-action-primary-sm">
          3
        </span>
      </div>
      {MESES.map((m) => (
        <div key={m.mes} className="mb-3">
          <p className="text-micro text-text-tertiary mb-2">{m.mes}</p>
          <div className="flex flex-col gap-2">
            {m.itens.map((it) => (
              <div
                key={it.nome}
                className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-surface-alt">
                  <span className="text-body font-bold leading-none text-text-primary">{it.dia}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-caption font-semibold text-text-primary">{it.nome}</p>
                  <p className="text-micro text-text-tertiary mt-0.5">{it.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
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
