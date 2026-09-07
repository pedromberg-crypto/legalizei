"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ProximosPassosMeiView,
  type CampoCola,
} from "@/components/mei/proximos-passos";
import { anterior, proxima, metaDoVoltar } from "@/lib/mei-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M13 — ÚLTIMOS PASSOS (a "cola") · rota de produção do ramo MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * A tela vive em `components/mei/proximos-passos.tsx`.
 *
 * 🔄 07/09 — a rota é a MESMA de sempre (`/mei/proximos-passos`), só mudou de
 * route group: saiu de `(app)`, onde morava no meio das telas do ME, e veio
 * pro `(mei)`. Nenhum link externo quebra.
 *
 * 🔴 RF-01: os valores abaixo são mock. No app real saem do que foi coletado
 * (M7, M8, M9). Mesma dívida do wizard inteiro.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ROTA = "/mei/proximos-passos";

function ProximosPassosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nivelGovBrOk, setNivelGovBrOk] = useState(false);

  /**
   * A ordem é a do formulário oficial, não a do nosso dossiê — quem está com o
   * Portal aberto na outra aba precisa seguir de cima pra baixo sem procurar.
   *
   * ⚠️ Nome, CPF e data de nascimento NÃO entram: o gov.br preenche sozinho e
   * não são editáveis. Listá-los faria a pessoa procurar campo que não existe.
   */
  const CAMPOS: CampoCola[] = [
    { rotulo: "RG", valor: "MG-12.345.678", nota: "Órgão emissor: SSP/MG" },
    { rotulo: "Telefone", valor: "(31) 98765-4321" },
    { rotulo: "E-mail", valor: "ana.ramos@email.com" },
    {
      rotulo: "Ocupação principal",
      valor:
        searchParams.get("ocup") ?? "Técnico(a) de manutenção de computador",
      nota: "Escolhe exatamente essa na lista. É a que corresponde ao que você faz.",
    },
    {
      rotulo: "Forma de atuação",
      valor: "Pela internet",
      nota: "Pode marcar mais de uma se for o seu caso.",
    },
    {
      rotulo: "Endereço comercial",
      valor: "Rua dos Timbiras, 123 · Funcionários · Belo Horizonte, MG",
    },
    {
      rotulo: "Endereço residencial",
      valor: "Rua dos Timbiras, 123 · Funcionários · Belo Horizonte, MG",
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
      nota: "Opcional. A razão social sai automática: seu nome + seu CPF.",
    },
  ];

  return (
    <ProximosPassosMeiView
      meta={metaDoVoltar(ROTA)}
      campos={CAMPOS}
      nivelGovBrOk={nivelGovBrOk}
      setNivelGovBrOk={setNivelGovBrOk}
      onVoltar={() => router.push(anterior(ROTA))}
      onCopiarTudo={() => {
        // Contexto inseguro / WebView sem clipboard não pode derrubar a tela:
        // os valores continuam visíveis e selecionáveis um a um.
        try {
          void navigator.clipboard?.writeText(
            CAMPOS.map((c) => `${c.rotulo}: ${c.valor}`).join("\n"),
          );
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
      /* 🔄 28/08 (decisão do Pedro) — com o CNPJ na mão vem o CERTIFICADO, não
         a home. Ele destrava a operação otimizada (guias, FGTS Digital,
         procuração), e tem que estar resolvido ANTES da pessoa cair dentro do
         app com as funcionalidades. */
      onConfirmarCnpj={() => router.push(proxima(ROTA))}
    />
  );
}

export default function ProximosPassosMeiPage() {
  return (
    <Suspense>
      <ProximosPassosConteudo />
    </Suspense>
  );
}
