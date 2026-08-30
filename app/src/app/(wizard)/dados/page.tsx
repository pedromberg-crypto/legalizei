"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DadosPessoaisView, type DadosLead } from "@/components/entrada-lead";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E3.1 — DADOS PESSOAIS · rota de produção (shell WIZARD, antes do dinheiro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 — tela NOVA, primeira coisa depois do fork (E3).
 *
 * A tela vive em `components/entrada-lead.tsx` (`DadosPessoaisView`), mesmo
 * padrão de extração do resto do wizard: a `/apresentacao` consome o MESMO
 * componente, então a demo não diverge da tela aprovada.
 *
 * ⚠️ NÃO cria conta. Só identifica o lead. A criação de conta (senha, CPF,
 * verificação por código) continua no E6, depois dos gates. Por isso os dados
 * daqui NÃO viajam por querystring: dado pessoal em URL é vazamento (fica em
 * histórico, log de servidor, referer). O E6 vai exibi-los como já preenchidos
 * assim que existir estado real compartilhado (RF-01, dívida conhecida) — hoje
 * o E6 usa o mock de `CLIENTE`, mesma doutrina já usada no C1.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function DadosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intencao = searchParams.get("intencao") === "migrar" ? "migrar" : "abrir";

  const [dados, setDados] = useState<DadosLead>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
  });

  return (
    <DadosPessoaisView
      d={dados}
      set={(k, v) => setDados((p) => ({ ...p, [k]: v }))}
      contexto={intencao}
      // Volta pro E3.2 (MEI × ME), que mora no passo 2 do /entrada.
      onSeguir={() => router.push(`/entrada?intencao=${intencao}`)}
      onVoltar={() => router.push("/entrada")}
    />
  );
}
