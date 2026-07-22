"use client";

import { MaisShell, SecaoLista, SECOES } from "@/components/lab/mais-shell";

/**
 * MAIS — VERSÃO 2 (LISTA) · a variante DIREITA do print (rows com chevron por
 * seção). Mais densa e escalável: cabe muito item sem virar parede de tiles.
 * Tende a ganhar num hub de MENU (que cresce), o grid ganha em DESTAQUE visual.
 */
export default function MaisV2() {
  return (
    <MaisShell>
      {SECOES.map((s) => (
        <SecaoLista key={s.nome} secao={s} />
      ))}
    </MaisShell>
  );
}
