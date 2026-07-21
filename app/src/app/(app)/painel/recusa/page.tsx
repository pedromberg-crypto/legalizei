"use client";

import { PainelView } from "@/components/painel";

/**
 * REC · RECUSA DE ÓRGÃO — o 4º estado do painel (UX-40) · shell APP.
 * Motor: persona `erro-orgao` (nome reprovado na JUCEMG apesar da prévia).
 *
 * Mock pra farol: o registro na Junta (etapa 2) volta com o nome recusado. É o
 * caso testado no motor — a prévia de viabilidade não garante o registro, e a
 * recuperação acontece DENTRO do pipeline, não num beco separado.
 */
export default function RecusaPage() {
  return (
    <PainelView
      concluidas={2}
      emAndamento={2}
      socios={1}
      recusa={{
        etapa: 2,
        titulo: "O nome não passou na Junta",
        motivo:
          "Outra empresa registrou um nome muito parecido depois da nossa prévia. É comum e tem conserto: a gente já separou 3 variações livres pra você escolher.",
        acao: "Escolher outro nome",
      }}
    />
  );
}
