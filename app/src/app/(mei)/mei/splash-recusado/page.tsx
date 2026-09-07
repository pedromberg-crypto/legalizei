"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * M6.SR — SPLASH "PAGAMENTO RECUSADO" do ramo MEI.
 *
 * 🆕 07/09 (pedido do Pedro). Era o buraco da família de splashes do MEI: ela
 * só sabia dizer que deu certo. Mesmo layout dos outros dois, pele ESCURA com
 * gradiente coral (`variante="recusado"`) — recusa com a mesma cara do sucesso
 * faz a pessoa ler o layout antes da palavra e comemorar errado.
 *
 * Transitório e sem CTA: a decisão (outro cartão, trocar pra Pix) é da tela
 * seguinte, que é o M6 com o aviso da recusa no topo.
 *
 * ✍️ A copy não culpa a pessoa nem o banco: recusa de cartão tem dezenas de
 * causas e nenhuma delas chega até aqui como motivo legível.
 */
function SplashRecusadoConteudo() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/mei/pagamento?retry=1";

  return (
    <SplashMensagemView
      variante="recusado"
      titulo="O pagamento não passou."
      sub="Acontece, e não é com você. Vamos tentar de outro jeito."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}

export default function SplashRecusadoMeiPage() {
  return (
    <Suspense>
      <SplashRecusadoConteudo />
    </Suspense>
  );
}
