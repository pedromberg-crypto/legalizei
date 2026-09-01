"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EmpresaView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal } from "@/lib/endereco";

/** 🆕 03/08 — ponto de REENCONTRO dos 2 caminhos: MEI cai aqui direto da C1
 *  (pulou C2/C3); ME chega pela sequência normal via C3. Capital social some
 *  pro MEI (não existe, não é sociedade) — ver prop `mei` no EmpresaView. */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N13 — DADOS DA EMPRESA · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`EmpresaView`) desde 29/07.
 * Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 9 (2.4) · mapa T9→N13
 * Motor: b2.coleta (empresa) · flag de endereço fiscal → injeta no plano do B3
 *
 * ⚠️ REESCRITA 28/07 (cruzamento de dados JUCEMG):
 *
 * 1. CEP AGORA PUXA TUDO — logradouro, bairro, município, UF. Antes era um
 *    placeholder decorativo ("Rua encontrada pelo CEP", texto fixo, nenhum
 *    dado real). A pessoa só COMPLEMENTA (número + complemento).
 *
 * 2. RESIDÊNCIA DE SÓCIO — pergunta nova, DINÂMICA pelo que foi respondido
 *    na triagem do N4: solo → a pergunta nem aparece (não existe "outro
 *    sócio" pra confirmar). Com sócio (2, o máximo do MLP) → trava até
 *    responder pelos DOIS, nominalmente.
 *
 * 3. ÁREA UTILIZADA (m²) — de propósito FORA da UI. É dado interno nosso,
 *    preenchido automaticamente por trás (é prestação de serviço, não
 *    precisamos que o cliente saiba disso). NÃO adicionar campo aqui.
 *
 * 4. ATIVIDADE INÓCUA — também de propósito FORA da UI. É derivada do CNAE
 *    (baixo impacto, elegível a funcionar em residência) internamente, na
 *    arrecadação do resto dos dados. O `tipo` (próprio/coworking/virtual) é um
 *    campo DIFERENTE — sobre o imóvel, não sobre a atividade.
 *
 * 🐛 29/07 — o capital social escapava: o `||` do `completo` fazia
 * curto-circuito e quem escolhia endereço fiscal passava com o campo em branco.
 * Corrigido na View (endereço é condicional, capital social não).
 *
 * 🕓 Preço do endereço fiscal = placeholder FAKE (~R$60/mês). Não reabrir até
 * o Pedro fechar custo (legalize-preco-deferido-custo-real). ⚠️ 29/07: este doc
 * dizia "Marcado na UI" e NÃO estava — a marcação foi criada de verdade agora.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EmpresaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  // 🆕 26/08 (item 2) — a escolha já veio do /gate (FaixaView); esta tela não
  // pergunta de novo, só confirma (ver `jaDecidido` em `EmpresaView`).
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  return (
    <EmpresaView
      mei={mei}
      enderecoProprio={!enderecoFiscal}
      // 🔄 28/08 (pedido do Pedro) — C5 (CNAE secundários) SAIU daqui: agora
      // vem logo depois do C0, antes até do C1.
      // 🔒 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) — C6
      // (natureza jurídica) SUMIU do fluxo do cliente: SLU × LTDA passou a
      // ser decisão 100% interna (conforme TEM_SOCIO), tanto pra quem tem
      // sócio quanto pra quem não tem. ME e MEI vão direto pro C7 (nome).
      onSeguir={() => router.push(comRegime("/dossie/nome", mei))}
    />
  );
}
