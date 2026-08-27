"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TriagemView, FaixaView } from "@/components/gate-telas";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E5 — TRIAGEM + FAIXA · rota de produção (shell: WIZARD, fora do app)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ AS TELAS vivem em `components/gate-telas.tsx` (`TriagemView`,
 * `FaixaView`). Esta page é o ORQUESTRADOR: guarda o estado e liga a
 * navegação real. Mexeu no visual/copy? Mexe no componente.
 *
 * ─── 🔄 27/08 — ESTA ROTA ENCOLHEU (reordenação do flow de entrada) ─────────
 * O `/gate` era a "porta" inteira: descrever atividade (E5A) → veredito de
 * CNAE (E5V) → desambiguação → triagem (E5T) → faixa (E5F), tudo antes do
 * dinheiro. As duas primeiras **saíram daqui** e viraram a C0
 * (`/dossie/atividade`), DEPOIS do pagamento — porque o gate de elegibilidade
 * virou a categoria escolhida no E3.3, que só lista o que a gente atende.
 * Racional completo em `app/(app)/dossie/atividade/page.tsx`.
 *
 * ⚠️ **Triagem e faixa NÃO foram junto, e isso é decisão, não esquecimento.**
 * Elas bloqueiam por motivos que a categoria não cobre:
 *   · sócio via CNPJ tira a empresa do Simples no ato do contrato social;
 *   · sócio domiciliado fora do Brasil derruba o Simples (LC 123 art. 17);
 *   · 5+ sócios é limite do produto.
 * Nenhum desses é previsível pela atividade. Movê-los pra depois do pagamento
 * criaria pedido de reembolso pra um caso que hoje não existe: a gente nunca
 * cobra de quem já sabe que não pode ser atendido.
 *
 * ⚠️ 28/07 — DEEP-LINK por `?etapa=` (mesmo padrão de /notas/detalhe?s=).
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Etapa = "triagem" | "faixa";

export default function GatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Flags que atravessam o wizard (RF-01: querystring, sem persistência real).
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const categoria = categoriaDe(searchParams);

  const etapaParam = searchParams.get("etapa");
  const [etapa, setEtapa] = useState<Etapa>(etapaParam === "faixa" ? "faixa" : "triagem");

  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);
  // 🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — CPF/CNPJ do sócio.
  const [socioTipo, setSocioTipo] = useState<"cpf" | "cnpj" | null>(null);
  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");
  // 🆕 26/08 (reunião Rua Satélite 36) — coorte pousou na Triagem de vez.
  const [coorte, setCoorte] = useState<"primeira" | "ja-abri" | null>(null);

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>

      <main className="app-main">
        {etapa === "triagem" && (
          <TriagemView
            socios={socios}
            setSocios={setSocios}
            exterior={exterior}
            setExterior={setExterior}
            socioTipo={socioTipo}
            setSocioTipo={setSocioTipo}
            onSeguir={() => setEtapa("faixa")}
            onSaida={(rota) => router.push(rota)}
            coorte={coorte}
            setCoorte={setCoorte}
          />
        )}
        {etapa === "faixa" && (
          <FaixaView
            faixa={faixa}
            setFaixa={setFaixa}
            modoExato={modoExato}
            setModoExato={setModoExato}
            exato={exato}
            setExato={setExato}
            onSeguir={() =>
              router.push(
                comCategoria(
                  comEndereco(comRegime("/conta", mei), enderecoFiscal),
                  categoria,
                ),
              )
            }
            // 🆕 03/08 — UX-68 mesclado: revela o campo inline em vez de
            // trocar a tela inteira. Fonte: /apresentacao.
            exatoInline
          />
        )}
      </main>
    </>
  );
}
