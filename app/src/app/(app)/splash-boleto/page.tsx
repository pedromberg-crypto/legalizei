"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E9.SB — SPLASH "BOLETO GERADO" · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash-mensagem.tsx` (`SplashMensagemView`) —
 * mesmíssimo componente do E9.S ("Pagamento confirmado"). Esta page é o
 * wrapper: guarda o `next` e auto-navega.
 *
 * 🆕 31/08 (pedido do Pedro) — TELA NOVA, par simétrico do E9.S: quem paga por
 * cartão/Pix vê "Pagamento confirmado" e cai no `/aguardando?pago=1`; quem
 * escolhe BOLETO não pode ver a mesma copy (nada foi pago ainda), então vê
 * "Boleto gerado" e cai no `/aguardando` sem o flag `pago` — a E9.1 de sempre,
 * com o CTA de continuar travado até compensar.
 *
 * Transitória, poucos segundos, SEM CTA — igual ao E9.S.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashBoletoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/aguardando";

  return (
    <SplashMensagemView
      titulo="Boleto gerado."
      sub="Assim que ele compensar, a gente continua."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
