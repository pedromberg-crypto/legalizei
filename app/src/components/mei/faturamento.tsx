"use client";

import { Button } from "@/components/ui/button";
import { Campo, Texto, OpcoesColuna, Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Card } from "@/components/ui/card";
import { TETO_MEI_ANUAL, TETO_MEI_MENSAL } from "@/lib/mei";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3 · SEU FATURAMENTO — a única pergunta do ramo MEI que é gate de verdade.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Substitui o uso que o MEI fazia da `FaixaView` do ME.
 *
 * ─── POR QUE ELA NÃO PODE SER A MESMA TELA DO ME ────────────────────────────
 * As duas perguntam "quanto você fatura", e param de se parecer aí:
 *
 *   · **A grade é outra.** A do ME vai até R$30.000/mês (teto do ME, LC 123
 *     art. 3º II). A do MEI termina em R$6.750/mês — R$81.000/ano ÷ 12. Usar a
 *     grade do ME aqui ofereceria à pessoa 4 faixas em que ela já não é MEI.
 *
 *   · **No ME isto NÃO barra ninguém** (decisão 01/09: a ideia é acompanhar o
 *     crescimento e propor o desenquadramento depois). No MEI barra, porque o
 *     teto é condição legal de existir como MEI, não faixa de plano.
 *
 * ─── COMO O GATE SE RESOLVE ─────────────────────────────────────────────────
 * INLINE, na própria tela — mesma doutrina do E3.4.1 e da E5T.1 do ME: quem
 * estoura o teto não é jogado numa tela de "não atendemos", ele vê ali mesmo o
 * que muda e segue como ME. É a diferença entre "você não serve pra gente" e
 * "o MEI não serve pra você, e a gente tem o certo".
 *
 * ⚠️ Nada aqui bloqueia de fato: quem estourou pode seguir como ME num clique.
 * A única porta que fecha no ramo MEI é a dos impedimentos (M2), e ela fecha
 * porque o GOVERNO fecha, não porque a gente escolheu.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * As faixas do MEI, em R$/mês. `max: null` = a faixa que estoura o teto.
 *
 * ✍️ "Não sei ainda" é a primeira opção pelo mesmo motivo que virou opção no
 * ME em 01/09: quem abre a primeira empresa muitas vezes não tem estimativa, e
 * forçar um número faz a pessoa chutar. Chute aqui é pior que no ME — ele
 * decide se ela pode ou não ser MEI.
 */
export const FAIXAS_MEI = [
  { id: "nao-sei", label: "Não sei ainda", nota: "Dá pra ajustar depois", max: 0 },
  { id: "ate-2k", label: "Até R$ 2 mil por mês", max: 2000 },
  { id: "2-4k", label: "Entre R$ 2 mil e R$ 4 mil", max: 4000 },
  { id: "4-teto", label: "Entre R$ 4 mil e R$ 6.750", max: 6750 },
  { id: "acima", label: "Mais de R$ 6.750 por mês", nota: "Passa do teto do MEI", max: null },
] as const;

export function FaturamentoMeiView({
  meta,
  faixa,
  setFaixa,
  modoExato,
  setModoExato,
  exato,
  setExato,
  cienteTeto,
  setCienteTeto,
  onSeguir,
  onVoltar,
  onQueroMe,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  faixa: string | null;
  setFaixa: (v: string) => void;
  modoExato: boolean;
  setModoExato: (v: boolean) => void;
  exato: string;
  setExato: (v: string) => void;
  /**
   * Quem está perto do teto confirma que entendeu o que acontece ao passar.
   * Não é bloqueio: é a mesma disciplina do aviso de benefício na M2.
   */
  cienteTeto: boolean;
  setCienteTeto: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** Sai do ramo MEI e segue como ME, sem perder o que já respondeu. */
  onQueroMe?: () => void;
}) {
  const valorExato = Number(exato.replace(/\D/g, ""));
  const escolhida = FAIXAS_MEI.find((f) => f.id === faixa) ?? null;

  /** Estourou o teto? Vale pelos 2 caminhos: faixa escolhida ou valor exato. */
  const estourou = modoExato
    ? valorExato > TETO_MEI_MENSAL
    : escolhida?.max === null;

  /** Encostou no teto sem passar (última faixa válida ou 80%+ do limite). */
  const perto = modoExato
    ? valorExato > TETO_MEI_MENSAL * 0.8 && valorExato <= TETO_MEI_MENSAL
    : escolhida?.id === "4-teto";

  const respondeu = modoExato ? exato.trim().length > 0 : faixa !== null;
  const completo = respondeu && !estourou && (!perto || cienteTeto);

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub={`O MEI tem um teto: ${reais(TETO_MEI_ANUAL)} por ano. É a única conta que decide se ele serve pra você.`}>
          Quanto você fatura por mês?
        </Titulo>

        <Corpo>
          {!modoExato ? (
            <>
              <div className="flex flex-col gap-2">
                <OpcoesColuna
                  opcoes={FAIXAS_MEI.map((f) => ({ v: f.id as string, label: f.label }))}
                  valor={faixa}
                  onChange={setFaixa}
                />
              </div>
              <button
                type="button"
                onClick={() => setModoExato(true)}
                className="self-start text-caption font-semibold text-action-primary-sm underline underline-offset-4"
              >
                Sei o valor exato
              </button>
            </>
          ) : (
            <>
              <Campo
                rotulo="Seu faturamento médio por mês"
                dica="Some tudo o que entra, antes de qualquer desconto."
              >
                <Texto
                  valor={exato}
                  onChange={setExato}
                  placeholder="R$ 0"
                  inputMode="numeric"
                />
              </Campo>
              <button
                type="button"
                onClick={() => setModoExato(false)}
                className="self-start text-caption font-semibold text-action-primary-sm underline underline-offset-4"
              >
                Voltar pras faixas
              </button>
            </>
          )}

          {/* ── O GATE, RESOLVIDO NA PRÓPRIA TELA ─────────────────────────
              🎯 Esta é a razão de a tela existir. Não é "não atendemos": é
              "o MEI não cabe em você, e o que cabe a gente também faz". */}
          {estourou && (
            <Card tom="marca">
              <p className="text-body font-semibold text-text-primary mb-1">
                Nesse faturamento, o MEI não serve
              </p>
              <p className="text-caption text-text-secondary mb-3">
                O teto do MEI é {reais(TETO_MEI_ANUAL)} por ano, ou cerca de{" "}
                {reais(TETO_MEI_MENSAL)} por mês. Passando disso, a Receita
                desenquadra e cobra a diferença retroativa. O caminho certo pra
                você é o ME no Simples, que a gente abre igual.
              </p>
              <Button full onClick={onQueroMe}>
                Ver como seria em ME
              </Button>
            </Card>
          )}

          {/* Quem está perto do teto não é barrado, mas precisa saber o que
              acontece — porque quem descobre depois descobre com multa. */}
          {perto && !estourou && (
            <div className="flex flex-col gap-3">
              <Aviso variante="warning" titulo="Você está perto do teto">
                Passando de {reais(TETO_MEI_ANUAL)} no ano, o MEI é
                desenquadrado e vira ME, com imposto sobre o faturamento a
                partir daí. A gente acompanha isso mês a mês e te avisa antes de
                estourar, não depois.
              </Aviso>
              <Checkbox checked={cienteTeto} onChange={setCienteTeto}>
                Entendi como funciona o teto
              </Checkbox>
            </div>
          )}

          {!estourou && (
            <p className="text-micro text-text-tertiary">
              Esse número não vai pro governo. Ele serve pra gente montar o seu
              acompanhamento e avisar se você chegar perto do limite.
            </p>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
