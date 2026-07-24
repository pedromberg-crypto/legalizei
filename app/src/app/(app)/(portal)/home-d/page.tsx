"use client";

import { Saudacao } from "@/components/lab/ref7-blocks";
import {
  DayStripFiscal,
  ProximasObrigacoes,
  DasTicket,
  BlogCarousel,
} from "@/components/lab/ref5-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão D — "Agenda fiscal" (tempo-led, ref5).
 * O TEMPO primeiro: day-strip com countdown → obrigações do mês → o DAS como
 * ticket → vigília → aprenda com a gente. A home como sua agenda fiscal.
 * Mesclagem nova dos campeões (só visualização).
 */
export default function HomeDPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <Saudacao />
            <DayStripFiscal />
            <ProximasObrigacoes />
            <DasTicket />
            <Vigilancia />
            <BlogCarousel />
          </div>
        </div>
    </main>
  );
}
