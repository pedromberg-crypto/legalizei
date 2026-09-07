"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImpedimentosView } from "@/components/mei/impedimentos";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";
import { IMPEDIMENTOS } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 — OS 3 IMPEDIMENTOS · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/impedimentos.tsx`.
 *
 * 🔄 07/09 — ANTES ela era renderizada de DENTRO do `/gate`, que é tela de ME:
 * a page do gate tinha um `if (etapa === "triagem" && mei)` e um comentário
 * explicando que o `ImpedimentoView` traz o próprio `<main>` e por isso ficava
 * fora do wrapper. Era o sintoma visível da herança: uma tela de MEI aninhada
 * na estrutura de uma tela de ME. Agora ela tem rota própria e o problema
 * deixa de existir.
 * 🔄 07/09 (2ª rodada, pedido do Pedro) — OS 2 GATES VIRARAM ESTADO DAQUI.
 * As saídas eram 2 telas (`/mei/saida/ja-tem-cnpj` e `/mei/saida/servidor`) e
 * passaram a ser blocos condicionais da própria M2, alcançáveis por
 * `?bloqueio=`. Mesmo movimento que o ME fez em 04/09 com o E6.2
 * (`/conta?cpf=nome`): estado que muda o que a tela mostra continua sendo nó
 * do mapa, sem precisar de rota própria.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/impedimentos";

/** Os bloqueios que a rota aceita por deep-link, pro mapa e pra revisão. */
const BLOQUEIO_POR_PARAM: Record<string, string> = {
  "ja-tem-cnpj": "outra-empresa",
  servidor: "servidor",
};

function ImpedimentosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  /* `?bloqueio=` chega com o impedimento já respondido "sim": é o deep-link
     que mantém os 2 estados revisáveis no mapa e na demo, sem obrigar quem
     revisa a marcar a resposta na mão. */
  const bloqueioDaRota = BLOQUEIO_POR_PARAM[searchParams.get("bloqueio") ?? ""];
  const [respostas, setRespostas] = useState<Record<string, boolean | null>>(() =>
    Object.fromEntries(
      IMPEDIMENTOS.map((i) => [i.id, i.id === bloqueioDaRota ? true : null]),
    ),
  );
  const [cienteBeneficio, setCienteBeneficio] = useState(false);

  return (
    <ImpedimentosView
      meta={metaDoVoltar(ROTA)}
      respostas={respostas}
      setResposta={(id, v) => setRespostas((r) => ({ ...r, [id]: v }))}
      cienteBeneficio={cienteBeneficio}
      setCienteBeneficio={setCienteBeneficio}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
      /* A alternativa de quem foi bloqueado. O fork (E3.2) é onde o caminho
         ME começa, e é pra lá que ela volta. */
      onVerMe={() => router.push("/entrada?intencao=abrir")}
    />
  );
}

export default function ImpedimentosPage() {
  return (
    <Suspense>
      <ImpedimentosConteudo />
    </Suspense>
  );
}
