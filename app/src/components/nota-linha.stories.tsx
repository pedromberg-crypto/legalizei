import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinhaNota, type Nota } from "./nota-linha";

/**
 * 🟢 PRODUÇÃO REAL — fonte única do card de nota fiscal. Usado em DOIS
 * lugares: home (`NotasRecentesMov`, glance, `statusNoTexto={false}`) e
 * `/notas` (P5, ledger completo, `href` torna a linha clicável pro P7).
 * Avatar = iniciais do cliente + dot de status (coral NUNCA é status).
 */
const meta = {
  title: "Produção/LinhaNota",
  component: LinhaNota,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LinhaNota>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE: Nota = {
  id: "1",
  tomador: "Ana Design ME",
  valor: 320000,
  data: "18 jul",
  numero: "1042",
  status: "emitida",
};

export const Emitida: Story = { args: { nota: BASE } };

export const Emitindo: Story = {
  args: {
    nota: { ...BASE, id: "2", tomador: "Consumidor final", numero: undefined, valor: 89000, data: "agora", status: "emitindo" },
  },
};

export const Recusada: Story = {
  args: {
    nota: { ...BASE, id: "3", tomador: "Mercado Paulo", numero: "1039", valor: 150000, data: "15 jul", status: "recusada" },
  },
};

export const Cancelada: Story = {
  args: {
    nota: { ...BASE, id: "4", status: "cancelada" },
  },
};

export const Clicavel: Story = {
  args: { nota: BASE, href: "/notas/detalhe?id=1" },
};

export const NaHomeSemStatusNoTexto: Story = {
  args: { nota: BASE, statusNoTexto: false },
};

/** Compilado — os 4 status empilhados, pra comparar de uma vez. */
export const TodosOsStatus: Story = {
  args: { nota: BASE },
  render: () => (
    <div className="flex flex-col gap-2">
      <LinhaNota nota={{ ...BASE, id: "1" }} />
      <LinhaNota nota={{ ...BASE, id: "2", tomador: "Consumidor final", numero: undefined, data: "agora", status: "emitindo" }} />
      <LinhaNota nota={{ ...BASE, id: "3", tomador: "Mercado Paulo", numero: "1039", data: "15 jul", status: "recusada" }} />
      <LinhaNota nota={{ ...BASE, id: "4", status: "cancelada" }} />
    </div>
  ),
};
