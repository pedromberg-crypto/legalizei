import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./form";

/**
 * Átomo único (promovido ao DS, K4 21/07). Visual custom + input nativo
 * escondido = semântica real (teclado, leitor de tela). Marcado = fill de
 * AÇÃO (coral), aceitar é um ato, não um "deu certo" (verde é estado).
 * Usado em: N8 (contrato) e N20 (termo irreversível) — telas-irmãs de aceite.
 */
const meta = {
  title: "DS/Form/Checkbox",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Interativo({ inicial, children }: { inicial: boolean; children: React.ReactNode }) {
  const [checked, setChecked] = useState(inicial);
  return (
    <Checkbox checked={checked} onChange={setChecked}>
      {children}
    </Checkbox>
  );
}

export const Desmarcado: Story = {
  render: () => (
    <Interativo inicial={false}>
      Quero receber avisos de prazo e vencimento no WhatsApp.
    </Interativo>
  ),
};

export const Marcado: Story = {
  render: () => (
    <Interativo inicial={true}>
      Li e concordo com o contrato de prestação de serviço e a política de
      cancelamento.
    </Interativo>
  ),
};
