import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_EXTERIOR as D } from "@/lib/dados-saida";

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
 *
 * 🆕 06/08 — o conteúdo (`D`) virou `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`).
 */

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
