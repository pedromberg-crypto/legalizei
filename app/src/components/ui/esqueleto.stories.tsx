import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TelaHeader, Titulo, Corpo, Rodape } from "./tela";
import { Card } from "./card";
import { Button } from "./button";

/**
 * O ESQUELETO DE TELA composto — promovido ao DS em 19/07 (regra dos 3).
 * Título FIXO / corpo ROLA / CTA FIXO vira ESTRUTURA, não disciplina: quem usa
 * não consegue quebrar o layout. As classes `.app-page`/`.app-main`/
 * `.app-footer-cta` (globals.css) fazem o 100dvh funcionar em flex.
 *
 * O fade de scroll no `Corpo` é affordance, não gate — aparece só quando há
 * overflow real. Redimensione o painel do Storybook (canto) pra ver o fade
 * aparecer/sumir.
 */
const meta = {
  title: "DS/Esqueleto de tela",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Skeleton() {
  return (
    <div className="app-page mx-auto max-w-sm border-x border-border-hairline" style={{ height: 700 }}>
      <TelaHeader meta="Legalizai" />
      <main className="app-main">
        <Titulo sub="Isto é o corpo rolável — cresça o conteúdo abaixo e veja o CTA continuar fixo no rodapé.">
          Título fixo da tela
        </Titulo>
        <Corpo>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>Bloco de conteúdo #{i + 1} — o corpo rola, o CTA não.</Card>
          ))}
        </Corpo>
        <Rodape>
          <Button full>Continuar</Button>
        </Rodape>
      </main>
    </div>
  );
}

export const OsDoisShells: Story = { render: () => <Skeleton /> };
