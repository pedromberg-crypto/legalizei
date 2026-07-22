"use client";

import {
  Saudacao,
  SearchServico,
  CategoriaChips,
  IndiqueGanhe,
  SuaSituacao,
} from "@/components/lab/ref7-blocks";

/**
 * INÍCIO — REF. SAÚDE. Composta pelos blocos validados (ref7-blocks) + o
 * carousel de compromissos inline (ainda não validado).
 */

const COMPROMISSOS = [
  { tag: "DAS · Simples", badge: "A pagar", quando: "Vence 20 de julho", valor: "R$ 178,31", tom: "coral" as const },
  { tag: "Notas · Julho", badge: "Aberto", quando: "Conforme faturar", valor: "0 emitidas", tom: "dark" as const },
];

export default function InicioRef7() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          <Saudacao />
          <div className="mt-4">
            <SearchServico />
          </div>
          <div className="mt-3">
            <CategoriaChips />
          </div>

          {/* Compromissos (carousel inline, não validado) */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-body-strong font-semibold text-text-primary">Próximos compromissos</p>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-dark px-1.5 text-micro font-bold text-text-on-dark">
                  2
                </span>
              </div>
              <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
            </div>
            <div className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {COMPROMISSOS.map((c) => (
                <CompromissoCard key={c.tag} c={c} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <IndiqueGanhe />
          </div>
          <div className="mt-6">
            <SuaSituacao />
          </div>
        </div>
      </div>
    </main>
  );
}

function CompromissoCard({ c }: { c: (typeof COMPROMISSOS)[number] }) {
  const dark = c.tom === "dark";
  return (
    <div
      className={`w-[248px] shrink-0 rounded-2xl p-4 ${
        dark ? "bg-surface-dark text-text-on-dark" : "bg-action-primary text-text-on-brand"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-caption font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Banco />
          </span>
          {c.tag}
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-micro font-semibold">{c.badge}</span>
      </div>
      <p className={`mt-4 text-caption ${dark ? "text-text-on-dark/70" : "text-text-on-brand/80"}`}>
        {c.quando}
      </p>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-h2">{c.valor}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-text-primary">
          <Seta />
        </span>
      </div>
    </div>
  );
}

function Banco() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function Seta() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
