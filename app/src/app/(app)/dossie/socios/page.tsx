"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SociosView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";

/** 🆕 03/08 — só alcançável pelo caminho ME (MEI não pode ter sócio, pula
 *  esta tela; ver `/dossie/socio`, C1, onde bifurca). */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N12 — +SÓCIOS · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`SociosView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 8 (2.3) · mapa T8→N12
 * Motor: b2.coleta (sócios) · afeta natureza jurídica (N15)
 *
 * Regras da spec:
 *   · Limite MÁXIMO 2 sócios no total (decisão 15/07, era 3). Passou → barra.
 *   · O bloqueio é do PRODUTO, não da lei — dizer isso, não é um "não" seco.
 *   · UX-21: o "quantos sócios?" já foi na triagem do N4. Aqui o limite é só a
 *     trava de segurança, não a 1ª notícia ruim. ⚠️ 29/07: por isso mesmo ele
 *     deixou de ser `Aviso` de bloco e virou nota de rodapé do campo — todo
 *     mundo que lê já passou pela triagem, ou seja, está DENTRO do limite.
 *   · % de participação soma 100% (default divisão igual, editável).
 *
 * 🚧 Mock: o bloco de dados do 2º sócio reusa o esqueleto do N10 (dados do
 * sócio). Aqui só coleta o essencial pra provar o fluxo; o form repetível
 * completo é o mesmo componente do N10 quando for pra valer. O número de
 * sócios vem de `../mock` (fonte única do dossiê), pra bater com N13 e N15.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SociosPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  return <SociosView onSeguir={() => router.push(comRegime("/dossie/empresa", mei))} />;
}
