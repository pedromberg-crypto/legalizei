import { ResumoValorView } from "@/components/resumo-valor";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N5' — RESUMO DE VALOR (rota standalone pra review no /mockup).
 * ═══════════════════════════════════════════════════════════════════════════
 * No flow real vem logo após a faixa (sub-passo do gate) e antes do N6 conta.
 * Aqui, mock da faixa "10-20k" pra a tela ganhar um tile.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ResumoPage() {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Sua economia</p>
      </header>
      <main className="app-main">
        <ResumoValorView faixaId="10-20k" faixaLabel="R$ 10 a 20 mil" />
      </main>
    </>
  );
}
