import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Campo, Texto } from "./form";

/**
 * Rótulo literal em cima (universal, UX-48) + dica opcional + filho embaixo.
 * Usado em: N6 (criar conta), N9 (CPF+pagamento), dossiê inteiro.
 */
const meta = {
  title: "DS/Form/Campo",
  component: Campo,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Campo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemDica: Story = {
  args: {
    rotulo: "Nome da empresa",
    children: <Texto valor="" onChange={() => {}} placeholder="Ex: Studio Ana Design" />,
  },
};

export const ComDica: Story = {
  args: {
    rotulo: "Nome da empresa",
    dica: "A gente checa a disponibilidade na Junta quando o pagamento cair.",
    children: <Texto valor="" onChange={() => {}} placeholder="Ex: Studio Ana Design" />,
  },
};
