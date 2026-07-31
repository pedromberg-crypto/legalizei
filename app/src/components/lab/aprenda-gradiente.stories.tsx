import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AprendaGradiente } from "./campea-blocks";

/**
 * 🟢 PRODUÇÃO REAL — vive em `wizard-cauda.tsx` (P0, home dia-1). Carrossel
 * de posts do blog em cards com gradiente, "Ver tudo" liga em `/blog`.
 */
const meta = {
  title: "Produção/AprendaGradiente",
  component: AprendaGradiente,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AprendaGradiente>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
