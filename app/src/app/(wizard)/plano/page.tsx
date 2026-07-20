import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N7 — A CONTA DA ABERTURA + PLANO · arquétipo A5 (Recap) · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Telas 16+17, FUNDIDAS (UX-33)
 *
 * Antes de pedir dinheiro, **fechar a conta na cara do cliente**. Hoje os
 * custos vivem espalhados (taxa de governo no B4, certificado no fim,
 * mensalidade no plano) e o cliente monta a soma na cabeça, errado, com medo.
 * Um lugar só, em R$, mata a ansiedade de "quanto isso vai me custar DE VERDADE".
 *
 * ─── OS 3 BALDES, E POR QUE ELES NÃO PODEM SE MISTURAR ────────────────────
 *   1. **O que é grátis** — honorário de abertura = R$0.
 *   2. **Taxas de governo** — passam direto, NÃO são nossa margem.
 *   3. **O que é recorrente** — a mensalidade.
 *
 * ⚠️ **Nunca esconder o repasse de governo dentro do preço.** A regra existe
 * porque "abertura grátis" sem essa distinção vira pegadinha lá no N20, quando
 * a taxa aparece. Dizer que grátis = **honorário zero, não governo zero** é o
 * que compra o direito de usar a palavra "grátis" — e isso mora colado na
 * linha da taxa, não num aviso à parte repetindo o mesmo argumento.
 *
 * ─── 🏆 HIERARQUIA (2ª rodada, 19/07) — QUEM MERECE SER GRANDE ────────────
 * Achado do Pedro: **o maior número da tela era o que mais assusta.** O
 * R$463,51 estava em `text-display` enquanto "Grátis" (nosso único
 * diferencial) e a mensalidade (o que ele de fato compra) empatavam numa
 * linha de lista.
 *
 * Pior: **R$463,51 é uma soma artificial.** Junta um repasse de terceiro
 * (uma vez, não é nosso) com uma mensalidade (recorrente, é nosso), só porque
 * saem do cartão no mesmo dia. Como argumento ele não existe — é operacional.
 *
 * A tela responde "quanto custa?" com DUAS respostas, não três:
 *   1. **Abrir = Grátis** → `text-display` VERDE + check + fundo `sucesso`.
 *      O herói. Coral-50 deixava o card apagado demais pra promessa mais forte
 *      do produto; o verde é o mesmo que o N18 usa em "sem imposto de renda".
 *   2. **Manter = R$195/mês** → `text-display` neutro. O segundo.
 *   3. Taxa do governo → peso de LINHA. Honesta, sem holofote.
 *   4. Total de hoje → **no rodapé, colado no CTA**: visível e conferível no
 *      instante da decisão, sem ser o maior. Esconder viraria a pegadinha que
 *      esta tela existe pra evitar; agigantar era vender contra si mesmo.
 *
 * ─── ✂️ ENXUGADA (1ª rodada, 19/07) — 8 BLOCOS → 5 ────────────────────────
 * O cliente lia 5 blocos antes de saber quanto pagaria. A pergunta aqui é UMA,
 * então a densidade não vinha do volume: vinha da ORDEM.
 *   · **Expander "ver a conta somada" CORTADO.** Repetia item por item o que
 *     os baldes já listam e somava o que o grid já soma. Foi UX-48 aplicado
 *     por reflexo: profundidade em expander só vale quando há profundidade a
 *     esconder, e a conta já estava aberta na tela.
 *   · **Aviso "o que grátis quer dizer" CORTADO**, fundido na linha da taxa.
 *   · **Recap do topo CORTADO.** Atividade e faixa já foram confirmadas no N4
 *     e repetidas no N5; a terceira vez só ocupava a dobra mais valiosa.
 *     🔴 E ele afirmava a **natureza jurídica** ("SLU"), que só é decidida no
 *     **N15**, depois do pagamento. A tela declarava um fato inexistente —
 *     mesmo resíduo da ordem antiga que o item abaixo documenta.
 *
 * ─── O QUE A REORDENAÇÃO DE 16/07 MUDOU E A SPEC AINDA NÃO SABE ───────────
 * A spec da T16 é de 15/07 e descreve um mundo onde o B2 vinha antes daqui.
 *   · 🔴 O **add-on de endereço fiscal** a spec manda "injetar automático se
 *     veio marcado do B2 (T9)". Impossível: o T9 é o N13, que vem depois do
 *     pagamento. Ele NÃO aparece nesta tela — some da conta, e reaparece como
 *     upsell no N13 cobrado "a partir da 2ª parcela". Isso significa que a
 *     "conta total" desta tela **não é total**: omite um item que o cliente
 *     pode contratar 4 telas adiante. Pendência real de spec, não esquecimento.
 *
 * 💸 O preço é PLACEHOLDER declarado (ver `CUSTOS.MENSALIDADE`). A tela marca
 * isso na cara — número provisório sem aviso é como número sem fonte.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PlanoPage() {
  const hoje = CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="A conta da abertura" />

      <main className="app-main">
        <Titulo sub="Tudo que você vai pagar, num lugar só. Sem letra miúda depois.">
          Quanto custa abrir
        </Titulo>

        <Corpo>
          {/* ═══ HERÓI 1 — O GRÁTIS ═══
              O maior elemento da tela passa a ser o nosso melhor argumento, e
              não o nosso pior. Antes, o R$463,51 (uma soma artificial de duas
              naturezas) era o número grande e o "Grátis" era uma linha de lista
              igual às outras: a tela gritava o que assusta e sussurrava o que
              vende. */}
          <Card tom="sucesso">
            <p className="text-caption text-state-success-text mb-1">
              Abrir a sua empresa
            </p>
            {/* O check ecoa o símbolo da marca (o logo É um check) e o selo
                🟢 do veredito. Aqui ele é verde, não coral: quem fala é o
                estado "isso está resolvido", não a assinatura da marca. */}
            <div className="flex items-center gap-2.5">
              <Check />
              <p className="text-display text-state-success-text">Grátis</p>
            </div>
            <p className="text-caption text-text-secondary mt-2">
              Documentos, junta comercial, CNPJ e Simples Nacional. A gente não
              cobra honorário nenhum pra abrir.
            </p>
          </Card>

          {/* ═══ HERÓI 2 — O QUE ELE DE FATO COMPRA ═══
              Mesmo tamanho de número. Sem o tint, então lê como o segundo. */}
          <Card>
            <p className="text-caption text-text-secondary mb-1">
              Depois, todo mês
            </p>
            <p className="text-display text-text-primary">
              {brl(CUSTOS.MENSALIDADE)}
            </p>
            <p className="text-caption text-text-secondary mt-2">
              Suas guias todo mês, notas fiscais, obrigações do governo e
              contador de verdade pra falar. Certificado digital incluso.
            </p>
            <p className="text-micro text-text-tertiary mt-2">
              a 1ª mensalidade já é o seu 1º mês
            </p>
          </Card>

          {/* ═══ A TAXA — honesta, sem holofote ═══
              Não é nossa e não é argumento de venda, mas escondê-la viraria a
              pegadinha que esta tela existe pra evitar. Fica legível, com a
              explicação colada, em peso de LINHA e não de herói.
              Com centavos porque o cliente confere contra a guia. */}
          <div className="rounded-md border border-border-hairline bg-surface-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body font-semibold text-text-primary">
                Taxa da Junta Comercial
              </p>
              <span className="shrink-0 text-body font-semibold text-text-primary">
                {brl(CUSTOS.DAE_JUCEMG, true)}
              </span>
            </div>
            <p className="text-caption text-text-secondary mt-1">
              Cobrada uma vez, e vai direto pro Estado: a gente não fica com
              nada. Você pagaria essa taxa abrindo com qualquer um.
            </p>
          </div>
        </Corpo>

        {/* ═══ O TOTAL — no rodapé, junto da decisão ═══
            Ele precisa estar VISÍVEL (senão vira pegadinha) e conferível, mas
            não precisa ser o maior. Aqui aparece no instante exato em que
            importa: o dedo indo pro botão.

            A linha que desmontava a soma ("R$268,51 de taxa + R$195 da 1ª
            mensalidade") saiu — os dois cards logo acima já dizem isso, e o
            rodapé estava reexplicando o que a tela inteira acabou de explicar.
            Terceira repetição do mesmo número não é reforço, é ruído. */}
        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">
              Você paga hoje
            </span>
            <span className="text-h2 text-text-primary">{brl(hoje, true)}</span>
          </div>
          <Button full>Continuar</Button>
        </Rodape>
      </main>
    </>
  );
}

/** Check preenchido, 28px. Local: só o card do grátis usa. */
function Check() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-state-success"
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
