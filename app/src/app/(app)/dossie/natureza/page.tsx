"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { NaturezaView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";

/** 🆕 03/08 — só alcançável pelo caminho ME (MEI pula: natureza é sempre
 *  fixa, sem escolha; ver `/dossie/cnae-secundarios`, C5, onde bifurca). */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N15 — NATUREZA JURÍDICA · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`NaturezaView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 11 (2.6) · mapa T11→N15
 * Motor: b2.coleta (natureza) · coerência com N12 (sócios)
 *
 * Regras da spec:
 *   · Recomendação da IA como card DEFAULT, não dropdown seco: solo → SLU,
 *     2+ sócios → LTDA.
 *   · Explica a diferença em 1 linha; confirmar OU mudar.
 *   · Coerência com o N12: SLU + tem sócios → bloqueia e corrige (guard-rail
 *     contra escolha impossível).
 *
 * ⚠️ Fato datado > spec (índice-autoridade): o CNPJ real do Pedro saiu LTDA num
 * caso solo. A spec diz "solo→SLU"; o produto RECOMENDA SLU mas deixa a pessoa
 * escolher LTDA. A recomendação nunca é uma trava — só a incoerência é.
 *
 * ─── 🐛 29/07 — O GUARD-RAIL NUNCA TINHA RODADO ──────────────────────────
 * `TEM_SOCIO` era um `const false` local, e `incoerente` é `escolha === "slu"
 * && TEM_SOCIO`. Com o mock fixo em solo, a expressão era **sempre falsa**: o
 * bloco de bloqueio jamais renderizou, nem uma vez, em review nenhuma. E o doc
 * afirmava que o mock existia justamente "pra provar o guard-rail".
 *
 * Duas correções:
 *   1. `TEM_SOCIO` passou a vir da fonte única (`../mock`, hoje com sócio), o
 *      que torna o caminho ALCANÇÁVEL: escolher "dono único" tendo sócio agora
 *      dispara o aviso de verdade.
 *   2. A copy dizia **"A gente já ajustou pra você"** e nada era ajustado — só
 *      o botão desabilitava. Ou seja: se algum dia rodasse, mentiria. Agora o
 *      aviso traz a ação que ele promete, e quem ajusta é o clique.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function NaturezaPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  return <NaturezaView onSeguir={() => router.push(comRegime("/dossie/nome", mei))} />;
}
