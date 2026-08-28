"use client";
// 🆕 28/08 — obrigatório a partir de agora: `VersaoSolta.render` é uma FUNÇÃO
// (não string), e função não atravessa a fronteira servidor→cliente. Antes
// esta página não precisava disso (`Versao` só tem string).

import {
  BoardPagina,
  BoardSecao,
  BoardSecaoSolta,
  type Versao,
  type VersaoSolta,
} from "@/components/lab/versao-board";
import { PlanoView } from "@/components/wizard-dinheiro";
import { RetomarView } from "@/components/wizard-cauda";
import { EntradaView } from "@/components/entrada";
import { SocioView } from "@/components/wizard-dossie";
import {
  ReferenciaPlano,
  ReferenciaRetomar,
  ReferenciaFork,
  ReferenciaDadosPessoais,
} from "@/components/lab/referencia-interior-v1";

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

/**
 * 🆕 28/08 (pedido do Pedro) — seção "Teste": telas SOLTAS (`BoardSecaoSolta`),
 * sem router/sem `onSeguir` real — só a casca, isolada, pra explorar redesign
 * sem depender de onde a tela vive de verdade. 3 telas DIFERENTES juntas (não
 * variações de uma só), primeira leva do redesign sutil que o Pedro quer testar.
 */
const TESTE: VersaoSolta[] = [
  {
    titulo: "N7 · A conta da abertura (produção)",
    nota: "O /plano de hoje, solto — sem router. `onSeguir`/`onVoltar` são no-op.",
    render: () => (
      <PlanoView onSeguir={() => {}} onVoltar={() => {}} layout="oferta" />
    ),
  },
  {
    titulo: "C0.1 · Retomar de onde parou",
    nota: "O /retomar de hoje, solto — sem router. `onSeguir` é no-op.",
    render: () => <RetomarView onSeguir={() => {}} />,
  },
  {
    titulo: "E3 · Fork · 3 rotas",
    nota: "O /entrada de hoje, solto — sem router. `onIntencao`/`onLogin` são no-op.",
    render: () => (
      <EntradaView onIntencao={() => {}} onLogin={() => {}} destaqueCoral600 />
    ),
  },
  {
    titulo: "C1 · Seus dados",
    nota: "O /dossie/socio de hoje, solto — sem router. `onSeguir`/`onVoltar` são no-op. Tela de inputs, faltava no grupo.",
    render: () => <SocioView onSeguir={() => {}} onVoltar={() => {}} />,
  },
];

/**
 * 🆕 28/08 (pedido do Pedro) — 1ª referência aplicada: "interior design app"
 * (`components/lab/referencia-interior-v1.tsx`). Reconstruída do zero, não é
 * mais `PlanoView`/`RetomarView`/`EntradaView` — casca nova, dados de
 * produção (preço, passos, copy) preservados.
 *
 * 🆕 28/08 (pedido do Pedro) — cada tela sempre aparece em PAR: claro + escuro
 * lado a lado (não é toggle — o indicador ao lado do título é só rótulo).
 * `escuro` é a ÚNICA prop que muda entre as duas instâncias de cada par.
 */
const APLICACAO_REFERENCIA: VersaoSolta[] = [
  {
    titulo: "N7 · A conta da abertura · Claro",
    nota: "Referência 1 (interior design app): hero claro em vez de escuro, lista agrupada, CTA em pílula.",
    render: () => <ReferenciaPlano />,
  },
  {
    titulo: "N7 · A conta da abertura · Escuro",
    nota: "Mesmo componente, só `escuro`. A superfície escura vira a base; o coral segue idêntico.",
    render: () => <ReferenciaPlano escuro />,
  },
  {
    titulo: "C0.1 · Retomar de onde parou · Claro",
    nota: "Referência 1: anel percentual no lugar da barra, trilha vira lista agrupada com hairline.",
    render: () => <ReferenciaRetomar />,
  },
  {
    titulo: "C0.1 · Retomar de onde parou · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaRetomar escuro />,
  },
  {
    titulo: "E3 · Fork · 3 rotas · Claro",
    nota: "Referência 1: cartão-herói com ilustração ao lado do texto + CTA dentro do cartão.",
    render: () => <ReferenciaFork />,
  },
  {
    titulo: "E3 · Fork · 3 rotas · Escuro",
    nota: "Mesmo componente, só `escuro` (logo troca pra variante `escura`).",
    render: () => <ReferenciaFork escuro />,
  },
  {
    titulo: "C1 · Seus dados · Claro",
    nota: "🆕 tela de inputs (faltava no grupo): campo sem borda dura, preenchido em `bgAlt` — mesma família visual dos círculos de ícone.",
    render: () => <ReferenciaDadosPessoais />,
  },
  {
    titulo: "C1 · Seus dados · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaDadosPessoais escuro />,
  },
];

/** Indicador decorativo ao lado do título — não é toggle, os 2 já aparecem sempre. */
function IndicadorClaroEscuro() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border-hairline bg-surface-card p-1">
      <span className="rounded-full bg-surface-alt px-3 py-1 text-micro font-semibold text-text-primary">
        ☀ Claro
      </span>
      <span className="rounded-full bg-surface-dark px-3 py-1 text-micro font-semibold text-text-on-dark">
        ● Escuro
      </span>
    </span>
  );
}

export default function MockupV2Page() {
  return (
    <BoardPagina
      eyebrow="Legalizai · redesign v2"
      titulo="Comparação página a página"
      subtitulo="Original × contido × robusto, lado a lado. Aprovando uma versão, ela sobe pro /mockup de verdade e a seção some daqui. Toca dentro do aparelho pra navegar."
    >
      {/* 🔄 28/08 (pedido do Pedro) — "Aplicação da referência" subiu pra 1ª
          seção da página inteira, "Teste" logo abaixo. N6/N7 (comparação
          original × contido × robusto) seguem depois. */}
      <BoardSecaoSolta
        titulo="Aplicação da referência"
        extra={<IndicadorClaroEscuro />}
        subtitulo="Mesmas telas de 'Teste', reconstruídas com a referência (interior design app) — sempre em par claro + escuro, lado a lado (não é toggle)."
        versoes={APLICACAO_REFERENCIA}
      />
      <BoardSecaoSolta
        titulo="Teste"
        subtitulo="Telas soltas (sem router, sem navegação real) pra explorar um redesign sutil sem tocar no que já está no ar. 4 telas diferentes juntas, não variações de uma só."
        versoes={TESTE}
      />
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
