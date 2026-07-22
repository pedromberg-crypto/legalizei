"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  NexoShell,
  GridAcoes,
  CardDestaque,
  DADOS,
  IconeEmitir,
  IconeImposto,
  IconeProLabore,
  IconeNotas,
} from "@/components/lab/nexo-shell";

/**
 * INÍCIO — VERSÃO 2 (dashboard-first) · exploração de layout.
 * Mesma casca nexo, mas os 4 NÚMEROS DE DECISÃO são o herói (2×2 no topo, como
 * o card de câmbio do print, só que expandido) → depois o foco → depois um grid
 * de ações menor (4). Aposta: o dono abre o app pra DECIDIR (cresci? pago
 * quanto? teto? alíquota?), não só pra agir.
 */
export default function InicioV2() {
  return (
    <NexoShell titulo={`Bom te ver, ${DADOS.primeiroNome}`}>
      {/* Herói: os 4 números, 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        <Stat rotulo="Faturou no mês" valor={DADOS.faturamentoMes} sub={DADOS.faturamento12m} />
        <Stat rotulo="Uso do teto" valor={DADOS.tetoUsado} sub={DADOS.tetoLivre} />
        <Stat rotulo="Imposto de julho" valor={DADOS.impostoEstimado} sub="Estimativa do mês" />
        <Stat
          rotulo="Sua alíquota"
          valor={DADOS.aliquota}
          sub={
            <span className="font-semibold text-state-success-text">A menor possível</span>
          }
        />
      </div>

      {/* Foco (a obrigação a pagar) */}
      <CardDestaque>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-caption text-text-secondary">{DADOS.foco.vence}</p>
            <p className="text-body font-semibold text-text-primary mt-0.5">
              {DADOS.foco.titulo} · {DADOS.foco.valor}
            </p>
          </div>
          <Button variant="primarySm">Pagar</Button>
        </div>
      </CardDestaque>

      {/* Ações principais (4) */}
      <GridAcoes
        acoes={[
          { label: "Emitir NF-e", Icone: IconeEmitir },
          { label: "Pagar imposto", Icone: IconeImposto },
          { label: "Meu pró-labore", Icone: IconeProLabore },
          { label: "Minhas notas", Icone: IconeNotas },
        ]}
      />
    </NexoShell>
  );
}

function Stat({
  rotulo,
  valor,
  sub,
}: {
  rotulo: string;
  valor: string;
  sub: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-3">
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="text-h2 text-text-primary mt-1">{valor}</p>
      <p className="text-micro text-text-secondary mt-0.5">{sub}</p>
    </div>
  );
}
