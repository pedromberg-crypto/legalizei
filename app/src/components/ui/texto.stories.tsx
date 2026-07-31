import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Texto } from "./form";

/**
 * Entrada de texto — erro sempre INLINE (nunca modal), microcopy que ensina,
 * não pune. Usado em: N6, N9, dossiê inteiro (N10-N16).
 */
const meta = {
  title: "DS/Form/Texto",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Interativo(props: Partial<Parameters<typeof Texto>[0]>) {
  const [valor, setValor] = useState(props.valor ?? "");
  return <Texto {...props} valor={valor} onChange={setValor} />;
}

export const Vazio: Story = {
  render: () => <Interativo placeholder="Ex: Studio Ana Design" />,
};

export const ComErro: Story = {
  render: () => (
    <Interativo
      valor="12.345.678/0001-9"
      erro="Faltam dígitos. Confere aí que a gente puxa o resto sozinho."
    />
  ),
};

export const ComOk: Story = {
  render: () => <Interativo valor="123.456.789-09" ok="Tudo certo com esse CPF." />,
};

export const Numerico: Story = {
  render: () => <Interativo placeholder="000.000.000-00" inputMode="numeric" maxLength={14} />,
};

/** Compilado — os 3 estados de validação empilhados, pra comparar de uma vez. */
export const TodosOsEstados: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Interativo placeholder="Vazio — Ex: Studio Ana Design" />
      <Interativo
        valor="12.345.678/0001-9"
        erro="Faltam dígitos. Confere aí que a gente puxa o resto sozinho."
      />
      <Interativo valor="123.456.789-09" ok="Tudo certo com esse CPF." />
    </div>
  ),
};
