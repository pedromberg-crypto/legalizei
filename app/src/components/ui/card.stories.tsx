import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./card";

/**
 * Promovido ao DS na regra dos 3. SEM sombra por padrão (design-system.md §1)
 * — o fundo é papel quente (ink-50), card branco + hairline já separa.
 * Usado em: quase toda tela do wizard e do portal.
 */
const meta = {
  title: "DS/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    tom: { control: "select", options: ["neutro", "marca", "sucesso"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutro: Story = {
  args: { tom: "neutro", children: "Conteúdo padrão do card." },
};

export const Marca: Story = {
  args: {
    tom: "marca",
    children: "Destaque suave (coral-50). Não é aviso — coral nunca é erro.",
  },
};

export const Sucesso: Story = {
  args: {
    tom: "sucesso",
    children: "Boa notícia sobre dinheiro (ex: 'abrir é grátis').",
  },
};

/** Compilado — os 3 tons empilhados, pra comparar de uma vez. */
export const TodosOsTons: Story = {
  args: { children: "" },
  render: () => (
    <div className="flex flex-col gap-3">
      <Card tom="neutro">neutro — o padrão, branco.</Card>
      <Card tom="marca">marca — coral-50, destaque suave (nunca é aviso).</Card>
      <Card tom="sucesso">sucesso — verde, boa notícia sobre dinheiro.</Card>
    </div>
  ),
};
