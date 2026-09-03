"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N7 — A CONTA DA ABERTURA · REDESIGN v2 ROBUSTO (28/07) — PREVIEW.
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmã do /plano-v2 (ajuste contido). Os 2 heróis (Grátis/Mensalidade) NÃO
 * mudam — a hierarquia deles é decisão documentada (2ª rodada 19/07: "o
 * maior número precisa ser o melhor argumento"); repetir aqui um padrão do
 * acervo (ex: par de stat cards do Encaixe) desfaria essa decisão de
 * propósito, então preservei. O redesign vai na linha da TAXA — a única
 * parte "operacional" da tela:
 *   · ganha ícone-chip (prédio/órgão, idioma de GuiasRecentes) reforçando
 *     visualmente "isso é repasse, não nossa margem".
 *   · no cenário `empresa-paga`, ganha um BADGE coral "Por nossa conta"
 *     (idioma da tag do AprendaGradiente) em vez de só texto.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PlanoV2RobustoPage() {
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
            <div className="flex items-start gap-3 rounded-2xl border border-border-hairline bg-surface-tint-brand p-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-action-primary-sm">
                <IconePredio />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-body font-semibold text-text-primary">Taxa da Junta Comercial</p>
                  <span className="rounded-full bg-action-primary px-2.5 py-0.5 text-micro font-bold text-text-on-brand">
                    Por nossa conta
                  </span>
                </div>
                <p className="text-caption text-text-secondary mt-1">
                  Diferente da maioria, a gente cobre essa taxa pra você. Não
                  entra na sua conta.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
                <IconePredio />
              </span>
              <div className="min-w-0 flex-1">
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

function IconePredio() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
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
