"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SecaoLista, SECOES } from "@/components/lab/mais-shell";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · aba do portal (hub) — construída 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * O 4º tab: a gaveta do que não é rotina diária. Ordem por PRATICIDADE:
 *   1. Você (header → Perfil/Empresa).
 *   2. Seu plano — a assinatura (e onde o débito automático mora, como benefício).
 *   3. Serviços avulsos — a camada à-la-carte (monetização: CND, declaração,
 *      alteração, reemissão). Carrossel com peek, igual aos impostos.
 *   4. Atalhos por seção (Empresa · Contabilidade) — componentes reusados.
 *   5. Fale com a gente — WhatsApp humano (nossa tese).
 *   6. Conta (notificações · indicar · sair).
 *
 * É ABA (raiz) → navbar flutuante; pb (100px+safe) limpa a barra.
 * ⚠️ Preços = FAROL/FAKE (preço deferido ao Mauro/custo real).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const USUARIO = { nome: "Ana Beatriz Ramos", email: "anabeatriz@gmail.com", ini: "AB" };

const PLANO = {
  nome: "Legalizai Mensal",
  preco: "R$ 149", // FAKE — preço deferido
  proxima: "05/08",
  cartao: "final 6411",
};

type Servico = { label: string; preco: string; Icone: () => ReactNode; popular?: boolean };
const SERVICOS: Servico[] = [
  { label: "Certidão negativa (CND)", preco: "R$ 35,90", Icone: IconeDoc, popular: true },
  { label: "Declaração de faturamento", preco: "R$ 40,00", Icone: IconeDoc, popular: true },
  { label: "Recálculo de guia", preco: "R$ 15,90", Icone: IconeRefresh, popular: true },
];

export default function MaisPage() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-6">
          {/* 1. Você → Perfil/Empresa */}
          <Link
            href="/perfil"
            className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 transition-colors hover:border-border-strong active:bg-surface-alt"
          >
            <span className="relative shrink-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark text-body font-bold text-text-on-dark">
                {USUARIO.ini}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-surface-card bg-state-success" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-text-primary">{USUARIO.nome}</p>
              <p className="truncate text-caption text-text-tertiary">
                Sua conta · e-mail, senha e notificações
              </p>
            </div>
            <span className="shrink-0 text-text-tertiary">
              <IconeChevron />
            </span>
          </Link>

          {/* 2. Seu plano */}
          <PlanoCard />

          {/* 3. Serviços avulsos (à-la-carte) — curado + "Ver todos" na loja */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">
                Precisa de algo mais?
              </p>
              <Link
                href="/mais/servicos"
                className="text-caption font-semibold text-action-primary-sm"
              >
                Ver todos
              </Link>
            </div>
            <p className="mb-2 mt-0.5 text-caption text-text-secondary">
              Os mais pedidos. Sem cobrança na hora, cai na próxima fatura.
            </p>
            <div className="-mx-6 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-pl-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SERVICOS.map((s) => (
                <ServicoCard key={s.label} s={s} />
              ))}
            </div>
          </div>

          {/* 4. Atalhos por seção (reusados) */}
          <SecaoLista secao={SECOES[0]} />
          <SecaoLista secao={SECOES[1]} />

          {/* 5. Fale com a gente — canal humano */}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7f9ee] text-[#25D366]">
              <IconeWhats />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">
                Fale com a gente
              </p>
              <p className="text-micro text-text-tertiary">
                Um contador de verdade no WhatsApp, sempre.
              </p>
            </div>
            <span className="shrink-0 text-text-tertiary">
              <IconeChevron />
            </span>
          </button>

          {/* 6. Conta */}
          <SecaoLista secao={SECOES[2]} />

          <p className="text-center text-micro text-text-muted">
            Legalizai · versão 0.1 (protótipo)
          </p>
        </div>
      </div>
    </main>
  );
}

/* ─── Card do plano/assinatura ─────────────────────────────────────────────── */
function PlanoCard() {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-micro text-text-tertiary">Seu plano</p>
          <p className="text-body-strong font-semibold text-text-primary">
            {PLANO.nome}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
          Ativo
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <p className="text-h2 font-bold text-text-primary">{PLANO.preco}</p>
        <p className="text-caption text-text-tertiary">/mês</p>
      </div>
      <p className="mt-0.5 text-micro text-text-tertiary">
        Próxima cobrança em {PLANO.proxima} · cartão {PLANO.cartao}
      </p>

      <div className="mt-3 border-t border-border-hairline pt-3">
        <p className="mb-1.5 text-micro text-text-tertiary">Incluso no seu plano</p>
        <div className="flex flex-col gap-1.5">
          <Beneficio>Contador humano no WhatsApp</Beneficio>
          <Beneficio>Impostos calculados e no prazo</Beneficio>
          <Beneficio>Débito automático do DAS</Beneficio>
        </div>
      </div>

      <Link
        href="/mais/plano"
        className="mt-3 inline-block text-caption font-semibold text-action-primary-sm"
      >
        Gerenciar plano
      </Link>
    </div>
  );
}

function Beneficio({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-state-success-text">
        <IconeCheck />
      </span>
      <span className="text-caption text-text-secondary">{children}</span>
    </div>
  );
}

/* ─── Card de serviço avulso (item do carrossel) ───────────────────────────── */
function ServicoCard({ s }: { s: Servico }) {
  return (
    <div className="w-[62%] shrink-0 snap-start">
      <Link
        href="/mais/servicos"
        className="flex h-full w-full flex-col rounded-2xl border border-border-hairline bg-surface-card p-4 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
            <s.Icone />
          </span>
          {s.popular && (
            <span className="shrink-0 rounded-full bg-surface-tint-brand px-1.5 py-0.5 text-[10px] font-bold text-action-primary-sm">
              ★ Mais pedido
            </span>
          )}
        </div>
        <span className="mt-3 flex-1 text-caption font-semibold text-text-primary">
          {s.label}
        </span>
        <span className="mt-2 text-micro text-text-tertiary">{s.preco}</span>
      </Link>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h5" />
    </svg>
  );
}
function IconeRefresh() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
function IconeWhats() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c.6.3 1.1.4 1.5.5a3.4 3.4 0 0 0 1.5.1c.5-.1 1.4-.6 1.6-1.1a2 2 0 0 0 .1-1.1c0-.2-.2-.2-.4-.3z" />
    </svg>
  );
}
