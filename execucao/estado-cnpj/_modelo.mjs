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
  darfDaFolha,
  guiaVencida,
  vencimentoDe,
  anexoDoCnae,
  custoTotalMensal,
} from "../motor-fiscal/apurador.mjs";

import {
  pilotar,
  ganhoDeIncluirSocio,
} from "../motor-fiscal/piloto-pro-labore.mjs";

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
  /**
   * 🔴 QUANTOS SÓCIOS RECEBEM PRÓ-LABORE. Nasceu em 15/09, quando a P02
   * revelou que o motor calculava a guia da folha somada como se fosse uma
   * pessoa só — errando R$84 para menos na P02 e R$2.077 para MAIS na P11.
   *
   * O teto do INSS é da pessoa e a tabela do IRRF é progressiva por
   * beneficiário, então a guia **tem** que ser calculada sócio a sócio e
   * somada depois (`darfDaFolha`).
   *
   * ⚠️ **Só entra quem ADMINISTRA.** Sócio que apenas aportou capital não é
   * segurado obrigatório e não recebe pró-labore (Lei 8.212/91 art. 12 V 'f').
   * O dado vem da qualificação 49 × 22 da constituição.
   *
   * ⚠️ **PREMISSA DECLARADA:** o rateio da folha entre os sócios é assumido
   * **igual**. É o que as vidas descrevem (a P11 tem 25% para cada), e é o que
   * o app coleta hoje. Rateio desigual existe na vida real e **ainda não tem
   * campo** — quando tiver, é aqui que entra.
   */
  /**
   * 🔄 QUEM RECEBE PRÓ-LABORE — REVISTO EM 16/09 PELO CONTADOR.
   *
   * ── ❌ A REGRA ANTERIOR, de 15/09, NÃO VALE MAIS ───────────────────────────
   *
   * Era *"todo sócio recebe, e a exceção é declarada"*. O Leonan derrubou:
   *
   *   > *"A lei do 212 fala que **o cara que trabalha, que efetivamente
   *   > trabalha**, ele é obrigado a ser contribuinte obrigatório do INSS. O
   *   > cara que não trabalha, às vezes ele é um sócio só de investimento — eu
   *   > só aporto e faço essa retirada de lucro —, **eu não tenho
   *   > obrigatoriedade de gerar um pró-labore**."*
   *
   * ── ✅ A REGRA NOVA ────────────────────────────────────────────────────────
   *
   * Recebe automaticamente **quem administra** (qualificação 49 do DBE). Sócio
   * cotista (22) nasce **sem** pró-labore, e passa a receber só se o cliente
   * declarar que ele trabalha.
   *
   * ⚠️ **E o contador avisou que o app nunca vai saber sozinho:** *"às vezes o
   * cara pode colocar que um é administrador, mas quem está trabalhando é o
   * outro"* — inclusive por motivo legítimo, como bloqueio judicial no nome de
   * quem administra. Por isso administrar é o **default**, não a verdade.
   *
   * 🔴 **O EFEITO QUE NINGUÉM ESPERAVA, medido em 16/09:** concentrar a folha
   * em menos gente **pode custar mais imposto**, porque a tabela do IRRF é
   * progressiva por pessoa. Na P04, com folha de R$5.600, dois sócios pagam
   * R$616,00 e um sócio sozinho paga **R$844,86**. Nos outros meses dela a
   * diferença é **zero**, porque abaixo de R$5.000 por pessoa o IRRF zera.
   *
   * 🔑 As duas coisas que o contador validou no mesmo dia **colidem aqui**:
   * *"paga quem trabalha"* e *"dividir meia a meia é o ótimo tributário"*.
   * Decisão do Pedro em 16/09, opção (c): **aplicamos a regra e o piloto
   * mostra a conta** — `ganhoDeIncluirSocio()` avisa quando incluir outro sócio
   * que de fato trabalhe sairia mais barato. Quem decide quem trabalha segue
   * sendo o cliente; nós não escondemos o número.
   *
   * ⚠️ **O Fator R NÃO muda com isto.** A folha total é a mesma, e o Fator R
   * usa a folha total. Era o risco que eu tinha levantado ao medir, e ele não
   * se confirmou.
   *
   * 🔑 **É doutrina de produto, e ela fecha uma pergunta que a lei deixa
   * aberta.** A Lei 8.212/91 art. 12 V "f" obriga pró-labore a quem **presta
   * serviço** — não a quem administra. A pesquisa de 15/09 confirmou com
   * confiança ALTA, e concluiu que o software deveria perguntar *"quem
   * efetivamente trabalha?"*. Só que numa ME de serviço com 1 a 4 sócios e
   * faturamento até R$360 mil, o sócio **só investidor é raro** — e o risco é
   * assimétrico: não pagar a quem trabalha é autuação previdenciária
   * (confiança ALTA); pagar a quem não trabalha é simulação (confiança BAIXA,
   * e depende de auditoria).
   *
   * Então o default é **todos recebem**, e a exceção é declarada. Não
   * perguntamos "quem trabalha?" como condição para funcionar: o produto
   * calcula e emite o pró-labore certo, e **isso é o pagamento do sócio**.
   *
   * ⚠️ **O que este número NÃO é:** não é "quantos sócios a empresa tem", é
   * quantos recebem. Com 2+ sócios a exceção vira uma pergunta — uma só, e não
   * um formulário. Com sócio único (8 das 17 vidas têm sócio único) ela nem
   * existe. 🔢 Este número era **7** até 17/09, e estava errado desde que foi
   * escrito — o `verificar-defasagem.mjs` agora o mede a cada rodada.
   *
   * 🔴 **E o rateio entre eles deixou de ser detalhe:** dividir IGUAL quando o
   * trabalho é desigual pode ser reclassificado como simulação (CARF
   * 2201-012.005 e 2101-003.144). A premissa de rateio igual que este campo
   * assume é conveniência de tela com consequência fiscal — item **71**.
   */
  sociosComProLabore = 1,
  /**
   * 🆕 QUANTOS SÓCIOS A EMPRESA TEM AO TODO — incluindo quem não recebe.
   *
   * 🔑 Existe por um motivo só: sem ele o motor **não enxerga** que há sócio
   * fora da folha, e não tem como avaliar se incluir alguém sairia mais barato.
   * `sociosComProLabore` responde *"quantos recebem"*; este responde *"de
   * quantos"*.
   *
   * Default igual a `sociosComProLabore`: quem não declarar, está dizendo que
   * todos os sócios administram — que é o caso de 6 das 8 vidas com 2+ sócios.
   *
   * ⚠️ `sociosTotal < sociosComProLabore` é dado inconsistente, e a trava de
   * vidas derruba a rodada.
   */
  sociosTotal = null,
  /**
   * 🔒 COLABORADORES — TRAVADO EM ZERO por decisão do Pedro em 15/09:
   * *"quero que todas as personas rodem liso sem terem colaboradores; depois
   * iremos acrescentar folha de colaboradores em algumas dessas personas, mas
   * quando desenharmos melhor a funcionalidade. Prefiro validar o fluxo sem
   * essa variável nesse momento."*
   *
   * 🔑 **Por que o campo existe mesmo travado em zero:** sem ele, "nenhuma
   * persona tem funcionário" seria uma ausência silenciosa — do tipo que o
   * `_cobertura-das-vidas.md` chama de código sem prova. Com ele, é uma
   * **declaração**, e o `verificar-vidas.mjs` derruba a rodada se alguém puser
   * um colaborador sem que a funcionalidade tenha sido desenhada.
   *
   * ⚠️ **O que muda quando destravar:** o numerador do Fator R passa a incluir
   * salário CLT, 13º, férias + 1/3 e FGTS (`FATOR_R_NUMERADOR`), e o piloto
   * deixa de estar certo — ele só sabe mexer no pró-labore, e com folha de
   * colaborador o Fator R sobe sem tocar nele. É o limite **PP5**.
   */
  colaboradores = 0,
}) {
  return {
    cnpj,
    razaoSocial,
    dataAberturaCnpj,
    cnaePrincipal,
    grupoAnexo,
    municipio,
    // 🔒 Mesma fronteira da `competencia()`: a autoria escreve reais, o motor
    //    só conhece centavos. Ver o bloco de unidade lá embaixo.
    cltDoSocio: Math.round(cltDoSocio * 100),
    sociosComProLabore,
    // Quem não declara está dizendo que todos os sócios administram.
    sociosTotal: sociosTotal ?? sociosComProLabore,
    colaboradores,
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
  /**
   * ═════════════════════════════════════════════════════════════════════════
   * 🔒 A FRONTEIRA DE ENTRADA — é aqui que reais viram centavos, e só aqui
   * ═════════════════════════════════════════════════════════════════════════
   * Regra travada em 17/09 (decisão do Pedro): **todo dinheiro que circula no
   * motor é inteiro em centavos**. Mas a AUTORIA das vidas escreve em reais,
   * e tem que continuar escrevendo: `ok(18000, 1621)` se confere de bater o
   * olho, `ok(1800000, 162100)` não.
   *
   * 🔑 Então existe exatamente **uma** porta de entrada, e é esta. Depois
   * dela, nenhum arquivo do motor conhece reais — a única outra exceção é a
   * leitura das tabelas da lei, que ficam em reais para serem conferíveis
   * contra o documento (ver `daTabela` no `apurador.mjs`).
   *
   * ⚠️ Fronteira declarada é o oposto do problema que isto resolve. O que
   * doía era a unidade mudar **no meio de um objeto**, sem aviso — `das.total`
   * em centavos e `piloto.minimoLegal` em reais. Duas portas nomeadas não são
   * a mesma coisa que dez conversões implícitas.
   */
  const emCentavosDaAutoria = (v) => Math.round(v * 100);

  return {
    mes,
    receita: emCentavosDaAutoria(receita),
    receitaComIssRetido: emCentavosDaAutoria(receitaComIssRetido),
    proLaboreDeclarado: emCentavosDaAutoria(proLaboreDeclarado),
    proLaborePago: emCentavosDaAutoria(proLaborePago),
    dasPago,
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔁 REEMBRULHAR UMA COMPETÊNCIA QUE JÁ ESTÁ EM CENTAVOS
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 A ARMADILHA QUE ISTO FECHA, e ela mordeu em 17/09, dentro da própria
 * migração.
 *
 * Pôr a conversão dentro da `competencia()` resolve a autoria e cria um
 * risco novo: **quem recebe uma competência pronta e a passa de volta pela
 * `competencia()` converte duas vezes**. Foi o que o `replay-piloto` fazia
 * ao montar a série pilotada — `competencia({ ...real })` —, e o saldo do
 * cliente da P01 saiu **−R$6.335.092,81** em vez de R$6.794,96.
 *
 * 🔑 Quem pegou foi a trava de defasagem, comparando com o número que estava
 * escrito no briefing do contador. Nenhuma suíte tinha reclamado.
 *
 * ✅ Então a porta de entrada tem duas: `competencia()` para quem escreve em
 * reais, e esta para quem já está por dentro. O nome diz de qual lado está.
 */
export function competenciaEmCentavos(cp) {
  return {
    mes: cp.mes,
    receita: cp.receita ?? 0,
    receitaComIssRetido: cp.receitaComIssRetido ?? 0,
    proLaboreDeclarado: cp.proLaboreDeclarado ?? 0,
    proLaborePago: cp.proLaborePago ?? 0,
    dasPago: cp.dasPago ?? null,
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
  // ── 🔄 REVISTO EM 16/09: A JANELA VAZIA DEIXOU DE SER INDETERMINADA ──────
  //
  // Até 15/09 este bloco dizia que o default NÃO podia ser "V por precaução",
  // porque cair no V dobra o imposto e "na dúvida cobre mais" é o oposto de
  // cuidado. **O argumento continua certo — e deixou de se aplicar**, porque a
  // janela vazia parou de ser dúvida.
  //
  // O contador fechou a regra em 16/09:
  //
  //   > *"Para reduzir de 15,5 para 6 naquele faturamento do mês 8, eu teria
  //   > que ter uma folha no mês 7. **O mês 7 a empresa não existia.** Então
  //   > ali ela vai ser tributada normal, nos 15,5. E a partir do mês seguinte
  //   > ele vai ser desbarrado."*
  //
  // 🔑 **Não é precaução, é a regra:** o Fator R lê a competência anterior, e
  // quem não tem competência anterior não tem como exibir folha. Sem folha na
  // janela, não há o que colocar no numerador — e o resultado é o Anexo V.
  //
  // ✅ Travado pelo Pedro em 16/09: *"o mês da constituição em si fica em
  // 15,5%. Não prometemos reverter."* Ver o marco dos três conflitos.
  //
  // ⚠️ **O que NÃO mudou, e não pode mudar:** razão INFINITA continua sendo
  // Anexo III. É o caso de quem pagou folha e não faturou — `fatorR()` devolve
  // `fr: Infinity`, não `null`, e foi o que salvou fev/2026 da persona zero.
  // A distinção mora em `fatorR()`, não aqui.
  const anexoPeloCalculo = fr?.anexo ?? null;

  // A janela não permite calcular: ou não há mês anterior nenhum, ou os que
  // há não têm receita nem folha.
  const semJanelaParaCalcular = grupo.calculaFatorR && anexoPeloCalculo === null;

  const anexoVigente = grupo.calculaFatorR
    ? anexoPeloCalculo ?? (atual.receita > 0 ? "V" : null)
    : grupo.anexo;

  // 🔑 Só é "indeterminado" quando não há receita para tributar. Com receita,
  // a regra decide, e o campo abaixo registra que foi por ausência de janela.
  const anexoIndeterminado = semJanelaParaCalcular && atual.receita <= 0;

  /**
   * 🆕 O mês em que a empresa faturou sem ter janela para o Fator R.
   *
   * 🔴 **É o caso que dispara o alerta interno** combinado em 16/09: constituir
   * e faturar no mesmo mês. O contador disse que é raro (*"dificilmente eu
   * pegaria um cara que faturava no mesmo mês"*) porque prestador de serviço
   * cumpre 30 dias de competência antes de emitir — mas quando acontece, a
   * casa precisa ligar, não deixar passar.
   */
  const faturouSemJanela = semJanelaParaCalcular && atual.receita > 0;

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

  // 🔒 O grito de 15/09 virou regra em 16/09. Este `throw` existia porque o
  // motor não podia escolher entre 6% e 15,5% sem informação; agora tem a
  // informação, e a escolha é do contador, não minha. O que sobrou aqui é a
  // contradição que continua sendo impossível: anexo nulo COM receita.
  if (atual.receita > 0 && anexoVigente === null) {
    throw new Error(
      `Competência ${mesAlvo}: há receita (${atual.receita}) e o anexo saiu nulo. ` +
        `Isso não deveria acontecer depois de 16/09 — janela vazia com receita ` +
        `resolve em Anexo V. Se chegou aqui, o grupo do CNAE está incoerente.`
    );
  }

  // ── O DARF do pró-labore ────────────────────────────────────────────────
  const darf =
    atual.proLaboreDeclarado > 0
      ? darfDaFolha({
          // 🔴 SÓCIO A SÓCIO, e só somado no fim. Achado da P02 em 15/09: a
          // guia calculada sobre a folha somada erra nos dois sentidos, porque
          // o teto do INSS é da pessoa e a tabela do IRRF é por beneficiário.
          //
          // ⚠️ Rateio IGUAL é premissa declarada (ver `sociosComProLabore`), e
          // o CLT é de UM sócio só — que é como o app capta hoje, no C2.
          socios: Array.from(
            { length: Math.max(1, empresa.sociosComProLabore ?? 1) },
            (_, i) => ({
              proLabore:
                atual.proLaboreDeclarado /
                Math.max(1, empresa.sociosComProLabore ?? 1),
              cltRemuneracao: i === 0 ? empresa.cltDoSocio ?? 0 : 0,
            })
          ),
        })
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

  /**
   * ⏰ A GUIA PAGA EM ATRASO, recalculada.
   *
   * Ligado em 15/09 a pedido do Pedro. O `guiaVencida()` existia desde 14/09 e
   * **nenhuma vida o fazia rodar** — todas pagavam em dia, que é justamente o
   * cenário que não dói.
   *
   * 🔴 E o caso real contradiz o elenco: a conta que analisamos tem **R$229,85
   * de multa em 3 competências seguidas**, com as duas guias atrasadas todas as
   * vezes (~13, ~21 e ~14 dias), todas *"Confirmado via Plataforma"*. Atraso
   * não é exceção: é o comportamento comum de quem não tem lembrete.
   *
   * O atraso se DERIVA — dias entre o vencimento e a data do pagamento. Nada
   * de campo "diasDeAtraso" guardado, pela mesma regra de sempre.
   *
   * ⚠️ `selicAcumulada` não é calculada aqui: a Selic é parâmetro externo
   * (Ato Declaratório mensal da RFB) e entra por quem chama. Sem ela, o juro
   * sai só com o 1% do mês do pagamento, e o retrato diz isso em `selicUsada`.
   */
  function atrasoDe(tributo, principal, venc) {
    const baixa = tributo === "das" ? atual.dasPago : null;
    if (!baixa || !baixa.data || principal <= 0) return null;

    const pago = new Date(`${baixa.data}T00:00:00Z`);
    const dias = Math.round((pago - venc.data) / 86400000);
    if (dias <= 0) return { emDia: true, diasDeAtraso: 0, data: baixa.data };

    const g = guiaVencida({
      principal,
      diasDeAtraso: dias,
      selicAcumulada: baixa.selicAcumulada ?? 0,
      // O 1% do mês do pagamento só entra se o pagamento saiu do mês do vencimento.
      mesmoMes:
        pago.getUTCFullYear() === venc.data.getUTCFullYear() &&
        pago.getUTCMonth() === venc.data.getUTCMonth(),
    });

    return {
      emDia: false,
      ...g,
      data: baixa.data,
      selicUsada: baixa.selicAcumulada ?? 0,
      // 🔑 O que a tela mostra: quanto o atraso custou, isolado do principal.
      custoDoAtraso: g.multa + g.juros,
    };
  }
  const venc = {
    das: vencimentoDe({ competencia: { ano, mes }, tributo: "das" }),
    darf: vencimentoDe({ competencia: { ano, mes }, tributo: "darf" }),
  };

  return {
    mes: mesAlvo,
    mesDeAtividade: idx + 1,
    receita: atual.receita,
    rbt12: rbt.rbt12,
    regraRbt12: rbt.regra,
    anexo: anexoVigente,
    anexoEhFixo: !grupo.calculaFatorR,
    anexoIndeterminado,
    /**
     * 🔴 Faturou no mês em que abriu, sem janela para o Fator R.
     *
     * 🔑 **Não é erro nem é do cliente: é consequência de não existir mês
     * anterior.** O mês sai no Anexo V, e o mês SEGUINTE já pode sair no III se
     * a folha desta competência for gerada no prazo (até o dia 15 do mês que
     * vem, sem retificação e sem multa).
     *
     * ⚠️ É por isso que o alerta tem que disparar na **emissão da nota**, não
     * no fechamento do mês: é a emissão que abre a janela de 15 dias para a
     * casa ligar e oferecer a folha da competência da constituição.
     */
    faturouSemJanela,
    fatorR: fr,
    das,
    darf,
    /**
     * ⏰ O atraso da guia, recalculado a partir da data da baixa.
     * `null` quando não há baixa registrada; `{emDia:true}` quando pagou em dia.
     */
    atraso: atrasoDe("das", das.total, venc.das),
    /** 🛩️ A decisão do piloto para ESTE mês. Derivada, nunca guardada. */
    piloto,
    /**
     * 💡 Incluir outro sócio na folha sairia mais barato NESTE mês?
     *
     * 🔑 Só tem conteúdo quando existe sócio fora da folha **e** a concentração
     * cruza a faixa do IRRF. Nos meses em que a folha por pessoa fica abaixo de
     * R$5.000, isto vem `vale: false` e a tela não mostra nada.
     *
     * ⚠️ A pergunta que ele habilita é sobre **fato** (*"algum outro sócio
     * também trabalha?"*), não sobre conveniência fiscal. Ver a decisão (c) do
     * Pedro em 16/09, no cabeçalho de `sociosComProLabore`.
     */
    concentracaoDaFolha: ganhoDeIncluirSocio({
      folhaTotal: atual.proLaboreDeclarado || 0,
      quemRecebe: Math.max(1, empresa.sociosComProLabore ?? 1),
      socios: Math.max(
        empresa.sociosTotal ?? empresa.sociosComProLabore ?? 1,
        empresa.sociosComProLabore ?? 1
      ),
      cltDoSocio: empresa.cltDoSocio ?? 0,
    }),
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
    folgaNoPlanoDoCalculo: Math.round(folga),
    /** 🔑 O número que vai pra tela: quanto de pró-labore por mês sobra ou falta. */
    folga: Math.round(porMes),
    temFolga: folga >= 0,
    falta: folga < 0 ? Math.round(-porMes) : 0,
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
