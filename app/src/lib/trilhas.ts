/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRILHAS do board /mapa — 🆕 26/08 (pedido do Pedro: clicar um CTA do E3 ·
 * Fork acende uma linha contínua, de uma cor, do CTA até a tela de conclusão
 * antes de entrar no app de verdade).
 * ═══════════════════════════════════════════════════════════════════════════
 * Só o PONTO DE PARTIDA/CHEGADA de cada trilha é configuração de negócio
 * (hand-authored, 3 linhas) — o CAMINHO em si (quais das ~35 arestas do meio
 * pertencem a cada trilha) é CALCULADO a partir do grafo real, nunca listado
 * à mão (mesma filosofia do resto do `/mapa`: nasce do gerador, não do dedo).
 *
 * Algoritmo (`calcularArestasTrilha`): BFS pra frente a partir da aresta certa
 * (nó+handle) do E3, ignorando arestas cujo rótulo cita o OUTRO caminho
 * (ex.: ao calcular "abrir", pula qualquer aresta com "migrar" no rótulo —
 * é assim que o grafo já marca a bifurcação real: "BH confirmado, abrir" ×
 * "BH confirmado, migrar"). Depois, alcançabilidade REVERSA a partir da tela
 * final — só sobrevive quem realmente chega lá (poda saídas/vereditos que
 * não levam a lugar nenhum, tipo waitlist/fora-de-BH).
 *
 * Achado ao validar: "abrir" e "migrar" DIVERGEM só no início (E3.2→E4/E5A ×
 * E4.2...) e RECONVERGEM no meio (Dinheiro/Dossiê/Aprovação são o MESMO
 * trecho pros dois) — é assim que o produto de verdade funciona, não é bug
 * do cálculo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import type { ArestaFlow, FlowGraph } from "./flow-layout";

export interface Trilha {
  id: string;
  nome: string;
  /** Cor da paleta de marca (`marca/identidade-visual/paleta-cores.md`) —
   *  3 tons já documentados, escolhidos pra dar contraste real entre si. */
  cor: string;
  deId: string;
  deHandle: string;
  ateId: string;
  /** Rótulo de aresta contendo esta palavra = pertence ao OUTRO caminho,
   *  poda daqui. `null` = sem bifurcação por rótulo (trilha trivial). */
  excluirPalavra: string | null;
}

export const TRILHAS: Trilha[] = [
  { id: "abrir", nome: "Quero abrir minha empresa", cor: "#F2643C" /* coral — marca */, deId: "E3", deHandle: "abrir", ateId: "A5", excluirPalavra: "migrar" },
  { id: "migrar", nome: "Já tenho empresa", cor: "#17A06A" /* verde-sucesso */, deId: "E3", deHandle: "migrar", ateId: "A5", excluirPalavra: "abrir" },
  { id: "login", nome: "Entrar na minha conta", cor: "#3B82E0" /* azul-info, uso mínimo */, deId: "E3", deHandle: "login", ateId: "E3_1", excluirPalavra: null },
];

/** Chave estável pra casar uma `ArestaFlow` (dado bruto) com uma `Edge` já
 *  processada pelo React Flow — não usa o `id` final (que já carrega índices
 *  auto de espalhamento), só o trio que realmente identifica a aresta. */
export function chaveAresta(de: string, para: string, deHandle?: string | null): string {
  return `${de}|${deHandle || ""}|${para}`;
}

export function calcularArestasTrilha(grafo: FlowGraph, trilha: Trilha): Set<string> {
  const porOrigem = new Map<string, ArestaFlow[]>();
  const porDestino = new Map<string, ArestaFlow[]>();
  for (const e of grafo.edges) {
    (porOrigem.get(e.de) ?? porOrigem.set(e.de, []).get(e.de)!).push(e);
    (porDestino.get(e.para) ?? porDestino.set(e.para, []).get(e.para)!).push(e);
  }

  // 1) BFS pra frente a partir da aresta certa do handle, podando pelo rótulo.
  const alcancadasPraFrente = new Set<ArestaFlow>();
  const visitados = new Set<string>();
  const primeiraLeva = (porOrigem.get(trilha.deId) ?? []).filter((e) => e.deHandle === trilha.deHandle);
  const fila = [...primeiraLeva];
  primeiraLeva.forEach((e) => alcancadasPraFrente.add(e));
  while (fila.length) {
    const e = fila.shift()!;
    if (visitados.has(e.para)) continue;
    visitados.add(e.para);
    if (e.para === trilha.ateId) continue;
    for (const prox of porOrigem.get(e.para) ?? []) {
      if (trilha.excluirPalavra && prox.label?.toLowerCase().includes(trilha.excluirPalavra)) continue;
      if (!alcancadasPraFrente.has(prox)) {
        alcancadasPraFrente.add(prox);
        fila.push(prox);
      }
    }
  }

  // 2) Alcançabilidade reversa a partir do destino — poda ramos que não chegam lá.
  const alcancaDestino = new Set<string>([trilha.ateId]);
  const fila2 = [trilha.ateId];
  while (fila2.length) {
    const id = fila2.shift()!;
    for (const e of porDestino.get(id) ?? []) {
      if (!alcancadasPraFrente.has(e)) continue;
      if (!alcancaDestino.has(e.de)) {
        alcancaDestino.add(e.de);
        fila2.push(e.de);
      }
    }
  }

  const resultado = new Set<string>();
  for (const e of alcancadasPraFrente) {
    if (alcancaDestino.has(e.de) && alcancaDestino.has(e.para)) {
      resultado.add(chaveAresta(e.de, e.para, e.deHandle));
    }
  }
  return resultado;
}
