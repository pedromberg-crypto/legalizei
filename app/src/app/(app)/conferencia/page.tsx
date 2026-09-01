"use client";

import { useRouter } from "next/navigation";
import { ConferenciaView } from "@/components/conferencia";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /conferencia — rota de REFERÊNCIA DO DEV (não é tela de cliente)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro). Roda dentro do shell APP porque tem que ter o
 * MESMO enquadramento das telas reais: o dev abre lado a lado com a tela e
 * compara campo a campo. Fica fora do caminho do cliente (nenhum CTA leva
 * aqui), e a tela avisa na 1ª linha o que ela é.
 *
 * Conteúdo: `components/conferencia.tsx`, alimentado por `lib/conferencia-dados.ts`
 * (GERADO de `flow-data.mjs`). Ver o cabeçalho do componente pro porquê das
 * 3 etiquetas de origem.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ConferenciaPage() {
  const router = useRouter();
  return <ConferenciaView onVoltar={() => router.back()} />;
}
