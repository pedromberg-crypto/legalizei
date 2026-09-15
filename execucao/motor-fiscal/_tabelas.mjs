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
 * ✅ `SALARIO_MINIMO` tem DUAS fontes: Decreto 12.797/2025 e a tabela do INSS
 * (gov.br), as duas em `pesquisa/fiscal-simples-bh-2026.md` desde 15/07. A
 * ressalva de "fonte única" que estava aqui era minha, e estava vencida.
 */
export const PREVIDENCIA = {
  SALARIO_MINIMO: 1621,
  TETO_INSS: 8475.55,
  ALIQUOTA_SOCIO: 0.11,
};

/**
 * 💸 A TABELA DO IRRF — capturada da plataforma do líder em 14/09.
 * ═══════════════════════════════════════════════════════════════════════════
 * Modal "Tabela do IRRF", na conta real da persona zero (mesma tela que exibe
 * a competência de agosto, R$7.910,00). É a tabela que o líder **aplica hoje**.
 *
 * `base` = pró-labore − INSS. `IRRF = (base × aliquota) − deduzir`.
 *
 * 🔴 **A PLANILHA DELES E A PLATAFORMA DELES DISCORDAM.** Com base de
 * R$2.990,40 (pró-labore 3.360 − INSS 369,60):
 *   · esta tabela ....... 448,56 − 394,16 = **R$ 54,40**
 *   · a planilha deles .. 448,56 − 354,80 = **R$ 93,76**
 * A planilha usa a dedução PRÉ-2023, e ainda usa salário mínimo de R$998
 * (2020). Ela é material de marketing velho; a plataforma é o sistema vivo.
 * Entre as duas, vale a plataforma — e nenhuma das duas vale mais que a lei.
 *
 * ⏳ **PERGUNTA ABERTA (L6b): e a Lei 15.270/2025?** O `fiscal.ts` carrega
 * `IRRF_ISENCAO: 5000` citando essa lei. Se a isenção efetiva de 2026 é
 * R$5.000/mês, ou esta tabela está vencida, ou o mecanismo é um **redutor**
 * que convive com ela. São coisas diferentes e mudam o resultado. **Não
 * deduzir** — é a única peça do motor ainda sem fonte primária.
 */
export const IRRF = {
  fonte: "Lei 9.250/1995 art. 3º, 3º-A e 4º · Lei 15.270/2025 · ratificado em 14/09",
  confianca: "🟢 texto legal primário (era 🟡 de tela de concorrente até 14/09)",

  /** A tabela progressiva. 🔑 As faixas NÃO foram alteradas pela Lei 15.270/2025. */
  faixas: [
    { ate: 2428.8, aliquota: 0, deduzir: 0 },
    { ate: 2826.65, aliquota: 0.075, deduzir: 182.16 },
    { ate: 3751.05, aliquota: 0.15, deduzir: 394.16 },
    { ate: 4664.68, aliquota: 0.225, deduzir: 675.49 },
    { ate: Infinity, aliquota: 0.275, deduzir: 908.73 },
  ],

  /**
   * 🔴 O DESCONTO SIMPLIFICADO MENSAL — e ele quase sempre vence o INSS.
   *
   * `25% do teto da faixa de alíquota zero` = 25% × 2.428,80 = **R$ 607,20**
   * (Lei 9.250/1995 art. 4º §2º). A fonte pagadora é obrigada a usar a
   * dedução MAIS BENÉFICA ao beneficiário: o maior entre o INSS retido e este
   * valor fixo.
   *
   * ⚠️ Para o nosso sócio isso inverte a conta: com pró-labore de R$3.360 o
   * INSS é R$369,60 e o simplificado é R$607,20 — vence o simplificado, e a
   * base cai de R$2.990,40 para R$2.752,80. **Eu estava deduzindo só o INSS.**
   */
  descontoSimplificado: 607.2,

  /**
   * 🔴 O REDUTOR DO ART. 3º-A — a peça que a tela do líder não mostra.
   *
   * A Lei 15.270/2025 **não mexeu nas faixas**. Ela criou um redutor mensal
   * decrescente, aplicado DEPOIS da tabela, e que zera o imposto até R$5.000:
   *
   *   rendimento ≤ 5.000,00 ......... redutor de até R$ 312,89, limitado ao
   *                                    imposto devido (ou seja: zera)
   *   5.000,01 a 7.350,00 ........... 978,62 − (0,133145 × rendimento)
   *   acima de 7.350,00 ............. sem redutor
   *
   * 🔑 O redutor incide sobre o **rendimento bruto**, não sobre a base. E vale
   * na RETENÇÃO MENSAL, não só no ajuste anual.
   *
   * ⚠️ Consequência direta pro produto: o pró-labore de 28% que a nossa
   * persona usa para segurar o Anexo III (R$3.360 sobre R$12.000) passa a ter
   * **IRRF de R$ 0,00**. A calculadora do líder cobra R$93,76 e a tela dele
   * sugere R$54,40 — as duas estão desatualizadas.
   */
  redutor: {
    tetoIsencao: 5000,
    valorAteIsencao: 312.89,
    tetoRampa: 7350,
    rampaBase: 978.62,
    rampaCoef: 0.133145,
  },
};

/**
 * 🔴 O CALENDÁRIO, e o deslocamento é POR TRIBUTO — não global.
 * ═══════════════════════════════════════════════════════════════════════════
 * É a armadilha mais silenciosa do calendário fiscal: **no mesmo mês uma guia
 * vence dia 22 e outra dia 18**. Um motor que tratasse "dia não útil" com uma
 * regra só erraria metade das guias, e erraria para o lado do atraso.
 *
 * `desloca` diz o que fazer quando o vencimento cai em dia não útil:
 *   "prorroga" → empurra para o próximo dia útil
 *   "antecipa" → puxa para o dia útil anterior
 *
 * Fonte: `produto/_matriz-dependencia.md`, verificação de 09/09.
 */
export const VENCIMENTOS = {
  das: {
    dia: 20,
    desloca: "prorroga",
    lei: "Res. CGSN 140/2018 art. 40 §3º",
    oQue: "DAS e transmissão do PGDAS-D",
  },
  darf: {
    dia: 20,
    desloca: "antecipa",
    lei: "IN RFB 2.005/2021 art. 13",
    oQue: "DARF de INSS e IRRF do pró-labore, e FGTS Digital",
  },
  esocial: {
    dia: 15,
    desloca: "antecipa",
    lei: "Manual do eSocial · IN RFB 2.005/2021",
    oQue: "eSocial (eventos periódicos) e DCTFWeb",
  },
  defis: {
    dia: 31,
    mes: 3,
    desloca: "prorroga",
    lei: "Res. CGSN 140/2018 art. 72 §1º",
    oQue: "DEFIS (anual)",
    nota: "⚠️ Extinta a partir de 2027, absorvida pelo PGDAS-D.",
  },
};

/**
 * 📅 FERIADOS — o que o `vencimentoDe()` precisa para não errar o dia.
 * ═══════════════════════════════════════════════════════════════════════════
 * Só **nacionais**, e de propósito: o que decide se uma guia federal pode ser
 * paga é o **calendário bancário**, e ele segue os feriados nacionais.
 *
 * ⚠️ **FERIADO MUNICIPAL DE BH FICOU DE FORA, e não por esquecimento.** Duas
 * razões: (a) as fontes divergem sobre quais são — uma diz *aniversário da
 * cidade em 12/12*, outra diz *Imaculada Conceição em 08/12*, e as duas citam
 * 15/08 (Assunção, Lei Municipal 1.327/1967); (b) mais importante: **não está
 * claro se feriado municipal desloca o vencimento de tributo FEDERAL**. Banco
 * fecha na cidade, mas a norma de deslocamento é federal. Pergunta para o
 * Ademar ou a Larissa, não para dedução minha.
 *
 * 🔚 **Este dado VENCE.** Cobre 2026 e 2027. Quem rodar o motor em 2028 com
 * esta tabela vai errar silenciosamente — por isso o `ate` existe e o
 * `vencimentoDe()` avisa quando a data pedida passa dele.
 */
export const FERIADOS_NACIONAIS = {
  ate: "2027-12-31",
  fonte: "ANBIMA (calendário bancário) · consultado em 14/09/2026",
  datas: [
    // 2026 — só o que ainda importa daqui pra frente
    "2026-10-12", // Nossa Senhora Aparecida
    "2026-11-02", // Finados
    "2026-11-15", // Proclamação da República
    "2026-11-20", // Consciência Negra
    "2026-12-25", // Natal
    // 2027
    "2027-01-01",
    "2027-02-08", // Carnaval (ponto facultativo, mas banco fecha)
    "2027-02-09",
    "2027-03-26", // Sexta-feira Santa
    "2027-04-21", // Tiradentes
    "2027-05-01",
    "2027-05-27", // Corpus Christi (facultativo)
    "2027-09-07",
    "2027-10-12",
    "2027-11-02",
    "2027-11-15",
    "2027-11-20",
    "2027-12-25",
  ],
};

/**
 * 💹 A SELIC — e ela NÃO vira tabela aqui, de propósito.
 *
 * A Receita publica o percentual **todo mês**, por Ato Declaratório do
 * Coordenador-Geral do Sistema de Arrecadação e Cobrança. Congelar uma tabela
 * no código significa errar toda guia a partir do mês seguinte.
 *
 * Por isso `guiaVencida()` recebe `selicAcumulada` por **parâmetro** — é a
 * arquitetura certa, não uma lacuna. O que falta é de onde buscar:
 *   · Ato Declaratório mensal da RFB (gov.br/receitafederal)
 *   · **Sicalc** (sicalc.receita.fazenda.gov.br) — a calculadora oficial
 *
 * 📌 Referência do momento: **setembro/2026 = 1,09%** ao mês.
 */
export const SELIC = {
  fonte: "Ato Declaratório mensal do Coordenador-Geral de Arrecadação (RFB) · Sicalc",
  referencia: { mes: "2026-09", percentual: 0.0109 },
  ehParametro: true,
};

/**
 * 🔑 O QUE ENTRA E O QUE NÃO ENTRA NO NUMERADOR DO FATOR R.
 *
 * 🔴 **A CPP embutida no DAS NÃO entra — corrigido em 15/09.** Este bloco
 * afirmava o oposto (*"é ela que ajuda a bater os 28%"*, a "Leitura 1" do
 * mercado) e sobreviveu à correção de 14/09, que entrou no comentário e no
 * comportamento do `apurador.mjs` e **não entrou aqui**. O dado ficou mentindo
 * por um dia, e induziu a erro quem o leu — inclusive eu, na conversa com o
 * Pedro em 15/09.
 *
 * Res. CGSN 140/2018 art. 26 §2º I "a", literal: *"a título de encargos, o
 * montante **efetivamente recolhido**: a) de Contribuição Patronal
 * Previdenciária (**inclusive a recolhida dentro do Simples Nacional em
 * relação ao Anexo IV**)"*. A norma **nomeia o Anexo IV**; o silêncio sobre o
 * III e o V é vedação, não permissão. Captura literal em
 * `pesquisa/fontes/2026-09-14-fechamento-motor-fiscal-LITERAL.md` §P2.
 *
 * 🔑 Errar aqui erra para o lado PERIGOSO: contar a CPP infla o numerador,
 * o app recomenda pró-labore **menor** que o necessário, e o cruzamento
 * eSocial × PGDAS-D rebaixa a empresa pro Anexo V **retroativamente**.
 *
 * ⚠️ Metade desta lista é de folha de colaborador (13º, férias, FGTS), que
 * está FORA do escopo por ora. Fica declarada porque a regra é a mesma e
 * porque omitir criaria a impressão de que só pró-labore conta.
 */
export const FATOR_R_NUMERADOR = {
  entra: [
    "salario-clt",
    "pro-labore",
    "decimo-terceiro",
    "ferias-mais-um-terco",
    "fgts",
  ],
  naoEntra: [
    "distribuicao-de-lucros",
    "pagamento-a-autonomo",
    "pagamento-a-prestador-pj",
    "pat",
    "estagiario",
    // 🔴 Só entra no Anexo IV, que está FORA DO ESCOPO. No III e no V, zero.
    "cpp-embutida-no-das",
  ],
  fonte:
    "Res. CGSN 140/2018 art. 26 §2º I 'a' (literal) · " +
    "pesquisa/fontes/2026-09-14-fechamento-motor-fiscal-LITERAL.md §P2",
  regimeDeCaixa: true,
};

/**
 * 🎯 OS TRÊS GRUPOS DE ANEXO — e é isto que evita rodar Fator R à toa.
 *
 * O Manual do PGDAS-D separa as atividades de serviço em três, e a nossa
 * `cnae-matriz.json` já carrega o grupo de cada CNAE no campo
 * `anexo_fator_r_grupo`. Dos **87 CNAEs que atendemos**:
 *
 *   III-fixo ............ 65  → Anexo III sempre. Fator R NÃO muda nada
 *   fator-r-dinamico .... 15  → III ou V, decidido por cálculo, mês a mês
 *   requer-revisao ......  7  → indefinido, não usar em produção
 *
 * 🔴 **Não existe CNAE de serviço "sempre Anexo V".** O V é *resultado* do
 * cálculo (< 28%), nunca classificação fixa por atividade. Qualquer tela que
 * diga "seu CNAE é Anexo V" está errada.
 */
export const GRUPOS_ANEXO = {
  "III-fixo": { anexo: "III", calculaFatorR: false, quantos: 65 },
  "fator-r-dinamico(III<->V, limiar 28%)": { anexo: null, calculaFatorR: true, quantos: 15 },
  "requer-revisao": { anexo: null, calculaFatorR: null, quantos: 7 },
};
