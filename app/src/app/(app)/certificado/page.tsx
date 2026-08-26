"use client";

import { useRouter } from "next/navigation";
import { CertificadoGateView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CERTIFICADO DIGITAL (antes da assinatura) — rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 26/08 (reunião Rua Satélite 36, item 7) — NOVA posição no flow. Entra
 * entre `/painel` (depois que a DAE for paga, ver `components/painel.tsx`) e
 * `/assinatura` — a procuração eletrônica que sai junto da assinatura exige
 * o certificado já validado, então não dá pra deixar pra depois.
 *
 * A TELA vive em `components/wizard-cauda.tsx` (`CertificadoGateView`), mesmo
 * padrão do resto da cauda (view fora, page.tsx só liga a navegação).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function CertificadoGatePage() {
  const router = useRouter();

  return (
    <CertificadoGateView
      onVoltar={() => router.push("/painel")}
      onSeguir={() => router.push("/assinatura")}
    />
  );
}
