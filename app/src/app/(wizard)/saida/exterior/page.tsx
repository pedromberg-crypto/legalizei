import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

/**
 * A9 · SAÍDA — SÓCIO NO EXTERIOR · UX-07 · persona `bloq-exterior`
 *
 * Barra na triagem do N4, **antes do dinheiro** (UX-21). Antes da reordenação
 * isso só era detectado lá no N10, depois de o cliente investir os dados do 1º
 * sócio — e, com a cobrança no N9, teria cobrado de quem não pode abrir.
 *
 * ─── A COISA MAIS IMPORTANTE DESTA TELA ──────────────────────────────────
 * "Empresa existe, mas fora do Simples" (UX-07, literal). A lei impede a OPÇÃO
 * PELO SIMPLES quando há sócio domiciliado no exterior — LC 123, art. 17, II.
 * Não impede abrir empresa. São coisas diferentes, e confundir as duas faria a
 * gente dar uma notícia muito pior do que a verdadeira.
 *
 * O nosso MVP só faz Simples. Então quem cai aqui não é "inelegível pra ter
 * CNPJ": é alguém que precisa de outro regime, e disso o time do Mauro cuida.
 *
 * 🟡 Não cotamos Lucro Presumido aqui (UX-42): exige decisão de Mauro/Larissa
 * sobre atender esse caso e a que preço. Número sem fonte não entra, ainda
 * mais na tela em que a pessoa está decidindo se desiste.
 */
const D: DadosSaida = {
  titulo: "Com sócio morando fora, o caminho é outro",
  explica:
    "A sua empresa pode existir normalmente. O que a lei não permite é ela entrar no Simples Nacional, que é o regime em que a gente abre empresa aqui pelo app.",
  origem: {
    rotulo: "De onde vem essa regra",
    texto:
      "Lei Complementar 123, artigo 17: empresa com sócio que mora no exterior não pode optar pelo Simples Nacional.",
  },
  saida:
    "Existem outros regimes que atendem o seu caso, e o nosso time contábil faz esse tipo de abertura fora do app. Quer conversar com eles?",
};

export default function SaidaExteriorPage() {
  return (
    <>
      <TelaHeader meta="Sobre o seu caso" />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
