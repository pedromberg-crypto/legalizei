import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Aviso } from "./tela";

/**
 * Bloqueio, alerta ou reforço. ⚠️ Coral NUNCA é erro nem alerta (regra dura da
 * paleta) — estados usam sempre os tokens de estado (info/warning/danger/
 * success). Usado em: dossiê inteiro, cauda (N20 termo), migrar (M2, M5).
 */
const meta = {
  title: "DS/Aviso",
  component: Aviso,
  parameters: { layout: "padded" },
  argTypes: {
    variante: { control: "select", options: ["info", "warning", "danger", "success"] },
  },
} satisfies Meta<typeof Aviso>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variante: "info",
    titulo: "Sem pegadinha",
    children: "Você só paga quando decidir abrir, e a conta exata a gente fecha junto com você.",
  },
};

export const Success: Story = {
  args: {
    variante: "success",
    titulo: "Abertura grátis",
    children: "A gente não cobra honorário pra abrir. Você paga só as taxas de governo.",
  },
};

export const Warning: Story = {
  args: {
    variante: "warning",
    titulo: "Vence em 5 dias",
    children: "Sua guia do DAS de junho fecha dia 20. Já deixei ela pronta pra você.",
  },
};

export const Danger: Story = {
  args: {
    variante: "danger",
    titulo: "A prefeitura recusou a nota",
    children: "Precisa de você: um dado do tomador veio errado. Toque pra corrigir e reemitir.",
  },
};

/** Compilado — as 4 variantes empilhadas, pra comparar de uma vez. */
export const TodasAsVariantes: Story = {
  args: { titulo: "", children: "" },
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      <Aviso variante="info" titulo="Sem pegadinha">
        Você só paga quando decidir abrir, e a conta exata a gente fecha junto com você.
      </Aviso>
      <Aviso variante="success" titulo="Abertura grátis">
        A gente não cobra honorário pra abrir. Você paga só as taxas de governo.
      </Aviso>
      <Aviso variante="warning" titulo="Vence em 5 dias">
        Sua guia do DAS de junho fecha dia 20. Já deixei ela pronta pra você.
      </Aviso>
      <Aviso variante="danger" titulo="A prefeitura recusou a nota">
        Precisa de você: um dado do tomador veio errado. Toque pra corrigir e reemitir.
      </Aviso>
    </div>
  ),
};
