"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EnderecoMeiView } from "@/components/mei/endereco";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1 — ONDE VOCÊ TRABALHA · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/endereco.tsx`. Esta page é o wrapper: liga a
 * navegação e nada mais — mesmo padrão das pages do caminho ME.
 *
 * 🔒 `onVoltar` e o `meta` NÃO são escritos à mão: vêm de `lib/mei-flow.ts`,
 * derivados da posição da tela na espinha. É a resposta em código pra regra 6
 * do CLAUDE.md (tela nascendo sem seta, e `meta` com o nome da própria tela em
 * vez do destino) — os dois furos apareceram 5 vezes no caminho ME.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/endereco";

function EnderecoMeiConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categoria, setCategoria] = useState<string | null>(
    categoriaDe(searchParams),
  );
  const [forma, setForma] = useState<string | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  return (
    <EnderecoMeiView
      meta={metaDoVoltar(ROTA)}
      categoria={categoria}
      setCategoria={setCategoria}
      forma={forma}
      setForma={setForma}
      cep={cep}
      setCep={setCep}
      numero={numero}
      setNumero={setNumero}
      complemento={complemento}
      setComplemento={setComplemento}
      onVoltar={() => router.push(anterior(ROTA))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
      /* A saída de quem escolheu categoria sem MEI: volta pro caminho ME
         levando a categoria junto, pra não repetir a pergunta. */
      onQueroMe={() => router.push(comCategoria("/endereco", categoria))}
    />
  );
}

export default function EnderecoMeiPage() {
  return (
    <Suspense>
      <EnderecoMeiConteudo />
    </Suspense>
  );
}
