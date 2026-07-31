import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OpcoesLinha, OpcoesColuna } from "./form";

/**
 * Botão grande com rótulo literal > dropdown pro leigo (UX-48). Linha p/ 2-3
 * opções curtas; coluna p/ listas ou rótulos longos.
 *
 * ⚠️ Selecionado = coral SÓLIDO com texto branco (mesmo padrão do N4 triagem/
 * faixa) — 29/07, corrigido de um tint mais fraco que o dossiê usava antes.
 * Usado em: N4 (triagem, faixa), dossiê inteiro (sócios, natureza jurídica).
 */
const meta = {
  title: "DS/Form/Opções",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const OPCOES_SOCIOS = [
  { v: 1, label: "Só eu" },
  { v: 2, label: "2 sócios" },
  { v: 3, label: "3+" },
];

const OPCOES_NATUREZA = [
  { v: "slu", label: "SLU — Sociedade Limitada Unipessoal" },
  { v: "ltda", label: "LTDA — Sociedade Limitada" },
];

function LinhaInterativa() {
  const [valor, setValor] = useState<number | null>(1);
  return <OpcoesLinha opcoes={OPCOES_SOCIOS} valor={valor} onChange={setValor} />;
}

function ColunaInterativa() {
  const [valor, setValor] = useState<string | null>("slu");
  return <OpcoesColuna opcoes={OPCOES_NATUREZA} valor={valor} onChange={setValor} />;
}

export const Linha: Story = { render: () => <LinhaInterativa /> };
export const Coluna: Story = { render: () => <ColunaInterativa /> };
