import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EnviarSheet } from "./enviar-sheet";

/**
 * Bottom-sheet de canais (WhatsApp · E-mail · Copiar link) — genérico, serve
 * a nota (P7, enviar ao cliente) e a guia (enviar o PDF). Mock: cada canal só
 * fecha (real: deep-link WhatsApp / mailto / clipboard).
 */
const meta = {
  title: "DS/EnviarSheet",
  component: EnviarSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EnviarSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParaCliente: Story = {
  args: { paraNome: "Ana Design ME", onFechar: () => {} },
  decorators: [(S) => <div style={{ position: "relative", height: 420 }}><S /></div>],
};

export const ComSubtitulo: Story = {
  args: { titulo: "Enviar guia", sub: "Manda o PDF do DAS de julho.", onFechar: () => {} },
  decorators: [(S) => <div style={{ position: "relative", height: 420 }}><S /></div>],
};
