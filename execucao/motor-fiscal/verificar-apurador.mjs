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

import { apurarDAS, fatorR, anualiza, rbt12De, retencaoLegitima, brl, emCentavos, LACUNAS, RESOLVIDAS } from "./apurador.mjs";

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

  console.log(`   ⚠️  a pesquisa diz DAS de ${brl(31561)} neste caso; o motor diz ${brl(comRet.total)}.`);
  console.log("       Ela fez 474,60 × 66,50%; o motor soma os 5 federais já arredondados. É o");
  console.log("       MESMO desvio do 474,59 — mas aqui NÃO existe guia real pra confirmar. 🟡");

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
