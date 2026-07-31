import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RevisarView, TermoView, AssinaturaView, HomeAtivacaoView, RetomarView, AguardandoView } from "./wizard-cauda";

/**
 * 🟢 PRODUÇÃO REAL — A CAUDA (N19-N22) + P0 (home dia-1) + as 2 pausas de
 * pagamento (P1, P2). `PainelView` (N21) NÃO está aqui — vive em
 * `components/painel.tsx` desde antes. P0 substitui o N24 (SWAP 29/07).
 */
const meta = {
  title: "Telas/Cauda N19-N22 + P0",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline" style={{ height: 700 }}>
      {children}
    </div>
  );
}

export const N19_RevisarDossie: Story = { render: () => <Shell><RevisarView onSeguir={() => {}} /></Shell> };

function TermoInterativo() {
  const [aceito, setAceito] = useState(false);
  return <TermoView aceito={aceito} setAceito={setAceito} onSeguir={() => {}} />;
}
export const N20_TermoIrreversivel: Story = { render: () => <Shell><TermoInterativo /></Shell> };

export const N22_AssinaturaGovBr: Story = { render: () => <Shell><AssinaturaView onSeguir={() => {}} /></Shell> };

export const P0_HomeDia1Ativacao: Story = {
  render: () => <Shell><HomeAtivacaoView /></Shell>,
};

export const P1_RetomarDeOndeParou: Story = { render: () => <Shell><RetomarView onSeguir={() => {}} /></Shell> };

export const P2_AguardandoBoleto: Story = { render: () => <Shell><AguardandoView onSeguir={() => {}} /></Shell> };
