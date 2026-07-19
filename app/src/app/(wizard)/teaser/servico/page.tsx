import { TeaserView, type DadosTeaser } from "@/components/teaser";

/**
 * N5 · Teaser — modo SERVIÇO (Anexo III direto, sem Fator R).
 *
 * SEM número (UX-49). A atividade já cai na tabela mais barata, então não há
 * alavanca fiscal a puxar. Inventar economia aqui seria criar dívida sem
 * lastro — exatamente o erro que o teaser existe pra evitar.
 *
 * Caso do vault: 8599-6/04 é Anexo III **direto** (SC Cosit 205/14 +
 * SRRF08 8022/18). O motor já errou isso uma vez, dizendo "Anexo V" e
 * recomendando um pró-labore ótimo inútil (bug achado na persona govbr-bronze).
 */
const T: DadosTeaser = {
  modo: "servico",
  atividade: "Curso livre e treinamento",
  faixa: "R$ 10 a 20 mil",
};

export default function TeaserServicoPage() {
  return <TeaserView t={T} />;
}
