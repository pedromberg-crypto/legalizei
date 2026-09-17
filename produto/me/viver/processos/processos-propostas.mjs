/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROPOSTAS — o que EU sugiro, separado do que o Pedro já decidiu.
 * ═══════════════════════════════════════════════════════════════════════════
 * Combinado em 11/09: *"quando eu te pedir sugestão de como você resolveria os
 * gargalos, quero que você de fato valide e dê opiniões… se vir necessidade de
 * resolver criando uma tela, coloque a sugestão no card; se achar pertinente
 * adicionar mais uma ramificação, crie a ramificação… mas TODAS em cinza
 * claro, com um X e um check pra eu clicar."*
 *
 * 🔴 POR QUE ARQUIVO SEPARADO, e não um campo no `processos-data.mjs`.
 *
 * O `processos-data.mjs` é o que a casa DECIDIU. Isto aqui é o que eu ACHO.
 * Misturar os dois faria três estragos de uma vez:
 *   1. descartar deixaria cicatriz no arquivo de verdade (linha removida,
 *      diff sujo, e um dia alguém reabre a discussão sem saber que morreu);
 *   2. o placar 🟢🟡🔴 passaria a contar opinião minha como estado do produto,
 *      que é exatamente a mentira que a doutrina §3 existe pra evitar;
 *   3. o arquivo que a doutrina §5 reserva pra edição humana viraria pasto de
 *      texto gerado.
 *
 * Proposta aceita **não se promove sozinha**: ela vira sólida no board na
 * hora, e eu escrevo no `processos-data.mjs` no fecho do flow, junto com a
 * linha no ADR. Decisão travada tem que passar por registro — foi o Pedro que
 * escolheu assim quando montamos esta dinâmica.
 *
 * ── COMO SE ESCREVE UMA PROPOSTA ───────────────────────────────────────────
 *
 * 🔴 UMA PROPOSTA É UM PATCH, não um tipo (refeito em 11/09).
 *
 * Ela nasceu com UM tipo por proposta — "passo", "aresta", "campo" ou
 * "remover". Aí o Pedro pediu uma mudança que era as quatro coisas ao mesmo
 * tempo: completar uma tela, criar um passo, tirar outro e religar o desenho.
 * Com tipo único isso vira quatro propostas, e aceitar três delas quebra o
 * processo — exatamente o que a §6.4 acabou de proibir. Então uma proposta
 * carrega as partes que precisar:
 *
 *   passos    · cartões novos (cada um com `id` "S<n>" ou "S<n><letra>")
 *   mudancas  · [{ passo, campo, valor }] em passos que já existem. NÃO
 *               aparecem no cartão (altura é fixa, §5.1): vão pro painel
 *               lateral, e o cartão ganha um selo de "tem sugestão"
 *   remove    · ids de passos que saem do processo
 *   arestas   · ligações novas, com `label` quando houver condição
 *   substitui · ligações que morrem quando a proposta é aceita
 *   rotula    · [{ de, para, label }] pra aresta que só troca de NOME.
 *               🔴 Nunca escrever renomeação como substitui + arestas com as
 *               mesmas pontas: é ambíguo por construção, e em 11/09 desenhou
 *               linha duplicada no board e apagou as duas no simulador
 *
 * Obrigatórios:
 *   id     · "S<n>", único e ESTÁVEL. É por ele que a decisão fica gravada:
 *            reusar um id descartado ressuscita um "não" do Pedro.
 *   porque · o raciocínio, em português. É o que ele lê pra decidir.
 *
 * Opcional, e vale a pena quando é verdade:
 *   depende · ids de outras propostas que precisam existir pra esta fazer
 *             sentido. Serve pra eu avisar o que ficou solto quando ele
 *             descarta uma da cadeia — aviso factual, não argumento.
 *
 * 🔴 O TAMANHO CERTO DE UMA PROPOSTA é a mudança que deixa o grafo VÁLIDO
 * quando aceita sozinha. Nem maior (o Pedro perde granularidade), nem menor
 * (ele aceita um pedaço e fica com um beco). Quem confere é o simulador de
 * caminhos do `gerar-processos.mjs` — não a minha impressão.
 *
 * ⚠️ Descarte NÃO é contrariedade. Ele descartar é dado novo: quer dizer que
 * vai trabalhar melhor em cima, e a justificativa vem no chat. Se o descarte
 * soltar uma ponta, eu digo QUAL ponta em uma linha e proponho de novo em cima
 * da razão dele — sem defender a versão morta.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ── LEVA 1 · 11/09 — os 4 vermelhos e os 2 amarelos do P4 ──────────────────
 *
 * Pedido: *"traga a sugestão para os 6, os 4 vermelhos e os 2 amarelos."*
 *
 * 🔑 O ACHADO QUE ORGANIZA TUDO: quatro das seis dúvidas **já estão
 * respondidas dentro da nossa própria minuta**, e ficaram abertas porque o
 * processo foi desenhado antes de alguém cruzar com o contrato. Li as 16
 * cláusulas e o Anexo I inteiros (47.136 caracteres, 100%) e as respostas
 * estavam em 6.3, 6.4, 9.5 e 12.6.
 *
 * Isso muda a natureza do trabalho: não é inventar regra, é **parar de
 * inventar** onde já decidimos. Só duas das seis pedem decisão nova de fato
 * (S2 e S6), e as duas estão marcadas.
 *
 * ⚠️ A minuta está com a advogada e pode voltar mudada. Se uma cláusula que
 * sustenta uma proposta cair no parecer, a proposta cai junto — está dito em
 * cada `porque` de qual cláusula ela depende.
 */
export const PROPOSTAS = [
  /**
   * 🎉 VAZIO EM 11/09 — e isso é o resultado, não o começo.
   *
   * As 11 sugestões da leva 1 foram decididas uma a uma pelo Pedro no board e
   * promovidas pro `processos-data.mjs`: o P4 saiu de 11 passos com 🔴4 para
   * 23 passos, e virou processo, não rascunho.
   *
   * Histórico: o ADR (`marca/decisoes-marca.md`, 11/09) e o
   * `decisoes-propostas.json`, que guarda quais ids foram promovidos.
   */

  /**
   * ── LEVA 2 · 12/09 — o caminho que a fonte primária abriu no P6 ──────────
   *
   * Não nasceu de opinião minha: nasceu de ler a documentação oficial do
   * Sistema Nacional NFS-e (`2026-09-12-nfse-nacional-eventos-cancelamento`).
   * O P6 saiu desenhado hoje assumindo que cancelar tem dois desfechos —
   * aceito ou recusado. A documentação mostra um terceiro, e ele é o único
   * ASSÍNCRONO do processo.
   */
  {
    id: "S12",
    titulo: "Recusou por prazo: pedir análise fiscal",
    porque:
      "🔴 O P6 de hoje trata recusa como fim de linha (P6.11 · “a nota continua valendo”), e o Sistema Nacional diz que não é. Quando o cancelamento direto não passa, existe um segundo caminho documentado: **Solicitação de Análise Fiscal para Cancelamento** (evento e101103, autor: o emitente), que fica PENDENTE até o município responder com **Deferido** (e105104) ou **Indeferido** (e105105). A regra de negócio é explícita: o deferimento não pode ser recebido sem uma solicitação pendente.\n\n🔑 É AQUI que nasce o vigia que eu procurei no lugar errado. O cancelamento comum é síncrono; a exceção é que espera. Mesmo formato do P2.3/P2.4, que espera o vencimento pra consultar a arrecadação.\n\n⚠️ Sem isso, o produto diz “não deu” pra alguém que ainda tem caminho — e é justamente o caso do erro descoberto tarde, que é quando cancelar mais importa.",
    passos: [
      {
        id: "S12a",
        processos: ["P6"],
        titulo: "Pede análise fiscal do cancelamento",
        quem: "cliente",
        faz: "Quando a recusa foi de prazo, registra um pedido de análise fiscal explicando o motivo, e avisa que agora quem decide é a prefeitura.",
        fala: "Sefin Nacional NFS-e · evento e101103",
        ve: "A recusa vira caminho, não beco: “o prazo direto passou, mas dá pra pedir análise da prefeitura”, com o campo do motivo e o aviso de que a resposta não é imediata.",
        luz: "amarelo",
        forma: "passo",
        fonte:
          "Anexo II do Sistema Nacional NFS-e, aba de tipos de evento: `Solicitação de Análise Fiscal para Cancelamento de NFS-e`, código 1 01 1 03, autor “Emite”, assinatura digital obrigatória.",
        duvida:
          "Quanto tempo a prefeitura leva, e se existe prazo máximo — a documentação não diz, e é parametrização municipal. Enquanto pende, a receita da competência conta com a nota ou não? A resposta honesta é CONTA (a nota ainda vale), mas isso precisa estar escrito antes de alguém supor o contrário.",
      },
      {
        id: "S12b",
        processos: ["P6"],
        titulo: "◆ A prefeitura deferiu?",
        quem: "a casa",
        faz: "Fica de olho nos eventos vinculados à nota e vê qual dos dois chegou: deferimento ou indeferimento.",
        fala: "ADN · GET /NFSe/{chaveAcesso}/Eventos",
        ve: "nada, acontece por baixo",
        luz: "amarelo",
        forma: "decisao",
        fonte:
          "Os dois desfechos são eventos próprios, autorados pelo município: `Cancelamento Deferido por Análise Fiscal` (e105104) e `Indeferido` (e105105). 🔑 A consulta de eventos por chave de acesso é justamente uma das duas APIs que o contribuinte tem no ADN.",
        duvida:
          "De quanto em quanto tempo consultar, e por quanto tempo insistir. O vigia do P2 tem data certa pra acordar (o vencimento é conhecido desde a emissão); este não tem — depende da prefeitura. Sem régua, ou a gente consulta demais ou descobre tarde.",
      },
      {
        id: "S12c",
        processos: ["P6"],
        titulo: "■ Indeferido: a nota vale, e agora é definitivo",
        quem: "a casa",
        faz: "Fecha o caminho: a prefeitura analisou e negou, então não há mais para onde ir dentro do app.",
        fala: "só a nossa casa",
        ve: "O motivo que a prefeitura deu, a data, e a saída honesta pela contabilidade. Nada de “tentar de novo”.",
        luz: "amarelo",
        forma: "fim",
        fonte: "Evento e105105. Saída terminal: depois do indeferimento, o app não tem mais ação a oferecer.",
        duvida:
          "Se o indeferimento é definitivo mesmo, ou se cabe novo pedido com outra justificativa. Prometer “acabou” e estar errado é pior que mandar pro atendimento.",
      },
    ],
    arestas: [
      { de: "P6.11", para: "S12a", label: "a recusa foi de prazo" },
      { de: "S12a", para: "S12b" },
      { de: "S12b", para: "P6.15", label: "a prefeitura deferiu" },
      { de: "S12b", para: "S12c", label: "a prefeitura indeferiu" },
    ],
    mudancas: [
      {
        passo: "P6.11",
        campo: "forma",
        valor: "passo",
        porque:
          "Deixa de ser fim de linha: com a análise fiscal, a recusa passa a ter saída. Continua sendo fim quando a recusa não for de prazo.",
      },
    ],
  },
];
