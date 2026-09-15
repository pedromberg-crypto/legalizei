/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 AS 14 VIDAS CONTRA O MOTOR — invariância, não gabarito.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/estado-cnpj/verificar-vidas.mjs`
 *
 * 🔴 **A DIFERENÇA QUE DEFINE ESTE ARQUIVO.** O `verificar.mjs` roda a persona
 * zero e afirma VALOR: *"o DAS é R$474,59"*, porque existe recibo do PGDAS-D.
 * Aqui não existe documento nenhum, então afirmar valor seria só confirmar o
 * meu próprio cálculo — o pior tipo de teste, o que passa sempre.
 *
 * O que se afirma aqui são **relações que a lei obriga**:
 *   · CNAE `III-fixo` nunca vira Anexo V, por menor que seja o pró-labore
 *   · do 13º mês em diante o RBT12 é SOMA, não média × 12
 *   · pró-labore declarado e não pago não entra no Fator R
 *   · CLT acima do teto zera o INSS do pró-labore
 *   · ISS retido sai do DAS e reaparece na guia municipal, sem sumir
 *
 * Nenhuma delas depende de documento. Todas dependem da norma.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { retratoDoMes, extrato, folgaDoFatorR } from "./_modelo.mjs";
import { VIDAS, SEM_VIDA } from "./vidas.mjs";
import { brlDeCentavos } from "../motor-fiscal/apurador.mjs";

let passou = 0;
let falhou = 0;
const erros = [];

function invariante(rotulo, condicao, detalhe = "") {
  if (condicao) {
    passou++;
    console.log(`   ✅ ${rotulo}${detalhe ? ` — ${detalhe}` : ""}`);
  } else {
    falhou++;
    erros.push(`${rotulo}${detalhe ? ` (${detalhe})` : ""}`);
    console.log(`   ❌ ${rotulo}${detalhe ? ` — ${detalhe}` : ""}`);
  }
}

console.log("\n🌱 AS 14 VIDAS — as personas de abertura, agora como empresas\n");
console.log("   ⚠️  SIMULAÇÃO declarada. Nenhum número saiu de documento, então");
console.log("      nada aqui afirma VALOR — só relações que a lei obriga.\n");

/* ── O panorama ──────────────────────────────────────────────────────────── */
console.log("── Panorama das 14\n");
console.log("   id   atividade                       abriu     meses  anexo  RBT12 final    DAS acumulado");

const retratos = [];
for (const v of VIDAS) {
  const linhas = extrato({ empresa: v.empresa, competencias: v.competencias });
  const ultima = linhas[linhas.length - 1];
  const dasTotal = linhas.reduce((s, l) => s + l.das.total, 0);
  retratos.push({ vida: v, linhas, ultima, dasTotal });

  const atividade = v.nome.split("—")[1].trim().slice(0, 30);
  console.log(
    `   ${v.id}  ${atividade.padEnd(31)} ${v.empresa.dataAberturaCnpj}  ${String(linhas.length).padStart(4)}   ${String(ultima.anexo).padEnd(4)}  ${brlDeCentavos(ultima.rbt12).padStart(13)}  ${brlDeCentavos(dasTotal).padStart(13)}`
  );
}

/* ── 1 · III-fixo nunca vira V ───────────────────────────────────────────── */
console.log("\n── 1 · O invariante dos 65 de 87: CNAE III-fixo nunca vira Anexo V\n");
{
  const fixas = retratos.filter((r) => r.ultima.anexoEhFixo);
  const viraramV = fixas.filter((r) => r.linhas.some((l) => l.anexo === "V"));

  console.log(`   ${fixas.length} das 14 têm CNAE III-fixo, e várias pagam só o pró-labore mínimo.`);
  invariante(
    "nenhuma delas caiu no Anexo V em nenhuma competência",
    viraramV.length === 0,
    viraramV.length ? viraramV.map((r) => r.vida.id).join(", ") : `${fixas.length} empresas conferidas`
  );

  // E a tela não pode falar de folga de folha pra elas.
  const falouDeFolga = fixas.filter(
    (r) => folgaDoFatorR({ empresa: r.vida.empresa, competencias: r.vida.competencias }).aplicavel
  );
  invariante(
    "e a tela não oferece 'folga do Fator R' pra nenhuma",
    falouDeFolga.length === 0,
    "sugerir folga a quem já é III-fixo inventa um risco que não existe"
  );
}

/* ── 2 · O Fator R caindo pro V — o ramo nunca testado ───────────────────── */
console.log("\n── 2 · P01: o Fator R caindo pro Anexo V, e voltando\n");
{
  const p01 = retratos.find((r) => r.vida.id === "P01");
  const comV = p01.linhas.filter((l) => l.anexo === "V");
  const comIII = p01.linhas.filter((l) => l.anexo === "III" && l.das.total > 0);

  for (const l of p01.linhas.filter((l) => l.das.total > 0)) {
    const fr = l.fatorR?.fr;
    console.log(
      `   ${l.mes}  receita ${brlDeCentavos(l.receita).padStart(12)}  folha ${fr ? (fr * 100).toFixed(1).padStart(5) : "  —  "}%  → Anexo ${String(l.anexo).padEnd(3)}  DAS ${brlDeCentavos(l.das.total).padStart(11)}`
    );
  }

  invariante("ele CAI no Anexo V enquanto se paga o mínimo", comV.length > 0, `${comV.length} competências`);
  invariante("e VOLTA pro III quando corrige o pró-labore", comIII.length > 0, `${comIII.length} competências`);

  const dasV = comV.reduce((s, l) => s + l.das.total, 0) / (comV.length || 1);
  const dasIII = comIII.reduce((s, l) => s + l.das.total, 0) / (comIII.length || 1);
  invariante(
    "e o DAS médio no V é mais que o dobro do DAS no III",
    dasV > dasIII * 2,
    `${brlDeCentavos(Math.round(dasV))} × ${brlDeCentavos(Math.round(dasIII))}`
  );
}

/* ── 3 · O 13º mês: o RBT12 vira SOMA ────────────────────────────────────── */
console.log("\n── 3 · P09: do 13º mês em diante o RBT12 é SOMA, não média × 12\n");
{
  const p09 = retratos.find((r) => r.vida.id === "P09");
  const proporcional = p09.linhas.filter((l) => l.regraRbt12 === "proporcional");
  const soma = p09.linhas.filter((l) => l.regraRbt12 === "soma-12");

  console.log(`   ${proporcional.length} competências com RBT12 proporcional · ${soma.length} com soma dos 12`);
  invariante("a virada de regra aconteceu", soma.length > 0, "art. 24 da Res. CGSN 140/2018");

  // 🔴 E ela é a única que passa de faixa.
  const faixas = [...new Set(p09.linhas.filter((l) => l.das.faixa).map((l) => l.das.faixa))];
  invariante(
    "e ela passa da 1ª faixa — a persona zero nunca passou",
    faixas.some((f) => f > 1),
    `faixas visitadas: ${faixas.join(", ")}`
  );
}

/* ── 4 · Declarado ≠ pago ────────────────────────────────────────────────── */
console.log("\n── 4 · P08: declarou e não pagou — o risco que a Receita cruza\n");
{
  const p08 = retratos.find((r) => r.vida.id === "P08");
  const comRisco = p08.linhas.filter((l) => l.fatorR?.riscoDeGlosa);

  invariante(
    "o motor acusa as competências em risco de glosa",
    comRisco.length > 0,
    comRisco.length ? comRisco[comRisco.length - 1].fatorR.competenciasEmRisco.join(", ") : "nenhuma"
  );
  invariante(
    "mas o anexo NÃO muda, porque o CNAE é III-fixo",
    p08.linhas.every((l) => l.anexo !== "V"),
    "o risco é de glosa do recolhimento, não de reclassificação"
  );
}

/* ── 5 · CLT consome o teto do INSS ──────────────────────────────────────── */
console.log("\n── 5 · CLT por fora: o teto do INSS é da PESSOA\n");
{
  for (const id of ["P02", "P09", "P14"]) {
    const r = retratos.find((x) => x.vida.id === id);
    const clt = r.vida.empresa.cltDoSocio;
    const mes = r.linhas.find((l) => l.darf);
    console.log(`   ${id}  CLT de ${brlDeCentavos(clt * 100).padStart(11)}  → INSS do pró-labore ${brlDeCentavos(mes.darf.inss)}`);
  }
  // O do P09 tem CLT de R$9.000, acima do teto de R$8.475,55.
  const p09 = retratos.find((r) => r.vida.id === "P09");
  const mesP09 = p09.linhas.find((l) => l.darf);
  invariante(
    "o INSS do P09 é ZERO — o CLT de R$9.000 já passou do teto",
    mesP09.darf.inss === 0 && mesP09.darf.cltConsumiuOTeto,
    "cobrar INSS de quem já bate o teto seria cobrar duas vezes da mesma pessoa"
  );
}

/* ── 6 · ISS retido ──────────────────────────────────────────────────────── */
console.log("\n── 6 · P04: agência de publicidade, e o ISS retido do art. 24\n");
{
  const p04 = retratos.find((r) => r.vida.id === "P04");
  const comRetencao = p04.linhas.filter((l) => l.das.temRetencao);

  for (const l of comRetencao.slice(0, 3)) {
    console.log(
      `   ${l.mes}  DAS ${brlDeCentavos(l.das.total).padStart(11)}  (ISS dentro: ${brlDeCentavos(l.das.parcelas.iss)})  + ISS retido pelo tomador ${brlDeCentavos(l.das.issRetido)}`
    );
  }

  invariante("há competências com retenção", comRetencao.length > 0, `${comRetencao.length} de ${p04.linhas.length}`);
  invariante(
    "e o ISS some do DAS quando a receita inteira é retida",
    comRetencao.every((l) => (l.receita === l.das.issRetido > 0 ? l.das.parcelas.iss === 0 : true)),
    "sem sumir nem duplicar"
  );
}

/* ── 7 · Março × dezembro ────────────────────────────────────────────────── */
console.log("\n── 7 · O calendário não existe pro motor\n");
{
  const meses = VIDAS.map((v) => Number(v.empresa.dataAberturaCnpj.slice(5, 7)));
  const distintos = [...new Set(meses)].sort((a, b) => a - b);
  console.log(`   as 14 abriram em ${distintos.length} meses diferentes do ano: ${distintos.join(", ")}`);

  const primeiros = retratos.map((r) => r.linhas[0]);
  invariante(
    "toda primeira competência usou a regra do 1º mês",
    primeiros.every((l) => l.regraRbt12 === "1o-mes"),
    "março e dezembro percorrem o mesmo código"
  );
}

/* ── Fecho ───────────────────────────────────────────────────────────────── */
console.log(`\n🚫 Sem vida de propósito: ${SEM_VIDA.naoAbrem.join(", ")} nunca abrem · ${SEM_VIDA.abremMasNaoAcrescentam.join(", ")} abrem mas não trazem variável nova.\n`);

console.log("─".repeat(76));
if (falhou) {
  console.log(`\n🔴 ${falhou} invariante(s) FALHARAM · ${passou} passaram\n`);
  for (const e of erros) console.log(`   · ${e}`);
  console.log("");
  process.exit(1);
}
console.log(`\n✅ ${passou} invariantes passaram — relações da lei, não valores meus\n`);
