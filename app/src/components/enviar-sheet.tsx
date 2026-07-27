"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENVIAR — bottom-sheet de canais (WhatsApp · E-mail · Copiar link). 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * Genérico: serve a nota (enviar ao cliente) e a guia (enviar o PDF pra você).
 * `titulo`/`sub` customizam a copy; sem sub, cai em "Mandar pra {paraNome}".
 * z-[60] pra ficar por cima de um visualizador em tela cheia (z-50). Mock: cada
 * canal só fecha (no real: deep-link WhatsApp / mailto / clipboard).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function EnviarSheet({
  titulo = "Enviar ao cliente",
  sub,
  paraNome,
  onFechar,
}: {
  titulo?: string;
  sub?: string;
  paraNome?: string;
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  return (
    <div className="absolute inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={sair}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-3xl bg-surface-page"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
          paddingBottom: "calc(16px + var(--safe-bottom))",
        }}
      >
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        <div className="px-6 pt-3">
          <p className="text-h2 text-text-primary">{titulo}</p>
          {sub ? (
            <p className="mt-1 text-caption text-text-secondary">{sub}</p>
          ) : paraNome ? (
            <p className="mt-1 text-caption text-text-secondary">
              Mandar pra{" "}
              <span className="font-semibold text-text-primary">{paraNome}</span>.
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-2 px-6">
          <Canal
            icone={<IconeWhats />}
            corIcone="text-[#25D366]"
            titulo="WhatsApp"
            sub="Manda o link no chat"
            onClick={sair}
          />
          <Canal
            icone={<IconeEmail />}
            corIcone="text-action-primary-sm"
            titulo="E-mail"
            sub="Envia o PDF anexo"
            onClick={sair}
          />
          <Canal
            icone={<IconeLink />}
            corIcone="text-text-secondary"
            titulo="Copiar link"
            sub="Copia o link pra compartilhar"
            onClick={sair}
          />
        </div>
      </div>
    </div>
  );
}

function Canal({
  icone,
  corIcone,
  titulo,
  sub,
  onClick,
}: {
  icone: ReactNode;
  corIcone: string;
  titulo: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt ${corIcone}`}>
        {icone}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-caption font-semibold text-text-primary">{titulo}</span>
        <span className="block text-micro text-text-tertiary">{sub}</span>
      </span>
    </button>
  );
}

function IconeWhats() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c.6.3 1.1.4 1.5.5a3.4 3.4 0 0 0 1.5.1c.5-.1 1.4-.6 1.6-1.1a2 2 0 0 0 .1-1.1c0-.2-.2-.2-.4-.3z" />
    </svg>
  );
}
function IconeEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconeLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
