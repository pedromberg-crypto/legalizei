"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaturamentoMeiView } from "@/components/mei/faturamento";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3 — SEU FATURAMENTO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/faturamento.tsx`.
 *
 * ⚠️ O splash "conseguimos te atender" (E5F.1 do ME) NÃO entra aqui, e a
 * ausência é decisão: no ME ele confirma que a faixa informada é atendida,
 * porque lá a faixa é a última dúvida antes do plano. No MEI a faixa é gate
 * DURO (o teto), e quem passa por ele já viu a resposta na própria tela. Um
 * splash dizendo "conseguimos te atender" logo depois seria repetir em tela
 * cheia o que a pessoa acabou de ler.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/faturamento";

function FaturamentoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");
  const [cienteTeto, setCienteTeto] = useState(false);

  return (
    <FaturamentoMeiView
      meta={metaDoVoltar(ROTA)}
      faixa={faixa}
      setFaixa={setFaixa}
      modoExato={modoExato}
      setModoExato={setModoExato}
      exato={exato}
      setExato={setExato}
      cienteTeto={cienteTeto}
      setCienteTeto={setCienteTeto}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
      /* Estourou o teto: segue como ME, levando a categoria. O gate do MLP
         (só BH) só vai aparecer lá, que é onde ele de fato existe. */
      onQueroMe={() => router.push(comCategoria("/endereco", categoria))}
    />
  );
}

export default function FaturamentoPage() {
  return (
    <Suspense>
      <FaturamentoConteudo />
    </Suspense>
  );
}
