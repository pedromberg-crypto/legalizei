"use client";

import { useRouter } from "next/navigation";
import { SaidaMeiView, SAIDA_JA_TEM_CNPJ } from "@/components/mei/saidas";

/**
 * M2.1 — JÁ TEM CNPJ · saída terminal do ramo MEI.
 *
 * Bloqueio da LC 123 art. 18-A: a Receita cruza o CPF e barra sozinha. A
 * alternativa oferecida é o ME, que a gente abre normalmente — por isso a
 * saída leva pro `/endereco` do caminho ME, e não pra uma lista de espera.
 */
export default function SaidaJaTemCnpjPage() {
  const router = useRouter();
  return (
    <SaidaMeiView
      dados={SAIDA_JA_TEM_CNPJ}
      onVerMe={() => router.push("/endereco")}
    />
  );
}
