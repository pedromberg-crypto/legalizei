/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧮 O APURADOR — o que a empresa deve, no mês.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu em 14/09. Antes dele o vault tinha `app/src/lib/fiscal.ts`, que é
 * **estimador de abertura** (quanto alguém provavelmente vai pagar, antes de
 * abrir). Este é **apurador**: quanto uma empresa que já opera deve NESTE mês.
 * São coisas diferentes e não se substituem.
 *
 * ── 🔴 A REGRA QUE FEZ ISTO EXISTIR ────────────────────────────────────────
 *
 * O DAS é a **soma de seis parcelas arredondadas**, não o arredondamento do
 * produto. Provado contra o recibo oficial do PGDAS-D de ago/2026 da persona
 * zero: `7.910 × 6% = 474,60`, e a guia da Receita sai **R$ 474,59**.
 *
 * Quem calcula `receita × alíquota` erra centavo em toda guia — e guia com
 * valor diferente do PGDAS é divergência com a Receita, não detalhe cosmético.
 *
 * ── 💰 POR QUE TUDO ANDA EM CENTAVOS ───────────────────────────────────────
 *
 * Ponto flutuante não fecha soma de dinheiro: em JS, `7910 * 0.06` devolve
 * `474.59999999999997`. Cada parcela vira **inteiro em centavos** na hora do
 * arredondamento, e a soma é soma de inteiros. Só a exibição volta pra reais.
 *
 * ── ⚠️ ONDE ESTE MOTOR NÃO CHEGA ───────────────────────────────────────────
 *
 * Ele calcula o que a LEI manda sobre números que alguém informa. Ele NÃO
 * sabe se o pró-labore foi mesmo pago (regra de caixa do Fator R — é o passo
 * vermelho `P5.8`), nem se a receita informada é toda a receita. Isso é
 * declaração do cliente, e a responsabilidade tem instrumento próprio: a
 * Carta de Responsabilidade da Administração (Res. CFC 1.590/2020 art. 3º).
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FAIXAS, REPARTICAO, TRIBUTOS, FATOR_R } from "./_tabelas.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · DINHEIRO
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Reais → centavos, arredondando meio-pra-cima. É aqui que o centavo morre. */
export const emCentavos = (reais) => Math.round(reais * 100);

/** Centavos → reais. Só pra sair do motor, nunca no meio da conta. */
export const emReais = (centavos) => centavos / 100;

/** R$ 1.234,56 — para relatório e conferência, não para cálculo. */
export function brl(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · A FAIXA E A ALÍQUOTA
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Em que faixa a empresa está, pelo RBT12.
 *
 * 🔴 Acima do teto da 6ª faixa (R$4,8mi) NÃO devolve a 6ª: devolve `null`.
 * A empresa saiu do Simples, e um motor que devolve a última faixa por
 * conveniência esconde exatamente o evento que precisa ser gritado.
 */
export function faixaDe(rbt12, anexo) {
  const tabela = FAIXAS[anexo];
  if (!tabela) throw new Error(`Anexo fora do escopo: ${anexo}. Só III e V.`);
  if (rbt12 < 0) throw new Error(`RBT12 negativo: ${rbt12}`);
  return tabela.find((f) => rbt12 <= f.ate) ?? null;
}

/**
 * A alíquota EFETIVA — o que se paga de verdade.
 *
 * `(RBT12 × nominal − deduzir) ÷ RBT12`. Na 1ª faixa a parcela a deduzir é
 * zero, então efetiva = nominal (6% no III, 15,5% no V).
 *
 * ⏳ **LACUNA DECLARADA: empresa em início de atividade.** Com `rbt12 = 0`
 * esta conta divide por zero. A Res. CGSN 140/2018 art. 24 manda
 * proporcionalizar nos primeiros 12 meses, e essa regra **ainda não foi lida
 * em fonte primária** — só sabemos que existe. Até lá o motor RECUSA em vez
 * de chutar: número sem fonte não entra (regra anti-guru do vault).
 */
export function aliquotaEfetiva(rbt12, anexo) {
  if (rbt12 === 0) {
    throw new Error(
      "RBT12 zero: empresa em início de atividade proporcionaliza (Res. CGSN 140/2018 art. 24), " +
        "e essa regra ainda não foi lida em fonte primária. Ver LACUNAS."
    );
  }
  const f = faixaDe(rbt12, anexo);
  if (!f) return null; // fora do Simples
  return (rbt12 * f.nominal - f.deduzir) / rbt12;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · O DAS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Apura o DAS do mês, tributo a tributo.
 *
 * Devolve `{ total, parcelas, efetiva, faixa }` com tudo em **centavos**.
 * `parcelas` traz os 6 tributos na ordem do recibo do PGDAS-D.
 *
 * O `bruto` (sem arredondar por tributo) também volta, porque a diferença
 * entre ele e o total É o achado — e esconder isso seria perder o motivo de
 * o motor existir.
 */
export function apurarDAS({ receitaMes, rbt12, anexo }) {
  const faixa = faixaDe(rbt12, anexo);
  if (!faixa) {
    return { total: null, parcelas: null, faixa: null, forDoSimples: true };
  }

  const efetiva = aliquotaEfetiva(rbt12, anexo);
  const dasBruto = receitaMes * efetiva;
  const reparticao = REPARTICAO[anexo][faixa.faixa];

  const parcelas = {};
  let total = 0;
  for (const t of TRIBUTOS) {
    const centavos = emCentavos(dasBruto * reparticao[t]);
    parcelas[t] = centavos;
    total += centavos;
  }

  return {
    total, // centavos — a soma das partes, que é a guia
    bruto: emCentavos(dasBruto), // centavos — o produto direto, que NÃO é a guia
    parcelas,
    efetiva,
    faixa: faixa.faixa,
    anexo,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · O FATOR R
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * O Fator R decide o anexo, mês a mês.
 *
 * 🔴 **É REGIME DE CAIXA.** Pró-labore declarado no eSocial e NÃO PAGO não
 * conta (Res. CGSN 140/2018 art. 26 §6º · SC COSIT 17/2021 e 251/2024). O
 * preço de contar errado: glosa, reclassificação de ofício pro Anexo V,
 * recálculo de todas as competências, Selic e **multa de 75%** (Lei 9.430/96
 * art. 44 I). Por isso o parâmetro se chama `folhaPAGA12` e não `folha12` —
 * o nome é a trava.
 *
 * 🔑 A **CPP dentro do DAS conta no numerador** (SC COSIT 17/2021, pacífico).
 * Passe `cppNoDas12` quando souber. Efeito colateral conhecido: como essa
 * parcela é proporcional à receita, ela entra no numerador E no denominador,
 * e amortece o próprio Fator R.
 */
export function fatorR({ folhaPaga12, receita12, cppNoDas12 = 0 }) {
  if (receita12 <= 0) {
    return { fr: null, anexo: null, motivo: "receita de 12 meses é zero" };
  }
  const numerador = folhaPaga12 + cppNoDas12;
  const fr = numerador / receita12;
  return {
    fr,
    anexo: fr >= FATOR_R.LIMIAR ? "III" : "V",
    naBorda: fr >= FATOR_R.LIMIAR && fr < FATOR_R.MARGEM,
    numerador,
    receita12,
  };
}

/**
 * Quanto da CPP saiu dentro do DAS — para alimentar o numerador do Fator R.
 * Método: `% de repartição da CPP no anexo/faixa × DAS pago`.
 */
export function cppDentroDoDas({ dasPagoCentavos, anexo, faixa }) {
  return Math.round(dasPagoCentavos * REPARTICAO[anexo][faixa].cpp);
}

/**
 * 🔴 EMPRESA COM MENOS DE 13 MESES ANUALIZA A FOLHA JUNTO COM A RECEITA
 * (Res. CGSN 140/2018 art. 26 §4º). `FS12 = média da folha dos meses
 * existentes × 12`, espelho exato do que se faz com a receita.
 *
 * Somar folha crua contra receita anualizada joga o recém-aberto no Anexo V
 * sem merecer — e recém-aberto é a MAIORIA nossa, porque o produto nasce da
 * constituição.
 *
 * ⚠️ **A persona zero NÃO prova esta regra** — e a nota de 13/09 dizia que
 * sim. Ela comparava 29,6% (anualizado, III) contra 22,2% (cru, V), mas em
 * cima de uma série de pró-labore incompleta: a Central de Sócios do líder só
 * devolve 6 meses e escondia dez/25, jan e fev. As DCTFWeb corrigiram a série
 * em 14/09, e com os números certos a empresa é **Anexo III pelos dois
 * métodos** (cru 37,7% · anualizado 50,3%). A REGRA continua de pé, porque é
 * lei; o que caiu foi o exemplo. A virada de anexo por anualização segue
 * **sem caso real que a demonstre** — ver `verificar-apurador.mjs` G3.
 */
export function anualiza(valoresMensais) {
  if (!valoresMensais.length) return 0;
  const soma = valoresMensais.reduce((a, b) => a + b, 0);
  return (soma / valoresMensais.length) * 12;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 5 · O QUE AINDA NÃO SABEMOS — declarado, não escondido
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ⏳ Cada linha aqui é uma regra que EXISTE na lei e que o motor ainda não
 * aplica, porque a fonte primária não foi lida. Elas moram no código, e não
 * numa nota, para que quem chamar o motor esbarre nelas.
 */
export const LACUNAS = [
  {
    id: "L1",
    o: "Empresa em início de atividade: como se monta o RBT12 nos primeiros 12 meses",
    lei: "Res. CGSN 140/2018 art. 24",
    porque:
      "Sem isso o motor RECUSA rbt12=0 em vez de chutar. Atinge todo cliente nosso no 1º ano, que é a maioria.",
  },
  {
    id: "L2",
    o: "ISS retido na fonte pelo tomador: sai do DAS ou entra e se compensa?",
    lei: "LC 116/2003 · LC 123 art. 21 §4º",
    porque:
      "A persona zero não teve retenção em nenhuma das 9 competências, então a conta real não prova nada aqui.",
  },
  {
    id: "L3",
    o: "Sublimite estadual de ISS/ICMS",
    lei: "LC 123 art. 19-20",
    porque: "Teto do ME (R$360k) fica muito abaixo do sublimite, mas a regra existe e não foi lida.",
  },
];
