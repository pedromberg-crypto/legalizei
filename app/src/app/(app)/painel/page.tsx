"use client";

import { PainelView } from "@/components/painel";

/**
 * N21 · PAINEL (andamento) — shell APP · spec T20.
 * Mock pra farol: documentação feita (índice 0), análise de viabilidade
 * girando (índice 1). ⚠️ 29/07: os índices mudaram — a lista de `ETAPAS`
 * caiu de 4 pra 3 (ver `components/painel.tsx`).
 */
export default function PainelPage() {
  return <PainelView concluidas={1} emAndamento={1} socios={1} />;
}
