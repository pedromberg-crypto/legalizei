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

import { writeFileSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verificarEscopo } from "../verificar-escopo.mjs";
import { verificarPersona } from "../verificar-persona.mjs";
import { gerarPersona } from "../gerar-persona.mjs";
import { ESCOPO } from "../_escopo.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..", "..");
const HOJE = new Date().toISOString().slice(0, 10);

const MATRIZ_INICIO =
  "<!-- MATRIZ:INICIO — gerado por cru/gerar-cru.mjs, não editar à mão -->";
const MATRIZ_FIM = "<!-- MATRIZ:FIM -->";

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
if (!verificarPersona()) process.exit(1);
gerarPersona();

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

await gerarMatrizDeProntidao();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📐 A MATRIZ DE PRONTIDÃO — escrita dentro do doc de cobertura, não ao lado
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 16/09, com uma restrição que define o desenho:
 *
 *   *"o que quero que a gente fique sempre atento: **nunca criar novos
 *   documentos de forma desnecessária**."*
 *
 * Por isso ela **não é um arquivo**. É um bloco gerado dentro do
 * `_cobertura-das-vidas.md`, que já é a nota que responde *"do que a gente
 * está cego?"*. Ela só muda o eixo da pergunta: aquela nota mede o **motor**
 * contra as vidas; este bloco mede o **desenho de processo** contra as 58
 * funcionalidades do painel.
 *
 * 🔑 E ela é GERADA porque a resposta certa não é escrever a tabela: é fazer
 * com que ela recalcule. Toda tabela de cobertura que alguém digitou neste
 * vault envelheceu — foi o achado de 17/09, em 7 documentos de 7.
 * ═══════════════════════════════════════════════════════════════════════════
 */
async function gerarMatrizDeProntidao() {
  const { FUNCIONALIDADES, SECOES } = await import(
    `file:///${resolve(RAIZ, "produto/funcionalidades-data.mjs").replace(/\\/g, "/")}`
  );

  // Quem cobre o quê: o índice invertido do campo `cobre` dos nós.
  const cobertura = new Map();
  for (const [cat, nos] of Object.entries(paraBoard.nos)) {
    for (const n of nos) {
      for (const item of n.cobre ?? []) {
        if (!cobertura.has(item)) cobertura.set(item, []);
        cobertura.get(item).push(`${cat}:${n.id}`);
      }
    }
  }

  const varridas = new Set(paraBoard.categorias.map((c) => c.id));
  const cobertos = FUNCIONALIDADES.filter((f) => cobertura.has(f.id));

  let linhas = "";
  for (const s of SECOES) {
    const itens = FUNCIONALIDADES.filter((f) => f.secao === s.id);
    const comNo = itens.filter((f) => cobertura.has(f.id));
    const foiVarrida = varridas.has(s.id);
    const estado = !foiVarrida
      ? "⬜ **não varrida**"
      : comNo.length === itens.length
        ? "🟢 varrida inteira"
        : `🟡 varrida pela metade — faltam ${itens.filter((f) => !cobertura.has(f.id)).map((f) => f.id).join(", ")}`;
    const nos = comNo.reduce((s2, f) => s2 + cobertura.get(f.id).length, 0);
    linhas += `| ${s.emoji} **${s.nome}** | ${comNo.length}/${itens.length} | ${nos || "—"} | ${estado} |\n`;
  }

  const bloco = `${MATRIZ_INICIO}

## 📐 Matriz de prontidão — o desenho de processo contra as ${FUNCIONALIDADES.length} funcionalidades

> 🧭 **Outra pergunta, mesmo assunto.** O resto desta nota pergunta *"existe código no motor que nenhuma vida faz rodar?"*. Esta tabela pergunta *"existe funcionalidade do painel que nenhum processo desenhado sustenta?"*. As duas medem cegueira; uma pelo cálculo, a outra pelo desenho.

**${cobertos.length} das ${FUNCIONALIDADES.length} funcionalidades têm pelo menos um nó de processo.**

| Categoria | Com nó | Nós apontando | Estado |
|---|:--:|:--:|---|
${linhas}
🔑 **A cobertura é CATEGÓRICA, não parcial — e isso é a boa notícia.** Dentro das categorias varridas ela é **integral**: nenhum item ficou para trás. O que falta são **${SECOES.length - varridas.size} categorias inteiras** que o modo cru nunca varreu, e que estão declaradas como não varridas desde 12/09, quando o método cronológico assumiu.

⚠️ **Então o número que interessa não é "${cobertos.length} de ${FUNCIONALIDADES.length}", é "${varridas.size} de ${SECOES.length} categorias".** Ler como 41% de prontidão sugere buraco espalhado; o buraco é de fronteira, e retomar as categorias que faltam é **decisão aberta do Pedro**, não dívida esquecida.

🔒 **E a Folha é a maior delas de propósito:** colaborador está **travado fora** por decisão dele em 15/09, e as 10 funcionalidades da categoria dependem dessa destrava.

${MATRIZ_FIM}`;

  const doc = resolve(RAIZ, "execucao/estado-cnpj/_cobertura-das-vidas.md");
  const texto = readFileSync(doc, "utf8");
  const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let novo;
  if (texto.includes(MATRIZ_INICIO)) {
    novo = texto.replace(
      new RegExp(`${escapar(MATRIZ_INICIO)}[\\s\\S]*?${escapar(MATRIZ_FIM)}`),
      bloco
    );
  } else {
    // Âncora: antes da seção de links, que é sempre a última.
    const links = texto.search(/^## Links$/m);
    novo =
      links < 0
        ? `${texto.trimEnd()}\n\n${bloco}\n`
        : `${texto.slice(0, links)}${bloco}\n\n${texto.slice(links)}`;
  }

  writeFileSync(doc, novo, "utf8");
  console.log(
    `✓ matriz: _cobertura-das-vidas.md  (${cobertos.length}/${FUNCIONALIDADES.length} funcionalidades · ${varridas.size}/${SECOES.length} categorias)`
  );
}

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
