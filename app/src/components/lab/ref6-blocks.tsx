"use client";

import { useState, type ReactNode } from "react";
import { DADOS } from "@/components/lab/nexo-shell";

/**
 * COMPONENTES VALIDADOS DA ref6 (fintech premium dark). Fonte única.
 * O HeroDark tem `boxed`: full-bleed (header fixo da página) × card arredondado
 * (acervo, pra o overflow não cortar o topo).
 * 28/07: EmitirPra ATUALIZADO pra bater com o ClienteBolha real de
 * emitir/page.tsx — estado ativo/selecionado, bolha "Consumidor final",
 * rótulo em 2 linhas e o atalho "Repetir última nota".
 */

// Já ordenados por frequência de emissão (mock — o real ordena de verdade).
const CLIENTES = [
  { id: "tf", ini: "TF", l1: "TechFlow", l2: "Software" },
  { id: "pp", ini: "PP", l1: "Padaria", l2: "Pão Quente" },
  { id: "mc", ini: "MC", l1: "Maria", l2: "Costa" },
  { id: "jl", ini: "JL", l1: "João", l2: "Lima" },
];

const MOV = [
  { ini: "NF", nome: "Nota #0012 · Maria Costa", quando: "9:10", valor: "+ R$ 1.200", pos: true },
  { ini: "IM", nome: "DAS de maio pago", quando: "18/06", valor: "− R$ 152,90", pos: false },
  { ini: "NF", nome: "Nota #0011 · João Lima", quando: "28/05", valor: "+ R$ 3.000", pos: true },
];

const GRADIENTE = "linear-gradient(160deg, #2A2E37 0%, #15171C 62%, #202433 100%)";

/* ─── 1. Hero dark (seletor + número + 4 glass) ───────────────────────────── */
export function HeroDark({ boxed = false }: { boxed?: boolean }) {
  const style: React.CSSProperties = boxed
    ? { background: GRADIENTE, borderRadius: 24, padding: 20 }
    : {
        marginInline: -24,
        marginTop: "calc(-1 * var(--safe-top))",
        paddingTop: "calc(var(--safe-top) + 18px)",
        paddingBottom: 26,
        paddingInline: 24,
        background: GRADIENTE,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      };
  return (
    <div className={`text-text-on-dark ${boxed ? "" : "shrink-0"}`} style={style}>
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-caption font-medium">
          Ana Beatriz <Chevron />
        </button>
        <div className="flex gap-2">
          <Glass><Raio /></Glass>
          <Glass><Lapis /></Glass>
        </div>
      </div>

      <p className="mt-6 text-micro text-text-on-dark/60">MEI · SIMPLES · faturamento do mês</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-[40px] font-bold leading-none tracking-tight">{DADOS.faturamentoMes}</p>
        <p className="mb-1 text-caption text-state-success">+8%</p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        <Acao label="Emitir"><SetaCima /></Acao>
        <Acao label="Pagar"><SetaBaixo /></Acao>
        <Acao label="Adicionar"><Mais /></Acao>
        <Acao label="Mais"><Grade /></Acao>
      </div>
    </div>
  );
}

/* ─── 2. Emitir pra (clientes recentes) ───────────────────────────────────── */
export function EmitirPra() {
  const [ativo, setAtivo] = useState<string | null>("pp");
  return (
    <div>
      {/* Repetir última nota — atalho no topo, pedido do Pedro 24/07 */}
      <button
        type="button"
        className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
          <Repetir />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-caption font-semibold text-text-primary">
            Repetir última nota
          </span>
          <span className="block truncate text-micro text-text-tertiary">
            Padaria Pão Quente · R$ 500,00
          </span>
        </span>
      </button>

      <Cabecalho titulo="Emitir pra" />
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Bolha ativo={false} onClick={() => setAtivo(null)} ini={<Mais />} l1="Novo" l2="cliente" tracejado />
        <Bolha ativo={ativo === "consumidor"} onClick={() => setAtivo("consumidor")} ini={<Pessoa />} l1="Consumidor" l2="final" />
        {CLIENTES.map((c) => (
          <Bolha key={c.id} ativo={ativo === c.id} onClick={() => setAtivo(c.id)} ini={c.ini} l1={c.l1} l2={c.l2} />
        ))}
      </div>
    </div>
  );
}

/* Bolha de favorecido: estado ativo + rótulo sempre em 2 linhas. */
function Bolha({
  ativo,
  onClick,
  ini,
  l1,
  l2,
  tracejado = false,
}: {
  ativo: boolean;
  onClick: () => void;
  ini: ReactNode;
  l1: string;
  l2: string;
  tracejado?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 flex-col items-center gap-1.5" aria-pressed={ativo}>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full text-caption font-bold transition-colors ${
          ativo
            ? "bg-action-primary text-text-on-brand"
            : tracejado
              ? "border border-dashed border-border-strong text-text-secondary"
              : "bg-surface-alt text-text-secondary"
        }`}
      >
        {ini}
      </span>
      <span className="text-center leading-tight">
        <span className={`block whitespace-nowrap text-micro ${ativo ? "font-semibold text-text-primary" : "text-text-tertiary"}`}>
          {l1}
        </span>
        <span className={`block whitespace-nowrap text-micro ${ativo ? "text-text-secondary" : "text-text-tertiary"}`}>
          {l2}
        </span>
      </span>
    </button>
  );
}

/* ─── 3. Movimentações recentes ───────────────────────────────────────────── */
export function MovimentacoesRecentes() {
  return (
    <div>
      <Cabecalho titulo="Movimentações recentes" />
      <div className="flex flex-col gap-2">
        {MOV.map((m) => (
          <div
            key={m.nome}
            className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
              {m.ini}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption font-semibold text-text-primary">{m.nome}</p>
              <p className="text-micro text-text-tertiary mt-0.5">{m.quando}</p>
            </div>
            <p className={`text-caption font-semibold ${m.pos ? "text-state-success-text" : "text-text-primary"}`}>
              {m.valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── auxiliares ──────────────────────────────────────────────────────────── */
function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="text-body-strong font-semibold text-text-primary">{titulo}</p>
      <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
    </div>
  );
}
function Glass({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
      {children}
    </span>
  );
}
function Acao({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1.5">
      <span className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        {children}
      </span>
      <span className="text-micro text-text-on-dark/80">{label}</span>
    </button>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function Chevron() {
  return <svg {...ic()} width={14} height={14}><path d="m6 9 6 6 6-6" /></svg>;
}
function Raio() {
  return <svg {...ic()}><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>;
}
function Lapis() {
  return <svg {...ic()}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
}
function SetaCima() {
  return <svg {...ic()}><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
function SetaBaixo() {
  return <svg {...ic()}><path d="M12 5v14M5 12l7 7 7-7" /></svg>;
}
function Mais() {
  return <svg {...ic()}><path d="M12 5v14M5 12h14" /></svg>;
}
function Grade() {
  return <svg {...ic()}><circle cx="6" cy="6" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="18" cy="6" r="1.5" /><circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /><circle cx="6" cy="18" r="1.5" /><circle cx="12" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /></svg>;
}
function Repetir() {
  return <svg {...ic()} width={18} height={18}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>;
}
function Pessoa() {
  return <svg {...ic()} width={18} height={18}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>;
}
