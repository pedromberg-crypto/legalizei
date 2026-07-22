"use client";

import type { ReactNode } from "react";
import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P2 — MEUS IMPOSTOS  ·  arquétipo LISTA (shell novo) · shell APP · portal
 * ═══════════════════════════════════════════════════════════════════════════
 * Matriz: execucao/matriz-portal-interno.md → Módulo B (P2)
 *
 * O shell LISTA nasce aqui e serve depois P5 (notas), P11 (relatórios) e P13
 * (documentos): coleção por período + item que abre um detalhe. Um item vivo
 * (o do mês, a pagar) + histórico. Por isso é a 2ª tela do batch: paga o custo
 * de um shell que se reusa 4 vezes.
 *
 * ─── O FLANCO nº1 DO LÍDER: "confirme que pagou" ────────────────────────────
 * O dossiê §4 achou o maior loop aberto deles: a plataforma NÃO sabe se você
 * pagou o DAS — ela te faz marcar ✓/✗ na mão. Aqui a gente vira isso: o
 * histórico já mostra "pago" (a gente acompanha), e a única ação é PAGAR, no
 * item do mês. Nada de conciliação empurrada pro cliente.
 *
 * ⚠️ Jargão fora: "DARF Unificado / competência / guia" viram "imposto do mês".
 * O valor vem do motor contábil (🔧, dep. dev) — aqui é farol com mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ESTE_MES = {
  comp: "Junho de 2026",
  valor: "R$ 178,31",
  vence: "Vence 20/07",
};

const HISTORICO = [
  { comp: "Maio de 2026", valor: "R$ 152,90", quando: "Pago em 18/06" },
  { comp: "Abril de 2026", valor: "R$ 141,20", quando: "Pago em 20/05" },
  { comp: "Março de 2026", valor: "R$ 138,60", quando: "Pago em 19/04" },
];

export default function ImpostosPage() {
  return (
    <>
      <TelaHeader meta="Impostos" />

      <main className="app-main">
        <Titulo sub="Todo mês a gente calcula e você paga por aqui. Sem planilha, sem adivinhação.">
          Seus impostos
        </Titulo>

        <Corpo>
          {/* ── DESTE MÊS: o item vivo, clicável → P3 pagar ─────────────────
              Destaque com borda forte (é o que tem ação). Não é card de alerta:
              é a guia normal do mês, só que ainda aberta. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Deste mês
            </p>
            <button className="w-full text-left">
              <div className="rounded-lg border border-border-strong bg-surface-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-caption text-text-secondary">
                    {ESTE_MES.comp}
                  </p>
                  <span className="text-micro font-semibold text-state-info-text">
                    {ESTE_MES.vence}
                  </span>
                </div>
                <p className="text-h2 text-text-primary mt-1">
                  {ESTE_MES.valor}
                </p>
                <p className="mt-2 text-caption font-semibold text-action-primary-sm">
                  Pagar agora
                </p>
              </div>
            </button>
          </div>

          {/* ── JÁ PAGOS: o histórico, com o status que O LÍDER faz o cliente
              marcar na mão. Aqui a gente já sabe: check verde, data do pgto. ── */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Já pagos
            </p>
            <div className="flex flex-col gap-2">
              {HISTORICO.map((g) => (
                <GuiaPaga key={g.comp} comp={g.comp} valor={g.valor} quando={g.quando} />
              ))}
            </div>
          </div>

          {/* A diferença dita em 1 linha: a gente acompanha, você não concilia. */}
          <p className="text-micro text-text-tertiary">
            A gente acompanha o pagamento pra você. Nada de marcar &ldquo;paguei&rdquo; na mão.
          </p>
        </Corpo>
      </main>
    </>
  );
}

/* ─── Uma guia já paga: check verde + competência + valor + quando ─────────── */
function GuiaPaga({
  comp,
  valor,
  quando,
}: {
  comp: string;
  valor: string;
  quando: string;
}) {
  return (
    <Linha>
      <span className="mt-0.5">
        <StatusIcon estado="feito" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption font-semibold text-text-primary">{comp}</p>
          <p className="text-caption text-text-secondary">{valor}</p>
        </div>
        <p className="text-micro text-text-tertiary mt-0.5">{quando}</p>
      </div>
    </Linha>
  );
}

function Linha({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border-hairline bg-surface-card p-4">
      {children}
    </div>
  );
}
