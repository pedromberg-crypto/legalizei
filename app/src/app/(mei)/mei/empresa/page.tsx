"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmpresaMeiView } from "@/components/mei/dossie";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * M9 — SUA EMPRESA · rota de produção do ramo MEI.
 * A tela vive em `components/mei/dossie.tsx`.
 */
const ROTA = "/mei/empresa";

function EmpresaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [formas, setFormas] = useState<string[]>([]);
  const [capital, setCapital] = useState("");
  const [baixoRisco, setBaixoRisco] = useState(false);

  return (
    <EmpresaMeiView
      meta={metaDoVoltar(ROTA)}
      /* 🚧 Mock: o endereço real vem da M1 e ainda não trafega entre telas
         (RF-01). Placeholder do CEP de teste, igual ao resto do app. */
      endereco={
        searchParams.get("end") ??
        "Rua dos Timbiras, 123 · Funcionários · Belo Horizonte, MG"
      }
      formas={formas}
      setFormas={setFormas}
      capital={capital}
      setCapital={setCapital}
      confirmaBaixoRisco={baixoRisco}
      setConfirmaBaixoRisco={setBaixoRisco}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
    />
  );
}

export default function EmpresaMeiPage() {
  return (
    <Suspense>
      <EmpresaConteudo />
    </Suspense>
  );
}
