"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORMA DE PAGAMENTO — bottom-sheet (24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * Abre pelo "Trocar" E pelo "+ Adicionar forma de pagamento". Dá as
 * alternativas: o cartão atual (ativo), Pix (a gente manda o Pix a cada fatura)
 * e adicionar um cartão novo. Mesma linguagem de folha dos outros sheets.
 * Mock: cada opção só fecha (no real: seleciona / abre o form do cartão).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function PagamentoSheet({
  atualFim,
  onFechar,
}: {
  atualFim: string;
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
    <div className="absolute inset-0 z-50">
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
          <p className="text-h2 text-text-primary">Forma de pagamento</p>
          <p className="mt-1 text-caption text-text-secondary">
            Como pagar sua mensalidade e os avulsos.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 px-6">
          <Opcao
            icone={<IconeCartao />}
            corIcone="text-text-secondary"
            titulo={`Mastercard •••• ${atualFim}`}
            sub="Seu cartão atual"
            ativo
            onClick={sair}
          />
          <Opcao
            icone={<IconePix />}
            corIcone="text-[#0f9b8e]"
            titulo="Pix"
            sub="A gente te manda o Pix a cada fatura"
            onClick={sair}
          />
          <Opcao
            icone={<IconeMais />}
            corIcone="text-action-primary-sm"
            titulo="Adicionar cartão"
            sub="Cadastrar um cartão novo"
            onClick={sair}
          />
        </div>
      </div>
    </div>
  );
}

function Opcao({
  icone,
  corIcone,
  titulo,
  sub,
  ativo = false,
  onClick,
}: {
  icone: ReactNode;
  corIcone: string;
  titulo: string;
  sub: string;
  ativo?: boolean;
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
      {ativo ? (
        <span className="shrink-0 text-state-success">
          <IconeCheck />
        </span>
      ) : (
        <span className="shrink-0 text-text-tertiary">
          <IconeChevron />
        </span>
      )}
    </button>
  );
}

function IconeCartao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
function IconePix() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 21 12 12 21 3 12z" />
      <path d="M8.5 8.5 12 12l3.5-3.5M8.5 15.5 12 12l3.5 3.5" />
    </svg>
  );
}
function IconeMais() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="m7.5 12.4 3.1 3.1 6-6.2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconeChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
