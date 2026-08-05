"use client";

import { useRouter } from "next/navigation";
import { MigrarDiagnosticoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 — DIAGNÓSTICO, SÓ MEI ("tem contador?") · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarDiagnosticoView`).
 *
 * 🔴 04/08 (3ª rodada, decisão do Pedro) — o diagnóstico de Fator R pra ME
 * (número "real" dos 12 meses) foi CORTADO desta tela: a única API que roda
 * pré-pagamento é a cadastral, que não traz faturamento/folha. ME agora vai
 * do M1 (`/migrar/cnpj`) direto pro M3 (`/migrar/plano`), sem passar aqui.
 *
 * O que sobra é só o subfluxo MEI: MEI não tem Fator R (paga DAS-MEI fixo) e
 * não é obrigado a ter contador (DASN-SIMEI autodeclaratório) — a pergunta
 * "você tem contador hoje?" decide se o M4 (auditoria+transferência) roda ou
 * se pula direto pro M5. Resposta vira `?contador=sim|nao` na URL do M3.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarDiagnosticoPage() {
  const router = useRouter();

  return (
    <MigrarDiagnosticoView
      onSeguir={(temContador) =>
        router.push(`/migrar/plano?regime=mei&contador=${temContador ? "sim" : "nao"}`)
      }
      onVoltar={() => router.push("/migrar/cnpj")}
    />
  );
}
