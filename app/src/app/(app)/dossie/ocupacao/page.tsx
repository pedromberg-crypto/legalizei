"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OcupacaoView } from "@/components/mei-telas";
import { comRegime } from "@/lib/regime";
import { categoriaDe, comCategoria } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M-O — SUA ATIVIDADE (ocupação do Anexo XI) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08. É a **C0 do ramo MEI**: primeira tela do dossiê, logo depois do
 * pagamento, no mesmo lugar que o ME tem `/dossie/atividade`.
 *
 * ⚠️ POR QUE NÃO REUSAR A C0 ───────────────────────────────────────────────
 * A C0 do ME é "descreva com suas palavras → a IA cruza → veredito de CNAE".
 * No MEI isso não existe: o Portal do Empreendedor **não aceita CNAE livre**,
 * só ocupações de uma lista fechada (Anexo XI da Res. CGSN 140/2018). Oferecer
 * um campo de texto criaria a expectativa de que qualquer atividade cabe.
 *
 * A tela também carrega o **limite interno** (Solução de Consulta Cosit nº
 * 27/2021): a ocupação é mais estrita que o CNAE que ela mapeia. Quem escolhe
 * "Reparador(a) de bicicleta" não pode consertar moto, mesmo o CNAE
 * 9529-1/04 parecendo permitir. É o erro que só um contador pega, e é parte do
 * que a gente vende.
 *
 * ─── DE ONDE VEM A LISTA ────────────────────────────────────────────────────
 * Da categoria escolhida no E3.3 (`?cat=`), cruzada com `lib/mei.ts`. Como o
 * E3.3 já barrou as 3 categorias sem MEI, quem chega aqui sempre tem opção —
 * o `OcupacaoView` ainda tem guarda-corpo pro caso de deep-link furado.
 *
 * ─── O QUE ELA SUBSTITUI NO RESTO DO DOSSIÊ ────────────────────────────────
 * As secundárias são escolhidas AQUI (até 15, limite oficial), então o ramo
 * MEI pula o C5 (`/dossie/cnae-secundarios`) — não é omissão, é a mesma
 * informação coletada uma vez só.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function OcupacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = categoriaDe(searchParams);

  const [principal, setPrincipal] = useState<string | null>(null);
  const [secundarias, setSecundarias] = useState<string[]>([]);

  return (
    <OcupacaoView
      categoria={categoria}
      principal={principal}
      setPrincipal={setPrincipal}
      secundarias={secundarias}
      setSecundarias={setSecundarias}
      // C1 (`/dossie/socio`) é compartilhada com o ME: os campos que o MEI
      // precisa (RG, órgão emissor, nascimento, nome da mãe) já são os mesmos.
      onSeguir={() =>
        router.push(comCategoria(comRegime("/dossie/socio", true), categoria))
      }
    />
  );
}
