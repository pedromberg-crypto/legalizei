import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_MEI_OUTRA_EMPRESA as D } from "@/lib/dados-saida";

/**
 * M-T.1 · SAÍDA — JÁ TEM OUTRA EMPRESA (ramo MEI)
 *
 * 🆕 28/08. Nasce do `ImpedimentoView` (M-T, `components/mei-telas.tsx`), a
 * triagem de impedimento que roda ANTES do pagamento no caminho MEI.
 *
 * ⚠️ Diferente das saídas de triagem do ME, aqui quem barra é a Receita
 * Federal, não o nosso produto: a LC 123 art. 18-A proíbe o titular de MEI de
 * participar de outra PJ, e o cruzamento de CPF acontece dentro do próprio
 * Portal do Empreendedor. Por isso a saída oferece o ME (solução real) em vez
 * de lista de espera.
 *
 * O conteúdo (`D`) vem de `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`).
 */

export default function SaidaMeiOutraEmpresaPage() {
  return (
    <>
      <TelaHeader meta="Sobre o seu caso" semVoltar />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
