/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATEGORIA DE ATIVIDADE — fonte única do flag que atravessa o flow.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 (reordenação do flow de entrada, ADR `marca/decisoes-marca.md`).
 *
 * ─── POR QUE ELA EXISTE ─────────────────────────────────────────────────────
 * A categoria virou **o gate de elegibilidade do produto**. Antes, quem
 * decidia se a gente atende era o veredito de CNAE (E5V), que rodava ANTES do
 * pagamento — e por isso o flow inteiro de descoberta de CNAE precisava vir
 * antes do dinheiro. A lista de categorias só oferece o que a Legalizai
 * atende, então escolher uma JÁ É passar pelo gate: o CNAE lá na frente
 * (`/dossie/atividade`, pós-pagamento) só refina dentro de um universo que já
 * é atendido, e por construção não pode mais devolver "não atendemos".
 *
 * Quem não se encontra na lista sai por `/veredito/waitlist` ANTES de pagar —
 * é a única porta de "não atendo" que sobra no caminho abrir.
 *
 * ─── MECANISMO ──────────────────────────────────────────────────────────────
 * `?cat=<id>` na URL, mesmo padrão de `lib/regime.ts` (`?regime=mei`) e
 * `lib/endereco.ts` (`?endereco=fiscal`) — não existe persistência real entre
 * telas (RF-01, dívida conhecida do projeto inteiro).
 *
 * O `id` é o mesmo das PILLS de `components/gate-telas.tsx` (fonte única das
 * 17 categorias, derivadas dos 103 CNAEs serviço-liso). Não duplicar a lista
 * aqui: quem precisa do rótulo importa `PILLS` e busca pelo id.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Lê a categoria escolhida no E3.3. `null` = não veio (deep-link direto). */
export function categoriaDe(searchParams: URLSearchParams): string | null {
  return searchParams.get("cat");
}

/** Anexa `?cat=<id>` (ou `&cat=<id>`) na rota, só quando houver categoria. */
export function comCategoria(rota: string, cat: string | null): string {
  if (!cat) return rota;
  return `${rota}${rota.includes("?") ? "&" : "?"}cat=${encodeURIComponent(cat)}`;
}
