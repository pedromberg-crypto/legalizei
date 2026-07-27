"use client";

import Link from "next/link";
import { useState } from "react";
import { PillCnpj, AprendaGradiente } from "@/components/lab/campea-blocks";
import { QuemCuida } from "@/components/lab/ref9-blocks";
import { Confetti } from "@/components/confetti";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOME · DIA-1 (ativação) — o 2º estado da home (27/07). → [[cruzamento-portal]]
 * ═══════════════════════════════════════════════════════════════════════════
 * A home NÃO é a mesma no dia-1 e em regime (decisão do cruzamento + auto-
 * auditoria): empresa recém-nascida tem faturamento 0 e Fator R projetado, então
 * o diferencial (vigília/monitoramento) ainda não tem o que vigiar. O que ela
 * precisa é ATIVAR. Por isso a home dia-1 é uma TRILHA DE ATIVAÇÃO:
 *   1. Celebra o nascimento do CNPJ (confetti da marca, eco do aceite do gate).
 *   2. Checklist com progresso: o certificado é o gate universal (destrava
 *      emitir + impostos) → é o passo "agora".
 *   3. Tranquiliza: o 1º imposto só chega quando faturar. Sem pressa, sem susto.
 *   4. Aprenda (blog) + Quem cuida (canal humano) — reuso dos campeões.
 *
 * A transição dia-1 → regime é data-driven no real (faturou / certificado ok).
 * ⚠️ Farol/mock. Reusa PillCnpj · AprendaGradiente · QuemCuida · Confetti.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Estado = "feito" | "agora" | "depois" | "final";
type Passo = {
  id: string;
  estado: Estado;
  titulo: string;
  sub: string;
  href?: string;
  status?: string;
};

const PASSOS: Passo[] = [
  {
    id: "cnpj",
    estado: "feito",
    titulo: "CNPJ aberto",
    sub: "Sua empresa já está ativa na Receita Federal.",
  },
  {
    id: "certificado",
    estado: "agora",
    titulo: "Validação do certificado digital",
    sub: "Nossa certificadora parceira vai te chamar pra agendar a videochamada de validação. A gente conduz, você só participa.",
    status: "Em andamento",
  },
  {
    id: "dados",
    estado: "depois",
    titulo: "Conferir os dados da empresa",
    sub: "Dê uma olhada se está tudo certo no seu cadastro.",
    href: "/mais/empresa",
  },
  {
    id: "acesso",
    estado: "final",
    titulo: "Acesso completo ao app",
    sub: "Assim que os dados forem conferidos, tudo se abre: emitir nota, impostos, relatórios e mais.",
  },
];

// Só as 3 primeiras contam como TAREFAS; a última é a recompensa (liberação).
const TAREFAS = PASSOS.filter((p) => p.estado !== "final");
const FEITOS = TAREFAS.filter((p) => p.estado === "feito").length;
const PCT = Math.round((FEITOS / TAREFAS.length) * 100);

export default function HomeDia1Page() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(24px+var(--safe-bottom))] pt-3">
          {/* 1. Header — sem navbar nesta tela (validação): a pessoa não navega
              livre até liberar o acesso. Avatar DESATIVADO; sino segue ativo. */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-caption text-text-secondary">Bem-vinda, Ana</p>
              <h1 className="text-h1 leading-tight text-text-primary">
                Vamos ativar
                <br />
                sua empresa
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/avisos"
                aria-label="Ver avisos"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary transition-colors hover:border-border-strong active:bg-surface-alt"
              >
                <IconeSino />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-surface-page bg-action-primary" />
              </Link>
              {/* Perfil desativado durante a validação */}
              <span
                aria-disabled
                title="Disponível quando sua empresa estiver ativada"
                className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full bg-surface-dark/50 text-caption font-bold text-text-on-dark/50"
              >
                AB
              </span>
            </div>
          </div>

          {/* 2. Hero — nascimento (confetti da marca) */}
          <HeroNascimento />

          {/* 3. Trilha de ativação (o herói funcional) */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">
                Sua ativação
              </p>
              <span className="text-caption font-semibold text-text-secondary">
                {FEITOS} de {TAREFAS.length}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-action-primary transition-all"
                style={{ width: `${PCT}%` }}
              />
            </div>
            <p className="mt-1.5 text-micro text-text-tertiary">
              A parceira vai te chamar pra validar o certificado. Terminou de
              conferir os dados? Seu app abre por completo.
            </p>

            <div className="mt-4">
              {PASSOS.map((p, i) => (
                <PassoItem key={p.id} p={p} n={i + 1} ultimo={i === PASSOS.length - 1} />
              ))}
            </div>
          </div>

          {/* 4. O que vem por aí — tranquilidade */}
          <div className="flex gap-3 rounded-2xl bg-surface-tint-brand p-4">
            <span className="mt-0.5 shrink-0 text-action-primary-sm">
              <IconeRelogio />
            </span>
            <div>
              <p className="text-caption font-semibold text-text-primary">
                Sem pressa com imposto agora
              </p>
              <p className="mt-0.5 text-micro text-text-secondary">
                Seu primeiro DAS só chega quando você faturar. A gente calcula,
                gera a guia e te avisa. Você não precisa lembrar de nada.
              </p>
            </div>
          </div>

          {/* 5. Aprenda com a gente (reuso) */}
          <AprendaGradiente />

          {/* 6. Quem cuida (reuso) */}
          <QuemCuida />
        </div>
      </div>
    </main>
  );
}

/* ─── Hero de nascimento ───────────────────────────────────────────────────── */
function HeroNascimento() {
  const [festa, setFesta] = useState(true);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-5 text-text-on-dark">
      {festa && <Confetti onDone={() => setFesta(false)} />}
      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
          <IconeFaisca />
        </span>
        <p className="mt-3 text-h2 font-bold leading-tight">
          Sua empresa nasceu.
        </p>
        <p className="mt-1 text-caption text-text-on-dark/70">
          Ativa há 3 dias. Agora é deixar tudo pronto pra você faturar.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <PillCnpj />
          {/* já dá pra baixar o Cartão CNPJ (útil pra abrir conta PJ etc.) */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-border-hairline bg-surface-card px-3 py-1.5 text-caption font-medium text-text-secondary transition-colors active:bg-surface-alt"
          >
            <IconeDownload />
            Cartão CNPJ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Item da trilha (timeline) ────────────────────────────────────────────── */
function PassoItem({ p, n, ultimo }: { p: Passo; n: number; ultimo: boolean }) {
  const conteudo = (
    <div className="flex gap-3">
      {/* coluna do nó + linha */}
      <div className="flex flex-col items-center">
        <Node estado={p.estado} n={n} />
        {!ultimo && <div className="my-1 w-0.5 flex-1 rounded-full bg-border-hairline" />}
      </div>
      {/* conteúdo */}
      <div className={`flex-1 ${ultimo ? "" : "pb-5"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`text-caption font-semibold ${
                p.estado === "feito" || p.estado === "agora"
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {p.titulo}
            </p>
            <p className="mt-0.5 text-micro text-text-tertiary">{p.sub}</p>
          </div>
          {p.estado === "agora" && p.status && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-state-info-text" />
              {p.status}
            </span>
          )}
          {p.estado === "feito" && (
            <span className="shrink-0 text-micro font-semibold text-state-success-text">
              Feito
            </span>
          )}
          {p.estado === "depois" && p.href && (
            <span className="shrink-0 text-text-tertiary">
              <IconeChevron />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return p.href ? (
    <Link
      href={p.href}
      className="block rounded-xl transition-colors active:bg-surface-alt"
    >
      {conteudo}
    </Link>
  ) : (
    conteudo
  );
}

function Node({ estado, n }: { estado: Estado; n: number }) {
  if (estado === "feito") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
        <IconeCheck />
      </span>
    );
  }
  if (estado === "agora") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand ring-4 ring-action-primary/20">
        <IconeFaisca sm />
      </span>
    );
  }
  if (estado === "final") {
    // O "número 4" virou o prêmio: liberação de acesso ao app inteiro.
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
        <IconeCadeadoAberto />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-micro font-bold text-text-tertiary">
      {n}
    </span>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeFaisca({ sm = false }: { sm?: boolean }) {
  const s = sm ? 15 : 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c.6 3.5 2 4.9 5.5 5.5C14 8.1 12.6 9.5 12 13c-.6-3.5-2-4.9-5.5-5.5C10 6.9 11.4 5.5 12 2z" />
      <path d="M18.5 13c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z" />
    </svg>
  );
}
function IconeSino() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeRelogio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M8 11l4 4 4-4" />
      <path d="M5 20h14" />
    </svg>
  );
}
function IconeCadeadoAberto() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </svg>
  );
}
function IconeChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
