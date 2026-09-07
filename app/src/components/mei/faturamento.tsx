"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Rolagem, Rodape } from "@/components/ui/tela";
import { TETO_MEI_ANUAL, TETO_MEI_MENSAL } from "@/lib/mei";
import { CardIconeMei } from "./_card-icone";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M3 · SEU FATURAMENTO — no layout aprovado do E5F, com o gate do teto.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do E5F (`FaixaView` em `gate-telas.tsx`): título com a 2ª parte em tom
 * terciário (tira a pressão de acertar o número antes de a pessoa olhar as
 * opções), **grade 2×2 de cards de ícone 3D**, "Sei o valor exato" como link
 * discreto abaixo — e o campo exato aparecendo INLINE, sem trocar a tela
 * (UX-68, decisão de 03/08). Reescrito, não importado: a trava de fronteira
 * proíbe o ramo MEI de importar tela de ME.
 *
 * ─── AS 3 DIFERENÇAS QUE OBRIGAM UMA TELA PRÓPRIA ───────────────────────────
 *
 *   1. **A grade é outra.** A do ME termina em R$30.000/mês (teto do ME, LC
 *      123 art. 3º II). A do MEI termina em R$6.750 — R$81.000/ano ÷ 12. Usar
 *      a grade do ME ofereceria à pessoa 3 faixas em que ela já não é MEI.
 *
 *   2. **No ME isto NÃO barra ninguém** (decisão de 01/09: a ideia é
 *      acompanhar o crescimento e propor o desenquadramento depois). No MEI
 *      barra, porque o teto é condição legal de existir como MEI.
 *
 *   3. **O campo exato trava em outro número.** Lá o clamp é o teto do ME;
 *      aqui, deixar digitar R$30 mil seria convidar a pessoa a se declarar
 *      fora do produto. O clamp é generoso de propósito (o dobro do teto do
 *      MEI): quem fatura mais PRECISA ver o card do gate, não um campo que
 *      ignora a tecla.
 *
 * ─── COMO O GATE SE RESOLVE ─────────────────────────────────────────────────
 * INLINE, na própria tela — mesma doutrina do E3.4.1 e da E5T.1. Quem estoura
 * não é jogado numa tela de "não atendemos": vê ali o que muda e segue como ME
 * num clique. É a diferença entre "você não serve pra gente" e "o MEI não
 * serve pra você, e a gente tem o certo".
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * As 4 faixas do MEI, em R$/mês, na mesma anatomia da grade do ME.
 * `max: null` = a faixa que estoura o teto.
 *
 * ✍️ "Não sei ainda" é a 1ª pelo mesmo motivo que virou opção no ME em 01/09:
 * quem abre a primeira empresa muitas vezes não tem estimativa, e forçar um
 * número faz a pessoa chutar. Aqui o chute é PIOR que no ME — ele decide se
 * ela pode ou não ser MEI. Por isso "não sei" não estoura o gate: ela segue, e
 * o monitor de teto (que é parte do que vendemos) cuida do resto.
 */
export const FAIXAS_MEI: {
  id: string;
  label: string;
  min: number;
  max: number | null;
  coral: string;
  creme: string;
}[] = [
  {
    id: "nao-sei",
    label: "Não sei ainda",
    min: 0,
    max: TETO_MEI_MENSAL,
    coral: "/icones/faixa-1-coral.png",
    creme: "/icones/faixa-1-creme.png",
  },
  {
    id: "ate-3k",
    label: "Até R$ 3 mil",
    min: 0,
    max: 3000,
    coral: "/icones/faixa-2-coral.png",
    creme: "/icones/faixa-2-creme.png",
  },
  {
    id: "3-teto",
    label: "R$ 3 mil a R$ 6.750",
    min: 3000,
    max: TETO_MEI_MENSAL,
    coral: "/icones/faixa-3-coral.png",
    creme: "/icones/faixa-3-creme.png",
  },
  {
    id: "acima",
    label: "Mais de R$ 6.750",
    min: TETO_MEI_MENSAL,
    max: null,
    coral: "/icones/faixa-4-coral.png",
    creme: "/icones/faixa-4-creme.png",
  },
];

/** Clamp do campo exato: o dobro do teto. Ver §3 do cabeçalho. */
const TETO_CAMPO = TETO_MEI_MENSAL * 2;

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
  autoFocus = true,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  faixa: string | null;
  setFaixa: (v: string) => void;
  modoExato: boolean;
  setModoExato: (v: boolean) => void;
  exato: string;
  setExato: (v: string) => void;
  /** Quem encosta no teto confirma que entendeu o que acontece ao passar. */
  cienteTeto: boolean;
  setCienteTeto: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** Sai do ramo MEI e segue como ME. */
  onQueroMe?: () => void;
  /** A demo desliga: roubar o foco dentro da moldura rola o board. */
  autoFocus?: boolean;
}) {
  const valor = Number(exato.replace(/\D/g, "")) || 0;
  const escolhida = FAIXAS_MEI.find((f) => f.id === faixa) ?? null;

  /** Estourou? Vale pelos 2 caminhos: o valor digitado manda sobre a faixa. */
  const estourou =
    valor > 0 ? valor > TETO_MEI_MENSAL : escolhida?.max === null;

  /** Encostou no teto sem passar (a faixa que termina nele, ou 80%+ do valor). */
  const perto =
    valor > 0
      ? valor > TETO_MEI_MENSAL * 0.8 && valor <= TETO_MEI_MENSAL
      : escolhida?.id === "3-teto";

  const respondeu = valor > 0 || faixa !== null;
  const completo = respondeu && !estourou && (!perto || cienteTeto);

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        {/* Título FIXO, com a 2ª parte em tom terciário — mesmo padrão do E5F
            e do N3. A copy é do MEI: o teto é o assunto, não a estimativa. */}
        <div className="shrink-0">
          <h1 className="text-h1 mb-2">
            Quanto você fatura por mês?{" "}
            <span className="text-text-tertiary">Pode ser estimativa!</span>
          </h1>
          <p className="text-body text-text-secondary mb-6">
            O MEI tem um teto de {reais(TETO_MEI_ANUAL)} por ano. É a única
            conta que decide se ele serve pra você.
          </p>
        </div>

        <Rolagem>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {FAIXAS_MEI.map((f) => (
                <CardIconeMei
                  key={f.id}
                  label={f.label}
                  iconeCoral={f.coral}
                  iconeCreme={f.creme}
                  selecionado={valor === 0 && faixa === f.id}
                  onClick={() => {
                    setFaixa(f.id);
                    // Tocar numa faixa desfaz o valor digitado: senão o número
                    // continuaria mandando e a seleção visual mentiria.
                    setExato("");
                    setModoExato(false);
                  }}
                  tamanho={67}
                />
              ))}
            </div>

            {/* UX-68: o campo exato aparece ABAIXO das faixas, sem trocar a
                tela. Quem já sabe o número não perde as opções de vista. */}
            {modoExato ? (
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-caption font-semibold text-text-primary">
                  Valor exato por mês
                </p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-secondary">
                    R$
                  </span>
                  <input
                    value={exato}
                    onChange={(e) => {
                      /* Trava por CLAMP, não por rejeição — mesma regra do
                         E5F. Um campo que ignora a tecla deixa a pessoa
                         achando que o app travou. */
                      const digitado =
                        Number(e.target.value.replace(/\D/g, "")) || 0;
                      const preso = Math.min(digitado, TETO_CAMPO);
                      setExato(preso ? preso.toLocaleString("pt-BR") : "");
                    }}
                    placeholder="0"
                    inputMode="numeric"
                    autoFocus={autoFocus}
                    aria-label="Quanto você fatura por mês"
                    className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card
                               py-3 pl-10 pr-3 text-body text-text-primary placeholder:text-text-muted
                               focus:border-border-focus focus:outline-none"
                  />
                </div>
                {/* Devolve o enquadramento na hora: mostra que o número foi
                    entendido, em vez de deixar a pessoa adivinhar. */}
                {valor > 0 && !estourou && (
                  <p className="text-caption text-text-secondary">
                    Isso cabe no MEI:{" "}
                    <strong className="text-text-primary">
                      {reais(valor * 12)} por ano
                    </strong>
                    , dentro do teto de {reais(TETO_MEI_ANUAL)}.
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModoExato(true)}
                className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
              >
                Sei o valor exato
              </button>
            )}

            {/* ═══ O GATE, RESOLVIDO NA PRÓPRIA TELA ══════════════════════
                🎯 Não é "não atendemos": é "o MEI não cabe em você, e o que
                cabe a gente também faz". Card de marca (coral suave) com o
                CTA dentro, mesma anatomia do escape hatch da E5T.1. */}
            {estourou && (
              <Card tom="marca">
                <p className="text-body font-semibold text-text-primary mb-1">
                  Nesse faturamento, o MEI não serve
                </p>
                <p className="text-caption text-text-secondary mb-3">
                  O teto é {reais(TETO_MEI_ANUAL)} por ano, ou cerca de{" "}
                  {reais(TETO_MEI_MENSAL)} por mês. Passando disso, a Receita
                  desenquadra e cobra a diferença retroativa. O caminho certo
                  pra você é o ME no Simples, que a gente abre igual.
                </p>
                <Button full onClick={onQueroMe}>
                  Ver como seria em ME
                </Button>
              </Card>
            )}

            {/* Quem está perto do teto não é barrado, mas precisa saber o que
                acontece — porque quem descobre depois descobre com multa.
                `CardNota` de atenção, não bloco tingido: é informação sobre a
                escolha, não alarme. */}
            {perto && !estourou && (
              <div className="flex flex-col gap-3">
                <CardNota variante="atencao" titulo="Você está perto do teto">
                  Passando de {reais(TETO_MEI_ANUAL)} no ano, o MEI é
                  desenquadrado e vira ME, com imposto sobre o faturamento a
                  partir daí. A gente acompanha isso mês a mês e te avisa antes
                  de estourar, não depois.
                </CardNota>
                <Checkbox checked={cienteTeto} onChange={setCienteTeto}>
                  Entendi como funciona o teto
                </Checkbox>
              </div>
            )}

            {!estourou && (
              <p className="text-micro text-text-tertiary">
                Esse número não vai pro governo. Ele serve pra gente montar o
                seu acompanhamento e avisar se você chegar perto do limite.
              </p>
            )}
          </div>
        </Rolagem>

        <Rodape>
          {/* O botão DIZ O QUE FALTA, régua de 04/09 (A1, C0.0, C3, C4, E9). */}
          <Button full disabled={!completo} onClick={onSeguir}>
            {!respondeu
              ? "Escolha uma faixa"
              : estourou
                ? "O MEI não cabe nesse faturamento"
                : perto && !cienteTeto
                  ? "Confirme que entendeu o teto"
                  : "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
