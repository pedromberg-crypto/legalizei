/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔁 REPLAY — a mesma vida, com e sem o piloto no comando.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 15/09: *"após fazer esse processo eu quero que você teste
 * com as personas e o resultado é você me trazer onde esse fio foi ativado e
 * executado no decorrer de toda a permanência e caso do determinado lead, pra
 * identificarmos se está entrando certo, acessando os dados certos e
 * devolvendo as respostas certas."*
 *
 * ── O QUE ELE FAZ ──────────────────────────────────────────────────────────
 *
 * Roda a série guardada duas vezes:
 *
 *   **REAL** — as competências como estão no `vidas.mjs`, com o pró-labore que
 *   a persona de fato pagou. É a vida sem contador que avise.
 *
 *   **PILOTADO** — mês a mês, substitui o pró-labore pago pelo que o piloto
 *   manda pagar **naquele mês**, com o histórico já pilotado atrás. Não é
 *   "recalcular com o valor certo no fim": é decidir com a informação que
 *   existia na hora, que é o que o app teria.
 *
 * 🔴 **A diferença entre as duas é o produto.** Se der zero, o piloto não está
 * fazendo nada; se der muito, ele está mexendo onde não devia. Os dois casos
 * são defeito, e só o replay mostra.
 *
 * ⚠️ NÃO MEXE EM TELA. É camada de motor/estado, por decisão do Pedro no mesmo
 * pedido: *"não quero executar e nem mudar nada que mexa em TELA"*.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { retratoDoMes, competenciaEmCentavos } from "./_modelo.mjs";
import { emReais } from "../motor-fiscal/apurador.mjs";

/**
 * Revive a série inteira, com e sem piloto, e devolve o rastro mês a mês.
 *
 * @param empresa       a identidade (grupoAnexo, cltDoSocio…)
 * @param competencias  a série guardada, mais antiga primeiro
 */
export function replayComPiloto({ empresa, competencias }) {
  const linhas = [];

  // A série pilotada vai sendo construída mês a mês — e é isso que faz a
  // decisão de cada mês enxergar só o passado, nunca o futuro.
  const pilotada = [];

  for (let i = 0; i < competencias.length; i++) {
    const real = competencias[i];

    // ── A vida REAL: retrato com a série original até aqui ────────────────
    const retratoReal = retratoSeguro({
      empresa,
      competencias: competencias.slice(0, i + 1),
      mesAlvo: real.mes,
    });

    // ── A vida PILOTADA ───────────────────────────────────────────────────
    // 🔑 O piloto decide com o histórico JÁ PILOTADO atrás e a receita deste
    // mês — exatamente o que o app teria na mão no dia do fechamento.
    const provisoria = [...pilotada, competenciaEmCentavos({ ...real })];
    const sonda = retratoSeguro({
      empresa,
      competencias: provisoria,
      mesAlvo: real.mes,
    });

    const decisao = sonda?.piloto ?? { atua: false, motivo: "retrato-indisponivel" };
    const proLaborePilotado = decisao.atua ? decisao.sugerido : real.proLaborePago;

    // Agora o mês entra na série pilotada com o valor que o piloto mandou.
    pilotada.push(
      competenciaEmCentavos({
        ...real,
        proLaboreDeclarado: proLaborePilotado,
        proLaborePago: proLaborePilotado,
      })
    );

    const retratoPilotado = retratoSeguro({
      empresa,
      competencias: [...pilotada],
      mesAlvo: real.mes,
    });

    linhas.push({
      mes: real.mes,
      mesDeAtividade: i + 1,
      receita: real.receita,

      // ── O FIO: ativou ou não, e por quê ─────────────────────────────────
      ativou: decisao.atua === true,
      motivoDoSilencio: decisao.atua ? null : decisao.motivo,
      modo: decisao.modo ?? null,

      // ── O que entrou na conta (a auditoria do "acessou os dados certos") ─
      entrada: decisao.atua
        ? {
            mesesNaJanela: decisao.janela.mesesNaJanela,
            anualiza: decisao.janela.anualiza,
            receitaDaJanela: decisao.janela.receitaDaJanela,
            folhaJaPagaNaJanela: decisao.janela.folgaJaPaga,
          }
        : null,

      // ── O que saiu ──────────────────────────────────────────────────────
      minimoLegal: decisao.atua ? decisao.minimoLegal : null,
      sugerido: decisao.atua ? decisao.sugerido : null,
      paraVirarJa: decisao.atua ? decisao.paraVirarJa : null,
      alerta: decisao.atua ? decisao.alerta : null,

      // ── As duas vidas, lado a lado ──────────────────────────────────────
      real: retratoReal
        ? {
            proLabore: real.proLaborePago,
            fatorR: retratoReal.fatorR?.fr ?? null,
            anexo: retratoReal.anexo,
            das: retratoReal.das.total,
            darf: retratoReal.darf ? retratoReal.darf.inss + retratoReal.darf.irrf : 0,
          }
        : null,
      pilotado: retratoPilotado
        ? {
            proLabore: proLaborePilotado,
            fatorR: retratoPilotado.fatorR?.fr ?? null,
            anexo: retratoPilotado.anexo,
            das: retratoPilotado.das.total,
            darf: retratoPilotado.darf
              ? retratoPilotado.darf.inss + retratoPilotado.darf.irrf
              : 0,
          }
        : null,
    });
  }

  return { linhas, resumo: resumir(linhas) };
}

/**
 * O retrato pode LANÇAR de propósito quando há receita e o anexo não se decide
 * (`anexoIndeterminado`) — é o grito que substituiu o chute de 14/09. No
 * replay isso é informação, não crash: a linha fica sem retrato e o rastro
 * mostra onde aconteceu.
 */
function retratoSeguro(args) {
  try {
    return retratoDoMes(args);
  } catch {
    return null;
  }
}

function resumir(linhas) {
  const comFio = linhas.filter((l) => l.ativou);
  const somaReal = (campo) =>
    linhas.reduce((s, l) => s + (l.real?.[campo] ?? 0), 0);
  const somaPilotado = (campo) =>
    linhas.reduce((s, l) => s + (l.pilotado?.[campo] ?? 0), 0);

  const dasReal = somaReal("das");
  const dasPilotado = somaPilotado("das");
  const darfReal = somaReal("darf");
  const darfPilotado = somaPilotado("darf");

  return {
    competencias: linhas.length,
    fioAtivou: comFio.length,
    fioSilenciou: linhas.length - comFio.length,
    motivosDoSilencio: [
      ...new Set(linhas.filter((l) => !l.ativou).map((l) => l.motivoDoSilencio)),
    ],
    mesesEmV: {
      real: linhas.filter((l) => l.real?.anexo === "V").length,
      pilotado: linhas.filter((l) => l.pilotado?.anexo === "V").length,
    },
    dasReal,
    dasPilotado,
    darfReal,
    darfPilotado,
    /** 🔑 O saldo do cliente: o que economizou no DAS menos o que pagou a mais
     *  de INSS/IRRF por ter subido o pró-labore. Em centavos. */
    saldo: dasReal - dasPilotado - (darfPilotado - darfReal),
    /**
     * Quanto do pró-labore sugerido saiu do bolso a mais, no total.
     *
     * 🔴 O NOME CARREGA A UNIDADE, e carrega porque esta linha mordeu em 17/09.
     *
     * `l.*.proLabore` vem em **reais** (é o valor que a vida declara), enquanto
     * `das` e `darf` vêm em **centavos** (é o que o apurador devolve). O resumo
     * somava os três e devolvia os três juntos, sem dizer que um era diferente
     * — e o único consumidor compensava com um `* 100` na hora de imprimir.
     *
     * 🔑 Workaround no chamador não é conserto: é uma armadilha armada para o
     * próximo chamador, que não vai saber que precisa dela. Agora a conversão
     * acontece **uma vez, aqui**, e o campo declara em que unidade está — que
     * é exatamente a cura escrita na dívida **D5** (M-014, M-020, e este).
     */
    // 🔒 Desde 17/09 `l.*.proLabore` já chega em CENTAVOS: a conversão que
    //    existia aqui virou conversão dupla e saiu. O sufixo do nome fica —
    //    ele é a cura do M-027 e continua valendo.
    proLaboreRealCentavos: linhas.reduce((s, l) => s + (l.real?.proLabore ?? 0), 0),
    proLaborePilotadoCentavos: linhas.reduce((s, l) => s + (l.pilotado?.proLabore ?? 0), 0),
  };
}

/** Atalho de leitura para os relatórios. */
export const reais = (centavos) =>
  emReais(centavos).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
