"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";
import { ehMei, comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A3.0 — PONTO SEM VOLTA (aviso antes da viabilidade)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — a única tela do flow cujo trabalho é FAZER A
 * PESSOA PARAR.
 *
 * ─── POR QUE ELA EXISTE ────────────────────────────────────────────────────
 * Até o A1, corrigir qualquer dado é de graça: a tela de status deixa voltar
 * a qualquer bloco. Depois que a viabilidade entra na JUCEMG, acabou — mudar
 * nome ou endereço protocolado significa CANCELAR a viabilidade e refazer o
 * pedido. Isso não é teoria: foi o que aconteceu ao vivo na gravação de
 * 31/08, quando o endereço em apartamento indeferiu e o processo teve que ser
 * cancelado e recomeçado do zero.
 *
 * O aceite já está no contrato, mas contrato ninguém lê. Uma tela inteira,
 * coral cheio, com um CTA que a pessoa precisa tocar, é o que transforma uma
 * cláusula num momento — e é justamente o que a gente quer que ela lembre se
 * um dia pedir pra mudar algo.
 *
 * ─── POR QUE NÃO É SPLASH ──────────────────────────────────────────────────
 * Usa a pele de splash (é ela que dá o peso), mas NÃO auto-avança: passar
 * daqui tem que ser um ato, não um relógio. Por isso o `cta` — a única
 * variante do `SplashMensagemView` que espera o dedo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function IniciarViabilidadePage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  return (
    <SplashMensagemView
      titulo="Daqui não dá pra voltar."
      sub="Ao iniciar a viabilidade, seus dados vão pra Junta Comercial. A partir daí, mudar nome ou endereço da empresa exige cancelar e refazer o pedido."
      cta={{
        label: "Iniciar viabilidade",
        onClick: () => router.push(comRegime("/aguardando?fase=junta", mei)),
      }}
    />
  );
}
