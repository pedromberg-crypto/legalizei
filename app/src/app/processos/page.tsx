"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import grafo from "@/lib/processos-graph.json";
import { TIPOS_DE_PASSO, type Passo } from "@/components/processos/passo-node";
import { PainelE2E } from "@/components/processos/painel-e2e";
import { TIPOS_DE_CAMINHO } from "@/components/processos/caminho-edge";
import { PASSO_W, PASSO_H, RESPIRO, RESPIRO_ARESTA } from "@/lib/processos-medidas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /processos — BOARD DOS PROCESSOS (11/09, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * Primo do /mapa, e a diferença é o ponto: o /mapa mostra TELAS conectadas;
 * este mostra O QUE PRECISA ACONTECER, sem tela nenhuma. Nasceu da provocação
 * do Pedro em 11/09: "desenhar o flow a nível de chamadas, APIs e endpoints,
 * pra enxergar se tudo está coberto — desde o download de uma fatura até a
 * adição de um produto na fatura".
 *
 * 🔴 O CONTEÚDO NÃO MORA AQUI. Este arquivo só desenha. A fonte é
 * `execucao/processos/processos-data.mjs`, e `processos-graph.json` é GERADO
 * por `node execucao/processos/gerar-processos.mjs`. Editar nó aqui dentro
 * quebra a regra que existe porque o `portal-data.mjs` ficou parado de 03/08 a
 * 11/09 enquanto o produto andava.
 *
 * O que a tela faz:
 *   · quadro infinito (React Flow): zoom, pan, arrastar nó
 *   · layout automático (dagre) — ninguém posiciona cartão à mão
 *   · filtro por processo, pra isolar um caminho dos outros
 *   · clicar um nó abre o painel com a FONTE da regra e a DÚVIDA aberta
 *   · CTA de E2E, que só o Pedro aperta (ver `painel-e2e.tsx`)
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Proc = { id: string; titulo: string; resumo: string; porqueImporta: string };

const LEGENDA = [
  { luz: "verde", emoji: "🟢", nome: "Sabemos e dá", cor: "#17A06A" },
  { luz: "amarelo", emoji: "🟡", nome: "Falta decidir", cor: "#D6A400" },
  { luz: "vermelho", emoji: "🔴", nome: "Não sabemos", cor: "#D64A2D" },
] as const;

export default function ProcessosPage() {
  const processos = grafo.processos as Proc[];
  const [filtro, setFiltro] = useState<string>("todos");
  /**
   * Orientação do board. Nasce HORIZONTAL por pedido do Pedro em 11/09
   * ("acho mais confortável que vertical"), e a escolha fica gravada no
   * navegador: trocar a cada carregamento seria pior que não ter o botão.
   * `useState` com função pra ler o localStorage UMA vez, e dentro de try
   * porque navegador em aba anônima pode recusar o acesso.
   */
  const [ori, setOri] = useState<"TB" | "LR">(() => {
    if (typeof window === "undefined") return "LR";
    try {
      const g = window.localStorage.getItem("processos:ori");
      return g === "TB" || g === "LR" ? g : "LR";
    } catch {
      return "LR";
    }
  });

  function virar() {
    const nova = ori === "LR" ? "TB" : "LR";
    setOri(nova);
    try {
      window.localStorage.setItem("processos:ori", nova);
    } catch {
      /* sem memória: a troca vale pra esta sessão e pronto */
    }
  }

  const [selecionado, setSelecionado] = useState<Passo | null>(null);
  const [e2eAberto, setE2eAberto] = useState(false);

  const { nodes, edges } = useMemo(() => {
    const passos = (grafo.nodes as Passo[]).filter(
      (p) => filtro === "todos" || p.processo === filtro,
    );
    const vivos = new Set(passos.map((p) => p.id));
    const arestas = (grafo.edges as { de: string; para: string; label: string; tracejado: boolean }[])
      .filter((a) => vivos.has(a.de) && vivos.has(a.para));

    const g = new dagre.graphlib.Graph();
    /**
     * 🔴 Tamanho e respiro vêm de `processos-medidas.ts`, e de mais lugar
     * nenhum. Foi ter escrito a altura aqui (190) diferente da altura real do
     * cartão (~286) que fez os cartões se sobreporem em 11/09.
     */
    const r = RESPIRO[ori];
    g.setGraph({
      rankdir: ori,
      nodesep: r.entre,
      ranksep: r.fileiras,
      edgesep: RESPIRO_ARESTA,
      marginx: 40,
      marginy: 40,
    });
    g.setDefaultEdgeLabel(() => ({}));
    passos.forEach((p) => g.setNode(p.id, { width: PASSO_W, height: PASSO_H }));
    arestas.forEach((a) => g.setEdge(a.de, a.para));
    dagre.layout(g);

    const ns: Node<Passo>[] = passos.map((p) => {
      const pos = g.node(p.id);
      return {
        id: p.id,
        type: p.forma,
        position: { x: pos.x - PASSO_W / 2, y: pos.y - PASSO_H / 2 },
        data: { ...p, ori },
      };
    });

    const es: Edge[] = arestas.map((a) => ({
      id: `${a.de}->${a.para}`,
      source: a.de,
      target: a.para,
      type: "caminho",
      // 🔑 o dagre JÁ calcula um caminho que desvia dos cartões (é pra isso que
      // ele insere pontos intermediários). Antes eu jogava isso fora e deixava
      // o React Flow ligar as pontas em reta — foi o que fez a linha do
      // "até R$ 50" atravessar o cartão do P4.4 inteiro.
      data: {
        pontos: g.edge(a.de, a.para)?.points ?? [],
        rotulo: a.label || "",
        tracejado: a.tracejado,
      },
      style: {
        stroke: a.tracejado ? "#D64A2D" : "#a1a1aa",
        strokeWidth: 1.7,
        strokeDasharray: a.tracejado ? "6 4" : undefined,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: a.tracejado ? "#D64A2D" : "#a1a1aa" },
    }));

    return { nodes: ns, edges: es };
  }, [filtro, ori]);

  const placar = useMemo(() => {
    const alvo = (grafo.nodes as Passo[]).filter(
      (p) => filtro === "todos" || p.processo === filtro,
    );
    return LEGENDA.map((l) => ({ ...l, n: alvo.filter((p) => p.luz === l.luz).length }));
  }, [filtro]);

  const aoClicar: NodeMouseHandler = (_, no) => setSelecionado(no.data as Passo);

  return (
    <div className="flex h-dvh flex-col bg-zinc-50">
      {/* ── barra ───────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Link href="/apresentacao" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900">
          ← voltar
        </Link>
        <h1 className="text-[15px] font-bold text-zinc-900">Processos</h1>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-[13px] font-semibold text-zinc-800"
        >
          <option value="todos">Todos os processos</option>
          {processos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} · {p.titulo}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          {placar.map((l) => (
            <span key={l.luz} className="text-[12px] font-semibold text-zinc-600">
              {l.emoji} {l.n}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={virar}
          className="ml-auto rounded-lg border border-zinc-300 px-3 py-1.5 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50"
          title="Alterna entre o board na horizontal e na vertical"
        >
          {ori === "LR" ? "⇅ Vertical" : "⇄ Horizontal"}
        </button>

        <button
          type="button"
          onClick={() => setE2eAberto(true)}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-[13px] font-bold text-white hover:bg-zinc-700"
        >
          ▶ Passar E2E
        </button>
      </header>

      {/* ── quadro ──────────────────────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={TIPOS_DE_PASSO}
          edgeTypes={TIPOS_DE_CAMINHO}
          onNodeClick={aoClicar}
          onPaneClick={() => setSelecionado(null)}
          fitView
          minZoom={0.15}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#d4d4d8" />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable nodeColor={(n) => (n.data as Passo).cor} />
        </ReactFlow>

        {/* ── painel do passo ───────────────────────────────────────────── */}
        {selecionado && (
          <aside className="absolute right-3 top-3 max-h-[calc(100%-24px)] w-[360px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide" style={{ color: selecionado.cor }}>
                  {selecionado.id} · {selecionado.processo}
                </p>
                <p className="text-[15px] font-bold leading-tight text-zinc-900">
                  {selecionado.titulo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelecionado(null)}
                className="shrink-0 text-zinc-400 hover:text-zinc-900"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <Campo rotulo="Quem dispara" valor={selecionado.quem} />
            <Campo rotulo="O que a casa faz" valor={selecionado.faz} />
            <Campo rotulo="Com quem fala" valor={selecionado.fala} />
            <Campo rotulo="O que a pessoa vê" valor={selecionado.ve} />

            {selecionado.fonte && selecionado.fonte !== "—" && (
              <Campo rotulo="De onde vem a regra" valor={selecionado.fonte} />
            )}

            {selecionado.duvida && (
              <div className="mt-3 rounded-xl border-l-4 p-3" style={{ borderColor: selecionado.cor, background: "#fafafa" }}>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  O que precisa ser respondido
                </p>
                <p className="text-[12px] leading-relaxed text-zinc-700">{selecionado.duvida}</p>
              </div>
            )}
          </aside>
        )}

        {e2eAberto && (
          <PainelE2E processo={filtro} onFechar={() => setE2eAberto(false)} />
        )}
      </div>
    </div>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="mt-3 border-t border-zinc-100 pt-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{rotulo}</p>
      <p className="text-[12px] leading-relaxed text-zinc-700">{valor}</p>
    </div>
  );
}
