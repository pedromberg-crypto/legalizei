"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ContaMeiView,
  CONTA_MEI_VAZIA,
  type EtapaConta,
  type DadosContaMei,
} from "@/components/mei/conta";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M4 — SUA CONTA · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/conta.tsx`.
 *
 * As 3 etapas (formulário · código · CPF divergente) são estados desta MESMA
 * rota, alcançáveis por `?etapa=`. É o mesmo padrão de deep-link que o caminho
 * ME adotou em 04/09 pro E6.1 e E6.2 — sem ele, os estados ficam
 * indistinguíveis no mapa e ninguém consegue revisar a tela que só aparece
 * quando dá errado.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/conta";

function ContaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const paramEtapa = searchParams.get("etapa");
  const inicial: EtapaConta =
    paramEtapa === "codigo"
      ? "codigo"
      : paramEtapa === "cpf-divergente"
        ? "cpf-divergente"
        : "form";

  const [etapa, setEtapa] = useState<EtapaConta>(inicial);
  const [dados, setDados] = useState<DadosContaMei>(CONTA_MEI_VAZIA);
  const [codigo, setCodigo] = useState("");

  return (
    <ContaMeiView
      meta={etapa === "form" ? metaDoVoltar(ROTA) : "Sua conta"}
      etapa={etapa}
      dados={dados}
      setDados={setDados}
      codigo={codigo}
      setCodigo={setCodigo}
      onVoltar={() =>
        etapa === "form"
          ? router.push(comCategoria(anterior(ROTA), categoria))
          : setEtapa("form")
      }
      onSeguir={() =>
        etapa === "form"
          ? setEtapa("codigo")
          : router.push(comCategoria(proxima(ROTA), categoria))
      }
      onFalarComTime={() => router.push("/mei/status")}
    />
  );
}

export default function ContaMeiPage() {
  return (
    <Suspense>
      <ContaConteudo />
    </Suspense>
  );
}
