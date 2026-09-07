"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PagamentoMeiView,
  PAGAMENTO_MEI_VAZIO,
  type MetodoMei,
  type DadosPagamentoMei,
} from "@/components/mei/pagamento";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M6 — PAGAMENTO + CONTRATO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/pagamento.tsx`.
 *
 * 🔄 07/09 — O MEI VOLTA A TER TELA DE STATUS DEPOIS DE PAGAR. Em 30/08 o
 * caminho ME ganhou os splashes de pagamento (revogando o "cartão/Pix pulam
 * direto pro dossiê"), e o próprio `flow-data` registrava que o MEI ficava de
 * fora: *"MEI segue com o comportamento antigo (fora do escopo desta
 * rodada)"*. Ele pulava do pagamento direto pra ocupação, sem nenhuma
 * confirmação no meio.
 *
 * O motivo da mudança vale igual pros dois regimes — reforçar "dá pra sair e
 * voltar, está tudo certo" —, mas a COPY não podia ser a mesma: a do ME diz
 * "com a guia paga, a Junta pode registrar sua empresa", e no MEI não existe
 * guia nem Junta. Por isso o splash é do ramo, com texto próprio.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/pagamento";

function PagamentoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [metodo, setMetodo] = useState<MetodoMei | null>(null);
  const [dados, setDados] = useState<DadosPagamentoMei>(PAGAMENTO_MEI_VAZIO);
  const [aceito, setAceito] = useState(false);
  const [contratoAberto, setContratoAberto] = useState(false);

  function pagar() {
    const destino = comCategoria(proxima(ROTA), categoria);
    /* 🔴 Só cartão e Pix aparecem na escolha (mesma decisão de 01/09 do ME: no
       Asaas o boleto já vem com QR de Pix embutido). O splash do boleto segue
       existindo e alcançável por rota — a M6.SB está no mapa e é revisável —,
       mas ninguém cai nela pela escolha, porque não há card de boleto. */
    router.push(
      `/mei/splash-pagamento?next=${encodeURIComponent(destino)}`,
    );
  }

  return (
    <PagamentoMeiView
      meta={metaDoVoltar(ROTA)}
      metodo={metodo}
      setMetodo={setMetodo}
      dados={dados}
      setDados={setDados}
      aceito={aceito}
      setAceito={setAceito}
      contratoAberto={contratoAberto}
      setContratoAberto={setContratoAberto}
      recusado={searchParams.get("recusado") === "1"}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onPagar={pagar}
    />
  );
}

export default function PagamentoMeiPage() {
  return (
    <Suspense>
      <PagamentoConteudo />
    </Suspense>
  );
}
