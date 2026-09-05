/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMO A INTERFACE FALA DOS SÓCIOS
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 05/09 — nasceu do áudio do Ademar sobre quem assina o contrato social:
 *
 *   "Se você cadastrou um, um assina; se cadastrou dois, dois assinam; se
 *    cadastrou dez, dez assinam. E independente de serem administradores ou
 *    não, todos assinam."
 *
 * O ramo assistido tinha sido construído com UM sócio no código (`SOCIO_2`), e
 * a copy dizia "Você e Carlos assinam juntos". Com 2 ou 3 sócios além do
 * titular — que o C3 permite, teto de 4 no total — a tela mentia. E mentia
 * VISIVELMENTE, citando um nome quando havia três pessoas.
 *
 * ─── A REGRA DE COPY QUE SAI DAÍ ──────────────────────────────────────────
 * Com UM sócio, o nome é a informação mais útil que cabe na frase: a pessoa
 * sabe exatamente quem precisa estar junto. Com DOIS OU MAIS, a lista de nomes
 * no meio de um texto corrido vira ruído ("Você, Carlos, Marina e Rafael
 * assinam juntos" quebra a leitura e ainda cresce sem teto). Aí a frase conta,
 * e a LISTA nomeia — cada forma no lugar em que ela é a certa.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** "Carlos Eduardo Silva" → "Carlos". */
export function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0];
}

/**
 * Como citar os OUTROS sócios no meio de uma frase (o titular não entra).
 *
 * 1 → "Carlos" · 2+ → "os outros 2 sócios" · 0 → null (não há o que citar)
 */
export function rotuloSocios(nomes: string[]): string | null {
  if (nomes.length === 0) return null;
  if (nomes.length === 1) return primeiroNome(nomes[0]);
  return `os outros ${nomes.length} sócios`;
}

/**
 * A mesma citação, mas como sujeito ao lado de "você".
 *
 * 1 → "Você e Carlos" · 2+ → "Você e mais 3 sócios"
 *
 * Existe separado do `rotuloSocios` porque "Você e os outros 3 sócios" soa
 * como se ela fosse a quarta de uma lista já conhecida, e "mais 3" diz o que
 * importa: além de você, três pessoas.
 */
export function sujeitoComSocios(nomes: string[]): string {
  if (nomes.length === 0) return "Você";
  if (nomes.length === 1) return `Você e ${primeiroNome(nomes[0])}`;
  return `Você e mais ${nomes.length} sócios`;
}

/** Concordância verbal do sujeito acima, pra frase não sair torta. */
export function verboSocios(nomes: string[], singular: string, plural: string) {
  return nomes.length === 0 ? singular : plural;
}
