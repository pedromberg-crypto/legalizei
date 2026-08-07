"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/confetti";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESUMO + EMISSÃO — bottom-sheet do P6 (ref. do print do Pedro, 24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * O CTA de trás (/emitir) NÃO emite mais: ele REVISA. Aperta → este sheet sobe
 * com o resumo da nota (o último olho antes do irreversível). Emitir de fato
 * acontece AQUI, no botão de dentro. Dois botões "emitir" lado a lado
 * confundiriam, então o de trás virou "Revisar nota" (a página cuida disso).
 *
 * ─── DUAS FASES, MESMO SHEET (pedido do Pedro) ──────────────────────────────
 *   · revisar → ícone "falta pouco" (documento, tom neutro/ink, NÃO é estado) +
 *     resumo + CTA "Emitir nota". Nada aconteceu ainda; nenhuma cor de estado.
 *   · enviada → o MESMO sheet, sem desmontar: o ícone vira o check laranja com o
 *     confete da marca (o mesmo do veredito 🟢), o resumo dá lugar à mensagem
 *     "está sendo emitida, a gente te avisa", e o rodapé oferece SAÍDA (voltar
 *     a navegar / emitir outra). A emissão real é assíncrona (a prefeitura
 *     processa), então a promessa honesta é "te aviso quando aparecer", não
 *     "pronto".
 *
 * ─── ALTURA TRAVADA ENTRE AS FASES ──────────────────────────────────────────
 * As 2 fases empilham na MESMA célula de um grid (col/row-start-1), cada uma
 * com o SEU cabeçalho dentro. O grid reserva a altura da fase mais alta
 * (revisar = cabeçalho + card do resumo); a enviada ocupa EXATAMENTE a mesma
 * altura → a folha não muda de tamanho de uma fase pra outra e os CTAs não
 * pulam. A enviada centraliza o grupo (ícone + título + texto) nesse espaço,
 * então o ícone desce e não cola na borda de cima.
 *
 * ⚠️ O confete resolve num check LARANJA (coral, eco do logo) — é o ícone da
 * marca, não um token de estado. O "falta pouco" usa ink (surface-dark). Coral
 * nunca é status (regra dura da paleta). Reduced-motion degrada sozinho.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ResumoNota = {
  favorecido: string;
  favorecidoSub?: string; // doc · cidade, ou linha auxiliar
  servico: string;
  servicoMeta: string;
  valor: number;
  /** 🆕 06/08 — data escolhida na tela de emitir (trava hoje/futuro), formatada pra exibição. */
  dataLabel: string;
};

const HOME = "/home-campea"; // "voltar a navegar" = a home do portal (mesma seta de trás)

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ResumoSheet({
  dados,
  onFechar,
  onReemitir,
}: {
  dados: ResumoNota;
  /** X ou toque no scrim na fase de revisão: volta pro formulário intacto. */
  onFechar: () => void;
  /** "Emitir outra": limpa o formulário e fecha (fase enviada). */
  onReemitir: () => void;
}) {
  const router = useRouter();
  const [entrou, setEntrou] = useState(false);
  const [fase, setFase] = useState<"revisar" | "enviada">("revisar");

  // Sobe deslizando (rAF pra o transform pegar a transição, não o estado inicial).
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Desce deslizando e SÓ ENTÃO roda o callback (desmonta / navega).
  const sairCom = (cb: () => void) => {
    setEntrou(false);
    window.setTimeout(cb, 240);
  };

  const enviada = fase === "enviada";

  return (
    <div className="absolute inset-0 z-50">
      {/* Scrim: fecha só na revisão (na fase enviada a saída é pelos CTAs). */}
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={enviada ? -1 : 0}
        onClick={() => {
          if (!enviada) sairCom(onFechar);
        }}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        } ${enviada ? "cursor-default" : ""}`}
      />

      {/* Folha */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col rounded-t-3xl bg-surface-page"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
        }}
      >
        {/* Cabeça fixa: grabber (puxar pra baixo / tocar fora fecha — sem X) */}
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        {/* Corpo rolável — 1 grid, as 2 fases na mesma célula (altura travada). */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* grid-cols-1 = minmax(0,1fr): trava a coluna na largura da tela.
              Sem isso o grid usa uma coluna `auto` que cresce até o max-content
              — e as linhas do resumo com `truncate` (nowrap) contribuem a
              largura INTEIRA sem quebra, estourando o container; o conteúdo
              centrava numa coluna larga demais e parecia jogado pra direita. */}
          <div className="grid grid-cols-1">
            {/* ── FASE 1: CONFERÊNCIA (cabeçalho + card do resumo) ──────────────
                É a fase MAIS ALTA → define a altura do grid. invisible na
                enviada, mas continua ocupando espaço (segura a altura). */}
            <div
              className={`col-start-1 row-start-1 ${enviada ? "invisible" : ""}`}
              aria-hidden={enviada}
            >
              <div className="flex flex-col items-center text-center">
                <MarcaRevisar on={entrou} />
                <h2 className="mt-4 text-h2 text-text-primary">
                  Confira antes de emitir
                </h2>
                <p className="mt-1 text-caption text-text-secondary">
                  Falta só confirmar pra emitir.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-border-hairline bg-surface-card p-4">
                <p className="mb-3 text-micro text-text-tertiary">Resumo da nota</p>

                <Linha rotulo="Favorecido">
                  <span className="block truncate font-semibold text-text-primary">
                    {dados.favorecido}
                  </span>
                  {dados.favorecidoSub && (
                    <span className="block truncate text-micro text-text-tertiary">
                      {dados.favorecidoSub}
                    </span>
                  )}
                </Linha>

                <Linha rotulo="Serviço">
                  <span className="block font-semibold text-text-primary">
                    {dados.servico}
                  </span>
                  <span className="block text-micro text-text-tertiary">
                    {dados.servicoMeta}
                  </span>
                </Linha>

                <Linha rotulo="Data da nota">
                  <span className="block font-semibold text-text-primary">
                    {dados.dataLabel}
                  </span>
                </Linha>

                {/* Valor da nota = o número forte. O imposto NÃO entra aqui: no
                    Simples é DAS mensal sobre receita, não retenção por nota.
                    Afirmar líquido por-nota seria número-guru. A observação
                    aponta pra aba Impostos, que cobre com dado assertivo. */}
                <div className="mt-3 flex items-baseline justify-between border-t border-border-hairline pt-3">
                  <span className="text-caption font-semibold text-text-primary">
                    Valor da nota
                  </span>
                  <span className="text-h2 font-bold text-text-primary">
                    {formatBRL(dados.valor)}
                  </span>
                </div>
                <p className="mt-2 text-micro text-text-tertiary">
                  O imposto dessa nota você acompanha na aba Impostos.
                </p>
              </div>
            </div>

            {/* ── FASE 2: APROVAÇÃO ── grupo (ícone + título + texto solto, SEM
                card) CENTRADO no mesmo espaço da conferência. invisible na
                revisar. Centrar = o ícone desce, ganha respiro do topo. */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center px-4 text-center ${
                enviada ? "" : "invisible"
              }`}
              aria-hidden={!enviada}
            >
              <MarcaSucesso mostrar={enviada} />
              <h2 className="mt-4 text-h2 text-text-primary">Nota enviada</h2>
              <p className="mt-3 max-w-[19rem] text-body text-text-secondary">
                Sua nota já entrou na fila de emissão. Assim que ficar pronta, a
                gente te avisa e ela aparece na aba{" "}
                <span className="font-semibold text-text-primary">Notas</span>.
                Pode fechar o app, o resto é com a gente.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé fixo (thumb zone + safe-area) */}
        <div
          className="shrink-0 px-6 pt-3"
          style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
        >
          {enviada ? (
            <Button full onClick={() => sairCom(() => router.push(HOME))}>
              Voltar pro início
            </Button>
          ) : (
            <Button full onClick={() => setFase("enviada")}>
              Emitir nota de {formatBRL(dados.valor)}
            </Button>
          )}
          {/* Slot do ghost RESERVADO nas 2 fases: mantém a mesma altura de
              rodapé → a folha não fica maior numa fase que na outra. Só é
              clicável/visível na enviada; na revisão fica invisible (só espaço). */}
          <div className="mt-1 flex justify-center">
            <Button
              variant="ghost"
              onClick={enviada ? () => sairCom(onReemitir) : undefined}
              tabIndex={enviada ? 0 : -1}
              aria-hidden={!enviada}
              className={enviada ? "" : "invisible"}
            >
              Emitir outra nota
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Linhas do resumo ──────────────────────────────────────────────────────
   rótulo à esquerda, conteúdo à direita (o padrão do print). */
function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-caption">
      <span className="shrink-0 pt-0.5 text-text-tertiary">{rotulo}</span>
      <span className="min-w-0 text-right">{children}</span>
    </div>
  );
}

/* ─── Marca "falta pouco" (revisar): documento em ink. NÃO é cor de estado ─── */
function MarcaRevisar({ on }: { on: boolean }) {
  return (
    <span
      className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-dark text-text-on-dark"
      style={{
        transform: on ? "scale(1)" : "scale(.6)",
        opacity: on ? 1 : 0,
        transition:
          "transform .42s cubic-bezier(.34,1.56,.64,1), opacity .22s ease",
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4" />
        <path d="M10 13h5M10 17h5" />
      </svg>
    </span>
  );
}

/* ─── Marca de sucesso (enviada): SÓ o confete da marca ──────────────────────
   O Confetti (Lottie coral) já RESOLVE num check laranja parado (eco do logo) —
   é feito pra SER o ícone (é o que "assume o círculo" no veredito 🟢). Fica só
   o coral aparecendo com os confetes. O wrapper relative dá o contexto que o
   Confetti (absolute, 180px, centrado) precisa e reserva o slot no layout. */
function MarcaSucesso({ mostrar }: { mostrar: boolean }) {
  return (
    <span className="relative flex h-16 w-16 items-center justify-center">
      {/* Confetti só monta quando a fase VIRA enviada. A fase-2 fica no DOM
          (invisible) pra segurar a altura, então se o Confetti montasse junto
          com o sheet a animação — autoplay, loop:false — tocaria ESCONDIDA na
          revisão, e quando o usuário visse já seria só o frame final parado.
          Montar sob demanda faz o confete animar na hora certa. */}
      {mostrar && <Confetti />}
    </span>
  );
}
