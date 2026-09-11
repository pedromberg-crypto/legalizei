import { describe, expect, it } from "vitest";

import grafo from "@/lib/processos-graph.json";
import { layoutFaixa } from "@/lib/processos-medidas";
import {
  bolinhaDaAresta,
  montarFaixas,
  ordenarFaixas,
  rotuloDe,
  type ArestaBruta,
} from "@/lib/faixa-saidas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INVARIANTES DA FAIXA — cada defeito que o Pedro achou vira um teste.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 POR QUE ESTE ARQUIVO EXISTE. Em 11/09 ele achou 10 defeitos no board, 8
 * deles na VISTA, e cobrou a auditoria: *"dessa forma nunca vamos fechar um
 * modelo padrão de validação de processos, e o prazo está curto."*
 *
 * O diagnóstico foi medido, não sentido: 34 verificações sobre o dado, ZERO
 * sobre a vista. A resposta é esta — invariantes que rodam em segundos, sem
 * navegador, e que rodam contra o GRAFO REAL. Se uma mudança em
 * `processos-data.mjs` fizer a faixa mentir, quebra aqui, não no print dele.
 *
 * ⚠️ Não substitui o olho dele em espaçamento, cor e texto. Pega COERÊNCIA:
 * a linha sai da bolinha certa, o bloco fecha, nenhum CTA mente.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type ArestaJson = ArestaBruta & { tracejado?: boolean };
const arestas = grafo.edges as ArestaJson[];
const idsDePasso = new Set((grafo.nodes as { id: string }[]).map((n) => n.id));

/**
 * Um cenário devolve AS ARESTAS e as faixas montadas a partir delas — nunca
 * só as faixas. Foi essa a primeira coisa que o teste pegou: eu montava as
 * faixas do cenário "tudo aceito" e conferia contra a lista GLOBAL de arestas,
 * então cobrava bolinha pra uma aresta que naquele cenário nem existe.
 */
const faixasPendentes = () => ({ arestas, faixas: montarFaixas(arestas) });

/**
 * O board com tudo aceito: some a aresta substituída E o passo removido, e
 * com ele toda aresta que o tocava.
 *
 * ⚠️ Este cenário replica os filtros do board de propósito. Foi ele que pegou
 * o primeiro erro — eu tinha esquecido a remoção de passo, e a aresta
 * `P4.3 → P4.4` ficou apontando pra um cartão que não existe mais.
 */
const faixasAceitas = () => {
  const removidos = new Set(
    (grafo.nodes as { id: string; removidoPor?: string }[])
      .filter((n) => n.removidoPor)
      .map((n) => n.id),
  );
  const vivas = arestas.filter(
    (a) => !a.substituidaPor && !removidos.has(a.de) && !removidos.has(a.para),
  );
  return { arestas: vivas, faixas: montarFaixas(vivas) };
};

const cenarios = [
  ["board pendente", faixasPendentes],
  ["board com tudo aceito", faixasAceitas],
] as const;

describe.each(cenarios)("%s", (_nome, montar) => {
  it("a lista plana é exatamente a concatenação dos grupos", () => {
    for (const [id, faixa] of montar().faixas) {
      const concat = faixa.grupos.flatMap((g) => g.itens);
      expect(faixa.plana, `faixa do ${id}`).toEqual(concat);
    }
  });

  it("toda aresta com condição sai de uma bolinha que é a DELA", () => {
    const { arestas: doCenario, faixas } = montar();
    for (const a of doCenario) {
      const faixa = faixas.get(a.de);
      const bolinha = bolinhaDaAresta(faixa, a);
      if (!rotuloDe(a) || !faixa) {
        // sem condição, ou passo sem faixa: sai pela âncora padrão
        continue;
      }
      expect(bolinha, `${a.de} → ${a.para} (${rotuloDe(a)})`).toBeDefined();

      const i = Number(bolinha!.replace("saida-", ""));
      const cta = faixa.plana[i];
      expect(cta, `bolinha ${bolinha} do ${a.de}`).toBeDefined();
      // 🐛 este é o bug de 11/09: a linha chegava no cartão do vizinho
      expect(cta.label, `rótulo da bolinha ${bolinha} do ${a.de}`).toBe(rotuloDe(a));
      expect(
        cta.para === a.para || (cta.paras ?? []).includes(a.para),
        `a bolinha ${bolinha} do ${a.de} aponta pro ${cta.para}, e a aresta vai pro ${a.para}`,
      ).toBe(true);
    }
  });

  it("nenhum CTA com rótulo vazio — faixa é sobre escolha", () => {
    for (const [id, faixa] of montar().faixas) {
      for (const s of faixa.plana) {
        expect(s.label.trim(), `CTA vazio no ${id}`).not.toBe("");
      }
    }
  });

  it("faixa só existe com 2+ condições", () => {
    for (const [id, faixa] of montar().faixas) {
      expect(faixa.plana.length, `faixa do ${id} com uma condição só`).toBeGreaterThan(1);
    }
  });

  it("duas condições com a MESMA frase no mesmo bloco só com selo que as distinga", () => {
    for (const [id, faixa] of montar().faixas) {
      for (const grupo of faixa.grupos) {
        const vistos = new Map<string, number>();
        for (const s of grupo.itens) vistos.set(s.label, (vistos.get(s.label) ?? 0) + 1);
        for (const [label, n] of vistos) {
          if (n < 2) continue;
          const gemeas = grupo.itens.filter((s) => s.label === label);
          const semSelo = gemeas.filter((s) => !s.proposta && !s.saiCom && !s.viraPor);
          expect(
            semSelo.length,
            `${id}: "${label}" aparece ${n}x no mesmo bloco e ${semSelo.length} sem selo`,
          ).toBeLessThan(2);
        }
      }
    }
  });

  it("todo destino de CTA é um passo que existe", () => {
    for (const [id, faixa] of montar().faixas) {
      for (const s of faixa.plana) {
        expect(idsDePasso.has(s.para), `${id} → ${s.para} não existe`).toBe(true);
      }
    }
  });

  it("as bolinhas cabem no cartão e não se sobrepõem", () => {
    for (const [id, faixa] of montar().faixas) {
      const { altura, tops } = layoutFaixa(
        faixa.grupos.map((g) => ({ comCabeca: g.comCabeca, n: g.itens.length })),
      );
      const todos = tops.flat();
      expect(todos.length, `bolinhas do ${id}`).toBe(faixa.plana.length);
      for (let i = 1; i < todos.length; i += 1) {
        // 🐛 a mesma família do bug das duas alturas (cartões sobrepostos)
        expect(todos[i], `bolinhas fora de ordem no ${id}`).toBeGreaterThan(todos[i - 1]);
      }
      for (const t of todos) expect(t, `bolinha fora do cartão no ${id}`).toBeLessThan(altura);
    }
  });

  it("ordenar por posição NÃO desfaz os blocos", () => {
    const { faixas } = montar();
    // posição invertida de propósito: o pior caso pro agrupamento
    const ordem = new Map([...idsDePasso].map((id, i) => [id, -i]));
    ordenarFaixas(faixas, (id) => ordem.get(id) ?? null);
    for (const [id, faixa] of faixas) {
      expect(faixa.plana, `faixa do ${id} depois de ordenar`).toEqual(
        faixa.grupos.flatMap((g) => g.itens),
      );
      const trilhas = faixa.grupos.map((g) => g.trilha);
      expect(new Set(trilhas).size, `bloco repetido no ${id}`).toBe(trilhas.length);
    }
  });
});

describe("o colapso da saída redirecionada", () => {
  it("junta a que morre com a que nasce, e herda a declaração nova", () => {
    const faixas = montarFaixas([
      { de: "X", para: "A", label: "correu bem", substituidaPor: "S9" },
      { de: "X", para: "S9", label: "correu bem", proposta: "S9", quando: "fatura" },
      { de: "X", para: "B", label: "não deu certo" },
    ]);
    const faixa = faixas.get("X")!;
    expect(faixa.plana).toHaveLength(2);
    const redirecionada = faixa.plana.find((s) => s.label === "correu bem")!;
    expect(redirecionada.para).toBe("A");
    expect(redirecionada.viraPara).toBe("S9");
    // 🐛 sem herdar a trilha, o bloco "já pago" ganhava um "correu bem" órfão
    expect(redirecionada.quando).toBe("fatura");
    expect(redirecionada.paras).toEqual(["A", "S9"]);
  });

  it("as DUAS arestas do par saem da mesma bolinha", () => {
    const par: ArestaBruta[] = [
      { de: "X", para: "A", label: "correu bem", substituidaPor: "S9" },
      { de: "X", para: "S9", label: "correu bem", proposta: "S9" },
      { de: "X", para: "B", label: "não deu certo" },
    ];
    const faixa = montarFaixas(par).get("X");
    expect(bolinhaDaAresta(faixa, par[0])).toBe(bolinhaDaAresta(faixa, par[1]));
  });
});

describe("aresta sem condição", () => {
  it("não vira CTA, e sai pela âncora padrão", () => {
    const faixas = montarFaixas([
      { de: "X", para: "A", label: "" },
      { de: "X", para: "B", label: "" },
    ]);
    // 🐛 era aqui que nasciam os dois CTAs escritos "segue"
    expect(faixas.get("X")).toBeUndefined();
    expect(bolinhaDaAresta(undefined, { de: "X", para: "A", label: "" })).toBeUndefined();
  });
});
