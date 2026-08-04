"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContratoView } from "@/components/wizard-dinheiro";
import { ehMei, comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N8 — ACEITE DO CONTRATO · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dinheiro.tsx` (`ContratoView`) desde
 * 29/07. Esta page é o wrapper: guarda o aceite e liga a navegação.
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 18, **METADE** dela.
 *
 * ─── ⚠️ O T18 RACHOU EM DOIS, E ESTA É SÓ A PRIMEIRA METADE ───────────────
 * Decisão travada 16/07. Os dois atos estavam colados por acidente de
 * ordenação, e a natureza jurídica deles é oposta:
 *   · **Aceite do contrato de serviço** → AQUI (N8). O cliente vira cliente.
 *     **Reversível.** O CDC art. 49 (7 dias) vale limpo, nada foi executado.
 *   · **Termo irreversível de início** → desce pro **N20**, depois do dossiê.
 *     É lá que a máquina liga e o dinheiro de governo sai.
 * Juntos, a alegação de "serviço exaurido" aconteceria quando NADA foi
 * executado — juridicamente frágil. 🟡 ratificação com Larissa/Mauro pendente.
 *
 * ⚠️ **POR ISSO ESTA TELA NÃO ASSUSTA.** Nenhuma copy fala em irreversível, em
 * taxa que não volta, em "tem certeza?". Seria mentira: aqui ele desiste e
 * recebe tudo de volta. O peso mora no N20.
 *
 * ─── A EXCEÇÃO NÃO NEGOCIÁVEL DO UX-48 ────────────────────────────────────
 * Conteúdo legal é **idêntico e integralmente visível** pras duas coortes:
 * nunca atrás de expander, nunca variando por perfil. Nenhum `<details>` aqui.
 * Resumo humano ACIMA do jurídico não é esconder, é ordenar.
 *
 * ─── ⚖️ O CANCELAMENTO SAIU DE BLOCO PRÓPRIO (19/07) ──────────────────────
 * 2ª rodada do Pedro, que foi a que importou: **"quem entra num app pra abrir
 * empresa está pensando em crescimento. Abrir empresa é uma vitória."** O
 * problema não era tamanho, era MOLDURA — a tela tinha clima de saída de
 * emergência. Resíduo do racha do T18: viraram duas telas, o tom não se
 * dividiu junto.
 *   · Camada 1 (7 dias) → bullet, como GARANTIA.
 *   · Camada 3 (permanência) → bullet, como CONSEQUÊNCIA do benefício.
 *   · Camada 2 (taxa não volta depois de aberto) → **vai pro N20**.
 *
 * 🚧 **DÍVIDA:** o N20 ainda não existe. Quando nascer, a camada 2 completa TEM
 * que estar nele, antes do botão irreversível. Senão esta redução vira omissão.
 * 🟡 Redação jurídica final é do Mauro/Larissa.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ContratoPage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());
  const [aceito, setAceito] = useState(false);

  return (
    <ContratoView
      aceito={aceito}
      setAceito={setAceito}
      onSeguir={() => router.push(comRegime("/pagamento", mei))}
      semTaxaJunta={mei}
    />
  );
}
