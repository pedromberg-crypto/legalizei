"use client";

import { useRouter } from "next/navigation";
import { SplashView } from "@/components/splash";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N1 — SPLASH · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/splash.tsx` (`SplashView`) desde 31/07. Esta
 * page é o wrapper.
 *
 * 🐛 29/08 — faltava o `onContinuar`: a tela nunca navegava de verdade pro
 * N2, só a demo do `/apresentacao` (por fora, mudando estado local dela).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SplashPage() {
  const router = useRouter();
  return <SplashView onContinuar={() => router.push("/welcome")} />;
}
