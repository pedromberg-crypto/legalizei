"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVIÇO AVULSO — sheet de detalhe + adicionar. 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * O momento de conversão: valor + o que inclui + preço → "Adicionar à minha
 * fatura" (sem cobrança na hora; entra na próxima). Fase 2 confirma + oferece
 * ver a fatura ou continuar.
 *
 * ─── FASE DE SELEÇÃO (ex.: Recalcular guia) ─────────────────────────────────
 * Alguns serviços agem sobre um ITEM. Recalcular guia só faz sentido em guia já
 * VENCIDA (≥1 dia): você emitiu nota depois do fechamento. Se `guias` vem, o
 * sheet abre num seletor: as vencidas são clicáveis, as a-vencer aparecem
 * bloqueadas com o motivo. Escolher → adiciona o recálculo daquela guia.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export type ServicoBase = {
  nome: string;
  desc: string;
  preco: string;
  inclui?: string[];
  Icone: () => ReactNode;
};

export type GuiaRecalc = {
  id: string;
  comp: string;
  valor: string;
  situacao: string;
  elegivel: boolean;
};

export function ServicoSheet({
  servico,
  guias,
  proximaFatura,
  onFechar,
}: {
  servico: ServicoBase;
  guias?: GuiaRecalc[];
  proximaFatura: string;
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  const [fase, setFase] = useState<"selecionar" | "detalhe" | "adicionado">(
    guias ? "selecionar" : "detalhe",
  );
  const [selecionada, setSelecionada] = useState<GuiaRecalc | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const sairCom = (cb: () => void) => {
    setEntrou(false);
    window.setTimeout(cb, 240);
  };

  const escolher = (g: GuiaRecalc) => {
    setSelecionada(g);
    setFase("adicionado");
  };

  const adicionado = fase === "adicionado";
  const oQueFoi = selecionada
    ? `Recálculo da guia de ${selecionada.comp}`
    : servico.nome;

  return (
    <div className="absolute inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={adicionado ? -1 : 0}
        onClick={() => {
          if (!adicionado) sairCom(onFechar);
        }}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col rounded-t-3xl bg-surface-page"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
        }}
      >
        <div className="relative shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
          {!adicionado && (
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => sairCom(onFechar)}
              className="absolute left-3 top-2 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
            >
              <IconeX />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adicionado ? (
            <div className="flex flex-col items-center py-2 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-state-success text-text-on-dark">
                <IconeCheck />
              </span>
              <h2 className="mt-4 text-h2 text-text-primary">Adicionado!</h2>
              <p className="mx-auto mt-1 max-w-[19rem] text-body text-text-secondary">
                <span className="font-semibold text-text-primary">{oQueFoi}</span>{" "}
                entra na sua próxima fatura, em {proximaFatura}. Sem cobrança
                agora, e dá pra remover antes de fechar.
              </p>
            </div>
          ) : fase === "selecionar" ? (
            <>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-tint-brand text-action-primary-sm">
                  <servico.Icone />
                </span>
                <h2 className="mt-3 text-h2 text-text-primary">{servico.nome}</h2>
                <p className="mt-1 text-body text-text-secondary">
                  {servico.preco} por guia. Escolha a guia que precisa recalcular.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {(guias ?? []).map((g) =>
                  g.elegivel ? (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => escolher(g)}
                      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-caption font-semibold text-text-primary">
                          {g.comp}
                        </p>
                        <p className="mt-0.5 text-micro text-state-danger-text">
                          {g.situacao}
                        </p>
                      </div>
                      <span className="shrink-0 text-caption font-semibold text-text-primary">
                        {g.valor}
                      </span>
                      <span className="shrink-0 text-text-tertiary">
                        <IconeChevron />
                      </span>
                    </button>
                  ) : (
                    <div
                      key={g.id}
                      aria-disabled
                      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 opacity-55"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-caption font-semibold text-text-primary">
                          {g.comp}
                        </p>
                        <p className="mt-0.5 text-micro text-text-tertiary">
                          {g.situacao}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-tertiary">
                        Ainda não venceu
                      </span>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-tint-brand text-action-primary-sm">
                  <servico.Icone />
                </span>
                <h2 className="mt-3 text-h2 text-text-primary">{servico.nome}</h2>
                <p className="mt-1 text-body text-text-secondary">{servico.desc}</p>
              </div>

              {servico.inclui && servico.inclui.length > 0 && (
                <div className="mt-5 rounded-2xl border border-border-hairline bg-surface-card p-4">
                  <p className="mb-2 text-micro text-text-tertiary">O que você recebe</p>
                  <div className="flex flex-col gap-2">
                    {servico.inclui.map((it) => (
                      <div key={it} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-state-success-text">
                          <IconeCheckMini />
                        </span>
                        <span className="text-caption text-text-secondary">{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-caption text-text-tertiary">Valor</span>
                <span className="text-h1 font-bold text-text-primary">
                  {servico.preco}
                </span>
              </div>
            </>
          )}
        </div>

        <div
          className="shrink-0 px-6 pt-3"
          style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
        >
          {adicionado ? (
            <>
              <Link
                href="/mais/plano"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-action-primary text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Ver minha fatura
              </Link>
              <div className="mt-1 flex justify-center">
                <Button variant="ghost" onClick={() => sairCom(onFechar)}>
                  Continuar
                </Button>
              </div>
            </>
          ) : fase === "selecionar" ? (
            <p className="text-center text-micro text-text-tertiary">
              Só dá pra recalcular guia já vencida (há pelo menos 1 dia).
            </p>
          ) : (
            <>
              <Button full onClick={() => setFase("adicionado")}>
                Adicionar à minha fatura
              </Button>
              <p className="mt-2 text-center text-micro text-text-tertiary">
                Sem cobrança agora. Entra na sua próxima fatura.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IconeX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
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
function IconeCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconeCheckMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
