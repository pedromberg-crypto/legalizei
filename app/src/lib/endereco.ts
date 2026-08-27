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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 — VALIDAÇÃO REAL DE BH (substitui o gate de cidade E4).
 * ═══════════════════════════════════════════════════════════════════════════
 * O E4 perguntava "é em BH?" e confiava na resposta. Autodeclaração não é
 * validação: a única checagem de cidade que existia no produto inteiro era um
 * clique em "Sim, é em BH". Com o E4 removido (ADR 27/08), o gate vira o CEP
 * de verdade, no E3.3.
 *
 * ─── A REGRA FISCAL QUE SUSTENTA ISSO ──────────────────────────────────────
 * O município da empresa segue o ENDEREÇO DA SEDE, não o domicílio pessoal do
 * dono. Quem mora fora de BH pode ter empresa sediada em BH, desde que exista
 * um endereço válido em BH pra ser a sede. Por isso a tela não pergunta onde a
 * pessoa mora: pergunta onde a EMPRESA vai ficar, e aceita duas respostas
 * (endereço próprio em BH, ou o endereço fiscal da Legalizai, que é a sede
 * física da Legalize Digital em BH).
 *
 * ⚠️ Faixa oficial de CEP de Belo Horizonte: 30000-000 a 31999-999 (Correios).
 * Contagem começa em 32000-000 e NÃO entra: municípios da região
 * metropolitana são JUCEMG igual, mas prefeitura/ISS diferentes, e o MLP só
 * atende BH. 🟡 Faixa não ratificada em fonte primária nesta rodada.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ehCepBh(cep: string): boolean {
  const d = cep.replace(/\D/g, "");
  if (d.length !== 8) return false;
  const n = Number(d);
  return n >= 30000000 && n <= 31999999;
}
