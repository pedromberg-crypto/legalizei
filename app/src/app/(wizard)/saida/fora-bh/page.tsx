import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

/**
 * A9 · SAÍDA — FORA DE BELO HORIZONTE · 🆕 28/07 (reunião Rua Satélite 9)
 *
 * Nasce do GATE DE CIDADE (N3G), não da triagem do N4. O MLP testa só em
 * Belo Horizonte/MG — nenhum outro município ou estado ainda. Barra ANTES
 * de qualquer outra pergunta (N3, logo depois do fork), junto com o gate.
 *
 * Mesmo template A9 (barra + explica + captura + roteia) das outras saídas —
 * não é falha do cliente, é limite do MLP.
 */
const D: DadosSaida = {
  titulo: "Por enquanto, só abrimos em Belo Horizonte",
  explica:
    "Estamos testando o produto com foco total numa cidade antes de expandir. Hoje só abrimos empresa em Belo Horizonte/MG.",
  origem: {
    rotulo: "Por que só BH",
    texto:
      "É a fase de testes (MLP) do produto — preferimos fazer bem para uma cidade antes de abrir para mais.",
  },
  saida:
    "Guarda seu contato que a gente avisa assim que abrir pra sua cidade. Enquanto isso, se quiser, nosso time indica opções.",
};

export default function SaidaForaBhPage() {
  return (
    <>
      <TelaHeader meta="Sobre a sua cidade" />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
