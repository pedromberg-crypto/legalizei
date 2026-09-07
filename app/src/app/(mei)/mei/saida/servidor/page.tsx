"use client";

import { useRouter } from "next/navigation";
import { SaidaMeiView, SAIDA_SERVIDOR } from "@/components/mei/saidas";

/**
 * M2.2 — SERVIDOR FEDERAL · saída terminal do ramo MEI.
 *
 * Vedação do art. 117 da Lei 8.112/90, e só pra FEDERAL na ativa. A saída não
 * fecha a porta pra estadual/municipal de propósito: lá a regra vem do
 * estatuto de cada ente, e em muitos casos é permitido.
 */
export default function SaidaServidorPage() {
  const router = useRouter();
  return (
    <SaidaMeiView
      dados={SAIDA_SERVIDOR}
      onVerMe={() => router.push("/endereco")}
    />
  );
}
