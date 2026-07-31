import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuemCuida } from "./ref9-blocks";

/**
 * 🟢 PRODUÇÃO REAL — vive em `wizard-cauda.tsx` (P0, home dia-1). Reforça o
 * canal humano (contador de verdade por trás do app) logo na ativação.
 */
const meta = {
  title: "Produção/QuemCuida",
  component: QuemCuida,
  parameters: { layout: "padded" },
} satisfies Meta<typeof QuemCuida>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
