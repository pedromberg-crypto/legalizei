"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// 🔄 01/09 (pedido do Pedro) — A3.1 passou a ser A MESMA TELA do A3, no estado
// de alerta: hero escuro + a jornada inteira (9 passos do dossiê + 3 da Junta),
// com a recusa inline na etapa que travou. Antes era um `PainelView` cru, com
// só as 3 etapas da cauda e sem hero — parecia outro app justo no momento em
// que a confiança está mais frágil, que é o oposto da doutrina da UX-40.
import { AguardandoView } from "@/components/wizard-cauda";
import { TEM_SOCIO, RAZAO_OPCOES } from "@/app/(app)/dossie/mock";

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

/* 🐛 04/09 (auditoria do bloco A3) — ESTA TELA TINHA MOCK PRÓPRIO, E ELE
   DIVERGIA. Declarava "Ana SOUZA Web Studio" enquanto o dossiê inteiro usa
   "Ana RAMOS Web Studio" (`RAZAO_OPCOES`): a pessoa escolhia um nome no C7,
   revia no A1 e via outro na tela da recusa. É exatamente o bug que o arquivo
   de mock único existe pra impedir (o CNAE com um dígito trocado, 29/07).
   Agora lê da fonte, na mesma ordem de prioridade que ela escolheu. */
const OPCOES = RAZAO_OPCOES;

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
          /* 🐛 04/09 (auditoria) — índice relativo às 3 etapas da Junta (o
             `AguardandoView` soma os passos do dossiê sozinho). Era 1 ("Pague
             a guia"); o certo é 0, "Analisando viabilidade", que é onde o nome
             é analisado e onde a exigência de fato aconteceu. */
          etapa: 0,
          titulo: "As 3 opções de nome não passaram",
          /* ✍️ 04/09 (auditoria) — ENTROU O PRAZO. A Junta trabalha por
             EXIGÊNCIA: o processo volta pra correção com 30 dias, e é só quem
             não corrige nesse prazo que perde o pedido e as taxas
             (`pesquisa/exigencias-jucemg.md`). A tela dizia "é rápido de
             resolver" e escondia o relógio — o pior dos dois mundos, porque a
             pessoa descobre o prazo pelo e-mail da Junta, sem contexto. Dito
             aqui, ele tranquiliza: 30 dias é MUITO tempo pra escrever 3 nomes.
             Nada de "recusa": o vocabulário travado hoje é "a Junta pediu um
             ajuste", e o custo (nenhum) vem junto. */
          motivo:
            "Testamos as 3 que você priorizou e nenhuma passou. A Junta dá 30 dias pra responder, e é bastante tempo: escreva outras 3 que a gente manda de novo, sem custo e sem recomeçar o processo.",
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
        /* 🐛 04/09 (auditoria) — era `1`, que na lista das etapas da Junta é
           "Pague a guia da Junta": o alerta caía na etapa do DINHEIRO enquanto
           o texto falava dos NOMES. Nome é analisado na etapa 0 (viabilidade).
           Os 2 comentários antigos daqui se contradiziam sobre esse índice. */
        etapa: 0,
        titulo:
          fase === "tentando"
            ? `Testando a opção ${tentativa + 1} de 3: "${OPCOES[tentativa]}"`
            : `"${OPCOES[tentativa]}" não passou`,
        /* ✍️ 04/09 — saiu o travessão (regra dura desde 24/07). */
        motivo:
          fase === "tentando"
            ? "Não precisa fazer nada. A gente já está tentando a próxima opção que você priorizou, automaticamente."
            : "Já partindo pra próxima opção da sua lista, sem você precisar agir.",
        acao: "Aguarde, tentando automaticamente…",
      }}
    />
  );
}
