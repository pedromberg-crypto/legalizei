#!/usr/bin/env node
/**
 * verificar-cnae.js — audita NÚMERO e CRUZAMENTO, não link/data.
 *
 * uso: node pesquisa/cnae-matriz/verificar-cnae.js
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Por que existe (27/08): `_sistema/verificar.js` já audita o vault (derivado
 * desatualizado, link quebrado, vocabulário) mas NUNCA teria pego "90 vs 103"
 * ou um CNAE digitado errado dentro de uma categoria — porque isso é erro de
 * NÚMERO e CRUZAMENTO DE DADO, não de metadado. Foi exatamente esse tipo de
 * erro que gerou as "surpresas" recorrentes (achado do Pedro, 27/08).
 *
 * Este script confere 5 coisas, todas objetivas (sem julgamento humano):
 *   1. Todo CNAE de `cnae-atendemos-certeza.json` (os 90) existe no mestre
 *      `cnae-matriz.json` (os 1332) com a MESMA descrição.
 *   2. Todo CNAE citado em `taxonomia-pills-n4.md` (por categoria + "fora de
 *      pill") existe nos 90 — nenhuma categoria cita CNAE fantasma.
 *   3. A união dos CNAEs do doc de taxonomia (categorias + fora-de-pill) bate
 *      EXATAMENTE com os 90 — ninguém ficou de fora sem categoria, ninguém
 *      sobrou duplicado além do esperado (web design).
 *   4. A contagem declarada em cada cabeçalho `### N. Nome (count)` bate com
 *      a contagem real de códigos naquela seção.
 *   5. O array `PILLS` do código (`gate-telas.tsx`) tem os MESMOS rótulos e
 *      quantidade de categorias que o doc — código e doc não podem divergir.
 *
 * Exit 1 se qualquer um falhar. Isto não substitui `_sistema/verificar.js`
 * (aquele continua rodando pro resto do vault) — este é específico de CNAE
 * porque o assunto tem números e cruzamentos que o script genérico não sabe
 * verificar (ele não sabe o que é "90" nem o que é uma categoria).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const norm = (c) => c.replace(/\D/g, "");

let falhas = 0;
function ok(msg) {
  console.log(`✅ ${msg}`);
}
function falha(msg) {
  console.log(`🔴 ${msg}`);
  falhas++;
}
function aviso(msg) {
  console.log(`🟡 ${msg}`);
}

// ── 1. Carrega os 3 datasets ────────────────────────────────────────────────
const matriz = JSON.parse(fs.readFileSync(path.join(DIR, "cnae-matriz.json"), "utf8"));
const certeza = JSON.parse(fs.readFileSync(path.join(DIR, "cnae-atendemos-certeza.json"), "utf8"));
const matrizPorCodigo = new Map(matriz.map((r) => [norm(r.cnae), r]));

console.log(`═══ VERIFICAÇÃO CNAE ═══  mestre: ${matriz.length} · certeza: ${certeza.length}\n`);

// ── 2. Todo CNAE dos 90 existe no mestre, com a MESMA descrição ────────────
let descDivergente = 0;
for (const r of certeza) {
  const cod = norm(r.cnae);
  const m = matrizPorCodigo.get(cod);
  if (!m) {
    falha(`CNAE ${r.cnae} está em certeza.json mas NÃO existe no mestre (1332)`);
    continue;
  }
  if (m.descricao.trim() !== r.descricao.trim()) {
    falha(`CNAE ${r.cnae}: descrição diverge entre certeza.json ("${r.descricao}") e mestre ("${m.descricao}")`);
    descDivergente++;
  }
}
if (descDivergente === 0) ok(`Todos os ${certeza.length} CNAEs de certeza.json existem no mestre com descrição idêntica`);

// ── 3. atende_mei_certeza bate com o que o doc afirma ──────────────────────
const meiCount = certeza.filter((r) => r.atende_mei_certeza === "sim").length;
const meCount = certeza.filter((r) => r.atende_me_certeza === "sim").length;
const liso = fs.readFileSync(path.join(DIR, "cnae-liso-servico.md"), "utf8");
const mLiso = liso.match(/(\d+)\s*ME\s*·\s*(\d+)\s*MEI/);
if (!mLiso) {
  aviso("Não achei o padrão 'N ME · N MEI' no título de cnae-liso-servico.md — não deu pra cruzar automaticamente");
} else {
  const [, meDoc, meiDoc] = mLiso.map(Number);
  if (meDoc === meCount && meiDoc === meiCount) {
    ok(`Contagem ME/MEI bate: ${meCount} ME · ${meiCount} MEI (dataset) == ${meDoc} ME · ${meiDoc} MEI (doc)`);
  } else {
    falha(`Contagem ME/MEI DIVERGE: dataset diz ${meCount} ME · ${meiCount} MEI, doc diz ${meDoc} ME · ${meiDoc} MEI`);
  }
}

// ── 4. Parseia taxonomia-pills-n4.md: categorias + fora-de-pill ────────────
const taxo = fs.readFileSync(path.join(DIR, "taxonomia-pills-n4.md"), "utf8");
const CODE_RE = /`(\d{4}-\d\/\d{2})`/g;

const blocoComposicao = taxo.split("## Composição")[1]?.split("## Fora de pill")[0] ?? "";
const blocoForaDePill = taxo.split("## Fora de pill")[1]?.split("\n## ")[0] ?? "";

const categorias = blocoComposicao
  .split(/(?=^### )/m)
  .map((s) => s.trim())
  .filter((s) => s.startsWith("### "));

let todosCodigosDoc = [];
let categoriasComErroDeContagem = 0;
for (const bloco of categorias) {
  const header = bloco.match(/^### (\d+)\.\s+(.+?)\s+\((\d+)(?:,[^)]*)?\)/);
  if (!header) {
    aviso(`Cabeçalho de categoria não reconhecido: "${bloco.slice(0, 60)}..."`);
    continue;
  }
  const [, num, nome, countDeclarado] = header;
  const codigos = [...bloco.matchAll(CODE_RE)].map((m) => m[1]);
  if (codigos.length !== Number(countDeclarado)) {
    falha(`Categoria "${nome}": cabeçalho declara ${countDeclarado} CNAEs, mas tem ${codigos.length} código(s) na lista`);
    categoriasComErroDeContagem++;
  }
  todosCodigosDoc.push(...codigos);
}
if (categoriasComErroDeContagem === 0) ok(`Todas as ${categorias.length} categorias têm a contagem do cabeçalho batendo com a lista de CNAEs`);

const codigosForaDePill = [...blocoForaDePill.matchAll(CODE_RE)].map((m) => m[1]);
todosCodigosDoc.push(...codigosForaDePill);

// ── 5. Todo CNAE citado no doc existe nos 90 ───────────────────────────────
const certezaSet = new Set(certeza.map((r) => norm(r.cnae)));
let fantasma = 0;
for (const cod of new Set(todosCodigosDoc)) {
  if (!certezaSet.has(norm(cod))) {
    falha(`CNAE ${cod} citado em taxonomia-pills-n4.md mas NÃO está nos ${certeza.length} certeza`);
    fantasma++;
  }
}
if (fantasma === 0) ok("Nenhum CNAE fantasma no doc de taxonomia (todos existem nos 90)");

// ── 6. União do doc == exatamente os 90 (sem sobra, sem falta) ─────────────
const docSetUnico = new Set(todosCodigosDoc.map(norm));
const faltando = [...certezaSet].filter((c) => !docSetUnico.has(c));
if (faltando.length === 0) {
  ok(`Cobertura completa: os ${certezaSet.size} CNAEs certeza aparecem todos em alguma categoria ou em "fora de pill"`);
} else {
  falha(`${faltando.length} CNAE(s) dos 90 NÃO aparecem em nenhuma categoria nem em "fora de pill": ${faltando.join(", ")}`);
}

// ── 7. PILLS do código bate com as categorias do doc ───────────────────────
const gateTelas = fs.readFileSync(path.join(DIR, "..", "..", "app", "src", "components", "gate-telas.tsx"), "utf8");
const mPills = gateTelas.match(/export const PILLS = \[([\s\S]*?)\n\];/);
if (!mPills) {
  falha("Não achei `export const PILLS = [...]` em gate-telas.tsx");
} else {
  const labelsCodigo = [...mPills[1].matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
  const labelsDoc = categorias
    .map((b) => b.match(/^### \d+\.\s+(.+?)\s+\(/)?.[1])
    .filter(Boolean);

  if (labelsCodigo.length !== labelsDoc.length) {
    falha(`PILLS no código tem ${labelsCodigo.length} categorias, doc tem ${labelsDoc.length}`);
  } else {
    const soCodigo = labelsCodigo.filter((l) => !labelsDoc.includes(l));
    const soDoc = labelsDoc.filter((l) => !labelsCodigo.includes(l));
    if (soCodigo.length || soDoc.length) {
      falha(`Rótulos divergem entre PILLS e o doc — só no código: [${soCodigo.join(", ")}] · só no doc: [${soDoc.join(", ")}]`);
    } else {
      ok(`PILLS (código) e taxonomia-pills-n4.md (doc) têm as mesmas ${labelsCodigo.length} categorias, mesmos rótulos`);
    }
  }
}

// ── resultado ────────────────────────────────────────────────────────────
console.log(`\n${falhas === 0 ? "✅ TUDO CONSISTENTE" : `🔴 ${falhas} PROBLEMA(S) — ver acima`}`);
process.exit(falhas === 0 ? 0 : 1);
