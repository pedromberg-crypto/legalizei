"use client";

import { useRouter } from "next/navigation";
import { AguardandoView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P2 — AGUARDANDO O BOLETO · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AguardandoView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes o CTA não ia pra
 * lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → T19 (dunning) · UX-45 · UX-38.
 * Persona-guarda: `knife` (paga por boleto e some por 3 dias).
 *
 * ─── ESTA TELA EXISTE PORQUE O BOLETO FICOU (decisão do Pedro) ────────────
 * `N9 --boleto--> P2 --> N10`. Cartão e Pix pulam direto pro N10 — só quem
 * escolhe boleto passa por aqui. ⚠️ 29/07: o `/pagamento` de produção não
 * respeitava essa aresta (ia sempre direto pro dossiê, até por boleto);
 * corrigido junto com esta extração.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AguardandoPage() {
  const router = useRouter();

  return <AguardandoView onSeguir={() => router.push("/dossie/socio")} />;
}
