import { layoutFaixa } from "@/lib/processos-medidas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A FAIXA DE SAÍDAS — função PURA, e é essa a correção (11/09).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 POR QUE ESTE ARQUIVO EXISTE. Auditoria pedida pelo Pedro depois do 8º
 * defeito do mesmo dia: *"isso é erro MUITO BÁSICO e eu pedi pra não repetir.
 * Chegou a hora de auditar o que está gerando esse tanto de erro ridículo."*
 *
 * O número que fechou o diagnóstico: **34 verificações automáticas sobre o
 * DADO, zero sobre a VISTA** — e 8 dos 10 defeitos que ele achou estavam na
 * vista. Eu blindei a camada que eu estava pensando e deixei nua a camada que
 * ele olha.
 *
 * E a classe que se repetiu em 5 deles é sempre a mesma: **duas fontes para o
 * mesmo fato**. A altura do cartão (componente × dagre). O índice da bolinha
 * (lista plana × ordem dos grupos). O rótulo da aresta (velha × nova). A
 * trilha (aresta nova tinha, a antiga não). O prazo (escrito em dois passos).
 *
 * 🔑 A correção não é disciplina minha, é tirar a possibilidade: a faixa
 * inteira passa a ser calculada AQUI, numa passada só, e o board e o cartão
 * consomem o MESMO objeto. Não existe mais "o outro lado recalcula".
 *
 * ⚠️ Nada aqui pode importar React, `dagre` ou o JSON gerado — é função pura,
 * pra ser testável sem navegador. O teste de invariantes (`faixa-saidas.test.ts`)
 * roda em segundos e transforma cada defeito que o Pedro achou em invariante
 * que não volta. É a resposta pra ele ter virado o detector de bug.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ArestaBruta = {
  de: string;
  para: string;
  label: string;
  quando?: string;
  abre?: string;
  proposta?: string;
  substituidaPor?: string;
  rotuloNovo?: string;
  quandoNovo?: string;
  rotuladaPor?: string;
};

export type Saida = {
  label: string;
  para: string;
  quando?: string;
  /** a proposta que CRIA esta saída */
  proposta?: string;
  /** a proposta que MATA esta saída */
  saiCom?: string;
  /** a proposta que só RE-DECLARA (rótulo ou trilha); o caminho não muda */
  redeclaradaPor?: string;
  /** quando a saída foi colapsada com a que vai substituí-la */
  viraPor?: string;
  viraPara?: string;
  /** todos os destinos que este CTA representa (ancora as duas arestas) */
  paras?: string[];
};

export type Grupo = { trilha?: string; comCabeca: boolean; itens: Saida[] };
export type Faixa = { grupos: Grupo[]; plana: Saida[] };

/**
 * 🔴 `rotula` vale JÁ, sem esperar o aceite. A diferença que justifica: ele
 * não cria nem mata caminho, só diz o que o caminho É. Mostrar pendente não
 * engana sobre estrutura; ESCONDER, sim — e escondia, deixando o bloco "já
 * pago" com um "correu bem" que caía na fatura.
 */
export const rotuloDe = (a: Pick<ArestaBruta, "label" | "rotuloNovo" | "rotuladaPor">) =>
  (a.rotuladaPor && a.rotuloNovo !== undefined ? a.rotuloNovo : a.label) || "";

export const trilhaDe = (a: Pick<ArestaBruta, "quando" | "quandoNovo" | "rotuladaPor">) =>
  (a.rotuladaPor && a.quandoNovo !== undefined ? a.quandoNovo : a.quando) || undefined;

/**
 * Monta a faixa de cada passo a partir das arestas VISÍVEIS.
 *
 * Regras, todas nascidas de defeito que o Pedro achou:
 *  1. só entra aresta com CONDIÇÃO escrita — aresta sem rótulo é sequência,
 *     não escolha, e inventar "segue" pra ela é preencher espaço vazio;
 *  2. saída sendo redirecionada COLAPSA na sua substituta e herda a
 *     declaração nova inteira (destino, rótulo e trilha) — meia declaração é
 *     contradição na tela;
 *  3. faixa só existe com 2+ condições — uma condição não é escolha;
 *  4. com mais de um bloco, TODOS ganham cabeçalho, inclusive o comum, senão
 *     não dá pra ver onde o "vale pra todas" termina.
 */
export function montarFaixas(arestas: ArestaBruta[]): Map<string, Faixa> {
  const porNo = new Map<string, Saida[]>();

  for (const a of arestas) {
    const label = rotuloDe(a);
    if (!label) continue; // regra 1
    const lista = porNo.get(a.de) ?? [];
    lista.push({
      label,
      para: a.para,
      quando: trilhaDe(a),
      proposta: a.proposta,
      saiCom: a.substituidaPor,
      redeclaradaPor: a.rotuladaPor,
    });
    porNo.set(a.de, lista);
  }

  // regra 2 — colapso
  for (const lista of porNo.values()) {
    for (const atual of [...lista]) {
      if (!atual.saiCom) continue;
      const nova = lista.find((x) => x.proposta === atual.saiCom && x.label === atual.label);
      if (!nova) continue;
      atual.viraPor = atual.saiCom;
      atual.viraPara = nova.para;
      atual.paras = [atual.para, nova.para];
      if (nova.quando !== undefined) atual.quando = nova.quando;
      lista.splice(lista.indexOf(nova), 1);
    }
  }

  const faixas = new Map<string, Faixa>();
  for (const [id, lista] of porNo) {
    if (lista.length < 2) continue; // regra 3

    const comuns = lista.filter((x) => !x.quando);
    const porTrilha = new Map<string, Saida[]>();
    for (const x of lista) {
      if (!x.quando) continue;
      porTrilha.set(x.quando, [...(porTrilha.get(x.quando) ?? []), x]);
    }

    const grupos: Grupo[] = [];
    if (comuns.length) grupos.push({ itens: comuns, comCabeca: false });
    for (const [trilha, itens] of porTrilha) grupos.push({ trilha, itens, comCabeca: true });
    if (grupos.length > 1) for (const g of grupos) g.comCabeca = true; // regra 4

    faixas.set(id, { grupos, plana: grupos.flatMap((g) => g.itens) });
  }
  return faixas;
}

/**
 * 🔴 Ordena DENTRO de cada bloco e reescreve a lista plana como a concatenação
 * deles. Uma ordem só, lida pelos dois lados.
 *
 * 🐛 Foi a ausência disto que fez a linha do "correu bem" da trilha paga
 * chegar no cartão do "cancelou o plano": o id da bolinha nascia da lista
 * plana (ordenada por altura do destino) e era consumido pelo cartão, que
 * caminha por grupo. Enquanto as duas ordens coincidiram, funcionou.
 *
 * ⚠️ O bloco de trilha NÃO se desfaz pra acomodar a altura de um destino:
 * cruzar linha só importa entre vizinhos, e separar as trilhas vale mais.
 */
export function ordenarFaixas(faixas: Map<string, Faixa>, posicaoDe: (id: string) => number | null) {
  for (const faixa of faixas.values()) {
    for (const grupo of faixa.grupos) {
      grupo.itens.sort((a, b) => {
        const pa = posicaoDe(a.para);
        const pb = posicaoDe(b.para);
        if (pa === null || pb === null) return 0;
        return pa - pb;
      });
    }
    faixa.plana = faixa.grupos.flatMap((g) => g.itens);
  }
  return faixas;
}

/** A altura do cartão, da mesma passada que posiciona as bolinhas. */
export function alturaDaFaixa(faixa?: Faixa) {
  return layoutFaixa(
    (faixa?.grupos ?? []).map((g) => ({ comCabeca: g.comCabeca, n: g.itens.length })),
  ).altura;
}

/**
 * De qual bolinha esta aresta sai. `undefined` = sai pela âncora padrão, que é
 * o caso de toda aresta sem condição.
 *
 * 🔑 Casa por (rótulo, destino), aceitando o destino colapsado: a saída que
 * está sendo redirecionada representa DUAS arestas, a que morre e a que nasce.
 */
export function bolinhaDaAresta(faixa: Faixa | undefined, a: ArestaBruta): string | undefined {
  if (!faixa) return undefined;
  const i = faixa.plana.findIndex(
    (x) => x.label === rotuloDe(a) && (x.para === a.para || (x.paras ?? []).includes(a.para)),
  );
  return i >= 0 ? `saida-${i}` : undefined;
}
