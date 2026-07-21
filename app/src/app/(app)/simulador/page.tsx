"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FISCAL,
  FAIXA_MEDIA,
  proLaboreOtimo,
  naBorda,
  custoProLabore,
  brl,
} from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N18 — SIMULADOR  ·  TELA-FAROL "muito complexa" (shell: APP, dentro)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/reordenacao-flow-cobranca-cedo.md (N18)
 * Motor: execucao/motor-testes/flow-schema.js → b2.simulador
 *
 * É o clímax do produto e a tela mais difícil que existe. Se o DS aguenta ela,
 * aguenta o resto.
 *
 * ⚠️ REGRA QUE MANDA AQUI (spec T14): a palavra "Fator R" NÃO APARECE pro
 * leigo. Traduz pra "quanto você se paga" e "quanto economiza", sempre em R$.
 * Zero jargão é UNIVERSAL (UX-48), não modo leigo.
 *
 * O que esta tela carrega, e por quê:
 *   · UX-39 — pró-labore ótimo mira 30%, NÃO crava 28%, e avisa quem está na
 *     borda. (A auditoria de 16/07 achou que o motor fazia o oposto do que a
 *     spec mandava, por 1 constante.)
 *   · UX-24 — o custo CONSOME o CLT do N11. "As duas telas não podem ser ilhas."
 *   · UX-25 — 🚧 PLACEHOLDER TRAVADO: estrutura de card POR SÓCIO, renderizando
 *     1 card no caso solo. O layout já aguenta 2, então o item entra sem
 *     retrabalho quando for decidido.
 *   · UX-47 — memória de cálculo + "e se?" em EXPANDER default fechado.
 *     Auto-seleção por comportamento: o leigo nem vê, o avançado abre.
 *   · UX-26 — carimbo de estimativa OBRIGATÓRIO.
 *   · UX-51 — o veredito contra o teaser do N5. Modo `fator-r` promete FAIXA
 *     (que inclui R$0), então cair no piso não é promessa quebrada: a faixa
 *     avisou.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Viria do estado do wizard (N4). Mock pra farol.
const FAIXA = "10-20k";
const SOCIOS = [{ nome: "Você", cltRemuneracao: 0 }];

export default function SimuladorPage() {
  const fat = FAIXA_MEDIA[FAIXA];
  const otimo = proLaboreOtimo(fat);
  const [proLabore, setProLabore] = useState<number>(FISCAL.SALARIO_MIN);
  const [abriuConta, setAbriuConta] = useState(false);

  const calc = useMemo(() => {
    const folhaPct = proLabore / fat;
    const emIII = folhaPct >= FISCAL.FATOR_R_LIMIAR;
    const aliquota = emIII ? FISCAL.ANEXO_III : FISCAL.ANEXO_V;
    const imposto = Math.round(aliquota * fat);
    const impostoSeV = Math.round(FISCAL.ANEXO_V * fat);
    const economia = impostoSeV - imposto;
    return {
      folhaPct,
      emIII,
      aliquota,
      imposto,
      economia,
      borda: naBorda(folhaPct),
    };
  }, [proLabore, fat]);

  const custo = custoProLabore(proLabore, SOCIOS[0].cltRemuneracao);
  const irrfZero = proLabore <= FISCAL.IRRF_ISENCAO;

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Seu enquadramento</p>
      </header>

      <main className="app-main">
        {/* Título/subtítulo FIXOS (padrão do N4): não rolam com o corpo. */}
        <div className="shrink-0">
          <h1 className="text-h1 mb-2">Quanto você se paga?</h1>
          <p className="text-body text-text-secondary mb-4">
            Esse número decide quanto de imposto a empresa paga. Mexe no botão e
            veja.
          </p>
        </div>

        {/* Corpo ROLÁVEL: conteúdo alto rola por dentro; título fica de fora
            (fixo) e o CTA fixo no rodapé. Scrollbar escondida no mobile. */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ───── O NÚMERO GRANDE — arquétipo A3 (argumento/prova) ─────
              Sempre em R$. "Anexo III/V" nunca aparece cru. */}
          <Card tom="marca" className="mb-4">
            <p className="text-caption text-text-secondary mb-1">
              Você economiza por mês
            </p>
            <p className="text-display text-text-primary">
              {calc.economia > 0 ? brl(calc.economia) : brl(0)}
            </p>
            <p className="text-caption text-text-secondary mt-1">
              Imposto: {brl(calc.imposto)} por mês
            </p>

            {/* UX-26: carimbo obrigatório. Tem dinheiro em cima da promessa. */}
            <p className="text-micro text-text-tertiary mt-3">
              Estimativa. A gente confirma com o contador antes de registrar.
            </p>
          </Card>

          {/* ───── O CONTROLE ───── */}
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-body-strong font-semibold">
              {brl(proLabore)}
            </span>
            <span className="text-caption text-text-tertiary">por mês</span>
          </div>
          <input
            type="range"
            min={FISCAL.SALARIO_MIN}
            max={Math.round(fat * 0.5)}
            step={50}
            value={proLabore}
            onChange={(e) => setProLabore(Number(e.target.value))}
            aria-label="Quanto você se paga por mês"
            className="w-full accent-[var(--color-action-primary)]"
          />

          {/* Recomendação: mira 30%, com colchão (UX-39) */}
          <button
            onClick={() => setProLabore(otimo)}
            className="mt-3 w-full rounded-md border border-border-hairline
                       bg-surface-card p-3 text-left transition-colors
                       hover:border-border-strong"
          >
            <p className="text-caption font-semibold text-text-primary">
              Nossa sugestão: {brl(otimo)}
            </p>
            <p className="text-micro text-text-tertiary mt-0.5">
              Toca pra usar. É o que te coloca no imposto menor com uma folga de
              segurança.
            </p>
          </button>

          {/* ───── UX-39: o aviso de borda ─────
              Quem está entre 28% e 30% está tecnicamente no imposto menor, mas
              um mês de folha atrasada joga pro maior no ANO INTEIRO.
              ⚠️ warning, nunca coral: coral não é erro nem alerta. */}
          {calc.borda && (
            <div className="mt-4 rounded-md bg-state-warning-tint p-3">
              <p className="text-caption font-semibold text-state-warning-text mb-0.5">
                Você está encostado no limite
              </p>
              <p className="text-micro text-text-secondary">
                Um mês em que você se pagar menos, ou pagar atrasado, joga a
                empresa pro imposto maior no ano inteiro. A nossa sugestão deixa
                uma folga.
              </p>
            </div>
          )}

          {/* ───── UX-25 (PLACEHOLDER TRAVADO) — custo POR SÓCIO ─────
              Renderiza 1 card no caso solo, mas a estrutura já é lista. Quando
              o item for decidido, entra sem mexer no layout. "O medo real da
              sociedade é não saber o custo de CADA UM." */}
          <div className="mt-6">
            <p className="text-body-strong font-semibold mb-2">O que isso custa</p>
            <div className="flex flex-col gap-2">
              {SOCIOS.map((s) => (
                <Card key={s.nome}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-caption font-semibold">{s.nome}</span>
                    <span className="text-body-strong font-semibold">
                      {brl(custo.inss)}
                    </span>
                  </div>
                  {/* UX-24: a nota vem do CLT declarado no N11, não de um cálculo cego */}
                  <p className="text-micro text-text-tertiary">{custo.nota}</p>
                  {irrfZero && (
                    <p className="text-micro text-state-success-text mt-1">
                      Sem imposto de renda nesse valor.
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* ───── UX-47: memória de cálculo, expander DEFAULT FECHADO ─────
              Não é "modo avançado": é profundidade sob demanda, pra todos
              (UX-48). O leigo nem vê; quem desconfia de caixa-preta, abre. */}
          <details
            className="mt-6 rounded-md border border-border-hairline bg-surface-card"
            onToggle={(e) => setAbriuConta((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer list-none p-4 text-caption font-semibold text-text-secondary">
              {abriuConta ? "Esconder a conta" : "Ver a conta"}
            </summary>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <Linha label="Você fatura (estimado)" valor={brl(fat)} />
              <Linha label="Você se paga" valor={brl(proLabore)} />
              <Linha
                label="Isso dá, do que você fatura"
                valor={`${(calc.folhaPct * 100).toFixed(1)}%`}
              />
              <Linha
                label="A partir de 28%, o imposto cai"
                valor={calc.emIII ? "você está dentro" : "você está fora"}
              />
              <div className="border-t border-border-hairline pt-2 mt-1">
                <Linha
                  label="Imposto sobre o faturamento"
                  valor={`${(calc.aliquota * 100).toFixed(1)}% = ${brl(calc.imposto)}`}
                  forte
                />
              </div>
            </div>
          </details>
        </div>

        <div className="app-footer-cta">
          <Button full>Continuar</Button>
        </div>
      </main>
    </>
  );
}

function Linha({
  label,
  valor,
  forte = false,
}: {
  label: string;
  valor: string;
  forte?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-micro text-text-tertiary">{label}</span>
      <span
        className={`text-caption ${forte ? "font-semibold text-text-primary" : "text-text-secondary"}`}
      >
        {valor}
      </span>
    </div>
  );
}
