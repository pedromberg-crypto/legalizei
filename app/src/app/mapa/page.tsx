"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import grafo from "@/lib/flow-graph.json";
import { calcularLayout, type NoFlow, type Orientacao } from "@/lib/flow-layout";
import { TIPOS_DE_NO } from "@/components/mapa/tela-node";
import { TIPOS_DE_ARESTA } from "@/components/mapa/flow-edge";
import { TRILHAS, calcularArestasTrilha, nosDaTrilha } from "@/lib/trilhas";
import { DADOS_CONSTITUICAO_MD } from "@/lib/dados-constituicao";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /mapa — BOARD INTERATIVO DO FLOW (26/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * Substitui o "mapa mental" manual do `/mockup` (SVG desenhado à mão sobre
 * `MAPA_EDGES`, uma lista traduzida e sujeita a ficar velha). Aqui:
 *
 *   · Fonte única de verdade: `flow-graph.json`, gerado por
 *     `execucao/flow/gerar-mapa.mjs` a partir de `flow-data.mjs` — NUNCA
 *     editado à mão. Rodar o gerador de novo atualiza este board sozinho.
 *   · Layout automático (dagre), sem agrupar por sessão — só a ordem real
 *     de quem leva a quem (pedido explícito do Pedro: "não precisamos seguir
 *     isso [grupo], eu quero que siga o flow").
 *   · Quadro infinito: zoom, arrastar (pan), arrastar nó — tudo do React Flow,
 *     de graça.
 *   · Clicar um nó abre o painel de detalhe (status, o que falta, o que essa
 *     etapa coleta) + link pra abrir a tela de verdade.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const LEGENDA_COR: { classe: string; nome: string; cor: string }[] = [
  { classe: "", nome: "Padrão", cor: "#d8d8dc" },
  { classe: "feliz", nome: "Rota feliz / terminal de sucesso", cor: "#2f9e5a" },
  { classe: "saida", nome: "Saída graciosa (não atende / bloqueio)", cor: "#e0603f" },
  { classe: "espera", nome: "Espera / pausa assíncrona", cor: "#e0a03f" },
  { classe: "branch", nome: "Ramo/variação inline", cor: "#5b6cf0" },
  { classe: "inline", nome: "Passo interno (não é tela própria)", cor: "#9aa0a6" },
];

const ORIENTACAO: Orientacao = "LR";

// 🆕 28/08 (pedido do Pedro) — `TRILHAS` cresceu de 3 pra 8 (abrir/migrar/
// login genéricas + 4 por regime). As 3 genéricas continuam disparando pelo
// pontinho do E3 no canvas (`onCtaClick`); as 4 de regime só disparam pelo
// botão da legenda (ver `TRILHAS_REGIME` abaixo) — por isso ficam em listas
// separadas na legenda, não misturadas na mesma.
const IDS_CANVAS = new Set(["abrir", "migrar", "login"]);
const TRILHAS_CANVAS = TRILHAS.filter((t) => IDS_CANVAS.has(t.id));
const TRILHAS_REGIME = TRILHAS.filter((t) => !IDS_CANVAS.has(t.id));

export default function MapaPage() {
  const [selecionado, setSelecionado] = useState<NoFlow | null>(null);
  // 🆕 26/08 (pedido do Pedro) — clicar um CTA do E3 acende a trilha inteira
  // (todas as arestas do caminho, 1 cor só) até a tela de conclusão de cada
  // fluxo. Clicar o MESMO CTA de novo apaga (toggle).
  const [trilhaAtivaId, setTrilhaAtivaId] = useState<string | null>(null);
  // 🔄 26/08 (achado do Pedro: "quando seleciono uma linha única não fica
  // coral") — o `selected` embutido do React Flow não estava confiável aqui.
  // Clique de aresta agora é estado NOSSO, mesmo padrão já validado da
  // trilha — garante que funciona, não depende de mecanismo interno da lib.
  const [arestaClicadaChave, setArestaClicadaChave] = useState<string | null>(null);

  const { nodes: nodesBase, edges: edgesBase } = useMemo(
    () => calcularLayout(grafo as Parameters<typeof calcularLayout>[0], ORIENTACAO),
    [],
  );

  const onCtaClick = useCallback((handleId: string) => {
    const trilha = TRILHAS.find((t) => t.deHandle === handleId);
    if (!trilha) return;
    setTrilhaAtivaId((atual) => (atual === trilha.id ? null : trilha.id));
  }, []);

  const arestasDaTrilha = useMemo(() => {
    if (!trilhaAtivaId) return null;
    const trilha = TRILHAS.find((t) => t.id === trilhaAtivaId);
    return trilha ? calcularArestasTrilha(grafo as Parameters<typeof calcularLayout>[0], trilha) : null;
  }, [trilhaAtivaId]);

  // 🆕 28/08 (pedido do Pedro) — as TELAS que não pertencem à trilha ativa
  // ficam "desativadas" (cinza-padrão, ver `tela-node.tsx`), não só as linhas.
  const nosAtivos = useMemo(
    () => (arestasDaTrilha ? nosDaTrilha(arestasDaTrilha) : null),
    [arestasDaTrilha],
  );

  /**
   * 🔄 01/09 (pedido do Pedro) — com uma trilha ativa, as telas de fora dela
   * SOMEM do canvas em vez de ficarem cinzas. O cinza ainda deixava tudo na
   * tela e continuava gerando confusão ("qual é o caminho mesmo?"): a leitura
   * boa é o flow escolhido sozinho, sem ruído em volta.
   *
   * `hidden` é do próprio React Flow — o nó sai do render E do cálculo de
   * arestas, então não sobra linha solta apontando pra lugar nenhum.
   * `apagado` continua sendo passado pra manter o contrato do `tela-node`
   * (nada mais o usa quando o nó está escondido, mas o tipo segue válido).
   */
  const nodes = useMemo(
    () =>
      nodesBase.map((n) => {
        const foraDaTrilha = !!nosAtivos && !nosAtivos.has(n.id);
        return {
          ...n,
          hidden: foraDaTrilha,
          data: {
            ...n.data,
            onCtaClick,
            trilhaAtivaId,
            apagado: foraDaTrilha,
          },
        };
      }),
    [nodesBase, onCtaClick, trilhaAtivaId, nosAtivos],
  );

  const edges = useMemo(() => {
    const cor = trilhaAtivaId ? TRILHAS.find((t) => t.id === trilhaAtivaId)?.cor : undefined;
    return edgesBase.map((e) => {
      const chave = (e.data as { chave?: string } | undefined)?.chave;
      const emTrilha = !!chave && !!arestasDaTrilha?.has(chave);
      const clicada = !!chave && chave === arestaClicadaChave;
      // 🔄 26/08 (achado do Pedro: "linha passando em cima da tela de novo")
      // — SEM zIndex aqui. É exatamente o bug que já corrigimos uma vez: dar
      // zIndex maior pra aresta (mesmo só a da trilha) faz o TRAÇADO desenhar
      // por cima do card. A cor/destaque já vem só de `corTrilha`/`clicada` —
      // o traçado continua sempre atrás, sempre, sem exceção pra ninguém.
      // 🔄 01/09 — mesma regra dos nós: fora da trilha, some (não fica cinza).
      return {
        ...e,
        hidden: !!arestasDaTrilha && !emTrilha,
        data: {
          ...e.data,
          corTrilha: emTrilha ? cor : undefined,
          apagado: !!arestasDaTrilha && !emTrilha,
          clicada,
        },
      };
    });
  }, [edgesBase, arestasDaTrilha, trilhaAtivaId, arestaClicadaChave]);

  /**
   * 🆕 01/09 — reenquadra quando a trilha liga/desliga. Sem isso, esconder as
   * telas de fora deixa o flow escolhido pequeno num canto (o zoom continua o
   * do mapa inteiro) e a pessoa tem que caçar o que sobrou.
   *
   * Guardo a instância pelo `onInit` em vez de usar `useReactFlow()`: o hook
   * exige que o componente esteja DENTRO de um `<ReactFlowProvider>`, e aqui
   * o `<ReactFlow>` é filho desta mesma página. `requestAnimationFrame` dá o
   * frame que a lib precisa pra aplicar o `hidden` antes de medir.
   */
  // Guardo só o que uso: tipar como `ReactFlowInstance` puxa os genéricos de
  // Node/Edge inferidos do nosso grafo e briga com a assinatura da lib.
  const fluxoRef = useRef<{
    fitView: (opcoes?: { duration?: number; padding?: number }) => void;
  } | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fluxoRef.current?.fitView({ duration: 400, padding: 0.15 });
    });
    return () => cancelAnimationFrame(id);
  }, [trilhaAtivaId]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node: Node) => {
    setSelecionado((node.data as NoFlow) ?? null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge: Edge) => {
    const chave = (edge.data as { chave?: string } | undefined)?.chave;
    if (!chave) return;
    setArestaClicadaChave((atual) => (atual === chave ? null : chave));
  }, []);

  // 🆕 26/08 (pedido do Pedro) — baixa o `.md` GERADO (nunca editado à mão,
  // nasce de `flow-data.mjs` via `gerar-mapa.mjs`) direto do board, sem
  // precisar abrir o Obsidian. Download client-side puro (Blob + link
  // temporário) — não precisa de rota de API pra isso.
  const baixarDadosConstituicao = useCallback(() => {
    const blob = new Blob([DADOS_CONSTITUICAO_MD], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dados-coletados-abertura-ate-viabilidade.md";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#f7f7f8]">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-border-hairline bg-surface-card px-5 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/mockup"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-hairline text-text-secondary transition-colors hover:border-border-strong"
            aria-label="Voltar pro mockup"
            title="Voltar pro /mockup"
          >
            ←
          </Link>
          <div>
            <p className="text-micro font-semibold tracking-wide text-text-tertiary">
              Legalizai · mapa do flow
            </p>
            <h1 className="text-body-strong font-semibold text-text-primary">
              {grafo.nodes.length} telas · {grafo.edges.length} conexões
            </h1>
          </div>
        </div>

        {/* Trilha ativa — 🆕 26/08. Clicar de novo no mesmo CTA (ou no canvas
            vazio) apaga; este botão é só mais um jeito de limpar. */}
        {trilhaAtivaId && (
          <button
            type="button"
            onClick={() => setTrilhaAtivaId(null)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors"
            style={{
              borderColor: TRILHAS.find((t) => t.id === trilhaAtivaId)?.cor,
              color: TRILHAS.find((t) => t.id === trilhaAtivaId)?.cor,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: TRILHAS.find((t) => t.id === trilhaAtivaId)?.cor }}
              aria-hidden
            />
            Trilha: {TRILHAS.find((t) => t.id === trilhaAtivaId)?.nome} ✕
          </button>
        )}
      </header>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={TIPOS_DE_NO}
          edgeTypes={TIPOS_DE_ARESTA}
          onInit={(inst) => {
            fluxoRef.current = inst;
          }}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          /**
           * 🔄 01/09 (pedido do Pedro) — clicar no canvas vazio NÃO desliga
           * mais a trilha. Com a trilha filtrando o mapa (as outras telas
           * somem), desligar por clique acidental fazia o mapa inteiro voltar
           * do nada, no meio de uma leitura. A trilha agora só sai clicando de
           * novo no MESMO botão que a ligou — o mesmo lugar, o mesmo gesto.
           *
           * O painel de detalhe e o destaque de aresta continuam fechando
           * aqui: esses são leitura pontual, não filtro do mapa.
           */
          onPaneClick={() => {
            setSelecionado(null);
            setArestaClicadaChave(null);
          }}
          fitView
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d8d8dc" />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => {
              const d = n.data as unknown as NoFlow;
              const cores: Record<string, string> = {
                saida: "#e0603f",
                feliz: "#2f9e5a",
                espera: "#e0a03f",
                branch: "#5b6cf0",
                inline: "#9aa0a6",
                "": "#d8d8dc",
              };
              return cores[d?.classe ?? ""] ?? "#d8d8dc";
            }}
          />
        </ReactFlow>

        {/* ── Legenda flutuante (sempre visível, sem CTA) ────────────────── */}
        <div
          className="absolute left-4 top-4 z-20 w-72 origin-top-left rounded-xl border border-border-hairline bg-surface-card p-4 shadow-lg"
          style={{ transform: "scale(0.77)" }}
        >
          <p className="mb-2 text-caption font-semibold text-text-primary">Formas</p>
          <div className="mb-3 flex flex-col gap-1.5 text-micro text-text-secondary">
            <p>▭ Retângulo — tela real</p>
            <p>◆ Badge losango no canto — decisão/veredito (prévia normal por trás)</p>
            <p>⬭ Pílula — início/fim de trilha</p>
          </div>
          <p className="mb-2 text-caption font-semibold text-text-primary">Cores</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {LEGENDA_COR.map((l) => (
              <div key={l.classe} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm border"
                  style={{ background: l.cor, borderColor: l.cor }}
                />
                <span className="text-micro text-text-secondary">{l.nome}</span>
              </div>
            ))}
          </div>
          {/* 🆕 26/08 (pedido do Pedro) — legenda das 3 trilhas clicáveis do
              E3 · Fork, mesma cor da bolinha/linha que cada CTA acende. */}
          <p className="mb-2 text-caption font-semibold text-text-primary">Trilhas (clique no CTA do E3)</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {TRILHAS_CANVAS.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.cor }} />
                <span className="text-micro text-text-secondary">{t.nome}</span>
              </div>
            ))}
          </div>

          {/* 🆕 28/08 (pedido do Pedro) — 4 CTAs de verdade, um por
              flow×regime. Clicáveis AQUI (não pelo pontinho do canvas, que
              é 1:1 por handle): clicar acende a trilha inteira em cor.
              🔄 01/09 (pedido do Pedro) — as telas de fora da trilha agora
              SOMEM (antes ficavam cinzas, e o cinza ainda confundia), e a
              trilha só desliga clicando DE NOVO no mesmo botão: clique no
              canvas vazio não desliga mais. */}
          <p className="mb-2 text-caption font-semibold text-text-primary">Fluxos (clique aqui)</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {TRILHAS_REGIME.map((t) => {
              const ativa = t.id === trilhaAtivaId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTrilhaAtivaId((atual) => (atual === t.id ? null : t.id))}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-alt"
                  style={ativa ? { background: `${t.cor}1a` } : undefined}
                >
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.cor }} />
                  <span
                    className="text-micro font-semibold"
                    style={{ color: ativa ? t.cor : "var(--color-text-secondary)" }}
                  >
                    {t.nome}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 🆕 26/08 (pedido do Pedro) — baixa o .md gerado (dados coletados
              até a 1ª tentativa de viabilidade), sempre em dia com o flow. */}
          <button
            type="button"
            onClick={baixarDadosConstituicao}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-action-primary-sm px-3 py-2 text-caption font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
          >
            ↓ Baixar dados coletados constituição
          </button>
        </div>

        {/* ── Painel de detalhe (clique num nó) ──────────────────────────── */}
        {selecionado && (
          <div className="absolute right-4 top-4 z-20 w-80 max-w-[90vw] rounded-xl border border-border-hairline bg-surface-card p-4 shadow-lg">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-body-strong font-semibold text-text-primary">
                {selecionado.label.replace(/<br\/>/g, " · ")}
              </h2>
              <button
                onClick={() => setSelecionado(null)}
                className="shrink-0 text-text-tertiary hover:text-text-primary"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-secondary">
                {selecionado.status === "construida" ? "construída" : "planejada"}
              </span>
              <span className="rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-secondary">
                validado: {selecionado.validado}
              </span>
            </div>

            {selecionado.rota && (
              <a
                href={selecionado.rota}
                target="_blank"
                rel="noreferrer"
                className="mb-3 flex items-center justify-center gap-1.5 rounded-md bg-action-primary-sm px-3 py-2 text-caption font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Abrir tela real → {selecionado.rota}
              </a>
            )}

            {selecionado.dados && (
              <div className="mb-3">
                <p className="mb-1 text-micro font-semibold text-text-tertiary">
                  Dados coletados nesta etapa
                </p>
                <p className="text-caption text-text-secondary">{selecionado.dados}</p>
              </div>
            )}

            {selecionado.falta && (
              <div>
                <p className="mb-1 text-micro font-semibold text-text-tertiary">Notas / o que falta</p>
                <p className="text-caption text-text-secondary">{selecionado.falta}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
