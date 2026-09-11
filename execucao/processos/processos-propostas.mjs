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
];
