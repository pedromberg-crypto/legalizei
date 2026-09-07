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
      titulo: "Você",
      linhas: [
        { rotulo: "Nome", valor: searchParams.get("nome") ?? "Ana Beatriz Ramos" },
        { rotulo: "CPF", valor: searchParams.get("cpf") ?? "123.456.789-01" },
        { rotulo: "Contato", valor: "(31) 98765-4321" },
      ],
      onAjustar: () => router.push(comCategoria("/mei/titular", categoria)),
    },
    {
      titulo: "O que a empresa faz",
      linhas: [
        {
          rotulo: "Ocupação principal",
          valor:
            searchParams.get("ocup") ??
            "Técnico(a) de manutenção de computador (9511-8/00)",
        },
      ],
      onAjustar: () => router.push(comCategoria("/mei/ocupacao", categoria)),
    },
    {
      titulo: "A empresa",
      linhas: [
        /* No MEI a razão social não é escolhida: sai automática do nome civil
           + CPF (Lei 14.195/2021). Mostrar um nome aqui daria a entender que
           houve escolha, e que ela pode ser recusada. */
        { rotulo: "Nome", valor: "Sai automático: seu nome + seu CPF" },
        { rotulo: "Tipo", valor: "MEI" },
        {
          rotulo: "Endereço",
          valor:
            searchParams.get("end") ??
            "Rua dos Timbiras, 1200 · Belo Horizonte, MG",
        },
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
