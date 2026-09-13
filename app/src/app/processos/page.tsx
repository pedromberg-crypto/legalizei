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
import cru from "@/lib/cru-graph.json";
import { TIPOS_DE_PASSO, type Passo } from "@/components/processos/passo-node";
import { PainelE2E } from "@/components/processos/painel-e2e";
import { TIPOS_DE_CAMINHO } from "@/components/processos/caminho-edge";
import { PASSO_W, RESPIRO, RESPIRO_ARESTA } from "@/lib/processos-medidas";
import {
  alturaDaFaixa,
  bolinhaDaAresta,
  montarFaixas,
  ordenarFaixas,
  rotuloDe,
} from "@/lib/faixa-saidas";

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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🥩 MODO CRU NO BOARD (12/09, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * *"Quero isso visual no nosso painel. Cria um campo no seletor de cima com
 * nome por categoria."*
 *
 * 🔑 A DECISÃO DE DESENHO: o nó cru é convertido no MESMO formato do passo
 * ANTES de entrar no pipeline. Assim o dagre, a faixa de saídas, a ordenação
 * dos CTAs, o acender-ramo e o painel continuam funcionando sem uma linha
 * nova. Um segundo pipeline de layout seria a chance perfeita de recriar o
 * bug dos cartões sobrepostos de 11/09 — que já custou caro duas vezes.
 *
 * O que o modo cru NÃO tem, e é de propósito: quem dispara, com quem fala, o
 * que a pessoa vê e o semáforo. Os campos existem no formato e ficam vazios;
 * o cartão sabe não desenhá-los.
 *
 * ⚠️ A altura do cartão continua sendo a mesma (`PASSO_H`), mesmo com menos
 * conteúdo dentro. Sobra espaço, e sobrar é de graça; recalcular altura é
 * exatamente o caminho que empilhou os cartões antes.
 */
type NoCru = {
  id: string;
  o: string;
  variavel?: string;
  saidas?: { se: string; vai: string }[];
  fim?: boolean;
  saiPara?: string;
  cobre?: string[];
  ja?: string;
  nota?: string;
  alerta?: string;
};
type Categoria = {
  id: string;
  nome: string;
  emoji: string;
  estado: string;
  itens: string[];
  semCobertura: string[];
  entradas: string[];
  contagem: { nos: number; variaveis: number; fins: number; fronteiras: number };
};

const CATEGORIAS = cru.categorias as Categoria[];
/** 🔒 o escopo vem do `_escopo.mjs` pelo gerador — a tela não repete a regra,
 *  ela mostra. Fica visível na barra pra não depender de ninguém abrir
 *  arquivo: o enquadramento MUDA a regra (a E0061 vale só pro Simples). */
const ESCOPO = cru.escopo as {
  dentro: { regime: string; porte: string; anexos: string[]; fatorR: string; documento: string; marcaNoLeiaute: string };
  fora: { o: string; porque: string }[];
};
const PREFIXO_CRU = "cru:";
const CINZA_CRU = "#71717A";

function converterCru(catId: string) {
  const nos = ((cru.nos as Record<string, NoCru[]>)[catId] ?? []).filter(Boolean);
  const passos = nos.map((n) => ({
    id: n.id,
    processos: [PREFIXO_CRU + catId],
    titulo: n.o,
    /* os quatro campos de fora existem e ficam vazios: é o adiamento,
       escrito no dado em vez de escondido numa flag */
    quem: "",
    faz: "",
    fala: "",
    ve: "",
    luz: "cru",
    forma: n.fim ? "fim" : n.variavel ? "decisao" : "passo",
    cor: CINZA_CRU,
    cru: true,
    variavel: n.variavel,
    saiPara: n.saiPara,
    ja: n.ja,
    notaCrua: n.nota,
    cobre: n.cobre,
    alerta: n.alerta,
  })) as unknown as Passo[];

  const arestas = nos.flatMap((n) =>
    (n.saidas ?? []).map((s) => ({
      de: n.id,
      para: s.vai,
      label: s.se ?? "",
      tracejado: false,
    })),
  );
  return { passos, arestas };
}

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

  /**
   * ── ACENDER UM RAMO (11/09, pedido do Pedro) ─────────────────────────────
   * *"quando eu clicar no card de uma variável, deixe em cor viva apenas onde
   * passará aquele fluxo e cinza claro o restante, pra eu enxergar exatamente
   * tudo que está dentro daquela ramificação e validar cada variável
   * individualmente."*
   *
   * Primo do que o /mapa faz desde 26/08, com duas diferenças que importam:
   * lá as trilhas são uma lista fixa em `lib/trilhas.ts`, aqui o ramo nasce da
   * ARESTA clicada, qualquer uma; e lá o que fica de fora SOME (decisão de
   * 01/09), aqui apaga em cinza — ele pediu para continuar vendo o entorno,
   * que é o que permite comparar um ramo com o outro.
   */
  const [ramo, setRamo] = useState<{ de: string; para: string; label: string } | null>(null);

  const acenderRamo = useCallback((de: string, para: string, label: string) => {
    setRamo((atual) =>
      atual && atual.de === de && atual.para === para && atual.label === label
        ? null
        : { de, para, label },
    );
  }, []);

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

  const ehCru = filtro.startsWith(PREFIXO_CRU);

  const { nodes, edges } = useMemo(() => {
    /* 🥩 o modo cru entra AQUI e em mais lugar nenhum: troca a fonte, e todo
       o resto do pipeline (dagre, faixa, ordenação, ramo) roda igual */
    const fonteCrua = ehCru ? converterCru(filtro.slice(PREFIXO_CRU.length)) : null;

    const passos = (fonteCrua?.passos ?? (grafo.nodes as Passo[]))
      /* passo COMPARTILHADO aparece no filtro dos dois processos:
         o fechamento do ciclo é o fim do P4 e o começo do P1 */
      .filter((p) => ehCru || filtro === "todos" || (p.processos ?? []).includes(filtro))
      // descartada some do board na hora. Ela continua no
      // `processos-propostas.mjs` e no arquivo de decisões — some da VISTA,
      // não da história, senão a mesma ideia volta daqui a duas semanas.
      .filter((p) => !p.proposta || estadoDe(p.propostaId) !== "descartada")
      // passo que eu sugeri TIRAR: sai da vista quando o ✓ é dado. As arestas
      // que tocavam nele caem sozinhas no filtro de ponta viva, logo abaixo.
      .filter((p) => !p.removidoPor || estadoDe(p.removidoPor) !== "aceita");

    const vivos = new Set(passos.map((p) => p.id));
    const arestas = (
      (fonteCrua?.arestas ?? grafo.edges) as {
        de: string;
        para: string;
        label: string;
        tracejado: boolean;
        proposta?: string;
        substituidaPor?: string;
        rotuloNovo?: string;
        rotuladaPor?: string;
        quando?: string;
        quandoNovo?: string;
        abre?: string;
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
     * ── AS SAÍDAS DE CADA PASSO ──────────────────────────────────────────
     * 🔴 A montagem inteira vive em `lib/faixa-saidas`, que é função PURA e
     * tem teste de invariantes. Este arquivo só CONSOME — se ele recalculasse
     * qualquer pedaço aqui, voltaria a existir duas fontes pro mesmo fato, que
     * é a raiz dos 8 defeitos de vista que o Pedro achou em 11/09.
     *
     * 🔑 Calculado aqui e não no gerador porque depende do que está VISÍVEL:
     * filtro por processo, proposta descartada e aresta aposentada mudam
     * quantas saídas um passo tem agora. Congelar no JSON faria a faixa mentir
     * a cada clique de ✓/✕.
     */
    const faixas = montarFaixas(arestas);

    const altura = (id: string) => alturaDaFaixa(faixas.get(id));

    passos.forEach((p) => g.setNode(p.id, { width: PASSO_W, height: altura(p.id) }));
    arestas.forEach((a) => g.setEdge(a.de, a.para));
    dagre.layout(g);

    /**
     * ── A ORDEM DOS CTAs SEGUE OS CARTÕES (11/09, achado do Pedro) ───────
     * *"a condicional 'aceitou' leva pra um flow longo na parte de cima e a
     * 'fechou a sheet' pra um card de saída; sem necessidade estamos cruzando
     * as duas linhas. Se trocar os cards um pelo outro, elas não se cruzam."*
     *
     * 🔑 Quem está em cima no board fica em cima na faixa. Cruzamento de linha
     * custa atenção e não carrega informação nenhuma — o fio só cruzava porque
     * a ordem dos CTAs era a ordem em que eu declarei as arestas, que não tem
     * relação com nada.
     *
     * Só dá pra ordenar AQUI: a posição de cada cartão só existe depois do
     * `dagre.layout`, e o dagre precisa das alturas, que dependem de QUANTAS
     * saídas cada passo tem. A contagem vem antes, a ordem vem depois.
     */
    ordenarFaixas(faixas, (id) => {
      const pos = g.node(id);
      if (!pos) return null;
      // no board deitado o que separa os destinos é o Y; em pé, o X
      return ori === "LR" ? pos.y : pos.x;
    });

    /**
     * O que o ramo aceso alcança. A caminhada respeita a TRILHA da aresta
     * clicada: se ela abre (ou pertence a) uma trilha, o ramo não atravessa
     * portas de outra — senão acender "acima de R$ 50" iluminaria o caminho da
     * fatura também, e a resposta seria inútil.
     */
    const aceso = (() => {
      if (!ramo) return null;
      const inicio = arestas.find(
        (a) => a.de === ramo.de && a.para === ramo.para && rotuloDe(a) === ramo.label,
      );
      const trilha = inicio?.abre ?? inicio?.quando;
      const nos = new Set<string>([ramo.de, ramo.para]);
      const fios = new Set<string>([`${ramo.de}→${ramo.para}`]);
      const fila = [ramo.para];
      while (fila.length) {
        const aqui = fila.shift()!;
        for (const a of arestas) {
          if (a.de !== aqui) continue;
          // mesma regra da caminhada do SAIDAS.md: quem já está numa trilha
          // não atravessa a porta de outra, nem por `quando` nem por `abre`
          if (trilha && a.quando && a.quando !== trilha) continue;
          if (trilha && a.abre && a.abre !== trilha) continue;
          fios.add(`${a.de}→${a.para}`);
          if (!nos.has(a.para)) {
            nos.add(a.para);
            fila.push(a.para);
          }
        }
      }
      return { nos, fios };
    })();

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
          saidas: faixas.get(p.id)?.plana ?? [],
          apagado: Boolean(aceso) && !aceso!.nos.has(p.id),
          ramoAceso: ramo && ramo.de === p.id ? ramo : null,
          onRamo: acenderRamo,
          grupos: faixas.get(p.id)?.grupos ?? [],
          trilhas: grafo.trilhas as { id: string; nome: string; curto: string; cor: string }[],
          onDecidir: decidir,
          gravando: gravando === p.id,
        },
      };
    });

    /**
     * ── 🔁 LAÇO NÃO VIRA LINHA (13/09, print do Pedro) ────────────────────
     *
     * 🐛 Três nós voltam pra si mesmos — `I11` e `I12` (esperar vencimento,
     * esperar a consulta) e `N41` (esperar a análise fiscal). São verdade no
     * processo: "ainda não voltou → continua esperando". Mas o dagre não
     * posiciona aresta de um nó pra ele mesmo, então o React Flow ligava as
     * duas âncoras em linha reta e saía uma diagonal gigante atravessando o
     * board inteiro — foi o que o Pedro chamou de "voltas".
     *
     * 🔑 A correção é de VISTA, não de dado: a saída continua no arquivo e
     * continua aparecendo na faixa do cartão (com o selo ↻). O que some é só
     * o fio, que não carregava informação nenhuma — ele saía e voltava no
     * mesmo lugar.
     */
    const es: Edge[] = arestas
      .filter((a) => a.de !== a.para)
      .map((a, i) => ({
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
      sourceHandle: bolinhaDaAresta(faixas.get(a.de), a),
      type: "caminho",
      // 🔑 o dagre JÁ calcula um caminho que desvia dos cartões (é pra isso que
      // ele insere pontos intermediários). Antes eu jogava isso fora e deixava
      // o React Flow ligar as pontas em reta — foi o que fez a linha do
      // "até R$ 50" atravessar o cartão do P4.4 inteiro.
      data: {
        pontos: g.edge(a.de, a.para)?.points ?? [],
        // aresta renomeada por proposta: o nome novo só vale depois do ✓
        rotulo: rotuloDe(a),
        tracejado: a.tracejado,
        proposta: a.proposta,
        estado: estadoDe(a.proposta),
        onDecidir: decidir,
      },
      style: {
        stroke: corDaAresta(a, estadoDe(a.proposta)),
        strokeWidth: aceso?.fios.has(`${a.de}→${a.para}`) ? 2.6 : 1.7,
        // fora do ramo aceso: apaga, não some. O entorno continua legível, e é
        // ele que permite comparar um ramo com o outro.
        opacity: aceso && !aceso.fios.has(`${a.de}→${a.para}`) ? 0.16 : 1,
        strokeDasharray: a.tracejado || (a.proposta && estadoDe(a.proposta) !== "aceita") ? "6 4" : undefined,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: corDaAresta(a, estadoDe(a.proposta)) },
    }));

    return { nodes: ns, edges: es };
    /* `ehCru` deriva de `filtro` e não muda sozinho, mas fica declarado:
       dependência implícita é o tipo de coisa que sobrevive até alguém mexer
       na origem dela e o board parar de atualizar sem erro nenhum */
  }, [filtro, ehCru, ori, estadoDe, decidir, gravando, ramo, acenderRamo]);

  const placar = useMemo(() => {
    const alvo = (grafo.nodes as Passo[]).filter(
      (p) => filtro === "todos" || (p.processos ?? []).includes(filtro),
    );
    return LEGENDA.map((l) => ({ ...l, n: alvo.filter((p) => p.luz === l.luz).length }));
  }, [filtro]);

  const aoClicar: NodeMouseHandler = (_, no) => setSelecionado(no.data as Passo);

  /** clicar no vazio do quadro apaga o ramo — a outra saída que ele pediu */
  const aoClicarNoVazio = useCallback(() => setRamo(null), []);

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
          <optgroup label="Processos desenhados">
            <option value="todos">Todos os processos</option>
            {processos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.titulo}
              </option>
            ))}
          </optgroup>
          {/* 🥩 a varredura crua entra como GRUPO à parte, não misturada na
              lista: são duas vistas do produto em fases diferentes, e
              embaralhá-las faria o Pedro escolher sem saber o que ia ver */}
          <optgroup label="🥩 Varredura crua · por categoria">
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={PREFIXO_CRU + c.id}>
                {c.emoji} {c.nome}
              </option>
            ))}
          </optgroup>
        </select>

        <div className="flex items-center gap-3">
          {ehCru ? (
            <span
              className="rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-700"
              title={`Dentro: ${ESCOPO.dentro.porte} do ${ESCOPO.dentro.regime}, Anexos ${ESCOPO.dentro.anexos.join(" e ")}, Fator R ${ESCOPO.dentro.fatorR} · ${ESCOPO.dentro.documento} (${ESCOPO.dentro.marcaNoLeiaute}).

FORA: ${ESCOPO.fora.map((f) => f.o).join(" · ")}`}
            >
              🔒 {ESCOPO.dentro.porte} {ESCOPO.dentro.regime} · Anexos {ESCOPO.dentro.anexos.join("/")}
            </span>
          ) : null}
          {ehCru ? (
            /* no cru não há semáforo: o que se mede é se toda variável tem
               todas as respostas escritas */
            (() => {
              const c = CATEGORIAS.find((x) => PREFIXO_CRU + x.id === filtro);
              if (!c) return null;
              return (
                <>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${
                      c.estado === "fechado"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                    title={
                      c.estado === "fechado"
                        ? "toda variável tem todas as saídas escritas, e nenhum item da categoria ficou de fora"
                        : `a varredura não encostou em: ${c.semCobertura.join(" · ")}`
                    }
                  >
                    {c.estado === "fechado" ? "🟩 fechada" : "🟨 aberta"}
                  </span>
                  <span className="text-[12px] font-semibold text-zinc-600" title="nós no mapa">
                    {c.contagem.nos} nós
                  </span>
                  <span className="text-[12px] font-semibold text-zinc-600" title="decisões: cada uma com todas as saídas escritas">
                    ◆ {c.contagem.variaveis}
                  </span>
                  <span className="text-[12px] font-semibold text-zinc-600" title="onde a categoria toca outra — é nota, não ligação">
                    ↗ {c.contagem.fronteiras}
                  </span>
                </>
              );
            })()
          ) : (
            placar.map((l) => (
              <span key={l.luz} className="text-[12px] font-semibold text-zinc-600">
                {l.emoji} {l.n}
              </span>
            ))
          )}
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
          onPaneClick={() => {
            setSelecionado(null);
            aoClicarNoVazio();
          }}
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
                  {selecionado.id} · {(selecionado.processos ?? []).join(" + ")}
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

            {/* 🥩 no cru o painel responde outras perguntas: qual é a
                variável, pra onde a categoria continua, o que a varredura
                achou, e se aquele pedaço já existe desenhado */}
            {selecionado.cru ? (
              <>
                {selecionado.variavel && (
                  <Campo rotulo="A variável" valor={selecionado.variavel} />
                )}
                {selecionado.saiPara && (
                  <Campo rotulo="↗ Continua em" valor={selecionado.saiPara} />
                )}
                {selecionado.cobre?.length ? (
                  <Campo rotulo="Atende os itens" valor={selecionado.cobre.join(" · ")} />
                ) : null}
                {selecionado.ja && (
                  <Campo
                    rotulo="Já desenhado como"
                    valor={`${selecionado.ja} — no formato completo, com quem executa e com quem a casa fala`}
                  />
                )}
                {selecionado.alerta && (
                  <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      ⏳ Este ramo tem prazo
                    </p>
                    <p className="whitespace-pre-line text-[12px] leading-relaxed text-amber-900">
                      {selecionado.alerta}
                    </p>
                  </div>
                )}
                {selecionado.notaCrua && (
                  <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      O que a varredura achou
                    </p>
                    <p className="text-[12px] leading-relaxed text-zinc-700">
                      {selecionado.notaCrua}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
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

            {/* ── o que este passo COME (handoff, 12/09) ─────────────────── */}
            {selecionado.insumos?.length ? (
              <div className="mt-3 border-t border-zinc-100 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Insumo · o que ele precisa receber
                </p>
                <ul className="mt-1 space-y-1.5">
                  {selecionado.insumos.map((i) => {
                    const s = INSUMO[i.status] ?? INSUMO_DESCONHECIDO;
                    return (
                      <li key={i.dado} className="flex gap-1.5 text-[12px] leading-snug">
                        <span aria-hidden>{s.emoji}</span>
                        <span className="min-w-0">
                          <span className={s.classe}>{i.dado}</span>
                          <span className="text-zinc-400"> · {s.rotulo}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {/* 🔑 o board não decide isto: quem decide é o handoff, e a
                    pergunta de cada buraco está escrita lá com destinatário */}
                {selecionado.insumosFaltando ? (
                  <p className="mt-2 text-[11px] leading-relaxed text-amber-800">
                    {selecionado.insumosFaltando === 1
                      ? "1 insumo ainda não tem entrega combinada."
                      : `${selecionado.insumosFaltando} insumos ainda não têm entrega combinada.`}{" "}
                    A pergunta de cada um, e pra quem ela vai, está em{" "}
                    <code className="rounded bg-amber-50 px-1">execucao/handoff/HANDOFF-DADOS.md</code>.
                  </p>
                ) : null}
              </div>
            ) : null}
              </>
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

/**
 * ── OS QUATRO ESTADOS DE UM INSUMO (12/09) ──────────────────────────────────
 *
 * Mesma escala do handoff, e ela NÃO é o semáforo do passo: aqui não se mede
 * se a gente sabe o que fazer, se mede se o dado chega. "nasce depois" não é
 * defeito — é o CNPJ, que existe e vem do trecho assistido; o que ele precisa
 * é de um combinado de entrega, não de desenho.
 */
const INSUMO: Record<string, { emoji: string; rotulo: string; classe: string }> = {
  captado: { emoji: "🟢", rotulo: "chega da constituição", classe: "text-zinc-600" },
  "nasce-depois": { emoji: "🟡", rotulo: "nasce depois, falta combinar a entrega", classe: "text-zinc-800 font-semibold" },
  "nao-sei": { emoji: "🟡", rotulo: "ninguém combinou", classe: "text-amber-800 font-semibold" },
  "nao-captado": { emoji: "🔴", rotulo: "ninguém produz hoje", classe: "text-red-800 font-semibold" },
};
const INSUMO_DESCONHECIDO = { emoji: "❔", rotulo: "estado desconhecido", classe: "text-zinc-500" };

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="mt-3 border-t border-zinc-100 pt-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{rotulo}</p>
      <p className="text-[12px] leading-relaxed text-zinc-700">{valor}</p>
    </div>
  );
}
