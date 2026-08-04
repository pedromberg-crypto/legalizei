"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
 *
 * 🆕 04/08 — MEI sem contador hoje (`?regime=mei&contador=nao`) não tem TTRT
 * pra falhar, então a cláusula de devolução vira promessa de início imediato
 * (`semTransferencia`). Params seguem pro pagamento e pro M4/M5.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarContratoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [aceito, setAceito] = useState(false);

  const mei = searchParams.get("regime") === "mei";
  const semContador = searchParams.get("contador") === "nao";
  const qs = searchParams.toString();

  return (
    <MigrarContratoView
      aceito={aceito}
      setAceito={setAceito}
      semTransferencia={mei && semContador}
      onSeguir={() =>
        router.push(qs ? `/pagamento?fluxo=migrar&${qs}` : "/pagamento?fluxo=migrar")
      }
      onVoltar={() => router.push("/migrar/plano")}
    />
  );
}
