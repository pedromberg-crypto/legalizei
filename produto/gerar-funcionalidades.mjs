/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR DAS 58 — o semáforo que não pode mentir.
 * ═══════════════════════════════════════════════════════════════════════════
 *   funcionalidades-data.mjs   (única coisa que se edita à mão)
 *        └── produto/FUNCIONALIDADES.md   → a nota, com o semáforo derivado
 *
 * 🔴 A LUZ NÃO É CAMPO. Ela cai de duas perguntas que o gerador responde
 * olhando o disco, não a minha memória:
 *
 *   tem tela?     a rota existe em `app/src/app`?
 *   tem processo? o id do passo existe em `processos/processos-data.mjs`?
 *
 *   🟢 os dois · 🟡 um · 🔴 nenhum
 *
 * É a diferença entre este arquivo e os dois inventários que apodreceram: a
 * coluna "Cobertura" do `_catalogo.md` e o campo `cobre` do `portal-data.mjs`
 * eram DIGITADOS. Digitar status é prometer manutenção que ninguém faz.
 *
 * AUDITORIAS (falha barulhenta, nunca silenciosa):
 *   1. `tela` apontando pra rota que não existe no app
 *   2. `processo` apontando pra passo que não existe
 *   3. seção fora da lista de SECOES
 *   4. id repetido
 *   5. numeração com furo dentro de uma seção (1.1, 1.2, 1.4 → some o 1.3)
 *
 * E duas contagens informativas, que são o produto de verdade: quantos itens
 * cada processo realiza, e quais passos não realizam funcionalidade nenhuma.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FUNCIONALIDADES, SECOES } from "./funcionalidades-data.mjs";
import { PASSOS } from "./me/viver/processos/processos-data.mjs";
import { verificarEscopo } from "./me/viver/processos/verificar-escopo.mjs";
import { verificarPersona } from "./me/viver/processos/verificar-persona.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const HOJE = new Date().toISOString().slice(0, 10);

const passoPorId = new Map(PASSOS.map((p) => [p.id, p]));
const idsSecao = new Set(SECOES.map((s) => s.id));

/**
 * A rota vira caminho de arquivo. O app usa route groups — (app), (portal),
 * (wizard), (mei) — que somem da URL, então procurar `app/src/app<rota>` daria
 * falso negativo em tudo que mora num grupo. Testa as combinações.
 */
const GRUPOS = ["", "(app)/", "(app)/(portal)/", "(app)/(wizard)/", "(app)/(mei)/"];
function telaExiste(tela) {
  if (!tela) return false;
  if (tela.endsWith(".tsx")) return existsSync(resolve(RAIZ, tela));
  const limpa = tela.replace(/^\//, "");
  return GRUPOS.some((g) => existsSync(resolve(RAIZ, `app/src/app/${g}${limpa}/page.tsx`)));
}

// 🔒 escopo primeiro: ME do Simples, Anexos III e V (ver `_escopo.mjs`)
if (!verificarEscopo()) process.exit(1);
if (!verificarPersona()) process.exit(1);

// ── auditorias ────────────────────────────────────────────────────────────
const erros = [];
const vistos = new Set();
for (const f of FUNCIONALIDADES) {
  const onde = `${f.id} (${f.nome.slice(0, 40)})`;
  if (vistos.has(f.id)) erros.push(`${onde}: id repetido.`);
  vistos.add(f.id);
  if (!idsSecao.has(f.secao)) erros.push(`${onde}: seção "${f.secao}" não existe.`);
  if (f.tela && !telaExiste(f.tela)) {
    erros.push(`${onde}: tela "${f.tela}" não existe no app.`);
  }
  for (const p of f.processo ?? []) {
    if (!passoPorId.has(p)) erros.push(`${onde}: processo "${p}" não existe no processos-data.`);
  }
}
// numeração sem furo: dentro de cada seção os itens vão de 1 a N, em ordem
for (const s of SECOES) {
  const nums = FUNCIONALIDADES.filter((f) => f.secao === s.id).map((f) => Number(f.id.split(".")[1]));
  nums.forEach((n, i) => {
    if (n !== i + 1) erros.push(`seção ${s.nome}: numeração fura no ${n}º item (esperado ${i + 1}).`);
  });
}
if (erros.length) {
  console.error("\n🔴 NÃO GERADO — corrija e rode de novo:\n");
  for (const e of erros) console.error(`  · ${e}`);
  process.exit(1);
}

// ── a luz, derivada ───────────────────────────────────────────────────────
const luzDe = (f) => {
  const t = telaExiste(f.tela);
  const p = (f.processo ?? []).length > 0;
  return t && p ? "verde" : t || p ? "amarelo" : "vermelho";
};
const EMOJI = { verde: "🟢", amarelo: "🟡", vermelho: "🔴" };
const enriquecidas = FUNCIONALIDADES.map((f) => ({ ...f, luz: luzDe(f), temTela: telaExiste(f.tela) }));

// ── saída ─────────────────────────────────────────────────────────────────
const conta = (lista, luz) => lista.filter((f) => f.luz === luz).length;
const placar = (lista) =>
  `🟢 ${conta(lista, "verde")} · 🟡 ${conta(lista, "amarelo")} · 🔴 ${conta(lista, "vermelho")}`;

let md = `---
tipo: derivado
status: vivo
data: ${HOJE}
assunto: funcionalidades-core-me-simples
gerado_por: produto/gerar-funcionalidades.mjs
tags: [produto, funcionalidades, semaforo, mvp]
---

# 📱 As ${FUNCIONALIDADES.length} funcionalidades core do ME no Simples

> ⚠️ **Nota gerada.** Não editar à mão: rode \`node produto/gerar-funcionalidades.mjs\`. A fonte é \`funcionalidades-data.mjs\`.
>
> **A lista é a que foi ao Mauro em 11/09** (\`funcionalidades-legalizai.pdf\`), ratificada pelo Pedro em 12/09 como a lista core oficial: a **folha de pagamento entra no MVP**, e saem "acesso do 2º sócio" e "pagar o DAS dentro do app".
>
> 🔴 **O semáforo é DERIVADO, não digitado.** 🟢 tem tela e tem processo · 🟡 tem só um dos dois · 🔴 não tem nenhum. As duas perguntas são checadas contra arquivo real a cada rodada: a rota existe em \`app/src/app\`, o passo existe em \`processos-data.mjs\`. Referência quebrada derruba o gerador.
>
> ⚠️ **Numeração:** é a do PDF, e ela difere do \`_catalogo.md\` em §1 e §2 por causa dos dois cortes. Ao citar, escreva o nome junto do número.
>
> ⚠️ **Onde este semáforo NÃO chega.** "Tem tela" quer dizer que **a rota existe**, não que ela entrega a funcionalidade inteira; "tem processo" quer dizer que existe passo desenhado, não que ele está resolvido (a luz do passo é outra, e mora no \`/processos\`). Um 🟢 aqui significa *"sabemos onde acontece e o que acontece"*, nunca *"está pronto"*. Qualidade de tela segue sendo olho humano no print, igual à trava de anatomia do MEI e ao selo de insumo.

## Placar

**${placar(enriquecidas)}**

| | Significa | Quantos |
|:--:|---|:--:|
| 🟢 | tem tela **e** tem processo | ${conta(enriquecidas, "verde")} |
| 🟡 | tem tela sem processo, ou processo sem tela | ${conta(enriquecidas, "amarelo")} |
| 🔴 | só o nome | ${conta(enriquecidas, "vermelho")} |

**${enriquecidas.filter((f) => f.temTela).length} têm tela** · **${enriquecidas.filter((f) => (f.processo ?? []).length).length} têm processo desenhado**

`;

for (const s of SECOES) {
  const itens = enriquecidas.filter((f) => f.secao === s.id);
  if (!itens.length) continue;
  md += `## ${s.emoji} ${s.nome}\n\n${placar(itens)}\n\n`;
  md += `| | # | Funcionalidade | Tela | Processo |\n|:--:|:--:|---|---|---|\n`;
  for (const f of itens) {
    const proc = (f.processo ?? []).map((p) => `**${p}** ${passoPorId.get(p).titulo}`).join(" · ") || "—";
    md += `| ${EMOJI[f.luz]} | ${f.id} | ${f.nome} | ${f.tela ? `\`${f.tela}\`` : "—"} | ${proc} |\n`;
  }
  md += `\n`;
  const comNota = itens.filter((f) => f.nota);
  for (const f of comNota) md += `**${f.id} · ${f.nome}**\n\n${f.nota}\n\n`;
}

// ── quanto de cada processo virou funcionalidade ──────────────────────────
md += `## O que cada processo realiza\n\n`;
md += `> A seta do outro lado: dos 62 passos desenhados, quais viram funcionalidade na lista. Passo que não aparece aqui é mecânica interna, não promessa ao cliente — não é defeito por si só.\n\n`;
const porProcesso = new Map();
for (const f of enriquecidas) {
  for (const p of f.processo ?? []) {
    const proc = (passoPorId.get(p).processos ?? [])[0] ?? "?";
    if (!porProcesso.has(proc)) porProcesso.set(proc, new Set());
    porProcesso.get(proc).add(f.id);
  }
}
md += `| Processo | Funcionalidades que ele realiza |\n|---|---|\n`;
for (const [proc, set] of [...porProcesso].sort()) {
  md += `| **${proc}** | ${[...set].sort().join(" · ")} (${set.size}) |\n`;
}

const usados = new Set(enriquecidas.flatMap((f) => f.processo ?? []));
const soltos = PASSOS.filter((p) => p.id.includes(".") && !usados.has(p.id));
md += `\n**${usados.size} dos ${PASSOS.filter((p) => p.id.includes(".")).length} passos** realizam alguma funcionalidade da lista. Os outros ${soltos.length} são mecânica interna (decisões, esperas, gates, passos que só a casa vê).\n`;

md += `\n## Nota de fonte\n\nGerado de \`funcionalidades-data.mjs\`. As rotas são validadas contra \`app/src/app\` (respeitando os route groups) e os ids de passo contra \`produto/me/viver/processos/processos-data.mjs\`. A luz de cada linha é calculada, nunca escrita — é o que separa esta nota do \`_catalogo.md\` e do campo \`cobre\` do \`portal-data.mjs\`, que envelheceram porque o status era digitado.\n`;

writeFileSync(resolve(AQUI, "FUNCIONALIDADES.md"), md, "utf8");
console.log(`✅ FUNCIONALIDADES.md · ${FUNCIONALIDADES.length} itens · ${placar(enriquecidas)}`);
console.log(`   ${enriquecidas.filter((f) => f.temTela).length} com tela · ${enriquecidas.filter((f) => (f.processo ?? []).length).length} com processo`);
