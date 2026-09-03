import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_MEI_SERVIDOR as D } from "@/lib/dados-saida";

/**
 * M-T.2 · SAÍDA — SERVIDOR PÚBLICO FEDERAL (ramo MEI)
 *
 * 🆕 28/08. Nasce do `ImpedimentoView` (M-T, `components/mei-telas.tsx`).
 *
 * ⚠️ A vedação é do art. 117 da Lei 8.112/90 e vale só pro servidor FEDERAL na
 * ativa. A saída não fecha a porta pra estadual/municipal de propósito: lá a
 * regra vem do estatuto de cada ente, e em muitos casos é permitido — mandar
 * essa pessoa embora seria perder cliente por regra que não se aplica a ela.
 *
 * O conteúdo (`D`) vem de `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`).
 */

export default function SaidaMeiServidorPage() {
  return (
    <>
      <TelaHeader meta="Sobre o seu caso" semVoltar />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
