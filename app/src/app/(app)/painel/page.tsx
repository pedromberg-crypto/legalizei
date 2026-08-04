"use client";

import { useSearchParams } from "next/navigation";
import { PainelView, type Etapa } from "@/components/painel";
import { ehMei } from "@/lib/regime";

/**
 * N21 · PAINEL (andamento) — shell APP · spec T20.
 * Mock pra farol: documentação feita (índice 0), análise de viabilidade
 * girando (índice 1). ⚠️ 29/07: os índices mudaram — a lista de `ETAPAS`
 * caiu de 4 pra 3 (ver `components/painel.tsx`).
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

  return <PainelView concluidas={1} emAndamento={1} socios={1} />;
}
