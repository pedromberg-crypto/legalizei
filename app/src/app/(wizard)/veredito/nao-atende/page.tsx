import { VereditoView, type Resultado } from "@/components/veredito";

/**
 * A2 · Veredito — estado 🔴 CONTATO ESPECIAL (atendido pelo Mauro).
 * ⚠️ 28/07 (reunião Rua Satélite 9): relabel — era "Comercial Mauro". O 🔴
 * virou 2 destinos (`motivo`); este é o caso "não atendemos, MAS a Legalize
 * Digital atende". O outro (`descarta`, ninguém atende) é a página VD nova.
 * Sai pelo TEMPLATE de saída graciosa (A9). ⚠️ Coral nunca é erro: usa token
 * de estado.
 */
const R: Resultado = {
  humano: "Comércio",
  explica: "Você vende produtos, não serviço — a gente só atende quem presta serviço.",
  cnae: "4713-0/02",
  veredito: "nao-atende",
  motivo: "mauro",
};

export default function VereditoNaoAtendePage() {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>
      <main className="app-main">
        <VereditoView r={R} />
      </main>
    </>
  );
}
