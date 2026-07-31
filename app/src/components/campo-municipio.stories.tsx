import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampoMunicipio } from "./campo-municipio";

/**
 * Autocomplete com validação REAL contra os 5.570 municípios do IBGE
 * (congelado local, `/dados/municipios.json` — sem depender de rede numa
 * demo). Digitar não seleciona — só o toque numa sugestão valida. Usado na
 * saída "fora de BH" (lista de espera geográfica).
 */
const meta = {
  title: "DS/CampoMunicipio",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Interativo() {
  const [valor, setValor] = useState<string | undefined>(undefined);
  return (
    <CampoMunicipio
      rotulo="Sua cidade"
      placeholder="Comece a digitar..."
      valor={valor}
      onSelecionar={setValor}
    />
  );
}

export const Vazio: Story = { render: () => <Interativo /> };
