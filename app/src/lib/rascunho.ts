/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RASCUNHO DO FLOW — o que já foi respondido antes do pagamento
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — "se a pessoa preencheu o endereço lá no E3.4,
 * quando chegar no C4 já tem que vir preenchido; ela só completa o que falta".
 *
 * ─── POR QUE NÃO VIAJA NA QUERYSTRING ──────────────────────────────────────
 * Os flags que atravessam o wizard hoje (`?regime`, `?endereco`, `?cat`) são
 * ESCOLHAS de categoria — cabem numa URL sem expor ninguém. CEP, número e
 * complemento são o endereço de uma pessoa: cair em log de servidor, histórico
 * de navegador ou print de tela é vazamento. É a mesma regra que já impediu
 * nome/CPF/telefone de viajarem por URL (RF-01, registrado no E3.1).
 *
 * Então o rascunho vive em `sessionStorage`: morre ao fechar a aba, não entra
 * em URL nenhuma, e some sozinho. É MOCK de estado — no app real esses dados
 * já estariam no servidor, presos à conta criada no E6, e a tela leria de lá.
 * O contrato desta função é o mesmo nos dois mundos: "me dê o que a pessoa já
 * respondeu"; só a fonte muda.
 *
 * ⚠️ Sempre com try/catch: navegador em aba anônima, storage cheio ou
 * bloqueado por política lançam exceção no ACESSO, não no uso. Uma tela do
 * dossiê não pode quebrar porque o rascunho não estava lá.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CHAVE = "legalizai:rascunho-endereco";

export interface RascunhoEndereco {
  /** CEP como o usuário digitou (com máscara). */
  cep: string;
  numero: string;
  complemento: string;
  /**
   * 🆕 01/09 — tipo do imóvel e residência do titular subiram do C4 pro E3.4
   * (pré-pagamento), porque é a regra que decide deferimento na Prefeitura de
   * BH. Viajam junto do resto do endereço: o C4 mostra o que já foi respondido
   * em vez de reperguntar.
   */
  tipoImovel: string;
  /** `null` = não respondeu (ex.: MEI, que não passa por essa regra). */
  resideNoEndereco: boolean | null;
}

export function salvarRascunhoEndereco(dados: RascunhoEndereco): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Sem rascunho a pessoa só digita de novo — pior UX, nunca erro de tela.
  }
}

export function lerRascunhoEndereco(): RascunhoEndereco | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Partial<RascunhoEndereco>;
    if (typeof dados?.cep !== "string") return null;
    return {
      cep: dados.cep,
      numero: typeof dados.numero === "string" ? dados.numero : "",
      complemento: typeof dados.complemento === "string" ? dados.complemento : "",
      tipoImovel: typeof dados.tipoImovel === "string" ? dados.tipoImovel : "",
      resideNoEndereco:
        typeof dados.resideNoEndereco === "boolean" ? dados.resideNoEndereco : null,
    };
  } catch {
    return null;
  }
}

export function limparRascunhoEndereco(): void {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    // idem: limpar é conveniência, nunca requisito.
  }
}
