"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C7.S — SPLASH "NOMES ENVIADOS" · fecho da 2ª rodada de nomes
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash-mensagem.tsx` (`SplashMensagemView`).
 * Esta page é o wrapper: guarda o `next` e auto-navega pra lá.
 *
 * 🆕 04/09 (pedido do Pedro) — A 2ª RODADA PRECISAVA DE UM FECHO, NÃO DE UM
 * PORTÃO.
 *
 * O levantamento de CTAs pegou o buraco: a C7′ mandava nomes pra Junta e caía
 * DIRETO no status, sem nada entre uma coisa e outra. O caminho normal tem a
 * A2 (o ponto sem volta, com aviso e CTA próprio) antes de a Junta receber
 * qualquer coisa; a reentrada pela 2ª rodada não tinha equivalente.
 *
 * ─── POR QUE SPLASH, E NÃO UMA A2 DA 2ª RODADA ─────────────────────────────
 * Decisão do Pedro: aqui NÃO cabe tela de confirmação. A A2 existe pra
 * transformar uma cláusula em momento na primeira vez — a pessoa ainda não
 * sabia que os dados iam virar processo. Na 2ª rodada ela já sabe: já
 * atravessou a A2, já viu a Junta responder, e está reenviando por causa
 * disso. Pedir uma confirmação de novo seria cobrar consentimento de quem já
 * consentiu, e as regras (a Junta tenta na ordem, sem custo, sem atraso) já
 * estão explicadas na própria tela onde ela escreve.
 *
 * Sobra o que falta: o RECIBO. Só os dados pertinentes, sem CTA, some sozinho.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashNomesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/aguardando?fase=junta&viabilidade=1";

  return (
    <SplashMensagemView
      titulo="Nomes enviados."
      /* O que a pessoa precisa saber pra soltar a tela: a Junta tenta na
         ORDEM (é o que ela acabou de decidir escrevendo o primeiro) e o
         retorno é nosso. Prazo fica de fora: a gente não controla o da Junta,
         e cravar número aqui seria o tipo de promessa que a régua anti-guru
         proíbe. */
      sub="A Junta analisa na ordem da lista. A gente te avisa assim que ela responder."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
