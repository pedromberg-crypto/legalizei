/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📦 A ENTREGA — o que o dev recebe, gerado do motor que já está provado
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/entrega/gerar-entrega.mjs --amostra`   uma função + um caso
 * `node execucao/entrega/gerar-entrega.mjs`             a entrega inteira
 *
 * Pedido do Pedro em 17/09:
 *
 *   *"na conclusão da entrega final validada eu preciso que esses arquivos
 *   estejam de fácil entendimento para a aplicação dele pelos devs do front
 *   ao back end."*
 *
 * ── 🔴 POR QUE FIXTURE, E NÃO DOCUMENTO ────────────────────────────────────
 *
 * A 1ª proposta era um **contrato escrito** ao lado de cada função — *"entra
 * reais, devolve centavos, garante X"* — com uma trava derrubando a rodada se
 * faltasse. O Pedro recusou o atrito, e estava certo por duas razões:
 *
 *   1. escrever 38 blocos à mão é a mesma prosa que envelheceu em 7 de 7 docs
 *      na auditoria de 17/09;
 *   2. 🔑 **prosa não é a melhor forma de dizer isso.** Um exemplo diz melhor.
 *
 * Ninguém precisa escrever *"recebe reais e devolve centavos"* se a fixture
 * mostra `5400` entrando e `59400` saindo. O dev entende em dois segundos, e
 * o arquivo não pode mentir: ele é a saída do motor rodando.
 *
 * ── 💣 O ERRO QUE ESTA ENTREGA EXISTE PARA IMPEDIR ─────────────────────────
 *
 * O motor mistura unidades na fronteira, e isso já nos mordeu **três vezes**
 * (M-014, M-020, M-027). Pior: o próprio retrato mensal mistura **no mesmo
 * objeto** — `das.total` vem em centavos e `piloto.minimoLegal` vem em reais,
 * sem nada no nome que avise.
 *
 * 🔒 Então toda fixture carrega, ao lado de cada número, a **unidade** e a
 * **forma legível**. Não é redundância: é a única coisa que impede o dev de
 * errar por 100× com um número que parece plausível.
 *
 * ── 🤝 DOIS PACOTES QUE CONVERSAM (decisão do Pedro) ───────────────────────
 *
 *   back/   as funções e os casos — o que CALCULAR
 *   front/  os mesmos casos — o que MOSTRAR
 *
 * 🔑 A conversa é o **`caso`**: `"P01-2026-06"` existe nos dois. O front lê a
 * tela, o back lê a conta, e nenhum duplica o outro — são duas vistas do
 * mesmo fato, do mesmo jeito que o mapa e a apresentação são duas vistas da
 * mesma coleção de telas.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { VIDAS } from "../estado-cnpj/vidas.mjs";
import { retratoDoMes } from "../estado-cnpj/_modelo.mjs";
import {
  darfDoProLabore,
  apurarDAS,
  guiaVencida,
  rbt12De,
  fatorR,
  anualiza,
  vencimentoDe,
} from "../motor-fiscal/apurador.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const AMOSTRA = process.argv.includes("--amostra");

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · DINHEIRO COM UNIDADE COLADA
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Todo valor monetário da entrega sai neste formato. O `bruto` é o que o
 * dev compara no teste; o `legivel` é o que ele confere com o olho; a
 * `unidade` é o que o impede de somar centavo com real.
 */
const R = (emReaisDaAutoria) => Math.round(emReaisDaAutoria * 100);

const centavos = (v) => ({
  valor: v,
  unidade: "centavos",
  legivel: "R$ " + (v / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
});

const reais = (v) => ({
  valor: v,
  unidade: "reais",
  legivel: "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
});

const pct = (v) => ({
  valor: v,
  unidade: "fração (0 a 1)",
  legivel: (v * 100).toFixed(4).replace(".", ",") + "%",
});

/* ═══════════════════════════════════════════════════════════════════════════
 * 1.1 · O CONGELADO — a rede da migração para centavos
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 A IDEIA, e ela é a coisa mais importante deste arquivo.
 *
 * O Pedro decidiu em 17/09 padronizar **todo valor monetário do motor em
 * centavos**, porque hoje a unidade muda no meio do mesmo objeto sem aviso
 * (`das.total` em centavos, `piloto.minimoLegal` em reais). Refatorar isso
 * mexe no apurador, no modelo, no piloto e nas 14 suítes ao mesmo tempo.
 *
 * 🔴 **E confiar só nas suítes não basta.** Elas também teriam que ser
 * migradas, e suíte migrada junto com o código **pode encodar o bug** — foi
 * exatamente o M-013, em que um invariante passava porque tinha o defeito
 * escrito dentro dele.
 *
 * ✅ **A rede é a string.** `"R$ 2.790,01"` é **independente de unidade**:
 * não importa se por dentro é `279001` ou `2790.01`, o legível é o mesmo. Se
 * a refatoração for pura, o diff dos legíveis é **zero**. Qualquer diferença
 * aponta o caso e o campo exatos.
 *
 * ⚠️ Por isso o congelado é varrido **automaticamente** da fixture inteira,
 * e não escrito à mão: campo esquecido é buraco na rede, e eu já esqueci
 * campo antes.
 */
function congelar(objeto, prefixo, destino) {
  if (objeto === null || typeof objeto !== "object") {
    /**
     * Strings de dinheiro do pacote do front entram também — e entram
     * INTEIRAS, mesmo quando o valor está no meio de uma frase.
     *
     * 🔴 A 1ª versão exigia que a string COMEÇASSE com "R$ ", e por isso
     * deixava passar *"Você retirou R$1.621,00 este mês…"* — que é exatamente
     * o número que o cliente lê na tela. Rede com buraco no lugar mais
     * visível é pior que rede nenhuma, porque o verde parece merecido.
     */
    if (typeof objeto === "string" && /R\$\s?\d/.test(objeto)) destino[prefixo] = objeto;
    return destino;
  }
  if (Array.isArray(objeto)) {
    objeto.forEach((item, i) => congelar(item, `${prefixo}[${i}]`, destino));
    return destino;
  }
  // O triple { valor, unidade, legivel } é o alvo: guarda só o legível.
  if (typeof objeto.legivel === "string" && "unidade" in objeto) {
    destino[prefixo] = objeto.legivel;
    return destino;
  }
  for (const [chave, valor] of Object.entries(objeto)) {
    congelar(valor, prefixo ? `${prefixo}.${chave}` : chave, destino);
  }
  return destino;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · BACK · UMA FUNÇÃO
 * ═══════════════════════════════════════════════════════════════════════════
 * O caso é escolhido para a unidade ficar ÓBVIA: 5400 entra, 59400 sai. Quem
 * ler não precisa de legenda para concluir que a entrada é em reais e a saída
 * em centavos — e é exatamente a confusão que produziu o M-014.
 */
function fixtureDeFuncao() {
  const entrada = { proLabore: 5400, cltRemuneracao: 0 };
  const r = darfDoProLabore(R(entrada.proLabore), R(entrada.cltRemuneracao));

  return {
    funcao: "darfDoProLabore",
    modulo: "motor-fiscal/apurador.mjs",
    oQueFaz:
      "A guia do sócio no mês: INSS de 11% até o teto da pessoa, e IRRF pela " +
      "tabela progressiva depois de deduzir o que for melhor para ele.",
    porPessoa: true,
    avisoDePessoa:
      "🔴 É POR SÓCIO, nunca pela folha somada. Somar 2 sócios de R$1.621 e " +
      "chamar uma vez erra o INSS para MENOS (o teto é da pessoa) e o IRRF " +
      "para MAIS (a tabela é progressiva por beneficiário). Para a empresa " +
      "inteira, use darfDaFolha({ socios }).",
    entrada: {
      proLabore: { ...centavos(R(entrada.proLabore)), oQueE: "o pró-labore bruto do mês, deste sócio" },
      cltRemuneracao: {
        ...centavos(R(entrada.cltRemuneracao)),
        oQueE: "quanto este sócio já recebe como CLT em outra empresa — consome a folga do teto do INSS antes do pró-labore",
      },
    },
    saida: {
      inss: centavos(r.inss),
      irrf: centavos(r.irrf),
      baseInss: centavos(r.baseInss),
      baseIrrf: centavos(r.baseIrrf),
      deducaoAplicada: {
        ...centavos(r.deducaoAplicada),
        oQueE: "o maior entre o INSS pago e o desconto simplificado — sempre o que favorece o sócio",
      },
      usouDescontoSimplificado: r.usouDescontoSimplificado,
      impostoTabela: { ...centavos(r.impostoTabela), oQueE: "antes do redutor do art. 3º-A" },
      redutor: centavos(r.redutor),
      isento: r.isento,
    },
    garantias: [
      "INSS = 11% × min(pró-labore, teto − CLT) — Lei 8.212/91 art. 28 §5º, verificado em 3.969 combinações",
      "o líquido nunca cai quando o bruto sobe, de R$0 a R$30.000, testado de um real em um real",
      "a dedução aplicada é sempre a melhor para o sócio — Lei 9.250/1995",
    ],
    fonte: "Lei 8.212/91 art. 28 §5º · Lei 9.250/1995 arts. 3º, 3º-A e 4º · Lei 15.270/2025",
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2.1 · BACK · AS FUNÇÕES DE FRONTEIRA, com vários casos cada
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Escolhidas por serem as que **trocam de unidade** — é onde o dev erra e
 * onde nós erramos três vezes. Cada uma vem com entradas que exercitam as
 * bordas que importam: zero, o piso, o teto do INSS, a vizinhança do redutor.
 */
const CHAMADAS = [
  {
    funcao: "darfDoProLabore",
    entradaEmReais: true,
    saidaEmCentavos: true,
    oQueFaz: "a guia do sócio, POR PESSOA — INSS de 11% até o teto, e IRRF progressivo",
    casos: [
      { rotulo: "sem pró-labore", args: [0, 0] },
      { rotulo: "no salário mínimo de 2026", args: [1621, 0] },
      { rotulo: "abaixo da 1ª faixa do IRRF", args: [3500, 0] },
      { rotulo: "com IRRF devido", args: [5400, 0] },
      { rotulo: "no limite da isenção do redutor", args: [5000, 0] },
      { rotulo: "um centavo acima da isenção", args: [5000.01, 0] },
      { rotulo: "acima do teto do INSS", args: [14000, 0] },
      { rotulo: "sócio com CLT parcial (consome parte da folga)", args: [1621, 6000] },
      { rotulo: "sócio com CLT acima do teto (zera o INSS)", args: [1621, 9000] },
    ],
    chamar: (a) => darfDoProLabore(R(a[0]), R(a[1])),
    nomesDaEntrada: ["proLabore", "cltRemuneracao"],
    camposDeSaida: ["inss", "irrf", "baseInss", "baseIrrf", "deducaoAplicada", "impostoTabela", "redutor"],
  },
  {
    funcao: "apurarDAS",
    entradaEmReais: true,
    saidaEmCentavos: true,
    oQueFaz: "o DAS do mês: SOMA de 6 parcelas arredondadas por tributo, nunca o produto",
    casos: [
      { rotulo: "mês sem receita", args: [0, 54000, "III"] },
      { rotulo: "valor quebrado — o caso que funda o motor", args: [7910, 54000, "III"] },
      { rotulo: "valor redondo — o controle", args: [12000, 54000, "III"] },
      { rotulo: "1ª faixa cheia", args: [15000, 180000, "III"] },
      { rotulo: "2ª faixa", args: [16000, 192000, "III"] },
      { rotulo: "no teto do ME", args: [30000, 360000, "III"] },
      { rotulo: "Anexo V, mesma receita", args: [12000, 54000, "V"] },
      { rotulo: "Anexo V no teto", args: [30000, 360000, "V"] },
    ],
    chamar: (a) => apurarDAS({ receitaMes: R(a[0]), rbt12: R(a[1]), anexo: a[2] }),
    nomesDaEntrada: ["receitaMes", "rbt12", "anexo"],
    camposDeSaida: ["total", "bruto"],
  },
  {
    funcao: "guiaVencida",
    entradaEmReais: false,
    saidaEmCentavos: true,
    oQueFaz: "multa de 0,33% ao dia travando em 20% no 61º dia, mais juros de Selic acumulada +1%",
    avisoExtra:
      "🔴 ESTA recebe CENTAVOS, ao contrário de apurarDAS e darfDoProLabore, que recebem reais. " +
      "Passar reais aqui devolve um número plausível e errado — foi o achado M-014.",
    casos: [
      { rotulo: "em dia", args: [118204, 0] },
      { rotulo: "14 dias de atraso", args: [118204, 14] },
      { rotulo: "21 dias", args: [152834, 21] },
      { rotulo: "60 dias — véspera do teto", args: [618325, 60] },
      { rotulo: "61 dias — a multa trava em 20%", args: [618325, 61] },
    ],
    chamar: (a) => guiaVencida({ principal: a[0], diasDeAtraso: a[1] }),
    nomesDaEntrada: ["principal", "diasDeAtraso"],
    camposDeSaida: ["principal", "multa", "juros", "total"],
  },
];

function fixturesDeFuncoes() {
  return CHAMADAS.map((c) => ({
    funcao: c.funcao,
    modulo: "motor-fiscal/apurador.mjs",
    oQueFaz: c.oQueFaz,
    ...(c.avisoExtra ? { aviso: c.avisoExtra } : {}),
    unidades: {
      entrada: "centavos",
      saida: "centavos",
    },
    casos: c.casos.map((caso) => {
      const r = c.chamar(caso.args);
      const entrada = {};
      c.nomesDaEntrada.forEach((nome, i) => {
        const v = caso.args[i];
        /**
         * 🔒 A ENTREGA SAI TODA EM CENTAVOS — decisão do Pedro em 17/09.
         *
         * A autoria dos casos aqui continua escrevendo em reais onde isso é
         * mais legível (`5400`, `14000`), e `R()` converte. O que o dev recebe
         * é **uma unidade só**, com a etiqueta colada em cada valor.
         */
        entrada[nome] =
          typeof v !== "number"
            ? v
            : nome === "diasDeAtraso"
              ? { valor: v, unidade: "dias", legivel: `${v} dia(s)` }
              : centavos(c.entradaEmReais ? R(v) : v);
      });
      const saida = {};
      for (const campo of c.camposDeSaida) {
        if (r[campo] !== undefined) saida[campo] = centavos(r[campo]);
      }
      // Campos que não são dinheiro viajam crus — e é por isso que o congelado
      // só olha o triple { valor, unidade, legivel }.
      for (const extra of ["efetiva", "faixa", "anexo", "isento", "usouDescontoSimplificado", "pctMulta", "multaNoTeto"]) {
        if (r[extra] !== undefined) saida[extra] = r[extra];
      }
      return { rotulo: caso.rotulo, entrada, saida };
    }),
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · BACK · UMA COMPETÊNCIA
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Esta é a fixture que vale como **teste de aceite**: o dev implementa na
 * linguagem dele, roda a entrada, e ou bate ao centavo ou não bate. É o que
 * transforma "o motor está validado" em arquivo executável.
 *
 * ⚠️ O caso da amostra é o P01 em jun/2026 DE PROPÓSITO: é o mês em que a
 * empresa perde o benefício do Anexo III. Um caso feliz não mostraria nem o
 * alerta, nem a divergência, nem o piloto agindo.
 */
function fixtureDeCompetencia(idVida, mes) {
  const v = VIDAS.find((x) => x.id === idVida);
  const r = retratoDoMes({ empresa: v.empresa, competencias: v.competencias, mesAlvo: mes });
  const cp = v.competencias.find((c) => c.mes === mes);

  return {
    caso: `${idVida}-${mes}`,
    persona: { id: idVida, nome: v.nome, porqueEstaNoElenco: v.porque.slice(0, 180) + "…" },

    entrada: {
      empresa: {
        cnaePrincipal: v.empresa.cnaePrincipal,
        grupoAnexo: v.empresa.grupoAnexo,
        municipio: v.empresa.municipio,
        dataAberturaCnpj: v.empresa.dataAberturaCnpj,
        sociosComProLabore: v.empresa.sociosComProLabore,
        sociosTotal: v.empresa.sociosTotal,
        cltDoSocio: centavos(v.empresa.cltDoSocio),
      },
      competencia: {
        mes,
        receita: centavos(cp.receita),
        proLaboreDeclarado: centavos(cp.proLaboreDeclarado),
        proLaborePago: {
          ...centavos(cp.proLaborePago),
          oQueE: "🔴 o Fator R é REGIME DE CAIXA: só o que foi PAGO entra no numerador (art. 26 §6º). Declarado e não pago infla o Fator R e a Receita glosa.",
        },
      },
      historico: "as competências anteriores desta persona, no mesmo formato",
    },

    esperado: {
      mesDeAtividade: r.mesDeAtividade,
      rbt12: { ...centavos(r.rbt12), regra: r.regraRbt12, oQueE: "acumulado dos 12 meses ANTERIORES; o mês corrente não entra (Res. CGSN 140/2018 art. 24)" },
      anexo: r.anexo,
      /**
       * 🔑 `null` aqui NÃO é ausência de dado — é decisão do motor, e o dev
       * precisa saber disso: em CNAE de anexo fixo o Fator R **não roda**, e
       * a tela não deve falar dele. Rodar à toa criaria número sem sentido e
       * uma explicação que o cliente não pediu.
       */
      fatorR: r.fatorR
        ? {
            razao: pct(r.fatorR.fr),
            limiar: pct(0.28),
            decideOAnexo: true,
            folhaPaga: centavos(r.fatorR.folhaPaga),
            receita12: centavos(r.fatorR.receita12),
            regimeDeCaixa: {
              declarado: centavos(r.fatorR.folhaDeclarada),
              naoPago: centavos(r.fatorR.naoPago),
              riscoDeGlosa: r.fatorR.riscoDeGlosa,
              oQueE: "só o PAGO entra no numerador (art. 26 §6º). Declarar e não pagar infla o Fator R e a Receita glosa.",
            },
            // ⚠️ unidade DIFERENTE da do rbt12 logo acima, no mesmo objeto.
            avisoDeUnidade:
              "🔴 folhaPaga e receita12 vêm em REAIS; rbt12 e das vêm em CENTAVOS. É assim no motor hoje, e é por isso que esta entrega carimba a unidade em todo número.",
          }
        : {
            naoRoda: true,
            porque: `o CNAE desta empresa é de anexo FIXO (${v.empresa.grupoAnexo}) — o Fator R não decide nada aqui`,
            aTelaNaoDeveFalarDisso: true,
          },
      das: {
        total: centavos(r.das.total),
        efetiva: pct(r.das.efetiva),
        faixa: r.das.faixa,
        parcelas: Object.fromEntries(Object.entries(r.das.parcelas).map(([k, val]) => [k, centavos(val)])),
        comoSeCalcula: "🔒 O DAS é a SOMA DAS 6 PARCELAS ARREDONDADAS, não o arredondamento do produto. Quem calcular receita × alíquota erra centavo em toda guia. Provado contra recibo do PGDAS-D.",
      },
      darf: {
        inss: centavos(r.darf.inss),
        irrf: centavos(r.darf.irrf),
        total: centavos(r.darf.total),
        socios: r.darf.socios,
        comoSeCalcula: "sócio a sócio, e só depois somado",
      },
      vencimentos: {
        das: { data: r.vencimentos.das.data.toISOString().slice(0, 10), regra: "dia 20, PRORROGA para o próximo dia útil" },
        darf: { data: r.vencimentos.darf?.data?.toISOString().slice(0, 10) ?? null, regra: "dia 20, ANTECIPA para o dia útil anterior" },
        esocial: { data: r.vencimentos.esocial?.data?.toISOString().slice(0, 10) ?? null, regra: "dia 15, ANTECIPA" },
        avisoDeFuso: "🔴 as datas são UTC à meia-noite. Formatar com toString() local mostra o DIA ANTERIOR e o cliente lê um prazo a menos.",
      },
    },

    decisaoDoProduto: r.piloto?.atua
      ? {
          oPilotoAtua: true,
          modo: r.piloto.modo,
          minimoLegal: { ...centavos(r.piloto.minimoLegal), oQueE: "o que a lei exige para não perder o Anexo III (28%)" },
          sugerido: { ...centavos(r.piloto.sugerido), oQueE: "o que o produto paga sozinho — margem de 30%, decisão nossa (UX-39), não da lei" },
          economiaNoDas: centavos(r.piloto.economia.economiaNoDas),
          custoExtraNaGuia: centavos(r.piloto.economia.custoExtra),
          saldoNoBolsoDoCliente: centavos(r.piloto.economia.saldo),
          vale: r.piloto.economia.vale,
        }
      : { oPilotoAtua: false, motivo: r.piloto?.motivoDoSilencio ?? null },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · FRONT · O MESMO CASO, MAS O QUE A TELA MOSTRA
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Nenhum cálculo aqui. Só leitura do que o back já resolveu, com o texto
 * que o cliente vê — e a decisão de o que NÃO mostrar, que é metade do
 * trabalho de tela.
 */
function fixtureDeTela(idVida, mes) {
  const v = VIDAS.find((x) => x.id === idVida);
  const r = retratoDoMes({ empresa: v.empresa, competencias: v.competencias, mesAlvo: mes });
  const brl = (c) => "R$ " + (c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  const perdeuOBeneficio = r.anexo === "V" && !v.empresa.grupoAnexo.includes("fixo");

  return {
    caso: `${idVida}-${mes}`,
    ondeBuscarONumero: "entrega/back/casos.json, no caso de mesmo id",

    cartaoDoMes: {
      titulo: "Imposto de junho",
      valor: brl(r.das.total),
      vence: r.vencimentos.das.data.toISOString().slice(0, 10),
      estado: r.atraso && !r.atraso.emDia ? "em atraso" : "a pagar",
    },

    aliquota: {
      mostrar: brl(r.das.total) + " sobre " + brl(r.receita),
      efetiva: (r.das.efetiva * 100).toFixed(2).replace(".", ",") + "%",
      // 🔒 Vocabulário travado em 16/09: a empresa não "cai" para o Anexo V.
      comoDizer: perdeuOBeneficio
        ? "Este mês sua empresa perdeu o benefício do Anexo III, e a alíquota subiu."
        : "Sua empresa está no Anexo III, a alíquota menor.",
      naoDizer: [
        "❌ 'sua empresa caiu para o Anexo V' — verbo de movimento, revogado em 16/09",
        "❌ 'Fator R' sem explicar — jargão; a tela fala em folha e faturamento",
      ],
    },

    proLabore: r.divergencia?.abaixoDoMinimoLegal
      ? {
          mostrarAviso: true,
          tom: "informar, nunca culpar",
          texto:
            `Você retirou ${brl(r.divergencia.pago)} este mês. Para manter a alíquota menor, ` +
            `o valor precisaria ser ${brl(r.divergencia.sugerido)}.`,
          acaoPrimaria: "Ajustar para " + brl(r.divergencia.sugerido),
          acaoSecundaria: "Manter como está",
          aoManter:
            "🔑 mostrar o custo PONTUAL e o de MANTER lado a lado. Só o pior caso assusta " +
            "com o que não vai acontecer — foi o M-008, e o Pedro pegou lendo a saída.",
        }
      : { mostrarAviso: false },

    oQueNaoMostrar: [
      "o déficit acumulado como valor a pagar — é BASE de pró-labore, não desembolso (correção do contador, 16/09)",
      "o `paraVirarJa` fundido com o `sugerido` — são dois números e a tela nunca os soma (M-004)",
      "qualquer coisa sobre retenção de ISS — decisão de produto: não aparece para o cliente (E-ISS)",
    ],

    avisosDeFormatacao: [
      "🔴 datas vêm em UTC à meia-noite: formatar com toString() local mostra o dia anterior",
      "🔴 valores do back vêm em CENTAVOS: dividir por 100 antes de exibir, nunca antes de comparar",
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 5 · ESCREVER
 * ═══════════════════════════════════════════════════════════════════════════ */

const destino = (p) => resolve(AQUI, p);
mkdirSync(destino("back"), { recursive: true });
mkdirSync(destino("front"), { recursive: true });

const cabecalho = {
  gerado: new Date().toISOString().slice(0, 10),
  gerador: "execucao/entrega/gerar-entrega.mjs",
  aviso: "ARQUIVO GERADO. Não editar à mão — a fonte é o motor, e ele é conferido por 14 suítes.",
  amostra: AMOSTRA,
  convencaoDeUnidade:
    "Todo valor monetário vem como { valor, unidade, legivel }. Compare por `valor`, " +
    "exiba por `legivel`, e nunca some campos de unidades diferentes.",
};

if (AMOSTRA) {
  writeFileSync(
    destino("back/AMOSTRA-funcao.json"),
    JSON.stringify({ ...cabecalho, fixture: fixtureDeFuncao() }, null, 2) + "\n",
    "utf8"
  );
  writeFileSync(
    destino("back/AMOSTRA-caso.json"),
    JSON.stringify({ ...cabecalho, fixture: fixtureDeCompetencia("P01", "2026-06") }, null, 2) + "\n",
    "utf8"
  );
  writeFileSync(
    destino("front/AMOSTRA-tela.json"),
    JSON.stringify({ ...cabecalho, fixture: fixtureDeTela("P01", "2026-06") }, null, 2) + "\n",
    "utf8"
  );

  console.log("\n📦 AMOSTRA gerada — 1 função · 1 competência · 1 tela\n");
  console.log("   entrega/back/AMOSTRA-funcao.json   darfDoProLabore");
  console.log("   entrega/back/AMOSTRA-caso.json     P01-2026-06 (o mês em que perde o Anexo III)");
  console.log("   entrega/front/AMOSTRA-tela.json    o mesmo caso, do lado da tela\n");
  console.log("   🔑 O elo entre os dois pacotes é o campo `caso`.\n");
  process.exit(0);
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 6 · A ENTREGA COMPLETA
 * ═══════════════════════════════════════════════════════════════════════════ */

const casos = [];
const telas = [];

for (const v of VIDAS) {
  for (const cp of v.competencias) {
    casos.push(fixtureDeCompetencia(v.id, cp.mes));
    telas.push(fixtureDeTela(v.id, cp.mes));
  }
}

const funcoes = fixturesDeFuncoes();

writeFileSync(
  destino("back/funcoes.json"),
  JSON.stringify({ ...cabecalho, funcoes }, null, 2) + "\n",
  "utf8"
);
writeFileSync(
  destino("back/casos.json"),
  JSON.stringify({ ...cabecalho, total: casos.length, casos }, null, 2) + "\n",
  "utf8"
);
writeFileSync(
  destino("front/telas.json"),
  JSON.stringify({ ...cabecalho, total: telas.length, telas }, null, 2) + "\n",
  "utf8"
);

/* ── O CONGELADO ───────────────────────────────────────────────────────────
 * 🔒 Varrido automaticamente dos três pacotes. É a rede da migração para
 * centavos: se a refatoração for pura, este arquivo não muda **nenhuma linha**.
 */
const legiveis = {};
congelar({ funcoes }, "funcoes", legiveis);
casos.forEach((c) => congelar(c, `caso.${c.caso}`, legiveis));
telas.forEach((t) => congelar(t, `tela.${t.caso}`, legiveis));

console.log("\n📦 ENTREGA GERADA\n");
console.log(`   back/funcoes.json    ${funcoes.length} funções · ${funcoes.reduce((s, f) => s + f.casos.length, 0)} casos de fronteira`);
console.log(`   back/casos.json      ${casos.length} competências, entrada → esperado`);
console.log(`   front/telas.json     ${telas.length} telas, o mesmo caso do outro lado`);

/* ═══════════════════════════════════════════════════════════════════════════
 * 7 · O CONGELADO — escrito UMA VEZ, e depois só conferido
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 A ARMADILHA QUE ISTO EVITA, e ela quase entrou em 17/09.
 *
 * A 1ª versão **reescrevia** o congelado a cada rodada. Como o gerador ia
 * entrar na pipeline, a migração para centavos teria regerado o arquivo com
 * os valores NOVOS — e o diff daria zero por construção, afirmando que nada
 * mudou justamente enquanto tudo mudava.
 *
 * 🔑 Rede que se ajusta ao que ela deveria pegar não é rede. Por isso o
 * arquivo é escrito **uma vez** e depois **comparado**; regravar exige
 * `--recongelar`, que é um ato deliberado e datado.
 */
const CAMINHO_CONGELADO = destino("_CONGELADO-legiveis.json");
const RECONGELAR = process.argv.includes("--recongelar");

const conteudoCongelado = {
  congeladoEm: cabecalho.gerado,
  porQueExiste:
    "Rede da migração para centavos (decisão do Pedro, 17/09). Cada linha é um " +
    "valor monetário em forma LEGÍVEL, que é independente de unidade. Se a " +
    "refatoração for pura, este arquivo não muda nenhuma linha. " +
    "🔴 NÃO editar à mão para fazer caber — o valor dele é justamente ser anterior.",
  unidadesNoMomentoDoCongelamento:
    "MISTURADAS de propósito — é o estado que a migração vai arrumar. " +
    "das/darf em centavos, piloto/fatorR/entradas em reais.",
  total: Object.keys(legiveis).length,
  legiveis,
};

if (!existsSync(CAMINHO_CONGELADO) || RECONGELAR) {
  writeFileSync(CAMINHO_CONGELADO, JSON.stringify(conteudoCongelado, null, 2) + "\n", "utf8");
  console.log(`\n   🔒 _CONGELADO-legiveis.json   ${Object.keys(legiveis).length} valores congelados${RECONGELAR ? " (RECONGELADO)" : ""}`);
  console.log("      É a rede da migração para centavos. Depois dela, diff tem que dar ZERO.\n");
} else {
  const anterior = JSON.parse(readFileSync(CAMINHO_CONGELADO, "utf8")).legiveis;
  const mudaram = [];
  const sumiram = [];

  for (const [chave, valor] of Object.entries(anterior)) {
    if (!(chave in legiveis)) sumiram.push(chave);
    else if (legiveis[chave] !== valor) mudaram.push({ chave, de: valor, para: legiveis[chave] });
  }
  const novos = Object.keys(legiveis).filter((k) => !(k in anterior));

  console.log(`\n   🔒 Conferido contra o congelado de ${JSON.parse(readFileSync(CAMINHO_CONGELADO, "utf8")).congeladoEm}`);

  if (!mudaram.length && !sumiram.length) {
    console.log(`      ✅ ${Object.keys(anterior).length} valores conferem${novos.length ? ` · ${novos.length} campo(s) NOVO(S), o que é esperado se a entrega cresceu` : ""}\n`);
  } else {
    console.log(`\n   🔴 ${mudaram.length} valor(es) MUDARAM e ${sumiram.length} sumiram:\n`);
    for (const m of mudaram.slice(0, 25)) {
      console.log(`      ${m.chave}`);
      console.log(`         era ${m.de}  →  agora ${m.para}`);
    }
    if (mudaram.length > 25) console.log(`      … e mais ${mudaram.length - 25}`);
    for (const s of sumiram.slice(0, 10)) console.log(`      ⬜ sumiu: ${s}`);
    console.log(
      "\n      ↳ Se isto foi a migração de unidades, ela NÃO foi pura: nenhum valor\n" +
        "        deveria ter mudado. Se a mudança é legítima e você conferiu um a um,\n" +
        "        rode com --recongelar para assumir o novo estado.\n"
    );
    process.exit(1);
  }
}
