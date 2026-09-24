/* Fecha o anexo do Simples dos CNAEs que estavam em `requer-revisao`, aplicando
   a cascata da LC 123, art. 18, na ordem em que a lei manda.

   🔑 Por que existe: o classificador de 27/08 tratava "não achei inciso" como
   estado terminal (`requer-revisao`). Não é. A LC 123 tem DOIS residuais que se
   completam e não deixam buraco —

     §5º-F      demais serviços sem previsão expressa           → III fixo
     §5º-I XII  outras atividades de natureza INTELECTUAL,
                técnica, científica, artística ou cultural,
                desde que não sujeitas ao III ou IV             → III↔V (Fator R)

   Não achar inciso nominado não é falta de resposta. Sobra UMA pergunta: a
   atividade é intelectual? Foi por não fazer essa pergunta que design de UI/UX,
   nomeado em letra no §5º-I VI, virou `requer-revisao` e travou o apurador em
   7 dos 87 CNAEs que atendemos.

   🔴 DUAS TRAVAS NASCIDAS DE UMA RODADA ERRADA (24/09). A 1ª versão deste
   script casava termos contra `atividades` e `subclasse_observacoes` além da
   `descricao`, e produziu 101 mudanças, quase todas lixo:

     4211101 CONSTRUÇÃO DE RODOVIAS  IV → III   porque a lista de termos dela
                                                contém "instalação de"
     7490199 OUTRAS PROFISSIONAIS    → medicina porque cita "saúde do trabalho"
     8219999 PREPARAÇÃO DE DOCUMENTOS → publicidade porque cita "material de
                                                publicidade"

   `atividades` é um saco de termos de busca com referências cruzadas pra OUTROS
   CNAEs — casar contra ele é ruído garantido. Então:

     1. só casa contra `descricao` (o título oficial da subclasse);
     2. nunca reescreve linha já classificada como IV — Anexo IV está fora do
        escopo (travado 12/09) e reclassificar construção não é trabalho nosso.

   Fonte dos termos: `lc123-art18-anexos-taxativo.md` (Planalto, redação vigente
   pós-LC 155/2016).

   Uso:  node reclassificar-anexo.mjs cnae-matriz-v2.csv [--aplicar] */

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
const limpar = (s) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const III = "III", IV = "IV", FR = "III-ou-V";

// Os incisos, na ordem da cascata. §5º-C primeiro: é o único que tira do escopo.
const REGRAS = [
  // 🔴 "obras de" solto pegava RESTAURAÇÃO DE OBRAS DE ARTE (9002702, um dos 87)
  //    e o mandava pro Anexo IV, que está FORA DO ESCOPO. Lista fechada de obra.
  [IV, "§5º-C I", /constru[çc][ãa]o de|obras de (engenharia|urbaniza|terraplen|funda|acabamento|alvenaria|irriga|montagem|instala)|subempreitada|paisagismo/],
  // 🔴 /servi[çc]os de limpeza/ e /seguran[çc]a privada/ não pegavam
  //    "ATIVIDADES DE LIMPEZA N.E." nem "OUTRAS ATIVIDADES DE SERVIÇOS DE
  //    SEGURANÇA" — dois CNAEs de Anexo IV que sairiam como III, ou seja,
  //    pareceriam atendíveis. Erro na direção perigosa.
  [IV, "§5º-C VI", /vigil[âa]ncia|seguran[çc]a privada|servi[çc]os de seguran[çc]a|(atividades|servi[çc]os) de limpeza|limpeza em pr[ée]dios/],
  [IV, "§5º-C VII", /advocat[íi]cios|advocacia/],

  [III, "§5º-B I", /creche|pr[ée]-escola|ensino fundamental|ensino m[ée]dio|ensino t[ée]cnico|ensino de idiomas|escolas? livres?|cursos? preparat[óo]rio|ensino de arte|ensino de m[úu]sica|ensino de dan[çc]a|ensino de artes c[êe]nicas|ensino de esportes|treinamento em/],
  [III, "§5º-B II", /ag[êe]ncia terceirizada de correios/],
  [III, "§5º-B III", /ag[êe]ncias? de viage|operadores? tur[íi]stico/],
  [III, "§5º-B IV", /forma[çc][ãa]o de condutores|autoescola/],
  [III, "§5º-B V", /lot[ée]rica/],
  // 🔴 sem o \b, "PREPARAÇÃO de documentos" casava com "reparação" e o 8219999
  //    saía com o inciso errado (§5º-B IX em vez do residual §5º-F).
  [III, "§5º-B IX", /\brepara[çc][ãa]o|\bmanuten[çc][ãa]o|\binstala[çc][ãa]o|usinagem|solda|revestimento em metais|fotoc[óo]pias/],
  [III, "§5º-B XIII", /transporte municipal de passageiros/],
  [III, "§5º-B XIV", /servi[çc]os cont[áa]beis|atividades de contabilidade/],
  [III, "§5º-B XV", /produ[çc][ãa]o (cinematogr[áa]fica|teatral|musical|de filmes|de espet[áa]culos|e promo[çc][ãa]o)|est[úu]dios cinematogr[áa]ficos|p[óo]s-produ[çc][ãa]o|distribui[çc][ãa]o cinematogr[áa]fica|dublagem|mixagem sonora|grava[çc][ãa]o de som|artistas pl[áa]sticos|obras de arte/],
  [III, "§5º-B XVII", /corretagem de seguros/],

  [FR, "§5º-B XVI", /fisioterapia/],
  [FR, "§5º-B XVIII", /arquitetura|urbanismo/],
  [FR, "§5º-B XIX", /atividade m[ée]dica|medicina|enfermagem/],
  [FR, "§5º-B XX", /odontol[óo]gic|pr[óo]tese dent[áa]ria/],
  [FR, "§5º-B XXI", /psicologia|psican[áa]lise|terapia ocupacional|acupuntura|podologia|fonoaudiologia|banco de leite/],
  [FR, "§5º-D I", /administra[çc][ãa]o e loca[çc][ãa]o de im[óo]veis|gest[ãa]o e administra[çc][ãa]o da propriedade/],
  [FR, "§5º-D II", /academias? de dan[çc]a|capoeira|ioga|artes marciais/],
  [FR, "§5º-D III", /condicionamento f[íi]sico|escolas? de esporte/],
  [FR, "§5º-D IV", /desenvolvimento de programas de computador|elabora[çc][ãa]o de programas/],
  [FR, "§5º-D V", /licenciamento de programas|desenvolvimento e licenciamento/],
  [FR, "§5º-D VI", /web design|p[áa]ginas eletr[ôo]nicas/],
  [FR, "§5º-D IX", /estandes para feiras/],
  [FR, "§5º-D XII", /laborat[óo]rios cl[íi]nicos|an[áa]lises cl[íi]nicas|patologia cl[íi]nica/],
  [FR, "§5º-D XIII", /tomografia|diagn[óo]stico por imagem|resson[âa]ncia magn[ée]tica/],

  [FR, "§5º-I II", /veterin[áa]ri/],
  [FR, "§5º-I V", /comiss[áa]ria|despachante|tradu[çc][ãa]o|interpreta[çc][ãa]o/],
  [FR, "§5º-I VI", /engenharia|cartografia|topografia|geod[ée]sia|geologia|agronomia|design|desenho t[ée]cnico/],
  [FR, "§5º-I VII", /representa[çc][ãa]o comercial|intermedia[çc][ãa]o/],
  [FR, "§5º-I VIII", /per[íi]cia|leiloeiro|peritos e avaliadores/],
  [FR, "§5º-I IX", /auditoria|consultoria|gest[ãa]o empresarial/],
  [FR, "§5º-I X", /jornalis|publicidade|ag[êe]ncias de not[íi]cias/],
  [FR, "§5º-I XI", /agenciamento/],
];

/* §5º-I XII — a cláusula de varredura. Só roda quando NENHUM inciso bateu.
   ⚠️ Único ponto de JULGAMENTO da cascata, e por isso o resultado dela sai
   marcado `decidir` e nunca é gravado sozinho. */
const INTELECTUAL = /profissionais, cient[íi]ficas e t[ée]cnicas|cient[íi]fic|assessoria|consult|estudos|pesquisa e desenvolvimento/;

function classificar(descricao) {
  const d = limpar(descricao);
  for (const [anexo, inciso, re] of REGRAS) if (re.test(d)) return { anexo, inciso, forca: "alta" };
  if (INTELECTUAL.test(d)) return { anexo: FR, inciso: "§5º-I XII", forca: "decidir" };
  return { anexo: III, inciso: "§5º-F", forca: "alta" };
}

const traduzir = (g) => (g === "III-fixo" ? III : g === "IV" ? IV : /dinamico/.test(g) ? FR : g);

/* 🔴 E de volta, na hora de GRAVAR. A 1ª aplicação escreveu `III` e `III-ou-V`
   — vocabulário da tabela nova — numa coluna que o `apurador.anexoDoCnae()` lê
   procurando `III-fixo`. Ficaram 4 valores para 2 conceitos e o motor teria
   parado. Renomear a coluna é trabalho da refatura da tabela, não desta
   correção: aqui escreve-se o vocabulário que já está no arquivo. */
const paraArquivo = (a) => (a === III ? "III-fixo" : a === FR ? "fator-r-dinamico(III<->V, limiar 28%)" : a);

// ── execução ──────────────────────────────────────────────────────────────
const [ARQ, ...flags] = process.argv.slice(2);
const APLICAR = flags.includes("--aplicar");
const tudo = parse(readFileSync(ARQ, "utf8").replace(/^﻿/, "")).filter((l) => l.length > 1);
const cab = tudo[0], dados = tudo.slice(1);
const col = (l, n) => (l[cab.indexOf(n)] ?? "").trim();

const porClasse = new Map();
for (const l of dados) {
  const k = col(l, "cnae").slice(0, 5);
  if (!porClasse.has(k)) porClasse.set(k, []);
  porClasse.get(k).push(l);
}
const irmaoUnanime = (l) => {
  const cod = col(l, "cnae");
  const vals = new Set((porClasse.get(cod.slice(0, 5)) ?? [])
    .filter((x) => col(x, "cnae") !== cod)
    .map((x) => traduzir(col(x, "anexo_fator_r_grupo")))
    .filter((v) => v && v !== "requer-revisao"));
  return vals.size === 1 ? [...vals][0] : null;
};

// 🔴 Defeito de tabelamento achado em 24/09, corrigido à mão porque a cascata
//    sozinha não o explica: o matcher de 27/08 viu "jogos eletrônicos" no
//    §5º-D IV e ignorou que a subclasse diz "o ALUGUEL DE APARELHOS de jogos".
//    Alugar fliperama não é elaborar software.
/* 🔑 As três entradas abaixo têm a mesma causa e a mesma lição: **o título do
   CNAE mente, e a subclasse desmente**. A cascata casa só na `descricao`
   (porque casar no `atividades` é ruído), mas em CNAE guarda-chuva a descrição
   sozinha engana. Quando isso acontece, a `subclasse_observacoes` não vira
   regex — vira LEITURA, e o resultado entra aqui declarado. */
const CORRECOES = {
  "7729201": [III, "§5º-F", "aluguel de aparelho não é elaboração de software (§5º-D IV não se aplica)"],
  // Título diz "serviços de segurança" e a cascata mandava pro §5º-C VI (Anexo
  // IV, vigilância). A subclasse diz "instalação, reparação, reconstrução e
  // ajuste mecânico de cofres, trancas e travas": é chaveiro, não guarda.
  // Confirmado pelo retorno do Prompt A (24/09) com inciso direto.
  "8020002": [III, "§5º-B IX", "cofres e travas é instalação/reparo, não vigilância (§5º-C VI não se aplica)"],
  // Mesmo padrão do 7729201: "exploração de ESTABELECIMENTOS de jogos
  // eletrônicos" é operar fliperama, não elaborar programa. Todos os irmãos da
  // classe (sinuca, boliche, discoteca, recreação n.e.) são III.
  "9329804": [III, "§5º-F", "explorar fliperama não é elaboração de software (§5º-D IV não se aplica)"],
};

const fila = [];
for (const l of dados) {
  const cod = col(l, "cnae");
  const antes = traduzir(col(l, "anexo_fator_r_grupo"));
  if (antes === IV) continue;                       // trava 2: não mexe em Anexo IV
  const r = CORRECOES[cod]
    ? { anexo: CORRECOES[cod][0], inciso: CORRECOES[cod][1], forca: "alta", nota: CORRECOES[cod][2] }
    : classificar(col(l, "descricao"));
  const irmao = irmaoUnanime(l);
  fila.push({ l, cod, desc: col(l, "descricao"), atende: col(l, "atende_me_certeza") === "sim", antes, irmao, ...r });
}

const revisao = fila.filter((s) => s.antes === "requer-revisao");
const corrigidos = fila.filter((s) => CORRECOES[s.cod]);
const residual = fila.filter((s) => s.antes === III && /5o-F/.test(col(s.l, "anexo_fator_r_fonte")));

console.log(`${dados.length} CNAEs · cascata LC123 art.18 · casa só na descrição\n`);
console.log("── 1. os que estavam em requer-revisao ──");
for (const s of revisao) {
  const ok = s.irmao === null || s.irmao === s.anexo;
  console.log(`  ${s.atende ? "⭐" : "  "} ${s.cod} ${s.desc.slice(0, 44).padEnd(46)} → ${s.anexo.padEnd(9)} ${s.inciso.padEnd(11)} ${s.forca.padEnd(8)} irmão:${(s.irmao ?? "—").padEnd(9)} ${ok ? "✅" : "🔴 CONTRADIZ"}`);
}
console.log(`\n  ${revisao.length} total · ${revisao.filter((s) => s.atende).length} dentro dos 87`);

console.log("\n── 2. correções manuais ──");
for (const s of corrigidos) console.log(`  ${s.atende ? "⭐" : "  "} ${s.cod} ${s.desc.slice(0, 44).padEnd(46)} ${s.antes} → ${s.anexo}  · ${s.nota}`);

console.log("\n── 3. os III-fixo por §5º-F: a pergunta do §5º-I XII ──");
const dentro = residual.filter((s) => s.atende);
const flip = dentro.filter((s) => s.anexo !== III);
console.log(`  ${residual.length} no total · ${dentro.length} dentro dos 87 que atendemos`);
console.log(`  ${flip.length} deles a cascata move para outro anexo:\n`);
for (const s of flip) console.log(`   ⭐ ${s.cod} ${s.desc.slice(0, 46).padEnd(48)} III → ${s.anexo}  ${s.inciso}  [${s.forca}]`);
console.log(`\n  os outros ${dentro.length - flip.length} a cascata CONFIRMA em III (§5º-F).`);

if (APLICAR) {
  const iG = cab.indexOf("anexo_fator_r_grupo"), iF = cab.indexOf("anexo_fator_r_fonte"), iC = cab.indexOf("anexo_fator_r_confianca");
  let n = 0;
  for (const s of fila) {
    // 🔒 só grava no que estava em requer-revisao ou tem correção declarada.
    //    Os 449 §5º-F e os 700 de indústria/comércio ficam como estão: mover
    //    CNAE que já tinha anexo é decisão fiscal, não faxina de script.
    if (s.antes !== "requer-revisao" && !CORRECOES[s.cod]) continue;
    // Barra de prova: a mesma dos 7 — o irmão não pode contradizer.
    // O julgamento do §5º-I XII entra aqui porque `requer-revisao` também é um
    // não-saber, e trocar um não-saber por um inciso registrado é ganho; o que
    // não pode é o inciso sumir. Ele fica escrito na coluna de fonte.
    if (s.irmao !== null && s.irmao !== s.anexo) continue;
    if (s.antes === s.anexo) continue;
    s.l[iG] = paraArquivo(s.anexo);
    s.l[iF] = `LC123 art18 ${s.inciso}`;
    s.l[iC] = "alta";
    n++;
  }
  writeFileSync(ARQ, [cab.map(escapar).join(","), ...dados.map((l) => l.map((v) => escapar(String(v ?? ""))).join(","))].join("\n") + "\n", "utf8");
  console.log(`\n✅ ${n} linhas reescritas em ${ARQ}`);
} else {
  console.log("\n(simulação — rode com --aplicar para gravar)");
}
