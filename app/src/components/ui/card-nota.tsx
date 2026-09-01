import type { ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CardNota — o cartão de nota com ícone-círculo, agora em 3 humores
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — o cartão de check verde (nascido no E3.2/E5T,
 * 29/08: "mesmo padrão visual do card de check-list, não mais um bloco de
 * aviso solto") ganha as variações que faltavam. A REGRA do pedido: entre as
 * variantes muda SÓ o ícone/cor — o resto do cartão (borda hairline, fundo de
 * card, tipografia) é idêntico, senão viram 3 componentes diferentes.
 *
 *   · positivo — círculo verde-claro, check verde (o visual já existente).
 *   · atencao  — círculo amarelo ESCURO (token `state-warning-text`, o 700 da
 *                escala), "!" branco.
 *   · negativo — círculo vermelho ESCURO (`state-danger-text`), "X" branco.
 *
 * Diferença pro `Aviso` (ui/tela.tsx): o Aviso é um BLOCO tingido inteiro
 * (fundo colorido, título colorido) — grita. O CardNota é neutro com um ponto
 * de cor — informa sem dominar a tela. O E3.4 é o 1º lugar onde a troca foi
 * aplicada (aviso do apartamento), a pedido.
 */

export type VarianteCardNota = "positivo" | "atencao" | "negativo";

const ICONE: Record<VarianteCardNota, { classe: string; glifo: ReactNode }> = {
  positivo: {
    classe: "bg-state-success-tint text-state-success-text",
    glifo: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12 4 4 8-9" />
      </svg>
    ),
  },
  atencao: {
    // 🔄 01/09 (2ª rodada) — o warning-700 do DS (#98600A) ficou forte/terroso
    // demais; o Pedro escolheu o tom no olho, por amostra. Hex direto, com
    // registro: se a cor entrar em mais lugares, promove pra token da paleta.
    classe: "bg-[#E7BF11] text-white",
    glifo: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden>
        <path d="M12 5v9" />
        <path d="M12 18.5v.01" />
      </svg>
    ),
  },
  negativo: {
    // Mesma rodada: vermelho por amostra do Pedro (puxado pro laranja-tijolo,
    // vizinho do coral da marca, não o danger-700 vinho do DS).
    classe: "bg-[#D84315] text-white",
    glifo: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </svg>
    ),
  },
};

export function CardNota({
  variante = "positivo",
  titulo,
  children,
}: {
  variante?: VarianteCardNota;
  /** Opcional: 1ª linha do cartão, no estilo do card de checklist do E3.2 (body-strong bold). */
  titulo?: string;
  children: ReactNode;
}) {
  const icone = ICONE[variante];
  return (
    <div className="rounded-md border border-border-hairline bg-surface-card p-4">
      {/* 🔄 01/09 (2ª rodada, pedido do Pedro) — padronizado com o card de
          checklist do regime (E3.2, "ME · Simples Nacional"): o título sai da
          coluna ao lado do ícone e vira a 1ª linha do cartão, no MESMO estilo
          de lá (body-strong bold); o ícone fica alinhado com a mensagem, como
          os checks ficam alinhados com cada item. Um cartão, uma gramática. */}
      {titulo && (
        <p className="text-body-strong font-bold text-text-primary mb-2">{titulo}</p>
      )}
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${icone.classe}`}
        >
          {icone.glifo}
        </span>
        <p className="text-caption text-text-secondary">{children}</p>
      </div>
    </div>
  );
}
