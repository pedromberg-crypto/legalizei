import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SocioView,
  VinculoView,
  SociosView,
  EmpresaView,
  CnaeSecundariosView,
  NaturezaView,
  NomeView,
} from "./wizard-dossie";

/**
 * 🟢 PRODUÇÃO REAL — as 7 telas do dossiê (B4 · N10-N16), rotas `/dossie/*`.
 * Fonte única: `dossie/mock.ts` alimenta todas, elimina os mocks
 * contraditórios que existiam antes (achado 30/07). Cada view tem estado
 * próprio (RF-01 pendente: estado real entre telas ainda não existe).
 */
const meta = {
  title: "Telas/Dossiê B4 (N10-N16)",
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

export const N10_SeusDados: Story = { render: () => <Shell><SocioView /></Shell> };
export const N11_VinculoInss: Story = { render: () => <Shell><VinculoView /></Shell> };
export const N12_Socios: Story = { render: () => <Shell><SociosView /></Shell> };
export const N13_DadosDaEmpresa: Story = { render: () => <Shell><EmpresaView /></Shell> };
export const N14_CnaeSecundarios: Story = { render: () => <Shell><CnaeSecundariosView /></Shell> };
export const N15_NaturezaJuridica: Story = { render: () => <Shell><NaturezaView /></Shell> };
export const N16_NomeRazaoSocial: Story = { render: () => <Shell><NomeView /></Shell> };
