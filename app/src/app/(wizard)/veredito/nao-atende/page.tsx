import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🔴 NÃO-ATENDE (comercial / fora do escopo).
 * Também sai pelo TEMPLATE de saída graciosa (A9), mas roteia pro time do Mauro
 * em vez de waitlist. ⚠️ Coral nunca é erro: usa token de estado.
 */
const R: Resultado = {
  humano: "Comércio",
  explica: "Você vende produtos, não serviço.",
  cnae: "4713-0/02",
  anexo: "Anexo I",
  veredito: "nao-atende",
};

export default function VereditoNaoAtendePage() {
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
