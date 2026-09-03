"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { VinculoView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";

/**
 * 🆕 03/08 — só alcançável pelo caminho ME (MEI pula esta tela: Fator R não
 * existe pra MEI, o DAS já é fixo). `regime` só é propagado por defesa, aqui
 * nunca deve chegar "mei". Ver `/dossie/socio` (C1) pra onde a bifurcação
 * acontece.
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N11 — DUPLO VÍNCULO / CONTRIBUI PRO INSS POR FORA · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`VinculoView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 7 (2.2) · mapa T7→N11
 * Motor: b2.coleta (vínculo)
 *
 * Por que existe: o que o sócio já recolhe de INSS por fora muda o CUSTO do
 * pró-labore (UX-24 — as telas não são ilhas). Esta tela COLETA esse dado.
 *
 * ⚠️ 29/07 — QUEM CONSOME ISTO MUDOU. O doc dizia "alimenta b2.simulador (N18)"
 * e "o N18 consome", mas o **N18 foi dissolvido em 28/07**. Hoje o dado vai
 * para dois lugares, nenhum deles um simulador pré-empresa:
 *   · o card "✨ Sugestão" do **N19** (enquadramento + pró-labore sugeridos, não
 *     escolhidos num slider antes de a empresa existir);
 *   · o **`/pro-labore`** do portal, onde o refino acontece de verdade, já em
 *     regime e com a mesma engine (`lib/fiscal`).
 *
 * Regras da spec:
 *   · A pergunta cobre CLT, aposentado, autônomo E sócio de outro CNPJ — não só
 *     "emprego registrado" (aposentada não é CLT e precisa cair aqui).
 *   · Teto INSS é cálculo de FOLGA, não binário: só zera se o CLT já bate o teto.
 *     "Deixar claro que é só sobre a folga" pra não pedir aumento de pró-labore
 *     por engano.
 *   · Pró-labore ≠ CLT da própria empresa (duplo vínculo impossível). Aqui a
 *     gente já REENQUADRA como ganho (UX-27): o INSS conta pra aposentadoria.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function VinculoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/vinculo");

  return (
    <VinculoView
      /* 🐛 02/09 — a tela não tinha seta: o TelaHeader renderiza só o texto
         quando ninguém passa `onVoltar`, e a página não passava. Daqui volta
         pra C1, levando as flags. */
      onVoltar={() => router.push(comEndereco(comRegime("/dossie/socio", mei), enderecoFiscal))}
      onSeguir={() => router.push(ajuste ? ajuste.destino : comEndereco(comRegime("/dossie/socios", mei), enderecoFiscal))}
      ctaLabel={ajuste?.label}
    />
  );
}
