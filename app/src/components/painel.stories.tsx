import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PainelView } from "./painel";

/**
 * 🟢 PRODUÇÃO REAL — N21, painel de acompanhamento (B4). Fonte única de
 * `/painel` e `/painel/recusa` (o 4º estado, UX-40). Reduzido de 9→3 status
 * (30/07). Parametrizado (30/07) pro flow #2 (migrar) reusar sem duplicar.
 */
const meta = {
  title: "Telas/PainelView (N21)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline" style={{ height: 700 }}>
      {children}
    </div>
  );
}

export const DocumentacaoCompleta: Story = {
  render: () => <Shell><PainelView concluidas={1} emAndamento={1} /></Shell>,
};

export const AnalisandoViabilidade: Story = {
  render: () => <Shell><PainelView concluidas={1} emAndamento={1} /></Shell>,
};

export const AgoraESoAssinar: Story = {
  render: () => <Shell><PainelView concluidas={2} emAndamento={2} /></Shell>,
};

export const RecusaDeNome: Story = {
  render: () => (
    <Shell>
      <PainelView
        concluidas={1}
        emAndamento={1}
        recusa={{
          etapa: 1,
          titulo: "Junta recusou as 3 opções de nome",
          motivo: "As 3 opções que você priorizou já existem. Precisamos de novas sugestões.",
          acao: "Sugerir novos nomes",
        }}
        onAcaoRecusa={() => {}}
      />
    </Shell>
  ),
};

export const ComDoisSocios: Story = {
  render: () => <Shell><PainelView concluidas={1} emAndamento={1} /></Shell>,
};
