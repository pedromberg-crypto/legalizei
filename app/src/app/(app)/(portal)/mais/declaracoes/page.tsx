"use client";

import type { ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · DECLARAÇÕES — o que a gente entrega ao governo (27/07). De /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * As declarações obrigatórias do Simples, agrupadas por CADÊNCIA (todo mês ×
 * todo ano). Diferença das outras duas telas da dobra:
 *   · "Você está em dia" = o veredito (está tudo certo?).
 *   · "Relatórios" = documento PRA VOCÊ (dinheiro).
 *   · "Declarações" = os atos que ENTREGAMOS ao fisco por você.
 * Cada linha diz em português o que é + status + prazo. Tese: você não preenche
 * nada, a gente entrega no prazo e guarda o comprovante.
 *
 * ⚠️ Dados = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Estado = "entregue" | "no-prazo";

type Declaracao = {
  sigla: string;
  nome: string;
  oQueE: string;
  estado: Estado;
  quando: string;
  temComprovante: boolean;
};

type Grupo = { cadencia: string; itens: Declaracao[] };

const GRUPOS: Grupo[] = [
  {
    cadencia: "Todo mês",
    itens: [
      {
        sigla: "PGDAS-D",
        nome: "Apuração do Simples",
        oQueE: "Informa quanto você faturou no mês e calcula o imposto.",
        estado: "entregue",
        quando: "Entregue · junho",
        temComprovante: true,
      },
    ],
  },
  {
    cadencia: "Todo ano",
    itens: [
      {
        sigla: "DEFIS",
        nome: "Declaração anual do Simples",
        oQueE: "Fecha o ano da empresa: faturamento, sócios e lucros.",
        estado: "no-prazo",
        quando: "Próxima: maio/2027",
        temComprovante: false,
      },
    ],
  },
];

const ST: Record<Estado, { tint: string; label: string }> = {
  entregue: {
    tint: "bg-state-success-tint text-state-success-text",
    label: "Entregue",
  },
  "no-prazo": {
    tint: "bg-state-info-tint text-state-info-text",
    label: "No prazo",
  },
};

export default function DeclaracoesPage() {
  return (
    <>
      <TelaHeader meta="Contabilidade · Declarações" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Declarações</h1>
              <p className="mt-1 text-body text-text-secondary">
                O que a gente entrega ao governo por você. Você não preenche nada.
              </p>
            </div>

            {/* Grupos por cadência */}
            {GRUPOS.map((g) => (
              <div key={g.cadencia}>
                <p className="mb-2 text-body-strong font-semibold text-text-primary">
                  {g.cadencia}
                </p>
                <div className="flex flex-col gap-2">
                  {g.itens.map((d) => (
                    <DeclaracaoCard key={d.sigla} d={d} />
                  ))}
                </div>
              </div>
            ))}

            {/* Nota de tranquilidade */}
            <div className="flex items-start gap-3 rounded-2xl bg-surface-tint-brand p-4">
              <span className="mt-0.5 shrink-0 text-action-primary-sm">
                <IconeEscudo />
              </span>
              <p className="text-caption text-text-secondary">
                Cada declaração é entregue no prazo e o comprovante fica guardado
                aqui e em{" "}
                <span className="font-semibold text-text-primary">Documentos</span>.
                Se o governo mudar uma regra, a gente ajusta sem você precisar
                saber.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Card de declaração ───────────────────────────────────────────────────── */
function DeclaracaoCard({ d }: { d: Declaracao }) {
  const st = ST[d.estado];
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-alt text-text-secondary">
          <IconeDoc />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-caption font-semibold text-text-primary">
              {d.nome}
            </p>
            <span className="shrink-0 rounded bg-surface-alt px-1.5 py-0.5 text-[10px] font-bold text-text-tertiary">
              {d.sigla}
            </span>
          </div>
          <p className="mt-0.5 text-micro text-text-tertiary">{d.oQueE}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border-hairline pt-3">
        <span
          className={`rounded-full px-2 py-0.5 text-micro font-semibold ${st.tint}`}
        >
          {st.label}
        </span>
        <span className="text-micro text-text-tertiary">{d.quando}</span>
        {d.temComprovante && (
          <button
            type="button"
            className="ml-auto flex items-center gap-1 text-micro font-semibold text-action-primary-sm"
          >
            <IconeBaixar />
            Comprovante
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="m9.5 14 1.5 1.5 3-3" />
    </svg>
  );
}
function IconeBaixar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function IconeEscudo(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
