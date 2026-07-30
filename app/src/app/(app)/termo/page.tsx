"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TermoView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N20 — TERMO DE INÍCIO (IRREVERSÍVEL) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`TermoView`) desde 29/07.
 * Esta page é o wrapper: guarda o aceite, lê `?cenario=` e liga a navegação
 * (antes o botão não ia pra lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 18 (3.3)
 *
 * ─── A RACHADURA DO T18 ────────────────────────────────────────────────────
 *   · N8 (contrato de serviço) — REVERSÍVEL, CDC art.49, 7 dias.
 *   · N20 (este) — IRREVERSÍVEL. Ao autorizar, protocola na Junta e a taxa já
 *     paga é gasta.
 *
 * Daqui em diante o pipeline assíncrono (N21, o painel) assume — não há mais
 * "continuar" clicável no sentido do wizard, é espera de órgão.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function TermoPage() {
  const router = useRouter();
  const [aceito, setAceito] = useState(false);
  const searchParams = useSearchParams();
  const empresaPaga = searchParams.get("cenario") === "empresa-paga";

  return (
    <TermoView
      aceito={aceito}
      setAceito={setAceito}
      empresaPaga={empresaPaga}
      onSeguir={() => router.push("/painel")}
    />
  );
}
