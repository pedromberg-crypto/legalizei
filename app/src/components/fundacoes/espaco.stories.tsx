import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Callout } from "./_helpers";

/**
 * FUNDAÇÕES/ESPAÇAMENTO — mapeamento pra escala NATIVA do Tailwind (base-4),
 * documentado em `globals.css` (comentário "ESPAÇAMENTO — sem token novo, de
 * propósito"). Não existe `--space-*` como CSS var — de propósito, criar um
 * por cima da escala nativa do Tailwind seria abstração duplicada. Migrado de
 * `design-system.html` §Espaçamento (05/08).
 */
const meta = {
  title: "Fundações/Espaçamento",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ESCALA = [
  { nome: "space-1", px: 4, tw: "p-1", uso: "colagem" },
  { nome: "space-2", px: 8, tw: "p-2", uso: "chip interno" },
  { nome: "space-3", px: 12, tw: "p-3", uso: "input interno" },
  { nome: "space-4", px: 16, tw: "p-4", uso: "card interno" },
  { nome: "space-5", px: 24, tw: "p-6", uso: "padding da página" },
  { nome: "space-6", px: 32, tw: "p-8", uso: "seção" },
  { nome: "space-7", px: 48, tw: "p-12", uso: "respiro grande" },
  { nome: "space-8", px: 64, tw: "p-16", uso: "topo/rodapé" },
];

export const Escala: Story = {
  render: () => (
    <Pagina
      titulo="Espaçamento — base 4"
      lead="Sem token novo, de propósito: a escala nativa do Tailwind já é base-4 e bate com a do DS. Uma densidade só — compact/comfortable é aposta."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ESCALA.map((s) => (
          <div key={s.nome} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "var(--text-caption)" }}>
            <span style={{ width: 220, flexShrink: 0, color: "var(--color-text-secondary)" }}>
              <code style={{ fontSize: "0.75rem" }}>
                {s.nome} → {s.tw}
              </code>{" "}
              · {s.px}px · {s.uso}
            </span>
            <span style={{ height: 16, width: s.px, background: "var(--color-action-primary)", borderRadius: 3 }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <Callout>
          Único caso semântico: o padding lateral da página (24 = space-5) mora em <code>.app-page</code>{" "}
          (`globals.css`), pra não ser redecidido tela a tela.
        </Callout>
      </div>
    </Pagina>
  ),
};
