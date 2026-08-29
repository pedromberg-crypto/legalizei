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
// 🆕 28/08 (pedido do Pedro) — Home Campeã entrou no grupo de testes: página
// importante o suficiente pra também levar as referências de redesign.
// Sem componente próprio em `components/` (a composição vive direto no
// `page.tsx`, sem wrapper de rota — não recebe props) — import direto do
// arquivo de rota, mesmo padrão de qualquer outro componente React.
import HomeCampeaPage from "@/app/(app)/(portal)/home-campea/page";
// 🔄 28/08 (pedido do Pedro) — "Aplicação da referência" trocou de fonte DE
// NOVO: era `referencia-wallet-v11` (removida), agora é
// `referencia-fintech-v12`. Regra travada: cada referência nova SUBSTITUI a
// anterior inteira, nunca acumula. v1-v11 seguem no repo, desconectadas.
import {
  ReferenciaPlano,
  ReferenciaRetomar,
  ReferenciaFork,
  ReferenciaDadosPessoais,
  ReferenciaHomeCampea,
} from "@/components/lab/referencia-fintech-v12";
import { Validados } from "@/components/lab/validados";

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
  {
    titulo: "Home Campeã (dia-1)",
    nota: "O /home-campea de hoje, solto. Página importante o bastante pra também levar as referências de redesign — 7 blocos (saudação, próximo compromisso, atalhos, notas, vigilância fiscal, blog, quem cuida).",
    render: () => <HomeCampeaPage />,
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
    nota: "Referência 12 (financial overview dashboard): cartão-herói escuro com brilho laranja (mensalidade+rodapé Detalhes/Continuar), 2 cartões-estatística sem delta (taxa/honorário), inclusos em linha estilo watchlist.",
    render: () => <ReferenciaPlano />,
    semAppPage: true,
  },
  {
    titulo: "N7 · A conta da abertura · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaPlano escuro />,
    semAppPage: true,
  },
  {
    titulo: "C0.1 · Retomar de onde parou · Claro",
    nota: "Referência 12: anel percentual cheio com o % real de progresso, passos em linha watchlist — 'Revisar e confirmar' (o único que REALMENTE trava até o pagamento) vira cartão-vault, com cadeado.",
    render: () => <ReferenciaRetomar />,
    semAppPage: true,
  },
  {
    titulo: "C0.1 · Retomar de onde parou · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaRetomar escuro />,
    semAppPage: true,
  },
  {
    titulo: "E3 · Fork · 3 rotas · Claro",
    nota: "Referência 12: 'Quero abrir' vira cartão-herói escuro com 1 ação (Começar), 'Já tenho empresa' e Legalize Digital viram linha watchlist.",
    render: () => <ReferenciaFork />,
    semAppPage: true,
  },
  {
    titulo: "E3 · Fork · 3 rotas · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaFork escuro />,
    semAppPage: true,
  },
  {
    titulo: "C1 · Seus dados · Claro",
    nota: "Referência 12: confirmação vira linha watchlist (ícone+dado), campos seguem cartõezinhos com sombra — mesma família do resto da referência.",
    render: () => <ReferenciaDadosPessoais />,
    semAppPage: true,
  },
  {
    titulo: "C1 · Seus dados · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaDadosPessoais escuro />,
    semAppPage: true,
  },
  {
    titulo: "Home Campeã (dia-1) · Claro",
    nota: "Referência 12: badge circular com a data real na saudação, DAS vira cartão-herói escuro, 2 cartões-estatística (mensalidade/notas), anel percentual do progresso, notas recentes em linha watchlist.",
    render: () => <ReferenciaHomeCampea />,
    semAppPage: true,
  },
  {
    titulo: "Home Campeã (dia-1) · Escuro",
    nota: "Mesmo componente, só `escuro`.",
    render: () => <ReferenciaHomeCampea escuro />,
    semAppPage: true,
  },
];

/**
 * 🆕 28/08 (pedido do Pedro: "crie uma tela... pra gente ir colocando os
 * assets que eu gostar, os que são validados") — 1 aparelho só, cresce peça
 * por peça. Não é par claro/escuro (não é comparação de referência inteira,
 * é coleção de pedaços aprovados) — por isso `VALIDADOS` tem 1 item só.
 */
const VALIDADOS: VersaoSolta[] = [
  {
    titulo: "Validados",
    nota: "Começa vazio de propósito. Cada asset aprovado entra aqui, um de cada vez.",
    render: () => <Validados />,
    semAppPage: true,
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
      {/* 🆕 28/08 (pedido do Pedro) — "Validados" é a 1ª seção da página:
          onde os pedaços aprovados se acumulam, o destino final de tudo que
          as outras seções abaixo exploram. */}
      <BoardSecaoSolta
        titulo="Validados"
        subtitulo="1 aparelho só — a coleção dos assets que o Pedro aprovou, peça por peça. Não compara nada, só acumula."
        versoes={VALIDADOS}
      />
      {/* 🔄 28/08 (pedido do Pedro) — "Aplicação da referência" é a 2ª seção,
          "Teste" logo abaixo. N6/N7 (comparação original × contido ×
          robusto) seguem depois. */}
      <BoardSecaoSolta
        titulo="Aplicação da referência"
        extra={<IndicadorClaroEscuro />}
        subtitulo="Mesmas telas de 'Teste', reconstruídas com a referência 12 (financial overview dashboard: cartão-herói escuro com brilho laranja + cartão-vault pro passo que realmente trava + anel percentual + linha watchlist sem delta) — sempre em par claro + escuro, lado a lado (não é toggle). Veio em mockup de desktop — extraí só a linguagem visual. Sem gráfico de fluxo de caixa, sem watchlist de ações, sem % de crescimento inventado. Regra travada: cada referência nova SUBSTITUI a anterior inteira (v1-v11 seguem no repo, desconectadas)."
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
