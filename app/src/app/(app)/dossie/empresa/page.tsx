"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmpresaView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";
import { ehEnderecoFiscal } from "@/lib/endereco";
import { lerRascunhoEndereco, type RascunhoEndereco } from "@/lib/rascunho";
// Mesma fonte que `aguardando`/`painel` usam pra saber se a empresa tem sócio.
import { TEM_SOCIO } from "@/app/(app)/dossie/mock";

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

  /**
   * 🆕 01/09 (pedido do Pedro) — PRA QUEM USA O NOSSO ENDEREÇO, ESTA TELA NÃO
   * EXISTE. Quem escolheu o endereço fiscal da Legalizai lá no E3.4 não tem
   * nada pra responder aqui: CEP/número/complemento são NOSSOS, IPTU é nosso,
   * tipo de imóvel e residência do titular não se aplicam (o endereço não é
   * dele), metragem e forma de atuação são internas. Sobrava uma tela só pra
   * confirmar uma escolha que a pessoa já fez e já viu somada no preço (E7).
   *
   * O MEI é exceção e continua vendo a tela mesmo com endereço fiscal: lá
   * existe a pergunta "Como você atende?" (forma de atuação multi-seleção),
   * que interage com a dispensa de alvará e não tem como ser preenchida por
   * nós (ver bloco `mei` em `EmpresaView`).
   *
   * O `replace` (não `push`) é de propósito: a tela não pode entrar no
   * histórico, senão o "voltar" do C7 cai numa tela que não existe pra ela.
   */
  const pula = enderecoFiscal && !mei;

  useEffect(() => {
    if (pula) router.replace(comRegime("/dossie/nome", mei));
  }, [pula, mei, router]);

  /**
   * Rascunho do endereço respondido no E3.4 — lido DEPOIS da montagem porque
   * `sessionStorage` não existe no servidor. Ler no initializer do `useState`
   * faria o HTML do servidor (campos vazios) divergir do cliente (campos
   * preenchidos), que é erro de hidratação.
   *
   * O `set` dentro do efeito é o caso legítimo da regra (sincronizar um store
   * externo que só existe no cliente), não estado derivado de props — por isso
   * o disable pontual, com o motivo à vista.
   */
  const [inicial, setInicial] = useState<RascunhoEndereco | null>(null);
  useEffect(() => {
    if (pula) return;
    const rascunho = lerRascunhoEndereco();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- store client-only (sessionStorage), lido após a montagem
    if (rascunho) setInicial(rascunho);
  }, [pula]);

  if (pula) return null;

  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/empresa");

  /**
   * 🐛 03/09 (pente-fino) — O VOLTAR IA SEMPRE PRA C3 (SÓCIOS), inclusive pra
   * quem nunca passou por lá:
   *   · MEI vem da C1 direto (pula C2 e C3 — ver `socio/page.tsx`);
   *   · ME "só eu" tem o passo Sócios filtrado (`passosDoCliente`, `condicional`),
   *     então o anterior real dele é a C2 (vínculo com o INSS).
   * O rótulo (`metaVoltar`) viaja junto com o destino de propósito: a regra 6
   * do CLAUDE.md quebrou 4 vezes em 02/09 justamente por eles morarem longe um
   * do outro.
   */
  const voltar = mei
    ? { rota: "/dossie/socio", meta: "Seus dados" }
    : TEM_SOCIO
      ? { rota: "/dossie/socios", meta: "Sócios" }
      : { rota: "/dossie/vinculo", meta: "Vínculo com o INSS" };

  return (
    <EmpresaView
      /* 🐛 02/09 (levantamento C3→A1) — a tela não tinha seta: o
         `TelaHeader` renderiza só o texto quando ninguém passa `onVoltar`, e a
         página não passava. Regra 6 do CLAUDE.md. */
      onVoltar={() => router.push(comRegime(voltar.rota, mei))}
      metaVoltar={voltar.meta}
      // 🔑 `key` força o remount quando o rascunho chega: os campos do
      // EmpresaView nascem do estado inicial, e sem isso a leitura tardia
      // (pós-montagem) não apareceria na tela.
      key={inicial ? "com-rascunho" : "sem-rascunho"}
      inicial={inicial ?? undefined}
      mei={mei}
      enderecoProprio={!enderecoFiscal}
      // 🔄 28/08 (pedido do Pedro) — C5 (CNAE secundários) SAIU daqui: agora
      // vem logo depois do C0, antes até do C1.
      // 🔒 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) — C6
      // (natureza jurídica) SUMIU do fluxo do cliente: SLU × LTDA passou a
      // ser decisão 100% interna (conforme TEM_SOCIO), tanto pra quem tem
      // sócio quanto pra quem não tem. ME e MEI vão direto pro C7 (nome).
      onSeguir={() => router.push(ajuste ? ajuste.destino : comRegime("/dossie/nome", mei))}
      ctaLabel={ajuste?.label}
    />
  );
}
