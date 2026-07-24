"use client";

import { HeroDark, MovimentacoesRecentes } from "@/components/lab/ref6-blocks";
import { StatsCoral, DasTicket } from "@/components/lab/ref5-blocks";
import { PergunteIA } from "@/components/lab/ref11-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão B — "Pulso" (fintech-led).
 * Aposta: o NEGÓCIO como banco. Hero dark com faturamento + 4 ações → os
 * números → vigília → o DAS como ticket → movimentações → IA. Estética premium.
 * Composição de campeões do acervo (só visualização).
 */
export default function HomeBPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <HeroDark boxed />
            <StatsCoral />
            <Vigilancia />
            <DasTicket />
            <MovimentacoesRecentes />
            <PergunteIA />
          </div>
        </div>
    </main>
  );
}
