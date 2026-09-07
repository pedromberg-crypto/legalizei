"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { CertificadoMeiView } from "@/components/mei/certificado";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M14 — CERTIFICADO DIGITAL · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/certificado.tsx`.
 *
 * 🔄 07/09 — substitui `/certificado?regime=mei`. A rota antiga segue viva pro
 * Migrar, que a usa por outro caminho e não muda; o caminho ME saiu dela em
 * 01/09. Aqui o motivo é OPERAR (não a procuração da assinatura) e o custo é
 * do cliente, então nada dela servia sem guarda — que é exatamente o tipo de
 * tela que o fork existe pra separar.
 *
 * É o ÚLTIMO passo da espinha: `proxima()` devolve a casa (`/home-dia1`).
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/certificado";

function CertificadoConteudo() {
  const router = useRouter();
  const [escolha, setEscolha] = useState<"quero" | "depois" | null>(null);
  const [aceiteContato, setAceiteContato] = useState(false);

  return (
    <CertificadoMeiView
      meta={metaDoVoltar(ROTA)}
      escolha={escolha}
      setEscolha={setEscolha}
      aceiteContato={aceiteContato}
      setAceiteContato={setAceiteContato}
      onVoltar={() => router.push(anterior(ROTA))}
      onSeguir={() => router.push(proxima(ROTA))}
    />
  );
}

export default function CertificadoMeiPage() {
  return (
    <Suspense>
      <CertificadoConteudo />
    </Suspense>
  );
}
