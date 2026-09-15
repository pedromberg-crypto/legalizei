/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌱 A VIDA DEPOIS DA CONSTITUIÇÃO — as 15 personas como empresas abertas.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 15/09: *"conte que eles constituíram e simule o restante
 * que precisa com realidade tipo eu que sou um publicitário"*.
 *
 * As personas de `execucao/testes-flutter/personas-entrada-me.md` terminam no
 * **dia 1**. O motor começa no **mês 1**. Este arquivo é a ponte: cada uma
 * abriu, e viveu.
 *
 * ── 🔴 O QUE ISTO É, E O QUE NÃO É ─────────────────────────────────────────
 *
 * **SIMULAÇÃO, declarada.** Nenhum número aqui saiu de documento. Por isso
 * estas vidas **não são teste dourado** e nunca afirmam *"o DAS é R$474,59"* —
 * esse papel é só da persona zero, que tem recibo do PGDAS-D.
 *
 * O que elas testam é **INVARIÂNCIA**: relações que têm de valer em qualquer
 * empresa do nosso perfil. *"CNAE III-fixo nunca vira Anexo V"* não depende de
 * documento — depende da lei. *"O RBT12 de 13 meses é soma, não média"* idem.
 *
 * ── 📐 DE ONDE VEM O REALISMO ──────────────────────────────────────────────
 *
 * 🧪 **A âncora é a persona zero**, o único caso real: abriu em dezembro,
 * ficou **2 meses sem faturar**, emendou **3 meses de R$12.000**, parou **3
 * meses**, e voltou com R$7.910. Isso não é curva bonita — é como prestador de
 * serviço solo fatura de verdade: **em soco, com seca no meio**.
 *
 * Cada vida abaixo tem o padrão da ATIVIDADE, não um padrão genérico:
 * fotógrafo de evento vive de maio a julho e de novembro a dezembro; escola de
 * idioma cai nas férias; agência tem fee recorrente; artista plástico passa
 * meses em zero. Copiar a mesma curva pra todos testaria um caso só, catorze
 * vezes.
 *
 * ── 🎯 O QUE O CONJUNTO EXERCITA, E A PERSONA ZERO NÃO ─────────────────────
 *
 * · **10 CNAEs `III-fixo`** — a persona zero é `fator-r-dinamico`, e o ramo dos
 *   65 de 87 CNAEs nunca rodou inteiro
 * · **Fator R CAINDO pro Anexo V** (P01) — nunca testado, e é onde o cliente
 *   paga 15,5% em vez de 6%
 * · 🔴 **O Anexo V ALÉM da faixa 1** (P16, entrou em 15/09) — o P01 cai no V e
 *   fica parado na 1ª faixa, onde a parcela a deduzir é ZERO e a efetiva é
 *   igual à nominal. Metade da tabela nunca rodava. O P16 atravessa os R$180
 *   mil de RBT12 e a parcela de R$4.500 finalmente morde
 * · **Faixas 2 e 3** (P09 cresce) — a persona zero nunca passou de R$54 mil
 * · **ISS retido de verdade** (P04, agência de publicidade: o art. 24 da Lei
 *   Municipal 8.725/2003 OBRIGA o tomador de BH a reter)
 * · **2, 3 e 4 sócios** somando no pró-labore
 * · **Folga do teto do INSS por CLT** (P02, P09, P14)
 * · **Declarado ≠ pago** (P08, caixa apertado) — o risco de glosa
 * · **Aberturas em meses diferentes do calendário**, pra provar que março e
 *   dezembro percorrem o mesmo código
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { identidade, competencia } from "./_modelo.mjs";

/** Gera a série de competências a partir de um mês inicial. */
function serie(mesInicial, meses) {
  let [ano, mes] = mesInicial.split("-").map(Number);
  return meses.map((m) => {
    const rotulo = `${ano}-${String(mes).padStart(2, "0")}`;
    mes++;
    if (mes > 12) {
      mes = 1;
      ano++;
    }
    return competencia({ mes: rotulo, ...m });
  });
}

/** Atalho: mês com receita e pró-labore pagos em dia. */
const ok = (receita, proLabore, extra = {}) => ({
  receita,
  proLaboreDeclarado: proLabore,
  proLaborePago: proLabore,
  ...extra,
});

/**
 * ⏰ Mês em que a guia do DAS foi paga com ATRASO.
 *
 * `selicAcumulada` é a Selic somada entre o vencimento e o pagamento, e entra
 * como parâmetro porque é dado externo (Ato Declaratório mensal da RFB) — o
 * motor não a inventa. O 1% do mês do pagamento o `guiaVencida()` acrescenta
 * sozinho, e só quando o pagamento saiu do mês do vencimento.
 */
const atrasado = (receita, proLabore, dataDoPagamento, selicAcumulada = 0) => ({
  receita,
  proLaboreDeclarado: proLabore,
  proLaborePago: proLabore,
  dasPago: { data: dataDoPagamento, selicAcumulada },
});

/** Mês em que declarou o pró-labore e NÃO pagou — o que a Receita glosa. */
const naoPagou = (receita, proLabore) => ({
  receita,
  proLaboreDeclarado: proLabore,
  proLaborePago: 0,
});

const MIN = 1621; // salário mínimo 2026, o piso do pró-labore

/* ═══════════════════════════════════════════════════════════════════════════
 * AS 15 VIDAS
 * ═══════════════════════════════════════════════════════════════════════════ */

export const VIDAS = [
  {
    id: "P01",
    nome: "Bruno Almeida Souza — dev freelancer solo",
    empresa: identidade({
      cnpj: "11.111.111/0001-11",
      razaoSocial: "BRUNO ALMEIDA SOUZA DESENVOLVIMENTO LTDA",
      dataAberturaCnpj: "2026-03-10",
      cnaePrincipal: "6201-5/01",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
    }),
    porque:
      "🔴 O CASO QUE FALTAVA: Fator R CAINDO pro Anexo V. Dev que fatura bem e se paga o mínimo — o padrão mais comum de quem não tem contador que avise. Ele fatura R$18k/mês em contrato e tira R$1.621, o que dá 9% de folha. Em setembro ele corrige e sobe o pró-labore. O motor tem que mostrar a alíquota dobrando e depois voltando.",
    competencias: serie("2026-03", [
      ok(0, MIN), // mês 1: montando, sem faturar
      ok(0, MIN),
      ok(18000, MIN), // 1º contrato
      ok(18000, MIN),
      ok(18000, MIN),
      ok(18000, MIN),
      ok(18000, 5400), // set: corrige o pró-labore pra 30% e volta pro III
      ok(18000, 5400),
    ]),
  },

  {
    id: "P02",
    nome: "Sandra Cristina Moreira — design de interiores, 2 sócias",
    empresa: identidade({
      cnpj: "22.222.222/0001-22",
      razaoSocial: "SANDRA MOREIRA DESIGN LTDA",
      dataAberturaCnpj: "2026-01-15",
      cnaePrincipal: "7410-2/03",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
      cltDoSocio: 6000, // a Sandra tem emprego CLT por fora
      sociosComProLabore: 2,
    }),
    porque:
      "Projeto de interiores é entrada + parcelas na entrega, então a receita vem em degrau. Duas sócias somam pró-labore, e a Sandra tem CLT de R$6.000 por fora — o INSS dela só incide sobre a folga até o teto. É a funcionalidade 4.6 num caso inteiro.",
    competencias: serie("2026-01", [
      ok(0, MIN * 2),
      ok(8000, MIN * 2),
      ok(8000, MIN * 2),
      ok(22000, 4000), // entrega do 1º projeto
      ok(9000, 4000),
      ok(9000, 4000),
      ok(25000, 7000), // entrega do 2º
      ok(9000, 7000),
      ok(9000, 7000),
    ]),
  },

  {
    id: "P03",
    nome: "Rafael Teixeira Lima — filmagem de eventos",
    empresa: identidade({
      cnpj: "33.333.333/0001-33",
      razaoSocial: "RAFAEL LIMA PRODUCOES LTDA",
      dataAberturaCnpj: "2025-11-20",
      cnaePrincipal: "7420-0/04",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "🔑 SAZONALIDADE REAL: casamento e formatura concentram de maio a julho e de novembro a dezembro. Janeiro, fevereiro e março são secos. E como o CNAE é III-fixo, o pró-labore mínimo NÃO derruba o anexo — a tela não pode falar de folga de folha pra ele.",
    competencias: serie("2025-11", [
      ok(14000, MIN), // nov: alta de formatura
      ok(16000, MIN), // dez
      ok(0, MIN), // jan: seco
      ok(0, MIN),
      ok(3000, MIN),
      ok(12000, MIN), // mai: começa a temporada
      ok(19000, MIN),
      ok(17000, MIN),
      ok(4000, MIN),
      ok(2000, MIN),
      ok(15000, MIN), // nov de novo
    ]),
  },

  {
    id: "P04",
    nome: "Diego Martins Prado — agência de publicidade, 2 sócios",
    empresa: identidade({
      cnpj: "44.444.444/0001-44",
      razaoSocial: "PRADO E MARTINS PUBLICIDADE LTDA",
      dataAberturaCnpj: "2026-02-02",
      cnaePrincipal: "7311-4/00",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
      sociosComProLabore: 2,
    }),
    porque:
      "🔴 A ÚNICA COM ISS RETIDO DE VERDADE, e não por invenção: o **art. 24 da Lei Municipal de BH 8.725/2003 obriga a retenção sobre agência de publicidade**. Os clientes dela em BH retêm; os de fora não podem (LC 116 art. 3º). Agência vive de fee mensal recorrente mais projeto avulso, então a receita é estável com picos.",
    competencias: serie("2026-02", [
      ok(0, MIN * 2),
      ok(12000, 3400, { receitaComIssRetido: 12000 }), // cliente de BH retém
      ok(12000, 3400, { receitaComIssRetido: 12000 }),
      ok(20000, 5600, { receitaComIssRetido: 12000 }), // fee + projeto de fora
      ok(12000, 3400, { receitaComIssRetido: 12000 }),
      ok(15000, 4200, { receitaComIssRetido: 12000 }),
      ok(12000, 3400, { receitaComIssRetido: 12000 }),
    ]),
  },

  {
    id: "P05",
    nome: "Paula Rezende Antunes — edição de livros",
    empresa: identidade({
      cnpj: "55.555.555/0001-55",
      razaoSocial: "PAULA ANTUNES EDICOES LTDA",
      dataAberturaCnpj: "2026-05-08",
      cnaePrincipal: "5811-5/00",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "Edição é ciclo longo: meses de trabalho e a receita toda na entrega. O extremo oposto da recorrência, e ele testa se o RBT12 proporcional aguenta receita concentrada em poucos meses sem inflar a faixa.",
    competencias: serie("2026-05", [
      ok(0, MIN),
      ok(0, MIN),
      ok(0, MIN),
      ok(45000, MIN), // entrega do 1º título
      ok(0, MIN),
      ok(0, MIN),
    ]),
  },

  {
    id: "P06",
    nome: "Ivete Barros Nunes — tradução, 3 sócios",
    empresa: identidade({
      cnpj: "66.666.666/0001-66",
      razaoSocial: "NUNES TRADUCOES LTDA",
      dataAberturaCnpj: "2026-04-01",
      cnaePrincipal: "7490-1/01",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
      sociosComProLabore: 3,
    }),
    porque:
      "Tradução é volume constante de ticket baixo — a curva mais lisa do conjunto. Com 3 sócios o pró-labore soma três vezes o mínimo, e isso sozinho já segura o Fator R acima de 28% sem ninguém planejar. É o caso em que o anexo 'dá certo por acidente'.",
    competencias: serie("2026-04", [
      ok(0, MIN * 3),
      ok(11000, MIN * 3),
      ok(12500, MIN * 3),
      ok(11800, MIN * 3),
      ok(13000, MIN * 3),
      ok(12200, MIN * 3),
      ok(12800, MIN * 3),
    ]),
  },

  {
    id: "P07",
    nome: "Aparecida (Cida) Ramos de Lima — ensino de idiomas",
    empresa: identidade({
      cnpj: "77.777.777/0001-77",
      razaoSocial: "APARECIDA LIMA ENSINO LTDA",
      dataAberturaCnpj: "2026-01-20",
      cnaePrincipal: "8593-7/00",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "Mensalidade de aluno é a receita mais previsível que existe — e cai nas férias, porque aluno tranca em dezembro e janeiro. Ticket baixo, volume estável. É o caso em que o cliente NÃO precisa de conselho nenhum sobre pró-labore, e a tela tem que saber ficar quieta.",
    competencias: serie("2026-01", [
      ok(2800, MIN),
      ok(5200, MIN), // volta às aulas
      ok(6100, MIN),
      ok(6400, MIN),
      ok(6400, MIN),
      ok(5900, MIN), // julho: férias escolares
      ok(4200, MIN),
      ok(6300, MIN),
      ok(6500, MIN),
    ]),
  },

  {
    id: "P08",
    nome: "Marta de Souza Andrade — artista plástica",
    empresa: identidade({
      cnpj: "88.888.888/0001-88",
      razaoSocial: "MARTA ANDRADE ARTES LTDA",
      dataAberturaCnpj: "2026-02-12",
      cnaePrincipal: "9002-7/01",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "🔴 O CASO DE GLOSA: artista vende quando expõe, e passa meses em zero. Com caixa apertado ela DECLARA o pró-labore e não paga em três competências — que é exatamente o que a Receita pega cruzando EFD-Reinf com DCTFWeb. Como o CNAE é III-fixo o anexo não muda, mas o motor tem que ACUSAR o risco assim mesmo.",
    competencias: serie("2026-02", [
      ok(0, MIN),
      ok(0, MIN),
      naoPagou(0, MIN), // sem caixa
      naoPagou(0, MIN),
      naoPagou(0, MIN),
      ok(23000, MIN), // exposição
      ok(0, MIN),
      ok(4000, MIN),
    ]),
  },

  {
    id: "P09",
    nome: "Gustavo Ferreira Lima — organização de eventos, 2 sócios",
    empresa: identidade({
      cnpj: "99.999.999/0001-99",
      razaoSocial: "LIMA EVENTOS LTDA",
      dataAberturaCnpj: "2025-09-01",
      cnaePrincipal: "8230-0/01",
      grupoAnexo: "III-fixo",
      cltDoSocio: 9000, // acima do teto do INSS: o pró-labore nao gera contribuicao
      sociosComProLabore: 2,
    }),
    porque:
      "🔴 A ÚNICA QUE PASSA DE FAIXA. Eventos corporativos escalam rápido, e o RBT12 dela cruza os R$180 mil — a persona zero nunca passou de R$54 mil, então a **parcela a deduzir** nunca tinha sido exercitada. E o sócio tem CLT de R$9.000, acima do teto do INSS: o pró-labore dele não gera contribuição nenhuma.",
    competencias: serie("2025-09", [
      ok(0, MIN * 2),
      ok(12000, MIN * 2),
      ok(28000, MIN * 2),
      ok(35000, MIN * 2), // dez: pico de confraternização
      ok(8000, MIN * 2),
      ok(11000, MIN * 2),
      // 🔴 TRÊS COMPETÊNCIAS SEGUIDAS PAGAS EM ATRASO — entrou em 15/09.
      // Não é invenção: é o padrão medido na conta real, que levou **R$229,85
      // de multa em 3 meses seguidos**, com atrasos de ~13, ~21 e ~14 dias,
      // todos "Confirmado via Plataforma". Até aqui as 16 vidas pagavam tudo
      // em dia, e o `guiaVencida()` (multa + juros + Selic) nunca rodava — o
      // elenco só exercitava o cenário que não dói.
      //
      // ⚠️ E as datas aqui já nasceram erradas uma vez: eu paguei "dia 3 do mês
      // seguinte" achando que o DAS vencia no mês da competência. Ele vence no
      // dia 20 do mês SEGUINTE, então o pagamento caía ANTES do vencimento e o
      // motor devolvia `emDia`. O motor pegou; o olho não teria.
      atrasado(19000, MIN * 2, "2026-05-04", 0.0109), // venceu 20/04 · 14 dias
      atrasado(24000, MIN * 2, "2026-06-10", 0.0218), // venceu 20/05 · 21 dias
      atrasado(27000, MIN * 2, "2026-07-06", 0.0327), // venceu 22/06 · 14 dias
      ok(22000, MIN * 2),
      ok(26000, MIN * 2),
      ok(24000, MIN * 2),
      ok(30000, MIN * 2), // 13º mês: o RBT12 vira SOMA, não média
    ]),
  },

  {
    id: "P10",
    nome: "Júlia Ramos Pinto — teleatendimento",
    empresa: identidade({
      cnpj: "10.101.010/0001-10",
      razaoSocial: "JULIA PINTO ATENDIMENTO LTDA",
      dataAberturaCnpj: "2026-06-15",
      cnaePrincipal: "8220-2/00",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "Contrato mensal fixo com um cliente só. A curva mais chata do conjunto, e por isso útil: se algo variar no cálculo dela, o erro é do motor, não do cenário.",
    competencias: serie("2026-08", [
      ok(0, MIN),
      ok(7500, MIN),
      ok(7500, MIN),
      ok(7500, MIN),
      ok(7500, MIN),
    ]),
  },

  {
    id: "P11",
    nome: "Cléber Augusto Pinto — aluguel de equipamentos, 4 sócios",
    empresa: identidade({
      cnpj: "11.222.333/0001-44",
      razaoSocial: "PINTO LOCACOES LTDA",
      dataAberturaCnpj: "2026-03-01",
      cnaePrincipal: "7733-1/00",
      grupoAnexo: "III-fixo",
      sociosComProLabore: 4,
    }),
    porque:
      "🔑 O TETO DE SÓCIOS: quatro pró-labores mínimos somam R$6.484/mês, e isso sozinho é mais da metade do faturamento dela. Testa se o numerador aguenta e se o custo total por sócio aparece certo. Aluguel tem receita estável, então a variação vem toda da folha.",
    competencias: serie("2026-03", [
      ok(0, MIN * 4),
      ok(9000, MIN * 4),
      ok(9500, MIN * 4),
      ok(9200, MIN * 4),
      ok(10000, MIN * 4),
      ok(9800, MIN * 4),
    ]),
  },

  {
    id: "P12",
    nome: "Rogério Nunes Barreto — chaveiro",
    empresa: identidade({
      cnpj: "12.121.212/0001-12",
      razaoSocial: "BARRETO CHAVES LTDA",
      dataAberturaCnpj: "2026-07-05",
      cnaePrincipal: "9529-1/02",
      grupoAnexo: "III-fixo",
    }),
    porque:
      "Muito ticket pequeno, todo dia, valor baixo. É o perfil que mais tende a achar que 'não precisa de contador', e o DAS dele é de dezenas de reais — testa se o arredondamento por tributo se comporta em valores pequenos, onde o centavo pesa proporcionalmente mais.",
    competencias: serie("2026-10", [
      ok(0, MIN),
      ok(3200, MIN),
      ok(3450, MIN),
      ok(2980, MIN),
    ]),
  },

  {
    id: "P13",
    nome: "Carla Nogueira Prado — salão de beleza, 2 sócias",
    empresa: identidade({
      cnpj: "13.131.313/0001-13",
      razaoSocial: "PRADO BELEZA LTDA",
      dataAberturaCnpj: "2026-04-10",
      cnaePrincipal: "9602-5/01",
      grupoAnexo: "III-fixo",
      sociosComProLabore: 2,
    }),
    porque:
      "Alta frequência e ticket baixo, com pico em dezembro e em datas comemorativas. Duas sócias. É a única categoria da taxonomia com UM CNAE só, então não há ambiguidade de enquadramento.",
    competencias: serie("2026-07", [
      ok(0, MIN * 2),
      ok(11000, MIN * 2),
      ok(12500, MIN * 2),
      ok(11800, MIN * 2),
      ok(13500, MIN * 2), // agosto: dia dos pais
      ok(12000, MIN * 2),
    ]),
  },

  {
    id: "P14",
    nome: "Heitor Nogueira Sales — pensão, 3 sócios",
    empresa: identidade({
      cnpj: "14.141.414/0001-14",
      razaoSocial: "SALES HOSPEDAGEM LTDA",
      dataAberturaCnpj: "2025-12-01",
      cnaePrincipal: "5590-6/03",
      grupoAnexo: "III-fixo",
      cltDoSocio: 3000, // CLT parcial: sobra folga ate o teto
      sociosComProLabore: 3,
    }),
    porque:
      "🔑 ABRIU EM DEZEMBRO, como a persona zero — e é o caso que prova que a virada 31/12 → 01/01 é não-evento. Hospedagem tem alta em dezembro-janeiro e julho. Três sócios, e um deles tem CLT parcial de R$3.000, então sobra folga até o teto.",
    competencias: serie("2025-12", [
      ok(6000, MIN * 3), // alta de fim de ano já no mês 1
      ok(7500, MIN * 3), // janeiro: ainda alta
      ok(3000, MIN * 3),
      ok(3400, MIN * 3),
      ok(4100, MIN * 3),
      ok(3800, MIN * 3),
      ok(8200, MIN * 3), // julho: férias
      ok(4000, MIN * 3),
      ok(3900, MIN * 3),
    ]),
  },

  {
    id: "P16",
    nome: "Vitor Andrade Pinto — consultoria em TI, o Anexo V que CRESCE",
    empresa: identidade({
      cnpj: "16.161.616/0001-16",
      razaoSocial: "VITOR PINTO CONSULTORIA EM TI LTDA",
      dataAberturaCnpj: "2025-06-01",
      cnaePrincipal: "6204-0/00",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
    }),
    porque:
      "🔴 A VIDA QUE FECHA A LACUNA DO ANEXO V. O P01 cai no V, mas nunca sai da FAIXA 1 — e na faixa 1 a parcela a deduzir é zero, então a efetiva é a nominal e metade da tabela nunca roda. O Vitor é consultor sênior: fatura de R$25k a R$42k, se paga o mínimo porque ninguém avisou, e o RBT12 dele ATRAVESSA os R$180 mil. Aí a parcela a deduzir de R$4.500 finalmente morde, a efetiva descola da nominal, e o motor tem que mostrar a alíquota subindo de 15,50% em direção a 16,75% sem nunca chegar lá. No fim ele encosta nos R$360 mil, que é o teto do ME — a porta de SAÍDA pra EPP, o único lugar onde EPP existe no nosso produto.",
    competencias: serie("2025-06", [
      ok(0, MIN), // mês 1: saiu do CLT, montando
      ok(8000, MIN), // 1º cliente
      ok(12000, MIN),
      ok(15000, MIN),
      ok(18000, MIN),
      ok(22000, MIN), // 2025-11
      ok(25000, MIN), // 2025-12 — já em ritmo de sênior
      ok(25000, MIN), // 2026-01
      ok(25000, MIN),
      ok(28000, MIN),
      ok(25000, MIN),
      ok(25000, MIN), // 2026-05 — fecha o 12º mês
      ok(25000, MIN), // 2026-06 — 13º: o RBT12 vira SOMA
      ok(30000, MIN),
      ok(28000, MIN),
      ok(25000, MIN),
      ok(32000, MIN),
      ok(28000, MIN), // 2026-11
      ok(35000, MIN), // 2026-12
      ok(38000, MIN), // 2027-01
      ok(40000, MIN),
      ok(42000, MIN), // 2027-03 — encosta no teto do ME
    ]),
  },

  {
    id: "P18",
    nome: "Elisa Prado Martins — agenciamento de publicidade, o DÉFICIT LONGO",
    empresa: identidade({
      cnpj: "18.181.818/0001-18",
      razaoSocial: "ELISA PRADO MARTINS AGENCIAMENTO LTDA",
      dataAberturaCnpj: "2025-01-15",
      cnaePrincipal: "7312-2/00",
      grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
      sociosComProLabore: 2,
    }),
    porque:
      "🔴 A VIDA QUE PROVA O CASO FEIO DE VERDADE. Em 15/09 o Pedro desconfiou " +
      "dos valores altos que o piloto pedia, e a auditoria de agregação não " +
      "achou defeito — mas também não pôde provar no caso extremo, porque " +
      "NENHUMA vida tinha déficit grande o bastante. O R$72.169 que assustou " +
      "veio de um caso sintético meu, não de persona. A Elisa fecha esse " +
      "buraco: **26 competências, 2 sócias, faturando alto e pagando os dois " +
      "salários mínimos o tempo todo**. A folha fica perto de 13% enquanto o " +
      "limiar é 28%, então o déficit cresce mês a mês e a janela de 12 passa " +
      "a carregar um buraco que nenhuma competência sozinha paga. É onde o " +
      "modo `recuperacao` e o `paraVirarJa` têm que aparecer de verdade. " +
      "⚠️ O CNAE dela é `fator-r-dinamico` com confiança **média** na matriz " +
      "(o do P01 e o do P16 são confiança alta) — para o teste do motor tanto " +
      "faz, porque o grupo é entrada declarada, mas não usar este CNAE como " +
      "prova de enquadramento antes da Larissa ratificar.",
    competencias: serie("2025-01", [
      ok(0, MIN * 2), // 2025-01: montando
      ok(0, MIN * 2),
      ok(9000, MIN * 2), // 1ª conta de agenciamento
      ok(12000, MIN * 2),
      ok(15000, MIN * 2),
      ok(18000, MIN * 2),
      ok(20000, MIN * 2),
      ok(22000, MIN * 2),
      ok(22000, MIN * 2),
      ok(24000, MIN * 2),
      ok(30000, MIN * 2), // 2025-11 — pico de campanha de fim de ano
      ok(32000, MIN * 2), // 2025-12
      ok(18000, MIN * 2), // 2026-01 — 13º mês: o RBT12 vira SOMA
      ok(20000, MIN * 2),
      ok(24000, MIN * 2),
      ok(24000, MIN * 2),
      ok(26000, MIN * 2),
      ok(24000, MIN * 2),
      ok(26000, MIN * 2),
      ok(24000, MIN * 2),
      ok(22000, MIN * 2),
      ok(24000, MIN * 2),
      ok(30000, MIN * 2), // 2026-11 — pico de novo
      ok(32000, MIN * 2), // 2026-12
      ok(18000, MIN * 2), // 2027-01
      ok(20000, MIN * 2), // 2027-02
    ]),
  },
];

/**
 * 🚫 As 5 extras que seguem SEM vida — e é de propósito.
 *
 * P15 (recusa por conselho) e P17 (CPF suspenso) **nunca abrem** — morrem no
 * gate e no checkout. P19 e P20 abrem depois de contornar o obstáculo, e
 * a vida delas seria idêntica à de alguma das 16: o que as distingue é o
 * **caminho de entrada**, não a operação. Duplicar cenário sem variável nova
 * só faria o teste demorar mais.
 *
 * 🔄 **O P16 SAIU desta lista em 15/09.** Ele estava aqui como "abre mas não
 * acrescenta", e estava certo enquanto a régua era o caminho de entrada. Como
 * OPERAÇÃO ele acrescenta a única coisa que faltava: um Anexo V que cresce
 * além da faixa 1. O critério não mudou, o que mudou foi o que precisávamos
 * dele.
 *
 * 🔄 **E o P18 saiu em 15/09, pelo mesmo motivo que o P16 saiu.** Ele estava
 * em "abre mas não acrescenta" e estava certo enquanto a régua era o caminho
 * de entrada. Como OPERAÇÃO ele traz a única coisa que faltava depois da
 * auditoria de agregação: um **déficit longo e real**, acumulado por 26
 * competências de folha no piso. Todas as outras vidas ou são pilotadas ou são
 * curtas demais para o buraco crescer — e sem ele o modo `recuperacao` só
 * tinha prova sintética.
 */
export const SEM_VIDA = {
  naoAbrem: ["P15", "P17"],
  abremMasNaoAcrescentam: ["P19", "P20"],
};
