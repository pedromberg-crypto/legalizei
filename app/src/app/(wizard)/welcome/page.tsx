"use client";

import { useRouter } from "next/navigation";
import { WelcomeView } from "@/components/welcome";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N2 — WELCOME · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/welcome.tsx` (`WelcomeView`) desde 31/07.
 * Esta page é o wrapper: liga a navegação real (o "Começar" do último slide
 * não navegava antes — CTA morto, mesma classe do achado no N8).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function WelcomePage() {
  const router = useRouter();
  return <WelcomeView onPular={() => router.push("/entrada")} onSeguir={() => router.push("/entrada")} />;
}
