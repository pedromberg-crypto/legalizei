"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SociosView } from "@/components/wizard-dossie";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E4.2c — DADOS DOS SÓCIOS (migração) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA é a MESMA do C3 (`SociosView` em `components/wizard-dossie.tsx`),
 * reusada aqui com `contexto="migrar"` (só a copy muda — não existe triagem
 * prévia perguntando "quantos sócios" no caminho migrar).
 *
 * 🆕 24/08 (reunião Leonan 19/08, achado do Pedro revisando o flow) — esta
 * tela NÃO EXISTIA na migração até agora, apesar da reunião ter travado
 * explicitamente que precisa: "ele preencha TODOS os dados base de uma
 * constituição [...] ele terminou de preencher a sociedade". O cartão CNPJ
 * não traz dados pessoais dos sócios (ver E4.2b, `/migrar/dados`) — se a
 * empresa tem mais de 1 sócio, cada um precisa entrar aqui com nome + %,
 * mesma régua de até 4 sócios / CPF travado do caminho abrir.
 *
 * Shell APP (pós-pagamento, mesmo grupo de `/migrar/dados` e `/dossie/*`).
 * Sem `onVoltar`: mesmo padrão do resto do pós-pagamento.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarSociosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <SociosView
      contexto="migrar"
      onSeguir={() => router.push(qs ? `/migrar/gov?${qs}` : "/migrar/gov")}
    />
  );
}
