import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./logo";

/**
 * ÚNICO lugar do app que pode pedir `--color-brand` (coral-500 é cor de
 * MARCA, nunca fill de botão). 3 variantes: `padrao` (fundo claro), `escura`
 * (fundo escuro, check knockout), `negativa` (splash, check endereçável p/
 * animar o wipe). Usado em: header do wizard, splash, login.
 */
const meta = {
  title: "DS/Logo",
  component: Logo,
  parameters: { layout: "padded" },
  argTypes: {
    variante: { control: "select", options: ["padrao", "escura", "negativa"] },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: { variante: "padrao" },
  decorators: [(S) => <div style={{ width: 240 }}><S /></div>],
};

export const Escura: Story = {
  args: { variante: "escura" },
  decorators: [
    (S) => (
      <div style={{ width: 240, padding: 24, background: "var(--color-surface-dark)" }}>
        <S />
      </div>
    ),
  ],
};

export const Negativa: Story = {
  args: { variante: "negativa" },
  decorators: [
    (S) => (
      <div style={{ width: 240, padding: 24, background: "var(--color-surface-dark)" }}>
        <S />
      </div>
    ),
  ],
};

/** Compilado — as 3 variantes lado a lado, pra comparar de uma vez. */
export const TodasAsVariantes: Story = {
  args: { variante: "padrao" },
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-px bg-border-hairline">
      <div className="flex flex-col gap-2 bg-surface-page p-6">
        <span className="text-micro text-text-tertiary">padrao — fundo claro</span>
        <div style={{ width: 240 }}><Logo variante="padrao" /></div>
      </div>
      <div className="flex flex-col gap-2 p-6" style={{ background: "var(--color-surface-dark)" }}>
        <span className="text-micro text-text-on-dark/60">escura — fundo escuro, check knockout</span>
        <div style={{ width: 240 }}><Logo variante="escura" /></div>
      </div>
      <div className="flex flex-col gap-2 p-6" style={{ background: "var(--color-surface-dark)" }}>
        <span className="text-micro text-text-on-dark/60">negativa — splash, check endereçável (wipe)</span>
        <div style={{ width: 240 }}><Logo variante="negativa" /></div>
      </div>
    </div>
  ),
};
