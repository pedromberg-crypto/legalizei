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
  semVoltar = false,
  acao,
}: {
  meta: string;
  voltar?: string;
  /**
   * 🆕 03/09 (pedido do Pedro, na C4) — ação opcional na PONTA DIREITA do
   * cabeçalho, na mesma linha do voltar. Nasceu pro "i" que abre a explicação
   * da tela; fica genérico porque a linha do topo é o lugar natural de
   * qualquer ação secundária de tela (nunca a primária, que mora no rodapé).
   */
  acao?: ReactNode;
  /**
   * 🆕 29/07 — voltar por AÇÃO, não por rota. A `/apresentacao` navega por
   * estado (não tem router), e o UX-60 pede a seta nas telas do wizard.
   * Mesma afordância visual do `voltar`.
   */
  onVoltar?: () => void;
  /**
   * 🆕 02/09 — declara que esta tela NÃO tem voltar de propósito (saída
   * terminal, primeira tela do flow, laboratório). Existe pra que o aviso
   * abaixo signifique alguma coisa: sem um jeito de dizer "é intencional",
   * todo alerta viraria ruído e ninguém olharia.
   */
  semVoltar?: boolean;
}) {
  /* 🐛→🔒 02/09 — TELA NOVA NASCIA SEM SETA, EM SILÊNCIO.
     Sem `onVoltar` este componente renderizava só o texto, sem erro nem
     aviso: o furo apareceu 3 vezes (gate 29/08, C0 e C5 em 02/09) e sempre
     foi o Pedro quem pegou, testando no aparelho. Agora ele fala. */
  if (process.env.NODE_ENV !== "production" && !onVoltar && !voltar && !semVoltar) {
    console.warn(
      `[TelaHeader] "${meta}" não tem voltar. Se for de propósito, passe semVoltar.`,
    );
  }

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
        {acao && <div className="ml-auto">{acao}</div>}
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
        {acao && <div className="ml-auto">{acao}</div>}
      </header>
    );
  }
  return (
    <header className="pt-6 pb-4 flex items-center gap-1.5">
      <p className="text-micro text-text-tertiary">{meta}</p>
      {acao && <div className="ml-auto">{acao}</div>}
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
export function Titulo({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
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
  const { viewport, conteudo, style } = useFadeScroll();

  return (
    <div
      ref={viewport}
      style={style}
      className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div ref={conteudo} className="flex flex-col gap-6 pb-4">
        {children}
      </div>
    </div>
  );
}

/**
 * 🆕 02/09 — ÁREA ROLÁVEL com o degradê, pra quem não usa o `Corpo`.
 *
 * Metade das telas do app tem contêiner de rolagem próprio (a triagem, o
 * veredito, as saídas, a folha do E6, a timeline do status) — todas nasceram
 * copiando as mesmas 4 classes e TODAS sem o degradê de continuidade, porque
 * ele morava dentro do `Corpo`. Era sempre o mesmo bug reaparecendo em tela
 * nova. Este componente é o mesmo contêiner, com o fade de fábrica.
 *
 * Difere do `Corpo` só no miolo: o `Corpo` impõe `flex flex-col gap-6 pb-4`
 * aos filhos (o ritmo do wizard), este não impõe nada — quem usa já tem o
 * próprio layout e só quer rolar direito.
 */
export function Rolagem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { viewport, conteudo, style } = useFadeScroll();
  return (
    <div
      ref={viewport}
      style={style}
      className={`min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <div ref={conteudo}>{children}</div>
    </div>
  );
}

/**
 * 🆕 01/09 — o fade do `Corpo`, extraído pra hook.
 *
 * Motivo: o E6 (`ContaPainel`) tem contêiner de rolagem PRÓPRIO — a folha
 * branca com o formulário dentro — e por isso nascia sem o degradê que todas
 * as outras telas têm. Duplicar as ~20 linhas era garantir que as duas cópias
 * divergissem na primeira correção; a lógica agora vive num lugar só.
 *
 * Uso: espalhe `ref={viewport}` e `style` no elemento que rola, e
 * `ref={conteudo}` no filho que cresce.
 */
/**
 * 🔄 04/09 (pedido do Pedro, na A1) — o degradê do TOPO entrava em DEGRAU e
 * comia o primeiro card. Ele ligava em `scrollTop > 2`, então bastavam 3px de
 * rolagem pra que os 20px de ramp aparecessem inteiros — e como o card do
 * corpo encosta na borda do viewport, o desbote caía sobre o topo dele (a
 * borda arredondada e o título da seção) em vez de cair no vão do cabeçalho.
 *
 * Agora o ramp CRESCE com a rolagem (`TOPO_MAX` = teto) e é mais curto: nos
 * primeiros pixels ele é do tamanho do que já saiu de vista, e o card só perde
 * o topo quando o topo dele de fato já passou por baixo do cabeçalho. Raiz,
 * não tela: `Corpo` e `Rolagem` dividem este hook, então vale no app inteiro.
 */
/** Teto do desbote de topo (px). Curto de propósito: é affordance, não véu. */
const TOPO_MAX = 14;
/** Passo de quantização: evita re-render a cada pixel de rolagem. */
const TOPO_PASSO = 2;

export function useFadeScroll() {
  const viewport = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ topo: 0, base: false });

  useEffect(() => {
    const vp = viewport.current;
    const ct = conteudo.current;
    if (!vp || !ct) return;
    const recompute = () => {
      const bruto = Math.min(Math.max(vp.scrollTop, 0), TOPO_MAX);
      const topo = Math.round(bruto / TOPO_PASSO) * TOPO_PASSO;
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
  const topStop = fade.topo > 0 ? `transparent 0, #000 ${fade.topo}px` : "#000 0";
  const baseStop = fade.base
    ? "#000 calc(100% - 28px), transparent 100%"
    : "#000 100%";
  const mask = `linear-gradient(to bottom, ${topStop}, ${baseStop})`;

  return {
    viewport,
    conteudo,
    style: { maskImage: mask, WebkitMaskImage: mask } as const,
  };
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
