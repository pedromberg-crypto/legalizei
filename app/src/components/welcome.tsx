"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

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
 * 🔄 29/08 (pedido do Pedro) — copy revisada, mesma ordem/tese, agora na voz
 * do Léo (1ª pessoa, `marca/personagem-leo.md`). Slide 2 mudou de "nomear a
 * dor" pra "aquecer o fork que vem logo depois" (E3, `/entrada` — abrir ×
 * migrar × já-cliente), plantando a identificação sem virar pergunta seca.
 *
 * 🧪 29/08 (teste do Pedro, "ficou 100%") — os 3 slides viraram a composição
 * do carrossel de diferenciais do `legalizai-site` (`lp/_lab/index.html`,
 * `.dif-card`): foto full-bleed + gradiente escuro subindo + título/corpo
 * brancos embaixo, sangrando atrás de header/footer também (ver comentário
 * de `absolute inset-0` mais abaixo). Fotos ainda são as de referência do
 * carrossel original (`legalizai-site/lp/_lab/assets/dif-cenas/`), o Pedro
 * vai gerar as definitivas com o Léo depois de aprovar a composição.
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

type Slide = { titulo: [string, string]; texto: string; imagemFundo: string };

const SLIDES: Slide[] = [
  {
    // referência: card 02 "Contador de verdade no WhatsApp" (gente de
    // verdade por trás do app — mesma tese do slide).
    imagemFundo: "/leo/card-teste-welcome-1.jpg",
    titulo: ["Eu fico de vigia.", "Quem resolve é gente de verdade."],
    texto: "Sou o Léo. 22 anos de escritório contábil em BH, não só um app.",
  },
  {
    // referência: card 05 "Fala a sua língua".
    imagemFundo: "/leo/card-teste-welcome-2.jpg",
    titulo: ["Abrindo do zero ou", "já com CNPJ rodando."],
    texto: "Empresa nova ou já rodando com outro contador, eu vigio do mesmo jeito.",
  },
  {
    // referência: card 01 "Preço fechado, sem asterisco".
    imagemFundo: "/leo/card-teste-welcome-3.jpg",
    titulo: ["Contabilês eu ironizo.", "Susto no boleto eu não deixo passar."],
    texto: "Preço único e claro desde o dia 1, sem pegadinha na letra miúda.",
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

  // Foto+gradiente sangram atrás de header/footer também. `.app-page`
  // (globals.css) já é `position:relative`: um filho `absolute inset-0` dela
  // ignora o `padding-inline`/`padding-top` da PÁGINA (preenche a PADDING BOX,
  // não só a content box — mesma lógica que a Splash documenta pra dela,
  // `splash.tsx`), sem precisar de `fixed`.
  //
  // ⚠️ Por que `absolute`, não `fixed`: `fixed` só bleeda até o VIEWPORT real
  // (ou até o ancestral com `transform` mais próximo, se houver um no meio —
  // no `/apresentacao`, que embrulha o app-page dentro de um mock de aparelho
  // com `transform: scale()`, esse ancestral vira o bezel inteiro, não a tela,
  // e o fundo saía cortado/desalinhado). `absolute` ignora esse problema
  // inteiro: o containing block é sempre o `.app-page` mais próximo, ponto,
  // igual em produção, no `/apresentacao` e no iframe do `/mapa`.
  const slideAtual = SLIDES[i];

  return (
    <>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(12,8,6,0), rgba(12,8,6,.72) 62%, rgba(12,8,6,.9)), url(${slideAtual.imagemFundo})`,
          backgroundSize: "cover",
          backgroundPosition: "center 10%",
        }}
      />

      <header className="relative flex items-center justify-between pt-6 pb-2">
        <Logo variante="escura" className="h-[26px] w-auto" />
        {/* Saída sempre disponível. `ghost` porque escapar não é ação primária. */}
        <Button variant="ghost" onClick={onPular} style={{ color: "#fff" }}>
          Pular
        </Button>
      </header>

      <main className="app-main relative">
        <div
          ref={trilho}
          className="-mx-6 flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((s) => (
            <section
              key={s.texto}
              className="flex w-full shrink-0 snap-center flex-col justify-end
                         px-8 pb-10 text-left"
            >
              <h2 className="text-h1 text-white">
                {s.titulo[0]}
                <br />
                {s.titulo[1]}
              </h2>
              <p className="text-body mt-3 max-w-[300px] text-[color:var(--p-coral-100)]">
                {s.texto}
              </p>
            </section>
          ))}
        </div>

        <div className="app-footer-cta" style={{ background: "transparent" }}>
          <div className="mb-6 flex items-center justify-center gap-2">
            {SLIDES.map((s, k) => (
              <span
                key={s.texto}
                className={`h-2 rounded-full transition-all ${
                  k === i ? "w-6 bg-action-primary" : "w-2 bg-white/40"
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
