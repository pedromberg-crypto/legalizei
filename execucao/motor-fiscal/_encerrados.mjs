/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 ASSUNTOS ENCERRADOS — o que não se reabre.
 * ═══════════════════════════════════════════════════════════════════════════
 * Travado pelo Pedro em 15/09, depois de eu reabrir o ISS pela terceira vez:
 * *"e voltamos a falar acima que ISS em Anexo V é tal e tal… não vamos mais
 * repetir esse erro. Como você me garante que esses erros não ocorrerão mais?"*
 *
 * ── 🔴 A RESPOSTA HONESTA À PERGUNTA DELE ──────────────────────────────────
 *
 * **Eu não garanto o meu julgamento.** Prometi atenção três vezes hoje e
 * falhei três vezes. O que dá para fazer é diferente: tornar a reabertura
 * **mecanicamente detectável**, para custar a rodada em vez de custar a
 * conversa dele.
 *
 * 🔑 **E o diagnóstico exato importa, porque a trava só funciona se mirar
 * certo:** o ISS **nunca esteve errado no código**. `retencaoLegitima()` está
 * correta desde 14/09 e nenhum teste falhou. As três reincidências foram em
 * **PROSA** — eu escrevi ISS numa lista de "o que falta" e numa lista de
 * "dúvidas com o contador". Uma trava que olhasse só o código nunca pegaria,
 * porque no código nunca houve o erro.
 *
 * Por isso esta trava varre **os documentos de pendência**, que é onde o
 * assunto encerrado ressuscita.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Os arquivos onde uma pendência pode nascer. É aqui que assunto encerrado
 * reaparece disfarçado de item novo.
 */
export const DOCS_DE_PENDENCIA = [
  "execucao/estado-cnpj/_cobertura-das-vidas.md",
  "execucao/estado-cnpj/_duvidas-contador.md",
  "execucao/estado-cnpj/_achados-do-motor.md",
  "execucao/motor-fiscal/_SUFICIENCIA.md",
];

/**
 * 🔴 AS FONTES DE DESENHO — acrescentadas em 16/09, depois da TERCEIRA cópia.
 *
 * ── O QUE ACONTECEU ────────────────────────────────────────────────────────
 *
 * A leitura errada da CPP (*"conta no numerador, é pacífico"*) foi escrita em
 * 13/09 e refutada em 14/09. Mesmo assim ela sobreviveu em **três lugares**:
 *
 *   1. `_tabelas.mjs` · FATOR_R_NUMERADOR ....... corrigido em 15/09, e só
 *      porque o Pedro mandou conferir *"se de fato é isso mesmo"*
 *   2. virou o assunto encerrado `E-CPP` ........ 14/09
 *   3. `cru/prolabore.mjs` + `processos-data.mjs` ... **sobreviveu até 16/09**
 *
 * 🔑 **E sobreviveu por um motivo estrutural, não por descuido:** esta trava
 * varria só os 4 docs de pendência acima, porque nasceu para pegar assunto
 * encerrado voltando como *dúvida*. A CPP não voltou como dúvida — ela **nunca
 * saiu** da fonte que gera o desenho de processo, afirmada como fato.
 *
 * ⚠️ Assunto encerrado morre em **lista de pendência** e em **fonte de
 * desenho**. Varrer só a primeira deixa a segunda ensinando o erro.
 */
export const FONTES_DE_DESENHO = [
  "execucao/processos/cru/prolabore.mjs",
  "execucao/processos/cru/impostos.mjs",
  "execucao/processos/cru/notas.mjs",
  "execucao/processos/processos-data.mjs",
  "execucao/processos/_persona.mjs",
];

/**
 * 🔑 Nas fontes de desenho a regra é OUTRA, e precisa ser.
 *
 * Num doc de pendência, o problema é o assunto **reaberto como dúvida** — por
 * isso lá o gatilho é `LINGUAGEM_DE_ABERTO`. Aqui o problema é o oposto: o
 * assunto aparece **afirmado como verdade**, e a verdade afirmada é a errada.
 *
 * Então aqui se varre por **contradição declarada**: frases que afirmam o que
 * o encerrado nega. Não dá para pegar tudo, e não é essa a promessa — a
 * promessa é pegar a reincidência *literal*, que foi como esta errou três vezes.
 */
export const CONTRADICOES = [
  {
    de: "E-CPP",
    frases: [
      "CPP dentro do DAS CONTA no numerador",
      "cpp mesmo embutida no das",
      "a CPP FOI RESOLVIDA EM 13/09: ela CONTA",
    ],
    porque:
      "A Res. CGSN 140/2018 art. 26 §2º I 'a' nomeia só o Anexo IV. No III e " +
      "no V a CPP não entra no numerador do Fator R.",
  },
];

/**
 * Palavras que marcam uma linha como "isto está em aberto". Assunto encerrado
 * numa linha dessas é reabertura.
 */
export const LINGUAGEM_DE_ABERTO = [
  "falta",
  "faltam",
  "em aberto",
  "dúvida",
  "duvida",
  "pesquisar",
  "buscar externamente",
  "não sabemos",
  "nao sabemos",
  "a definir",
  "precisa decidir",
  "nunca rodou",
  "sem prova",
];

/**
 * 🔑 O selo que autoriza citar o assunto numa linha de pendência. Serve para
 * o caso legítimo: explicar que algo JÁ foi encerrado. Sem ele, é reabertura.
 */
export const SELO = "[ENCERRADO]";

export const ENCERRADOS = [
  {
    id: "E-ISS",
    assunto: "ISS — cálculo, retenção e local de recolhimento",
    termos: ["iss", "retenção de iss", "retencao de iss", "issqn"],
    encerradoEm: "2026-09-14",
    reabertoIndevidamentePor: 3, // 15/09: duas vezes em prosa, uma na lista de dúvidas
    resposta:
      "Para as nossas atividades o ISS é devido no LOCAL DO ESTABELECIMENTO " +
      "PRESTADOR (BH), porque elas não estão nas 25 exceções do art. 3º da " +
      "LC 116/2003. Quem paga é o prestador, DENTRO do DAS. Tomador de outro " +
      "município não tem competência para reter — ato 'eivado de nulidade'. " +
      "Dentro de BH, só os substitutos dos arts. 20/21/24 da Lei Municipal " +
      "8.725/2003 retêm, e aí é SEGREGAÇÃO da base do ISS (LC 123 art. 21 " +
      "§4º), nunca compensação. A mecânica é idêntica nos Anexos III e V: o " +
      "`apurarDAS` é parametrizado por anexo e usa a repartição de cada um.",
    fonte: "LC 116/2003 art. 3º · LC 123/2006 art. 21 §4º · Lei 8.725/2003 arts. 20/21/24",
    onde: "execucao/motor-fiscal/apurador.mjs · retencaoLegitima() e apurarDAS()",
    /**
     * 🔴 A DECISÃO DE PRODUTO, travada pelo Pedro em 15/09:
     * *"não quero mais ver falar de cálculo de ISS para o nosso usuário."*
     */
    decisaoDeProduto:
      "O ISS NÃO é cálculo, tela, pergunta nem decisão do usuário. Ele vive " +
      "DENTRO do DAS, invisível, e sai de lá por lei. A única coisa que pode " +
      "aparecer é a consequência de uma retenção que o tomador já fez — e " +
      "mesmo essa é informação, nunca conta que o cliente precise entender.",
    naoReabrir: [
      "se tomador de fora de BH pode reter (não pode, e o motor já rejeita)",
      "se a segregação funciona no Anexo V (funciona — é o mesmo código)",
      "se falta persona para exercitar retenção (não falta: há teste)",
      "qualquer item de backlog que comece com 'falta ISS' ou 'dúvida de ISS'",
    ],
    /**
     * ⚠️ O QUE SEGUE ABERTO NESTE ASSUNTO — e é outra coisa, com outro nome.
     * Não é dúvida de regra: é leitura não feita.
     */
    aindaAberto:
      "SUBSTITUTOS_BH (a lista de quem retém DENTRO de BH) é PARÁFRASE, não " +
      "texto literal da Lei 8.725/2003. Isso é pendência de LEITURA INTEGRAL, " +
      "não dúvida de regra, e mora na fila de leitura — não na de pesquisa.",
  },

  {
    id: "E-CPP",
    assunto: "CPP embutida no DAS no numerador do Fator R",
    termos: ["cpp no fator r", "cpp embutida", "cpp-embutida-no-das"],
    encerradoEm: "2026-09-14",
    reabertoIndevidamentePor: 1, // 15/09: repeti o oposto lendo dado desatualizado
    resposta:
      "NÃO entra, nos Anexos III e V. Res. CGSN 140/2018 art. 26 §2º I 'a' " +
      "nomeia o Anexo IV, e o silêncio sobre III e V é vedação. A SC COSIT " +
      "17/2021 que o mercado cita trata de matéria diversa.",
    fonte:
      "Res. CGSN 140/2018 art. 26 §2º I 'a' · captura literal em " +
      "pesquisa/fontes/2026-09-14-fechamento-motor-fiscal-LITERAL.md §P2",
    onde: "execucao/motor-fiscal/_tabelas.mjs · FATOR_R_NUMERADOR",
    /**
     * 🔴 A SEGUNDA CAMADA, travada pelo Pedro em 16/09 — e ela é DECISÃO,
     * não interpretação.
     *
     * Na reunião de 16/09 o contador Leonan descreveu a manobra em voz alta:
     * *"eu posso pegar esses R$205 que gera ali e somar ele lá no Fator R…
     * se você fez o cálculo de 29%, ele vai acumular mais 1% ali, vai virar
     * 30"* · *"pode considerar em tudo"*.
     *
     * 🔑 Ele NÃO estava contestando a norma: estava descrevendo uma PRÁTICA.
     * O Pedro decidiu no mesmo dia:
     *
     *   *"a gente faria essa manobra de pegar esse valor e considerar ele no
     *   Fator R para chegar à porcentagem que precisamos, mas na verdade de
     *   fato NÃO FAREMOS ISSO. O CPP continuará sendo apenas gerado dentro da
     *   guia normal como sempre é gerado, a gente não vai pegar o valor
     *   gerado e fazer essa matemática sugerida."*
     *
     * ⚠️ O tamanho do que se recusa: a manobra move o Fator R em ~1 ponto.
     * Numa empresa em 27,x% ela decide o anexo — e se a interpretação estiver
     * errada, o erro é por cliente, por mês e RETROATIVO (reclassificação de
     * ofício + Selic + multa). A margem de 30% existe para nunca depender de
     * ponto nenhum na borda.
     */
    decisaoDeProduto:
      "A CPP é GERADA dentro do DAS, como sempre — é a maior parcela da guia " +
      "(43,40% no Anexo III faixa 1). Mas ela NÃO é usada como numerador do " +
      "Fator R: nem soma, nem 'plus', nem arredondamento para cima. O Fator R " +
      "usa só a folha efetivamente paga. Travado pelo Pedro em 16/09, depois " +
      "de o contador descrever a manobra como possível.",
    naoReabrir: [
      "se a CPP conta para bater os 28% (não conta)",
      "se dá para 'aproveitar' a CPP da guia para fechar a porcentagem (dá, e não fazemos)",
    ],
  },

  {
    id: "E-FAIXAS",
    assunto: "Faixas 3 a 6 da tabela do Simples",
    termos: ["faixa 3", "faixa 4", "faixa 5", "faixa 6", "faixas 3-6", "faixas 3 a 6"],
    encerradoEm: "2026-09-15",
    resposta:
      "O ME só alcança as faixas 1 e 2: a faixa 2 termina em R$360 mil, que É " +
      "o teto do ME. As faixas 3 a 6 só existem para quem SAI para EPP, e EPP " +
      "na nossa persona é porta de saída, nunca permanência. Estão " +
      "implementadas e conferidas contra a lei, e NÃO precisam de persona.",
    fonte: "LC 123/2006 Anexos III e V · PERSONA.md",
    onde: "execucao/motor-fiscal/_tabelas.mjs · FAIXAS",
    naoReabrir: ["se falta vida para exercitar as faixas altas (não falta)"],
  },
  {
    id: "E-ARREDONDAMENTO",
    assunto: "A convenção de arredondamento do DAS, e o centavo",
    termos: ["arredondamento", "centavo do DAS", "474,60", "soma de 6 parcelas"],
    encerradoEm: "2026-09-17",
    resposta:
      "O DAS é a SOMA DE SEIS PARCELAS ARREDONDADAS, uma por tributo, e não o " +
      "arredondamento do produto. Está provado contra o recibo oficial do " +
      "PGDAS-D: 7.910 × 6% = 474,60 e a guia da Receita sai R$474,59. " +
      "A convenção não tem caminho próprio por anexo — é o mesmo código no III " +
      "e no V. TODO dinheiro anda em centavos inteiros no motor; só a exibição " +
      "volta para reais. A diferença entre somar e multiplicar é de CENTAVOS, " +
      "nunca de reais, e é ESPERADA: é a regra funcionando, não desvio.",
    fonte:
      "Recibo do PGDAS-D de ago/2026 da persona zero (documento emitido) · " +
      "LC 123/2006 art. 18 §1º (a fórmula da efetiva) · conferências G1 e G2 do " +
      "verificar-apurador, que testam o caso quebrado E o caso redondo",
    onde: "execucao/motor-fiscal/apurador.mjs · emCentavos() e apurarDAS()",
    /**
     * 🔴 A LINHA QUE O PEDRO PEDIU EM 17/09, e ela é sobre COMO REPORTAR:
     *
     *   *"sobre os centavos eu lembro que já temos fontes validadas do governo
     *   para essa regra de arredondamento e preciso que a gente apenas aplique
     *   ela sem ficar reportando sobre cálculos dos centavos e às vezes
     *   trazendo como 'erro'."*
     *
     * Ele está certo e o registro corrige a minha conduta, não o motor:
     * diferença de centavo entre `soma das partes` e `produto direto` é a
     * regra **acontecendo**. Chamar isso de achado infla o ledger e gasta a
     * atenção dele com o que já está resolvido desde 14/09.
     *
     * ⚠️ Segue valendo relatar o que é DE VERDADE outra coisa: unidade
     * trocada (reais onde se espera centavos — M-014, M-020, M-027) não é
     * "questão de centavo", é ordem de grandeza 100×.
     */
    naoReabrir: [
      "se o DAS deveria ser receita × alíquota (não deveria)",
      "se o centavo de diferença é erro (não é — é a convenção)",
      "se o Anexo V precisa de recibo próprio para o arredondamento (não precisa)",
      "relatar diferença de centavo do arredondamento como achado",
    ],
  },
];
