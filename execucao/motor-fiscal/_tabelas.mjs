/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 AS TABELAS DO SIMPLES — dado puro, sem lógica.
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte-verdade: **LC 123/2006**, Anexos III e V. As notas de referência do
 * vault (`pesquisa/cnae-matriz/anexos-simples/`) foram conferidas contra a lei
 * em 17/07 e estão marcadas `confianca: alta (valor estatutário)`.
 *
 * 🔒 ESCOPO: só III e V. O Anexo IV existe no vault mas está FORA DO ESCOPO
 * do produto (lista fechada: construção, advocacia, limpeza, vigilância), e o
 * Anexo I (comércio) também. Ver `execucao/processos/_escopo.mjs`.
 *
 * ⚠️ NADA AQUI É CALCULADO. Quem calcula é o `apurador.mjs`. Esta separação
 * existe para que trocar uma alíquota (a lei muda) nunca exija ler lógica.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * As 6 faixas de cada anexo.
 *
 * `ate` é o teto da faixa em RBT12 (receita bruta dos últimos 12 meses).
 * `nominal` é a alíquota da tabela, que NÃO é a que se paga.
 * `deduzir` é a parcela a deduzir, em R$ — é ela que segura a carga real.
 *
 * A efetiva sai de `(RBT12 × nominal − deduzir) ÷ RBT12`, e é sempre menor
 * que a nominal a partir da 2ª faixa.
 */
export const FAIXAS = {
  III: [
    { faixa: 1, ate: 180000, nominal: 0.06, deduzir: 0 },
    { faixa: 2, ate: 360000, nominal: 0.112, deduzir: 9360 },
    { faixa: 3, ate: 720000, nominal: 0.135, deduzir: 17640 },
    { faixa: 4, ate: 1800000, nominal: 0.16, deduzir: 35640 },
    { faixa: 5, ate: 3600000, nominal: 0.21, deduzir: 125640 },
    { faixa: 6, ate: 4800000, nominal: 0.33, deduzir: 648000 },
  ],
  V: [
    { faixa: 1, ate: 180000, nominal: 0.155, deduzir: 0 },
    { faixa: 2, ate: 360000, nominal: 0.18, deduzir: 4500 },
    { faixa: 3, ate: 720000, nominal: 0.195, deduzir: 9900 },
    { faixa: 4, ate: 1800000, nominal: 0.205, deduzir: 17100 },
    { faixa: 5, ate: 3600000, nominal: 0.23, deduzir: 62100 },
    { faixa: 6, ate: 4800000, nominal: 0.305, deduzir: 540000 },
  ],
};

/**
 * 🔴 A REPARTIÇÃO — é ela que faz a guia fechar ao centavo.
 *
 * O DAS é UMA guia só, mas por dentro é a soma de 6 tributos, cada um
 * arredondado sozinho. Quem calcula `receita × alíquota` erra centavo em toda
 * guia, e guia diferente do PGDAS é divergência com a Receita.
 *
 * Percentuais em fração (0.434 = 43,40%). Cada linha soma 1,0000.
 *
 * ⚠️ A 6ª faixa não tem ISS: acima de R$3,6mi o ISS sai do DAS e é recolhido
 * à parte. Fora do nosso escopo (teto do ME é R$360k), mas fica na tabela
 * porque a tabela é da LEI, não do nosso recorte.
 */
export const REPARTICAO = {
  III: {
    1: { cpp: 0.434, iss: 0.335, csll: 0.035, irpj: 0.04, cofins: 0.1282, pis: 0.0278 },
    2: { cpp: 0.434, iss: 0.32, csll: 0.035, irpj: 0.04, cofins: 0.1405, pis: 0.0305 },
    3: { cpp: 0.434, iss: 0.325, csll: 0.035, irpj: 0.04, cofins: 0.1364, pis: 0.0296 },
    4: { cpp: 0.434, iss: 0.325, csll: 0.035, irpj: 0.04, cofins: 0.1364, pis: 0.0296 },
    5: { cpp: 0.434, iss: 0.335, csll: 0.035, irpj: 0.04, cofins: 0.1282, pis: 0.0278 },
    6: { cpp: 0.305, iss: 0, csll: 0.15, irpj: 0.35, cofins: 0.1603, pis: 0.0347 },
  },
  V: {
    1: { cpp: 0.2885, iss: 0.14, csll: 0.15, irpj: 0.25, cofins: 0.141, pis: 0.0305 },
    2: { cpp: 0.2785, iss: 0.17, csll: 0.15, irpj: 0.23, cofins: 0.141, pis: 0.0305 },
    3: { cpp: 0.2385, iss: 0.19, csll: 0.15, irpj: 0.24, cofins: 0.1492, pis: 0.0323 },
    4: { cpp: 0.2385, iss: 0.21, csll: 0.15, irpj: 0.21, cofins: 0.1574, pis: 0.0341 },
    5: { cpp: 0.2385, iss: 0.235, csll: 0.125, irpj: 0.23, cofins: 0.141, pis: 0.0305 },
    6: { cpp: 0.295, iss: 0, csll: 0.155, irpj: 0.35, cofins: 0.1644, pis: 0.0356 },
  },
};

/** A ordem em que os tributos aparecem no recibo do PGDAS-D. */
export const TRIBUTOS = ["irpj", "csll", "cofins", "pis", "cpp", "iss"];

/**
 * O Fator R e os limites de 2026.
 *
 * 🔴 `LIMIAR` é a LEI (LC 123 art. 18 §5º-J): folha ÷ receita ≥ 28% nos 12
 * meses puxa a atividade do Anexo V pro III. `MARGEM` é RECOMENDAÇÃO NOSSA
 * (UX-39): cravar 28% deixa a empresa a um mês ruim de cair o ano inteiro.
 * Os dois números existem porque são coisas diferentes — não unificar.
 */
export const FATOR_R = {
  LIMIAR: 0.28,
  MARGEM: 0.3,
};

/**
 * Piso e teto previdenciários de 2026.
 * `TETO_INSS` vem da Portaria Interministerial MPS/MF nº 13 de 09/01/2026,
 * art. 2º. O `932.3105` do líder é `0.11 × 8475.55` exato — guardar com 4
 * casas e arredondar só na exibição.
 *
 * ⚠️ `SALARIO_MINIMO` veio de FONTE ÚNICA. Conferir antes de virar trava.
 */
export const PREVIDENCIA = {
  SALARIO_MINIMO: 1621,
  TETO_INSS: 8475.55,
  ALIQUOTA_SOCIO: 0.11,
};
