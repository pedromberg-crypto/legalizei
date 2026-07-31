import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TelaHeader } from "./tela";

/**
 * Promovido ao DS em 19/07 (regra dos 3). `voltar`/`onVoltar` são opt-in: a
 * seta só aparece em telas de DETALHE do portal (drill-down), não em toda
 * tela — a nav entre seções é a barra de abas. Usado em: todo o wizard +
 * telas-raiz do portal (sem seta) e drill-downs (com seta).
 */
const meta = {
  title: "DS/TelaHeader",
  component: TelaHeader,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TelaHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemVoltar: Story = {
  args: { meta: "Legalizai" },
};

export const ComVoltarPorAcao: Story = {
  args: { meta: "Certificado digital", onVoltar: () => {} },
};

export const ComVoltarPorRota: Story = {
  args: { meta: "Impostos", voltar: "/impostos" },
};

/** Compilado — as 3 variantes empilhadas, pra comparar de uma vez. */
export const TodasAsVariantes: Story = {
  args: { meta: "" },
  render: () => (
    <div className="flex flex-col gap-4">
      <TelaHeader meta="Sem seta (telas-raiz)" />
      <TelaHeader meta="Seta por ação (/apresentacao, sem router)" onVoltar={() => {}} />
      <TelaHeader meta="Seta por rota (drill-down do portal)" voltar="/impostos" />
    </div>
  ),
};
