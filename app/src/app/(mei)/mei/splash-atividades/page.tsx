"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * M7.1 — SPLASH "já sabemos o que você faz" do ramo MEI.
 *
 * 🆕 07/09. Fecho do bloco ATIVIDADE, espelhando a C5.1 do ME: ele não
 * confirma UMA escolha, e sim fecha o assunto inteiro (principal +
 * secundárias) antes de o cadastro virar a página pros dados pessoais.
 *
 * ✍️ A copy é própria: a do ME fala em CNAE, e aqui o que foi escolhido é
 * OCUPAÇÃO. Dizer "achamos seu CNAE" no MEI ensinaria a palavra errada —
 * o Portal do Empreendedor nunca vai mostrar esse termo pra ela.
 */
function SplashAtividadesConteudo() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/mei/titular";

  return (
    <SplashMensagemView
      titulo="Já sabemos o que você faz."
      sub="Sua ocupação está escolhida. Agora são só os seus dados."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}

export default function SplashAtividadesMeiPage() {
  return (
    <Suspense>
      <SplashAtividadesConteudo />
    </Suspense>
  );
}
