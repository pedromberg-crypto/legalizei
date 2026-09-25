import { readFileSync, existsSync } from "node:fs";

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

const limpar = (s) => (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

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
      melhor = Math.max(melhor, inter / t.size);
    }
  }
  return melhor;
}
const LIMIAR = 0.6;

const B = parse(readFileSync("_entrega-leo/cnae-leo-1332.csv", "utf8").replace(/^\uFEFF/, "")).filter((l) => l.length > 1);
const cab = B[0], dados = B.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

const PROPOSTAS = JSON.parse(process.env.PROPOSTAS ?? "{}");
const titulo = (l) => PROPOSTAS[g(l, "codigo")] ?? g(l, "titulo_amigavel");

let aliases = [];
if (existsSync("cnae-aliases.json")) {
    aliases = JSON.parse(readFileSync("cnae-aliases.json", "utf8"));
}

for (const busca of process.argv.slice(2)) {
  console.log(`\n"${busca}"`);
  const bLimpo = limpar(busca);
  
  // 1. Checar Alias por substring/presença da palavra
  // Usamos regex com borda de palavra para garantir que 'personal' não case com 'personalidade'
  let matchedAlias = null;
  for (const a of aliases) {
      const termoLimpo = limpar(a.termo);
      const regex = new RegExp(`\\b${termoLimpo}\\b`);
      if (regex.test(bLimpo)) {
          matchedAlias = a;
          break;
      }
  }

  if (matchedAlias) {
      const row = dados.find(l => g(l, "codigo").replace(/\D/g, "") === matchedAlias.codigo.replace(/\D/g, ""));
      if (row) {
          console.log(`   🌟 ENCONTRADO POR ALIAS: '${matchedAlias.termo}'`);
          console.log(`   1. ${g(row, "codigo")}  ${titulo(row).padEnd(52)} 1.00`);
          continue;
      }
  }

  // 2. Fallback pro pg_trgm local
  const r = dados
    .map((l) => {
        const wAmigavel = palavra(busca, titulo(l));
        const wAtividades = palavra(busca, g(l, "termos_de_busca"));
        // Simulando a combinação do tsvector (que olha termos de busca) + trgm (amigavel)
        const w = Math.max(wAmigavel, wAtividades * 0.5); // Aproximação grosseira para o teste local
        const sAmigavel = similarity(titulo(l), busca);
        const sOficial = similarity(g(l, "titulo_oficial"), busca);
        const sAtividades = similarity(g(l, "termos_de_busca"), busca) * 0.3; 
        const s = Math.max(sAmigavel, sOficial, sAtividades);
        return { l, w, s: sAmigavel > sOficial ? sAmigavel : sOficial }; 
    })
    .filter((x) => x.w >= LIMIAR)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);
  
  if (!r.length) { console.log("   🔴 NADA — a busca devolve vazio, e o Léo improvisa"); continue; }
  r.forEach((x, i) => console.log(`   ${i + 1}. ${g(x.l, "codigo")}  ${titulo(x.l).padEnd(52)} ${x.s.toFixed(2)}`));
}
