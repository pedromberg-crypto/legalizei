"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * M6.SB — SPLASH "BOLETO GERADO" do ramo MEI.
 *
 * ⚠️ O boleto NÃO trava o cadastro, e a frase precisa dizer isso: no ME o
 * dossiê também segue liberado, mas lá a espera do boleto atrasa o registro na
 * Junta. Aqui não atrasa nada — o registro depende do titular, não do
 * pagamento. Deixar a pessoa achando que parou seria criar uma espera que não
 * existe.
 */
function SplashBoletoConteudo() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/mei/ocupacao";

  return (
    <SplashMensagemView
      titulo="Boleto gerado."
      sub="Mandamos no seu WhatsApp. Pode seguir montando seu cadastro enquanto ele compensa."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}

export default function SplashBoletoMeiPage() {
  return (
    <Suspense>
      <SplashBoletoConteudo />
    </Suspense>
  );
}
