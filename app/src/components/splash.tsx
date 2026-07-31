"use client";

import { Logo } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N1 — SPLASH  ·  shell WIZARD · a primeira coisa que o lead vê
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO de `(wizard)/splash/page.tsx` em 31/07, mesmo padrão de
 * `EntradaView`/`gate-telas`: fonte única, a page é wrapper fino.
 *
 * Colhida do protótipo `ux-ui/prototipo/splash.html` (aprovada 12/07).
 *
 * Não tem arquétipo em A1–A10: não pergunta, não julga, não prova nada. É a
 * marca se apresentando, e o único momento do produto inteiro em que o coral
 * cobre a tela toda.
 *
 * ─── AS 3 DECISÕES QUE ESTA TELA CARREGA ──────────────────────────────────
 * 1. **Sangra até a borda.** `fixed inset-0` fura o padding do `.app-page` de
 *    propósito. É a regra do globals.css sendo aplicada, não violada: "o fundo
 *    pode (e deve) ir até a borda, o conteúdo não". A logo continua centrada
 *    na área segura; só a cor vai até o vidro.
 *
 * 2. **Logo NEGATIVA com o check em knockout.** O check não é branco: é
 *    pintado da cor do painel, então parece recortado. Ele se revela num wipe
 *    da esquerda pra direita — o mesmo gesto de "conferido" que o confete do
 *    N4 ecoa depois. A marca faz a mesma promessa nas duas pontas do flow.
 *
 * 3. 🚧 **NÃO auto-navega, e isso é escolha.** O protótipo deslizava o painel
 *    coral pra cima e ia pro welcome em ~2s. Aqui a tela anima a entrada e
 *    PARA. Motivo: no `/mockup` cada tela é um iframe, e uma splash que se
 *    substitui sozinha vira uma segunda cópia do N2 na prancheta — o Pedro
 *    perderia justamente a tela que veio revisar. O handoff N1→N2 é transição
 *    entre rotas, responsabilidade do router, não da tela. Quando o flow for
 *    ligado de ponta a ponta, é uma linha (router.push) que volta.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function SplashView() {
  return (
    <div
      id="splash-frame"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand"
    >
      <Logo variante="negativa" checkId="splash-check" className="w-[220px] max-w-[64%]" />

      {/* Animação local (styled-jsx): não vira utilitário nem token porque
          acontece uma vez na vida do app. Promover isso ao DS seria a
          abstração especulativa que o design-system.md §6 proíbe.
          `prefers-reduced-motion` desliga tudo e entrega o estado final. */}
      <style jsx global>{`
        @keyframes splash-pop {
          from {
            opacity: 0;
            transform: scale(0.86);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splash-wipe {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
        /* Escopado no #splash-frame: o CSS global persiste entre rotas, e sem
           isto o logo do N2 e do N3 herdaria o pop da splash. */
        #splash-frame svg {
          animation: splash-pop 0.6s cubic-bezier(0.22, 1.3, 0.4, 1) 0.1s both;
        }
        #splash-frame #splash-check {
          clip-path: inset(0 100% 0 0);
          animation: splash-wipe 0.5s cubic-bezier(0.65, 0, 0.35, 1) 0.5s forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          #splash-frame svg,
          #splash-frame #splash-check {
            animation: none;
            opacity: 1;
            transform: none;
            clip-path: none;
          }
        }
      `}</style>
    </div>
  );
}
