"use client";

import { HomeAtivacaoView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOME · DIA-1 (ativação) — P0 do dia-2 · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`HomeAtivacaoView`) desde
 * 29/07 — entrou na fidelidade por construção quando o Pedro validou que é
 * ESTA tela (não o N24 nem o gate isolado `/certificado`) que segue a
 * assinatura (N22). Esta page é o wrapper.
 *
 * A home NÃO é a mesma no dia-1 e em regime (decisão do cruzamento + auto-
 * auditoria): empresa recém-nascida tem faturamento 0 e Fator R projetado,
 * então o diferencial (vigília/monitoramento) ainda não tem o que vigiar. O
 * que ela precisa é ATIVAR. Por isso a home dia-1 é uma TRILHA DE ATIVAÇÃO:
 *   1. Celebra o nascimento do CNPJ — ⚠️ 29/07: SEM confete nem selo coral no
 *      topo do card (removidos a pedido, decisão do dia — mesmo padrão que
 *      tirou a celebração do CTA do veredito 🟢 e a materialização do N24).
 *   2. Checklist com progresso: o certificado é o gate universal (destrava
 *      emitir + impostos) → é o passo "agora".
 *   3. Tranquiliza: o 1º imposto só chega quando faturar. Sem pressa, sem susto.
 *   4. Aprenda (blog) + Quem cuida (canal humano) — reuso dos campeões.
 *
 * A transição dia-1 → regime é data-driven no real (faturou / certificado ok).
 * ⚠️ Farol/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function HomeDia1Page() {
  /* 🗑️ 05/09 — `?rota=assistida` deixou de mudar esta tela: o único passo que
     divergia entre as duas rotas era a procuração, e ela saiu do flow (o
     certificado a dispensa). A query segue válida na URL, e o nó A5.H segue
     existindo no mapa, porque o CAMINHO até aqui é outro — a chegada é que
     virou a mesma. */
  return <HomeAtivacaoView />;
}
