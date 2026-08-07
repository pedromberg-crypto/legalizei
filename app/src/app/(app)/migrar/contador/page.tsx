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
 * Fica entre o pagamento e a transferência (M4b): só chega aqui quem já pagou
 * e é ME (MEI vai de `/pagamento` direto pra `/migrar/ativa`, nunca passa por
 * aqui). Sem `onVoltar`: mesmo padrão do M5 — não existe "voltar" depois que o
 * pagamento já caiu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarContadorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <MigrarContadorAntigoView
      empresa={EMPRESA_MIGRAR}
      onSeguir={() =>
        router.push(qs ? `/migrar/transferencia?${qs}` : "/migrar/transferencia")
      }
    />
  );
}
