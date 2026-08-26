"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarContadorAntigoView, EMPRESA_MIGRAR } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3c — SEU CONTADOR ATUAL · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarContadorAntigoView`).
 * Nova em 06/08 (reunião Rua Satélite 19, Léo) — ver comentário no componente.
 *
 * Fica entre o pagamento e o resto do pós-pagamento: só chega aqui quem já
 * pagou e é ME (MEI vai de `/pagamento` direto pra `/migrar/ativa`, nunca
 * passa por aqui). Sem `onVoltar`: mesmo padrão do M5 — não existe "voltar"
 * depois que o pagamento já caiu.
 *
 * 🆕 24/08 (reunião Leonan 19/08) — deixa de ir direto pra
 * `/migrar/transferencia`. A reunião travou a ordem: contador atual → dados
 * base + sociedade (E4.2b/c) → GOV.BR + procuração (M3d) → SÓ ENTÃO a
 * transferência. "Durante essa migração, eu preciso que [...] ele preencha
 * todos os dados base de uma constituição [...] a gente vem para a parte de
 * estamos encerrando lá, transferindo a responsabilidade" — dados base
 * primeiro, pipeline de transferência depois.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarContadorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <MigrarContadorAntigoView
      empresa={EMPRESA_MIGRAR}
      onSeguir={() => router.push(qs ? `/migrar/dados?${qs}` : "/migrar/dados")}
    />
  );
}
