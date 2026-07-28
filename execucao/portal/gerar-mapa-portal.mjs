/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR + VERSIONADOR do mapa do PORTAL (telas internas / dia-2).
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmão de `flow/gerar-mapa.mjs`. Lê `portal-data.mjs`, re-renderiza o diagrama
 * Mermaid + a tabela DENTRO de `mapa-portal-mermaid.md` (entre marcadores) e:
 *   1. CHECA DRIFT — cada nó com `rota` precisa de um page.tsx real em (portal)
 *      (ou na lista de seam externo). Rota nova sem nó, ou nó sem rota, avisa.
 *      As rotas de LABORATÓRIO (home-*, inicio-ref*, -v1/v2, componentes) são
 *      ignoradas de propósito — não são telas canônicas do produto.
 *   2. VERSIONA — snapshot em `versoes/` só quando a estrutura muda.
 *
 * Rodar:  node execucao/portal/gerar-mapa-portal.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NODES, EDGES, SUBGRAFOS } from "./portal-data.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url)); // execucao/portal
const NOTA = path.join(DIR, "..", "mapa-portal-mermaid.md");
const VERSOES = path.join(DIR, "versoes");
const PORTAL = path.join(DIR, "..", "..", "app", "src", "app", "(app)", "(portal)");

const hoje = new Date().toISOString().slice(0, 10);

// Telas-seam que vivem FORA de (portal) mas fazem parte da entrada do portal.
const SEAM_EXTERNO = new Set(["/certificado"]);

// Rotas que EXISTEM em (portal) mas são laboratório/exploração — não canônicas.
const IGNORA = new Set([
  "/componentes",
  "/home-a", "/home-b", "/home-c", "/home-d", "/home-e", "/home-f", "/home-campea",
  "/inicio-ref5", "/inicio-ref6", "/inicio-ref7", "/inicio-ref9", "/inicio-ref11", "/inicio-ref12",
  "/impostos-v1", "/impostos-v2",
  "/mais-v1", "/mais-completa",
]);

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
  for (const sg of SUBGRAFOS) {
    const membros = NODES.filter((n) => n.grupo === sg.id);
    if (!membros.length) continue;
    linhas.push(`  subgraph ${sg.id}["${sg.titulo}"]`);
    linhas.push(`    direction TB`);
    for (const n of membros) linhas.push("  " + defNo(n));
    linhas.push("  end");
  }
  for (const n of NODES.filter((x) => !x.grupo)) linhas.push(defNo(n));
  linhas.push("");
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
  linhas.push("| # | Tela | Rota | Construída | Validado | Falta validar |");
  linhas.push("|---|---|---|:--:|:--:|---|");
  let i = 0;
  for (const n of NODES) {
    if (n.naTabela === false) continue;
    i++;
    const tela = n.label.replace(/<br\/>/g, " · ");
    const rota = n.rota ? `\`${n.rota}\`` : "—";
    const constr = n.status === "construida" ? "✅" : "🚧";
    const val = SEL[n.validado] ?? "🟡";
    linhas.push(`| ${i} | ${tela} | ${rota} | ${constr} | ${val} | ${n.falta || "—"} |`);
  }
  return linhas.join("\n");
}

/* ─── 3. DRIFT: nós com rota × page.tsx reais em (portal) ────────────────── */

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
  const reais = rotasReais(PORTAL);
  const doMapa = new Set();
  for (const n of NODES) if (n.rota) doMapa.add(n.rota);
  const msgs = [];
  for (const n of NODES.filter((x) => x.rota)) {
    if (SEAM_EXTERNO.has(n.rota)) continue; // seam vive fora de (portal)
    if (!reais.has(n.rota)) msgs.push(`${n.id} cita ${n.rota} mas não há page.tsx em (portal)`);
  }
  for (const r of reais) {
    if (!IGNORA.has(r) && !doMapa.has(r)) msgs.push(`rota ${r} existe mas não está no mapa`);
  }
  return msgs;
}

/* ─── 4. VERSIONAMENTO ──────────────────────────────────────────────────── */

function estruturaAtual() {
  return {
    nodes: NODES.map((n) => ({ id: n.id, label: n.label, status: n.status, validado: n.validado, falta: n.falta || "" })),
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
  const relabel = [], statusMud = [], validMud = [], faltaMud = [];
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
  const ini = `<!-- PORTAL:${nome}:INI -->`;
  const fim = `<!-- PORTAL:${nome}:FIM -->`;
  const re = new RegExp(`${ini}[\\s\\S]*?${fim}`);
  if (!re.test(txt)) throw new Error(`Marcador PORTAL:${nome} não encontrado na nota.`);
  return txt.replace(re, `${ini}\n${inner}\n${fim}`);
}

function blocoAtual(txt, nome) {
  const m = txt.match(new RegExp(`<!-- PORTAL:${nome}:INI -->\\n([\\s\\S]*?)\\n<!-- PORTAL:${nome}:FIM -->`));
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
if (drift.length) console.log(`⚠️  drift: ${drift.join(" · ")}`);
else console.log("✓ sem drift (mapa bate com as rotas reais de (portal))");
console.log(`✓ nota atualizada: ${path.relative(path.join(DIR, "..", ".."), NOTA)}`);
