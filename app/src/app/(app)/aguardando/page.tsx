"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AguardandoView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";

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
 *
 * 🆕 04/08 — `?regime=mei` corrige o valor do boleto (sem DAE, mensalidade
 * própria) e repassa o regime adiante pro dossiê.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AguardandoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const categoria = categoriaDe(searchParams);

  return (
    <AguardandoView
      mei={mei}
      // 🔄 27/08 — a 1ª tela do dossiê virou a C0 (`/dossie/atividade`), não
      // mais o C1. Mesma mudança do `/pagamento` (racional lá).
      onSeguir={() =>
        router.push(
          comCategoria(
            comEndereco(comRegime("/dossie/atividade", mei), enderecoFiscal),
            categoria,
          ),
        )
      }
    />
  );
}
