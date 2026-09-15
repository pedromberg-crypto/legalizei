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
 */
export function aliquotaEfetiva(rbt12, anexo) {
  if (rbt12 <= 0) {
    throw new Error(
      "RBT12 zero ou negativo. Empresa em início de atividade usa `rbt12De()`, " +
        "que proporcionaliza pela Res. CGSN 140/2018 art. 24."
    );
  }
  const f = faixaDe(rbt12, anexo);
  if (!f) return null; // fora do Simples
  return (rbt12 * f.nominal - f.deduzir) / rbt12;
}

/**
 * 🔴 O RBT12 — e ele NÃO é sempre a soma dos 12 meses.
 * ═══════════════════════════════════════════════════════════════════════════
 * Resolvido em 14/09 por pesquisa em fonte primária. Três regimes, e o que
 * separa é o **número de meses de atividade**:
 *
 *   1º mês .......... receita do PRÓPRIO mês × 12
 *   2º ao 12º mês ... média dos meses ANTERIORES × 12
 *   13º em diante ... soma simples dos 12 meses anteriores
 *
 * Res. CGSN 140/2018 art. 24, caput e inciso I, literal:
 *   *"no 1º (primeiro) mês de atividade, utilizar como receita bruta total
 *   acumulada, a receita do próprio mês de apuração multiplicada por 12
 *   (doze). I - nos 11 (onze) meses posteriores ao do início de atividade,
 *   (…) a média aritmética da receita bruta total dos meses anteriores ao do
 *   período de apuração, multiplicada por 12 (doze)"*
 *
 * ── 🔴 AS DUAS ARMADILHAS, as duas confirmadas ─────────────────────────────
 *
 * **(1) O MÊS CORRENTE NÃO ENTRA.** Nem no numerador, nem no divisor. Ele é
 * só a base sobre a qual a alíquota cai depois. A norma diz "meses anteriores
 * ao do período de apuração".
 *
 * **(2) MÊS COM RECEITA ZERO ENTRA — como zero, e conta no divisor.** É o que
 * a intuição erra. Excluir mês zerado do divisor INFLA a média, sobe o RBT12,
 * sobe a faixa e faz o cliente pagar imposto a maior. A pesquisa chama isso de
 * *"erro material sistêmico"*. A persona zero tem TRÊS meses assim (mai, jun,
 * jul de 2026) — não é caso de borda, é o caso dela.
 *
 * ── 📅 QUAL DATA CONTA ─────────────────────────────────────────────────────
 *
 * A **data de abertura constante do CNPJ** (Res. CGSN 140/2018 art. 2º, V:
 * *"data de início de atividade a data de abertura constante do CNPJ"*).
 * NÃO é a assinatura do contrato social nem o registro na Junta. Isso decide
 * qual das três datas da constituição o motor lê — ver itens 44/45/46 de
 * PENDENCIAS.
 *
 * @param serieAnterior receitas dos meses ANTERIORES, em ordem, sem o corrente
 * @param receitaMesCorrente só usada quando é o 1º mês de atividade
 */
export function rbt12De({ serieAnterior, receitaMesCorrente = 0 }) {
  const meses = serieAnterior.length;

  if (meses === 0) {
    // 1º mês de atividade: não há passado, então projeta o próprio mês.
    return { rbt12: receitaMesCorrente * 12, regra: "1o-mes", meses: 0 };
  }

  if (meses < 12) {
    const soma = serieAnterior.reduce((a, b) => a + b, 0);
    return {
      rbt12: (soma / meses) * 12, // meses zerados ENTRAM no divisor, de propósito
      regra: "proporcional",
      meses,
      soma,
      media: soma / meses,
    };
  }

  // 13º mês em diante: soma simples dos 12 anteriores, sem projeção.
  const doze = serieAnterior.slice(-12);
  return {
    rbt12: doze.reduce((a, b) => a + b, 0),
    regra: "soma-12",
    meses: 12,
  };
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
    id: "L4",
    o: 'Resolução CGSN nº 190/2026 muda "data de ABERTURA" para "data de INSCRIÇÃO" no CNPJ',
    lei: "Res. CGSN 190, de 04/08/2026, com efeitos a partir de 01/01/2027",
    porque:
      "🔴 A pesquisa cita, mas a fonte é site secundário (normaslegais.com.br). Se for real, muda o marco de contagem do RBT12 a partir de 2027 — e a diferença entre abertura e inscrição pode ser de dias. Conferir no Diário Oficial ANTES de virar código.",
  },
  {
    id: "L5",
    o: "LC 214/2025 — CBS e IBS entram no Simples Nacional",
    lei: "LC 214/2025",
    porque:
      "A pesquisa sinaliza 'janelas de opções híbridas de recolhimento' que mexem em retenção e exclusão. Não datado, não quantificado. É o horizonte do motor, não o presente.",
  },
];

/**
 * ✅ RESOLVIDAS EM 14/09, por pesquisa em fonte primária.
 * Ficam registradas porque saber que uma pergunta FOI respondida, e por qual
 * dispositivo, vale tanto quanto a resposta.
 */
export const RESOLVIDAS = [
  {
    id: "L1",
    o: "RBT12 de empresa em início de atividade",
    lei: "Res. CGSN 140/2018 art. 24 caput e I · art. 2º V · art. 26 §4º",
    resposta:
      "1º mês: receita do próprio mês × 12. 2º ao 12º: média dos meses ANTERIORES × 12. 13º+: soma dos 12. O mês corrente não entra no cálculo; mês zerado entra como zero E conta no divisor. O marco é a data de ABERTURA no CNPJ, não a assinatura nem a Junta. A folha anualiza pelo mesmo critério.",
    onde: "`rbt12De()` e `anualiza()`",
  },
  {
    id: "L2",
    o: "ISS retido na fonte pelo tomador",
    lei: "LC 123/2006 art. 21 §4º · LC 116/2003 art. 3º e 6º · Lei Municipal BH 8.725/2003 arts. 20, 21, 24",
    resposta:
      "Não é compensação, é SEGREGAÇÃO: a receita com retenção é declarada em rubrica própria no PGDAS-D e o aplicativo tira o ISS da base, gerando DAS só com os federais. 🔑 MAS para as NOSSAS atividades (consultoria, publicidade, TI, design, ensino, tradução) o ISS é devido no LOCAL DO ESTABELECIMENTO PRESTADOR — elas não estão nas 25 exceções do art. 3º. Tomador de outro município reter é ILÍCITO, e a empresa continua devendo em BH.",
    onde: "ainda não virou código — ver `apurarDAS` §ISS retido",
  },
  {
    id: "L3",
    o: "Sublimite estadual",
    lei: "LC 123/2006 art. 19 · Portaria CGSN 54/2025",
    resposta:
      "Sublimite MG 2026 = R$ 3.600.000. 🟢 NÃO SE APLICA AO PORTE ME: o teto do ME é R$360.000, então é impossibilidade matemática. Só passa a valer se a empresa virar EPP e ultrapassar os 3,6mi. ⚠️ E aí SIM atinge serviço, não só ICMS — o sublimite estadual 'carrega' os municípios e o ISS sai do DAS.",
    onde: "fechada sem virar código, e isso é ganho",
  },
];
