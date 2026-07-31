import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconeGoogle, IconeApple } from "./marcas-sociais";

/**
 * Únicos lugares do app (além do /mockup) que podem usar cor fora dos
 * tokens — diretriz de marca de terceiro. Usado em: N6 (criar conta) e login.
 */
const meta = {
  title: "DS/MarcasSociais",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ambos: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <IconeGoogle />
      <IconeApple />
    </div>
  ),
};
