"use client";

import { useState } from "react";
import { TelaHeader } from "@/components/ui/tela";
import { PagamentoSheet } from "./pagamento-sheet";
import { CancelarSheet } from "./cancelar-sheet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · GERENCIAR PLANO — billing da recorrência (24/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * A gestão dos pagamentos do NOSSO app: plano atual, PRÓXIMA FATURA, forma de
 * pagamento e faturas anteriores.
 *
 * ─── MODELO DA PRÓXIMA FATURA (27/07) ───────────────────────────────────────
 * Serviço avulso (ex.: recálculo de guia R$15,90) NÃO cobra na hora — ele
 * ENTRA na próxima fatura, junto da mensalidade. Mas é EFETIVO: pedir = o
 * trabalho já começou, então NÃO é removível (chip "Em andamento", sem X). A
 * pessoa vê o que já contratou e o total consolidado. Transparência > surpresa,
 * sem fingir carrinho.
 *
 * ⚠️ Preços/valores = FAROL/FAKE (preço deferido ao Mauro).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PLANO = { nome: "Legalizai Mensal", valor: 14900, renova: "05/08" };

const PAGAMENTO = { bandeira: "Mastercard", fim: "6411", vence: "08/28" };

const FATURAS = [
  { comp: "Julho de 2026", valor: "R$ 149,00", data: "05/07" },
  { comp: "Junho de 2026", valor: "R$ 164,90", data: "05/06" },
  { comp: "Maio de 2026", valor: "R$ 149,00", data: "05/05" },
  { comp: "Abril de 2026", valor: "R$ 149,00", data: "05/04" },
];

type Avulso = {
  id: string;
  label: string;
  valor: number;
  quando: string;
  situacao: string; // status do trabalho: "Em andamento" · "Concluído"
};

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PlanoPage() {
  const adicionados: Avulso[] = [
    { id: "a1", label: "Recálculo de guia de imposto", valor: 1590, quando: "pedido em 22/07", situacao: "Recalculando" },
    { id: "a2", label: "Certidão negativa (CND)", valor: 3500, quando: "pedido em 20/07", situacao: "Em andamento" },
  ];

  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [cancelarAberto, setCancelarAberto] = useState(false);

  const totalProxima =
    PLANO.valor + adicionados.reduce((s, i) => s + i.valor, 0);

  return (
    <>
      <TelaHeader meta="Plano" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Plano atual */}
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-micro text-text-tertiary">Seu plano</p>
                  <p className="text-body-strong font-semibold text-text-primary">
                    {PLANO.nome}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
                  Ativo
                </span>
              </div>
              <p className="mt-2 text-caption text-text-secondary">
                {formatBRL(PLANO.valor / 100)}/mês · renova em {PLANO.renova}
              </p>
            </div>

            {/* Próxima fatura — plano + avulsos adicionados */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Próxima fatura
              </p>
              <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
                <p className="mb-1 text-micro text-text-tertiary">
                  Fecha e cobra em {PLANO.renova}
                </p>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-caption text-text-primary">Plano mensal</span>
                  <span className="text-caption font-semibold text-text-primary">
                    {formatBRL(PLANO.valor / 100)}
                  </span>
                </div>

                {adicionados.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center gap-3 border-t border-border-hairline py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-caption text-text-primary">
                        {i.label}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-micro text-text-tertiary">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-tint-brand px-1.5 py-0.5 font-semibold text-action-primary-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-action-primary-sm" />
                          {i.situacao}
                        </span>
                        <span>· {i.quando}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-caption font-semibold text-text-primary">
                      {formatBRL(i.valor / 100)}
                    </span>
                  </div>
                ))}

                <div className="mt-1 flex items-baseline justify-between border-t border-border-hairline pt-3">
                  <span className="text-caption font-semibold text-text-primary">
                    Total da próxima fatura
                  </span>
                  <span className="text-h2 font-bold text-text-primary">
                    {formatBRL(totalProxima / 100)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-micro text-text-tertiary">
                Serviços avulsos que você pede entram aqui, sem cobrança na hora,
                e caem nesta fatura. Como o trabalho já começa quando você pede,
                eles são cobrança confirmada.
              </p>
            </div>

            {/* Forma de pagamento */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-body-strong font-semibold text-text-primary">
                  Forma de pagamento
                </p>
                <button
                  type="button"
                  onClick={() => setPagamentoAberto(true)}
                  className="text-caption font-semibold text-action-primary-sm"
                >
                  Trocar
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4">
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-text-secondary">
                  <IconeCartao />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-caption font-semibold text-text-primary">
                    {PAGAMENTO.bandeira} •••• {PAGAMENTO.fim}
                  </p>
                  <p className="text-micro text-text-tertiary">
                    Vence {PAGAMENTO.vence}
                  </p>
                </div>
              </div>

              {/* Adicionar forma de pagamento (estilo dashed do calendário) */}
              <button
                type="button"
                onClick={() => setPagamentoAberto(true)}
                className="mt-2 w-full text-left"
              >
                <div className="flex items-center justify-between rounded-2xl border border-dashed border-border-strong p-4">
                  <div className="min-w-0">
                    <p className="text-caption font-semibold text-text-primary">
                      Adicionar forma de pagamento
                    </p>
                    <p className="mt-0.5 text-micro text-text-tertiary">
                      Cartão ou Pix
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-dark text-text-on-dark">
                    <IconeMais />
                  </span>
                </div>
              </button>
            </div>

            {/* Faturas anteriores */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Faturas anteriores
              </p>
              <div className="flex flex-col gap-2">
                {FATURAS.map((f) => (
                  <button
                    key={f.comp}
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-semibold text-text-primary">
                        {f.comp}
                      </p>
                      <p className="mt-0.5 text-micro text-state-success-text">
                        Paga em {f.data}
                      </p>
                    </div>
                    <span className="shrink-0 text-caption font-semibold text-text-primary">
                      {f.valor}
                    </span>
                    <span className="shrink-0 text-text-tertiary">
                      <IconeBaixar />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cancelar */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setCancelarAberto(true)}
                className="text-caption font-semibold text-state-danger-text"
              >
                Cancelar assinatura
              </button>
            </div>
          </div>
        </div>
      </main>

      {pagamentoAberto && (
        <PagamentoSheet
          atualFim={PAGAMENTO.fim}
          onFechar={() => setPagamentoAberto(false)}
        />
      )}

      {cancelarAberto && (
        <CancelarSheet
          ativaAte={PLANO.renova}
          onFechar={() => setCancelarAberto(false)}
          onConfirmar={() => setCancelarAberto(false)}
        />
      )}
    </>
  );
}

function IconeCartao() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
function IconeMais() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconeBaixar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
