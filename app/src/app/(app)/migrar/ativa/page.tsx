"use client";

import { useSearchParams } from "next/navigation";
import { MigrarAtivaView } from "@/components/wizard-migrar";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M5 — EMPRESA MIGRADA · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarAtivaView`).
 * Motor: `flow-migrar.js` → m5.ativacao + fim.migrada.
 *
 * ─── FECHA O LOOP DO M2 ───────────────────────────────────────────────────
 * A economia que o diagnóstico prometeu (com número REAL, não estimativa) vira
 * a **primeira tarefa concreta** da tela, com o valor na cara: "ajustar seu
 * pró-labore e economizar R$X/mês".
 *
 * Isso é de propósito e é a diferença mais importante em relação ao N24 do flow
 * #1: lá a promessa é uma estimativa que só se resolve meses depois (e daí nasce
 * a dívida `promessa-quebrada`); aqui o número era real desde a 2ª tela, então
 * ele PODE virar ação imediata. Deixar a promessa sumir depois da venda seria
 * repetir exatamente o erro que o flow #2 não precisa cometer.
 * 🆕 04/08 — `?regime=mei` troca o "primeiro ganho" de economia (Fator R, só
 * ME) por vigilância de limite de faturamento (MEI não tem Fator R).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarAtivaPage() {
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  return <MigrarAtivaView regime={mei ? "mei" : "me"} />;
}
