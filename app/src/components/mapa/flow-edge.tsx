"use client";

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Aresta custom do `/mapa` — 🔄 26/08 (achado do Pedro: "linhas por cima da
 * tela, isso não pode acontecer").
 * ═══════════════════════════════════════════════════════════════════════════
 * O rótulo embutido do React Flow (`BaseEdge label=...`) desenha o texto
 * DENTRO do mesmo `<svg>` do traçado — então, pra o texto nunca ficar
 * escondido atrás de um card vizinho, a única saída era subir o `zIndex` da
 * aresta inteira. Isso resolvia o texto escondido mas criava um problema
 * pior: a LINHA (não só o texto) passava a desenhar por CIMA da prévia ao
 * vivo de qualquer card que estivesse no caminho geométrico.
 *
 * Fix real: separar os dois. O traçado (`BaseEdge`, sem label) fica no
 * `zIndex` normal — sempre ATRÁS dos cards, nunca risca a prévia. O texto do
 * rótulo vai pro `EdgeLabelRenderer`, que é um portal HTML renderizado ACIMA
 * de tudo (nós e arestas) por natureza do React Flow — nunca escondido, e
 * nunca desenha em cima da tela porque não é mais parte do SVG da linha.
 *
 * 🔄 26/08 (achado do Pedro: "dados tampados", rótulos empilhados exatamente
 * um em cima do outro) — `getSmoothStepPath` calcula o meio do CAMINHO, e
 * duas arestas "irmãs" (mesmo par de ranks, geometria simétrica — ex: os 2
 * ramos de um fork) frequentemente dão o MESMO ponto médio. Fix: cada aresta
 * ganha um deslocamento pequeno e ESTÁVEL (hash do próprio `id`, não aleatório
 * — mesma aresta sempre cai no mesmo lugar entre recargas), then elas nunca
 * mais coincidem exatamente.
 *
 * 🔄 26/08 (pedido do Pedro: "quando clica numa linha, ela só fica cinza mais
 * forte — se ficar coral destaca mais o caminho") — o cinza-escuro é o
 * default do próprio React Flow (`--xy-edge-stroke-selected-default`).
 * Sobrescrito aqui: aresta clicada fica coral (`#F2643C`, cor de marca) e
 * mais grossa, rótulo ganha o mesmo tom — caminho clicado salta aos olhos
 * de verdade, não só "um pouco mais escuro que o resto".
 *
 * 🔄 26/08 (achado do Pedro: "clicando na linha não fica coral") — o
 * `selected` embutido do React Flow não estava confiável aqui (mecanismo
 * interno da lib, difícil de auditar). Trocado por estado NOSSO: clique vai
 * pro `onEdgeClick` de `/mapa/page.tsx`, que injeta `data.clicada` — mesmo
 * padrão já validado da trilha (`data.corTrilha`), garantido de funcionar.
 *
 * 🆕 26/08 (pedido do Pedro: clicar um CTA do E3 acende a TRILHA inteira até
 * a tela de conclusão, 1 cor por caminho) — `/mapa/page.tsx` calcula quais
 * arestas pertencem à trilha ativa (`trilhas.ts`) e injeta `data.corTrilha`
 * (a cor daquele caminho) nelas, `data.apagado` nas demais. Prioridade:
 * trilha > seleção manual > cinza padrão.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Hash estável (não `Math.random` — precisa ser o MESMO valor sempre pro
 *  mesmo id, senão o rótulo "pula" de lugar a cada re-render). */
function deslocamentoEstavel(id: string): { dx: number; dy: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const dx = ((Math.abs(h) % 5) - 2) * 9; // -18..18
  const dy = ((Math.abs(h >> 3) % 5) - 2) * 9; // -18..18
  return { dx, dy };
}

export function RotuloEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  label,
  data,
}: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { dx, dy } = deslocamentoEstavel(id);
  const corTrilha = (data as { corTrilha?: string } | undefined)?.corTrilha;
  const apagado = (data as { apagado?: boolean } | undefined)?.apagado;
  const clicada = (data as { clicada?: boolean } | undefined)?.clicada;
  const destacada = !!corTrilha || clicada;
  const corDestaque = corTrilha ?? (clicada ? "#F2643C" : undefined);

  const estiloPath = destacada
    ? { ...style, stroke: corDestaque, strokeWidth: 3, opacity: 1 }
    : apagado
      ? { ...style, opacity: 0.2 }
      : style;

  return (
    <>
      <BaseEdge id={id} path={path} style={estiloPath} />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className={`rounded border px-1.5 py-0.5 text-[11px] font-medium shadow-sm ${
              destacada ? "border-transparent font-semibold text-white" : "border-border-hairline bg-surface-card text-text-secondary"
            }`}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX + dx}px, ${labelY + dy}px)`,
              pointerEvents: "none",
              background: destacada ? corDestaque : undefined,
              opacity: apagado ? 0.25 : 1,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

export const TIPOS_DE_ARESTA = { rotulo: RotuloEdge };
