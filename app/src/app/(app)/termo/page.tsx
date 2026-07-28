"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Checkbox } from "@/components/ui/form";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N20 — TERMO DE INÍCIO (IRREVERSÍVEL)  ·  arquétipo A6 (aceite) · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 18 (3.3)
 *
 * ─── A RACHADURA DO T18 (decisão de vault) ─────────────────────────────────
 * O antigo T18 juntava DUAS coisas de natureza jurídica oposta, e por isso
 * virou duas telas:
 *   · N8 (contrato de serviço) — REVERSÍVEL. CDC art.49 limpo, 7 dias. Por isso
 *     a copy lá NÃO assusta.
 *   · N20 (este) — IRREVERSÍVEL. Ao autorizar, a gente protocola na Junta e a
 *     taxa que o cliente JÁ pagou é gasta. Serviço iniciado = exceção do art.49.
 *
 * ─── ⚠️ O REENQUADRAMENTO (debate com o Pedro, 21/07) ──────────────────────
 * A v1 desta tela punha "A taxa do governo não volta" como MANCHETE (Aviso
 * warning). Errado, e o Pedro pegou: **a cobrança subiu no flow.** A pessoa já
 * pagou os R$ 463,51 lá no N9 (taxa da Junta + 1ª mensalidade), e o N7 já tinha
 * aberto que a taxa é repasse de governo. Repetir "não volta" como novidade
 * competia com a memória do pagamento e lia como "paguei de novo?".
 *
 * A informação NOVA aqui não é "a taxa existe" (N7 disse) nem "você pagou" (N9).
 * É que a partir de AGORA ela é GASTA e não dá pra desfazer. Então:
 *   1. A manchete é a AÇÃO ("pode começar a abrir?"), não o medo.
 *   2. A irreversibilidade é consequência do "vai", amarrada ao que ela JÁ
 *      pagou — reconhece o pagamento do N9 em vez de fingir que é fato fresco.
 *   3. NINGUÉM paga de novo. O texto diz "usa a taxa que você já pagou", nunca
 *      "a gente paga por você" (que implicava cobrança nesta tela).
 *
 * 🟡 Se essa renúncia ao art.49 precisa MESMO de tela própria (ou se funde no
 * N19) é decisão de Larissa/Mauro — já está na fila-validacao-humana.
 *
 * ─── CONTEÚDO LEGAL NUNCA VAI PRA EXPANDER (spec, regra dura) ───────────────
 * A política de cancelamento (as 4 camadas do B3) fica ABERTA na tela, íntegra
 * e igual pras duas coortes do UX-48. Aqui é a casa da CAMADA 2 (a taxa já paga
 * não volta depois de registrar), que saiu do N8 de propósito: é consequência
 * do irreversível, não do contrato reversível.
 *
 * ⚠️ warning, nunca coral: coral não é alerta (regra dura da paleta).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function TermoPage() {
  const [aceito, setAceito] = useState(false);
  // 🆕 28/07: ?cenario=empresa-paga é a alternativa DOCUMENTADA (não a
  // definitiva) — ver nota completa em /plano. Sem taxa paga pelo cliente,
  // o argumento de irreversibilidade muda de base: some "não volta o
  // dinheiro" e sobra "o trabalho de registro já começou".
  const searchParams = useSearchParams();
  const empresaPaga = searchParams.get("cenario") === "empresa-paga";

  return (
    <>
      <TelaHeader meta="Autorização" />

      <main className="app-main">
        {/* Manchete = a AÇÃO. O sub reconhece o que ela já fez (pagou, montou),
            pra esta tela não soar como uma nova etapa de cobrança. */}
        <Titulo sub="Você já pagou e já montou tudo. Este é o último passo antes da gente registrar a empresa de verdade.">
          Pode começar a abrir?
        </Titulo>

        <Corpo>
          {/* O QUE ACONTECE ao autorizar. Concreto, sem juridiquês. O item da
              taxa diz USA (repasse do que ela já pagou), nunca "paga por você". */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Quando você autoriza, a gente começa agora:
            </p>
            <ul className="flex flex-col gap-2">
              <Item>Protocola sua empresa na Junta Comercial de Minas.</Item>
              {/* V5: positivo (era "você não paga nada de novo"). V1: única
                  menção a "que você já pagou" na tela — a Camada 2 deixou de
                  repetir a frase gêmea. 🆕 28/07: no cenário empresa-paga não
                  existe taxa paga pelo cliente pra citar. */}
              <Item>
                {empresaPaga
                  ? "A taxa da Junta é por nossa conta — você não paga essa parte."
                  : "A taxa que você já pagou cobre esse registro."}
              </Item>
              <Item>Segue com Receita, Simples e Prefeitura até o CNPJ ativar.</Item>
            </ul>
          </div>

          {/* M1: a irreversibilidade da AÇÃO mora aqui (o headline). O detalhe
              do dinheiro (a taxa já paga não volta) é da Camada 2, canônica.
              Antes o Aviso + a Camada 2 + o checkbox diziam "não volta" 3× na
              mesma tela — o Aviso reencostava no que a Camada logo abaixo detalha. */}
          <Aviso variante="warning" titulo="A partir daqui, não dá pra desfazer">
            É o ponto sem volta: o que a Junta registrar a partir de agora não
            tem como ser desfeito. Vale conferir tudo antes de autorizar.
          </Aviso>

          {/* POLÍTICA DE CANCELAMENTO — as 4 camadas, aberta e inteira.
              K9: bullets, não lista numerada. Número implicava ordem/sequência;
              são 4 fatos independentes sobre cancelamento, não passos. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Como funciona o cancelamento
            </p>
            <div className="flex flex-col gap-2.5">
              <Camada>
                Você autoriza esta abertura de forma expressa, aqui, marcando o
                aceite. Nada é registrado sem esse passo.
              </Camada>
              <Camada>
                {empresaPaga
                  ? "A taxa da Junta é por nossa conta — não é algo que você paga nem que volta ou deixa de voltar pra você."
                  : "A taxa da Junta não é reembolsável depois que a gente registra, porque ela vai pro governo, não pra gente."}
              </Camada>
              <Camada>
                O nosso serviço (a mensalidade) você cancela quando quiser,
                respeitando o prazo do plano.
              </Camada>
              <Camada>
                Até aqui, nada foi registrado. Se você desistir antes de
                autorizar, recebe de volta o que pagou, inclusive a taxa.
              </Camada>
            </div>
          </div>

          {/* ACEITE explícito, componente do DS (K4), o mesmo do N8.
              V4 (21/07): o aceite NOMEIA a taxa não-reembolsável. Num
              consentimento irreversível, o termo que custa dinheiro tem que
              estar no que ele marca (igual o N8 faz com a permanência mínima).
              Reverte em parte a de-dup da M1, de propósito: consentir ≠ divulgar.
              🟡 redação jurídica final é da Larissa. */}
          <Checkbox checked={aceito} onChange={setAceito}>
            {empresaPaga
              ? "Autorizo o início da abertura, ciente de que ela não pode ser desfeita."
              : "Autorizo o início da abertura, ciente de que ela não pode ser desfeita e de que a taxa da Junta já paga não é reembolsável."}
          </Checkbox>
        </Corpo>

        <Rodape>
          {/* Botão único grande (spec T18). Trava até o aceite explícito. */}
          <Button full disabled={!aceito}>
            Autorizo, pode abrir
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      {/* V3: coral (ação), não verde-sucesso. As 3 ações ainda VÃO acontecer;
          verde-estado decorando futuro enfraquece o token (card.tsx). */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="mt-0.5 shrink-0 text-action-primary"
        aria-hidden
      >
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path
          d="m7.5 12.4 3.1 3.1 6-6.2"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-caption text-text-secondary">{children}</span>
    </li>
  );
}

function Camada({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
      <p className="text-caption text-text-secondary">{children}</p>
    </div>
  );
}
