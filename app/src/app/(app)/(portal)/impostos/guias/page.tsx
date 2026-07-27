"use client";

import { useState } from "react";
import Link from "next/link";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPOSTOS · Todas as guias — MESMA ESTRUTURA da P5 (Notas), com guias (24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * "Ver todas" da aba Impostos. Folhear = mês a mês (seletor); filtro de status
 * escopado ao mês; busca = global. Drill-down (back → /impostos, sem navbar).
 * Status AUTOMÁTICO (anti-líder). A-vencer → toca e paga (P3); paga = recibo.
 * Números = farol/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type StatusGuia = "a-vencer" | "paga" | "recalculando";
type Guia = {
  id: string;
  tipo: string;
  valor: number; // centavos
  data: string;
  status: StatusGuia;
  mes: string;
};

const GUIAS: Guia[] = [
  { id: "g10", tipo: "Imposto do mês", valor: 17831, data: "Vence 20/07", status: "a-vencer", mes: "Junho de 2026" },
  { id: "g9", tipo: "INSS do pró-labore", valor: 10255, data: "Vence 20/07", status: "a-vencer", mes: "Junho de 2026" },
  { id: "g8", tipo: "Imposto do mês", valor: 15290, data: "Recalculando · fica pronto em breve", status: "recalculando", mes: "Maio de 2026" },
  { id: "g7", tipo: "INSS do pró-labore", valor: 10255, data: "Pago em 18/06", status: "paga", mes: "Maio de 2026" },
  { id: "g6", tipo: "Imposto do mês", valor: 14120, data: "Pago em 20/05", status: "paga", mes: "Abril de 2026" },
  { id: "g5", tipo: "INSS do pró-labore", valor: 10255, data: "Pago em 20/05", status: "paga", mes: "Abril de 2026" },
  { id: "g4", tipo: "Imposto do mês", valor: 13860, data: "Pago em 19/04", status: "paga", mes: "Março de 2026" },
  { id: "g3", tipo: "INSS do pró-labore", valor: 10255, data: "Pago em 19/04", status: "paga", mes: "Março de 2026" },
  { id: "g2", tipo: "Imposto do mês", valor: 13010, data: "Pago em 20/03", status: "paga", mes: "Fevereiro de 2026" },
  { id: "g1", tipo: "INSS do pró-labore", valor: 10255, data: "Pago em 20/03", status: "paga", mes: "Fevereiro de 2026" },
];

const MESES = [
  "Junho de 2026",
  "Maio de 2026",
  "Abril de 2026",
  "Março de 2026",
  "Fevereiro de 2026",
];

const LIMITE = 8;

type Filtro = "todas" | StatusGuia;
const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "a-vencer", label: "A vencer" },
  { id: "paga", label: "Pagas" },
];

const ST: Record<StatusGuia, { tint: string; cor: string; label: string }> = {
  "a-vencer": {
    tint: "bg-state-warning-tint text-state-warning-text",
    cor: "text-state-warning-text",
    label: "A vencer",
  },
  paga: {
    tint: "bg-state-success-tint text-state-success-text",
    cor: "text-state-success-text",
    label: "Paga",
  },
  recalculando: {
    tint: "bg-surface-tint-brand text-action-primary-sm",
    cor: "text-action-primary-sm",
    label: "Recalculando",
  },
};

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function mesCurto(mes: string): string {
  return mes.split(" ")[0].toLowerCase();
}

export default function GuiasPage() {
  const [mesIdx, setMesIdx] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");
  const [verTudoMes, setVerTudoMes] = useState(false);

  const termo = norm(busca.trim());
  const buscando = termo !== "";

  const mesNome = MESES[mesIdx];
  const notasMes = GUIAS.filter((g) => g.mes === mesNome);

  const escopo = buscando
    ? GUIAS.filter((g) =>
        norm(`${g.tipo} ${formatBRL(g.valor / 100)}`).includes(termo),
      )
    : notasMes;
  const filtradas = escopo.filter((g) => filtro === "todas" || g.status === filtro);

  const contar = (id: Filtro) =>
    id === "todas" ? escopo.length : escopo.filter((g) => g.status === id).length;

  const mostradas = verTudoMes ? filtradas : filtradas.slice(0, LIMITE);
  const restante = filtradas.length - mostradas.length;

  const grupos = MESES.map((mes) => ({
    mes,
    guias: filtradas.filter((g) => g.mes === mes),
  })).filter((g) => g.guias.length > 0);

  const totalMes = notasMes.reduce((s, g) => s + g.valor, 0);

  const irMes = (delta: number) => {
    setMesIdx((i) => Math.min(Math.max(i + delta, 0), MESES.length - 1));
    setVerTudoMes(false);
  };

  return (
    <>
      <TelaHeader meta="Guias" voltar="/impostos" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-4 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            <div>
              <h1 className="text-h1 text-text-primary">Suas guias</h1>
              <p className="mt-1 text-body text-text-secondary">
                Todo imposto que a gente calculou e pagou por você.
              </p>
            </div>

            {/* Seletor de MÊS (só quando não está buscando) */}
            {!buscando && (
              <div className="flex items-center gap-1 rounded-2xl border border-border-hairline bg-surface-card p-1.5">
                <SetaMes dir="ant" onClick={() => irMes(1)} off={mesIdx === MESES.length - 1} />
                <div className="flex-1 text-center">
                  <p className="text-caption font-semibold text-text-primary">{mesNome}</p>
                  <p className="text-micro text-text-tertiary">
                    {formatBRL(totalMes / 100)} · {notasMes.length} guia
                    {notasMes.length > 1 ? "s" : ""}
                  </p>
                </div>
                <SetaMes dir="prox" onClick={() => irMes(-1)} off={mesIdx === 0} />
              </div>
            )}

            {/* Barra STICKY: busca + chips */}
            <div className="sticky top-0 z-10 -mx-6 bg-surface-page px-6 pb-2 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-border-hairline bg-surface-card px-3 focus-within:border-border-focus">
                <span className="shrink-0 text-text-tertiary">
                  <IconeLupa />
                </span>
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por imposto ou valor"
                  aria-label="Buscar guia"
                  className="w-full bg-transparent py-2.5 text-caption text-text-primary outline-none placeholder:text-text-muted"
                />
                {busca && (
                  <button
                    type="button"
                    aria-label="Limpar busca"
                    onClick={() => setBusca("")}
                    className="shrink-0 text-text-tertiary hover:text-text-primary"
                  >
                    <IconeX />
                  </button>
                )}
              </div>

              <div className="-mx-6 mt-2 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {FILTROS.map((f) => {
                  const ativo = filtro === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFiltro(f.id);
                        setVerTudoMes(false);
                      }}
                      aria-pressed={ativo}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-caption font-semibold transition-colors ${
                        ativo
                          ? "bg-surface-dark text-text-on-dark"
                          : "border border-border-hairline text-text-secondary hover:border-border-strong"
                      }`}
                    >
                      {f.label} · {contar(f.id)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista */}
            {buscando ? (
              grupos.length === 0 ? (
                <p className="py-12 text-center text-caption text-text-tertiary">
                  Nenhuma guia encontrada para “{busca}”.
                </p>
              ) : (
                <>
                  <p className="text-micro text-text-tertiary">
                    {filtradas.length} resultado{filtradas.length > 1 ? "s" : ""} em
                    todos os meses
                  </p>
                  {grupos.map((g) => (
                    <div key={g.mes}>
                      <p className="mb-2 text-micro text-text-tertiary">{g.mes}</p>
                      <div className="flex flex-col gap-2">
                        {g.guias.map((x) => (
                          <GuiaLinha key={x.id} g={x} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )
            ) : filtradas.length === 0 ? (
              <p className="py-12 text-center text-caption text-text-tertiary">
                {filtro === "todas"
                  ? "Nenhuma guia nesse mês."
                  : "Nenhuma guia com esse status nesse mês."}
              </p>
            ) : (
              <div>
                <p className="mb-2 text-micro text-text-tertiary">
                  Guias de {mesCurto(mesNome)}
                </p>
                <div className="flex flex-col gap-2">
                  {mostradas.map((g) => (
                    <GuiaLinha key={g.id} g={g} />
                  ))}
                </div>
                {restante > 0 && (
                  <button
                    type="button"
                    onClick={() => setVerTudoMes(true)}
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl border border-border-hairline bg-surface-card py-3 text-caption font-semibold text-action-primary-sm transition-colors hover:border-border-strong"
                  >
                    Ver mais {restante} guia{restante > 1 ? "s" : ""}
                    <IconeChevronBaixo />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Uma guia (mesma anatomia da linha da P5) ─────────────────────────────── */
function origemDe(tipo: string): string {
  return tipo.startsWith("INSS")
    ? "Pró-labore de R$ 932 · INSS 11%."
    : "Faturou R$ 4.200 · 6% do Simples.";
}

// TODA guia é clicável → detalhe/visualizador. A vencer abre pra ver/pagar;
// paga abre pra visualizar/baixar comprovante (status vai no param).
function GuiaLinha({ g }: { g: Guia }) {
  const st = ST[g.status];

  // Recalculando = trabalho em andamento, nada a pagar ainda → linha informativa.
  if (g.status === "recalculando") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${st.tint}`}>
          <IconeBanco />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-semibold text-text-primary">{g.tipo}</p>
          <p className="mt-0.5 text-micro">
            <span className={st.cor}>{st.label}</span>
            <span className="text-text-tertiary"> · {g.data}</span>
          </p>
        </div>
        <p className="shrink-0 text-caption font-semibold text-text-tertiary">
          {formatBRL(g.valor / 100)}
        </p>
      </div>
    );
  }

  const href =
    `/impostos/pagar?tipo=${encodeURIComponent(g.tipo)}` +
    `&comp=${encodeURIComponent(g.mes)}` +
    `&valor=${encodeURIComponent(formatBRL(g.valor / 100))}` +
    `&status=${g.status}` +
    `&data=${encodeURIComponent(g.data)}` +
    `&origem=${encodeURIComponent(origemDe(g.tipo))}` +
    `&de=${encodeURIComponent("/impostos/guias")}`;
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${st.tint}`}>
        <IconeBanco />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-caption font-semibold text-text-primary">{g.tipo}</p>
        <p className="mt-0.5 text-micro">
          <span className={st.cor}>{st.label}</span>
          <span className="text-text-tertiary"> · {g.data}</span>
        </p>
      </div>
      <p className="shrink-0 text-caption font-semibold text-text-primary">
        {formatBRL(g.valor / 100)}
      </p>
    </Link>
  );
}

function SetaMes({
  dir,
  onClick,
  off,
}: {
  dir: "ant" | "prox";
  onClick: () => void;
  off: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={off}
      aria-label={dir === "ant" ? "Mês anterior" : "Mês seguinte"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors ${
        off ? "opacity-25" : "hover:bg-surface-alt"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === "ant" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}

function IconeBanco() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
      <path d="M3 20h18" />
    </svg>
  );
}
function IconeLupa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconeX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconeChevronBaixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
