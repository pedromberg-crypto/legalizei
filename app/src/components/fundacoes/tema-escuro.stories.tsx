import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Painel, Sub, Swatch, Grade, TemaToggle } from "./_helpers";

/**
 * FUNDAÇÕES/TEMA ESCURO — migrado de `design-system.html` §Tema escuro
 * (05/08). Fonte canônica: `:root[data-theme="dark"]` em `globals.css`
 * (promovida do CRM_app em 31/07). O botão abaixo seta `data-theme="dark"`
 * no `<html>` de verdade — os swatches releem a CSS var real após a troca
 * (mesmo mecanismo, sem cópia de valor).
 *
 * ⚠️ Este app (wizard/portal mobile) continua LIGHT-ONLY em produção — o
 * bloco é token disponível, nada liga sozinho em nenhuma rota hoje. Quem já
 * roda 100% dark é o CRM interno.
 */
const meta = {
  title: "Fundações/Tema escuro",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SEMANTICOS = [
  "--color-surface-page",
  "--color-surface-card",
  "--color-text-primary",
  "--color-text-secondary",
  "--color-action-primary",
  "--color-state-success-text",
  "--color-state-danger-text",
];

export const Comparar: Story = {
  render: () => (
    <Pagina
      titulo="Tema escuro"
      lead="Prova viva da arquitetura de 2 camadas: o escuro remapeia SÓ a camada 2 (--color-*). Primitivos e componentes ficam intactos. Clique no botão pra alternar de verdade e ver os valores mudarem."
    >
      <TemaToggle>
        <Grade>
          {SEMANTICOS.map((v) => (
            <Swatch key={v} varName={v} />
          ))}
        </Grade>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
          <Painel>
            <Sub>O que muda (camada 2)</Sub>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
              Superfície inverte pra base escura quente (não preto puro). Texto vira warm-white. Tints de estado
              escurecem, textos de estado clareiam. Coral segue mandando na ação.
            </p>
          </Painel>
          <Painel>
            <Sub>O que NÃO muda</Sub>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
              Zero primitivo tocado. Zero componente reescrito. As 4 regras duras seguem valendo. Hover ainda
              escurece.
            </p>
          </Painel>
        </div>

        <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginTop: 20 }}>
          Contraste AA verificado por número (não estimado): texto primário 13,4:1 · secundário 7,7:1 · botão
          grande 3,15:1 (AA-grande) · botão pequeno coral-700 5,64:1. Separação de card vem da borda (hairline
          forte), não de sombra.
        </p>
      </TemaToggle>
    </Pagina>
  ),
};
