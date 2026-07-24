"use client";

import { ProximoCompromisso, QuemCuida } from "@/components/lab/ref9-blocks";
import {
  NotasRecentesMov,
  AtalhosRapidos,
  CabecalhoCampea,
  AprendaGradiente,
} from "@/components/lab/campea-blocks";

/**
 * HOME FINAL · CAMPEÃ — a home montada peça por peça com o Pedro (só visualização).
 *
 * A composição (última dobra fechada 23/07):
 *   1. CabecalhoCampea    (Saudação ref7 + pill CNPJ copiável + selo verde)
 *   2. ProximoCompromisso (da versão A · ref9)
 *   3. AtalhosRapidos     (grid ref11 + título "Atalhos rápidos")
 *   4. NotasRecentesMov   (híbrido: notas ref11 + design mov. ref6)
 *   5. AprendaGradiente   (blog ref5 no design de card gradiente escuro)
 *   6. QuemCuida          (da versão A · ref9 · última dobra)
 */
export default function HomeCampeaPage() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
          <CabecalhoCampea />
          <ProximoCompromisso />
          <AtalhosRapidos />
          <NotasRecentesMov />
          <AprendaGradiente />
          <QuemCuida />
        </div>
      </div>
    </main>
  );
}
