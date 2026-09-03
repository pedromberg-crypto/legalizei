"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";
import { GuiasRecentes } from "@/components/lab/impostos-blocks";

/**
 * IMPOSTOS — VERSÃO 1 (saldo + transações). Card de saldo inline (não validado)
 * + o bloco GuiasRecentes validado (impostos-blocks, fonte única).
 */
export default function ImpostosV1() {
  return (
    <>
      <TelaHeader meta="Impostos" semVoltar />
      <main className="app-main">
        <Titulo>Seus impostos</Titulo>
        <Corpo>
          {/* Card de "saldo" (inline, não validado) */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-5">
            <p className="text-caption text-text-secondary">A pagar este mês</p>
            <p className="mt-1 text-display font-bold text-text-primary">R$ 178,31</p>
            <p className="mt-1 text-caption text-text-tertiary">Imposto de junho · vence 20/07</p>
            <div className="mt-4">
              <Button variant="primarySm">Pagar com Pix</Button>
            </div>
          </div>

          <GuiasRecentes />
        </Corpo>
      </main>
    </>
  );
}
