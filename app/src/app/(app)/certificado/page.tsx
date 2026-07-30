"use client";

import { useRouter } from "next/navigation";
import { CertificadoView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P0 — CERTIFICADO DIGITAL (gate) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`CertificadoView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes o CTA não ia pra
 * lugar nenhum).
 *
 * Matriz: execucao/matriz-portal-interno.md → Módulo 0 (P0)
 *
 * ─── A REGRA QUE MANDA: O GATE DESTRAVA TUDO ────────────────────────────────
 * O 1º passo real do dia-2 NÃO é gerar a guia, é o CERTIFICADO: pré-requisito
 * pra emitir nota E pra acessar a Receita. Sem ele, a gente não faz NADA pela
 * pessoa. O portal abre AQUI.
 *
 * ⚠️ 29/07 — SWAP VALIDADO: este é o que vem depois do N22 (assinatura), não
 * o N24 ("empresa ativa"). Ver nota completa em `wizard-cauda.tsx`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function CertificadoPage() {
  const router = useRouter();

  // 🚧 Farol: só o estado "pendente" existe. "em-validação"/"emitido" viriam
  // do provider (certificadora parceira, 🟡 decisão em fila).
  return <CertificadoView onSeguir={() => router.push("/ativa")} />;
}
