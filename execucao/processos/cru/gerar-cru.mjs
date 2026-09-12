/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR DO MODO CRU — só as travas que são de DENTRO.
 * ═══════════════════════════════════════════════════════════════════════════
 *   cru/<categoria>.mjs   (única coisa que se edita à mão)
 *        └── cru/<CATEGORIA>.md   → o mapa da categoria
 *
 * 🔴 O QUE ESTE GERADOR NÃO FAZ, e é de propósito: não pergunta com quem a
 * casa fala, não pergunta o que a pessoa vê, não calcula semáforo, não cruza
 * com tela nem com o handoff de dados. Tudo isso é a fase seguinte.
 *
 * AUDITORIAS (falha barulhenta):
 *   1. saída apontando pra nó que não existe
 *   2. nó sem saída e sem `fim: true` — silêncio ambíguo é o pior defeito do
 *      mapa: não dá pra saber se o caminho acaba ali ou se alguém esqueceu
 *   3. nó com `variavel` e menos de 2 saídas — não é decisão, é passo
 *   4. nó com 2+ saídas e alguma sem condição escrita — bifurca pela metade
 *      (mesma trava da doutrina §, e aqui ela é a principal)
 *   5. nó órfão: ninguém chega nele e ele não é entrada declarada
 *   6. id repetido
 *
 * E o aviso que mede a varredura: qual item da categoria nenhum nó `cobre`.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verificarEscopo } from "../verificar-escopo.mjs";
import { ESCOPO } from "../_escopo.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..", "..");
const HOJE = new Date().toISOString().slice(0, 10);

/**
 * Roda TODAS as categorias que existirem na pasta, sempre. Passar o nome de
 * uma no argumento só filtra a mensagem no terminal — o JSON do board é
 * sempre o conjunto, senão escolher uma categoria apagaria as outras da vista.
 */
const arquivos = readdirSync(AQUI)
  .filter((f) => f.endsWith(".mjs") && !f.startsWith("_") && !f.startsWith("gerar-"))
  .map((f) => f.replace(/\.mjs$/, ""));

/* 🔒 a trava de escopo roda ANTES de qualquer coisa: gerar um mapa fora do
   escopo e só avisar depois seria produzir o erro e carimbá-lo. */
if (!verificarEscopo()) process.exit(1);

/* o escopo viaja junto pro board: quem olha o mapa tem que ver de que
   enquadramento ele é, sem abrir arquivo nenhum */
const paraBoard = { gerado: HOJE, escopo: ESCOPO, categorias: [], nos: {} };
for (const nome of arquivos) await umaCategoria(nome);
writeFileSync(
  resolve(RAIZ, "app/src/lib/cru-graph.json"),
  JSON.stringify(paraBoard, null, 2) + "\n",
  "utf8",
);
console.log(`✓ board:  ./app/src/lib/cru-graph.json  (${paraBoard.categorias.length} categoria(s))`);

async function umaCategoria(categoria) {
const { CATEGORIA, NOS } = await import(`./${categoria}.mjs`);

const porId = new Map(NOS.map((n) => [n.id, n]));
const erros = [];
const chegam = new Set();

for (const n of NOS) {
  const saidas = n.saidas ?? [];
  for (const s of saidas) {
    if (!porId.has(s.vai)) erros.push(`${n.id}: saída aponta pra "${s.vai}", que não existe.`);
    else chegam.add(s.vai);
  }
  if (!saidas.length && !n.fim) erros.push(`${n.id}: não tem saída e não está marcado como fim.`);
  if (n.variavel && saidas.length < 2) erros.push(`${n.id}: tem variável e só ${saidas.length} saída — isso é passo, não decisão.`);
  if (saidas.length > 1) {
    const semCondicao = saidas.filter((s) => !s.se?.trim()).length;
    if (semCondicao) erros.push(`${n.id}: bifurca pela metade — ${semCondicao} de ${saidas.length} saídas sem condição escrita.`);
  }
  if (saidas.length > 1 && !n.variavel) erros.push(`${n.id}: bifurca sem variável escrita — qual é a pergunta?`);
}
/* 🔴 12/09: o N38 perdeu a entrada numa edição e virou "entrada" em silêncio,
   inflando a contagem. Entrada é DECLARADA (`entrada: true`); nó que ninguém
   alcança e não se declarou é órfão, e órfão é defeito. */
for (const n of NOS) {
  if (!chegam.has(n.id) && !n.entrada) erros.push(`${n.id}: ninguém chega nele e ele não se declarou entrada — órfão.`);
  if (chegam.has(n.id) && n.entrada) erros.push(`${n.id}: declarado entrada, mas alguém chega nele.`);
}

const ids = NOS.map((n) => n.id);
for (const id of ids) if (ids.indexOf(id) !== ids.lastIndexOf(id)) erros.push(`id repetido: ${id}`);

if (erros.length) {
  console.error(`\n🔴 ${CATEGORIA.nome.toUpperCase()} NÃO GERADA:\n`);
  for (const e of [...new Set(erros)]) console.error(`  · ${e}`);
  process.exit(1);
}

/** entradas = nós que ninguém alcança. No modo cru isso é informação, não erro:
 *  uma categoria nasce de vários fatos diferentes, e descobrir quantos é
 *  metade do valor da varredura. */
const entradas = NOS.filter((n) => n.entrada);
const cobertos = new Set(NOS.flatMap((n) => n.cobre ?? []));
const semCobertura = CATEGORIA.itens.filter((i) => !cobertos.has(i));
const decisoes = NOS.filter((n) => n.variavel);
const fins = NOS.filter((n) => n.fim);
const fronteiras = NOS.filter((n) => n.saiPara);
const jaFeitos = NOS.filter((n) => n.ja);
const estado = semCobertura.length ? "aberto" : "fechado";

let md = `---
tipo: derivado
status: vivo
data: ${HOJE}
assunto: cru-${CATEGORIA.id}
gerado_por: execucao/processos/cru/gerar-cru.mjs
tags: [execucao, processos, cru, ${CATEGORIA.id}]
---

# ${CATEGORIA.emoji} ${CATEGORIA.nome} — varredura crua

> ⚠️ **Nota gerada.** Não editar à mão: \`node execucao/processos/cru/gerar-cru.mjs ${CATEGORIA.id}\`. A fonte é \`cru/${CATEGORIA.id}.mjs\`. Regras do modo: [[_como-funciona]].
>
> 🥩 **Modo cru:** aqui só mora **o que precisa acontecer** e **o que decide o caminho**. Sem quem executa, sem tela, sem API, sem semáforo — tudo isso é a fase seguinte, e adiar é o ponto.

## Estado da varredura

**${estado === "fechado" ? "🟩 FECHADA" : "🟨 ABERTA"}** · ${NOS.length} nós · ${decisoes.length} variáveis · ${entradas.length} entradas · ${fins.length} fins · ${fronteiras.length} fronteiras

${semCobertura.length ? `🔴 **A varredura não encostou em:** ${semCobertura.join(" · ")}` : `✅ **Todos os ${CATEGORIA.itens.length} itens da categoria foram tocados.**`}

${jaFeitos.length ? `🔁 **${jaFeitos.length} nós já existem no formato completo** (P1–P6): ${jaFeitos.map((n) => `${n.id}→${n.ja}`).join(" · ")}. Não é duplicata: é o mapa dizendo onde já há desenho pronto. No fim da varredura a gente decide se absorve.` : ""}

## Por onde essa categoria começa

> ${entradas.length} fatos diferentes disparam alguma coisa aqui dentro.

${entradas.map((n) => `- **${n.id}** · ${n.o}`).join("\n")}

## O mapa

| | O que acontece | A variável | As saídas |
|:--:|---|---|---|
`;

for (const n of NOS) {
  const marca = n.fim ? "■" : n.variavel ? "◆" : "·";
  const saidas = (n.saidas ?? []).length
    ? (n.saidas ?? []).map((s) => (s.se ? `**${s.se}** → ${s.vai}` : `→ ${s.vai}`)).join("<br/>")
    : "_termina aqui_";
  md += `| ${marca} | **${n.id}** · ${n.o} | ${n.variavel ?? "—"} | ${saidas} |\n`;
}

md += `\n## As variáveis, uma a uma\n\n> É o que o modo cru existe pra responder: **toda condicional tem todas as respostas escritas?**\n\n`;
for (const n of decisoes) {
  md += `**${n.id} · ${n.variavel}**\n\n`;
  for (const s of n.saidas) md += `- ${s.se} → **${s.vai}** · ${porId.get(s.vai).o}\n`;
  md += `\n`;
}

md += `## Onde essa categoria toca as outras\n\n> 🔴 Fronteira é **nota, não ligação**. Ligar agora seria adivinhar; as conexões são a fase final.\n\n`;
for (const n of fronteiras) md += `- **${n.id}** · ${n.o}\n  ↗ ${n.saiPara}\n`;

const comAlerta = NOS.filter((n) => n.alerta);
if (comAlerta.length) {
  md += `## ⏳ Ramos com prazo

> Caminhos que existem hoje e têm data ou condição externa pra deixar de existir. Não é dúvida nossa: é relógio de fora.

`;
  for (const n of comAlerta) md += `**${n.id} · ${n.o}**

${n.alerta}

`;
}

const comNota = NOS.filter((n) => n.nota);
md += `\n## O que a varredura achou\n\n`;
for (const n of comNota) md += `**${n.id} · ${n.o}**\n\n${n.nota}\n\n`;

md += `## Nota de fonte\n\nGerado de \`cru/${CATEGORIA.id}.mjs\`. O gerador só verifica o que é de dentro: saída apontando pra nó que existe, nó que termina declarando que termina, variável com pelo menos duas respostas, toda saída com condição escrita, e nenhum item da categoria esquecido. **Não** pergunta API, tela nem prazo — isso é a fase seguinte.\n`;

writeFileSync(resolve(AQUI, `${CATEGORIA.id.toUpperCase()}.md`), md, "utf8");
console.log(`✅ ${CATEGORIA.id.toUpperCase()}.md · ${estado} · ${NOS.length} nós · ${decisoes.length} variáveis · ${entradas.length} entradas`);
if (semCobertura.length) console.log(`   🔴 sem cobertura: ${semCobertura.join(" · ")}`);

/**
 * O board consome o MESMO dado, sem recalcular nada: o que é derivado (estado
 * da varredura, entradas, contagens) vai calculado daqui. Tela que recalcula
 * regra é a origem clássica de duas verdades.
 */
paraBoard.categorias.push({
  id: CATEGORIA.id,
  nome: CATEGORIA.nome,
  emoji: CATEGORIA.emoji,
  estado,
  itens: CATEGORIA.itens,
  semCobertura,
  entradas: entradas.map((n) => n.id),
  contagem: { nos: NOS.length, variaveis: decisoes.length, fins: fins.length, fronteiras: fronteiras.length },
});
paraBoard.nos[CATEGORIA.id] = NOS;
}
