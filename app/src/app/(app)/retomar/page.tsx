"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RetomarCpfView } from "@/components/wizard-cauda";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P1 — RETOMAR DE ONDE PAROU · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`RetomarCpfView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação.
 *
 * Spec: UX-46 (reorientação ao reabrir) · UX-23 · UX-38. Persona-guarda: `cida`.
 *
 * 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — "teremos uma tela
 * única de retorno, que é a E9": depois de confirmar o CPF, SEMPRE manda pra
 * `/aguardando` — não existe mais um "status de retomada" separado
 * (`RetomarView` foi retirada, ver `wizard-cauda.tsx`). A própria
 * `/aguardando` decide o que mostrar (dossiê pendente, boleto, ou já na fase
 * Junta) a partir do progresso salvo. 🔴 MOCK, RF-01 — sem backend real ainda,
 * então essa página só faz a CPF-gate; a ramificação de fase é da tela seguinte.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RetomarPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());
  const [cpf, setCpf] = useState("");

  return (
    <RetomarCpfView
      cpf={cpf}
      setCpf={setCpf}
      onContinuar={() => router.push(mei ? "/aguardando?regime=mei&pago=1" : "/aguardando?pago=1")}
      onVoltar={() => router.push("/entrada")}
    />
  );
}
