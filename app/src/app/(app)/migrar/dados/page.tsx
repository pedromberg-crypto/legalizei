"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarDadosBaseView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E4.2b — DADOS QUE O CARTÃO CNPJ NÃO TRAZ · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarDadosBaseView`).
 *
 * 🆕 24/08 (reunião Leonan 19/08) — a reunião foi explícita sobre a ORDEM:
 * isso acontece DEPOIS do pagamento e do M3c (contador atual), não antes.
 * Leonan: "[o cartão CNPJ] fica até disponível, mas fica lá dentro do e-CAC,
 * mas aí eu preciso do GOV." Pedro: "durante essa migração, eu preciso que,
 * além dos dados que consegui puxar via API do cartão CNPJ, ele preencha
 * TODOS os dados base de uma constituição." Por isso shell APP (mesmo grupo
 * de `/migrar/contador`, `/dossie/*`), não WIZARD — é pós-pagamento.
 *
 * Sem `onVoltar`: mesmo padrão do M3c/M5 — não existe "voltar" depois que o
 * pagamento já caiu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarDadosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <MigrarDadosBaseView
      onSeguir={() => router.push(qs ? `/migrar/socios?${qs}` : "/migrar/socios")}
    />
  );
}
