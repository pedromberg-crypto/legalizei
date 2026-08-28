import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ImpedimentoView,
  OcupacaoView,
  ProximosPassosView,
  type CampoCola,
} from "./mei-telas";
import { IMPEDIMENTOS } from "@/lib/mei";

/**
 * 🟢 PRODUÇÃO REAL — as 3 telas exclusivas do ramo MEI (28/08), rotas
 * `/gate?etapa=triagem&regime=mei`, `/dossie/ocupacao` e
 * `/mei/proximos-passos`.
 *
 * Contexto de por que este ramo existe: não há API nem procuração que permita
 * abrir MEI por terceiro (o Portal do Empreendedor exige a conta gov.br do
 * titular). O modelo é concierge — a gente prepara, o titular finaliza. Ver
 * `pesquisa/abertura-mei/abertura-mei-processo.md`.
 */
const meta = {
  title: "Telas/Ramo MEI (M)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="app-page mx-auto flex max-w-sm flex-col border-x border-border-hairline"
      style={{ height: 700 }}
    >
      {children}
    </div>
  );
}

/* ── M-T · Impedimentos ─────────────────────────────────────────────────── */

function ImpedimentoInterativo() {
  const [respostas, setRespostas] = useState<Record<string, boolean | null>>(
    Object.fromEntries(IMPEDIMENTOS.map((i) => [i.id, null])),
  );
  const [ciente, setCiente] = useState(false);
  return (
    <Shell>
      <ImpedimentoView
        respostas={respostas}
        setResposta={(id, v) => setRespostas((r) => ({ ...r, [id]: v }))}
        cienteBeneficio={ciente}
        setCienteBeneficio={setCiente}
      />
    </Shell>
  );
}

/**
 * As 3 perguntas que o próprio governo checa. Responder "sim" nas 2 primeiras
 * TRAVA a tela (bloqueio real da Receita / Lei 8.112); a 3ª (benefício) não
 * trava, mas exige confirmação explícita — abrir MEI cancela o benefício de
 * forma irreversível.
 */
export const Impedimentos: Story = { render: () => <ImpedimentoInterativo /> };

/* ── M-O · Ocupação ─────────────────────────────────────────────────────── */

function OcupacaoInterativo({ categoria }: { categoria: string }) {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [secundarias, setSecundarias] = useState<string[]>([]);
  return (
    <Shell>
      <OcupacaoView
        categoria={categoria}
        principal={principal}
        setPrincipal={setPrincipal}
        secundarias={secundarias}
        setSecundarias={setSecundarias}
      />
    </Shell>
  );
}

/**
 * Lista fechada do Anexo XI (não é CNAE livre). Escolher a principal revela o
 * aviso do **limite interno** (Cosit 27/2021): a ocupação é mais estrita que o
 * CNAE que ela mapeia. "reparos" é a categoria com mais ocupações (20).
 */
export const Ocupacao: Story = {
  render: () => <OcupacaoInterativo categoria="reparos" />,
};

/**
 * Guarda-corpo: categoria sem nenhuma ocupação de MEI (tecnologia, design,
 * consultoria — profissão intelectual, art. 966 do CC). O E3.4 já barra antes,
 * então isto só aparece em deep-link furado — mas a tela explica em vez de
 * mostrar lista vazia.
 */
export const OcupacaoSemMei: Story = {
  render: () => <OcupacaoInterativo categoria="tech" />,
};

/* ── M-S · Próximos passos (a "cola") ───────────────────────────────────── */

const CAMPOS: CampoCola[] = [
  { rotulo: "RG", valor: "MG-12.345.678", nota: "Órgão emissor: SSP/MG" },
  { rotulo: "Telefone", valor: "(31) 99999-0000" },
  { rotulo: "E-mail", valor: "ana.ramos@email.com" },
  {
    rotulo: "Ocupação principal",
    valor: "Técnico(a) de manutenção de computador",
    nota: "Escolhe exatamente essa na lista.",
  },
  { rotulo: "Forma de atuação", valor: "Pela internet" },
  {
    rotulo: "Endereço comercial",
    valor: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
  },
  {
    rotulo: "Capital social",
    valor: "R$ 1.000",
    nota: "Não existe valor mínimo por lei.",
  },
];

function ProximosPassosInterativo() {
  const [ok, setOk] = useState(false);
  return (
    <Shell>
      <ProximosPassosView
        campos={CAMPOS}
        nivelGovBrOk={ok}
        setNivelGovBrOk={setOk}
      />
    </Shell>
  );
}

/**
 * A tela que fecha o ramo. O CTA principal só libera depois que a pessoa
 * confirma que a conta gov.br é Prata/Ouro — sem isso ela não consegue
 * registrar, e deixar clicar seria mandá-la pra um erro.
 */
export const ProximosPassos: Story = {
  render: () => <ProximosPassosInterativo />,
};
