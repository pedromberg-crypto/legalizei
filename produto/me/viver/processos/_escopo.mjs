/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 O ESCOPO DO PRODUTO — fonte única, e é ela que a trava lê.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Travado pelo Pedro em 12/09, e o pedido foi literalmente por uma TRAVA:
 * *"preciso que você também trave de alguma forma que não passe batido que
 * estamos lidando apenas com os enquadramentos e características que eu te
 * disse."*
 *
 * 🔴 POR QUE ISTO NÃO É UM COMENTÁRIO NUM CABEÇALHO. Porque comentário é
 * prosa, e prosa é o que passa batido. Neste mesmo dia eu desenhei
 * "valor errado → substitui" sem notar que a regra E0061 proíbe isso para
 * optante do Simples ME/EPP — o escopo estava escrito e eu não o apliquei.
 * Escrever de novo, mais bonito, não resolveria. Então o escopo virou DADO,
 * e `verificar-escopo.mjs` roda dentro de cada gerador.
 *
 * ── O QUE ESTÁ DENTRO ──────────────────────────────────────────────────────
 *
 *   ME optante do SIMPLES NACIONAL  ·  `opSimpNac = 3` no leiaute da NFS-e
 *   Anexo III ou Anexo V            ·  com ou sem Fator R
 *   Serviço, ISS, município de BH   ·  NFS-e
 *
 * ── O QUE ESTÁ FORA, e não é "depois" ──────────────────────────────────────
 *
 *   Anexo I (comércio)              ·  emite NF-e modelo 55, SEFAZ estadual,
 *                                      ICMS/CFOP/NCM. É outro documento e
 *                                      outro sistema — não é "mais um caso"
 *   Atividades regulamentadas       ·  conselho de classe, exigência própria
 *   Lucro Presumido / Lucro Real    ·  outro regime, outra apuração
 *   MEI                             ·  tem caminho próprio no app; quando o
 *                                      assunto for MEI, declarar
 *
 * 🔑 O ENQUADRAMENTO NÃO É ETIQUETA, ELE MUDA A REGRA. A E0061 do leiaute
 * nacional proíbe a substituição de alterar tomador, competência e valor
 * **só** para MEI e ME/EPP do Simples. Para não optante, vale outra regra
 * (E0060). Quem esquece o enquadramento desenha o processo do vizinho.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const ESCOPO = {
  dentro: {
    regime: "Simples Nacional",
    porte: "ME",
    anexos: ["III", "V"],
    fatorR: "com ou sem",
    documento: "NFS-e (serviço, ISS, municipal)",
    marcaNoLeiaute: "opSimpNac = 3",
  },
  fora: [
    { o: "Anexo I · comércio", porque: "emite NF-e modelo 55 pela SEFAZ estadual, com ICMS/CFOP/NCM. Outro documento, outro sistema" },
    { o: "Atividades regulamentadas", porque: "exigência de conselho de classe e rito próprio de abertura" },
    { o: "Lucro Presumido e Lucro Real", porque: "outro regime, outra apuração" },
    { o: "MEI", porque: "tem caminho próprio no app; quando o assunto for MEI, tem que estar declarado" },
  ],
};

/**
 * Vocabulário que NÃO pode aparecer nos arquivos de processo sem estar
 * declarado como exclusão. Cada termo é inequívoco do mundo de fora: se ele
 * apareceu, ou o desenho vazou, ou está citando pra dizer que está fora.
 *
 * 🔑 A lista é curta de propósito. Termo ambíguo gera aviso que ninguém lê, e
 * aviso que ninguém lê é pior que trava nenhuma. Ficaram de fora, por serem
 * ambíguos no nosso vault: "Anexo I" (colide com o Anexo I do nosso contrato
 * e com o ANEXO_I do leiaute da NFS-e) e "MEI" (assunto legítimo em outra
 * frente). Esses dois dependem de olho humano.
 */
export const FORA_DO_VOCABULARIO = [
  "ICMS", "CFOP", "NCM", "CSOSN", "DANFE", "SEFAZ", "NFC-e",
  "modelo 55", "modelo 65", "Inscrição Estadual",
  "Lucro Presumido", "Lucro Real", "Regime Normal",
];

/**
 * 🔑 COMO DECLARAR UMA CITAÇÃO LEGÍTIMA. Escreva o marcador abaixo na MESMA
 * linha do termo. Não existe lista central de exceções de propósito: lista
 * central envelhece longe do texto que ela libera, e ninguém revisa.
 *
 *   "…comércio emite NF-e com ICMS e CFOP — FORA DO ESCOPO"
 */
export const MARCADOR_EXCLUSAO = "FORA DO ESCOPO";
