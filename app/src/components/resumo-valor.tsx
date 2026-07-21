"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FISCAL, FAIXA_MEDIA, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N5' — RESUMO DE VALOR · shell WIZARD (pré-pagamento) · arquétipo A5 (recap)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: reordenacao-cluster-fiscal-encaixe.md → N5 = opção B.
 *
 * O que sobrou do antigo N5 teaser depois que a prova de economia migrou pro
 * ENCAIXE. Aqui NÃO se promete economia: vende SEGURANÇA. Um respiro de valor
 * pós-faixa, antes do dinheiro. Número SUAVE, faixa-based, com carimbo.
 *
 * ⚠️ O imposto é a alíquota de ENTRADA (Anexo III) sobre a mediana da faixa —
 * o melhor caso realista. O carimbo diz que varia conforme o pró-labore (o
 * fator-r é o assunto do N18, pós-pago). Prometer resultado cravado aqui seria
 * a `promessa-quebrada` que a opção B existe pra evitar.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ResumoValorView({
  faixaId,
  faixaLabel,
  onSeguir,
}: {
  faixaId: keyof typeof FAIXA_MEDIA;
  faixaLabel: string;
  onSeguir?: () => void;
}) {
  const fat = FAIXA_MEDIA[faixaId];
  const impostoMes = Math.round(FISCAL.ANEXO_III * fat);

  return (
    <>
      <div className="shrink-0">
        <h1 className="text-h1 mb-1">O que te espera no imposto</h1>
        <p className="text-body text-text-secondary mb-4">
          Faturando {faixaLabel}. E a gente cuida de guias, prazos e notas.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Card tom="marca">
          <p className="text-caption text-text-secondary mb-1">
            Seu imposto por mês fica por volta de
          </p>
          <p className="text-display text-text-primary">{brl(impostoMes)}</p>
          <p className="text-micro text-text-tertiary mt-3">
            Estimativa pela sua faixa. Pode variar conforme quanto você se paga,
            e a gente calcula com você depois de abrir.
          </p>
        </Card>

        <div className="mt-4 rounded-md bg-state-info-tint p-4">
          <p className="text-caption font-semibold text-state-info-text mb-1">
            Sem pegadinha
          </p>
          <p className="text-caption text-text-secondary">
            Você só paga quando decidir abrir, e a conta exata a gente fecha
            junto com você.
          </p>
        </div>
      </div>

      <div className="app-footer-cta">
        <Button full onClick={onSeguir}>
          Quero abrir minha empresa
        </Button>
      </div>
    </>
  );
}
