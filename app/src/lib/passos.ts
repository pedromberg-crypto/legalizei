/**
 * ═══════════════════════════════════════════════════════════════════════════
 * OS PASSOS DO DOSSIÊ — fonte única de "quantos passos faltam".
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu de um bug achado pelo Pedro em 19/07: a P2 dizia "5 de 9 passos" e a
 * P1, na esteira ao lado, dizia "3 de 6". Eu tinha inventado os dois números
 * separadamente, em cada tela, sem nunca definir qual era o contador.
 *
 * É o mesmo pecado do rótulo de faixa escrito em 5 arquivos: informação que
 * aparece em mais de um lugar e não tem dono acaba divergindo. Aqui o dano
 * seria pior que estética — "faltam X passos" é promessa de esforço, e duas
 * telas do MESMO app dando contagens diferentes destrói a confiança no resto
 * dos números (inclusive nos fiscais, que são os que importam).
 *
 * ─── O QUE CONTA COMO PASSO ──────────────────────────────────────────────
 * Tudo que exige AÇÃO do cliente até a empresa entrar na máquina.
 *
 * Inclui o N18 (pró-labore) mesmo sendo arquétipo A3 (número/prova) e não A1
 * (coleta): do ponto de vista de quem preenche, mexer no pró-labore é passo
 * como qualquer outro, exige decisão e não dá pra seguir sem ele.
 *
 * ⚠️ O CNAE ótimo NÃO é mais passo do dossiê: virou o ENCAIXE, pré-pagamento
 * (reordenacao-cluster-fiscal-encaixe, 21/07). Saiu daqui e a contagem caiu 1.
 *
 * ─── ⚠️ A CORREÇÃO DE 19/07 — O CONTADOR MENTIA NO FIM ───────────────────
 * A v1 parava no N18, com esta justificativa: N19 e N20 travam enquanto o
 * boleto não compensa, então contá-los faria a barra da P2 prometer progresso
 * que o próprio pagamento bloqueia.
 *
 * O raciocínio otimizava a P2 e quebrava a P1. Quem paga de CARTÃO não tem
 * trava nenhuma: ele chegava em "9 de 9" achando que tinha acabado, e ainda
 * precisava revisar o dossiê, assinar o termo e assinar no GOV.BR. Mesma
 * mentira do rótulo "o próximo passo é só esse", que o Pedro pegou na mesma
 * rodada — corrigida no texto e deixada viva no número.
 *
 * Por isso entrou o **N19+N20 como UM passo** ("Revisar e confirmar"): pro
 * cliente é um ato só — conferir o que foi montado e autorizar a abertura. São
 * duas telas por razão jurídica (o racha do T18), não por razão de tarefa.
 *
 * ─── O QUE CONTINUA FORA, E POR QUÊ ──────────────────────────────────────
 * O **N23 (assinatura GOV.BR)** é ação dele, mas acontece DEPOIS de dias de
 * espera de órgão. Misturar "preencha isto agora" com "assine daqui a uma
 * semana" na mesma barra faria a contagem parar de andar sem ninguém entender
 * por quê — a culpa seria da JUCEMG, não do cliente. Ele vive na timeline do
 * painel (N21, arquétipo A8), que existe justamente pra mostrar espera.
 * 🟡 Se a decisão for que o cliente precisa ver uma barra única do começo ao
 * fim, isto muda — mas aí a barra tem que distinguir "sua vez" de "nossa vez".
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Passo {
  /** Rótulo humano. O cliente nunca vê "N14". */
  nome: string;
  /** Referência interna, pra rastrear até a tela. */
  tela: string;
  /** Só existe pra parte dos clientes — muda o TOTAL, não a ordem. */
  condicional?: boolean;
  /** Fica retido enquanto o boleto não compensa. */
  travaSemPagamento?: boolean;
}

export const PASSOS_DOSSIE: Passo[] = [
  { nome: "Seus dados", tela: "N10" },
  { nome: "Vínculo de trabalho", tela: "N11" },
  { nome: "Sócios", tela: "N12" },
  { nome: "Dados da empresa", tela: "N13" },
  { nome: "Atividades secundárias", tela: "N14" },
  { nome: "Tipo de empresa", tela: "N15" },
  // 🔑 DIGITAR É GRÁTIS, CHECAR É CARO (decisão do Pedro, 19/07).
  // O cliente escolhe o nome e a gente salva. A consulta na JUCEMG — que
  // provavelmente é RPA, não API ("JUCEMG não tem API conhecida", fluxo-
  // abertura-portais) — roda quando o pagamento cair, e volta com veredito
  // MAIS alternativas sugeridas por IA. Ninguém espera robô, e nenhum robô
  // roda por quem não pagou. De quebra a devolutiva fica melhor: ele recebe
  // opções filtradas em vez de tentar às cegas.
  // ⚠️ NÃO leva `travaSemPagamento`: o passo fica aberto, porque digitar o nome
  // é o trabalho dele e é grátis. O que espera o pagamento é só a checagem, e
  // isso é comportamento DO N16 — se explica lá dentro, na hora em que ele
  // digita, não como legenda na lista (que é mapa, não manual).
  { nome: "Nome da empresa", tela: "N16" },
  { nome: "Quanto você se paga", tela: "N18", travaSemPagamento: true },
  // N19 + N20 num passo só: pro cliente é um ato (conferir e autorizar). São
  // duas telas por razão jurídica, não por razão de tarefa.
  { nome: "Revisar e confirmar", tela: "N19+N20", travaSemPagamento: true },
];

/**
 * Os passos que ESTE cliente vai ver. Desde 21/07 não há mais passo
 * condicional (o CNAE ótimo virou o ENCAIXE, pré-pagamento), então todos veem
 * a mesma lista. A função e o campo `condicional` ficam pra manter a fonte
 * única, caso volte a haver ramificação de passos.
 */
export function passosDoCliente(): Passo[] {
  return PASSOS_DOSSIE.filter((p) => !p.condicional);
}
