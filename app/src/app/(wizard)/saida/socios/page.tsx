import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

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
 */
const D: DadosSaida = {
  titulo: "Com três ou mais sócios, ainda não pelo app",
  explica:
    "Não tem nada de errado com a sua sociedade, e a lei permite. É o nosso app que hoje abre empresa com no máximo dois sócios.",
  origem: {
    rotulo: "De onde vem esse limite",
    texto:
      "É uma escolha nossa, não uma regra do governo. A cada sócio a mais mudam as assinaturas e o contrato, e a gente preferiu fazer bem para dois antes de abrir para mais.",
  },
  saida:
    "O escritório que está por trás do app faz esse tipo de abertura todo dia, fora do aplicativo. Quer que a gente te apresente?",
};

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
