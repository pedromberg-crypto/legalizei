"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TitularMeiView, TITULAR_VAZIO, type DadosTitular } from "@/components/mei/dossie";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * M8 — SEUS DADOS (titular) · rota de produção do ramo MEI.
 * A tela vive em `components/mei/dossie.tsx`.
 *
 * 🚧 Nome, CPF e nascimento chegam por querystring porque não existe
 * persistência real entre telas (RF-01, dívida conhecida do projeto inteiro).
 * Sem eles, a tela mostra "—" e continua funcionando — é mock de review, não
 * produção.
 */
const ROTA = "/mei/titular";

function TitularConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [dados, setDados] = useState<DadosTitular>(TITULAR_VAZIO);

  return (
    <TitularMeiView
      meta={metaDoVoltar(ROTA)}
      nome={searchParams.get("nome") ?? ""}
      cpf={searchParams.get("cpf") ?? ""}
      nascimento={searchParams.get("nasc") ?? ""}
      dados={dados}
      setDados={setDados}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
    />
  );
}

export default function TitularMeiPage() {
  return (
    <Suspense>
      <TitularConteudo />
    </Suspense>
  );
}
