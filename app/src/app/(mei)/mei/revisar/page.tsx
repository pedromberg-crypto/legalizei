"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RevisarMeiView, type BlocoRevisao } from "@/components/mei/revisar";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M11 — REVISAR E AUTORIZAR · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/revisar.tsx`.
 *
 * 🔴 Esta rota é a que CONSERTA o defeito mais grave do levantamento de 07/09:
 * o MEI saía do `/revisar` compartilhado e caía em `/iniciar-viabilidade`,
 * uma tela sobre consulta prévia de viabilidade — extinta pro MEI pela Res.
 * CGSIM 61/2020. Daqui em diante ele vai pro status dele.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/revisar";

function RevisarConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [autorizado, setAutorizado] = useState(false);

  /* 🚧 Mock de review: os valores reais viriam do estado do wizard, que ainda
     não trafega entre telas (RF-01). O que importa aqui é a ESTRUTURA dos
     blocos e o destino de cada "Ajustar" — esses são de verdade. */
  const blocos: BlocoRevisao[] = [
    {
      titulo: "Seus dados",
      linhas: [searchParams.get("nome") ?? "Seu nome completo"],
      onAjustar: () => router.push(comCategoria("/mei/titular", categoria)),
    },
    {
      titulo: "Sua ocupação",
      linhas: [searchParams.get("ocup") ?? "A ocupação que você escolheu"],
      onAjustar: () => router.push(comCategoria("/mei/ocupacao", categoria)),
    },
    {
      titulo: "Sua empresa",
      linhas: [
        searchParams.get("end") ??
          "Rua dos Timbiras, 123 · Belo Horizonte, MG",
      ],
      onAjustar: () => router.push(comCategoria("/mei/empresa", categoria)),
    },
  ];

  return (
    <RevisarMeiView
      meta={metaDoVoltar(ROTA)}
      blocos={blocos}
      autorizado={autorizado}
      setAutorizado={setAutorizado}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(proxima(ROTA))}
    />
  );
}

export default function RevisarMeiPage() {
  return (
    <Suspense>
      <RevisarConteudo />
    </Suspense>
  );
}
