import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EntradaView } from "./entrada";

/**
 * 🟢 PRODUÇÃO REAL — E3, o fork que divide o produto em 2 caminhos. Rota
 * `/entrada`. A palavra "migrar" NUNCA aparece (UX-55) — a copy pergunta pelo
 * FATO ("já tenho empresa"), não pela operação.
 *
 * 🔴 27/08 — o **passo 2 (gate de cidade)** foi REMOVIDO desta tela e as
 * stories dele saíram junto. Ele perguntava "é em BH?" e acreditava no clique;
 * quem valida cidade agora é o E3.3 (`/endereco`), pelo CEP. Ver
 * `components/entrada-lead.tsx`.
 */
const meta = {
  title: "Telas/EntradaView (E3)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fork: Story = {
  render: () => (
    <div
      className="app-page mx-auto max-w-sm border-x border-border-hairline"
      style={{ height: 700 }}
    >
      <EntradaView onIntencao={() => {}} onLogin={() => {}} />
    </div>
  ),
};

/** UX-63 — card de destaque em coral-600 (o que roda em produção). */
export const ForkDestaqueCoral600: Story = {
  render: () => (
    <div
      className="app-page mx-auto max-w-sm border-x border-border-hairline"
      style={{ height: 700 }}
    >
      <EntradaView onIntencao={() => {}} onLogin={() => {}} destaqueCoral600 />
    </div>
  ),
};
