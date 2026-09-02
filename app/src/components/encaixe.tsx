"use client";

import type { Resultado } from "@/components/veredito";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENCAIXE — escolha do CNAE na DESCOBERTA (pré-pagamento) · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/reordenacao-cluster-fiscal-encaixe.md (PROPOSTA aprovada 21/07)
 *
 * É o coração da reordenação do cluster fiscal. Vem LOGO APÓS o veredito 🟢,
 * ainda antes de pagar, e **trava o CNAE** — que o nome/objeto/Junta precisam
 * desde o primeiro preenchimento (confirmado pelo Pedro). A otimização deixa de
 * ser "quer trocar?" (correção tardia, cheira a descuido) e vira "achei seu
 * encaixe" (competência, de cara).
 *
 * ─── AS 4 REGRAS (guarda-corpos da nota) ──────────────────────────────────
 *  1. Vem DEPOIS do veredito, não na tela de descrever (não pesar o farol leve).
 *  2. O % de adequação é REAL: cruza a pill clicada + o texto do N4 via IA = fit
 *     ao que a pessoa DESCREVEU. Sugestão não-vinculante — a escolha é dela.
 *     ⚠️ adequação = fit à descrição, NÃO é "% mais barato". Não confundir.
 *  3. Garante o SETUP, não o resultado: "o código mais barato que serve",
 *     nunca "menor imposto possível" cravado (no fator-r depende da margem).
 *  4. Defesa de legitimidade INLINE e obrigatória: "emite a mesma nota, não é
 *     malandragem". Sem isso o leigo cheira fraude e recusa a economia.
 *
 * 🚧 Stage 1 (aditivo): a tela existe e trava a escolha. A remoção do N5 teaser
 * + N17, o N5' (resumo de valor) e a reindexação do lib/passos são o stage 2.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface OpcaoCnae {
  humano: string;
  cnae: string;
  /** Fit ao que a pessoa descreveu (IA cruza pill + texto). 0–100. Regra 2. */
  adequacao: number;
  /**
   * 🆕 26/08 (achado do Pedro: promover uma vizinha ao topo — UX-65 — perdia
   * a descrição e o "o que cobre", card ficava pobre comparado ao
   * recomendado). Opcionais aqui porque nem toda `vizinha` da fonte tem esse
   * dado ainda — ausente = card enxuto (comportamento antigo, sem quebrar).
   */
  descricao?: string;
  cobre?: string[];
}

export interface EncaixeData {
  recomendado: OpcaoCnae & { descricao: string; cobre: string[] };
  alternativas: OpcaoCnae[];
}

/** Deriva o ENCAIXE do veredito do gate. As alternativas saem das vizinhas. */
export function encaixeDeResultado(r: Resultado): EncaixeData {
  return {
    recomendado: {
      humano: r.humano,
      cnae: r.cnae,
      adequacao: 94,
      descricao: r.explica,
      cobre: r.compreende ?? [],
    },
    alternativas: (r.vizinhas ?? []).slice(0, 2).map((v, i) => ({
      humano: v.oque,
      cnae: v.cnae,
      adequacao: 72 - i * 8,
      descricao: v.descricao,
      cobre: v.cobre,
    })),
  };
}

/* 🆕 31/07 — `EncaixeView` REMOVIDA (confirmado pelo Pedro: tela não usada
 * mais). Ficou redundante desde que o veredito 🟢 ganhou cards clicáveis
 * (UX-65, 29/07) — as duas telas faziam a mesma pergunta. O miolo visual
 * (`ConteudoCnae`, `OutrasOpcoes`, abaixo) continua vivo: `VereditoView` os
 * usa direto. Rota `/encaixe` e o tile do /mockup removidos junto. Ver
 * flow-data.mjs (nó ENC removido) e HOME-reorganizacao.md.
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTEÚDO DO CARD DE CNAE — FONTE ÚNICA (29/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * O interior do card do ENCAIXE (pill · título · descrição · adequação · par
 * de stat cards · o que cobre), extraído porque o veredito 🟢 passou a usar o
 * mesmo layout. Quem envolve no `Card` é cada tela — assim cada uma escolhe a
 * própria borda/fundo sem duplicar o miolo.
 *
 * `adequacaoModo`: `barra` (ENCAIXE, onde a comparação é o assunto da tela) ou
 * `badge` (veredito, onde o número é um selo e não o herói).
 *
 * ⚠️ `recomendado={false}` troca a pill de "★ Recomendado" pra "Sua escolha":
 * chamar de recomendada uma alternativa de 72% que a pessoa promoveu na mão
 * seria mentir — e o produto tem regra dura contra isso.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ConteudoCnae({
  humano,
  cnae,
  descricao,
  cobre = [],
  adequacao,
  adequacaoModo = "barra",
  recomendado = true,
}: {
  humano: string;
  cnae: string;
  descricao?: string;
  cobre?: string[];
  adequacao: number;
  adequacaoModo?: "barra" | "badge";
  recomendado?: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`text-micro font-semibold ${
              recomendado ? "text-state-success-text" : "text-text-tertiary"
            }`}
          >
            {recomendado ? "★ Recomendado" : "Sua escolha"}
          </span>
          <p className="text-body-strong font-semibold text-text-primary mt-0.5">
            {humano}
          </p>
        </div>
        {adequacaoModo === "badge" && (
          <span className="mt-0.5 shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-bold text-state-success-text">
            {adequacao}% compatível
          </span>
        )}
      </div>

      {descricao && (
        <p className="mt-2 text-caption text-text-secondary">{descricao}</p>
      )}

      {adequacaoModo === "barra" && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-micro text-text-tertiary">Adequação à sua descrição</p>
            <p className="text-caption font-semibold text-state-success-text">
              {adequacao}%
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
            <div
              className="h-full rounded-full bg-state-success"
              style={{ width: `${adequacao}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-stretch gap-2">
        <div className="flex-1 rounded-2xl bg-surface-alt p-3">
          <p className="text-micro text-text-tertiary">Sua atividade</p>
          <p className="mt-0.5 text-body font-semibold text-text-primary">CNAE {cnae}</p>
          <p className="text-micro text-text-tertiary">na Receita</p>
        </div>
        {/* 29/07 — era "O mais barato / que serve / pra você". "Barato" é
            linguagem de varejo (preço de produto), e o assunto aqui é IMPOSTO.
            O rodapé "entre os que servem" é o que mantém a regra 3 do ENCAIXE:
            garante o SETUP, nunca o resultado — não é "o menor imposto
            possível", é o menor entre os códigos que cobrem a atividade. */}
        <div className="flex-1 rounded-2xl bg-state-success-tint p-3">
          <p className="text-micro text-state-success-text">Imposto</p>
          <p className="mt-0.5 text-body font-semibold text-state-success-text">mais baixo</p>
          <p className="text-micro text-text-secondary">entre os que servem</p>
        </div>
      </div>

      {/* O que o CNAE cobre (compreende). */}
      {cobre.length > 0 && (
        <div className="mt-3">
          <p className="text-caption font-semibold text-text-primary mb-1.5">
            O que esse CNAE cobre
          </p>
          <div className="flex flex-col gap-1.5">
            {cobre.map((c) => (
              <div key={c} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                  <CheckMini />
                </span>
                <p className="text-caption text-text-secondary">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * OUTRAS OPÇÕES — as alternativas de CNAE. FONTE ÚNICA (29/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * Extraído do corpo do `EncaixeView` porque o veredito 🟢 passou a mostrar a
 * mesma lista. Copiar a marcação criaria dois blocos "iguais" que divergem na
 * primeira mexida — é o mesmo erro que a extração das telas veio corrigir.
 *
 * `onEscolher` ausente = modo LEITURA (renderiza `div`, não `button`). No
 * veredito o CNAE ainda não está travado: quem trava é o ENCAIXE, na tela
 * seguinte. Deixar clicável ali daria a entender que a escolha acontece duas
 * vezes.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function OutrasOpcoes({
  alternativas,
  escolhido,
  onEscolher,
  titulo = "Outras opções pra você",
  pill,
  destacarTitulo = false,
}: {
  alternativas: OpcaoCnae[];
  escolhido?: string;
  onEscolher?: (cnae: string) => void;
  titulo?: string;
  /**
   * 🆕 02/09 (pedido do Pedro) — texto da pill verde de cada card desta
   * lista. Na C0 são duas listas: o recomendado leva "+ compatível", as
   * outras levam "compatível". Sem a prop, nenhuma pill.
   *
   * ⚠️ É da LISTA, não do card: o rótulo vale pra todo item, e quem decide o
   * que a lista significa é quem a monta. No VEREDITO (C0.2) esta lista traz
   * só as alternativas — o mais compatível está no card grande acima —, então
   * lá ela roda sem pill nenhuma.
   */
  pill?: string;
  /**
   * 🆕 02/09 (pedido do Pedro) — pinta o NOME DA ATIVIDADE no verde
   * escuro da pill (`state-success-text`), pra dar mais destaque ao card
   * recomendado. Da lista, como a `pill`: quem sabe se ela é a recomendação é
   * quem a monta.
   */
  destacarTitulo?: boolean;
}) {
  if (alternativas.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-micro text-text-tertiary mb-2">{titulo}</p>
      <div className="flex flex-col gap-2">
        {alternativas.map((a) => {
          const on = escolhido === a.cnae;
          const conteudo = (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className={`text-caption font-semibold ${
                    destacarTitulo ? "text-state-success-text" : "text-text-primary"
                  }`}
                >
                  {a.humano}
                </p>
                {/* 🗑️ 02/09 (pedido do Pedro) — saiu o "· imposto baixo".
                    Era texto fixo, colado em TODO card: não vinha de dado
                    nenhum e valia igual pra códigos de anexos diferentes.
                    Promessa fiscal sem fonte é o que a regra anti-guru do
                    projeto proíbe, e aqui ela nem era usada pra decidir. */}
                <p className="text-micro text-text-tertiary mt-0.5">CNAE {a.cnae}</p>
              </div>
              {/* 🗑️ 02/09 (pedido do Pedro) — O PERCENTUAL SAIU. "72%" e
                  "64%" convidam a comparar dois números que a pessoa não tem
                  como julgar, e transformam uma recomendação em decisão
                  técnica: ela fica escolhendo entre 8 pontos de diferença em
                  vez de ler o que cada atividade descreve. Sobra o sinal que
                  de fato ajuda, e só no primeiro. */}
              {pill && (
                <span className="shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
                  {pill}
                </span>
              )}
            </div>
          );

          return onEscolher ? (
            <button
              key={a.cnae}
              onClick={() => onEscolher(a.cnae)}
              /* 🔄 02/09 — SELECIONADO segue CORAL (borda + tint), como no
                 resto do app. Houve um desvio no mesmo dia: testamos cinza
                 preenchido (hairline, depois `surface-alt`) até o Pedro
                 levantar a dúvida certa — "seria um problema ficar diferente
                 das telas de trás?". Era: `border-action-primary bg-*` é a
                 gramática de "escolhido" em 5 lugares antes desta tela (E3.2,
                 faixa, triagem, checkbox, opção sim/não), e cinza claro no
                 nosso app é fundo de coisa INATIVA — o card marcado ficava
                 parecendo o desabilitado. O medo de "coral compete com o CTA"
                 não se confirmou: faixa e triagem já convivem com card coral
                 e CTA coral no rodapé.
                 Tint, não coral sólido: são 3 cards e um já vem marcado; o
                 fill cheio pesaria numa escolha que a pessoa não precisa
                 tomar. Quem diz "isto veio pronto" é a pill + o título verde,
                 não a cor do estado. */
              className={`rounded-2xl border p-3 text-left transition-colors ${
                on
                  ? "border-action-primary bg-surface-tint-brand"
                  : "border-border-hairline bg-surface-card hover:border-border-strong"
              }`}
            >
              {conteudo}
            </button>
          ) : (
            <div
              key={a.cnae}
              className="rounded-2xl border border-border-hairline bg-surface-card p-3"
            >
              {conteudo}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}
