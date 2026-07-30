"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPOS DO DOSSIÊ (B2 · N10–N16) — hoje só um RE-EXPORT.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ 19/07: o esqueleto de 3 partes, o Aviso e os 2 campos básicos saíram
 * daqui pra `components/ui/tela.tsx` e `components/ui/form.tsx`. A regra dos 3
 * bateu quando o N6–N9 (a travessia do dinheiro) passou a usar o mesmo
 * esqueleto fora do dossiê.
 *
 * ⚠️ 29/07: **as seleções seguiram o mesmo caminho.** Elas ficaram locais até
 * hoje pelo motivo certo (não tinham aparecido fora do dossiê, e promover por
 * antecipação é o que o design-system §6 proíbe), mas a condição mudou: as
 * telas do dossiê viraram componentes em `components/wizard-dossie.tsx` pra
 * serem renderizadas pela `/apresentacao`, e `components/` não importa de
 * dentro de uma rota. `OpcoesLinha`, `OpcoesColuna` e `Select` moram agora em
 * `ui/form.tsx`.
 *
 * Este arquivo continua existindo porque as 7 telas importam "../campos", e
 * mantê-lo evita um churn de import sem ganho nenhum. Se um dia ninguém mais
 * importar daqui, pode morrer.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
export {
  Campo,
  Texto,
  OpcoesLinha,
  OpcoesColuna,
  Select,
} from "@/components/ui/form";
