/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏢 O ESTADO RECORRENTE DE UM CNPJ — a espinha que faltava.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu em 14/09. O motor fiscal existia e **ninguém o chamava com dado de
 * verdade**: `/pro-labore` rodava com `FAT = 6000` fixo no componente,
 * `/notas` tinha o próprio mock de 26 notas, e `/impostos` exibia STRINGS
 * ("R$ 178,31", "Faturou R$ 4.200"). Três telas, três faturamentos, nenhuma
 * lendo a outra — achado de 27/08 em `equacao-viva-camada-2-vars-cnpj.md`,
 * que ficou aberto por 18 dias.
 *
 * ── 🔴 O QUE ESTE ARQUIVO É, E O QUE NÃO É ─────────────────────────────────
 *
 * É a **definição de estado**: o que precisa ser guardado sobre uma empresa
 * para que qualquer tela calcule a mesma coisa. Não é banco, não é API, não é
 * tela. É o contrato entre eles.
 *
 * 🔑 **A regra que ele cria:** nenhuma tela guarda número fiscal próprio. Elas
 * pedem ao estado, o estado chama o motor, e o motor responde. Se duas telas
 * mostram números diferentes para a mesma empresa, é bug de uma delas — não é
 * "mock diferente".
 *
 * ── 📐 A FRONTEIRA ENTRE O QUE É GUARDADO E O QUE É DERIVADO ───────────────
 *
 * **GUARDADO** é o que alguém informou ou o órgão devolveu: a nota emitida, o
 * pró-labore declarado, a baixa do pagamento, a data de abertura no CNPJ.
 *
 * **DERIVADO** é tudo que sai de conta: RBT12, Fator R, anexo vigente, DAS do
 * mês, alíquota efetiva, vencimento. **Nada disso se guarda.** Guardar
 * derivado é como o produto passa a mentir quando a regra muda — e a regra
 * mudou duas vezes só em 14/09 (a CPP saiu do Fator R, o IRRF virou zero).
 *
 * ── ⚠️ O QUE ELE NÃO SABE, E POR DECISÃO ───────────────────────────────────
 *
 * Se o pró-labore foi **efetivamente pago** (regime de caixa do Fator R). Sem
 * conciliação bancária (decisão 31) e sem Open Finance (09/09), a única via é
 * o cliente declarar — e a Carta de Responsabilidade (CFC 1.590/2020 art. 3º)
 * carrega o peso. O campo existe e é separado do declarado, de propósito.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  apurarDAS,
  rbt12De,
  fatorRDeCompetencias,
  darfDoProLabore,
  vencimentoDe,
  anexoDoCnae,
  custoTotalMensal,
  emCentavos,
} from "../motor-fiscal/apurador.mjs";

import { pilotar } from "../motor-fiscal/piloto-pro-labore.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · O QUE SE GUARDA
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * A identidade da empresa. Muda raramente, e cada mudança é um evento.
 *
 * 🔑 `dataAberturaCnpj` é a que o motor lê — **não** a assinatura do contrato
 * nem o registro na Junta (Res. CGSN 140/2018 art. 2º V). As outras duas
 * existem e servem a outras coisas; ver itens 44/45/46 de PENDENCIAS.
 */
export function identidade({
  cnpj,
  razaoSocial,
  dataAberturaCnpj,
  cnaePrincipal,
  grupoAnexo,
  municipio = "BH",
  /**
   * 🔑 CLT do sócio por fora, se houver. O teto do INSS é da PESSOA: quem já
   * contribui como empregado só recolhe sobre a folga que sobra.
   *
   * ⚠️ Mora na IDENTIDADE e não na competência porque é assim que o app se
   * comporta hoje: o dado é captado **uma vez, no C2 da abertura, e nunca
   * revalidado** (achado de 27/08). Se o sócio trocar de emprego, nada pega.
   * Guardar aqui deixa o defeito visível em vez de escondê-lo num campo mensal
   * que ninguém preenche.
   */
  cltDoSocio = 0,
}) {
  return {
    cnpj,
    razaoSocial,
    dataAberturaCnpj,
    cnaePrincipal,
    grupoAnexo,
    municipio,
    cltDoSocio,
  };
}

/**
 * Uma competência. É a unidade do estado: um mês na vida da empresa.
 *
 * ⚠️ `proLaboreDeclarado` e `proLaborePago` são campos DIFERENTES de
 * propósito. Colapsar os dois num só é o erro que custa o Anexo V.
 */
export function competencia({
  mes, // "2026-08"
  receita = 0, // soma das notas emitidas (competência)
  receitaComIssRetido = 0,
  proLaboreDeclarado = 0,
  proLaborePago = 0,
  dasPago = null, // { valor, data } quando quitado
}) {
  return {
    mes,
    receita,
    receitaComIssRetido,
    proLaboreDeclarado,
    proLaborePago,
    dasPago,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · O QUE SE DERIVA — e é aqui que o motor entra
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔑 A FUNÇÃO QUE AS TRÊS TELAS CHAMAM.
 *
 * Dá o retrato fiscal completo de UMA competência, calculado a partir da série
 * inteira. `/impostos` usa o DAS, `/pro-labore` usa o Fator R e a folga,
 * `/notas` usa a receita — **os três do mesmo objeto**.
 *
 * @param mesAlvo competência a apurar, ex. "2026-08"
 */
export function retratoDoMes({ empresa, competencias, mesAlvo }) {
  const idx = competencias.findIndex((c) => c.mes === mesAlvo);
  if (idx < 0) throw new Error(`Competência ${mesAlvo} não existe na série.`);

  const atual = competencias[idx];
  const anteriores = competencias.slice(0, idx);

  // ── O anexo: 65 dos 87 CNAEs nem precisam de Fator R ────────────────────
  const grupo = anexoDoCnae(empresa.grupoAnexo);

  // ── O RBT12, pela regra dos meses de atividade ──────────────────────────
  const rbt = rbt12De({
    serieAnterior: anteriores.map((c) => c.receita),
    receitaMesCorrente: atual.receita,
  });

  // ── O Fator R, em regime de CAIXA ───────────────────────────────────────
  // A janela é de 12 meses ANTERIORES; quem tem menos, anualiza.
  const janela = anteriores.slice(-12);
  const fr = janela.length
    ? fatorRDeCompetencias({ competencias: janela })
    : null;

  // 🔴 O anexo vigente: fixo vence o cálculo. Não adianta o Fator R dizer V
  // se o CNAE é III-fixo — e não adianta a tela falar de Fator R pra ele.
  //
  // ⚠️ **O default quando o Fator R não computa NÃO pode ser "V por precaução".**
  // Cair no V dobra o imposto do cliente, e "na dúvida cobre mais" é o oposto
  // de cuidado. Quando a razão não existe (sem receita e sem folha nos meses
  // anteriores) não há receita para tributar de qualquer forma — então o anexo
  // fica `null` e o DAS sai zero, sem chute.
  const anexoPeloCalculo = fr?.anexo ?? null;
  const anexoVigente = grupo.calculaFatorR ? anexoPeloCalculo : grupo.anexo;
  const anexoIndeterminado = grupo.calculaFatorR && anexoPeloCalculo === null;

  // ── O DAS ───────────────────────────────────────────────────────────────
  // Sem receita, sem DAS — e sem precisar de anexo. É o único caso em que o
  // anexo indeterminado não machuca: não há o que tributar.
  const das =
    atual.receita > 0
      ? apurarDAS({
          receitaMes: atual.receita,
          rbt12: rbt.rbt12,
          anexo: anexoVigente,
          receitaComIssRetido: atual.receitaComIssRetido,
        })
      : apurarDAS({ receitaMes: 0, rbt12: 0, anexo: anexoVigente ?? "III" });

  // 🔴 Receita COM anexo indeterminado é contradição: significa que alguém
  // faturou sem histórico nenhum, e o motor não pode escolher sozinho entre
  // 6% e 15,5%. Grita em vez de chutar.
  if (atual.receita > 0 && anexoIndeterminado) {
    throw new Error(
      `Competência ${mesAlvo}: há receita (${atual.receita}) e o Fator R não pôde ser ` +
        `determinado. Sem histórico de folha nem de receita, o anexo não se decide — ` +
        `e chutar entre 6% e 15,5% erraria o dobro. Ver LACUNAS.`
    );
  }

  // ── O DARF do pró-labore ────────────────────────────────────────────────
  const darf =
    atual.proLaboreDeclarado > 0
      ? darfDoProLabore(atual.proLaboreDeclarado, empresa.cltDoSocio ?? 0)
      : null;

  // ── 🛩️ O PILOTO: o que deveria sair de pró-labore NESTE mês ─────────────
  //
  // 🔑 É a única parte do retrato que olha pra FRENTE. O resto apura o mês; o
  // piloto decide o pró-labore que vai governar as competências `m+1 … m+12`,
  // porque o Fator R lê os 12 meses anteriores (o retrovisor).
  //
  // Ele recebe a MESMA fonte que todo o resto do retrato — a série guardada —
  // e não guarda nada: a decisão é derivada, como o RBT12 e o anexo. Regra do
  // §"derivado não se guarda", que este arquivo criou em 14/09.
  //
  // ⚠️ Devolve `atua: false` sem drama nos 65 CNAEs `III-fixo`, nos meses sem
  // receita na janela e nos 7 `requer-revisao`. Silêncio é resultado legítimo.
  const piloto = pilotar({
    empresa,
    competenciasAnteriores: anteriores,
    receitaDoMes: atual.receita,
    rbt12DoMes: rbt.rbt12,
  });

  // 🔴 O confronto que só existe porque as duas pontas moram no mesmo objeto:
  // o que a pessoa DE FATO pagou contra o que o piloto teria mandado pagar.
  // É o que torna o fio auditável mês a mês em vez de confiável no escuro.
  const divergencia = piloto.atua
    ? {
        pago: atual.proLaborePago,
        sugerido: piloto.sugerido,
        diferenca: Math.round((piloto.sugerido - atual.proLaborePago) * 100) / 100,
        // Pagou menos do que a LEI exigia para segurar o III neste mês.
        abaixoDoMinimoLegal: atual.proLaborePago < piloto.minimoLegal,
      }
    : null;

  // ── Os vencimentos, cada um com a sua regra de deslocamento ─────────────
  const [ano, mes] = mesAlvo.split("-").map(Number);
  const venc = {
    das: vencimentoDe({ competencia: { ano, mes }, tributo: "das" }),
    darf: vencimentoDe({ competencia: { ano, mes }, tributo: "darf" }),
  };

  return {
    mes: mesAlvo,
    mesDeAtividade: idx + 1,
    receita: emCentavos(atual.receita),
    rbt12: emCentavos(rbt.rbt12),
    regraRbt12: rbt.regra,
    anexo: anexoVigente,
    anexoEhFixo: !grupo.calculaFatorR,
    anexoIndeterminado,
    fatorR: fr,
    das,
    darf,
    /** 🛩️ A decisão do piloto para ESTE mês. Derivada, nunca guardada. */
    piloto,
    /** O que foi pago × o que o piloto mandaria pagar. `null` se não atua. */
    divergencia,
    vencimentos: venc,
    custo:
      atual.receita > 0
        ? custoTotalMensal({
            receitaMes: atual.receita,
            das: das.total,
            proLabore: atual.proLaboreDeclarado,
          })
        : null,
  };
}

/**
 * A folga do Fator R, em reais — o número que o líder tem e esconde.
 *
 * 🔑 É o que a tela mostra no lugar do jargão: *"sua folha está em 37,7%; o
 * mínimo é 28%; você tem R$ 4.269 de folga"*. As palavras "Fator R", "Anexo
 * III" e "RBT12" **nunca** aparecem na interface (travado no
 * `_mapa-de-cruzamentos.md`).
 */
export function folgaDoFatorR({ empresa, competencias }) {
  const grupo = anexoDoCnae(empresa.grupoAnexo);
  if (!grupo.calculaFatorR) {
    return {
      aplicavel: false,
      motivo: "O anexo deste CNAE não depende da folha — falar de folga aqui confundiria.",
    };
  }

  const janela = competencias.slice(-12);
  const fr = fatorRDeCompetencias({ competencias: janela });
  if (!fr.fr) return { aplicavel: false, motivo: fr.motivo };

  const minimoParaAnexoIII = 0.28 * fr.receita12;
  const folga = fr.numerador - minimoParaAnexoIII;

  // 🔴 A FOLGA PRECISA VIRAR DINHEIRO DO MÊS, senão não serve pra nada.
  //
  // Quando a empresa tem menos de 13 meses, numerador e denominador estão
  // ANUALIZADOS (art. 26 §4º) — e uma folga anualizada é um número que o
  // cliente não consegue usar: ele não vai pagar R$5.692 a mais neste mês.
  // O que ele decide é quanto tirar POR MÊS, então é nisso que a folga é
  // expressa. Dividir por 12 desfaz a anualização, e é o mesmo caminho de
  // volta que a própria regra fez na ida.
  const porMes = fr.anualizado ? folga / 12 : folga / 12;

  return {
    aplicavel: true,
    percentualAtual: fr.fr,
    anualizado: fr.anualizado,
    /** A folga no mesmo plano do cálculo — anualizada quando < 13 meses. */
    folgaNoPlanoDoCalculo: emCentavos(folga),
    /** 🔑 O número que vai pra tela: quanto de pró-labore por mês sobra ou falta. */
    folga: emCentavos(porMes),
    temFolga: folga >= 0,
    falta: folga < 0 ? emCentavos(-porMes) : 0,
    anexo: fr.anexo,
    riscoDeGlosa: fr.riscoDeGlosa,
    competenciasEmRisco: fr.competenciasEmRisco,
  };
}

/**
 * O extrato do ano: uma linha por competência, tudo derivado.
 * É o que alimenta o gráfico de 12 meses do `/pro-labore`, o histórico do
 * `/impostos` e o agrupamento por mês do `/notas`.
 */
export function extrato({ empresa, competencias }) {
  return competencias.map((c) =>
    retratoDoMes({ empresa, competencias, mesAlvo: c.mes })
  );
}
