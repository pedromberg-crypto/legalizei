"use client";

import { MaisShell, SecaoLista, SECOES, ResumoNegocio } from "@/components/lab/mais-shell";

/**
 * MAIS — COMPLETA · a gaveta mais cheia.
 * MaisShell (perfil + aviso + nudge) + RESUMO do negócio no topo + as seções
 * em lista. Componentes agora vêm de mais-shell (fonte única do acervo).
 */
export default function MaisCompleta() {
  return (
    <MaisShell>
      <ResumoNegocio />
      {SECOES.map((s) => (
        <SecaoLista key={s.nome} secao={s} />
      ))}
    </MaisShell>
  );
}
