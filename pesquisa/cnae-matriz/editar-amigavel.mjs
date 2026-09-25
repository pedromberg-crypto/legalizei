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

  // ── Tecnologia e software (validado 24/09) ─────────────────────────────
  "6201501": ["Desenvolvimento de software, app e sistema sob encomenda", "'app' e 'sistema' é o que se digita; 'programas de computador' não"],
  "6201502": ["Web design: criação de sites e páginas na internet", "🔴 'Web design' não continha a palavra SITE. 🔄 24/09, medido na VPS: no singular ele perdia 'faço sites' para `6311-9/00 Hospedagem de sites` (0.55 × 0.364) — e Hospedagem é III fixo enquanto Web design é FATOR R, então o erro custava dinheiro. Plural."],
  "6204000": ["Consultoria e assessoria em TI e informática", "ASSESSORIA é palavra diferente de consultoria e não compartilha trigrama"],
  "6209100": ["Suporte técnico, help desk e informática", "🔴 'help desk' devolvia Design de produto. HELP-DESK é termo do IBGE"],
  "6319400": ["Portal, site de conteúdo e gestão de redes sociais", "🔴 'cuido de redes sociais' devolvia Pesquisa em ciências sociais. O IBGE tem GESTÃO DE CONTEÚDO RELACIONADO ÀS REDES SOCIAIS PARA TERCEIROS"],
  // 6202300 e 6203100 ficam: "customizável" é jargão, mas é o que separa os
  // dois, e não existe sinônimo de rua. 6311900 fica: já achava.

  // ── Arte, cultura e patrimônio (validado 24/09) ────────────────────────
  "7490105": ["Agente e agenciamento de atleta, modelo e artista", "🔴 'sou modelo' não achava NADA. AGENCIAMENTO DE MODELOS E MANEQUINS e AGENTE DE ATORES são termos do IBGE"],
  "9001901": ["Produção de teatro, companhia teatral e ator", "🔴 'sou ator' não achava NADA. ATOR INDEPENDENTE é termo do IBGE"],
  "9001902": ["Produção musical, banda, cantor e músico", "🔴 'sou cantor' e 'tenho uma banda' não achavam NADA. CANTOR e BANDA MUSICAL são termos do IBGE"],
  "9002701": ["Artista plástico, escritor, jornalista e cartunista", "CARTUNISTA e DESENHISTA são termos do IBGE"],
  // 9001903, 9001904, 9002702 e 9102302 ficam: já achavam.

  // ── Aluguel de equipamentos (validado 24/09) ───────────────────────────
  "7721700": ["Aluguel de brinquedo, pula-pula e equipamento esportivo", "TOBOGÃ, PULA-PULA e BRINQUEDOS NÃO ELETRÔNICOS são termos do IBGE — é festa infantil, que o título antigo não alcançava"],
  "7722500": ["Locadora de filme, DVD e CD", "🔴 faltava a palavra DVD"],
  "7723300": ["Aluguel de roupa, fantasia, traje de noiva e joia", "🔴 'alugo fantasia' não achava NADA. FANTASIAS e ACESSÓRIOS PARA NOIVAS são termos do IBGE"],
  "7729201": ["Aluguel de videogame, console e fliperama", "CONSOLES e FLIPERAMAS são termos do IBGE"],
  "7729203": ["Aluguel de material médico, cadeira de rodas e muleta", "CADEIRAS DE RODA e MULETAS são termos do IBGE; 'alugo cadeira de rodas' sobe para 0.42"],
  "7729299": ["Aluguel de planta, flor, peruca e outros objetos", "o título antigo era invisível na busca; PLANTAS E FLORES e PERUCA são termos do IBGE"],
  "7733100": ["Aluguel de computador, impressora e equipamento de escritório", "COMPUTADORES e DATA-SHOW são termos do IBGE"],
  // 7729202 fica: já cobre móveis, eletrodomésticos e instrumentos.

  // ── Foto, vídeo e áudio (validado 24/09) ───────────────────────────────
  "7420004": ["Filmagem de festa, casamento e evento", "🔴 'filmo casamento' devolvia Pensão e casa de cômodos — 'casamento' casava com 'casa'"],
  // Os outros 6 ficam: "sou fotógrafo" já dá 0.47 com "Fotografia" sozinho, e
  // "Dublagem" é a palavra exata. Acrescentar só diluiria.

  // ── Apoio administrativo (validado 24/09) ──────────────────────────────
  "8211300": ["Escritório, recepção e arquivo de documentos", "ARQUIVAMENTO DE DOCUMENTOS e RECEPÇÃO são termos do IBGE"],
  "8219901": ["Xerox, fotocópia e impressão", "🔴 'tiro xerox' devolvia Consultoria em TI com 0.04. O IBGE diz CÓPIA XEROGRÁFICA, e ninguém digita 'xerográfica'"],
  "8219999": ["Digitação e preparação de documentos", "🔴 'serviço de digitação' devolvia Microfilmagem. ⚠️ Cortei 'e apoio administrativo' do fim: COM o sufixo ele perdia para a Microfilmagem, sem ele ganha por 0.30 × 0.28"],
  "8291100": ["Cobrança, consulta cadastral e crédito", "🔑 escolha de compromisso, medida em 3 versões: nenhuma ganha em tudo, porque cada palavra a mais rouba nota das outras. Esta acerta 'cobrança', 'crédito' e 'consulta cadastral' sem nenhuma brilhar"],
  // 8220200 ("call center" já dá 0.45), 8292000 e 8299703 ficam.

  // ── Marketing e publicidade (validado 24/09) ───────────────────────────
  "5911102": ["Produção de vídeo publicitário e comercial de TV", "COMERCIAIS DE TELEVISÃO e FILMES INSTITUCIONAIS são termos do IBGE"],
  "7311400": ["Agência de publicidade e propaganda", "EMPRESA DE PROPAGANDA é termo do IBGE"],
  "7312200": ["Venda e aluguel de espaço publicitário e outdoor", "BUSDOOR e ALUGUEL DE ESPAÇO FÍSICO PARA PUBLICIDADE são termos do IBGE"],
  // 🔴 A LINHA MAIS CARA DA LAPIDAÇÃO INTEIRA. "sou consultor de marketing"
  //    caía em `7319-0/03` Marketing direto, que é III FIXO — quando o certo
  //    é este, que é FATOR R. Errar aqui é cobrar 6% de quem é 15,5%.
  "7319004": ["Consultoria em marketing, publicidade e branding", "🔴 erro FISCAL corrigido. BRANDING (GESTÃO DE MARCAS) e CONSULTORIA EM MARKETING são termos do IBGE"],
  // 7319002 e 7319003 ficam.

  // ── Consultoria, pesquisa e tradução (validado 24/09) ──────────────────
  "7490101": ["Tradutor, tradução e revisão de texto", "🔴 'sou tradutor' não achava NADA e 'faço revisão de texto' devolvia Edição de revistas. TRADUTOR, REVISÃO GRAMATICAL e COPYWRITING são termos do IBGE"],
  "7490104": ["Representação comercial e intermediação de negócios", "'representante comercial' é a profissão, e não estava no título"],
  "7490199": ["Consultoria em moda, imagem e outros serviços técnicos", "🔑 ASSESSORIA E CONSULTORIA EM MODA E IMAGEM PESSOAL e SOMMELIER estão no IBGE — consultoria de imagem é mercado real e estava invisível"],
  // 7210000, 7220700 e 7320300 ficam.

  // ── Design (validado 24/09) ────────────────────────────────────────────
  "7410203": ["Design de produto, desenho industrial e estilista", "🔴 'sou estilista' não achava NADA. DESENHO DE ROUPAS e DESENHO INDUSTRIAL são termos do IBGE"],
  /* 7410202 e 7410299 ficam. ⚠️ Mas o 7410202 tem questão ABERTA que não é de
     título: ele está como Fator R, e o §5º-C I (Anexo IV, FORA do escopo)
     nomeia "serviços de paisagismo e decoração de interiores" — que é
     literalmente o termo do IBGE nesse CNAE. Foi pro contador. */

  // ── Edição e mídia (validado 24/09) ────────────────────────────────────
  "5811500": ["Edição de livro, e-book e apostila", "🔴 'edito e-book' devolvia Conserto de computador. E-BOOKS, AUDIOLIVROS e APOSTILAS são termos do IBGE"],
  // os outros 5 ficam.

  // ── Eventos e entretenimento (validado 24/09) ──────────────────────────
  "8230001": ["Organização de evento, festa infantil e congresso", "ORGANIZAÇÃO DE FESTAS INFANTIS é termo do IBGE; sobe de 0.28 para 0.44"],
  // os outros 4 ficam.
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
