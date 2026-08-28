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
 * "BH confirmado, migrar").
 *
 * 🔄 28/08 (pedido do Pedro: "colore também as VARIÁVEIS que esse flow pode
 * ter, tipo saída") — REMOVIDA a alcançabilidade reversa que só mantinha
 * quem chegava na tela final. Ela existia pra "limpar" a trilha das saídas/
 * vereditos que não levam a lugar nenhum (waitlist, exterior, 5+ sócios...),
 * mas isso é exatamente o que o Pedro quer ver agora: TODO desvio possível
 * daquele fluxo (inclusive becos de saída graciosa), não só o caminho até o
 * sucesso. O resultado agora é o `Set` forward inteiro, sem poda por destino.
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
  /**
   * Rótulo de aresta contendo QUALQUER uma destas palavras (casamento por
   * PALAVRA INTEIRA, não substring) = pertence ao OUTRO caminho, poda daqui.
   * `null` = sem bifurcação por rótulo (trilha trivial).
   *
   * ⚠️ 28/08 — virou array E o casamento virou `\bpalavra\b` (regex, não
   * `.includes()`) por causa de "ME" × "MEI": "ME" é PREFIXO de "MEI", então
   * `"MEI, abrir".includes("me")` dava falso positivo. Com `\b`, "ME" só
   * bate seguido de fronteira de palavra (vírgula/espaço), nunca no meio de
   * "MEI". Continua funcionando pros termos antigos ("abrir"/"migrar"), que
   * não tinham esse problema de prefixo.
   */
  excluirPalavras: string[] | null;
}

function casaPalavra(label: string | undefined, palavra: string): boolean {
  if (!label) return false;
  return new RegExp(`\\b${palavra}\\b`, "i").test(label);
}

export const TRILHAS: Trilha[] = [
  { id: "abrir", nome: "Quero abrir minha empresa", cor: "#F2643C" /* coral — marca */, deId: "E3", deHandle: "abrir", ateId: "A5", excluirPalavras: ["migrar"] },
  { id: "migrar", nome: "Já tenho empresa", cor: "#17A06A" /* verde-sucesso */, deId: "E3", deHandle: "migrar", ateId: "A5", excluirPalavras: ["abrir"] },
  { id: "login", nome: "Entrar na minha conta", cor: "#3B82E0" /* azul-info, uso mínimo */, deId: "E3", deHandle: "login", ateId: "E3_1", excluirPalavras: null },
  /**
   * 🆕 28/08 (pedido do Pedro) — 4 trilhas por REGIME, cruzando abrir/migrar
   * (deHandle igual às de cima, de propósito — não disparam pelo pontinho do
   * E3 no canvas, `.find()` acharia a genérica primeiro; disparam só pelo
   * botão da legenda, que chama `setTrilhaAtivaId` direto pelo `id`). O corte
   * ME×MEI só existe como PALAVRA no rótulo da aresta (`"ME, abrir"` ×
   * `"MEI, abrir..."`), calculado, não uma lista de nós à mão.
   */
  { id: "abrir-me", nome: "Abrir empresa · ME", cor: "#B8461F" /* coral escurecido — distingue do "abrir" genérico */, deId: "E3", deHandle: "abrir", ateId: "A5", excluirPalavras: ["migrar", "MEI"] },
  { id: "abrir-mei", nome: "Abrir empresa · MEI", cor: "#E0A03F" /* âmbar — mesma família "espera" da legenda, sem colidir com as outras 6 */, deId: "E3", deHandle: "abrir", ateId: "A5", excluirPalavras: ["migrar", "ME"] },
  { id: "migrar-me", nome: "Já tenho empresa · ME", cor: "#0F7A4E" /* verde escurecido — distingue do "migrar" genérico */, deId: "E3", deHandle: "migrar", ateId: "A5", excluirPalavras: ["abrir", "MEI"] },
  { id: "migrar-mei", nome: "Já tenho empresa · MEI", cor: "#8B5CF6" /* roxo — livre na paleta atual do mapa */, deId: "E3", deHandle: "migrar", ateId: "A5", excluirPalavras: ["abrir", "ME"] },
];

/** Chave estável pra casar uma `ArestaFlow` (dado bruto) com uma `Edge` já
 *  processada pelo React Flow — não usa o `id` final (que já carrega índices
 *  auto de espalhamento), só o trio que realmente identifica a aresta. */
export function chaveAresta(de: string, para: string, deHandle?: string | null): string {
  return `${de}|${deHandle || ""}|${para}`;
}

export function calcularArestasTrilha(grafo: FlowGraph, trilha: Trilha): Set<string> {
  const porOrigem = new Map<string, ArestaFlow[]>();
  for (const e of grafo.edges) {
    (porOrigem.get(e.de) ?? porOrigem.set(e.de, []).get(e.de)!).push(e);
  }

  // BFS pra frente a partir da aresta certa do handle, podando só pelo
  // rótulo (o OUTRO regime/intenção). Sem alcançabilidade reversa: becos de
  // saída graciosa (waitlist, exterior, 5+ sócios, MEI-outra-empresa...)
  // ficam DENTRO da trilha de propósito — são variáveis reais desse fluxo.
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
      if (trilha.excluirPalavras?.some((palavra) => casaPalavra(prox.label, palavra))) continue;
      if (!alcancadasPraFrente.has(prox)) {
        alcancadasPraFrente.add(prox);
        fila.push(prox);
      }
    }
  }

  const resultado = new Set<string>();
  for (const e of alcancadasPraFrente) {
    resultado.add(chaveAresta(e.de, e.para, e.deHandle));
  }
  return resultado;
}

/**
 * 🆕 28/08 (pedido do Pedro) — as TELAS (nós) da trilha, não só as linhas.
 * Deriva do mesmo `Set` de `calcularArestasTrilha` (cada chave já carrega
 * `de` e `para`) — não recalcula nada, só espalha os nós que aparecem em
 * qualquer aresta da trilha. É o que o board usa pra apagar (cinza-padrão)
 * as telas que NÃO pertencem ao fluxo em destaque.
 */
export function nosDaTrilha(arestas: Set<string>): Set<string> {
  const nos = new Set<string>();
  for (const chave of arestas) {
    const [de, , para] = chave.split("|");
    nos.add(de);
    nos.add(para);
  }
  return nos;
}
