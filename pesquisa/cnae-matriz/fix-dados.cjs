const fs = require('fs');

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

const idx_iss = cab.indexOf("iss_bh_aliquota");
const idx_das = cab.indexOf("mei_iss_fixo_das");

const limpos = dados.map(row => {
    if (idx_iss !== -1 && row[idx_iss]) {
        row[idx_iss] = row[idx_iss].replace("%", "").trim();
    }
    if (idx_das !== -1 && (!row[idx_das] || row[idx_das].trim() === "")) {
        // Apenas aplica se for MEI permitido (opicional, vou checar se `mei_permitido` é 'sim')
        const idx_mei_permitido = cab.indexOf("mei_permitido");
        if (row[idx_mei_permitido] === "sim") {
             row[idx_das] = "86.05";
        }
    }
    return row;
});

fs.writeFileSync("cnae-matriz-v2.csv", [cab.map(escapar).join(","), ...limpos.map(r => r.map(escapar).join(","))].join("\n") + "\n", "utf8");
console.log("Valores limpos e preenchidos.");
