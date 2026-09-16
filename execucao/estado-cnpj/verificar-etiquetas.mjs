/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏷️ A TRAVA DA ETIQUETA — toda linha de persona diz de quem ela é.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 16/09, depois de um pente fino:
 *
 *   *"me diga se falta alguma coisa que precisamos deixar mais claro do que é
 *   nossa decisão e nosso cálculo e o que é decisão da persona."*
 *
 * ── 🔴 O DIAGNÓSTICO QUE FEZ ESTA TRAVA NASCER ─────────────────────────────
 *
 * Faltava, e o padrão da falha importa: a autoria **existia** na P01 e na P11,
 * escrita em prosa — *"decisão dele, não falha nossa"*, *"aqui a premissa é
 * NOSSA"*. E **não existia** na P03 nem na P09, que foram escritas depois.
 *
 * 🔑 Não foi erro de julgamento, foi erro de APLICAÇÃO MANUAL. Eu sabia a
 * regra e esqueci de aplicá-la em 3 de 5 tabelas — exatamente como o ISS, que
 * nunca esteve errado no código e reincidiu três vezes em prosa.
 *
 * Prosa não se confere. Coluna se confere. Por isso a etiqueta virou célula.
 *
 * ── ⚠️ O QUE ELA PEGA E O QUE NÃO PEGA ─────────────────────────────────────
 *
 * Pega **ausência**: linha de tabela de persona sem etiqueta na 2ª coluna.
 * NÃO pega **etiqueta errada** — marcar de 🏠 o que é ⚖️ passa limpo. Isso
 * segue sendo leitura humana, igual à trava de anatomia do MEI, que pega
 * estrutura e não espaçamento.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "node:fs";

const DOC = "execucao/estado-cnpj/_duvidas-contador.md";

/**
 * As cinco vias. Mais que três porque a realidade pediu: 🏢 nasceu do pedido
 * do Pedro de marcar o que é espelho da Contabilizei, e ⏳ do buraco que a
 * P16 achou (o teto do ME sem aviso nenhum).
 */
export const ETIQUETAS = {
  "⚖️": "a lei — ninguém escolheu",
  "🏠": "nós — decisão ou cálculo da casa",
  "👤": "o cliente — escolha dele",
  "🏢": "espelho da Contabilizei — a decidir",
  "⏳": "não existe ainda",
  "—": "linha de total, sem dono",
};

/** O cabeçalho que marca uma tabela como sujeita à regra. */
const CABECALHO = /^\|\s*Quando\s*\|\s*Quem\s*\|/;
/** E o das tabelas do ciclo, que usam `Dia` no lugar de `Quando`. */
const CABECALHO_CICLO = /^\|\s*Dia\s*\|\s*Quem\s*\|/;

const linhas = readFileSync(DOC, "utf8").split(/\r?\n/);

let dentro = false;
let tabela = null;
const tabelas = [];
const faltando = [];

linhas.forEach((linha, i) => {
  const numero = i + 1;

  if (CABECALHO.test(linha) || CABECALHO_CICLO.test(linha)) {
    dentro = true;
    tabela = { inicio: numero, linhas: 0, porEtiqueta: {} };
    tabelas.push(tabela);
    return;
  }

  if (!dentro) return;

  // Separador `|---|:---:|---|` e fim de tabela.
  if (/^\|[\s:|-]+\|$/.test(linha)) return;
  if (!linha.startsWith("|")) {
    dentro = false;
    return;
  }

  // A 2ª célula é a etiqueta.
  const celulas = linha.split("|").slice(1, -1);
  const etiqueta = (celulas[1] || "").trim();

  tabela.linhas += 1;

  const achada = Object.keys(ETIQUETAS).find((e) => etiqueta.includes(e));
  if (achada) {
    tabela.porEtiqueta[achada] = (tabela.porEtiqueta[achada] || 0) + 1;
  } else {
    faltando.push({ numero, etiqueta, trecho: linha.slice(0, 90) });
  }
});

/* ── O relatório ─────────────────────────────────────────────────────────── */

console.log("\n🏷️  TRAVA DA ETIQUETA — de quem é cada linha das personas");
console.log("═".repeat(84) + "\n");

const total = tabelas.reduce((s, t) => s + t.linhas, 0);
const geral = {};
for (const t of tabelas) {
  for (const [e, n] of Object.entries(t.porEtiqueta)) {
    geral[e] = (geral[e] || 0) + n;
  }
}

console.log(`${tabelas.length} tabela(s) etiquetada(s), ${total} linhas:\n`);
for (const [e, desc] of Object.entries(ETIQUETAS)) {
  const n = geral[e] || 0;
  if (n === 0) continue;
  const pct = ((n / total) * 100).toFixed(0);
  console.log(`   ${e}  ${String(n).padStart(3)}  ${String(pct).padStart(3)}%  ${desc}`);
}

// 🔑 O 🏢 é o placar que o Pedro quer ver cair: cada um é uma decisão que
// hoje roda por imitação e que deveria virar régua nossa ou regra ratificada.
const espelho = geral["🏢"] || 0;
if (espelho > 0) {
  console.log(
    `\n🔴 ${espelho} linha(s) ainda rodam como ESPELHO da Contabilizei.` +
      `\n   Cada uma é uma data que ninguém nos obrigou a adotar. Ver bloco 🏢1-🏢4.`
  );
}

console.log("\n" + "─".repeat(84) + "\n");

if (faltando.length > 0) {
  console.log(`🔴 ${faltando.length} linha(s) SEM etiqueta — não dá pra saber de quem é:\n`);
  for (const f of faltando) {
    console.log(`   linha ${f.numero}: "${f.etiqueta}"`);
    console.log(`      ${f.trecho}…`);
  }
  console.log(
    "\n⚠️  Linha sem dono é a falha original deste documento: a autoria ficava" +
      "\n   na prosa de umas personas e sumia nas outras. Etiquete antes de fechar."
  );
  process.exit(1);
}

if (tabelas.length === 0) {
  console.log("🔴 Nenhuma tabela etiquetada encontrada — o cabeçalho `| Quando | Quem |`");
  console.log("   sumiu, ou o documento mudou de formato. Isso é regressão, não limpeza.");
  process.exit(1);
}

console.log("✅ Toda linha de persona diz de quem ela é.");
console.log("\n⚠️  A trava pega AUSÊNCIA, não etiqueta errada. Marcar de 🏠 o que é ⚖️");
console.log("   passa limpo aqui — isso segue sendo leitura humana.\n");
