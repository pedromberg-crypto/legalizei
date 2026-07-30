"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MigrarContratoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3b — ACEITE DO CONTRATO · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarContratoView`).
 * Motor: `flow-migrar.js` → m3.aceite.
 *
 * 🔴 A LINHA QUE SUSTENTA A DECISÃO DE 30/07 ("cobra antes do TTRT"):
 * *"Se a transferência não for concluída por algum motivo fora do seu controle,
 * você recebe tudo de volta."*
 *
 * Não é copy de marketing — é a contrapartida obrigatória de cobrar por algo
 * cujo destravamento depende do contador ANTIGO, um terceiro com interesse
 * contrário. Sem essa promessa explícita, a decisão de cobrar antes seria
 * cobrar por um resultado que a gente não controla, sem dar saída ao cliente.
 * Se essa linha sair, a decisão inteira precisa ser reaberta.
 *
 * 🟡 Redação jurídica final é do Mauro/Larissa (mesma fila do contrato do N8).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarContratoPage() {
  const router = useRouter();
  const [aceito, setAceito] = useState(false);

  return (
    <MigrarContratoView
      aceito={aceito}
      setAceito={setAceito}
      onSeguir={() => router.push("/pagamento?fluxo=migrar")}
      onVoltar={() => router.push("/migrar/plano")}
    />
  );
}
