/* Grava `familia` e `familia_rotulo` nos 1.332, a partir do mapa declarado em
   `familias.mjs` — que por sua vez é o espelho do dropdown do app
   (`app/src/components/gate-telas.tsx`, constante `PILLS`).

   🔑 Por que o mapa é declarado e não digitado na planilha: 87 decisões soltas
   numa coluna viram, em um mês, 87 decisões que ninguém lembra por quê. No
   arquivo, cada família tem rótulo, exemplo e motivo escrito ao lado.

   🔴 A trava que importa: o `id` daqui tem que ser o MESMO do `PILLS`. Se
   alguém renomear a categoria no app e não aqui, o cliente escolhe um rótulo
   e o Léo lê outro — que é exatamente a divergência que a família existe pra
   matar. O script confere os dois e derruba a rodada se divergirem.

   Uso:  node gravar-familia.mjs cnae-matriz-v2.csv [--aplicar] */

import { readFileSync, writeFileSync } from "node:fs";
import { FAMILIAS, ORFAOS, familiaDoCnae } from "./familias.mjs";

function parse(csv) {
  const o = []; let c = "", l = [], a = false;
  for (let i = 0; i < csv.length; i++) {
    const x = csv[i];
    if (a) { if (x === '"' && csv[i + 1] === '"') { c += '"'; i++; } else if (x === '"') a = false; else c += x; }
    else if (x === '"') a = true;
    else if (x === ",") { l.push(c); c = ""; }
    else if (x === "\n") { l.push(c); o.push(l); l = []; c = ""; }
    else if (x !== "\r") c += x;
  }
  if (c || l.length) { l.push(c); o.push(l); }
  return o;
}
const escapar = (v) => (/[",\n]/.test(v) ? '"' + v.replaceAll('"', '""') + '"' : v);

// ── trava 1: o app e o mapa têm que declarar as MESMAS categorias ──────────
const tsx = readFileSync("../../app/src/components/gate-telas.tsx", "utf8");
const bloco = tsx.slice(tsx.indexOf("export const PILLS"), tsx.indexOf("];", tsx.indexOf("export const PILLS")));
const doApp = [...bloco.matchAll(/\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*ex:\s*"([^"]+)"/g)]
  .map((m) => ({ id: m[1], label: m[2], ex: m[3] }));

const problemas = [];
for (const p of doApp) {
  const f = FAMILIAS[p.id];
  if (!f) { problemas.push(`o app tem "${p.id}" e o mapa não`); continue; }
  if (f.rotulo !== p.label) problemas.push(`rótulo diverge em "${p.id}": app="${p.label}" × mapa="${f.rotulo}"`);
  if (f.ex !== p.ex) problemas.push(`exemplo diverge em "${p.id}"`);
}
for (const id of Object.keys(FAMILIAS)) if (!doApp.find((p) => p.id === id)) problemas.push(`o mapa tem "${id}" e o app não`);

console.log(`app: ${doApp.length} categorias · mapa: ${Object.keys(FAMILIAS).length}`);
if (problemas.length) {
  console.log("\n🔴 APP E MAPA DIVERGEM — não grava:");
  for (const p of problemas) console.log("   " + p);
  process.exit(1);
}
console.log("✅ app e mapa batem em id, rótulo e exemplo\n");

// ── trava 2: cobertura dos 87, sem órfão não declarado ────────────────────
const [ARQ, ...flags] = process.argv.slice(2);
const APLICAR = flags.includes("--aplicar");
const tudo = parse(readFileSync(ARQ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = tudo[0];
const dados = tudo.slice(1);
const idx = (n) => cab.indexOf(n);
const at = dados.filter((l) => (l[idx("atende_me_certeza")] ?? "").trim() === "sim");

const semCasa = at.filter((l) => !familiaDoCnae((l[0] ?? "").trim()) && !ORFAOS.includes((l[0] ?? "").trim()));
const fantasma = [...new Set(Object.values(FAMILIAS).flatMap((f) => f.cnaes))]
  .filter((c) => !at.find((l) => (l[0] ?? "").trim() === c));
console.log(`cobertura: ${at.length - semCasa.length - ORFAOS.length} + ${ORFAOS.length} órfão declarado de ${at.length}`);
if (semCasa.length || fantasma.length) {
  if (semCasa.length) console.log("🔴 sem família e sem declaração: " + semCasa.map((l) => l[0]));
  if (fantasma.length) console.log("🔴 no mapa mas não nos 87: " + fantasma);
  process.exit(1);
}

// ── quem não atendemos não tem família: é `nao-se-aplica`, não vazio ───────
// 🔑 Vazio significa quatro coisas diferentes na tabela e o Léo lê ausência
//    como negação. Campo dependente declara que é dependente.
const valor = (l) => {
  const cod = (l[0] ?? "").trim();
  if ((l[idx("atende_me_certeza")] ?? "").trim() !== "sim") return ["nao-se-aplica", "nao-se-aplica"];
  const k = familiaDoCnae(cod);
  if (!k) return ["fora-da-lista", "Não encontrei minha categoria"];
  return [k, FAMILIAS[k].rotulo];
};

const conta = new Map();
for (const l of at) { const [k] = valor(l); conta.set(k, (conta.get(k) ?? 0) + 1); }
console.log();
for (const [k, f] of Object.entries(FAMILIAS)) console.log(`  ${String(conta.get(k) ?? 0).padStart(3)}  ${f.rotulo}`);
console.log(`  ${String(conta.get("fora-da-lista") ?? 0).padStart(3)}  Não encontrei minha categoria (órfão declarado)`);

if (APLICAR) {
  const novoCab = idx("familia") === -1 ? [...cab, "familia", "familia_rotulo"] : cab;
  const iF = novoCab.indexOf("familia"), iR = novoCab.indexOf("familia_rotulo");
  const linhas = dados.map((l) => {
    const c = [...l];
    const [k, r] = valor(l);
    c[iF] = k; c[iR] = r;
    return c;
  });
  writeFileSync(ARQ, [novoCab.map(escapar).join(","), ...linhas.map((l) => l.map((v) => escapar(String(v ?? ""))).join(","))].join("\n") + "\n", "utf8");
  console.log(`\n✅ gravado em ${ARQ} · ${novoCab.length} colunas`);
} else {
  console.log("\n(simulação — rode com --aplicar para gravar)");
}
