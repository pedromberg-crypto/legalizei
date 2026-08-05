import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Callout } from "./_helpers";

/**
 * FUNDAÇÕES/RAIO — `--radius-*` de `globals.css`, derivado do logo (0,27×lado).
 * Migrado de `design-system.html` §Raio (05/08).
 */
const meta = {
  title: "Fundações/Raio",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RAIOS = [
  { token: "--radius-sm", label: "radius-sm · 8 · chip/badge" },
  { token: "--radius-md", label: "radius-md · 12 · input/botão" },
  { token: "--radius-lg", label: "radius-lg · 16 · card" },
  { token: "--radius-xl", label: "radius-xl · 24 · sheet/modal" },
];

export const Escala: Story = {
  render: () => (
    <Pagina
      titulo="Raio — derivado do logo"
      lead="O símbolo tem raio ≈ 0,27 × lado. Num ícone de 44px isso dá ~12 → vira o raio de input/botão. O logo governa o sistema, não é coincidência."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {RAIOS.map((r) => (
          <div key={r.token} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 88,
                height: 64,
                background: "var(--color-surface-tint-brand)",
                border: "1px solid var(--p-coral-200)",
                borderRadius: `var(${r.token})`,
              }}
            />
            <div style={{ fontSize: "var(--text-micro)", marginTop: 8, color: "var(--color-text-tertiary)" }}>
              {r.label}
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 88,
              height: 64,
              background: "var(--color-surface-tint-brand)",
              border: "1px solid var(--p-coral-200)",
              borderRadius: 999,
            }}
          />
          <div style={{ fontSize: "var(--text-micro)", marginTop: 8, color: "var(--color-text-tertiary)" }}>
            radius-full · pill/avatar
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Callout>
          <b>Card = 16px (rounded-lg).</b> Padrão travado 24/07 — cards de conteúdo usam sempre 16. Nunca{" "}
          <code>rounded-xl</code> (24, redondo demais pra card). Inputs e containers de ícone ficam no 12.
        </Callout>
      </div>
    </Pagina>
  ),
};
