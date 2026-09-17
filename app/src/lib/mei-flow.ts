/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A ESPINHA DO CAMINHO MEI — fonte única da ordem das telas.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (decisão do Pedro): o MEI deixa de ser "o ME com `?regime=mei`" e
 * passa a ter caminho, rotas e telas PRÓPRIAS, sob `/mei/*`.
 *
 * ─── POR QUE O FORK ─────────────────────────────────────────────────────────
 * Até 28/08 o MEI morava dentro dos componentes do ME, guardado por uma prop
 * `mei`. Funcionou por 3 dias. Entre 30/08 e 05/09 o ME evoluiu (E8 eliminado,
 * A2 aposentada, A3 fundida no `/aguardando`, splashes de pagamento) e o MEI
 * herdou 4 defeitos SEM NINGUÉM MEXER NELE:
 *
 *   · a rota do contrato dele (`/contrato?regime=mei`) morreu junto com o E8;
 *   · a rota do termo (`/termo?regime=mei`) morreu junto com a A2, e o MEI
 *     passou a cair numa tela de VIABILIDADE — que foi extinta pro MEI pela
 *     Res. CGSIM 61/2020;
 *   · o status dele (`/painel?regime=mei`) ficou inalcançável, e ele passou a
 *     ver "fase Junta" — órgão pelo qual o MEI não passa;
 *   · e ele parou de ver os splashes de pagamento, que nasceram só pro ME.
 *
 * Nenhum desses foi erro de quem mexeu no ME. Foi o ARRANJO: herança sem
 * fronteira. O fork existe pra que uma mudança no ME não possa mais chegar
 * no MEI por acidente — e vice-versa.
 *
 * ─── O QUE ESTE ARQUIVO RESOLVE, ALÉM DA ORDEM ──────────────────────────────
 * Ele é a resposta em código pra regra 6 do CLAUDE.md (a que apareceu 4 vezes
 * em 02/09 e mais uma em 04/09):
 *
 *   (a) **toda tela do wizard tem VOLTAR** — `anterior()` sempre devolve um
 *       destino pra quem está na espinha, então a página não tem como esquecer;
 *   (b) **o `meta` nomeia o DESTINO do voltar, não a própria tela** —
 *       `metaDoVoltar()` deriva isso do passo ANTERIOR. Não dá pra errar
 *       escrevendo o nome errado à mão, porque não se escreve à mão.
 *
 * ⚠️ Quem NÃO está na espinha (saídas terminais, splashes) declara isso: as
 * saídas usam `semVoltar` ou voltam pra tela que as abriu.
 *
 * 🔗 Espelho: `produto/_flow/flow-data.mjs` (caminho `mei`). Ao mexer aqui,
 * rodar `node produto/_flow/gerar-mapa.mjs` — a auditoria de espelho avisa o
 * que ficou solto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface PassoMei {
  /** Código curto, o mesmo do `flow-data.mjs` e do mapa. */
  id: string;
  /** Rota de produção. Toda tela do ramo mora sob `/mei/`. */
  rota: string;
  /**
   * Nome humano da tela. É ele que vira o `meta` do cabeçalho da tela
   * SEGUINTE (o `meta` nomeia pra onde o voltar leva, não onde você está).
   */
  nome: string;
}

/**
 * A espinha, em ordem. Só telas que a pessoa atravessa em sequência.
 *
 * ⚠️ Splashes ficam FORA: eles são transições sem CTA e sem voltar, e entrar
 * na espinha faria o `anterior()` mandar a pessoa pra uma tela que se
 * auto-avança (ela voltaria e seria empurrada pra frente de novo).
 */
export const ESPINHA_MEI: PassoMei[] = [
  { id: "M1", rota: "/mei/endereco", nome: "Onde você trabalha" },
  { id: "M2", rota: "/mei/impedimentos", nome: "Quem pode ser MEI" },
  { id: "M3", rota: "/mei/faturamento", nome: "Seu faturamento" },
  { id: "M4", rota: "/mei/conta", nome: "Sua conta" },
  { id: "M5", rota: "/mei/plano", nome: "Seu plano" },
  { id: "M6", rota: "/mei/pagamento", nome: "Pagamento" },
  /* 🔄 07/09 (pedido do Pedro) — a ocupação deixou de ser UMA tela.
     Ela virou o bloco ATIVIDADE, no sistema aprovado da C0/C5 do ME:
     chegada → escolha da principal → secundárias → splash de fecho. A rota
     `/mei/ocupacao` (uma lista simples com principal e secundárias juntas)
     saiu junto. Os splashes ficam fora da espinha, como sempre. */
  { id: "M7", rota: "/mei/atividade", nome: "Sua atividade" },
  { id: "M7_S", rota: "/mei/atividade-secundarias", nome: "Atividades secundárias" },
  { id: "M8", rota: "/mei/titular", nome: "Seus dados" },
  { id: "M9", rota: "/mei/empresa", nome: "Seu endereço" },
  { id: "M10", rota: "/mei/nome", nome: "Nome da empresa" },
  { id: "M11", rota: "/mei/revisar", nome: "Revisar e autorizar" },
  { id: "M12", rota: "/mei/status", nome: "Acompanhamento" },
  { id: "M13", rota: "/mei/proximos-passos", nome: "Últimos passos" },
  { id: "M14", rota: "/mei/certificado", nome: "Certificado digital" },
];

/**
 * De onde o MEI VEM quando entra na espinha.
 *
 * 🔒 É o único ponto em que o caminho MEI toca o caminho do ME, e é de mão
 * única: o fork (E3.2, "MEI × ME") empurra pra cá e nunca mais recebe de
 * volta — exceto pelo voltar da M1, que é esta rota.
 */
export const ENTRADA_MEI = "/entrada?intencao=abrir";

/**
 * Pra onde o MEI SAI quando termina: a casa, que é compartilhada de propósito.
 *
 * O portal do dia 1 não é tela de abertura — é o produto que MEI e ME assinam
 * igual (com o conteúdo variando por regime lá dentro). Forkar a casa seria
 * duplicar o app inteiro, não o caminho de abertura.
 */
export const SAIDA_MEI = "/home-dia1?regime=mei";

/** Índice do passo na espinha. -1 = não está nela (saída, splash, deep-link). */
function indiceDe(rota: string): number {
  return ESPINHA_MEI.findIndex((p) => p.rota === rota);
}

/** O passo, pelo id. */
export function passoMei(id: string): PassoMei | undefined {
  return ESPINHA_MEI.find((p) => p.id === id);
}

/**
 * A rota ANTERIOR na espinha — o destino do voltar.
 * Na primeira tela, devolve o fork (de onde o MEI entrou).
 */
export function anterior(rota: string): string {
  const i = indiceDe(rota);
  if (i <= 0) return ENTRADA_MEI;
  return ESPINHA_MEI[i - 1].rota;
}

/**
 * A rota SEGUINTE na espinha — o destino do CTA.
 * Na última tela, devolve a casa.
 */
export function proxima(rota: string): string {
  const i = indiceDe(rota);
  if (i < 0 || i === ESPINHA_MEI.length - 1) return SAIDA_MEI;
  return ESPINHA_MEI[i + 1].rota;
}

/**
 * O `meta` do cabeçalho: o nome de PRA ONDE O VOLTAR LEVA.
 *
 * 🔴 Esta função existe por causa do erro que apareceu 4 vezes em 02/09: o
 * `meta` recebia o nome da própria tela. Aqui não dá — ele é sempre derivado
 * do passo anterior, e a primeira tela cai no rótulo do fork.
 */
export function metaDoVoltar(rota: string): string {
  const i = indiceDe(rota);
  if (i <= 0) return "MEI ou ME";
  return ESPINHA_MEI[i - 1].nome;
}

/* ═══════════════════ AS SAÍDAS (fora da espinha) ════════════════════════ */

/**
 * Os 2 bloqueios do ramo. 🔄 07/09 (pedido do Pedro) — DEIXARAM DE SER TELA.
 *
 * Eram `/mei/saida/ja-tem-cnpj` e `/mei/saida/servidor`, e viraram estado da
 * própria M2, alcançável por `?bloqueio=`. Mesmo movimento que o ME fez em
 * 04/09 com o E6.2 (`/conta?cpf=nome`): o que muda o que a tela mostra
 * continua sendo nó do mapa, sem precisar de rota própria.
 *
 * A mudança apagou uma repetição real: a M2 já abria o aviso do bloqueio
 * inline e, logo depois, mandava a pessoa pra outra tela dizer a mesma coisa
 * com mais detalhe.
 *
 * ⚠️ Nenhum dos dois é "não atendemos". Os dois dizem o contrário: a Legalizai
 * atende essa pessoa hoje, só não como MEI. É a diferença entre bloqueio do
 * GOVERNO (que a gente só informa) e recusa do PRODUTO (que a gente não faz).
 */
export const BLOQUEIOS_MEI = {
  /** M2.1 — já é sócio/titular de outra PJ (LC 123 art. 18-A). */
  jaTemCnpj: "/mei/impedimentos?bloqueio=ja-tem-cnpj",
  /** M2.2 — servidor público federal na ativa (Lei 8.112/90). */
  servidor: "/mei/impedimentos?bloqueio=servidor",
} as const;
