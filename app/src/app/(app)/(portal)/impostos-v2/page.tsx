"use client";

import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";
import { SuasGuias } from "@/components/lab/impostos-blocks";

/**
 * IMPOSTOS — VERSÃO 2 (discover). Busca + 2 cards de resumo inline (não
 * validados) + o bloco SuasGuias validado (impostos-blocks, fonte única).
 */
export default function ImpostosV2() {
  return (
    <>
      <TelaHeader meta="Impostos" />
      <main className="app-main">
        <Titulo>Seus impostos</Titulo>
        <Corpo>
          {/* Busca + filtro (inline) */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border-hairline bg-surface-card px-3 py-2.5">
              <Lupa />
              <span className="text-caption text-text-muted">Buscar por competência</span>
            </div>
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-action-primary text-text-on-brand">
              <Filtro />
            </button>
          </div>

          {/* 2 cards de resumo (inline) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
              <p className="text-micro text-text-tertiary">Este mês</p>
              <p className="mt-1 text-h2 text-text-primary">R$ 178</p>
              <p className="mt-0.5 text-micro text-state-warning-text">Vence 20/07</p>
            </div>
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
              <p className="text-micro text-text-tertiary">Estimativa de julho</p>
              <p className="mt-1 text-h2 text-text-primary">~R$ 252</p>
              <p className="mt-0.5 text-micro text-text-tertiary">Até agora</p>
            </div>
          </div>

          <SuasGuias />
        </Corpo>
      </main>
    </>
  );
}

function Lupa() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function Filtro() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
}
