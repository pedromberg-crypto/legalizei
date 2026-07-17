"use client";

import { useEffect, useRef } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFETE DE SUCESSO — Lottie da marca (success-confetti-legalizei.json, coral,
 * eco do logo). Colhido do protótipo, agora em código: micro-interação de "deu
 * certo" no aceite 🟢 do veredito. Régua MLP (craft no escopo).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ É um burst LOCALIZADO, não full-screen. Renderiza absolute, centrado sobre
 * o CTA — o pai provê o contexto `relative`. 180px = o tamanho do protótipo: o
 * botão encolhe até virar um ponto e a lottie "assume o círculo" ali no rodapé.
 *
 * Zero-dependência: carrega o runtime lottie-web (UMD) de /lottie/ SOB DEMANDA
 * (a mesma abordagem "driver manual" do protótipo). Evita npm install e reusa o
 * asset recolorido. O produto é React Native (lá vira lottie-react-native).
 *
 * Avança em `avancarMs` (~pico do burst, não os 3s inteiros — snappy, igual ao
 * protótipo que navegava em 1750ms); o confete segue tocando até desmontar.
 * Respeita prefers-reduced-motion (UX-12): sem movimento → onDone direto.
 * Guarda anti-trava: se o asset falhar, onDone dispara mesmo assim.
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface LottieAnim {
  destroy(): void;
}
interface LottieRuntime {
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
function carregarRuntime(): Promise<LottieRuntime> {
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

export function Confetti({
  onDone,
  avancarMs = 1800,
}: {
  onDone?: () => void;
  avancarMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Ref pro callback: mantém o effect de tocar estável (não reinicia o confete
  // a cada render do pai). Sincroniza num effect — mutar ref no render é proibido.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    // UX-12: sem movimento pra quem pediu. O efeito de negócio segue.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDoneRef.current?.();
      return;
    }

    let anim: LottieAnim | undefined;
    let cancelado = false;
    // Avança no pico do burst; não espera a animação inteira (snappy).
    const t = window.setTimeout(() => onDoneRef.current?.(), avancarMs);

    carregarRuntime()
      .then((rt) => {
        if (cancelado || !ref.current) return;
        anim = rt.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/lottie/success-confetti-legalizei.json",
        });
      })
      .catch(() => {
        window.clearTimeout(t);
        onDoneRef.current?.(); // asset falhou: não trava o CTA
      });

    return () => {
      cancelado = true;
      window.clearTimeout(t);
      anim?.destroy();
    };
  }, [avancarMs]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    />
  );
}
