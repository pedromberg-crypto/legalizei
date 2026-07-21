"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N5 — TEASER  ·  arquétipo A3 (Número / prova) · shell WIZARD (antes do pago)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: reordenacao-flow-cobranca-cedo.md §2 (UX-51) · vem logo após o N4.
 *
 * É O PILAR da reordenação. Sem ele a gente cobra cedo sem argumento e vira
 * commodity com passos a mais. Com ele, entrega a **prova** (existe economia,
 * é crível) sem entregar o **produto** (número exato, dossiê, PDF).
 *
 * ─── OS 3 MODOS NÃO TÊM O MESMO GRAU DE CERTEZA (UX-51) ───────────────────
 *   · `swap`    — há família de CNAE → **número fechado**. Depende só do
 *                 código, e o código a gente já sabe desde o N4.
 *   · `fator-r` — Anexo V sem swap → **FAIXA que começa em R$ 0**. Depende da
 *                 MARGEM do cliente, que a gente não sabe aqui. Como a faixa
 *                 inclui zero, **não há piso a violar**: a `promessa-quebrada`
 *                 (fatura alto, subcontrata, sobra pouco) deixa de ser risco
 *                 estrutural e vira teste de invariância.
 *   · `servico` — Anexo III direto → **sem número** (UX-49). Não existe
 *                 alavanca fiscal a puxar; prometer economia aqui seria mentir.
 *
 * ⚠️ A palavra "Fator R" NÃO aparece. Vira "quanto você consegue se pagar".
 * ⚠️ Carimbo de estimativa é OBRIGATÓRIO onde há número (UX-26).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ModoTeaser = "swap" | "fator-r" | "servico";

export interface DadosTeaser {
  modo: ModoTeaser;
  /** Nome humano da atividade, herdado do N4. */
  atividade: string;
  /** Rótulo da faixa de faturamento escolhida no N4 (ex: "R$ 10 a 20 mil"). */
  faixa: string;
  /** `swap`: economia fechada por mês. `fator-r`: TETO da faixa (piso = 0). */
  valor?: number;
}

export function TeaserView({ t, onSeguir }: { t: DadosTeaser; onSeguir?: () => void }) {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Sua economia</p>
      </header>

      <main className="app-main">
        <div className="shrink-0">
          <h1 className="text-h1 mb-2">
            {t.modo === "servico"
              ? "Boa notícia sobre o seu imposto"
              : "Dá pra pagar menos imposto"}
          </h1>
          <p className="text-body text-text-secondary mb-5">
            {t.atividade} · faturando {t.faixa}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {t.modo === "swap" && <Swap valor={t.valor ?? 0} />}
          {t.modo === "fator-r" && <FatorR teto={t.valor ?? 0} />}
          {t.modo === "servico" && <Servico />}
        </div>

        <div className="app-footer-cta">
          <Button full onClick={onSeguir}>
            Quero abrir minha empresa
          </Button>
        </div>
      </main>
    </>
  );
}

/* ─── MODO SWAP — número FECHADO ───────────────────────────────────────────
   O único modo que pode cravar um número, porque a economia vem da troca de
   código e o código já é conhecido. Não depende da margem do cliente. */
function Swap({ valor }: { valor: number }) {
  return (
    <>
      <Card tom="marca" className="mb-4">
        <p className="text-caption text-text-secondary mb-1">
          Você economiza por mês
        </p>
        {/* O NÚMERO GRANDE — sempre em R$, nunca "Anexo III/V" cru. */}
        <p className="text-display text-text-primary">{brl(valor)}</p>
        <p className="text-caption text-text-secondary mt-1">
          {brl(valor * 12)} por ano
        </p>
        <p className="text-micro text-text-tertiary mt-3">
          É uma estimativa. O número exato a gente fecha com o contador.
        </p>
      </Card>

      <p className="text-body font-semibold text-text-primary mb-1">
        Como isso é possível
      </p>
      <p className="text-body text-text-secondary mb-4">
        Existe mais de um código oficial que cobre exatamente o que você faz, e
        eles pagam impostos diferentes. A gente abre a sua empresa já no mais
        barato dos que servem pra você.
      </p>

      {/* Guard-rail de honestidade: sem isto, o leigo acha que é malandragem. */}
      <div className="rounded-md bg-state-info-tint p-4">
        <p className="text-caption font-semibold text-state-info-text mb-1">
          Não é malandragem
        </p>
        <p className="text-caption text-text-secondary">
          Os dois códigos emitem a mesma nota fiscal pra sua atividade. Escolher
          o mais barato é o que um bom contador faz.
        </p>
      </div>
    </>
  );
}

/* ─── MODO FATOR R — FAIXA que começa em ZERO ──────────────────────────────
   A honestidade aqui é estrutural, não estética: a economia depende de quanto
   o cliente consegue se pagar, e isso depende da MARGEM dele (quem subcontrata
   e fica com pouco não alcança). Mostrar a faixa com o piso R$0 é o que impede
   a promessa quebrada. */
function FatorR({ teto }: { teto: number }) {
  return (
    <>
      <Card tom="marca" className="mb-4">
        <p className="text-caption text-text-secondary mb-1">
          Você pode economizar por mês
        </p>
        <p className="text-display text-text-primary">
          {brl(0)} a {brl(teto)}
        </p>
        <p className="text-caption text-text-secondary mt-1">
          Depende de quanto você consegue se pagar por mês
        </p>
        <p className="text-micro text-text-tertiary mt-3">
          Estimativa. A gente calcula o seu caso com você, com os seus números.
        </p>
      </Card>

      {/* É AQUI que a bandeira se prova: mostramos o piso R$0, que é
          exatamente o que um concorrente esconderia. */}
      <div className="mb-4">
        <span className="inline-flex rounded-full bg-surface-tint-brand px-2.5 py-1 text-micro font-semibold text-text-primary">
          A conta inteira, sem asterisco
        </span>
      </div>

      <p className="text-body font-semibold text-text-primary mb-1">
        Por que começa em zero
      </p>
      <p className="text-body text-text-secondary mb-4">
        Para pagar menos, a empresa precisa te pagar um salário mensal a partir
        de um certo valor. Quem tem margem folgada consegue e economiza o teto
        da faixa. Quem repassa boa parte do que fatura pode não conseguir, e aí
        a economia é zero. Não vamos prometer um número que talvez não seja o
        seu.
      </p>

      <div className="rounded-md bg-state-info-tint p-4">
        <p className="text-caption font-semibold text-state-info-text mb-1">
          A gente calcula isso com você
        </p>
        <p className="text-caption text-text-secondary">
          Depois de abrir, você mexe no valor e vê o imposto mudar na hora,
          antes de decidir qualquer coisa.
        </p>
      </div>
    </>
  );
}

/* ─── MODO SERVIÇO — SEM número (UX-49) ────────────────────────────────────
   A atividade já cai na tabela mais barata: não existe alavanca a puxar.
   Inventar economia aqui seria criar dívida sem lastro. O valor da proposta
   muda de "pagar menos" para "abrir certo e não ter dor de cabeça". */
function Servico() {
  return (
    <>
      <Card tom="marca" className="mb-4">
        <p className="text-body font-semibold text-text-primary mb-1">
          Sua atividade já entra na tabela mais barata do Simples
        </p>
        <p className="text-body text-text-secondary">
          Não tem truque fiscal a fazer no seu caso, e a gente não vai inventar
          um pra te vender.
        </p>
      </Card>

      <p className="text-body font-semibold text-text-primary mb-1">
        Então o que a gente faz por você
      </p>
      <p className="text-body text-text-secondary mb-4">
        Abre a empresa no enquadramento certo desde o primeiro dia, cuida das
        guias todo mês e avisa antes de qualquer vencimento. O que costuma
        custar caro não é o imposto: é errar o enquadramento, perder prazo e
        pagar multa.
      </p>

      <div className="rounded-md bg-state-info-tint p-4">
        <p className="text-caption font-semibold text-state-info-text mb-1">
          A conta muda se você crescer
        </p>
        <p className="text-caption text-text-secondary">
          Conforme o faturamento sobe, aparecem escolhas que mudam o imposto. Aí
          a gente te avisa, sem você precisar perguntar.
        </p>
      </div>
    </>
  );
}
