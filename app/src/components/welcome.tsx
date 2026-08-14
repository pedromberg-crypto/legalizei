"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Lottie } from "@/components/lottie";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N2 — WELCOME  ·  3 slides, PULÁVEL · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO de `(wizard)/welcome/page.tsx` em 31/07, mesmo padrão de
 * `EntradaView`/`gate-telas`: fonte única, a page é wrapper fino.
 *
 * 🐛 ACHADO NA EXTRAÇÃO: o CTA "Começar" do último slide não navegava —
 * `avancar()` retornava cedo em `ultimo` e não chamava nada. Mesma classe dos
 * outros CTAs mortos corrigidos nesta sessão (contrato N8, "Falar com o
 * time"). Corrigido: `onSeguir` opcional, chamado só no último slide.
 *
 * Colhido do protótipo `ux-ui/prototipo/welcome.html` (aprovado 12/07).
 * Spec: reordenacao-flow-cobranca-cedo.md → N2.
 *
 * Sem arquétipo em A1–A10: é POSICIONAMENTO, não passo de flow. Os 3 slides
 * são as 3 teses da marca, na ordem em que desarmam a desconfiança:
 *   1. **Contador de verdade** — mata o medo de "app sem gente atrás"
 *      (é o diferencial do Mauro: 22 anos de escritório)
 *   2. **A parte chata é com a gente** — nomeia a dor sem contabilês
 *   3. **Sem susto no boleto** — preço claro, a ferida da categoria
 *
 * ─── DECISÕES ─────────────────────────────────────────────────────────────
 * · **Pular é visível desde o slide 1** (spec: "pulável"). Onboarding que
 *   prende é onboarding que o `reta-direto` odeia. A saída fica no topo, longe
 *   do polegar, pra não competir com o CTA — mas existe.
 * · **CTA muda de rótulo no último slide** ("Próximo" → "Começar"): o botão
 *   diz o que vai acontecer, nunca "OK". Rótulo literal é universal (UX-48).
 * · **Trilho por scroll-snap nativo**, não carrossel de biblioteca. O gesto de
 *   arrastar já é do sistema; reimplementar com JS pioraria em acessibilidade
 *   e peso. Os dots refletem o scroll, não o contrário.
 * · O trilho **sangra lateralmente** (`-mx-6` contra o padding de 24 do
 *   `.app-page`) senão o snap alinharia numa largura menor que o vidro e cada
 *   slide pararia torto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SLIDES = [
  {
    lottie: "/lottie/customer-need-legalizai-story-book.json",
    fps: 30,
    titulo: ["Contador de verdade.", "Não robô."],
    texto:
      "Gente de BH que te atende de verdade e resolve. 22 anos de escritório por trás do app.",
  },
  {
    lottie: "/lottie/content-mod-legalizai-story-book.json",
    fps: 30,
    titulo: ["A parte chata", "é com a gente."],
    texto:
      "Impostos, guias, prazos, papelada do governo. Você toca o negócio. O resto voa pra cá.",
  },
  {
    lottie: "/lottie/marketing-mgmt-legalizai-story-book.json",
    // 25, não 30: é o `fr` do arquivo. Errar aqui roda em câmera lenta.
    fps: 25,
    titulo: ["Sem contabilês.", "Sem susto no boleto."],
    texto:
      "A gente fala a sua língua e o preço é um só, claro desde o primeiro dia.",
  },
];

export function WelcomeView({
  slideInicial = 0,
  onPular,
  onSeguir,
}: {
  /** 🆕 31/07 — pra review isolada de cada slide (demo/Storybook). Produção não passa nada. */
  slideInicial?: number;
  onPular?: () => void;
  /** 🐛 31/07 — antes não existia e "Começar" não fazia nada no último slide. */
  onSeguir?: () => void;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(slideInicial);
  const ultimo = i === SLIDES.length - 1;

  // O scroll é a fonte da verdade: os dots leem dele. Assim arrastar com o
  // dedo e clicar no CTA convergem pro mesmo estado, sem sincronização manual.
  const sincronizar = useCallback(() => {
    const el = trilho.current;
    if (!el || el.clientWidth === 0) return;
    setI(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const onScroll = () => window.requestAnimationFrame(sincronizar);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [sincronizar]);

  // Pula direto pro slide pedido, sem animação (é um estado inicial, não uma
  // navegação do usuário).
  useEffect(() => {
    const el = trilho.current;
    if (!el || el.clientWidth === 0 || slideInicial === 0) return;
    el.scrollTo({ left: slideInicial * el.clientWidth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avancar = () => {
    const el = trilho.current;
    if (ultimo) {
      onSeguir?.();
      return;
    }
    if (!el) return;
    el.scrollTo({ left: (i + 1) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <header className="flex items-center justify-between pt-6 pb-2">
        <Logo className="h-[26px] w-auto" />
        {/* Saída sempre disponível. `ghost` porque escapar não é ação primária. */}
        <Button variant="ghost" onClick={onPular}>
          Pular
        </Button>
      </header>

      <main className="app-main">
        <div
          ref={trilho}
          className="-mx-6 flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((s) => (
            <section
              key={s.texto}
              className="flex w-full shrink-0 snap-center flex-col items-center
                         justify-center px-8 text-center"
            >
              {/* min-h-0 + flex-1: a ilustração ABSORVE a sobra e encolhe no SE
                  (667px), onde a regra "sem scroll" morre primeiro. */}
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <Lottie
                  path={s.lottie}
                  fps={s.fps}
                  className="h-full max-h-[340px] w-full max-w-[340px]"
                />
              </div>
              <h2 className="text-h1 mt-4 shrink-0">
                {s.titulo[0]}
                <br />
                {s.titulo[1]}
              </h2>
              <p className="text-body text-text-secondary mt-3 max-w-[300px] shrink-0">
                {s.texto}
              </p>
            </section>
          ))}
        </div>

        <div className="app-footer-cta">
          <div className="mb-6 flex items-center justify-center gap-2">
            {SLIDES.map((s, k) => (
              <span
                key={s.texto}
                className={`h-2 rounded-full transition-all ${
                  k === i ? "w-6 bg-action-primary" : "w-2 bg-border-strong"
                }`}
              />
            ))}
          </div>
          <Button full onClick={avancar}>
            {ultimo ? "Começar" : "Próximo"}
          </Button>
        </div>
      </main>
    </>
  );
}
