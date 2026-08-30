"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TriagemView, FaixaView } from "@/components/gate-telas";
import { TelaHeader } from "@/components/ui/tela";
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

  // 🐛 29/08 (achado do Pedro testando no iPhone) — a demo (`/apresentacao`)
  // já vinha com "Só eu" pré-selecionado, a rota real não. É o mais comum
  // entre os prestadores de serviço (mesma copy do card de reforço logo
  // abaixo em `gate-telas.tsx`), faz sentido como ponto de partida.
  const [socios, setSocios] = useState<number | null>(1);
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

  /** 🆕 29/08 — comum às 2 rotas de voltar reais (endereço) e local (faixa→triagem). */
  function onVoltarComum() {
    if (etapa === "faixa") {
      setEtapa("triagem");
      return;
    }
    router.push(comRegime("/endereco", mei));
  }

  return (
    <>
      {/* 🐛 29/08 (achado do Pedro testando no iPhone) — a rota real não tinha
          seta de voltar nenhuma, só um header estático "Legalizai". A que
          aparecia na `/apresentacao` era chrome do PRÓPRIO demo (botão fora
          da moldura do aparelho), não algo desta tela.
          ⚠️ `ImpedimentoView` (ramo MEI) já traz o PRÓPRIO header+main —
          renderizar ele aqui dentro aninhava `<main>` dentro de `<main>` e
          duplicava o header. Ele fica de fora deste wrapper, com seu próprio
          `onVoltar`. */}
      {etapa === "triagem" && mei ? (
        <ImpedimentoView
          respostas={impedimentos}
          setResposta={(id, v) => setImpedimentos((r) => ({ ...r, [id]: v }))}
          cienteBeneficio={cienteBeneficio}
          setCienteBeneficio={setCienteBeneficio}
          onSeguir={() => setEtapa("faixa")}
          onSaida={() => router.push(saidaDoImpedimento())}
          onVoltar={onVoltarComum}
        />
      ) : (
        <>
          {/* `meta` segue o mesmo padrão do resto do wizard (nome do DESTINO
              do voltar, não desta tela): "faixa" volta pro passo interno
              "triagem"; "triagem" volta pro E3.3 (`/endereco`). */}
          <TelaHeader
            meta={etapa === "faixa" ? "Perguntas rápidas" : "Sobre sua empresa"}
            onVoltar={onVoltarComum}
          />

          <main className="app-main">
        {etapa === "triagem" && !mei && (
          <TriagemView
            socios={socios}
            setSocios={setSocios}
            onSeguir={() => setEtapa("faixa")}
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
      )}
    </>
  );
}
