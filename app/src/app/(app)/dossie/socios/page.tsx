"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SociosView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";

/** 🆕 03/08 — só alcançável pelo caminho ME (MEI não pode ter sócio, pula
 *  esta tela; ver `/dossie/socio`, C1, onde bifurca). */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N12 — +SÓCIOS · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`SociosView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 8 (2.3) · mapa T8→N12
 * Motor: b2.coleta (sócios) · afeta natureza jurídica (N15)
 *
 * Regras da spec:
 *   · Limite MÁXIMO 4 sócios no total (subiu de 2 pra 4 em 24/08, reunião
 *     Leonan 19/08 — o que trava é a assinatura de todos, não o número em
 *     si). Passou de 4 → barra.
 *   · O bloqueio é do PRODUTO, não da lei — dizer isso, não é um "não" seco.
 *   · UX-21: o "quantos sócios?" já foi na triagem do N4. Aqui o limite é só a
 *     trava de segurança, não a 1ª notícia ruim. ⚠️ 29/07: por isso mesmo ele
 *     deixou de ser `Aviso` de bloco e virou nota de rodapé do campo — todo
 *     mundo que lê já passou pela triagem, ou seja, está DENTRO do limite.
 *   · % de participação soma 100% (default divisão igual, editável).
 *
 * 🚧 Mock: o bloco de dados do 2º sócio reusa o esqueleto do N10 (dados do
 * sócio). Aqui só coleta o essencial pra provar o fluxo; o form repetível
 * completo é o mesmo componente do N10 quando for pra valer. O número de
 * sócios vem de `../mock` (fonte única do dossiê), pra bater com N13 e N15.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SociosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  /**
   * 🆕 01/09 (pedido do Pedro) — quem usa o endereço fiscal da Legalizai PULA
   * o C4: não sobra nada pra responder lá (endereço, IPTU, tipo de imóvel e
   * residência são todos sobre um imóvel que não é dele). Vai direto pro C7.
   * O MEI segue passando pelo C4 mesmo com endereço fiscal — lá tem a pergunta
   * "Como você atende?", que é dele.
   *
   * O redirect também existe DENTRO do C4 (deep-link, voltar do C7), mas o
   * salto tem que nascer aqui: melhor não navegar do que navegar e corrigir.
   */
  const proxima = enderecoFiscal && !mei ? "/dossie/nome" : "/dossie/empresa";

  /**
   * 🆕 01/09 — `?socios=3` (ou 4) simula uma empresa com mais sócios, do mesmo
   * jeito que `?simular=` faz nas outras telas: é o único jeito de ver a
   * pergunta de administração no formato LISTA (com 2 sócios ela é binária).
   * Sem o parâmetro, vale o mock de sempre.
   */
  const socios = Number(searchParams.get("socios"));
  const qtdSocios = Number.isFinite(socios) && socios >= 1 && socios <= 4 ? socios : undefined;

  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/socios");

  return (
    <SociosView
      /* 🐛 02/09 (levantamento C3→A1) — a tela não tinha seta: o
         `TelaHeader` renderiza só o texto quando ninguém passa `onVoltar`, e a
         página não passava. Regra 6 do CLAUDE.md. */
      onVoltar={() => router.push(comEndereco(comRegime("/dossie/vinculo", mei), enderecoFiscal))}
      socios={qtdSocios}
      onSeguir={() => router.push(ajuste ? ajuste.destino : comEndereco(comRegime(proxima, mei), enderecoFiscal))}
      ctaLabel={ajuste?.label}
    />
  );
}
