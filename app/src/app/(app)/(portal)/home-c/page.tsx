"use client";

import {
  ProfileRow,
  PergunteIA,
  AcoesRapidas,
  NotasRecentes,
} from "@/components/lab/ref11-blocks";
import { ProximoCompromisso } from "@/components/lab/ref9-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão C — "Copiloto" (IA-led).
 * Aposta: a IACA na FRENTE. Perfil → pergunte à IA → grid de ações → o DAS →
 * vigília → notas recentes. O app como parceiro que age, não ferramenta que
 * espera. Composição de campeões do acervo (só visualização).
 */
export default function HomeCPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <ProfileRow />
            <PergunteIA />
            <AcoesRapidas />
            <ProximoCompromisso />
            <Vigilancia />
            <NotasRecentes />
          </div>
        </div>
    </main>
  );
}
