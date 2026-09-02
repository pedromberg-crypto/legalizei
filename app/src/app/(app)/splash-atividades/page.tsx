"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C5.1 — SPLASH "JÁ SABEMOS O QUE VOCÊ FAZ" · fecho do bloco ATIVIDADE
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash-mensagem.tsx` (`SplashMensagemView`).
 * Esta page é o wrapper: guarda o `next` (destino já resolvido pela C5, com as
 * flags) e auto-navega pra lá.
 *
 * 🆕 02/09 (pedido do Pedro) — nasceu junto da remoção do veredito do caminho.
 * Com a C0 assumindo o trabalho da C0.2/C0.3, o momento de alívio ("Achei o
 * seu encaixe", com o check verde) sumiu do flow. Ele volta AQUI, e num lugar
 * melhor: em vez de confirmar UMA escolha que a pessoa acabou de fazer com o
 * dedo, fecha o assunto ATIVIDADE inteiro — principal e secundárias — antes de
 * o dossiê virar a página pros dados pessoais (C1).
 *
 * É o primeiro "fecho de bloco" do dossiê. Se o padrão pegar, os outros blocos
 * (dados, empresa) ganham o seu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashAtividadesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dossie/socio";

  return (
    <SplashMensagemView
      titulo="Já sabemos o que você faz."
      sub="Atividade principal e secundárias definidas. Agora, seus dados."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
