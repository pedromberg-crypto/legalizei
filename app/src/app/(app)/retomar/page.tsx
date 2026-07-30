"use client";

import { useRouter } from "next/navigation";
import { RetomarView } from "@/components/wizard-cauda";

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
 * a aresta é `P1 --volta ao passo pausado--> N10`, tracejada: quem fechou o
 * app e voltou aterrissa de novo no início do dossiê, não continua de um
 * ponto arbitrário salvo (não existe RF-01 ainda pra isso).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RetomarPage() {
  const router = useRouter();

  return <RetomarView onSeguir={() => router.push("/dossie/socio")} />;
}
