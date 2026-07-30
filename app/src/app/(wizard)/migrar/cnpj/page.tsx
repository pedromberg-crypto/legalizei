"use client";

import { useRouter } from "next/navigation";
import { MigrarCnpjView } from "@/components/wizard-migrar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1 — SEU CNPJ (consulta + veredito) · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarCnpjView`).
 * Fonte da lógica: `motor-testes/flow-migrar.js` → m1.cnpj + m1.filtro + m1.veredito.
 *
 * A porta do FLOW #2. Diferença estrutural do flow #1: aqui NÃO existe
 * entrevista de atividade — o CNAE já está registrado, a gente lê o cartão CNPJ
 * em vez de perguntar. Todo o N4 (pills, typewriter, desambiguação) desaparece.
 *
 * Consulta e veredito na MESMA tela de propósito: no flow #1 o veredito é tela
 * própria porque depende de interpretação da IA (que pode errar); aqui é fato
 * registrado. Separar em duas telas custaria um toque pra mostrar um dado que
 * já estava na anterior.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarCnpjPage() {
  const router = useRouter();

  return (
    <MigrarCnpjView
      onSeguir={() => router.push("/migrar/diagnostico")}
      onSaidaRegulada={() => router.push("/veredito/waitlist")}
      onSaidaNaoAtende={() => router.push("/veredito/nao-atende")}
      onVoltar={() => router.push("/entrada")}
    />
  );
}
