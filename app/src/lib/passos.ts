/**
 * ═══════════════════════════════════════════════════════════════════════════
 * OS PASSOS DO CLIENTE — fonte única de "quantos passos faltam".
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
 * ─── 🔴 28/08 — REESCRITO DO ZERO (pedido do Pedro: "essa ordem está
 * desatualizada") ───────────────────────────────────────────────────────────
 * A lista antiga só cobria o dossiê pós-pagamento (C1-C7, com numeração N10-
 * N20 de antes da reordenação de 27/08) e tinha 2 problemas reais:
 *
 *   1. **Faltava tudo ANTES do pagamento.** A pessoa front-load já preenche
 *      dados base (E3.1) e escolhe+paga o plano (E7-E9) antes de entrar no
 *      dossiê — nenhum dos dois aparecia na lista, e "3 de 8" mentia sobre
 *      quanto trabalho já tinha sido feito de verdade.
 *   2. **Faltava a C0 (CNAE principal).** Ela nasceu em 27/08 (moveu de
 *      antes do pagamento pra depois) e este arquivo nunca foi atualizado —
 *      exatamente o aviso que o header antigo já dava: "ao remover tela do
 *      flow, revisitar este arquivo" — aqui foi o oposto, uma tela NASCEU e
 *      ninguém avisou este arquivo.
 *
 * A ORDEM também mudou de verdade no código (não só na lista): CNAE
 * secundário (C5) saiu de depois de "Dados da empresa" (C4) e passou pra
 * logo depois da atividade principal (C0) — sequência mais natural pra quem
 * acabou de escolher o CNAE. Ver `dossie/atividade`, `dossie/cnae-
 * secundarios` e `dossie/empresa` (page.tsx de cada um, onde a navegação real
 * mudou junto).
 *
 * ─── O QUE CONTA COMO PASSO ──────────────────────────────────────────────
 * Tudo que exige AÇÃO do cliente até a empresa entrar na máquina — do
 * primeiro dado que ele digita (E3.1) até autorizar a abertura (A2).
 *
 * ⚠️ "Plano escolhido e pago" conta como FEITO assim que o cliente submeteu o
 * pagamento (cartão aprovado OU boleto emitido) — não espera o boleto
 * compensar. A ação dele (escolher + pagar) já aconteceu; o banco compensar é
 * problema de BACKEND, não passo do cliente. É por isso que existe a tela de
 * "Aguardando boleto" (E9.1) sem duplicar essa espera dentro da lista.
 *
 * ⚠️ "Sócios" é CONDICIONAL, de verdade agora (antes o campo existia mas
 * `passosDoCliente()` nunca filtrava nada — comentário antigo dizia "desde
 * 21/07 não há mais passo condicional"). Duas razões pra sumir:
 *   · **MEI nunca tem sócio** (unipessoal por definição, art. 966 CC) — some
 *     sempre que `mei` for `true`.
 *   · **ME solo também não tem** — a pessoa respondeu isso na Triagem (E5T /
 *     M-T, "Quantas pessoas vão ser donas da empresa?"), e "Só eu" tira o
 *     passo da lista. Só aparece pra quem indicou 2+ sócios lá atrás.
 *
 * ─── O QUE FICOU FORA, E POR QUÊ ──────────────────────────────────────────
 * **"Tipo de empresa" (C6, natureza jurídica) não é mais item da lista.**
 * Pedido explícito do Pedro (28/08): a lista nova tem 9 passos antes de
 * "Revisar e confirmar", e C6 não está entre eles. A tela continua existindo
 * no flow real (`dossie/natureza`) — só parou de ser contada como passo
 * separado. 🟡 Não sei se foi omissão ou decisão deliberada; fica registrado
 * aqui pra não virar surpresa se alguém notar a tela sem contraparte na lista.
 *
 * O **N23 (assinatura GOV.BR)** continua fora pelo mesmo motivo de sempre:
 * acontece DEPOIS de dias de espera de órgão, e misturar "preencha agora" com
 * "assine daqui a uma semana" na mesma barra faria a contagem parar de andar
 * sem ninguém entender por quê. Ele vive na timeline do painel (A3).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Passo {
  /** Rótulo humano. O cliente nunca vê o código interno. */
  nome: string;
  /** Referência interna, pra rastrear até a tela (código do flow-data.mjs). */
  tela: string;
  /** Só existe pra parte dos clientes — muda o TOTAL, não a ordem. */
  condicional?: boolean;
  /** Fica retido enquanto o boleto não compensa. */
  travaSemPagamento?: boolean;
}

export const PASSOS_CLIENTE: Passo[] = [
  { nome: "Dados base preenchidos", tela: "E3.1" },
  { nome: "Plano escolhido e pago", tela: "E7+E9" },
  { nome: "CNAE principal da empresa", tela: "C0" },
  { nome: "CNAE secundário da empresa", tela: "C5" },
  { nome: "Dados pessoais complementares", tela: "C1" },
  { nome: "Dados do INSS", tela: "C2" },
  { nome: "Sócios", tela: "C3", condicional: true },
  { nome: "Endereço fiscal da empresa", tela: "C4" },
  { nome: "Nome da empresa e razão social", tela: "C7" },
  // N19+N20 num passo só: pro cliente é um ato (conferir e autorizar). São
  // duas telas por razão jurídica (o racha do T18), não por razão de tarefa.
  { nome: "Revisar e confirmar", tela: "A1+A2", travaSemPagamento: true },
];

/**
 * Os passos que ESTE cliente vai ver.
 *
 * `mei` — some com "Sócios" (MEI não tem, art. 966 CC).
 * `temSocios` — some com "Sócios" pra ME que respondeu "Só eu" na Triagem.
 *   Default `true` (mostra) por segurança: melhor mostrar um passo a mais
 *   pra quem não passou o dado ainda do que esconder um passo real.
 */
export function passosDoCliente({
  mei = false,
  temSocios = true,
}: { mei?: boolean; temSocios?: boolean } = {}): Passo[] {
  return PASSOS_CLIENTE.filter((p) => !p.condicional || (!mei && temSocios));
}
