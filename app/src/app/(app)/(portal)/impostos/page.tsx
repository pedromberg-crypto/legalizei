"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { StatusIcon } from "@/components/ui/status";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPOSTOS · aba do portal (dashboard fiscal) — construída 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * A casa fiscal. É onde a promessa que o Emitir/Notas abriram aterrissa ("o
 * imposto você acompanha em Impostos"). Ordem senior:
 *   1. Imposto do mês (quanto devo + quando vence + de onde vem) → PAGAR (P3).
 *   2. Vigília fiscal — o diferencial (teto · alíquota · Fator R · alerta que
 *      avisa ANTES da dor). Reusa o componente aprovado.
 *   3. Débito automático — nunca perde o prazo (retenção).
 *   4. Guias anteriores — status AUTOMÁTICO. Mata o flanco nº1 do líder: no
 *      Contabilizei você marca "paguei" na mão; aqui a gente acompanha.
 *   5. Calendário fiscal → liga no /obrigacoes (todas as obrigações do ano).
 *
 * É ABA (raiz) → navbar flutuante; por isso o pb (100px+safe) limpa a barra.
 *
 * ⚠️ Números = farol/mock (vêm do motor contábil no real). A COMPOSIÇÃO da
 * alíquota (efetiva · Fator R) é fila-Larissa — por isso "ver a conta" leva ao
 * detalhe, sem cravar mecânica não-ratificada aqui.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ≥2 impostos por mês (DAS do Simples + INSS do pró-labore). Farol/mock.
type Imposto = { titulo: string; valor: string; vence: string; origem: string };
const IMPOSTOS: Imposto[] = [
  { titulo: "Imposto do mês", valor: "R$ 178,31", vence: "20/07", origem: "Faturou R$ 4.200 · 6% do Simples." },
  { titulo: "INSS do pró-labore", valor: "R$ 102,55", vence: "20/07", origem: "Pró-labore de R$ 932 · INSS 11%." },
];

const HISTORICO = [
  { comp: "Maio de 2026", valor: "R$ 152,90", quando: "Pago em 18/06" },
  { comp: "Abril de 2026", valor: "R$ 141,20", quando: "Pago em 20/05" },
  { comp: "Março de 2026", valor: "R$ 138,60", quando: "Pago em 19/04" },
];

export default function ImpostosPage() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-6">
          {/* Título */}
          <div>
            <h1 className="text-h1 text-text-primary">Seus impostos</h1>
            <p className="mt-1 text-body text-text-secondary">
              Todo mês a gente calcula e você paga por aqui. Sem planilha, sem
              adivinhação.
            </p>
          </div>

          {/* ── Impostos do mês — CARROSSEL (≥2/mês). Snap horizontal, o
              próximo card espia pra afordar o arrasto. Pagar → P3. ── */}
          <div>
            <p className="mb-2 text-body-strong font-semibold text-text-primary">
              Impostos do mês
            </p>
            <div className="-mx-6 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-pl-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {IMPOSTOS.map((i) => (
                <CardImposto key={i.titulo} i={i} />
              ))}
            </div>
            <p className="mt-2 text-micro text-text-tertiary">
              A gente acompanha o pagamento. Sem marcar “paguei” na mão.
            </p>
          </div>

          {/* ── Guias anteriores (status AUTOMÁTICO — anti-líder) ── */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">
                Guias anteriores
              </p>
              <Link
                href="/impostos/guias"
                className="text-caption font-semibold text-action-primary-sm"
              >
                Ver todas
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {HISTORICO.map((g) => (
                <Link
                  key={g.comp}
                  href={
                    `/impostos/pagar?tipo=${encodeURIComponent("Imposto do mês")}` +
                    `&comp=${encodeURIComponent(g.comp)}` +
                    `&valor=${encodeURIComponent(g.valor)}` +
                    `&status=paga` +
                    `&data=${encodeURIComponent(g.quando)}` +
                    `&de=${encodeURIComponent("/impostos")}`
                  }
                  className="flex items-start gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4 transition-colors hover:border-border-strong active:bg-surface-alt"
                >
                  <span className="mt-0.5">
                    <StatusIcon estado="feito" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-caption font-semibold text-text-primary">
                        {g.comp}
                      </p>
                      <p className="text-caption text-text-secondary">{g.valor}</p>
                    </div>
                    <p className="mt-0.5 text-micro text-text-tertiary">
                      {g.quando}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-2 text-micro text-text-tertiary">
              A gente acompanha o pagamento pra você. Nada de marcar “paguei” na
              mão.
            </p>
          </div>

          {/* ── Vigília fiscal (o diferencial — componente aprovado) ── */}
          <Vigilancia />

          {/* ── Calendário fiscal → obrigações do ano ── */}
          <LinhaLink
            href="/obrigacoes"
            icone={<Calendario />}
            titulo="Calendário fiscal"
            sub="Suas obrigações fiscais do ano, mês a mês."
          />
        </div>
      </div>
    </main>
  );
}

/* ─── Card de imposto (item do carrossel) ──────────────────────────────────
   ~72% da largura → o próximo espia perto de metade. content flex-1 empurra o
   Pagar pro rodapé (botões alinhados entre os cards, que têm alturas iguais). */
function CardImposto({ i }: { i: Imposto }) {
  const href =
    `/impostos/pagar?tipo=${encodeURIComponent(i.titulo)}` +
    `&comp=${encodeURIComponent("Junho de 2026")}` +
    `&valor=${encodeURIComponent(i.valor)}` +
    `&status=a-vencer` +
    `&data=${encodeURIComponent("Vence " + i.vence)}` +
    `&origem=${encodeURIComponent(i.origem)}` +
    `&de=${encodeURIComponent("/impostos")}`;
  return (
    <div className="w-[72%] shrink-0 snap-start">
      <div className="flex h-full flex-col rounded-2xl border border-border-hairline bg-surface-card p-5">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-caption text-text-secondary">{i.titulo}</p>
            <span className="shrink-0 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
              Vence {i.vence}
            </span>
          </div>
          <p className="mt-1 text-display font-bold text-text-primary">{i.valor}</p>
          <p className="mt-1 text-micro text-text-tertiary">{i.origem}</p>
        </div>
        <Link
          href={href}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-action-primary text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
        >
          Pagar
        </Link>
      </div>
    </div>
  );
}

/* ─── Linha-link (calendário) ──────────────────────────────────────────────── */
function LinhaLink({
  href,
  icone,
  titulo,
  sub,
}: {
  href: string;
  icone: ReactNode;
  titulo: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4 transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-semibold text-text-primary">{titulo}</p>
        <p className="mt-0.5 text-micro text-text-tertiary">{sub}</p>
      </div>
      <span className="shrink-0 text-text-tertiary">
        <Chevron />
      </span>
    </Link>
  );
}

function Calendario() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
