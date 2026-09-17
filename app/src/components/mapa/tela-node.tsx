"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { HandleFlow, NoFlow } from "@/lib/flow-layout";
import { PREVIEW_W, PREVIEW_H, ESCALA_PREVIEW, CARD_PAD_BORDA } from "@/lib/flow-layout";
import { TRILHAS } from "@/lib/trilhas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NÓS do board /mapa — mesma linguagem visual do Mermaid gerado (forma +
 * classe de `flow-data.mjs`), só que interativa. Quem já lê o mapa em
 * `produto/_flow/mapa-flow-mermaid.md` reconhece as cores de cara.
 *
 * 🆕 26/08 (pedido do Pedro: "quero que sejam as telas e não cards") — os nós
 * com `rota` mostram uma PRÉVIA AO VIVO da tela real (iframe), não só texto.
 * Mesmo truque de escala do `/mockup` (`app/src/app/mockup/page.tsx`): iframe
 * no tamanho nativo (430×932, o aparelho padrão) + `transform: scale()` pra
 * caber pequeno no nó. Mesmo truque de LAZY-MOUNT também (IntersectionObserver
 * — só monta o iframe se o nó estiver perto da viewport), porque o board tem
 * dezenas de nós e não dá pra montar todos os documentos de uma vez (é o que
 * o comentário original do `/mockup` já registrava: "estoura a RAM do note").
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Cor por `classe` — mesmas do `classDef` do gerador (`gerar-mapa.mjs`). */
const CORES: Record<string, { bg: string; borda: string; texto: string }> = {
  saida: { bg: "#fde8e4", borda: "#e0603f", texto: "#7a2d18" },
  feliz: { bg: "#e6f4ea", borda: "#2f9e5a", texto: "#1c5e37" },
  espera: { bg: "#fff4e0", borda: "#e0a03f", texto: "#7a5518" },
  branch: { bg: "#eef1ff", borda: "#5b6cf0", texto: "#2a338a" },
  inline: { bg: "#f1f1f3", borda: "#9aa0a6", texto: "#555555" },
  "": { bg: "#ffffff", borda: "#d8d8dc", texto: "#1a1a1a" },
};

const VALIDADO_DOT: Record<NoFlow["validado"], string> = {
  oficial: "🟢",
  ux: "⚪",
  pendente: "🟡",
};

function labelLinhas(label: string) {
  return label.split("<br/>");
}

function corDe(classe: string) {
  return CORES[classe] ?? CORES[""];
}

/**
 * 🆕 28/08 (pedido do Pedro) — nó "desativado" (fora da trilha ativa) usa a
 * cor PADRÃO da legenda (cinza), não a cor real da `classe`, mais um filtro
 * de dessaturação por cima da prévia ao vivo — sem isso o iframe colorido
 * continuaria gritando por baixo do card cinza. `classe` real só volta
 * quando não há trilha ativa OU a tela pertence a ela.
 */
function corEfetiva(classe: string, apagado?: boolean) {
  return apagado ? CORES[""] : corDe(classe);
}
const ESTILO_APAGADO: CSSProperties = { filter: "grayscale(1) opacity(0.5)" };

/** Largura TOTAL do card (prévia + padding + borda) — a prévia é `w-full` por
 *  dentro, então quem define o tamanho de verdade é este valor no wrapper. */
const CARD_LARGURA = PREVIEW_W * ESCALA_PREVIEW + CARD_PAD_BORDA;

/**
 * Lazy-mount, mas UMA VEZ SÓ. 🔄 26/08 (achado do Pedro: "quando movimento
 * pro outro lado as telas têm que reaparecer") — a 1ª versão desligava o
 * iframe assim que o nó saía da viewport (`onlyRenderVisibleElements` do
 * React Flow + este observer), então voltar pra ele recarregava do zero
 * toda vez. Agora: uma vez que carregou, `perto` NUNCA volta a `false` — o
 * iframe monta no máximo 1 vez por sessão, e o observer se desliga sozinho
 * depois (não precisa mais ficar escutando).
 *
 * O `atraso` (150ms) evita montar iframe de nó que só passou de raspão
 * durante um arrasto rápido pelo board — só monta quem realmente ficou
 * perto por um instante, não cada nó que piscou na margem.
 */
function usePerto() {
  const ref = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const montado = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || montado.current) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const dentro = entries[0]?.isIntersecting ?? false;
        if (dentro && !timer) {
          timer = setTimeout(() => {
            montado.current = true;
            setPerto(true);
            io.disconnect();
          }, 150);
        } else if (!dentro && timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
    };
  }, []);
  return { ref, perto };
}

/**
 * Pontos de saída nomeados — 🆕 26/08 (pedido do Pedro: "linka o CTA no
 * caminho dele, não a tela inteira"). Sem isso, toda decisão saía de 1 ponto
 * genérico do nó, misturando os N CTAs de verdade que a tela tem (ex.: E3 ·
 * Fork tem 3: "Quero abrir", "Já tenho empresa", "Entrar na minha conta").
 * Posicionado em % da PRÉVIA (não do card inteiro) — é onde o botão real
 * mora na tela, aproximado a olho a partir do layout real do componente.
 */
function HandlesSaida({
  handles,
  nodeId,
  onCtaClick,
  trilhaAtivaId,
}: {
  handles?: HandleFlow[];
  nodeId: string;
  onCtaClick?: (handleId: string) => void;
  trilhaAtivaId?: string | null;
}) {
  if (!handles?.length) return null;
  return (
    <>
      {handles.map((h) => {
        const trilha = TRILHAS.find((t) => t.deId === nodeId && t.deHandle === h.id);
        const ativa = trilha && trilha.id === trilhaAtivaId;
        return (
          <div key={h.id}>
            <Handle
              type="source"
              id={h.id}
              position={Position.Right}
              style={{ top: `${h.yPercent}%`, left: `${h.xPercent ?? 100}%`, opacity: 0 }}
            />
            {/* Bolinha clicável de verdade — 🆕 26/08 (pedido do Pedro: "CTAs
                clicáveis" pra acender a trilha inteira até a tela final). Cor
                bate com a linha que vai acender (`trilhas.ts`), então quem
                olha já antecipa qual caminho vai destacar antes de clicar. */}
            {trilha && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onCtaClick?.(h.id);
                }}
                title={trilha.nome}
                className="nodrag nopan absolute z-20 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white shadow transition-transform hover:scale-125"
                style={{
                  top: `${h.yPercent}%`,
                  left: `${h.xPercent ?? 100}%`,
                  transform: `translate(-50%, -50%) scale(${ativa ? 1.3 : 1})`,
                  background: trilha.cor,
                  boxShadow: ativa ? `0 0 0 3px ${trilha.cor}55` : undefined,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

/** Espalha N pontos entre 20%-80% (1 ponto = centro, 50%). */
function espalhar(i: number, total: number): number {
  if (total <= 1) return 50;
  return 20 + (i * 60) / (total - 1);
}

/**
 * Entrada(s) — 🆕 26/08 (achado do Pedro: "múltiplas linhas por cima uma da
 * outra, confusas"). Quando 2+ arestas chegam no MESMO nó, todas miravam o
 * MESMO ponto (Left, sem id) e os traçados colavam um no outro por boa parte
 * do caminho. `data.entradas` (calculado em `calcularLayout`) espalha em N
 * pontos — cada aresta chega num lugar diferente, os caminhos se separam.
 */
function HandlesEntrada({ total }: { total?: number }) {
  const n = total ?? 1;
  if (n <= 1) return <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Handle
          key={i}
          type="target"
          id={`in-${i}`}
          position={Position.Left}
          style={{ top: `${espalhar(i, n)}%`, opacity: 0 }}
        />
      ))}
    </>
  );
}

/** Mesma ideia que `HandlesEntrada`, mas pro lado da saída — só entra em jogo
 *  quando o nó NÃO tem `handles` nomeados próprios (senão usa `HandlesSaida`). */
function HandlesSaidaAuto({ total }: { total?: number }) {
  const n = total ?? 1;
  if (n <= 1) return <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Handle
          key={i}
          type="source"
          id={`out-${i}`}
          position={Position.Right}
          style={{ top: `${espalhar(i, n)}%`, opacity: 0 }}
        />
      ))}
    </>
  );
}

/** Prévia ao vivo da rota real, escalada. `pointer-events: none` de propósito
 *  — é referência visual, não demo interativa; sem isso, arrastar o board
 *  por cima de um nó rolaria o iframe em vez de mover o quadro. */
function PreviaTela({
  rota,
  handles,
  nodeId,
  onCtaClick,
  trilhaAtivaId,
}: {
  rota: string;
  handles?: HandleFlow[];
  nodeId: string;
  onCtaClick?: (handleId: string) => void;
  trilhaAtivaId?: string | null;
}) {
  const { ref, perto } = usePerto();
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-md border border-black/10 bg-white"
      style={{ aspectRatio: `${PREVIEW_W} / ${PREVIEW_H}` }}
    >
      {perto ? (
        <div
          style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            transform: `scale(${ESCALA_PREVIEW})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <iframe
            src={rota}
            title={rota}
            style={{ width: PREVIEW_W, height: PREVIEW_H, border: 0 }}
            loading="lazy"
            tabIndex={-1}
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-alt">
          <span className="text-[10px] text-text-tertiary">carregando…</span>
        </div>
      )}
      <HandlesSaida handles={handles} nodeId={nodeId} onCtaClick={onCtaClick} trilhaAtivaId={trilhaAtivaId} />
    </div>
  );
}

/** Retângulo com prévia ao vivo — a maioria das telas reais (`forma: "tela"`). */
export function TelaNode({ data, selected }: NodeProps & { data: NoFlow }) {
  const c = corEfetiva(data.classe, data.apagado);
  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl border-2 bg-white p-2 shadow-sm transition-shadow"
      style={{
        width: CARD_LARGURA,
        borderColor: selected ? "#F2643C" : c.borda,
        boxShadow: selected ? "0 0 0 3px rgba(242,100,60,0.25)" : undefined,
        ...(data.apagado ? ESTILO_APAGADO : null),
      }}
    >
      <HandlesEntrada total={data.entradas} />
      {data.rota ? (
        <PreviaTela rota={data.rota} handles={data.handles} nodeId={data.id} onCtaClick={data.onCtaClick} trilhaAtivaId={data.trilhaAtivaId} />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-md"
          style={{ aspectRatio: `${PREVIEW_W} / ${PREVIEW_H}`, background: c.bg }}
        >
          <span className="px-2 text-center text-[11px] font-semibold" style={{ color: c.texto }}>
            {data.label.replace(/<br\/>/g, " ")}
          </span>
        </div>
      )}
      <div className="flex items-start gap-1.5 px-0.5">
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ background: c.borda }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          {labelLinhas(data.label).map((l, i) => (
            <p
              key={i}
              className="break-words text-[11px] font-semibold leading-tight text-text-primary"
            >
              {l}
            </p>
          ))}
        </div>
        <span className="shrink-0 text-[10px]" title={`validação: ${data.validado}`}>
          {VALIDADO_DOT[data.validado]}
        </span>
      </div>
      {!data.handles?.length && <HandlesSaidaAuto total={data.saidasAuto} />}
    </div>
  );
}

/**
 * Ponto de decisão/veredito (`forma: "decisao"`) — 🔄 26/08 (pedido do Pedro:
 * "quero ter todas visualmente aparentes... não tem problema ferir a regra
 * da legenda, a gente mostra que é decisão de outra forma"). Antes era um
 * losango sem prévia — nenhuma tela de verdade aparecia. Agora usa o MESMO
 * card com prévia ao vivo do `TelaNode`, e o que sinaliza "isso é decisão"
 * é o badge losango no canto, não o formato do nó inteiro.
 */
export function DecisaoNode({ data, selected }: NodeProps & { data: NoFlow }) {
  const c = corEfetiva(data.classe, data.apagado);
  return (
    <div
      className="relative flex flex-col gap-1.5 rounded-xl border-2 bg-white p-2 shadow-sm transition-shadow"
      style={{
        width: CARD_LARGURA,
        borderColor: selected ? "#F2643C" : c.borda,
        boxShadow: selected ? "0 0 0 3px rgba(242,100,60,0.25)" : undefined,
        ...(data.apagado ? ESTILO_APAGADO : null),
      }}
    >
      <HandlesEntrada total={data.entradas} />
      {/* Badge losango — marca "ponto de decisão", não o formato do card. */}
      <div
        className="absolute -right-1.5 -top-1.5 z-10 h-4 w-4 rotate-45 rounded-[3px] border-2 bg-white"
        style={{ borderColor: c.borda }}
        title="Ponto de decisão/veredito"
        aria-hidden
      />
      {data.rota ? (
        <PreviaTela rota={data.rota} handles={data.handles} nodeId={data.id} onCtaClick={data.onCtaClick} trilhaAtivaId={data.trilhaAtivaId} />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-md"
          style={{ aspectRatio: `${PREVIEW_W} / ${PREVIEW_H}`, background: c.bg }}
        >
          <span className="px-2 text-center text-[11px] font-semibold" style={{ color: c.texto }}>
            {data.label.replace(/<br\/>/g, " ")}
          </span>
        </div>
      )}
      <div className="flex items-start gap-1.5 px-0.5">
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ background: c.borda }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          {labelLinhas(data.label).map((l, i) => (
            <p
              key={i}
              className="break-words text-[11px] font-semibold leading-tight text-text-primary"
            >
              {l}
            </p>
          ))}
        </div>
        <span className="shrink-0 text-[10px]" title={`validação: ${data.validado}`}>
          {VALIDADO_DOT[data.validado]}
        </span>
      </div>
      {!data.handles?.length && <HandlesSaidaAuto total={data.saidasAuto} />}
    </div>
  );
}

/** Pílula com prévia ao vivo — início/fim de trilha (`forma: "terminal"`). */
export function TerminalNode({ data, selected }: NodeProps & { data: NoFlow }) {
  const c = corEfetiva(data.classe || "feliz", data.apagado);
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[28px] border-2 bg-white p-2 shadow-sm"
      style={{
        width: CARD_LARGURA,
        borderColor: selected ? "#F2643C" : c.borda,
        boxShadow: selected ? "0 0 0 3px rgba(242,100,60,0.25)" : undefined,
        ...(data.apagado ? ESTILO_APAGADO : null),
      }}
    >
      <HandlesEntrada total={data.entradas} />
      {data.rota ? (
        <PreviaTela rota={data.rota} handles={data.handles} nodeId={data.id} onCtaClick={data.onCtaClick} trilhaAtivaId={data.trilhaAtivaId} />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-2xl"
          style={{ aspectRatio: `${PREVIEW_W} / ${PREVIEW_H}`, background: c.bg }}
        >
          <span className="px-2 text-center text-[11px] font-semibold" style={{ color: c.texto }}>
            {data.label.replace(/<br\/>/g, " ")}
          </span>
        </div>
      )}
      <div className="min-w-0 px-0.5 text-center">
        {labelLinhas(data.label).map((l, i) => (
          <p key={i} className="break-words text-[11px] font-semibold leading-tight text-text-primary">
            {l}
          </p>
        ))}
      </div>
      {!data.handles?.length && <HandlesSaidaAuto total={data.saidasAuto} />}
    </div>
  );
}

export const TIPOS_DE_NO = {
  tela: TelaNode,
  decisao: DecisaoNode,
  terminal: TerminalNode,
};
