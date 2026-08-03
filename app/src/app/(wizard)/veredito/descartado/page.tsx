"use client";

import { useRouter } from "next/navigation";
import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🔴 FORA DE ESCOPO (descarta).
 * 🆕 28/07 (reunião Rua Satélite 9). O 🔴 virou 2 destinos: este é o caso
 * "ninguém atende" — nem a gente, nem é regulamentado (waitlist), nem a
 * Legalize Digital do Mauro atende (`/veredito/nao-atende`). Decisão
 * explícita de descartar, não omissão. Sem template de captura — não tem
 * pra onde rotear, então `VereditoView` desvia pro decline limpo.
 *
 * 🆕 03/08 — UX-64 mesclado PARCIAL (fonte: /apresentacao): "Voltar ao
 * início" ligado (real aqui, `/entrada`). "Ler o blog"/"Conhecer o site"
 * ficam de fora — rota pública ainda não existe.
 */
const R: Resultado = {
  humano: "Atividade fora do nosso escopo",
  explica: "Esse tipo de atividade não é regulamentado nem é comércio, mas também não é algo que a gente ou nosso parceiro atenda.",
  cnae: "0000-0/00",
  veredito: "nao-atende",
  motivo: "descarta",
};

export default function VereditoDescartadoPage() {
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
