"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { WelcomeView } from "@/components/welcome";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N2 — WELCOME · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/welcome.tsx` (`WelcomeView`) desde 31/07.
 * Esta page é o wrapper: liga a navegação real (o "Começar" do último slide
 * não navegava antes — CTA morto, mesma classe do achado no N8).
 *
 * 🆕 26/08 (pedido do Pedro: "não podemos ter telas camufladas") — `?slide=N`
 * (0/1/2) deep-linka num slide específico, mesmo padrão de `/entrada` e
 * `/gate?etapa=`. Sem isso os 3 slides do carrossel ficavam escondidos atrás
 * de um único nó no `/mapa` — só o slide 1 aparecia na prévia ao vivo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slideParam = Number(searchParams.get("slide"));
  const slideInicial = [0, 1, 2].includes(slideParam) ? slideParam : 0;
  return (
    <WelcomeView
      slideInicial={slideInicial}
      onPular={() => router.push("/entrada")}
      onSeguir={() => router.push("/entrada")}
    />
  );
}
