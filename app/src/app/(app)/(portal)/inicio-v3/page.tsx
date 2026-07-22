"use client";

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
 * INÍCIO — VERSÃO 3 (número no header) · exploração de layout.
 * O print do nexobank não põe dado no header — a gente TESTA por lá: o "pulso"
 * do negócio (você está em dia + faturamento do mês) mora DENTRO do header
 * escuro, como o saldo de um banco. O sheet branco fica só com foco + ações +
 * vencimentos. Aposta: a 1ª coisa que o dono quer é o alívio ("tá tudo certo?").
 */
export default function InicioV3() {
  return (
    <NexoShell
      titulo={`Bom te ver, ${DADOS.primeiroNome}`}
      headerExtra={
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-state-success text-text-on-dark">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="m6 12 4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-caption text-text-on-dark/80">Você está em dia</p>
          </div>
          <p className="text-micro text-text-on-dark/60 mt-3">Faturou no mês</p>
          <p className="text-display font-bold">{DADOS.faturamentoMes}</p>
          <p className="text-micro text-text-on-dark/60">{DADOS.faturamento12m}</p>
        </div>
      }
    >
      {/* Foco */}
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

      {/* Ações */}
      <GridAcoes
        acoes={[
          { label: "Emitir NF-e", Icone: IconeEmitir },
          { label: "Pagar imposto", Icone: IconeImposto },
          { label: "Meu pró-labore", Icone: IconeProLabore },
          { label: "Minhas notas", Icone: IconeNotas },
        ]}
      />

      {/* Próximos vencimentos */}
      <div>
        <p className="text-body-strong font-semibold text-text-primary mb-2">
          Próximos vencimentos
        </p>
        <div className="flex items-center justify-between rounded-2xl border border-border-hairline bg-surface-card p-3">
          <div>
            <p className="text-caption font-semibold text-text-primary">DAS de julho</p>
            <p className="text-micro text-text-tertiary mt-0.5">Vence 20/08</p>
          </div>
          <p className="text-caption text-text-secondary">{DADOS.impostoEstimado}</p>
        </div>
      </div>
    </NexoShell>
  );
}
