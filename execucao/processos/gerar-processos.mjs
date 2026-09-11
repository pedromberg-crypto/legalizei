/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR DOS PROCESSOS — uma fonte, duas saídas.
 * ═══════════════════════════════════════════════════════════════════════════
 *   processos-data.mjs  (única coisa que se edita à mão)
 *        ├── app/src/lib/processos-graph.json  → board /processos, pro Pedro
 *        └── execucao/processos/PROCESSOS.md   → nota literal, pro dev e o Mauro
 *
 * Os dois nunca divergem porque nenhum dos dois é escrito à mão. Mesma
 * disciplina do `flow/gerar-mapa.mjs`.
 *
 * AUDITORIAS que ele roda (falha barulhenta, nunca silenciosa):
 *   1. aresta apontando pra passo que não existe
 *   2. passo que ninguém alcança (órfão) — fora o primeiro de cada processo
 *   3. passo amarelo/vermelho SEM o campo `duvida` preenchido — é a trava
 *      principal: sinalizar buraco sem dizer qual é a pergunta não vale nada
 *   4. passo verde COM `duvida` — ou não é verde, ou a dúvida já foi resolvida
 *   5. `fala` vazio — "com quem a casa fala" é obrigatório, e "—" é resposta
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PROCESSOS, PASSOS, ARESTAS } from "./processos-data.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");
const SAIDA_JSON = resolve(RAIZ, "app/src/lib/processos-graph.json");
const SAIDA_MD = resolve(AQUI, "PROCESSOS.md");

const LUZ = {
  verde: { emoji: "🟢", nome: "sabemos e dá", cor: "#17A06A" },
  amarelo: { emoji: "🟡", nome: "falta decidir", cor: "#D6A400" },
  vermelho: { emoji: "🔴", nome: "não sabemos", cor: "#D64A2D" },
};

// ── auditorias ──────────────────────────────────────────────────────────────
const ids = new Set(PASSOS.map((p) => p.id));
const avisos = [];

for (const a of ARESTAS) {
  if (!ids.has(a.de)) avisos.push(`aresta parte de passo inexistente: ${a.de}`);
  if (!ids.has(a.para)) avisos.push(`aresta chega em passo inexistente: ${a.para}`);
}

const alcancados = new Set(ARESTAS.map((a) => a.para));
const primeiros = new Set(
  PROCESSOS.map((pr) => PASSOS.find((p) => p.processo === pr.id)?.id).filter(Boolean)
);
for (const p of PASSOS) {
  if (!alcancados.has(p.id) && !primeiros.has(p.id)) {
    avisos.push(`passo órfão (ninguém chega nele): ${p.id}`);
  }
  if (!LUZ[p.luz]) avisos.push(`luz inválida em ${p.id}: "${p.luz}"`);
  if ((p.luz === "amarelo" || p.luz === "vermelho") && !p.duvida) {
    avisos.push(`${p.id} está ${p.luz} e não diz QUAL é a dúvida`);
  }
  if (p.luz === "verde" && p.duvida) {
    avisos.push(`${p.id} está verde mas carrega uma dúvida — ou não é verde, ou a dúvida já morreu`);
  }
  if (!p.fala) avisos.push(`${p.id} não declara com quem a casa fala (use "—" se for só banco nosso)`);
}

// ── saída 1: o grafo do board ───────────────────────────────────────────────
const grafo = {
  gerado: new Date().toISOString().slice(0, 10),
  processos: PROCESSOS,
  nodes: PASSOS.map((p) => ({ ...p, cor: LUZ[p.luz]?.cor ?? "#999" })),
  edges: ARESTAS.map((a) => ({
    de: a.de,
    para: a.para,
    label: a.label ?? "",
    tracejado: !!a.tracejado,
  })),
};
writeFileSync(SAIDA_JSON, JSON.stringify(grafo, null, 2) + "\n", "utf8");

// ── saída 2: a nota pro dev ─────────────────────────────────────────────────
const contar = (luz, proc) =>
  PASSOS.filter((p) => p.luz === luz && (!proc || p.processo === proc)).length;

const L = [];
L.push("---");
L.push("tipo: derivado");
L.push("status: vivo");
L.push(`data: ${grafo.gerado}`);
L.push("assunto: processos-do-produto");
L.push("gerado_por: execucao/processos/gerar-processos.mjs");
L.push("tags: [execucao, processos, dev, spec]");
L.push("---");
L.push("");
L.push("# 🔗 Processos — o que precisa acontecer, ponta a ponta");
L.push("");
L.push("> ⚠️ **Nota gerada.** Não editar à mão: rode `node execucao/processos/gerar-processos.mjs`. A fonte é `processos-data.mjs`. Regras: [[_doutrina-processos]].");
L.push(">");
L.push("> **Pra quem é:** o dev que vai implementar e o Mauro, que decide as regras de negócio. O mesmo arquivo alimenta o board visual em `/processos`, que é onde o Pedro valida.");
L.push("");
L.push(`**Placar:** ${LUZ.verde.emoji} ${contar("verde")} sabemos e dá · ${LUZ.amarelo.emoji} ${contar("amarelo")} falta decidir · ${LUZ.vermelho.emoji} ${contar("vermelho")} não sabemos`);
L.push("");

for (const pr of PROCESSOS) {
  const meus = PASSOS.filter((p) => p.processo === pr.id);
  L.push("---");
  L.push("");
  L.push(`## ${pr.id} · ${pr.titulo}`);
  L.push("");
  L.push(`> ${pr.resumo}`);
  L.push(">");
  L.push(`> 🔑 **Por que importa:** ${pr.porqueImporta}`);
  L.push("");
  L.push(`${LUZ.verde.emoji} ${contar("verde", pr.id)} · ${LUZ.amarelo.emoji} ${contar("amarelo", pr.id)} · ${LUZ.vermelho.emoji} ${contar("vermelho", pr.id)}`);
  L.push("");
  L.push("| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |");
  L.push("|:--:|---|---|---|---|---|");
  for (const p of meus) {
    const marca = p.forma === "decisao" ? "◆ " : p.forma === "fim" ? "■ " : "";
    L.push(
      `| ${LUZ[p.luz].emoji} | **${p.id}** ${marca}${p.titulo} | ${p.quem} | ${p.faz} | ${p.fala} | ${p.ve} |`
    );
  }
  L.push("");
  L.push("### Por onde o processo caminha");
  L.push("");
  for (const a of ARESTAS.filter((x) => x.de.startsWith(pr.id + "."))) {
    const rot = a.label ? ` — *${a.label}*` : "";
    L.push(`- \`${a.de}\` → \`${a.para}\`${rot}`);
  }
  L.push("");
  const abertos = meus.filter((p) => p.duvida);
  if (abertos.length) {
    L.push("### 🔴 O que precisa ser respondido");
    L.push("");
    L.push("> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.");
    L.push("");
    for (const p of abertos) {
      L.push(`**${LUZ[p.luz].emoji} ${p.id} · ${p.titulo}**`);
      L.push("");
      L.push(p.duvida);
      L.push("");
    }
  }
  L.push("### Fonte de cada regra");
  L.push("");
  for (const p of meus.filter((x) => x.fonte && x.fonte !== "—")) {
    L.push(`- **${p.id}** — ${p.fonte}`);
  }
  L.push("");
}

writeFileSync(SAIDA_MD, L.join("\n"), "utf8");

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VIGIA DA DOUTRINA — 11/09, pedido do Pedro.
 * ═══════════════════════════════════════════════════════════════════════════
 * *"eu já te preparei com arquivos base pra salvar mudanças e não repetirmos
 * erros, quero saber se isso está se atualizando sozinho"* — e a resposta
 * honesta era **não**. A §6 da doutrina (a tabela de erros que eu já cometi)
 * é prosa: só enche se alguém lembrar de escrever. No mesmo dia em que ela
 * nasceu, dois erros meus ficaram de fora dela.
 *
 * Isto não conserta o problema de verdade — nenhum script escreve a lição no
 * lugar de quem errou. O que ele faz é tirar a lembrança do caminho crítico:
 * o gerador passa a CONTAR quantas mexidas em `/processos` aconteceram desde
 * a última vez que a doutrina mudou, e a falar alto quando a conta passa do
 * limite.
 *
 * 🔑 Por que AVISO e não erro: doutrina não é dado, e código que falha por
 * motivo subjetivo ensina a ignorar o exit code — aí as cinco auditorias de
 * cima, que pegam defeito de verdade, morrem junto. O barulho é de propósito;
 * a barreira seria contraproducente.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * A unidade é a LEVA (um commit, ou a árvore suja de agora), nunca o arquivo:
 * um commit que toca seis arquivos é uma leva, não seis. Somar arquivo com
 * commit faria o vigia gritar por refatoração grande e calar por três levas
 * pequenas — exatamente ao contrário do que interessa.
 * `PROCESSOS_LIMITE=1` força o aviso, pra conferir que ele ainda aparece.
 */
const LIMITE = Number(process.env.PROCESSOS_LIMITE ?? 3);
const DOUTRINA = "execucao/processos/_doutrina-processos.md";
const TERRITORIO = [
  "execucao/processos/processos-data.mjs",
  "app/src/app/processos",
  "app/src/components/processos",
  "app/src/lib/processos-medidas.ts",
  "app/src/app/api/e2e",
  "app/e2e",
];

function git(args) {
  return execFileSync("git", args, { cwd: RAIZ, encoding: "utf8" }).trim();
}

let vigia = null;
try {
  const ultimo = git(["log", "--format=%H", "-n", "1", "--", DOUTRINA]);
  // sem commit na doutrina ainda: nada pra comparar, e avisar seria ruído
  if (ultimo) {
    const desde = Number(git(["rev-list", "--count", `${ultimo}..HEAD`, "--", ...TERRITORIO]));
    // a leva ainda NÃO commitada conta como uma: é justamente a hora de
    // escrever a lição com o erro fresco, antes de ele virar história
    const emCurso = git(["status", "--porcelain", "--", ...TERRITORIO]) !== "" ? 1 : 0;
    // doutrina já sendo editada agora = a lição está sendo escrita. Calar.
    const doutrinaSuja = git(["status", "--porcelain", "--", DOUTRINA]) !== "";
    if (!doutrinaSuja && desde + emCurso >= LIMITE) {
      vigia = {
        levas: desde + emCurso,
        emCurso,
        desde: git(["log", "--format=%cd", "--date=short", "-n", "1", "--", DOUTRINA]),
      };
    }
  }
} catch {
  /* fora de repo git, ou git ausente: o gerador continua sendo o gerador */
}

// ── relatório ───────────────────────────────────────────────────────────────
console.log(`✓ grafo:  ${SAIDA_JSON.replace(RAIZ, ".")}  (${PASSOS.length} passos, ${ARESTAS.length} arestas)`);
console.log(`✓ nota:   ${SAIDA_MD.replace(RAIZ, ".")}`);
console.log(`  placar: ${LUZ.verde.emoji} ${contar("verde")} · ${LUZ.amarelo.emoji} ${contar("amarelo")} · ${LUZ.vermelho.emoji} ${contar("vermelho")}`);
if (avisos.length) {
  console.log(`\n⚠️  ${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`   · ${a}`);
  process.exitCode = 1;
} else {
  console.log("✓ auditorias limpas");
}

if (vigia) {
  console.log("");
  console.log("┌─────────────────────────────────────────────────────────────────────┐");
  console.log("│ 📓 A DOUTRINA NÃO MUDA, MAS O TERRITÓRIO SIM                        │");
  console.log("└─────────────────────────────────────────────────────────────────────┘");
  console.log(`   ${vigia.levas} leva(s) em /processos desde a última edição da doutrina`);
  console.log(
    `   (parada desde ${vigia.desde}${vigia.emCurso ? " · uma delas é a que está na árvore agora" : ""})`,
  );
  console.log("");
  console.log("   A §6 só enche se alguém escrever. A pergunta que ela responde:");
  console.log("   → nessa leva, o que quebrou por um motivo que vai voltar?");
  console.log("");
  console.log(`   Se nada quebrou, ignore. Se quebrou: ${DOUTRINA} §6`);
}
