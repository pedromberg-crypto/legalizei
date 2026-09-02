"use client";

import { useEffect } from "react";
import { Lottie } from "@/components/lottie";
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
  variante = "sucesso",
}: {
  titulo: string;
  sub?: string;
  /** Ausente = não navega sozinho (útil no Storybook/preview estático). */
  onAutoAvancar?: () => void;
  duracaoMs?: number;
  /**
   * 🆕 01/09 (pedido do Pedro) — 2ª variante: pagamento RECUSADO.
   *
   * Mesmo layout (logo, ícone grande, título, sub, auto-avanço), outra pele:
   * fundo escuro com o gradiente coral no canto, o mesmo do hero do status.
   * Coral cheio ("sucesso") pra confirmar e escuro pra recusar não é decoração:
   * a tela de recusa não pode ter a MESMA cara da de sucesso, senão a pessoa
   * lê o layout antes de ler a palavra e comemora errado. E o ícone vira um
   * "x" — check em tela de falha seria o pior tipo de ruído.
   */
  variante?: "sucesso" | "recusado";
}) {
  const recusado = variante === "recusado";
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
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 px-10 text-center ${
        recusado ? "bg-surface-dark" : "bg-brand"
      }`}
      style={
        recusado
          ? {
              // Mesmo gradiente do hero escuro do status (painel.tsx): coral
              // no canto, escuro no resto — a família visual do "estamos
              // cuidando disso", não a do "deu certo".
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }
          : undefined
      }
    >
      <Logo variante="negativa" className="absolute top-8 h-7 w-auto" />
      {/* 🧪 01/09 (pedido do Pedro) — o check parado dá lugar ao LOTTIE de
          check+confete (`success-confetti`, a 1ª camada dele chama "Tick").
          Só no caso de sucesso: na recusa continua o "x" estático, porque
          confete em tela de erro seria comemorar o problema da pessoa.
          🐛 01/09 (achado do Pedro) — o check é branco no arquivo, mas o
          CÍRCULO atrás dele tinha sido recolorido pro mesmo coral do fundo do
          splash: sumia no fundo e levava o check junto, por falta de contorno.
          Daí a variante `check-splash`, com as cores INVERTIDAS em relação ao
          original: disco BRANCO e check CORAL. Sobre o fundo coral do splash é
          o branco que precisa fazer o recorte — é ele que separa o símbolo do
          fundo. O `success-confetti` original segue intocado no veredito, onde
          o fundo é claro e a lógica se inverte.
          O Lottie roda em loop; se ficar repetitivo demais numa tela que dura
          poucos segundos, o ajuste é no player, não aqui. */}
      {recusado ? (
        <XGrandeSplash />
      ) : (
        <Lottie
          path="/lottie/check-splash-legalizai-story-book.json"
          fps={60}
          // 🔄 01/09 (pedido do Pedro) — +30%: 160 → 208px. O confete do
          // lottie ocupa boa parte do quadro, então o disco desenhado é bem
          // menor que a caixa: pra o CHECK crescer 30%, a caixa cresce junto.
          className="h-52 w-52"
        />
      )}
      <div>
        <h1 className={`text-h1 ${recusado ? "text-text-on-dark" : "text-text-on-brand"}`}>
          {titulo}
        </h1>
        {sub && (
          <p
            className={`text-body mt-2 ${
              recusado ? "text-text-on-dark/80" : "text-text-on-brand/80"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/** O par do check, pra variante de recusa. Mesmo peso visual, outro sinal. */
function XGrandeSplash() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.16" />
      <path
        d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
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
