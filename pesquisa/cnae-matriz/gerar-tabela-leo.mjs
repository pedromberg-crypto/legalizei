/* Gera as DUAS tabelas finais a partir da fonte de 44 colunas.

     _entrega-leo/cnae.csv            18 colunas · 1.332 linhas · SOBE pro Léo
     _entrega-leo/cnae-curadoria.csv  30 colunas · 1.332 linhas · FICA no repo

   🔑 Por que duas e não uma: coluna de curadoria no banco do Léo é peso morto
   que ele pode ler errado. A `anexo_fator_r_confianca` provou isso — media o
   NOSSO dever de casa e ele leria como incerteza da lei. O que responde ao
   cliente sobe; o que explica por que o CNAE entrou ou ficou de fora, não.

   🔒 A divisão é SEM PERDA e conferida a cada rodada: 18 + 30 cobrem as 44 da
   fonte, e o script derruba se sobrar coluna órfã.

   🔴 NÃO EDITAR A SAÍDA. A próxima rodada reescreve do zero. O que se edita é
   a fonte —

     valor de anexo, inciso, atende  →  cnae-matriz-v2.csv (via os scripts)
     título e descrição amigáveis    →  cnae-friendly-v2.csv  ✍️ direto
     família, rótulo e exemplo       →  familias.mjs  (espelhado do app)
     texto do motivo                 →  derivar-motivo.mjs

   Uso:  node gerar-tabela-leo.mjs  [--so-87] */

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

const SO87 = process.argv.includes("--so-87");
const m = parse(readFileSync("cnae-matriz-v2.csv", "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = m[0], dados = m.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

const am = parse(readFileSync("cnae-friendly-v2.csv", "utf8").replace(/^﻿/, "")).slice(1);
const tit = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[1] ?? "").trim()]));
const des = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[2] ?? "").trim()]));

/* 🔑 O vocabulário de ausência. Campo dependente NUNCA fica em branco — ele
   DECLARA que depende. Vazio significava quatro coisas diferentes na tabela
   antiga e o Léo lia ausência como negação: foi assim que ele mandou cliente
   de folha de pagamento procurar outro contador. */
const NSA = "nao-se-aplica";

/* 🔄 O vocabulário do anexo muda AQUI e só aqui. A fonte guarda o nome antigo
   (`III-fixo`, `fator-r-dinamico(III<->V, limiar 28%)`) porque é o que 8
   arquivos do motor já leem; a tabela que sobe usa o nome curto. Quem traduz
   é esta função, e os leitores foram migrados no mesmo commit. */
const ANEXO_NOVO = { "III-fixo": "III", IV: "IV" };
const traduzirAnexo = (v) => (!v ? NSA : ANEXO_NOVO[v] ?? (/dinamico/.test(v) ? "III-ou-V" : v));

const LEO = [
  ["codigo", (l) => g(l, "cnae")],
  ["titulo_oficial", (l) => g(l, "descricao")],
  ["titulo_amigavel", (l) => tit.get(g(l, "cnae")) || NSA],
  ["descricao_oficial", (l) => g(l, "subclasse_observacoes") || NSA],
  ["descricao_amigavel", (l) => des.get(g(l, "cnae")) || NSA],
  ["termos_de_busca", (l) => g(l, "atividades") || NSA],
  ["familia", (l) => g(l, "familia")],
  ["divisao_id", (l) => g(l, "divisao_id").padStart(2, "0")],
  ["anexo", (l) => traduzirAnexo(g(l, "anexo_fator_r_grupo"))],
  // 🔧 derivada de `anexo`: é o sim/não binário, e é impossível divergir
  ["fator_r", (l) => { const v = traduzirAnexo(g(l, "anexo_fator_r_grupo")); return v === NSA ? NSA : v === "III-ou-V" ? "sim" : "nao"; }],
  ["anexo_inciso", (l) => g(l, "anexo_fator_r_fonte").replace(/^LC123 art18 /, "") || NSA],
  ["mei_ocupacoes", (l) => (g(l, "mei_ocupacoes") ? g(l, "mei_ocupacoes") : NSA)],
  // 🔧 derivada: presença da ocupação É a permissão. Duas colunas não podem
  //    divergir se na verdade são uma só.
  ["mei_permitido", (l) => (g(l, "mei_ocupacoes") ? "sim" : "nao")],
  ["atende_me", (l) => g(l, "atende_me_certeza")],
  ["atende_mei", (l) => g(l, "atende_mei_certeza")],
  ["motivo_nao_atende", (l) => g(l, "motivo_nao_atende")],
  ["exige_conselho", (l) => g(l, "exige_conselho")],
  ["conselho_qual", (l) => (g(l, "exige_conselho") === "sim" ? g(l, "conselho_qual") || NSA : NSA)],
];

/* As 30 que ficam. Não sobem porque não respondem ao cliente: são o RASTRO de
   por que o CNAE entrou nos 87 ou ficou fora, e o `cnae-verifica-atende.cjs`
   recalcula o veredito a partir delas. */
const CURADORIA = [
  "secao_id", "secao", "grupo_id", "grupo_descricao", "classe_id", "classe_observacoes",
  "anexo_base", "anexo_just", "fator_r", "aliquota_inicial",
  "contabilizei_atende", "contabilizei_just",
  "mei_iss_fixo_das", "mei_icms_fixo_das",
  "risco_baixo_cgsim", "risco_cgsim_desc_oficial",
  "vedado_simples_cgsn_anexo_vi", "ambiguo_simples_cgsn_anexo_vii",
  "anexo_fator_r_confianca",
  "iss_bh_aliquota", "iss_bh_varia", "iss_bh_detalhe",
  "conselho_fonte", "conselho_confianca",
  "exige_registro_setorial", "registro_setorial_qual", "registro_setorial_fonte",
  "motivo_nao_atende_fala", "familia_rotulo",
];

// ── trava 1: a divisão não pode perder coluna ─────────────────────────────
const DE_ONDE = {
  codigo: "cnae", titulo_oficial: "descricao", descricao_oficial: "subclasse_observacoes",
  termos_de_busca: "atividades", anexo: "anexo_fator_r_grupo", anexo_inciso: "anexo_fator_r_fonte",
  atende_me: "atende_me_certeza", atende_mei: "atende_mei_certeza",
};
const consumidas = new Set([
  ...LEO.map(([n]) => DE_ONDE[n] ?? n),
  ...CURADORIA,
  "titulo_amigavel", "descricao_amigavel", // vêm do friendly, não da matriz
]);
const orfas = cab.filter((c) => !consumidas.has(c));
if (orfas.length) {
  console.log("🔴 colunas da fonte que não entram em nenhuma das duas tabelas: " + orfas.join(", "));
  process.exit(1);
}

const linhas = SO87 ? dados.filter((l) => g(l, "atende_me_certeza") === "sim") : dados;

// ── a tabela do Léo ───────────────────────────────────────────────────────
const leo = linhas.map((l) => LEO.map(([, f]) => String(f(l) ?? "")));
const vazias = [];
leo.forEach((r, i) => r.forEach((v, j) => { if (!v) vazias.push(`${linhas[i][0]} · ${LEO[j][0]}`); }));
if (vazias.length) { console.log("🔴 célula vazia: " + vazias.slice(0, 10).join(" · ")); process.exit(1); }

const ARQ_LEO = SO87 ? "_entrega-leo/cnae-87.csv" : "_entrega-leo/cnae.csv";
writeFileSync(ARQ_LEO, [LEO.map(([n]) => n).map(escapar).join(","), ...leo.map((r) => r.map(escapar).join(","))].join("\n") + "\n", "utf8");
console.log(`${ARQ_LEO} · ${leo.length} linhas × ${LEO.length} colunas · 0 vazias ✅`);

// ── a curadoria ───────────────────────────────────────────────────────────
if (!SO87) {
  const cur = dados.map((l) => [g(l, "cnae"), ...CURADORIA.map((n) => g(l, n))]);
  writeFileSync("_entrega-leo/cnae-curadoria.csv",
    [["codigo", ...CURADORIA].map(escapar).join(","), ...cur.map((r) => r.map(escapar).join(","))].join("\n") + "\n", "utf8");
  console.log(`_entrega-leo/cnae-curadoria.csv · ${cur.length} linhas × ${CURADORIA.length + 1} colunas`);

  const at = linhas.filter((l) => g(l, "atende_me_certeza") === "sim");
  console.log(`\n${at.length} atendidos · ${dados.length - at.length} não`);
  const anx = new Map();
  for (const l of at) { const k = traduzirAnexo(g(l, "anexo_fator_r_grupo")); anx.set(k, (anx.get(k) ?? 0) + 1); }
  console.log("anexo nos 87: " + [...anx].map(([k, v]) => `${v} ${k}`).join(" · "));
  const fam = new Map();
  for (const l of at) { const k = g(l, "familia"); fam.set(k, (fam.get(k) ?? 0) + 1); }
  console.log("famílias: " + Object.entries(FAMILIAS).map(([k, f]) => `${fam.get(k) ?? 0} ${f.rotulo}`).join(" · "));
}
