import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Callout } from "./_helpers";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNDAÇÕES/GRADIENTE — migrado de `design-system.html` §Gradiente (05/08).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ Diferente de Cor/Tipografia/Raio, gradiente NÃO é token em `globals.css`
 * hoje — cada tela declara o valor inline. Os 3 abaixo (ink-hero, metal,
 * brand-glow) foram conferidos linha a linha contra o código real em 05/08 e
 * batem, mas o "scrim" JÁ DIVERGIU: `blog/page.tsx` usa 94/55/10%,
 * `campea-blocks.tsx` usa 96/72/18%, `blog/post/page.tsx` usa uma 3ª
 * variação — exatamente o risco de divergência que motivou esta migração.
 * Valor abaixo é o de `blog/page.tsx` (bate com o que o design-system.html
 * já documentava). Reconciliar os 3 é decisão de produto, não desta página.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const meta = {
  title: "Fundações/Gradiente",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const GRADIENTES = [
  {
    nome: "ink-hero",
    valor: "linear-gradient(160deg, #2A2E37 0%, #15171C 62%, #202433 100%)",
    uso: "Card de conteúdo · hero do blog",
    fonte: "components/lab/ref6-blocks.tsx",
  },
  {
    nome: "scrim",
    valor: "linear-gradient(to top, rgba(21,23,28,.94) 4%, rgba(21,23,28,.55) 46%, rgba(42,46,55,.10) 100%)",
    uso: "Overlay funcional — escurece base de foto pro texto passar em AA",
    fonte: "app/(app)/(portal)/blog/page.tsx — ⚠️ 2 outras variações em campea-blocks.tsx e blog/post/page.tsx",
  },
  {
    nome: "metal",
    valor: "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
    uso: "Superfície que finge ser coisa (certificado, moldura). Não é UI",
    fonte: "mockup/page.tsx, lab/versao-board.tsx",
  },
  {
    nome: "brand-glow",
    valor:
      "radial-gradient(120% 80% at 15% 0%, color-mix(in srgb, var(--color-brand) 22%, transparent), transparent 60%)",
    uso: "Calor de marca (login) — radial de coral a 22% sobre bloco escuro",
    fonte: "app/(wizard)/login/page.tsx, wizard-dinheiro.tsx",
  },
];

export const Familias: Story = {
  render: () => (
    <Pagina
      titulo="Gradiente"
      lead="Uma família gráfica escura, já usada nas telas — não é enfeite novo. Gradiente aqui é acento (hero, card, objeto físico, glow), nunca superfície de UI nem fill de botão."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {GRADIENTES.map((g) => (
          <div key={g.nome}>
            <div
              style={{
                background: g.valor,
                borderRadius: "var(--radius-lg)",
                minHeight: 150,
                display: "flex",
                alignItems: g.nome === "metal" ? "center" : "flex-end",
                justifyContent: g.nome === "metal" ? "center" : "flex-start",
                padding: 16,
              }}
            >
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "var(--text-caption)" }}>{g.uso}</div>
            </div>
            <p style={{ marginTop: 10, fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
              <code style={{ fontSize: "0.75em" }}>{g.nome}</code>
              <br />
              {g.fonte}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <Callout>
          <b>Regra do gradiente:</b> restrição é o que o mantém elegante. Só as 4 receitas acima, sempre como acento
          sobre escuro. Sem gradiente colorido de UI, sem coral→laranja de botão.
        </Callout>
      </div>
    </Pagina>
  ),
};
