/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR DO HANDOFF — uma fonte, uma saída, e as travas no meio.
 * ═══════════════════════════════════════════════════════════════════════════
 *   dados-handoff.mjs  (única coisa que se edita à mão)
 *        └── execucao/handoff/HANDOFF-DADOS.md   → nota literal, pro time deles
 *
 * O valor não está em imprimir a tabela: está nas duas validações CRUZADAS,
 * que são o motivo de este arquivo existir em vez de uma nota escrita à mão.
 *
 *   · toda `origem.ref` de tipo tela tem que existir no `flow-data.mjs`
 *   · todo id em `consome` tem que existir no `processos-data.mjs`
 *
 * É isso que impede o handoff de envelhecer calado. Renomeou uma tela, apagou
 * um passo, mudou o id: o gerador para e diz onde. Sem isso, este arquivo
 * viraria o `portal-data.mjs`, que ficou parado de 03/08 a 11/09 apontando
 * pra telas que já não eram aquelas.
 *
 * AUDITORIAS (falha barulhenta, nunca silenciosa):
 *   1. `origem.ref` de tela que não existe no flow
 *   2. `consome` apontando pra passo que não existe
 *   3. linha sem `porque`
 *   4. status 🔴/🟡 SEM `pergunta` — a trava principal: buraco sem pergunta
 *      escrita não vale nada (irmã da §3 da doutrina de processos)
 *   5. status 🟢 COM `pergunta` — ou não está resolvido, ou a pergunta morreu
 *   6. linha que não aponta pra nada (nem `consome` nem `tambem`)
 *
 * E uma seção informativa, que não derruba: os passos que NÃO dependem de
 * nenhum dado da constituição. Não é defeito — a maioria dos passos nasce do
 * uso, não da abertura. Serve pra enxergar o tamanho real da dependência.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DADOS, FRONTEIRA } from "./dados-handoff.mjs";
import { NODES } from "../flow/flow-data.mjs";
import { PASSOS } from "../processos/processos-data.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HOJE = new Date().toISOString().slice(0, 10);

const idsTela = new Set(NODES.map((n) => n.id));
const passoPorId = new Map(PASSOS.map((p) => [p.id, p]));

const LUZ = {
  captado: "🟢",
  "nasce-depois": "🟡",
  "nao-sei": "🟡",
  "nao-captado": "🔴",
};
const ROTULO = {
  captado: "chega",
  "nasce-depois": "nasce depois",
  "nao-sei": "ninguém combinou",
  "nao-captado": "ninguém produz",
};
const QUEM = {
  dev: "time do dev",
  assistido: "trecho assistido (nosso)",
  parceira: "certificadora parceira",
  orgao: "órgão",
  motor: "motor fiscal (regra implementada e conferida)",
  ninguem: "🔴 ninguém",
};

// ── auditorias ────────────────────────────────────────────────────────────
const erros = [];
for (const d of DADOS) {
  const onde = `${d.id} (${d.dado})`;
  if (d.origem?.tipo === "tela" && !idsTela.has(d.origem.ref)) {
    erros.push(`${onde}: origem aponta pra tela "${d.origem.ref}", que não existe no flow-data.`);
  }
  for (const p of d.consome ?? []) {
    if (!passoPorId.has(p)) {
      erros.push(`${onde}: consome "${p}", que não existe no processos-data.`);
    }
  }
  if (!d.porque?.trim()) erros.push(`${onde}: sem campo "porque".`);
  if (!LUZ[d.status]) erros.push(`${onde}: status "${d.status}" não existe.`);
  const precisaPergunta = d.status === "nao-sei" || d.status === "nao-captado";
  if (precisaPergunta && !d.pergunta?.texto?.trim()) {
    erros.push(`${onde}: status ${d.status} exige "pergunta" (pra quem, e qual).`);
  }
  if (!precisaPergunta && d.pergunta) {
    erros.push(`${onde}: status ${d.status} não deveria ter pergunta aberta.`);
  }
  if (!(d.consome ?? []).length && !d.tambem?.trim()) {
    erros.push(`${onde}: não aponta pra passo nenhum nem pra item do catálogo.`);
  }
}
if (erros.length) {
  console.error("\n🔴 HANDOFF NÃO GERADO — corrija e rode de novo:\n");
  for (const e of erros) console.error(`  · ${e}`);
  process.exit(1);
}

// ── cobertura reversa: quais passos dependem da constituição ──────────────
const passosDependentes = new Set(DADOS.flatMap((d) => d.consome ?? []));
const passosSoltos = PASSOS.filter(
  (p) => p.forma !== undefined && !passosDependentes.has(p.id) && p.id.includes(".")
);

// ── saída ─────────────────────────────────────────────────────────────────
const grupo = (titulo, filtro, abre) => {
  const linhas = DADOS.filter(filtro);
  if (!linhas.length) return "";
  let txt = `\n## ${titulo}\n\n${abre}\n\n`;
  txt += `| | Dado | Quem entrega | Onde nasce | O que trava sem ele |\n|:--:|---|---|---|---|\n`;
  for (const d of linhas) {
    const alvos = [
      ...(d.consome ?? []).map((p) => `**${p}** ${passoPorId.get(p).titulo}`),
      ...(d.tambem ? [d.tambem] : []),
    ].join(" · ");
    const onde =
      d.origem.tipo === "tela"
        ? `tela \`${d.origem.ref}\``
        : d.origem.ref;
    txt += `| ${LUZ[d.status]} | **${d.dado}** | ${QUEM[d.entregaPor]} | ${onde} | ${alvos} |\n`;
  }
  txt += `\n`;
  for (const d of linhas) {
    txt += `**${LUZ[d.status]} ${d.dado}** · ${ROTULO[d.status]}\n\n${d.porque}\n\n`;
  }
  return txt;
};

const perguntas = DADOS.filter((d) => d.pergunta);
const porDestinatario = [...new Set(perguntas.map((p) => p.pergunta.para))];

let md = `---
tipo: derivado
status: vivo
data: ${HOJE}
assunto: handoff-dados-constituicao
gerado_por: execucao/handoff/gerar-handoff.mjs
tags: [execucao, handoff, dados, abertura, processos]
---

# 🤝 Handoff de dados — da constituição pro app interno

> ⚠️ **Nota gerada.** Não editar à mão: rode \`node execucao/handoff/gerar-handoff.mjs\`. A fonte é \`dados-handoff.mjs\`.
>
> **Pra que serve:** o time de programadores já construiu a constituição, do download do app até o pagamento da guia. Esta nota NÃO redesenha aquilo. Ela responde uma pergunta só: **quais dados de lá movimentam as funcionalidades internas daqui**, e o que falta chegar.
>
> **Os dois inventários que ela cruza continuam donos dos fatos deles:** [[dados-coletados-abertura-ate-viabilidade]] diz o que cada tela coleta, [[PROCESSOS]] diz o que cada passo faz. Aqui mora só a seta entre os dois.

## A fronteira

`;

const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);
for (const f of FRONTEIRA) {
  md += `**${f.trecho}** · ${f.dono}\n\n${maiuscula(f.vai)}. ${maiuscula(f.situacao)}.\n\n`;
}

md += `✅ **Quem assina o quê** (ratificado pelo Pedro em 12/09, sobre a régua do Ademar de 05/09): na **1ª assinatura, todos os sócios assinam**, administradores ou não, *"se cadastrou dez, dez assinam"*. Na **2ª**, só o contador e o sócio representante.

## Placar

`;

const conta = (s) => DADOS.filter((d) => d.status === s).length;
md += `**${DADOS.length} dados mapeados:** 🟢 ${conta("captado")} chegam · 🟡 ${conta("nasce-depois")} nascem depois · 🟡 ${conta("nao-sei")} ninguém combinou · 🔴 ${conta("nao-captado")} ninguém produz\n\n`;
md += `**${passosDependentes.size} dos ${PASSOS.filter((p) => p.id.includes(".")).length} passos** do P1 ao P5 dependem de algum dado da constituição.\n`;

md += grupo(
  "1. Chegam da constituição, e movem o app interno",
  (d) => d.status === "captado",
  "Estes já existem e já são coletados no trecho deles. A lista serve pra provar que **não precisamos redesenhar nada disso**: é só combinar como atravessa."
);

md += grupo(
  "2. Existem, mas nascem depois do trecho deles",
  (d) => d.status === "nasce-depois",
  "Vêm do trecho assistido, da certificadora parceira ou de um órgão. Nenhum é trabalho de desenho nosso; todos precisam de um combinado de entrega."
);

md += grupo(
  "3. 🔴 O interno precisa e ninguém produz",
  (d) => d.status === "nao-sei" || d.status === "nao-captado",
  "🔑 **Esta seção é o produto da nota.** O resto é confirmação; aqui está o trabalho. Cada linha tem uma pergunta escrita, e nenhuma se resolve por dedução."
);

md += `\n## 4. As perguntas, por quem responde\n\n`;
md += `> Nenhuma destas se resolve deduzindo. A regra de 05/09 vale igual aqui: regra de órgão, de contrato ou de integração **não se deduz, se pergunta**.\n\n`;
for (const para of porDestinatario) {
  md += `### Pra ${para}\n\n`;
  for (const d of perguntas.filter((p) => p.pergunta.para === para)) {
    md += `- **${d.dado}** — ${d.pergunta.texto}\n`;
  }
  md += `\n`;
}

md += `## 5. Passos que NÃO dependem da constituição\n\n`;
md += `> Informativo, não é defeito: a maioria dos passos nasce do uso do app, não da abertura. Serve pra ver o tamanho real da dependência.\n\n`;
md += `${passosSoltos.length} passos: ${passosSoltos.map((p) => p.id).join(" · ")}\n\n`;

md += `## Nota de fonte\n\nGerado de \`dados-handoff.mjs\`, com as referências validadas contra \`flow/flow-data.mjs\` (ids de tela) e \`processos/processos-data.mjs\` (ids de passo). Referência quebrada derruba o gerador em vez de envelhecer calada. A fronteira dos três trechos foi dita pelo Pedro em 12/09.\n`;

writeFileSync(resolve(AQUI, "HANDOFF-DADOS.md"), md, "utf8");
console.log(`✅ HANDOFF-DADOS.md · ${DADOS.length} dados · ${perguntas.length} perguntas abertas · ${passosDependentes.size} passos dependentes`);
