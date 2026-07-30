"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarPassivoView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M4a — AUDITORIA DE PASSIVO · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarPassivoView`).
 * Motor: `flow-migrar.js` → m4.pendencias. Persona: `migra-passivo`.
 *
 * 🔥 O risco EXCLUSIVO do flow #2, que a abertura não tem: **a empresa chega
 * com passado.** O consolidado fiscal (#14) diz que as obrigações do período
 * antigo ficam com o contador anterior — mas o CLIENTE não sabe disso, e a
 * dívida é da empresa, não do contador.
 *
 * Assumir sem auditar = herdar dívida que a gente não criou e virar o culpado
 * por ela. Por isso esta tela vem ANTES de qualquer transferência.
 *
 * `?cenario=limpo` mostra a migração sem passivo (persona `migra-limpo`).
 *
 * 🕓 Decisão em aberto (fila Mauro): passivo herdado é upsell (a gente
 * regulariza cobrando à parte) ou fica fora de escopo? A tela hoje oferece como
 * serviço à parte, que é a leitura menos comprometedora até ele decidir.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarPassivoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const comPassivo = searchParams.get("cenario") !== "limpo";

  return (
    <MigrarPassivoView
      comPassivo={comPassivo}
      onSeguir={() => router.push("/migrar/transferencia")}
    />
  );
}
