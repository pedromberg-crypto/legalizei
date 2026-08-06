"use client";

import { useRouter } from "next/navigation";
import { MigrarDiagnosticoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 — DIAGNÓSTICO, SÓ MEI ("tem certificado?") · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarDiagnosticoView`).
 *
 * 🔴 04/08 (3ª rodada, decisão do Pedro) — o diagnóstico de Fator R pra ME
 * (número "real" dos 12 meses) foi CORTADO desta tela: a única API que roda
 * pré-pagamento é a cadastral, que não traz faturamento/folha. ME agora vai
 * do M1 (`/migrar/cnpj`) direto pro M3 (`/migrar/plano`), sem passar aqui.
 *
 * 🔴 05/08 (pedido do Pedro) — pergunta trocou de "tem contador?" pra "tem
 * certificado digital?". MEI não tem escrituração contábil obrigatória, então
 * não existe TTRT (transferência de responsabilidade técnica) a fazer em
 * nenhum dos dois casos — o que muda é só reaproveitar certificado existente
 * × emitir um novo. MEI não passa mais por `/migrar/transferencia` (M4b, TTRT)
 * de jeito nenhum (ver `wizard-migrar.tsx` pro racional completo). Resposta
 * vira `?certificado=sim|nao` na URL do M3.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarDiagnosticoPage() {
  const router = useRouter();

  return (
    <MigrarDiagnosticoView
      onSeguir={(temCertificado) =>
        router.push(`/migrar/plano?regime=mei&certificado=${temCertificado ? "sim" : "nao"}`)
      }
      onVoltar={() => router.push("/migrar/cnpj")}
    />
  );
}
