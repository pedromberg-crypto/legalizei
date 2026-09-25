/* Testa se uma frase de cliente ACHA o CNAE certo — reproduzindo localmente a
   matemática que o Postgres usa na `fatos.consultar_cnae`.

   🔑 Existe porque "esse título está bom?" não é pergunta de gosto, é pergunta
   de medida. A função de busca do Léo é:

     WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
     ORDER BY greatest(similarity(titulo_amigavel, p_busca),
                       similarity(descricao,       p_busca)) DESC
     LIMIT 5

   Ou seja: o ÚNICO alvo é o título. Então o critério de um bom título é um só
   — a frase que a pessoa digita precisa ACHAR ele, e de preferência em 1º.

   ⚠️ Isto é uma APROXIMAÇÃO fiel, não o Postgres. O `pg_trgm` acolchoa cada
   palavra com 2 espaços na frente e 1 atrás, quebra em trigramas e mede
   Jaccard (interseção ÷ união). O `<%` (word_similarity) procura a melhor
   janela de palavras do alvo, e é isso que a função `palavra()` imita.
   Diferenças de acento e de limiar podem existir; para decidir entre dois
   títulos, serve. Para afirmar comportamento em produção, roda no VPS.

   Uso:  node testar-busca.mjs "faço unhas em casa" "sou sapateiro" ... */

import { readFileSync } from "node:fs";

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

// pg_trgm: minúscula, sem acento, não-alfanumérico vira separador,
// cada palavra ganha "  " na frente e " " atrás, e se quebra em 3.
const limpar = (s) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function trigramas(txt) {
  const set = new Set();
  for (const p of limpar(txt).split(/[^a-z0-9]+/).filter(Boolean)) {
    const s = "  " + p + " ";
    for (let i = 0; i + 3 <= s.length; i++) set.add(s.slice(i, i + 3));
  }
  return set;
}
const jaccard = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
};
const similarity = (a, b) => jaccard(trigramas(a), trigramas(b));

/* word_similarity: a melhor janela contígua de palavras do ALVO comparada
   com a busca inteira. É o que faz "sou sapateiro" casar com um título longo
   que contenha "sapateiro". */
function palavra(busca, alvo) {
  const pal = limpar(alvo).split(/[^a-z0-9]+/).filter(Boolean);
  const B = trigramas(busca);
  let melhor = 0;
  for (let i = 0; i < pal.length; i++) {
    for (let j = i; j < pal.length && j < i + 8; j++) {
      const janela = pal.slice(i, j + 1).join(" ");
      const t = trigramas(janela);
      let inter = 0;
      for (const g of t) if (B.has(g)) inter++;
      melhor = Math.max(melhor, inter / t.size); // extensão da janela coberta
    }
  }
  return melhor;
}
const LIMIAR = 0.6; // `pg_trgm.word_similarity_threshold`, padrão do Postgres

const B = parse(readFileSync("_entrega-leo/cnae-leo.csv", "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = B[0], dados = B.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

// Substituições propostas, para comparar antes × depois no mesmo comando.
const PROPOSTAS = JSON.parse(process.env.PROPOSTAS ?? "{}");
const titulo = (l) => PROPOSTAS[g(l, "codigo")] ?? g(l, "titulo_amigavel");

for (const busca of process.argv.slice(2)) {
  const r = dados
    .map((l) => ({ l, w: palavra(busca, titulo(l)), s: Math.max(similarity(titulo(l), busca), similarity(g(l, "titulo_oficial"), busca)) }))
    .filter((x) => x.w >= LIMIAR)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);
  console.log(`\n"${busca}"`);
  if (!r.length) { console.log("   🔴 NADA — a busca devolve vazio, e o Léo improvisa"); continue; }
  r.forEach((x, i) => console.log(`   ${i + 1}. ${g(x.l, "codigo")}  ${titulo(x.l).padEnd(52)} ${x.s.toFixed(2)}`));
}
