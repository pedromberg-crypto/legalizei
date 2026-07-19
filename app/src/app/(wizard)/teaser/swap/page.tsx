import { TeaserView, type DadosTeaser } from "@/components/teaser";
import { FISCAL, FAIXA_MEDIA } from "@/lib/fiscal";

/**
 * N5 · Teaser — modo SWAP (há família de CNAE).
 * O único modo que crava número: a economia vem da troca de código, que já é
 * conhecida desde o N4. Não depende da margem do cliente.
 *
 * Caso real do vault: a persona `instrutora` dá treinamento e consultoria —
 * 7020-4/00 (15,5%) × 8599-6/04 (6%). A diferença é a economia.
 */
const fat = FAIXA_MEDIA["10-20k"];
const economia = Math.round((FISCAL.ANEXO_V - FISCAL.ANEXO_III) * fat);

const T: DadosTeaser = {
  modo: "swap",
  atividade: "Treinamento e capacitação",
  faixa: "R$ 10 a 20 mil",
  valor: economia,
};

export default function TeaserSwapPage() {
  return <TeaserView t={T} />;
}
