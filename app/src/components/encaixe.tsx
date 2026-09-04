"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Resultado } from "@/components/veredito";
/* 🆕 04/09 — fonte única do nome de cada CNAE (oficial IBGE). Ver `lib/cnae`. */
import { nomeCnae } from "@/lib/cnae";
import { Button } from "@/components/ui/button";

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
/**
 * 🔄 02/09 — quantas alternativas entram é do CHAMADOR, não do dado.
 * A C0 mostra 5 sugestões (recomendado + 4), porque lá a lista é o assunto da
 * tela e a rolagem já tem o degradê de continuidade; o veredito (C0.2) segue
 * com 2, que é o que cabe embaixo do cartão grande sem virar outra tela.
 */
export function encaixeDeResultado(r: Resultado, maxAlternativas = 2): EncaixeData {
  /* 🆕 04/09 (decisão do Pedro) — O NOME VEM DO DICIONÁRIO (`lib/cnae`, nome
     oficial IBGE), não do texto que cada mock escreveu. Era aqui que nascia
     metade da divergência: o `humano`/`oque` do `mock-veredito` competia com o
     `humano` da lista curada do C5 e com o do recap. O texto do mock continua
     valendo como FALLBACK, pra código fora do dicionário não virar buraco. */
  return {
    recomendado: {
      humano: nomeCnae(r.cnae, r.humano),
      cnae: r.cnae,
      adequacao: 94,
      descricao: r.explica,
      cobre: r.compreende ?? [],
    },
    alternativas: (r.vizinhas ?? []).slice(0, maxAlternativas).map((v, i) => ({
      humano: nomeCnae(v.cnae, v.oque),
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
  pillDe,
  onVerDetalhes,
  rodapeDoCartao,
}: {
  alternativas: OpcaoCnae[];
  escolhido?: string;
  onEscolher?: (cnae: string) => void;
  titulo?: string;
  /**
   * 🆕 02/09 (pedido do Pedro) — texto da pill de cada cartão. Recebe a
   * opção e devolve o rótulo, ou nada. É função porque numa lista só convivem
   * rótulos diferentes: o recomendado leva "+ compatível" e os outros levam
   * "compatível". No VEREDITO (C0.2) a prop não é passada e ninguém leva pill.
   */
  pillDe?: (o: OpcaoCnae) => string | undefined;
  /**
   * 🆕 02/09 (pedido do Pedro) — abre as características do CNAE num
   * bottom-sheet. Sem a prop, o card não mostra o link (é o caso do veredito).
   */
  onVerDetalhes?: (o: OpcaoCnae) => void;
  /**
   * 🆕 02/09 (pedido do Pedro) — conteúdo DENTRO do cartão, embaixo do
   * nome/código. Nasceu pra C5 pendurar as secundárias no cartão da
   * principal: separadas, as duas informações liam como assuntos
   * independentes; dentro, a hierarquia (uma principal, N secundárias) fica
   * dita pela estrutura, sem texto.
   * ⚠️ Só use em lista de UM cartão. Numa lista de escolha, um rodapé por item
   * competiria com o toque de escolher.
   */
  rodapeDoCartao?: (o: OpcaoCnae) => ReactNode;
}) {
  if (alternativas.length === 0) return null;

  return (
    <div className="mt-4">
      {titulo && <p className="text-micro text-text-tertiary mb-2">{titulo}</p>}
      <div className="flex flex-col gap-2">
        {alternativas.map((a) => {
          const on = escolhido === a.cnae;
          /* 🔄 02/09 (pedido do Pedro) — o CARD ESCOLHIDO FICA COMPLETAMENTE
             CORAL (`action-primary`, o mesmo fill dos cartões de faixa e de
             regime), com toda a tipografia branca e a pill em coral-700.
             Antes era só borda + tint, e a diferença entre "escolhido" e "não
             escolhido" ficava fina demais numa tela em que a escolha já vem
             feita: se ela vem pronta, tem que ser óbvio QUAL veio.
             Branco sobre coral-700 = 6,4:1, passa AA. */
          const conteudo = (
            <div className="flex items-center justify-between gap-3">
              <div>
                {/* 🗑️ 02/09 — o verde do recomendado saiu junto com o
                    verde das pills. Ele nasceu quando a cor era o único
                    sinal; hoje quem diz "é este" é o card coral inteiro, e um
                    título verde aparecendo só quando a pessoa marca OUTRO
                    cartão era o único resto de uma cor sem função na tela. */}
                <p
                  className={`text-caption font-semibold ${
                    on ? "text-text-on-brand" : "text-text-primary"
                  }`}
                >
                  {a.humano}
                </p>
                {/* 🗑️ 02/09 (pedido do Pedro) — saiu o "· imposto baixo".
                    Era texto fixo, colado em TODO card: não vinha de dado
                    nenhum e valia igual pra códigos de anexos diferentes.
                    Promessa fiscal sem fonte é o que a regra anti-guru do
                    projeto proíbe, e aqui ela nem era usada pra decidir. */}
                <p
                  className={`text-micro mt-0.5 ${
                    on ? "text-text-on-brand" : "text-text-tertiary"
                  }`}
                >
                  CNAE {a.cnae}
                  {/* 🆕 02/09 (pedido do Pedro) — "Ver detalhes" entra AQUI,
                      na linha do código, que já existia e sobrava vazia à
                      direita: não custa altura nem largura, numa tela que a
                      gente acabou de espremer. O `-my-1 py-1` engorda a área
                      de toque sem mudar nada do que se vê. */}
                  {onVerDetalhes && (
                    <>
                      {" · "}
                      <button
                        type="button"
                        onClick={(e) => {
                          // O card inteiro seleciona; este alvo vive dentro
                          // dele e faz outra coisa.
                          e.stopPropagation();
                          onVerDetalhes(a);
                        }}
                        /* 🔄 04/09 (auditoria) — o `-my-1 py-1` dava 25px de alvo. Vira 40px
                           com `-my-2.5 py-2.5`, sem mudar uma linha do que se vê. */
                        className="pointer-events-auto relative -my-2.5 py-2.5 underline underline-offset-2"
                      >
                        Ver detalhes
                      </button>
                    </>
                  )}
                </p>
              </div>
              {/* 🗑️ 02/09 (pedido do Pedro) — O PERCENTUAL SAIU. "72%" e
                  "64%" convidam a comparar dois números que a pessoa não tem
                  como julgar, e transformam uma recomendação em decisão
                  técnica: ela fica escolhendo entre 8 pontos de diferença em
                  vez de ler o que cada atividade descreve. Sobra o sinal que
                  de fato ajuda, e só no primeiro. */}
              {pillDe?.(a) && (
                <span
                  /* 🔄 02/09 (pedido do Pedro) — pill do card NÃO escolhido
                     saiu do verde e virou coral claro (tint + coral-700), o
                     mesmo par de pill clara que o app já usa. O verde vinha
                     do primeiro ensaio, quando a pill era o único sinal; com
                     o card escolhido inteiro coral, verde ao lado abria uma
                     segunda cor sem significado próprio. */
                  className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold ${
                    on
                      ? "bg-action-primary-sm text-text-on-brand"
                      : // 🧪 02/09 — de volta ao verde nos NÃO escolhidos, a
                        // pedido do Pedro, pra ele comparar com o coral claro.
                        "bg-state-success-tint text-state-success-text"
                  }`}
                >
                  {pillDe(a)}
                </span>
              )}
            </div>
          );

          /* 🔄 02/09 (achado do Pedro: "esse card parece mais arredondado") —
             era `rounded-2xl` (16px, o raio de CARD de conteúdo) enquanto os
             cartões de sugestão da C5 e todos os campos em volta usam
             `rounded-md` (12px, o raio de FORMULÁRIO). Empilhados na mesma
             tela, os 4px de diferença apareciam.
             Vale `rounded-md`: C0 e C5 são majoritariamente formulário, e este
             cartão era o único fora do compasso. */
          const estilo = `rounded-md border p-3 text-left transition-colors ${
            on
              ? "border-action-primary bg-action-primary"
              : "border-border-hairline bg-surface-card hover:border-border-strong"
          }`;

          /* ⚠️ 02/09 — o card DEIXOU de ser um `<button>`. Com o "Ver
             detalhes" dentro dele existem dois alvos com ações diferentes, e
             botão dentro de botão é HTML inválido (o navegador desmonta a
             árvore e um dos dois para de responder — mesma família do bug de
             01/09 com o link dentro do `<label>`).
             Padrão "stretched button": o alvo de seleção é um botão absoluto
             cobrindo o card, e o conteúdo passa por cima com os cliques
             desligados, menos o link, que os religa. */
          const miolo = (
            <>
              {conteudo}
              {rodapeDoCartao?.(a)}
            </>
          );

          return onEscolher ? (
            <div key={a.cnae} className={`relative ${estilo}`}>
              <button
                type="button"
                onClick={() => onEscolher(a.cnae)}
                aria-pressed={on}
                aria-label={`Usar o CNAE ${a.cnae}, ${a.humano}`}
                className="absolute inset-0 rounded-md"
              />
              <div className="pointer-events-none relative">{miolo}</div>
            </div>
          ) : (
            <div key={a.cnae} className={estilo}>
              {miolo}
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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHEET DE DETALHES DO CNAE — o que aquele código cobre, sob demanda. 02/09.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 Pedido do Pedro, junto da fusão do veredito dentro da C0: a pessoa
 * escolhe entre 3 códigos parecidos e precisava de um jeito de olhar cada um
 * antes de decidir, sem sair da tela.
 *
 * Mesmo bottom-sheet do DS (`EnviarSheet`, 24/07 · `SheetNaoReembolsavel`):
 * overlay que escurece, folha que sobe, fecha no toque fora ou no botão. Só o
 * conteúdo muda — é a mesma doutrina de lá, "quem quiser o detalhe lê aqui,
 * sem custar uma tela a mais pra quem já entendeu".
 *
 * 🔴 O QUE NÃO ENTRA: anexo do Simples e Fator R. Os dois existem na matriz
 * CNAE mas ainda não foram ratificados por contador (fila da Larissa), e
 * número fiscal sem fonte é o que a regra anti-guru do projeto proíbe. Quando
 * ratificar, este é o lugar.
 */
export function SheetCnae({
  opcao,
  onFechar,
}: {
  opcao: OpcaoCnae;
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  return (
    <div className="absolute inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={sair}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Sobre o CNAE ${opcao.cnae}`}
        className="absolute inset-x-0 bottom-0 flex max-h-[86%] flex-col rounded-t-3xl bg-surface-page px-5"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
          paddingBottom: "calc(16px + var(--safe-bottom))",
        }}
      >
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="mt-4 text-body-strong font-semibold text-text-primary">
            {opcao.humano}
          </p>
          <p className="mt-0.5 text-micro text-text-tertiary">CNAE {opcao.cnae}</p>

          {opcao.descricao && (
            <p className="mt-3 text-caption text-text-secondary">{opcao.descricao}</p>
          )}

          {opcao.cobre && opcao.cobre.length > 0 && (
            <>
              <p className="mt-4 text-caption font-semibold text-text-primary">
                O que esse código cobre
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {opcao.cobre.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                      <CheckMini />
                    </span>
                    <span className="text-caption text-text-secondary">{c}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Sem `cobre`, o sheet ficaria com título e nada embaixo. Dizer que
              o detalhe não existe ainda é melhor que fingir que a lista está
              vazia por algum motivo. */}
          {(!opcao.cobre || opcao.cobre.length === 0) && !opcao.descricao && (
            <p className="mt-3 text-caption text-text-secondary">
              Ainda não temos o detalhamento desse código aqui. Se ele for o seu
              caso, a gente confirma junto com você antes de registrar.
            </p>
          )}
        </div>

        <div className="mt-5 shrink-0">
          {/* 🗑️ 02/09 (achado do Pedro) — o "Usar esse CNAE" saiu daqui.
              Com dois lugares pra escolher (o cartão e o sheet), a pessoa
              precisava descobrir qual era o certo. O sheet ficou com um
              trabalho só: informar. Quem escolhe é o cartão, que sobe pro
              slot do principal. */}
          <Button full variant="secondary" onClick={sair}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}
