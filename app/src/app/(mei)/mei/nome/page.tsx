"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NomeMeiView } from "@/components/mei/dossie";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * M10 — NOME DA EMPRESA · rota de produção do ramo MEI.
 * A tela vive em `components/mei/dossie.tsx`.
 *
 * ⚠️ Não existe rodada-2 de nomes aqui (a C7′ do ME), e a ausência é lei: no
 * MEI a razão social é gerada automaticamente (nome civil + CPF, Lei
 * 14.195/2021). Ninguém analisa e ninguém recusa, então não há segunda rodada
 * possível.
 */
const ROTA = "/mei/nome";

function NomeConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [fantasia, setFantasia] = useState("");

  return (
    <NomeMeiView
      meta={metaDoVoltar(ROTA)}
      nomeCivil={searchParams.get("nome") ?? "Seu nome completo"}
      cpf={searchParams.get("cpf") ?? "00000000000"}
      fantasia={fantasia}
      setFantasia={setFantasia}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
    />
  );
}

export default function NomeMeiPage() {
  return (
    <Suspense>
      <NomeConteudo />
    </Suspense>
  );
}
