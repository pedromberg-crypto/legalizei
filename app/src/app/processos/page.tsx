"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { PASSO_W, RESPIRO, RESPIRO_ARESTA, alturaDo } from "@/lib/processos-medidas";

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

/**
 * Cinza-claro é o estado "isto é opinião minha, não decisão sua" — o pedido
 * literal do Pedro. Aceita, a aresta passa a valer e vira a cor normal.
 */
const CINZA_PROPOSTA = "#c4c4c8";

function corDaAresta(
  a: { tracejado?: boolean; proposta?: string },
  estado: string | null,
) {
  if (a.proposta && estado !== "aceita") return CINZA_PROPOSTA;
  return a.tracejado ? "#D64A2D" : "#a1a1aa";
}

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

  /**
   * ── CAMADA DE SUGESTÃO (11/09, dinâmica combinada com o Pedro) ───────────
   * Sugestão minha entra no board em cinza, com ✕ e ✓. A decisão dele mora em
   * `execucao/processos/decisoes-propostas.json`, escrita pela `/api/propostas`.
   *
   * 🔑 Lida em tempo de EXECUÇÃO, não embutida no `processos-graph.json`. Se
   * a decisão viesse do arquivo gerado, cada clique exigiria rodar o gerador
   * de novo pra aparecer — e aí o ✓ não seria um clique, seria uma tarefa.
   *
   * Fora de dev a rota devolve 404 e tudo fica pendente (cinza). É o estado
   * honesto: sem onde gravar, nada foi decidido.
   */
  const [decisoes, setDecisoes] = useState<Record<string, { status: string }>>({});
  const [gravando, setGravando] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/propostas")
      .then((r) => (r.ok ? r.json() : { decisoes: {} }))
      .then((j) => vivo && setDecisoes(j.decisoes ?? {}))
      .catch(() => {
        /* sem runner: tudo pendente, que é a verdade */
      });
    return () => {
      vivo = false;
    };
  }, []);

  const decidir = useCallback(async (id: string, status: "aceita" | "descartada" | "pendente") => {
    setGravando(id);
    // otimista: o board responde ao clique na hora. Se a gravação falhar, o
    // catch devolve o estado anterior — pior que lento é mentir que salvou.
    const antes = decisoes;
    setDecisoes((d) => {
      const novo = { ...d };
      if (status === "pendente") delete novo[id];
      else novo[id] = { status };
      return novo;
    });
    try {
      const r = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setDecisoes(j.decisoes ?? {});
    } catch {
      setDecisoes(antes);
    } finally {
      setGravando(null);
    }
  }, [decisoes]);

  const estadoDe = useCallback(
    (id?: string) => (id ? (decisoes[id]?.status ?? "pendente") : null),
    [decisoes],
  );

  const { nodes, edges } = useMemo(() => {
    const passos = (grafo.nodes as Passo[])
      .filter((p) => filtro === "todos" || p.processo === filtro)
      // descartada some do board na hora. Ela continua no
      // `processos-propostas.mjs` e no arquivo de decisões — some da VISTA,
      // não da história, senão a mesma ideia volta daqui a duas semanas.
      .filter((p) => !p.proposta || estadoDe(p.propostaId) !== "descartada")
      // passo que eu sugeri TIRAR: sai da vista quando o ✓ é dado. As arestas
      // que tocavam nele caem sozinhas no filtro de ponta viva, logo abaixo.
      .filter((p) => !p.removidoPor || estadoDe(p.removidoPor) !== "aceita");

    const vivos = new Set(passos.map((p) => p.id));
    const arestas = (
      grafo.edges as {
        de: string;
        para: string;
        label: string;
        tracejado: boolean;
        proposta?: string;
        substituidaPor?: string;
        rotuloNovo?: string;
        rotuladaPor?: string;
      }[]
    )
      .filter((a) => vivos.has(a.de) && vivos.has(a.para))
      .filter((a) => !a.proposta || estadoDe(a.proposta) !== "descartada")
      // fio aposentado por proposta aceita: some só depois do ✓, e volta no ✕
      .filter((a) => !a.substituidaPor || estadoDe(a.substituidaPor) !== "aceita");

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

    /**
     * ── AS SAÍDAS DE CADA PASSO (11/09, pedido do Pedro) ─────────────────
     * Um passo que bifurca ganha uma faixa no rodapé, com um CTA por condição
     * e uma bolinha própria na lateral, de onde sai aquela linha. Assim a
     * pergunta "esta condição leva pra onde?" se responde no cartão, sem
     * seguir fio com o olho.
     *
     * 🔑 Calculado AQUI, e não no gerador, porque depende do que está
     * visível: filtro por processo, proposta descartada e aresta aposentada
     * mudam quantas saídas um passo tem AGORA. Congelar isso no JSON faria a
     * faixa mentir a cada clique de ✓/✕.
     */
    const saidas = new Map<string, { label: string; para: string }[]>();
    arestas.forEach((a) => {
      const lista = saidas.get(a.de) ?? [];
      lista.push({
        label:
          (a.rotuladaPor && estadoDe(a.rotuladaPor) === "aceita" ? a.rotuloNovo : a.label) || "",
        para: a.para,
      });
      saidas.set(a.de, lista);
    });

    // 🔴 a MESMA altura que o cartão vai ter (processos-medidas). Duas contas
    // pro mesmo objeto foi o que empilhou os cartões em 11/09.
    const altura = (id: string) => alturaDo(saidas.get(id)?.length ?? 0);

    passos.forEach((p) => g.setNode(p.id, { width: PASSO_W, height: altura(p.id) }));
    arestas.forEach((a) => g.setEdge(a.de, a.para));
    dagre.layout(g);

    const ns: Node<Passo>[] = passos.map((p) => {
      const pos = g.node(p.id);
      return {
        id: p.id,
        type: p.forma,
        position: { x: pos.x - PASSO_W / 2, y: pos.y - altura(p.id) / 2 },
        data: {
          ...p,
          ori,
          /* proposta aceita perde o cinza na hora: ela passa a valer como
             passo, e eu escrevo no `processos-data.mjs` no fecho do flow.
             Num passo REAL que eu sugiro tirar, quem manda é o id da
             proposta de remoção, não o do passo. */
          estado: estadoDe(p.proposta ? p.propostaId : p.removidoPor),
          saidas: saidas.get(p.id) ?? [],
          onDecidir: decidir,
          gravando: gravando === p.id,
        },
      };
    });

    const es: Edge[] = arestas.map((a, i) => ({
      /**
       * 🐛 11/09 (print do Pedro): o id era só `de->para`, e quando duas
       * arestas ligavam o mesmo par (a velha e a proposta pra substituí-la), o
       * React Flow recebia dois elementos com a MESMA chave — duas linhas
       * pontilhadas sobrepostas, com o mesmo rótulo. A raiz foi resolvida com
       * o primitivo `rotula` no gerador; o índice aqui é o cinto de segurança,
       * porque chave repetida nunca falha de forma barulhenta, falha desenhando
       * errado.
       */
      id: `${a.de}->${a.para}#${i}`,
      source: a.de,
      target: a.para,
      /* cada condição sai da SUA bolinha. Sem isto, as duas linhas do P4.3
         partiriam do mesmo ponto e o rótulo voltaria a ser a única pista. */
      sourceHandle:
        (saidas.get(a.de)?.length ?? 0) > 1
          ? `saida-${saidas.get(a.de)!.findIndex((x) => x.para === a.para && x.label === ((a.rotuladaPor && estadoDe(a.rotuladaPor) === "aceita" ? a.rotuloNovo : a.label) || ""))}`
          : undefined,
      type: "caminho",
      // 🔑 o dagre JÁ calcula um caminho que desvia dos cartões (é pra isso que
      // ele insere pontos intermediários). Antes eu jogava isso fora e deixava
      // o React Flow ligar as pontas em reta — foi o que fez a linha do
      // "até R$ 50" atravessar o cartão do P4.4 inteiro.
      data: {
        pontos: g.edge(a.de, a.para)?.points ?? [],
        // aresta renomeada por proposta: o nome novo só vale depois do ✓
        rotulo:
          (a.rotuladaPor && estadoDe(a.rotuladaPor) === "aceita" ? a.rotuloNovo : a.label) || "",
        tracejado: a.tracejado,
        proposta: a.proposta,
        estado: estadoDe(a.proposta),
        onDecidir: decidir,
      },
      style: {
        stroke: corDaAresta(a, estadoDe(a.proposta)),
        strokeWidth: 1.7,
        strokeDasharray: a.tracejado || (a.proposta && estadoDe(a.proposta) !== "aceita") ? "6 4" : undefined,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: corDaAresta(a, estadoDe(a.proposta)) },
    }));

    return { nodes: ns, edges: es };
  }, [filtro, ori, estadoDe, decidir, gravando]);

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
            {/* o detalhe técnico não cabe no cartão (§5.1) e é aqui que ele mora */}
            {selecionado.falaNota && (
              <Campo rotulo="Detalhe técnico" valor={selecionado.falaNota} />
            )}
            <Campo rotulo="O que a pessoa vê" valor={selecionado.ve} />

            {selecionado.fonte && selecionado.fonte !== "—" && (
              <Campo rotulo="De onde vem a regra" valor={selecionado.fonte} />
            )}

            {/* ── por que EU sugeri isto ─────────────────────────────────── */}
            {selecionado.proposta && selecionado.porque && (
              <div className="mt-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Por que eu sugeri
                </p>
                <p className="text-[12px] leading-relaxed text-zinc-700">{selecionado.porque}</p>
                {selecionado.depende?.length ? (
                  <p className="mt-1.5 text-[11px] text-zinc-500">
                    Só faz sentido junto de {selecionado.depende.join(", ")}.
                  </p>
                ) : null}
                <BotoesPainel
                  id={selecionado.propostaId ?? selecionado.id}
                  estado={estadoDe(selecionado.propostaId ?? selecionado.id)}
                  onDecidir={decidir}
                />
              </div>
            )}

            {/* ── sugestões de CAMPO: não cabem no cartão (§5.1), moram aqui ─ */}
            {selecionado.sugestoes?.map((s) => (
              estadoDe(s.id) === "descartada" ? null : (
                <div
                  key={s.id}
                  className="mt-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3"
                >
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Sugestão · {s.titulo || "mudança de campo"}
                  </p>
                  {s.mudancas.map((m) => (
                    <div key={m.campo} className="mt-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {m.campo}
                      </p>
                      <p
                        className={`text-[12px] leading-relaxed ${
                          estadoDe(s.id) === "aceita" ? "text-zinc-800" : "text-zinc-500"
                        }`}
                      >
                        {m.valor}
                      </p>
                    </div>
                  ))}
                  <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{s.porque}</p>
                  {s.depende?.length ? (
                    <p className="mt-1 text-[11px] text-zinc-400">
                      Só faz sentido junto de {s.depende.join(", ")}.
                    </p>
                  ) : null}
                  <BotoesPainel id={s.id} estado={estadoDe(s.id)} onDecidir={decidir} />
                </div>
              )
            ))}

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

/**
 * O mesmo ✕/✓ do cartão, em tamanho de leitura. No painel há espaço pra
 * PALAVRA em vez de só o símbolo — e é aqui que ele decide de verdade, depois
 * de ler o porquê. No cartão o par é discreto porque divide lugar com o passo.
 */
function BotoesPainel({
  id,
  estado,
  onDecidir,
}: {
  id: string;
  estado: string | null;
  onDecidir: (id: string, status: "aceita" | "descartada" | "pendente") => void;
}) {
  const aceita = estado === "aceita";
  return (
    <div className="mt-2.5 flex items-center gap-2">
      <button
        type="button"
        onClick={() => onDecidir(id, aceita ? "pendente" : "descartada")}
        className="rounded-lg border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 hover:bg-white"
      >
        ✕ descartar
      </button>
      <button
        type="button"
        onClick={() => onDecidir(id, aceita ? "pendente" : "aceita")}
        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
          aceita ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-700 hover:bg-white"
        }`}
      >
        {aceita ? "✓ aceita" : "✓ manter"}
      </button>
      {aceita && (
        <span className="text-[10px] text-zinc-400">
          entra no processos-data.mjs no fecho do flow
        </span>
      )}
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
