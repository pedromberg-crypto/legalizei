"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { CertificadoMeiView } from "@/components/mei/certificado";
import { anterior, metaDoVoltar } from "@/lib/mei-flow";

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
 * 🔴 07/09 (decisão do Pedro) — ELE VIROU GATE. A tela deixou de despejar na
 * casa: quem escolhe resolver agora vai pro pagamento (M14.P), quem escolhe
 * esperar vai pro status travado (M14‴). A casa passa a ser destino de quem
 * tem certificado, não de quem chegou até aqui — o mesmo lugar que a taxa da
 * Junta ocupa no ME.
 *
 * ⚠️ `proxima(ROTA)` (a casa) deixou de ser chamado por isso, e não por
 * esquecimento: a espinha continua dizendo que a M14 é o último passo, o que
 * segue verdade — o que mudou é o que acontece ENTRE ela e a casa.
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
      onSeguir={() =>
        router.push(
          escolha === "quero"
            ? "/mei/certificado/pagar"
            : "/mei/status?fase=certificado&certificado=pendente",
        )
      }
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
