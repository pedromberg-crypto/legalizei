/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🛩️ O PILOTO DO PRÓ-LABORE — o ajuste que acontece sem o cliente saber.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 15/09, e a frase é a especificação:
 *
 *   *"não é sobre avisar cedo ou tarde, é sobre também aplicar a regra de
 *   ajuste automático de pró-labore desde o início para os usuários, eles não
 *   precisam saber sobre isso… o meu mesmo a Contabilizei foi ajustando para
 *   manter tudo certo e para mim foi a melhor coisa, pois eu continuei me
 *   preocupando apenas em pagar as guias e emitir as minhas NF."*
 *
 * ── 🔴 O QUE ISTO É, E POR QUE NÃO É O APURADOR ────────────────────────────
 *
 * O `apurador.mjs` olha para TRÁS: dada a série, quanto se deve neste mês.
 * Este arquivo olha para FRENTE: dado o mês que está correndo, **quanto pagar
 * de pró-labore agora** para que a empresa siga no Anexo III depois.
 *
 * 🔑 **E ele tem que existir por causa do retrovisor.** O Fator R lê os 12
 * meses ANTERIORES (`_modelo.mjs`: `janela = anteriores.slice(-12)`), então o
 * pró-labore pago no mês `m` só produz efeito nas competências `m+1 … m+12`.
 * Consequência dura, medida na vida do P01 em 15/09: quem descobre o problema
 * e corrige em set/2026 **só volta ao Anexo III em ago/2027** — 11 meses
 * pagando 15,5% já com o pró-labore certo.
 *
 * Um alerta, por mais cedo que seja, chega tarde por construção. A única
 * intervenção que funciona é **pagar o valor certo desde o mês 1**. Por isso
 * piloto, e não painel.
 *
 * ── 🎯 EM QUEM ELE ENCOSTA ─────────────────────────────────────────────────
 *
 * Dos **87 CNAEs que atendemos**, só **15** são `fator-r-dinamico`. Os **65**
 * `III-fixo` já estão no Anexo III por decisão do governo e o Fator R não muda
 * nada neles — para esses o piloto devolve `atua: false`, e a tela **não pode
 * falar em 28%**, porque sugeriria um risco que não existe (`anexoDoCnae`).
 * Os **7** `requer-revisao` ele se recusa a pilotar.
 *
 * ── ⚖️ A ETIQUETA DE 3 VIAS, APLICADA À CONTABILIZEI ───────────────────────
 *
 * ⚖️ **Lei:** o limiar de 28% e a composição da folha são LC 123 art. 18 §5º-J
 * e Res. CGSN 140/2018 art. 26. Copiamos citando a lei, nunca o líder.
 *
 * 🏢 **Decisão deles:** *"atualizamos o seu pró-labore mensalmente"*. É boa, e
 * virou nossa por decisão do Pedro em 15/09 — mas é escolha, não obrigação.
 *
 * 🐛 **O que NÃO se copia:** a redação deles diz *"a soma do seu pró-labore
 * dos últimos 12 meses"*. A folha legal é mais larga (salário CLT, 13º, férias
 * + 1/3, FGTS) — ver `FATOR_R_NUMERADOR`. E a alíquota de 15,5% que eles citam
 * é só a **1ª faixa**: o P16 mostrou subindo até 16,75%.
 *
 * ── ⚠️ A TENSÃO COM A TRAVA DE PERSONA, RESOLVIDA ──────────────────────────
 *
 * A trava diz **INFORMAR, nunca TUTELAR**. Ajustar sozinho parece tutela e não
 * é: tutelar é reter decisão que é do cliente; isto é **executar o serviço que
 * ele contratou**. A fronteira que fica: o número é sempre explicável na tela
 * e o cliente pode sobrepor. O que não fazemos é **exigir que ele decida** pra
 * que a conta saia certa.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  FATOR_R,
  PREVIDENCIA,
  salarioMinimoDe,
} from "./_tabelas.mjs";

import {
  fatorRDeCompetencias,
  aliquotaEfetiva,
  darfDoProLabore,
  anexoDoCnae,
  emCentavos,
  emReais,
} from "./apurador.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · A CONTA — quanto pagar agora para não cair depois
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔑 A JANELA QUE IMPORTA NÃO É A DESTE MÊS, É A DO PRÓXIMO.
 *
 * Decidindo o pró-labore do mês `m`, a janela que ele influencia é a que vai
 * governar a competência `m+1`: os 12 meses terminando em `m`, inclusive.
 *
 * ── A álgebra, e por que ela vale para empresa nova também ─────────────────
 *
 * Precisamos de `FS12 ≥ alvo × RBT12`, onde
 *   `FS12  = folha paga nos meses anteriores da janela + X` (X = o que decidir)
 *   `RBT12 = receita da janela, incluindo a do mês corrente`
 *
 * Logo `X ≥ alvo × receitaDaJanela − folhaJáPagaNaJanela`.
 *
 * 🔑 **A anualização do art. 26 §4º não muda esta conta.** Empresa com menos
 * de 13 meses anualiza os DOIS lados (`média × 12`), e o mesmo `n` no
 * numerador e no denominador **cancela** — a razão é idêntica. Por isso há uma
 * fórmula só, e o teste G-P1 confere as duas pontas.
 *
 * 🔴 **A receita do mês corrente entra, e é isso que torna o piloto
 * preventivo:** a nota emitida hoje levanta o denominador das próximas 12
 * competências. Quem só olha o fechado sempre corrige tarde.
 *
 * @param competenciasAnteriores série fechada, em REAIS, mais antiga primeiro
 * @param receitaDoMes           receita já emitida no mês corrente, em REAIS
 * @param alvo                   fração desejada (default: o limiar legal)
 */
export function proLaboreParaManterNoIII({
  competenciasAnteriores = [],
  receitaDoMes = 0,
  alvo = FATOR_R.LIMIAR,
}) {
  // Os 11 fechados mais recentes + o mês corrente = a janela de 12 do m+1.
  const fechadosNaJanela = competenciasAnteriores.slice(-11);

  const receitaDaJanela =
    fechadosNaJanela.reduce((s, c) => s + (c.receita || 0), 0) + receitaDoMes;

  // 🔴 REGIME DE CAIXA: só o que foi PAGO conta (art. 26 §6º). Declarado e não
  // pago infla o Fator R e a Receita glosa — ver `fatorRDeCompetencias`.
  const folgaJaPaga = fechadosNaJanela.reduce(
    (s, c) => s + (c.proLaborePago || 0),
    0
  );

  const necessario = alvo * receitaDaJanela - folgaJaPaga;

  // Sem receita na janela, nada a defender: o Fator R de razão infinita já
  // entrega o Anexo III (`fatorR()`), e forçar pró-labore aqui é custo puro.
  const semReceita = receitaDaJanela <= 0;

  return {
    receitaDaJanela,
    folgaJaPaga,
    mesesNaJanela: fechadosNaJanela.length + 1,
    anualiza: fechadosNaJanela.length + 1 < 13,
    /** O piso matemático. Pode ser negativo (folga de sobra) ou zero. */
    necessarioCru: necessario,
    /** O que de fato precisa sair este mês para não cair no V. */
    minimo: semReceita ? 0 : Math.max(0, tetoCentavo(necessario)),
    semReceita,
  };
}

/**
 * Centavo pra CIMA: faltar 1 centavo derruba a empresa para o Anexo V.
 *
 * 🔴 O épsilon não é frescura. `0.28 × 216000` dá `60480.00000000001` em ponto
 * flutuante, e um `Math.ceil` cru transformava esse rastro num centavo real —
 * o mínimo saía R$42.649,01 quando o correto é R$42.649,00. Cobrava a mais, e
 * quebrava o teste de borda, que é justamente quem devia pegar isso.
 */
function tetoCentavo(v) {
  return Math.ceil(v * 100 - 1e-6) / 100;
}

/** Arredondamento normal, para os números que a tela só exibe. */
function arredonda(v) {
  return Math.round(v * 100) / 100;
}

/**
 * Real em português, para os textos de alerta.
 *
 * 🔑 Mora aqui e não no `apurador.mjs` de propósito: lá o `brlDeCentavos` come
 * CENTAVOS, e este come REAIS — que é a unidade em que o cliente digita. Foi a
 * colisão de unidades entre os dois motores (paga em 15/09) que ensinou a não
 * ter duas funções de mesmo nome com unidades diferentes.
 */
function brl(reais) {
  return reais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * 🔑 Até quantas vezes o sustentável ainda é "ajuste", e não "salto".
 *
 * 2× é escolha, não lei — e a régua veio de dois pontos medidos, não do olho:
 * a defasagem de crescimento da P16 pediu **1,22×** o sustentável, e o atraso
 * de um ano inteiro pediu **9,6×**. Qualquer corte entre os dois separa os
 * casos; 2× fica longe das duas pontas.
 *
 * ⚠️ Se aparecer caso real entre 2× e 9×, é aqui que se olha primeiro.
 */
const TETO_DO_AJUSTE = 2;

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · A DECISÃO — e ela não é "sempre segure no III"
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔴 MANTER NO ANEXO III NEM SEMPRE É MAIS BARATO, E O PILOTO TEM QUE SABER.
 *
 * Subir o pró-labore custa INSS (11% até o teto) e IRRF. Quando a folha já
 * está muito longe dos 28%, o custo de chegar lá pode passar o que se economiza
 * na diferença de alíquota. A Contabilizei promete *"o menor imposto"* e não
 * mostra essa conta em lugar nenhum.
 *
 * ⚠️ **O que esta função NÃO decide:** se o dinheiro que vira pró-labore
 * "custa" ou não depende de para onde ele iria — lucro distribuído, hoje
 * isento, muda com a Lei 15.270/2025. O que se compara aqui é só o **custo
 * tributário incremental** de subir a folha contra a economia no DAS. Decisão
 * de produto sobre a comparação completa: aberta, Pedro + Mauro.
 *
 * @param rbt12 o RBT12 da competência que será cobrada, em REAIS
 */
export function valeManterNoIII({
  receitaDoMes,
  rbt12,
  proLaborePiso,
  proLaboreNecessario,
  cltRemuneracao = 0,
}) {
  // 🔑 `aliquotaEfetiva` devolve NÚMERO (fração), não objeto.
  const efetivaIII = aliquotaEfetiva(rbt12, "III");
  const efetivaV = aliquotaEfetiva(rbt12, "V");

  // Fora do Simples não há o que comparar — nem deveria chegar aqui.
  if (efetivaIII === null || efetivaV === null) {
    return { fora: true, vale: false, economiaNoDas: 0, custoExtra: 0, saldo: 0 };
  }

  // A economia é no DAS do mês, pela diferença de alíquota efetiva.
  const economiaNoDas = emCentavos(receitaDoMes * (efetivaV - efetivaIII));

  const darfPiso = darfDoProLabore(proLaborePiso, cltRemuneracao);
  const darfAlvo = darfDoProLabore(proLaboreNecessario, cltRemuneracao);

  const custoExtra =
    darfAlvo.inss + darfAlvo.irrf - (darfPiso.inss + darfPiso.irrf);

  return {
    efetivaIII,
    efetivaV,
    economiaNoDas,
    custoExtra,
    saldo: economiaNoDas - custoExtra,
    vale: economiaNoDas > custoExtra,
    /**
     * 🔑 Acima do teto do INSS o incremento fica barato: só IRRF. É o que faz
     * a conta virar a favor em faturamento alto — e o que a tela deve explicar
     * quando o valor sugerido dá um salto.
     */
    acimaDoTetoInss: proLaboreNecessario > PREVIDENCIA.TETO_INSS - cltRemuneracao,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · O PILOTO — a função que o app chama todo mês
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * O que fazer com o pró-labore deste mês, decidido.
 *
 * Devolve `atua: false` sem drama quando não há o que pilotar — CNAE fixo,
 * mês sem receita, folha já folgada. Silêncio é resultado legítimo: o cliente
 * só deve ver mudança quando ela existe.
 *
 * @param empresa   `{ grupoAnexo, cltDoSocio }`
 * @param margem    fração-alvo; default 30% (UX-39), não os 28% da lei
 */
export function pilotar({
  empresa,
  competenciasAnteriores = [],
  receitaDoMes = 0,
  rbt12DoMes = 0,
  margem = FATOR_R.MARGEM,
  piso = PREVIDENCIA.SALARIO_MINIMO,
}) {
  const grupo = anexoDoCnae(empresa.grupoAnexo);

  // ── 65 de 87: nada a fazer, e a tela não pode falar de Fator R ───────────
  if (grupo.erro) {
    return { atua: false, motivo: "cnae-indefinido", erro: grupo.erro };
  }
  if (!grupo.calculaFatorR) {
    return {
      atua: false,
      motivo: "anexo-fixo",
      anexo: grupo.anexo,
      podeFalarDeFatorR: false,
      explicacao:
        "O CNAE é III-fixo: o Anexo III já está garantido pelo governo e o " +
        "Fator R não muda nada. Falar em 28% aqui mente por omissão.",
    };
  }

  // ── A conta, nos dois alvos: a lei e a nossa margem ─────────────────────
  const noLimiar = proLaboreParaManterNoIII({
    competenciasAnteriores,
    receitaDoMes,
    alvo: FATOR_R.LIMIAR,
  });
  const naMargem = proLaboreParaManterNoIII({
    competenciasAnteriores,
    receitaDoMes,
    alvo: margem,
  });

  if (noLimiar.semReceita) {
    return {
      atua: false,
      motivo: "sem-receita-na-janela",
      podeFalarDeFatorR: true,
      explicacao:
        "Sem receita na janela a razão é infinita e o Anexo III já está " +
        "garantido. Pagar pró-labore aqui é custo sem contrapartida fiscal.",
    };
  }

  const minimoLegal = Math.max(noLimiar.minimo, 0);
  const paraVirarJa = Math.max(naMargem.minimo, piso);

  /**
   * 🔴 MANUTENÇÃO NÃO É RECUPERAÇÃO — e confundir as duas produz absurdo.
   *
   * Descoberto pelo próprio teste, em 15/09: com 12 meses de folha no piso e
   * R$25 mil/mês de receita, a 1ª versão mandou pagar **R$72.169 num mês só**.
   * A conta estava certa e a recomendação, insana: ela tentava consertar um
   * ano de atraso numa competência.
   *
   * 🔑 **O sustentável tem forma fechada.** Em regime permanente — pagando
   * `alvo × receita` todo mês — a janela inteira fica exatamente no alvo, e o
   * mínimo do mês É `alvo × receita do mês`. Logo:
   *
   *   `déficit = mínimo da janela − sustentável`
   *
   * Déficit zero (ou negativo) = a empresa está no trilho, e o piloto só
   * mantém. Déficit positivo = veio atrás, e aí existem **dois números
   * diferentes**, que a tela não pode fundir num só:
   *
   *   · `sugerido`    — o que dá pra pagar todo mês sem estourar o caixa
   *   · `paraVirarJa` — o que viraria o anexo já na próxima competência
   *
   * ⚠️ Não é o robô que escolhe entre os dois quando o segundo é grande: é
   * dinheiro do sócio saindo de uma vez. O piloto propõe o sustentável e
   * mostra o outro com a data da virada ao lado.
   */
  const sustentavel = arredonda(margem * receitaDoMes);
  const deficit = arredonda(Math.max(0, paraVirarJa - sustentavel));

  /**
   * 🔴 TRÊS MODOS, E O DO MEIO NASCEU DO RASTRO DA P16 (15/09).
   *
   * A 1ª versão tinha só dois: déficit zero = manutenção, déficit qualquer =
   * recuperação. O rastro mostrou que isso **classifica errado a empresa que
   * está CRESCENDO**. O Vitor (P16) foi pilotado desde o mês 2, nunca atrasou
   * nada, e mesmo assim caiu em "recuperação" em jun e jul/2026 — porque com
   * receita subindo, pagar 30% do mês corrente **não segura** a razão dos 12
   * meses: os meses antigos, menores em valor absoluto, ainda estão na janela.
   *
   * 🔑 Não é atraso, é defasagem — e o preço de confundir apareceu: a razão
   * pilotada escorregou para **29,4%**. Sobrou margem (o limiar é 28%), mas
   * escorregou por classificação errada, não por decisão.
   *
   * O que separa de verdade é o **tamanho** do que falta, contra a receita do
   * mês. Crescimento pede um pouco mais e cabe no mês. Atraso de um ano pede
   * múltiplos do faturamento e não cabe em mês nenhum — foi o R$72.169 que o
   * teste pegou.
   */
  let modo;
  let sugerido;
  if (deficit <= 0.01) {
    modo = "manutencao";
    sugerido = paraVirarJa;
  } else if (paraVirarJa <= sustentavel * TETO_DO_AJUSTE) {
    // Defasagem de crescimento: paga o que fecha a conta, e fecha de verdade.
    modo = "ajuste-de-crescimento";
    sugerido = paraVirarJa;
  } else {
    // Atraso real: o salto não cabe no mês, e não é o robô que decide dá-lo.
    modo = "recuperacao";
    sugerido = Math.max(sustentavel, piso);
  }

  const clt = empresa.cltDoSocio ?? 0;

  const economia = valeManterNoIII({
    receitaDoMes,
    rbt12: rbt12DoMes,
    proLaborePiso: piso,
    proLaboreNecessario: sugerido,
    cltRemuneracao: clt,
  });

  /**
   * 🔑 A CONTA DO SALTO é outra conta, e é a única que pode dar negativo.
   *
   * Varredura de 15/09 sobre a faixa inteira do ME (receita de R$5 mil a R$30
   * mil × RBT12 de R$50 mil a R$355 mil): pagar o **sustentável** compensa em
   * **100%** dos casos — o pior saldo foi +R$386,82/mês. É o que autoriza
   * pilotar no automático sem perguntar: dentro do nosso escopo, a resposta
   * nunca é "não".
   *
   * O **salto** da recuperação é que pode não valer: quitar o déficit de uma
   * vez custa INSS e IRRF sobre um valor grande, para economizar a diferença
   * de alíquota de **um** mês. É aí, e só aí, que alguém precisa olhar.
   */
  const economiaDoSalto =
    modo === "recuperacao"
      ? valeManterNoIII({
          receitaDoMes,
          rbt12: rbt12DoMes,
          proLaborePiso: sugerido,
          proLaboreNecessario: paraVirarJa,
          cltRemuneracao: clt,
        })
      : null;

  return {
    atua: true,
    podeFalarDeFatorR: true,
    /**
     * `manutencao` = já está no trilho, o piloto só segue pagando.
     * `recuperacao` = a janela carrega déficit do passado; virar já custaria
     * um valor que não se paga num mês.
     */
    modo,
    /**
     * O que a lei exige para manter o benefício: abaixo disto, a empresa
     * **perde o direito de ser tributada pelo Anexo III** e passa a pagar
     * pelo V.
     *
     * 🔑 A redação importa e foi corrigida em 16/09 pelo contador: a empresa
     * NÃO "cai para o Anexo V". Ela **é** do Anexo V — o CNAE não muda — e o
     * Fator R apenas lhe dá, ou tira, o **benefício** de pagar pela tabela do
     * III. *"O seu anexo é o 5, mas você recebe o benefício fiscal de ser
     * tributado na alíquota menor, conforme o Anexo 3."*
     */
    minimoLegal,
    /** O que o piloto manda pagar ESTE mês. */
    sugerido,
    /**
     * 🔴 O outro número, e só existe em `recuperacao` — no `ajuste-de-
     * crescimento` o sugerido JÁ é ele, e repetir criaria dois números iguais
     * na tela com nomes diferentes.
     */
    paraVirarJa: modo === "recuperacao" ? paraVirarJa : null,
    deficit,
    /** O que se pagaria em regime permanente — a régua do sustentável. */
    sustentavel,
    /** A gordura entre o sugerido e o piso legal do mês. */
    folgaDaMargem: arredonda(sugerido - minimoLegal),
    janela: noLimiar,
    economia,
    economiaDoSalto,
    /**
     * 🔴 O alerta NÃO é sobre o ajuste do mês — esse sempre compensa no nosso
     * escopo. É sobre o salto da recuperação, que é dinheiro grande saindo de
     * uma vez para comprar a virada de anexo um mês antes.
     */
    alerta:
      economiaDoSalto && !economiaDoSalto.vale
        ? "Quitar o déficit de uma vez custaria mais do que economiza. O " +
          "sustentável segue valendo; o salto é decisão do sócio, não do robô."
        : null,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · A DATA — porque o retrovisor tem prazo, e o cliente pergunta
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔑 QUANDO O ANEXO VIRA — em meses, não em promessa vaga.
 *
 * Nasce do achado do P01 (15/09): corrigir o pró-labore não devolve o Anexo
 * III no mês seguinte. A janela precisa rolar até que os meses ruins saiam
 * dela. Esta função projeta competência a competência, com o pró-labore
 * corrigido já valendo, e diz **em qual mês** a virada acontece.
 *
 * ⚠️ É PROJEÇÃO, e depende de a receita futura se comportar como a premissa.
 * A tela deve dizer "a partir de", nunca "em".
 *
 * @param receitaProjetada  receita mensal assumida daqui pra frente, em REAIS
 * @param proLaborePlanejado o que o piloto vai pagar por mês, em REAIS
 * @param horizonte         quantos meses projetar
 */
export function projetarVirada({
  competenciasAnteriores = [],
  receitaProjetada = 0,
  proLaborePlanejado = 0,
  horizonte = 24,
}) {
  const serie = competenciasAnteriores.map((c) => ({
    mes: c.mes,
    receita: c.receita || 0,
    proLaborePago: c.proLaborePago || 0,
    proLaboreDeclarado: c.proLaboreDeclarado || 0,
  }));

  const linha = [];
  let viraEm = null;

  for (let i = 1; i <= horizonte; i++) {
    // A competência i é governada pelos 12 meses anteriores a ela.
    const janela = serie.slice(-12);
    const fr = janela.length ? fatorRDeCompetencias({ competencias: janela }) : null;
    const anexo = fr?.anexo ?? null;

    // 🔑 O campo é `fr`, não `fatorR` — errei isso na 1ª escrita e o teste de
    // monotonia passou A VAZIO, porque `undefined` some no `.filter()`.
    linha.push({
      passo: i,
      anexo,
      fatorR: fr?.fr ?? null,
      folgaEmPontos:
        fr?.fr != null && Number.isFinite(fr.fr)
          ? (fr.fr - FATOR_R.LIMIAR) * 100
          : null,
    });

    if (anexo === "III" && viraEm === null) viraEm = i;

    // Agora o mês i acontece, com a receita e o pró-labore planejados.
    serie.push({
      mes: `+${i}`,
      receita: receitaProjetada,
      proLaborePago: proLaborePlanejado,
      proLaboreDeclarado: proLaborePlanejado,
    });
  }

  // 🔴 A MESMA PROJEÇÃO RESPONDE A DUAS PERGUNTAS OPOSTAS, e confundi-las
  // produz absurdo. Descoberto em 15/09, na simulação de edição do P01: o
  // alerta dizia *"esse valor derruba pro Anexo V"* e na linha seguinte
  // *"o Anexo III volta na 1ª competência"* — porque eu usei `viraEm`, que
  // pergunta "quando VOLTO ao III", numa tela que pergunta "quando CAIO".
  //
  //   · quem já está no V  → `viraEm` / `mesesAindaNoV`  (recuperação)
  //   · quem está no III   → `caiEm`  / `mesesEmV`       (consequência)
  const primeiroV = linha.findIndex((l) => l.anexo === "V");

  return {
    /** 1 = já na próxima competência. `null` = não vira dentro do horizonte. */
    viraEm,
    /**
     * 🔴 O número honesto da copy de recuperação: quantos meses ainda pagando
     * 15,5% DEPOIS de o pró-labore já estar certo. Zero quando nunca caiu.
     */
    mesesAindaNoV: viraEm === null ? horizonte : viraEm - 1,
    /** A partir de qual competência cai para o V. `null` = não cai. */
    caiEm: primeiroV < 0 ? null : primeiroV + 1,
    /** Quantas competências do horizonte ficariam no V. */
    mesesEmV: linha.filter((l) => l.anexo === "V").length,
    linha,
  };
}

/**
 * ↩️ E SE O CLIENTE MEXER SÓ UM MÊS E DEIXAR O PILOTO SEGUIR?
 *
 * 🔴 Nasceu de uma pergunta do Pedro em 15/09: *"parece que o usuário fica 'o
 * resto da vida' nesse anexo; o nosso recálculo mensal não faria ele voltar
 * para o III?"* Faria — e a simulação anterior escondia isso, porque projetava
 * o valor escolhido **fixo** por 24 meses.
 *
 * Medido na P01: editar um mês para o salário mínimo custa **1 competência**
 * no Anexo V, porque o piloto compensa no mês seguinte (paga R$9.179 em vez de
 * R$5.400) e a razão volta aos 30%. Manter o valor custa **10 de 18**.
 *
 * 🔑 São **duas consequências diferentes** para a mesma tecla, e a tela precisa
 * das duas. Só a segunda assusta; só a primeira é o que quase todo mundo faz.
 *
 * @param primeiroMesValor o que a pessoa escolheu para o mês corrente
 */
export function projetarComPiloto({
  empresa,
  competenciasAnteriores = [],
  receitaProjetada = 0,
  primeiroMesValor,
  horizonte = 24,
}) {
  const serie = competenciasAnteriores.map((c) => ({ ...c }));
  const linha = [];

  for (let i = 0; i < horizonte; i++) {
    const receita = receitaProjetada;

    // O anexo desta competência sai dos 12 meses ANTERIORES a ela.
    const janela = serie.slice(-12);
    const fr = janela.length ? fatorRDeCompetencias({ competencias: janela }) : null;
    linha.push({ passo: i + 1, anexo: fr?.anexo ?? "III", fatorR: fr?.fr ?? null });

    // Agora o mês acontece: no 1º vale a escolha da pessoa, nos demais o piloto.
    let pago;
    if (i === 0) {
      pago = primeiroMesValor;
    } else {
      const d = pilotar({
        empresa,
        competenciasAnteriores: [...serie],
        receitaDoMes: receita,
        rbt12DoMes: 0,
      });
      pago = d.atua ? d.sugerido : PREVIDENCIA.SALARIO_MINIMO;
    }

    serie.push({
      mes: `+${i}`,
      receita,
      proLaboreDeclarado: pago,
      proLaborePago: pago,
    });
  }

  const primeiroV = linha.findIndex((l) => l.anexo === "V");
  const depoisDoV = linha.findIndex((l, i) => primeiroV >= 0 && i > primeiroV && l.anexo === "III");

  return {
    caiEm: primeiroV < 0 ? null : primeiroV + 1,
    mesesEmV: linha.filter((l) => l.anexo === "V").length,
    voltaEm: depoisDoV > 0 ? depoisDoV + 1 : null,
    linha,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 5 · O VOLANTE — quando a pessoa decide o valor dela
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🎚️ O PILOTO É LIGÁVEL E DESLIGÁVEL, e o cliente pode digitar o próprio valor.
 *
 * Decisão do Pedro em 15/09: *"podemos e teremos a opção da pessoa escolher o
 * valor do pró-labore dela, como a líder também tem, mas caso essa pessoa vá
 * por esse caminho precisamos dar todos os alertas possíveis sobre essa
 * mudança, e esses alertas precisam ser personalizados para o caso específico
 * do usuário de acordo com o histórico que teremos dele."*
 *
 * 🔑 **O alerta genérico não serve.** *"Atenção: alterar o pró-labore pode
 * impactar seu enquadramento"* é ruído. O que esta função devolve é o caso
 * dele: qual competência vira, quando volta, quanto custa, com os números da
 * empresa dele.
 *
 * ⚠️ **INFORMA, NÃO BLOQUEIA** — a trava de persona vale aqui. A única
 * gravidade `impeditivo` é a que a LEI impede, não a que nos desagrada.
 *
 * @param escolhido  o valor que a pessoa digitou, em REAIS
 */
export function avaliarProLaboreEscolhido({
  empresa,
  competenciasAnteriores = [],
  receitaDoMes = 0,
  rbt12DoMes = 0,
  escolhido,
  horizonte = 24,
  /**
   * 📅 A competência (`AAAA-MM`) cujo piso vale. Sem ela, o piso é o do ano
   * corrente — que é o certo para o mês corrente e **errado para histórico**.
   */
  mes = null,
}) {
  const referencia = pilotar({
    empresa,
    competenciasAnteriores,
    receitaDoMes,
    rbt12DoMes,
  });

  const clt = empresa.cltDoSocio ?? 0;
  const alertas = [];

  // ── 1 · O piso legal do salário de contribuição ─────────────────────────
  // 🔴 A única trava dura aqui. Lei 8.212/91 art. 28 §3º: o salário de
  // contribuição não pode ser inferior ao salário mínimo, nem para o
  // contribuinte individual. É o que torna irregular o pró-labore de R$100
  // que a conta real da persona zero exibe em dez/2025.
  // 📅 O PISO É O DA COMPETÊNCIA, não o de hoje. Corrigido em 16/09: com uma
  // constante única, o pró-labore de R$1.518 pago em dez/2025 — que era
  // **exatamente o mínimo daquele mês** — seria bloqueado como irregular.
  // 5 das 16 vidas começam em 2025.
  const piso = mes ? salarioMinimoDe(mes) : { valor: PREVIDENCIA.SALARIO_MINIMO };

  if (escolhido > 0 && piso.valor !== null && escolhido < piso.valor) {
    alertas.push({
      gravidade: "impeditivo",
      codigo: "PISO_LEGAL",
      titulo: "Abaixo do mínimo que a lei permite",
      texto:
        `O salário de contribuição não pode ser menor que o salário mínimo ` +
        `(${brl(piso.valor)}), nem para sócio. ` +
        `Você digitou ${brl(escolhido)}.`,
      fonte: "Lei 8.212/1991 art. 28 §3º",
      // ✅ Deixou de ser fonte única: o valor de 2026 tem Decreto 12.797/2025 e
      //    a tabela do INSS, e o de 2025 foi confirmado pelo contador em 16/09.
      confianca: "🟢 piso com duas fontes por vigência",
      vigenciaDoPiso: piso.vigenciaDesde ?? "corrente",
      // ⏳ Vai junto quando a tabela venceu — some quando alguém atualiza.
      avisoDaTabela: piso.aviso ?? null,
    });
  }

  // ── 2 · PERDE o benefício do Anexo III? E QUANDO recupera? ──────────────
  if (referencia.atua && escolhido < referencia.minimoLegal) {
    const proj = projetarVirada({
      competenciasAnteriores,
      receitaProjetada: receitaDoMes,
      proLaborePlanejado: escolhido,
      horizonte,
    });

    const efetivaIII = aliquotaEfetiva(rbt12DoMes, "III");
    const efetivaV = aliquotaEfetiva(rbt12DoMes, "V");
    const porMes =
      efetivaIII != null && efetivaV != null
        ? emCentavos(receitaDoMes * (efetivaV - efetivaIII))
        : null;

    alertas.push({
      gravidade: "risco-alto",
      codigo: "CAI_PARA_ANEXO_V",
      titulo: "Esse valor derruba a empresa para o Anexo V",
      texto:
        `Para seguir no Anexo III você precisa pagar pelo menos ` +
        `${brl(referencia.minimoLegal)} este mês. Com ${brl(escolhido)}, a ` +
        `alíquota sai de ${(efetivaIII * 100).toFixed(2)}% para ` +
        `${(efetivaV * 100).toFixed(2)}%` +
        (porMes ? `, cerca de ${brl(porMes / 100)} a mais por mês` : "") +
        `.`,
      faltam: arredonda(referencia.minimoLegal - escolhido),
      custoMensalEstimado: porMes,
      horizonte,
      /**
       * 🔴 AS DUAS CONSEQUÊNCIAS DA MESMA TECLA — e a tela precisa das duas.
       *
       * `sePontual` é o que quase todo mundo faz: mexe um mês e deixa o piloto
       * seguir. `seMantiver` é o que a projeção antiga mostrava sozinha, e ela
       * assusta com um número que só vale se a pessoa desligar o automático
       * para sempre.
       */
      sePontual: (() => {
        const p = projetarComPiloto({
          empresa,
          competenciasAnteriores,
          receitaProjetada: receitaDoMes,
          primeiroMesValor: escolhido,
          horizonte,
        });
        return {
          caiEm: p.caiEm,
          mesesEmV: p.mesesEmV,
          voltaEm: p.voltaEm,
          custoEstimado: porMes ? porMes * p.mesesEmV : null,
        };
      })(),
      seMantiver: {
        caiEm: proj.caiEm,
        mesesEmV: proj.mesesEmV,
        custoEstimado: porMes ? porMes * proj.mesesEmV : null,
      },
      // Compatibilidade: a pergunta desta tela é "quando CAIO", não "quando volto".
      caiEm: proj.caiEm,
      mesesEmV: proj.mesesEmV,
      fonte: "LC 123/2006 art. 18 §5º-J · Res. CGSN 140/2018 art. 26",
    });
  }

  // ── 3 · Fica no III, mas come a margem de segurança ─────────────────────
  if (
    referencia.atua &&
    escolhido >= referencia.minimoLegal &&
    escolhido < referencia.sugerido
  ) {
    const folgaEmReais = arredonda(escolhido - referencia.minimoLegal);
    alertas.push({
      gravidade: "atencao",
      codigo: "SEM_MARGEM",
      titulo: "Fica no Anexo III, mas sem folga",
      texto:
        `Você segue no Anexo III, e a sobra até o limite é de apenas ` +
        `${brl(folgaEmReais)}. Uma nota fora da curva ainda este mês ` +
        `derruba o enquadramento, porque a receita do mês entra na conta. ` +
        `Nossa sugestão é ${brl(referencia.sugerido)}.`,
      folga: folgaEmReais,
    });
  }

  // ── 4 · O teto do INSS, e a folga do CLT ────────────────────────────────
  const folgaDoTeto = Math.max(0, PREVIDENCIA.TETO_INSS - clt);
  if (escolhido > folgaDoTeto) {
    alertas.push({
      gravidade: "informacao",
      codigo: "ACIMA_DO_TETO_INSS",
      titulo:
        clt > 0
          ? "Acima da folga que sobra do seu emprego CLT"
          : "Acima do teto do INSS",
      texto:
        clt > 0
          ? `Você já contribui sobre ${brl(clt)} no CLT, então só ` +
            `${brl(folgaDoTeto)} do pró-labore gera INSS. O que passar ` +
            `disso não aumenta sua contribuição, só o IRRF.`
          : `O INSS trava em ${brl(folgaDoTeto)} (teto de 2026). ` +
            `O que passar disso não aumenta sua aposentadoria, só o IRRF.`,
      fonte: "Portaria Interministerial MPS/MF 13/2026 art. 2º",
    });
  }

  // ── 5 · 🟡 Desproporcional: o risco que NÃO temos régua para medir ──────
  // Pró-labore no piso com faturamento alto é tratado pela jurisprudência
  // como possível distribuição disfarçada de lucro. ⚠️ A régua prática está
  // em aberto com o Mauro desde 13/09 — então o alerta EXISTE e se declara
  // sem número, em vez de inventar um limite.
  if (
    escolhido <= PREVIDENCIA.SALARIO_MINIMO &&
    receitaDoMes >= PREVIDENCIA.SALARIO_MINIMO * 10
  ) {
    alertas.push({
      gravidade: "atencao",
      codigo: "DESPROPORCIONAL",
      titulo: "Pró-labore no mínimo com faturamento alto",
      texto:
        `Sua empresa faturou ${brl(receitaDoMes)} este mês e o ` +
        `pró-labore ficaria no salário mínimo. Essa combinação é olhada pela ` +
        `fiscalização como possível distribuição de lucro disfarçada.`,
      confianca:
        "🟡 sem régua numérica ratificada — pergunta aberta com o Mauro desde 13/09",
    });
  }

  // ── 6 · O que muda no bolso, este mês ───────────────────────────────────
  const darfEscolhido = darfDoProLabore(Math.max(0, escolhido), clt);
  const darfSugerido = referencia.atua
    ? darfDoProLabore(referencia.sugerido, clt)
    : null;

  return {
    escolhido,
    aceito: !alertas.some((a) => a.gravidade === "impeditivo"),
    referencia: referencia.atua
      ? {
          minimoLegal: referencia.minimoLegal,
          sugerido: referencia.sugerido,
          modo: referencia.modo,
        }
      : { atua: false, motivo: referencia.motivo },
    alertas,
    custo: {
      inss: darfEscolhido.inss,
      irrf: darfEscolhido.irrf,
      total: darfEscolhido.inss + darfEscolhido.irrf,
      contraSugerido: darfSugerido
        ? darfEscolhido.inss +
          darfEscolhido.irrf -
          (darfSugerido.inss + darfSugerido.irrf)
        : null,
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 5b · A CONTA DE CONCENTRAR A FOLHA — nasceu em 16/09
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 💡 **Incluir outro sócio na folha sairia mais barato?**
 *
 * ── 🔴 POR QUE ESTA FUNÇÃO EXISTE ──────────────────────────────────────────
 *
 * O contador validou duas coisas no mesmo dia, e elas **colidem**:
 *
 *   1. *"O cara que efetivamente trabalha é obrigado a ser contribuinte. O que
 *      não trabalha não tem obrigatoriedade de gerar pró-labore."*
 *   2. *"Se eu dividir o pró-labore entre os dois, **eu não pago o excesso de
 *      imposto de renda** e continuo com o mesmo benefício."*
 *
 * A regra (1) manda concentrar a folha em quem administra. A aritmética (2)
 * diz que concentrar **pode custar IRRF que o rateio evitava**, porque a
 * tabela é progressiva por pessoa.
 *
 * 🔑 Medido na P04 em 16/09: folha de **R$5.600** custa **R$616,00** repartida
 * entre 2 e **R$844,86** concentrada em 1. Nos outros meses dela a diferença é
 * **zero**, porque abaixo de R$5.000 por pessoa o IRRF zera de qualquer jeito.
 * Ou seja: o problema **só aparece quando a concentração cruza a faixa**.
 *
 * ── ✅ A DECISÃO DO PEDRO (16/09), opção (c) ───────────────────────────────
 *
 * Aplicamos a regra **e mostramos a conta**. Não escolhemos pelo cliente e não
 * escondemos o número. Quem decide **quem trabalha** é ele; o que não pode é
 * ele descobrir depois que pagou imposto à toa.
 *
 * ⚠️ **Isto NÃO é sugestão de colocar laranja na folha.** A pergunta que a
 * tela faz é *"algum outro sócio também trabalha na empresa?"*, e só vale se a
 * resposta for verdade. O contador foi explícito sobre a tendência de sócio
 * de fachada, e **não é isso que estamos automatizando**.
 *
 * 🔒 O **Fator R não muda** em nenhum dos dois cenários: a folha total é a
 * mesma, e o Fator R usa a folha total.
 *
 * @param folhaTotal   o pró-labore total do mês, em reais
 * @param quemRecebe   quantos recebem hoje (os administradores)
 * @param socios       quantos sócios a empresa tem ao todo
 * @param cltDoSocio   CLT de UM sócio por fora, como o app capta hoje
 */
export function ganhoDeIncluirSocio({
  folhaTotal = 0,
  quemRecebe = 1,
  socios = 1,
  cltDoSocio = 0,
}) {
  const podeIncluir = Math.max(0, socios - quemRecebe);

  // Sem sócio de fora, ou sem folha, não há o que comparar.
  if (podeIncluir <= 0 || folhaTotal <= 0) {
    return { avaliou: false, motivo: podeIncluir <= 0 ? "todos-ja-recebem" : "sem-folha" };
  }

  // ⚠️ `darfDoProLabore` recebe REAIS e devolve CENTAVOS. A soma abaixo já
  // sai em centavos inteiros, então nada aqui pode passar por `emCentavos()`
  // de novo. Errar isto multiplica a guia por 100 sem quebrar nenhum teste.
  const guia = (n) => {
    const partes = Array.from({ length: n }, (_, i) =>
      darfDoProLabore(folhaTotal / n, i === 0 ? cltDoSocio : 0)
    );
    return {
      comQuantos: n,
      inss: partes.reduce((t, d) => t + d.inss, 0),
      irrf: partes.reduce((t, d) => t + d.irrf, 0),
      custo: partes.reduce((t, d) => t + d.inss + d.irrf, 0),
    };
  };

  const hoje = guia(quemRecebe);

  // 🔑 Varre TODOS os arranjos possíveis, não só "incluir mais um". Com 4
  // sócios e 1 administrador, incluir 2 pode ser melhor que incluir 1.
  let melhor = hoje;
  for (let n = quemRecebe + 1; n <= socios; n++) {
    const c = guia(n);
    if (c.custo < melhor.custo) melhor = c;
  }

  const economia = hoje.custo - melhor.custo;

  /**
   * 🔴 O LIMIAR É SEMÂNTICO, NÃO UM NÚMERO ESCOLHIDO A DEDO.
   *
   * A primeira versão disparava com `economia >= 1 centavo`, e a P14 mostrou
   * o estrago: **R$0,01 de "economia" em 9 meses seguidos**, que é puro
   * arredondamento de dividir R$4.863 por 2 em vez de por 3. Sugestão de
   * centavo numa tela fiscal não é ajuda, é ruído — e ruído ali destrói a
   * confiança que o resto do produto constrói.
   *
   * 🔑 A pergunta certa não é *"quanto economiza?"*, é **"o motivo existe?"**.
   * O motivo desta função é o IRRF: a tabela é progressiva por pessoa, então
   * concentrar pode criar imposto que o rateio evitava. Se o IRRF não cai, o
   * que sobra é diferença de arredondamento no INSS, e aí não há o que dizer
   * ao cliente.
   */
  const reduzIrrf = melhor.irrf < hoje.irrf;

  return {
    avaliou: true,
    quemRecebe,
    socios,
    custoHoje: hoje.custo,
    irrfHoje: hoje.irrf,
    /** Quantos precisariam receber para o custo ser o menor possível. */
    melhorArranjo: melhor.comQuantos,
    custoNoMelhor: melhor.custo,
    irrfNoMelhor: melhor.irrf,
    economiaMensal: economia,
    /** O que de fato move a conta. O resto é arredondamento de INSS. */
    irrfEvitado: hoje.irrf - melhor.irrf,
    /**
     * 🔑 Só é verdade quando o rateio **derruba IRRF**. Ver o bloco acima.
     */
    vale: reduzIrrf,
    /**
     * ⚠️ A pergunta que a tela pode fazer. Ela é sobre FATO, não sobre
     * conveniência fiscal, e a redação precisa deixar isso claro.
     */
    pergunta: reduzIrrf ? "algum outro sócio também trabalha na empresa?" : null,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 6 · O QUE ESTE ARQUIVO NÃO RESOLVE — declarado, não escondido
 * ═══════════════════════════════════════════════════════════════════════════ */

export const LIMITES_DO_PILOTO = [
  {
    id: "PP1",
    o_que: "Ele decide o valor; não sabe se o valor foi PAGO.",
    porque:
      "Regime de caixa (art. 26 §6º). Sem conciliação bancária (decisão 31) " +
      "nem Open Finance (09/09), a via é o cliente declarar. Piloto que assume " +
      "pagamento entrega Fator R inflado e a Receita glosa.",
    dono: "produto",
  },
  {
    id: "PP2",
    o_que: "A receita do mês corrente é a JÁ EMITIDA, não a esperada.",
    porque:
      "Nota emitida no dia 28 muda o mínimo do mês. Ou o piloto roda depois do " +
      "fechamento das notas, ou trabalha com margem — é o que a margem de 30% " +
      "(UX-39) compra.",
    dono: "produto",
  },
  {
    id: "PP3",
    o_que: "Não compara pró-labore contra distribuição de lucro.",
    porque:
      "A comparação completa depende do tratamento do lucro, que muda com a " +
      "Lei 15.270/2025 (IRRF antecipado). Aberto: Pedro + Mauro.",
    dono: "Mauro",
  },
  {
    id: "PP4",
    o_que: "Os 7 CNAEs `requer-revisao` não são pilotáveis.",
    porque:
      "Sem o grupo definido não há como dizer se o Fator R sequer se aplica. " +
      "São 7 de 87, e hoje o piloto se recusa em vez de chutar.",
    dono: "Larissa",
  },
  {
    id: "PP5",
    o_que: "Folha de colaborador não entra.",
    porque:
      "O numerador legal inclui salário CLT, 13º, férias + 1/3 e FGTS — e " +
      "nenhuma persona nossa tem funcionário. Quando a folha entrar no MVP, o " +
      "piloto precisa somar tudo, não só o pró-labore.",
    dono: "produto",
  },
];
