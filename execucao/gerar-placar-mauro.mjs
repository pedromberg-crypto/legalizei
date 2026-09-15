/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 O PLACAR DO REPORTE — gerado, nunca digitado.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/gerar-placar-mauro.mjs`
 *
 * Pedido do Pedro em 15/09: *"no final do doc coloque um total geral do que
 * rendeu, um placar por status e um total de dias trabalhados até o presente
 * momento, e de uma forma que esse doc já atualize essa sessão sozinho junto
 * com o que já salva."*
 *
 * 🔑 **Por isso ele é GERADO.** Placar escrito à mão envelhece no primeiro
 * flow seguinte, e aí passa a mentir com cara de resumo — que é o defeito que
 * o `portal-data.mjs` teve por um mês e meio. Aqui o número sai da contagem do
 * próprio arquivo, toda vez que roda.
 *
 * ── O QUE ELE CONTA, e de onde tira ────────────────────────────────────────
 *
 * · **Itens** — as linhas numeradas das tabelas de cada semana. É o "o que
 *   rendeu" literal: cada linha é uma entrega reportada ao sócio.
 * · **Status** — a marca da última coluna de cada linha.
 * · **Dias trabalhados** — as datas dos cabeçalhos `## Semana`, com os
 *   intervalos expandidos (`07–10/07` vira 4 dias) e as datas repetidas
 *   contadas **uma vez** (as entradas "parte 2" são o mesmo dia).
 *
 * ⚠️ **O que ele NÃO faz:** não julga se o item foi entregue de verdade, nem
 * se o status está certo. Conta o que está escrito. Se alguém marcar 🟢 no que
 * não ficou pronto, o placar repete a mentira — protege contra desatualização,
 * não contra otimismo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DOC = resolve(AQUI, "evolucao-para-mauro.md");

const INICIO = "<!-- PLACAR:INICIO — gerado por gerar-placar-mauro.mjs, não editar à mão -->";
const FIM = "<!-- PLACAR:FIM -->";

/** As marcas de status que aparecem no doc, na ordem em que importam. */
const STATUS = [
  { marca: "🟢", nome: "pronto / entregue" },
  { marca: "🟡", nome: "em curso / parcial" },
  { marca: "🔴", nome: "trava ou precisa de você" },
  { marca: "🕓", nome: "aguarda pessoa" },
  { marca: "⏳", nome: "aguarda autorização" },
  { marca: "⚪", nome: "sem cor definida" },
];

const texto = readFileSync(DOC, "utf8");
const linhas = texto.split(/\r?\n/);

/* ── 1 · Os dias trabalhados ──────────────────────────────────────────────
 * Os cabeçalhos vêm em três formas: data simples (`13/07/2026`), intervalo
 * com travessão (`07–10/07/2026`) ou com hífen (`20-21/08/2026`). E há
 * entradas "(parte 2)" no mesmo dia — dois flows, um dia só.              */
const dias = new Set();
const semanas = [];

for (const l of linhas) {
  const m = l.match(/^## Semana\s+([^\n—]*?)(?:\s+—|\s*$)/);
  if (!m) continue;
  const bruto = m[1].replace(/\(parte \d+\)/gi, "").trim();
  semanas.push(bruto);

  // Intervalo: "07–10/07/2026" ou "24-27/07/2026"
  const intervalo = bruto.match(/^(\d{1,2})\s*[–-]\s*(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (intervalo) {
    const [, de, ate, mes, ano] = intervalo;
    for (let d = Number(de); d <= Number(ate); d++) {
      dias.add(`${ano}-${mes}-${String(d).padStart(2, "0")}`);
    }
    continue;
  }

  const simples = bruto.match(/^(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (simples) {
    const [, d, mes, ano] = simples;
    dias.add(`${ano}-${mes}-${d.padStart(2, "0")}`);
  }
}

const ordenados = [...dias].sort();
const primeiro = ordenados[0];
const ultimo = ordenados[ordenados.length - 1];

/** Corridos entre o primeiro e o último dia — a régua do "quanto tempo". */
const corridos =
  Math.round(
    (new Date(`${ultimo}T00:00:00Z`) - new Date(`${primeiro}T00:00:00Z`)) / 86400000
  ) + 1;

/* ── 2 · Os itens e o placar ─────────────────────────────────────────────── */
const contagem = Object.fromEntries(STATUS.map((s) => [s.marca, 0]));
let itens = 0;
let semMarca = 0;

for (const l of linhas) {
  // Linha de item: começa com `| <número> |`, com ou sem negrito.
  if (!/^\|\s*\*{0,2}\d+\*{0,2}\s*\|/.test(l)) continue;
  itens++;

  const colunas = l.split("|").map((c) => c.trim()).filter((c) => c !== "");
  const ultima = colunas[colunas.length - 1] ?? "";
  const achou = STATUS.find((s) => ultima.includes(s.marca));
  if (achou) contagem[achou.marca]++;
  else semMarca++;
}

/* ── 3 · Por mês, pra dar textura à linha do tempo ────────────────────────── */
const porMes = {};
for (const d of ordenados) {
  const mes = d.slice(0, 7);
  porMes[mes] = (porMes[mes] ?? 0) + 1;
}
const MESES = {
  "07": "julho", "08": "agosto", "09": "setembro", "10": "outubro",
  "11": "novembro", "12": "dezembro", "01": "janeiro", "02": "fevereiro",
  "03": "março", "04": "abril", "05": "maio", "06": "junho",
};

/* ── 4 · O bloco ─────────────────────────────────────────────────────────── */
const hoje = new Date().toISOString().slice(0, 10);
const br = (iso) => iso.split("-").reverse().join("/");

const linhasStatus = STATUS.filter((s) => contagem[s.marca] > 0)
  .map((s) => {
    const n = contagem[s.marca];
    const pct = ((n / itens) * 100).toFixed(1).replace(".", ",");
    return `| ${s.marca} ${s.nome} | **${n}** | ${pct}% |`;
  })
  .join("\n");

const linhasMes = Object.entries(porMes)
  .map(([mes, n]) => {
    const [ano, m] = mes.split("-");
    return `| ${MESES[m]}/${ano} | ${n} |`;
  })
  .join("\n");

const bloco = `${INICIO}

## 📊 Placar geral

> 🤖 **Este bloco é gerado.** Ele se reconta sozinho a cada \`/fechar\`, a partir das tabelas abaixo — nenhum número aqui é digitado. Gerado em **${br(hoje)}**.

### O que rendeu

| | |
|---|---:|
| **Entregas reportadas** | **${itens}** |
| Entradas no log | ${semanas.length} |
| **Dias trabalhados** | **${ordenados.length}** |
| Período | ${br(primeiro)} → ${br(ultimo)} |
| Dias corridos no período | ${corridos} |
| Média de entregas por dia trabalhado | ${(itens / ordenados.length).toFixed(1).replace(".", ",")} |

### Placar por status

| Status | Itens | % |
|---|---:|---:|
${linhasStatus}${semMarca ? `\n| sem marca | ${semMarca} | ${((semMarca / itens) * 100).toFixed(1).replace(".", ",")}% |` : ""}

### Ritmo, mês a mês

| Mês | Dias trabalhados |
|---|---:|
${linhasMes}

---

${FIM}`;

/* ── 5 · Escreve, no TOPO ─────────────────────────────────────────────────
 * 🔑 O placar vai **antes** da primeira semana, não no fim. Pedido do Pedro
 * em 15/09, e é o certo: o doc tem 46 entradas e ~150 kB, então o resumo no
 * rodapé exigiria rolar tudo para ver o total — que é exatamente o contrário
 * do que um placar serve.
 *
 * Âncora: a linha da primeira `## Semana`. Se o bloco já existe, substitui no
 * lugar onde estiver.                                                      */
const jaTem = texto.includes(INICIO);

let novo;
if (jaTem) {
  novo = texto.replace(
    new RegExp(`${escapar(INICIO)}[\\s\\S]*?${escapar(FIM)}\\n*`),
    `${bloco}\n\n`
  );
} else {
  const primeiraSemana = texto.search(/^## Semana /m);
  if (primeiraSemana < 0) {
    novo = `${texto.trimEnd()}\n\n${bloco}\n`;
  } else {
    novo =
      texto.slice(0, primeiraSemana) + `${bloco}\n\n` + texto.slice(primeiraSemana);
  }
}

writeFileSync(DOC, novo, "utf8");

function escapar(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

console.log(`\n📊 Placar do reporte ${jaTem ? "atualizado" : "criado"} em evolucao-para-mauro.md\n`);
console.log(`   ${itens} entregas · ${ordenados.length} dias trabalhados · ${semanas.length} entradas`);
console.log(`   ${br(primeiro)} → ${br(ultimo)} (${corridos} dias corridos)\n`);
for (const s of STATUS) {
  if (contagem[s.marca]) console.log(`   ${s.marca} ${String(contagem[s.marca]).padStart(3)}  ${s.nome}`);
}
if (semMarca) console.log(`   ⬜ ${String(semMarca).padStart(3)}  sem marca`);
console.log("");
