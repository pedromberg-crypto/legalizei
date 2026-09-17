/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR do ÍNDICE DE TELAS — dentro de `auditoria-copy-flow.md`.
 * ═══════════════════════════════════════════════════════════════════════════
 * A nota-âncora da auditoria de copy precisa de links que NÃO apodreçam quando
 * a gente move/renomeia tela. Então o índice (N# · tela · código · rota) é
 * GERADO da mesma fonte-única do mapa (`flow-data.mjs`): cada nó com `rota` vira
 * uma linha, com o caminho do `page.tsx` real resolvido andando no `app/`.
 *
 * Os ACHADOS (R#/M#/F#) e o inventário ficam à mão — isto só cuida da navegação.
 *
 * ─── por que link em <...> ────────────────────────────────────────────────
 * Os route-groups do Next viram pasta com parênteses ((app)/(wizard)). Em
 * markdown, `(` e `)` crus dentro de `(...)` de um link quebram o parse. O
 * envelope `<caminho>` é a forma canônica de escapar isso (Obsidian + GitHub).
 *
 * Rodar:  node produto/_flow/gerar-indice-telas.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "../_raiz.mjs";
import { fileURLToPath } from "node:url";
import { NODES } from "./flow-data.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url)); // produto/_flow

const APP = path.join(RAIZ, "app", "src", "app");
const NOTA = path.join(DIR, "auditoria-copy-flow.md");
const BASE_URL = "http://localhost:3000";

/* ─── rota → caminho do page.tsx (relativo à raiz do vault) ────────────────
   Anda no app/, ignora os route-groups no cálculo da URL (igual o Next), e
   guarda o arquivo real de cada rota. Assim o link de código sai correto sem a
   gente adivinhar em qual shell ((app)/(wizard)) a tela mora. */
function mapaRotas(dir, segs = [], acc = new Map()) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      const grupo = e.name.startsWith("(") && e.name.endsWith(")");
      mapaRotas(path.join(dir, e.name), grupo ? segs : [...segs, e.name], acc);
    } else if (e.name === "page.tsx") {
      const rota = "/" + segs.join("/");
      const rel = path.relative(RAIZ, path.join(dir, e.name)).replaceAll("\\", "/");
      acc.set(rota, rel);
    }
  }
  return acc;
}

/** Shell derivado do caminho: qual route-group contém o arquivo. */
function shell(rel) {
  if (rel.includes("/(app)/")) return "app";
  if (rel.includes("/(wizard)/")) return "wizard";
  return "—";
}

function linkCodigo(rel) {
  // <...> escapa os parênteses dos route-groups.
  return `[código](<${rel}>)`;
}

function linkRota(rota) {
  return `[${rota}](${BASE_URL}${rota})`;
}

/* ─── render da tabela ─────────────────────────────────────────────────────── */
function render(rotas) {
  const linhas = [];
  linhas.push("| # | Tela | Shell | Código | Rota viva |");
  linhas.push("|---|---|:--:|:--:|---|");

  const semArquivo = [];
  for (const n of NODES) {
    if (!n.rota) continue; // só telas navegáveis
    const rel = rotas.get(n.rota);
    const tela = n.label.replace(/<br\/>/g, " · ");
    if (!rel) {
      semArquivo.push(`${n.id} (${n.rota})`);
      linhas.push(`| ${n.id} | ${tela} | ? | ⚠️ sem page.tsx | ${linkRota(n.rota)} |`);
      continue;
    }
    // rotas extras que o mesmo nó cobre (ex: os 3 modos do teaser).
    const extras = (n.rotasCobre || [])
      .map((r) => linkRota(r))
      .join(" · ");
    const rotaCol = extras ? `${linkRota(n.rota)} · ${extras}` : linkRota(n.rota);
    linhas.push(`| ${n.id} | ${tela} | ${shell(rel)} | ${linkCodigo(rel)} | ${rotaCol} |`);
  }

  // Rotas reais que NENHUM nó cita (drift na outra direção) — fora as ferramentas.
  const citadas = new Set();
  for (const n of NODES) {
    if (n.rota) citadas.add(n.rota);
    if (n.rotasCobre) for (const r of n.rotasCobre) citadas.add(r);
  }
  const ignora = new Set(["/", "/mockup"]);
  const orfas = [...rotas.keys()].filter((r) => !ignora.has(r) && !citadas.has(r));

  const rodape = [];
  if (semArquivo.length) rodape.push(`⚠️ **nós sem arquivo:** ${semArquivo.join(" · ")}`);
  if (orfas.length) rodape.push(`⚠️ **rotas sem nó no mapa:** ${orfas.join(" · ")}`);
  const nav = NODES.filter((n) => n.rota).length;
  rodape.push(`_${nav} telas navegáveis · gerado de \`flow-data.mjs\`._`);

  return linhas.join("\n") + "\n\n" + rodape.join(" · ");
}

/* ─── escrever entre os marcadores ─────────────────────────────────────────── */
function setBloco(txt, inner) {
  const ini = "<!-- INDICE:INI -->";
  const fim = "<!-- INDICE:FIM -->";
  const re = new RegExp(`${ini}[\\s\\S]*?${fim}`);
  if (!re.test(txt)) throw new Error("Marcador <!-- INDICE --> não encontrado na nota.");
  return txt.replace(re, `${ini}\n${inner}\n${fim}`);
}

/* ─── MAIN ─────────────────────────────────────────────────────────────────── */
const rotas = mapaRotas(APP);
let nota = fs.readFileSync(NOTA, "utf8");
nota = setBloco(nota, render(rotas));
fs.writeFileSync(NOTA, nota);

const nav = NODES.filter((n) => n.rota).length;
console.log(`✓ índice gerado — ${nav} telas navegáveis em ${rotas.size} rotas reais`);
console.log(`✓ nota: ${path.relative(RAIZ, NOTA)}`);
