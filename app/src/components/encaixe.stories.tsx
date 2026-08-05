import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/components/ui/card";
import { ConteudoCnae, OutrasOpcoes } from "./encaixe";

/**
 * 🟢 PRODUÇÃO REAL — miolo do card de CNAE, fonte única desde 29/07.
 * `VereditoView` (rota `/gate`, etapa "veredito") envolve isto num `Card`
 * quando mostra as alternativas. `EncaixeView` (a tela própria) foi removida
 * 31/07; o miolo visual continua vivo aqui.
 */
const meta = {
  title: "Produção/ConteudoCnae (Encaixe)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Recomendado: Story = {
  render: () => (
    <Card>
      <ConteudoCnae
        humano="Criação de sites e web design"
        cnae="6201-5/02"
        descricao="Você entrega sites e presença digital pra outras empresas."
        cobre={["Criação de sites", "Landing pages", "Manutenção de sites existentes"]}
        adequacao={94}
        adequacaoModo="barra"
        recomendado
      />
    </Card>
  ),
};

export const AlternativaEscolhida: Story = {
  render: () => (
    <Card>
      <ConteudoCnae
        humano="Programação sob encomenda"
        cnae="6201-5/01"
        descricao="Você desenvolve sistemas e software personalizados."
        adequacao={72}
        adequacaoModo="badge"
        recomendado={false}
      />
    </Card>
  ),
};

export const ComOutrasOpcoes: Story = {
  render: () => (
    <>
      <Card>
        <ConteudoCnae
          humano="Criação de sites e web design"
          cnae="6201-5/02"
          descricao="Você entrega sites e presença digital pra outras empresas."
          cobre={["Criação de sites", "Landing pages"]}
          adequacao={94}
          adequacaoModo="badge"
          recomendado
        />
      </Card>
      <OutrasOpcoes
        titulo="Outras opções compatíveis"
        alternativas={[
          { humano: "Programação sob encomenda", cnae: "6201-5/01", adequacao: 72 },
          { humano: "Consultoria em TI", cnae: "6204-0/00", adequacao: 64 },
        ]}
        onEscolher={() => {}}
      />
    </>
  ),
};

export const SomenteLeitura: Story = {
  render: () => (
    <OutrasOpcoes
      titulo="Outras opções pra você"
      alternativas={[
        { humano: "Programação sob encomenda", cnae: "6201-5/01", adequacao: 72 },
      ]}
    />
  ),
};
