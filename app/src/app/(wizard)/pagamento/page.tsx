"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PagamentoView, type Metodo } from "@/components/wizard-dinheiro";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N9 — PAGAMENTO · rota de produção · 💰 A FRONTEIRA
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dinheiro.tsx` (`PagamentoView`) desde
 * 29/07. Esta page é o wrapper: estado do formulário + navegação.
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 19 · blocos-fluxo-abertura §B3
 *
 * A última tela do wizard. **A casa (shell do app) nasce depois daqui** — a
 * reordenação de 16/07 dissolveu o velho debate "T18 × T19: onde nasce a
 * casa?". Wizard = N1–N9, fullscreen e sem nav. Portal = N10 em diante.
 *
 * ─── 1. O CPF FAZ DOIS TRABALHOS (decisão travada nº 5) ───────────────────
 * O gateway exige CPF de qualquer jeito. Então: **mesmo campo, dois usos** —
 * cobrança E elegibilidade. Situação irregular na Receita → **não cobra**,
 * roteia. Resolve "não vender pra quem não pode abrir" sem gastar uma tela.
 * ⚠️ **A copy tem que dizer a diferença.** "CPF suspenso" não é "cartão
 * recusado": trocar de cartão não resolve CPF suspenso, e deixar tentar de novo
 * é crueldade com o tempo da pessoa. A persona `cpf-irregular` (Sandra: dígito
 * válido, situação suspensa) é o guarda-corpo — **ela não é cobrada**.
 *
 * ─── 2. BOLETO FICA, MAS FORA DO HAPPY PATH (decisão do Pedro) ────────────
 * Cortar boleto simplificaria e mataria a pausa P2, mas perde cliente:
 *   > boleto gerado aqui → **entra no app assim mesmo** → faz o dossiê inteiro
 *   > (N10–N18) enquanto espera → **N19 e N20 travam** até compensar.
 * A casa existe, o dossiê não sai sem pagamento, e o dunning (UX-45) puxa de
 * volta com o gancho da economia, não com lembrete seco.
 *
 * ─── 3. "ACELERE SEU PROCESSO" NO CARTÃO ──────────────────────────────────
 * O cartão não é empurrado por ser melhor pra nós: é empurrado porque destrava
 * a abertura na hora. A vantagem declarada é do cliente, e é verdadeira.
 *
 * Gateway = **Asaas** (D2, travado 14/07). Webhook idempotente: nunca cobra
 * nem abre duas vezes.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PagamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaPaga = searchParams.get("cenario") === "empresa-paga";
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");

  return (
    <PagamentoView
      cpf={cpf}
      setCpf={setCpf}
      metodo={metodo}
      setMetodo={setMetodo}
      empresaPaga={empresaPaga}
      onPagar={() => router.push("/dossie/socio")}
    />
  );
}
