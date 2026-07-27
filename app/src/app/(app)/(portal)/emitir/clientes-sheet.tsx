"use client";

import { useEffect, useState } from "react";
import type { Cliente } from "./page";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SELEÇÃO DE CLIENTE — "Ver todos" + busca (bottom-sheet).
 * ═══════════════════════════════════════════════════════════════════════════
 * As bolhas da tela de emissão mostram só os RECORRENTES (ordenados por
 * frequência). Quando a base cresce, rolar lateralmente não escala. Este sheet
 * é a saída: a lista INTEIRA, pesquisável por nome/CNPJ/cidade, atrás de um
 * "Ver todos" discreto — sem poluir a tela de emissão.
 *
 * Mesma linguagem de folha do [[resumo-sheet]]: scrim, grabber, slide-up,
 * safe-area. Escolher um cliente desliza a folha pra baixo e SÓ ENTÃO seleciona
 * (o form atrás já mostra o CardFavorecido).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ClientesSheet({
  clientes,
  selecionado,
  onSelect,
  onFechar,
}: {
  clientes: Cliente[];
  selecionado: string | null;
  onSelect: (id: string) => void;
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Desce deslizando e SÓ ENTÃO roda o callback (fecha / seleciona).
  const sairCom = (cb: () => void) => {
    setEntrou(false);
    window.setTimeout(cb, 240);
  };

  // Busca insensível a acento e caixa.
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const termo = norm(q.trim());
  const matches = termo
    ? clientes.filter((c) => norm(`${c.nome} ${c.doc} ${c.cidade}`).includes(termo))
    : clientes;
  // Buscando: no MÁXIMO 5 (cabem na altura fixa, sem rolar). Sem busca: a base
  // inteira rola dentro da mesma altura, na ordem dos atalhos do topo (o
  // `clientes` já chega ordenado por frequência, igual às bolhas).
  const MAX = 5;
  const visiveis = termo ? matches.slice(0, MAX) : matches;

  return (
    <div className="absolute inset-0 z-50">
      {/* Scrim */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => sairCom(onFechar)}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />

      {/* Folha */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[85%] flex-col rounded-t-3xl bg-surface-page"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
        }}
      >
        {/* Cabeça: grabber (puxar pra baixo / tocar fora fecha — sem X) */}
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        {/* Título + busca (fixos) */}
        <div className="shrink-0 px-6 pb-2 pt-3">
          <p className="mb-3 text-h2 text-text-primary">Seus clientes</p>
          <div className="flex items-center gap-2 rounded-xl border border-border-hairline bg-surface-card px-3 focus-within:border-border-focus">
            <span className="shrink-0 text-text-tertiary">
              <IconeLupa />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              placeholder="Buscar por nome, CNPJ ou cidade"
              aria-label="Buscar cliente"
              className="w-full bg-transparent py-2.5 text-caption text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Lista — ALTURA FIXA (cabe 5 linhas). A folha não muda de tamanho:
            buscando mostra ≤5 sem rolar; sem busca a base inteira rola dentro
            da mesma altura; e o vazio ocupa a MESMA altura com a mensagem
            centrada. (325px ≈ 5 × 65px de linha.) */}
        <div
          className="shrink-0 px-6"
          style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
        >
          <div className="h-[325px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {matches.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-caption text-text-tertiary">
                  Não encontramos ninguém com esse nome.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {visiveis.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => sairCom(() => onSelect(c.id))}
                      className="flex w-full items-center gap-3 border-b border-border-hairline py-3 text-left last:border-0"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark text-micro font-bold text-text-on-dark">
                        {c.ini}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-caption font-semibold text-text-primary">
                          {c.nome}
                        </span>
                        <span className="block truncate text-micro text-text-tertiary">
                          {c.doc} · {c.cidade}
                        </span>
                      </span>
                      {selecionado === c.id ? (
                        <span className="shrink-0 text-state-success">
                          <IconeCheck />
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-secondary">
                          {c.tipo}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconeLupa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
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
