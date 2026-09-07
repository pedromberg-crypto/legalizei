"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImpedimentosView } from "@/components/mei/impedimentos";
import { anterior, proxima, metaDoVoltar, SAIDAS_MEI } from "@/lib/mei-flow";
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
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/impedimentos";

/** Qual saída abrir, a partir do bloqueio que a pessoa marcou. */
function saidaDoBloqueio(respostas: Record<string, boolean | null>): string {
  if (respostas["outra-empresa"] === true) return SAIDAS_MEI.jaTemCnpj;
  if (respostas["servidor"] === true) return SAIDAS_MEI.servidor;
  return SAIDAS_MEI.jaTemCnpj;
}

function ImpedimentosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [respostas, setRespostas] = useState<Record<string, boolean | null>>(
    Object.fromEntries(IMPEDIMENTOS.map((i) => [i.id, null])),
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
      onSaida={() => router.push(saidaDoBloqueio(respostas))}
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
