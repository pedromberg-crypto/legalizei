"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RevisarView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N19 — REVISAR O DOSSIÊ · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`RevisarView`) desde 29/07 —
 * fidelidade por construção, mesma regra do B3/B4. Esta page é o wrapper: lê
 * o `?cenario=` e liga a navegação (antes não ia pra lugar nenhum).
 *
 * Spec: execucao/spec-telas-b3-b4-aterrissagem.md → Tela 20 · vem depois do
 * N16, antes do N20 irreversível.
 *
 * ─── POR QUE ESTA TELA EXISTE ───────────────────────────────────────────────
 * O N20 é IRREVERSÍVEL. Ninguém deve cruzar essa porta sem ver, num lugar só,
 * tudo que a gente vai registrar na Junta com o nome dele. É LEITURA, não
 * formulário: cada bloco tem um "ajustar" (mock) que voltaria pro passo de
 * origem sem re-andar o flow inteiro.
 *
 * ⚠️ 29/07 — a identidade (nome, CNAE, secundárias) passou a vir de
 * `dossie/mock.ts`: o mock antigo local tinha um CNAE com um dígito diferente
 * do travado no Encaixe e secundárias que o N14 nunca ofereceu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RevisarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaPaga = searchParams.get("cenario") === "empresa-paga";

  return (
    <RevisarView empresaPaga={empresaPaga} onSeguir={() => router.push("/termo")} />
  );
}
