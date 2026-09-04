/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DICIONÁRIO DE CNAE — fonte única do nome de cada código
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 04/09 (decisão do Pedro, saída da auditoria C0→A2 com Playwright).
 *
 * ─── O PROBLEMA QUE ISTO MATA ──────────────────────────────────────────────
 * O MESMO código tinha 3 nomes diferentes, um por tela:
 *
 *   6202-3/00 → "Sistema sob medida, customizável"       (C0, resultados)
 *              → "Sistemas de computador sob encomenda"   (C5, sugestões)
 *              → "desenvolvimento de sistemas sob encomenda" (A1, recap)
 *   7410-2/99 → "Design gráfico (logo, material impresso)" × "Design gráfico
 *              e identidade visual"
 *
 * Cada tela tinha a sua lista, escrita à mão, e ninguém era obrigado a
 * concordar com a outra. Quem escolheu um nome no C0 não reconhecia o mesmo
 * CNAE no C5 nem no recap — e é o mesmo código que vai pro DBE e pro contrato.
 *
 * ─── A REGRA TRAVADA (Pedro, 04/09) ────────────────────────────────────────
 * Vale o nome OFICIAL do IBGE/CONCLA, em todo lugar onde o CNAE aparece.
 * Fonte: `pesquisa/cnae-matriz/cnae-matriz.csv` (subclasse, 1332 códigos, base
 * CONCLA). O CSV guarda em CAIXA ALTA; aqui fica em caixa de frase, porque
 * caixa alta em tela é grito, não fidelidade.
 *
 * ⚠️ NOTA DE HONESTIDADE (registrada, não desfeita): o nome oficial é jargão
 * de estatística, não linguagem de gente. "Atividades de design não
 * especificadas anteriormente" é o nome real do 7410-2/99, e ele é pior de
 * entender que "Design gráfico (logo, material impresso)". Por isso cada
 * código carrega TAMBÉM um `explica`, uma linha em português de gente que as
 * telas mostram junto — o nome identifica, a linha explica. Se um dia a gente
 * quiser inverter (humano em cima, oficial embaixo), muda-se aqui e nas telas
 * que leem daqui, não em 4 listas espalhadas.
 *
 * 🔴 Este arquivo cobre só os 9 CNAEs do mock de demonstração (a família de TI
 * do caso Ana). Quando o motor real de CNAE entrar, ele passa a alimentar este
 * dicionário a partir do CSV inteiro — a forma não muda.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type VerbeteCnae = {
  /** Nome oficial IBGE/CONCLA da subclasse, em caixa de frase. */
  oficial: string;
  /** Uma linha do que isso significa na prática. Nunca substitui o oficial. */
  explica: string;
};

/** Indexado pelo código formatado, que é como ele aparece em tela. */
export const CNAES: Record<string, VerbeteCnae> = {
  "6201-5/02": {
    oficial: "Web design",
    explica: "Criação de sites, páginas e presença digital pra outras empresas.",
  },
  "6201-5/01": {
    oficial: "Desenvolvimento de programas de computador sob encomenda",
    explica: "Você escreve o programa sob medida pro cliente que pediu.",
  },
  "6202-3/00": {
    oficial: "Desenvolvimento e licenciamento de programas de computador customizáveis",
    explica: "Sistema que você adapta pra cada cliente e licencia o uso.",
  },
  "6203-1/00": {
    oficial: "Desenvolvimento e licenciamento de programas de computador não customizáveis",
    explica: "Software pronto, igual pra todo mundo que compra.",
  },
  "6204-0/00": {
    oficial: "Consultoria em tecnologia da informação",
    explica: "Você orienta a decisão de tecnologia, sem entregar o código.",
  },
  "6209-1/00": {
    oficial: "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
    explica: "Manter no ar o que já existe: suporte, ajuste, manutenção.",
  },
  "6311-9/00": {
    oficial:
      "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet",
    explica: "Hospedagem e infraestrutura pra manter sites e sistemas rodando.",
  },
  "6319-4/00": {
    oficial: "Portais, provedores de conteúdo e outros serviços de informação na internet",
    explica: "Portal ou site de conteúdo próprio, mantido por você.",
  },
  "7410-2/99": {
    oficial: "Atividades de design não especificadas anteriormente",
    explica: "Design gráfico: logo, identidade visual, material impresso.",
  },
};

/**
 * O nome que vai em tela. Sem verbete, devolve o próprio código — some o nome,
 * nunca o dado, e o buraco fica visível em vez de virar string vazia.
 */
export function nomeCnae(codigo: string, seNaoTiver?: string): string {
  return CNAES[codigo]?.oficial ?? seNaoTiver ?? codigo;
}

/** A linha de apoio. Vazia quando o código não está no dicionário. */
export function explicaCnae(codigo: string): string {
  return CNAES[codigo]?.explica ?? "";
}

/**
 * Versão pro OBJETO SOCIAL, que é texto corrido dentro de uma frase ("prestação
 * de serviços de …"). Minúscula porque emenda na frase, e é assim que o
 * contrato padrão da JUCEMG escreve.
 */
export function nomeCnaeEmFrase(codigo: string): string {
  const n = nomeCnae(codigo);
  return n.charAt(0).toLowerCase() + n.slice(1);
}
