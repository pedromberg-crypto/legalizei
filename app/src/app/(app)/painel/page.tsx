"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PainelView, type Etapa } from "@/components/painel";
import { ehMei } from "@/lib/regime";

/**
 * N21 · PAINEL (andamento) — shell APP · spec T20.
 * Mock pra farol: documentação feita + viabilidade deferida (índices 0-1),
 * DAE aguardando pagamento (índice 2, CTA visível). 🆕 26/08 (reunião Rua
 * Satélite 36, item 6): voltou a ter 4 etapas — o pagamento da DAE, que era
 * timing de backend (paga no checkout, some tela), agora tem CTA próprio
 * aqui, depois que a viabilidade sai. Ver `components/painel.tsx`.
 *
 * 🆕 03/08 — MEI reusa a MESMA máquina parametrizada que o flow #2 (migrar)
 * já usa (`etapas`/`titulo`/`sub`/`prazo`) — não é tela nova, é outro
 * pipeline no mesmo componente.
 *
 * ─── 🔄 28/08 — O PIPELINE DO MEI FOI REESCRITO ────────────────────────────
 * A versão de 03/08 tinha 1 etapa só, "Registrando no Portal do Empreendedor",
 * e ela **prometia o que a gente não pode entregar**: dava a entender que a
 * Legalizai registra o MEI sozinha. A pesquisa de 28/08 fechou que isso é
 * impossível — não há API, não há procuração que cubra o registro, e a senha
 * gov.br é intransferível por Termo de Uso. Ver
 * `pesquisa/abertura-mei/abertura-mei-processo.md` §Bloco 1.
 *
 * O modelo real (decidido com o Pedro em 28/08) é **concierge**: um atendente
 * interno confere o que foi coletado e libera os próximos passos. Por isso as
 * 4 etapas abaixo, e por isso a 3ª usa `acaoCliente` — o mesmo mecanismo que a
 * DAE da abertura de ME já usa pra dizer "agora é a sua vez, e está tudo bem".
 *
 * ✍️ REGRA DE COPY: nenhuma etapa pode dizer que a gente registra. A palavra
 * "contador" também não aparece — o plano MEI (R$49) tem atendente, e contador
 * CRC é o que sustenta o preço do ME (R$139). Ver `financeiro/estado-atual.md`.
 */
const ETAPAS_MEI: Etapa[] = [
  { nome: "Recebemos seus dados" },
  { nome: "Nosso time está conferindo tudo" },
  {
    nome: "Seus próximos passos ficam prontos",
    acaoCliente: { label: "Ver meus próximos passos" },
  },
  { nome: "Empresa aberta" },
];

// 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — fusão A3+E9: o
// caminho ME não usa mais `/painel` isolado — virou a fase "junta" da MESMA
// tela de status (`/aguardando?fase=junta`). Esta rota segue viva só pro MEI
// (pipeline concierge, abaixo) e é reusada pelo Migrar (`components/painel.tsx`
// direto, ver `wizard-migrar.tsx`) — nenhum dos dois muda.
export default function PainelPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  useEffect(() => {
    if (!mei) router.replace("/aguardando?fase=junta");
  }, [mei, router]);

  if (mei) {
    return (
      <PainelView
        // Mock pra farol: dados recebidos (0) e time conferindo (1).
        concluidas={1}
        emAndamento={1}
        socios={1}
        etapas={ETAPAS_MEI}
        onPagarDae={() => router.push("/mei/proximos-passos")}
        titulo={{
          normal: "Estamos conferindo tudo",
          recusa: "Precisamos de você num ponto",
        }}
        sub={{
          normal:
            "Enviamos seus dados pro nosso time. Assim que a conferência terminar, a gente te mostra os próximos passos, que são simples.",
          recusa: "Seguiu bem até aqui. Falta um ajuste rápido, e a gente te guia.",
        }}
        // 🟡 Qualitativo de propósito (regra anti-guru): a conferência depende
        // de gente, e cravar "2 horas" sem medir viraria promessa furada.
        prazo="A conferência é com o nosso time, e costuma ser no mesmo dia."
        idempotencia="Seus dados ficam guardados. Pode fechar o app que nada se perde."
      />
    );
  }

  return null;
}
