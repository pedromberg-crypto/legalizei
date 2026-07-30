"use client";

import { AtivaView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N24 — EMPRESA ATIVA + DIA-2 · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AtivaView`) desde 29/07.
 * Esta page é o wrapper — última tela do flow de constituição; "Ir pro meu
 * painel" seguiria pro portal (dia-2), que existe como mockup separado
 * (`/mockup-home` etc.), não como continuação deste wizard.
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 23 (5.1)
 *
 * "Empresa ativa" é uma PONTE, não a linha de chegada — doutrina do `Destino`
 * em `lista-passos.tsx`. Por isso a celebração é curta e a tela já vira "e
 * agora, faça isto" (os 3 cards de primeiro passo).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AtivaPage() {
  return <AtivaView />;
}
