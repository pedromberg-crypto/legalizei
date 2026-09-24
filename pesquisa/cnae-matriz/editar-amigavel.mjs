/* Aplica edições de `titulo_amigavel` / `descricao_amigavel` no
   `cnae-friendly-v2.csv`, que é a FONTE desses dois campos.

   🔑 Por que via script e não à mão no CSV: o motivo de cada troca fica
   versionado ao lado da troca. Título amigável não é texto de enfeite — é o
   ÚNICO campo que a `fatos.consultar_cnae` compara contra a frase do cliente
   (`WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)`). Mudar um
   título é mudar o que o Léo acha.

   📏 A regra, descoberta medindo em 24/09 e não por gosto:

     ✅ ACRESCENTA SUBSTANTIVO ou PROFISSÃO que a busca ainda não alcança
        sapateiro · estofador · relojoeiro · notebook · inglês · cursinho
     🔴 NUNCA acrescenta sinônimo de VERBO
        "conserto e reparo de joias" não ganha nada — `repar` e `conserto` já
        compartilham trigrama com o resto da frase, e "reparo de joias" já
        achava com 0.67. E CUSTA: o pg_trgm mede Jaccard (interseção ÷ união),
        então palavra a mais aumenta o denominador. Medido: "conserto de
        joias" caía de 1.00 para 0.67, um terço da nota, em troca de zero.

   Uso:  node editar-amigavel.mjs [--aplicar] */

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

/* Cada linha: código → [novo título, motivo]. Descrição em `DESCRICOES`.
   Manter o motivo em linguagem de medida, não de gosto. */
const TITULOS = {
  // ── Reparos e manutenção (validado 24/09) ──────────────────────────────
  "9511800": ["Conserto de computador e notebook", "'notebook' é o que se digita; 'assistência técnica' foi cortado por diluir a nota sem abrir porta"],
  "9512600": ["Conserto de celular, telefone e câmera", "'equipamentos de comunicação' é jargão que ninguém digita"],
  "9521500": ["Conserto de eletrodoméstico, eletrônico e antena", "ANTENAS e ALARMES RESIDENCIAIS estão nos termos do IBGE"],
  "9529101": ["Sapateiro: conserto de calçado e bolsa", "🔴 'sou sapateiro' não achava NADA. SAPATEIRO é termo literal do IBGE"],
  "9529103": ["Relojoeiro: conserto de relógio", "🔴 'relojoeiro' não achava NADA — e nem está nos termos do IBGE, é vocabulário de rua"],
  "9529104": ["Oficina e conserto de bicicleta", "OFICINA DE BICICLETAS é termo do IBGE; 'tenho oficina de bicicleta' subiu de 0.32 para 0.54"],
  "9529105": ["Conserto de móveis, estofador e tapeceiro", "🔴 'sou estofador' não achava NADA. ⚠️ 'tapeceiro' é aposta nossa: o IBGE diz 'artigos de tapeçaria'"],
  "9529199": ["Amolador de facas e conserto de outros objetos", "o título antigo era invisível na busca; AMOLADOR DE FACAS é termo do IBGE"],
  // 9529102 "Chaveiro" e 9529106 "Conserto de joias" ficam: já achavam em 1º,
  // com 1.00 no segundo. Mexer só baixaria a nota.

  // ── Ensino e cursos (validado 24/09) ───────────────────────────────────
  "8591100": ["Aulas e escolinha de esporte, natação e artes marciais", "ESCOLINHA DE ESPORTE, NATAÇÃO e ARTES MARCIAIS são termos do IBGE"],
  "8592901": ["Aulas de dança, ballet e dança de salão", "BALLET e DANÇA DE SALÃO são termos do IBGE"],
  "8592903": ["Aulas de música e conservatório", "CONSERVATÓRIO DE MÚSICA é termo do IBGE"],
  "8592999": ["Aulas de artesanato, pintura e outras artes", "os 3 únicos termos do IBGE são ARTESANATO, PINTURA e ESCULTURA; 'arte e cultura' é rótulo nosso"],
  "8593700": ["Aulas de idiomas: inglês, espanhol e libras", "🔴 'inglês' é a palavra nº1 e estava só na descrição, que a busca NÃO lê"],
  "8599604": ["Curso profissionalizante, treinamento e palestra", "PALESTRA e TREINAMENTO GERENCIAL são termos do IBGE"],
  "8599605": ["Cursinho preparatório: concurso, vestibular e ENEM", "🔴 a descrição já dizia cursinho/vestibular/ENEM e a busca nunca leu a descrição"],
  // 8592902 e 8599603 ficam: já achavam bem.
};
const DESCRICOES = {};

const ARQ = "cnae-friendly-v2.csv";
const t = parse(readFileSync(ARQ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = t[0], dados = t.slice(1);
const cod = (l) => (l[0] ?? "").replace(/\D/g, "");

const naoAchou = Object.keys(TITULOS).filter((c) => !dados.find((l) => cod(l) === c));
if (naoAchou.length) { console.log("🔴 códigos que não existem no arquivo: " + naoAchou); process.exit(1); }

let n = 0;
console.log("código    antes → depois");
console.log("─".repeat(96));
for (const l of dados) {
  const c = cod(l);
  if (TITULOS[c]) {
    const [novo, motivo] = TITULOS[c];
    if (l[1] !== novo) { console.log(`${c}  ${l[1]}\n          → ${novo}\n            ${motivo}\n`); l[1] = novo; n++; }
  }
  if (DESCRICOES[c] && l[2] !== DESCRICOES[c][0]) { l[2] = DESCRICOES[c][0]; n++; }
}
console.log(`${n} campos alterados · ${dados.length} linhas · ${cab.length} colunas`);

if (process.argv.includes("--aplicar")) {
  writeFileSync(ARQ, [cab.map(escapar).join(","), ...dados.map((l) => l.map((v) => escapar(String(v ?? ""))).join(","))].join("\n") + "\n", "utf8");
  console.log(`✅ gravado em ${ARQ}`);
} else {
  console.log("(simulação — rode com --aplicar para gravar)");
}
