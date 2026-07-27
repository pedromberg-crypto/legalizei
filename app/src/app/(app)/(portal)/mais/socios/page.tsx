"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · SÓCIOS — o quadro societário (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * Quem é dono, quanto tem, quem administra. No mock a Ana é sócia única (SLU),
 * 100%, administradora. Entrar/sair sócio ou mudar % é ALTERAÇÃO CONTRATUAL
 * (JUCEMG + contrato) — serviço à parte, cotado antes. O produto suporta até 2
 * sócios; a página é honesta sobre o custo em vez de esconder atrás de um "+".
 *
 * ⚠️ Dados = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Socio = {
  nome: string;
  ini: string;
  cpf: string;
  papel: string;
  participacao: string;
  prolabore: string;
  admin: boolean;
};

const SOCIOS: Socio[] = [
  {
    nome: "Ana Beatriz Ramos",
    ini: "AB",
    cpf: "•••.456.789-••",
    papel: "Sócia-administradora",
    participacao: "100%",
    prolabore: "R$ 932,00 / mês",
    admin: true,
  },
];

export default function SociosPage() {
  return (
    <>
      <TelaHeader meta="Sua empresa · Sócios" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Sócios</h1>
              <p className="mt-1 text-body text-text-secondary">
                Quem é dono da empresa e como o quadro está registrado.
              </p>
            </div>

            {/* Lista de sócios */}
            <div className="flex flex-col gap-3">
              {SOCIOS.map((s) => (
                <SocioCard key={s.cpf} s={s} />
              ))}
            </div>

            {/* Honestidade: adicionar sócio = alteração contratual paga */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Vai entrar um sócio novo?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                Adicionar, tirar ou mudar a participação de um sócio é alteração
                contratual, registrada na Junta. A gente cota antes de fazer. O
                seu plano comporta até 2 sócios.
              </p>
              <Link
                href="/mais/servicos?abrir=socio"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Adicionar sócio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Card de sócio ────────────────────────────────────────────────────────── */
function SocioCard({ s }: { s: Socio }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-dark text-body font-bold text-text-on-dark">
          {s.ini}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold text-text-primary">
            {s.nome}
          </p>
          <p className="text-micro text-text-tertiary">
            {s.papel} · CPF {s.cpf}
          </p>
        </div>
        {s.admin && (
          <span className="shrink-0 rounded-full bg-surface-tint-brand px-2.5 py-1 text-micro font-semibold text-action-primary-sm">
            Administra
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border-hairline pt-3">
        <Dado rotulo="Participação" valor={s.participacao} />
        <Dado rotulo="Pró-labore" valor={s.prolabore} />
      </div>
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div>
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="mt-0.5 text-caption font-semibold text-text-primary">{valor}</p>
    </div>
  );
}
