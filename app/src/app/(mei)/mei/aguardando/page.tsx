"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AguardandoMeiView } from "@/components/mei/aguardando";
import { proxima } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M6.1 / M6.1P — STATUS INTERMEDIÁRIO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/aguardando.tsx`.
 *
 * Uma rota, 2 estados, pelo mesmo padrão do `/aguardando` do ME:
 *   · `/mei/aguardando`         → boleto pendente (M6.1);
 *   · `/mei/aguardando?pago=1`  → pago por cartão/Pix (M6.1P).
 *
 * O mock decide por query; no app real quem fecha é o webhook do provedor.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function AguardandoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  return (
    <AguardandoMeiView
      pago={searchParams.get("pago") === "1"}
      /* Derivado da espinha, nao escrito a mao: tela nova entre o pagamento e
         a ocupacao passa a ser o destino daqui sozinha. */
      onSeguir={() => router.push(comCategoria(proxima("/mei/pagamento"), categoria))}
      /* 🚧 mock (RF-01): sem provedor ainda. Ver o boleto e adiantar por Pix
         voltam pro pagamento com o método já escolhido, que é o mais perto do
         comportamento real sem inventar documento que não existe. */
      onVerBoleto={() => router.push("/mei/pagamento?metodo=boleto")}
      onPagarPix={() => router.push("/mei/pagamento?metodo=pix")}
    />
  );
}

export default function AguardandoMeiPage() {
  return (
    <Suspense>
      <AguardandoConteudo />
    </Suspense>
  );
}
