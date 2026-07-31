import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VereditoView, type Resultado } from "./veredito";

/**
 * 🟢 PRODUÇÃO REAL — A2, veredito do CNAE (rota `/gate`, etapa "veredito").
 * Fonte única das 3 vias. Coral NUNCA é estado: 🟡/🔴 usam tokens de estado.
 * Regra de ouro: vende RECONHECIMENTO, não economia (a alíquota mora no N18).
 */
const meta = {
  title: "Telas/VereditoView (N4)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ATENDE: Resultado = {
  humano: "Criação de sites e web design",
  explica: "Você entrega sites e presença digital pra outras empresas.",
  cnae: "6201-5/02",
  veredito: "atende",
  compreende: ["Criar e desenvolver sites, páginas e portais na internet"],
  vizinhas: [
    { oque: "Sistema sob medida, customizável", cnae: "6202-3/00", comoSecundaria: "mesmo-imposto" },
    { oque: "Design gráfico (logo, material impresso)", cnae: "7410-2/99", comoSecundaria: "mesmo-imposto" },
  ],
};

const WAITLIST: Resultado = {
  humano: "Atividade regulamentada",
  explica: "Sua área precisa de responsável técnico registrado no conselho.",
  cnae: "8650-0/02",
  veredito: "waitlist",
};

const MAURO: Resultado = {
  humano: "Comércio",
  explica: "Você vende produtos, não serviço.",
  cnae: "4713-0/02",
  veredito: "nao-atende",
  motivo: "mauro",
};

const DESCARTA: Resultado = { ...MAURO, motivo: "descarta" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline" style={{ height: 700 }}>
      <main className="app-main">{children}</main>
    </div>
  );
}

export const Atende: Story = {
  render: () => <Shell><VereditoView r={ATENDE} onRefazer={() => {}} onSeguir={() => {}} /></Shell>,
};

export const AtendeComAlternativas: Story = {
  render: () => (
    <Shell>
      <VereditoView r={ATENDE} onRefazer={() => {}} onSeguir={() => {}} mostrarAlternativas />
    </Shell>
  ),
};

export const Waitlist: Story = {
  render: () => <Shell><VereditoView r={WAITLIST} onRefazer={() => {}} onSeguir={() => {}} /></Shell>,
};

export const ContatoEspecialMauro: Story = {
  render: () => <Shell><VereditoView r={MAURO} onRefazer={() => {}} onSeguir={() => {}} /></Shell>,
};

export const ForaDeEscopoDescarta: Story = {
  render: () => <Shell><VereditoView r={DESCARTA} onRefazer={() => {}} onSeguir={() => {}} /></Shell>,
};

export const WaitlistConfirmada: Story = {
  render: () => (
    <Shell>
      <VereditoView
        r={WAITLIST}
        onRefazer={() => {}}
        onSeguir={() => {}}
        captura={{
          nome: "Ana",
          setNome: () => {},
          contato: "ana@email.com",
          setContato: () => {},
          enviado: true,
          setEnviado: () => {},
        }}
      />
    </Shell>
  ),
};
