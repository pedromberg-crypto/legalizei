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

  /* 🔑 O grupo 73.1 (Publicidade) está PARTIDO, e o critério é histórico, não
     semântico — quem estava na lista de vedados até 2014 entrou no Simples pelo
     §5º-I X (Fator R); quem nunca esteve nunca foi alcançado por ele.
     Fonte: SC COSIT nº 13, de 28/03/2022, texto oficial da RFB lido na íntegra
     em `pesquisa/fontes/2026-09-24-sc-cosit-13-2022-OFICIAL.md`.
     ⚖️ A EMENTA nomeia só 7319-0/02 e 7319-0/03. O 7312-2/00 e o 7319-0/99
     vêm do item 10, alcançados pela conclusão do item 11 ("as atividades
     citadas no item 10") — fundamentação, não ementa. Está declarado no ADR. */
  "7312200": [III, "§5º-F (SC COSIT 13/2022, itens 10-11)", "nunca esteve vedado, logo o §5º-I X nunca o alcançou"],
  "7319099": [III, "§5º-F (SC COSIT 13/2022, itens 10-11)", "nunca esteve vedado, logo o §5º-I X nunca o alcançou"],
  // Estes dois a SC confirma em Fator R, e corrige o INCISO: entraram pelo
  // §5º-I X em 2015 (item 9), não pelo §5º-D IX nem pelo §5º-I IX.
  "7319001": [FR, "§5º-I X (SC COSIT 13/2022, item 9)", "vedado até 2014, entrou pelo §5º-I X"],
  "7319004": [FR, "§5º-I X (SC COSIT 13/2022, item 9)", "vedado até 2014, entrou pelo §5º-I X"],
  // Ementa e conclusão. Só troca a fonte: o anexo já estava certo.
  "7319002": [III, "§5º-F (SC COSIT 13/2022, ementa)", "ementa nomeia expressamente"],
  "7319003": [III, "§5º-F (SC COSIT 13/2022, ementa)", "ementa nomeia expressamente"],

  /* 🔬 P&D experimental — saíam do §5º-F residual, que era leitura por
     eliminação. O §5º-I VI nomeia **"pesquisa"** entre os serviços técnicos
     (cartografia, topografia, testes, suporte e análises técnicas, pesquisa,
     design, desenho), e onde o "técnico" não alcançar, o §5º-I XII alcança
     pelo "científica". Nos dois caminhos o anexo é o mesmo: Fator R.
     ⚠️ Lastro MENOR que o do grupo 73.1: aqui é leitura da lei + confirmação
     do Prompt A, **sem Solução de Consulta**. Declarado no ADR. */
  "7210000": [FR, "§5º-I VI", "o §5º-I VI nomeia 'pesquisa' entre os serviços técnicos"],
  "7220700": [FR, "§5º-I XII", "ciências sociais: o VI puxa exatas, o XII cobre 'científica'"],
  /* 🔴 Coerência, não descoberta. A varredura dos 50 achou este em III fixo
     pelo residual, no MESMO dia em que os dois de P&D acima foram pro Fator R
     por "pesquisa" estar nomeada no §5º-I VI. Deixar pesquisa de mercado em
     III seria a tabela se contradizendo: ou as três são Fator R, ou nenhuma é.
     A subclasse fecha: "estudos sobre potencial de mercado... análises
     estatísticas dos resultados" é trabalho intelectual, não execução. */
  "7320300": [FR, "§5º-I VI", "'pesquisa' nomeada no inciso, igual ao 7210-0/00 e 7220-7/00"],

  /* 📚 VARREDURA DOS 50 (24/09) — os que estavam em `§5º-F residual` dentro dos
     87 e a lei na verdade NOMEIA. O anexo não muda (todos III); o que muda é a
     PROVA: sai "não achei previsão" e entra o inciso. Importa porque §5º-F é
     classificação por eliminação, e foi exatamente a premissa que caiu hoje. */
  // §5º-B I nomeia "idiomas", "gerencial", "artes" e "escolas livres"
  "8593700": [III, "§5º-B I", "o inciso nomeia 'idiomas'"],
  "8599604": [III, "§5º-B I", "o inciso nomeia 'gerencial'"],
  "8592903": [III, "§5º-B I", "ensino de música: 'artes' / escola livre"],
  "8599603": [III, "§5º-B I", "curso de informática: escola livre"],
  // §5º-B XV nomeia "produções cinematográficas, audiovisuais"
  "5912001": [III, "§5º-B XV", "dublagem é serviço de produção audiovisual"],
  "5912002": [III, "§5º-B XV", "mixagem sonora é serviço de produção audiovisual"],
  "7420004": [III, "§5º-B XV", "filmagem de festas e eventos é produção audiovisual"],
  // §5º-B IX nomeia "instalação, reparos e manutenção em geral"
  "9529101": [III, "§5º-B IX", "reparação de calçados e artigos de viagem"],
  "9529102": [III, "§5º-B IX", "chaveiro: cópia de chaves e conserto de fechaduras"],
  "9529103": [III, "§5º-B IX", "reparação de relógios"],
  "9529104": [III, "§5º-B IX", "reparação de bicicletas"],
  "9529105": [III, "§5º-B IX", "reparação de artigos do mobiliário"],
  "9529106": [III, "§5º-B IX", "reparação de jóias"],
  // Continua §5º-F, mas agora com Solução de Consulta em vez de eliminação:
  // a SC COSIT 99/2017 (citada dentro da 13/2022) diz que a receita de
  // veiculação de material publicitário em portal da internet é Anexo III.
  "6319400": [III, "§5º-F (SC COSIT 99/2017)", "veiculação em portal de internet é Anexo III"],
};

/* 📖 A VARREDURA DOS 50, a outra metade (24/09).
   Estes 36 foram lidos um a um na `subclasse_observacoes` e CONFIRMADOS no
   §5º-F residual — nenhum inciso os nomeia e nenhum é atividade intelectual.

   🔴 Por que precisam de marca: a fonte deles dizia, e continuaria dizendo,
   "residual, nenhuma previsao em IV/V" — exatamente igual à de um CNAE que
   ninguém nunca abriu. "Conferido e confirmado" e "nunca olhado" ficavam com
   o mesmo texto, que é o mesmo defeito do campo vazio que engana o Léo.
   A marca `conferido 2026-09-24` separa os dois estados.

   ⚠️ 6 destes ficam com RESSALVA escrita na fila, não são confirmação limpa:
   6209100 (suporte técnico × manutenção), 6391700 (agência de notícias),
   9002701 (artista/jornalista/escritor), e os de edição/eventos. */
const REVISTOS_5F = [
  "7729202", "7729203", "5590601", "5590603", "5811500", "5812301", "5812302",
  "5813100", "5819100", "6209100", "6311900", "6391700", "7722500", "7723300",
  "7320300", "7420001", "7420003", "7420005", "7721700", "7733100", "8591100",
  "8220200", "8592901", "8219901", "8230001", "8291100", "8292000", "8299703",
  "8299707", "9609202", "9002702", "9002701", "9102302", "9319101", "9329803",
  "9602501",
];
/* 🔴 `CORRECOES[cod] = ...` sobrescreve. O `7320-3/00` entrou nesta lista na
   varredura (confirmado no residual) e DEPOIS foi movido pro Fator R por
   coerência com o P&D — o laço desfazia a correção em silêncio, gravando 0
   células e parecendo sucesso. Agora quem já tem correção declarada é pulado,
   e a rodada avisa. */
for (const cod of REVISTOS_5F) {
  if (CORRECOES[cod]) { console.log(`   ⚠️ ${cod} está em REVISTOS_5F e tem correção própria — prevalece a correção`); continue; }
  CORRECOES[cod] = [III, "§5º-F (residual, conferido 2026-09-24)", "lido na subclasse: nenhum inciso nomeia, não é atividade intelectual"];
}

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
    // Uma CORREÇÃO declarada reescreve mesmo quando o anexo não muda: às vezes
    // o que estava errado era só a FONTE, e a fonte é a prova.
    if (s.antes === s.anexo && !CORRECOES[s.cod]) continue;
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
