"use client";

import type { ReactNode } from "react";

/**
 * COMPONENTES VALIDADOS DA ref11 (AI notes) — página inteira aprovada.
 * profile-row · search-mic · ações-rápidas (card ativo) · emitir-por-voz ·
 * pergunte-à-IA · notas-recentes. Fonte única.
 */

const ACOES = [
  { titulo: "Emitir nota", sub: "Sua NF-e em segundos", Icone: IconeNota, ativo: true },
  { titulo: "Pagar imposto", sub: "O DAS do mês, no app", Icone: IconeBanco },
  { titulo: "Meu pró-labore", sub: "Mexa e veja o imposto", Icone: IconeCarteira },
  { titulo: "Documentos", sub: "Contrato, certidões", Icone: IconePasta },
];

const IA = [
  "Posso emitir pra esse cliente?",
  "Quanto vou pagar esse mês?",
  "Meu Fator R está seguro?",
  "O que é esse imposto?",
];

const NOTAS = [
  { titulo: "Nota #0012 · Maria Costa", valor: "R$ 1.200", tags: ["Serviço", "Paga"], quando: "há 2h" },
  { titulo: "Nota #0011 · João Lima", valor: "R$ 3.000", tags: ["Serviço", "Paga"], quando: "28/05" },
];

/* ─── 1. Profile row ──────────────────────────────────────────────────────── */
export function ProfileRow() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
        AB
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-bold text-text-primary">Ana Beatriz</p>
        <p className="text-caption text-text-tertiary">ME · Serviço · Simples</p>
      </div>
      <Redondo><Engrenagem /></Redondo>
      <Redondo><Sino /></Redondo>
    </div>
  );
}

/* ─── 2. Search bar com mic ───────────────────────────────────────────────── */
export function SearchMic() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border-hairline bg-surface-card px-4 py-3">
      <Lupa />
      <span className="flex-1 text-caption text-text-muted">Buscar nota, cliente, imposto…</span>
      <span className="text-action-primary-sm"><Mic /></span>
    </div>
  );
}

/* ─── 3. Grid de ações (card ativo) ───────────────────────────────────────── */
export function AcoesRapidas() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACOES.map((a) => (
        <button key={a.titulo} className="text-left">
          <div
            className={`h-[112px] rounded-2xl p-4 ${
              a.ativo
                ? "bg-action-primary text-text-on-brand"
                : "border border-border-hairline bg-surface-card text-text-primary"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                a.ativo ? "bg-white/20" : "bg-surface-alt text-action-primary-sm"
              }`}
            >
              <a.Icone />
            </span>
            <p className="mt-3 text-caption font-bold">{a.titulo}</p>
            <p className={`text-micro ${a.ativo ? "text-text-on-brand/80" : "text-text-tertiary"}`}>
              {a.sub}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── 4. Emitir por voz (dark + waveform) ─────────────────────────────────── */
export function EmitirPorVoz() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
        <Mic />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-bold">Emitir por voz</p>
        <p className="text-micro text-text-on-dark/60">Fale o que faturou, a IA monta a nota</p>
      </div>
      <Onda />
    </div>
  );
}

/* ─── 5. Pergunte à IA ────────────────────────────────────────────────────── */
export function PergunteIA() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-action-primary-sm"><Estrela /></span>
        <p className="text-body-strong font-semibold text-text-primary">Pergunte à IA</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {IA.map((q) => (
          <button key={q} className="text-left">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border-hairline bg-surface-card p-3">
              <span className="text-action-primary-sm"><Estrela /></span>
              <p className="mt-3 text-caption font-medium leading-snug text-text-primary">{q}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── 6. Notas recentes (com tags) ────────────────────────────────────────── */
export function NotasRecentes() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Notas recentes</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
      </div>
      <div className="flex flex-col gap-2">
        {NOTAS.map((n) => (
          <div key={n.titulo} className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-caption font-semibold text-text-primary">{n.titulo}</p>
              <p className="text-caption font-semibold text-text-primary">{n.valor}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-micro font-medium text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-micro text-text-tertiary">{n.quando}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── auxiliares ──────────────────────────────────────────────────────────── */
function Redondo({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary">
      {children}
    </span>
  );
}
function Onda() {
  const alturas = [8, 14, 20, 12, 22, 16, 10, 18, 24, 14, 8, 16];
  return (
    <div className="flex h-7 items-center gap-[3px]">
      {alturas.map((h, i) => (
        <span key={i} style={{ height: h }} className="w-[3px] rounded-full bg-action-primary" />
      ))}
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function Engrenagem() {
  return <svg {...ic()}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6.2 10 1.65 1.65 0 0 0 5.87 8.2l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H11a1.65 1.65 0 0 0 1-1.51V4.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V11a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
function Sino() {
  return <svg {...ic()}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
}
function Lupa() {
  return <svg {...ic()} className="text-text-tertiary"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function Mic() {
  return <svg {...ic()}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
}
function Estrela() {
  return <svg {...ic()} width={16} height={16}><path d="M12 3l1.8 4.6L18 9l-3.6 2.7L15 16l-3-2.4L9 16l.6-4.3L6 9l4.2-1.4z" /></svg>;
}
function IconeNota() {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeBanco() {
  return <svg {...ic()}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeCarteira() {
  return <svg {...ic()}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1.1" /></svg>;
}
function IconePasta() {
  return <svg {...ic()}><path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></svg>;
}
