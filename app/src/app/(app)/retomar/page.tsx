"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RetomarView } from "@/components/wizard-cauda";
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
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RetomarPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

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
