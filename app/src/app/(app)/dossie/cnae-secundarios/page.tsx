"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N14 — CNAE SECUNDÁRIOS · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 10 (2.5) · mapa T10→N14
 * Motor: b2.coleta (cnae secundários)
 *
 * Regras da spec:
 *   · CNAE principal HERDADO do N4 — travado, mostrado no topo, não editável.
 *   · Secundários sugeridos pela IA com toggle + prova social ("comum nessa
 *     atividade").
 *   · Secundário que QUEBRA o recorte (regulada/comércio) → pill de aviso, não
 *     some silencioso.
 *
 * 🚧 IA dublada: as sugestões e o "comum como secundário" são mock. No motor a
 * lista vem do cruzamento da atividade; aqui é fixa pra provar o fluxo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Herdado do N4 (mock). No app real vem do estado do wizard.
const PRINCIPAL = {
  cnae: "6201-5/02",
  humano: "Criação de sites e web design",
};

interface Sugestao {
  id: string;
  cnae: string;
  humano: string;
  prova: string;
  // "fora do recorte" = regulada/comércio: entra com aviso, não silencioso.
  fora?: string;
}

const SUGESTOES: Sugestao[] = [
  {
    id: "s1",
    cnae: "6202-3/00",
    humano: "Sistemas de computador sob encomenda",
    prova: "Comum como secundário de quem faz site.",
  },
  {
    id: "s2",
    cnae: "7311-4/00",
    humano: "Agência de publicidade",
    prova: "Aparece muito junto de web design.",
  },
  {
    id: "s3",
    cnae: "6311-9/00",
    humano: "Hospedagem de sites",
    prova: "Quem entrega site costuma hospedar também.",
  },
  {
    id: "s4",
    cnae: "4751-2/01",
    humano: "Comércio de equipamentos de informática",
    prova: "Se você revende produtos.",
    fora: "Isso é comércio. Ele muda o imposto e sai do nosso happy path.",
  },
];

export default function CnaeSecundariosPage() {
  const [ativos, setAtivos] = useState<Record<string, boolean>>({});

  function alterna(id: string) {
    setAtivos((a) => ({ ...a, [id]: !a[id] }));
  }

  const algumFora = SUGESTOES.some((s) => s.fora && ativos[s.id]);

  return (
    <>
      <TelaHeader meta="Atividades da empresa" />

      <main className="app-main">
        <Titulo sub="A principal já está definida. Marque o que mais você faz, se fizer.">
          Sua empresa faz mais alguma coisa?
        </Titulo>

        <Corpo>
          {/* Principal herdado do N4 — travado. */}
          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              Atividade principal (já definida)
            </p>
            <Card>
              <p className="text-body font-semibold text-text-primary">
                {PRINCIPAL.humano}
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                CNAE {PRINCIPAL.cnae}
              </p>
            </Card>
          </div>

          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              Sugestões pra você (toque pra incluir)
            </p>
            <div className="flex flex-col gap-2">
              {SUGESTOES.map((s) => {
                const on = !!ativos[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => alterna(s.id)}
                    className={`rounded-md border p-3 text-left transition-colors
                      ${
                        on
                          ? "border-border-focus bg-surface-tint-brand"
                          : "border-border-hairline bg-surface-card hover:border-border-strong"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-body font-semibold text-text-primary">
                          {s.humano}
                        </p>
                        <p className="text-caption text-text-secondary mt-0.5">
                          CNAE {s.cnae}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold
                          ${
                            on
                              ? "bg-action-primary text-text-on-brand"
                              : "border border-border-strong text-text-tertiary"
                          }`}
                        aria-hidden
                      >
                        {on ? "✓" : "+"}
                      </span>
                    </div>
                    <p className="text-micro text-text-tertiary mt-2">{s.prova}</p>
                    {/* Aviso que NÃO some silencioso quando quebra o recorte. */}
                    {s.fora && on && (
                      <p className="text-micro text-state-warning-text mt-2">
                        {s.fora}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {algumFora && (
            <Aviso variante="warning" titulo="Uma escolha muda seu enquadramento">
              Você marcou uma atividade de comércio. Dá pra seguir, mas ela pode
              tirar você do Simples mais barato. Nosso time confirma antes de
              registrar.
            </Aviso>
          )}

          <p className="text-micro text-text-tertiary">
            Sem secundárias também está ótimo. Você pode adicionar depois.
          </p>
        </Corpo>

        <Rodape>
          <Button full>Continuar</Button>
        </Rodape>
      </main>
    </>
  );
}
