import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecaoLista, SECOES } from "./mais-shell";

/**
 * 🟢 PRODUÇÃO REAL — vive em `/mais` (nó `MAIS` do portal-data.mjs). Uma
 * seção do hub `Mais`, formato lista (rows + chevron, drill-down por href).
 */
const meta = {
  title: "Produção/SecaoLista",
  component: SecaoLista,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SecaoLista>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuaEmpresa: Story = { args: { secao: SECOES[0] } };
export const Contabilidade: Story = { args: { secao: SECOES[1] } };
