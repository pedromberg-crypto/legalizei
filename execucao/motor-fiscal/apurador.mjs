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

import {
  FAIXAS,
  REPARTICAO,
  TRIBUTOS,
  FATOR_R,
  VENCIMENTOS,
  FATOR_R_NUMERADOR,
  GRUPOS_ANEXO,
  PREVIDENCIA,
  IRRF,
  FERIADOS_NACIONAIS,
} from "./_tabelas.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · DINHEIRO
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Reais → centavos, arredondando meio-pra-cima. É aqui que o centavo morre. */
export const emCentavos = (reais) => Math.round(reais * 100);

/** Centavos → reais. Só pra sair do motor, nunca no meio da conta. */
export const emReais = (centavos) => centavos / 100;

/** R$ 1.234,56 — para relatório e conferência, não para cálculo. */
export function brlDeCentavos(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 1.1 · A REGRA DE UNIDADE — travada em 17/09, decisão do Pedro
 * ═══════════════════════════════════════════════════════════════════════════
 * *"Quero que a gente padronizasse todos os valores ou em reais ou em
 * centavos. Não justifica cada campo de valor trabalhar de uma forma, isso no
 * meu ver é uma ponta a mais de preocupação desnecessária."*
 *
 * Ele está certo, e o preço de não ter isso já foi cobrado três vezes:
 * **M-014** (`guiaVencida` aceitou reais e devolveu número plausível e
 * errado), **M-020** (`emCentavos` numa soma que já estava em centavos, e
 * nenhum teste quebrava) e **M-027** (o resumo devolvia duas unidades no
 * mesmo objeto, e o chamador compensava com `* 100`).
 *
 * ── ✅ A REGRA, em uma linha ───────────────────────────────────────────────
 *
 * 🔒 **Todo dinheiro que ENTRA ou SAI de uma função deste motor é INTEIRO EM
 * CENTAVOS.** Sem exceção, sem campo especial, sem "este aqui é diferente".
 *
 * ── ⚖️ A ÚNICA COISA QUE FICA EM REAIS, e por quê ──────────────────────────
 *
 * **As tabelas da lei** (`_tabelas.mjs`). `TETO_INSS: 8475.55` é conferível
 * contra a Portaria Interministerial nº 13; `847555` não é. A tabela existe
 * para ser **auditada contra o documento**, e essa é a nossa disciplina mais
 * antiga: número sem fonte não entra.
 *
 * 🔑 Então a conversão acontece **aqui, na leitura**, e só aqui. Fora do
 * `_tabelas.mjs` e deste arquivo, **nada no motor conhece reais**.
 */
const daTabela = (valorEmReais) => emCentavos(valorEmReais);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🪙 O ARREDONDAMENTO DO CENTAVO — meio pra cima, e sem ruído de float
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 ACHADO DE 17/09, e quem o expôs foi a rede da migração para centavos.
 *
 * Duas competências mudaram **um centavo** ao trocar a ordem das operações, e
 * a investigação mostrou que as duas caem em **empate exato de meio centavo**:
 *
 *   P16 dez/25 · COFINS ... o valor exato é `54637,5`
 *   P18 nov/25 · PIS ...... o valor exato é `14182,5`
 *
 * E o ponto flutuante decidia o empate por ruído, de forma **inconsistente**:
 * o caminho antigo entregava `54637.5` (sobe) e `14182.499999999998` (desce);
 * o novo entrega `54637.49999999999` (desce) e `14182.5` (sobe). Cada um
 * acertava um e errava o outro — e nenhum dos dois era regra, era acaso.
 *
 * 🔑 **Não é defeito da migração: é defeito que a migração revelou.** Ele
 * estava lá desde 14/09, escondido porque nenhuma conferência caía num
 * empate.
 *
 * ✅ A regra passa a ser explícita — **meio centavo sobe**, que é a convenção
 * do arredondamento monetário e o que `Math.round` já faz para positivos. O
 * épsilon só impede que `x,49999999999` finja ser menos que a metade. É o
 * mesmo remédio do `tetoCentavo` do piloto, pela mesma razão (M-003).
 *
 * ── 🧾 E A SEGUNDA DECISÃO: CADA COMPONENTE É INTEIRO, E A SUBTRAÇÃO VEM DEPOIS
 *
 * O IRRF é `imposto da tabela − redutor`. Até 17/09 o motor arredondava a
 * **diferença**; agora arredonda **cada parcela** e subtrai inteiros. Muda 1
 * centavo em dois casos, e a escolha é deliberada:
 *
 * 🔑 A entrega expõe `impostoTabela`, `redutor` e `irrf` como três valores
 * separados. Se o `irrf` não for exatamente `impostoTabela − redutor`, o dev
 * refaz a conta, não bate, e passa o dia procurando o erro dele num erro
 * nosso. **Consistência entre os campos entregues vale mais que a última casa
 * de um arredondamento que a lei não disciplina.**
 *
 * ⚠️ **Nenhum valor com documento mudou.** As 46 conferências do teste
 * dourado — recibo do PGDAS-D e nota fiscal real — passam idênticas. O que
 * mudou foram 8 legíveis em 3 competências de vidas **sintéticas**.
 */
const centavoDe = (x) => Math.round(x + 1e-9);

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
  // `rbt12` vem em centavos; o teto da faixa está em reais na tabela da lei.
  return tabela.find((f) => rbt12 <= daTabela(f.ate)) ?? null;
}

/**
 * A alíquota EFETIVA — o que se paga de verdade.
 *
 * `(RBT12 × nominal − deduzir) ÷ RBT12`. Na 1ª faixa a parcela a deduzir é
 * zero, então efetiva = nominal (6% no III, 15,5% no V).
 */
export function aliquotaEfetiva(rbt12, anexo) {
  if (rbt12 < 0) throw new Error(`RBT12 negativo: ${rbt12}`);

  // 🔴 RBT12 ZERO É CASO REAL, não erro — e é o 3º mês da nossa persona.
  // Empresa aberta em dezembro que só fatura em fevereiro tem os dois meses
  // anteriores zerados, então a média é zero e o RBT12 proporcional é zero.
  // A conta `(0 × nominal − deduzir) / 0` é indefinida, mas a resposta não:
  // RBT12 zero cai na 1ª faixa, e a 1ª faixa **não tem parcela a deduzir** —
  // logo a efetiva É a nominal.
  //
  // ✅ Confirmado contra a conta real: fev/2026 teve receita de R$12.000 com
  // RBT12 proporcional zero, e a guia do PGDAS-D saiu R$720,00 = 12.000 × 6%.
  const f = faixaDe(rbt12, anexo);
  if (!f) return null; // fora do Simples
  if (rbt12 === 0) return f.nominal;

  // 🔑 A fórmula é a do art. 18 §1º e é INVARIANTE À UNIDADE — desde que os
  //    dois lados estejam na mesma. `rbt12` chega em centavos, então a parcela
  //    a deduzir também precisa vir convertida.
  return (rbt12 * f.nominal - daTabela(f.deduzir)) / rbt12;
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
      /**
       * 🔒 INTEIRO EM CENTAVOS, como todo dinheiro do motor desde 17/09.
       *
       * A média divide por um número de meses que raramente é divisor exato —
       * `1.730.000 ÷ 11 × 12` dá `1.887.272,7272…` centavos. Sem o
       * arredondamento, um valor monetário sairia com fração de centavo e
       * contaminaria a alíquota efetiva, que é calculada em cima dele.
       *
       * 🔑 A rede da migração pegou exatamente isto: o congelado mostrou
       * `R$157.333,333` onde antes havia `R$157.333,33`, e junto veio **um
       * centavo de diferença no DAS** de duas competências do P18.
       */
      rbt12: centavoDe((soma / meses) * 12), // meses zerados ENTRAM no divisor, de propósito
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
export function apurarDAS({ receitaMes, rbt12, anexo, receitaComIssRetido = 0 }) {
  // 🔑 MÊS SEM RECEITA: o DAS é zero, e não há alíquota a calcular.
  // Não é caso de borda — é o mês 1 da maioria das empresas nossas, que nasce
  // da constituição e costuma faturar só depois. A persona zero declarou
  // R$0,00 em dez/25, jan, mai, jun e jul de 2026, com recibo do PGDAS-D em
  // cada uma. Sem esta guarda o motor tentaria dividir por RBT12 zero.
  if (receitaMes === 0) {
    const zeros = Object.fromEntries(TRIBUTOS.map((t) => [t, 0]));
    return {
      total: 0,
      bruto: 0,
      parcelas: zeros,
      issRetido: 0,
      temRetencao: false,
      efetiva: null,
      faixa: null,
      anexo,
      semMovimento: true,
    };
  }

  const faixa = faixaDe(rbt12, anexo);
  if (!faixa) {
    return { total: null, parcelas: null, faixa: null, forDoSimples: true };
  }
  if (receitaComIssRetido > receitaMes) {
    throw new Error(
      `Receita com ISS retido (${receitaComIssRetido}) maior que a receita do mês (${receitaMes}).`
    );
  }

  const efetiva = aliquotaEfetiva(rbt12, anexo);
  const reparticao = REPARTICAO[anexo][faixa.faixa];

  // 🔴 A SEGREGAÇÃO acontece na BASE, não no resultado. Os federais incidem
  // sobre a receita inteira; o ISS, só sobre a parcela SEM retenção.
  const receitaSemRetencao = receitaMes - receitaComIssRetido;
  const baseFederal = receitaMes * efetiva;
  const baseIssNoDas = receitaSemRetencao * efetiva;
  const baseIssRetido = receitaComIssRetido * efetiva;

  const parcelas = {};
  let total = 0;
  for (const t of TRIBUTOS) {
    const base = t === "iss" ? baseIssNoDas : baseFederal;
    // A base já está em centavos (receita × alíquota). Só falta virar inteiro,
    // e é ESTE arredondamento — um por tributo — que produz a guia.
    const parcela = centavoDe(base * reparticao[t]);
    parcelas[t] = parcela;
    total += parcela;
  }

  // O que o TOMADOR recolhe direto ao município. Não é nosso, mas o cliente
  // precisa ver, senão some R$158,99 da conta dele sem explicação.
  const issRetido = centavoDe(baseIssRetido * reparticao.iss);

  return {
    total, // centavos — a soma das partes, que é a guia
    bruto: centavoDe(receitaMes * efetiva), // o produto direto, que NÃO é a guia
    parcelas,
    issRetido, // recolhido pelo tomador, fora do DAS
    temRetencao: receitaComIssRetido > 0,
    efetiva,
    faixa: faixa.faixa,
    anexo,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3b · ISS RETIDO — quando ele é devido, e quando é ilícito
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔴 Os tomadores que a Lei Municipal de BH 8.725/2003 põe como substitutos.
 *
 * ⚠️ **ESTA LISTA É PARÁFRASE, não texto legal.** A pesquisa de 14/09 leu a
 * lei e resumiu os arts. 20, 21 e 24 sem trazer a redação literal, e a própria
 * pesquisa admitiu que não conseguiu extrair as especificidades de BH em fonte
 * unívoca. Antes de virar tela, ler a lei no portal da Fazenda de BH.
 *
 * O art. 24 é o que mais nos atinge: agência de publicidade é categoria nossa
 * (`mkt` na taxonomia de pills, CNAE 7311-4/00).
 */
export const SUBSTITUTOS_BH = {
  fonte: "Lei Municipal de Belo Horizonte nº 8.725/2003, arts. 20, 21 e 24",
  confianca: "🟡 paráfrase da pesquisa de 14/09 — falta o texto literal",
  naturezas: ["orgao-publico", "hospital", "concessionaria", "instituicao-financeira"],
  porAtividade: ["agencia-de-publicidade"], // art. 24
};

/**
 * A retenção é LEGÍTIMA neste caso?
 *
 * 🔑 A regra do art. 3º da LC 116/2003 é que o ISS é devido **no local do
 * estabelecimento prestador**. As 25 exceções que deslocam a competência
 * (construção civil, vigilância, varrição, andaimes) NÃO incluem nenhuma
 * atividade do nosso escopo: consultoria, publicidade, TI, design, ensino e
 * tradução.
 *
 * Consequência: tomador de OUTRO município que retém pratica ato que a
 * pesquisa chama de *"eivado de nulidade"*, e a empresa **continua devendo em
 * BH**. O certo é emitir sem retenção e pagar o DAS integral.
 *
 * ⚠️ A trava aqui é de INFORMAÇÃO, não de bloqueio — doutrina INFORMAR, nunca
 * TUTELAR. O motor diz que a retenção não deveria existir; quem decide o que
 * fazer com isso é a pessoa, com o contador.
 */
export function retencaoLegitima({ municipioTomador, naturezaTomador, atividade }) {
  if (municipioTomador !== "BH") {
    return {
      legitima: false,
      motivo:
        "As nossas atividades não estão nas 25 exceções do art. 3º da LC 116/2003, " +
        "então o ISS é devido no local do estabelecimento prestador (BH). " +
        "Tomador de outro município não tem competência para reter.",
      oQueFazer: "Emitir a nota SEM retenção e pagar o DAS integral.",
      lei: "LC 116/2003 art. 3º",
    };
  }

  const porNatureza = SUBSTITUTOS_BH.naturezas.includes(naturezaTomador);
  const porAtividade = SUBSTITUTOS_BH.porAtividade.includes(atividade);

  if (porNatureza || porAtividade) {
    return {
      legitima: true,
      motivo: porAtividade
        ? "Agência de publicidade: o art. 24 da Lei Municipal 8.725/2003 obriga a retenção."
        : `Tomador em BH com natureza "${naturezaTomador}" é substituto tributário (arts. 20 e 21).`,
      oQueFazer: "Segregar a receita no PGDAS-D. O DAS sai só com os federais.",
      lei: SUBSTITUTOS_BH.fonte,
      confianca: SUBSTITUTOS_BH.confianca,
    };
  }

  return {
    legitima: false,
    motivo:
      "Tomador em BH, mas fora das naturezas de substituição dos arts. 20/21 e fora do art. 24.",
    oQueFazer: "Emitir sem retenção e pagar o DAS integral.",
    lei: SUBSTITUTOS_BH.fonte,
    confianca: SUBSTITUTOS_BH.confianca,
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
 * 🔴 **A CPP EMBUTIDA NO DAS **NÃO** ENTRA NO NUMERADOR** — corrigido em 14/09,
 * e eu tinha o oposto escrito como fato.
 *
 * Res. CGSN 140/2018 art. 26 §2º I "a", literal: *"a título de encargos, o
 * montante **efetivamente recolhido**: a) de Contribuição Patronal
 * Previdenciária (**inclusive a recolhida dentro do Simples Nacional em
 * relação ao Anexo IV**)"*. A norma **nomeia o Anexo IV** — e o silêncio sobre
 * o III e o V é vedação, não permissão.
 *
 * ⚠️ **A "SC COSIT 17/2021" que o mercado cita não ampara isso.** A pesquisa
 * de 14/09 foi às bases da Receita: a ementa trata de matéria diversa. Eu
 * havia registrado como *"pacífico"* em 13/09, propagado de `_matriz-
 * dependencia.md`. Era citação de blog viajando entre documentos nossos.
 *
 * 🔑 **Por que errar aqui era pior que errar um número:** contar a CPP infla o
 * numerador, e o app recomendaria um pró-labore MENOR do que o necessário.
 * O eSocial enviaria o valor menor, o cruzamento com o PGDAS-D rebaixaria a
 * empresa para o Anexo V **retroativamente**, e o cliente pagaria a diferença
 * de 6% para 15,5% com multa. A correção é para o lado seguro.
 *
 * `cppNoDas12` continua no parâmetro **só para o Anexo IV**, que está fora do
 * nosso escopo. No III e no V, passe zero — que é o default.
 */
export function fatorR({ folhaPaga12, receita12, cppNoDas12 = 0 }) {
  const numerador = folhaPaga12 + cppNoDas12;

  // 🔴 RECEITA ZERA E FOLHA NÃO: a razão é infinita, logo ≥ 28%, logo ANEXO III.
  //
  // Não é sutileza matemática — é o caso real de fevereiro/2026 da persona
  // zero. Ela abriu em dezembro, ficou dois meses sem faturar pagando
  // pró-labore, e faturou R$12.000 em fevereiro. A guia do PGDAS-D saiu
  // **R$720,00 (6%, Anexo III)**. Um motor que devolvesse "indeterminado" e
  // caísse no Anexo V por precaução cobraria R$1.860 — **mais que o dobro**.
  //
  // ⚠️ Foi exatamente o que este motor fazia até 14/09, e só apareceu quando a
  // série real inteira passou por ele. Teste de um mês não pega; extrato pega.
  if (receita12 <= 0) {
    if (numerador > 0) {
      return {
        fr: Infinity,
        anexo: "III",
        naBorda: false,
        numerador,
        receita12: 0,
        motivo: "sem receita e com folha: a razão é infinita, e o anexo é o III",
      };
    }
    return {
      fr: null,
      anexo: null,
      motivo: "sem receita e sem folha — a razão não existe, e não há o que tributar",
    };
  }

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
 * 🔴 O FATOR R A PARTIR DAS COMPETÊNCIAS — e é aqui que o regime de caixa mora.
 * ═══════════════════════════════════════════════════════════════════════════
 * A função `fatorR()` acima confia em quem a chama. Esta NÃO confia: ela recebe
 * as competências e **separa o declarado do pago sozinha**.
 *
 * Cada competência entra como:
 *   { mes, receita, proLaboreDeclarado, proLaborePago }
 *
 * `proLaborePago` ausente ou 0 significa **declarado e não pago**, e esse valor
 * NÃO entra no numerador. É o passo `P5.8` do board, virado em código.
 *
 * ── O QUE CUSTA ERRAR ──────────────────────────────────────────────────────
 *
 * Pró-labore declarado no eSocial e não pago não conta (Res. CGSN 140/2018
 * art. 26 §6º · SC COSIT 17/2021 e 251/2024). Contar o declarado como pago
 * infla o Fator R, segura a empresa no Anexo III indevidamente, e o preço
 * quando a Receita cruza EFD-Reinf com DCTFWeb é: glosa, reclassificação **de
 * ofício** pro Anexo V, recálculo de TODAS as competências, Selic e **multa de
 * 75%** (Lei 9.430/96 art. 44 I).
 *
 * ── ⚠️ O QUE ESTA FUNÇÃO NÃO RESOLVE ───────────────────────────────────────
 *
 * Ela sabe usar a informação "foi pago"; ela não sabe DESCOBRIR isso. Sem
 * conciliação bancária (decisão 31) e sem Open Finance (decisão de 09/09), a
 * única via é o cliente DECLARAR — mesma doutrina do lucro (item 30), com a
 * Carta de Responsabilidade (Res. CFC 1.590/2020 art. 3º) carregando o peso.
 * O motor calcula certo sobre o que lhe contam; quem responde pelo que conta
 * é quem assina.
 */
export function fatorRDeCompetencias({ competencias, cppNoDas12 = 0 }) {
  const receita12 = competencias.reduce((s, c) => s + (c.receita || 0), 0);

  const folhaPaga = competencias.reduce((s, c) => s + (c.proLaborePago || 0), 0);
  const folhaDeclarada = competencias.reduce((s, c) => s + (c.proLaboreDeclarado || 0), 0);

  // As competências onde declarou e não pagou — é o que a Receita glosa.
  const glosaveis = competencias.filter(
    (c) => (c.proLaboreDeclarado || 0) > (c.proLaborePago || 0)
  );
  const naoPago = folhaDeclarada - folhaPaga;

  // 🔴 Empresa com menos de 13 meses anualiza a folha junto com a receita
  // (art. 26 §4º). Os dois lados, ou nenhum — espelho exato.
  const anualizar = competencias.length < 13;
  const pagos = competencias.map((c) => c.proLaborePago || 0);
  const numeradorFolha = anualizar ? anualiza(pagos) : folhaPaga;
  const denominador = anualizar
    ? anualiza(competencias.map((c) => c.receita || 0))
    : receita12;

  const base = fatorR({
    folhaPaga12: numeradorFolha,
    receita12: denominador,
    cppNoDas12,
  });

  return {
    ...base,
    anualizado: anualizar,
    folhaPaga,
    folhaDeclarada,
    naoPago,
    // 🔴 O alerta que nenhuma tela do líder dá.
    riscoDeGlosa: glosaveis.length > 0,
    competenciasEmRisco: glosaveis.map((c) => c.mes),
    // Quanto o Fator R seria se contássemos o declarado — a diferença É o risco.
    frSeContasseDeclarado:
      denominador > 0
        ? (anualizar ? anualiza(competencias.map((c) => c.proLaboreDeclarado || 0)) : folhaDeclarada) /
          denominador
        : null,
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
 * 5 · O ANEXO ANTES DO CÁLCULO — não rodar Fator R à toa
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * O CNAE já decide o anexo, ou precisa calcular?
 *
 * 🔑 **Dos 87 CNAEs que atendemos, 65 são `III-fixo`** — o Fator R não muda
 * nada neles. Rodar o cálculo é desperdício, e pior: a tela que fala em
 * "sua folha precisa chegar a 28%" para quem já é Anexo III **mente por
 * omissão**, porque sugere um risco que não existe.
 *
 * @param grupo valor do campo `anexo_fator_r_grupo` da `cnae-matriz.json`
 */
export function anexoDoCnae(grupo) {
  const g = GRUPOS_ANEXO[grupo];
  if (!g) {
    return {
      anexo: null,
      calculaFatorR: null,
      erro: `Grupo desconhecido: "${grupo}". Os válidos estão em GRUPOS_ANEXO.`,
    };
  }
  if (g.calculaFatorR === null) {
    return {
      anexo: null,
      calculaFatorR: null,
      erro: "CNAE em `requer-revisao` — indefinido, não usar em produção.",
    };
  }
  return {
    anexo: g.anexo, // "III" quando fixo, null quando depende do cálculo
    calculaFatorR: g.calculaFatorR,
    // 🔴 O que a tela pode dizer sem mentir.
    podeFalarDeFatorR: g.calculaFatorR,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 6 · O CALENDÁRIO — e ele desloca por tributo
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🐛 `getUTCDay()`, nunca `getDay()`.
 *
 * A data nasce de `Date.UTC(...)`, e `getDay()` devolve o dia da semana LOCAL.
 * Em UTC−3, `Date.UTC(2026, 8, 20)` é domingo 00:00 UTC — mas **sábado 21h**
 * no horário de Brasília. O motor então "via" sábado, deslocava duas vezes e
 * devolvia o dia errado. Achado pelo teste dourado G9 em 14/09.
 */
const ehFimDeSemana = (d) => d.getUTCDay() === 0 || d.getUTCDay() === 6;

const iso = (d) => d.toISOString().slice(0, 10);
const ehFeriado = (d) => FERIADOS_NACIONAIS.datas.includes(iso(d));

/** Fim de semana OU feriado nacional. */
const naoEhDiaUtil = (d) => ehFimDeSemana(d) || ehFeriado(d);

/**
 * Quando vence, de verdade.
 *
 * 🔴 **O deslocamento é POR TRIBUTO.** O DAS **prorroga** para o próximo dia
 * útil; o DARF de INSS/IRRF **antecipa** para o anterior. No mesmo mês, uma
 * guia vence dia 22 e a outra dia 18 — e um motor com regra única erraria
 * metade, sempre para o lado do atraso.
 *
 * ⏳ **LACUNA DECLARADA: feriados.** Esta função conhece sábado e domingo, e
 * não conhece feriado nacional nem municipal de BH. Feriado que caia no dia 20
 * desloca de verdade, e o motor não vai saber. Precisa de calendário — é dado,
 * não lógica, e ainda não temos.
 *
 * @param competencia {ano, mes} — a competência apurada (mes 1-12)
 * @param tributo chave de VENCIMENTOS: "das" | "darf" | "esocial"
 */
export function vencimentoDe({ competencia, tributo }) {
  const regra = VENCIMENTOS[tributo];
  if (!regra) throw new Error(`Tributo sem regra de vencimento: ${tributo}`);

  // O vencimento cai no mês SEGUINTE ao da competência.
  const d = new Date(Date.UTC(competencia.ano, competencia.mes, regra.dia));
  const nominal = new Date(d);

  if (naoEhDiaUtil(d)) {
    const passo = regra.desloca === "prorroga" ? 1 : -1;
    while (naoEhDiaUtil(d)) d.setUTCDate(d.getUTCDate() + passo);
  }

  // 🔚 A tabela de feriados VENCE. Fora da janela o motor avisa em vez de
  // devolver um número que parece certo e não é.
  const foraDaJanela = iso(nominal) > FERIADOS_NACIONAIS.ate;

  return {
    data: d,
    dataNominal: nominal,
    deslocou: d.getTime() !== nominal.getTime(),
    porFeriado: ehFeriado(nominal),
    regra: regra.desloca,
    lei: regra.lei,
    feriadosConsiderados: !foraDaJanela,
    // 🔴 Só nacionais. Feriado municipal de BH está fora — ver FERIADOS_NACIONAIS.
    feriadoMunicipalConsiderado: false,
    aviso: foraDaJanela
      ? `Tabela de feriados vai até ${FERIADOS_NACIONAIS.ate}. Esta data está além — o deslocamento considerou só fim de semana.`
      : null,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 7 · O CUSTO TOTAL — o número que o cliente realmente compara
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * DAS + INSS do sócio + IRRF, e a "alíquota total de custo" sobre o
 * faturamento. É o formato da própria calculadora do líder: ele não compara
 * DAS com DAS, compara **custo total com custo total** — porque subir o
 * pró-labore pra ganhar o Anexo III **aumenta** o INSS e pode acender o IRRF.
 *
 * 🔑 É a gangorra do cruzamento nº 1 do `_mapa-de-cruzamentos.md`, em número.
 *
 * ⏳ `irrf` entra como PARÂMETRO, não é calculado aqui: a tabela de faixas do
 * IRRF é **lacuna aberta do vault** — a spec de pró-labore a cita como
 * *"faixas na tabela acima"* e a tabela não existe. Ver LACUNAS L6.
 */
export function custoTotalMensal({ receitaMes, das, proLabore }) {
  const { inss, irrf } = darfDoProLabore(proLabore);
  const total = das + inss + irrf;
  return {
    das,
    inss,
    irrf,
    darf: inss + irrf, // é UMA guia só: DARF Unificado
    total,
    // `receitaMes` já chega em centavos, igual ao `total`.
    aliquotaTotal: receitaMes > 0 ? total / receitaMes : null,
  };
}

/**
 * 🔴 O DARF DA FOLHA INTEIRA — e ele NÃO é `darfDoProLabore(soma)`.
 *
 * Achado em 15/09 rodando a P02 no rastro, a pedido do Pedro. O motor vinha
 * somando o pró-labore dos sócios e calculando a guia **como se fosse uma
 * pessoa só**: um teto de INSS, uma tabela progressiva de IRRF. Os dois erram,
 * e erram para lados opostos:
 *
 *   P02 · 2 sócias × R$1.621 ... motor R$272,31 · correto R$356,62 (−R$84)
 *   P11 · 4 sócios × R$3.500 ... motor R$3.617,19 · correto R$1.540,00 (+R$2.077)
 *
 * 🔑 **O INSS erra para MENOS** porque o teto é **da pessoa** (Lei 8.212/91
 * art. 28 §5º): somar dois sócios faz a soma bater num teto que nenhum dos
 * dois atingiu. E **o IRRF erra para MAIS**, muito, porque a tabela é
 * progressiva **por beneficiário**: R$14.000 numa pessoa cai em faixa alta;
 * R$3.500 em quatro pessoas não cai em faixa nenhuma.
 *
 * ⚠️ **O Fator R não é afetado** — ele usa a folha TOTAL, e total é o número
 * certo lá. O erro é só na guia.
 *
 * 🔑 E isto é a mesma família do que o Pedro descreveu como *"ignorar um
 * montante de vários meses"*: um agregado tratado como valor individual. Só
 * que o eixo aqui é **pessoas**, não meses.
 *
 * @param socios lista `[{ proLabore, cltRemuneracao }]`, um item por sócio
 *               que RECEBE pró-labore (quem só aporta capital não entra —
 *               Lei 8.212/91 art. 12 V 'f')
 */
export function darfDaFolha({ socios = [] }) {
  const porSocio = socios.map((s) =>
    darfDoProLabore(s.proLabore || 0, s.cltRemuneracao || 0)
  );

  return {
    inss: porSocio.reduce((t, d) => t + d.inss, 0),
    irrf: porSocio.reduce((t, d) => t + d.irrf, 0),
    total: porSocio.reduce((t, d) => t + d.inss + d.irrf, 0),
    porSocio,
    socios: socios.length,
  };
}

/**
 * O DARF do pró-labore de **UM** sócio: INSS + IRRF, numa guia só.
 *
 * 🔴 **É POR PESSOA.** Passar a folha somada de vários sócios aqui produz guia
 * errada nos dois sentidos — ver `darfDaFolha` acima, que é quem soma.
 *
 * 🔑 **A ordem importa e é contraintuitiva:** o INSS sai primeiro e vira
 * DEDUÇÃO da base do IRRF. Quem calcula o IRRF sobre o pró-labore bruto cobra
 * imposto a mais do sócio.
 *
 *   INSS = min(11% × pró-labore ; 11% × teto)
 *   base = pró-labore − INSS
 *   IRRF = (base × alíquota da faixa) − dedução da faixa
 *
 * ⚠️ A tabela do IRRF é 🟡 (tela do líder, não ratificada) e tem uma pergunta
 * aberta com a Lei 15.270/2025 — ver `IRRF` em `_tabelas.mjs` e a lacuna L6.
 */
export function darfDoProLabore(proLabore, cltRemuneracao = 0) {
  // 🔑 DUPLO VÍNCULO: o teto do INSS é da PESSOA, não do vínculo.
  //
  // Quem já contribui como CLT por fora só recolhe sobre a FOLGA que sobra até
  // o teto — e se o CLT já bate o teto, o pró-labore não gera INSS nenhum.
  // Portado do `custoProLabore` do `fiscal.ts` em 15/09, quando os dois motores
  // foram unificados: a regra vivia só no app, e o apurador ignorava o caso.
  //
  // É a funcionalidade **4.6** das 58, e o dado é captado no C2 (vínculo INSS)
  // — ⚠️ uma vez, na abertura, e nunca revalidado (achado de 27/08).
  const folgaDoTeto = Math.max(0, daTabela(PREVIDENCIA.TETO_INSS) - cltRemuneracao);
  const baseInss = Math.min(proLabore, folgaDoTeto);
  const inss = centavoDe(baseInss * PREVIDENCIA.ALIQUOTA_SOCIO);

  // 🔴 A dedução é a MAIOR entre o INSS e o desconto simplificado (R$607,20).
  // A fonte pagadora é obrigada a aplicar a mais benéfica ao beneficiário.
  const simplificado = daTabela(IRRF.descontoSimplificado);
  const usaSimplificado = simplificado > inss;
  const deducao = usaSimplificado ? simplificado : inss;

  const base = proLabore - deducao;
  // A última faixa tem `ate: Infinity`, e `daTabela(Infinity)` segue Infinity.
  const faixa = IRRF.faixas.find((f) => base <= daTabela(f.ate));
  const impostoTabela = Math.max(0, centavoDe(base * faixa.aliquota - daTabela(faixa.deduzir)));

  // 🔴 O redutor do art. 3º-A, aplicado DEPOIS da tabela, sobre o BRUTO.
  const r = IRRF.redutor;
  let redutor = 0;
  if (proLabore <= daTabela(r.tetoIsencao)) {
    redutor = Math.min(daTabela(r.valorAteIsencao), impostoTabela); // zera, sem virar crédito
  } else if (proLabore <= daTabela(r.tetoRampa)) {
    // 🔑 `rampaCoef` é razão, não dinheiro: multiplicado por centavos devolve
    //    centavos, e por isso não passa pelo `daTabela`.
    redutor = Math.max(0, centavoDe(daTabela(r.rampaBase) - r.rampaCoef * proLabore));
  }

  const devido = Math.max(0, impostoTabela - redutor);

  return {
    inss,
    // 🔑 O que a tela precisa dizer quando há CLT por fora.
    cltConsumiuOTeto: folgaDoTeto <= 0,
    folgaDoTeto,
    baseInss,
    deducaoAplicada: deducao,
    usouDescontoSimplificado: usaSimplificado,
    baseIrrf: base,
    impostoTabela,
    redutor: Math.min(redutor, impostoTabela),
    irrf: devido,
    aliquotaIrrf: faixa.aliquota,
    isento: devido === 0,
    // 🔑 Distingue "não caiu na tabela" de "caiu e o redutor zerou". São coisas
    // diferentes e a segunda precisa aparecer no recibo.
    zeradoPeloRedutor: impostoTabela > 0 && devido === 0,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 7b · A GUIA VENCIDA — multa e juros
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Acréscimos do DAS pago em atraso. **Lei 9.430/1996 art. 61 §§2º e 3º.**
 *
 *   multa = 0,33% por DIA de atraso, **travada em 20%** (chega no 61º dia)
 *   juros = Selic acumulada, do mês SEGUINTE ao vencimento até o mês ANTERIOR
 *           ao pagamento, **+ 1% cravado no mês do pagamento**
 *
 * 🔑 **Pago dentro do mês do vencimento, os juros são ZERO** — só a multa
 * corre. O 1% do mês do pagamento substitui a Selic daquele mês, para não
 * exigir atualização diária na emissão da guia.
 *
 * ⚠️ **Não existe multa mínima em valor absoluto** para a mora. Não confundir
 * com os R$50 de multa por **PGDAS-D entregue em atraso**, que é acessória e
 * independe de ter imposto a pagar.
 *
 * ⏳ A série da Selic é **dado, não lógica**, e não temos: entra por parâmetro.
 *
 * @param selicAcumulada soma das Selic mensais do período, em fração (0.02 = 2%)
 */
export function guiaVencida({ principal, diasDeAtraso, selicAcumulada = 0, mesmoMes = false }) {
  if (diasDeAtraso <= 0) {
    return { principal, multa: 0, juros: 0, total: principal, diasDeAtraso: 0 };
  }

  const pctMulta = Math.min(0.0033 * diasDeAtraso, 0.2);
  const multa = emCentavos(emReais(principal) * pctMulta);

  // O 1% do mês do pagamento só entra se o pagamento saiu do mês do vencimento.
  const pctJuros = mesmoMes ? 0 : selicAcumulada + 0.01;
  const juros = emCentavos(emReais(principal) * pctJuros);

  return {
    principal,
    multa,
    juros,
    total: principal + multa + juros,
    pctMulta,
    pctJuros,
    multaNoTeto: pctMulta >= 0.2,
    diasDeAtraso,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 8 · O QUE AINDA NÃO SABEMOS — declarado, não escondido
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ⏳ Cada linha aqui é uma regra que EXISTE na lei e que o motor ainda não
 * aplica, porque a fonte primária não foi lida. Elas moram no código, e não
 * numa nota, para que quem chamar o motor esbarre nelas.
 */
export const LACUNAS = [
  {
    id: "L5",
    o: "LC 214/2025 — CBS e IBS entram no Simples Nacional",
    lei: "LC 214/2025 · Res. CGSN 190/2026",
    porque:
      "A Res. CGSN 190/2026 já existe e é justamente a adequação à Reforma. O que ela muda para nós a partir de 2027 ainda não foi mapeado.",
  },
  {
    id: "L7b",
    o: "🟡 Feriado MUNICIPAL de BH desloca vencimento de tributo FEDERAL?",
    lei: "Lei Municipal BH 1.327/1967 (Assunção, 15/08) · demais a confirmar",
    porque:
      "Os nacionais entraram (`FERIADOS_NACIONAIS`, cobre 2026-2027). Os municipais ficaram de fora por DOIS motivos: as fontes divergem sobre quais são (uma diz aniversário da cidade em 12/12, outra diz Imaculada Conceição em 08/12) e, mais importante, não está claro se feriado municipal desloca guia federal. Banco fecha na cidade, mas a norma de deslocamento é federal. Pergunta pro Ademar ou pra Larissa.",
  },
  {
    id: "L9b",
    o: "🟢 SELIC: de onde buscar (a fórmula já está fechada)",
    lei: "Ato Declaratório mensal do Coordenador-Geral de Arrecadação (RFB)",
    porque:
      "Não é lacuna de regra, é de FONTE — e a arquitetura já está certa: `guiaVencida()` recebe a Selic por parâmetro, porque congelar tabela no código erraria toda guia do mês seguinte. A RFB publica mensalmente por Ato Declaratório, e existe o Sicalc (calculadora oficial). 📌 set/2026 = 1,09%/mês. O que falta é plugar a fonte, não descobrir a regra.",
  },
  {
    id: "L10",
    o: "🔴 O pró-labore NÃO é obrigatório por lei — e a decisão 36 precisa saber disso",
    lei: "IN RFB 2.110/2022 art. 8º XII · Lei 8.212/1991 art. 12 V 'f' e art. 28 §3º",
    porque:
      "🔴 A PESQUISA DO GEMINI DISSE 'É OBRIGATÓRIO' E A BUSCA DIRETA DESMENTIU. A IN RFB 2.110/2022 art. 8º XII põe como contribuinte individual o sócio-administrador *'desde que receba remuneração decorrente de trabalho na empresa'* — a condição é RECEBER. Sem remuneração, ele não se caracteriza como contribuinte individual, e **se o sócio será ou não remunerado é decisão do colegiado da sociedade**, na forma do contrato social. O próprio relatório do Gemini já marcava confiança MÉDIA na obrigatoriedade e BAIXA na ilicitude — e estava certo em duvidar de si. ⚖️ O CARF decidiu nos DOIS sentidos: há acórdão reconhecendo distribuição de lucro a sócio sem pró-labore como escolha lícita, e há autuação mantida. O que separa é o conjunto de fatores: ausência TOTAL de pró-labore + retiradas vultosas de lucro + contabilidade frágil + atuação operacional intensa. Protegem: previsão no contrato social, escrituração idônea e separação razoável entre capital e trabalho. 🔑 **O que isto faz com a decisão 36 (forçar pró-labore no mês 1):** ela continua sendo uma boa decisão de PRODUTO — trava o Fator R desde o mês 1 e afasta o cenário de risco. Mas é 🏢 **decisão nossa, não ⚖️ obrigação legal**, e a copy não pode dizer 'a lei exige'. Se disser, mente. ⚠️ O MÍNIMO, esse sim é lei: salário de contribuição não pode ser inferior ao salário mínimo (Lei 8.212 art. 28 §3º) — o pró-labore de R$100 da conta real é irregular.",
  },
];

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
  {
    id: "L6",
    o: "IRRF do pró-labore em 2026",
    lei: "Lei 9.250/1995 arts. 3º, 3º-A e 4º §2º · Lei 15.270/2025",
    resposta:
      "A tabela NÃO mudou. A Lei 15.270/2025 criou um REDUTOR (art. 3º-A) aplicado depois dela, que zera o imposto até R$5.000 de rendimento e decai em rampa até R$7.350. E a dedução da base é a MAIOR entre o INSS e o desconto simplificado de R$607,20. Efeito: o pró-labore de 28% paga IRRF ZERO.",
    onde: "IRRF em _tabelas.mjs · darfDoProLabore()",
  },
  {
    id: "L8",
    o: "Juros, multa e Selic da guia vencida",
    lei: "Lei 9.430/1996 art. 61 §§2º e 3º",
    resposta:
      "Multa de mora 0,33% por dia, travada em 20% (chega no 61º dia, não no 60º). Juros = Selic acumulada do mês SEGUINTE ao vencimento até o ANTERIOR ao pagamento, mais 1% cravado no mês do pagamento. Pago dentro do mês do vencimento, juros ZERO. Não existe multa mínima de mora.",
    onde: "guiaVencida()",
  },
  {
    id: "L4",
    o: "Resolução CGSN nº 190/2026 existe",
    lei: "Res. CGSN 190/2026",
    resposta:
      "CONFIRMADA em fonte oficial (gov.br/receitafederal, notícia de agosto/2026). É a adequação do Simples à Reforma Tributária do Consumo, com efeitos a partir de 01/01/2027. Sai da categoria de citação de site secundário.",
    onde: "só vira código em 2027 — vigiar",
  },
  {
    id: "P5",
    o: "Receita: competência ou caixa?",
    lei: "Res. CGSN 140/2018 art. 16, §§3º e 4º",
    resposta:
      "Padrão é COMPETÊNCIA. A opção pelo caixa existe, é feita na apuração de janeiro e é IRRETRATÁVEL no ano. 🔑 E ela muda SÓ o mês de tributação: o RBT12 e o denominador do Fator R permanecem em competência por determinação expressa do §4º. O motor não precisa de dois modos.",
    onde: "nada a mudar — o motor já trabalha em competência",
  },
];
