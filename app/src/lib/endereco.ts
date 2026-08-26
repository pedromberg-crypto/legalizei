/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENDEREÇO FISCAL — fonte única do flag que atravessa o flow depois do gate.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 26/08 (reunião Rua Satélite 36, item 2). Antes, a escolha "uso um
 * endereço meu × quero o fiscal da Legalizai" só existia no C4 (dossiê,
 * `/dossie/empresa`), depois do pagamento — e o custo de +R$60/mês nem
 * aparecia na "conta da abertura" (E7, `/plano`), que já tinha essa
 * pendência documentada (`⚠️ a "conta total" desta tela não é total`).
 *
 * Decisão da reunião: a pergunta sai da FaixaView (`/gate`, antes até do
 * cadastro) e o valor já soma na mensalidade mostrada no `/plano`, com
 * explicação sucinta. Mesmo mecanismo do `lib/regime.ts` (`?regime=mei`) —
 * não existe persistência real entre telas (RF-01), então isso é o padrão já
 * usado pra atravessar o wizard inteiro via querystring.
 *
 * Só "fiscal" é escrito na URL — "proprio" e ausente têm o MESMO
 * comportamento (endereço próprio é o default), não precisa de 2 valores.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function ehEnderecoFiscal(searchParams: URLSearchParams): boolean {
  return searchParams.get("endereco") === "fiscal";
}

/** Anexa `?endereco=fiscal` (ou `&endereco=fiscal`) na rota, só quando aplicável. */
export function comEndereco(rota: string, fiscal: boolean): string {
  if (!fiscal) return rota;
  return `${rota}${rota.includes("?") ? "&" : "?"}endereco=fiscal`;
}
