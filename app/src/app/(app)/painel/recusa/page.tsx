"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// 🔄 01/09 (pedido do Pedro) — A3.1 passou a ser A MESMA TELA do A3, no estado
// de alerta: hero escuro + a jornada inteira (9 passos do dossiê + 3 da Junta),
// com a recusa inline na etapa que travou. Antes era um `PainelView` cru, com
// só as 3 etapas da cauda e sem hero — parecia outro app justo no momento em
// que a confiança está mais frágil, que é o oposto da doutrina da UX-40.
import { AguardandoView } from "@/components/wizard-cauda";
import { TEM_SOCIO } from "@/app/(app)/dossie/mock";

/**
 * REC · RECUSA DE ÓRGÃO — o 4º estado do painel (UX-40) · shell APP.
 * Motor: persona `erro-orgao` (nome reprovado na JUCEMG apesar da prévia).
 *
 * ⚠️ REESCRITA 28/07 (reunião Rua Satélite 9) — RETRY AUTOMÁTICO. Antes a
 * tela parava na 1ª recusa e já pedia ação do cliente. Agora: as 3 opções de
 * razão social do N16 (pré-validadas pelo time, em ordem de prioridade) são
 * tentadas AUTOMATICAMENTE, uma atrás da outra. Só quando as 3 falham é que
 * a tela pede ação — sugerir mais 3 nomes pra tentar de novo.
 *
 * Mock pra farol: aqui as 3 SEMPRE falham, pra provar o pior caso (é o que
 * testa o estado final de verdade). No app real a maioria resolve na 1ª ou
 * 2ª tentativa, sem o cliente nem perceber.
 */

// Herdadas do N16 (mock, mesma ordem de prioridade que a pessoa escolheu).
const OPCOES = [
  "Ana Souza Web Studio",
  "Ana Souza Desenvolvimento de Software",
  "Ana Tecnologia ME",
];

type Fase = "tentando" | "recusado" | "esgotado";

export default function RecusaPage() {
  const router = useRouter();
  const [tentativa, setTentativa] = useState(0); // índice em OPCOES
  const [fase, setFase] = useState<Fase>("tentando");

  useEffect(() => {
    if (fase !== "tentando") return;
    // 🌾 mesmo padrão do "Analisando" do N4: loading que EXPLICA, com tempo
    // pra ler, não spinner mudo instantâneo.
    const t = setTimeout(() => {
      if (tentativa < OPCOES.length - 1) {
        setFase("recusado");
        setTimeout(() => {
          setTentativa((n) => n + 1);
          setFase("tentando");
        }, 900);
      } else {
        setFase("esgotado");
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [fase, tentativa]);

  if (fase === "esgotado") {
    return (
      <AguardandoView
        fase="junta"
        temSocios={TEM_SOCIO}
        recusa={{
          // Índice relativo às 3 etapas da Junta (o AguardandoView soma os 9
          // passos do dossiê sozinho) — 1 = "Pague a guia da Junta".
          etapa: 1,
          titulo: "As 3 opções de nome não passaram",
          motivo:
            "Testamos automaticamente as 3 que você priorizou, e nenhuma passou na Junta. Precisamos de mais 3 sugestões suas pra tentar de novo.",
          acao: "Sugerir mais 3 nomes",
        }}
        // 🆕 01/09 (pedido do Pedro) — o CTA agora LEVA a algum lugar: a mesma
        // tela do C7, com os campos vazios, pra pessoa escrever as 3 novas.
        onAcaoRecusa={() => router.push("/dossie/nome/rodada-2")}
      />
    );
  }

  // Enquanto tenta 1ª/2ª/3ª automaticamente: mesma timeline do painel, com o
  // status da etapa 1 ("Analisando viabilidade") mostrando qual tentativa
  // está rodando agora. ⚠️ 29/07: índice mudou de 2 pra 1 (ETAPAS caiu de 4
  // pra 3 — ver `components/painel.tsx`).
  return (
    <AguardandoView
      fase="junta"
      temSocios={TEM_SOCIO}
      recusa={{
        etapa: 1,
        titulo:
          fase === "tentando"
            ? `Testando a opção ${tentativa + 1} de 3: "${OPCOES[tentativa]}"`
            : `"${OPCOES[tentativa]}" não passou`,
        motivo:
          fase === "tentando"
            ? "Não precisa fazer nada — a gente já está tentando a próxima opção que você priorizou, automaticamente."
            : "Já partindo pra próxima opção da sua lista, sem você precisar agir.",
        acao: "Aguarde, tentando automaticamente…",
      }}
    />
  );
}
