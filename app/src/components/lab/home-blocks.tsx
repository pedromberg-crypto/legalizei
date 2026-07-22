"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";
import { LineChart } from "@/components/lab/charts";
import {
  DADOS,
  GridAcoes,
  IconeEmitir,
  IconeImposto,
  IconeProLabore,
  IconeNotas,
  IconeEmDia,
  IconeDocs,
} from "@/components/lab/nexo-shell";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOME-BLOCKS — os blocos ricos da home (a "v6 completa"), reutilizáveis
 * ═══════════════════════════════════════════════════════════════════════════
 * A home passa a CONTAR o negócio. Estes blocos são a fonte única do conteúdo
 * rico; cada versão (v6, completa-nexo, completa-dash) só troca a CASCA em volta.
 * O ★ é o BlocoInsight: a tese-âncora (o número vivo que ninguém olha).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SERIE = [2600, 3100, 2900, 3800, 3400, 4200];

const AGENDA: { nome: string; quando: string; estado: StatusEstado }[] = [
  { nome: "Emitir suas notas de julho", quando: "Conforme você faturar", estado: "a-fazer" },
  { nome: "DAS de junho · R$ 178,31", quando: "Vence 20/07", estado: "a-fazer" },
  { nome: "Declaração mensal", quando: "A gente cuida, nada a fazer", estado: "girando" },
];

const RECENTES = [
  { nome: "DAS de maio pago", quando: "18/06" },
  { nome: "Nota #0012 emitida · R$ 1.200", quando: "há 2 h" },
];

export function TopoSaudacao({ titulo }: { titulo: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-caption text-text-secondary">Olá, {DADOS.primeiroNome} 👋</p>
        <h1 className="text-h1 text-text-primary">{titulo}</h1>
      </div>
      <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary">
        <Sino />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-state-danger" />
      </button>
    </div>
  );
}

export function BlocoSaude() {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <p className="text-caption text-text-secondary">Faturamento do mês</p>
      <p className="text-display font-bold text-text-primary mt-0.5">
        {DADOS.faturamentoMes}
      </p>
      <p className="text-micro text-state-success-text mt-0.5">
        ↑ 8% vs mês passado · {DADOS.faturamento12m}
      </p>
      <div className="mt-2 text-action-primary-sm">
        <LineChart valores={SERIE} />
      </div>
    </div>
  );
}

export function BlocoFoco() {
  return (
    <div className="rounded-2xl bg-surface-tint-brand p-4">
      <p className="text-caption text-text-secondary">{DADOS.foco.vence}</p>
      <p className="text-body font-semibold text-text-primary mt-0.5">
        {DADOS.foco.titulo} · {DADOS.foco.valor}
      </p>
      <div className="mt-3">
        <Button variant="primarySm">Pagar agora</Button>
      </div>
    </div>
  );
}

export function BlocoTeto() {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-caption font-semibold text-text-primary">Uso do teto do Simples</p>
        <p className="text-caption text-text-secondary">{DADOS.tetoUsado}</p>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
        <div className="h-full rounded-full bg-action-primary" style={{ width: "11%" }} />
      </div>
      <p className="text-micro text-text-tertiary mt-1.5">{DADOS.tetoLivre}</p>
    </div>
  );
}

export function BlocoNumeros() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Num rotulo="Imposto de julho" valor={DADOS.impostoEstimado} sub="Estimativa do mês" />
      <Num
        rotulo="Sua alíquota"
        valor={DADOS.aliquota}
        sub={<span className="font-semibold text-state-success-text">A menor · Fator R 37%</span>}
      />
    </div>
  );
}

/** ★ A tese-âncora: o número vivo que ninguém olha. */
export function BlocoInsight() {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-action-primary-sm">
          <Olho />
        </span>
        <p className="text-caption font-semibold text-text-primary">De olho pra você</p>
      </div>
      <p className="text-caption text-text-secondary">
        Seu pró-labore mantém seu imposto em{" "}
        <strong className="text-text-primary">6%</strong>, o menor possível. Se você faturar acima
        de <strong className="text-text-primary">R$ 28.750</strong> num mês, a gente te avisa{" "}
        <em>antes</em> de subir pra 15,5%.
      </p>
      <button className="mt-2 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
        Como isso funciona
      </button>
    </div>
  );
}

export function BlocoAgenda() {
  return (
    <div>
      <p className="text-body-strong font-semibold text-text-primary mb-2">Este mês</p>
      <div className="flex flex-col gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4">
        {AGENDA.map((a) => (
          <div key={a.nome} className="flex items-start gap-3">
            <span className="mt-0.5">
              <StatusIcon estado={a.estado} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-medium text-text-primary">{a.nome}</p>
              <p className="text-micro text-text-tertiary mt-0.5">{a.quando}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlocoAcoes() {
  return (
    <div>
      <p className="text-body-strong font-semibold text-text-primary mb-2">Ações rápidas</p>
      <GridAcoes
        acoes={[
          { label: "Emitir NF-e", Icone: IconeEmitir },
          { label: "Pagar imposto", Icone: IconeImposto },
          { label: "Pró-labore", Icone: IconeProLabore },
          { label: "Minhas notas", Icone: IconeNotas },
          { label: "Está em dia", Icone: IconeEmDia },
          { label: "Documentos", Icone: IconeDocs },
        ]}
      />
    </div>
  );
}

export function BlocoMovimentacoes() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Movimentações recentes</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
      </div>
      <div className="flex flex-col gap-3">
        {RECENTES.map((r) => (
          <div key={r.nome} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
              <Check />
            </span>
            <p className="min-w-0 flex-1 text-caption text-text-primary">{r.nome}</p>
            <p className="text-micro text-text-tertiary">{r.quando}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlocoWhatsApp() {
  return (
    <div className="flex justify-center">
      <Button variant="ghost">Falar no WhatsApp</Button>
    </div>
  );
}

function Num({ rotulo, valor, sub }: { rotulo: string; valor: string; sub: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="text-h2 text-text-primary mt-1">{valor}</p>
      <p className="text-micro text-text-secondary mt-0.5">{sub}</p>
    </div>
  );
}

function Sino() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
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
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
