import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusIcon, type StatusEstado } from "./status";

/**
 * O átomo de status (unificado 21/07, era copiado em 5 arquivos). Vocabulário
 * de 5 estados — coral NUNCA é estado, veja a regra dura no componente-fonte.
 * Usado em: `lista-passos.tsx` (P1/P2, sua vez) e `painel.tsx` (N21/REC, vez
 * do órgão) — os dois wrappers seguem separados de propósito.
 */
const meta = {
  title: "DS/StatusIcon",
  component: StatusIcon,
  parameters: { layout: "centered" },
  argTypes: {
    estado: {
      control: "select",
      options: ["feito", "a-fazer", "girando", "travado", "recusa"] satisfies StatusEstado[],
    },
  },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Feito: Story = { args: { estado: "feito" } };
export const AFazer: Story = { args: { estado: "a-fazer" } };
export const Girando: Story = { args: { estado: "girando" } };
export const Travado: Story = { args: { estado: "travado" } };
export const Recusa: Story = { args: { estado: "recusa" } };

export const TodosOsEstados: Story = {
  args: { estado: "feito" },
  render: () => (
    <div className="flex items-center gap-6">
      {(["feito", "a-fazer", "girando", "travado", "recusa"] as StatusEstado[]).map((e) => (
        <div key={e} className="flex flex-col items-center gap-2">
          <StatusIcon estado={e} />
          <span className="text-micro text-text-tertiary">{e}</span>
        </div>
      ))}
    </div>
  ),
};
