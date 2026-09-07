"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusMeiView } from "@/components/mei/status";
import { proxima } from "@/lib/mei-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M12 — ACOMPANHAMENTO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/status.tsx`.
 *
 * `?etapa=` move a timeline pra review (0..3). Sem ele, começa na conferência
 * (índice 1), que é o estado real logo depois de autorizar.
 *
 * 🔄 07/09 — substitui `/painel?regime=mei`. Aquela rota tinha o pipeline
 * certo mas ficou inalcançável em 31/08, quando o status do ME migrou pro
 * `/aguardando?fase=junta` e levou a navegação do MEI junto. A rota antiga
 * segue viva pro Migrar, que a usa por outro caminho e não muda.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/status";

function StatusConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("etapa");
  const emAndamento = param !== null ? Math.min(Math.max(Number(param), 0), 3) : 1;

  /* 🆕 07/09 — a MESMA rota cobre as 2 fases, como o `/aguardando?fase=` do
     ME. `?fase=certificado` é o 2º pagamento; `?certificado=` diz em qual dos
     3 estados ele está (pendente · boleto compensando · pago). */
  const fase = searchParams.get("fase") === "certificado" ? "certificado" : "abertura";
  const est = searchParams.get("certificado");
  const certificado =
    est === "boleto" || est === "pronto" || est === "liberado" ? est : "pendente";

  return (
    <StatusMeiView
      fase={fase}
      certificado={certificado}
      emAndamento={emAndamento}
      onVerProximosPassos={() => router.push(proxima(ROTA))}
      onPagarCertificado={() => router.push("/mei/certificado/pagar")}
      /* O único ponto em que a fase do certificado volta a andar: com ele
         emitido, a casa finalmente é o destino (`SAIDA_MEI`). */
      onEntrar={() => router.push(proxima("/mei/certificado"))}
      /* 🚧 mock (RF-01): sem provedor. Os 2 chips voltam pro pagamento do
         certificado com o método já escolhido — o mais perto do real sem
         inventar documento que não existe. */
      onVerBoleto={() => router.push("/mei/certificado/pagar?metodo=boleto")}
      onPagarPix={() => router.push("/mei/certificado/pagar?metodo=pix")}
    />
  );
}

export default function StatusMeiPage() {
  return (
    <Suspense>
      <StatusConteudo />
    </Suspense>
  );
}
