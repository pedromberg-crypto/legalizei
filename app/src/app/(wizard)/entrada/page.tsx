"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EntradaView, type Intencao } from "@/components/entrada";
import { MeiOuMeView } from "@/components/gate-telas";
import { comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N3 — ENTRADA · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/entrada.tsx` (`EntradaView`) desde 29/07 —
 * mesma extração que `VereditoView`/`EncaixeView` já tinham. Esta page é só o
 * wrapper: mantém o estado do passo e liga a navegação real (router).
 * A `/apresentacao` consome o MESMO `EntradaView`, então a demo não pode
 * divergir da tela aprovada. Mexeu no visual/copy? Mexe no componente.
 *
 * Todo o racional da tela (UX-55, hierarquia das 3 saídas, gate de cidade,
 * por que "migrar" não aparece) está documentado lá.
 *
 * 🆕 03/08 — E3.2 · MEI × ME, entre o fork (E3) e o gate de cidade (E4).
 * REALOCADA aqui vindo do fim do E5 (decisão anterior, revertida). Motivo do
 * Pedro: (1) quem abre MEI GERALMENTE já sabe que é MEI — pergunta direta em
 * vez de inferir de sócio+faturamento lá na frente; (2) **MEI não tem o
 * limite geográfico do MLP** — a Legalizai consegue abrir MEI do Brasil
 * inteiro, só o ME/Simples é que hoje só atende BH/MG. Por isso MEI PULA o
 * gate de cidade inteiro; só ME (e Migrar, que nem passa por aqui) confirma
 * cidade.
 *
 * Só pergunta pra quem escolheu ABRIR — Migrar não é abertura nova, não faz
 * sentido perguntar regime de quem já tem CNPJ.
 *
 * 🔴 Risco assumido e não resolvido nesta rodada: se a pessoa disser "MEI"
 * aqui mas mais na frente (triagem, E5) aparecer 2+ sócios — incompatível
 * com MEI —, hoje NÃO existe correção automática. Fica registrado como gap.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EntradaPage() {
  const router = useRouter();
  // ⚠️ 28/07: deep-link pro passo 2 (mesmo padrão do /gate?etapa=) — sem
  // isso o /mockup só conseguia mostrar o passo 1 do gate de cidade.
  const searchParams = useSearchParams();
  const intencaoParam = searchParams.get("intencao");
  const intencaoInicial: Intencao | null =
    intencaoParam === "abrir" || intencaoParam === "migrar" ? intencaoParam : null;
  const [intencao, setIntencao] = useState<Intencao | null>(intencaoInicial);
  // ⚠️ Deep-link `&regime=me` PULA a pergunta (pra /mockup revisar o gate de
  // cidade direto, mesmo padrão do resto do /gate?etapa=). Não existe atalho
  // pra "mei": escolher mei já redireciona pra fora desta página.
  const regimeParam = searchParams.get("regime");
  const [regime, setRegime] = useState<"mei" | "me" | null>(regimeParam === "me" ? "me" : null);
  // Separado de `regime !== null`: escolher o card NÃO avança sozinho — só o
  // clique em "Continuar" resolve, senão a tela trocaria antes da confirmação.
  const [regimeResolvido, setRegimeResolvido] = useState(regimeParam === "me");

  if (intencao === "abrir" && !regimeResolvido) {
    return (
      <MeiOuMeView
        regime={regime}
        setRegime={setRegime}
        onSeguir={() => {
          setRegimeResolvido(true);
          // MEI pula o gate de cidade — segue direto pro E5. ME cai no passo
          // 2 do EntradaView (gate de cidade), como sempre.
          if (regime === "mei") router.push(comRegime("/gate", true));
        }}
        // 🆕 03/08 — volta pro fork (E3), mesma página: reseta intenção, sem
        // navegar de rota (o fork é a MESMA rota /entrada, passo 1).
        onVoltar={() => setIntencao(null)}
      />
    );
  }

  return (
    <EntradaView
      intencao={intencao}
      onIntencao={setIntencao}
      onSeguir={() => router.push("/gate")}
      // ✅ 30/07 — o flow #2 existe. Era aqui que "metade do mercado" batia
      // num card "essa parte ainda não existe" (achado M0 do motor).
      onMigrar={() => router.push("/migrar/cnpj")}
      onForaBh={() => router.push("/saida/fora-bh")}
      onLogin={() => router.push("/login")}
      // 🆕 03/08 — UX-63 mesclado (Pedro): card de destaque com coral-600,
      // igual aos outros CTAs. ⚠️ trade-off já registrado: branco sobre
      // coral-600 dá 4,04:1 e o título é 16px bold (abaixo do piso de texto
      // grande pra AA, que exige 4,5:1) — falha AA técnica, escolha consciente.
      destaqueCoral600
    />
  );
}
