"use client";

import type { ReactNode } from "react";
import { DADOS, IconeImposto, IconeNotas, IconeEmDia } from "@/components/lab/nexo-shell";

/**
 * INÍCIO — VERSÃO 4 (ref. Approval Dashboard, tela 1) · stat-grid + recentes.
 * Header claro com saudação + 2×2 de STAT CARDS (ícone + número + tendência) +
 * "Movimentações recentes" (lista com chip de tipo + status). Aposta: o painel
 * é uma CENTRAL DE STATUS — o que precisa de você, em números grandes.
 */

const RECENTES = [
  { nome: "Nota #0012 emitida", quando: "há 2 min", tipo: "Nota", estado: "ok", valor: "R$ 1.200" },
  { nome: "DAS de maio", quando: "18/06", tipo: "Imposto", estado: "ok", valor: "R$ 152,90" },
  { nome: "Pró-labore de junho", quando: "01/06", tipo: "Folha", estado: "ok", valor: "R$ 1.621" },
  { nome: "Nota #0011 emitida", quando: "28/05", tipo: "Nota", estado: "ok", valor: "R$ 3.000" },
];

export default function InicioV4() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          {/* Saudação + título */}
          <p className="text-body text-text-secondary">Olá, {DADOS.primeiroNome} 👋</p>
          <h1 className="text-h1 text-text-primary mt-0.5">Seu painel</h1>
          <p className="text-caption text-text-secondary mt-1">
            Veja e resolva o que precisa da sua atenção.
          </p>

          {/* 2×2 de stat cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat
              Icone={IconeImposto}
              numero={DADOS.foco.valor}
              rotulo="Imposto de junho"
              sub="Vence dia 20"
              destaque
            />
            <Stat
              Icone={IconeNotas}
              numero={DADOS.faturamentoMes}
              rotulo="Faturou no mês"
              sub="↑ 8% vs mês passado"
              tendencia="up"
            />
            <Stat
              Icone={IconeEmDia}
              numero={DADOS.tetoUsado}
              rotulo="Uso do teto"
              sub="Muito espaço pra crescer"
            />
            <Stat
              Icone={IconeImposto}
              numero="2"
              rotulo="Vencendo"
              sub="Nos próximos 30 dias"
            />
          </div>

          {/* Movimentações recentes */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">
                Movimentações recentes
              </p>
              <button className="text-caption font-semibold text-action-primary-sm">
                Ver tudo
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {RECENTES.map((r) => (
                <div
                  key={r.nome}
                  className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                    <Check />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-caption font-semibold text-text-primary">
                      {r.nome}
                    </p>
                    <p className="text-micro text-text-tertiary mt-0.5">
                      {r.tipo} · {r.quando}
                    </p>
                  </div>
                  <p className="text-caption text-text-secondary">{r.valor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  Icone,
  numero,
  rotulo,
  sub,
  tendencia,
  destaque = false,
}: {
  Icone: () => ReactNode;
  numero: string;
  rotulo: string;
  sub: string;
  tendencia?: "up" | "down";
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        destaque ? "border-transparent bg-surface-tint-brand" : "border-border-hairline bg-surface-card"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-alt text-action-primary-sm">
        <Icone />
      </span>
      <p className="text-h1 text-text-primary mt-3">{numero}</p>
      <p className="text-caption font-medium text-text-primary mt-0.5">{rotulo}</p>
      <p
        className={`text-micro mt-0.5 ${
          tendencia === "up"
            ? "text-state-success-text"
            : tendencia === "down"
              ? "text-state-danger-text"
              : "text-text-tertiary"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6 12 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
