"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { NomeView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";

/** 🆕 03/08 — última do dossiê pros DOIS caminhos (reencontro: MEI vem de C5,
 *  ME vem de C6). Propaga `regime` pro A1 (Revisar/Termo mudam copy). */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N16 — RAZÃO SOCIAL + OBJETO SOCIAL + NOME FANTASIA · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`NomeView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 12 (2.7) · mapa T12→N16
 * Motor: b2.coleta (nome) · última tela da coleta — daqui vai direto pro N19
 * (revisar). O "antes do N18" que este doc dizia morreu com o N18, em 28/07.
 *
 * ⚠️ REESCRITA 28/07 (cruzamento de dados JUCEMG) — 2 mudanças de fundo:
 *
 * 1. RAZÃO SOCIAL: 3 OPÇÕES POR PRIORIDADE, não 1 campo com "check ao vivo".
 *    Não existe API de consulta prévia na Junta (o "Nome disponível na Junta"
 *    antigo MENTIA — não tínhamos como saber isso). A honestidade possível:
 *    a IA sugere 3 nomes, a pessoa ORDENA por prioridade (1ª/2ª/3ª escolha,
 *    sem drag — reordena com ▲▼, mesmo padrão de botão do resto do DS), e a
 *    gente tenta registrar nessa ordem. Se a 1ª cair, tenta a 2ª, sem travar
 *    o cliente. ⚠️ 29/07: o aviso dizia "A ordem não muda nada na abertura",
 *    logo abaixo de um subtítulo que pede pra ORDENAR — o segundo esvaziava o
 *    primeiro. O que ele queria dizer era "não atrasa", e agora diz isso.
 *
 * 2. OBJETO SOCIAL: campo novo, sugerido por IA a partir do CNAE principal +
 *    secundárias (herdados do N4/N14). Editável, mas não em branco — ninguém
 *    deveria escrever objeto social do zero.
 *
 * Nome fantasia segue igual (opcional).
 *
 * 🚧 Mock: as 3 sugestões e o objeto social são gerados por template a partir
 * de `../mock` (fonte única do dossiê — antes esta tela tinha um nome PRÓPRIO,
 * "Ana Souza", enquanto o N10 chamava a mesma pessoa de "Ana Beatriz Ramos").
 * No app real vêm de um provider de IA + os CNAEs reais do wizard.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function NomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  // 🆕 28/08 — no MEI a razão social é GERADA por lei (Lei 14.195/2021: 8
  // primeiros dígitos do CNPJ + nome civil). A tela some com as 3 sugestões e
  // o objeto social, e mantém só o nome fantasia — que é o único campo de nome
  // que o formulário do MEI oferece de verdade.
  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/nome");

  return (
    <NomeView mei={mei} onSeguir={() => router.push(ajuste ? ajuste.destino : comRegime("/revisar", mei))}
      ctaLabel={ajuste?.label} />
  );
}
