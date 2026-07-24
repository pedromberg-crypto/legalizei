"use client";

import { Saudacao, SuaSituacao } from "@/components/lab/ref7-blocks";
import { ProximoCompromisso, QuemCuida } from "@/components/lab/ref9-blocks";
import { PergunteIA } from "@/components/lab/ref11-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão A — "Acolhe" (wellness-led).
 * Aposta: 1ª coisa = ALÍVIO. Saudação calma → o DAS "a gente já gerou" →
 * "você está em dia" → vigília → quem cuida → IA. A estética que desarma o
 * domínio assustador. Composição de campeões do acervo (só visualização).
 */
export default function HomeAPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <Saudacao />
            <ProximoCompromisso />
            <SuaSituacao />
            <Vigilancia />
            <QuemCuida />
            <PergunteIA />
          </div>
        </div>
    </main>
  );
}
