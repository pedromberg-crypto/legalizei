"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ESQUELETO DE TELA — promovido ao DS em 19/07 pela REGRA DOS 3.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu local em `dossie/campos.tsx`, servindo as 7 telas de coleta. A regra
 * dizia: promove quando bater numa 3ª superfície FORA do dossiê. Bateu de uma
 * vez — N6, N7, N8 e N9 (a travessia do dinheiro) usam o mesmo esqueleto e
 * vivem no shell do wizard, não no do app.
 *
 * `dossie/campos.tsx` re-exporta daqui, então as 7 telas existentes não sabem
 * que a mudança aconteceu. Nenhuma delas foi tocada.
 *
 * O que estes 4 componentes codificam:
 *   · O padrão de 3 partes (título FIXO / corpo ROLA / CTA FIXO) vira
 *     ESTRUTURA, não disciplina. Quem os usa não consegue quebrar o layout.
 *   · Só tocam token semântico. `bg-coral-500` não existe (globals.css).
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * `voltar` (opt-in, 22/07): href do pai pra telas de DETALHE do portal (ex:
 * impostos → pagar). Ausente = sem seta (todo o wizard e as telas-raiz seguem
 * iguais, sem tocar nelas). A nav ENTRE seções é a barra de abas, não isto;
 * isto é só o back de drill-down.
 */
export function TelaHeader({
  meta,
  voltar,
  onVoltar,
}: {
  meta: string;
  voltar?: string;
  /**
   * 🆕 29/07 — voltar por AÇÃO, não por rota. A `/apresentacao` navega por
   * estado (não tem router), e o UX-60 pede a seta nas telas do wizard.
   * Mesma afordância visual do `voltar`.
   */
  onVoltar?: () => void;
}) {
  if (onVoltar) {
    return (
      <header className="pt-6 pb-4 flex items-center gap-1.5">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <SetaVoltar />
        </button>
        <p className="text-micro text-text-tertiary">{meta}</p>
      </header>
    );
  }
  if (voltar) {
    return (
      <header className="pt-6 pb-4 flex items-center gap-1.5">
        <Link
          href={voltar}
          aria-label="Voltar"
          className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <SetaVoltar />
        </Link>
        <p className="text-micro text-text-tertiary">{meta}</p>
      </header>
    );
  }
  return (
    <header className="pt-6 pb-4">
      <p className="text-micro text-text-tertiary">{meta}</p>
    </header>
  );
}

function SetaVoltar() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/** Título + subtítulo FIXOS (shrink-0): não rolam com o corpo. */
export function Titulo({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="shrink-0">
      <h1 className="text-h1 mb-2">{children}</h1>
      {sub && <p className="text-body text-text-secondary mb-5">{sub}</p>}
    </div>
  );
}

/**
 * Corpo ROLÁVEL. min-h-0 é o que faz o 100dvh do shell funcionar em flex.
 * Scrollbar escondida no mobile.
 *
 * FADE de scroll (decisão 17/07): affordance, NÃO gate. Quando tem conteúdo
 * abaixo/acima da dobra, a ponta desbota — sinaliza "tem mais pra ver" sem
 * travar o CTA. É a alternativa ao scroll-gate (que puniria a Cida e brigaria
 * com o UX-48: densidade nunca vira obrigação). Mesmo mask das pills do N4.
 *
 * Recompute em 3 gatilhos: scroll · altura do CONTEÚDO muda (card condicional
 * revelado, ex: N11) · altura do VIEWPORT muda (troca de aparelho no /mockup
 * injeta --safe-*). O fade só aparece quando há overflow real — em tela alta
 * (15 Pro Max) some sozinho.
 */
export function Corpo({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ topo: false, base: false });

  useEffect(() => {
    const vp = viewport.current;
    const ct = conteudo.current;
    if (!vp || !ct) return;
    const recompute = () => {
      const topo = vp.scrollTop > 2;
      const base = vp.scrollTop + vp.clientHeight < vp.scrollHeight - 2;
      setFade((f) => (f.topo === topo && f.base === base ? f : { topo, base }));
    };
    recompute();
    vp.addEventListener("scroll", recompute, { passive: true });
    const ro = new ResizeObserver(recompute);
    ro.observe(ct); // conteúdo cresce/encolhe (revelação condicional)
    ro.observe(vp); // viewport muda (safe-area no /mockup)
    return () => {
      vp.removeEventListener("scroll", recompute);
      ro.disconnect();
    };
  }, []);

  // Mask REAL: só desbota a ponta que ainda tem conteúdo pra rolar.
  const topStop = fade.topo ? "transparent 0, #000 20px" : "#000 0";
  const baseStop = fade.base
    ? "#000 calc(100% - 28px), transparent 100%"
    : "#000 100%";
  const mask = `linear-gradient(to bottom, ${topStop}, ${baseStop})`;

  return (
    <div
      ref={viewport}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div ref={conteudo} className="flex flex-col gap-6 pb-4">
        {children}
      </div>
    </div>
  );
}

/** CTA colado no rodapé = thumb zone (design-system.md §6). Respeita safe-area. */
export function Rodape({ children }: { children: ReactNode }) {
  return <div className="app-footer-cta">{children}</div>;
}

/* ─── Aviso que EDUCA ───────────────────────────────────────────────────────
   Bloqueio, alerta ou reforço. ⚠️ coral NUNCA é erro nem alerta (regra dura da
   paleta): estados usam SEMPRE os tokens de estado. */

type Variante = "info" | "warning" | "danger" | "success";

const FUNDO: Record<Variante, string> = {
  info: "bg-state-info-tint",
  warning: "bg-state-warning-tint",
  danger: "bg-state-danger-tint",
  success: "bg-state-success-tint",
};
const TITULO: Record<Variante, string> = {
  info: "text-state-info-text",
  warning: "text-state-warning-text",
  danger: "text-state-danger-text",
  success: "text-state-success-text",
};

export function Aviso({
  variante = "info",
  titulo,
  children,
}: {
  variante?: Variante;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-md p-4 ${FUNDO[variante]}`}>
      <p className={`text-body font-semibold mb-1 ${TITULO[variante]}`}>
        {titulo}
      </p>
      <p className="text-caption text-text-secondary">{children}</p>
    </div>
  );
}
