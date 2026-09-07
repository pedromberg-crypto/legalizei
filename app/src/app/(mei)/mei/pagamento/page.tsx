"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PagamentoMeiView,
  PAGAMENTO_MEI_VAZIO,
  type MetodoMei,
  type DadosPagamentoMei,
} from "@/components/mei/pagamento";
import { anterior, metaDoVoltar } from "@/lib/mei-flow";
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

  /* 🆕 07/09 — o método pode vir por ROTA (`?metodo=boleto`), que é como o
     caminho do boleto fica alcançável sem card na tela. Mesmo arranjo do ME. */
  const metodoDaRota = searchParams.get("metodo");
  const [metodo, setMetodo] = useState<MetodoMei | null>(
    metodoDaRota === "boleto" || metodoDaRota === "pix" || metodoDaRota === "cartao"
      ? metodoDaRota
      : null,
  );
  const [dados, setDados] = useState<DadosPagamentoMei>(PAGAMENTO_MEI_VAZIO);
  const [aceito, setAceito] = useState(false);
  const [contratoAberto, setContratoAberto] = useState(false);

  /**
   * 🆕 07/09 (pedido do Pedro) — recusa e retentativa, o par que faltava.
   * · `?retry=1`        — volta do splash de recusa; a tela explica e pede
   *                       outro cartão ou Pix, SEM zerar o que foi preenchido.
   * · `?simular=recusa` — deixa o caminho alcançável no mapa e na demo, mesmo
   *                       padrão de `/pagamento?simular=recusa` do ME.
   * ⚠️ O nome do param mudou de `?recusado=1` pra `?retry=1`: era o único
   * ponto em que os dois ramos escreviam a mesma ideia com nomes diferentes, e
   * divergência de vocabulário entre caminhos é o que faz alguém procurar a
   * tela pelo nome do outro e concluir que ela não existe.
   */
  const retry = searchParams.get("retry") === "1";
  const simularRecusa = searchParams.get("simular") === "recusa";

  function destino() {
    if (simularRecusa) {
      return `/mei/splash-recusado?next=${encodeURIComponent("/mei/pagamento?retry=1")}`;
    }
    /* 🔄 07/09 — antes ia do splash direto pro M7 (ocupação). Agora todo
       método passa pelo status intermediário (M6.1/M6.1P), mesma revogação
       que o ME fez em 30/08: reforça "dá pra sair e voltar, está tudo certo".
       Boleto cai no status PENDENTE; cartão e Pix caem no status já pago. */
    if (metodo === "boleto") {
      const pendente = comCategoria("/mei/aguardando", categoria);
      return `/mei/splash-boleto?next=${encodeURIComponent(pendente)}`;
    }
    const pago = comCategoria("/mei/aguardando?pago=1", categoria);
    return `/mei/splash-pagamento?next=${encodeURIComponent(pago)}`;
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
      recusado={retry}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onPagar={() => router.push(destino())}
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
