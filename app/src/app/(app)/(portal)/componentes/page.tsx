"use client";

import type { ReactNode } from "react";
import {
  NudgeCertificado,
  SecaoGrid,
  SecaoLista,
  SECOES,
  ProfileHeader,
  ResumoNegocio,
} from "@/components/lab/mais-shell";
import {
  DayStripFiscal,
  DasTicket,
  StatsCoral,
  ProximasObrigacoes,
  BlogCarousel,
} from "@/components/lab/ref5-blocks";
import { HeroDark, EmitirPra, MovimentacoesRecentes } from "@/components/lab/ref6-blocks";
import {
  Saudacao,
  SearchServico,
  CategoriaChips,
  IndiqueGanhe,
  SuaSituacao,
} from "@/components/lab/ref7-blocks";
import { ProximoCompromisso, QuemCuida } from "@/components/lab/ref9-blocks";
import {
  ProfileRow,
  SearchMic,
  AcoesRapidas,
  EmitirPorVoz,
  PergunteIA,
  NotasRecentes,
} from "@/components/lab/ref11-blocks";
import { CategoryCircles, PromoDebito, ContaSwipe } from "@/components/lab/ref12-blocks";
import { GuiasRecentes, SuasGuias } from "@/components/lab/impostos-blocks";

/**
 * 🧩 ACERVO DE COMPONENTES VALIDADOS · a gaveta dos campeões.
 * O Pedro valida componentes soltos nas páginas; eu salvo AQUI, isolados,
 * rotulados e agrupados pela página de origem — pra depois montar a home final
 * combinando os melhores. Cresce por validação.
 */

export default function ComponentesPage() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pb-8 pt-4">
          <p className="text-micro font-semibold tracking-wide text-text-tertiary">ACERVO</p>
          <h1 className="text-h1 text-text-primary">Componentes validados</h1>
          <p className="text-caption text-text-secondary mt-1">
            Os que você aprovou, guardados soltos. Vão virar a home final.
          </p>

          {/* ── Mais · v1 (grid) ── */}
          <Fonte pagina="Mais · v1 (grid)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Nudge do certificado (dark)" origem="Mais · v1">
              <NudgeCertificado />
            </Item>
            <Item titulo="Grid de seção — tiles" origem="Mais · v1">
              <SecaoGrid secao={SECOES[0]} />
            </Item>
          </div>

          {/* ── ref5 · agenda + ticket + blog ── */}
          <Fonte pagina="ref5 · agenda + ticket + blog" />
          <div className="flex flex-col gap-7">
            <Item titulo="Day-strip fiscal + countdown" origem="ref5">
              <DayStripFiscal />
            </Item>
            <Item titulo="DAS ticket (sem barcode, com Pix)" origem="ref5">
              <DasTicket />
            </Item>
            <Item titulo="Stat cards com chip coral" origem="ref5">
              <StatsCoral />
            </Item>
            <Item titulo="Próximas obrigações (por mês)" origem="ref5">
              <ProximasObrigacoes />
            </Item>
            <Item titulo="Blog carousel 'Aprenda com a gente'" origem="ref5">
              <BlogCarousel />
            </Item>
          </div>

          {/* ── ref6 · fintech premium (dark) ── */}
          <Fonte pagina="ref6 · fintech premium (dark)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Hero dark (seletor + número + 4 glass)" origem="ref6">
              <HeroDark boxed />
            </Item>
            <Item titulo="Emitir pra (clientes recentes)" origem="ref6">
              <EmitirPra />
            </Item>
            <Item titulo="Movimentações recentes" origem="ref6">
              <MovimentacoesRecentes />
            </Item>
          </div>

          {/* ── ref7 · saúde (busca + compromissos + promo) ── */}
          <Fonte pagina="ref7 · saúde (busca + promo + compliance)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Saudação + avatar" origem="ref7">
              <Saudacao />
            </Item>
            <Item titulo="Search bar (botão dark)" origem="ref7">
              <SearchServico />
            </Item>
            <Item titulo="Chips de categoria" origem="ref7">
              <CategoriaChips />
            </Item>
            <Item titulo="Card marketing 'Indique e ganhe'" origem="ref7">
              <IndiqueGanhe />
            </Item>
            <Item titulo="Checklist de compliance (Sua situação)" origem="ref7">
              <SuaSituacao />
            </Item>
          </div>

          {/* ── ref9 · wellness (calma + acolhedora) ── */}
          <Fonte pagina="ref9 · wellness (calma + acolhedora)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Próximo compromisso (featured dark)" origem="ref9">
              <ProximoCompromisso />
            </Item>
            <Item titulo="Quem cuida de você (time + avatars)" origem="ref9">
              <QuemCuida />
            </Item>
          </div>

          {/* ── ref11 · AI notes (página inteira aprovada) ── */}
          <Fonte pagina="ref11 · AI notes (página inteira ✓)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Profile row" origem="ref11">
              <ProfileRow />
            </Item>
            <Item titulo="Search bar com mic" origem="ref11">
              <SearchMic />
            </Item>
            <Item titulo="Grid de ações (card ativo)" origem="ref11">
              <AcoesRapidas />
            </Item>
            <Item titulo="Emitir por voz (waveform)" origem="ref11">
              <EmitirPorVoz />
            </Item>
            <Item titulo="Pergunte à IA (IACA)" origem="ref11">
              <PergunteIA />
            </Item>
            <Item titulo="Notas recentes (com tags)" origem="ref11">
              <NotasRecentes />
            </Item>
          </div>

          {/* ── ref12 · health/AI warm (circles + swipe-to-pay) ── */}
          <Fonte pagina="ref12 · health/AI warm (circles + swipe)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Category circles (atalhos redondos)" origem="ref12">
              <CategoryCircles />
            </Item>
            <Item titulo="Promo débito automático" origem="ref12">
              <PromoDebito />
            </Item>
            <Item titulo="Conta do imposto + swipe-to-pay" origem="ref12">
              <ContaSwipe />
            </Item>
          </div>

          {/* ── mais · completa (sem o aviso do WhatsApp, pedido do Pedro) ── */}
          <Fonte pagina="mais · completa (com resumo)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Profile header (avatar + nome + editar)" origem="mais·completa">
              <ProfileHeader />
            </Item>
            <Item titulo="Resumo do negócio" origem="mais·completa">
              <ResumoNegocio />
            </Item>
            <Item titulo="Seção como lista (rows + chevron)" origem="mais·completa">
              <SecaoLista secao={SECOES[0]} />
            </Item>
            <p className="text-micro text-text-tertiary">
              (O nudge do certificado desta página já está salvo em Mais · v1.)
            </p>
          </div>

          {/* ── impostos · v1 (saldo + transações) ── */}
          <Fonte pagina="impostos · v1 (saldo + transações)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Guias recentes (transações com chips)" origem="impostos·v1">
              <GuiasRecentes />
            </Item>
          </div>

          {/* ── impostos · v2 (discover — busca + lista) ── */}
          <Fonte pagina="impostos · v2 (discover)" />
          <div className="flex flex-col gap-7">
            <Item titulo="Suas guias (lista com expandir)" origem="impostos·v2">
              <SuasGuias />
            </Item>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Cabeçalho de grupo: a página de onde os componentes abaixo vieram. */
function Fonte({ pagina }: { pagina: string }) {
  return (
    <div className="mb-3 mt-8 flex items-center gap-2 first:mt-6">
      <span className="h-1.5 w-1.5 rounded-full bg-action-primary" />
      <p className="text-caption font-bold text-text-primary">{pagina}</p>
      <span className="h-px flex-1 bg-border-hairline" />
    </div>
  );
}

/** Bloco de um componente validado: rótulo + origem + o componente renderizado. */
function Item({
  titulo,
  origem,
  children,
}: {
  titulo: string;
  origem: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-caption font-semibold text-text-secondary">{titulo}</p>
        <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-micro text-text-tertiary">
          {origem}
        </span>
      </div>
      {children}
    </div>
  );
}
