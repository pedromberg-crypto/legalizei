"use client";

import { useEffect, useRef } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOTTIE — runtime compartilhado + player de loop.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu extraído do `confetti.tsx`: a regra dos 3 bateu quando o N2 (welcome,
 * 3 animações) e o N3 (paperplane) chegaram. O carregador do UMD virou função
 * comum; o confete continua com o comportamento dele (burst, sem loop).
 *
 * Zero-dependência de propósito: carrega `/lottie/lottie.min.js` SOB DEMANDA,
 * uma vez só. Sem npm install, e reusa os assets recoloridos em coral que já
 * foram colhidos do protótipo. O produto é React Native (lá vira
 * lottie-react-native), então amarrar num pacote web seria dívida à toa.
 *
 * ─── POR QUE DRIVER MANUAL DE FRAME (setInterval, não autoplay) ────────────
 * Lição colhida do protótipo, não preferência: quando o documento roda
 * offscreen, o browser estrangula o `requestAnimationFrame` e o Lottie congela
 * no frame 0. É exatamente o caso da prancheta `/mockup`, onde cada tela é um
 * iframe numa esteira horizontal — os que estão fora da dobra congelariam, e o
 * Pedro veria um avião parado achando que o asset quebrou.
 *
 * `goToAndStop(frame, true)` num intervalo fixo não depende do rAF. Degrada
 * sozinho se o tab ocultar (o browser afrouxa o timer, a animação desacelera,
 * mas não trava).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface LottieAnim {
  destroy(): void;
  goToAndStop(valor: number, isFrame?: boolean): void;
  addEventListener(evento: string, cb: () => void): void;
  totalFrames: number;
}

export interface LottieRuntime {
  loadAnimation(cfg: {
    container: Element;
    renderer: "svg";
    loop: boolean;
    autoplay: boolean;
    path: string;
  }): LottieAnim;
}

function getRuntime(): LottieRuntime | undefined {
  return (window as unknown as { lottie?: LottieRuntime }).lottie;
}

/** Carrega o UMD uma única vez; chamadas seguintes reusam window.lottie. */
export function carregarRuntime(): Promise<LottieRuntime> {
  const existente = getRuntime();
  if (existente) return Promise.resolve(existente);
  return new Promise((resolve, reject) => {
    const id = "lottie-umd";
    const aoCarregar = () => {
      const rt = getRuntime();
      if (rt) resolve(rt);
      else reject(new Error("lottie não inicializou"));
    };
    const jaNoDom = document.getElementById(id) as HTMLScriptElement | null;
    if (jaNoDom) {
      jaNoDom.addEventListener("load", aoCarregar);
      jaNoDom.addEventListener("error", () => reject(new Error("lottie falhou")));
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "/lottie/lottie.min.js";
    s.async = true;
    s.onload = aoCarregar;
    s.onerror = () => reject(new Error("lottie falhou"));
    document.head.appendChild(s);
  });
}

/**
 * Animação em loop, decorativa. `aria-hidden` sempre: nenhuma delas carrega
 * informação que não esteja no texto ao lado. Se um dia carregar, o texto é
 * que está errado.
 *
 * `fps` vem do arquivo (`fr` no JSON), não é escolha: o paperplane é 50, o
 * marketing-mgmt é 25, os outros 30. Errar aqui faz a animação rodar em câmera
 * lenta ou acelerada.
 */
export function Lottie({
  path,
  fps = 30,
  className = "",
}: {
  path: string;
  fps?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: LottieAnim | undefined;
    let timer: number | undefined;
    let cancelado = false;
    // UX-12: quem pediu menos movimento vê um frame parado, não tela vazia.
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    carregarRuntime()
      .then((rt) => {
        if (cancelado || !ref.current) return;
        anim = rt.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: true,
          autoplay: false, // o driver abaixo é quem manda no frame
          path,
        });
        anim.addEventListener("DOMLoaded", () => {
          if (cancelado || !anim) return;
          const total = Math.floor(anim.totalFrames);
          if (reduzido) {
            anim.goToAndStop(Math.floor(total / 2), true);
            return;
          }
          let f = 0;
          timer = window.setInterval(() => {
            f = (f + 1) % total;
            anim?.goToAndStop(f, true);
          }, 1000 / fps);
        });
      })
      .catch(() => {
        // Asset falhou: a tela segue sem a ilustração. Nada aqui é obrigatório
        // pra entender o conteúdo — por isso não há fallback visual.
      });

    return () => {
      cancelado = true;
      if (timer) window.clearInterval(timer);
      anim?.destroy();
    };
  }, [path, fps]);

  return <div ref={ref} className={className} aria-hidden />;
}
