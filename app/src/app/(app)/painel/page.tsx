"use client";

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
 * pipeline no mesmo componente. MEI não passa pela Junta Comercial (registra
 * no Portal do Empreendedor), então a timeline de dias vira 1 passo rápido.
 * 🟡 "minutos, não dias" é qualitativo de propósito (mesma regra anti-guru
 * do resto da tela) — sem cravar um nº de minutos sem fonte primária.
 */
const ETAPAS_MEI: Etapa[] = [{ nome: "Registrando no Portal do Empreendedor" }];

export default function PainelPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  if (mei) {
    return (
      <PainelView
        concluidas={0}
        emAndamento={0}
        socios={1}
        etapas={ETAPAS_MEI}
        titulo={{
          normal: "Registrando seu MEI",
          recusa: "Precisamos de você num ponto",
        }}
        sub={{
          normal:
            "MEI não passa pela Junta Comercial — o registro é direto no Portal do Empreendedor, bem mais rápido que abrir ME.",
          recusa: "O registro seguiu bem até aqui. Precisa de um ajuste rápido.",
        }}
        prazo="Minutos, não dias — MEI não depende da Junta Comercial."
        idempotencia="Não cobramos de novo se você atualizar a página."
      />
    );
  }

  return (
    <PainelView
      concluidas={2}
      emAndamento={2}
      socios={1}
      onPagarDae={() => router.push("/certificado")}
    />
  );
}
