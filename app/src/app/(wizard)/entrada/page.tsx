"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EntradaView, type Intencao } from "@/components/entrada";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N3 — ENTRADA · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/entrada.tsx` (`EntradaView`) desde 29/07 —
 * mesma extração que `VereditoView`/`EncaixeView` já tinham. Esta page é só o
 * wrapper: mantém o estado do passo e liga a navegação real (router).
 * A `/apresentacao` consome o MESMO `EntradaView`, então a demo não pode
 * divergir da tela aprovada. Mexeu no visual/copy? Mexe no componente.
 *
 * Todo o racional da tela (UX-55, hierarquia das 3 saídas, gate de cidade,
 * por que "migrar" não aparece) está documentado lá.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EntradaPage() {
  const router = useRouter();
  // ⚠️ 28/07: deep-link pro passo 2 (mesmo padrão do /gate?etapa=) — sem
  // isso o /mockup só conseguia mostrar o passo 1 do gate de cidade.
  const searchParams = useSearchParams();
  const intencaoParam = searchParams.get("intencao");
  const intencaoInicial: Intencao | null =
    intencaoParam === "abrir" || intencaoParam === "migrar" ? intencaoParam : null;
  const [intencao, setIntencao] = useState<Intencao | null>(intencaoInicial);

  return (
    <EntradaView
      intencao={intencao}
      onIntencao={setIntencao}
      onSeguir={() => router.push("/gate")}
      // ✅ 30/07 — o flow #2 existe. Era aqui que "metade do mercado" batia
      // num card "essa parte ainda não existe" (achado M0 do motor).
      onMigrar={() => router.push("/migrar/cnpj")}
      onForaBh={() => router.push("/saida/fora-bh")}
      onLogin={() => router.push("/login")}
    />
  );
}
