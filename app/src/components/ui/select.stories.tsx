import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./form";

/**
 * Dropdown PRÓPRIO, não `<select>` nativo (lista não estilizável do OS).
 * ⚠️ Descartável no produto: stack real é React Native (Picker nativo) — isto
 * existe só pra a review web parecer o app. Usado em: N10 (estado civil +
 * regime de bens) e N13 (tipo de endereço).
 */
const meta = {
  title: "DS/Form/Select",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const OPCOES = [
  { v: "solteiro", label: "Solteiro(a)" },
  { v: "casado", label: "Casado(a)" },
  { v: "uniao", label: "União estável" },
  { v: "divorciado", label: "Divorciado(a)" },
  { v: "viuvo", label: "Viúvo(a)" },
];

function Interativo({ inicial }: { inicial: string }) {
  const [valor, setValor] = useState(inicial);
  return (
    <Select
      valor={valor}
      onChange={setValor}
      opcoes={OPCOES}
      placeholder="Selecione seu estado civil"
    />
  );
}

export const Vazio: Story = { render: () => <Interativo inicial="" /> };
export const ComValor: Story = { render: () => <Interativo inicial="casado" /> };
