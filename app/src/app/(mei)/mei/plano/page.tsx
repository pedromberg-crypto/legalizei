"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlanoMeiView } from "@/components/mei/plano";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * M5 — SEU PLANO · rota de produção do ramo MEI.
 * A tela vive em `components/mei/plano.tsx`.
 */
const ROTA = "/mei/plano";

function PlanoConteudo() {
  const router = useRouter();
  const categoria = categoriaDe(useSearchParams());

  return (
    <PlanoMeiView
      meta={metaDoVoltar(ROTA)}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
    />
  );
}

export default function PlanoMeiPage() {
  return (
    <Suspense>
      <PlanoConteudo />
    </Suspense>
  );
}
