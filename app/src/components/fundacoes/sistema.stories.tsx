import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagina, Sub } from "./_helpers";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNDAÇÕES/SISTEMA — migrado de `design-system.html` §Sistema (05/08).
 * ═══════════════════════════════════════════════════════════════════════════
 * Prosa/metodologia (shells, arquétipos, governança) — não deriva de CSS var,
 * por isso não é "lida ao vivo" como Cor/Tipografia/Raio. Escrita como story
 * CSF (não `.mdx`) de propósito: é o único padrão usado no resto do projeto
 * (nenhum outro arquivo `.mdx` existe no repo), evita depender de um segundo
 * pipeline de render (MDX) só pra esta página.
 *
 * É a página que eu (Claude) consulto antes de criar tela nova, junto com os
 * tokens em `Fundações/*` e o inventário de `DS/*`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const meta = {
  title: "Fundações/Sistema (shells, arquétipos, governança)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  fontSize: "var(--text-micro)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--color-text-muted)",
  borderBottom: "1px solid var(--color-border-hairline)",
};
const td: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "var(--text-caption)",
  borderBottom: "1px solid var(--color-border-hairline)",
  verticalAlign: "top",
};

const SHELLS = [
  ["Telas", "N1–N9 (até o pagamento)", "N10 em diante"],
  ["Forma", "fullscreen · sem nav · sem saída lateral", "a casa · navegação persistente (4 abas + CTA central)"],
  ["Uso", "uma vez, linear", "recorrente"],
  ["Cresce?", "não (finito)", "sim — é onde abas novas nascem"],
];

const ARQUETIPOS = [
  ["A1", "Pergunta", "Input / escolha / toggle. O mais comum. Erro inline, nunca modal."],
  ["A2", "Veredito 🟢🟡🔴", "Estado + rota. Regra de ouro: nunca veredito com baixa confiança."],
  ["A3", "Argumento / prova", 'Número grande + carimbo de estimativa + "baixar o porquê".'],
  ["A4", "Simulador", "Input + resultado ao vivo + expander de memória de cálculo."],
  ["A5", "Recap / revisão", "Lista por seção + editar volta ao passo certo."],
  ["A6", "Aceite (gate jurídico)", "Leitura + botão único grande. Legal nunca atrás de expander."],
  ["A7", "Espera", "Estado + previsão honesta + aviso proativo."],
  ["A8", "Painel / timeline", "Etapas × estados. A máquina que o cliente assiste."],
  ["A9", "Saída graciosa", "1 template só: explica + captura lead + roteia + leva o dossiê junto."],
  ["A10", "Erro recuperável", "“Precisa de você” + ação concreta, dentro do pipeline."],
];

export const Visao: Story = {
  render: () => (
    <Pagina
      titulo="Sistema — shells, arquétipos, governança"
      lead="Consultar antes de criar/editar tela: junto com os tokens em Fundações/* e o inventário em DS/*."
    >
      <Sub>Os 2 shells</Sub>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginBottom: 16 }}>
        A coesão de app grande não vem de componente bonito — vem da moldura que não se mexe. O produto tem dois
        shells, e a casa nasce no pagamento (N9/E9).
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}></th>
            <th style={th}>Wizard</th>
            <th style={th}>App</th>
          </tr>
        </thead>
        <tbody>
          {SHELLS.map(([label, wizard, app]) => (
            <tr key={label}>
              <td style={{ ...td, fontWeight: 600 }}>{label}</td>
              <td style={td}>{wizard}</td>
              <td style={td}>{app}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginTop: 12 }}>
        <b>Padrão de tela (3 partes):</b> título FIXO (não rola) · corpo ROLA (fade de affordance, nunca gate) · CTA
        FIXO no rodapé (thumb zone, respeita safe-area). Estrutura via <code>components/ui/tela.tsx</code>.
      </p>

      <Sub>Arquétipos — as situações que se repetem</Sub>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginBottom: 16 }}>
        A pergunta não é “quais componentes preciso”, é “quais situações se repetem”. Derivado do mapa de
        ramificações do flow, não inventado.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {ARQUETIPOS.map(([id, nome, quando]) => (
          <div
            key={id}
            style={{
              border: "1px solid var(--color-border-hairline)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              background: "var(--color-surface-card)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "var(--text-micro)",
                fontWeight: 700,
                color: "var(--color-action-primary)",
                background: "var(--color-surface-tint-brand)",
                padding: "2px 8px",
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              {id}
            </span>
            <div style={{ fontWeight: 600, marginBottom: 3 }}>{nome}</div>
            <div style={{ fontSize: "var(--text-caption)", color: "var(--color-text-secondary)" }}>{quando}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginTop: 12 }}>
        <b>Transversais</b> (não são arquétipo de tela): expander de profundidade · carimbo de estimativa ·
        idempotência visível · handoff humano com dossiê.
      </p>

      <Sub>Governança — a parte que de fato mata</Sub>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginBottom: 16 }}>
        Governança de time é social; governança solo é mecânica. A regra não pode depender de lembrança — fazer
        errado tem que ser mais difícil que fazer certo.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            background: "var(--color-surface-card)",
            border: "1px solid var(--color-border-hairline)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Regra dos 3</div>
          <div style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
            Nenhuma tela inventa componente — ou usa o que existe, ou promove conscientemente. Aparece nas 2 telas-farol
            → promove agora. Numa só → fica local, espera a 3ª ocorrência.
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface-card)",
            border: "1px solid var(--color-border-hairline)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Fundação larga, componente estreito</div>
          <div style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)" }}>
            Cor, tipo, espaço, raio e motion valem pro produto inteiro — baratos de acertar agora (vive em
            Fundações/*). Componente só nasce quando uma tela pede.
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>O que</th>
            <th style={th}>Alvo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>valor hard-coded fora de token</td>
            <td style={{ ...td, fontWeight: 700 }}>0</td>
          </tr>
          <tr>
            <td style={td}>componentes novos por tela</td>
            <td style={{ ...td, fontWeight: 700 }}>cai ao longo das telas</td>
          </tr>
          <tr>
            <td style={td}>tempo da tela N vs tela 1</td>
            <td style={{ ...td, fontWeight: 700 }}>cai</td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-tertiary)", marginTop: 12 }}>
        Se a nona tela custar o mesmo que a primeira, o sistema falhou. O protótipo é colhido, não portado: migra
        decisão, não arquivo.
      </p>
    </Pagina>
  ),
};
