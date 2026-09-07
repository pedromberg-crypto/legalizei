"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtividadeSecundariasMeiView } from "@/components/mei/atividade-secundarias";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";
import type { Ocupacao } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7.S — ATIVIDADES SECUNDÁRIAS · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/atividade-secundarias.tsx`.
 *
 * 🚧 A principal escolhida na M7 chega aqui por MOCK enquanto não há estado
 * compartilhado entre telas (RF-01, mesma dívida que o dossiê do ME tem desde
 * 28/07). O que o mock NÃO pode fazer é inventar: ele usa a 1ª ocupação da
 * categoria que veio no fluxo, que é uma escolha plausível pra aquela pessoa —
 * e não uma ocupação de outro ramo, que faria a tela mentir na revisão.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/atividade-secundarias";

function SecundariasConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  /* 🚧 mock (RF-01): sem estado entre telas, a principal vem da query. */
  const cnae = searchParams.get("cnae");
  const nome = searchParams.get("ocupacao");
  const [principal] = useState<Ocupacao | null>(
    cnae && nome ? { cnae, nome } : null,
  );
  const [secundarias, setSecundarias] = useState<Ocupacao[]>([]);

  return (
    <AtividadeSecundariasMeiView
      meta={metaDoVoltar(ROTA)}
      principal={principal}
      secundarias={secundarias}
      setSecundarias={setSecundarias}
      categoriaDaPrincipal={categoria}
      onSeguir={() =>
        router.push(
          `/mei/splash-atividades?next=${encodeURIComponent(
            comCategoria(proxima(ROTA), categoria),
          )}`,
        )
      }
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
    />
  );
}

export default function SecundariasMeiPage() {
  return (
    <Suspense>
      <SecundariasConteudo />
    </Suspense>
  );
}
