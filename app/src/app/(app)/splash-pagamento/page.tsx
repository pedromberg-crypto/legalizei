"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E9.S — SPLASH "PAGAMENTO CONFIRMADO" · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash-mensagem.tsx` (`SplashMensagemView`).
 * Esta page é o wrapper: guarda o `next` (`/aguardando?pago=1`, com as demais
 * flags já resolvidas pelo `/pagamento`) e auto-navega pra lá.
 *
 * 🆕 30/08 — TELA NOVA (pedido do Pedro). Transitória, poucos segundos, SEM
 * CTA. 🔴 REVOGA a regra antiga "cartão/Pix pulam direto pro C0": agora todo
 * método de pagamento passa por uma tela de status (E9.1/E9.1P) antes de
 * seguir — ninguém pula direto. Fica no shell APP (não WIZARD): o pagamento
 * já caiu, a casa já nasceu (mesma fronteira do `/aguardando`).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashPagamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/aguardando?pago=1";

  return (
    <SplashMensagemView
      titulo="Pagamento confirmado."
      sub="Sua abertura já começou."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
