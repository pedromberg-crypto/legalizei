"use client";

import type { ReactNode } from "react";
import { DADOS } from "@/components/lab/nexo-shell";
import { ProximoCompromisso, QuemCuida } from "@/components/lab/ref9-blocks";

/**
 * INÍCIO — REF. WELLNESS. Composta pelos blocos validados (próximo compromisso
 * + quem cuida de você, em ref9-blocks) + saudação e grid de métricas inline
 * (ainda não validados).
 */
export default function InicioRef9() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          {/* Saudação (inline) */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-h1 text-text-primary">Olá, {DADOS.primeiroNome}</h1>
              <p className="mt-0.5 text-body text-text-secondary">Como está sua empresa hoje?</p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
              AB
            </span>
          </div>

          {/* Grid assimétrico de métricas (inline) */}
          <div className="mt-5 grid grid-cols-2 grid-rows-2 gap-3">
            <Metrica tint="success" Icone={IconeGrafico} label="Faturou no mês" valor={DADOS.faturamentoMes} />
            <MetricaAlta
              tint="brand"
              Icone={IconeEscudo}
              label="Fator R"
              valor="37%"
              extra="Você paga 6%, o menor possível. Está seguro."
            />
            <Metrica tint="warning" Icone={IconeImposto} label="Imposto do mês" valor={DADOS.impostoEstimado} />
          </div>

          {/* Blocos validados */}
          <div className="mt-6">
            <ProximoCompromisso />
          </div>
          <div className="mt-6">
            <QuemCuida />
          </div>
        </div>
      </div>
    </main>
  );
}

const CHIP: Record<string, string> = {
  success: "bg-state-success-tint text-state-success-text",
  warning: "bg-state-warning-tint text-state-warning-text",
  brand: "bg-surface-tint-brand text-action-primary-sm",
};

function Metrica({
  tint,
  Icone,
  label,
  valor,
}: {
  tint: string;
  Icone: () => ReactNode;
  label: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${CHIP[tint]}`}>
        <Icone />
      </span>
      <p className="mt-3 text-caption text-text-secondary">{label}</p>
      <p className="text-h2 text-text-primary">{valor}</p>
    </div>
  );
}

function MetricaAlta({
  tint,
  Icone,
  label,
  valor,
  extra,
}: {
  tint: string;
  Icone: () => ReactNode;
  label: string;
  valor: string;
  extra: string;
}) {
  return (
    <div className="row-span-2 flex flex-col rounded-2xl border border-border-hairline bg-surface-card p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${CHIP[tint]}`}>
        <Icone />
      </span>
      <p className="mt-3 text-caption text-text-secondary">{label}</p>
      <p className="text-h1 text-text-primary">{valor}</p>
      <p className="mt-auto pt-3 text-micro text-text-tertiary">{extra}</p>
    </div>
  );
}

function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconeGrafico() {
  return <svg {...ic()}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>;
}
function IconeImposto() {
  return <svg {...ic()}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeEscudo() {
  return <svg {...ic()}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>;
}
