"use client";

import { MaisShell, SecaoGrid, SECOES } from "@/components/lab/mais-shell";

/**
 * MAIS — VERSÃO 1 (GRID) · a variante ESQUERDA do print (tiles 2×2 por seção).
 * Mais visual, cada item é um tile com ícone. Bom quando há POUCOS itens por
 * seção; escala pior se a lista crescer.
 */
export default function MaisV1() {
  return (
    <MaisShell>
      {SECOES.map((s) => (
        <SecaoGrid key={s.nome} secao={s} />
      ))}
    </MaisShell>
  );
}
