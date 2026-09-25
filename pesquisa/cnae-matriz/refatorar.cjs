const fs = require('fs');
const path = require('path');

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

const csvRaw = fs.readFileSync('cnae-matriz-v2.csv', 'utf8').replace(/^\uFEFF/, "");
const m = parse(csvRaw).filter(l => l.length > 1);
const cab = m[0];
const dados = m.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

const amRaw = fs.readFileSync('cnae-friendly-v2.csv', 'utf8').replace(/^\uFEFF/, "");
const am = parse(amRaw).slice(1);
const tit = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[1] ?? "").trim()]));
const des = new Map(am.map((l) => [(l[0] ?? "").replace(/\D/g, ""), (l[2] ?? "").trim()]));

const NSA = "nao-se-aplica";

const COLUNAS_18 = [
  ["codigo", (l) => g(l, "cnae")],
  ["titulo_oficial", (l) => g(l, "descricao")],
  ["titulo_amigavel", (l) => tit.get(g(l, "cnae")) || NSA],
  ["descricao_oficial", (l) => g(l, "subclasse_observacoes") || NSA],
  ["descricao_amigavel", (l) => des.get(g(l, "cnae")) || NSA],
  ["termos_de_busca", (l) => g(l, "atividades") || NSA],
  ["familia", (l) => g(l, "familia")],
  ["divisao_id", (l) => g(l, "divisao_id")],
  ["anexo", (l) => { const v = g(l, "anexo_fator_r_grupo"); return v === "III-fixo" ? "III" : v === "IV" ? "IV" : /dinamico/.test(v) ? "III-ou-V" : NSA; }],
  ["fator_r", (l) => { const v = g(l, "anexo_fator_r_grupo"); return !v ? NSA : /dinamico/.test(v) ? "sim" : "nao"; }],
  ["anexo_inciso", (l) => g(l, "anexo_fator_r_fonte").replace(/^LC123 art18 /, "") || NSA],
  ["mei_ocupacoes", (l) => (g(l, "mei_permitido") === "sim" ? g(l, "mei_ocupacoes") : NSA)],
  ["mei_permitido", (l) => (g(l, "mei_ocupacoes") ? "sim" : "nao")],
  ["atende_me", (l) => g(l, "atende_me_certeza")],
  ["atende_mei", (l) => g(l, "atende_mei_certeza")],
  ["motivo_nao_atende", (l) => g(l, "motivo_nao_atende")],
  ["exige_conselho", (l) => g(l, "exige_conselho")],
  ["conselho_qual", (l) => (g(l, "exige_conselho") === "sim" ? g(l, "conselho_qual") : NSA)]
];

// Curadoria
const COLUNAS_CURADORIA = cab.filter(c => !["cnae", "descricao", "subclasse_observacoes", "atividades", "familia", "divisao_id", "anexo_fator_r_grupo", "anexo_fator_r_fonte", "mei_ocupacoes", "mei_permitido", "atende_me_certeza", "atende_mei_certeza", "motivo_nao_atende", "exige_conselho", "conselho_qual"].includes(c));

const matriz = dados.map(l => COLUNAS_18.map(([, f]) => String(f(l) ?? "")));
const curadoria = dados.map(l => {
    let base = [g(l, "cnae")];
    COLUNAS_CURADORIA.forEach(c => base.push(g(l, c)));
    return base;
});

const ARQ_MATRIZ = "cnae-matriz-v3.csv";
fs.writeFileSync(ARQ_MATRIZ, [COLUNAS_18.map(([n]) => n).map(escapar).join(","), ...matriz.map((r) => r.map(escapar).join(","))].join("\n") + "\n", "utf8");

const ARQ_CURADORIA = "cnae-curadoria.csv";
fs.writeFileSync(ARQ_CURADORIA, [["codigo", ...COLUNAS_CURADORIA].map(escapar).join(","), ...curadoria.map((r) => r.map(escapar).join(","))].join("\n") + "\n", "utf8");

console.log("Feito!");
