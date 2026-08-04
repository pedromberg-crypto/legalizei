"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
 * acontece, e isso é ARGUMENTO de venda, não ausência de informação. Vale
 * igual pra MEI (sem taxa de governo dos dois jeitos), por isso a tela em si
 * não precisa de variante — só repassa `?regime=mei&contador=` adiante.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarPlanoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <MigrarPlanoView
      onSeguir={() => router.push(qs ? `/migrar/contrato?${qs}` : "/migrar/contrato")}
      onVoltar={() => router.push("/migrar/diagnostico")}
    />
  );
}
