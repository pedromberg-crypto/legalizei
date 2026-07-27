"use client";

import { useState } from "react";
import Link from "next/link";
import { LinhaNota, type Nota, type StatusNota } from "@/components/nota-linha";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTAS · P5 (lista + gestão) — Tier 1+2 + navegação por MÊS (Opção A, 24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * Problema: scroll infinito de TODOS os meses fica extenso/confuso pra quem
 * emite dezenas por mês. Solução A:
 *   · FOLHEAR = mês a mês. Abre no mês corrente; um seletor (‹ mês ›) troca o
 *     mês. Nunca empilha tudo — casa com a cabeça do contador (competência=mês).
 *   · FILTRAR/BUSCAR = global. Chip de status ou busca varrem TODOS os meses
 *     (agrupados); aí o seletor some (você está "achando", não "folheando").
 *   · Mês pesado: mostra as primeiras (LIMITE) + "Ver mais N" (paginação leve).
 *
 * Linha = componente único [[nota-linha]] (avatar C), clicável → detalhe P7.
 * ⚠️ Imposto não aparece aqui (Simples = DAS mensal); vive na aba Impostos.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type NotaMes = Nota & { mes: string };

// Mock, mais recente primeiro. Julho engordado (14) pra exercitar o "Ver mais".
const NOTAS: NotaMes[] = [
  { id: "n40", tomador: "Padaria Pão Quente Ltda", valor: 50000, data: "agora", status: "emitindo", mes: "Julho de 2026" },
  { id: "n39", tomador: "TechFlow Software Ltda", valor: 180000, data: "22 jul", numero: "000138", status: "emitida", mes: "Julho de 2026" },
  { id: "n38", tomador: "Maria Costa", valor: 30000, data: "20 jul", numero: "000137", status: "emitida", mes: "Julho de 2026" },
  { id: "n37", tomador: "Studio Alfa Comunicação", valor: 45000, data: "18 jul", status: "recusada", mes: "Julho de 2026" },
  { id: "n36", tomador: "João Lima", valor: 120000, data: "15 jul", numero: "000136", status: "cancelada", mes: "Julho de 2026" },
  { id: "n35", tomador: "Padaria Pão Quente Ltda", valor: 45000, data: "12 jul", numero: "000135", status: "emitida", mes: "Julho de 2026" },
  { id: "n34", tomador: "Consultoria Mendes", valor: 90000, data: "11 jul", numero: "000134", status: "emitida", mes: "Julho de 2026" },
  { id: "n33", tomador: "TechFlow Software Ltda", valor: 180000, data: "10 jul", numero: "000133", status: "emitida", mes: "Julho de 2026" },
  { id: "n32", tomador: "Ana Paula Dias", valor: 25000, data: "9 jul", numero: "000132", status: "emitida", mes: "Julho de 2026" },
  { id: "n31", tomador: "Padaria Pão Quente Ltda", valor: 45000, data: "8 jul", numero: "000131", status: "emitida", mes: "Julho de 2026" },
  { id: "n30", tomador: "Studio Alfa Comunicação", valor: 60000, data: "5 jul", numero: "000130", status: "emitida", mes: "Julho de 2026" },
  { id: "n29", tomador: "Maria Costa", valor: 30000, data: "4 jul", numero: "000129", status: "emitida", mes: "Julho de 2026" },
  { id: "n28", tomador: "Bar do Zé Ltda", valor: 20000, data: "3 jul", numero: "000128", status: "emitida", mes: "Julho de 2026" },
  { id: "n27", tomador: "Consultoria Mendes", valor: 90000, data: "2 jul", numero: "000127", status: "emitida", mes: "Julho de 2026" },

  { id: "n26", tomador: "TechFlow Software Ltda", valor: 180000, data: "28 jun", numero: "000126", status: "emitida", mes: "Junho de 2026" },
  { id: "n25", tomador: "Rita Souza", valor: 85000, data: "22 jun", numero: "000125", status: "emitida", mes: "Junho de 2026" },
  { id: "n24", tomador: "Maria Costa", valor: 30000, data: "15 jun", numero: "000124", status: "emitida", mes: "Junho de 2026" },
  { id: "n23", tomador: "Bar do Zé Ltda", valor: 20000, data: "10 jun", status: "recusada", mes: "Junho de 2026" },

  { id: "n22", tomador: "João Lima", valor: 300000, data: "30 mai", numero: "000122", status: "emitida", mes: "Maio de 2026" },
  { id: "n21", tomador: "TechFlow Software Ltda", valor: 180000, data: "22 mai", numero: "000121", status: "emitida", mes: "Maio de 2026" },
  { id: "n20", tomador: "Padaria Pão Quente Ltda", valor: 45000, data: "12 mai", numero: "000120", status: "emitida", mes: "Maio de 2026" },
];

// Meses, do mais recente pro mais antigo (dirige o seletor e o agrupamento).
const MESES = ["Julho de 2026", "Junho de 2026", "Maio de 2026"];

// Acima disso, o mês pagina ("Ver mais").
const LIMITE = 8;

type Filtro = "todas" | StatusNota;
const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "emitida", label: "Emitidas" },
  { id: "emitindo", label: "Em emissão" },
  { id: "recusada", label: "Recusadas" },
  { id: "cancelada", label: "Canceladas" },
];

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function emitido(notas: NotaMes[]): number {
  return notas
    .filter((n) => n.status === "emitida" || n.status === "emitindo")
    .reduce((s, n) => s + n.valor, 0);
}

export default function NotasPage() {
  const [mesIdx, setMesIdx] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");
  const [verTudoMes, setVerTudoMes] = useState(false);

  const termo = norm(busca.trim());
  // BUSCA é global (varre todos os meses); o FILTRO de status é escopado ao mês
  // que você está folheando (pedido do Pedro 24/07). Só a busca esconde o seletor.
  const buscando = termo !== "";

  // Estado vazio (1º uso): guia pra 1ª nota (amarra N24).
  if (NOTAS.length === 0) {
    return (
      <main className="app-main">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-[calc(100px+var(--safe-bottom))] text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt text-text-tertiary">
            <IconeNotaGrande />
          </span>
          <div>
            <h1 className="text-h2 text-text-primary">Nenhuma nota ainda</h1>
            <p className="mx-auto mt-1 max-w-[20rem] text-body text-text-secondary">
              Quando você emitir sua primeira nota, ela aparece aqui com o
              status em tempo real.
            </p>
          </div>
          <Link
            href="/emitir"
            className="mt-2 inline-flex min-h-12 items-center justify-center rounded-md bg-action-primary px-6 text-lg font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
          >
            Emitir minha 1ª nota
          </Link>
        </div>
      </main>
    );
  }

  const mesNome = MESES[mesIdx];
  const notasMes = NOTAS.filter((n) => n.mes === mesNome);

  // Escopo antes do filtro de status: buscando = todos os meses que casam o
  // termo; folheando = só o mês ativo. O filtro de status incide sobre ele.
  const escopo = buscando
    ? NOTAS.filter((n) =>
        norm(
          `${n.numero ?? ""} ${n.tomador} ${formatBRL(n.valor / 100)}`,
        ).includes(termo),
      )
    : notasMes;
  const filtradas = escopo.filter((n) => filtro === "todas" || n.status === filtro);

  // Contagem dos chips = DENTRO do escopo atual (o mês, ou os resultados da busca).
  const contar = (id: Filtro) =>
    id === "todas" ? escopo.length : escopo.filter((n) => n.status === id).length;

  // Alerta de recusada escopado ao mês (coerente com o filtro do mês).
  const nRecusadasMes = notasMes.filter((n) => n.status === "recusada").length;

  // Folhear: paginação do mês (Ver mais).
  const mostradas = verTudoMes ? filtradas : filtradas.slice(0, LIMITE);
  const restante = filtradas.length - mostradas.length;

  // Buscando: agrupa os resultados por mês.
  const grupos = MESES.map((mes) => ({
    mes,
    notas: filtradas.filter((n) => n.mes === mes),
  })).filter((g) => g.notas.length > 0);

  const irMes = (delta: number) => {
    setMesIdx((i) => Math.min(Math.max(i + delta, 0), MESES.length - 1));
    setVerTudoMes(false);
  };

  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-4 pb-[calc(100px+var(--safe-bottom))] pt-6">
          {/* Título */}
          <div>
            <h1 className="text-h1 text-text-primary">Suas notas</h1>
            <p className="mt-1 text-body text-text-secondary">
              Tudo que você emitiu, com o status em tempo real.
            </p>
          </div>

          {/* Alerta de falha: recusada = receita parada. Some ao filtrar recusadas. */}
          {!buscando && nRecusadasMes > 0 && filtro !== "recusada" && (
            <button
              type="button"
              onClick={() => {
                setFiltro("recusada");
                setVerTudoMes(false);
              }}
              className="flex items-center gap-3 rounded-2xl bg-state-danger-tint p-3 text-left"
            >
              <span className="shrink-0 text-state-danger-text">
                <IconeAlerta />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-state-danger-text">
                  {nRecusadasMes} nota{nRecusadasMes > 1 ? "s" : ""} recusada
                  {nRecusadasMes > 1 ? "s" : ""}{" "}
                  {nRecusadasMes > 1 ? "precisam" : "precisa"} de você
                </p>
                <p className="text-micro text-text-secondary">
                  Toque pra ver e resolver.
                </p>
              </div>
              <span className="shrink-0 text-state-danger-text">
                <IconeChevron />
              </span>
            </button>
          )}

          {/* Seletor de MÊS (só quando NÃO está buscando) — arrows + R$/contagem. */}
          {!buscando && (
            <div className="flex items-center gap-1 rounded-2xl border border-border-hairline bg-surface-card p-1.5">
              <SetaMes
                dir="ant"
                onClick={() => irMes(1)}
                off={mesIdx === MESES.length - 1}
              />
              <div className="flex-1 text-center">
                <p className="text-caption font-semibold text-text-primary">
                  {mesNome}
                </p>
                <p className="text-micro text-text-tertiary">
                  {formatBRL(emitido(notasMes) / 100)} · {notasMes.length} nota
                  {notasMes.length > 1 ? "s" : ""}
                </p>
              </div>
              <SetaMes dir="prox" onClick={() => irMes(-1)} off={mesIdx === 0} />
            </div>
          )}

          {/* Barra STICKY: busca + chips (persistem enquanto rola). */}
          <div className="sticky top-0 z-10 -mx-6 bg-surface-page px-6 pb-2 pt-1">
            <div className="flex items-center gap-2 rounded-xl border border-border-hairline bg-surface-card px-3 focus-within:border-border-focus">
              <span className="shrink-0 text-text-tertiary">
                <IconeLupa />
              </span>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por cliente, nº ou valor"
                aria-label="Buscar nota"
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
                Nenhuma nota encontrada para “{busca}”.
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
                      {g.notas.map((n) => (
                        <LinhaNota key={n.id} nota={n} href={`/notas/detalhe?s=${n.status}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )
          ) : filtradas.length === 0 ? (
            <p className="py-12 text-center text-caption text-text-tertiary">
              {filtro === "todas"
                ? "Nenhuma nota nesse mês."
                : "Nenhuma nota com esse status nesse mês."}
            </p>
          ) : (
            <div>
              {/* Exportar o mês (PDF/XML) — contador + backup. Mock. */}
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  className="flex items-center gap-1 text-micro font-semibold text-action-primary-sm"
                >
                  <IconeBaixar /> Exportar mês
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {mostradas.map((n) => (
                  <LinhaNota key={n.id} nota={n} href={`/notas/detalhe?s=${n.status}`} />
                ))}
              </div>
              {restante > 0 && (
                <button
                  type="button"
                  onClick={() => setVerTudoMes(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl border border-border-hairline bg-surface-card py-3 text-caption font-semibold text-action-primary-sm transition-colors hover:border-border-strong"
                >
                  Ver mais {restante} nota{restante > 1 ? "s" : ""}
                  <IconeChevronBaixo />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─── Seta do seletor de mês ───────────────────────────────────────────────── */
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
function IconeAlerta() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17v.01" />
    </svg>
  );
}
function IconeChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 6 6 6-6 6" />
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
function IconeBaixar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function IconeNotaGrande() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h5" />
    </svg>
  );
}
