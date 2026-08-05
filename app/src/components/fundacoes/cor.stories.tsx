import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Grade, Swatch, Pagina, Sub, Callout } from "./_helpers";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNDAÇÕES/COR — fonte: `app/src/app/globals.css` (lido ao vivo, zero cópia).
 * ═══════════════════════════════════════════════════════════════════════════
 * Migrado de `marca/identidade-visual/design-system.html` §Cor (05/08) — ver
 * [[legalize-storybook-design-system-unificacao]]. Arquitetura em 2 camadas:
 * CAMADA 1 — primitivos `--p-*` (CSS var comum, SEM classe Tailwind, nenhuma
 * tela toca direto) · CAMADA 2 — semânticos `--color-*` (só estes viram
 * classe utilitária; a tela pede um PAPEL, nunca um matiz).
 * ═══════════════════════════════════════════════════════════════════════════
 */
const meta = {
  title: "Fundações/Cor",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CORAL = Array.from({ length: 9 }, (_, i) => `--p-coral-${(i + 1) * 100}`);
const INK = ["--p-white", ...Array.from({ length: 9 }, (_, i) => `--p-ink-${(i + 1) * 100}`)];
const ESTADO = ["success", "warning", "danger", "info"].flatMap((s) => [
  `--p-${s}-50`,
  `--p-${s}-500`,
  `--p-${s}-700`,
]);

const SEMANTICOS: { nome: string; papel: string }[] = [
  { nome: "--color-surface-page", papel: "papel quente — não é branco puro" },
  { nome: "--color-surface-card", papel: "card sobre papel" },
  { nome: "--color-surface-dark", papel: "bloco escuro (hero, avatar)" },
  { nome: "--color-surface-tint-brand", papel: "destaque suave · não é aviso" },
  { nome: "--color-text-primary", papel: "texto + CTA escuro" },
  { nome: "--color-text-muted", papel: "⚠️ só placeholder/disabled — nunca leitura (falha AA)" },
  { nome: "--color-action-primary", papel: "fill de botão · AA só em texto grande" },
  { nome: "--color-action-primary-sm", papel: "botão pequeno escurece" },
  { nome: "--color-brand", papel: "⚠️ só logo/wordmark. Nunca fill" },
];

export const TodasAsCores: Story = {
  render: () => (
    <Pagina
      titulo="Cor"
      lead="Sistema de 2 cores disciplinado: coral = marca + ação · ink = seriedade + estrutura. Verdes/vermelhos/âmbar são só estado, nunca decoração."
    >
      <Sub>Coral — marca / ação</Sub>
      <Grade>
        {CORAL.map((v) => (
          <Swatch key={v} varName={v} />
        ))}
      </Grade>

      <Sub>Ink / neutros — texto, estrutura, base</Sub>
      <Grade>
        {INK.map((v) => (
          <Swatch key={v} varName={v} />
        ))}
      </Grade>

      <Sub>Estado — funcional (estado do CNPJ)</Sub>
      <Grade>
        {ESTADO.map((v) => (
          <Swatch key={v} varName={v} />
        ))}
      </Grade>

      <Sub>Tokens semânticos — o que a tela usa</Sub>
      <Grade>
        {SEMANTICOS.map((s) => (
          <Swatch key={s.nome} varName={s.nome} papel={s.papel} />
        ))}
      </Grade>

      <Sub>🔒 As 4 regras duras</Sub>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {[
          ["01", "Nenhuma tela toca primitivo", "Tela que escreve #F2643C é bug, não estilo."],
          ["02", "Coral nunca é erro", "Coral e vermelho são hues vizinhos. Erro = crimson + ícone + texto."],
          ["03", "text-muted nunca é leitura", "ink-400 só em placeholder/disabled. Texto de conteúdo falha AA."],
          ["04", "Azul nunca é marca", "info-blue é funcional (dica de sistema), uso mínimo."],
        ].map(([n, t, d]) => (
          <div
            key={n}
            style={{
              border: "1px solid var(--color-border-hairline)",
              borderRadius: "var(--radius-md)",
              padding: "16px 18px",
              background: "var(--color-surface-card)",
            }}
          >
            <div style={{ fontSize: "var(--text-micro)", fontWeight: 700, color: "var(--color-action-primary)" }}>
              {n}
            </div>
            <div style={{ fontWeight: 600, margin: "4px 0" }}>{t}</div>
            <div style={{ fontSize: "var(--text-caption)", color: "var(--color-text-secondary)" }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Callout>
          <b>Atrito mecânico.</b> Governança solo é mecânica, não social. Se <code>#F2643C</code> não existe em
          lugar nenhum pra copiar, ninguém usa — o caminho curto é o token, por preguiça, não por disciplina.
        </Callout>
      </div>
    </Pagina>
  ),
};
