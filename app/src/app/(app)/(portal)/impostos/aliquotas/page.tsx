"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPOSTOS · SUA ALÍQUOTA (P4) — o detalhe do diferencial (27/07). De /impostos.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela que aterrissa a VIGÍLIA: por que você paga 6% e não 15,5%. Anatomia:
 *   1. Alíquota efetiva HOJE (herói) + anexo.
 *   2. Fator R = a alavanca. Barra contra o corte dos 28% (≥28% → Anexo III
 *      barato; <28% → Anexo V caro). Hoje 37% = folga.
 *   3. "Número vivo" — a tese North Star (a lição da cobaia): isso muda com
 *      pró-labore/faturamento e NINGUÉM olha. A gente olha e avisa antes.
 *   4. Como a gente calcula (memória de cálculo, transparência).
 *   5. CTA = ajustar pró-labore (a alavanca que o cliente controla).
 *
 * ⚠️ Números = FAROL/mock. Mecânica da alíquota efetiva = fila-Larissa; aqui a
 * gente mostra o CONCEITO (Fator R + anexo), sem cravar composição não-ratificada.
 * ⚠️ Anexo III/V + Fator R: ver etiquetas fiscais no vault antes de cravar valor.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const FATOR_R = 37; // % — folha ÷ faturamento (12m)
const CORTE = 28; // % — o divisor Anexo III × V

export default function AliquotasPage() {
  // Posição do marcador na barra (0–100%), com o corte dos 28% fixo.
  const pos = Math.min(100, Math.max(0, FATOR_R));
  return (
    <>
      <TelaHeader meta="Impostos · Alíquota" voltar="/impostos" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* 1. Alíquota efetiva — herói */}
            <div>
              <h1 className="text-h1 text-text-primary">Sua alíquota</h1>
              <p className="mt-1 text-body text-text-secondary">
                Quanto do seu faturamento vira imposto, e por quê.
              </p>
            </div>

            <div className="rounded-2xl bg-surface-dark p-5 text-text-on-dark">
              <p className="text-caption text-text-on-dark/70">Alíquota efetiva hoje</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-display font-bold leading-none">6%</p>
                <span className="mb-1 flex items-center gap-1 rounded-full bg-state-success/20 px-2 py-0.5 text-micro font-semibold text-state-success">
                  <IconeCheck />a menor possível
                </span>
              </div>
              <p className="mt-3 border-t border-white/10 pt-3 text-caption text-text-on-dark/70">
                Simples Nacional · <span className="font-semibold text-text-on-dark">Anexo III</span>.
                No seu faturamento de junho (R$ 4.200), deu R$ 178,31 de imposto.
              </p>
            </div>

            {/* 2. Fator R — a alavanca */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                O que te mantém em 6%: o Fator R
              </p>
              <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-caption text-text-secondary">
                    Folha ÷ faturamento (12 meses)
                  </p>
                  <p className="text-h2 font-bold text-text-primary">{FATOR_R}%</p>
                </div>

                {/* barra com o corte dos 28% */}
                <div className="relative mt-4 h-2.5 rounded-full bg-surface-alt">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-state-success"
                    style={{ width: `${pos}%` }}
                  />
                  {/* marcador do corte 28% */}
                  <div
                    className="absolute -top-1 bottom-[-4px] w-0.5 bg-text-primary"
                    style={{ left: `${CORTE}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-micro text-text-tertiary">
                  <span>0%</span>
                  <span className="font-semibold text-text-primary">corte 28%</span>
                  <span>50%+</span>
                </div>

                <p className="mt-3 text-caption text-text-secondary">
                  Acima de <span className="font-semibold text-text-primary">28%</span> você
                  fica no Anexo III (6% a 11,2%). Abaixo, cairia pro Anexo V
                  (começa em 15,5%). Você está com{" "}
                  <span className="font-semibold text-state-success-text">9 pontos de folga</span>.
                </p>
              </div>
            </div>

            {/* 3. Número vivo — a tese */}
            <div className="flex gap-2.5 rounded-2xl border border-border-hairline bg-surface-tint-brand p-4">
              <span className="mt-0.5 shrink-0 text-action-primary-sm">
                <IconeOlho />
              </span>
              <p className="text-caption text-text-secondary">
                <span className="font-semibold text-text-primary">
                  Esse número é vivo.
                </span>{" "}
                Ele muda todo mês com seu pró-labore e seu faturamento — e é aí que
                a maioria paga imposto a mais sem perceber. A gente vigia por você
                e avisa antes de virar dinheiro perdido.
              </p>
            </div>

            {/* 4. Como a gente calcula */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Como a gente chega nesse número
              </p>
              <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                <Conta rotulo="Pró-labore (folha, 12m)" valor="R$ 14.200" />
                <Conta rotulo="Faturamento (12m)" valor="R$ 38.400" />
                <Conta rotulo="Fator R = folha ÷ faturamento" valor="37%" destaque />
                <Conta rotulo="Resultado" valor="Anexo III · alíquota 6%" destaque />
              </div>
              <p className="mt-2 text-micro text-text-tertiary">
                Valores de exemplo. No seu app, vêm dos seus dados reais, mês a mês.
              </p>
            </div>

            {/* 5. CTA — a alavanca do cliente */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Quer mexer nessa conta?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                O pró-labore é a alavanca que você controla. Simule quanto retirar
                pra manter o Fator R no melhor ponto, sem pagar INSS à toa.
              </p>
              <Link
                href="/pro-labore"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Ajustar meu pró-labore
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── linha da memória de cálculo ──────────────────────────────────────────── */
function Conta({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-hairline px-4 py-3 last:border-b-0">
      <p className={`text-caption ${destaque ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
        {rotulo}
      </p>
      <p className={`text-caption ${destaque ? "font-bold text-text-primary" : "font-medium text-text-primary"}`}>
        {valor}
      </p>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeCheck(): ReactNode {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 4.5 4.5L19 7" /></svg>;
}
function IconeOlho(): ReactNode {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}
