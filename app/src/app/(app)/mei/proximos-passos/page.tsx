"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProximosPassosView, type CampoCola } from "@/components/mei-telas";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M-S — PRÓXIMOS PASSOS (a "cola") · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08. É a tela que FECHA o ramo MEI, e a razão de ela existir é jurídica,
 * não de UX.
 *
 * ─── POR QUE A GENTE NÃO ABRE O MEI PELO CLIENTE ────────────────────────────
 * Não é limitação técnica nossa, e não é escolha de escopo. É que:
 *   · **não existe API** de formalização (Portal do Empreendedor, Redesim,
 *     Conecta gov.br e Simples Nacional — nenhum tem rota pra isso);
 *   · **não existe procuração que cubra o registro** (a eletrônica do e-CAC só
 *     vale pra atos posteriores: PGMEI, parcelamento, DARF, DCTFWeb);
 *   · **não existe login por representação** no Portal;
 *   · e a senha gov.br é "pessoal e intransferível" pelos próprios Termos de
 *     Uso — pedir a senha do cliente seria violação + risco de LGPD, não
 *     atalho.
 * Fonte completa: `pesquisa/abertura-mei/abertura-mei-processo.md` §Bloco 1.
 *
 * ─── O QUE A GENTE FAZ, ENTÃO ───────────────────────────────────────────────
 * Coleta tudo, um atendente interno confere (é o que o `/painel` mostra
 * acontecendo), e esta tela entrega os valores prontos na ordem dos campos do
 * Portal. O clique final é dele.
 *
 * ✍️ REGRA DE COPY, dura: **nunca dizer "a gente abre pra você"** no caminho
 * MEI. Promessa que não dá pra cumprir vira reembolso e reclamação. O que a
 * gente promete é conferir, escolher a ocupação certa e deixar pronto — que já
 * é o trabalho difícil.
 *
 * 🔴 RF-01: os valores abaixo vêm do mock `CLIENTE`. No app real, saem do que
 * foi coletado no dossiê (M-O, C1, C4). Mesma dívida do resto do wizard.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MeiProximosPassosPage() {
  const router = useRouter();
  const [nivelGovBrOk, setNivelGovBrOk] = useState(false);

  /**
   * A ordem é a do formulário oficial, não a do nosso dossiê — quem está com o
   * Portal aberto na outra aba precisa seguir de cima pra baixo sem procurar.
   *
   * Nome, CPF e data de nascimento não entram: o gov.br preenche sozinho e não
   * são editáveis. Listá-los faria a pessoa procurar campo que não existe.
   */
  const CAMPOS: CampoCola[] = [
    { rotulo: "RG", valor: "MG-12.345.678", nota: "Órgão emissor: SSP/MG" },
    { rotulo: "Telefone", valor: CLIENTE.telefone },
    // 🔴 RF-01: o mock `CLIENTE` não guarda e-mail (ele é coletado no E3.1 e
    // some entre telas, como o resto). Fica literal aqui só pro farol.
    { rotulo: "E-mail", valor: "ana.ramos@email.com" },
    {
      rotulo: "Ocupação principal",
      valor: "Técnico(a) de manutenção de computador",
      nota: "Escolhe exatamente essa na lista. É a que corresponde ao que você faz.",
    },
    {
      rotulo: "Forma de atuação",
      valor: "Pela internet",
      nota: "Pode marcar mais de uma se for o seu caso.",
    },
    { rotulo: "Endereço comercial", valor: CLIENTE.endereco },
    {
      rotulo: "Endereço residencial",
      valor: CLIENTE.endereco,
      nota: "Se for o mesmo do comercial, marca a opção de repetir.",
    },
    {
      rotulo: "Capital social",
      valor: "R$ 1.000",
      nota: "Não existe valor mínimo por lei. Esse é o que você declarou com a gente.",
    },
    {
      rotulo: "Nome fantasia",
      valor: "—",
      nota: "Opcional. A razão social sai automática: seu CNPJ + seu nome.",
    },
  ];

  function textoCompleto() {
    return CAMPOS.map((c) => `${c.rotulo}: ${c.valor}`).join("\n");
  }

  return (
    <ProximosPassosView
      campos={CAMPOS}
      nivelGovBrOk={nivelGovBrOk}
      setNivelGovBrOk={setNivelGovBrOk}
      onCopiarTudo={() => {
        // Contexto inseguro / WebView sem clipboard não pode derrubar a tela:
        // os valores continuam visíveis e selecionáveis um a um.
        try {
          void navigator.clipboard?.writeText(textoCompleto());
        } catch {
          /* silencioso, de propósito */
        }
      }}
      onAbrirPortal={() =>
        window.open(
          "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
          "_blank",
          "noopener,noreferrer",
        )
      }
      // 🔄 28/08 (decisão do Pedro) — com o CNPJ na mão vem o CERTIFICADO,
      // não a home. Ele é o que destrava a operação otimizada (guias, FGTS
      // Digital, procuração), e tem que estar resolvido ANTES da pessoa cair
      // dentro do app com as funcionalidades — mesma régua do ME.
      onConfirmarCnpj={() => router.push("/certificado?regime=mei")}
    />
  );
}
