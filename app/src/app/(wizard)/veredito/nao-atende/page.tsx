"use client";

import { useRouter } from "next/navigation";
import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🔴 CONTATO ESPECIAL (atendido pelo Mauro).
 * ⚠️ 28/07 (reunião Rua Satélite 9): relabel — era "Comercial Mauro". O 🔴
 * virou 2 destinos (`motivo`); este é o caso "não atendemos, MAS a Legalize
 * Digital atende". O outro (`descarta`, ninguém atende) é a página VD nova.
 * Sai pelo TEMPLATE de saída graciosa (A9). ⚠️ Coral nunca é erro: usa token
 * de estado.
 *
 * 🆕 03/08 — UX-64 mesclado PARCIAL (fonte: /apresentacao): "Voltar ao
 * início" ligado (real aqui, `/entrada`). "Ler o blog"/"Conhecer o site"
 * ficam de fora — rota pública ainda não existe.
 */
const R: Resultado = {
  humano: "Comércio",
  explica: "Você vende produtos, não serviço. A gente só atende quem presta serviço.",
  cnae: "4713-0/02",
  veredito: "nao-atende",
  motivo: "mauro",
};

export default function VereditoNaoAtendePage() {
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
