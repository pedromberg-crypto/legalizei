/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REGIME (MEI × ME) — fonte única do flag que atravessa o flow depois do E5.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 03/08. Decidido no `/gate` (`elegivelParaMei` + `MeiOuMeView`), depois da
 * faixa de faturamento. Carregado via `?regime=mei` na URL — não existe
 * persistência real entre telas (RF-01 é dívida conhecida do projeto
 * inteiro), então isso é o mesmo mecanismo já usado pra `?fluxo=migrar`.
 *
 * Só "mei" é escrito na URL — "me" e ausente têm o MESMO comportamento (ME é
 * o default), não precisa de 2 valores.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function ehMei(searchParams: URLSearchParams): boolean {
  return searchParams.get("regime") === "mei";
}

/** Anexa `?regime=mei` (ou `&regime=mei`) na rota, só quando for MEI. */
export function comRegime(rota: string, mei: boolean): string {
  if (!mei) return rota;
  return `${rota}${rota.includes("?") ? "&" : "?"}regime=mei`;
}
