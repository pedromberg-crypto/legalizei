import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_SOCIO_PJ as D } from "@/lib/dados-saida";

/**
 * E5.6 · SAÍDA — SÓCIO PESSOA JURÍDICA
 *
 * 🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — sócio pessoa jurídica
 * tira a empresa do Simples Nacional no ATO do contrato social (regra
 * fiscal, não limite do produto). Barra na TRIAGEM do gate (E5T), antes do
 * dinheiro — mesma doutrina UX-21 das outras saídas de triagem (exterior,
 * 5+ sócios). Antes disso, o bloqueio só existia lá na frente, dentro do
 * dossiê (C3, `SociosView`) — tarde demais, depois de já ter passado pelo
 * pagamento.
 *
 * O conteúdo (`D`) vem de `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`).
 */

export default function SaidaSocioPjPage() {
  return (
    <>
      <TelaHeader meta="Sobre o seu caso" />
      <main className="app-main">
        <SaidaView d={D} />
      </main>
    </>
  );
}
