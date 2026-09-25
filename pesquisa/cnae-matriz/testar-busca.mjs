/* Testa se uma frase de cliente ACHA o CNAE certo — reproduzindo localmente a
   `fatos.consultar_cnae`, sem precisar do banco.

   🔑 Existe porque "esse título está bom?" não é pergunta de gosto, é pergunta
   de medida. Foi ele que mostrou, em 24/09, que 13 profissões devolviam NADA
   (`sapateiro`, `estofador`, `cantor`, `tradutor`, `estilista`…) e que
   "sou consultor de marketing" caía no Anexo III fixo quando o certo é o
   Fator R — a diferença entre 6% e 15,5%.

   ── OS TRÊS DEGRAUS, os mesmos do `seed/06-cnae-18-colunas.sql` ────────────

     A · SINÔNIMO exato       → score 1.0, decide sozinho e para
     B · TÍTULO por trigrama  → peso cheio
     C · TERMOS do IBGE       → peso menor, com teto

   🔴 O teto do degrau C não é detalhe, é o critério A6 do aceite. O
   `termos_de_busca` tem referência cruzada para OUTROS CNAEs: "dentista"
   aparece em FABRICAÇÃO DE PRODUTOS QUÍMICOS e "restaurante" em FABRICAÇÃO DE
   ARTIGOS DE VIDRO. Sem peso menor, troca-se falso negativo por falso
   positivo — que é pior, porque abre empresa errada.

   ⚠️ ISTO É APROXIMAÇÃO FIEL, NÃO É O POSTGRES. O `pg_trgm` acolchoa cada
   palavra com 2 espaços na frente e 1 atrás, quebra em trigramas e mede
   Jaccard (interseção ÷ união); o `<%` (word_similarity) procura a melhor
   janela de palavras do alvo, e é isso que `palavra()` imita. O degrau C aqui
   usa trigrama onde o banco usa `to_tsvector`, então a ordem pode divergir.
   **Serve para escolher entre dois títulos. Não serve para afirmar
   comportamento em produção — isso se mede no VPS, contra o banco.**

   Uso:  node testar-busca.mjs "sou sapateiro" "faço unhas em casa" ...
         PROPOSTAS='{"9529101":"Sapateiro: conserto de calçado"}' node testar-busca.mjs ... */

import { readFileSync, existsSync } from "node:fs";

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

// pg_trgm: minúscula, sem acento, não-alfanumérico vira separador, cada
// palavra ganha "  " na frente e " " atrás, e se quebra em 3.
const limpar = (s) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
function trigramas(txt) {
  const set = new Set();
  for (const p of limpar(txt).split(/[^a-z0-9]+/).filter(Boolean)) {
    const s = "  " + p + " ";
    for (let i = 0; i + 3 <= s.length; i++) set.add(s.slice(i, i + 3));
  }
  return set;
}
const jaccard = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
};
const similarity = (a, b) => jaccard(trigramas(a), trigramas(b));

/* word_similarity: a melhor janela contígua de palavras do ALVO comparada com
   a busca inteira. É o que faz "sou sapateiro" casar com um título longo que
   contenha "sapateiro". */
function palavra(busca, alvo) {
  const pal = limpar(alvo).split(/[^a-z0-9]+/).filter(Boolean);
  const B = trigramas(busca);
  let melhor = 0;
  for (let i = 0; i < pal.length; i++) {
    for (let j = i; j < pal.length && j < i + 8; j++) {
      const t = trigramas(pal.slice(i, j + 1).join(" "));
      let inter = 0;
      for (const g of t) if (B.has(g)) inter++;
      melhor = Math.max(melhor, inter / t.size); // extensão da janela coberta
    }
  }
  return melhor;
}

/* 🔴 O DEGRAU C NÃO É TRIGRAMA — e confundir isso me custou duas rodadas.
   No banco ele é `to_tsvector @@ plainto_tsquery`, que exige que TODAS as
   palavras de conteúdo da busca estejam PRESENTES no campo. Janela de trigrama
   sobre 542 caracteres casa com quase tudo: "sou dentista" achava 300 CNAEs e
   empatava 5 fabricações na frente de ATIVIDADE ODONTOLÓGICA. Aqui a regra é a
   mesma do Postgres — presença de palavra, não semelhança de pedaço.

   ⚠️ A lista de vazias não é a do Postgres (ele usa o dicionário `portuguese`
   inteiro). São só as que aparecem em como o cliente fala de si. */
const VAZIAS = new Set(["sou", "de", "do", "da", "em", "um", "uma", "o", "a", "e",
  "com", "para", "pra", "no", "na", "meu", "minha", "tenho", "faco", "trabalho"]);

function contemPalavras(busca, alvo) {
  const q = limpar(busca).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !VAZIAS.has(w));
  if (!q.length) return 0;
  const A = limpar(alvo);
  const achou = q.filter((w) => A.includes(w)).length;
  // Tudo ou nada, como o `@@`: se falta uma palavra de conteúdo, não casa.
  return achou === q.length ? achou / q.length : 0;
}

const LIMIAR = 0.6;       // `pg_trgm.word_similarity_threshold`, padrão do Postgres
const PISO = 0.25;        // 🔴 critério A4: abaixo disto devolve ZERO, não ruído
const TETO_TERMOS = 0.55; // 🔴 critério A6: termo cruzado nunca ganha de título

const ARQ = existsSync("_entrega-leo/cnae.csv") ? "_entrega-leo/cnae.csv" : "_entrega-leo/cnae-87.csv";
const B = parse(readFileSync(ARQ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = B[0], dados = B.slice(1);
const g = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

// Substituições propostas, para comparar antes × depois no mesmo comando.
const PROPOSTAS = JSON.parse(process.env.PROPOSTAS ?? "{}");
/* 🔴 Os 1.245 que não atendemos NÃO têm título amigável — por desenho, a voz
   amigável foi escrita só para os 87. Sem este fallback a saída mostra
   `nao-se-aplica` como se fosse o nome da atividade, e o agente leria isso. */
const titulo = (l) => {
  const p = PROPOSTAS[g(l, "codigo")];
  if (p) return p;
  const amig = g(l, "titulo_amigavel");
  return amig && amig !== "nao-se-aplica" ? amig : g(l, "titulo_oficial");
};

/* 🔑 A camada de sinônimos é NOSSA, separada do dado do IBGE. Existe porque
   `psicologo` não aparece em campo nenhum da tabela — nem no título oficial,
   nem no amigável, nem nos 542 caracteres de termos. Nenhum peso de busca acha
   palavra que ninguém escreveu. */
const aliases = existsSync("cnae-aliases.json")
  ? JSON.parse(readFileSync("cnae-aliases.json", "utf8"))
  : [];

for (const busca of process.argv.slice(2)) {
  console.log(`\n"${busca}"`);
  const q = limpar(busca);

  // ── A · sinônimo. Borda de palavra para "personal" não casar com
  //        "personalidade". Bateu, decide sozinho.
  const alias = aliases.find((a) => new RegExp(`\\b${limpar(a.termo)}\\b`).test(q));
  if (alias) {
    const l = dados.find((x) => g(x, "codigo").replace(/\D/g, "") === alias.codigo.replace(/\D/g, ""));
    if (l) {
      const atende = g(l, "atende_me") === "sim";
      console.log(`   🌟 por SINÔNIMO "${alias.termo}"`);
      console.log(
        `   1. ${g(l, "codigo")}  ${titulo(l).slice(0, 44).padEnd(46)} 1.00     ` +
          (atende ? "✅ atendemos" : "🚫 " + g(l, "motivo_nao_atende")),
      );
      continue;
    }
  }

  // ── B e C · título com peso cheio, termos com teto
  const r = dados
    .map((l) => {
      const wTitulo = Math.max(palavra(busca, titulo(l)), palavra(busca, g(l, "titulo_oficial")));
      const sTitulo = Math.max(similarity(titulo(l), busca), similarity(g(l, "titulo_oficial"), busca));
      const termos = g(l, "termos_de_busca");
      const usaTermos = termos && termos !== "nao-se-aplica";
      const wTermos = usaTermos ? contemPalavras(busca, termos) : 0;
      const sTermos = wTermos * TETO_TERMOS;
      return {
        l,
        passa: wTitulo >= LIMIAR || wTermos >= LIMIAR,
        s: Math.max(sTitulo, sTermos),
        via: sTitulo >= sTermos ? "titulo" : "termos",
      };
    })
    .filter((x) => x.passa && x.s >= PISO)
    .sort((a, b) => b.s - a.s || g(a.l, "codigo").localeCompare(g(b.l, "codigo")))
    .slice(0, 5);

  if (!r.length) {
    console.log("   🔴 NADA — e isso é RESULTADO VÁLIDO: o Léo pede mais detalhe em vez de chutar");
    continue;
  }
  r.forEach((x, i) => {
    const atende = g(x.l, "atende_me") === "sim";
    console.log(
      `   ${i + 1}. ${g(x.l, "codigo")}  ${titulo(x.l).slice(0, 44).padEnd(46)} ${x.s.toFixed(2)} ${x.via.padEnd(7)}` +
        (atende ? " ✅" : " 🚫 " + g(x.l, "motivo_nao_atende")),
    );
  });
}
