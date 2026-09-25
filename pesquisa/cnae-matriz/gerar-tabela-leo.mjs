/* Gera a TABELA DO LÉO — as 18 colunas, do jeito que vão subir.

   🔑 Isto é uma PRÉVIA GERADA, não a tabela final. A refatura de verdade
   (item 8 da fila) renomeia as colunas na fonte, parte em duas tabelas, cria
   as colunas geradas no banco e migra os 3 leitores. Enquanto isso não
   acontece, este script mostra o resultado sem tocar em nada — para o Pedro
   olhar a tabela que o Léo vai ler, e não a de 44 colunas com nomes herdados
   de três pesquisas diferentes.

   🔴 NÃO EDITAR A SAÍDA. Mesmo erro da `cnae-amostra.csv`: a próxima rodada
   reescreve do zero. O que se edita é a fonte —

     valor de anexo, inciso, atende  →  cnae-matriz-v2.csv (via os scripts)
     título e descrição amigáveis    →  cnae-friendly-v2.csv  ✍️ direto
     família, rótulo e exemplo       →  familias.mjs  (espelhado do app)
     texto do motivo                 →  derivar-motivo.mjs

   Uso:  node gerar-tabela-leo.mjs                 (só os 87)
         node gerar-tabela-leo.mjs --tudo          (os 1.332) */

import { readFileSync, writeFileSync } from "node:fs";
import { FAMILIAS } from "./familias.mjs";

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

const TUDO = process.argv.includes("--tudo");
const m = parse(readFileSync("cnae-matriz-v2.csv", "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = m[0], dados = m.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

const am = parse(readFileSync("cnae-friendly-v2.csv", "utf8").replace(/^﻿/, "")).slice(1);
const tit = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[1] ?? "").trim()]));
const des = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[2] ?? "").trim()]));

/* O vocabulário de ausência, que a tabela nova vai ter no schema e esta prévia
   já antecipa: campo dependente NUNCA fica em branco, ele DECLARA que depende. */
const NSA = "nao-se-aplica";

const COLUNAS = [
  ["codigo", (l) => g(l, "cnae")],
  ["titulo_oficial", (l) => g(l, "descricao")],
  ["titulo_amigavel", (l) => tit.get(g(l, "cnae")) || NSA],
  ["descricao_oficial", (l) => g(l, "subclasse_observacoes") || NSA],
  ["descricao_amigavel", (l) => des.get(g(l, "cnae")) || NSA],
  ["termos_de_busca", (l) => g(l, "atividades") || NSA],
  ["familia", (l) => g(l, "familia")],
  ["divisao_id", (l) => g(l, "divisao_id")],
  // 🔧 gerada: o vocabulário novo, traduzido do que está gravado hoje
  ["anexo", (l) => { const v = g(l, "anexo_fator_r_grupo"); return v === "III-fixo" ? "III" : v === "IV" ? "IV" : /dinamico/.test(v) ? "III-ou-V" : NSA; }],
  // 🔧 gerada de `anexo`: é o sim/não que o Pedro pediu, e é impossível divergir
  ["fator_r", (l) => { const v = g(l, "anexo_fator_r_grupo"); return !v ? NSA : /dinamico/.test(v) ? "sim" : "nao"; }],
  ["anexo_inciso", (l) => g(l, "anexo_fator_r_fonte").replace(/^LC123 art18 /, "") || NSA],
  ["mei_ocupacoes", (l) => (g(l, "mei_permitido") === "sim" ? g(l, "mei_ocupacoes") : NSA)],
  // 🔧 gerada: presença da ocupação É a permissão. Duas colunas não podem divergir se são uma só.
  ["mei_permitido", (l) => (g(l, "mei_ocupacoes") ? "sim" : "nao")],
  ["atende_me", (l) => g(l, "atende_me_certeza")],
  ["atende_mei", (l) => g(l, "atende_mei_certeza")],
  ["motivo_nao_atende", (l) => g(l, "motivo_nao_atende")],
  ["exige_conselho", (l) => g(l, "exige_conselho")],
  ["conselho_qual", (l) => (g(l, "exige_conselho") === "sim" ? g(l, "conselho_qual") : NSA)],
];

const linhas = TUDO ? dados : dados.filter((l) => g(l, "atende_me_certeza") === "sim");
const saida = linhas.map((l) => COLUNAS.map(([, f]) => String(f(l) ?? "")));

// ── trava: nenhuma célula vazia. É a regra que a tabela nova vai ter. ──────
const vazias = [];
saida.forEach((r, i) => r.forEach((v, j) => { if (!v) vazias.push(`${linhas[i][0]} · ${COLUNAS[j][0]}`); }));

const ARQ = "_entrega-leo/" + (TUDO ? "cnae-leo-1332.csv" : "cnae-leo.csv");
writeFileSync(ARQ, [COLUNAS.map(([n]) => n).map(escapar).join(","), ...saida.map((r) => r.map(escapar).join(","))].join("\n") + "\n", "utf8");

console.log(`${ARQ} · ${saida.length} linhas × ${COLUNAS.length} colunas`);
console.log(`células vazias: ${vazias.length} ${vazias.length ? "🔴 " + vazias.slice(0, 8).join(" · ") : "✅"}`);

if (!TUDO) {
  const porFam = new Map();
  for (const l of linhas) { const k = g(l, "familia"); porFam.set(k, (porFam.get(k) ?? 0) + 1); }
  console.log("\nfamília".padEnd(34) + "n".padStart(3) + "   anexo");
  for (const [k, f] of Object.entries(FAMILIAS)) {
    const L = linhas.filter((l) => g(l, "familia") === k);
    const anx = [...new Set(L.map((l) => (/dinamico/.test(g(l, "anexo_fator_r_grupo")) ? "III↔V" : "III")))].join(" + ");
    console.log("  " + f.rotulo.padEnd(32) + String(porFam.get(k) ?? 0).padStart(3) + "   " + anx);
  }
}
