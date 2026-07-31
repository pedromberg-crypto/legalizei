import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeView } from "./welcome";

/**
 * 🟢 PRODUÇÃO REAL — N2, 3 slides puláveis. As 3 teses da marca, na ordem que
 * desarmam a desconfiança: contador de verdade · a parte chata é com a gente
 * · sem susto no boleto. Trilho por scroll-snap nativo, dots leem do scroll.
 * 🐛 achado na extração (31/07): "Começar" não navegava — corrigido.
 */
const meta = {
  title: "Telas/WelcomeView (N2)",
  component: WelcomeView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WelcomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline" style={{ height: 700 }}>
      {children}
    </div>
  );
}

export const Slide1_ContadorDeVerdade: Story = {
  render: (args) => <Shell><WelcomeView {...args} slideInicial={0} /></Shell>,
};

export const Slide2_AParteChataEComAGente: Story = {
  render: (args) => <Shell><WelcomeView {...args} slideInicial={1} /></Shell>,
};

export const Slide3_SemSustoNoBoleto: Story = {
  render: (args) => <Shell><WelcomeView {...args} slideInicial={2} /></Shell>,
};
