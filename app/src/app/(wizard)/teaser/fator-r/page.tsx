import { TeaserView, type DadosTeaser } from "@/components/teaser";
import { FISCAL, FAIXA_MEDIA } from "@/lib/fiscal";

/**
 * N5 · Teaser — modo FATOR R (sujeita ao Fator R, sem família de swap).
 *
 * Promete FAIXA, não número. O piso é R$ 0 de propósito: a economia depende de
 * quanto o sócio consegue se pagar, e isso depende da margem dele. Como a faixa
 * inclui zero, não existe piso a violar — foi assim que a `promessa-quebrada`
 * deixou de ser risco estrutural (reordenacao-flow §2, UX-51).
 *
 * É o caso do 6201-5/02 (web design) e do 7319-0/04 (consultoria em
 * publicidade): anexos [III, V] com fator_r = true.
 */
const fat = FAIXA_MEDIA["10-20k"];
const teto = Math.round((FISCAL.ANEXO_V - FISCAL.ANEXO_III) * fat);

const T: DadosTeaser = {
  modo: "fator-r",
  atividade: "Criação de sites e web design",
  faixa: "R$ 10 a 20 mil",
  valor: teto,
};

export default function TeaserFatorRPage() {
  return <TeaserView t={T} />;
}
