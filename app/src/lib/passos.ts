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
 * ⚠️ "Plano escolhido e pago" conta como FEITO no denominador assim que o
 * cliente submeteu o pagamento (cartão aprovado OU boleto emitido) — não
 * espera o boleto compensar. A ação dele (escolher + pagar) já aconteceu.
 * 🔄 28/08 (correção do Pedro): mas o VISUAL desse item específico ("Feito" +
 * check verde) mentiria enquanto o boleto não caiu — parece pagamento
 * confirmado, e não é. Enquanto `pagamentoPendente`, esse item mostra o
 * mesmo idioma "girando" do `StatusIcon` (anel azul, info): a vez é do
 * banco, não do cliente. Vira check verde de verdade assim que compensa.
 * Marcado via `aguardaCompensacao` abaixo — só ele reage a isso.
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
 * "Revisar e confirmar", e C6 não está entre eles. 🔒 31/08 (reunião Rua
 * Satélite 38-40): ficou confirmado que era decisão deliberada — a tela
 * inteira (`dossie/natureza`) foi REMOVIDA do flow real (rota deletada). SLU
 * × LTDA virou decisão 100% interna (ver `PREENCHIDOS_INTERNAMENTE` em
 * `execucao/flow/flow-data.mjs`), então nem fazia sentido continuar contada.
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
  /** 🆕 01/09 — some pra quem usa o endereço fiscal da Legalizai (o C4 inteiro
   *  deixa de existir pra essa pessoa; MEI é exceção e continua vendo). */
  soEnderecoProprio?: boolean;
  /** Fica retido enquanto o boleto não compensa. */
  travaSemPagamento?: boolean;
  /** Já é "feito" no total, mas o boleto pendente pinta de "girando" (azul),
   *  não de check verde — o banco ainda não confirmou. */
  aguardaCompensacao?: boolean;
  /** 🆕 28/08 (correção do Pedro) — nome a mostrar ENQUANTO `girando`. "Plano
   *  escolhido e PAGO" mente enquanto o boleto não caiu (nada foi pago de
   *  verdade ainda); vira o nome cheio assim que compensa. */
  nomeEnquantoGirando?: string;
  /**
   * 🆕 31/08 (pedido do Pedro, fusão A3+E9) — sub-descrição mostrada só
   * quando o passo é o ATUAL: o que ele envolve + quanto tempo costuma levar
   * (orienta pro que vem, tira a ansiedade do "quanto falta"). Pro passo que
   * `aguardaCompensacao`, esta descrição SUBSTITUI o "Em andamento agora..."
   * genérico enquanto girando.
   */
  descricao?: string;
}

export const PASSOS_CLIENTE: Passo[] = [
  {
    nome: "Dados base preenchidos",
    tela: "E3.1",
    descricao: "Nome, e-mail e telefone. Leva menos de 1 minuto.",
  },
  {
    nome: "Plano escolhido e pago",
    tela: "E7+E9",
    aguardaCompensacao: true,
    nomeEnquantoGirando: "Plano escolhido",
    descricao: "Aguardando o banco confirmar o boleto. Costuma cair em 1 a 3 dias úteis.",
  },
  {
    nome: "CNAE principal da empresa",
    tela: "C0",
    descricao: "Descreve o que sua empresa faz e a gente encontra o código certo. Leva cerca de 2 minutos.",
  },
  {
    nome: "CNAE secundário da empresa",
    tela: "C5",
    descricao: "Opcional: outras atividades que você também exerce. Leva cerca de 1 minuto.",
  },
  {
    nome: "Dados pessoais complementares",
    tela: "C1",
    descricao: "RG, data de nascimento e estado civil. Leva cerca de 2 minutos.",
  },
  {
    nome: "Dados do INSS",
    tela: "C2",
    descricao: "Se você já contribui por fora. Leva menos de 1 minuto.",
  },
  {
    nome: "Sócios",
    tela: "C3",
    condicional: true,
    descricao: "Nome e participação de cada sócio extra. Leva cerca de 2 minutos.",
  },
  {
    nome: "Endereço fiscal da empresa",
    tela: "C4",
    /**
     * 🆕 01/09 (pedido do Pedro) — some pra quem escolheu o endereço fiscal
     * da Legalizai no E3.4: a tela inteira deixa de existir pra essa pessoa
     * (nada ali é sobre um imóvel dela), então contar o passo seria prometer
     * um trabalho que ela não vai ter.
     */
    soEnderecoProprio: true,
    // ✍️ 01/09 — a descrição prometia capital social, que saiu da tela em
    // 31/08 (travado em R$10.000 no backend).
    descricao: "CEP, IPTU e tipo do imóvel. Leva cerca de 3 minutos.",
  },
  {
    nome: "Nome da empresa e razão social",
    tela: "C7",
    descricao: "3 opções de nome, sugeridas por IA. Leva cerca de 2 minutos.",
  },
  // N19+N20 num passo só: pro cliente é um ato (conferir e autorizar). Eram
  // duas telas por razão jurídica (o racha do T18).
  // 🔄 01/09 — agora é uma tela só de verdade: a A2 (`/termo`) foi eliminada e
  // o aceite virou o último bloco do A1. O passo já era único pro cliente,
  // então a contagem não muda — só a referência interna.
  {
    nome: "Revisar e confirmar",
    tela: "A1",
    travaSemPagamento: true,
    descricao: "Confere tudo e autoriza a abertura. Leva cerca de 2 minutos.",
  },
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
  enderecoFiscal = false,
}: { mei?: boolean; temSocios?: boolean; enderecoFiscal?: boolean } = {}): Passo[] {
  return PASSOS_CLIENTE.filter((p) => {
    if (p.condicional && (mei || !temSocios)) return false;
    // 🆕 01/09 — C4 some pra ME com endereço fiscal nosso. O MEI mantém a tela
    // (a pergunta "Como você atende?" é dele), então mantém o passo.
    if (p.soEnderecoProprio && enderecoFiscal && !mei) return false;
    return true;
  });
}
