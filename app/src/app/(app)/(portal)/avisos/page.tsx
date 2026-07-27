"use client";

import { useState, type ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AVISOS — a central de notificações (27/07). Do sino (bell) da home.
 * ═══════════════════════════════════════════════════════════════════════════
 * Onde a tese "a gente te avisa ANTES da dor" (a vigília, a lição da cobaia)
 * aterrissa como histórico. Cada aviso tem TIPO (define ícone + cor de estado),
 * um texto humano e um horário. Não-lidos têm dot coral; "marcar todas como
 * lidas" limpa. É drill-down (sem navbar; o back assume).
 *
 * ⚠️ Conteúdo = FAROL/mock. No real vem do motor de eventos (telemetria + fisco).
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Tipo = "fiscal" | "imposto" | "nota" | "nota-erro" | "servico" | "declaracao" | "novidade";

type Aviso = {
  id: string;
  tipo: Tipo;
  titulo: string;
  desc: string;
  quando: string;
  grupo: "Novos" | "Esta semana" | "Antes";
  novoInicial: boolean;
};

const AVISOS: Aviso[] = [
  {
    id: "v1",
    tipo: "fiscal",
    titulo: "De olho no seu Fator R",
    desc: "Se você voltar a faturar cheio, a alíquota pode subir pra 15,5%. Ainda dá tempo de ajustar o pró-labore.",
    quando: "Hoje, 09:12",
    grupo: "Novos",
    novoInicial: true,
  },
  {
    id: "v2",
    tipo: "imposto",
    titulo: "Seu DAS de junho está pronto",
    desc: "R$ 178,31, vence em 20/07. A gente já gerou a guia pra você.",
    quando: "Hoje, 08:00",
    grupo: "Novos",
    novoInicial: true,
  },
  {
    id: "v3",
    tipo: "servico",
    titulo: "Sua CND ficou pronta",
    desc: "A certidão negativa que você pediu já está em Documentos, pronta pra baixar.",
    quando: "Ontem, 16:40",
    grupo: "Esta semana",
    novoInicial: true,
  },
  {
    id: "v4",
    tipo: "nota",
    titulo: "Nota emitida com sucesso",
    desc: "NF-e de R$ 1.200 pra Studio Vermelho foi aceita pela prefeitura.",
    quando: "Seg, 14:22",
    grupo: "Esta semana",
    novoInicial: false,
  },
  {
    id: "v5",
    tipo: "declaracao",
    titulo: "PGDAS-D de junho entregue",
    desc: "A apuração do mês foi enviada à Receita. Comprovante guardado.",
    quando: "15/06",
    grupo: "Antes",
    novoInicial: false,
  },
  {
    id: "v6",
    tipo: "nota-erro",
    titulo: "Uma nota foi recusada",
    desc: "A prefeitura recusou a NF-e de R$ 800. A gente já corrigiu e reemitiu por você.",
    quando: "12/06",
    grupo: "Antes",
    novoInicial: false,
  },
  {
    id: "v7",
    tipo: "novidade",
    titulo: "Novidade: relatórios em português",
    desc: "Agora você vê quanto entrou, saiu e sobrou, sem jargão de contador. Dá uma olhada em Mais.",
    quando: "10/06",
    grupo: "Antes",
    novoInicial: false,
  },
];

const GRUPOS: Aviso["grupo"][] = ["Novos", "Esta semana", "Antes"];

export default function AvisosPage() {
  const [lidas, setLidas] = useState<Set<string>>(
    () => new Set(AVISOS.filter((a) => !a.novoInicial).map((a) => a.id)),
  );

  const naoLidas = AVISOS.filter((a) => !lidas.has(a.id)).length;

  const marcarUma = (id: string) =>
    setLidas((s) => (s.has(id) ? s : new Set(s).add(id)));
  const marcarTodas = () => setLidas(new Set(AVISOS.map((a) => a.id)));

  return (
    <>
      <TelaHeader meta="Avisos" voltar="/home-campea" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-h1 text-text-primary">Avisos</h1>
                <p className="mt-1 text-body text-text-secondary">
                  {naoLidas > 0
                    ? `Você tem ${naoLidas} aviso${naoLidas > 1 ? "s" : ""} novo${naoLidas > 1 ? "s" : ""}.`
                    : "Tudo em dia. Nenhum aviso novo."}
                </p>
              </div>
              {naoLidas > 0 && (
                <button
                  type="button"
                  onClick={marcarTodas}
                  className="shrink-0 pb-0.5 text-caption font-semibold text-action-primary-sm transition-opacity hover:opacity-80"
                >
                  Marcar lidas
                </button>
              )}
            </div>

            {/* Grupos */}
            {GRUPOS.map((g) => {
              const itens = AVISOS.filter((a) => a.grupo === g);
              if (itens.length === 0) return null;
              return (
                <div key={g}>
                  <p className="mb-2 text-micro text-text-tertiary">{g}</p>
                  <div className="flex flex-col gap-2">
                    {itens.map((a) => (
                      <AvisoCard
                        key={a.id}
                        aviso={a}
                        lida={lidas.has(a.id)}
                        onLer={() => marcarUma(a.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <p className="pt-1 text-center text-micro text-text-muted">
              É só isso. A gente avisa aqui e no WhatsApp quando algo pedir você.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Card de aviso ────────────────────────────────────────────────────────── */
const ESTILO: Record<Tipo, { tint: string; Icone: () => ReactNode }> = {
  fiscal: { tint: "bg-surface-tint-brand text-action-primary-sm", Icone: IconeOlho },
  imposto: { tint: "bg-state-warning-tint text-state-warning-text", Icone: IconeGuia },
  nota: { tint: "bg-state-success-tint text-state-success-text", Icone: IconeNota },
  "nota-erro": { tint: "bg-state-danger-tint text-state-danger-text", Icone: IconeAlerta },
  servico: { tint: "bg-surface-tint-brand text-action-primary-sm", Icone: IconeDoc },
  declaracao: { tint: "bg-state-info-tint text-state-info-text", Icone: IconeCheckDoc },
  novidade: { tint: "bg-surface-alt text-text-secondary", Icone: IconeRaio },
};

function AvisoCard({
  aviso,
  lida,
  onLer,
}: {
  aviso: Aviso;
  lida: boolean;
  onLer: () => void;
}) {
  const e = ESTILO[aviso.tipo];
  return (
    <button
      type="button"
      onClick={onLer}
      className={`flex gap-3 rounded-2xl border p-3.5 text-left transition-colors active:bg-surface-alt ${
        lida
          ? "border-border-hairline bg-surface-card"
          : "border-border-hairline bg-surface-tint-brand/40"
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${e.tint}`}>
        <e.Icone />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-caption font-semibold text-text-primary">
            {aviso.titulo}
          </p>
          {!lida && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-action-primary" aria-label="Não lido" />
          )}
        </div>
        <p className="mt-0.5 text-micro text-text-secondary">{aviso.desc}</p>
        <p className="mt-1 text-micro text-text-tertiary">{aviso.quando}</p>
      </div>
    </button>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconeOlho(): ReactNode {
  return <svg {...ic()}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconeGuia(): ReactNode {
  return <svg {...ic()}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h6M7 13h10M7 16h4" /></svg>;
}
function IconeNota(): ReactNode {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="m9.5 14 1.5 1.5 3-3" /></svg>;
}
function IconeAlerta(): ReactNode {
  return <svg {...ic()}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17v.01" /></svg>;
}
function IconeDoc(): ReactNode {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeCheckDoc(): ReactNode {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="m9.5 15 1.5 1.5 3-3" /></svg>;
}
function IconeRaio(): ReactNode {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" /></svg>;
}
