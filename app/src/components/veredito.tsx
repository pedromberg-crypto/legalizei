"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti } from "@/components/confetti";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQUÉTIPO A2 — VEREDITO 🟢/🟡/🔴
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte ÚNICA do veredito do CNAE. Vivia dentro do gate (N4); extraído em
 * 17/07 pra o gate E a esteira A2 do /mockup usarem o MESMO componente — não
 * duas cópias que divergem (a regra "muda num lugar, muda em todos").
 *
 * Regra de ouro (spec T4): NUNCA dar veredito com baixa confiança. Aqui o mock
 * sempre tem confiança alta; no motor, baixa confiança dispara b1.desambiguacao
 * ANTES de chegar aqui.
 *
 * ⚠️ Coral NUNCA é erro: 🟡/🔴 usam os tokens de ESTADO, nunca o coral.
 *
 * 🔗 Fronteira com A9: os ramos 🟡 (waitlist) e 🔴 (comercial) são entregues
 * pelo TEMPLATE de saída graciosa (barra + explica + captura + roteia). Hoje
 * moram aqui; quando A9 for construído, viram o componente SaidaGraciosa e este
 * arquivo passa a delegar. 5 saídas usam esse mesmo template (mapa-ramificacoes).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Veredito = "atende" | "waitlist" | "nao-atende";

export interface Resultado {
  humano: string;
  explica: string;
  cnae: string;
  anexo: string;
  veredito: Veredito;
}

export function VereditoView({
  r,
  onRefazer,
  onSeguir,
}: {
  r: Resultado;
  // Opcionais: o gate passa a navegação real; o mock do /mockup não precisa.
  onRefazer?: () => void;
  onSeguir?: () => void;
}) {
  const [celebrar, setCelebrar] = useState(false);

  if (r.veredito === "atende") {
    return (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-state-success-tint
                             flex items-center justify-center text-state-success-text
                             text-caption font-bold">
              ✓
            </span>
            <p className="text-caption font-semibold text-state-success-text">
              Achei o seu encaixe
            </p>
          </div>

          <Card>
            {/* UX-05: linguagem humana ANTES do código. O leigo não decora número. */}
            <h2 className="text-h2 mb-1">{r.humano}</h2>
            <p className="text-body text-text-secondary mb-4">{r.explica}</p>
            <div className="pt-3 border-t border-border-hairline">
              <p className="text-micro text-text-tertiary mb-0.5">
                Sua atividade na Receita
              </p>
              <p className="text-caption text-text-secondary">
                CNAE {r.cnae} · {r.anexo}
              </p>
            </div>
          </Card>

          <p className="text-body text-text-secondary mt-4">
            É disso que a gente cuida, do jeito certo, no Simples.
          </p>
        </div>

        <div className="app-footer-cta">
          {/* 🌾 colhido: "refazer" ACIMA do CTA, sem perder o texto digitado.
              Ao celebrar, some INSTANTÂNEO (invisible, sem transição): a pessoa
              já confirmou, não faz sentido oferecer voltar durante o confete. É
              `invisible`, não removido, pra não dar reflow e empurrar o burst. */}
          <div className={`flex justify-center mb-1 ${celebrar ? "invisible" : ""}`}>
            <Button variant="ghost" onClick={onRefazer}>
              Não é bem isso, refazer
            </Button>
          </div>
          {/* UX-14: dizer em 1 linha o que vem agora, senão o leigo hesita.
              🌾 colhido: ao confirmar, o botão ENCOLHE até virar um ponto e o
              confete (Lottie da marca) assume o círculo ali no rodapé — não é
              full-screen, explode sobre o próprio CTA. No /mockup onSeguir é
              vazio → o confete toca, o botão volta, e você revê tocando de novo. */}
          <div className="relative">
            <div
              style={{
                transition:
                  "transform .32s cubic-bezier(.22,1,.36,1), opacity .32s",
                transformOrigin: "center",
                transform: celebrar ? "scale(.18)" : "scale(1)",
                opacity: celebrar ? 0 : 1,
              }}
            >
              <Button full disabled={celebrar} onClick={() => setCelebrar(true)}>
                É isso mesmo
              </Button>
            </div>
            {celebrar && (
              <Confetti
                onDone={() => {
                  setCelebrar(false);
                  onSeguir?.();
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  // 🟡 waitlist e 🔴 comercial compartilham o TEMPLATE de saída graciosa (A9):
  // barra + explica + captura + roteia. O mapa-ramificacoes já tinha achado que
  // 5 saídas usam 1 template só — aqui elas de fato usam.
  const waitlist = r.veredito === "waitlist";
  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Card tint={false} className="border-border-strong">
          <h2 className="text-h2 mb-2">
            {waitlist ? "Ainda não, mas falta pouco" : "Seu caso pede um humano"}
          </h2>
          <p className="text-body text-text-secondary mb-3">
            {waitlist
              ? "Sua atividade precisa de responsável técnico registrado no conselho. A gente ainda não abre esse tipo sozinho, e não vamos fingir que abre."
              : "Você vende produto, e a gente cuida de quem vive de prestar serviço. Nosso time contábil resolve o seu caso."}
          </p>
          <p className="text-caption text-text-tertiary">
            CNAE {r.cnae} · {r.anexo}
          </p>
        </Card>

        {/* UX-22: waitlist não pode ser beco. Dar o "enquanto isso". */}
        <p className="text-body text-text-secondary mt-4">
          {waitlist
            ? "Quer ser o primeiro a saber quando abrir?"
            : "Quer que a gente te conecte agora?"}
        </p>
      </div>

      <div className="app-footer-cta">
        <div className="flex justify-center mb-1">
          <Button variant="ghost" onClick={onRefazer}>
            Não é bem isso, refazer
          </Button>
        </div>
        <Button full variant="dark">
          {waitlist ? "Me avisa quando abrir" : "Falar com o time"}
        </Button>
      </div>
    </>
  );
}
