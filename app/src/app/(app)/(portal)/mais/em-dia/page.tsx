"use client";

import Link from "next/link";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · VOCÊ ESTÁ EM DIA — painel de conformidade (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * O card "Você está em dia" do hub virou PÁGINA: a prova concreta de que nada
 * está pendente. Não é config — é tranquilidade auditável. Anatomia:
 *   1. Hero escuro = veredito grande + streak (consistência = confiança).
 *   2. Órgãos = onde a empresa é vista (Receita · Prefeitura · Junta), com dot.
 *   3. Obrigações do mês = o que já foi cumprido, com quem cumpriu (a gente).
 *   4. No radar = anuais/futuras, pra mostrar que já está no controle.
 * Tese anti-líder: "a gente cuida, você não precisa lembrar" — sem loop aberto.
 *
 * ⚠️ Dados = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Estado = "feito" | "no-prazo";

const ORGAOS = [
  { nome: "Receita Federal", situacao: "Ativa e regular" },
  { nome: "Prefeitura de BH · ISS", situacao: "Regular" },
  { nome: "JUCEMG · Junta Comercial", situacao: "Regular" },
];

const OBRIGACOES_MES: { nome: string; quem: string; estado: Estado; quando: string }[] = [
  { nome: "DAS · imposto do Simples", quem: "Pago por você, guia gerada pela gente", estado: "feito", quando: "20/06" },
  { nome: "INSS do pró-labore", quem: "Guia gerada e paga", estado: "feito", quando: "20/06" },
  { nome: "PGDAS-D · apuração do mês", quem: "Entregue pela gente à Receita", estado: "feito", quando: "15/06" },
];

const RADAR: { nome: string; desc: string; prazo: string }[] = [
  { nome: "DEFIS · declaração anual", desc: "A gente entrega, com base no seu ano.", prazo: "até maio/2027" },
  { nome: "Certificado digital", desc: "Renovamos bem antes de vencer.", prazo: "vence 12/2027" },
];

export default function EmDiaPage() {
  return (
    <>
      <TelaHeader meta="Contabilidade · Situação" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* 1. Hero — veredito + streak */}
            <div className="overflow-hidden rounded-2xl bg-surface-dark p-5 text-text-on-dark">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
                  <IconeCheckGrande />
                </span>
                <div className="min-w-0">
                  <p className="text-h2 font-bold">Tudo em dia</p>
                  <p className="text-caption text-text-on-dark/70">
                    Nenhuma pendência com a Receita, a Prefeitura ou a Junta.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
                <span className="text-state-success">
                  <IconeChama />
                </span>
                <p className="text-caption text-text-on-dark/90">
                  <span className="font-bold text-text-on-dark">6 meses seguidos</span>{" "}
                  sem nenhum atraso.
                </p>
              </div>
            </div>

            {/* 2. Órgãos */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Onde sua empresa é vista
              </p>
              <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                {ORGAOS.map((o, i) => (
                  <div
                    key={o.nome}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i > 0 ? "border-t border-border-hairline" : ""
                    }`}
                  >
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-state-success opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-state-success" />
                    </span>
                    <p className="min-w-0 flex-1 text-caption font-semibold text-text-primary">
                      {o.nome}
                    </p>
                    <p className="shrink-0 text-micro font-semibold text-state-success-text">
                      {o.situacao}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Obrigações do mês */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Cumprido neste mês
              </p>
              <div className="flex flex-col gap-2">
                {OBRIGACOES_MES.map((o) => (
                  <div
                    key={o.nome}
                    className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                      <IconeCheckMini />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-caption font-semibold text-text-primary">
                        {o.nome}
                      </p>
                      <p className="truncate text-micro text-text-tertiary">{o.quem}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-state-success-tint px-2 py-0.5 text-micro font-semibold text-state-success-text">
                      {o.quando}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. No radar (anuais/futuras) */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                No radar
              </p>
              <div className="flex flex-col gap-2">
                {RADAR.map((r) => (
                  <div
                    key={r.nome}
                    className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
                      <IconeRelogio />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-caption font-semibold text-text-primary">
                        {r.nome}
                      </p>
                      <p className="truncate text-micro text-text-tertiary">{r.desc}</p>
                    </div>
                    <span className="shrink-0 text-micro font-medium text-text-tertiary">
                      {r.prazo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé de tranquilidade */}
            <div className="flex items-center gap-3 rounded-2xl bg-surface-tint-brand p-4">
              <span className="shrink-0 text-action-primary-sm">
                <IconeEscudo />
              </span>
              <p className="text-caption text-text-secondary">
                Quem acompanha tudo isso é a gente. Se algo sair da linha, você é
                o primeiro a saber, no WhatsApp.{" "}
                <Link
                  href="/mais"
                  className="font-semibold text-action-primary-sm"
                >
                  Falar com meu contador
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeCheckGrande() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeCheckMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeChama() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c1 3-1 4-1 6a2 2 0 0 0 4 0c0-.6-.2-1.2-.4-1.7C16.5 8 18 10.5 18 13.5A6 6 0 0 1 6 13.5c0-2.4 1.2-4 2.5-5.3C9.7 7 11 5.5 12 2z" />
    </svg>
  );
}
function IconeRelogio() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconeEscudo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
