"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OcupacaoMeiView } from "@/components/mei/ocupacao";
import { proxima, metaDoVoltar } from "@/lib/mei-flow";
import { comCategoria, categoriaDe } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7 — SUA OCUPAÇÃO · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/ocupacao.tsx`.
 *
 * ⚠️ O voltar daqui NÃO é o pagamento, mesmo o pagamento sendo a tela
 * anterior na espinha: voltar pra uma tela de cobrança já efetuada é o pior
 * destino possível de uma seta. `anterior()` devolveria `/mei/pagamento`, e
 * esta é a única tela do ramo que sobrescreve a regra — de propósito e
 * escrito, não por esquecimento.
 *
 * 📌 A espinha continua sendo a fonte da ORDEM; o que muda aqui é só o destino
 * do voltar. Se um dia o ramo ganhar uma tela de "resumo do pagamento", é pra
 * ela que esta seta passa a apontar.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/ocupacao";

function OcupacaoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [principal, setPrincipal] = useState<string | null>(null);
  const [secundarias, setSecundarias] = useState<string[]>([]);

  return (
    <OcupacaoMeiView
      meta={metaDoVoltar(ROTA)}
      categoria={categoria}
      principal={principal}
      setPrincipal={setPrincipal}
      secundarias={secundarias}
      setSecundarias={setSecundarias}
      /* Sobrescrita consciente: `anterior(ROTA)` é `/mei/pagamento`, e ninguém
         deve voltar pra uma tela de cobrança já paga. */
      onVoltar={() => router.push(comCategoria("/mei/plano", categoria))}
      onSeguir={() => router.push(comCategoria(proxima(ROTA), categoria))}
    />
  );
}

export default function OcupacaoMeiPage() {
  return (
    <Suspense>
      <OcupacaoConteudo />
    </Suspense>
  );
}
