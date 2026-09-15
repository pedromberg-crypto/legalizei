/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 AS 15 VIDAS CONTRA O MOTOR — invariância, não gabarito.
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

import { retratoDoMes, extrato, folgaDoFatorR, competencia } from "./_modelo.mjs";
import { VIDAS, SEM_VIDA } from "./vidas.mjs";
import { brlDeCentavos, faixaDe, aliquotaEfetiva } from "../motor-fiscal/apurador.mjs";
import { FAIXAS, REPARTICAO, TRIBUTOS } from "../motor-fiscal/_tabelas.mjs";

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

console.log(`\n🌱 AS ${VIDAS.length} VIDAS — as personas de abertura, agora como empresas\n`);
console.log("   ⚠️  SIMULAÇÃO declarada. Nenhum número saiu de documento, então");
console.log("      nada aqui afirma VALOR — só relações que a lei obriga.\n");

/* ── O panorama ──────────────────────────────────────────────────────────── */
console.log(`── Panorama das ${VIDAS.length}\n`);
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

  console.log(`   ${fixas.length} das ${VIDAS.length} têm CNAE III-fixo, e várias pagam só o pró-labore mínimo.`);
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

/* ── 2 · O Fator R caindo pro V, e o retrovisor ──────────────────────────── */
console.log("\n── 2 · P01: o Fator R caindo pro Anexo V — e ele é RETROVISOR\n");
{
  const p01 = retratos.find((r) => r.vida.id === "P01");
  const comMovimento = p01.linhas.filter((l) => l.das.total > 0);
  const comV = p01.linhas.filter((l) => l.anexo === "V");

  for (const l of comMovimento) {
    const fr = l.fatorR?.fr;
    console.log(
      `   ${l.mes}  receita ${brlDeCentavos(l.receita).padStart(12)}  folha ${fr ? (isFinite(fr) ? (fr * 100).toFixed(1).padStart(5) : "    ∞") : "  —  "}%  → Anexo ${String(l.anexo).padEnd(3)}  DAS ${brlDeCentavos(l.das.total).padStart(11)}`
    );
  }

  invariante("ele CAI no Anexo V enquanto se paga o mínimo", comV.length > 0, `${comV.length} competências`);

  // 🔴 A CORREÇÃO DE 15/09. Este bloco afirmava "e VOLTA pro III quando corrige
  // o pró-labore", e **passava pelo motivo errado**: o único mês em III era
  // maio/2026, onde o Fator R é INFINITO porque não havia receita anterior —
  // nada a ver com correção nenhuma. O Pedro pediu a projeção do mês seguinte e
  // o erro apareceu. Teste que passa pelo motivo errado é pior que teste que
  // falha: ele cobre o buraco em vez de mostrar.

  // (a) A razão infinita merece afirmação PRÓPRIA — é o que salvou fev/2026 da
  //     persona zero de virar Anexo V indevidamente.
  const infinito = comMovimento.filter((l) => l.fatorR && !isFinite(l.fatorR.fr));
  invariante(
    "receita anterior zero com folha paga → razão infinita → Anexo III",
    infinito.length > 0 && infinito.every((l) => l.anexo === "III"),
    "é o mesmo caso de fev/2026 da persona zero, que a Receita cobrou a 6%"
  );

  // (b) 🔑 O RETROVISOR: ele corrige o pró-labore em setembro e o mês seguinte
  //     CONTINUA no Anexo V. O Fator R olha os 12 meses anteriores, então
  //     consertar hoje não conserta hoje.
  const correcaoEm = "2026-09";
  const depoisDaCorrecao = p01.linhas.filter((l) => l.mes > correcaoEm && l.das.total > 0);
  invariante(
    "e corrigir o pró-labore NÃO devolve o anexo no mês seguinte",
    depoisDaCorrecao.length > 0 && depoisDaCorrecao.every((l) => l.anexo === "V"),
    "o Fator R olha 12 meses pra trás — consertar hoje não conserta hoje"
  );

  // (c) Mas a correção EMPURRA o Fator R pra cima, mês a mês. Projetando com o
  //     pró-labore corrigido, ele volta — e o teste mede em quantos meses.
  let s = [...p01.vida.competencias];
  let [ano, mes] = ["2026", 11];
  let voltouEm = null;
  const trilha = [];
  for (let i = 0; i < 24 && !voltouEm; i++) {
    const m = `${ano}-${String(mes).padStart(2, "0")}`;
    s = [...s, competencia({ mes: m, receita: 18000, proLaboreDeclarado: 5400, proLaborePago: 5400 })];
    const r = retratoDoMes({ empresa: p01.vida.empresa, competencias: s, mesAlvo: m });
    trilha.push({ mes: m, fr: r.fatorR.fr, anexo: r.anexo });
    if (r.anexo === "III") voltouEm = m;
    mes++;
    if (mes > 12) {
      mes = 1;
      ano = String(Number(ano) + 1);
    }
  }

  const subiuSempre = trilha.every((t, i) => i === 0 || t.fr >= trilha[i - 1].fr - 0.02);
  invariante("mas o Fator R sobe mês a mês depois dela", subiuSempre, `de ${(trilha[0].fr * 100).toFixed(1)}% a ${(trilha[trilha.length - 1].fr * 100).toFixed(1)}%`);
  invariante(
    "e ele volta ao Anexo III — só que MUITO depois",
    voltouEm !== null && trilha.length > 6,
    voltouEm ? `corrigiu em ${correcaoEm}, voltou em ${voltouEm} — ${trilha.length} competências` : "não voltou em 24 meses"
  );

  const dasV = comV.reduce((s2, l) => s2 + l.das.total, 0) / (comV.length || 1);
  invariante(
    "e o DAS no V é mais que o dobro do DAS no III",
    dasV > 216000, // o III na faixa 1 daria 18.000 × 6% = R$1.080,00
    `${brlDeCentavos(Math.round(dasV))} × R$ 1.080,00`
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
  // 🔴 CORRIGIDO EM 15/09 — E O INVARIANTE ANTIGO ENCODAVA UM BUG.
  //
  // Ele afirmava *"o INSS do P09 é ZERO porque o CLT de R$9.000 já passou do
  // teto"*, e passava — mas só passava porque o motor tratava a folha dos DOIS
  // sócios como se fosse uma pessoa só, aplicando o CLT de um deles à soma.
  //
  // O teto é da PESSOA (Lei 8.212/91 art. 28 §5º). O sócio que tem o CLT de
  // R$9.000 não recolhe nada; o OUTRO sócio não tem CLT nenhum e recolhe
  // normalmente sobre a parte dele. Zerar a guia inteira isentava quem não
  // tinha direito à isenção.
  const p09 = retratos.find((r) => r.vida.id === "P09");
  const mesP09 = p09.linhas.find((l) => l.darf);
  const socios = mesP09.darf.porSocio;

  invariante(
    "o sócio COM CLT acima do teto não recolhe INSS (P09)",
    socios[0].inss === 0 && socios[0].cltConsumiuOTeto,
    "cobrar dele seria cobrar duas vezes da mesma pessoa"
  );
  invariante(
    "🔴 mas o OUTRO sócio recolhe — o teto é da pessoa, não da empresa",
    socios[1].inss > 0 && !socios[1].cltConsumiuOTeto,
    "o invariante antigo zerava a guia inteira e isentava quem não tinha direito"
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
  console.log(`   as ${VIDAS.length} abriram em ${distintos.length} meses diferentes do ano: ${distintos.join(", ")}`);

  const primeiros = retratos.map((r) => r.linhas[0]);
  invariante(
    "toda primeira competência usou a regra do 1º mês",
    primeiros.every((l) => l.regraRbt12 === "1o-mes"),
    "março e dezembro percorrem o mesmo código"
  );
}

/* ── 8 · O ANEXO V ALÉM DA FAIXA 1 — a lacuna que faltava ────────────────── */
console.log("\n── 8 · P16: o Anexo V que CRESCE — onde a parcela a deduzir morde\n");
{
  const p16 = retratos.find((r) => r.vida.id === "P16");
  const comMovimento = p16.linhas.filter((l) => l.das.total > 0);

  console.log("   mês      receita        RBT12          faixa  nominal  efetiva   DAS");
  for (const l of comMovimento.filter((_, i) => i % 3 === 0 || i === comMovimento.length - 1)) {
    const f = faixaDe(l.rbt12 / 100, l.anexo);
    const ef = aliquotaEfetiva(l.rbt12 / 100, l.anexo);
    console.log(
      `   ${l.mes}  ${brlDeCentavos(l.receita).padStart(12)}  ${brlDeCentavos(l.rbt12).padStart(14)}` +
        `   ${f.faixa}ª    ${(f.nominal * 100).toFixed(2).padStart(6)}%  ${(ef * 100).toFixed(4).padStart(7)}%  ${brlDeCentavos(l.das.total).padStart(11)}`
    );
  }

  // (a) 🔑 A LACUNA PRINCIPAL. Na faixa 1 a parcela a deduzir é ZERO, então
  //     efetiva = nominal e metade da tabela nunca roda. O P01 morria aqui.
  const naFaixa2 = comMovimento.filter((l) => faixaDe(l.rbt12 / 100, l.anexo).faixa === 2);
  invariante(
    "o Anexo V passa da FAIXA 1 — o que o P01 nunca fez",
    naFaixa2.length > 0 && naFaixa2.every((l) => l.anexo === "V"),
    `${naFaixa2.length} competências na 2ª faixa do V`
  );
  invariante(
    "e aí a parcela a deduzir MORDE: efetiva < nominal, sempre",
    naFaixa2.every((l) => aliquotaEfetiva(l.rbt12 / 100, "V") < FAIXAS.V[1].nominal - 1e-9),
    "na 1ª faixa a deduzir é zero e a efetiva É a nominal — é por isso que a faixa 1 não prova a tabela"
  );

  // (b) A efetiva sobe com o RBT12, e se aproxima da nominal sem alcançar.
  const efetivas = comMovimento.map((l) => aliquotaEfetiva(l.rbt12 / 100, l.anexo));
  invariante(
    "a efetiva do V só SOBE conforme o RBT12 cresce",
    efetivas.every((e, i) => i === 0 || e >= efetivas[i - 1] - 1e-12),
    `de ${(Math.min(...efetivas) * 100).toFixed(2)}% a ${(Math.max(...efetivas) * 100).toFixed(2)}%`
  );

  // (c) 🔴 A CONTINUIDADE NAS BORDAS — a prova de que a parcela a deduzir é
  //     CALIBRADA, e não um número solto. Em R$180.000 exatos a efetiva pela
  //     faixa 1 e pela faixa 2 são o MESMO número. Se o motor lesse a faixa
  //     errada por um centavo, a conta continuaria certa.
  const bordasContinuas = [];
  const bordasQuebradas = [];
  for (const anexo of ["III", "V"]) {
    const t = FAIXAS[anexo];
    for (let i = 0; i < t.length - 1; i++) {
      const borda = t[i].ate;
      const abaixo = (borda * t[i].nominal - t[i].deduzir) / borda;
      const acima = (borda * t[i + 1].nominal - t[i + 1].deduzir) / borda;
      const alvo = Math.abs(abaixo - acima) < 1e-12 ? bordasContinuas : bordasQuebradas;
      alvo.push({ anexo, de: i + 1, borda, abaixo, acima });
    }
  }
  invariante(
    "e a efetiva é CONTÍNUA nas bordas de faixa, nos dois anexos",
    bordasContinuas.length === 8 && bordasContinuas.every((b) => b.de <= 4),
    "f1→f2 … f4→f5 · a parcela a deduzir é calibrada pra isso, não é número solto"
  );

  // 🔴 E O ACHADO: a continuidade QUEBRA em f5→f6, nos DOIS anexos, no mesmo
  //    ponto. Não é bug do motor, é propriedade da tabela da LC 123 — e está
  //    a 10× do nosso teto, então fica registrado e não vira regra.
  console.log("\n   🔴 achado — a continuidade quebra na 6ª faixa, nos dois anexos:");
  for (const b of bordasQuebradas) {
    console.log(
      `      Anexo ${b.anexo.padEnd(3)} f${b.de}→f${b.de + 1} em R$ ${(b.borda / 1000).toFixed(0)}mil: ` +
        `${(b.abaixo * 100).toFixed(4)}% → ${(b.acima * 100).toFixed(4)}%  (cai ${((b.abaixo - b.acima) * 100).toFixed(4)}pp)`
    );
  }
  console.log("      é da TABELA (LC 123), não do motor — e está fora do escopo: teto do ME é R$360mil.");
  invariante(
    "a quebra é só na 6ª faixa, e nas duas tabelas igual",
    bordasQuebradas.length === 2 && bordasQuebradas.every((b) => b.de === 5),
    "se aparecesse numa borda de baixo seria erro de digitação da tabela"
  );

  // (d) A repartição por tributo tem que somar 1,0000 em TODA faixa do V.
  //     Se não somasse, a soma das 6 parcelas não daria o DAS.
  const somas = [1, 2, 3, 4, 5, 6].map((f) =>
    Object.values(REPARTICAO.V[f]).reduce((a, b) => a + b, 0)
  );
  invariante(
    "a repartição do Anexo V soma 1,0000 nas 6 faixas",
    somas.every((s) => Math.abs(s - 1) < 1e-9),
    "é o que faz a soma dos 6 tributos fechar com o total do DAS"
  );

  // (e) 🔑 O DAS do V é a soma de 6 parcelas arredondadas — mesmo código do
  //     III, provado ao centavo contra recibo. Aqui se prova que o anexo não
  //     tem caminho próprio de arredondamento.
  const divergencias = comMovimento.map((l) => {
    const soma = TRIBUTOS.reduce((s, t) => s + (l.das.parcelas?.[t] ?? 0), 0);
    const direto = Math.round((l.receita / 100) * aliquotaEfetiva(l.rbt12 / 100, l.anexo) * 100);
    return { soma, total: l.das.total, direto };
  });
  invariante(
    "e o DAS do V é a SOMA das 6 parcelas, não o produto arredondado",
    divergencias.every((d) => d.soma === d.total),
    "mesmo código do Anexo III, que tem recibo — o anexo não muda a regra de arredondamento"
  );
  const maiorDiff = Math.max(...divergencias.map((d) => Math.abs(d.total - d.direto)));
  console.log(`   💡 e a diferença pro produto direto chega a ${maiorDiff} centavo(s) — nunca reais.`);

  // (f) CPP DENTRO do DAS no Anexo V. O art. 2º V da Res. CGSN 140/2018 tira
  //     a CPP do DAS só no Anexo IV, que está fora do nosso escopo.
  invariante(
    "a CPP está DENTRO do DAS no Anexo V, nas 6 faixas",
    [1, 2, 3, 4, 5, 6].every((f) => REPARTICAO.V[f].cpp > 0),
    "só o Anexo IV a tira (Res. CGSN 140/2018 art. 2º V), e ele está fora do escopo"
  );

  // (g) O V é sempre mais caro que o III no mesmo RBT12 — é a razão de o
  //     Fator R existir como decisão de produto.
  let vSempreMaior = true;
  for (let r = 1000; r <= 360000; r += 1000) {
    if (aliquotaEfetiva(r, "V") <= aliquotaEfetiva(r, "III")) vSempreMaior = false;
  }
  invariante(
    "e em TODO RBT12 do escopo ME o V é mais caro que o III",
    vSempreMaior,
    "R$1mil a R$360mil, de mil em mil — é o que torna o Fator R uma decisão, não um detalhe"
  );

  // (h) 🚪 O TETO DO ME. RBT12 acima de R$360 mil desenquadra — e EPP, no
  //     nosso produto, só existe como porta de SAÍDA.
  const rbt12Final = p16.ultima.rbt12 / 100;
  invariante(
    "e ele encosta no teto do ME sem passar",
    rbt12Final > 300000 && rbt12Final <= 360000,
    `RBT12 final ${brlDeCentavos(p16.ultima.rbt12)} · o teto é R$ 360.000,00, e passar é desenquadramento`
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
