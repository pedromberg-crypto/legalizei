import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Callout } from "./_helpers";

/**
 * FUNDAÇÕES/TIPOGRAFIA — escala lida ao vivo de `--text-*` (`globals.css`).
 * Migrado de `design-system.html` §Tipografia (05/08).
 */
const meta = {
  title: "Fundações/Tipografia",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ESCALA: { token: string; meta: string; peso: number; texto: string }[] = [
  { token: "--text-display", meta: "32 / 1.15 / 700", peso: 700, texto: "Sua empresa está em dia" },
  { token: "--text-h1", meta: "26 / 1.2 / 700", peso: 700, texto: "Título de tela" },
  { token: "--text-h2", meta: "20 / 1.3 / 600", peso: 600, texto: "Título de bloco" },
  { token: "--text-body", meta: "16 / 1.5 / 400", peso: 400, texto: "Corpo padrão. A gente cuida de guias, prazos e notas pra você." },
  { token: "--text-body (600)", meta: "16 / 1.5 / 600", peso: 600, texto: "Ênfase no corpo" },
  { token: "--text-caption", meta: "14 / 1.4 / 400", peso: 400, texto: "Apoio, legenda, microcopy que ensina" },
  { token: "--text-micro", meta: "12 / 1.4 / 500", peso: 500, texto: "CARIMBO · META · ESTIMATIVA" },
];

export const Escala: Story = {
  render: () => (
    <Pagina
      titulo="Tipografia — Sora"
      lead="Sora pro sistema inteiro (display, corpo, UI). Escala em rem: fonte ampliável é requisito de acessibilidade (UX-12), nunca px travado."
    >
      {ESCALA.map((row) => (
        <div
          key={row.token}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            padding: "14px 0",
            borderBottom: "1px solid var(--color-border-hairline)",
          }}
        >
          <div style={{ width: 150, flexShrink: 0 }}>
            <code style={{ fontSize: "0.8125rem" }}>{row.token}</code>
            <small style={{ display: "block", color: "var(--color-text-tertiary)", fontSize: "var(--text-micro)", marginTop: 2 }}>
              {row.meta}
            </small>
          </div>
          <div style={{ fontSize: row.token === "--text-display" ? "var(--text-display)" : row.token.startsWith("--text-h1") ? "var(--text-h1)" : row.token.startsWith("--text-h2") ? "var(--text-h2)" : row.token.startsWith("--text-caption") ? "var(--text-caption)" : row.token.startsWith("--text-micro") ? "var(--text-micro)" : "var(--text-body)", fontWeight: row.peso, lineHeight: 1.4 }}>
            {row.texto}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20 }}>
        <Callout>
          <b>text-body = 16px</b> (decisão do Pedro, 16/07). A acessibilidade da letra grande depende inteiramente
          da fonte ampliável do sistema.
        </Callout>
      </div>
    </Pagina>
  ),
};
