"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VereditoView, type Resultado } from "@/components/veredito";
import {
  PerguntaView,
  AnalisandoView,
  TriagemView,
  FaixaView,
} from "@/components/gate-telas";
import { ehMei, comRegime } from "@/lib/regime";
import { comEndereco } from "@/lib/endereco";
import { mapear } from "@/lib/mock-veredito";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N4 — GATE-CNAE  ·  rota de produção (shell: WIZARD, fora do app)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/reordenacao-flow-cobranca-cedo.md (N4)
 * Motor: execucao/motor-testes/flow-schema.js → b1.descricao · b1.mapeamento
 *        · b1.desambiguacao · b1.filtro · b1.veredito · b1.triagem · b1.faturamento
 *
 * ⚠️ AS TELAS vivem em `components/gate-telas.tsx` desde 29/07 (`PerguntaView`,
 * `AnalisandoView`, `TriagemView`, `FaixaView`) — mesma extração que
 * `VereditoView` já tinha. Esta page é o ORQUESTRADOR: guarda o
 * estado do gate, chama o mock da IA e liga a navegação real.
 *
 * 🆕 31/07 — ENCAIXE REMOVIDO (era `components/encaixe.tsx` → `EncaixeView`,
 * entre veredito e triagem). Ficou redundante desde que o veredito 🟢 ganhou
 * cards clicáveis (UX-65, 29/07): as duas telas faziam a mesma pergunta.
 * Confirmado pelo Pedro que a tela não é mais usada. `ConteudoCnae` e
 * `OutrasOpcoes` (o miolo visual) continuam vivos — `VereditoView` os usa
 * direto. Ver flow-data.mjs (nó ENC removido) e HOME-reorganizacao.md.
 * Motivo da extração: a `/apresentacao` precisa renderizar a tela APROVADA, e
 * cópia diverge em silêncio. Mexeu no visual/copy? Mexe no componente.
 *
 * 🚧 IA dublada: no motor o mapeamento CNAE vem da persona; aqui vem de um
 * mock. A tela testa a LÓGICA do fluxo, não a IA.
 *
 * 🆕 06/08 — `mapear()` mudou de casa pra `@/lib/mock-veredito`: era cópia
 * local (só 3 desfechos), divergente da versão usada em `/apresentacao` (4
 * desfechos — 2 travessões só sobreviveram na cópia da demo). Fonte única
 * agora, com os 4 desfechos nos dois lugares.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Etapa = "perguntando" | "analisando" | "veredito" | "triagem" | "faixa";

/**
 * ⚠️ 28/07 — DEEP-LINK por `?etapa=`. As etapas do gate viviam presas dentro
 * de UM SPA: a prancheta (/mockup) só sabia carregar `/gate` do zero, então
 * nunca mostrava veredito/triagem/faixa sem clicar através de tudo —
 * a triagem (sócios+exterior) passou batida numa revisão inteira por causa
 * disso. Mesmo padrão já usado em /notas/detalhe?s= e /blog/post?id=.
 */
const ETAPAS_LINKAVEIS: Etapa[] = ["veredito", "triagem", "faixa"];

export default function GatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 🆕 03/08 — MEI×ME agora decide ANTES do gate, em /entrada (E3.2), logo
  // depois do fork. Chega aqui só como flag pra repassar adiante — o /gate
  // não pergunta mais nada sobre isso.
  const mei = ehMei(searchParams);
  const etapaParam = searchParams.get("etapa") as Etapa | null;
  const etapaInicial: Etapa =
    etapaParam && ETAPAS_LINKAVEIS.includes(etapaParam) ? etapaParam : "perguntando";
  // veredito precisa de um resultado pra renderizar — usa o caso 🟢 atende
  // (o default de `mapear("")`), o mesmo caminho feliz que /veredito/atende
  // já usa como demo.
  const resultadoInicial = etapaInicial === "veredito" ? mapear("") : null;

  const [etapa, setEtapa] = useState<Etapa>(etapaInicial);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [sabeCodigo, setSabeCodigo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(resultadoInicial);
  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);
  // 🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — CPF/CNPJ do sócio.
  const [socioTipo, setSocioTipo] = useState<"cpf" | "cnpj" | null>(null);
  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");
  // 🆕 24/08 (reunião Rua Satélite 35) — coorte saiu do E6, mora aqui agora.
  const [coorte, setCoorte] = useState<"primeira" | "ja-abri" | null>(null);
  // 🆕 26/08 (reunião Rua Satélite 36, item 2) — endereço saiu do C4, mora aqui.
  const [enderecoProprio, setEnderecoProprio] = useState<boolean | null>(null);

  function validar() {
    setEtapa("analisando");
    // 🌾 colhido: o loading não é decorativo, ele EXPLICA o que está acontecendo
    setTimeout(() => {
      setResultado(mapear(texto));
      setEtapa("veredito");
    }, 1400);
  }

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>

      <main className="app-main">
        {etapa === "perguntando" && (
          <PerguntaView
            texto={texto}
            setTexto={setTexto}
            categoria={categoria}
            setCategoria={setCategoria}
            sabeCodigo={sabeCodigo}
            setSabeCodigo={setSabeCodigo}
            onValidar={validar}
          />
        )}
        {etapa === "analisando" && <AnalisandoView />}
        {etapa === "veredito" && resultado && (
          // 🆕 03/08 — mostrarAlternativas (UX-65) + acoesConfirmacao (UX-64
          // parcial) mesclados aqui também: é o fluxo AO VIVO, separado da
          // página-mock /veredito/*. Fonte: /apresentacao.
          <VereditoView
            r={resultado}
            onRefazer={() => setEtapa("perguntando")}
            onSeguir={() => setEtapa("triagem")}
            mostrarAlternativas
            acoesConfirmacao={[
              { label: "Voltar ao início", variante: "ghost", onClick: () => router.push("/entrada") },
            ]}
          />
        )}
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
            coorte={coorte}
            setCoorte={setCoorte}
            enderecoProprio={enderecoProprio}
            setEnderecoProprio={setEnderecoProprio}
            onSeguir={() => router.push(comEndereco(comRegime("/conta", mei), enderecoProprio === false))}
            // 🆕 03/08 — UX-68 mesclado: revela o campo inline em vez de
            // trocar a tela inteira. Fonte: /apresentacao.
            exatoInline
          />
        )}
      </main>
    </>
  );
}
