"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PagamentoMeiView,
  PAGAMENTO_MEI_VAZIO,
  type MetodoMei,
  type DadosPagamentoMei,
} from "@/components/mei/pagamento";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M14.P — PAGAR O CERTIFICADO · o SEGUNDO pagamento do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro): *"a parte do segundo pagamento muda apenas o que
 * seria pago, em ME a taxa da junta e em MEI o certificado digital"*.
 *
 * Não é tela nova: é o MESMO `PagamentoMeiView` da M6 no modo `certificado`,
 * exatamente como o ME reusa o `PagamentoView` no modo `guia` pra cobrar a
 * DAE. Muda o valor, a copy e o que se aceita; método, dados de cobrança e
 * idempotência são idênticos de propósito.
 *
 * Os splashes também são os mesmos 3 do 1º pagamento, com `?next` diferente —
 * é o que o ME faz entre E9.S/E9.SB e A3.PS/A3.PSB.
 *
 * 🔒 O voltar leva pra M14 (a decisão), não pra M13: quem está aqui já
 * escolheu resolver agora, e o passo atrás é a escolha, não o passo anterior
 * da espinha. Por isso esta rota fica FORA da `ESPINHA_MEI`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function PagarCertificadoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const metodoDaRota = searchParams.get("metodo");
  const [metodo, setMetodo] = useState<MetodoMei | null>(
    metodoDaRota === "boleto" || metodoDaRota === "pix" || metodoDaRota === "cartao"
      ? metodoDaRota
      : null,
  );
  const [dados, setDados] = useState<DadosPagamentoMei>(PAGAMENTO_MEI_VAZIO);
  const [aceito, setAceito] = useState(false);
  const [contratoAberto, setContratoAberto] = useState(false);

  const retry = searchParams.get("retry") === "1";
  const simularRecusa = searchParams.get("simular") === "recusa";

  /** Onde a pessoa cai depois: sempre o status, no estado que o método define. */
  function destino() {
    if (simularRecusa) {
      return `/mei/splash-recusado?next=${encodeURIComponent(
        "/mei/certificado/pagar?retry=1",
      )}`;
    }
    if (metodo === "boleto") {
      const pendente = "/mei/status?fase=certificado&certificado=boleto";
      return `/mei/splash-boleto?next=${encodeURIComponent(pendente)}`;
    }
    const pago = "/mei/status?fase=certificado&certificado=pronto";
    return `/mei/splash-pagamento?next=${encodeURIComponent(pago)}`;
  }

  return (
    <PagamentoMeiView
      modo="certificado"
      meta="Certificado digital"
      metodo={metodo}
      setMetodo={setMetodo}
      dados={dados}
      setDados={setDados}
      aceito={aceito}
      setAceito={setAceito}
      contratoAberto={contratoAberto}
      setContratoAberto={setContratoAberto}
      recusado={retry}
      onVoltar={() => router.push("/mei/certificado")}
      onPagar={() => router.push(destino())}
    />
  );
}

export default function PagarCertificadoMeiPage() {
  return (
    <Suspense>
      <PagarCertificadoConteudo />
    </Suspense>
  );
}
