import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContaView, PlanoView, ContratoView, PagamentoView, type DadosConta, type Metodo } from "./wizard-dinheiro";

/**
 * 🟢 PRODUÇÃO REAL — B3, a travessia do dinheiro (N6→N9). Fonte única das
 * rotas `/conta`, `/plano`, `/contrato`, `/pagamento`. 3 baldes SEMPRE
 * separados: grátis (honorário) · taxa de governo (repasse) · mensalidade.
 */
const meta = {
  title: "Telas/Dinheiro B3 (N6-N9)",
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

const DADOS_VAZIOS: DadosConta = {
  nome: "", cpf: "", telefone: "", email: "", senha: "", cep: "", numero: "", coorte: null, codigo: "",
};

function ContaInterativo({
  layout = "classico",
  etapa = "form",
}: {
  layout?: "classico" | "painel";
  etapa?: "form" | "codigo";
}) {
  const [d, setD] = useState<DadosConta>(DADOS_VAZIOS);
  const set = <K extends keyof DadosConta>(k: K, v: DadosConta[K]) => setD((p) => ({ ...p, [k]: v }));
  return <ContaView d={d} set={set} etapa={etapa} onCriarConta={() => {}} onConfirmar={() => {}} layout={layout} />;
}

export const N6_ContaClassica: Story = { render: () => <Shell><ContaInterativo /></Shell> };
export const N6_ContaLayoutPainel: Story = { render: () => <Shell><ContaInterativo layout="painel" /></Shell> };
export const N6_CodigoDeVerificacao: Story = { render: () => <Shell><ContaInterativo etapa="codigo" /></Shell> };

export const N7_Classico: Story = { render: () => <Shell><PlanoView onSeguir={() => {}} /></Shell> };
export const N7_Oferta: Story = { render: () => <Shell><PlanoView layout="oferta" onSeguir={() => {}} /></Shell> };

function ContratoInterativo() {
  const [aceito, setAceito] = useState(false);
  return <ContratoView aceito={aceito} setAceito={setAceito} onSeguir={() => {}} />;
}
export const N8_Contrato: Story = { render: () => <Shell><ContratoInterativo /></Shell> };

function PagamentoInterativo({ cpfCadastrado, fluxo }: { cpfCadastrado?: string; fluxo?: "abertura" | "migrar" }) {
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");
  return (
    <PagamentoView
      cpf={cpf}
      setCpf={setCpf}
      metodo={metodo}
      setMetodo={setMetodo}
      cpfCadastrado={cpfCadastrado}
      fluxo={fluxo}
      onPagar={() => {}}
    />
  );
}
export const N9_PedeCpf: Story = { render: () => <Shell><PagamentoInterativo /></Shell> };
export const N9_CpfJaCadastrado: Story = { render: () => <Shell><PagamentoInterativo cpfCadastrado="123.456.789-09" /></Shell> };
export const N9_FluxoMigrar: Story = { render: () => <Shell><PagamentoInterativo cpfCadastrado="123.456.789-09" fluxo="migrar" /></Shell> };
