"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rodape } from "@/components/ui/tela";
import { PillCnpj } from "@/components/lab/campea-blocks";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERFIL — o CURRÍCULO da empresa. Drill-down (sem navbar; o back assume).
 * ═══════════════════════════════════════════════════════════════════════════
 * Identidade + track record + credenciais fiscais (o "currículo" do print).
 *
 * ─── REORG (Pedro, 24/07) ───────────────────────────────────────────────────
 * As abas Empresa · Sócios · Documentos migraram pra aba MAIS (o hub), pra não
 * duplicar. Sobrou só a CONTA — e como é só ela, sem abas: rola normal, logo
 * abaixo das credenciais. O topo (identidade/stats/credenciais) fica igual.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PESSOA = {
  iniciais: "AB",
  nome: "Ana Beatriz",
  razao: "Ana Beatriz Ramos Desenvolvimento de Software",
};

export default function PerfilPage() {
  return (
    <>
      {/* 1. Topo: voltar + config. */}
      <header className="flex items-center justify-between pb-4 pt-6">
        <Link
          href="/home-campea"
          aria-label="Voltar"
          className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <SetaVoltar />
        </Link>
        <button
          type="button"
          aria-label="Configurações"
          className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <Engrenagem />
        </button>
      </header>

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-4">
            {/* 2. Identidade */}
            <div className="flex flex-col items-center text-center">
              {/* Avatar com lápis: troca por foto da pessoa ou logo da empresa. */}
              <button
                type="button"
                aria-label="Trocar foto ou logo"
                className="relative"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-dark text-h2 font-bold text-text-on-dark">
                  {PESSOA.iniciais}
                </span>
                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-page bg-action-primary text-text-on-brand">
                  <Lapis />
                </span>
              </button>
              <p className="mt-3 text-h1 text-text-primary">{PESSOA.nome}</p>
              <p className="mt-1 text-caption text-text-secondary">{PESSOA.razao}</p>
              <span className="mt-3 flex items-center gap-1.5 rounded-full bg-state-success-tint px-3 py-1.5 text-micro font-semibold text-state-success-text">
                <Check />
                Ativa e em dia
              </span>
              <div className="mt-3">
                <PillCnpj />
              </div>
            </div>

            {/* 4. Track record da EMPRESA */}
            <div className="grid grid-cols-3 gap-2">
              <Stat valor="4 meses" rotulo="De CNPJ" />
              <Stat valor="12" rotulo="Notas emitidas" />
              <Stat valor="R$ 38,4 mil" rotulo="Faturado em 12m" />
            </div>

            {/* 5. Credenciais — o currículo fiscal */}
            <div className="flex flex-col gap-2">
              <Credencial
                Icone={IconePercent}
                titulo="Simples Nacional · Anexo III"
                sub="Sua alíquota hoje é 6%"
              />
              <Credencial
                Icone={IconeMala}
                titulo="7319-0/04"
                sub="Marketing e publicidade · atividade principal"
              />
              <Credencial
                Icone={Check}
                titulo="Ativa na Receita Federal"
                sub="Situação cadastral regular"
              />
              <Credencial
                Icone={IconeEscudo}
                titulo="Certificado digital"
                sub="Válido até 12/2027"
              />
            </div>

            {/* 6. Conta — antes era aba; agora corrido (empresa/sócios/docs = Mais) */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Conta
              </p>
              <AbaConta />
            </div>
          </div>
        </div>
      </main>

      {/* 7. CTA — o perfil é LEITURA; a ação que sobra é humana. */}
      <Rodape>
        <Button variant="dark" full>
          Falar com meu contador
        </Button>
      </Rodape>
    </>
  );
}

/* ─── Conta ────────────────────────────────────────────────────────────────── */
function AbaConta() {
  const ITENS = [
    { nome: "E-mail", sub: "ana@beatrizstudio.com.br" },
    { nome: "Telefone", sub: "(31) 9 9999-0000" },
    { nome: "Senha", sub: "Alterada há 3 meses" },
    { nome: "Notificações", sub: "WhatsApp e e-mail" },
    { nome: "Acesso do 2º sócio", sub: "Nenhum convite ativo" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {ITENS.map((i) => (
        <button key={i.nome} type="button" className="text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3">
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">{i.nome}</p>
              <p className="text-micro text-text-tertiary mt-0.5">{i.sub}</p>
            </div>
            <Chevron />
          </div>
        </button>
      ))}
      <button type="button" className="mt-2 text-left">
        <p className="text-caption font-semibold text-state-danger-text">Sair da conta</p>
      </button>
    </div>
  );
}

/* ─── auxiliares ───────────────────────────────────────────────────────────── */
function Stat({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-3 text-center">
      <p className="text-body-strong font-bold text-text-primary">{valor}</p>
      <p className="text-micro text-text-tertiary mt-0.5">{rotulo}</p>
    </div>
  );
}

function Credencial({
  Icone,
  titulo,
  sub,
}: {
  Icone: () => ReactNode;
  titulo: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-text-secondary">
        <Icone />
      </span>
      <div className="min-w-0">
        <p className="text-caption font-semibold text-text-primary">{titulo}</p>
        <p className="text-micro text-text-tertiary">{sub}</p>
      </div>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function SetaVoltar() {
  return <svg {...ic()} width={20} height={20}><path d="m15 18-6-6 6-6" /></svg>;
}
function Engrenagem() {
  return (
    <svg {...ic()} width={20} height={20}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.36.44.63.8.75H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function Check() {
  return <svg {...ic()} width={14} height={14} strokeWidth={2.5}><path d="m5 12 4.5 4.5L19 7" /></svg>;
}
function Lapis() {
  return <svg {...ic()} width={13} height={13}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
}
function IconePercent() {
  return <svg {...ic()}><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
}
function IconeMala() {
  return <svg {...ic()}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function IconeEscudo() {
  return <svg {...ic()}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>;
}
function Chevron() {
  return (
    <svg {...ic()} className="shrink-0 text-text-tertiary">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
