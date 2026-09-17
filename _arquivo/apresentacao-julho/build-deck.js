const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Pedro Maia Berg";
pres.title = "Legalize Digital - Viabilidade de Negócio";

// ---- palette ----
const NAVY = "0F2A43";
const NAVY2 = "1B3C5A";
const EMER = "10B981";
const EMER_D = "0B7A5A";
const INK = "0F172A";
const MUTED = "64748B";
const LIGHT = "F1F5F9";
const WHITE = "FFFFFF";
const ICE = "CADCFC";
const AMBER_BG = "FFF7ED";
const AMBER_LN = "F59E0B";
const AMBER_TX = "9A3412";

const HF = "Trebuchet MS";
const BF = "Calibri";

const PW = 13.333, PH = 7.5, MX = 0.6, CW = PW - 2 * MX;
const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.12 });

const SHOW_NOTES = false; // true = cards internos de ensaio; false = versão limpa pra apresentar
function footer(slide, paragraph) {
  if (!SHOW_NOTES) return;
  const y = 6.28, h = 0.95;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y, w: CW, h, fill: { color: AMBER_BG }, line: { color: AMBER_LN, width: 1 }, rectRadius: 0.06 });
  slide.addShape(pres.shapes.RECTANGLE, { x: MX, y, w: 0.07, h, fill: { color: AMBER_LN } });
  slide.addText([
    { text: "NOTA INTERNA — APAGAR ANTES DE APRESENTAR", options: { bold: true, color: AMBER_TX, fontSize: 9.5, breakLine: true, charSpacing: 1 } },
    { text: paragraph, options: { color: "7C2D12", fontSize: 10.5 } }
  ], { x: MX + 0.18, y: y + 0.04, w: CW - 0.34, h: h - 0.08, fontFace: BF, valign: "middle", margin: 0 });
}
function title(slide, t, dark) {
  slide.addText(t, { x: MX, y: 0.45, w: CW, h: 0.9, fontFace: HF, fontSize: 32, bold: true, color: dark ? WHITE : NAVY, valign: "middle", margin: 0 });
}

// ===================== SLIDE 1 — CAPA =====================
let s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: PH, fill: { color: EMER } });
s.addText("VIABILIDADE DE NEGÓCIO  ·  JULHO 2026", { x: 1.0, y: 1.25, w: 11, h: 0.4, fontFace: BF, fontSize: 13, color: ICE, charSpacing: 3, margin: 0 });
s.addText("Legalize Digital", { x: 1.0, y: 1.9, w: 11.5, h: 1.4, fontFace: HF, fontSize: 60, bold: true, color: WHITE, margin: 0 });
s.addText("Contabilidade digital para quem só quer tocar a própria empresa.", { x: 1.0, y: 3.35, w: 11, h: 0.7, fontFace: HF, fontSize: 22, color: EMER, margin: 0 });
s.addText("Um mercado validado, um modelo provado e um caminho claro até um produto no mercado.", { x: 1.0, y: 4.15, w: 10.8, h: 0.7, fontFace: BF, fontSize: 16, color: ICE, margin: 0 });
footer(s, "Por que: abre com foco em VIABILIDADE, não em pedido de dinheiro. Como se comportar: fale curto — 'trouxe a leitura de mercado e por que isso é um negócio viável, não uma aposta'. Sociedade e valores ficam para a conversa, não para o slide.");

// ===================== SLIDE 2 — CONTRA QUEM COMPETIMOS =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Contra quem competimos de verdade", false);
s.addText("O concorrente não é a Contabilizei. É o jeito velho — e o dinheiro que ele custa.", { x: MX, y: 1.35, w: CW, h: 0.55, fontFace: BF, fontSize: 17, color: INK, margin: 0 });
const cw2 = (CW - 0.4) / 2;
// status quo card
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 2.1, w: cw2, h: 3.05, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 }, rectRadius: 0.08, shadow: shadow() });
s.addText("O STATUS QUO", { x: MX + 0.3, y: 2.32, w: cw2 - 0.6, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: NAVY, charSpacing: 2, margin: 0 });
s.addText([
  { text: "55% controlam as finanças em planilha ou caderno", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Só 20% usam um sistema digital", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "61% pagam a empresa com a conta pessoal", options: { bullet: true } }
], { x: MX + 0.3, y: 2.85, w: cw2 - 0.6, h: 2.0, fontFace: BF, fontSize: 14, color: INK, valign: "top", margin: 0 });
// sangria card
const c2 = MX + cw2 + 0.4;
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: c2, y: 2.1, w: cw2, h: 3.05, fill: { color: NAVY }, rectRadius: 0.08, shadow: shadow() });
s.addText("A SANGRIA (O CUSTO DO JEITO VELHO)", { x: c2 + 0.3, y: 2.32, w: cw2 - 0.6, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: EMER, charSpacing: 1, margin: 0 });
s.addText([
  { text: "Atraso de imposto: multa 0,33%/dia + juros", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "1,8 milhão de empresas excluídas do Simples por dívida (R$ 26,7 bi)", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Imposto pago a mais por enquadramento errado", options: { bullet: true } }
], { x: c2 + 0.3, y: 2.85, w: cw2 - 0.6, h: 2.0, fontFace: BF, fontSize: 14, color: ICE, valign: "top", margin: 0 });
s.addText("Fonte: SEBRAE (Hábitos Financeiros 2026) e Receita Federal.", { x: MX, y: 5.6, w: CW, h: 0.35, fontFace: BF, fontSize: 10, italic: true, color: MUTED, align: "center", margin: 0 });
footer(s, "Por que: vira a chave do concorrente — do líder para o STATUS QUO (planilha, caderno, prejuízo). Mercado maior e menos disputado. Como se comportar: agite a dor; o inimigo é o jeito velho e o dinheiro que ele queima, não um app rival.");

// ===================== SLIDE 3 — TAMANHO DO PRÊMIO =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Um mercado gigante e mal explorado", false);
const stats = [
  ["~16 mi", "empresas ativas no perfil que atendemos (de 24,2 mi no Brasil)"],
  ["60–75%", "das empresas encaixam nos CNAEs que atenderemos (setor = 82%)"],
  ["~5 mi", "pagam contabilidade no nosso perfil (de ~7,4 mi no Simples)"],
  ["~290 mil", "novas empresas por mês no nosso setor (de ~417 mil totais)"]
];
const sN = stats.length, sg = 0.3, swid = (CW - sg * (sN - 1)) / sN, sy = 1.75, shh = 2.4;
stats.forEach((st, i) => {
  const sx = MX + i * (swid + sg);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: sy, w: swid, h: shh, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 }, rectRadius: 0.08, shadow: shadow() });
  s.addText(st[0], { x: sx, y: sy + 0.32, w: swid, h: 1.0, fontFace: HF, fontSize: 40, bold: true, color: i === 1 ? EMER_D : NAVY, align: "center", margin: 0 });
  s.addText(st[1], { x: sx + 0.18, y: sy + 1.32, w: swid - 0.36, h: 0.95, fontFace: BF, fontSize: 13, color: MUTED, align: "center", valign: "top", margin: 0 });
});
s.addText([
  { text: "O líder tem ~50 mil clientes — ", options: { color: NAVY } },
  { text: "cerca de 1% do mercado no nosso perfil. Não está saturado.", options: { color: EMER_D, bold: true } }
], { x: MX, y: 4.45, w: CW, h: 0.55, fontFace: HF, fontSize: 20, align: "center", margin: 0 });
s.addText("Capturar uma fração desse mercado já é um negócio relevante.", { x: MX, y: 5.15, w: CW, h: 0.45, fontFace: BF, fontSize: 14, italic: true, color: INK, align: "center", margin: 0 });
s.addText("Fonte: Mapa de Empresas (gov.br) e Receita Federal, 2025 — recorte pelos CNAEs do perfil: estimativa aproximada sobre os dados oficiais.", { x: MX, y: 5.7, w: CW, h: 0.3, fontFace: BF, fontSize: 10, italic: true, color: MUTED, align: "center", margin: 0 });
s.addShape(pres.shapes.LINE, { x: MX + 2.5, y: 6.18, w: CW - 5.0, h: 0, line: { color: "E2E8F0", width: 1 } });
s.addText([
  { text: "Clientes autodeclarados (não auditados):  ", options: { bold: true, color: NAVY } },
  { text: "Contabilizei +50 mil · Agilize +50 mil · Facilite +5 mil · Contabilivre +2 mil · Contaja ~850 · Marvee +700 — ", options: { color: MUTED } },
  { text: "todos somados, menos de 1,5% do mercado pagante.", options: { bold: true, color: EMER_D } }
], { x: MX, y: 6.35, w: CW, h: 0.6, fontFace: BF, fontSize: 11, align: "center", valign: "top", margin: 0 });
footer(s, "Por que: dimensiona o prêmio e mostra penetração baixíssima. Como se comportar: ênfase no '82% é o nosso terreno' e no '<1% do líder' = espaço enorme. Pausa para o Mauro absorver o tamanho.");

// ===================== SLIDE 4 — NÃO REINVENTAR A RODA =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Não vamos reinventar a roda", false);
s.addText("Atendemos exatamente os CNAEs que a Contabilizei valida há 13 anos: serviço e comércio leve no Simples.", { x: MX, y: 1.35, w: CW, h: 0.7, fontFace: BF, fontSize: 17, color: INK, margin: 0 });
const wheel = [
  ["Modelo já provado", "por quem lidera o mercado há 13 anos — risco baixo"],
  ["60–75% das empresas", "encaixam nos CNAEs que atenderemos (setor serviço + comércio = 82%)"],
  ["Começo por BH/MG", "onde a Legalize já tem força e conhecimento"],
  ["Nossa vitória", "a mesma roda, só melhor: UX, clareza e preço"]
];
const wN = 2, wg = 0.4, wwid = (CW - wg) / 2, whh = 1.35, wy0 = 2.2;
wheel.forEach((w, i) => {
  const r = Math.floor(i / wN), c = i % wN;
  const wx = MX + c * (wwid + wg), wy = wy0 + r * (whh + 0.3);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: wx, y: wy, w: wwid, h: whh, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 }, rectRadius: 0.08, shadow: shadow() });
  s.addShape(pres.shapes.OVAL, { x: wx + 0.28, y: wy + whh / 2 - 0.17, w: 0.34, h: 0.34, fill: { color: EMER } });
  s.addText(w[0], { x: wx + 0.8, y: wy + 0.22, w: wwid - 1.05, h: 0.45, fontFace: HF, fontSize: 17, bold: true, color: NAVY, margin: 0 });
  s.addText(w[1], { x: wx + 0.8, y: wy + 0.68, w: wwid - 1.05, h: 0.55, fontFace: BF, fontSize: 12.5, color: MUTED, margin: 0 });
});
s.addText("Não precisamos inventar. Precisamos fazer melhor.", { x: MX, y: 5.4, w: CW, h: 0.5, fontFace: HF, fontSize: 19, bold: true, color: EMER_D, align: "center", margin: 0 });
footer(s, "Por que: este é o argumento central — a estratégia já é validada há 13 anos, reduz o risco percebido. Como se comportar: 'copiamos a régua de quem já venceu e otimizamos. É menos risco, não menos ambição.' Mostra disciplina, não preguiça.");

// ===================== SLIDE 5 — COMPARATIVO DE MERCADO =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Onde a gente se encaixa", false);
s.addText("Preço e entrega — o que o mercado oferece hoje", { x: MX, y: 1.28, w: CW, h: 0.35, fontFace: BF, fontSize: 13, italic: true, color: MUTED, margin: 0 });
const H = (t) => ({ text: t, options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 12.5, valign: "middle" } });
const C = (t, b) => ({ text: t, options: { color: INK, bold: !!b, fontSize: 12.5, valign: "middle" } });
const G = (t, b) => ({ text: t, options: { fill: { color: EMER_D }, color: WHITE, bold: !!b, fontSize: 12.5, valign: "middle" } });
const rows = [
  [H("Player"), H("Entrada / mês"), H("Como entrega"), H("Observação")],
  [C("Contabilizei", true), C("R$ 139 – 369"), C("Digital, escala por faturamento"), C("Líder · UX travada")],
  [C("Agilize", true), C("R$ 259"), C("Mensalidade fixa"), C("Certificado incluso")],
  [C("Facilite", true), C("R$ 199,90"), C("Digital + contador"), C("Modelo TouchTech")],
  [C("Legalize (LP atual)", true), C("R$ 99,90 – 699,90"), C("Conversão por WhatsApp"), C("Esboço, sem self-service")],
  [G("Legalize Digital (proposto)", true), G("faixa de mercado"), G("Digital-native, self-service"), G("Melhor UX + preço claro")]
];
s.addTable(rows, {
  x: MX, y: 1.7, w: CW, colW: [2.9, 2.0, 4.2, 3.03],
  rowH: [0.5, 0.55, 0.55, 0.55, 0.55, 0.62],
  fontFace: BF, valign: "middle", border: { type: "solid", pt: 1, color: "E2E8F0" }, fill: { color: WHITE }
});
s.addText("A LP atual (R$ 99,90) prova a intenção — mas falta produto e uma estrutura de preço com lógica. É o que vamos construir.", { x: MX, y: 5.5, w: CW, h: 0.5, fontFace: BF, fontSize: 12, italic: true, color: MUTED, margin: 0 });
footer(s, "Por que: comparação visual de preço × entrega; mostra o espaço claro (UX + transparência). Como se comportar: trate a LP atual como PONTO DE PARTIDA do próprio Mauro, não como crítica — 'a intenção sempre esteve certa; agora fazemos com produto e dado'.");

// ===================== SLIDE 6 — A VANTAGEM (LEGALIZE ENGINE) =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Por que, com a gente, sai do papel", false);
s.addText("A maioria das startups do setor queimou milhões montando a estrutura contábil. A Legalize já tem ela pronta.", { x: MX, y: 1.4, w: CW, h: 0.7, fontFace: BF, fontSize: 17, color: INK, margin: 0 });
const adv = [
  ["22 anos", "de expertise contábil consolidada"],
  ["Compliance pronto", "contador responsável (CRC) e obrigações"],
  ["Base de apoio", "conhecimento e operação no início das vendas"]
];
const aN = adv.length, ag = 0.35, awid = (CW - ag * (aN - 1)) / aN, ay = 2.45, ahh = 1.7;
adv.forEach((a, i) => {
  const ax = MX + i * (awid + ag);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ax, y: ay, w: awid, h: ahh, fill: { color: NAVY }, rectRadius: 0.08, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: ax, y: ay, w: awid, h: 0.09, fill: { color: EMER } });
  s.addText(a[0], { x: ax + 0.22, y: ay + 0.25, w: awid - 0.44, h: 0.5, fontFace: HF, fontSize: 19, bold: true, color: WHITE, margin: 0 });
  s.addText(a[1], { x: ax + 0.22, y: ay + 0.82, w: awid - 0.44, h: 0.8, fontFace: BF, fontSize: 13, color: ICE, margin: 0 });
});
s.addText("“Eles gastaram bilhões montando o que a gente já tem.”", { x: MX, y: 4.5, w: CW, h: 0.6, fontFace: HF, fontSize: 21, bold: true, italic: true, color: EMER_D, align: "center", margin: 0 });
s.addText("A Legalize é a sala de máquinas — é ela que nos permite ter clientes pagando no 3º mês, antes do app ficar pronto. O produto é 100% digital.", { x: MX, y: 5.25, w: CW, h: 0.55, fontFace: BF, fontSize: 13, italic: true, color: MUTED, align: "center", margin: 0 });
footer(s, "Por que: de-risca o negócio com o ativo do próprio Mauro. Como se comportar: valorize a Legalize como ENGINE (não fachada física vendida ao cliente) — 'a parte mais cara e arriscada já existe; é isso que nos permite vender no 3º mês, antes do app pronto, e nascer baratos e seguros'.");

// ===================== SLIDE 7 — CONSTRUIR ASSIM vs COMPRAR FORA =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Por que construir assim — e não comprar fora", false);
s.addText("O que o mercado cobra para construir um produto desses em 5 meses (dados públicos, 2026)", { x: MX, y: 1.28, w: CW, h: 0.35, fontFace: BF, fontSize: 13, italic: true, color: MUTED, margin: 0 });
const H7 = (t) => ({ text: t, options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 12, valign: "middle" } });
const L7 = (t) => ({ text: t, options: { fill: { color: LIGHT }, color: NAVY, bold: true, fontSize: 11.5, valign: "middle" } });
const C7 = (t) => ({ text: t, options: { color: INK, fontSize: 11.5, valign: "middle" } });
const G7 = (t) => ({ text: t, options: { fill: { color: EMER_D }, color: WHITE, bold: true, fontSize: 11.5, valign: "middle" } });
const rows7 = [
  [H7(""), H7("Software house"), H7("Squad CLT própria"), H7("Nosso modelo")],
  [L7("Custo de mercado (5 meses)"), C7("R$ 90 – 184 mil"), C7("R$ 190 – 330 mil"), G7("abaixo do piso — na conversa")],
  [L7("Valida demanda antes de gastar?"), C7("Não — constrói direto"), C7("Não — constrói direto"), G7("Sim — gate de decisão no meio")],
  [L7("Conhecimento do produto"), C7("Vai embora no fim + manutenção eterna (R$ 3–8 mil/mês)"), C7("Fica na empresa"), G7("Fica na empresa")],
  [L7("Camada contábil / compliance"), C7("Teria que montar do zero"), C7("Teria que montar do zero"), G7("Legalize — pronta há 22 anos")]
];
s.addTable(rows7, {
  x: MX, y: 1.75, w: CW, colW: [3.13, 3.2, 2.9, 2.9],
  rowH: [0.48, 0.62, 0.62, 0.78, 0.62],
  fontFace: BF, valign: "middle", border: { type: "solid", pt: 1, color: "E2E8F0" }, fill: { color: WHITE }
});
s.addText("Construção externa custa mais, valida menos e leva o conhecimento embora.", { x: MX, y: 5.15, w: CW, h: 0.45, fontFace: HF, fontSize: 17, bold: true, color: EMER_D, align: "center", margin: 0 });
s.addText("Fontes: Forja de Sistemas, Robert Half, guias salariais de tecnologia 2026.", { x: MX, y: 5.7, w: CW, h: 0.3, fontFace: BF, fontSize: 10, italic: true, color: MUTED, align: "center", margin: 0 });
footer(s, "Por que: é o anti-guru com tabela — âncora os preços DO MERCADO sem abrir o nosso número. Como se comportar: deixe o Mauro ler as faixas; se perguntar o custo, responda de viva voz: 'nosso caminho completo fica abaixo do piso disso — e o primeiro passo é uma fração'.");

// ===================== SLIDE 8 — O CAMINHO GATEADO =====================
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: PH, fill: { color: EMER } });
s.addText("O caminho até o mercado — por fases que se destravam", { x: 1.0, y: 0.5, w: 11.5, h: 0.85, fontFace: HF, fontSize: 30, bold: true, color: WHITE, margin: 0 });
const path8 = [
  ["Mês 1", "Imersão na operação — aprender por dentro o que vira produto", false],
  ["Mês 2", "Termômetro de mercado — pesquisa real + intenção de pagar, sem construir nada ainda", false],
  ["GATE", "Decisão conjunta go/no-go — critérios definidos ANTES, lidos juntos", true],
  ["Mês 3", "Primeiras vendas reais — clientes fundadores (vagas limitadas), a operação Legalize entrega enquanto o app cresce", false],
  ["Mês 5–6", "MVP sólido no ar — o cliente opera 100% no app", false]
];
let ly8 = 1.62;
path8.forEach((p) => {
  if (p[2]) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.88, y: ly8 - 0.14, w: 11.6, h: 0.62, fill: { color: NAVY2 }, line: { color: EMER, width: 1.5 }, rectRadius: 0.08 });
  }
  s.addShape(pres.shapes.OVAL, { x: 1.06, y: ly8 + 0.05, w: 0.2, h: 0.2, fill: { color: EMER } });
  s.addText([
    { text: p[0] + "  —  ", options: { bold: true, color: EMER } },
    { text: p[1], options: { color: p[2] ? WHITE : ICE, bold: p[2] } }
  ], { x: 1.45, y: ly8 - 0.08, w: 10.9, h: 0.55, fontFace: BF, fontSize: 15, margin: 0 });
  ly8 += 0.74;
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 5.4, w: 11.3, h: 0.75, fill: { color: NAVY2 }, line: { color: EMER, width: 1.5 }, rectRadius: 0.1 });
s.addText("Nenhuma fase começa sem a anterior provar que merece. É assim que o risco fica controlado.", { x: 1.0, y: 5.4, w: 11.3, h: 0.75, fontFace: HF, fontSize: 17, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
footer(s, "Por que: o gate É a mensagem — risco controlado por desenho, o oposto do guru dos R$200k adiantados. Como se comportar: 'a gente define os critérios juntos ANTES do teste; se der vermelho, paramos e você economizou o grosso'. Custo e sociedade: viva voz, se ele perguntar.");

// ===================== SLIDE 9 — OS PRIMEIROS 30 DIAS =====================
s = pres.addSlide();
s.background = { color: WHITE };
title(s, "Os primeiros 30 dias — dentro da Legalize", false);
s.addText("Semana a semana, cada uma com entregável. É a imersão do mês 1 — e ela começa amanhã.", { x: MX, y: 1.35, w: CW, h: 0.5, fontFace: BF, fontSize: 16, color: INK, margin: 0 });
const weeks = [
  ["S1", "Raio-X da operação", "como um cliente ME é atendido hoje, ponta a ponta — mapa com tempos e responsáveis"],
  ["S2", "Fronteira da automação", "o que o software resolve × o que exige o contador — mapa + ganhos rápidos internos"],
  ["S3", "Clientes na pele", "rotina real de 3–5 clientes acompanhada de perto — dores que viram produto"],
  ["S4", "Spec + critérios do gate", "escopo do produto + termômetro do mês 2 pronto + critérios de decisão acordados"]
];
const wN9 = 2, wg9 = 0.4, wwid9 = (CW - wg9) / 2, whh9 = 1.5, wy9 = 2.05;
weeks.forEach((w, i) => {
  const r = Math.floor(i / wN9), c = i % wN9;
  const wx = MX + c * (wwid9 + wg9), wy = wy9 + r * (whh9 + 0.3);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: wx, y: wy, w: wwid9, h: whh9, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 }, rectRadius: 0.08, shadow: shadow() });
  s.addShape(pres.shapes.OVAL, { x: wx + 0.26, y: wy + whh9 / 2 - 0.26, w: 0.52, h: 0.52, fill: { color: NAVY } });
  s.addText(w[0], { x: wx + 0.26, y: wy + whh9 / 2 - 0.26, w: 0.52, h: 0.52, fontFace: HF, fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
  s.addText(w[1], { x: wx + 0.95, y: wy + 0.2, w: wwid9 - 1.2, h: 0.45, fontFace: HF, fontSize: 16, bold: true, color: NAVY, margin: 0 });
  s.addText(w[2], { x: wx + 0.95, y: wy + 0.65, w: wwid9 - 1.2, h: 0.75, fontFace: BF, fontSize: 12, color: MUTED, margin: 0 });
});
s.addText("Em 30 dias você sabe exatamente o que da sua operação vira produto — e o que não vira.", { x: MX, y: 5.5, w: CW, h: 0.5, fontFace: HF, fontSize: 18, bold: true, color: EMER_D, align: "center", margin: 0 });
footer(s, "Por que: é o slide do aperto de mão — processo concreto que começa AMANHÃ, sem pedir nada além de acesso. Como se comportar: feche aqui os 3 acordos verbais — remuneração da fase 0, princípio societário (term sheet na semana) e critérios do gate definidos juntos.");

pres.writeFile({ fileName: "Legalize-Digital-Proposta.pptx" }).then(f => console.log("OK:", f));
