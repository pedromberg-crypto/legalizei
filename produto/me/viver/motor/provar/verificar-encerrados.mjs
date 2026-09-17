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
import { resolve } from "node:path";
import {
  ENCERRADOS,
  DOCS_DE_PENDENCIA,
  FONTES_DE_DESENHO,
  CONTRADICOES,
  LINGUAGEM_DE_ABERTO,
  SELO,
} from "./_encerrados.mjs";
import { RAIZ } from "../_raiz.mjs";

const semAcento = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const violacoes = [];
let linhasLidas = 0;

for (const rel of DOCS_DE_PENDENCIA) {
  const caminho = resolve(RAIZ, rel);
  /**
   * 🔴 Doc declarado que não existe é DEFEITO, não "nada a conferir".
   *
   * Até 17/09 esta linha era `continue`, e foi por pouco que ela não custou
   * caro: na mudança do motor para `produto/me/viver/` o `RAIZ` passou a
   * apontar dois níveis acima do certo, e a trava teria varrido **zero
   * arquivo** saindo VERDE. Mesmo formato da trava cega de 16/09.
   */
  if (!existsSync(caminho)) {
    console.error(`\n🔴 Doc de pendência declarado e INEXISTENTE: ${rel}`);
    console.error("   Ou o arquivo mudou de lugar, ou a lista envelheceu.\n");
    process.exit(1);
  }

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

/* ═══════════════════════════════════════════════════════════════════════════
 * 🔴 A SEGUNDA VARREDURA — as FONTES DE DESENHO
 * ═══════════════════════════════════════════════════════════════════════════
 * Acrescentada em 16/09, depois de achar a TERCEIRA cópia da leitura errada da
 * CPP viva em `cru/prolabore.mjs`, três dias depois de ela ter sido refutada.
 *
 * 🔑 A varredura de cima procura assunto encerrado voltando como DÚVIDA. Esta
 * procura o contrário: ele afirmado como VERDADE, e a verdade afirmada sendo a
 * errada. São dois modos de falhar diferentes e precisam de duas varreduras.
 */

const contradicoes = [];

for (const arquivo of FONTES_DE_DESENHO) {
  /**
   * 🔴 Mesma correção de 17/09 do laço acima, e aqui doía mais: esta é a
   * varredura que pegou a TERCEIRA cópia da CPP errada, no `cru/prolabore.mjs`.
   * Ela lia por caminho relativo ao `cwd` e engolia a falha num `catch`, então
   * bastava rodar de outra pasta para ela conferir nada e não dizer nada.
   */
  const caminho = resolve(RAIZ, arquivo);
  if (!existsSync(caminho)) {
    console.error(`\n🔴 Fonte de desenho declarada e INEXISTENTE: ${arquivo}`);
    console.error("   Ou o arquivo mudou de lugar, ou a lista envelheceu.\n");
    process.exit(1);
  }
  const texto = readFileSync(caminho, "utf8");

  const linhas = texto.split(/\r?\n/);
  linhas.forEach((linha, i) => {
    if (linha.includes(SELO)) return; // citação legítima, já marcada
    const baixa = linha.toLowerCase();

    for (const c of CONTRADICOES) {
      for (const frase of c.frases) {
        if (baixa.includes(frase.toLowerCase())) {
          contradicoes.push({
            arquivo,
            linha: i + 1,
            frase,
            de: c.de,
            porque: c.porque,
            texto: linha.trim(),
          });
        }
      }
    }
  });
}

console.log(
  `${FONTES_DE_DESENHO.length} fonte(s) de desenho varrida(s) contra ${CONTRADICOES.length} contradição(ões) conhecida(s).`
);

console.log("─".repeat(84));

if (!violacoes.length && !contradicoes.length) {
  console.log("\n✅ Nenhum assunto encerrado voltou pra fila, e nenhuma fonte de desenho o contradiz.\n");
  process.exit(0);
}

if (contradicoes.length) {
  console.log(`\n🔴 ${contradicoes.length} CONTRADIÇÃO(ÕES) EM FONTE DE DESENHO:\n`);
  for (const c of contradicoes) {
    console.log(`   ${c.arquivo}:${c.linha}  — afirma o que ${c.de} nega`);
    console.log(`      "${c.frase}"`);
    console.log(`      ↳ ${c.porque}`);
    console.log(
      `      ↳ Fonte de desenho ENSINA. Corrija a afirmação, ou marque com ${SELO} se for` +
        ` citação histórica explicando o erro.\n`
    );
  }
  if (!violacoes.length) process.exit(1);
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
