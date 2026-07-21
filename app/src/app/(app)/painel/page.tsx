"use client";

import { PainelView } from "@/components/painel";

/**
 * N21 · PAINEL (andamento) — shell APP · spec T20.
 * Mock pra farol: 2 etapas fechadas, o registro na Junta girando. Solo.
 */
export default function PainelPage() {
  return <PainelView concluidas={2} emAndamento={2} socios={1} />;
}
