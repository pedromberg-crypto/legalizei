"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PlanoView } from "@/components/wizard-dinheiro";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N7 — A CONTA DA ABERTURA + PLANO · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dinheiro.tsx` (`PlanoView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Telas 16+17, FUNDIDAS (UX-33)
 *
 * Antes de pedir dinheiro, **fechar a conta na cara do cliente**. Os custos
 * vivem espalhados (taxa de governo no B4, certificado no fim, mensalidade no
 * plano) e o cliente monta a soma na cabeça, errado, com medo.
 *
 * ─── OS 3 BALDES, E POR QUE NÃO PODEM SE MISTURAR ─────────────────────────
 *   1. **O que é grátis** — honorário de abertura = R$0.
 *   2. **Taxas de governo** — passam direto, NÃO são nossa margem.
 *   3. **O que é recorrente** — a mensalidade.
 * ⚠️ **Nunca esconder o repasse de governo dentro do preço.** "Abertura
 * grátis" sem essa distinção vira pegadinha lá no N20. Grátis = **honorário
 * zero, não governo zero**.
 *
 * ─── 🏆 HIERARQUIA (2ª rodada, 19/07) — QUEM MERECE SER GRANDE ────────────
 * Achado do Pedro: **o maior número da tela era o que mais assusta.** O
 * R$463,51 estava em `text-display` enquanto "Grátis" e a mensalidade
 * empatavam numa linha de lista. Pior: R$463,51 é **soma artificial** (junta
 * repasse de terceiro com mensalidade recorrente só porque saem no mesmo dia).
 * A tela responde "quanto custa?" com DUAS respostas: **Abrir = Grátis**
 * (herói, verde) e **Manter = mensalidade** (segundo). Taxa = peso de LINHA.
 * Total de hoje = **rodapé, colado no CTA**: conferível no instante da decisão,
 * sem ser o maior.
 *
 * ─── ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2) ─────────────────
 * Era: "o add-on de endereço fiscal não aparece aqui (o N13 vem depois do
 * pagamento)... a 'conta total' desta tela não é total." Agora não é mais —
 * a pergunta "endereço próprio × fiscal Legalizai" saiu do C4 e subiu pro
 * `/gate` (`FaixaView`, antes do cadastro), e o valor já soma aqui na
 * mensalidade, com explicação sucinta (`?endereco=fiscal`, `lib/endereco.ts`).
 *
 * 💸 Preço é PLACEHOLDER declarado (ver `CUSTOS.MENSALIDADE`).
 *
 * 🔴 03/08 (Pedro): DESCARTADO o cenário `?cenario=empresa-paga` — decisão
 * definitiva e única é o cliente pagar a taxa da Junta (padrão acima).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PlanoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  // 🆕 03/08 — UX-74 mesclado (versão "oferta": card escuro, âncora de
  // honorário). Fonte: /apresentacao. `semTaxaJunta` = MEI, ver /gate.
  return (
    <PlanoView
      onSeguir={() => router.push(comEndereco(comRegime("/contrato", mei), enderecoFiscal))}
      layout="oferta"
      semTaxaJunta={mei}
      enderecoFiscal={enderecoFiscal}
    />
  );
}
