"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N14 — CNAE SECUNDÁRIOS · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 10 (2.5) · mapa T10→N14
 * Motor: b2.coleta (cnae secundários)
 *
 * ─── REGRA ESTRUTURAL (decisão do Pedro, 2026-07-21) ─────────────────────
 * SÓ sugere secundárias **similares** e de **MESMO IMPOSTO** que a principal:
 * mesmo Anexo do Simples + mesma dependência de Fator R. Assim, incluir uma
 * secundária NUNCA muda o que o cliente paga.
 *
 * Isto REVERTE a regra antiga ("secundário que quebra o recorte entra com
 * aviso"). O que muda o regime **não aparece aqui — nem com aviso.** Dois
 * motivos:
 *   1. Quem revende produto é COMÉRCIO, e comércio é barrado lá no N4 (🔴
 *      comercial Mauro). Sugerir um CNAE de comércio numa tela do fluxo
 *      só-serviço contradiz o próprio escopo do produto.
 *   2. Oferecer uma opção que silenciosamente troca o Anexo/Fator R é o
 *      oposto da feature-âncora (que existe pra BAIXAR imposto, não subir).
 *
 * ─── DE ONDE SAEM AS SUGESTÕES ───────────────────────────────────────────
 * No app real: dataset de CNAE filtrado por `anexo == principal.anexo` E
 * `fator_r == principal.fator_r` (contabilizei-cnae-completo.json + ratificação
 * Larissa). Aqui o mock usa exatamente as **vizinhas já vetadas como
 * `mesmo-imposto` no N4** (gate `vizinhas`), pra não inventar equivalência
 * fiscal: 6202 / 6203 / 6204 / 7410. Publicidade (7311) e hospedagem (6311)
 * ficaram DE FORA de propósito — plausíveis, mas não vetadas como mesmo-anexo.
 *
 * 🚧 IA dublada: a lista e o "comum como secundário" são mock. A regra do
 * filtro (mesmo-imposto) é que é definitiva.
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
}

// Todas MESMO-IMPOSTO que a principal (Anexo III/V com Fator R). Nenhuma muda o
// enquadramento — é a condição pra estar nesta lista.
const SUGESTOES: Sugestao[] = [
  {
    id: "s1",
    cnae: "6202-3/00",
    humano: "Sistemas de computador sob encomenda",
    prova: "Comum como secundário de quem faz site.",
  },
  {
    id: "s2",
    cnae: "6204-0/00",
    humano: "Consultoria em tecnologia da informação",
    prova: "Quem entrega site costuma orientar a parte técnica também.",
  },
  {
    id: "s3",
    cnae: "7410-2/99",
    humano: "Design gráfico e identidade visual",
    prova: "Anda junto de web design na maioria dos casos.",
  },
  {
    id: "s4",
    cnae: "6203-1/00",
    humano: "Software pronto (de prateleira)",
    prova: "Se além do site você licencia algum produto seu.",
  },
];

export default function CnaeSecundariosPage() {
  const [ativos, setAtivos] = useState<Record<string, boolean>>({});

  function alterna(id: string) {
    setAtivos((a) => ({ ...a, [id]: !a[id] }));
  }

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
            {/* A garantia vira argumento: incluir não muda o imposto. É o que
                separa esta lista da versão antiga, que sugeria comércio. */}
            <p className="text-caption text-text-secondary mb-2.5">
              Todas ficam no mesmo imposto da sua atividade principal, então
              incluir não muda o que você paga.
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
                  </button>
                );
              })}
            </div>
          </div>

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
