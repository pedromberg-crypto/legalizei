/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 TRAVA DE REABERTURA — assunto encerrado não volta pra fila.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/motor-fiscal/verificar-encerrados.mjs`
 *
 * Varre os documentos de PENDÊNCIA atrás de assunto que já está encerrado em
 * `_encerrados.mjs`. Achou o termo numa linha com linguagem de "em aberto", e
 * sem o selo `[ENCERRADO]` → derruba a rodada, com arquivo, linha e o assunto.
 *
 * 🔑 **Por que varre PROSA e não código:** o ISS nunca esteve errado no
 * código. `retencaoLegitima()` está certa desde 14/09 e nenhum teste falhou.
 * As três reincidências foram eu escrevendo ISS numa lista de "o que falta" e
 * numa lista de "dúvidas com o contador". Trava que olhasse o código não
 * pegaria nada, porque lá nunca houve erro.
 *
 * ── ⚠️ O QUE ELA NÃO FAZ ───────────────────────────────────────────────────
 *
 * · **Não me impede de falar besteira no chat.** Ela roda sobre arquivo. Se eu
 *   reabrir o assunto numa resposta e não escrever em lugar nenhum, ela não vê.
 * · **Pega o TERMO, não o raciocínio** — mesma fronteira da trava de escopo.
 *   Alguém pode reabrir o assunto com outras palavras.
 * · **Não julga se o encerramento estava certo.** Se a resposta travada
 *   estiver errada, ela protege o erro. Reencerrar é decisão, e o campo
 *   `encerradoEm` existe para isso ficar datado.
 *
 * Protege contra o deslize, não contra o engano — como todas as outras.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ENCERRADOS,
  DOCS_DE_PENDENCIA,
  LINGUAGEM_DE_ABERTO,
  SELO,
} from "./_encerrados.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");

const semAcento = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const violacoes = [];
let linhasLidas = 0;

for (const rel of DOCS_DE_PENDENCIA) {
  const caminho = resolve(RAIZ, rel);
  if (!existsSync(caminho)) continue;

  const linhas = readFileSync(caminho, "utf8").split(/\r?\n/);

  linhas.forEach((linha, i) => {
    linhasLidas++;
    if (linha.includes(SELO)) return; // citação autorizada

    const plana = semAcento(linha);
    const pareceAberto = LINGUAGEM_DE_ABERTO.some((t) => plana.includes(semAcento(t)));
    if (!pareceAberto) return;

    for (const e of ENCERRADOS) {
      const bateu = e.termos.find((t) => {
        const termo = semAcento(t);
        // Palavra inteira: evita casar "iss" dentro de "emissão", "comissão"…
        return new RegExp(`(^|[^a-z0-9])${termo}([^a-z0-9]|$)`).test(plana);
      });
      if (bateu) {
        violacoes.push({ arquivo: rel, linha: i + 1, termo: bateu, encerrado: e, texto: linha.trim() });
      }
    }
  });
}

console.log(`\n${"═".repeat(84)}`);
console.log("🔒 TRAVA DE REABERTURA — assuntos encerrados que voltaram pra fila");
console.log("═".repeat(84));

console.log(`\n${ENCERRADOS.length} assunto(s) encerrado(s), ${linhasLidas} linhas varridas:\n`);
for (const e of ENCERRADOS) {
  const recaidas = e.reabertoIndevidamentePor
    ? ` · 🔴 já reaberto ${e.reabertoIndevidamentePor}×`
    : "";
  console.log(`   ${e.id.padEnd(10)} ${e.assunto}`);
  console.log(`   ${" ".repeat(10)} encerrado em ${e.encerradoEm}${recaidas}`);
  if (e.decisaoDeProduto) console.log(`   ${" ".repeat(10)} 🔴 produto: ${e.decisaoDeProduto.slice(0, 120)}…`);
  if (e.aindaAberto) console.log(`   ${" ".repeat(10)} ⚠️  segue aberto (outra coisa): ${e.aindaAberto.slice(0, 90)}…`);
  console.log("");
}

console.log("─".repeat(84));

if (!violacoes.length) {
  console.log("\n✅ Nenhum assunto encerrado voltou pra fila de pendência.\n");
  process.exit(0);
}

console.log(`\n🔴 ${violacoes.length} REABERTURA(S):\n`);
for (const v of violacoes) {
  console.log(`   ${v.arquivo}:${v.linha}  — termo "${v.termo}" (${v.encerrado.id})`);
  console.log(`      ${v.texto.slice(0, 110)}`);
  console.log(`      ↳ ${v.encerrado.resposta.slice(0, 150)}…`);
  console.log(
    `      ↳ Se a citação for legítima (explicar que JÁ foi encerrado), marque a linha com ${SELO}.\n`
  );
}
process.exit(1);
