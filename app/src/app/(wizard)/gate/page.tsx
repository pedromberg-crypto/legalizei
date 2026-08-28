"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TriagemView, FaixaView } from "@/components/gate-telas";
import { ImpedimentoView } from "@/components/mei-telas";
import { IMPEDIMENTOS } from "@/lib/mei";
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
 *
 * ─── 🆕 28/08 — A BIFURCAÇÃO MEI ───────────────────────────────────────────
 * O 1º passo desta rota agora depende do regime:
 *   · **ME** → `TriagemView` (sócios: quantos, CPF×CNPJ, exterior). Inalterada.
 *   · **MEI** → `ImpedimentoView` (outra empresa, servidor federal, benefício).
 *
 * A troca não é cosmética: o MEI **não tem sócio** (é unipessoal por
 * definição, art. 966 do CC), então as 3 perguntas da triagem do ME não
 * existem pra ele. Em compensação, ele tem 3 impedimentos que o ME não tem, e
 * que o próprio governo checa e bloqueia no ato do registro.
 *
 * As duas bifurcações compartilham o 2º passo (`FaixaView`), mas lá o MEI
 * ganha o **gate de teto** (R$81.000/ano, LC 123 art. 18-A) via `regimeMei`.
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

  // 🆕 28/08 — estado do M-T (só usado no ramo MEI).
  const [impedimentos, setImpedimentos] = useState<Record<string, boolean | null>>(
    Object.fromEntries(IMPEDIMENTOS.map((i) => [i.id, null])),
  );
  const [cienteBeneficio, setCienteBeneficio] = useState(false);

  /** Qual saída o impedimento respondido "sim" leva. */
  function saidaDoImpedimento() {
    if (impedimentos["outra-empresa"] === true) return "/saida/mei-outra-empresa";
    return "/saida/mei-servidor";
  }

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>

      <main className="app-main">
        {/* 1º passo · ME = triagem de sócios · MEI = impedimentos legais */}
        {etapa === "triagem" && mei && (
          <ImpedimentoView
            respostas={impedimentos}
            setResposta={(id, v) =>
              setImpedimentos((r) => ({ ...r, [id]: v }))
            }
            cienteBeneficio={cienteBeneficio}
            setCienteBeneficio={setCienteBeneficio}
            onSeguir={() => setEtapa("faixa")}
            onSaida={() => router.push(saidaDoImpedimento())}
          />
        )}
        {etapa === "triagem" && !mei && (
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
            // 🆕 28/08 — só no MEI: vira gate do teto de R$81.000/ano.
            regimeMei={mei}
            onTrocarParaMe={() =>
              router.push(
                comCategoria(comEndereco("/gate?etapa=faixa", enderecoFiscal), categoria),
              )
            }
          />
        )}
      </main>
    </>
  );
}
