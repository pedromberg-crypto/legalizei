import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListaPassos } from "./lista-passos";

/**
 * Compartilhada entre P1 (retomar) e P2 (aguardando boleto) — o mesmo
 * dossiê, visto de dois lugares. 3 estados: feito (check verde) · a-fazer
 * (círculo vazio) · travado (cadeado, só com boleto pendente).
 */
const meta = {
  title: "DS/ListaPassos",
  component: ListaPassos,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ListaPassos>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmAndamento: Story = {
  args: { concluidos: 3 },
};

export const ComBoletoPendente: Story = {
  args: { concluidos: 6, pagamentoPendente: true, mostrarDestino: true },
};

export const Completa: Story = {
  args: { concluidos: 10, mostrarDestino: true },
};
