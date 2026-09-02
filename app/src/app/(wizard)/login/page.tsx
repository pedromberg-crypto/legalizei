"use client";

import { LoginView } from "@/components/login";

/**
 * LOGIN · rota de produção — wrapper fino.
 * ⚠️ A TELA vive em `components/login.tsx` desde 02/09 (mesma regra do resto
 * do flow: componente é fonte única, page só liga navegação). O racional
 * completo da tela está no cabeçalho do componente.
 */
export default function LoginPage() {
  return <LoginView />;
}
