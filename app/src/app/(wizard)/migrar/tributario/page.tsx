"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MigrarRegimeTributarioView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1b — SIMPLES × LUCRO PRESUMIDO (só ME) · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarRegimeTributarioView`).
 *
 * 🆕 04/08 — nasce do debate de custo com o Pedro: rodar a API paga
 * `receita-federal/simples` (R$0,24) pra confirmar Simples×Presumido ANTES
 * do pagamento não compensa pra um lead que ainda não converteu. Autodeclarado
 * aqui, confirmado de verdade depois (M4a/ativação fiscal), mesma doutrina da
 * E3.2 (MEI×ME). Só existe no caminho ME — MEI pula direto pro M2.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarTributarioPage() {
  const router = useRouter();
  const [regime, setRegime] = useState<"simples" | "presumido" | null>(null);

  return (
    <MigrarRegimeTributarioView
      regime={regime}
      setRegime={setRegime}
      onSeguir={() => {
        if (regime === "presumido") {
          router.push("/saida/regime-nao-suportado");
        } else {
          router.push("/migrar/diagnostico");
        }
      }}
      onVoltar={() => router.push("/migrar/cnpj")}
    />
  );
}
