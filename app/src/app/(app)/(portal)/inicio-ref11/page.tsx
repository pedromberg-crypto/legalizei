"use client";

import {
  ProfileRow,
  SearchMic,
  AcoesRapidas,
  EmitirPorVoz,
  PergunteIA,
  NotasRecentes,
} from "@/components/lab/ref11-blocks";

/**
 * INÍCIO — REF. AI NOTES. Página inteira aprovada: composta 100% pelos blocos
 * validados (ref11-blocks).
 */
export default function InicioRef11() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          <ProfileRow />
          <div className="mt-4">
            <SearchMic />
          </div>
          <div className="mt-4">
            <AcoesRapidas />
          </div>
          <div className="mt-3">
            <EmitirPorVoz />
          </div>
          <div className="mt-6">
            <PergunteIA />
          </div>
          <div className="mt-6">
            <NotasRecentes />
          </div>
        </div>
      </div>
    </main>
  );
}
