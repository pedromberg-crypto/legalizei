"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtividadeMeiView } from "@/components/mei/atividade";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";
import type { Ocupacao } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7.0 / M7 — SUA ATIVIDADE · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/atividade.tsx`.
 *
 * Uma rota, 2 estados, o mesmo padrão da C0/C0.0 do ME:
 *   · `/mei/atividade?vazia=1` → a chegada, antes de descrever (M7.0);
 *   · `/mei/atividade`         → com o slot e os cartões (M7).
 *
 * 🔄 07/09 — substitui a antiga M7 (`components/mei/ocupacao.tsx`), que
 * resolvia principal e secundárias numa tela só, em lista simples. O pedido do
 * Pedro foi usar o sistema do ME (descrever → slot → cartões → sheet) com a
 * lista fechada do MEI, e ele não cabia numa tela.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/atividade";

function AtividadeConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaDoFlow = categoriaDe(searchParams);

  const vazia = searchParams.get("vazia") === "1";
  const [categoria, setCategoria] = useState<string | null>(categoriaDoFlow);
  const [texto, setTexto] = useState("");
  const [principal, setPrincipal] = useState<Ocupacao | null>(null);

  return (
    <AtividadeMeiView
      meta={metaDoVoltar(ROTA)}
      categoria={categoria}
      setCategoria={setCategoria}
      texto={texto}
      setTexto={setTexto}
      principal={principal}
      setPrincipal={setPrincipal}
      semResultados={vazia}
      /* Da chegada pros resultados: mesma rota, sem o `?vazia=1`. */
      onBuscar={() => router.push(comCategoria(ROTA, categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
      onVoltar={() => router.push(comCategoria(anterior(ROTA), categoriaDoFlow))}
    />
  );
}

export default function AtividadeMeiPage() {
  return (
    <Suspense>
      <AtividadeConteudo />
    </Suspense>
  );
}
