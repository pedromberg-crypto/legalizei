/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔔 ALERTAS INTERNOS — o que faz a CASA agir, não o cliente
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu em 16/09, da reunião com o contador. A frase que funda é dele:
 *
 *   > *"O que a gente pode rastrear é: **gerar um alerta para a gente**. O cara
 *   > abriu 16 do 9, competência 9 ele faturou. **Alertar para nós.** Ao invés
 *   > de eu ser pego de surpresa, **eu posso tratar esse caso como um caso**."*
 *
 * ── 🔑 POR QUE ISTO É UMA CAMADA SEPARADA ──────────────────────────────────
 *
 * O `retratoDoMes` responde *"quanto se deve"*. O piloto responde *"quanto
 * pagar de pró-labore"*. Nenhum dos dois responde **"alguém precisa ligar para
 * esse cliente, e até quando"** — e é disso que se trata aqui.
 *
 * Alerta interno tem três coisas que um campo booleano não carrega:
 *
 *   1. um **PRAZO**, depois do qual a ação fica cara ou impossível;
 *   2. uma **AÇÃO** nomeada, que alguém executa;
 *   3. um **VALOR**, que é o que justifica a ligação existir.
 *
 * ── 🔴 O QUE ESTES ALERTAS NÃO SÃO ─────────────────────────────────────────
 *
 * **Não são tela do cliente.** A decisão do Pedro em 16/09 foi explícita: o
 * caso da janela vazia dispara alerta **interno**, e quem fala com o cliente é
 * gente. Botar isso na tela transformaria uma exceção rara num susto para todo
 * mundo que abre empresa.
 *
 * ⚠️ E não são o `piloto`. O piloto age sozinho, de propósito — *"eles não
 * precisam saber sobre isso"*. Aqui é o contrário: **precisa de humano**, e o
 * alerta existe para o humano chegar a tempo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { vencimentoDe, emCentavos } from "../regra/apurador.mjs";
import { proLaboreParaManterNoIII } from "../regra/piloto-pro-labore.mjs";
import { FATOR_R } from "../regra/_tabelas.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · O CATÁLOGO — cada alerta declarado antes de existir em código
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔑 Declarar antes de implementar é o que impede a lista de virar um monte de
 * `if` espalhado. Alerta que não está aqui não existe.
 */
export const CATALOGO = [
  {
    id: "A1",
    nome: "Faturou no mês em que abriu",
    gravidade: "alta",
    porque:
      "O mês da constituição sai no Anexo V porque não existe competência " +
      "anterior com folha. Isso não se reverte. Mas o mês SEGUINTE pode sair " +
      "no III, se a folha desta competência for gerada dentro do prazo normal " +
      "do eSocial — e aí não há retificação, juros nem multa.",
    quemAge: "a casa liga para o cliente",
    // 🔴 A janela é curta e é a razão de o alerta existir.
    prazo: "dia 15 do mês seguinte à competência",
    raridade:
      "Raro por construção: prestador de serviço cumpre 30 dias de competência " +
      "antes de emitir. O contador: *\"dificilmente eu pegaria um cara que " +
      "faturava no mesmo mês\"*.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · A DERIVAÇÃO
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Lê um retrato já calculado e devolve os alertas que ele dispara.
 *
 * 🔑 **Derivado, nunca guardado** — mesma regra do resto do estado do CNPJ. Um
 * alerta salvo em banco envelhece; um alerta derivado some sozinho quando a
 * causa some.
 *
 * @param retrato   saída de `retratoDoMes`
 * @param empresa   a identidade, para o alvo do Fator R
 */
export function alertasDoRetrato({ retrato, empresa }) {
  const alertas = [];

  // ── A1 · Faturou no mês em que abriu ───────────────────────────────────
  if (retrato.faturouSemJanela) {
    const [ano, mes] = retrato.mes.split("-").map(Number);

    // 🔴 O prazo que importa NÃO é o do DAS: é o do eSocial, que vence ANTES.
    // O DAS desta competência já está perdido no Anexo V; o que a ligação
    // salva é a folha, e ela vence no dia 15.
    //
    // ⚠️ `vencimentoDe` recebe o mês da competência 1-indexado e já devolve o
    // vencimento no mês SEGUINTE, porque `Date.UTC` conta mês a partir de zero.
    // Passar `mes - 1` aqui foi erro meu na primeira versão: dava 15/09 para a
    // competência 09, quando o certo é 15/10.
    const prazo = vencimentoDe({
      competencia: { ano, mes },
      tributo: "esocial",
    });

    // Quanto de folha esta competência precisa ter para o mês seguinte já sair
    // no Anexo III. É a mesma conta do piloto, olhando para a janela do m+1.
    const conta = proLaboreParaManterNoIII({
      competenciasAnteriores: [],
      receitaDoMes: retrato.receita / 100,
      alvo: FATOR_R.MARGEM,
    });

    alertas.push({
      id: "A1",
      gravidade: "alta",
      mes: retrato.mes,
      oQue: "Faturou no mês em que abriu, e não havia janela para o Fator R.",
      /**
       * 🔒 O que NÃO se promete. Travado pelo Pedro em 16/09.
       */
      irreversivel: `A competência ${retrato.mes} fica no Anexo V. Não se reverte.`,
      /**
       * 🔑 O que ainda dá para salvar, que é o motivo da ligação.
       */
      acao:
        `Gerar a folha de ${retrato.mes} até o prazo, para a competência ` +
        `seguinte já sair no Anexo III.`,
      proLaboreNecessario: emCentavos(conta.minimo),
      prazo: prazo.data ?? prazo,
      /**
       * ⚠️ A diferença entre agir e não agir, em dinheiro. Sem isto o alerta
       * vira burocracia: ninguém liga para um cliente por um aviso sem número.
       */
      valorEmJogo: retrato.das?.total ?? 0,
      /**
       * 🔴 E o que acontece se o prazo passar — porque aí a operação muda de
       * natureza e de preço.
       */
      seOPrazoPassar:
        "Deixa de ser lançamento no prazo e vira retificação de eSocial com " +
        "guia complementar, juros e multa. O contador descreveu esse caminho " +
        "como possível, não como desejável.",
      precisaDeAceite: true,
    });
  }

  return alertas;
}

/**
 * Varre uma vida inteira e devolve todos os alertas dela, na ordem do tempo.
 *
 * 🔑 Existe porque alerta só vale se alguém **varrer** — o contador foi
 * explícito sobre isso ao falar da caixa postal: *"ele já te dá: 30 de 2 mil
 * receberam o termo. E eu só ataco os 30. Eu não preciso visitar os 2 mil."*
 */
export function alertasDaVida({ empresa, retratos }) {
  return retratos.flatMap((retrato) => alertasDoRetrato({ retrato, empresa }));
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · O QUE AINDA NÃO É ALERTA, E DEVERIA SER
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ⏳ Declarado para não virar esquecimento. Cada um destes saiu da reunião de
 * 16/09 e ainda não tem implementação.
 */
export const FALTAM = [
  {
    id: "A2",
    o: "Termo de exclusão do Simples na caixa postal",
    porque:
      "Chega pelo DTE e o cliente não olha. O contador: *\"se eu avisar ele lá " +
      "em agosto, setembro, aí ele fala: pô, mas vocês estão me avisando " +
      "agora\"*. Duas janelas por ano: setembro e março.",
    depende: "API de caixa postal (InfoSimples ECAC)",
  },
  {
    id: "A3",
    o: "Acumulado encostando no teto do ME",
    porque:
      "A P16 chega a R$359.000 contra o limite de R$360.000 e **nenhuma tela " +
      "avisa**. Foi o buraco que a persona achou.",
    depende: "decisão sobre EPP, hoje em standby",
  },
  {
    id: "A4",
    o: "Pró-labore declarado e não pago",
    porque:
      "Não quebra o Fator R na hora, mas vira dívida que exclui do Simples na " +
      "janela de regularização.",
    depende: "consulta de arrecadação, que já existe",
  },
];
