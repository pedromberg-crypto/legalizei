"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarGovView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E9.2b — ACESSO AO GOV.BR + PROCURAÇÃO (M3d) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarGovView`).
 *
 * 🆕 24/08 (reunião Leonan 19/08) — a migração passa pelo MESMO acesso ao
 * GOV.BR + procuração que a constituição: "Mesma coisa, procuração, GOV,
 * acesso ao GOV, mesma coisa do outro." Diferença: não existe protocolo de
 * registro pra assinar (a empresa já existe), só a procuração — daí
 * `soProcuracao` no `CodigoGovView` reusado.
 *
 * Entra DEPOIS de `/migrar/socios` (dados base completos) e ANTES de
 * `/migrar/transferencia` — é a procuração que destrava a gente agir em nome
 * do cliente pra tocar a transferência. Shell APP, pós-pagamento.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarGovPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <MigrarGovView
      onSeguir={() => router.push(qs ? `/migrar/transferencia?${qs}` : "/migrar/transferencia")}
      onEscalar={() => router.push("/veredito/nao-atende")}
    />
  );
}
