"use client";

import { useEffect } from "react";
import { Logo } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPLASH DE MENSAGEM — transitório, SEM CTA, auto-avança sozinho
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 30/08 (pedido do Pedro) — 2 telas novas do mapa (E5F.1 "conseguimos te
 * atender" e E9.S "pagamento confirmado") compartilham este mesmo esqueleto:
 * poucos segundos na tela, nenhum toque esperado, some sozinho.
 *
 * ⚠️ Diferente da SplashView (N1): aquela decide de propósito NÃO
 * auto-navegar (ver doutrina em `splash.tsx`) porque é a 1ª tela do produto e
 * o /mockup a usa isolada. Esta aqui é o oposto — vive NO MEIO do fluxo,
 * confirmando algo que já aconteceu (atendemos você · pagamento caiu), então
 * segurar o dedo da pessoa não soma nada. Arte provisória (Pedro revisa).
 *
 * 🐛 30/08 (achado do Pedro no `/mapa`) — o board tem PRÉVIA AO VIVO por
 * iframe (`components/mapa/tela-node.tsx`, `PreviaTela`). Uma splash que
 * auto-navega DENTRO do iframe se substitui pela tela seguinte em ~1.8s: o
 * card fica com o rótulo "Splash" mas o preview já mostra a tela de depois —
 * exatamente o bug que a doutrina do N1 evitava (ver acima), só que esta tela
 * violava a mesma regra por precisar de auto-avanço de verdade em produção.
 * Corrigido detectando `window.self !== window.top`: dentro de iframe (o
 * board, o /mockup), o auto-avanço desliga e a splash fica parada — fora de
 * iframe (uso real), avança normal.
 */
export function SplashMensagemView({
  titulo,
  sub,
  onAutoAvancar,
  duracaoMs = 1800,
}: {
  titulo: string;
  sub?: string;
  /** Ausente = não navega sozinho (útil no Storybook/preview estático). */
  onAutoAvancar?: () => void;
  duracaoMs?: number;
}) {
  useEffect(() => {
    if (!onAutoAvancar) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const t = setTimeout(onAutoAvancar, duracaoMs);
    return () => clearTimeout(t);
  }, [onAutoAvancar, duracaoMs]);

  return (
    // 🎓 lição do `welcome.tsx` (29/08): `absolute inset-0` ancorado no
    // `.app-page` (já `position:relative`) em vez de `fixed inset-0` —
    // sangra até o vidro do aparelho sem precisar de wrapper com `transform`
    // pra criar containing block (o que a SplashView/N1 ainda precisa).
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-brand px-10 text-center">
      <Logo variante="negativa" className="absolute top-8 h-7 w-auto" />
      <CheckGrandeSplash />
      <div>
        <h1 className="text-h1 text-text-on-brand">{titulo}</h1>
        {sub && <p className="text-body text-text-on-brand/80 mt-2">{sub}</p>}
      </div>
    </div>
  );
}

function CheckGrandeSplash() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.16" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
