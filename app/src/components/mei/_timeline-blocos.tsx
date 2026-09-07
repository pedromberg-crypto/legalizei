"use client";

import { useState } from "react";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A TIMELINE EM BLOCOS DO RAMO MEI — port do `TimelineEmBlocos` do ME.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (3ª correção do Pedro no mesmo dia: *"vamos partir novamente para
 * usar a anatomia idêntica"*).
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 * As telas de status do ramo estavam com uma timeline PLANA — uma `<ol>` de
 * passos soltos. O status do ME não é isso há semanas: é um **acordeão de
 * blocos**, cada um com ícone de estado, título, contador "X de Y" e chevron,
 * e o bloco da vez nasce aberto. A diferença não é enfeite:
 *
 *   · o contador transforma "faltam 13 coisas" em "3 de 3 aqui dentro" —
 *     mostra o tamanho do BLOCO, não o da jornada;
 *   · fechado, o bloco concluído some do caminho visual em vez de virar mais
 *     seis linhas cinzas pra rolar;
 *   · a lista plana crescia junto com o flow e, com 10 passos, virava parede.
 *
 * Eu tinha reconstruído "no espírito" da tela do ME três vezes seguidas (a
 * M7, a M6.1 e agora esta), e o Pedro pegou as três. A raiz não era descuido
 * de cada tela: era não portar a ANATOMIA. Este arquivo é a correção da raiz —
 * daqui pra frente as telas de status do ramo consomem a mesma peça.
 *
 * ⚠️ Reescrito, não importado: `painel` está na lista de telas de ME da trava
 * de fronteira. Herda-se o desenho e os tokens, nunca o arquivo.
 *
 * ─── AS REGRAS DE COR, QUE VIERAM DE 3 RODADAS DE TESTE NO ME ───────────────
 *   · bloco concluído **não** ganha borda verde (recusado em 01/09: com 5
 *     blocos empilhados, 5 bordas viram poluição — o check e o contador já
 *     dizem a mesma coisa);
 *   · bloco da vez ganha **borda coral** (05/09). Não contradiz a regra acima:
 *     ali a cor seria ESTADO, que já mora no ícone; aqui ela é POSIÇÃO ("você
 *     está aqui"), e só um bloco recebe. A poluição que derrubou a verde era a
 *     repetição, não a cor.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ItemBloco {
  nome: string;
  /** Só aparece quando o item é a vez. */
  detalhe?: string;
  /** Fecha o item independente do ponteiro (o item já aconteceu). */
  jaFeito?: boolean;
  /** Gira mesmo sem ser a vez: está rodando em paralelo (o banco compensando). */
  emCurso?: boolean;
  /**
   * 🐛→🔒 07/09 (E2E do ramo) — DE QUEM É A VEZ.
   *
   * O fallback do item da vez era sempre *"Em andamento agora. Te avisaremos
   * quando terminar."* — a frase de quem espera um ÓRGÃO processar. Na M6.1
   * ela apareceu embaixo de "Atividade principal", que é a vez do CLIENTE, com
   * o CTA "Continuar preenchendo" logo abaixo: a tela dizia que a gente estava
   * fazendo e mandava a pessoa fazer, na mesma dobra.
   *
   * Herança direta do ME, e lá o problema já era conhecido: o `PainelView`
   * distingue `comConsultor` justamente pra não dizer "em andamento" numa
   * etapa conduzida por gente. O ramo copiou a frase sem copiar a distinção.
   */
  deQuem?: "casa" | "cliente";
}

export interface BlocoStatus {
  id: number;
  titulo: string;
  itens: ItemBloco[];
}

export function TimelineBlocosMei({
  blocos,
  concluidas,
  emAndamento,
}: {
  blocos: BlocoStatus[];
  /** Quantos ITENS, contando a lista inteira achatada, já fecharam. */
  concluidas: number;
  /** Índice global do item da vez. */
  emAndamento: number;
}) {
  /* Índice global de cada item preservado: os estados saem de
     `concluidas`/`emAndamento`, que contam a lista inteira. */
  let cursor = 0;
  const grupos = blocos.map((b) => {
    const itens = b.itens.map((e) => ({ e, i: cursor++ }));
    return { ...b, itens };
  });

  const blocoAtual =
    grupos.find((g) => g.itens.some(({ i }) => i === emAndamento))?.id ??
    grupos.find((g) => g.itens.some(({ i }) => i >= concluidas))?.id ??
    grupos[grupos.length - 1]?.id;

  /* Cada bloco guarda o próprio estado, e o mapa só registra o que a PESSOA
     tocou: sem toque, vale o default (o da vez nasce aberto, os concluídos
     fechados). Um acordeão único fazia abrir um bloco FECHAR o atual — que é
     onde está a etapa da vez e a única ação da tela. */
  const [tocados, setTocados] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col gap-2.5">
      {grupos.map((g) => {
        const total = g.itens.length;
        const feitos = g.itens.filter(
          ({ i, e }) => i < concluidas || !!e.jaFeito,
        ).length;
        const concluido = feitos === total;
        const ehAtual = g.id === blocoAtual && !concluido;
        /* 🐛→🔒 07/09 (E2E do ramo) — BLOCO COM ALGO GIRANDO TAMBÉM ABRE.
           Só o bloco do ponteiro nascia aberto, e na M6.1 o ponteiro está na
           atividade: o hero falava do boleto compensando e o detalhe dele
           ("aguardando o banco confirmar") ficava escondido no bloco anterior,
           fechado. É o oposto do E9.1, onde "Conta e plano" chega ABERTO
           justamente pra mostrar essa linha. */
        const temAlgoEmCurso = g.itens.some(({ e }) => e.emCurso);
        const expandido = tocados[g.id] ?? (ehAtual || temAlgoEmCurso);

        const estado: StatusEstado = concluido
          ? "feito"
          : ehAtual
            ? "girando"
            : "a-fazer";

        return (
          <div
            key={g.id}
            className={`rounded-md border transition-colors ${
              ehAtual
                ? "border-action-primary bg-surface-card"
                : "border-border-hairline bg-surface-card"
            }`}
          >
            {/* O toggle é a área do título; o chevron é irmão dele. Botão
                dentro de botão é HTML inválido — o navegador desmonta a árvore
                e um dos dois para de responder. */}
            <div className="flex items-center gap-2 p-3.5">
              <button
                type="button"
                onClick={() => setTocados((m) => ({ ...m, [g.id]: !expandido }))}
                aria-expanded={expandido}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="shrink-0">
                  <StatusIcon estado={estado} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-body ${
                      concluido
                        ? "text-text-tertiary"
                        : ehAtual
                          ? "font-semibold text-text-primary"
                          : "text-text-muted"
                    }`}
                  >
                    {g.titulo}
                  </span>
                  <span className="mt-0.5 block text-micro text-text-tertiary">
                    {concluido ? `${total} de ${total} · concluído` : `${feitos} de ${total}`}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTocados((m) => ({ ...m, [g.id]: !expandido }))}
                aria-label={expandido ? "Fechar bloco" : "Abrir bloco"}
                /* O alvo cresce pra 40px (WCAG 2.5.8) sem o ícone mudar de
                   tamanho; a margem negativa segura o alinhamento. */
                className="-m-2.5 flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <ChevronBloco aberto={expandido} />
              </button>
            </div>

            {expandido && (
              <div className="px-3.5 pb-3.5">
                <ol className="relative flex flex-col">
                  {g.itens.map(({ e, i }, idx) => {
                    const feito = i < concluidas || !!e.jaFeito;
                    /* Pro desenho, "é a vez" e "está rodando em paralelo" são
                       o mesmo anel girando e o mesmo peso de texto. */
                    const ehAVez = i === emAndamento || !!e.emCurso;
                    const ultima = idx === g.itens.length - 1;
                    const st: StatusEstado = feito
                      ? "feito"
                      : ehAVez
                        ? "girando"
                        : "a-fazer";
                    return (
                      <li key={e.nome} className="relative flex gap-3 pb-4 last:pb-0">
                        {!ultima && (
                          <span
                            aria-hidden
                            className={`absolute left-[8px] top-[22px] bottom-0 w-px ${
                              feito ? "bg-state-success" : "bg-border-hairline"
                            }`}
                          />
                        )}
                        <span className="relative z-10 mt-0.5 shrink-0">
                          <StatusIcon estado={st} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-caption ${
                              ehAVez
                                ? "font-semibold text-text-primary"
                                : feito
                                  ? "text-text-tertiary"
                                  : "text-text-muted"
                            }`}
                          >
                            {e.nome}
                          </p>
                          {ehAVez && e.detalhe && (
                            <p className="text-micro text-text-secondary mt-1">
                              {e.detalhe}
                            </p>
                          )}
                          {ehAVez && !e.detalhe && (
                            <p className="text-micro text-state-info-text mt-1">
                              {e.deQuem === "cliente"
                                ? "É a sua vez. Dá pra sair e voltar depois, nada se perde."
                                : "Em andamento agora. Te avisaremos quando terminar."}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChevronBloco({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`text-text-tertiary transition-transform ${aberto ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
