"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E5F.1 — SPLASH "CONSEGUIMOS TE ATENDER" · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash-mensagem.tsx` (`SplashMensagemView`).
 * Esta page é o wrapper: guarda o `next` (destino já resolvido pelo E5F, com
 * todas as flags — mei/endereco/categoria) e auto-navega pra lá.
 *
 * 🆕 30/08 — TELA NOVA (pedido do Pedro). Transitória, poucos segundos, SEM
 * CTA. Confirma que a faixa de faturamento informada é atendida, antes de
 * pedir a conta (E6). Arte provisória — Pedro revisa depois.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashAtendidoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/conta";

  return (
    <SplashMensagemView
      titulo="Conseguimos te atender."
      sub="Falta só criar sua conta pra ver o plano."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
