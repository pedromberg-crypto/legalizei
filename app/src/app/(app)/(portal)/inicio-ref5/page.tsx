"use client";

import { DADOS } from "@/components/lab/nexo-shell";
import {
  DayStripFiscal,
  DasTicket,
  StatsCoral,
  ProximasObrigacoes,
  BlogCarousel,
} from "@/components/lab/ref5-blocks";

/**
 * INÍCIO — REF. RESERVAS (agenda + ticket + blog). Agora composta pelos blocos
 * validados (fonte única em ref5-blocks). O DAS-ticket já vem SEM barcode
 * (ajuste do Pedro), com Pix embaixo.
 */
export default function InicioRef5() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-4 pt-4">
          {/* Topo */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-secondary">Olá, {DADOS.primeiroNome} 👋</p>
              <h1 className="text-h1 text-text-primary">Sua semana</h1>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary">
              <Engrenagem />
            </button>
          </div>

          <div className="mt-4">
            <DayStripFiscal />
          </div>
          <div className="mt-3">
            <DasTicket />
          </div>
          <div className="mt-4">
            <StatsCoral />
          </div>
          <div className="mt-6">
            <ProximasObrigacoes />
          </div>
          <div className="mt-4">
            <BlogCarousel />
          </div>
        </div>
      </div>
    </main>
  );
}

function Engrenagem() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6.2 10a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.4 1.51h.09a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.4 1z" />
    </svg>
  );
}
