"use client";

import type { ReactNode } from "react";
import { DADOS } from "@/components/lab/nexo-shell";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS-SHELL — casca de exploração da aba "Mais" (ref. Nnadi/perfil-menu)
 * ═══════════════════════════════════════════════════════════════════════════
 * O print mostra um A/B do mesmo hub: GRID de tiles × LISTA por seções. Esta
 * casca é a parte COMUM das 2 versões (perfil + toggle + nudge + as seções), pra
 * elas diferirem só em como os itens aparecem (SecaoGrid × SecaoLista).
 *
 * ⚠️ Paleta: o print usa tiles COLORIDOS (verde/marrom). Nossa regra reserva cor
 * pra ESTADO (coral = marca/ação). Então os tiles/rows são neutros com um chip
 * de ícone em coral-50 (surface-tint-brand, que já é token). Se a gente quiser
 * tiles color-coded, é uma decisão de paleta à parte (uma escala decorativa).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PERFIL = {
  nome: "Ana Beatriz Ramos",
  email: "anabeatriz@gmail.com",
  iniciais: "AB",
};

export type Item = { label: string; Icone: () => ReactNode };
export type Secao = { nome: string; itens: Item[] };

export const SECOES: Secao[] = [
  {
    nome: "Sua empresa",
    itens: [
      { label: "Dados da empresa", Icone: IconeEmpresa },
      { label: "Documentos", Icone: IconeDocs },
      { label: "Certificado digital", Icone: IconeCert },
    ],
  },
  {
    nome: "Contabilidade",
    itens: [
      { label: "Você está em dia", Icone: IconeEmDia },
      { label: "Relatórios", Icone: IconeRelatorio },
      { label: "Declarações", Icone: IconeDeclaracao },
    ],
  },
  {
    nome: "Conta",
    itens: [
      { label: "Notificações", Icone: IconeSino },
      { label: "Indicar um amigo", Icone: IconeIndicar },
      { label: "Sair", Icone: IconeSair },
    ],
  },
];

/* ─── A casca comum ────────────────────────────────────────────────────────── */
export function MaisShell({ children }: { children: ReactNode }) {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-5 pt-4 pb-4">
          <ProfileHeader />
          <Availability />
          <NudgeCertificado />
          {children}
        </div>
      </div>
    </main>
  );
}

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark">
          <span className="text-body font-bold text-text-on-dark">
            {PERFIL.iniciais}
          </span>
        </div>
        {/* selo verde de "ativo" (estado real: CNPJ ativo) */}
        <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-surface-page bg-state-success" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-text-primary">{PERFIL.nome}</p>
        <p className="truncate text-caption text-text-tertiary">{PERFIL.email}</p>
      </div>
      <button className="flex items-center gap-1 text-caption font-semibold text-action-primary-sm">
        <IconePencil />
        Editar
      </button>
    </div>
  );
}

function Availability() {
  return (
    <div className="flex items-center justify-between">
      <p className="text-body text-text-primary">Aviso no WhatsApp</p>
      {/* toggle LIGADO (estado = verde). Visual, sem lógica no farol. */}
      <div className="flex h-6 w-10 items-center rounded-full bg-state-success px-0.5">
        <div className="ml-auto h-5 w-5 rounded-full bg-white" />
      </div>
    </div>
  );
}

/* Nudge escuro do print, aterrado no nosso gate: falta o certificado.
   Exportado (validado no acervo — Mais · v1). */
export function NudgeCertificado() {
  return (
    <button className="w-full text-left">
      <div className="flex items-center gap-3 rounded-2xl bg-surface-dark p-4 text-text-on-dark">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25">
          <IconeCert />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-bold">Falta seu certificado digital</p>
          <p className="text-micro text-text-on-dark/70">
            Destrava emitir nota e cuidar dos seus impostos
          </p>
        </div>
        <IconeChevron />
      </div>
    </button>
  );
}

/* ─── Resumo do negócio (validado — mais · completa) ──────────────────────── */
export function ResumoNegocio() {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-state-success text-text-on-dark">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-caption font-semibold text-state-success-text">CNPJ ativo e em dia</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-micro text-text-tertiary">Faturou no mês</p>
          <p className="mt-0.5 text-h2 text-text-primary">{DADOS.faturamentoMes}</p>
        </div>
        <div>
          <p className="text-micro text-text-tertiary">Imposto de julho</p>
          <p className="mt-0.5 text-h2 text-text-primary">{DADOS.impostoEstimado}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Seção como LISTA (variante direita do print) ─────────────────────────── */
export function SecaoLista({ secao }: { secao: Secao }) {
  return (
    <div>
      <p className="text-micro text-text-tertiary mb-1">{secao.nome}</p>
      <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
        {secao.itens.map(({ label, Icone }, i) => (
          <button key={label} className="w-full text-left">
            <div
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i > 0 ? "border-t border-border-hairline" : ""
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
                <Icone />
              </span>
              <span className="min-w-0 flex-1 text-body text-text-primary">
                {label}
              </span>
              <IconeChevron className="text-text-tertiary" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Seção como GRID de tiles (variante esquerda do print) ────────────────── */
export function SecaoGrid({ secao }: { secao: Secao }) {
  return (
    <div>
      <p className="text-micro text-text-tertiary mb-2">{secao.nome}</p>
      <div className="grid grid-cols-2 gap-3">
        {secao.itens.map(({ label, Icone }) => (
          <button key={label} className="text-left">
            <div className="flex h-[104px] flex-col justify-between rounded-2xl border border-border-hairline bg-surface-card p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                <Icone />
              </span>
              <span className="text-caption font-semibold text-text-primary">
                {label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function IconeChevron({ className = "" }: { className?: string }) {
  return (
    <svg {...ic()} className={`shrink-0 ${className}`}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IconePencil() {
  return (
    <svg {...ic()} width={16} height={16}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
function IconeEmpresa() {
  return (
    <svg {...ic()}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconeDocs() {
  return (
    <svg {...ic()}>
      <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function IconeCert() {
  return (
    <svg {...ic()}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconeEmDia() {
  return (
    <svg {...ic()}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.9" />
    </svg>
  );
}
function IconeRelatorio() {
  return (
    <svg {...ic()}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
function IconeDeclaracao() {
  return (
    <svg {...ic()}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="m9.5 14 1.5 1.5 3-3" />
    </svg>
  );
}
function IconeSino() {
  return (
    <svg {...ic()}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeIndicar() {
  return (
    <svg {...ic()}>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 20a5 5 0 0 1 10 0" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  );
}
function IconeSair() {
  return (
    <svg {...ic()}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
