import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  MigrarCnpjView,
  MigrarDiagnosticoView,
  MigrarPlanoView,
  MigrarContratoView,
  MigrarPassivoView,
  MigrarTransferenciaView,
  MigrarAtivaView,
} from "./wizard-migrar";

/**
 * 🟢 PRODUÇÃO REAL — FLOW #2, migrar de contador (M1-M6), construído 30/07.
 * 4 diferenças estruturais vs. flow #1: sem entrevista de atividade (lê o
 * cartão CNPJ) · diagnóstico com número REAL (12 meses, não estimativa) ·
 * sem taxa de governo · 🔴 pausa mais perigosa do produto (TTRT validado
 * pelo contador ANTIGO). DECISÃO: cobra antes do TTRT, com devolução
 * garantida em contrato se a transferência não sair por motivo alheio.
 */
const meta = {
  title: "Telas/Migrar M1-M6 (flow #2)",
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

export const M1_PedeCnpj: Story = { render: () => <Shell><MigrarCnpjView /></Shell> };

export const M1_AchouEmpresa: Story = {
  render: () => {
    function Wrapper() {
      const [n, setN] = useState(0);
      // dispara o preencher automático + avança a fase pra "achou" via clique real
      return <MigrarCnpjView preencher={n || undefined} onVoltar={() => setN((v) => v + 1)} />;
    }
    return <Shell><Wrapper /></Shell>;
  },
};

export const M2_DiagnosticoComGanho: Story = { render: () => <Shell><MigrarDiagnosticoView /></Shell> };
export const M2_GuardaCorpoJaOtimo: Story = { render: () => <Shell><MigrarDiagnosticoView jaOtimo /></Shell> };

export const M3_Plano: Story = { render: () => <Shell><MigrarPlanoView /></Shell> };

function ContratoInterativo() {
  const [aceito, setAceito] = useState(false);
  return <MigrarContratoView aceito={aceito} setAceito={setAceito} />;
}
export const M3b_ContratoComDevolucao: Story = { render: () => <Shell><ContratoInterativo /></Shell> };

export const M4_PassivoEncontrado: Story = { render: () => <Shell><MigrarPassivoView /></Shell> };
export const M4_EmpresaLimpa: Story = { render: () => <Shell><MigrarPassivoView comPassivo={false} /></Shell> };

export const M5_TransferenciaEmAndamento: Story = { render: () => <Shell><MigrarTransferenciaView /></Shell> };
export const M5_TravadoContadorAntigo: Story = { render: () => <Shell><MigrarTransferenciaView travado /></Shell> };

export const M6_MigracaoConcluida: Story = { render: () => <Shell><MigrarAtivaView /></Shell> };
