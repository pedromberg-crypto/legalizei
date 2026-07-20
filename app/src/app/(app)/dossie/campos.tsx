"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPOS DO DOSSIÊ (B2 · N10–N16) — o que ainda é LOCAL da coleta.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ 19/07: o esqueleto de 3 partes, o Aviso e os 2 campos básicos SAÍRAM
 * daqui. A regra dos 3 bateu quando o N6–N9 (a travessia do dinheiro) passou
 * a usar o mesmo esqueleto fora do dossiê, no shell do wizard. Eles moram
 * agora em `components/ui/tela.tsx` e `components/ui/form.tsx`.
 *
 * Este arquivo RE-EXPORTA os promovidos, então as 7 telas de coleta seguem
 * importando "../campos" e nenhuma precisou ser tocada. O que sobrou aqui é
 * o que ainda só existe no dossiê: as seleções.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export {
  TelaHeader,
  Titulo,
  Corpo,
  Rodape,
  Aviso,
} from "@/components/ui/tela";
export { Campo, Texto } from "@/components/ui/form";

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
