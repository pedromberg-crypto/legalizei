import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🟢 ATENDE (happy path).
 * Mock de review: renderiza a fonte única (VereditoView) num resultado fixo.
 * No produto isto é um sub-estado do N4; aqui é rota própria pra a esteira A2
 * mostrar o estado isolado, sem digitar no gate.
 */
/**
 * Dados REAIS do 6201-5/02, extraídos de
 * pesquisa/cnae-matriz/contabilizei-cnae-completo.json (descrição oficial
 * "WEB DESIGN", classe 62015, seção J). O "compreende"/"não compreende" vem
 * da classificação CONCLA/IBGE — não é copy inventada.
 *
 * ⚠️ `anexo` SAIU: o dado real é `anexos:[III,V]` + `fator_r:true`. Dizer
 * "Anexo III" fixo era errado (achatava o Fator R, que é a feature-âncora) e
 * era jargão não-ratificado na cara do cliente pré-pagamento.
 */
const R: Resultado = {
  humano: "Criação de sites e web design",
  explica: "Você entrega sites e presença digital pra outras empresas.",
  cnae: "6201-5/02",
  veredito: "atende",
  compreende: [
    "Criar e desenvolver sites, páginas e portais na internet",
    "Desenhar a interface (o visual e a navegação) desses sites",
  ],
  // Os 4 vizinhos foram conferidos no dataset: TODOS atendidos, anexos [III,V],
  // fator_r true e abertura "liso" — iguais ao principal. Logo `mesmo-imposto`.
  // Era aqui que estava o defeito: listá-los como "não entra" fazia o designer
  // que também faz web achar que a gente recusa metade do trabalho dele.
  vizinhas: [
    {
      oque: "Sistema sob medida, customizável",
      cnae: "6202-3/00",
      comoSecundaria: "mesmo-imposto",
    },
    {
      oque: "Software pronto, de prateleira",
      cnae: "6203-1/00",
      comoSecundaria: "mesmo-imposto",
    },
    {
      oque: "Consultoria em tecnologia",
      cnae: "6204-0/00",
      comoSecundaria: "mesmo-imposto",
    },
    {
      oque: "Design gráfico (logo, material impresso)",
      cnae: "7410-2/99",
      comoSecundaria: "mesmo-imposto",
    },
  ],
  // anexos [III,V] + fator_r:true no dataset → 6% (III) × 15,5% (V), decidido
  // pelo pró-labore. Entradas conferidas em fiscal-simples-bh-2026 (LC 123).
  fiscal: { entradas: [6, 15.5], dependeProLabore: true },
};

export default function VereditoAtendePage() {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>
      <main className="app-main">
        {/* 🆕 03/08 — UX-65 ligado (já travado 31/07: "veredito 🟢 ganhou
            cards clicáveis, trava o CNAE direto"; o wrapper nunca tinha sido
            atualizado pra passar a prop). Fonte: /apresentacao. */}
        <VereditoView r={R} mostrarAlternativas />
      </main>
    </>
  );
}
