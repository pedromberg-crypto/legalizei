"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N7 — A CONTA DA ABERTURA · REDESIGN v2 CONTIDO (28/07) — PREVIEW.
 * ═══════════════════════════════════════════════════════════════════════════
 * Cópia funcional de /plano (mesmo mock, mesmos 2 cenários). Ajuste pontual:
 *   · o bloco da taxa da Junta (única parte fora do Card do DS) → rounded-2xl
 *     (era rounded-md). Os 2 heróis (Grátis/Mensalidade) usam o Card do DS,
 *     não tocado — e a hierarquia deles é decisão documentada (2ª rodada
 *     19/07), não mexida aqui. Layout, cor e copy idênticos.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PlanoV2Page() {
  const searchParams = useSearchParams();
  const empresaPaga = searchParams.get("cenario") === "empresa-paga";
  const hoje = empresaPaga ? CUSTOS.MENSALIDADE : CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="A conta da abertura" semVoltar />
      <main className="app-main">
        <Titulo sub="Tudo que você vai pagar, num lugar só. Sem letra miúda depois.">
          Quanto custa abrir
        </Titulo>

        <Corpo>
          <Card tom="sucesso">
            <p className="text-caption text-state-success-text mb-1">Abrir a sua empresa</p>
            <div className="flex items-center gap-2.5">
              <Check />
              <p className="text-display text-state-success-text">Grátis</p>
            </div>
            <p className="text-caption text-text-secondary mt-2">
              Documentos, junta comercial, CNPJ e Simples Nacional. A gente não
              cobra honorário nenhum pra abrir.
            </p>
          </Card>

          <Card>
            <p className="text-caption text-text-secondary mb-1">Depois, todo mês</p>
            <p className="text-display text-text-primary">{brl(CUSTOS.MENSALIDADE)}</p>
            <p className="text-caption text-text-secondary mt-2">
              Suas guias todo mês, notas fiscais, obrigações do governo e
              contador de verdade pra falar. Certificado digital incluso.
            </p>
            <p className="text-micro text-text-tertiary mt-2">a 1ª mensalidade já é o seu 1º mês</p>
          </Card>

          {empresaPaga ? (
            <div className="rounded-2xl border border-border-hairline bg-surface-tint-brand p-4">
              <p className="text-body font-semibold text-text-primary">Taxa da Junta Comercial — por nossa conta</p>
              <p className="text-caption text-text-secondary mt-1">
                Diferente da maioria, a gente cobre essa taxa pra você. Não
                entra na sua conta.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-body font-semibold text-text-primary">Taxa da Junta Comercial</p>
                <span className="shrink-0 text-body font-semibold text-text-primary">
                  {brl(CUSTOS.DAE_JUCEMG, true)}
                </span>
              </div>
              <p className="text-caption text-text-secondary mt-1">
                Cobrada uma vez, e vai direto pro Estado: a gente não fica com
                nada. Você pagaria essa taxa abrindo com qualquer um.
              </p>
            </div>
          )}
        </Corpo>

        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">{brl(hoje, true)}</span>
          </div>
          <Button full>Continuar</Button>
        </Rodape>
      </main>
    </>
  );
}

function Check() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0 text-state-success" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="m7.5 12.4 3.1 3.1 6-6.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
