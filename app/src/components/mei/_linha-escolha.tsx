"use client";

import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LINHA SELECIONÁVEL — o átomo de escolha do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, promovido na hora em que bateu a 3ª superfície (regra dos 3, a
 * mesma que promoveu o `ui/tela.tsx` em 19/07): a categoria e a forma de
 * endereço na M1, e a ocupação principal + as secundárias na M7.
 *
 * ─── POR QUE NÃO USAR O `OpcoesColuna` DO DS ────────────────────────────────
 * Porque as 4 listas do ramo MEI precisam de uma **nota por opção**, e o
 * `Opcao<T>` do DS é `{ v, label }` — só rótulo. Acrescentar `sub` lá mexeria
 * num componente que 3 telas de ME usam, e o combinado de 07/09 é não tocar em
 * nada do ME. Quando o DS ganhar a variante com nota, esta linha some e as
 * telas passam a usar a de lá.
 *
 * ⚠️ `apagada` NÃO é `disabled`: a linha continua clicável de propósito. É a
 * decisão de 27/08 sobre as categorias sem MEI — a pessoa clica, lê o motivo e
 * recebe a porta pro ME. Um botão morto só produziria a dúvida "por que não
 * posso clicar?".
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function LinhaEscolha({
  titulo,
  nota,
  selecionada,
  apagada = false,
  onClick,
}: {
  titulo: string;
  nota?: string;
  selecionada: boolean;
  /** Existe, mas não leva a lugar nenhum como MEI. Continua clicável. */
  apagada?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionada}
      className={`flex items-center gap-3 rounded-md border p-3 text-left transition-colors ${
        selecionada
          ? "border-border-focus bg-surface-tint-brand"
          : "border-border-hairline bg-surface-card hover:bg-surface-alt"
      } ${apagada ? "opacity-55" : ""}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-body text-text-primary">{titulo}</span>
        {nota && (
          <span className="block text-micro text-text-tertiary">{nota}</span>
        )}
      </span>
      {selecionada && !apagada && (
        <span className="shrink-0">
          <StatusIcon estado="feito" />
        </span>
      )}
    </button>
  );
}
