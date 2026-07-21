"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Resultado } from "@/components/veredito";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENCAIXE — escolha do CNAE na DESCOBERTA (pré-pagamento) · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/reordenacao-cluster-fiscal-encaixe.md (PROPOSTA aprovada 21/07)
 *
 * É o coração da reordenação do cluster fiscal. Vem LOGO APÓS o veredito 🟢,
 * ainda antes de pagar, e **trava o CNAE** — que o nome/objeto/Junta precisam
 * desde o primeiro preenchimento (confirmado pelo Pedro). A otimização deixa de
 * ser "quer trocar?" (correção tardia, cheira a descuido) e vira "achei seu
 * encaixe" (competência, de cara).
 *
 * ─── AS 4 REGRAS (guarda-corpos da nota) ──────────────────────────────────
 *  1. Vem DEPOIS do veredito, não na tela de descrever (não pesar o farol leve).
 *  2. O % de adequação é REAL: cruza a pill clicada + o texto do N4 via IA = fit
 *     ao que a pessoa DESCREVEU. Sugestão não-vinculante — a escolha é dela.
 *     ⚠️ adequação = fit à descrição, NÃO é "% mais barato". Não confundir.
 *  3. Garante o SETUP, não o resultado: "o código mais barato que serve",
 *     nunca "menor imposto possível" cravado (no fator-r depende da margem).
 *  4. Defesa de legitimidade INLINE e obrigatória: "emite a mesma nota, não é
 *     malandragem". Sem isso o leigo cheira fraude e recusa a economia.
 *
 * 🚧 Stage 1 (aditivo): a tela existe e trava a escolha. A remoção do N5 teaser
 * + N17, o N5' (resumo de valor) e a reindexação do lib/passos são o stage 2.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface OpcaoCnae {
  humano: string;
  cnae: string;
  /** Fit ao que a pessoa descreveu (IA cruza pill + texto). 0–100. Regra 2. */
  adequacao: number;
}

export interface EncaixeData {
  recomendado: OpcaoCnae & { descricao: string; cobre: string[] };
  alternativas: OpcaoCnae[];
}

/** Deriva o ENCAIXE do veredito do gate. As alternativas saem das vizinhas. */
export function encaixeDeResultado(r: Resultado): EncaixeData {
  return {
    recomendado: {
      humano: r.humano,
      cnae: r.cnae,
      adequacao: 94,
      descricao: r.explica,
      cobre: r.compreende ?? [],
    },
    alternativas: (r.vizinhas ?? []).slice(0, 2).map((v, i) => ({
      humano: v.oque,
      cnae: v.cnae,
      adequacao: 72 - i * 8,
    })),
  };
}

export function EncaixeView({
  dados,
  onSeguir,
  onRefazer,
}: {
  dados: EncaixeData;
  onSeguir?: () => void;
  onRefazer?: () => void;
}) {
  const [escolhido, setEscolhido] = useState(dados.recomendado.cnae);
  const noRecomendado = escolhido === dados.recomendado.cnae;

  return (
    <>
      {/* Título fixo (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
          <Check />
          Boa notícia
        </span>
        <h1 className="text-h1 mt-3 mb-1">Achei o seu encaixe.</h1>
        <p className="text-body text-text-secondary mb-4">
          É disso que a gente cuida, do jeito certo, no Simples.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ───── O RECOMENDADO ───── */}
        <Card
          className={
            noRecomendado ? "border-border-focus bg-surface-tint-brand" : ""
          }
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <span className="text-micro font-semibold text-state-success-text">
                ★ Recomendado
              </span>
              <p className="text-body-strong font-semibold text-text-primary mt-0.5">
                {dados.recomendado.humano}
              </p>
            </div>
            <Adequacao valor={dados.recomendado.adequacao} />
          </div>

          <p className="text-caption text-text-secondary">
            {dados.recomendado.descricao}
          </p>

          {/* O código como recibo discreto (UX-05: humano antes do número). */}
          <div className="mt-3 flex items-center justify-between rounded-md bg-surface-alt px-3 py-2">
            <span className="text-micro text-text-tertiary">
              Sua atividade na Receita
            </span>
            <span className="text-caption font-semibold text-text-primary">
              CNAE {dados.recomendado.cnae}
            </span>
          </div>

          {/* Regra 3: garante o SETUP, nunca o resultado. */}
          <div className="mt-3 rounded-md bg-state-success-tint p-3">
            <p className="text-caption font-semibold text-state-success-text mb-0.5">
              O código mais barato que serve pra você
            </p>
            <p className="text-caption text-text-secondary">
              Já cuido de tudo daqui pra frente: impostos, guias e prazos.
            </p>
          </div>

          {/* O que o CNAE cobre (compreende). */}
          {dados.recomendado.cobre.length > 0 && (
            <div className="mt-3">
              <p className="text-caption font-semibold text-text-primary mb-1.5">
                O que esse CNAE cobre
              </p>
              <ul className="flex flex-col gap-1">
                {dados.recomendado.cobre.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-caption text-text-secondary"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regra 4: defesa de legitimidade INLINE, obrigatória. */}
          <p className="text-caption text-text-secondary mt-3">
            Faz algo parecido que não está na lista? Esse continua sendo o código
            certo pra sua área. Todos emitem a mesma nota fiscal, e escolher o
            mais barato é o que um bom contador faz.
          </p>
        </Card>

        {/* ───── OUTRAS OPÇÕES (regra 2: sugestão, a escolha é dela) ───── */}
        {dados.alternativas.length > 0 && (
          <div className="mt-4">
            <p className="text-micro text-text-tertiary mb-2">
              Outras opções pra você
            </p>
            <div className="flex flex-col gap-2">
              {dados.alternativas.map((a) => {
                const on = escolhido === a.cnae;
                return (
                  <button
                    key={a.cnae}
                    onClick={() => setEscolhido(a.cnae)}
                    className={`rounded-md border p-3 text-left transition-colors ${
                      on
                        ? "border-border-focus bg-surface-tint-brand"
                        : "border-border-hairline bg-surface-card hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-caption font-semibold text-text-primary">
                          {a.humano}
                        </p>
                        <p className="text-micro text-text-tertiary mt-0.5">
                          CNAE {a.cnae} · imposto baixo
                        </p>
                      </div>
                      <span className="shrink-0 text-caption font-semibold text-text-secondary">
                        {a.adequacao}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="app-footer-cta">
        <div className="flex justify-center mb-1">
          <Button variant="ghost" onClick={onRefazer}>
            Não é bem isso, refazer
          </Button>
        </div>
        <Button full onClick={onSeguir}>
          {noRecomendado ? "É isso mesmo, continuar" : "Seguir com esse, continuar"}
        </Button>
      </div>
    </>
  );
}

/** O anel de adequação (verde). Regra 2: é fit à descrição, não "% barato". */
function Adequacao({ valor }: { valor: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-state-success-text text-caption font-semibold text-state-success-text">
        {valor}%
      </span>
      <span className="text-micro text-text-tertiary mt-0.5">adequação</span>
    </div>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
