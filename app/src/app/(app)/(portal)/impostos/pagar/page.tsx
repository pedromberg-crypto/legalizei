"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P3 — PAGAR O DAS  ·  arquétipo DETALHE · shell APP · portal · ⭐ DIFERENCIAL
 * ═══════════════════════════════════════════════════════════════════════════
 * Matriz: execucao/matriz-portal-interno.md → Módulo B (P3) · o gap nº1
 *
 * ─── O MAIOR LOOP QUE ELES DEIXAM ABERTO ────────────────────────────────────
 * Dossiê §4: no líder, você marca "não paguei" pra HABILITAR o pagamento, paga
 * fora, e depois volta pra marcar "paguei". Trabalho + fonte de erro. Aqui a
 * gente FECHA o loop: paga pelo app, e o status vira sozinho. Nenhum "confirme
 * que pagou" existe neste produto.
 *
 * ⚠️ DEPENDÊNCIA DURA (🔴, matriz): a EXECUÇÃO do pagamento (Serpro emite a
 * guia; pagar = Pix/Open Finance/débito) é decisão aberta. O CTA aqui é FAROL —
 * mostra a UX pretendida (pagar in-app), não a integração. Se não fechar, a
 * gente cai no mesmo "confirme que pagou" — por isso é o item que mais importa.
 *
 * Jargão fora: "DARF Unificado / competência" → "seu imposto de junho". A
 * decomposição fica em 1 card simples (faturou X → imposto de Y% sobre isso),
 * com link pro detalhe da alíquota (P4), sem despejar a guia crua.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Vem do motor (🔧) + cadastro/engine (⚙️). Mock pra farol.
const DAS = {
  valor: "R$ 178,31",
  vence: "20 de julho",
  faturamento: "R$ 4.200,00",
  aliquota: "6%",
};

export default function PagarPage() {
  return (
    <>
      <TelaHeader meta="Imposto de junho" voltar="/impostos" />

      <main className="app-main">
        {/* O número É a tela. Grande, primeiro, com o "quando" logo abaixo —
            o que o cliente quer saber é "quanto e até quando". */}
        <Titulo sub={`Seu imposto de junho. Vence ${DAS.vence}.`}>
          {DAS.valor}
        </Titulo>

        <Corpo>
          {/* ── De onde vem, sem jargão ─────────────────────────────────────
              Duas linhas: o que você faturou, e o imposto sobre isso. É a
              memória de cálculo em linguagem de gente. O "ver detalhe" leva à
              composição (P4), pra quem quiser abrir — sem obrigar ninguém. */}
          <Card>
            <p className="text-caption font-semibold text-text-primary mb-2">
              De onde vem esse valor
            </p>
            <div className="flex items-center justify-between">
              <p className="text-caption text-text-secondary">
                Você faturou em junho
              </p>
              <p className="text-caption text-text-primary">{DAS.faturamento}</p>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-caption text-text-secondary">
                Imposto de {DAS.aliquota} sobre isso
              </p>
              <p className="text-caption text-text-primary">{DAS.valor}</p>
            </div>
            <button className="mt-3 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
              Ver a composição
            </button>
          </Card>

          {/* ── O que nos separa deles, dito na tela ─────────────────────────
              Sem "confirme que pagou". Assim que cai, vira sozinho. É o alívio
              que fecha o loop que o líder deixa aberto. */}
          <p className="text-micro text-text-tertiary">
            Assim que o pagamento cair, a gente atualiza sozinho. Você não
            precisa confirmar nada.
          </p>
        </Corpo>

        {/* ⚠️ Farol: a execução (Pix/Open Finance) é a dependência aberta. */}
        <Rodape>
          <Button full>Pagar com Pix</Button>
          <div className="mt-2 flex justify-center">
            <Button variant="ghost">Ver o boleto</Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}
