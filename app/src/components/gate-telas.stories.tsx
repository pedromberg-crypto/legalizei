import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PerguntaView, AnalisandoView, TriagemView, FaixaView } from "./gate-telas";

/**
 * 🟢 PRODUÇÃO REAL — as telas do N4 (Gate-CNAE), rota `/gate`. Extraídas
 * 29/07 pelo mesmo motivo do `EntradaView`: `/apresentacao` renderiza a tela
 * APROVADA, cópia diverge em silêncio.
 */
const meta = {
  title: "Telas/Gate (N4)",
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

function PerguntaInterativo() {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [sabeCodigo, setSabeCodigo] = useState(false);
  return (
    <PerguntaView
      texto={texto}
      setTexto={setTexto}
      categoria={categoria}
      setCategoria={setCategoria}
      sabeCodigo={sabeCodigo}
      setSabeCodigo={setSabeCodigo}
      onValidar={() => {}}
    />
  );
}

export const Pergunta: Story = { render: () => <Shell><PerguntaInterativo /></Shell> };

export const Analisando: Story = { render: () => <Shell><AnalisandoView /></Shell> };

function TriagemInterativo() {
  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);
  const [socioTipo, setSocioTipo] = useState<"cpf" | "cnpj" | null>(null);
  return (
    <TriagemView
      socios={socios}
      setSocios={setSocios}
      exterior={exterior}
      setExterior={setExterior}
      socioTipo={socioTipo}
      setSocioTipo={setSocioTipo}
      onSeguir={() => {}}
      onSaida={() => {}}
    />
  );
}

export const Triagem: Story = { render: () => <Shell><TriagemInterativo /></Shell> };

/**
 * 🔴 27/08 — a escolha de endereço (próprio × fiscal Legalizai) SAIU desta
 * tela e foi pro E3.3 (`/endereco`, `EnderecoCategoriaView`), junto do gate de
 * cidade. A faixa voltou a fazer só uma pergunta.
 */
function FaixaInterativo() {
  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");
  return (
    <FaixaView
      faixa={faixa}
      setFaixa={setFaixa}
      modoExato={modoExato}
      setModoExato={setModoExato}
      exato={exato}
      setExato={setExato}
      onSeguir={() => {}}
      autoFocus={false}
    />
  );
}

export const Faixa: Story = { render: () => <Shell><FaixaInterativo /></Shell> };
