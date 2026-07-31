import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

/**
 * Promovido ao DS na regra dos 3 (aparece nas 2 telas-farol).
 * Usado em: praticamente todo CTA do wizard e do portal — `/gate`, `/plano`,
 * `/contrato`, `/pagamento`, dossiê inteiro, cauda (N19-N22), migrar (M1-M6).
 */
const meta = {
  title: "DS/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "primarySm", "dark", "secondary", "ghost"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Continuar" },
};

export const PrimarySm: Story = {
  args: { variant: "primarySm", children: "Pagar agora" },
};

export const Dark: Story = {
  args: { variant: "dark", children: "Fazer meu certificado agora" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Voltar" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Não é bem isso, refazer" },
};

export const Full: Story = {
  args: { variant: "primary", full: true, children: "Continuar" },
  parameters: { layout: "padded" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Continuar", disabled: true },
};

/** Compilado — as 5 variantes lado a lado, pra comparar de uma vez. */
export const TodasAsVariantes: Story = {
  args: { children: "Continuar" },
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="primarySm">PrimarySm</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
