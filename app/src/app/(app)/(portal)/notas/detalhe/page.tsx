"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIcon } from "@/components/ui/status";
import { EnviarSheet } from "./enviar-sheet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTAS · P7 — detalhe/visualizador da NF · drill-down (sem navbar) · 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * Varia por STATUS (via ?s=emitida|emitindo|recusada|cancelada; default emitida):
 *   · emitida  → resumo humanizado + VISUALIZADOR do documento (preview → tela
 *     cheia) + timeline + ações (baixar/enviar/cancelar-se-na-janela).
 *   · emitindo → "processando na prefeitura, te avisamos"; sem documento/baixar.
 *   · recusada → MOTIVO + "Corrigir e reenviar" (o "resolver" que a P5 promete).
 *   · cancelada→ info do cancelamento; documento ainda consultável; sem cancelar.
 *
 * O resumo humanizado é a visão padrão (tese do produto: sem o DANFE cru na
 * cara); o documento completo fica a 1 toque. Imposto não aparece por-nota
 * (Simples = DAS mensal) — vive na aba Impostos.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Status = "emitida" | "emitindo" | "recusada" | "cancelada";

const NOTA = {
  numero: "000138",
  serie: "1",
  emitidaEm: "22/07/2026 às 14h32",
  canceladaEm: "23/07/2026 às 09h10",
  emitente: "Ana Beatriz Ramos Desenv. de Software",
  emitenteDoc: "CNPJ 54.321.000/0001-09",
  tomador: "TechFlow Software Ltda",
  tomadorDoc: "CNPJ 98.765.432/0001-10",
  tomadorCidade: "Contagem/MG",
  clienteId: "tf", // mapeia o tomador → favorecido salvo (pro pré-preenchimento)
  servico: "Marketing e publicidade",
  servicoMeta: "CNAE 7319-0/04 · Serviço 17.06",
  descricao: "Gestão de campanhas e criação de conteúdo, competência julho/2026.",
  valor: 180000,
  verificacao: "A1B2 · C3D4 · E5F6 · 7G8H",
  motivoRecusa:
    "O CNPJ do tomador está com dado divergente na Receita. Confira o número e reemita.",
  motivoCancelamento: "Cancelada a pedido: serviço não realizado.",
};

const CFG: Record<
  Status,
  { titulo: string; sub: string; temDoc: boolean; tint: string; fg: string }
> = {
  emitida: {
    titulo: "Nota emitida",
    sub: `Emitida em ${NOTA.emitidaEm}`,
    temDoc: true,
    tint: "bg-state-success-tint",
    fg: "text-state-success-text",
  },
  emitindo: {
    titulo: "Em emissão",
    sub: "A prefeitura está processando. A gente te avisa quando ficar pronta, pode fechar o app.",
    temDoc: false,
    tint: "bg-state-info-tint",
    fg: "text-state-info-text",
  },
  recusada: {
    titulo: "Nota recusada",
    sub: "A prefeitura não aceitou. Veja o motivo e corrija pra reemitir.",
    temDoc: false,
    tint: "bg-state-danger-tint",
    fg: "text-state-danger-text",
  },
  cancelada: {
    titulo: "Nota cancelada",
    sub: `Cancelada em ${NOTA.canceladaEm}`,
    temDoc: true,
    tint: "bg-surface-alt",
    fg: "text-text-tertiary",
  },
};

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// No De→Para a coluna é estreita: tira o prefixo pra o número caber em 1 linha.
function soNumero(doc: string): string {
  return doc.replace(/^(CNPJ|CPF)\s+/, "");
}

export default function NotaDetalhePage() {
  return (
    <Suspense fallback={null}>
      <NotaDetalhe />
    </Suspense>
  );
}

function NotaDetalhe() {
  const sp = useSearchParams();
  const s = (sp.get("s") as Status) || "emitida";
  const cfg = CFG[s];

  const [enviarAberto, setEnviarAberto] = useState(false);
  const [docAberto, setDocAberto] = useState(false);

  return (
    <>
      <TelaHeader meta="Nota" voltar="/notas" />

      <main className="app-main">
        <Titulo>Nota #{NOTA.numero}</Titulo>

        <Corpo>
          {/* Faixa de status */}
          <div className={`flex items-center gap-3 rounded-2xl p-4 ${cfg.tint}`}>
            <FaixaIcone status={s} />
            <div className="min-w-0">
              <p className={`text-caption font-semibold ${cfg.fg}`}>{cfg.titulo}</p>
              <p className="mt-0.5 text-micro text-text-secondary">{cfg.sub}</p>
            </div>
          </div>

          {/* Recusada: motivo + o que fazer */}
          {s === "recusada" && (
            <Card>
              <p className="mb-1 text-caption font-semibold text-state-danger-text">
                Por que foi recusada
              </p>
              <p className="text-caption text-text-secondary">{NOTA.motivoRecusa}</p>
            </Card>
          )}

          {/* Cancelada: motivo */}
          {s === "cancelada" && (
            <Card>
              <p className="mb-1 text-micro text-text-tertiary">Motivo do cancelamento</p>
              <p className="text-caption text-text-secondary">
                {NOTA.motivoCancelamento}
              </p>
            </Card>
          )}

          {/* VISUALIZADOR — preview do documento (herói), toca → tela cheia. */}
          {cfg.temDoc && (
            <button
              type="button"
              onClick={() => setDocAberto(true)}
              className="block w-full text-left"
            >
              <div className="relative max-h-[210px] overflow-hidden rounded-2xl border border-border-hairline bg-white">
                <DocumentoMock />
                {/* fade + chamada */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent pb-3 pt-10">
                  <span className="flex items-center gap-1 text-caption font-semibold text-action-primary-sm">
                    Ver documento completo <IconeExpandir />
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* De → Para (emitente → tomador) */}
          <Card>
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-micro text-text-tertiary">De</p>
                <p className="mt-0.5 truncate text-caption font-semibold text-text-primary">
                  {NOTA.emitente}
                </p>
                <p className="truncate text-micro text-text-tertiary">
                  {soNumero(NOTA.emitenteDoc)}
                </p>
              </div>
              <span className="mt-4 shrink-0 text-text-tertiary">
                <IconeSeta />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-micro text-text-tertiary">Para</p>
                <p className="mt-0.5 truncate text-caption font-semibold text-text-primary">
                  {NOTA.tomador}
                </p>
                <p className="truncate text-micro text-text-tertiary">
                  {soNumero(NOTA.tomadorDoc)}
                </p>
              </div>
            </div>
          </Card>

          {/* Serviço + descrição */}
          <Card>
            <p className="mb-2 text-micro text-text-tertiary">Serviço</p>
            <p className="text-caption font-semibold text-text-primary">{NOTA.servico}</p>
            <p className="mt-0.5 text-micro text-text-tertiary">{NOTA.servicoMeta}</p>
            <p className="mt-3 border-t border-border-hairline pt-3 text-caption text-text-secondary">
              {NOTA.descricao}
            </p>
          </Card>

          {/* Valor — número forte. Imposto vive na aba Impostos. */}
          <Card>
            <div className="flex items-baseline justify-between">
              <span className="text-caption font-semibold text-text-primary">
                Valor da nota
              </span>
              <span className="text-h2 font-bold text-text-primary">
                {formatBRL(NOTA.valor / 100)}
              </span>
            </div>
            <p className="mt-2 text-micro text-text-tertiary">
              O imposto dessa nota você acompanha na aba Impostos.
            </p>
          </Card>

        </Corpo>

        {/* Ações por status */}
        <Rodape>
          <AcoesRodape s={s} onEnviar={() => setEnviarAberto(true)} />
        </Rodape>
      </main>

      {/* Enviar ao cliente (canais) */}
      {enviarAberto && (
        <EnviarSheet paraNome={NOTA.tomador} onFechar={() => setEnviarAberto(false)} />
      )}

      {/* Documento em tela cheia */}
      {docAberto && (
        <DocumentoTelaCheia
          onFechar={() => setDocAberto(false)}
          onEnviar={() => setEnviarAberto(true)}
        />
      )}
    </>
  );
}

/* ─── Ações do rodapé por status ───────────────────────────────────────────── */
function AcoesRodape({ s, onEnviar }: { s: Status; onEnviar: () => void }) {
  if (s === "emitindo") {
    return (
      <Link
        href="/notas"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-border-strong px-6 text-body font-semibold text-text-primary transition-colors hover:bg-surface-alt"
      >
        Voltar pras notas
      </Link>
    );
  }

  if (s === "recusada") {
    // Leva pro /emitir pré-preenchido com o favorecido + valor + o motivo, pra
    // corrigir o dado que falhou e reemitir (a recusada fica no histórico).
    const href = `/emitir?corrigir=1&cliente=${NOTA.clienteId}&valor=${NOTA.valor}&motivo=${encodeURIComponent(
      NOTA.motivoRecusa,
    )}`;
    return (
      <>
        <Link
          href={href}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-action-primary px-6 text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
        >
          Corrigir e reemitir
        </Link>
        <div className="mt-1 flex justify-center">
          <Button variant="ghost">Descartar nota</Button>
        </div>
      </>
    );
  }

  // emitida e cancelada: documento existe → baixar/enviar. Cancelar só na emitida
  // (e "dentro da janela" — no mock, sempre; no real, condicional).
  return (
    <>
      <Button full>Baixar PDF</Button>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onEnviar}>
          Enviar ao cliente
        </Button>
        <Button variant="secondary">Baixar XML</Button>
      </div>
      {s === "emitida" && (
        <div className="mt-1 flex justify-center">
          <Button variant="ghost">Cancelar nota</Button>
        </div>
      )}
    </>
  );
}

/* ─── Ícone da faixa por status ────────────────────────────────────────────── */
function FaixaIcone({ status }: { status: Status }) {
  if (status === "emitida") return <StatusIcon estado="feito" />;
  if (status === "emitindo") return <StatusIcon estado="girando" />;
  if (status === "recusada") return <StatusIcon estado="recusa" />;
  // cancelada
  return (
    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-border-strong text-text-muted">
      <svg width="8" height="2" viewBox="0 0 8 2" aria-hidden>
        <path d="M1 1h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* ─── Documento (mock) — representação limpa da NFS-e, não o DANFE cru ──────────
   `grande` = tela cheia (fontes legíveis, mais respiro); default = thumbnail. */
function DocumentoMock({ grande = false }: { grande?: boolean }) {
  const t = grande
    ? { pad: "p-6", org: "text-caption", tit: "text-body", lbl: "text-micro", nome: "text-caption", doc: "text-caption", desc: "text-body", vlbl: "text-caption", val: "text-h1", mono: "text-caption", gap: "py-5" }
    : { pad: "p-5", org: "text-[9px]", tit: "text-[11px]", lbl: "text-[8px]", nome: "text-[10px]", doc: "text-[10px]", desc: "text-[10px]", vlbl: "text-[10px]", val: "text-[15px]", mono: "text-[10px]", gap: "py-3" };
  return (
    <div className={`${t.pad} text-text-primary`}>
      <div className="border-b border-[#e6e6e6] pb-3">
        <p className={`${t.org} font-semibold uppercase tracking-wide text-[#888]`}>
          Prefeitura de Belo Horizonte
        </p>
        <p className={`${t.doc} font-semibold text-[#555]`}>
          Nº {NOTA.numero} · Série {NOTA.serie}
        </p>
        <p className={`${t.tit} font-bold text-[#222]`}>
          Nota Fiscal de Serviço Eletrônica
        </p>
      </div>

      <div className={`grid grid-cols-2 gap-4 border-b border-[#e6e6e6] ${t.gap}`}>
        <div>
          <p className={`${t.lbl} uppercase text-[#999]`}>Prestador</p>
          <p className={`${t.nome} font-semibold text-[#333]`}>{NOTA.emitente}</p>
          <p className={`${t.doc} text-[#777]`}>{NOTA.emitenteDoc}</p>
        </div>
        <div>
          <p className={`${t.lbl} uppercase text-[#999]`}>Tomador</p>
          <p className={`${t.nome} font-semibold text-[#333]`}>{NOTA.tomador}</p>
          <p className={`${t.doc} text-[#777]`}>{NOTA.tomadorDoc}</p>
        </div>
      </div>

      <div className={`border-b border-[#e6e6e6] ${t.gap}`}>
        <p className={`${t.lbl} uppercase text-[#999]`}>Discriminação do serviço</p>
        <p className={`${t.desc} text-[#444]`}>{NOTA.descricao}</p>
        <p className={`mt-1 ${t.doc} text-[#777]`}>
          {NOTA.servico} · {NOTA.servicoMeta}
        </p>
      </div>

      <div className={`flex items-center justify-between ${t.gap}`}>
        <p className={`${t.vlbl} font-semibold uppercase text-[#999]`}>Valor total</p>
        <p className={`${t.val} font-bold text-[#222]`}>{formatBRL(NOTA.valor / 100)}</p>
      </div>

      <div className="border-t border-[#e6e6e6] pt-3">
        <p className={`${t.lbl} uppercase text-[#999]`}>Código de verificação</p>
        <p className={`font-mono ${t.mono} text-[#444]`}>{NOTA.verificacao}</p>
      </div>
    </div>
  );
}

/* ─── Documento em tela cheia (o "visualizador") ───────────────────────────── */
function DocumentoTelaCheia({
  onFechar,
  onEnviar,
}: {
  onFechar: () => void;
  onEnviar: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-page">
      <header
        className="flex shrink-0 items-center justify-between px-5 pb-3"
        style={{ paddingTop: "calc(12px + var(--safe-top))" }}
      >
        <p className="text-caption font-semibold text-text-primary">
          Nota #{NOTA.numero}
        </p>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onFechar}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <IconeX />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="overflow-hidden rounded-2xl border border-border-hairline bg-white shadow-lg">
          <DocumentoMock grande />
        </div>
      </div>
      <div
        className="shrink-0 px-5 pt-3"
        style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
      >
        <Button full>Baixar PDF</Button>
        <div className="mt-2">
          {/* Abre o sheet de canais POR CIMA da tela cheia (z-60), sem fechá-la —
              fica na mesma tela; fechar o sheet volta pro documento. */}
          <Button full variant="secondary" onClick={onEnviar}>
            Enviar ao cliente
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeSeta() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function IconeExpandir() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}
function IconeX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
