import { BoardPagina, BoardSecao, type Versao } from "@/components/lab/versao-board";

/**
 * /mockup-v2 — COMPARAÇÃO página a página do redesign (28/07 em diante).
 * Pra cada tela que a gente for mexer: original (produção) + 2 candidatos
 * lado a lado — CONTIDO (ajuste pontual, risco baixo) e ROBUSTO (redesign
 * mais forte, puxa mais do acervo atualizado /componentes). Aprovado aqui,
 * sobe pro /mockup real (a rota de produção) e os 2 candidatos + a seção
 * somem daqui — pra não empilhar peso morto. Uma seção por tela em aberto.
 *
 * Aprovadas até agora (fora daqui, já em produção):
 *   · N4 · Gate-CNAE (28/07) — versão robusta, pill coral → /gate.
 *   · Encaixe (28/07) — card do robusto (barra+stat cards+check-list) +
 *     alternativas empilhadas do contido → components/encaixe.tsx.
 *
 * Em aberto, mas DECIDIDO manter o original por ora (sem candidatos ativos):
 *   · N4 · Triagem (sócios/exterior) e N4 · Faixa de faturamento.
 *   · Veredito 🟡 Waitlist · 🔴 Contato especial · 🔴 Fora de escopo.
 */

const CRIAR_CONTA: Versao[] = [
  {
    rota: "/conta",
    v: "original",
    titulo: "N6 · Criar conta (produção)",
    nota: "O /conta de hoje. Campos, autofill de endereço e pills de coorte em rounded-md.",
  },
  {
    rota: "/conta-v2",
    v: "contido",
    titulo: "Ajuste contido",
    nota: "Só troca pontual: campos, autofill e pills de coorte → rounded-2xl. Campo/Texto do DS não foram tocados (compartilhados com o dossiê). Layout e copy idênticos.",
  },
  {
    rota: "/conta-v2-robusto",
    v: "robusto",
    titulo: "Redesign robusto",
    nota: "Dados pessoais (nome/CPF/telefone/e-mail/senha/endereço) ganham painel único (rounded-3xl bg-surface-alt, idioma do gate/triagem/faixa/waitlist), campos viram cards claros dentro. Coorte vira pill (ativo = coral) em vez de 2 blocos grandes.",
  },
];

const A_CONTA_DA_ABERTURA: Versao[] = [
  {
    rota: "/plano",
    v: "original",
    titulo: "N7 · A conta da abertura (produção)",
    nota: "O /plano de hoje. Bloco da taxa da Junta em rounded-md; os 2 heróis (Grátis/Mensalidade) já usam o Card do DS.",
  },
  {
    rota: "/plano-v2",
    v: "contido",
    titulo: "Ajuste contido",
    nota: "Só troca pontual: bloco da taxa → rounded-2xl. Os heróis não mudam — hierarquia é decisão documentada (2ª rodada 19/07), preservada. Layout e copy idênticos.",
  },
  {
    rota: "/plano-v2-robusto",
    v: "robusto",
    titulo: "Redesign robusto",
    nota: "Heróis preservados de propósito (mesma razão do contido). A linha da taxa ganha ícone-chip (prédio/órgão, idioma GuiasRecentes) + badge coral 'Por nossa conta' no cenário empresa-paga.",
  },
];

export default function MockupV2Page() {
  return (
    <BoardPagina
      eyebrow="Legalizai · redesign v2"
      titulo="Comparação página a página"
      subtitulo="Original × contido × robusto, lado a lado. Aprovando uma versão, ela sobe pro /mockup de verdade e a seção some daqui. Toca dentro do aparelho pra navegar."
    >
      <BoardSecao
        titulo="N6 · Criar conta"
        subtitulo="Front-load de dados pessoais (28/07): nome, CPF, telefone e endereço migraram pra cá. 2 estados: formulário + código de verificação."
        versoes={CRIAR_CONTA}
      />
      <BoardSecao
        titulo="N7 · A conta da abertura"
        subtitulo="Antes de cobrar: os 3 baldes (grátis / taxa de governo / recorrente) num lugar só. 2 cenários: taxa cobrada do cliente (produção) × ?cenario=empresa-paga (alternativa documentada)."
        versoes={A_CONTA_DA_ABERTURA}
      />
    </BoardPagina>
  );
}
