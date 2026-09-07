"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusMeiView } from "@/components/mei/status";
import { proxima } from "@/lib/mei-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M12 — ACOMPANHAMENTO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/status.tsx`.
 *
 * `?etapa=` move a timeline pra review (0..3). Sem ele, começa na conferência
 * (índice 1), que é o estado real logo depois de autorizar.
 *
 * 🔄 07/09 — substitui `/painel?regime=mei`. Aquela rota tinha o pipeline
 * certo mas ficou inalcançável em 31/08, quando o status do ME migrou pro
 * `/aguardando?fase=junta` e levou a navegação do MEI junto. A rota antiga
 * segue viva pro Migrar, que a usa por outro caminho e não muda.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/status";

function StatusConteudo() {
  const router = useRouter();
  const param = useSearchParams().get("etapa");
  const emAndamento = param !== null ? Math.min(Math.max(Number(param), 0), 3) : 1;

  return (
    <StatusMeiView
      emAndamento={emAndamento}
      onVerProximosPassos={() => router.push(proxima(ROTA))}
    />
  );
}

export default function StatusMeiPage() {
  return (
    <Suspense>
      <StatusConteudo />
    </Suspense>
  );
}
