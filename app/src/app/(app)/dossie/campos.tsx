"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPOS DO DOSSIÊ (B2 · N10–N16) — vocabulário de FORM da coleta.
 * ═══════════════════════════════════════════════════════════════════════════
 * LOCAL, não DS. Regra dos 3 (design-system.md §4): só promove ao DS o que
 * aparece nas 2 farol (N4 gate · N18 simulador). Estes campos são o esqueleto
 * das 7 telas de coleta; ficam aqui até bater numa 3ª superfície fora do dossiê.
 *
 * O que ELES codificam de propósito:
 *   · O padrão de 3 partes (título fixo / corpo rola / CTA fixo) vira ESTRUTURA,
 *     não disciplina: quem usa Tela+Corpo+Rodape não consegue quebrar o layout.
 *   · Só tocam token semântico. Nenhum primitivo, nenhum hex. `bg-coral-500`
 *     não existe (atrito mecânico do globals.css).
 *   · Alvo de toque mínimo 48px (min-h-12) em tudo que se clica (UX-12).
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ─── Esqueleto de 3 partes ─────────────────────────────────────────────────
   Uma tela do wizard/app é sempre: header meta · título FIXO · corpo ROLÁVEL ·
   CTA FIXO. Estes 4 componentes tornam isso mecânico. */

export function TelaHeader({ meta }: { meta: string }) {
  return (
    <header className="pt-6 pb-4">
      <p className="text-micro text-text-tertiary">{meta}</p>
    </header>
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

/* ─── Campo rotulado ────────────────────────────────────────────────────────
   Rótulo literal em cima (universal UX-48), dica opcional, filho embaixo. */

export function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-text-primary">{rotulo}</p>
      {dica && <p className="text-micro text-text-tertiary mt-0.5">{dica}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/* ─── Entrada de texto ──────────────────────────────────────────────────────
   Erro INLINE (nunca modal), microcopy que ensina, não pune. */

export function Texto({
  valor,
  onChange,
  placeholder,
  erro,
  ok,
  inputMode,
  maxLength,
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  erro?: string;
  ok?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}) {
  return (
    <>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full min-h-12 rounded-md border bg-surface-card px-3 text-body text-text-primary
          placeholder:text-text-muted focus:outline-none
          ${
            erro
              ? "border-state-danger"
              : "border-border-hairline focus:border-border-focus"
          }`}
      />
      {erro && <p className="text-micro text-state-danger-text mt-1">{erro}</p>}
      {!erro && ok && (
        <p className="text-micro text-state-success-text mt-1">{ok}</p>
      )}
    </>
  );
}

/* ─── Seleção em botões ─────────────────────────────────────────────────────
   Botão grande com rótulo literal > dropdown pro leigo (UX-48). Linha p/ 2–3
   opções curtas; coluna p/ listas ou rótulos longos. */

interface Opcao<T> {
  v: T;
  label: string;
}

export function OpcoesLinha<T extends string | number | boolean>({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: Opcao<T>[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {opcoes.map((o) => (
        <BotaoOpcao
          key={String(o.v)}
          on={valor === o.v}
          onClick={() => onChange(o.v)}
          className="flex-1 text-center"
        >
          {o.label}
        </BotaoOpcao>
      ))}
    </div>
  );
}

export function OpcoesColuna<T extends string | number | boolean>({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: Opcao<T>[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {opcoes.map((o) => (
        <BotaoOpcao
          key={String(o.v)}
          on={valor === o.v}
          onClick={() => onChange(o.v)}
          className="px-4 text-left"
        >
          {o.label}
        </BotaoOpcao>
      ))}
    </div>
  );
}

function BotaoOpcao({
  on,
  onClick,
  className = "",
  children,
}: {
  on: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-12 rounded-md border text-body font-semibold transition-colors ${className}
        ${
          on
            ? "border-border-focus bg-surface-tint-brand text-text-primary"
            : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
        }`}
    >
      {children}
    </button>
  );
}

/* ─── Dropdown nativo ───────────────────────────────────────────────────────
   Onde a lista é longa demais pra botão (estado civil, tipo de endereço). O
   select nativo do iOS é acessível e familiar; não reinventar. */

/**
 * Dropdown PRÓPRIO, não `<select>` nativo. A lista de options do select nativo
 * não é estilizável (fonte de sistema, highlight azul do OS, zero controle) —
 * pra respeitar o DS a lista tem que ser DOM nossa.
 *
 * ⚠️ Descartável no produto: a stack é React Native (travada 09/07), onde isto
 * vira `Picker` NATIVO. Este componente existe pra a review web parecer o que
 * o app vai ser, não pra ir pro RN. Por isso a a11y aqui é "suficiente pra
 * mock" (listbox + teclado + click-fora + escape), não a rigor de produção.
 *
 * Editar aqui muda os 3 dropdowns (N10 estado civil + regime · N13 tipo).
 */
export function Select({
  valor,
  onChange,
  opcoes,
  placeholder = "Selecione",
}: {
  valor: string;
  onChange: (v: string) => void;
  opcoes: { v: string; label: string }[];
  placeholder?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState(0); // índice destacado por teclado
  const ref = useRef<HTMLDivElement>(null);

  const selecionado = opcoes.find((o) => o.v === valor);
  const idxSel = opcoes.findIndex((o) => o.v === valor);

  // Fecha ao clicar fora. pointerdown (não click) fecha antes de qualquer
  // ação da tela por baixo.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    window.addEventListener("pointerdown", fora);
    return () => window.removeEventListener("pointerdown", fora);
  }, [aberto]);

  function abrir() {
    setFoco(idxSel >= 0 ? idxSel : 0);
    setAberto(true);
  }
  function escolher(v: string) {
    onChange(v);
    setAberto(false);
  }
  function onKey(e: React.KeyboardEvent) {
    if (!aberto) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") {
      setAberto(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFoco((i) => Math.min(i + 1, opcoes.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFoco((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      escolher(opcoes[foco].v);
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Gatilho: mesma silhueta do input (min-h-12, borda, raio). Borda foca
          quando aberto; seta gira. */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={onKey}
        className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-md border
          bg-surface-card pl-3 pr-3.5 text-left text-body transition-colors focus:outline-none
          ${aberto ? "border-border-focus" : "border-border-hairline hover:border-border-strong"}
          ${selecionado ? "text-text-primary" : "text-text-muted"}`}
      >
        <span className="truncate">
          {selecionado ? selecionado.label : placeholder}
        </span>
        <svg
          className={`shrink-0 text-text-tertiary transition-transform ${aberto ? "rotate-180" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Lista NOSSA: floating de verdade → sombra permitida (design-system §1).
          Selecionado = tint coral + check; destaque de teclado = surface-alt. */}
      {aberto && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+4px)] z-20 max-h-64 overflow-y-auto rounded-md
                     border border-border-hairline bg-surface-card p-1 shadow-lg
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {opcoes.map((o, i) => {
            const on = o.v === valor;
            return (
              <li
                key={o.v}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setFoco(i)}
                onClick={() => escolher(o.v)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-sm px-3 text-body
                  ${on ? "bg-surface-tint-brand text-text-primary" : "text-text-secondary"}
                  ${!on && foco === i ? "bg-surface-alt" : ""}`}
              >
                <span className="truncate">{o.label}</span>
                {on && (
                  <svg
                    className="shrink-0 text-action-primary"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2.5 7.5 6 11l5.5-8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
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
