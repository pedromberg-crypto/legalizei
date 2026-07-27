"use client";

import Link from "next/link";

/**
 * VIGÍLIA FISCAL — o diferencial. Sem o gauge (o Pedro não curtiu o mostrador
 * radial). Fica o que ele aprovou: os cards (alíquota + Fator R) + o ALERTA
 * PREDITIVO (o valor de verdade: avisa ANTES da dor — a lição da cobaia). O
 * teto do Simples virou uma BARRA simples. Mock pra farol.
 *
 * 27/07: alíquota + Fator R + "Entender" levam ao detalhe /impostos/aliquotas
 * (P4). A vigília espia; a página explica.
 */
export function Vigilancia() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">
          Sua vigília fiscal
        </p>
        <Link
          href="/impostos/aliquotas"
          className="text-caption font-semibold text-action-primary-sm"
        >
          Entender
        </Link>
      </div>

      <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
        {/* teto do Simples — barra simples (era o gauge) */}
        <div className="flex items-center justify-between">
          <p className="text-micro text-text-tertiary">Uso do teto do Simples</p>
          <p className="text-caption font-semibold text-text-primary">11%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-action-primary"
            style={{ width: "11%" }}
          />
        </div>
        <p className="mt-1.5 text-micro text-text-tertiary">
          Faltam R$ 321.600 pro limite. Tranquilo.
        </p>

        {/* os cards que o Pedro curtiu — agora levam ao detalhe (P4) */}
        <div className="mt-4 flex items-stretch gap-2">
          <Link
            href="/impostos/aliquotas"
            className="flex-1 rounded-2xl bg-surface-alt p-3 transition-colors hover:bg-surface-tint-brand active:bg-surface-tint-brand"
          >
            <p className="text-micro text-text-tertiary">Sua alíquota</p>
            <p className="mt-0.5 text-body font-semibold text-text-primary">6%</p>
            <p className="text-micro font-semibold text-state-success-text">
              a menor possível
            </p>
          </Link>
          <Link
            href="/impostos/aliquotas"
            className="flex-1 rounded-2xl bg-surface-alt p-3 transition-colors hover:bg-surface-tint-brand active:bg-surface-tint-brand"
          >
            <p className="text-micro text-text-tertiary">Fator R</p>
            <p className="mt-0.5 text-body font-semibold text-text-primary">37%</p>
            <p className="text-micro text-text-tertiary">folha ÷ faturamento</p>
          </Link>
        </div>

        {/* alerta preditivo — o coração da vigília */}
        <div className="mt-3 flex gap-2.5 rounded-2xl border border-border-hairline bg-surface-alt p-3">
          <span className="mt-0.5 shrink-0 text-action-primary-sm">
            <Olho />
          </span>
          <p className="text-caption text-text-secondary">
            <span className="font-semibold text-text-primary">De olho:</span> se
            você voltar a faturar cheio, o Fator R muda e a alíquota pode subir
            pra 15,5%. A gente te avisa antes de acontecer.
          </p>
        </div>
      </div>
    </div>
  );
}

function Olho() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
