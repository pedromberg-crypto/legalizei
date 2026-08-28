/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAYOUT AUTOMÁTICO do board /mapa — dagre, sem grupo/esteira.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 26/08 (pedido do Pedro) — o board segue SÓ o flow (quem leva a quem),
 * não mais agrupado por sessão (Entrada/Dinheiro/Dossiê/...) como o /mockup.
 * O `dagre` organiza os nós automaticamente pela direção das conexões —
 * ninguém arrasta caixa na mão.
 *
 * Fonte do grafo: `flow-graph.json`, gerado por `execucao/flow/gerar-mapa.mjs`
 * a partir de `flow-data.mjs` (NUNCA editado à mão — nasce do gerador).
 * ═══════════════════════════════════════════════════════════════════════════
 */
import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import { chaveAresta } from "./trilhas";

/** Ponto de saída nomeado — 1 por CTA visível na tela (botão/link que leva
 *  pra um caminho específico), em vez de 1 saída genérica pro nó inteiro.
 *  `yPercent`/`xPercent` posicionam o handle dentro da PRÉVIA (0-100). */
export interface HandleFlow {
  id: string;
  yPercent: number;
  xPercent?: number;
}

export interface NoFlow extends Record<string, unknown> {
  id: string;
  rota: string | null;
  label: string;
  forma: "tela" | "decisao" | "terminal";
  classe: string;
  status: "construida" | "planejada";
  validado: "oficial" | "ux" | "pendente";
  falta: string;
  dados: string;
  handles?: HandleFlow[];
  /** 🆕 26/08 (calculado em `calcularLayout`, não vem do `flow-graph.json`) —
   *  quantas arestas chegam/saem deste nó sem ponto nomeado próprio. >1 vira
   *  N handles espalhados (em vez de 1 só), pra 2 linhas nunca ficarem uma
   *  em cima da outra por convergirem no mesmo pixel. */
  entradas?: number;
  saidasAuto?: number;
  /** 🆕 26/08 (injetado por `/mapa/page.tsx`, não vem do `flow-graph.json`) —
   *  clique num CTA nomeado ativa a trilha correspondente (`trilhas.ts`). */
  onCtaClick?: (handleId: string) => void;
  trilhaAtivaId?: string | null;
  /** 🆕 28/08 (injetado por `/mapa/page.tsx`) — true quando uma trilha está
   *  ativa e esta tela NÃO pertence a ela. `tela-node.tsx` renderiza cinza
   *  padrão nesse caso ("desativada"), independente da `classe` real. */
  apagado?: boolean;
}

export interface ArestaFlow {
  de: string;
  para: string;
  label: string;
  tracejado: boolean;
  /** Qual `handles[].id` do nó `de` esta aresta sai — casa o CTA certo com
   *  o caminho certo. Ausente = sai do ponto genérico do nó (compatível). */
  deHandle?: string;
}

export interface FlowGraph {
  nodes: NoFlow[];
  edges: ArestaFlow[];
}

/**
 * Tamanho por forma — dagre precisa de um bounding box pra calcular o layout.
 * 🆕 26/08 (pedido do Pedro: "quero que sejam as telas e não cards") — `tela`
 * e `terminal` cresceram pra caber uma PRÉVIA AO VIVO da rota real (mesma
 * proporção do aparelho padrão do `/mockup`, 430×932 — iPhone 15 Pro Max),
 * não só um rótulo. `decisao` (veredito/triagem inline, sem `rota`) continua
 * pequena — não existe tela real pra mostrar ali.
 */
export const PREVIEW_W = 430;
export const PREVIEW_H = 932;
export const ESCALA_PREVIEW = 0.34;

/** Padding (p-2 = 8px×2) + borda (border-2 = 2px×2) do card em `tela-node.tsx`
 *  — some da largura útil, então precisa entrar na largura TOTAL do card
 *  (senão a prévia, com largura fixa, transborda pra fora da borda). */
export const CARD_PAD_BORDA = 20;

/** 🔄 26/08 — `decisao` ganhou prévia ao vivo igual `tela` (ver `tela-node.tsx`
 *  `DecisaoNode`), então precisa do MESMO tamanho — não é mais losango pequeno. */
const TAMANHO: Record<NoFlow["forma"], { w: number; h: number }> = {
  tela: { w: PREVIEW_W * ESCALA_PREVIEW + CARD_PAD_BORDA, h: PREVIEW_H * ESCALA_PREVIEW + 46 },
  decisao: { w: PREVIEW_W * ESCALA_PREVIEW + CARD_PAD_BORDA, h: PREVIEW_H * ESCALA_PREVIEW + 46 },
  terminal: { w: PREVIEW_W * ESCALA_PREVIEW + CARD_PAD_BORDA, h: PREVIEW_H * ESCALA_PREVIEW + 46 },
};

export type Orientacao = "TB" | "LR";

/**
 * Roda o dagre e devolve nós/arestas já no formato do React Flow, com `x,y`
 * calculados. `data` de cada nó carrega o `NoFlow` inteiro pro componente
 * customizado ler (rota, status, falta, dados...).
 */
export function calcularLayout(
  grafo: FlowGraph,
  orientacao: Orientacao = "TB",
): { nodes: Node<NoFlow>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  // 🔄 26/08 (achado do Pedro: "informações escondidas, linhas embaraladas")
  // — `decisao` virou do tamanho de `tela` (prévia ao vivo), então o
  // nodesep/ranksep antigo (calibrado pro losango pequeno de 170×90) não
  // dava espaço nem pros cards nem pro rótulo da aresta — cards coladinhos
  // encavalavam e o texto do meio ficava por baixo do próximo card.
  g.setGraph({ rankdir: orientacao, nodesep: 100, ranksep: 160, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of grafo.nodes) {
    const t = TAMANHO[n.forma] ?? TAMANHO.tela;
    g.setNode(n.id, { width: t.w, height: t.h });
  }
  for (const e of grafo.edges) {
    if (!g.hasNode(e.de) || !g.hasNode(e.para)) continue;
    // Reserva espaço de verdade pro rótulo da aresta no cálculo do dagre —
    // sem isso o texto ("quero abrir / migrar", "fora de BH"...) não entrava
    // na conta de espaçamento e sobrava só a sorte pra não ficar por baixo
    // de um card vizinho.
    const largura = e.label ? e.label.length * 6.2 + 24 : 0;
    g.setEdge(e.de, e.para, { label: e.label || "", width: largura, height: 24, labelpos: "c" });
  }

  dagre.layout(g);

  const porId = new Map(grafo.nodes.map((n) => [n.id, n]));
  const arestasValidas = grafo.edges.filter((e) => porId.has(e.de) && porId.has(e.para));

  /**
   * 🆕 26/08 (achado do Pedro: "múltiplas linhas passam por cima uma da
   * outra, bem confusas") — quando 2+ arestas chegam no MESMO nó (ou saem
   * dele sem CTA nomeado), `getSmoothStepPath` mira o mesmo ponto de handle
   * pras duas, e os traçados colam um no outro por boa parte do caminho.
   * Fix: espalhar automaticamente em N handles (Left pra entrada, Right pra
   * saída sem `handles` própria) — cada aresta ganha seu próprio ponto de
   * chegada/saída, os caminhos se separam geometricamente sozinhos.
   */
  const porAlvo = new Map<string, ArestaFlow[]>();
  const porOrigemAuto = new Map<string, ArestaFlow[]>();
  for (const e of arestasValidas) {
    (porAlvo.get(e.para) ?? porAlvo.set(e.para, []).get(e.para)!).push(e);
    if (!e.deHandle) {
      (porOrigemAuto.get(e.de) ?? porOrigemAuto.set(e.de, []).get(e.de)!).push(e);
    }
  }

  const nodes: Node<NoFlow>[] = grafo.nodes.map((n) => {
    const pos = g.node(n.id);
    const t = TAMANHO[n.forma] ?? TAMANHO.tela;
    const entradas = porAlvo.get(n.id)?.length ?? 0;
    const saidasAuto = !n.handles?.length ? (porOrigemAuto.get(n.id)?.length ?? 0) : 0;
    return {
      id: n.id,
      type: n.forma, // "tela" | "decisao" | "terminal" — casa com os nodeTypes
      position: { x: (pos?.x ?? 0) - t.w / 2, y: (pos?.y ?? 0) - t.h / 2 },
      data: { ...n, entradas: entradas > 1 ? entradas : undefined, saidasAuto: saidasAuto > 1 ? saidasAuto : undefined },
      draggable: true,
    };
  });

  const edges: Edge[] = arestasValidas.map((e) => {
    const grupoAlvo = porAlvo.get(e.para) ?? [];
    const idxAlvo = grupoAlvo.length > 1 ? grupoAlvo.indexOf(e) : -1;
    const grupoOrigem = !e.deHandle ? porOrigemAuto.get(e.de) : undefined;
    const idxOrigem = grupoOrigem && grupoOrigem.length > 1 ? grupoOrigem.indexOf(e) : -1;
    return {
      // 🆕 26/08 — id inclui o handle: sem isso, 2 CTAs do MESMO nó indo pro
      // MESMO destino (ex.: "abrir" e "já tenho empresa" caindo os dois em
      // E3.2) colidiam no mesmo id `${de}->${para}` e um sumia.
      id: `${e.de}${e.deHandle ? `#${e.deHandle}` : idxOrigem >= 0 ? `#o${idxOrigem}` : ""}->${e.para}${idxAlvo >= 0 ? `#i${idxAlvo}` : ""}`,
      source: e.de,
      sourceHandle: e.deHandle || (idxOrigem >= 0 ? `out-${idxOrigem}` : undefined),
      target: e.para,
      targetHandle: idxAlvo >= 0 ? `in-${idxAlvo}` : undefined,
      label: e.label || undefined,
      animated: false,
      style: e.tracejado ? { strokeDasharray: "5 4" } : undefined,
      // 🆕 26/08 — chave estável (não o `id` acima, que já carrega índices
      // de espalhamento) pra `/mapa/page.tsx` casar esta aresta contra o
      // conjunto calculado por `calcularArestasTrilha` (trilhas.ts).
      data: { chave: chaveAresta(e.de, e.para, e.deHandle) },
      // `rotulo` (custom, `components/mapa/flow-edge.tsx`) — traçado fica no
      // zIndex normal (atrás dos cards, nunca risca a prévia), rótulo vai por
      // um portal HTML sempre acima de tudo. Ver o comentário lá pro porquê.
      type: "rotulo",
    };
  });

  return { nodes, edges };
}
