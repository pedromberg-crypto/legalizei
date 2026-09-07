"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * M6.S — SPLASH "PAGAMENTO CONFIRMADO" do ramo MEI.
 *
 * ✍️ A copy do ME diz *"Com a guia paga, a Junta pode registrar sua empresa"*.
 * No MEI não existe guia nem Junta — a frase precisa dizer o que de fato mudou
 * pra ele: a conferência humana começa agora. Repetir a boa notícia do
 * pagamento sem dizer o que ela destrava seria splash sem função.
 */
function SplashPagamentoConteudo() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/mei/ocupacao";

  return (
    <SplashMensagemView
      titulo="Pagamento confirmado."
      sub="Agora é montar seu cadastro. Falta pouco."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}

export default function SplashPagamentoMeiPage() {
  return (
    <Suspense>
      <SplashPagamentoConteudo />
    </Suspense>
  );
}
