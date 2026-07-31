import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SaidaView, type DadosSaida } from "./saida";

/**
 * 🟢 PRODUÇÃO REAL — A9, template de saída graciosa. Bloqueio que EDUCA, não
 * pune — por isso usa o selo `humano` (azul), nunca danger. Nasce da triagem
 * (N4): sócio no exterior (LC 123 art.17) ou 3+ sócios (limite do produto).
 * O dossiê vai junto (UX-35) — nenhuma saída é beco.
 */
const meta = {
  title: "Telas/SaidaView (A9)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline" style={{ height: 700 }}>
      <main className="app-main">{children}</main>
    </div>
  );
}

const SOCIO_EXTERIOR: DadosSaida = {
  titulo: "Sócio morando fora do Brasil",
  explica: "Com alguém da sociedade morando fora, a empresa até existe, mas fica fora do Simples Nacional.",
  origem: { rotulo: "Por que isso acontece", texto: "LC 123, art. 17 — impede o Simples quando há sócio domiciliado no exterior." },
  saida: "Nosso time explica as opções pra esse caso específico.",
};

const TRES_SOCIOS: DadosSaida = {
  titulo: "Mais de 2 sócios",
  explica: "Acima de 2 sócios é limite do nosso produto, não da lei.",
  origem: { rotulo: "Por que isso acontece", texto: "O MLP atende só até 2 sócios por enquanto." },
  saida: "Nosso time abre pra você do jeito tradicional.",
};

export const SocioNoExterior: Story = {
  render: () => <Shell><SaidaView d={SOCIO_EXTERIOR} /></Shell>,
};

export const TresOuMaisSocios: Story = {
  render: () => <Shell><SaidaView d={TRES_SOCIOS} /></Shell>,
};

export const ConfirmacaoEnviada: Story = {
  render: () => (
    <Shell>
      <SaidaView
        d={SOCIO_EXTERIOR}
        captura={{
          nome: "Ana", setNome: () => {},
          contato: "ana@email.com", setContato: () => {},
          extra: "", setExtra: () => {},
          enviado: true, setEnviado: () => {},
        }}
      />
    </Shell>
  ),
};
