"use client";

import { useRouter } from "next/navigation";
import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🟡 WAITLIST (regulada).
 * Entregue pelo TEMPLATE de saída graciosa (A9): barra + explica + captura +
 * roteia. Não é "não" — é "ainda não pra sua atividade". UX-22: dar o
 * "enquanto isso", nunca virar beco.
 *
 * 🆕 03/08 — UX-64 mesclado PARCIAL (fonte: /apresentacao): "Voltar ao
 * início" ligado (real aqui, `/entrada`). "Ler o blog"/"Conhecer o site"
 * ficam de fora — rota pública ainda não existe (nem no repo `legalizai-site`).
 */
const R: Resultado = {
  humano: "Atividade regulamentada",
  explica: "Sua área precisa de responsável técnico registrado no conselho.",
  cnae: "8650-0/02",
  veredito: "waitlist",
};

export default function VereditoWaitlistPage() {
  const router = useRouter();

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>
      <main className="app-main">
        <VereditoView
          r={R}
          acoesConfirmacao={[
            { label: "Voltar ao início", variante: "ghost", onClick: () => router.push("/entrada") },
          ]}
        />
      </main>
    </>
  );
}
