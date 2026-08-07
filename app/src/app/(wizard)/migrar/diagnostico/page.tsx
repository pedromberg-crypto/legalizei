"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarDiagnosticoView } from "@/components/wizard-migrar";
import { ehMei, comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 — DIAGNÓSTICO ("tem certificado?") · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarDiagnosticoView`).
 *
 * 🔴 04/08 (3ª rodada, decisão do Pedro) — o diagnóstico de Fator R pra ME
 * (número "real" dos 12 meses) foi CORTADO desta tela: a única API que roda
 * pré-pagamento é a cadastral, que não traz faturamento/folha.
 *
 * 🔴 05/08 (pedido do Pedro) — pergunta trocou de "tem contador?" pra "tem
 * certificado digital?". MEI não tem escrituração contábil obrigatória, então
 * não existe TTRT (transferência de responsabilidade técnica) a fazer em
 * nenhum dos dois casos — o que muda é só reaproveitar certificado existente
 * × emitir um novo. MEI não passa mais por `/migrar/transferencia` (M4b, TTRT)
 * de jeito nenhum (ver `wizard-migrar.tsx` pro racional completo).
 *
 * 🔴 06/08 (achado do Pedro) — ME TAMBÉM passa por aqui agora (antes ia do M1
 * direto pro M3): certificado é independente da TTRT, e não tinha pergunta
 * nenhuma no caminho ME. Resposta vira `?certificado=sim|nao`, propagado via
 * querystring até o M4b (decide se o pipeline ganha o passo "emitindo
 * certificado").
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarDiagnosticoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  function destino(temCertificado?: boolean) {
    const base = comRegime("/migrar/plano", mei);
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}certificado=${temCertificado ? "sim" : "nao"}`;
  }

  return (
    <MigrarDiagnosticoView
      mei={mei}
      onSeguir={(temCertificado) => router.push(destino(temCertificado))}
      onVoltar={() => router.push(comRegime("/migrar/cnpj", mei))}
    />
  );
}
