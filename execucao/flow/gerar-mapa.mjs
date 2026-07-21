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
 *
 * Rodar:  node execucao/flow/gerar-mapa.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { NODES, EDGES, SUBGRAFOS } from "./flow-data.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url)); // execucao/flow
const NOTA = path.join(DIR, "..", "mapa-flow-mermaid.md"); // execucao/mapa-flow-mermaid.md
const VERSOES = path.join(DIR, "versoes");
const APP = path.join(DIR, "..", "..", "app", "src", "app");

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
  linhas.push("| # | Tela | Construída | Validado | Falta validar |");
  linhas.push("|---|---|:--:|:--:|---|");
  let i = 0;
  for (const n of NODES) {
    if (n.naTabela === false) continue;
    i++;
    const tela = n.label.replace(/<br\/>/g, " · ");
    const constr = n.status === "construida" ? "✅" : "🚧";
    const val = SEL[n.validado] ?? "🟡";
    linhas.push(`| ${i} | ${tela} | ${constr} | ${val} | ${n.falta || "—"} |`);
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

function checarDrift() {
  const reais = rotasReais(APP);
  const doMapa = new Set();
  for (const n of NODES) {
    if (n.rota) doMapa.add(n.rota);
    if (n.rotasCobre) for (const r of n.rotasCobre) doMapa.add(r); // 1 nó cobre N rotas
  }
  const msgs = [];
  for (const n of NODES.filter((x) => x.rota)) {
    if (!reais.has(n.rota)) msgs.push(`${n.id} cita ${n.rota} mas não há page.tsx`);
  }
  const ignora = new Set(["/", "/mockup"]); // raiz + ferramenta de review
  for (const r of reais) {
    if (!ignora.has(r) && !doMapa.has(r)) msgs.push(`rota ${r} existe mas não está no mapa`);
  }
  return msgs;
}

/* ─── 4. VERSIONAMENTO ──────────────────────────────────────────────────── */

function estruturaAtual() {
  // O que conta como "mudança estrutural": id, label, status, validado, falta,
  // e as conexões. Ordem estável (a fonte já é ordenada) → hash determinístico.
  return {
    nodes: NODES.map((n) => ({
      id: n.id,
      label: n.label,
      status: n.status,
      validado: n.validado,
      falta: n.falta || "",
    })),
    edges: EDGES.map((e) => ({ de: e.de, para: e.para, label: e.label || "", tracejado: !!e.tracejado })),
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
  for (const [id, c] of cN) {
    const p = pN.get(id);
    if (!p) continue;
    if (p.label !== c.label) relabel.push(`${id} "${p.label.replace(/<br\/>/g, " ")}"→"${c.label.replace(/<br\/>/g, " ")}"`);
    if (p.status !== c.status) statusMud.push(`${id} ${p.status}→${c.status}`);
    if (p.validado !== c.validado) validMud.push(`${id} ${p.validado}→${c.validado}`);
    if (p.falta !== c.falta) faltaMud.push(id);
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

function blocoAtual(txt, nome) {
  const m = txt.match(new RegExp(`<!-- FLOW:${nome}:INI -->\\n([\\s\\S]*?)\\n<!-- FLOW:${nome}:FIM -->`));
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
if (drift.length) {
  console.log(`⚠️  drift: ${drift.join(" · ")}`);
} else {
  console.log("✓ sem drift (mapa bate com as rotas reais)");
}
console.log(`✓ nota atualizada: ${path.relative(path.join(DIR, "..", ".."), NOTA)}`);
