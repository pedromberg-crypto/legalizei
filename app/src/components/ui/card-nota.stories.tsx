import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardNota } from "./card-nota";

/**
 * 🆕 01/09 (pedido do Pedro) — o cartão de nota com ícone-círculo em 3
 * humores. Entre as variantes muda SÓ o ícone/cor (regra do pedido): positivo
 * é o check verde que já existia no E3.2/E5T; atenção é amarelo escuro com
 * "!" branco; negativo é vermelho escuro com "X" branco. Não confundir com o
 * `Aviso` (bloco tingido inteiro) — o CardNota informa sem gritar. 1ª
 * aplicação da variante atenção: o aviso do apartamento no E3.4.
 */
const meta = {
  title: "DS/CardNota",
  component: CardNota,
  parameters: { layout: "padded" },
  argTypes: {
    variante: { control: "select", options: ["positivo", "atencao", "negativo"] },
  },
} satisfies Meta<typeof CardNota>;

export default meta;
type Story = StoryObj<typeof meta>;

const moldura = (S: React.ComponentType) => (
  <div style={{ maxWidth: 360 }}>
    <S />
  </div>
);

export const Positivo: Story = {
  args: {
    variante: "positivo",
    children:
      "É o mais comum entre os prestadores de serviço. Se um dia você quiser ter sócio, dá pra incluir depois, já com a empresa em pé.",
  },
  decorators: [moldura],
};

export const Atencao: Story = {
  args: {
    variante: "atencao",
    titulo: "Apartamento só serve se você morar nele",
    children:
      "A Prefeitura de Belo Horizonte indefere empresa em apartamento quando nenhum sócio mora no endereço. Dá pra resolver de dois jeitos: usar outro endereço seu, ou usar o endereço da Legalizai por R$ 49/mês.",
  },
  decorators: [moldura],
};

export const Negativo: Story = {
  args: {
    variante: "negativo",
    titulo: "Esse caminho não dá",
    children:
      "Exemplo da variante negativa: mesmo cartão, círculo vermelho escuro com X branco. Ainda sem aplicação em tela real.",
  },
  decorators: [moldura],
};
