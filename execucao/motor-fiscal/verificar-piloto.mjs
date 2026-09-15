/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 VERIFICADOR DO PILOTO DE PRÓ-LABORE
 * ═══════════════════════════════════════════════════════════════════════════
 * Mesma régua das vidas: aqui se afirma **relação**, não valor. Nenhum número
 * deste arquivo saiu de documento, e nenhum teste diz "o DAS é R$X".
 *
 * 🔑 O teste que carrega o arquivo é o **G-P1**: pega o valor que o piloto
 * mandou pagar, devolve pro `fatorRDeCompetencias` e confere que a razão
 * resultante fecha em cima do alvo. Se a álgebra da janela estiver errada, é
 * aqui que quebra — e não numa tela, seis meses depois.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  proLaboreParaManterNoIII,
  valeManterNoIII,
  pilotar,
  projetarVirada,
  LIMITES_DO_PILOTO,
} from "./piloto-pro-labore.mjs";

import { fatorRDeCompetencias, aliquotaEfetiva } from "./apurador.mjs";
import { FATOR_R, PREVIDENCIA } from "./_tabelas.mjs";

let passaram = 0;
const falhas = [];

function ok(nome, condicao, detalhe = "") {
  if (condicao) {
    passaram++;
    console.log(`   ✅ ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  } else {
    falhas.push(nome);
    console.log(`   ❌ ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  }
}

function titulo(t) {
  console.log(`\n${"─".repeat(76)}\n${t}\n`);
}

/** Monta uma série de competências com receita e pró-labore constantes. */
const serie = (n, receita, proLabore, inicio = 1) =>
  Array.from({ length: n }, (_, i) => ({
    mes: `m${inicio + i}`,
    receita,
    proLaboreDeclarado: proLabore,
    proLaborePago: proLabore,
  }));

const DINAMICO = { grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)" };
const FIXO = { grupoAnexo: "III-fixo" };
const REVISAO = { grupoAnexo: "requer-revisao" };

/* ═══════════════════════════════════════════════════════════════════════════
 * G-P1 · A ida e a volta — o valor sugerido produz o Fator R prometido
 * ═══════════════════════════════════════════════════════════════════════════ */

titulo("G-P1 · IDA E VOLTA: o que o piloto manda pagar entrega os 28%?");

/** Fecha o ciclo: calcula o mínimo, paga esse mínimo, remede o Fator R. */
function idaEVolta(anteriores, receitaDoMes, alvo = FATOR_R.LIMIAR) {
  const r = proLaboreParaManterNoIII({
    competenciasAnteriores: anteriores,
    receitaDoMes,
    alvo,
  });
  const janela = [
    ...anteriores.slice(-11),
    {
      mes: "corrente",
      receita: receitaDoMes,
      proLaboreDeclarado: r.minimo,
      proLaborePago: r.minimo,
    },
  ];
  const fr = fatorRDeCompetencias({ competencias: janela });
  return { r, fr };
}

// Caso A — empresa MADURA (12 fechados), pró-labore no piso, faturando alto.
{
  const anteriores = serie(12, 18000, PREVIDENCIA.SALARIO_MINIMO);
  const { r, fr } = idaEVolta(anteriores, 18000);
  ok(
    "madura: a janela fecha em 12 meses",
    r.mesesNaJanela === 12,
    `${r.mesesNaJanela} meses`
  );
  ok(
    "🔑 com 12 na janela a anualização é IDENTIDADE (média×12 = soma)",
    r.anualiza === true && fr.anualizado === true,
    "o art. 26 §4º conta meses de ATIVIDADE; em 12 o ×12 não altera nada"
  );
  ok(
    "madura: o Fator R resultante alcança o limiar",
    fr.fr >= FATOR_R.LIMIAR,
    `${(fr.fr * 100).toFixed(4)}%`
  );
  ok("madura: e o anexo resultante é o III", fr.anexo === "III");
  ok(
    "madura: e fica COLADO no limiar, não muito acima (é o mínimo)",
    fr.fr - FATOR_R.LIMIAR < 0.0001,
    `folga de ${((fr.fr - FATOR_R.LIMIAR) * 100).toFixed(6)} pp`
  );
}

// Caso B — empresa NOVA (4 fechados): tem que anualizar, e o ×12 cancela.
{
  const anteriores = serie(4, 9000, PREVIDENCIA.SALARIO_MINIMO);
  const { r, fr } = idaEVolta(anteriores, 9000);
  ok(
    "nova: a janela tem 5 meses e ANUALIZA (art. 26 §4º)",
    r.mesesNaJanela === 5 && r.anualiza === true && fr.anualizado === true
  );
  ok(
    "🔑 nova: a MESMA fórmula fecha, porque o ×12 cancela nos dois lados",
    fr.fr >= FATOR_R.LIMIAR && fr.fr - FATOR_R.LIMIAR < 0.0001,
    `${(fr.fr * 100).toFixed(4)}%`
  );
}

// Caso C — o 1º mês de vida. Nada fechado atrás.
{
  const { r, fr } = idaEVolta([], 12000);
  ok(
    "mês 1: a janela é só ele, e a conta é 28% da própria receita",
    r.mesesNaJanela === 1 && Math.abs(r.minimo - 12000 * 0.28) < 0.01,
    `R$ ${r.minimo.toFixed(2)}`
  );
  ok("mês 1: e o Fator R fecha", fr.anexo === "III");
}

// Caso D — o alvo da margem (30%) entrega mais que o limiar, sempre.
{
  const anteriores = serie(12, 18000, PREVIDENCIA.SALARIO_MINIMO);
  const { fr } = idaEVolta(anteriores, 18000, FATOR_R.MARGEM);
  ok(
    "margem de 30%: entrega folga real acima do limiar legal",
    fr.fr >= FATOR_R.MARGEM && fr.fr > FATOR_R.LIMIAR,
    `${(fr.fr * 100).toFixed(4)}%`
  );
}

// Caso E — 1 centavo a menos derruba. É por isso que o arredondamento é pra cima.
{
  const anteriores = serie(12, 18000, PREVIDENCIA.SALARIO_MINIMO);
  const r = proLaboreParaManterNoIII({
    competenciasAnteriores: anteriores,
    receitaDoMes: 18000,
  });
  const janela = [
    ...anteriores.slice(-11),
    {
      mes: "corrente",
      receita: 18000,
      proLaboreDeclarado: r.minimo - 0.01,
      proLaborePago: r.minimo - 0.01,
    },
  ];
  const fr = fatorRDeCompetencias({ competencias: janela });
  ok(
    "🔴 um centavo a menos que o mínimo JÁ cai pro Anexo V",
    fr.anexo === "V",
    `${(fr.fr * 100).toFixed(6)}% < 28%`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * G-P2 · Em quem o piloto NÃO encosta
 * ═══════════════════════════════════════════════════════════════════════════ */

titulo("G-P2 · OS 65 III-FIXO, OS 7 EM REVISÃO, E O MÊS SEM RECEITA");

{
  const p = pilotar({ empresa: FIXO, competenciasAnteriores: serie(12, 18000, 1621), receitaDoMes: 18000 });
  ok("III-fixo: o piloto não atua", p.atua === false && p.motivo === "anexo-fixo");
  ok(
    "🔴 III-fixo: e a tela NÃO pode falar de Fator R (mentiria por omissão)",
    p.podeFalarDeFatorR === false
  );
  ok("III-fixo: e o anexo devolvido é o III", p.anexo === "III");
}

{
  const p = pilotar({ empresa: REVISAO, competenciasAnteriores: [], receitaDoMes: 5000 });
  ok(
    "requer-revisao: o piloto se RECUSA em vez de chutar",
    p.atua === false && p.motivo === "cnae-indefinido" && !!p.erro
  );
}

{
  const p = pilotar({ empresa: DINAMICO, competenciasAnteriores: serie(3, 0, 0), receitaDoMes: 0 });
  ok(
    "sem receita na janela: não atua, porque a razão infinita já dá Anexo III",
    p.atua === false && p.motivo === "sem-receita-na-janela"
  );
  ok(
    "🔑 e aqui a tela PODE falar de Fator R — é dinâmico, só não há o que fazer",
    p.podeFalarDeFatorR === true
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * G-P3 · A decisão econômica — segurar no III nem sempre compensa
 * ═══════════════════════════════════════════════════════════════════════════ */

titulo("G-P3 · QUANDO SEGURAR NO ANEXO III CUSTA MAIS DO QUE O ANEXO V");

{
  // Faturamento alto e folha no piso: a economia no DAS é grande.
  const p = pilotar({
    empresa: DINAMICO,
    competenciasAnteriores: serie(12, 25000, PREVIDENCIA.SALARIO_MINIMO),
    receitaDoMes: 25000,
    rbt12DoMes: 300000,
  });
  ok("faturamento alto e atrasado: o piloto atua", p.atua === true);
  ok(
    "🔴 e RECONHECE que é recuperação, não manutenção",
    p.modo === "recuperacao" && p.deficit > 0,
    `déficit de R$ ${p.deficit.toFixed(2)}`
  );
  ok(
    "🔴 o sugerido é o SUSTENTÁVEL, não o valor insano de virar já",
    p.sugerido === p.sustentavel && p.paraVirarJa > p.sugerido * 5,
    `sugerido R$ ${p.sugerido.toFixed(2)} × virar já R$ ${p.paraVirarJa.toFixed(2)}`
  );
  ok(
    "🔑 e o sustentável é exatamente a margem sobre a receita do mês",
    Math.abs(p.sustentavel - 25000 * 0.3) < 0.01
  );
  ok(
    "com o sugerido sustentável, a conta econômica fecha a favor do III",
    p.economia.vale === true,
    `economia ${(p.economia.economiaNoDas / 100).toFixed(2)} × custo ${(p.economia.custoExtra / 100).toFixed(2)}`
  );
}

{
  // Empresa PILOTADA desde o mês 1: manutenção pura, sem déficit.
  const p = pilotar({
    empresa: DINAMICO,
    competenciasAnteriores: serie(12, 25000, 25000 * 0.3),
    receitaDoMes: 25000,
    rbt12DoMes: 300000,
  });
  ok(
    "🔑 quem foi pilotado desde o início está em MANUTENÇÃO, sem déficit",
    p.modo === "manutencao" && p.deficit === 0 && p.paraVirarJa === null
  );
  ok(
    "e o valor do mês é o mesmo sustentável de sempre — sem solavanco",
    Math.abs(p.sugerido - p.sustentavel) < 0.01,
    `R$ ${p.sugerido.toFixed(2)}/mês`
  );
}

{
  // 🔴 O contra-caso: RBT12 alto (alíquotas próximas) com receita do mês baixa.
  // A economia do mês é pequena e o custo de subir a folha é grande.
  const anteriores = serie(12, 28000, PREVIDENCIA.SALARIO_MINIMO);
  const v = valeManterNoIII({
    receitaDoMes: 1000,
    rbt12: 330000,
    proLaborePiso: PREVIDENCIA.SALARIO_MINIMO,
    proLaboreNecessario: 9000,
    cltRemuneracao: 0,
  });
  ok(
    "🔴 mês fraco com folha longe dos 28%: NÃO compensa segurar no III",
    v.vale === false,
    `saldo ${(v.saldo / 100).toFixed(2)}`
  );
  ok(
    "🔴 e o ALERTA é sobre o SALTO, não sobre o ajuste do mês",
    (() => {
      const p = pilotar({
        empresa: DINAMICO,
        competenciasAnteriores: anteriores,
        receitaDoMes: 1000,
        rbt12DoMes: 330000,
      });
      return (
        p.atua === true &&
        p.modo === "recuperacao" &&
        p.economia.vale === true &&
        p.economiaDoSalto.vale === false &&
        p.alerta !== null
      );
    })(),
    "o mês compensa; quitar o déficit de uma vez, não"
  );
}

{
  // 🔴 O MODO DO MEIO, achado pelo rastro da P16 em 15/09.
  // Receita CRESCENDO com o piloto sempre no comando: não há atraso nenhum,
  // mas 30% do mês corrente não segura a razão dos 12 meses, porque os meses
  // antigos são menores em valor absoluto e ainda estão na janela.
  const crescendo = [];
  for (let i = 0; i < 12; i++) {
    const receita = 10000 + i * 2000; // de R$10 mil a R$32 mil
    crescendo.push({
      mes: `c${i}`,
      receita,
      proLaboreDeclarado: receita * 0.3,
      proLaborePago: receita * 0.3,
    });
  }
  const p = pilotar({
    empresa: DINAMICO,
    competenciasAnteriores: crescendo,
    receitaDoMes: 34000,
    rbt12DoMes: 250000,
  });

  ok(
    "receita crescendo com folha sempre no alvo: nada a corrigir",
    p.modo === "manutencao" && p.deficit === 0,
    `pagar 30% de CADA mês mantém a janela em 30%, mesmo crescendo`
  );

  // 🔴 O CASO REAL QUE MOTIVOU O MODO DO MEIO — o formato da vida da P16.
  // Começa com um mês SEM receita pagando o piso, e o 2º mês preso ao piso
  // também. Esses meses distorcem a janela enquanto estão nela; quando ela
  // rola e eles saem, a razão escorrega — sem que ninguém tenha atrasado nada.
  //
  // ⚠️ Eu atribuí isso ao "crescimento" e estava errado: a causa é a janela
  // ROLANDO sobre meses de formato diferente. Este teste afirma a GARANTIA
  // que importa, não a minha explicação: pilotado desde o mês 1, o Fator R
  // nunca cai abaixo do limiar legal.
  const RECEITAS_P16 = [
    0, 8000, 12000, 15000, 18000, 22000, 25000, 25000, 25000, 28000, 25000,
    25000, 25000, 30000, 28000, 25000, 32000, 28000, 35000, 38000, 40000, 42000,
  ];

  const historia = [];
  let menorRazao = Infinity;
  let caiuAbaixoDoLimiar = null;
  let abaixoDaMargem = 0;

  for (let i = 0; i < RECEITAS_P16.length; i++) {
    const receita = RECEITAS_P16[i];
    const d = pilotar({
      empresa: DINAMICO,
      competenciasAnteriores: [...historia],
      receitaDoMes: receita,
      rbt12DoMes: 0,
    });
    const pl = d.atua ? d.sugerido : PREVIDENCIA.SALARIO_MINIMO;
    historia.push({
      mes: `p${i}`,
      receita,
      proLaboreDeclarado: pl,
      proLaborePago: pl,
    });

    const janela = historia.slice(-12);
    const fr = fatorRDeCompetencias({ competencias: janela });
    if (fr.fr != null && Number.isFinite(fr.fr)) {
      menorRazao = Math.min(menorRazao, fr.fr);
      if (fr.fr < FATOR_R.LIMIAR) caiuAbaixoDoLimiar = `mês ${i}: ${(fr.fr * 100).toFixed(2)}%`;
      if (fr.fr < FATOR_R.MARGEM - 1e-9) abaixoDaMargem++;
    }
  }

  ok(
    "🔑 GARANTIA: pilotada desde o mês 1, a P16 NUNCA cai abaixo do limiar legal",
    caiuAbaixoDoLimiar === null,
    caiuAbaixoDoLimiar ?? `menor razão do percurso: ${(menorRazao * 100).toFixed(2)}%`
  );
  ok(
    "e a folga entre a margem (30%) e o limiar (28%) é o que absorve o escorregão",
    menorRazao >= FATOR_R.LIMIAR && menorRazao < FATOR_R.MARGEM + 1e-9,
    `${abaixoDaMargem} de ${RECEITAS_P16.length} competências abaixo da margem, nenhuma abaixo do limiar`
  );
  ok(
    "🔑 o atraso de um ano continua sendo recuperação (9,6× o sustentável)",
    (() => {
      const q = pilotar({
        empresa: DINAMICO,
        competenciasAnteriores: serie(12, 25000, PREVIDENCIA.SALARIO_MINIMO),
        receitaDoMes: 25000,
        rbt12DoMes: 300000,
      });
      return q.modo === "recuperacao" && q.paraVirarJa !== null;
    })()
  );
}

{
  // 🔑 A VARREDURA QUE AUTORIZA O AUTOMÁTICO: em toda a faixa do ME, pagar o
  // sustentável compensa. Se um dia deixar de compensar em algum ponto, o
  // piloto não pode mais rodar calado — e este teste é quem avisa.
  let pior = Infinity;
  let falhou = null;
  for (let receita = 2000; receita <= 30000; receita += 1000) {
    for (let rbt12 = 24000; rbt12 <= 360000; rbt12 += 12000) {
      const p = pilotar({
        empresa: DINAMICO,
        competenciasAnteriores: serie(12, receita, PREVIDENCIA.SALARIO_MINIMO),
        receitaDoMes: receita,
        rbt12DoMes: rbt12,
      });
      if (!p.atua) continue;
      if (p.economia.saldo < pior) pior = p.economia.saldo;
      if (!p.economia.vale) falhou = `receita ${receita} · RBT12 ${rbt12}`;
    }
  }
  ok(
    "🔑 pagar o SUSTENTÁVEL compensa em toda a faixa do ME — é o que autoriza o automático",
    falhou === null,
    falhou ?? `pior saldo do varrimento: R$ ${(pior / 100).toFixed(2)}/mês`
  );
}

{
  // O CLT que já consome o teto: subir pró-labore não gera INSS nenhum.
  const comClt = valeManterNoIII({
    receitaDoMes: 18000,
    rbt12: 200000,
    proLaborePiso: PREVIDENCIA.SALARIO_MINIMO,
    proLaboreNecessario: 6000,
    cltRemuneracao: 9000,
  });
  const semClt = valeManterNoIII({
    receitaDoMes: 18000,
    rbt12: 200000,
    proLaborePiso: PREVIDENCIA.SALARIO_MINIMO,
    proLaboreNecessario: 6000,
    cltRemuneracao: 0,
  });
  ok(
    "🔑 sócio com CLT que já bateu o teto: subir a folha custa MENOS",
    comClt.custoExtra < semClt.custoExtra,
    `${(comClt.custoExtra / 100).toFixed(2)} × ${(semClt.custoExtra / 100).toFixed(2)}`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * G-P4 · O retrovisor — corrigir hoje não conserta hoje
 * ═══════════════════════════════════════════════════════════════════════════ */

titulo("G-P4 · A DATA DA VIRADA (o achado do P01, virado em número)");

{
  // 11 meses no piso com faturamento alto = Anexo V cravado. Agora corrige.
  const historico = serie(12, 18000, PREVIDENCIA.SALARIO_MINIMO);
  const frAntes = fatorRDeCompetencias({ competencias: historico });
  ok(
    "ponto de partida: 12 meses de folha no piso deixam a empresa no V",
    frAntes.anexo === "V",
    `${(frAntes.fr * 100).toFixed(2)}%`
  );

  const proj = projetarVirada({
    competenciasAnteriores: historico,
    receitaProjetada: 18000,
    proLaborePlanejado: 18000 * 0.3,
    horizonte: 24,
  });

  ok(
    "🔴 corrigir o pró-labore NÃO devolve o Anexo III na competência seguinte",
    proj.viraEm !== null && proj.viraEm > 1,
    `vira no passo ${proj.viraEm}`
  );
  ok(
    "e o produto sabe dizer quantos meses ainda se paga 15,5% com a folha já certa",
    proj.mesesAindaNoV >= 1,
    `${proj.mesesAindaNoV} meses`
  );
  ok(
    "a projeção acaba no Anexo III (a janela rola e os meses ruins saem)",
    proj.linha[proj.linha.length - 1].anexo === "III"
  );
  ok(
    "🔑 e o Fator R sobe monotonicamente enquanto a janela rola",
    (() => {
      const frs = proj.linha.map((l) => l.fatorR).filter((x) => x != null);
      return frs.every((v, i) => i === 0 || v >= frs[i - 1] - 1e-12);
    })()
  );
}

{
  // Quem já está certo desde o mês 1 nunca precisa de virada.
  const historico = serie(12, 18000, 18000 * 0.3);
  const proj = projetarVirada({
    competenciasAnteriores: historico,
    receitaProjetada: 18000,
    proLaborePlanejado: 18000 * 0.3,
    horizonte: 12,
  });
  ok(
    "🔑 quem foi pilotado desde o mês 1 já está no III no passo 1",
    proj.viraEm === 1 && proj.mesesAindaNoV === 0
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * G-P5 · Fronteiras e coerência
 * ═══════════════════════════════════════════════════════════════════════════ */

titulo("G-P5 · FRONTEIRAS");

{
  ok(
    "a margem (30%) nunca pede menos que o limiar (28%)",
    (() => {
      for (let r = 1000; r <= 30000; r += 1000) {
        const ant = serie(12, r, 1621);
        const noLimiar = proLaboreParaManterNoIII({ competenciasAnteriores: ant, receitaDoMes: r });
        const naMargem = proLaboreParaManterNoIII({
          competenciasAnteriores: ant,
          receitaDoMes: r,
          alvo: FATOR_R.MARGEM,
        });
        if (naMargem.minimo < noLimiar.minimo) return false;
      }
      return true;
    })(),
    "testado de R$1 mil a R$30 mil"
  );

  ok(
    "folha já folgada: o mínimo é ZERO, não um valor negativo",
    (() => {
      const ant = serie(12, 5000, 4000); // folha muito acima de 28%
      const r = proLaboreParaManterNoIII({ competenciasAnteriores: ant, receitaDoMes: 5000 });
      return r.minimo === 0 && r.necessarioCru < 0;
    })()
  );

  ok(
    "🔴 pró-labore DECLARADO e não pago não conta no que já foi feito",
    (() => {
      const pago = serie(12, 10000, 3000);
      const naoPago = pago.map((c) => ({ ...c, proLaborePago: 0 }));
      const a = proLaboreParaManterNoIII({ competenciasAnteriores: pago, receitaDoMes: 10000 });
      const b = proLaboreParaManterNoIII({ competenciasAnteriores: naoPago, receitaDoMes: 10000 });
      return b.minimo > a.minimo;
    })(),
    "regime de caixa, art. 26 §6º"
  );

  ok(
    "o piloto respeita o piso do salário mínimo quando a conta pede menos",
    (() => {
      const p = pilotar({
        empresa: DINAMICO,
        competenciasAnteriores: serie(12, 1000, 1621),
        receitaDoMes: 1000,
        rbt12DoMes: 12000,
      });
      return p.atua && p.sugerido === PREVIDENCIA.SALARIO_MINIMO;
    })()
  );

  ok(
    "🔑 a receita do mês corrente ENTRA na conta (é o que torna preventivo)",
    (() => {
      const ant = serie(12, 10000, 2800);
      const semNota = proLaboreParaManterNoIII({ competenciasAnteriores: ant, receitaDoMes: 0 });
      const comNota = proLaboreParaManterNoIII({ competenciasAnteriores: ant, receitaDoMes: 40000 });
      return comNota.minimo > semNota.minimo;
    })(),
    "nota grande no fim do mês levanta o mínimo na hora"
  );

  ok(
    "o Anexo V é mais caro que o III em todo RBT12 do escopo ME",
    (() => {
      for (let r = 1000; r <= 360000; r += 1000) {
        if (aliquotaEfetiva(r, "V") <= aliquotaEfetiva(r, "III")) return false;
      }
      return true;
    })(),
    "é o que torna o piloto uma decisão, e não um detalhe"
  );

  ok(
    "os limites do piloto estão declarados, com dono",
    LIMITES_DO_PILOTO.length >= 5 &&
      LIMITES_DO_PILOTO.every((l) => l.id && l.o_que && l.porque && l.dono),
    `${LIMITES_DO_PILOTO.length} limites`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

console.log(`\n${"─".repeat(76)}\n`);
if (falhas.length) {
  console.log(`❌ ${falhas.length} falha(s):\n   ${falhas.join("\n   ")}\n`);
  process.exit(1);
}
console.log(`✅ ${passaram} conferências passaram — o piloto mantém no III por construção\n`);
