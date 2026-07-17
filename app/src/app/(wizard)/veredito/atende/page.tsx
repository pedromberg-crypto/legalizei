import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🟢 ATENDE (happy path).
 * Mock de review: renderiza a fonte única (VereditoView) num resultado fixo.
 * No produto isto é um sub-estado do N4; aqui é rota própria pra a esteira A2
 * mostrar o estado isolado, sem digitar no gate.
 */
const R: Resultado = {
  humano: "Criação de sites e web design",
  explica: "Você entrega sites e presença digital pra outras empresas.",
  cnae: "6201-5/02",
  anexo: "Anexo III",
  veredito: "atende",
};

export default function VereditoAtendePage() {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizei</p>
      </header>
      <main className="app-main">
        <VereditoView r={R} />
      </main>
    </>
  );
}
