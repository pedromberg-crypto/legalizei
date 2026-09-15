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
    naoReabrir: ["se a CPP conta para bater os 28% (não conta)"],
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
];
