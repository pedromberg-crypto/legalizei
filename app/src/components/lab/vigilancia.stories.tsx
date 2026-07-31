import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Vigilancia } from "./vigilancia-blocks";

/**
 * 🟢 PRODUÇÃO REAL — vive em `/impostos` (nó `IMPOSTOS` do portal-data.mjs).
 * Alíquota efetiva + Fator R numa barra contra o corte dos 28% + "número
 * vivo" (tese North Star). A vigília fiscal liga em `/impostos/aliquotas`.
 */
const meta = {
  title: "Produção/Vigilancia",
  component: Vigilancia,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Vigilancia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
