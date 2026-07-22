import { BoardPagina, BoardSecao, type Versao } from "@/components/lab/versao-board";

/**
 * /mockup-inicio — LABORATÓRIO de versões (todas as explorações num board só).
 * Cada referência de página é uma SEÇÃO empilhada; as novas descem no fim.
 */

const INICIO: Versao[] = [
  {
    rota: "/inicio-v2",
    v: "v2",
    titulo: "Dashboard-first",
    nota: "Os 4 números de decisão são o herói (2×2 no topo) → foco → 4 ações. Aposta: o dono abre pra DECIDIR (cresci? pago quanto? teto? alíquota?).",
  },
  {
    rota: "/inicio-v3",
    v: "v3",
    titulo: "Número no header",
    nota: "O pulso do negócio (em dia + faturamento) mora DENTRO do header escuro, como saldo de banco. Sheet só com foco + ações + vencimentos. Aposta: 1ª coisa = alívio.",
  },
];

const MAIS: Versao[] = [
  {
    rota: "/mais-v1",
    v: "v1",
    titulo: "Grid",
    nota: "A variante esquerda do print: tiles 2×2 por seção, cada item com ícone. Mais visual, bom com POUCOS itens; escala pior se a lista crescer.",
    feito: true,
  },
  {
    rota: "/mais-v2",
    v: "v2",
    titulo: "Lista",
    nota: "A variante direita: rows com chevron por seção. Densa e escalável, cabe muito item. Tende a ganhar num hub de menu que cresce.",
  },
  {
    rota: "/mais-completa",
    v: "completa",
    titulo: "Com resumo do negócio",
    nota: "A gaveta mais cheia: ganha um RESUMO no topo (CNPJ ativo + em dia + faturamento + imposto) antes das seções, pra a Mais não ser só menu seco.",
    feito: true,
  },
];

const INICIO_DASH: Versao[] = [
  {
    rota: "/inicio-v4",
    v: "v4",
    titulo: "Stat-grid + recentes",
    nota: "Ref. Approval Dashboard (tela 1): saudação + 2×2 de stat cards com tendência + 'Movimentações recentes'. Painel como central de STATUS.",
  },
];

const OBRIGACOES: Versao[] = [
  {
    rota: "/obrigacoes",
    v: "página",
    titulo: "Calendário de obrigações",
    nota: "Página nova (ref. schedule odontológico): header do mês + day-strip (dia com DOT = obrigação) + TIMELINE vertical dos prazos fiscais (declaração ✓ · DAS a pagar · notas · declaração girando) com cards dark e slot 'adicionar lembrete'.",
  },
];

const IMPOSTOS: Versao[] = [
  {
    rota: "/impostos-v1",
    v: "v1",
    titulo: "Saldo + transações",
    nota: "Ref. Rewards: card grande com o que você DEVE (como 'Current Balance') + Pagar, e as guias como transações com chip de valor (verde=pago, âmbar=a vencer).",
    feito: true,
  },
  {
    rota: "/impostos-v2",
    v: "v2",
    titulo: "Discover (busca+lista)",
    nota: "Ref. Discover: busca por competência + filtro + 2 cards de resumo + guias como lista com expandir. Mais explorável, menos foco na ação de pagar.",
    feito: true,
  },
  {
    rota: "/impostos-completa",
    v: "completa",
    titulo: "Saldo + ano + insight",
    nota: "A mais cheia: saldo a pagar + 2 números do ano (pago no ano, alíquota) + INSIGHT (de olho no Fator R) + guias como transações.",
  },
];

const INICIO_REF5: Versao[] = [
  {
    rota: "/inicio-ref5",
    v: "ref5",
    titulo: "Agenda + ticket + blog",
    nota: "Ref. reservas (laranja=coral). NÃO é o v6 num skin: adapta os componentes do ref → day-strip fiscal (dot=obrigação), countdown do imposto, o DAS como TICKET (sem barcode, com Pix) + chips fiscais, stat cards com chip, e um CAROUSEL DE BLOG/dicas (conteúdo = app vivo).",
    feito: true,
  },
];

const INICIO_REF6: Versao[] = [
  {
    rota: "/inicio-ref6",
    v: "ref6",
    titulo: "Fintech premium (dark)",
    nota: "Ref. banking dark: hero escuro com faturamento GIGANTE + trend + 4 botões glass (Emitir/Pagar/Add/Mais) · seletor de empresa · 'Emitir pra' clientes recentes · movimentações · BAR CHART com linha de média · stacked bar 'pra onde vai'. Estética premium.",
    feito: true,
  },
];

const INICIO_REF7: Versao[] = [
  {
    rota: "/inicio-ref7",
    v: "ref7",
    titulo: "Saúde (busca + compromissos + promo)",
    nota: "Ref. telemedicina: saudação + avatar · search bar com botão dark · chips de categoria · carousel de COMPROMISSOS FISCAIS coloridos (DAS coral, notas dark) · ★ card de MARKETING 'indique e ganhe' · checklist de COMPLIANCE (lista de doctors repurposed com status Em dia/Pendente).",
    feito: true,
  },
];

const INICIO_REF9: Versao[] = [
  {
    rota: "/inicio-ref9",
    v: "ref9",
    titulo: "Wellness (calma + acolhedora)",
    nota: "Ref. saúde mental (soft): saudação 'como está sua empresa hoje?' · ★ grid ASSIMÉTRICO de métricas com chips pastel · card featured DARK (o DAS, 'a gente já gerou') · ★ 'quem cuida de você' com pilha de avatars (tranquiliza). A estética que ACALMA o domínio assustador.",
    feito: true,
  },
];

const INICIO_REF11: Versao[] = [
  {
    rota: "/inicio-ref11",
    v: "ref11",
    titulo: "AI notes (ações + IA + voz)",
    nota: "Ref. AI notes — aderente ao produto (emitimos nota + IA é âncora): profile row · search com mic · ★ grid de AÇÕES com card ativo (Emitir/Pagar/Pró-labore/Docs) · card 'emitir por VOZ' com waveform · ★ 'Pergunte à IA' (dúvidas fiscais = IACA) · notas recentes com tags. Página INTEIRA aprovada.",
    feito: true,
  },
];

const INICIO_REF12: Versao[] = [
  {
    rota: "/inicio-ref12",
    v: "ref12",
    titulo: "Health/AI warm (circles + swipe-to-pay)",
    nota: "Última da leva. AI hero search 'pergunte qualquer coisa' · ★ category CIRCLES redondos (Emitir/Pagar/Pró-labore/Mais) · '+ novo' dashed + card · promo 'débito automático' · ★ SWIPE-TO-PAY (deslize pra pagar o DAS) · fee breakdown 'a conta do imposto'.",
    feito: true,
  },
];

const COMPONENTES: Versao[] = [
  {
    rota: "/componentes",
    v: "acervo",
    titulo: "Componentes validados",
    nota: "A gaveta dos campeões: conforme você valida um componente numa página, eu salvo aqui isolado (com a origem), pra montar a home final combinando os melhores. Vazio até a 1ª validação.",
  },
];

export default function LaboratorioPage() {
  return (
    <BoardPagina
      eyebrow="Legalizai · laboratório de layout"
      titulo="Versões de página"
      subtitulo="Todas as explorações num lugar só. Cada seção é uma referência de página, com as versões lado a lado; as novas entram no fim. Mesma navbar flutuante em todas. Toque dentro de um aparelho pra navegar."
    >
      <BoardSecao
        titulo="📅 Calendário de obrigações (página nova)"
        subtitulo="Ref. schedule odontológico adaptada ao fiscal: day-strip com dot nos dias com obrigação + timeline vertical dos prazos do mês (declaração, DAS, notas) + slot 'adicionar lembrete'. Topo claro."
        versoes={OBRIGACOES}
      />
      <BoardSecao
        titulo="Início · ref. reservas (agenda + ticket + blog)"
        subtitulo="Nova leva: componentes DIFERENTES adaptados ao nosso dado (day-strip fiscal, DAS-como-ticket com barcode, carousel de blog). Fonte de componentes pra garimpar. Topo claro."
        versoes={INICIO_REF5}
      />
      <BoardSecao
        titulo="Início · ref. fintech premium (dark + charts)"
        subtitulo="Hero escuro com faturamento gigante + 4 botões glass, 'emitir pra' clientes, movimentações, bar chart com média e stacked bar 'pra onde vai'. Topo escuro."
        versoes={INICIO_REF6}
        statusClaro
      />
      <BoardSecao
        titulo="Início · ref. saúde (busca + compromissos + promo)"
        subtitulo="Saudação + busca + chips + carousel de compromissos fiscais coloridos + card de marketing 'indique e ganhe' + checklist de compliance. Topo claro."
        versoes={INICIO_REF7}
      />
      <BoardSecao
        titulo="Início · ref. wellness (calma + acolhedora)"
        subtitulo="A estética que acalma o domínio assustador: saudação acolhedora + grid assimétrico de métricas soft + card featured dark + 'quem cuida de você'. Topo claro."
        versoes={INICIO_REF9}
      />
      <BoardSecao
        titulo="Início · ref. AI notes (ações + IA + voz)"
        subtitulo="A mais aderente ao produto: grid de ações com card ativo, emitir por voz (waveform), 'Pergunte à IA' (nossa IACA) e notas recentes com tags. Topo claro."
        versoes={INICIO_REF11}
      />
      <BoardSecao
        titulo="Início · ref. health/AI warm (circles + swipe-to-pay)"
        subtitulo="Última da leva: AI hero search + category circles redondos + '+ novo' + promo débito automático + ★ SWIPE-TO-PAY do DAS + fee breakdown. Topo claro."
        versoes={INICIO_REF12}
      />
      <BoardSecao
        titulo="Início · v1 / v2 / v3"
        subtitulo="Ref. nexobank (header escuro + sheet + card de dado + grid de ações). Topo escuro."
        versoes={INICIO}
        statusClaro
      />
      <BoardSecao
        titulo="Mais · v1 / v2"
        subtitulo="Ref. perfil-menu (perfil + nudge do certificado + seções): grid de tiles × lista. Topo claro."
        versoes={MAIS}
      />
      <BoardSecao
        titulo="Início · v4 / v5 (ref. Approval Dashboard)"
        subtitulo="Outra leitura da Início: stat-grid com tendências × analytics com charts (linha + donut). Verde do ref traduzido pros nossos tokens. Topo claro."
        versoes={INICIO_DASH}
      />
      <BoardSecao
        titulo="Impostos · v1 / v2 (ref. Rewards)"
        subtitulo="A página de impostos: card de saldo + transações × discover com busca e lista. Chips de valor usam estado (verde=pago, âmbar=a vencer). Topo claro."
        versoes={IMPOSTOS}
      />
      <BoardSecao
        titulo="🧩 Componentes validados (acervo)"
        subtitulo="A gaveta dos campeões, no fim de tudo. Você valida um componente numa página e eu salvo aqui, isolado, pra montar a home final. Comece dizendo 'valido o X da página Y'. Topo claro."
        versoes={COMPONENTES}
      />
    </BoardPagina>
  );
}
