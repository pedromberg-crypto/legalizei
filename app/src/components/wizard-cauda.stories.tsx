import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RevisarView, TermoView, AssinaturaView, HomeAtivacaoView, AguardandoView } from "./wizard-cauda";

/**
 * 🟢 PRODUÇÃO REAL — A CAUDA (N19-N22) + P0 (home dia-1) + a pausa de
 * pagamento/status (P2). `PainelView` NÃO está aqui — vive em
 * `components/painel.tsx`, mas `AguardandoView` delega pra ela (fusão A3+E9,
 * 31/08). P0 substitui o N24 (SWAP 29/07). P1 (`RetomarView`) foi retirada:
 * retomar é sempre o P2 (`AguardandoView`, `pago`).
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

export const P1_RetomarDeOndeParou: Story = {
  render: () => <Shell><AguardandoView pago onSeguir={() => {}} /></Shell>,
};

export const P2_AguardandoBoleto: Story = { render: () => <Shell><AguardandoView onSeguir={() => {}} /></Shell> };

export const P2_AguardandoBoletoPago: Story = {
  render: () => <Shell><AguardandoView pago onSeguir={() => {}} /></Shell>,
};

export const P2_StatusFaseJunta: Story = {
  render: () => (
    <Shell>
      <AguardandoView fase="junta" onPagarDae={() => {}} />
    </Shell>
  ),
};
