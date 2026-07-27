"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  FISCAL,
  proLaboreOtimo,
  naBorda,
  custoProLabore,
  brl,
} from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRÓ-LABORE (P8 ver + P9 ajustar) — o diferencial-âncora, em regime (27/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * O líder tem um SELETOR DE PRESET cru. A gente tem o INTERATIVO: mexeu, o custo
 * muda na hora. Reusa a engine `lib/fiscal` (a mesma do N18/simulador do wizard),
 * agora no portal, com dado real (faturamento médio + pró-labore atual).
 *
 * ─── O ENQUADRAMENTO QUE MANDA: "sai do seu bolso por mês" = imposto + INSS ──
 * Pró-labore alto = mais INSS, mas segura o Fator R (imposto menor). Pró-labore
 * baixo = menos INSS, mas arrisca cair no Anexo V (imposto DOBRA). A soma
 * imposto+INSS tem um vale — o ponto ótimo. É o que a tela mostra ao vivo.
 *
 * Regras herdadas do N18: "Fator R" some pro leigo (vira "quanto se paga" e "%
 * do que fatura") · sugestão mira 30% (colchão), NÃO crava 28% · aviso de borda
 * (warning, nunca coral) · carimbo de estimativa · memória de cálculo em expander.
 * ⚠️ Números = FAROL (engine espelho; o cálculo real vem do backend).
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Estado regime (mock coerente com a engine): faturamento médio mensal + o
// pró-labore atual. 1700/6000 = 28,3% → NA BORDA: tecnicamente no imposto menor,
// mas um mês fraco derruba pro Anexo V. É o cenário que mostra o valor do
// monitoramento (a lição da cobaia). O slider desce até o Anexo V (imposto dobra)
// e sobe até a folga — os dois avisos ficam alcançáveis.
const FAT = 6000;
const ATUAL = 1700;

type Calc = {
  folhaPct: number;
  emIII: boolean;
  aliquota: number;
  imposto: number;
  inss: number;
  total: number;
  economia: number; // vs pagar Anexo V (o imposto cheio)
  borda: boolean;
};

function calcular(pl: number): Calc {
  const folhaPct = pl / FAT;
  const emIII = folhaPct >= FISCAL.FATOR_R_LIMIAR;
  const aliquota = emIII ? FISCAL.ANEXO_III : FISCAL.ANEXO_V;
  const imposto = Math.round(aliquota * FAT);
  const inss = custoProLabore(pl).inss;
  const impostoV = Math.round(FISCAL.ANEXO_V * FAT);
  return {
    folhaPct,
    emIII,
    aliquota,
    imposto,
    inss,
    total: imposto + inss,
    economia: impostoV - imposto,
    borda: naBorda(folhaPct),
  };
}

const OTIMO = proLaboreOtimo(FAT);
const MAXSLIDER = Math.round(FAT * 0.5);

export default function ProLaborePage() {
  const [pl, setPl] = useState<number>(ATUAL);

  const atual = calcular(ATUAL);
  const sim = calcular(pl);
  const deltaTotal = sim.total - atual.total; // - = economiza vs hoje
  const mexeu = pl !== ATUAL;
  const irrfZero = pl <= FISCAL.IRRF_ISENCAO;
  const subir = ATUAL < OTIMO; // direção do ajuste sugerido

  // Selo do estado atual (no hero escuro): borda = aviso, dentro = ok, fora = cheio.
  const selo = atual.borda
    ? { txt: "No limite", cls: "bg-state-warning/20 text-state-warning" }
    : atual.emIII
      ? { txt: "Imposto menor", cls: "bg-state-success/20 text-state-success" }
      : { txt: "Imposto cheio", cls: "bg-state-danger/20 text-state-danger" };

  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-6">
          {/* Título */}
          <div>
            <h1 className="text-h1 text-text-primary">Seu pró-labore</h1>
            <p className="mt-1 text-body text-text-secondary">
              Quanto você se paga por mês. Esse número decide o seu imposto, e a
              gente deixa você ver o efeito na hora.
            </p>
          </div>

          {/* ── P8: estado atual (hero) ── */}
          <div className="rounded-2xl bg-surface-dark p-5 text-text-on-dark">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-caption text-text-on-dark/70">
                  Você se paga hoje
                </p>
                <p className="mt-0.5 text-display font-bold leading-none">
                  {brl(ATUAL)}
                </p>
                <p className="mt-1 text-micro text-text-on-dark/60">por mês</p>
              </div>
              <span
                className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-micro font-semibold ${selo.cls}`}
              >
                {atual.emIII && !atual.borda && <IconeCheck />}
                {selo.txt}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-micro text-text-on-dark/60">Imposto do mês</p>
                <p className="mt-0.5 text-body font-bold">{brl(atual.imposto)}</p>
              </div>
              <div>
                <p className="text-micro text-text-on-dark/60">
                  Economia vs imposto cheio
                </p>
                <p className="mt-0.5 text-body font-bold text-state-success">
                  {brl(atual.economia)}/mês
                </p>
              </div>
            </div>
          </div>

          {/* Insight proativo (bidirecional): borda/baixo → suba pra ganhar
              folga; acima do ótimo → afine e economize INSS. */}
          {ATUAL !== OTIMO && (
            <button
              type="button"
              onClick={() => setPl(OTIMO)}
              className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-tint-brand p-4 text-left transition-colors active:opacity-90"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
                <IconeFaisca />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-text-primary">
                  {subir ? "Ganhe uma folga" : "Dá pra afinar"}
                </p>
                <p className="text-micro text-text-secondary">
                  {subir
                    ? `Você está no limite. Pague ${brl(OTIMO)} e a empresa fica longe do imposto maior, mesmo num mês fraco. Toca pra ver.`
                    : `Se pagar ${brl(OTIMO)}, você mantém o imposto menor e recolhe menos INSS. Toca pra ver.`}
                </p>
              </div>
              <span className="shrink-0 text-action-primary-sm">
                <IconeChevron />
              </span>
            </button>
          )}

          {/* ── P9: ajustar (interativo) ── */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <p className="text-body-strong font-semibold text-text-primary">
              E se você mudasse?
            </p>
            <p className="mt-0.5 text-micro text-text-tertiary">
              Arraste e veja quanto sai do seu bolso por mês.
            </p>

            {/* Herói vivo: sai do bolso = imposto + INSS */}
            <div className="mt-4 rounded-2xl bg-surface-alt p-4 text-center">
              <p className="text-micro text-text-tertiary">
                Sai do seu bolso por mês
              </p>
              <p className="mt-1 text-display font-bold text-text-primary">
                {brl(sim.total)}
              </p>
              <div className="mt-1 flex items-center justify-center gap-1 text-micro">
                {mexeu ? (
                  deltaTotal === 0 ? (
                    <span className="text-text-tertiary">igual a hoje</span>
                  ) : deltaTotal < 0 ? (
                    <span className="font-semibold text-state-success-text">
                      economiza {brl(-deltaTotal)}/mês vs hoje
                    </span>
                  ) : (
                    <span className="font-semibold text-state-warning-text">
                      {brl(deltaTotal)}/mês a mais que hoje
                    </span>
                  )
                ) : (
                  <span className="text-text-tertiary">é o que você paga hoje</span>
                )}
              </div>
              {/* quebra imposto + INSS */}
              <div className="mt-3 flex justify-center gap-4 border-t border-border-hairline pt-3 text-caption">
                <span className="text-text-secondary">
                  Imposto{" "}
                  <span
                    className={`font-semibold ${
                      sim.emIII ? "text-text-primary" : "text-state-danger-text"
                    }`}
                  >
                    {brl(sim.imposto)}
                  </span>
                </span>
                <span className="text-text-secondary">
                  INSS{" "}
                  <span className="font-semibold text-text-primary">
                    {brl(sim.inss)}
                  </span>
                </span>
              </div>
            </div>

            {/* Controle */}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-body-strong font-semibold text-text-primary">
                {brl(pl)}
              </span>
              <span className="text-caption text-text-tertiary">
                {(sim.folhaPct * 100).toFixed(0)}% do que você fatura
              </span>
            </div>
            <input
              type="range"
              min={FISCAL.SALARIO_MIN}
              max={MAXSLIDER}
              step={1}
              value={pl}
              onChange={(e) => setPl(Number(e.target.value))}
              aria-label="Quanto você se paga por mês"
              className="mt-2 w-full accent-[var(--color-action-primary)]"
            />
            <div className="mt-1 flex justify-between text-micro text-text-tertiary">
              <span>mín. {brl(FISCAL.SALARIO_MIN)}</span>
              <span>{brl(MAXSLIDER)}</span>
            </div>

            {/* Sugestão (mira 30%) */}
            <button
              type="button"
              onClick={() => setPl(OTIMO)}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-border-hairline bg-surface-alt p-3 text-left transition-colors hover:border-border-strong"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                <IconeAlvo />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-text-primary">
                  Nossa sugestão: {brl(OTIMO)}
                </p>
                <p className="text-micro text-text-tertiary">
                  O menor custo com uma folga de segurança. Toca pra usar.
                </p>
              </div>
              {pl === OTIMO && (
                <span className="shrink-0 text-state-success-text">
                  <IconeCheck />
                </span>
              )}
            </button>

            {/* Aviso de borda (warning, nunca coral) */}
            {sim.borda && (
              <div className="mt-3 rounded-2xl bg-state-warning-tint p-3">
                <p className="text-caption font-semibold text-state-warning-text">
                  Você está encostado no limite
                </p>
                <p className="mt-0.5 text-micro text-text-secondary">
                  Tecnicamente no imposto menor, mas um mês em que você se pagar
                  menos joga a empresa pro imposto maior no ano inteiro. A
                  sugestão deixa uma folga.
                </p>
              </div>
            )}

            {/* Caiu no Anexo V (imposto cheio) */}
            {!sim.emIII && (
              <div className="mt-3 rounded-2xl bg-state-danger-tint p-3">
                <p className="text-caption font-semibold text-state-danger-text">
                  Aqui o imposto dobra
                </p>
                <p className="mt-0.5 text-micro text-text-secondary">
                  Se pagar menos que {(FISCAL.FATOR_R_LIMIAR * 100).toFixed(0)}% do
                  que fatura, sua empresa sai do imposto menor. Economiza INSS,
                  mas paga muito mais de imposto.
                </p>
              </div>
            )}

            {irrfZero && (
              <p className="mt-3 flex items-center gap-1.5 text-micro text-state-success-text">
                <IconeCheck />
                Sem imposto de renda sobre esse valor.
              </p>
            )}

            {/* Memória de cálculo */}
            <details className="mt-3 rounded-2xl border border-border-hairline">
              <summary className="cursor-pointer list-none p-3 text-caption font-semibold text-text-secondary">
                Ver a conta
              </summary>
              <div className="flex flex-col gap-2 px-3 pb-3">
                <Linha rotulo="Você fatura (média/mês)" valor={brl(FAT)} />
                <Linha rotulo="Você se paga" valor={brl(pl)} />
                <Linha
                  rotulo="Isso dá, do que fatura"
                  valor={`${(sim.folhaPct * 100).toFixed(1)}%`}
                />
                <Linha
                  rotulo="A partir de 28%, o imposto cai"
                  valor={sim.emIII ? "você está dentro" : "você está fora"}
                />
                <div className="border-t border-border-hairline pt-2">
                  <Linha
                    rotulo="Imposto do Simples"
                    valor={`${(sim.aliquota * 100).toFixed(1)}% = ${brl(sim.imposto)}`}
                    forte
                  />
                  <Linha rotulo="INSS do pró-labore" valor={brl(sim.inss)} forte />
                </div>
              </div>
            </details>

            <p className="mt-3 text-micro text-text-tertiary">
              Estimativa. A gente confirma com o contador antes de registrar
              qualquer mudança.
            </p>
          </div>

          {/* "Número vivo" — a tese (igual à alíquota) */}
          <div className="flex gap-2.5 rounded-2xl bg-surface-tint-brand p-4">
            <span className="mt-0.5 shrink-0 text-action-primary-sm">
              <IconeOlho />
            </span>
            <p className="text-caption text-text-secondary">
              <span className="font-semibold text-text-primary">
                A gente vigia isso por você.
              </span>{" "}
              Todo mês esse número muda com seu faturamento. Se sair do ponto, você
              é o primeiro a saber, antes de virar imposto a mais.
            </p>
          </div>

          {/* CTA — aplicar mudança é ato real → canal humano */}
          {mexeu && pl !== ATUAL && (
            <Link
              href="/mais"
              className="flex items-center justify-center gap-2 rounded-2xl bg-action-primary p-4 text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
            >
              Quero ajustar pra {brl(pl)}
              <IconeSeta />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─── linha da conta ───────────────────────────────────────────────────────── */
function Linha({
  rotulo,
  valor,
  forte = false,
}: {
  rotulo: string;
  valor: string;
  forte?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span
        className={`text-caption ${
          forte ? "font-semibold text-text-primary" : "text-text-secondary"
        }`}
      >
        {valor}
      </span>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeCheck(): ReactNode {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeFaisca(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c.6 3.5 2 4.9 5.5 5.5C14 8.1 12.6 9.5 12 13c-.6-3.5-2-4.9-5.5-5.5C10 6.9 11.4 5.5 12 2z" />
      <path d="M18.5 13c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z" />
    </svg>
  );
}
function IconeAlvo(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconeOlho(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconeChevron(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IconeSeta(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
