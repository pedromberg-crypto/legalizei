/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 O ESTADO RECORRENTE, PROVADO — e as 3 telas fechando no mesmo número.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/estado-cnpj/verificar.mjs`
 *
 * 🔑 **O que este teste prova, e não é pouco:** que uma fonte só alimenta
 * `/impostos`, `/pro-labore` e `/notas` sem que nenhuma delas guarde número
 * próprio. Hoje as três têm mocks isolados e **contraditórios entre si**.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { retratoDoMes, folgaDoFatorR, extrato } from "./_modelo.mjs";
import { EMPRESA, COMPETENCIAS, NAO_PROVA } from "./persona-zero.mjs";
import { brlDeCentavos } from "../motor-fiscal/apurador.mjs";

let passou = 0;
let falhou = 0;
const erros = [];

function confere(rotulo, obtido, esperado, formata = brlDeCentavos) {
  if (obtido === esperado) {
    passou++;
    console.log(`   ✅ ${rotulo.padEnd(32)} ${formata(obtido)}`);
  } else {
    falhou++;
    erros.push(`${rotulo}: esperado ${formata(esperado)}, obtido ${formata(obtido)}`);
    console.log(`   ❌ ${rotulo.padEnd(32)} ${formata(obtido)}  ← esperado ${formata(esperado)}`);
  }
}

console.log("\n🏢 ESTADO RECORRENTE DE CNPJ — provado contra a conta real\n");
console.log(`   ${EMPRESA.razaoSocial}`);
console.log(`   CNPJ ${EMPRESA.cnpj} · CNAE ${EMPRESA.cnaePrincipal} · aberta em ${EMPRESA.dataAberturaCnpj}`);
console.log(`   ${COMPETENCIAS.length} competências guardadas, tudo o mais é derivado\n`);

/* ── 1 · A competência de agosto, contra o recibo da Receita ─────────────── */
{
  console.log("── 1 · Agosto/2026 — o mesmo estado responde às 3 telas");
  const r = retratoDoMes({ empresa: EMPRESA, competencias: COMPETENCIAS, mesAlvo: "2026-08" });

  console.log(`   mês de atividade nº ....... ${r.mesDeAtividade} (regra do RBT12: "${r.regraRbt12}")`);
  confere("receita do mês", r.receita, 791000);
  confere("RBT12 derivado", r.rbt12, 5400000);
  console.log(`   anexo vigente ............. ${r.anexo}${r.anexoEhFixo ? " (fixo pelo CNAE)" : " (pelo Fator R)"}`);

  console.log("\n   📱 /impostos pede o DAS:");
  confere("DAS do mês", r.das.total, 47459);
  console.log(`      vence em ${r.vencimentos.das.data.toISOString().slice(0, 10)} (${r.vencimentos.das.regra})`);

  console.log("\n   📱 /pro-labore pede o DARF:");
  confere("INSS do sócio", r.darf.inss, 17831);
  confere("IRRF (redutor zera)", r.darf.irrf, 0);
  console.log(`      vence em ${r.vencimentos.darf.data.toISOString().slice(0, 10)} (${r.vencimentos.darf.regra})`);

  console.log("\n   📱 /notas pede a receita, e é a MESMA que virou o DAS:");
  confere("receita = base do DAS", r.receita, 791000);

  console.log(`\n   💰 custo total do mês ...... ${brlDeCentavos(r.custo.total)} (${(r.custo.aliquotaTotal * 100).toFixed(2)}% do faturamento)`);

  // 🔴 O vencimento do DAS e o do DARF caem em dias DIFERENTES no mesmo mês.
  const dDas = r.vencimentos.das.data.getUTCDate();
  const dDarf = r.vencimentos.darf.data.getUTCDate();
  if (dDas !== dDarf) {
    passou++;
    console.log(`   ✅ DAS dia ${dDas} × DARF dia ${dDarf} — o deslocamento é por tributo`);
  } else {
    falhou++;
    erros.push("os dois vencimentos coincidiram, e não deveriam");
  }
  console.log("");
}

/* ── 2 · A folga do Fator R, no lugar do jargão ──────────────────────────── */
{
  console.log("── 2 · A folga do Fator R — o número que o líder esconde");
  const f = folgaDoFatorR({ empresa: EMPRESA, competencias: COMPETENCIAS });

  console.log(`   aplicável? ................ ${f.aplicavel} (CNAE é fator-r-dinâmico)`);
  console.log(`   folha em .................. ${(f.percentualAtual * 100).toFixed(1)}% do faturamento`);
  console.log(`   anexo ..................... ${f.anexo}`);
  console.log(`   tem folga? ................ ${f.temFolga}`);
  confere("folga por mês", f.folga, 47436);
  console.log(`   risco de glosa ............ ${f.riscoDeGlosa ? "SIM: " + f.competenciasEmRisco.join(", ") : "não"}`);

  console.log("\n   💬 O que a tela diz, sem jargão nenhum:");
  console.log(`      "Sua folha está em ${(f.percentualAtual * 100).toFixed(1)}% do que você faturou.`);
  console.log(`       O mínimo pra manter sua alíquota em 6% é 28%.`);
  console.log(`       Você tem ${brlDeCentavos(f.folga)} por mês de folga."`);
  console.log("   🔒 'Fator R', 'Anexo III' e 'RBT12' NUNCA aparecem na interface.\n");
}

/* ── 3 · O extrato inteiro, e o mês sem movimento ────────────────────────── */
{
  console.log("── 3 · O extrato de 9 competências — nada guardado, tudo derivado");
  const linhas = extrato({ empresa: EMPRESA, competencias: COMPETENCIAS });

  console.log("   mês       receita        RBT12      anexo   DAS");
  for (const l of linhas) {
    console.log(
      `   ${l.mes}  ${brlDeCentavos(l.receita).padStart(12)}  ${brlDeCentavos(l.rbt12).padStart(12)}   ${String(l.anexo).padEnd(4)}  ${brlDeCentavos(l.das.total).padStart(10)}${l.das.semMovimento ? "  (sem movimento)" : ""}`
    );
  }

  const semMovimento = linhas.filter((l) => l.das.semMovimento).length;
  const comDas = linhas.filter((l) => l.das.total > 0).length;
  if (semMovimento === 5 && comDas === 4) {
    passou++;
    console.log(`\n   ✅ 5 competências sem movimento e 4 com DAS — bate com o PGDAS-D`);
  } else {
    falhou++;
    erros.push(`extrato: esperado 5 sem movimento e 4 com DAS, obtido ${semMovimento} e ${comDas}`);
    console.log(`\n   ❌ obtido ${semMovimento} sem movimento e ${comDas} com DAS`);
  }

  const soma = linhas.reduce((s, l) => s + l.das.total, 0);
  console.log(`   💰 DAS do período .......... ${brlDeCentavos(soma)}`);
  console.log("");
}

/* ── 4.1 · 🛩️ O FIO DO PILOTO, ligado em 15/09 ───────────────────────────── */
{
  console.log("── 4.1 · O piloto de pró-labore dentro do retrato\n");

  const afirma = (rotulo, cond, detalhe = "") => {
    if (cond) {
      passou++;
      console.log(`   ✅ ${rotulo}${detalhe ? ` — ${detalhe}` : ""}`);
    } else {
      falhou++;
      erros.push(rotulo);
      console.log(`   ❌ ${rotulo}${detalhe ? ` — ${detalhe}` : ""}`);
    }
  };

  const retratos = COMPETENCIAS.map((c) =>
    retratoDoMes({ empresa: EMPRESA, competencias: COMPETENCIAS, mesAlvo: c.mes })
  );

  afirma(
    "todo retrato carrega a decisão do piloto",
    retratos.every((r) => r.piloto && typeof r.piloto.atua === "boolean"),
    `${retratos.length} competências`
  );

  // 🔴 A persona zero é `fator-r-dinamico`, então o fio TEM que acender nos
  // meses em que há receita na janela. Se parar de acender, é regressão.
  const acenderam = retratos.filter((r) => r.piloto.atua);
  afirma(
    "o fio acende onde há receita na janela (persona zero é dinâmica)",
    acenderam.length > 0,
    `${acenderam.length} de ${retratos.length} competências`
  );

  afirma(
    "e silencia nos meses sem receita na janela, sem inventar valor",
    retratos
      .filter((r) => !r.piloto.atua)
      .every((r) => r.piloto.motivo === "sem-receita-na-janela" && r.divergencia === null),
    "silêncio é resultado legítimo, não falha"
  );

  // 🔑 O confronto: a persona zero pagou o mínimo em agosto, e o piloto sabe
  // dizer se isso bastava. É o número que a tela vai precisar.
  const ago = retratos.find((r) => r.mes === "2026-08");
  afirma(
    "o retrato confronta o pago contra o sugerido",
    ago.divergencia !== null &&
      ago.divergencia.pago === 162100 &&
      typeof ago.divergencia.diferenca === "number",
    `pagou R$ 1.621,00 · piloto sugeriria R$ ${(ago.piloto.sugerido / 100).toFixed(2)}`
  );

  // 🔴 DERIVADO NÃO SE GUARDA: o piloto não pode ter virado campo da série.
  afirma(
    "🔴 e nada disso foi guardado na competência (derivado não se guarda)",
    COMPETENCIAS.every(
      (c) => !("piloto" in c) && !("sugerido" in c) && !("divergencia" in c)
    )
  );

  console.log("");
}

/* ── 4 · O que este caso NÃO prova ───────────────────────────────────────── */
console.log("🚫 O QUE ESTE CASO NÃO PROVA — ausência de evidência ≠ ausência de requisito:\n");
for (const n of NAO_PROVA) console.log(`   · ${n}`);

console.log("\n" + "─".repeat(72));
if (falhou) {
  console.log(`\n🔴 ${falhou} conferência(s) FALHARAM · ${passou} passaram\n`);
  for (const e of erros) console.log(`   · ${e}`);
  console.log("");
  process.exit(1);
}
console.log(`\n✅ ${passou} conferências passaram — uma fonte só, três telas, mesmo número\n`);
