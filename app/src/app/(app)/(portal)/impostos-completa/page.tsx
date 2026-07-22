"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";

/**
 * IMPOSTOS — COMPLETA · a página de impostos mais cheia.
 * Saldo (o que você deve) + dois números do ano + INSIGHT (de olho no Fator R)
 * + guias como transações. Mesma completude do v6, aplicada aqui.
 */

const GUIAS = [
  { comp: "Junho de 2026", estado: "a-vencer", valor: "R$ 178,31", quando: "Vence 20/07" },
  { comp: "Maio de 2026", estado: "pago", valor: "R$ 152,90", quando: "Pago em 18/06" },
  { comp: "Abril de 2026", estado: "pago", valor: "R$ 141,20", quando: "Pago em 20/05" },
  { comp: "Março de 2026", estado: "pago", valor: "R$ 138,60", quando: "Pago em 19/04" },
];

export default function ImpostosCompleta() {
  return (
    <>
      <TelaHeader meta="Impostos" />
      <main className="app-main">
        <Titulo>Seus impostos</Titulo>
        <Corpo>
          {/* Saldo = o que você deve este mês */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-5">
            <p className="text-caption text-text-secondary">A pagar este mês</p>
            <p className="text-display font-bold text-text-primary mt-1">R$ 178,31</p>
            <p className="text-caption text-text-tertiary mt-1">
              Imposto de junho · vence 20/07
            </p>
            <div className="mt-4">
              <Button variant="primarySm">Pagar com Pix</Button>
            </div>
          </div>

          {/* 2 números do ano */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
              <p className="text-micro text-text-tertiary">Pago no ano</p>
              <p className="text-h2 text-text-primary mt-1">R$ 1.842</p>
            </div>
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
              <p className="text-micro text-text-tertiary">Sua alíquota</p>
              <p className="text-h2 text-text-primary mt-1">6%</p>
              <p className="text-micro font-semibold text-state-success-text mt-0.5">
                A menor possível
              </p>
            </div>
          </div>

          {/* Insight: de olho no Fator R */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-action-primary-sm">
                <Olho />
              </span>
              <p className="text-caption font-semibold text-text-primary">De olho pra você</p>
            </div>
            <p className="text-caption text-text-secondary">
              Você paga <strong className="text-text-primary">6%</strong> porque seu pró-labore
              segura o Fator R. Se faturar acima de{" "}
              <strong className="text-text-primary">R$ 28.750</strong> num mês, a gente te avisa
              antes que suba pra 15,5%.
            </p>
          </div>

          {/* Guias como transações */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">Guias recentes</p>
              <button className="text-caption font-semibold text-action-primary-sm">
                Ver todas
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {GUIAS.map((g) => {
                const pago = g.estado === "pago";
                return (
                  <div
                    key={g.comp}
                    className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        pago
                          ? "bg-state-success-tint text-state-success-text"
                          : "bg-state-warning-tint text-state-warning-text"
                      }`}
                    >
                      <Banco />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-semibold text-text-primary">{g.comp}</p>
                      <p className="text-micro text-text-tertiary mt-0.5">{g.quando}</p>
                    </div>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-caption font-semibold ${
                        pago
                          ? "bg-state-success-tint text-state-success-text"
                          : "bg-state-warning-tint text-state-warning-text"
                      }`}
                    >
                      {g.valor}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Corpo>
      </main>
    </>
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
function Olho() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
