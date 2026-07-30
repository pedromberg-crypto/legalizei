"use client";

import { useRouter } from "next/navigation";
import { CnaeSecundariosView } from "@/components/wizard-dossie";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N14 — CNAE SECUNDÁRIOS · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`CnaeSecundariosView`)
 * desde 29/07. Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 10 (2.5) · mapa T10→N14
 * Motor: b2.coleta (cnae secundários)
 *
 * ─── REGRA ESTRUTURAL (decisão do Pedro, 2026-07-21) ─────────────────────
 * SÓ sugere secundárias **similares** e de **MESMO IMPOSTO** que a principal:
 * mesmo Anexo do Simples + mesma dependência de Fator R. Assim, incluir uma
 * secundária NUNCA muda o que o cliente paga.
 *
 * Isto REVERTE a regra antiga ("secundário que quebra o recorte entra com
 * aviso"). O que muda o regime **não aparece aqui — nem com aviso.** Dois
 * motivos:
 *   1. Quem revende produto é COMÉRCIO, e comércio é barrado lá no N4 (🔴
 *      comercial Mauro). Sugerir um CNAE de comércio numa tela do fluxo
 *      só-serviço contradiz o próprio escopo do produto.
 *   2. Oferecer uma opção que silenciosamente troca o Anexo/Fator R é o
 *      oposto da feature-âncora (que existe pra BAIXAR imposto, não subir).
 *
 * ─── DE ONDE SAEM AS SUGESTÕES ───────────────────────────────────────────
 * No app real: dataset de CNAE filtrado por `anexo == principal.anexo` E
 * `fator_r == principal.fator_r` (contabilizei-cnae-completo.json + ratificação
 * Larissa). Aqui o mock usa exatamente as **vizinhas já vetadas como
 * `mesmo-imposto` no N4** (gate `vizinhas`), pra não inventar equivalência
 * fiscal: 6202 / 6203 / 6204 / 7410. Publicidade (7311) e hospedagem (6311)
 * ficaram DE FORA de propósito — plausíveis, mas não vetadas como mesmo-anexo.
 *
 * 🚧 IA dublada: a lista e o "comum como secundário" são mock. A regra do
 * filtro (mesmo-imposto) é que é definitiva. O CNAE principal vem de
 * `../mock` (fonte única do dossiê).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function CnaeSecundariosPage() {
  const router = useRouter();

  return <CnaeSecundariosView onSeguir={() => router.push("/dossie/natureza")} />;
}
