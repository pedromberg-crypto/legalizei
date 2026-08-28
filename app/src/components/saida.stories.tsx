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

/** Achado 31/07: 3ª variação real (gate de cidade, N3G) — `extra.tipo:
 * "municipio"` liga o autocomplete validado contra os 5.570 do IBGE. */
const FORA_DE_BH: DadosSaida = {
  tag: "Outra cidade",
  titulo: "Por enquanto, só abrimos em Belo Horizonte",
  explica: "Estamos testando o produto com foco total numa cidade antes de expandir. Hoje só abrimos empresa em Belo Horizonte/MG.",
  origem: { rotulo: "Por que só BH", texto: "É a fase de testes (MLP) do produto — preferimos fazer bem para uma cidade antes de abrir para mais." },
  saida: "Entra na lista de espera que a gente te avisa assim que abrir na sua cidade. Você é o primeiro a saber.",
  extra: { rotulo: "Qual a sua cidade?", placeholder: "Comece a digitar: Uberl…", obrigatorio: true, tipo: "municipio" },
  ctaEnviar: "Me avisem quando chegarem aqui",
  confirmacao: {
    titulo: "Você está na nossa lista especial",
    texto: "A gente te avisa assim que expandir as operações pra sua cidade. Enquanto isso, acompanha a gente por aqui.",
    acoes: [
      { label: "Ler o blog", variante: "primary", pendente: true },
      { label: "Conhecer o site", variante: "primary", pendente: true },
    ],
  },
};

export const SocioNoExterior: Story = {
  render: () => <Shell><SaidaView d={SOCIO_EXTERIOR} /></Shell>,
};

export const TresOuMaisSocios: Story = {
  render: () => <Shell><SaidaView d={TRES_SOCIOS} /></Shell>,
};

export const ForaDeBhListaDeEspera: Story = {
  render: () => <Shell><SaidaView d={FORA_DE_BH} /></Shell>,
};

export const ConfirmacaoEnviada: Story = {
  render: () => (
    <Shell>
      <SaidaView
        d={SOCIO_EXTERIOR}
        captura={{
          extra: "", setExtra: () => {},
          enviado: true, setEnviado: () => {},
        }}
      />
    </Shell>
  ),
};
