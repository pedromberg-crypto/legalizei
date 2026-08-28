"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CertificadoGateView } from "@/components/wizard-cauda";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CERTIFICADO DIGITAL — rota de produção. Agora atende os DOIS regimes.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 26/08 (reunião Rua Satélite 36, item 7) — posição no flow do **ME**:
 * entre `/painel` (depois que a DAE for paga) e `/assinatura`, porque a
 * procuração eletrônica que sai junto da assinatura exige o certificado já
 * validado.
 *
 * ─── 🆕 28/08 · O MEI TAMBÉM PASSA POR AQUI (decisão do Pedro) ─────────────
 * Posição diferente e motivo diferente:
 *
 * · **Posição:** depois da M-S (`/mei/proximos-passos`, quando o cliente já
 *   voltou com o CNPJ) e ANTES da A5 (home dia-1). Pedido literal do Pedro:
 *   "é um passo que tem que ser efetivado antes da pessoa cair pra dentro do
 *   app com as funcionalidades, da mesma forma do ME".
 *
 * · **Motivo:** no ME o certificado destrava a PROCURAÇÃO da assinatura. No
 *   MEI não existe assinatura nem procuração de abertura — a abertura dispensa
 *   certificado por completo (gov.br Prata/Ouro supre, ver
 *   `pesquisa/abertura-mei/abertura-mei-processo.md`). O que ele destrava é a
 *   OPERAÇÃO: puxar guia, mexer no FGTS Digital, agir por procuração sem pedir
 *   a senha do cliente a cada vez.
 *
 * · **Quem paga:** no ME vem incluso (contrapartida da fidelidade, ADR 04/08).
 *   No MEI **não vem** — o cliente providencia. Por isso a variante `mei` da
 *   view troca "por nossa conta" por "a gente te passa o valor".
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function CertificadoGatePage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  return (
    <CertificadoGateView
      mei={mei}
      onVoltar={() => router.push(mei ? "/mei/proximos-passos" : "/painel")}
      // No MEI a empresa JÁ existe quando chega aqui (o CNPJ saiu na hora, no
      // Portal), então o próximo passo é entrar no app — não assinar nada.
      onSeguir={() => router.push(mei ? "/home-dia1?regime=mei" : "/assinatura")}
    />
  );
}
