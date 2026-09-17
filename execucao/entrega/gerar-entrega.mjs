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

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { VIDAS } from "../estado-cnpj/vidas.mjs";
import { retratoDoMes } from "../estado-cnpj/_modelo.mjs";
import { darfDoProLabore } from "../motor-fiscal/apurador.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const AMOSTRA = process.argv.includes("--amostra");

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · DINHEIRO COM UNIDADE COLADA
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Todo valor monetário da entrega sai neste formato. O `bruto` é o que o
 * dev compara no teste; o `legivel` é o que ele confere com o olho; a
 * `unidade` é o que o impede de somar centavo com real.
 */
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
 * 2 · BACK · UMA FUNÇÃO
 * ═══════════════════════════════════════════════════════════════════════════
 * O caso é escolhido para a unidade ficar ÓBVIA: 5400 entra, 59400 sai. Quem
 * ler não precisa de legenda para concluir que a entrada é em reais e a saída
 * em centavos — e é exatamente a confusão que produziu o M-014.
 */
function fixtureDeFuncao() {
  const entrada = { proLabore: 5400, cltRemuneracao: 0 };
  const r = darfDoProLabore(entrada.proLabore, entrada.cltRemuneracao);

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
      proLabore: { ...reais(entrada.proLabore), oQueE: "o pró-labore bruto do mês, deste sócio" },
      cltRemuneracao: {
        ...reais(entrada.cltRemuneracao),
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
        cltDoSocio: reais(v.empresa.cltDoSocio),
      },
      competencia: {
        mes,
        receita: reais(cp.receita),
        proLaboreDeclarado: reais(cp.proLaboreDeclarado),
        proLaborePago: {
          ...reais(cp.proLaborePago),
          oQueE: "🔴 o Fator R é REGIME DE CAIXA: só o que foi PAGO entra no numerador (art. 26 §6º). Declarado e não pago infla o Fator R e a Receita glosa.",
        },
      },
      historico: "as competências anteriores desta persona, no mesmo formato",
    },

    esperado: {
      mesDeAtividade: r.mesDeAtividade,
      rbt12: { ...centavos(r.rbt12), regra: r.regraRbt12, oQueE: "acumulado dos 12 meses ANTERIORES; o mês corrente não entra (Res. CGSN 140/2018 art. 24)" },
      anexo: r.anexo,
      fatorR: {
        razao: pct(r.fatorR.fr),
        limiar: pct(0.28),
        decideOAnexo: !v.empresa.grupoAnexo.includes("fixo"),
        folhaPaga: reais(r.fatorR.folhaPaga),
        receita12: reais(r.fatorR.receita12),
        // ⚠️ unidade DIFERENTE da do rbt12 logo acima, no mesmo objeto.
        avisoDeUnidade: "🔴 folhaPaga e receita12 vêm em REAIS; rbt12 e das vêm em CENTAVOS. É assim no motor hoje, e é por isso que esta entrega carimba a unidade em todo número.",
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
          minimoLegal: { ...reais(r.piloto.minimoLegal), oQueE: "o que a lei exige para não perder o Anexo III (28%)" },
          sugerido: { ...reais(r.piloto.sugerido), oQueE: "o que o produto paga sozinho — margem de 30%, decisão nossa (UX-39), não da lei" },
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
            `Você retirou ${brl(r.divergencia.pago * 100)} este mês. Para manter a alíquota menor, ` +
            `o valor precisaria ser ${brl(r.divergencia.sugerido * 100)}.`,
          acaoPrimaria: "Ajustar para " + brl(r.divergencia.sugerido * 100),
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

console.log("\n⏳ A entrega completa ainda não foi ligada — rode com --amostra.\n");
console.log("   Falta decidir com o Pedro a FORMA antes de gerar as 162 competências.\n");
