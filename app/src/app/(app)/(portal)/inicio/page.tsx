"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P1 — HOME / DASHBOARD  ·  arquétipo HUB · shell APP · portal
 * ═══════════════════════════════════════════════════════════════════════════
 * Matriz: execucao/matriz-portal-interno.md → Módulo A (P1)
 *
 * ─── O QUE ESTA TELA É ──────────────────────────────────────────────────────
 * A Início do líder (dossiê §1) é um CATÁLOGO denso: 4 cards + benefícios +
 * serviços + N nudges, obrigação misturada com upsell, e a conversão por MEDO
 * (pendências críticas em vermelho, dunning). A nossa é o OPOSTO: um PAINEL DE
 * SAÚDE DO NEGÓCIO — os poucos números que fazem o dono decidir (cresci? pago
 * quanto? tô perto do teto? meu pró-labore tá certo?), sem pânico e sem vender.
 *
 * ─── HIERARQUIA (anti-densidade, UX-48) ─────────────────────────────────────
 *   1. TOPO      — o foco (próxima obrigação, com ação) + pulso "você está em dia".
 *   2. NEGÓCIO   — os 4 números de decisão (faturamento · teto · imposto · alíquota).
 *   3. RODAPÉ    — próximos vencimentos + atalhos + canal humano.
 * Densidade muda APRESENTAÇÃO, jamais obrigação: detalhe fica atrás de toque.
 *
 * ─── DADO ───────────────────────────────────────────────────────────────────
 * Os números de decisão são VITRINE sobre o motor contábil (🔧, backend do dev)
 * + a nossa engine (⚙️ lib/fiscal, Fator R). Aqui é farol com mock.
 *
 * ⚠️ Sem Rodapé fixo: a ação primária mora no card-foco (doutrina K6 do painel).
 * A barra de abas (shell do portal) é a nav; o WhatsApp fica como link leve.
 *
 * 🆕 04/08 — Plano MEI (`?regime=mei`): o grid "Seu negócio" de 4 números
 * (Fator R/alíquota/teto Simples) não existe pro MEI — DAS-MEI é fixo, sem
 * Anexo. Vira 2 números (faturado no mês + uso do limite de R$81 mil/ano).
 * Atalhos trocam pró-labore/impostos por emitir nota + colaborador — as 2
 * coisas que o Plano MEI de fato cobre.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Viria do cadastro + motor + engine. Mock pra farol.
const EMPRESA = {
  primeiroNome: "Ana",
  razao: "Ana Beatriz Ramos Desenvolvimento de Software",
  cnpj: "54.321.000/0001-09",
};

const FOCO = {
  titulo: "Seu imposto de junho",
  valor: "R$ 178,31",
  vence: "Vence dia 20",
};

// Os 4 números que fazem o dono decidir.
const NEGOCIO = {
  faturamentoMes: "R$ 4.200",
  faturamento12m: "R$ 38.400 nos últimos 12 meses",
  tetoUsado: "11%",
  tetoLivre: "Faltam R$ 321.600 pro limite do Simples",
  impostoEstimado: "~R$ 252",
  impostoSub: "Estimativa de julho, até agora",
  aliquota: "6%",
};

const VENCIMENTOS = [
  { nome: "DAS de julho", valor: "~R$ 252", quando: "Vence 20/08" },
  { nome: "Declaração anual (DEFIS)", valor: "", quando: "Até 31/05/2027" },
];

/** 🆕 04/08 — Plano MEI: DAS-MEI é FIXO (sem Anexo/Fator R), então o foco e os
 *  vencimentos trocam de conteúdo (não de estrutura). */
const FOCO_MEI = {
  titulo: "Seu DAS-MEI de julho",
  valor: "R$ 76,90",
  vence: "Vence dia 20",
};
const VENCIMENTOS_MEI = [
  { nome: "DAS-MEI de julho", valor: "R$ 76,90", quando: "Vence 20/08" },
  { nome: "Declaração anual (DASN-SIMEI)", valor: "", quando: "Até 31/05/2027" },
];

export default function InicioPage() {
  const searchParams = useSearchParams();
  const mei = searchParams.get("regime") === "mei";
  const foco = mei ? FOCO_MEI : FOCO;
  const vencimentos = mei ? VENCIMENTOS_MEI : VENCIMENTOS;

  return (
    <>
      <TelaHeader meta="Início" />

      <main className="app-main">
        <Titulo>Bom te ver, {EMPRESA.primeiroNome}</Titulo>

        <Corpo>
          {/* ── Cabeçalho da empresa: contexto de "qual empresa" (nav) ──────
              Fino de propósito: identidade, não destaque. Toca pra ver os dados
              (Mais → dados da empresa). Vira seletor quando houver multi-CNPJ. */}
          <button className="text-left">
            <div className="flex items-center gap-3 rounded-lg border border-border-hairline bg-surface-card p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-semibold text-text-primary">
                  {EMPRESA.razao}
                </p>
                <p className="text-micro text-text-tertiary mt-0.5">
                  {EMPRESA.cnpj}
                </p>
              </div>
              <Seta />
            </div>
          </button>

          {/* ── 1. O FOCO: a próxima obrigação, com a ação embutida ─────────
              Card de marca (coral nunca é alerta). O líder põe "pendência
              crítica" em vermelho/medo; a gente põe a mesma coisa em calma,
              com o "pagar" junto. */}
          <Card tom="marca">
            <p className="text-caption text-text-secondary">{foco.vence}</p>
            <p className="text-body font-semibold text-text-primary mt-0.5">
              {foco.titulo}
            </p>
            <p className="text-h2 text-text-primary mt-1">{foco.valor}</p>
            <div className="mt-3">
              <Button variant="primarySm">Pagar agora</Button>
            </div>
          </Card>

          {/* ── Pulso de compliance: o oposto do dunning deles ──────────────
              Selo verde (estado real) + "no resto, tudo certo". Onde eles
              vendem pânico ("o que você perde"), a gente dá alívio. */}
          <div className="flex items-start gap-2">
            <span className="mt-0.5">
              <StatusIcon estado="feito" />
            </span>
            <p className="text-caption text-text-secondary">
              No resto, você está em dia. Notas, declarações e obrigações do mês,
              tudo certo.
            </p>
          </div>

          {/* ── 2. SEU NEGÓCIO: os 4 números de decisão ─────────────────────
              Cards pequenos, 2×2 — não seções gigantes (anti-densidade). É o
              que o líder esconde (simular imposto num card, teto em lugar
              nenhum) posto na cara, sem jargão. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Seu negócio
            </p>
            {mei ? (
              /* 🆕 04/08 — MEI não tem Fator R/Anexo (DAS-MEI é fixo): os 2
                 números que sobram de decisão são faturamento e limite anual,
                 não imposto/alíquota (que não variam pro MEI). */
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  rotulo="Faturou no mês"
                  valor={NEGOCIO.faturamentoMes}
                  sub={NEGOCIO.faturamento12m}
                />
                <StatCard
                  rotulo="Uso do limite anual"
                  valor="14%"
                  sub="Faltam R$ 69.600 pro limite do MEI (R$ 81 mil/ano)"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  rotulo="Faturou no mês"
                  valor={NEGOCIO.faturamentoMes}
                  sub={NEGOCIO.faturamento12m}
                />
                <StatCard
                  rotulo="Uso do teto"
                  valor={NEGOCIO.tetoUsado}
                  sub={NEGOCIO.tetoLivre}
                />
                <StatCard
                  rotulo="Imposto de julho"
                  valor={NEGOCIO.impostoEstimado}
                  sub={NEGOCIO.impostoSub}
                />
                <StatCard
                  rotulo="Sua alíquota"
                  valor={NEGOCIO.aliquota}
                  sub={
                    <>
                      <span className="font-semibold text-state-success-text">
                        A menor possível
                      </span>{" "}
                      · Fator R 37%
                    </>
                  }
                />
              </div>
            )}
          </div>

          {/* ── 3. Próximos vencimentos: o calendário deles, condensado ─────
              A Central de Rotinas do líder é um calendário denso. Aqui: as 2
              próximas coisas que vencem, e nada mais. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Próximos vencimentos
            </p>
            <div className="flex flex-col gap-2">
              {vencimentos.map((v) => (
                <div
                  key={v.nome}
                  className="flex items-center justify-between rounded-lg border border-border-hairline bg-surface-card p-3"
                >
                  <div className="min-w-0">
                    <p className="text-caption font-semibold text-text-primary">
                      {v.nome}
                    </p>
                    <p className="text-micro text-text-tertiary mt-0.5">
                      {v.quando}
                    </p>
                  </div>
                  {v.valor && (
                    <p className="text-caption text-text-secondary">{v.valor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Atalhos: as rotinas do novo CNPJ ─────────────────────────────
              O que o líder afoga em "Rotinas Mensais" + nudges, a gente deixa
              na cara. Plano MEI só cobre 2 delas (emitir + colaborador) —
              pró-labore/impostos completos não fazem parte do escopo limitado. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Atalhos
            </p>
            <div className="flex flex-col gap-2">
              <Atalho titulo="Emitir uma nota" texto="Sua nota fiscal em poucos toques." />
              {mei ? (
                <Atalho
                  titulo="Meu colaborador"
                  texto="Gerencie o funcionário que a lei permite pro MEI."
                />
              ) : (
                <>
                  <Atalho
                    titulo="Meu pró-labore"
                    texto="Mexa no quanto você retira e veja o imposto mudar na hora."
                  />
                  <Atalho titulo="Meus impostos" texto="Guias do mês e o histórico do que já pagou." />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <Button variant="ghost">Falar no WhatsApp</Button>
          </div>
        </Corpo>
      </main>
    </>
  );
}

/* ─── Um número de decisão: rótulo + valor + contexto ─────────────────────── */
function StatCard({
  rotulo,
  valor,
  sub,
}: {
  rotulo: string;
  valor: string;
  sub: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-hairline bg-surface-card p-3">
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="text-h2 text-text-primary mt-1">{valor}</p>
      <p className="text-micro text-text-secondary mt-0.5">{sub}</p>
    </div>
  );
}

/* ─── Um atalho: título + o que é, com a seta de "leva pra algum lugar" ────── */
function Atalho({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <button className="text-left">
      <Card className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold text-text-primary">{titulo}</p>
          <p className="text-micro text-text-secondary mt-0.5">{texto}</p>
        </div>
        <Seta />
      </Card>
    </button>
  );
}

function Seta() {
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
      className="shrink-0 text-text-tertiary"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
