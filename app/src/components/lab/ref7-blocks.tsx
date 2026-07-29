"use client";

import { useState } from "react";

/**
 * COMPONENTES VALIDADOS DA ref7 (saúde). Fonte única.
 * saudação · search-serviço · chips-categoria · card marketing · checklist compliance.
 * 28/07: CategoriaChips ATUALIZADO (sem bolha de filtro, com estado ativo) pra
 * bater com os chips reais de blog/notas/impostos·guias.
 */

const CATS = ["Notas", "Impostos", "Pró-labore", "Documentos", "Relatórios"];

const ORGAOS = [
  { nome: "Receita Federal", situacao: "Ativa e regular" },
  { nome: "Prefeitura de BH · ISS", situacao: "Regular" },
  { nome: "JUCEMG · Junta Comercial", situacao: "Regular" },
];

/* ─── 1. Saudação + avatar ────────────────────────────────────────────────── */
export function Saudacao() {
  return (
    <div className="flex items-start justify-between">
      <h1 className="text-h1 leading-tight text-text-primary">
        Bem-vinda de volta,
        <br />
        Ana Beatriz
      </h1>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
        AB
      </span>
    </div>
  );
}

/* ─── 2. Search bar (botão dark) — SUPERSEDIDA 28/07 pela busca real (input
   inline + botão limpar, ver SearchMic em ref11-blocks.tsx). Mantida só de
   registro histórico do A/B; não usar como referência de implementação. ──── */
export function SearchServico() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-surface-alt p-1.5 pl-4">
      <span className="flex-1 text-caption text-text-muted">Buscar um serviço</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dark text-text-on-dark">
        <Lupa />
      </span>
    </div>
  );
}

/* ─── 3. Chips de categoria (ativo/inativo — sem bolha de filtro) ─────────── */
export function CategoriaChips() {
  const [ativo, setAtivo] = useState(CATS[0]);
  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATS.map((c) => {
        const sel = c === ativo;
        return (
          <button
            key={c}
            type="button"
            onClick={() => setAtivo(c)}
            aria-pressed={sel}
            className={`shrink-0 rounded-full px-4 py-2 text-caption font-semibold transition-colors ${
              sel
                ? "bg-surface-dark text-text-on-dark"
                : "border border-border-hairline text-text-secondary hover:border-border-strong"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

/* ─── 4. Indicar um amigo — DESCOPADO pra row travada "Em breve" (28/07: era
   card de marketing, mais/page.tsx entregou como feature bloqueada) ───────── */
export function IndiqueGanhe() {
  return (
    <div
      aria-disabled
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card px-4 py-3.5 opacity-60"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-tertiary">
        <IconeIndicar />
      </span>
      <span className="min-w-0 flex-1 text-body text-text-primary">Indicar um amigo</span>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-tertiary">
        <IconeCadeado />
        Em breve
      </span>
    </div>
  );
}

/* ─── 5. Sua situação — EXPANDIDA em página (28/07: mais/em-dia/page.tsx).
   O widget de 3 linhas virou hero (veredito+streak) + órgãos com dot
   pulsante; aqui fica um recorte fiel dessas 2 partes (o resto — "cumprido
   no mês"/"no radar" — é lista simples, já coberta noutros itens do acervo). */
export function SuaSituacao() {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl bg-surface-dark p-5 text-text-on-dark">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
            <CheckGrande />
          </span>
          <div className="min-w-0">
            <p className="text-h2 font-bold">Tudo em dia</p>
            <p className="text-caption text-text-on-dark/70">
              Nenhuma pendência com a Receita, a Prefeitura ou a Junta.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
          <span className="text-state-success">
            <Chama />
          </span>
          <p className="text-caption text-text-on-dark/90">
            <span className="font-bold text-text-on-dark">6 meses seguidos</span> sem
            nenhum atraso.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
        {ORGAOS.map((o, i) => (
          <div
            key={o.nome}
            className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border-hairline" : ""}`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-state-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-state-success" />
            </span>
            <p className="min-w-0 flex-1 text-caption font-semibold text-text-primary">{o.nome}</p>
            <p className="shrink-0 text-micro font-semibold text-state-success-text">{o.situacao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function Lupa() {
  return <svg {...ic()} width={20} height={20}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function IconeIndicar() {
  return <svg {...ic()}><circle cx="9" cy="8" r="3" /><path d="M4 20a5 5 0 0 1 10 0" /><path d="M18 8v6M15 11h6" /></svg>;
}
function IconeCadeado() {
  return <svg {...ic()} width={11} height={11} strokeWidth={2.2}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
}
function CheckGrande() {
  return <svg {...ic()} width={28} height={28} strokeWidth={2.6}><path d="m5 12.5 4.5 4.5L19 7" /></svg>;
}
function Chama() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c1 3-1 4-1 6a2 2 0 0 0 4 0c0-.6-.2-1.2-.4-1.7C16.5 8 18 10.5 18 13.5A6 6 0 0 1 6 13.5c0-2.4 1.2-4 2.5-5.3C9.7 7 11 5.5 12 2z" />
    </svg>
  );
}
