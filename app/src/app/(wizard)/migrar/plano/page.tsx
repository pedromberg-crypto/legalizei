"use client";

import { useRouter } from "next/navigation";
import { MigrarPlanoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3 — A CONTA DA MIGRAÇÃO · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarPlanoView`).
 * Motor: `flow-migrar.js` → m3.conta_abertura.
 *
 * ⚠️ Diferença de fundo em relação ao N7: **não existe taxa de governo aqui.**
 * A empresa já existe — sem DAE da Junta, sem TFLF. O cliente paga só a
 * mensalidade. O choque de custo do flow #1 (~R$463 na 3ª tela, UX-54) não
 * acontece, e isso é ARGUMENTO de venda, não ausência de informação.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarPlanoPage() {
  const router = useRouter();

  return (
    <MigrarPlanoView
      onSeguir={() => router.push("/migrar/contrato")}
      onVoltar={() => router.push("/migrar/diagnostico")}
    />
  );
}
