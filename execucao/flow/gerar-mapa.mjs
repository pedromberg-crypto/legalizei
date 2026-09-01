/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR + VERSIONADOR do mapa do flow.
 * ═══════════════════════════════════════════════════════════════════════════
 * Lê a fonte-única (flow-data.mjs), re-renderiza o diagrama Mermaid + a tabela
 * de validação DENTRO da nota `mapa-flow-mermaid.md` (entre marcadores), e:
 *
 *   1. CHECA DRIFT — cada nó com `rota` tem que ter um page.tsx real no app.
 *      Rota citada que não existe, ou rota que existe sem nó, vira aviso.
 *   2. VERSIONA — se o conteúdo estrutural mudou desde a última vez, incrementa
 *      a versão, grava um snapshot em `versoes/` (.json p/ diff + .mmd legível)
 *      e prepende uma linha no histórico da nota, com o RESUMO do que mudou.
 *      Igual não muda → não versiona (não polui o histórico).
 *   3. 🆕 26/08 — EXPORTA `app/src/lib/flow-graph.json`, consumido pelo board
 *      interativo `/mapa` (React Flow). Sempre reescrito (não é versionado
 *      como o resto): é uma TRADUÇÃO 1:1 de NODES/EDGES, nunca diverge porque
 *      nunca é editado à mão — só nasce daqui.
 *
 * Rodar:  node execucao/flow/gerar-mapa.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { NODES, EDGES, SUBGRAFOS, PREENCHIDOS_INTERNAMENTE } from "./flow-data.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url)); // execucao/flow
const NOTA = path.join(DIR, "..", "mapa-flow-mermaid.md"); // execucao/mapa-flow-mermaid.md
const VERSOES = path.join(DIR, "versoes");
const APP = path.join(DIR, "..", "..", "app", "src", "app");
const FLOW_GRAPH_JSON = path.join(DIR, "..", "..", "app", "src", "lib", "flow-graph.json");
const DADOS_MD = path.join(DIR, "..", "dados-coletados-abertura-ate-viabilidade.md");
const DADOS_TS = path.join(DIR, "..", "..", "app", "src", "lib", "dados-constituicao.ts");

const hoje = new Date().toISOString().slice(0, 10);

/* ─── 1. RENDER: Mermaid ────────────────────────────────────────────────── */

function defNo(n) {
  const l = n.label;
  const corpo =
    n.forma === "decisao"
      ? `${n.id}{"${l}"}`
      : n.forma === "terminal"
        ? `${n.id}(["${l}"])`
        : `${n.id}["${l}"]`;
  return `  ${corpo}${n.classe ? `:::${n.classe}` : ""}`;
}

function renderMermaid() {
  const linhas = ["```mermaid", "flowchart TD"];

  // Subgrafos primeiro (com seus nós dentro).
  for (const sg of SUBGRAFOS) {
    const membros = NODES.filter((n) => n.grupo === sg.id);
    if (!membros.length) continue;
    linhas.push(`  subgraph ${sg.id}["${sg.titulo}"]`);
    linhas.push(`    direction TB`);
    for (const n of membros) linhas.push("  " + defNo(n));
    linhas.push("  end");
  }

  // Nós fora de subgrafo.
  for (const n of NODES.filter((x) => !x.grupo)) linhas.push(defNo(n));

  linhas.push("");

  // Conexões (só ids; os labels já foram definidos acima).
  for (const e of EDGES) {
    const seta = e.tracejado ? "-.->" : "-->";
    const rot = e.label ? `|"${e.label}"|` : "";
    linhas.push(`  ${e.de} ${seta}${rot} ${e.para}`);
  }

  linhas.push("");
  linhas.push("  classDef saida fill:#fde8e4,stroke:#e0603f,color:#7a2d18;");
  linhas.push("  classDef feliz fill:#e6f4ea,stroke:#2f9e5a,color:#1c5e37;");
  linhas.push("  classDef espera fill:#fff4e0,stroke:#e0a03f,color:#7a5518;");
  linhas.push("  classDef branch fill:#eef1ff,stroke:#5b6cf0,color:#2a338a;");
  linhas.push("  classDef inline fill:#f1f1f3,stroke:#9aa0a6,color:#555;");
  linhas.push("  classDef todo fill:#f7f7f8,stroke:#bcbcc2,stroke-dasharray:5 4,color:#888;");
  linhas.push("```");
  return linhas.join("\n");
}

/* ─── 2. RENDER: tabela de validação ────────────────────────────────────── */

const SEL = { oficial: "🟢", ux: "⚪", pendente: "🟡" };

function renderTabela(driftMsgs) {
  const linhas = [];
  if (driftMsgs.length) {
    linhas.push(`> ⚠️ **Drift detectado:** ${driftMsgs.join(" · ")}`);
    linhas.push("");
  }
  // 🆕 28/07: coluna "Dados coletados" — o que aquela etapa pede do cliente,
  // até a constituição (ATIVA). Vem do campo `dados` de cada nó em flow-data.
  linhas.push("| # | Tela | Dados coletados nesta etapa | Construída | Validado | Falta validar |");
  linhas.push("|---|---|---|:--:|:--:|---|");
  let i = 0;
  for (const n of NODES) {
    if (n.naTabela === false) continue;
    i++;
    const tela = n.label.replace(/<br\/>/g, " · ");
    const constr = n.status === "construida" ? "✅" : "🚧";
    const val = SEL[n.validado] ?? "🟡";
    const dados = n.dados && n.dados.trim() ? n.dados : "—";
    linhas.push(`| ${i} | ${tela} | ${dados} | ${constr} | ${val} | ${n.falta || "—"} |`);
  }
  return linhas.join("\n");
}

/* ─── 3. DRIFT: nós com rota × page.tsx reais ───────────────────────────── */

function rotasReais(dir, segs = [], acc = new Set()) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      const grupo = e.name.startsWith("(") && e.name.endsWith(")");
      rotasReais(path.join(dir, e.name), grupo ? segs : [...segs, e.name], acc);
    } else if (e.name === "page.tsx") {
      acc.add("/" + segs.join("/"));
    }
  }
  return acc;
}

// Deep-link (`?slide=0`, `?intencao=abrir`...) aponta pro MESMO page.tsx da
// rota base — a query só seleciona um estado interno (mesmo padrão de
// `/entrada?intencao=`, `/gate?etapa=`). O drift-check compara a rota BASE,
// senão todo nó com query acusaria "não há page.tsx" pra sempre.
const base = (rota) => rota.split("?")[0];

function checarDrift() {
  const reais = rotasReais(APP);
  const doMapa = new Set();
  for (const n of NODES) {
    if (n.rota) doMapa.add(base(n.rota));
    if (n.rotasCobre) for (const r of n.rotasCobre) doMapa.add(base(r)); // 1 nó cobre N rotas
  }
  const msgs = [];
  for (const n of NODES.filter((x) => x.rota)) {
    if (!reais.has(base(n.rota))) msgs.push(`${n.id} cita ${n.rota} mas não há page.tsx`);
  }
  const ignora = new Set(["/", "/mockup"]); // raiz + ferramenta de review
  for (const r of reais) {
    if (!ignora.has(r) && !doMapa.has(r)) msgs.push(`rota ${r} existe mas não está no mapa`);
  }
  return msgs;
}

/* ─── 3b. EXPORT: flow-graph.json (pro board /mapa) ─────────────────────── */

/**
 * 🆕 26/08 — nós com `classe: "todo"` são marcadores HISTÓRICOS (ex.: `REMOVIDO_N24`,
 * "tela removida, fica só como marca no mapa") — não são passo de flow real,
 * então ficam de fora do board interativo (o Mermaid ainda os mostra, é
 * registro; o board é ferramenta de trabalho do dev, não precisa do museu).
 */
function exportarFlowGraph() {
  const nodes = NODES.filter((n) => n.classe !== "todo").map((n) => ({
    id: n.id,
    rota: n.rota || null,
    label: n.label,
    forma: n.forma,
    classe: n.classe || "",
    status: n.status,
    validado: n.validado,
    falta: n.falta || "",
    dados: n.dados || "",
    // 🆕 26/08 (pedido do Pedro: "linka o CTA no caminho dele, não a tela
    // inteira") — pontos de saída nomeados, 1 por CTA visível na tela, cada
    // aresta escolhe de qual sai via `deHandle`. Ausente = comportamento
    // antigo (1 saída genérica do nó inteiro), sem quebrar nada.
    handles: n.handles || undefined,
  }));
  const idsValidos = new Set(nodes.map((n) => n.id));
  const edges = EDGES.filter((e) => idsValidos.has(e.de) && idsValidos.has(e.para)).map((e) => ({
    de: e.de,
    para: e.para,
    label: e.label || "",
    tracejado: !!e.tracejado,
    deHandle: e.deHandle || undefined,
  }));
  fs.mkdirSync(path.dirname(FLOW_GRAPH_JSON), { recursive: true });
  fs.writeFileSync(FLOW_GRAPH_JSON, JSON.stringify({ nodes, edges }, null, 2));
}

/* ─── 3c. EXPORT: dados-coletados-abertura-ate-viabilidade.md ───────────── */

/**
 * 🆕 26/08 (pedido do Pedro: "se alterarmos algo no flow que envolva campos
 * captados do usuário, o .md se atualiza sozinho") — GERADO a partir de
 * NODES/EDGES, nunca editado à mão (mesma régua do `flow-graph.json`).
 *
 * Preâmbulo fixo (E1→E3, sempre mostrado antes do fork) + o caminho Abrir
 * calculado por alcançabilidade — MESMO algoritmo do `app/src/lib/trilhas.ts`
 * (forward BFS a partir de `E3, deHandle:"abrir"`, podando arestas rotuladas
 * "migrar", cruzado com alcançabilidade reversa a partir do nó de corte).
 * Duplicado aqui de propósito: este script roda em Node puro fora do Next,
 * não importa `.ts` da app. Mudou o algoritmo lá? muda aqui igual.
 */
const PREAMBULO_ABRIR = ["E1", "E2_1", "E2_2", "E2_3", "E3"];
const CORTE_VIABILIDADE = "C7"; // 1ª tentativa de viabilidade (JUCEMG)

function calcularCaminhoAbrir(deId, deHandle, ateId, excluir) {
  const porOrigem = new Map();
  const porDestino = new Map();
  for (const e of EDGES) {
    (porOrigem.get(e.de) ?? porOrigem.set(e.de, []).get(e.de)).push(e);
    (porDestino.get(e.para) ?? porDestino.set(e.para, []).get(e.para)).push(e);
  }
  const alcancadas = new Set();
  const visitados = new Set();
  const primeira = (porOrigem.get(deId) ?? []).filter((e) => e.deHandle === deHandle);
  const fila = [...primeira];
  primeira.forEach((e) => alcancadas.add(e));
  while (fila.length) {
    const e = fila.shift();
    if (visitados.has(e.para)) continue;
    visitados.add(e.para);
    if (e.para === ateId) continue;
    for (const prox of porOrigem.get(e.para) ?? []) {
      if (excluir && prox.label?.toLowerCase().includes(excluir)) continue;
      if (!alcancadas.has(prox)) {
        alcancadas.add(prox);
        fila.push(prox);
      }
    }
  }
  const alcancaDestino = new Set([ateId]);
  const filaR = [ateId];
  while (filaR.length) {
    const id = filaR.shift();
    for (const e of porDestino.get(id) ?? []) {
      if (!alcancadas.has(e)) continue;
      if (!alcancaDestino.has(e.de)) {
        alcancaDestino.add(e.de);
        filaR.push(e.de);
      }
    }
  }
  const nosNoTrajeto = new Set();
  for (const e of alcancadas) {
    if (alcancaDestino.has(e.de) && alcancaDestino.has(e.para)) {
      nosNoTrajeto.add(e.de);
      nosNoTrajeto.add(e.para);
    }
  }
  // Ordem estável = ordem de declaração em NODES (já é sequencial por
  // construção do arquivo-fonte) — evita reimplementar sort topológico
  // pra um grafo com ramos/loop (DESAMB) que não tem 1 ordem "certa" única.
  return NODES.filter((n) => nosNoTrajeto.has(n.id)).map((n) => n.id);
}

function gerarDadosConstituicaoMd() {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  // `E3` é o `deId` do cálculo (sempre entra no trajeto) E já está no
  // preâmbulo fixo — dedup pra não listar a mesma tela 2x.
  const vistos = new Set();
  const caminho = [...PREAMBULO_ABRIR, ...calcularCaminhoAbrir("E3", "abrir", CORTE_VIABILIDADE, "migrar")].filter(
    (id) => (vistos.has(id) ? false : (vistos.add(id), true)),
  );

  const linhas = [];
  linhas.push("---");
  linhas.push("tipo: verdade");
  linhas.push("status: GERADO — não editar à mão, nasce de `execucao/flow/gerar-mapa.mjs`");
  linhas.push(`data: ${hoje}`);
  linhas.push("assunto: dados-coletados-abertura");
  linhas.push("tags: [execucao, flow, dados, abertura]");
  linhas.push("---");
  linhas.push("");
  linhas.push("# 📋 Dados coletados — Abertura de CNPJ, até a 1ª tentativa de viabilidade");
  linhas.push("");
  linhas.push(
    "> ⚠️ **Nota gerada** — roda `node execucao/flow/gerar-mapa.mjs` pra atualizar depois de mexer em `flow-data.mjs`. " +
      "Escopo: só o caminho **Abrir** (não Migrar). Do primeiro toque no app até o clique que dispara a 1ª tentativa de viabilidade " +
      `na Junta (\`${CORTE_VIABILIDADE}\`, CTA que envia a razão social pra JUCEMG). Ver [[mapa-flow-mermaid]] pro diagrama completo, ` +
      "[[gap-analise-dados-abertura-vs-pesquisa-gemini]] pro cruzamento com pesquisa externa.",
  );
  linhas.push("");
  linhas.push("## Telas do caminho, em ordem");
  linhas.push("");
  for (const id of caminho) {
    const n = byId.get(id);
    if (!n) continue;
    const titulo = n.label.replace(/<br\/>/g, " ");
    linhas.push(`### ${titulo}`);
    if (n.dados && n.dados.trim()) {
      for (const item of n.dados.split(" · ")) linhas.push(`- ${item}`);
    } else {
      linhas.push("- _(sem dado novo — contexto, confirmação ou decisão do sistema)_");
    }
    if (id === CORTE_VIABILIDADE) {
      linhas.push("");
      linhas.push(
        "🔴 **É aqui que o CTA dispara a 1ª tentativa de viabilidade na Junta (JUCEMG)** — os campos acima são exatamente o que vai pro pedido de viabilidade.",
      );
    }
    linhas.push("");
  }

  if (PREENCHIDOS_INTERNAMENTE?.length) {
    linhas.push("## Preenchidos por nós, não pelo cliente");
    linhas.push("");
    linhas.push("> Campos que a viabilidade/DBE exigem, mas a Legalizai preenche internamente — decisões travadas em `marca/decisoes-marca.md`.");
    linhas.push("");
    linhas.push("| Campo | Valor | Onde entraria | Status | Por quê |");
    linhas.push("|---|---|---|---|---|");
    for (const p of PREENCHIDOS_INTERNAMENTE) {
      linhas.push(`| ${p.campo} | ${p.valor} | ${p.contexto} | ${p.status} | ${p.porque} |`);
    }
    linhas.push("");
  }

  linhas.push("## Nota de fonte");
  linhas.push("");
  linhas.push(
    "Gerado direto do campo `dados` de `flow-data.mjs` — reflete o que está **documentado como construído**, não necessariamente o que está " +
      "validado em produção (ver campo `validado` de cada nó). Qualquer mudança de campo nessas telas precisa entrar em `flow-data.mjs` primeiro; " +
      "rodar o gerador de novo atualiza esta nota sozinho.",
  );
  linhas.push("");
  return linhas.join("\n");
}

function exportarDadosConstituicao() {
  const md = gerarDadosConstituicaoMd();
  fs.writeFileSync(DADOS_MD, md);
  const ts =
    "// 🆕 26/08 — GERADO por `execucao/flow/gerar-mapa.mjs`, não editar à mão.\n" +
    "// Consumido pelo botão \"Baixar dados coletados\" do `/mapa`.\n" +
    `export const DADOS_CONSTITUICAO_MD = ${JSON.stringify(md)};\n`;
  fs.writeFileSync(DADOS_TS, ts);
}

/* ─── 4. VERSIONAMENTO ──────────────────────────────────────────────────── */

function estruturaAtual() {
  // O que conta como "mudança estrutural": id, label, status, validado, falta,
  // dados (🆕 28/07), e as conexões. Ordem estável (a fonte já é ordenada) →
  // hash determinístico.
  return {
    nodes: NODES.map((n) => ({
      id: n.id,
      label: n.label,
      status: n.status,
      validado: n.validado,
      falta: n.falta || "",
      dados: n.dados || "",
      handles: n.handles || null, // 🆕 26/08 — CTA por handle também é estrutural
    })),
    edges: EDGES.map((e) => ({
      de: e.de,
      para: e.para,
      label: e.label || "",
      tracejado: !!e.tracejado,
      deHandle: e.deHandle || null,
    })),
  };
}

function ultimoSnapshot() {
  if (!fs.existsSync(VERSOES)) return null;
  const jsons = fs
    .readdirSync(VERSOES)
    .filter((f) => /^v(\d+)-.*\.json$/.test(f))
    .map((f) => ({ f, v: Number(f.match(/^v(\d+)/)[1]) }))
    .sort((a, b) => b.v - a.v);
  if (!jsons.length) return null;
  const raw = JSON.parse(fs.readFileSync(path.join(VERSOES, jsons[0].f), "utf8"));
  return { v: jsons[0].v, dados: raw };
}

function diffResumo(prev, cur) {
  const pN = new Map(prev.nodes.map((n) => [n.id, n]));
  const cN = new Map(cur.nodes.map((n) => [n.id, n]));
  const add = [...cN.keys()].filter((k) => !pN.has(k));
  const rem = [...pN.keys()].filter((k) => !cN.has(k));
  const relabel = [];
  const statusMud = [];
  const validMud = [];
  const faltaMud = [];
  const dadosMud = [];
  for (const [id, c] of cN) {
    const p = pN.get(id);
    if (!p) continue;
    if (p.label !== c.label) relabel.push(`${id} "${p.label.replace(/<br\/>/g, " ")}"→"${c.label.replace(/<br\/>/g, " ")}"`);
    if (p.status !== c.status) statusMud.push(`${id} ${p.status}→${c.status}`);
    if (p.validado !== c.validado) validMud.push(`${id} ${p.validado}→${c.validado}`);
    if (p.falta !== c.falta) faltaMud.push(id);
    if ((p.dados || "") !== (c.dados || "")) dadosMud.push(id);
  }
  const kE = (e) => `${e.de}→${e.para}`;
  const pE = new Set(prev.edges.map(kE));
  const cE = new Set(cur.edges.map(kE));
  const addE = [...cE].filter((k) => !pE.has(k));
  const remE = [...pE].filter((k) => !cE.has(k));

  const partes = [];
  if (add.length) partes.push(`+nós ${add.join(",")}`);
  if (rem.length) partes.push(`-nós ${rem.join(",")}`);
  if (relabel.length) partes.push(`renomeou ${relabel.join("; ")}`);
  if (statusMud.length) partes.push(`status ${statusMud.join("; ")}`);
  if (validMud.length) partes.push(`validação ${validMud.join("; ")}`);
  if (faltaMud.length) partes.push(`falta-validar em ${faltaMud.join(",")}`);
  // Lista os ids só quando é ajuste pontual; preenchimento em massa (ex: coluna
  // nova) vira contagem, senão o histórico fica ilegível.
  if (dadosMud.length > 8) partes.push(`dados-coletados preenchido em ${dadosMud.length} nós`);
  else if (dadosMud.length) partes.push(`dados-coletados em ${dadosMud.join(",")}`);
  if (addE.length) partes.push(`+conexões ${addE.join(",")}`);
  if (remE.length) partes.push(`-conexões ${remE.join(",")}`);
  return partes.join(" · ") || "ajuste sem efeito estrutural";
}

/* ─── 5. ESCREVER NA NOTA ───────────────────────────────────────────────── */

function setBloco(txt, nome, inner) {
  const ini = `<!-- FLOW:${nome}:INI -->`;
  const fim = `<!-- FLOW:${nome}:FIM -->`;
  const re = new RegExp(`${ini}[\\s\\S]*?${fim}`);
  if (!re.test(txt)) throw new Error(`Marcador FLOW:${nome} não encontrado na nota.`);
  return txt.replace(re, `${ini}\n${inner}\n${fim}`);
}

/**
 * 🐛→🔒 01/09 — o `\r?` NÃO é decoração. O regex antigo exigia `\n` colado no
 * marcador; quando a nota vem fresca de um `git checkout` no Windows ela está
 * em CRLF, o match falhava, `blocoAtual` devolvia "" e o histórico de versões
 * era APAGADO na gravação seguinte (aconteceu de verdade: a v59 zerou as 19
 * versões anteriores, restauradas na mão). Só apareceu agora porque, entre
 * gerações, quem escreve a nota é este script (LF) — o CRLF só entra quando o
 * git toca no arquivo.
 */
function blocoAtual(txt, nome) {
  const m = txt.match(
    new RegExp(`<!-- FLOW:${nome}:INI -->\\r?\\n([\\s\\S]*?)\\r?\\n<!-- FLOW:${nome}:FIM -->`),
  );
  return m ? m[1].trim() : "";
}

/* ─── MAIN ──────────────────────────────────────────────────────────────── */

const drift = checarDrift();
const cur = estruturaAtual();
const prev = ultimoSnapshot();
const mudou = !prev || JSON.stringify(prev.dados) !== JSON.stringify(cur);

let nota = fs.readFileSync(NOTA, "utf8");
nota = setBloco(nota, "MAPA", renderMermaid());
nota = setBloco(nota, "TABELA", renderTabela(drift));

let versao = prev ? prev.v : 0;
if (mudou) {
  versao = (prev ? prev.v : 0) + 1;
  const resumo = prev ? diffResumo(prev.dados, cur) : `versão inicial (${cur.nodes.length} nós, ${cur.edges.length} conexões)`;

  fs.mkdirSync(VERSOES, { recursive: true });
  fs.writeFileSync(path.join(VERSOES, `v${versao}-${hoje}.json`), JSON.stringify(cur, null, 2));
  fs.writeFileSync(path.join(VERSOES, `v${versao}-${hoje}.mmd`), renderMermaid());

  const hist = blocoAtual(nota, "VERSOES");
  const linha = `- **v${versao}** · ${hoje} · ${resumo}`;
  nota = setBloco(nota, "VERSOES", hist ? `${linha}\n${hist}` : linha);
  console.log(`✓ versão v${versao} gravada — ${resumo}`);
} else {
  console.log(`= sem mudança estrutural (segue v${versao})`);
}

fs.writeFileSync(NOTA, nota);
exportarFlowGraph();
exportarDadosConstituicao();
if (drift.length) {
  console.log(`⚠️  drift: ${drift.join(" · ")}`);
} else {
  console.log("✓ sem drift (mapa bate com as rotas reais)");
}
console.log(`✓ nota atualizada: ${path.relative(path.join(DIR, "..", ".."), NOTA)}`);
console.log(`✓ flow-graph.json exportado: ${path.relative(path.join(DIR, "..", ".."), FLOW_GRAPH_JSON)}`);
console.log(`✓ dados-coletados exportado: ${path.relative(path.join(DIR, "..", ".."), DADOS_MD)} + dados-constituicao.ts`);
