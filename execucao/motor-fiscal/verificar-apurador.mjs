/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 O TESTE DOURADO — o motor contra a conta real da persona zero.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/motor-fiscal/verificar-apurador.mjs`
 *
 * 🔑 **Nenhum caso aqui é inventado.** Cada um traz o documento de onde o
 * número saiu: recibo do PGDAS-D emitido pela Receita, ou nota fiscal
 * emitida de verdade. Caso sem documento não entra — é a regra anti-guru do
 * vault aplicada a teste: número sem fonte não vira expectativa.
 *
 * ⚠️ **O que este teste NÃO prova.** A persona zero é unipessoal · Anexo III
 * · 1 nota/mês · sem funcionário · faixa 1. Ficam mudos: Anexo V, faixas 2 a
 * 6, folha de colaborador, empresa estourando o teto. Ausência de
 * evidência não é ausência de requisito.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { apurarDAS, fatorR, fatorRDeCompetencias, anualiza, rbt12De, retencaoLegitima, anexoDoCnae, vencimentoDe, custoTotalMensal, darfDoProLabore, brl, emCentavos, LACUNAS, RESOLVIDAS } from "./apurador.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * OS CASOS REAIS
 * ═══════════════════════════════════════════════════════════════════════════ */

const CASOS = [
  {
    id: "G1",
    nome: "DAS de ago/2026 — a guia inteira, tributo a tributo",
    fonte:
      "Recibo oficial do PGDAS-D, Receita Federal · transmissão 01/09/2026 07:35:17 · recibo 01.07.26244.0049312-9",
    entrada: { receitaMes: 7910, rbt12: 43910, anexo: "III" },
    esperado: {
      total: 47459, // R$ 474,59 — o "Total do Débito Declarado" do recibo
      parcelas: {
        irpj: 1898,
        csll: 1661,
        cofins: 6084,
        pis: 1319,
        cpp: 20598,
        iss: 15899,
      },
    },
    porque:
      "🔴 É O CASO QUE FUNDA O MOTOR. 7.910 × 6% = 474,60, e a Receita cobra 474,59. O centavo some no arredondamento das partes, não do produto.",
  },
  {
    id: "G1b",
    nome: "DAS de fev, mar e abr/2026 — o CONTROLE do experimento",
    fonte: "Recibos do PGDAS-D das 3 competências · transmissões 01/03, 01/04 e 01/05 de 2026",
    entrada: { receitaMes: 12000, rbt12: 54000, anexo: "III" },
    esperado: { total: 72000 }, // R$ 720,00 — e o produto direto TAMBÉM dá 720,00
    porque:
      "🔬 É O CONTROLE, e é ele que transforma o achado em experimento. Aqui `12.000 × 6% = 720,00` e a guia TAMBÉM é 720,00 — as duas contas coincidem. Se o motor só soubesse 'tirar um centavo', erraria aqui. Em valor redondo não há resto a perder; em valor quebrado (o G1) o arredondamento por tributo aparece. Mesma regra, dois comportamentos, os dois certos.",
  },
  {
    id: "G2",
    nome: "ISS da nota 6 (set/2026) — confirmação independente",
    fonte: "NFS-e nº 6 emitida em 12/09/2026, valor do ISS impresso na própria nota",
    entrada: { receitaMes: 9895, rbt12: 43910, anexo: "III" },
    esperado: { parcelas: { iss: 19889 } }, // R$ 198,89
    porque:
      "Prova o mesmo comportamento numa competência diferente e num documento diferente: 9.895 × 6% = 593,70, e 593,70 × 33,50% = 198,8895 → 198,89.",
  },
  {
    id: "G3",
    nome: "Fator R da persona zero — anualizado × cru",
    fonte:
      "Série oficial: receita do PGDAS-D por competência + pró-labore reconstruído das DCTFWeb (INSS segurado ÷ 11%)",
    tipo: "fator-r",
    esperado: { crua: 16564, anualizada: 22085.33, anexoCru: "III", anexoAnual: "III" },
    porque:
      "🔴 ACHADO DE 14/09, e ele CORRIGE a nota de 13/09. Aquela nota dizia que esta empresa provava a virada de anexo (anualizado 29,6% → III · cru 22,2% → V), e avisava na própria linha: *'a conta assume pró-labore de fevereiro = R$3.360 e dezembro/janeiro = 0, porque o histórico da plataforma só devolve 6 meses'*. As DCTFWeb corrigiram a série no dia seguinte (dez/25 R$100 · fev R$3.260), e com os números certos a empresa é **Anexo III pelos dois métodos** (cru 37,7% · anualizado 50,3%). 🔑 A REGRA continua valendo — quem anualiza só a receita joga o recém-aberto no Anexo V sem merecer — mas **a persona zero NÃO é a prova dela**. A virada entra na lista do que este caso não prova.",
  },
];

/* 🆕 14/09 — o RBT12 proporcional, agora que a regra foi lida em fonte primária. */
const CASO_RBT12 = {
  id: "G4",
  nome: "RBT12 proporcional de ago/2026 — a regra do art. 24",
  fonte:
    "Res. CGSN 140/2018 art. 24 caput e inciso I, lida em fonte primária em 14/09 · pesquisa literal em pesquisa/fontes/2026-09-14-lacunas-motor-fiscal-LITERAL.md",
  esperado: { rbt12: 54000, meses: 8, soma: 36000, media: 4500, faixa: 1, efetiva: 0.06 },
  porque:
    "🔴 A EMPRESA ESTÁ NO 9º MÊS, então o RBT12 NÃO é a soma dos 12 — é a média dos 8 meses anteriores × 12. E os três meses zerados (mai, jun, jul) ENTRAM no divisor: tirá-los daria média de 7.200 e RBT12 de 86.400, inflando a faixa e fazendo o cliente pagar a maior.",
};

/* A série oficial da persona zero, dez/25 a ago/26. */
const SERIE = {
  receita: [0, 0, 12000, 12000, 12000, 0, 0, 0, 7910],
  prolabore: [100, 0, 3260, 3360, 3360, 1621, 1621, 1621, 1621],
  meses: ["dez/25", "jan/26", "fev", "mar", "abr", "mai", "jun", "jul", "ago"],
};

/* ═══════════════════════════════════════════════════════════════════════════
 * A CORRIDA
 * ═══════════════════════════════════════════════════════════════════════════ */

let passou = 0;
let falhou = 0;
const erros = [];

function confere(rotulo, obtido, esperado) {
  if (obtido === esperado) {
    passou++;
    return `   ✅ ${rotulo.padEnd(34)} ${brl(obtido)}`;
  }
  falhou++;
  const delta = obtido - esperado;
  erros.push(`${rotulo}: esperado ${brl(esperado)}, obtido ${brl(obtido)} (${delta > 0 ? "+" : ""}${delta} centavos)`);
  return `   ❌ ${rotulo.padEnd(34)} ${brl(obtido)}  ← esperado ${brl(esperado)}`;
}

console.log("\n🧪 MOTOR FISCAL — teste dourado contra a conta real da persona zero\n");
console.log("   BERG CONSULTORIA EM MARKETING · CNPJ 64.037.271/0001-02");
console.log("   ME · Simples · Anexo III · unipessoal · BH · aberta em 12/12/2025\n");

for (const caso of CASOS) {
  console.log(`── ${caso.id} · ${caso.nome}`);
  console.log(`   fonte: ${caso.fonte}`);

  if (caso.tipo === "fator-r") {
    // A janela é o que existe: 9 competências, não 12.
    const receita12 = SERIE.receita.reduce((a, b) => a + b, 0);
    const folhaCrua = SERIE.prolabore.reduce((a, b) => a + b, 0);
    const folhaAnualizada = anualiza(SERIE.prolabore);

    const cru = fatorR({ folhaPaga12: folhaCrua, receita12 });
    const anual = fatorR({ folhaPaga12: folhaAnualizada, receita12 });

    console.log(`   receita acumulada ......... ${brl(emCentavos(receita12))}`);
    console.log(`   folha CRUA ................ ${brl(emCentavos(folhaCrua))}`);
    console.log(`   folha ANUALIZADA (×12) .... ${brl(emCentavos(folhaAnualizada))}`);
    console.log(`   Fator R cru ............... ${(cru.fr * 100).toFixed(1)}%  → Anexo ${cru.anexo}`);
    console.log(`   Fator R anualizado ........ ${(anual.fr * 100).toFixed(1)}%  → Anexo ${anual.anexo}`);

    console.log(confere("folha crua", emCentavos(folhaCrua), emCentavos(caso.esperado.crua)));
    console.log(confere("folha anualizada", emCentavos(folhaAnualizada), emCentavos(caso.esperado.anualizada)));

    if (cru.anexo === caso.esperado.anexoCru && anual.anexo === caso.esperado.anexoAnual) {
      passou++;
      console.log("   ✅ os dois métodos caem no Anexo III — esta empresa NÃO exercita a virada");
    } else {
      falhou++;
      erros.push(`G3: anexos esperados ${caso.esperado.anexoCru}/${caso.esperado.anexoAnual}, obtidos ${cru.anexo}/${anual.anexo}`);
      console.log(`   ❌ esperado ${caso.esperado.anexoCru}/${caso.esperado.anexoAnual}, obtido ${cru.anexo}/${anual.anexo}`);
    }
    console.log(`   ${caso.porque}\n`);
    continue;
  }

  const r = apurarDAS(caso.entrada);

  if (caso.esperado.parcelas) {
    for (const [t, v] of Object.entries(caso.esperado.parcelas)) {
      console.log(confere(t.toUpperCase(), r.parcelas[t], v));
    }
  }
  if (caso.esperado.total !== undefined) {
    console.log("   ─────────────────────────────────────────────");
    console.log(confere("TOTAL da guia", r.total, caso.esperado.total));
    console.log(`   ℹ️  produto direto (NÃO é a guia)   ${brl(r.bruto)}  ← a diferença é o achado`);
  }
  console.log(`   ${caso.porque}\n`);
}

/* ═══════════════════════════════════════════════════════════════════════════
 * O QUE O MOTOR AINDA NÃO SABE
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── G4 · o RBT12 proporcional ─────────────────────────────────────────── */
{
  const c = CASO_RBT12;
  console.log(`── ${c.id} · ${c.nome}`);
  console.log(`   fonte: ${c.fonte}`);

  // Ago/26 é o 9º mês. Os ANTERIORES são dez/25 a jul/26 — 8 meses.
  const anteriores = SERIE.receita.slice(0, 8);
  const r = rbt12De({ serieAnterior: anteriores });

  console.log(`   meses anteriores .......... ${r.meses}  (${SERIE.meses.slice(0, 8).join(" · ")})`);
  console.log(confere("soma das receitas", emCentavos(r.soma), emCentavos(c.esperado.soma)));
  console.log(confere("média mensal", emCentavos(r.media), emCentavos(c.esperado.media)));
  console.log(confere("RBT12 proporcional", emCentavos(r.rbt12), emCentavos(c.esperado.rbt12)));

  const das = apurarDAS({ receitaMes: 7910, rbt12: r.rbt12, anexo: "III" });
  if (das.faixa === c.esperado.faixa && Math.abs(das.efetiva - c.esperado.efetiva) < 1e-9) {
    passou++;
    console.log(`   ✅ faixa ${das.faixa} · alíquota efetiva ${(das.efetiva * 100).toFixed(2)}%`);
  } else {
    falhou++;
    erros.push(`G4: faixa/alíquota esperadas ${c.esperado.faixa}/6,00%, obtidas ${das.faixa}/${(das.efetiva * 100).toFixed(2)}%`);
    console.log(`   ❌ faixa ${das.faixa} · ${(das.efetiva * 100).toFixed(2)}%`);
  }
  console.log(confere("e o DAS continua", das.total, 47459));

  // O contraste que prova a armadilha: excluir os meses zerados.
  const semZeros = anteriores.filter((v) => v > 0);
  const errado = rbt12De({ serieAnterior: semZeros });
  console.log(`   ⚠️  se os meses zerados saíssem do divisor: RBT12 ${brl(emCentavos(errado.rbt12))} — ${((errado.rbt12 / r.rbt12 - 1) * 100).toFixed(0)}% a mais`);
  console.log(`   ${c.porque}\n`);
}

/* ── G5 · ISS retido ───────────────────────────────────────────────────── */
{
  console.log("── G5 · ISS retido pelo tomador — a segregação");
  console.log("   fonte: LC 123/2006 art. 21 §4º (literal) · LC 116/2003 art. 3º · Lei Municipal BH 8.725/2003");

  const semRet = apurarDAS({ receitaMes: 7910, rbt12: 54000, anexo: "III" });
  const comRet = apurarDAS({ receitaMes: 7910, rbt12: 54000, anexo: "III", receitaComIssRetido: 7910 });

  console.log(`   DAS sem retenção .......... ${brl(semRet.total)}   (ISS ${brl(semRet.parcelas.iss)} dentro)`);
  console.log(`   DAS com retenção total .... ${brl(comRet.total)}   (ISS ${brl(comRet.parcelas.iss)} dentro)`);
  console.log(`   ISS recolhido pelo tomador  ${brl(comRet.issRetido)}`);

  const fechaSoma = comRet.total + comRet.issRetido === semRet.total;
  if (fechaSoma && comRet.parcelas.iss === 0) {
    passou++;
    console.log("   ✅ o ISS sai do DAS e reaparece na guia municipal, sem sumir nem duplicar");
  } else {
    falhou++;
    erros.push(`G5: ${brl(comRet.total)} + ${brl(comRet.issRetido)} deveria dar ${brl(semRet.total)}`);
    console.log(`   ❌ a soma não fecha: ${brl(comRet.total)} + ${brl(comRet.issRetido)} ≠ ${brl(semRet.total)}`);
  }

  console.log(`   ℹ️  a pesquisa diz ${brl(31561)}; o motor diz ${brl(comRet.total)}. O motor está certo:`);
  console.log("       ela fez 474,60 × 66,50%, que é o método JÁ REFUTADO pelo recibo do G1.");
  console.log("       A segregação não muda a regra de arredondamento, e a LC 123 art. 21 §4º é");
  console.log("       literal em dizer que ela atinge só 'a base de cálculo do ISS devido'.");

  // A legitimidade da retenção, que é o que quase ninguém checa.
  const fora = retencaoLegitima({ municipioTomador: "Contagem", naturezaTomador: "empresa", atividade: "consultoria" });
  const bhPub = retencaoLegitima({ municipioTomador: "BH", naturezaTomador: "empresa", atividade: "agencia-de-publicidade" });
  const bhComum = retencaoLegitima({ municipioTomador: "BH", naturezaTomador: "empresa", atividade: "consultoria" });

  console.log(`\n   tomador em Contagem, consultoria ......... ${fora.legitima ? "retém" : "NÃO deveria reter"}`);
  console.log(`   tomador em BH, agência de publicidade .... ${bhPub.legitima ? "RETÉM (art. 24)" : "não retém"}`);
  console.log(`   tomador em BH, empresa comum ............. ${bhComum.legitima ? "retém" : "não retém"}`);

  if (!fora.legitima && bhPub.legitima && !bhComum.legitima) {
    passou++;
    console.log("   ✅ os três casos batem com a LC 116 art. 3º e a lei municipal");
  } else {
    falhou++;
    erros.push("G5: a régua de legitimidade da retenção não bate");
    console.log("   ❌ a régua de legitimidade não bate");
  }
  console.log("");
}

/* ── G6 · o mês 1, e a virada de exercício ─────────────────────────────── */
{
  console.log("── G6 · A guia do MÊS 1 — e ela não sabe que mês do calendário é");
  console.log("   fonte: PGDAS-D de 12/2025 (transmissão 09/01/2026 11:39) e de 01/2026 (21/01/2026 16:18)");

  // Mês 1 da persona zero: dez/2025, receita zero. A guia real é R$ 0,00.
  const mes1 = apurarDAS({ receitaMes: 0, rbt12: 0, anexo: "III" });
  console.log(confere("mês 1 (dez/25, sem receita)", mes1.total, 0));

  // Mês 1 hipotético COM receita, pra exercitar a regra do art. 24 caput.
  const r1 = rbt12De({ serieAnterior: [], receitaMesCorrente: 10000 });
  const das1 = apurarDAS({ receitaMes: 10000, rbt12: r1.rbt12, anexo: "III" });
  console.log(`   mês 1 com R$10.000 ........ RBT12 ${brl(emCentavos(r1.rbt12))} (regra "${r1.regra}") · faixa ${das1.faixa}`);
  console.log(confere("DAS do mês 1", das1.total, 60000));

  // 🔴 A VIRADA DE EXERCÍCIO. Empresa aberta em dezembro: o 2º mês é janeiro,
  // e o RBT12 NÃO reinicia. A janela é móvel, não do ano-calendário.
  const jan = rbt12De({ serieAnterior: [10000] }); // só dez/25 como anterior
  const esperadoJan = 120000;
  console.log(confere("2º mês (janeiro!)", emCentavos(jan.rbt12), emCentavos(esperadoJan)));

  if (jan.regra === "proporcional" && jan.meses === 1) {
    passou++;
    console.log("   ✅ janeiro é só 'o 2º mês' — a virada de ano não zera nada");
  } else {
    falhou++;
    erros.push("G6: a virada de exercício mexeu no RBT12 e não deveria");
    console.log("   ❌ a virada de exercício mexeu no RBT12");
  }
  console.log("   🔑 O motor não tem noção de ano-calendário. Empresa aberta em MARÇO e empresa");
  console.log("      aberta em DEZEMBRO percorrem o mesmo código; o que muda é só o tamanho da");
  console.log("      série anterior. Era o medo do item 47 (o Fator R zerando em 1º de janeiro).\n");
}

/* ── G7 · Fator R em regime de CAIXA ───────────────────────────────────── */
{
  console.log("── G7 · Fator R em regime de CAIXA — declarado ≠ pago");
  console.log("   fonte: Res. CGSN 140/2018 art. 26 §6º · SC COSIT 17/2021 e 251/2024");

  // Cenário real da persona zero: tudo declarado E pago.
  const reais = SERIE.meses.map((mes, i) => ({
    mes,
    receita: SERIE.receita[i],
    proLaboreDeclarado: SERIE.prolabore[i],
    proLaborePago: SERIE.prolabore[i],
  }));
  const ok = fatorRDeCompetencias({ competencias: reais });
  console.log(`   persona zero (tudo pago) .. FR ${(ok.fr * 100).toFixed(1)}% → Anexo ${ok.anexo} · risco de glosa: ${ok.riscoDeGlosa ? "SIM" : "não"}`);

  // O mesmo caso, mas com 4 competências declaradas e NÃO pagas.
  const comBuraco = reais.map((c, i) =>
    i >= 5 ? { ...c, proLaborePago: 0 } : c
  );
  const risco = fatorRDeCompetencias({ competencias: comBuraco });
  console.log(`   se mai-ago não tiver saído .. FR ${(risco.fr * 100).toFixed(1)}% → Anexo ${risco.anexo}`);
  console.log(`   ⚠️  o mesmo caso contando o DECLARADO daria ${(risco.frSeContasseDeclarado * 100).toFixed(1)}% → Anexo III`);
  console.log(`   🔴 competências em risco de glosa: ${risco.competenciasEmRisco.join(", ")} · R$ ${risco.naoPago.toLocaleString("pt-BR")} declarados e não pagos`);

  if (ok.riscoDeGlosa === false && risco.riscoDeGlosa === true && risco.anexo === "V" && ok.anexo === "III") {
    passou++;
    console.log("   ✅ o regime de caixa muda o ANEXO, e o motor avisa antes da Receita avisar");
  } else {
    falhou++;
    erros.push(`G7: esperado III sem risco e V com risco; obtido ${ok.anexo}/${risco.anexo}`);
    console.log(`   ❌ esperado III→V, obtido ${ok.anexo}→${risco.anexo}`);
  }
  console.log("   🔑 Contar declarado como pago infla o Fator R e segura a empresa no Anexo III");
  console.log("      indevidamente. Quando a Receita cruza EFD-Reinf com DCTFWeb: glosa,");
  console.log("      reclassificação de ofício, recálculo de TODAS as competências, Selic e");
  console.log("      multa de 75% (Lei 9.430/96 art. 44 I).");
  console.log("   ⚠️  O motor SABE USAR 'foi pago'; ele não sabe DESCOBRIR. Sem conciliação");
  console.log("      (decisão 31), a via é o cliente declarar — com a Carta CFC carregando.\n");
}

/* ── G8 · ANEXO V, enfim ───────────────────────────────────────────────── */
{
  console.log("── G8 · Anexo V faixa 1 — a gangorra do Fator R, em número");
  console.log("   fonte: calculadora oficial da Contabilizei (planilha), lida em 14/09");

  const RBT12 = 144000; // faturamento médio anual da planilha
  const MES = 12000;

  const comFatorR = apurarDAS({ receitaMes: MES, rbt12: RBT12, anexo: "III" });
  const semFatorR = apurarDAS({ receitaMes: MES, rbt12: RBT12, anexo: "V" });

  console.log(confere("DAS Anexo III (6,00%)", comFatorR.total, 72000));
  console.log(confere("DAS Anexo V (15,50%)", semFatorR.total, 186000));

  // O pró-labore de 28% que compra o Anexo III, e o INSS que ele cobra.
  const proLabore = 0.28 * MES;
  const custoIII = custoTotalMensal({ receitaMes: MES, das: comFatorR.total, proLabore });
  const custoV = custoTotalMensal({ receitaMes: MES, das: semFatorR.total, proLabore: 1621 });

  console.log(`   pró-labore de 28% ......... ${brl(emCentavos(proLabore))}`);
  console.log(confere("INSS sobre ele (11%)", custoIII.inss, 36960));
  console.log(confere("IRRF (tabela da página)", custoIII.irrf, 5440));
  console.log(`   custo total no Anexo III .. ${brl(custoIII.total)}  (${(custoIII.aliquotaTotal * 100).toFixed(2)}%)`);
  console.log(`   custo total no Anexo V .... ${brl(custoV.total)}  (${(custoV.aliquotaTotal * 100).toFixed(2)}%)`);
  console.log(`   💰 a diferença ............ ${brl(custoV.total - custoIII.total)}/mês`);

  console.log("   🔑 A planilha compara CUSTO TOTAL, não DAS com DAS — porque subir o pró-labore");
  console.log("      pra ganhar o Anexo III AUMENTA o INSS. É a gangorra em número.");
  console.log("   🔴 E A PLANILHA DELES DISCORDA DA PLATAFORMA DELES no IRRF: ela diz R$93,76");
  console.log("      (dedução 354,80, pré-2023), a plataforma diz R$54,40 (dedução 394,16).");
  console.log("      Decisão do Pedro em 14/09: vale a PÁGINA, a planilha é mais antiga. Ela");
  console.log("      também usa piso de R$998, que é o salário mínimo de 2020.\n");
}

/* ── G10 · a tabela do IRRF, e o DARF Unificado ────────────────────────── */
{
  console.log("── G10 · IRRF do pró-labore — e o INSS sai ANTES");
  console.log('   fonte: modal "Tabela do IRRF" na plataforma do líder, conta real, 14/09');

  // O caso da persona zero: pró-labore no salário mínimo, IRRF zero.
  const zero = darfDoProLabore(1621);
  console.log(`   pró-labore R$1.621 ........ INSS ${brl(zero.inss)} · base ${brl(zero.baseIrrf)} · IRRF ${brl(zero.irrf)}`);
  console.log(confere("INSS da persona zero", zero.inss, 17831));
  console.log(confere("IRRF da persona zero", zero.irrf, 0));

  // O caso da planilha: 28% de 12.000.
  const alto = darfDoProLabore(3360);
  console.log(`   pró-labore R$3.360 ........ INSS ${brl(alto.inss)} · base ${brl(alto.baseIrrf)} · IRRF ${brl(alto.irrf)}`);
  console.log(confere("base do IRRF", alto.baseIrrf, 299040));
  console.log(confere("IRRF a 15%", alto.irrf, 5440));

  if (zero.isento && !alto.isento) {
    passou++;
    console.log("   ✅ o piso é isento e o de 28% não é — a faixa vira no meio da nossa persona");
  } else {
    falhou++;
    erros.push("G10: a isenção não está virando onde deveria");
    console.log("   ❌ a isenção não virou onde deveria");
  }

  console.log("   🔑 O INSS sai PRIMEIRO e vira dedução da base do IRRF. Quem calcula o IRRF");
  console.log("      sobre o pró-labore bruto cobra imposto a mais do sócio.");
  console.log("   ⚠️  A tabela é 🟡 (tela de concorrente). E resta a pergunta da Lei 15.270/2025:");
  console.log("      se a isenção de 2026 é R$5.000/mês, ou a tabela venceu, ou existe um");
  console.log("      REDUTOR que convive com ela. São coisas diferentes — lacuna L6.\n");
}

/* ── G9 · o anexo antes do cálculo, e o calendário ─────────────────────── */
{
  console.log("── G9 · Os 3 grupos de anexo, e o calendário por tributo");
  console.log("   fonte: Manual PGDAS-D + cnae-matriz.json · produto/_matriz-dependencia.md");

  const fixo = anexoDoCnae("III-fixo");
  const dinamico = anexoDoCnae("fator-r-dinamico(III<->V, limiar 28%)");

  console.log(`   CNAE III-fixo (65 dos 87) . anexo ${fixo.anexo} · calcula Fator R: ${fixo.calculaFatorR}`);
  console.log(`   CNAE dinâmico (15 dos 87) . anexo ${dinamico.anexo ?? "depende"} · calcula Fator R: ${dinamico.calculaFatorR}`);

  if (fixo.anexo === "III" && fixo.calculaFatorR === false && dinamico.calculaFatorR === true) {
    passou++;
    console.log("   ✅ o motor só roda Fator R em 15 de 87 — e a tela não fala de Fator R pros outros");
  } else {
    falhou++;
    erros.push("G9: os grupos de anexo não estão sendo lidos certo");
    console.log("   ❌ os grupos não batem");
  }

  // 🔴 O mesmo mês, dois vencimentos diferentes. Competência 08/2026 → setembro.
  const das = vencimentoDe({ competencia: { ano: 2026, mes: 8 }, tributo: "das" });
  const darf = vencimentoDe({ competencia: { ano: 2026, mes: 8 }, tributo: "darf" });
  const dia = (v) => v.data.getUTCDate();

  console.log(`\n   competência 08/2026 → DAS vence dia ${dia(das)} (${das.regra}) · DARF dia ${dia(darf)} (${darf.regra})`);

  if (dia(das) === 21 && dia(darf) === 18) {
    passou++;
    console.log("   ✅ 20/09/2026 é domingo: o DAS PRORROGA pra 21, o DARF ANTECIPA pra 18");
    console.log("   🔑 Três dias de diferença, no mesmo mês. Regra única erraria metade das guias,");
    console.log("      e erraria sempre pro lado do atraso.");
  } else {
    falhou++;
    erros.push(`G9: esperado DAS 21 e DARF 18; obtido ${dia(das)} e ${dia(darf)}`);
    console.log(`   ❌ esperado DAS 21 e DARF 18, obtido ${dia(das)} e ${dia(darf)}`);
  }
  console.log("   ⏳ Feriados NÃO são considerados (lacuna L7).\n");
}

console.log("✅ LACUNAS RESOLVIDAS em 14/09, por fonte primária:\n");
for (const l of RESOLVIDAS) {
  console.log(`   ${l.id} · ${l.o}`);
  console.log(`        ${l.lei}`);
  console.log(`        → ${l.onde}`);
}

console.log("\n⏳ LACUNAS ABERTAS — o que o motor ainda não sabe:\n");
for (const l of LACUNAS) {
  console.log(`   ${l.id} · ${l.o}`);
  console.log(`        ${l.lei}`);
}

console.log("\n" + "─".repeat(72));
if (falhou) {
  console.log(`\n🔴 ${falhou} conferência(s) FALHARAM · ${passou} passaram\n`);
  for (const e of erros) console.log(`   · ${e}`);
  console.log("");
  process.exit(1);
}
console.log(`\n✅ ${passou} conferências passaram — o motor bate com a Receita ao centavo\n`);
