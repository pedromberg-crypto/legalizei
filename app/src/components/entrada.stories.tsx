import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EntradaView, type Intencao } from "./entrada";

/**
 * 🟢 PRODUÇÃO REAL — N3, o fork que divide o produto em 2 flows. Rota
 * `/entrada`. A palavra "migrar" NUNCA aparece (UX-55) — a copy pergunta pelo
 * FATO ("já tenho empresa"), não pela operação. Passo 2 = gate de cidade
 * (BH-MG, MLP).
 */
const meta = {
  title: "Telas/EntradaView (N3)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Interativo({ comMigrar = true }: { comMigrar?: boolean }) {
  const [intencao, setIntencao] = useState<Intencao | null>(null);
  return (
    <div className="app-page mx-auto max-w-sm border-x border-border-hairline" style={{ height: 700 }}>
      <EntradaView
        intencao={intencao}
        onIntencao={setIntencao}
        onSeguir={() => {}}
        onMigrar={comMigrar ? () => {} : undefined}
        onForaBh={() => {}}
        onLogin={() => {}}
      />
    </div>
  );
}

export const Passo1Fork: Story = { render: () => <Interativo /> };

export const Passo2GateCidade: Story = {
  render: () => {
    function Wrapper() {
      const [intencao, setIntencao] = useState<Intencao | null>("abrir");
      return (
        <div className="app-page mx-auto max-w-sm border-x border-border-hairline" style={{ height: 700 }}>
          <EntradaView
            intencao={intencao}
            onIntencao={setIntencao}
            onSeguir={() => {}}
            onMigrar={() => {}}
            onForaBh={() => {}}
            onLogin={() => {}}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
};

export const MigrarSemFlow2Ligado: Story = {
  render: () => <Interativo comMigrar={false} />,
};
