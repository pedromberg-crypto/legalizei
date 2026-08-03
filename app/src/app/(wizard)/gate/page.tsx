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
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Mock do b1.mapeamento (IA dublada). Espelha os vereditos do motor.
// `Resultado` / `Veredito` vêm de @/components/veredito (fonte única A2).
function mapear(texto: string): Resultado {
  const t = texto.toLowerCase();
  if (/nutri|dentist|médic|medic|advog|arquitet|psicó|psico/.test(t)) {
    return {
      humano: "Atividade regulamentada",
      explica: "Sua área precisa de responsável técnico registrado no conselho.",
      cnae: "8650-0/02",
      veredito: "waitlist",
    };
  }
  if (/loja|revend|estoque|vend[oa] produto|comérci|comerci|restaurante/.test(t)) {
    return {
      humano: "Comércio",
      explica: "Você vende produtos, não serviço.",
      cnae: "4713-0/02",
      veredito: "nao-atende",
    };
  }
  // Dados reais do 6201-5/02 (contabilizei-cnae-completo.json + CONCLA/IBGE).
  // As `vizinhas` fazem DUAS coisas: guarda-corpo do falso-🟢 (quem tem outra
  // atividade PRINCIPAL se corrige aqui, antes do pagamento) e porta de entrada
  // dos CNAEs secundários (quem faz as duas coisas descobre que cabe).
  return {
    humano: "Criação de sites e web design",
    explica: "Você entrega sites e presença digital pra outras empresas.",
    cnae: "6201-5/02",
    veredito: "atende",
    compreende: [
      "Criar e desenvolver sites, páginas e portais na internet",
      "Desenhar a interface (o visual e a navegação) desses sites",
    ],
    vizinhas: [
      { oque: "Sistema sob medida, customizável", cnae: "6202-3/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Software pronto, de prateleira", cnae: "6203-1/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Consultoria em tecnologia", cnae: "6204-0/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Design gráfico (logo, material impresso)", cnae: "7410-2/99", comoSecundaria: "mesmo-imposto" },
    ],
    fiscal: { entradas: [6, 15.5], dependeProLabore: true },
  };
}

type Etapa =
  | "perguntando"
  | "analisando"
  | "veredito"
  | "triagem"
  | "faixa";

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
  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");

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
            onSeguir={() => router.push("/conta")}
            // 🆕 03/08 — UX-68 mesclado: revela o campo inline em vez de
            // trocar a tela inteira. Fonte: /apresentacao.
            exatoInline
          />
        )}
      </main>
    </>
  );
}
