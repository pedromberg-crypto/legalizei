"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AssinaturaView } from "@/components/wizard-cauda";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N22 — ASSINATURA DOS SÓCIOS (GOV.BR + e-CAC, N23 dobrado) · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AssinaturaView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes nenhum CTA ia pra
 * lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 21 (convite/consenso) + 22
 * (assinatura GOV.BR). Motor: b7 (govbr-bronze).
 *
 * ⚠️ Sem estado real de consenso multi-sócio (mock pra farol) — ver nota na
 * View. Qualquer CTA habilitado avança.
 *
 * ⚠️ 29/07 — SWAP VALIDADO PELO PEDRO: depois da assinatura vem o **P0 — a
 * home de ativação de dia-1 (`/home-dia1`)**, não mais o N24 direto.
 *
 * Autocrítica registrada: a 1ª versão deste swap apontou pro `/certificado`
 * (um gate isolado que TAMBÉM existe e também é chamado de "P0" num doc mais
 * antigo — `matriz-portal-interno.md`). O Pedro corrigiu com o print da tela
 * real: é a home de ativação (trilha "1 de 3", certificado como item "agora"
 * dela, não gate à parte) que ele já tinha validado como o próximo passo. O
 * N24 (`/ativa`) continua existindo, só deixou de ser o passo seguinte a este.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AssinaturaPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  // 🆕 03/08 — regime PARA aqui de propósito: A5 (home dia-1) e o Portal são
  // iguais pros dois caminhos, escopo desta rodada não foi até lá.
  // 🆕 24/08 (reunião Leonan) — código GOV expirado/sem tentativas escala
  // pra atendimento humano em vez de travar sozinho.
  return (
    <AssinaturaView
      mei={mei}
      onSeguir={() => router.push("/home-dia1")}
      onEscalar={() => router.push("/veredito/nao-atende")}
    />
  );
}
