"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EntradaView, type Intencao } from "@/components/entrada";
import { MeiOuMeView } from "@/components/gate-telas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E3 — ENTRADA (fork) + E3.2 (MEI × ME) · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ As TELAS vivem em `components/entrada.tsx` (`EntradaView`) e
 * `components/gate-telas.tsx` (`MeiOuMeView`). Esta page é o wrapper: guarda o
 * estado do passo e liga a navegação real. A `/apresentacao` consome os MESMOS
 * componentes, então a demo não pode divergir da tela aprovada.
 *
 * ─── 🔄 A ORDEM MUDOU (27/08, reordenação do flow de entrada) ───────────────
 * Antes:  fork → MEI×ME → gate de cidade → gate-CNAE → triagem → faixa → conta
 * Agora:  fork → **dados pessoais** → MEI×ME → **endereço + categoria** →
 *         triagem → faixa → conta → plano → contrato → pagamento →
 *         **atividade/CNAE (já dentro do dossiê)**
 *
 * O que motivou (ADR completo em `marca/decisoes-marca.md` 27/08):
 *   1. **Captura de lead cedo.** Nome/e-mail/telefone eram pedidos só no E6,
 *      depois de 6 telas de gate. Quem desistia antes disso era anônimo. O
 *      líder (Contabilizei) pede na 1ª tela do wizard, e isso é copiável sem
 *      custo nenhum de posicionamento.
 *   2. **O gate de cidade não validava nada.** Virou o E3.3 (`/endereco`), com
 *      CEP de verdade.
 *   3. **A categoria virou o gate de elegibilidade**, no lugar do veredito de
 *      CNAE. Como a lista de categorias só oferece o que a gente atende, o
 *      CNAE detalhado pôde ir pra depois do pagamento sem criar o risco de
 *      "pagou e a gente não atende" (o veredito lá não pode mais dar 🔴).
 *
 * ⚠️ O que NÃO se moveu, de propósito: **triagem (E5T) e faixa (E5F) seguem
 * antes do pagamento.** Elas bloqueiam por motivos que a categoria não cobre
 * (sócio via CNPJ e sócio no exterior tiram a empresa do Simples; 5+ sócios é
 * limite do produto). Movê-las junto criaria reembolso pra um caso que hoje
 * simplesmente não existe.
 *
 * 🔴 Risco assumido e não resolvido: se a pessoa disser "MEI" na E3.2 e a
 * triagem depois revelar 2+ sócios (incompatível com MEI), não há correção
 * automática. Gap conhecido desde 03/08.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EntradaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intencaoParam = searchParams.get("intencao");
  const intencao: Intencao | null =
    intencaoParam === "abrir" || intencaoParam === "migrar" ? intencaoParam : null;

  const [regime, setRegime] = useState<"mei" | "me" | null>(null);

  /**
   * Passo 2 (E3.2 · MEI × ME) — só aparece quando a intenção já veio na URL,
   * o que só acontece voltando do E3.1 (`/dados`). O fork puro fica no else.
   *
   * 🔴 27/08 — o card "ME · Lucro Presumido" SAIU (`MeiOuMeView`). Decisão do
   * Pedro: "não vale o desgaste da dúvida agora". Como captar quem é Lucro
   * Presumido ficou parqueado de propósito (volume conhecidamente mínimo);
   * `/saida/regime-nao-suportado` continua existindo, alcançada só pelo M1.
   */
  if (intencao) {
    return (
      <MeiOuMeView
        contexto={intencao}
        regime={regime}
        setRegime={setRegime}
        onSeguir={() => {
          if (intencao === "migrar") {
            // Migrar não abre endereço novo (a empresa já existe), então pula
            // o E3.3 inteiro e vai direto pro M1.
            router.push(regime === "mei" ? "/migrar/cnpj?cenario=mei" : "/migrar/cnpj");
            return;
          }
          // Abrir: os dois regimes passam pelo E3.3 — o gate de BH só vale pro
          // ME (`?regime=mei` desliga a exigência lá), mas a CATEGORIA vale
          // pros dois, e é ela que autoriza o CNAE a ir pra pós-pagamento.
          router.push(regime === "mei" ? "/endereco?regime=mei" : "/endereco");
        }}
        onVoltar={() => router.push("/dados")}
      />
    );
  }

  return (
    <EntradaView
      // 🔄 27/08 — o fork não tem mais passo 2 (gate de cidade removido):
      // escolher já navega pro E3.1, que é a captura de lead nova.
      onIntencao={(i) => router.push(`/dados?intencao=${i}`)}
      onLogin={() => router.push("/login")}
      // 🆕 30/08 — fecha o gap do C0_1 (`/retomar`), órfão no mapa até aqui.
      onRetomar={() => router.push("/retomar")}
      // 🆕 03/08 — UX-63 mesclado (Pedro): card de destaque com coral-600,
      // igual aos outros CTAs. ⚠️ trade-off já registrado: branco sobre
      // coral-600 dá 4,04:1 e o título é 16px bold (abaixo do piso de texto
      // grande pra AA, que exige 4,5:1) — falha AA técnica, escolha consciente.
      destaqueCoral600
    />
  );
}
