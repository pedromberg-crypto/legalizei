import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Painel, Sub } from "./_helpers";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNDAÇÕES/ELEVAÇÃO & MOTION — migrado de `design-system.html` §Elevação
 * (05/08). ⚠️ Diferente de Cor/Tipografia/Raio: essas durações NÃO existem
 * como CSS var em `globals.css` hoje — é regra decidida, ainda não
 * tokenizada. Documentado aqui pra não perder a regra; virar `--motion-*`
 * de verdade é trabalho futuro, fora desta migração.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const meta = {
  title: "Fundações/Elevação & Motion",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regras: Story = {
  render: () => (
    <Pagina titulo="Elevação & Motion" lead="">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Painel>
          <Sub>Elevação — sem sombra por padrão</Sub>
          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
            O fundo é papel quente, não branco. Card = branco sobre papel + borda hairline (ink-200) já separa.
            Sombra só pra sheet/modal, que precisam flutuar de verdade.
          </p>
        </Painel>
        <Painel>
          <Sub>Motion — craft está no escopo (MLP)</Sub>
          <table style={{ width: "100%", fontSize: "var(--text-caption)", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["motion-micro", "150ms", "hover, toggle, foco"],
                ["motion-default", "250ms", "transição de tela"],
                ["motion-enter", "400ms", "entrada, Lottie"],
              ].map(([n, v, u]) => (
                <tr key={n}>
                  <td style={{ padding: "4px 8px 4px 0" }}>
                    <code>{n}</code>
                  </td>
                  <td style={{ padding: "4px 8px" }}>{v}</td>
                  <td style={{ padding: "4px 0", color: "var(--color-text-tertiary)" }}>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginTop: 10 }}>
            Easing <code>ease-out</code>. Respeita sempre <code>prefers-reduced-motion</code> (já implementado em{" "}
            <code>globals.css</code>).
          </p>
        </Painel>
      </div>
    </Pagina>
  ),
};
