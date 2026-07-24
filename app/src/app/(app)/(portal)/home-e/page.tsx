"use client";

import { ProfileRow } from "@/components/lab/ref11-blocks";
import { CategoryCircles, ContaSwipe, PromoDebito } from "@/components/lab/ref12-blocks";
import { EmitirPra } from "@/components/lab/ref6-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão E — "Toque rápido" (ação-led, ref12+11+6).
 * Tudo a um gesto: perfil → círculos de atalho → SWIPE-TO-PAY do DAS → emitir
 * pra cliente recente → vigília → promo do débito automático. Velocidade.
 * Mesclagem nova dos campeões (só visualização).
 */
export default function HomeEPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <ProfileRow />
            <CategoryCircles />
            <ContaSwipe />
            <EmitirPra />
            <Vigilancia />
            <PromoDebito />
          </div>
        </div>
    </main>
  );
}
