"use client";

import { useRouter } from "next/navigation";
import { NomeView } from "@/components/wizard-dossie";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C7′ — SUGERIR MAIS 3 NOMES (2ª rodada) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — aberta pelo CTA do A3.1 quando as 3 primeiras
 * opções são recusadas pela Junta. É a MESMA `NomeView`, enxuta: só os 3
 * campos (vazios) e a ordenação. Objeto social e nome fantasia ficam de fora
 * — já foram definidos e não mudam por causa de um nome recusado.
 *
 * ─── POR QUE ROTA PRÓPRIA, E NÃO `?rodada=2` ───────────────────────────────
 * 🐛 A 1ª versão usava query. `novaRodada` alimenta inicializadores de
 * `useState` (quais campos existem, qual abre em edição), e `useSearchParams()`
 * chega VAZIO no render do servidor: o HTML saía com a tela completa da 1ª
 * rodada e só se corrigia depois da hidratação — que é exatamente o que o
 * preview do `/mapa` mostrava (o Pedro viu "ainda robusta").
 *
 * Com rota própria o valor é literal: servidor e cliente renderizam a mesma
 * coisa, sem flash e sem depender de hidratação. Vale a regra geral: variante
 * que muda o ESTADO INICIAL de uma tela merece rota, não query.
 *
 * Daqui o destino é o STATUS com a viabilidade recomeçando (A3‴) — não o
 * dossiê, que já acabou.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function NomeRodada2Page() {
  const router = useRouter();

  return (
    <NomeView
      novaRodada
      onSeguir={() => router.push("/aguardando?fase=junta&viabilidade=1")}
      onVoltar={() => router.push("/painel/recusa")}
    />
  );
}
