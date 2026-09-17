"use client";

import Image from "next/image";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CARD DE ÍCONE — o gesto "escolha um destes" do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro: *"traga os layouts de ME aprovados"*).
 *
 * Reproduz o `CardIconeSelecao` que o caminho ME usa desde 29/08 no E3.2
 * (MEI×ME) e, desde 01/09, também no E9 (forma de pagamento) e nas faixas do
 * E5F. A anatomia é a validada lá: cartão quadrado com quina de 16px, ícone 3D
 * grande no topo, rótulo embaixo, e — quando selecionado — o cartão INTEIRO
 * vira coral com um badge de check branco na quina superior direita.
 *
 * ⚠️ POR QUE REESCRITO E NÃO IMPORTADO. A trava
 * `produto/_flow/verificar-fronteira-mei.mjs` proíbe o ramo MEI de importar
 * tela de ME, e o `CardIconeSelecao` mora em `gate-telas.tsx`. Foi essa
 * herança que fez o MEI acumular 4 defeitos em 8 dias sem ninguém tocar nele.
 * O que se herda aqui é o DESENHO, com os mesmos tokens.
 *
 * 🎯 O par coral/creme não é capricho: o cartão selecionado inverte o fundo,
 * e um ícone só sobreviveria a uma das duas versões. Por isso todo ícone do
 * sistema tem os dois arquivos.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function CardIconeMei({
  label,
  iconeCoral,
  iconeCreme,
  selecionado,
  onClick,
  tamanho = 58,
}: {
  label: string;
  iconeCoral: string;
  iconeCreme: string;
  selecionado: boolean;
  onClick: () => void;
  tamanho?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionado}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors
        ${
          selecionado
            ? "border-action-primary bg-action-primary"
            : "border-border-hairline bg-surface-card hover:border-border-strong"
        }`}
    >
      {selecionado && <CheckBadge />}
      <Image
        src={selecionado ? iconeCreme : iconeCoral}
        alt=""
        width={tamanho}
        height={tamanho}
        aria-hidden
      />
      <span
        className={`text-body font-semibold ${
          selecionado ? "text-text-on-brand" : "text-text-primary"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/** O check branco na quina, que confirma a escolha sem depender só da cor. */
function CheckBadge() {
  return (
    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-action-primary-sm">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m5 12 4 4 8-9" />
      </svg>
    </span>
  );
}

/**
 * O selo de bloco completo, na quina do card de formulário.
 *
 * 🧪 Nasceu num teste do Pedro em 01/09, no E9: em vez de a pessoa descobrir o
 * que falta só quando o CTA não habilita, ela vê o formulário FECHANDO bloco a
 * bloco. A borda do card vira verde junto (`state-success`, o traço do check —
 * o tint testado ficou apagado demais num fio de 1px).
 *
 * ⚠️ A regra que acende o selo tem que ser a MESMA que libera o CTA. Selo verde
 * com campo obrigatório vazio vira mentira, e o botão segue travado sem
 * explicação.
 */
export function SeloOkMei() {
  return (
    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-state-success text-white">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m5 12 4 4 8-9" />
      </svg>
    </span>
  );
}
