"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RetomarCpfView, RetomarView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { TEM_SOCIO } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P1 — RETOMAR DE ONDE PAROU · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`RetomarView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação (antes o CTA não ia pra lugar
 * nenhum).
 *
 * Spec: UX-46 (reorientação ao reabrir) · UX-23 · UX-38. Persona-guarda: `cida`.
 *
 * ⚠️ NÃO é passo sequencial do flow — é REENTRADA. No mapa (`flow-data.mjs`)
 * a aresta é `P1 --volta ao passo pausado--> C0`, tracejada: quem fechou o
 * app e voltou aterrissa de novo no início do dossiê, não continua de um
 * ponto arbitrário salvo (não existe RF-01 ainda pra isso).
 *
 * 🐛 28/08 — o destino estava `/dossie/socio` (C1), que era o 1º passo do
 * dossiê ANTES de 27/08. Desde a reordenação, o 1º passo é a C0
 * (`/dossie/atividade`) pro ME ou a M-O (`/dossie/ocupacao`) pro MEI —
 * ninguém tinha atualizado esta rota. Corrigido junto da reordenação de
 * 28/08 (CNAE secundário movido pra logo após a principal).
 *
 * 🆕 30/08 (pedido do Pedro) — ganhou uma PORTA antes do status: o E3 (fork,
 * "Voltar de onde parei") manda pra cá agora, mas ninguém sabe QUEM é a
 * pessoa até ela digitar o CPF (`RetomarCpfView`). 🔴 MOCK, RF-01 — sem
 * backend real de status de pagamento, o dígito final do CPF decide: ÍMPAR
 * = boleto ainda não compensou (manda pro E9.1, `/aguardando`) · PAR = já
 * pago (mostra o `RetomarView` de sempre).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RetomarPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());
  const [cpf, setCpf] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  if (!confirmado) {
    return (
      <RetomarCpfView
        cpf={cpf}
        setCpf={setCpf}
        onContinuar={() => {
          const digitos = cpf.replace(/\D/g, "");
          const ultimo = Number(digitos[digitos.length - 1] ?? "0");
          if (ultimo % 2 !== 0) {
            router.push("/aguardando");
            return;
          }
          setConfirmado(true);
        }}
        onVoltar={() => router.push("/entrada")}
      />
    );
  }

  return (
    <RetomarView
      mei={mei}
      temSocios={TEM_SOCIO}
      onSeguir={() =>
        router.push(comRegime(mei ? "/dossie/ocupacao" : "/dossie/atividade", mei))
      }
    />
  );
}
