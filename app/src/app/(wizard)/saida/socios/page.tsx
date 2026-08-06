import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_SOCIOS as D } from "@/lib/dados-saida";

/**
 * A9 · SAÍDA — 3 OU MAIS SÓCIOS · UX-09 · persona `bloq-3socios`
 *
 * Barra na triagem do N4, antes do dinheiro (UX-21).
 *
 * ─── "LIMITE DO PRODUTO, NÃO DA LEI" (UX-09, literal) ────────────────────
 * Esta é a diferença que separa esta tela da do exterior, e ela é obrigatória
 * na copy. Lá **a lei** impede. Aqui **nós** é que ainda não fazemos: a decisão
 * de 15/07 travou o MVP em no máximo 2 sócios, porque cada sócio a mais
 * multiplica assinatura, consenso (UX-44) e casos de borda no contrato.
 *
 * Fingir que é regra externa seria mentir pra parecer menos limitado. Dizer que
 * o limite é nosso custa um pouco de orgulho e compra a confiança inteira — é a
 * mesma escolha do teaser mostrando o piso R$0.
 *
 * Isso também muda o que a gente promete: sendo limite nosso, ele **pode cair**.
 * A copy diz isso sem cravar prazo (não existe prazo decidido).
 *
 * 🟡 Sem UX-42 aqui também: modelar "2 sócios + 1 depois" ou "o escritório faz
 * os 3" como opções cotadas depende de decisão do Mauro.
 *
 * 🆕 06/08 — o conteúdo (`D`) virou `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`).
 */

export default function SaidaSociosPage() {
  return (
    <>
      <TelaHeader meta="Sobre o seu caso" />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
