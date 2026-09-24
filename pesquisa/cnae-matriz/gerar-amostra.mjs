/* Monta a amostra de trabalho: ~45 CNAEs que cobrem TODAS as variáveis da
   tabela, para editar barato e propagar depois.

   A seleção é determinística e explicada: cada linha entra por um motivo
   escrito, e o motivo vai junto no CSV numa coluna `_motivo_da_amostra`. */
import { readFileSync, writeFileSync } from "node:fs";

function parse(csv) {
  const out = []; let campo = "", linha = [], aspas = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (aspas) { if (c === '"' && csv[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') aspas = false; else campo += c; }
    else if (c === '"') aspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); out.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || linha.length) { linha.push(campo); out.push(linha); }
  return out;
}
const escapar = (v) => (/[",\n]/.test(v) ? '"' + v.replaceAll('"', '""') + '"' : v);

const [MATRIZ, AMIGAVEL, CERTEZA, SAIDA] = process.argv.slice(2);
const tudo = parse(readFileSync(MATRIZ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = tudo[0];
const dados = tudo.slice(1);
const i = (n) => cab.indexOf(n);
const col = (l, n) => (l[i(n)] ?? "").trim();

// quem tem título amigável
const amig = parse(readFileSync(AMIGAVEL, "utf8").replace(/^﻿/, "")).slice(1);
const temTitulo = new Set(amig.map((l) => (l[0] ?? "").replace(/\D/g, "")));
// quem o motor não apura (essa coluna NÃO existe na matriz — vive no outro CSV)
const cert = parse(readFileSync(CERTEZA, "utf8").replace(/^﻿/, ""));
const cc = cert[0];
const semMotor = new Set(
  cert.slice(1).filter((l) => (l[cc.indexOf("motor_apura")] ?? "").trim() === "nao").map((l) => (l[0] ?? "").replace(/\D/g, "")),
);

const DIMS = [
  "atende_me_certeza", "atende_mei_certeza", "mei_permitido", "anexo_base",
  "anexo_fator_r_grupo", "anexo_fator_r_confianca", "exige_conselho",
  "risco_baixo_cgsim", "vedado_simples_cgsn_anexo_vi",
  "ambiguo_simples_cgsn_anexo_vii", "exige_registro_setorial",
];
const perfil = (l) => DIMS.map((d) => col(l, d)).join("|") + "|" + (col(l, "iss_bh_aliquota") ? "iss" : "sem-iss");

const escolhidos = new Map(); // cnae -> motivo
const add = (linha, motivo) => {
  const c = col(linha, "cnae");
  if (!escolhidos.has(c)) escolhidos.set(c, motivo);
};

// ── 1. um representante de cada um dos 18 perfis mais comuns ───────────────
const porPerfil = new Map();
for (const l of dados) {
  const p = perfil(l);
  if (!porPerfil.has(p)) porPerfil.set(p, []);
  porPerfil.get(p).push(l);
}
const ordenados = [...porPerfil.entries()].sort((a, b) => b[1].length - a[1].length);
ordenados.slice(0, 10).forEach(([, linhas], n) => {
  // prefere quem tem título amigável — mais fácil de reconhecer ao editar
  const alvo = linhas.find((l) => temTitulo.has(col(l, "cnae"))) ?? linhas[0];
  add(alvo, `perfil dominante #${n + 1} (${linhas.length} CNAEs iguais)`);
});

// ── 2. os que a gente ATENDE, variados ─────────────────────────────────────
const atende = dados.filter((l) => col(l, "atende_me_certeza") === "sim");
const variacoes = [
  ["ME e MEI, com título amigável", (l) => col(l, "atende_mei_certeza") === "sim" && temTitulo.has(col(l, "cnae"))],
  ["só ME (MEI não permitido)", (l) => col(l, "atende_mei_certeza") === "nao" && col(l, "mei_permitido") === "nao"],
  ["ME, e o governo deixa ser MEI, mas nós não atendemos MEI", (l) => col(l, "atende_mei_certeza") === "nao" && col(l, "mei_permitido") === "sim"],
  ["atende com Fator R dinâmico e confiança ALTA", (l) => /dinamico/.test(col(l, "anexo_fator_r_grupo")) && col(l, "anexo_fator_r_confianca") === "alta"],
  ["atende com anexo III fixo", (l) => col(l, "anexo_fator_r_grupo") === "III-fixo"],
  ["atende, mas o anexo é `requer-revisao`", (l) => col(l, "anexo_fator_r_grupo") === "requer-revisao"],
  ["atende e tem alíquota de ISS de BH", (l) => col(l, "iss_bh_aliquota")],
  ["atende e NÃO tem ISS de BH", (l) => !col(l, "iss_bh_aliquota")],
  ["atende e exige registro setorial", (l) => col(l, "exige_registro_setorial") === "sim"],
  ["atende e risco CGSIM não é baixo", (l) => col(l, "risco_baixo_cgsim") === "nao"],
];
for (const [motivo, teste] of variacoes) {
  const alvo = atende.find((l) => teste(l) && !escolhidos.has(col(l, "cnae")));
  if (alvo) add(alvo, `atendemos · ${motivo}`);
}

// 🔑 E um por SEÇÃO do IBGE entre os que atendemos. A seção é o que muda o
//    vocabulário que a pessoa usa pra se descrever ("sou cabeleireira" x "faço
//    software"), e é nisso que a busca vai ser testada.
const secoesVistas = new Set([...escolhidos.keys()].map((c) => {
  const l = dados.find((x) => col(x, "cnae") === c);
  return col(l, "atende_me_certeza") === "sim" ? col(l, "secao_id") : null;
}).filter(Boolean));
for (const l of atende) {
  const sec = col(l, "secao_id");
  if (secoesVistas.has(sec) || escolhidos.has(col(l, "cnae"))) continue;
  secoesVistas.add(sec);
  add(l, `atendemos · seção ${sec} (${col(l, "secao").slice(0, 38)})`);
}

// 🔴 E os que a PESSOA de fato digita. A 1a versão pegava "os 6 primeiros com
//    título amigável" em ordem de código, e saíram seis de EDIÇÃO (livros,
//    jornais diários, jornais não diários, revistas...) — amostra gorda e cega.
//    Agora são os que já usamos nos testes de busca, e um por DIVISÃO nova.
const ANCORAS = ["9602501", "7410299", "7420001", "8650003", "6202300", "9609204", "7420002"];
for (const cod of ANCORAS) {
  const l = dados.find((x) => col(x, "cnae") === cod);
  if (l && !escolhidos.has(cod)) add(l, "atendemos · âncora de busca (a pessoa digita isso)");
}
const divisoesVistas = new Set([...escolhidos.keys()].map((c) => {
  const l = dados.find((x) => col(x, "cnae") === c);
  return col(l, "divisao_id");
}));
let extras = 0;
for (const l of atende) {
  if (extras >= 4) break;
  const div = col(l, "divisao_id");
  if (divisoesVistas.has(div) || !temTitulo.has(col(l, "cnae"))) continue;
  divisoesVistas.add(div);
  add(l, `atendemos · divisão ${div}, com título amigável`);
  extras++;
}

// ── 3. as exceções que quebram regra ───────────────────────────────────────
const excecoes = [
  ["exige_conselho = DUVIDA (3º valor, fácil de esquecer)", (l) => col(l, "exige_conselho") === "duvida"],
  ["exige_conselho = sim (regulamentada)", (l) => col(l, "exige_conselho") === "sim"],
  ["vedado ao Simples (Anexo VI da CGSN)", (l) => col(l, "vedado_simples_cgsn_anexo_vi") === "sim"],
  ["ambíguo no Simples (Anexo VII da CGSN)", (l) => col(l, "ambiguo_simples_cgsn_anexo_vii") === "sim"],
  ["Anexo IV (construção, limpeza, vigilância, advocacia)", (l) => col(l, "anexo_fator_r_grupo") === "IV"],
  ["Anexo I puro (comércio)", (l) => col(l, "anexo_base") === "I"],
  ["Anexo II puro (indústria)", (l) => col(l, "anexo_base") === "II"],
  ["registro setorial = nao-verificado", (l) => col(l, "exige_registro_setorial") === "nao-verificado"],
  ["MEI permitido mas NÃO atendemos (comércio)", (l) => col(l, "mei_permitido") === "sim" && col(l, "atende_me_certeza") === "nao" && col(l, "anexo_base") === "I"],
  ["risco CGSIM alto E exige conselho", (l) => col(l, "risco_baixo_cgsim") === "nao" && col(l, "exige_conselho") === "sim"],
  ["tem ISS de BH com detalhe longo", (l) => (col(l, "iss_bh_detalhe") ?? "").length > 400],
  ["alíquota de ISS que VARIA", (l) => col(l, "iss_bh_varia") === "sim"],
];
for (const [motivo, teste] of excecoes) {
  const alvo = dados.find((l) => teste(l) && !escolhidos.has(col(l, "cnae")));
  if (alvo) add(alvo, `exceção · ${motivo}`);
}

// ── 4. os que atendemos e o motor NÃO apura ────────────────────────────────
let n = 0;
for (const l of dados) {
  if (n >= 5) break;
  if (semMotor.has(col(l, "cnae")) && !escolhidos.has(col(l, "cnae"))) {
    add(l, "atendemos mas o motor NÃO apura o DAS (dos 7 de 18/09)");
    n++;
  }
}

// ── saída ──────────────────────────────────────────────────────────────────
const linhasSaida = dados.filter((l) => escolhidos.has(col(l, "cnae")));
const novoCab = [...cab, "_motivo_da_amostra", "_tem_titulo_amigavel", "_motor_apura"];
const csv = [
  novoCab.map(escapar).join(","),
  ...linhasSaida.map((l) => {
    const c = col(l, "cnae");
    return [...l, escolhidos.get(c), temTitulo.has(c) ? "sim" : "nao", semMotor.has(c) ? "nao" : "-"]
      .map((v) => escapar(String(v ?? ""))).join(",");
  }),
].join("\n") + "\n";
writeFileSync(SAIDA, csv, "utf8");

console.log(`${linhasSaida.length} CNAEs na amostra\n`);
const cobertos = new Set(linhasSaida.map(perfil));
console.log(`perfis cobertos: ${cobertos.size} de ${porPerfil.size}`);
console.log(`% da tabela que os perfis escolhidos representam: ${Math.round(
  ordenados.filter(([p]) => cobertos.has(p)).reduce((a, [, l]) => a + l.length, 0) / dados.length * 100,
)}%\n`);
for (const [c, m] of escolhidos) {
  const l = dados.find((x) => col(x, "cnae") === c);
  console.log(`  ${c}  ${(col(l, "descricao") || "").slice(0, 44).padEnd(46)} ${m}`);
}
