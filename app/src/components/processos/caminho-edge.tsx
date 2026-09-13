"use client";

import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from "@xyflow/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARESTA DO BOARD /processos — desenhada pelo CAMINHO QUE O DAGRE CALCULOU.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🐛 O BUG QUE ISTO CONSERTA (achado pelo Pedro em 11/09):
 * "tem uma linha cinza que atravessa o card inteiro, ficou confuso".
 *
 * Era a aresta P4.3 → P4.5 ("até R$ 50"), que PULA uma fileira: ela sai da
 * decisão e vai direto pro passo dois níveis à frente, passando por cima do
 * P4.4 no meio do caminho.
 *
 * A causa tinha duas partes, e as duas eram minhas:
 *
 *  1. O React Flow, sozinho, liga origem e destino em LINHA RETA. Ele não sabe
 *     que tem um cartão no meio — desviar de obstáculo não é trabalho dele.
 *  2. O dagre, que roda logo antes, JÁ CALCULA um caminho que desvia (ele
 *     insere pontos intermediários exatamente pra isso). Eu estava jogando
 *     esse cálculo fora e usando só a posição dos cartões.
 *
 * Aqui o caminho do dagre é aproveitado: os pontos viram uma curva suave que
 * contorna o cartão em vez de atravessar. Nenhum número novo foi inventado —
 * é o mesmo layout que já estava sendo calculado e descartado.
 *
 * A curva usa ponto médio entre vértices (quadrática) em vez de linha
 * quebrada: canto vivo num board de processo lê como "aqui tem um passo", e
 * não tem.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type DadosCaminho = {
  pontos?: { x: number; y: number }[];
  rotulo?: string;
  tracejado?: boolean;
};

/** Curva suave passando pelos vértices que o dagre entregou. */
function traçar(p: { x: number; y: number }[]): string {
  if (p.length < 2) return "";
  if (p.length === 2) return `M${p[0].x},${p[0].y} L${p[1].x},${p[1].y}`;

  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i].x + p[i + 1].x) / 2;
    const my = (p[i].y + p[i + 1].y) / 2;
    d += ` Q${p[i].x},${p[i].y} ${mx},${my}`;
  }
  const u = p[p.length - 1];
  d += ` L${u.x},${u.y}`;
  return d;
}

export function CaminhoEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
  data,
}: EdgeProps) {
  const d = data as DadosCaminho | undefined;
  /**
   * 🔑 A PONTA SAI DA BOLINHA, o meio é do dagre (11/09).
   *
   * O dagre calcula o caminho entre CENTROS de cartão: ele não sabe que um
   * passo que bifurca agora tem uma bolinha por condição, cada uma numa altura
   * diferente. Se a gente usasse o primeiro ponto dele, a linha nasceria solta
   * no meio da borda e a faixa de saídas perderia a graça — que é justamente
   * ver de qual condição o fio parte.
   *
   * Então: primeira e última coordenada vêm do React Flow (as âncoras reais),
   * e os pontos do MEIO continuam sendo os do dagre, que são os que desviam
   * dos cartões.
   */
  const pontos = d?.pontos?.length
    ? [{ x: sourceX, y: sourceY }, ...d.pontos.slice(1, -1), { x: targetX, y: targetY }]
    : [
        { x: sourceX, y: sourceY },
        { x: targetX, y: targetY },
      ];

  const caminho = traçar(pontos);

  /**
   * ── ONDE O RÓTULO FICA (13/09, print do Pedro) ──────────────────────────
   *
   * 🐛 Era o vértice do MEIO por ÍNDICE — `pontos[length/2]`. Num caminho com
   * poucos vértices, ou com um trecho longo e outro curto, o vértice do meio
   * não fica no meio do DESENHO: cai perto de uma das pontas, que é justamente
   * onde tem cartão. Os rótulos apareciam cortados pela borda dos cards.
   *
   * 🔑 Agora é o meio por COMPRIMENTO: anda o caminho somando distância e para
   * na metade. Independe de quantos vértices o dagre gerou.
   */
  const meio = (() => {
    let total = 0;
    for (let i = 1; i < pontos.length; i++) {
      total += Math.hypot(pontos[i].x - pontos[i - 1].x, pontos[i].y - pontos[i - 1].y);
    }
    let andado = 0;
    for (let i = 1; i < pontos.length; i++) {
      const passo = Math.hypot(pontos[i].x - pontos[i - 1].x, pontos[i].y - pontos[i - 1].y);
      if (andado + passo >= total / 2) {
        const t = passo === 0 ? 0 : (total / 2 - andado) / passo;
        return {
          x: pontos[i - 1].x + (pontos[i].x - pontos[i - 1].x) * t,
          y: pontos[i - 1].y + (pontos[i].y - pontos[i - 1].y) * t,
        };
      }
      andado += passo;
    }
    return pontos[pontos.length - 1];
  })();

  return (
    <>
      <BaseEdge id={id} path={caminho} markerEnd={markerEnd} style={style} />
      {d?.rotulo && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan absolute rounded-md border px-1.5 py-0.5 text-[11px] font-semibold shadow-sm"
            style={{
              transform: `translate(-50%, -50%) translate(${meio.x}px, ${meio.y}px)`,
              background: "#fff",
              borderColor: d.tracejado ? "#D64A2D55" : "#e4e4e7",
              color: d.tracejado ? "#B03A22" : "#3f3f46",
              pointerEvents: "all",
              /**
               * 🐛 13/09 — o React Flow pinta as arestas NUMA CAMADA ABAIXO dos
               * nós, e o rótulo herdava isso: quando caía perto de um cartão,
               * ficava atrás dele e aparecia cortado pela metade. Mesmo tipo de
               * defeito que o fundo translúcido do cartão causou em 11/09, e a
               * mesma correção: o que precisa ser lido vai por cima.
               */
              zIndex: 1000,
            }}
          >
            {d.rotulo}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const TIPOS_DE_CAMINHO = { caminho: CaminhoEdge };
