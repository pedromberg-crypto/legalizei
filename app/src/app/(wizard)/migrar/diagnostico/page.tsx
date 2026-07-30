"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarDiagnosticoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 — DIAGNÓSTICO COM O NÚMERO REAL · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarDiagnosticoView`).
 * Motor: `flow-migrar.js` → m2.diagnostico + m2.honestidade.
 *
 * 🎯 A maior vantagem do flow #2 sobre o #1. A empresa tem 12+ meses de
 * histórico, então o Fator R sai do que DE FATO aconteceu (CGSN 140/18 art. 26 —
 * usa os 12 meses sem proporcionalizar), não de uma faixa declarada. A dívida
 * `promessa-quebrada`, que existe no flow #1 porque o teaser promete em cima de
 * estimativa, **não se aplica aqui**.
 *
 * ⚖️ `?cenario=ja-otimo` mostra o GUARDA-CORPO DE HONESTIDADE: quando o contador
 * atual já acertou o enquadramento, a tela diz isso e vende SERVIÇO, não economia
 * inventada. Vender economia pra quem não tem seria a promessa-quebrada do #2.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarDiagnosticoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jaOtimo = searchParams.get("cenario") === "ja-otimo";

  return (
    <MigrarDiagnosticoView
      jaOtimo={jaOtimo}
      onSeguir={() => router.push("/migrar/plano")}
      onVoltar={() => router.push("/migrar/cnpj")}
    />
  );
}
