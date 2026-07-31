import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Confetti } from "./confetti";

/**
 * Confete de sucesso (Lottie da marca, coral) — burst LOCALIZADO sobre o CTA,
 * não full-screen. Usado no aceite 🟢 do veredito. Respeita
 * prefers-reduced-motion. Renderiza no canto — dê zoom se não pegar o burst.
 */
const meta = {
  title: "DS/Confetti",
  component: Confetti,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (S) => (
      <div style={{ position: "relative", width: 300, height: 180, background: "var(--color-surface-alt)" }}>
        <S />
      </div>
    ),
  ],
};
