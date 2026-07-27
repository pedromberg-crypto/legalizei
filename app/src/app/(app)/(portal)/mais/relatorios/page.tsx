"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";
import { LineChart } from "@/components/lab/charts";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · RELATÓRIOS — o dinheiro em português (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * Tese anti-líder: o concorrente joga DRE/Balanço com jargão contábil. Aqui o
 * relatório é pra DONO ENTENDER: "quanto entrou, quanto sobrou". Anatomia:
 *   1. Hero = faturamento do ano num gráfico (LineChart) + números-âncora.
 *   2. Relatórios = cards com descrição em português + baixar.
 *   3. Nota: o relatório contábil formal existe, a gente gera se pedirem.
 *
 * ⚠️ Números = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Faturamento mês a mês (fev–jul), em reais.
const FATURAMENTO = [2800, 3600, 3100, 4200, 3900, 4200];

const RESUMO = [
  { rotulo: "Faturado em 12m", valor: "R$ 38,4 mil" },
  { rotulo: "Imposto pago", valor: "R$ 2,3 mil" },
  { rotulo: "Depois do imposto", valor: "R$ 36,1 mil" },
];

type Relatorio = { nome: string; desc: string; periodo: string; Icone: () => ReactNode };
const RELATORIOS: Relatorio[] = [
  {
    nome: "Faturamento mês a mês",
    desc: "Quanto você faturou em cada mês do ano.",
    periodo: "2026",
    Icone: IconeLinha,
  },
  {
    nome: "Resultado do mês",
    desc: "Quanto entrou, quanto saiu e quanto sobrou.",
    periodo: "Junho de 2026",
    Icone: IconeBalanca,
  },
  {
    nome: "Impostos pagos",
    desc: "Tudo que você recolheu, guia por guia.",
    periodo: "2026",
    Icone: IconePercent,
  },
  {
    nome: "Pró-labore e retiradas",
    desc: "Quanto você tirou da empresa no ano.",
    periodo: "2026",
    Icone: IconeSaida,
  },
];

export default function RelatoriosPage() {
  const ultimo = FATURAMENTO[FATURAMENTO.length - 1];
  const penultimo = FATURAMENTO[FATURAMENTO.length - 2];
  const subiu = ultimo >= penultimo;
  const variacao = Math.round(Math.abs((ultimo - penultimo) / penultimo) * 100);

  return (
    <>
      <TelaHeader meta="Contabilidade · Relatórios" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Relatórios</h1>
              <p className="mt-1 text-body text-text-secondary">
                O dinheiro da sua empresa, em português. Sem jargão de contador.
              </p>
            </div>

            {/* 1. Hero — faturamento no gráfico */}
            <div className="rounded-2xl bg-surface-dark p-5 text-text-on-dark">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-caption text-text-on-dark/70">
                    Faturamento de junho
                  </p>
                  <p className="mt-0.5 text-h1 font-bold">R$ 4.200</p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-micro font-semibold ${
                    subiu
                      ? "bg-state-success/20 text-state-success"
                      : "bg-white/10 text-text-on-dark/80"
                  }`}
                >
                  <IconeTendencia sobe={subiu} />
                  {subiu ? "+" : "−"}
                  {variacao}%
                </span>
              </div>
              <div className="mt-3 text-action-primary-sm">
                <LineChart valores={FATURAMENTO} />
              </div>
              <div className="mt-1 flex justify-between text-micro text-text-on-dark/50">
                <span>fev</span>
                <span>jul</span>
              </div>
            </div>

            {/* Resumo do ano */}
            <div className="grid grid-cols-3 gap-2">
              {RESUMO.map((r) => (
                <div
                  key={r.rotulo}
                  className="rounded-2xl border border-border-hairline bg-surface-card p-3"
                >
                  <p className="text-body-strong font-bold text-text-primary">
                    {r.valor}
                  </p>
                  <p className="mt-0.5 text-micro text-text-tertiary">{r.rotulo}</p>
                </div>
              ))}
            </div>

            {/* 2. Relatórios (baixar) */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Baixar relatório
              </p>
              <div className="flex flex-col gap-2">
                {RELATORIOS.map((r) => (
                  <button
                    key={r.nome}
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-tint-brand text-action-primary-sm">
                      <r.Icone />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-caption font-semibold text-text-primary">
                        {r.nome}
                      </p>
                      <p className="truncate text-micro text-text-tertiary">{r.desc}</p>
                      <p className="mt-0.5 text-micro font-medium text-text-tertiary">
                        {r.periodo}
                      </p>
                    </div>
                    <span className="shrink-0 text-text-tertiary">
                      <IconeBaixar />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Nota: relatório contábil formal */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Precisa do relatório contábil formal?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                DRE, balanço patrimonial, livro-caixa: a gente gera o documento
                oficial, assinado, quando o banco ou o contador de alguém pedir.
              </p>
              <Link
                href="/mais/servicos?abrir=relatorio-contabil"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Pedir relatório contábil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconeLinha(): ReactNode {
  return <svg {...ic()}><path d="M4 15l4-5 3 3 5-7" /><path d="M3 20h18" /></svg>;
}
function IconeBalanca(): ReactNode {
  return <svg {...ic()}><path d="M12 3v18" /><path d="M6 8h12" /><path d="M6 8l-3 6a3 3 0 0 0 6 0z" /><path d="M18 8l-3 6a3 3 0 0 0 6 0z" /></svg>;
}
function IconePercent(): ReactNode {
  return <svg {...ic()}><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
}
function IconeSaida(): ReactNode {
  return <svg {...ic()}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>;
}
function IconeBaixar(): ReactNode {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></svg>;
}
function IconeTendencia({ sobe }: { sobe: boolean }): ReactNode {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {sobe ? <path d="M3 17l6-6 4 4 8-8M17 7h4v4" /> : <path d="M3 7l6 6 4-4 8 8M17 17h4v-4" />}
    </svg>
  );
}
