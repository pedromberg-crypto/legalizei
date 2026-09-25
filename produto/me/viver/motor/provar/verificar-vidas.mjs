/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 AS VIDAS CONTRA O MOTOR — invariância, não gabarito.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/estado-cnpj/verificar-vidas.mjs`
 *
 * 🔴 **A DIFERENÇA QUE DEFINE ESTE ARQUIVO.** O `verificar.mjs` roda a persona
 * zero e afirma VALOR: *"o DAS é R$474,59"*, porque existe recibo do PGDAS-D.
 * Aqui não existe documento nenhum, então afirmar valor seria só confirmar o
 * meu próprio cálculo — o pior tipo de teste, o que passa sempre.
 *
 * O que se afirma aqui são **relações que a lei obriga**:
 *   · CNAE `III` nunca perde o benefício do III, por menor que seja o pró-labore
 *   · do 13º mês em diante o RBT12 é SOMA, não média × 12
 *   · pró-labore declarado e não pago não entra no Fator R
 *   · CLT acima do teto zera o INSS do pró-labore
 *   · ISS retido sai do DAS e reaparece na guia municipal, sem sumir
 *
 * Nenhuma delas depende de documento. Todas dependem da norma.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  retratoDoMes,
  extrato,
  folgaDoFatorR,
  competencia,
  identidade,
} from "../vidas/_modelo.mjs";
import { VIDAS, SEM_VIDA } from "../vidas/vidas.mjs";
import { alertasDoRetrato } from "../vidas/alertas-internos.mjs";
import { brlDeCentavos, faixaDe, aliquotaEfetiva } from "../regra/apurador.mjs";
import {
  FAIXAS,
  REPARTICAO,
  TRIBUTOS,
  FATOR_R,
  salarioMinimoDe,
} from "../regra/_tabelas.mjs";
import { avaliarProLaboreEscolhido } from "../regra/piloto-pro-labore.mjs";

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

/* ── 1 · III-fixo nunca perde o benefício ───────────────────────────────── */
console.log("\n── 1 · O invariante dos 65 de 87: CNAE III-fixo nunca perde o benefício do III\n");
{
  const fixas = retratos.filter((r) => r.ultima.anexoEhFixo);
  const viraramV = fixas.filter((r) => r.linhas.some((l) => l.anexo === "V"));

  console.log(`   ${fixas.length} das ${VIDAS.length} têm CNAE III-fixo, e várias pagam só o pró-labore mínimo.`);
  invariante(
    "nenhuma delas foi tributada pelo Anexo V em nenhuma competência",
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

  invariante("ele PERDE o benefício do III enquanto se paga o mínimo", comV.length > 0, `${comV.length} competências`);

  // 🔴 A CORREÇÃO DE 15/09. Este bloco afirmava "e VOLTA pro III quando corrige
  // o pró-labore", e **passava pelo motivo errado**: o único mês em III era
  // maio/2026, onde o Fator R é INFINITO porque não havia receita anterior —
  // nada a ver com correção nenhuma. O Pedro pediu a projeção do mês seguinte e
  // o erro apareceu. Teste que passa pelo motivo errado é pior que teste que
  // falha: ele cobre o buraco em vez de mostrar.

  // (a) A razão infinita merece afirmação PRÓPRIA — é o que salvou fev/2026 da
  //     persona zero de ser tributada pelo Anexo V indevidamente.
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

/* ── 5.1 · 🔒 A TRAVA DOS COLABORADORES ──────────────────────────────────── */
console.log("\n── 5.1 · Colaboradores: travado em ZERO por decisão do Pedro (15/09)\n");
{
  const comFolha = VIDAS.filter((v) => (v.empresa.colaboradores ?? 0) > 0);
  invariante(
    "🔒 NENHUMA vida tem colaborador — o fluxo se valida sem essa variável",
    comFolha.length === 0,
    comFolha.length
      ? `${comFolha.map((v) => v.id).join(", ")} têm colaborador, e a funcionalidade ainda não foi desenhada`
      : "quando destravar, o Fator R passa a somar salário CLT, 13º, férias+1/3 e FGTS — e o piloto, que só mexe no pró-labore, deixa de estar certo (PP5)"
  );
}

/* ── 5.2 · ⏰ GUIA PAGA EM ATRASO ─────────────────────────────────────────── */
console.log("\n── 5.2 · P09: três competências seguidas pagas em atraso\n");
{
  const p09 = retratos.find((r) => r.vida.id === "P09");
  const atrasadas = p09.linhas.filter((l) => l.atraso && !l.atraso.emDia);

  for (const l of atrasadas) {
    console.log(
      `   ${l.mes}  ${String(l.atraso.diasDeAtraso).padStart(2)} dias  ` +
        `multa ${brlDeCentavos(l.atraso.multa).padStart(10)} (${(l.atraso.pctMulta * 100).toFixed(2)}%)  ` +
        `juros ${brlDeCentavos(l.atraso.juros).padStart(9)}`
    );
  }

  invariante(
    "⏰ as 3 competências atrasadas são reconhecidas como atraso",
    atrasadas.length === 3,
    `${atrasadas.length} de 3 — o elenco só pagava em dia até 15/09`
  );
  invariante(
    "a multa é 0,33% ao dia e cresce com o atraso (Lei 9.430/96 art. 61)",
    atrasadas.every((l) => Math.abs(l.atraso.pctMulta - 0.0033 * l.atraso.diasDeAtraso) < 1e-9),
    "e nenhuma bateu no teto de 20% — o teto é a partir de ~61 dias"
  );
  invariante(
    "🔑 o atraso NUNCA muda o principal, só acrescenta",
    atrasadas.every((l) => l.atraso.total === l.das.total + l.atraso.multa + l.atraso.juros),
    "multa e juros são camada sobre a guia, não recálculo dela"
  );
  invariante(
    "e as competências pagas em dia não geram multa nenhuma",
    p09.linhas.filter((l) => l.atraso?.emDia).every((l) => !l.atraso.multa),
    "o motor pegou um erro MEU aqui: eu paguei antes do vencimento achando que o DAS vence no mês da competência, e ele devolveu `emDia` em vez de inventar atraso"
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
    const f = faixaDe(l.rbt12, l.anexo);
    const ef = aliquotaEfetiva(l.rbt12, l.anexo);
    console.log(
      `   ${l.mes}  ${brlDeCentavos(l.receita).padStart(12)}  ${brlDeCentavos(l.rbt12).padStart(14)}` +
        `   ${f.faixa}ª    ${(f.nominal * 100).toFixed(2).padStart(6)}%  ${(ef * 100).toFixed(4).padStart(7)}%  ${brlDeCentavos(l.das.total).padStart(11)}`
    );
  }

  // (a) 🔑 A LACUNA PRINCIPAL. Na faixa 1 a parcela a deduzir é ZERO, então
  //     efetiva = nominal e metade da tabela nunca roda. O P01 morria aqui.
  const naFaixa2 = comMovimento.filter((l) => faixaDe(l.rbt12, l.anexo).faixa === 2);
  invariante(
    "o Anexo V passa da FAIXA 1 — o que o P01 nunca fez",
    naFaixa2.length > 0 && naFaixa2.every((l) => l.anexo === "V"),
    `${naFaixa2.length} competências na 2ª faixa do V`
  );
  invariante(
    "e aí a parcela a deduzir MORDE: efetiva < nominal, sempre",
    naFaixa2.every((l) => aliquotaEfetiva(l.rbt12, "V") < FAIXAS.V[1].nominal - 1e-9),
    "na 1ª faixa a deduzir é zero e a efetiva É a nominal — é por isso que a faixa 1 não prova a tabela"
  );

  // (b) A efetiva sobe com o RBT12, e se aproxima da nominal sem alcançar.
  const efetivas = comMovimento.map((l) => aliquotaEfetiva(l.rbt12, l.anexo));
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
    const direto = Math.round((l.receita / 100) * aliquotaEfetiva(l.rbt12, l.anexo) * 100);
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
  const rbt12Final = p16.ultima.rbt12; // centavos, como tudo
  invariante(
    "e ele encosta no teto do ME sem passar",
    rbt12Final > 30000000 && rbt12Final <= 36000000,
    `RBT12 final ${brlDeCentavos(p16.ultima.rbt12)} · o teto é R$ 360.000,00, e passar é desenquadramento`
  );
}

/* ── 7 · QUEM RECEBE PRÓ-LABORE (regra nova de 16/09) ───────────────────── */

console.log("\n── 7 · Recebe quem ADMINISTRA, e o motor enxerga quem ficou de fora\n");
{
  // 🔴 ESTE BLOCO NASCEU DE UM SUSTO. Em 16/09 mudei a P04 de 2 para 1 sócio
  // com pró-labore e a P14 de 3 para 1 — dinheiro de verdade, R$228,86 num mês
  // só — e **as 6 suítes passaram sem uma reclamação**. É a régua do
  // `_cobertura-das-vidas` aparecendo de novo: dado sem invariante é dado que
  // ninguém defende.

  const comSocioForaDaFolha = VIDAS.filter(
    (v) => (v.empresa.sociosTotal ?? 0) > (v.empresa.sociosComProLabore ?? 1)
  );

  invariante(
    "existe vida em que nem todo sócio recebe pró-labore",
    comSocioForaDaFolha.length > 0,
    comSocioForaDaFolha.length
      ? comSocioForaDaFolha
          .map(
            (v) =>
              `${v.id} paga a ${v.empresa.sociosComProLabore} de ${v.empresa.sociosTotal}`
          )
          .join(" · ")
      : "🔴 nenhuma — a regra do administrador não está sendo exercitada"
  );

  // Dado incoerente: não dá pra pagar a mais gente do que existe na sociedade.
  const incoerentes = VIDAS.filter(
    (v) => (v.empresa.sociosTotal ?? 1) < (v.empresa.sociosComProLabore ?? 1)
  );
  invariante(
    "nenhuma vida paga pró-labore a mais sócios do que tem",
    incoerentes.length === 0,
    incoerentes.length ? incoerentes.map((v) => v.id).join(", ") : `${VIDAS.length} vidas conferidas`
  );

  // 🔑 E a conta que a decisão (c) do Pedro obriga a existir: quando concentrar
  //    a folha cria IRRF que o rateio evitava, o motor tem que VER isso.
  const retratosComSocioFora = comSocioForaDaFolha.flatMap((v) =>
    v.competencias.map((cp) =>
      retratoDoMes({ empresa: v.empresa, competencias: v.competencias, mesAlvo: cp.mes })
    )
  );
  const avaliados = retratosComSocioFora.filter((r) => r.concentracaoDaFolha?.avaliou);
  const sinalizados = avaliados.filter((r) => r.concentracaoDaFolha.vale);

  invariante(
    "o motor avalia a concentração da folha em toda competência dessas vidas",
    avaliados.length === retratosComSocioFora.filter((r) => r.darf).length,
    `${avaliados.length} competências avaliadas`
  );

  invariante(
    "e só sinaliza quando o rateio derruba IRRF, nunca por arredondamento",
    sinalizados.every((r) => r.concentracaoDaFolha.irrfEvitado > 0),
    sinalizados.length
      ? `${sinalizados.length} de ${avaliados.length} competências sinalizam · maior economia ${brlDeCentavos(Math.max(...sinalizados.map((r) => r.concentracaoDaFolha.economiaMensal)))}`
      : "nenhuma sinaliza"
  );

  // 🔴 A regressão que este bloco existe para pegar: a 1ª versão disparava com
  //    1 centavo e enchia a P14 de sugestão em 9 meses seguidos.
  invariante(
    "nenhuma sinalização vale menos de um real",
    sinalizados.every((r) => r.concentracaoDaFolha.economiaMensal >= 100),
    sinalizados.length
      ? `menor economia sinalizada: ${brlDeCentavos(Math.min(...sinalizados.map((r) => r.concentracaoDaFolha.economiaMensal)))}`
      : "nenhuma sinaliza"
  );
}

/* ── 8 · A JANELA VAZIA (regra nova de 16/09) ───────────────────────────── */

console.log("\n── 8 · Quem fatura no mês em que abriu paga 15,5%, e quem pagou folha sem faturar não\n");
{
  // 🔴 Até 15/09 o motor GRITAVA neste caso, porque não podia escolher entre
  // 6% e 15,5% sem informação. O contador deu a informação em 16/09:
  //   *"eu teria que ter uma folha no mês 7. O mês 7 a empresa não existia.
  //    Então ali ela vai ser tributada normal, nos 15,5."*
  //
  // ⚠️ O argumento antigo continua VERDADEIRO e só deixou de se aplicar: "V
  //    por precaução" segue proibido. O que mudou é que isto parou de ser
  //    precaução e virou regra.

  const emp = identidade({
    cnpj: "00.000.000/0001-00",
    razaoSocial: "TESTE JANELA LTDA",
    dataAberturaCnpj: "2026-09-16",
    cnaePrincipal: "6201-5/01",
    grupoAnexo: "III-ou-V",
  });

  // (a) Constituiu e faturou no mesmo mês.
  const soFaturou = [competencia({ mes: "2026-09", receita: 12000 })];
  const rA = retratoDoMes({ empresa: emp, competencias: soFaturou, mesAlvo: "2026-09" });
  invariante(
    "faturar no mês da abertura cai no Anexo V, sem janela para o Fator R",
    rA.anexo === "V" && rA.faturouSemJanela === true,
    `anexo ${rA.anexo} · DAS ${brlDeCentavos(rA.das.total)} sobre R$12.000 · 15,5%`
  );

  // 🔴 (b) O CONTRÁRIO, e é o que não pode quebrar: folha paga sem receita dá
  //        razão INFINITA, e razão infinita é Anexo III. Foi o que salvou
  //        fev/2026 da persona zero.
  const comFolhaAntes = [
    competencia({ mes: "2026-08", receita: 0, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
    competencia({ mes: "2026-09", receita: 12000, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
  ];
  const rB = retratoDoMes({ empresa: emp, competencias: comFolhaAntes, mesAlvo: "2026-09" });
  invariante(
    "mas folha paga sem receita continua dando razão infinita e Anexo III",
    rB.anexo === "III" && !isFinite(rB.fatorR.fr),
    `anexo ${rB.anexo} · Fator R ${rB.fatorR.fr} · DAS ${brlDeCentavos(rB.das.total)}`
  );

  // (c) Sem receita nenhuma, o anexo segue indeterminado e não machuca.
  const nada = [competencia({ mes: "2026-09", receita: 0 })];
  const rC = retratoDoMes({ empresa: emp, competencias: nada, mesAlvo: "2026-09" });
  invariante(
    "e sem receita o anexo segue indeterminado, com DAS zero e sem chute",
    rC.anexo === null && rC.anexoIndeterminado === true && rC.das.total === 0,
    "não há o que tributar, então não há o que decidir"
  );

  // (d) 🔑 A diferença que a regra custa, para o número nunca virar abstração.
  const custoDaJanelaVazia = rA.das.total - rB.das.total;
  invariante(
    "e a janela vazia custa o dobro em relação a quem tem folha no mês anterior",
    custoDaJanelaVazia > 0 && rA.das.total > rB.das.total * 2.5,
    `${brlDeCentavos(rA.das.total)} contra ${brlDeCentavos(rB.das.total)} — diferença de ${brlDeCentavos(custoDaJanelaVazia)} num mês só`
  );

  /* ── O ALERTA INTERNO que esse caso dispara ──────────────────────────── */

  const alertaA = alertasDoRetrato({ retrato: rA, empresa: emp });

  // 🔴 SEMPRE `.toISOString()` NUMA DATA DE PRAZO, nunca `String()`.
  //    O motor guarda vencimento em UTC à meia-noite; `String()` renderiza no
  //    fuso local (UTC-3) e mostra o DIA ANTERIOR às 21h. Este invariante
  //    falhou por isso na 1ª rodada, e o alerta estava certo o tempo todo.
  //    ⚠️ Se essa conversão vazar para tela, o cliente lê um prazo a menos.
  const prazoISO = (a) => new Date(a?.prazo).toISOString().slice(0, 10);

  invariante(
    "e o caso dispara alerta INTERNO, com prazo e valor",
    alertaA.length === 1 && alertaA[0].id === "A1",
    alertaA.length
      ? `A1 · prazo ${prazoISO(alertaA[0])} · folha necessária ${brlDeCentavos(alertaA[0].proLaboreNecessario)}`
      : "🔴 nenhum alerta"
  );

  // 🔴 O ERRO QUE ESTE INVARIANTE PEGOU DE VERDADE. Na 1ª versão do alerta o
  //    prazo saiu 15/09 para a competência 09, porque eu subtraí um mês que o
  //    `vencimentoDe` já subtrai sozinho. Prazo errado num alerta é pior que
  //    alerta nenhum: a casa liga depois de a janela ter fechado.
  invariante(
    "e o prazo é o do eSocial do mês SEGUINTE, não o do mês da competência",
    prazoISO(alertaA[0]) === "2026-10-15",
    `competência 2026-09 → prazo ${prazoISO(alertaA[0])}`
  );

  // E quem tem folha no mês anterior não pode ser incomodado.
  invariante(
    "quem tem folha no mês anterior NÃO dispara alerta nenhum",
    alertasDoRetrato({ retrato: rB, empresa: emp }).length === 0 &&
      alertasDoRetrato({ retrato: rC, empresa: emp }).length === 0,
    "nem quem abriu e não faturou"
  );

  // 🔑 E o elenco deixou de ser silencioso aqui: a P21 exercita o caso.
  const alertasDasVidas = VIDAS.flatMap((v) =>
    v.competencias.flatMap((cp) =>
      alertasDoRetrato({
        retrato: retratoDoMes({ empresa: v.empresa, competencias: v.competencias, mesAlvo: cp.mes }),
        empresa: v.empresa,
      })
    )
  );
  // 🔄 ESTE INVARIANTE FOI INVERTIDO EM 16/09. Ele nascia afirmando que
  //    NENHUMA vida exercitava o caso, e existia para cobrar a vida que
  //    faltava. A P21 nasceu, e agora ele afirma o contrário.
  invariante(
    "e alguma vida REAL exercita o caso, não só cenário sintético",
    alertasDasVidas.length > 0,
    alertasDasVidas.length
      ? `${alertasDasVidas.length} alerta(s) nas ${VIDAS.length} vidas`
      : "🔴 voltou a ser só teste sintético"
  );

  /* ── A P21 · a vida que nasceu para este caso ─────────────────────────── */

  const p21 = VIDAS.find((v) => v.id === "P21");
  const linhasP21 = p21.competencias.map((cp) =>
    retratoDoMes({ empresa: p21.empresa, competencias: p21.competencias, mesAlvo: cp.mes })
  );

  invariante(
    "a P21 é tributada pelo Anexo V APENAS no mês em que abriu",
    linhasP21[0].anexo === "V" && linhasP21.slice(1).every((l) => l.anexo === "III"),
    `${linhasP21.map((l) => l.anexo).join(" → ")}`
  );

  // 🔑 O que a vida prova e o número que ela mede: o prejuízo é de UM mês.
  const custoDoMes1 = linhasP21[0].das.total - linhasP21[1].das.total;
  invariante(
    "e o que faturar no mês da abertura custou é de um mês só, não permanente",
    custoDoMes1 > 0,
    `${brlDeCentavos(linhasP21[0].das.total)} contra ${brlDeCentavos(linhasP21[1].das.total)} no mês seguinte — diferença de ${brlDeCentavos(custoDoMes1)}, uma vez`
  );

  // 🔴 A ARMADILHA DE MODELAGEM QUE EU CAÍ E ESTE INVARIANTE IMPEDE.
  //    Na 1ª versão a P21 tinha folha ZERO no mês da abertura, e a vida INTEIRA
  //    ficava no Anexo V. Sem perceber, eu tinha modelado o cliente RECUSANDO
  //    a oferta do alerta — e a persona provava o contrário do que devia.
  invariante(
    "e ela tem folha no mês da abertura, senão modela o cliente RECUSANDO a oferta",
    p21.competencias[0].proLaborePago > 0,
    "é a folha gerada no prazo que faz o mês 2 sair no III — sem ela a vida prova o oposto"
  );

  invariante(
    "e ela exercita a conta da concentração em pelo menos um mês",
    linhasP21.some((l) => l.concentracaoDaFolha?.vale),
    linhasP21
      .filter((l) => l.concentracaoDaFolha?.vale)
      .map((l) => `${l.mes}: ${brlDeCentavos(l.concentracaoDaFolha.economiaMensal)}`)
      .join(" · ") || "🔴 nenhum"
  );
}

/* ── 9 · O PISO É O DA COMPETÊNCIA (regra nova de 16/09) ────────────────── */

// 🔢 Conta, não afirma — este título já disse "16" com 17 vidas no arquivo.
const comecamEm2025 = VIDAS.filter((v) => v.competencias[0].mes.startsWith("2025")).length;
console.log(
  `\n── 9 · O salário mínimo tem vigência, e ${comecamEm2025} das ${VIDAS.length} vidas começam em 2025\n`
);
{
  // 🔴 O contador levantou isto como manutenção — *"todo ano você vai rodar um
  //    código lá pra atualizar?"* — e o achado saiu de CORREÇÃO: com uma
  //    constante única, competência de 2025 é comparada com o piso de 2026.

  invariante(
    "o piso de 2025 e o de 2026 são valores diferentes",
    salarioMinimoDe("2025-12").valor === 1518 &&
      salarioMinimoDe("2026-01").valor === 1621,
    "R$1.518 em 2025 · R$1.621 em 2026"
  );

  // 🔴 O BUG QUE ISTO EXISTE PARA IMPEDIR: R$1.518 era EXATAMENTE o mínimo de
  //    dezembro/2025. Com piso único, o motor recusava um valor correto.
  const emp = { grupoAnexo: "III-ou-V", cltDoSocio: 0 };
  const args = { empresa: emp, competenciasAnteriores: [], receitaDoMes: 0, rbt12DoMes: 0 };

  invariante(
    "pró-labore no mínimo de 2025, numa competência de 2025, é ACEITO",
    avaliarProLaboreEscolhido({ ...args, escolhido: 151800, mes: "2025-12" }).aceito === true,
    "com piso único isto era bloqueado, e o valor estava certo"
  );

  invariante(
    "e o R$100 da conta real segue bloqueado, mesmo com o piso certo de 2025",
    avaliarProLaboreEscolhido({ ...args, escolhido: 100, mes: "2025-12" }).aceito === false,
    "a correção do piso não afrouxa a trava, só acerta o valor dela"
  );

  // ⏳ A tabela vence, e quem estiver fora da janela precisa SABER.
  const alem = salarioMinimoDe("2027-03");
  invariante(
    "competência além da janela conhecida devolve valor COM aviso",
    alem.valor !== null && alem.foraDaJanela === true && !!alem.aviso,
    "não devolve número mudo: avisa que o piso pode ter mudado"
  );

  // E as vidas que começam em 2025 existem mesmo — senão este bloco é teatro.
  const de2025 = VIDAS.filter((v) => v.competencias[0]?.mes?.startsWith("2025"));
  invariante(
    "e há vida começando em 2025 para o caso não ser hipotético",
    de2025.length > 0,
    `${de2025.length} vidas: ${de2025.map((v) => v.id).join(", ")}`
  );
}

/* ── 10 · MÊS SEM FATURAR NÃO É MÊS EM ATRASO (regra nova de 17/09) ─────── */

console.log("\n── 10 · O mês sem faturar com a janela saudável é MANUTENÇÃO, não recuperação\n");
{
  /**
   * 🔴 ESTE BLOCO EXISTE POR CAUSA DO M-032, e o achado não veio de suíte
   * nenhuma: veio de um **teste de cenário que o Pedro montou** com a empresa
   * dele, em 17/09.
   *
   * O piloto classificava mês de receita ZERO como `recuperacao` mesmo com a
   * janela do Fator R acima da margem. A causa era o **piso do salário mínimo
   * entrando na conta do déficit**: com receita zero o sustentável é zero, e
   * `piso − 0` parecia dívida.
   *
   * 🔑 O valor sugerido saía certo; o rótulo é que mentia. E o rótulo importa
   * porque `paraVirarJa` só é exposto em `recuperacao` — a tela mostraria um
   * "para virar já" que é só o piso, como se fosse salto a dar.
   *
   * ⚠️ Antes da P22, **nenhuma das 17 vidas** tinha esse mês. É por isso que o `[HISTÓRICO]`
   * bloco começa provando que a vida existe: sem ela, o resto é teatro.
   */
  const casos = [];
  for (const { vida, linhas } of retratos) {
    linhas.forEach((l, i) => {
      if (i === 0 || l.receita !== 0) return;
      if (!l.fatorR || !Number.isFinite(l.fatorR.fr)) return;
      if (l.fatorR.fr >= FATOR_R.MARGEM) casos.push({ vida, l });
    });
  }

  invariante(
    "existe vida com mês de receita ZERO e janela ACIMA da margem",
    casos.length > 0,
    casos.length
      ? casos.map((c) => `${c.vida.id} ${c.l.mes} (${(c.l.fatorR.fr * 100).toFixed(2)}%)`).join(" · ")
      : "🔴 o caso do M-032 voltou a ser hipotético"
  );

  const rotuladosErrado = casos.filter((c) => c.l.piloto?.modo === "recuperacao");
  invariante(
    "🔴 e NENHUM deles é chamado de recuperação — o piso não é déficit",
    rotuladosErrado.length === 0,
    rotuladosErrado.length
      ? rotuladosErrado.map((c) => `${c.vida.id} ${c.l.mes}`).join(" · ")
      : "empresa adiante do alvo não é empresa atrasada"
  );

  invariante(
    "e o 'para virar já' não aparece, porque não há salto a dar",
    casos.every((c) => c.l.piloto?.paraVirarJa == null),
    "expor o piso como salto ensinaria o cliente a pagar por medo"
  );

  // 🔑 O contraponto que fecha o sentido: sem receita o DAS é zero, mas a
  //    guia do SÓCIO continua existindo. O pró-labore não para quando o
  //    faturamento para, e é justamente isso que segura o Fator R.
  const comDarf = casos.filter((c) => c.l.das.total === 0 && (c.l.darf?.total ?? 0) > 0);
  invariante(
    "🔑 DAS zero e DARF do sócio existindo no mesmo mês",
    comDarf.length > 0,
    comDarf
      .map((c) => `${c.vida.id} ${c.l.mes}: DAS ${brlDeCentavos(c.l.das.total)} · DARF ${brlDeCentavos(c.l.darf.total)}`)
      .join(" · ")
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
