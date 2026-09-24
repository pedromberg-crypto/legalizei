/* Deriva `motivo_nao_atende` para os 1.332 CNAEs.

   🔴 Por que existe: hoje o Léo responde "não atendemos" e **não sabe por quê**.
   Quando não sabe, ele improvisa — é o mesmo mecanismo que fez ele mandar
   cliente de folha de pagamento procurar outro contador, porque a tabela de
   escopo não tinha a linha da folha e ele concluiu por analogia.

   🔑 O motivo certo é o **PRIMEIRO filtro do funil que barrou**, não qualquer
   um que bata. O funil é o de `cnae-liso-servico.md`, na ordem:

     1.332 → 632 serviço → 540 não vedados → 523 não ambíguos
           → 120 baixo risco → 94 sem conselho → 87 sem registro setorial

   Uma atividade de comércio que também exigiria alvará tem UM motivo: comércio.
   Dizer "exige vistoria" seria verdade e seria a resposta errada.

   ⚠️ O texto de cada motivo é o que o Léo vai FALAR. Por isso é frase de
   conversa, não etiqueta de banco: sem sigla de resolução, sem "CGSIM", sem
   "Anexo VI". Quem precisa da norma é a coluna de fonte, não o cliente.

   Uso:  node derivar-motivo.mjs cnae-matriz-v2.csv [--aplicar] */

import { readFileSync, writeFileSync } from "node:fs";

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

/* Os degraus, na ordem do funil. `chave` é o vocabulário fechado que vai no
   banco; `fala` é o que o Léo diz. Nunca inverter a ordem sem refazer o funil. */
const DEGRAUS = [
  {
    chave: "comercio-ou-industria",
    // 🔑 Anexo vazio ⟺ não é serviço: o classificador de anexo só rodou sobre
    //    os 632 de serviço, e sobraram exatamente 700 — que é 1.332 − 632.
    teste: (g) => !g("anexo_fator_r_grupo"),
    fala: "Essa atividade é de comércio ou indústria, e a gente cuida só de prestação de serviço.",
  },
  {
    chave: "anexo-iv",
    teste: (g) => g("anexo_fator_r_grupo") === "IV",
    fala: "Essa atividade cai no Anexo IV do Simples (construção, limpeza, vigilância, advocacia), que a gente não atende.",
  },
  {
    // 🔑 Degrau que faltava, e a trava o encontrou: `3831-9/99` (recuperação de
    //    metálicos) e `3832-7/00` (plásticos) passam em TODOS os outros filtros
    //    e mesmo assim não são atendidos. Motivo real, de 18/09: os dois pagam
    //    ICMS (`mei_icms_fixo_das: S`), e o escopo travado em 12/09 põe ICMS
    //    fora por regra. Saem por escopo, não por lacuna.
    chave: "paga-icms",
    teste: (g) => g("mei_icms_fixo_das") === "S",
    fala: "Essa atividade paga ICMS, e a gente cuida só de quem paga ISS, que é o imposto de serviço.",
  },
  {
    chave: "vedado-simples",
    teste: (g) => g("vedado_simples_cgsn_anexo_vi") === "sim",
    fala: "Essa atividade não pode optar pelo Simples Nacional, e a gente trabalha só com Simples.",
  },
  {
    chave: "ambiguo-simples",
    teste: (g) => g("ambiguo_simples_cgsn_anexo_vii") === "sim",
    fala: "Essa atividade só entra no Simples dependendo de como ela é exercida, então precisa de análise caso a caso.",
  },
  {
    chave: "exige-alvara-previo",
    teste: (g) => g("risco_baixo_cgsim") !== "sim",
    fala: "Essa atividade precisa de vistoria e alvará antes de abrir, e a gente abre só o que tem liberação automática.",
  },
  {
    chave: "exige-conselho",
    teste: (g) => g("exige_conselho") === "sim" || g("exige_conselho") === "duvida",
    fala: "Essa atividade exige registro em conselho profissional, e isso muda a abertura e a responsabilidade técnica.",
  },
  {
    chave: "exige-registro-setorial",
    teste: (g) => g("exige_registro_setorial") === "sim",
    fala: "Essa atividade exige um registro federal específico além do CNPJ, que a gente ainda não faz.",
  },
];
const ATENDIDO = { chave: "atendemos", fala: "" };

const [ARQ, ...flags] = process.argv.slice(2);
const APLICAR = flags.includes("--aplicar");
const tudo = parse(readFileSync(ARQ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = tudo[0];
const dados = tudo.slice(1);
const idx = (n) => cab.indexOf(n);

const resultado = dados.map((l) => {
  const g = (n) => (l[idx(n)] ?? "").trim();
  if (g("atende_me_certeza") === "sim") return { l, ...ATENDIDO };
  const d = DEGRAUS.find((x) => x.teste(g));
  return { l, ...(d ?? { chave: "sem-motivo-derivavel", fala: "" }) };
});

// ── conferência: a derivação tem que REPRODUZIR o funil ──
const conta = new Map();
for (const r of resultado) conta.set(r.chave, (conta.get(r.chave) ?? 0) + 1);
console.log(`${dados.length} CNAEs\n`);
console.log("motivo".padEnd(28) + "quantos");
console.log("─".repeat(40));
for (const d of [...DEGRAUS, ATENDIDO]) {
  const n = conta.get(d.chave) ?? 0;
  console.log(`${d.chave.padEnd(28)}${String(n).padStart(6)}`);
}
const orfaos = conta.get("sem-motivo-derivavel") ?? 0;
console.log(`${"sem-motivo-derivavel".padEnd(28)}${String(orfaos).padStart(6)}  ${orfaos ? "🔴 A REGRA NÃO FECHA" : "✅"}`);

const atendidos = conta.get("atendemos") ?? 0;
console.log(`\nfunil reproduzido? atendemos=${atendidos} ${atendidos === 87 ? "✅ bate com os 87" : "🔴 NÃO BATE"}`);

// 🔴 Trava: nenhum CNAE que atendemos pode ter motivo, e nenhum que não
//    atendemos pode ficar sem. Vazio aqui é o defeito que a coluna existe pra
//    matar — não pode nascer com ele.
const contradicao = resultado.filter((r) => (r.chave === "atendemos") !== ((r.l[idx("atende_me_certeza")] ?? "").trim() === "sim"));
console.log(`contradições atende_me × motivo: ${contradicao.length} ${contradicao.length ? "🔴" : "✅"}`);

if (orfaos || contradicao.length) {
  console.log("\n🔴 não grava com a regra aberta.");
  process.exit(1);
}

if (APLICAR) {
  let novoCab = cab, add = false;
  if (idx("motivo_nao_atende") === -1) { novoCab = [...cab, "motivo_nao_atende", "motivo_nao_atende_fala"]; add = true; }
  const linhas = resultado.map((r) => (add ? [...r.l, r.chave, r.fala] : (() => {
    const c = [...r.l]; c[novoCab.indexOf("motivo_nao_atende")] = r.chave; c[novoCab.indexOf("motivo_nao_atende_fala")] = r.fala; return c;
  })()));
  writeFileSync(ARQ, [novoCab.map(escapar).join(","), ...linhas.map((l) => l.map((v) => escapar(String(v ?? ""))).join(","))].join("\n") + "\n", "utf8");
  console.log(`\n✅ gravado em ${ARQ} · ${novoCab.length} colunas`);
} else {
  console.log("\n(simulação — rode com --aplicar para gravar)");
}
