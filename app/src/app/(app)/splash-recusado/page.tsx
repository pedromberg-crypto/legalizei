"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPLASH · PAGAMENTO RECUSADO — variante escura do E9.S/E9.SB
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — o par que faltava: a família de splashes só
 * sabia dizer que deu certo. Mesmo layout dos outros (logo, ícone grande,
 * título, sub, auto-avanço), com a pele escura + gradiente coral do hero do
 * status — deliberadamente DIFERENTE do coral cheio da confirmação, porque
 * tela de recusa com a mesma cara da de sucesso faz a pessoa ler o layout
 * antes da palavra e comemorar errado.
 *
 * Serve às DUAS cobranças do flow, e por isso o destino vem por `?next`:
 * · plano/mensalidade (E9)  → volta pro `/pagamento`
 * · guia da Junta (A3.P)    → volta pro `/guia`
 * Nos dois casos com `?retry=1`, que é o que faz a tela de pagamento abrir
 * explicando o que aconteceu e pedindo outra forma de pagar.
 *
 * ⚠️ Transitório e sem CTA, igual aos irmãos: a decisão (tentar outro cartão,
 * trocar pra Pix) é da tela seguinte, não daqui — splash que pede escolha
 * deixa de ser splash.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashRecusadoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/pagamento?retry=1";

  return (
    <SplashMensagemView
      variante="recusado"
      titulo="Pagamento não aprovado."
      sub="Vamos tentar de outro jeito."
      onAutoAvancar={() => router.replace(next)}
    />
  );
}
