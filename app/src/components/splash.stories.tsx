import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SplashView } from "./splash";

/**
 * 🟢 PRODUÇÃO REAL — N1, a primeira coisa que o lead vê. Sem arquétipo (não
 * pergunta, não julga): é a marca se apresentando. Único momento do produto
 * em que o coral cobre a tela toda. NÃO auto-navega (decisão) — o handoff
 * N1→N2 é do router, não da tela.
 */
const meta = {
  title: "Telas/SplashView (N1)",
  component: SplashView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SplashView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [(S) => <div style={{ position: "relative", height: 700 }}><S /></div>],
};
