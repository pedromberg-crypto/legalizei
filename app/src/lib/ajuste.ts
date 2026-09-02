import { BLOCOS } from "@/lib/passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODO AJUSTE — voltar a um bloco, corrigir, e sair por onde entrou
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — quem toca em "Ajustar" na tela de status entra
 * na PRIMEIRA tela do bloco, anda só dentro dele e, na ÚLTIMA, encontra o CTA
 * "Atualizar dados", que devolve pro status.
 *
 * ─── POR QUE UM MODO, E NÃO SÓ UM LINK ────────────────────────────────────
 * Sem confinamento, quem entrasse pra trocar o CNAE cairia de volta no trilho
 * normal do wizard e refaria o dossiê inteiro até o A1 — a pessoa veio mudar
 * uma coisa e sairia obrigada a reconfirmar dez. O `?ajuste=<bloco>` viaja
 * junto na navegação e é ele que diz "você está corrigindo, não preenchendo".
 *
 * 🔒 A regra de saída é a mesma do resto: nada disso existe depois do
 * protocolo — lá o "Ajustar" nem aparece (`podeAjustar={false}`).
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Rota do status, pra onde o ajuste sempre volta. */
export const ROTA_STATUS = "/aguardando";

/** Lê `?ajuste=N` e devolve o bloco, se houver um válido em edição. */
export function blocoEmAjuste(sp: URLSearchParams) {
  const id = Number(sp.get("ajuste"));
  if (!Number.isFinite(id)) return null;
  const bloco = BLOCOS.find((b) => b.id === id);
  return bloco && bloco.telas.length > 0 ? bloco : null;
}

/** Acrescenta (ou preserva) o marcador de ajuste numa rota. */
export function comAjuste(rota: string, blocoId: number): string {
  return `${rota}${rota.includes("?") ? "&" : "?"}ajuste=${blocoId}`;
}

/**
 * O que o CTA da tela atual deve fazer quando o ajuste está ativo.
 * `null` = não está em ajuste (ou a tela não pertence ao bloco): o chamador
 * segue com a navegação normal do wizard.
 */
export function passoDoAjuste(
  sp: URLSearchParams,
  rotaAtual: string,
): { label: string; destino: string } | null {
  const bloco = blocoEmAjuste(sp);
  if (!bloco) return null;
  const i = bloco.telas.indexOf(rotaAtual);
  if (i === -1) return null;
  const ultima = i === bloco.telas.length - 1;
  return ultima
    ? { label: "Atualizar dados", destino: ROTA_STATUS }
    : { label: "Continuar", destino: comAjuste(bloco.telas[i + 1], bloco.id) };
}
