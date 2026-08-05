"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Storybook renderiza 100% client-side (Vite, sem SSR) — então ler
 * `getComputedStyle` DIRETO no corpo do componente (sem useEffect/useState)
 * já é seguro: não existe passo de servidor pra divergir. `key={tema}` no
 * `TemaToggle` remonta a árvore quando o tema troca, o que já força a
 * releitura, sem precisar de efeito.
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Peças reusadas pelas stories de Fundações (`Fundações/*`).
 * ═══════════════════════════════════════════════════════════════════════════
 * Zero cópia de valor: todo swatch/amostra lê a CSS var REAL via
 * `getComputedStyle(document.documentElement)` — a mesma técnica que
 * `design-system.html` já usava, só que agora a fonte é o `globals.css` de
 * produção carregado pelo próprio Storybook (`.storybook/preview.tsx`), não
 * um `<style>` colado à mão dentro do HTML. Se `globals.css` mudar, a story
 * muda sozinha — não tem "esquecer de colar de novo aqui".
 * ═══════════════════════════════════════════════════════════════════════════
 */

function lerVar(nome: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

export function Swatch({ varName, papel }: { varName: string; papel?: string }) {
  const valor = lerVar(varName);

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--color-border-hairline)",
        background: "var(--color-surface-card)",
      }}
    >
      <div style={{ height: 64, background: `var(${varName})` }} />
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>{varName}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
          {valor || "…"}
        </div>
        {papel && <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>{papel}</div>}
      </div>
    </div>
  );
}

export function Grade({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 12 }}>
      {children}
    </div>
  );
}

export function Painel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-surface-card)",
        border: "1px solid var(--color-border-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--color-action-primary)",
        background: "var(--color-surface-tint-brand)",
        padding: "14px 18px",
        borderRadius: "0 var(--radius-md) var(--radius-md) 0",
        fontSize: "var(--text-caption)",
        color: "var(--color-text-secondary)",
        maxWidth: "76ch",
      }}
    >
      {children}
    </div>
  );
}

export function Pagina({ titulo, lead, children }: { titulo: string; lead: string; children: ReactNode }) {
  return (
    <div style={{ maxWidth: 880, padding: 24, fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      <h1 style={{ fontSize: "var(--text-h1)", fontWeight: 700, marginBottom: 8 }}>{titulo}</h1>
      <p style={{ fontSize: "1.0625rem", color: "var(--color-text-secondary)", maxWidth: "64ch", marginBottom: 28 }}>
        {lead}
      </p>
      {children}
    </div>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return <h3 style={{ fontSize: "var(--text-h2)", fontWeight: 600, margin: "28px 0 12px" }}>{children}</h3>;
}

/** Alterna `data-theme` no `<html>` real (mesma mecânica do toggle do design-system.html) e remonta os filhos (`key`) pra forçar re-leitura das CSS vars após a troca. */
export function TemaToggle({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (tema === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    return () => document.documentElement.removeAttribute("data-theme");
  }, [tema]);

  return (
    <div>
      <button
        onClick={() => setTema((t) => (t === "dark" ? "light" : "dark"))}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border-strong)",
          color: "var(--color-text-secondary)",
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: "var(--text-caption)",
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        {tema === "dark" ? "☀️ Ver claro" : "🌙 Ver escuro"}
      </button>
      <div key={tema}>{children}</div>
    </div>
  );
}
