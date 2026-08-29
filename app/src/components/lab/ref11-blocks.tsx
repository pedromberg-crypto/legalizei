"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * COMPONENTES VALIDADOS DA ref11 (AI notes) — página inteira aprovada.
 * profile-row · search-mic · ações-rápidas (card ativo) · emitir-por-voz ·
 * pergunte-à-IA · notas-recentes. Fonte única.
 * 28/07: ProfileRow e SearchMic ATUALIZADOS pra bater com mais/page.tsx (row
 * "Você" virou Link com dot verde + chevron único) e a busca real de
 * notas/blog (sem mic, input funcional + botão limpar).
 */

const ACOES = [
  { titulo: "Emitir nota", sub: "Sua NF-e em segundos", Icone: IconeNota, ativo: true },
  { titulo: "Pagar imposto", sub: "O DAS do mês, no app", Icone: IconeBanco },
  { titulo: "Meu pró-labore", sub: "Mexa e veja o imposto", Icone: IconeCarteira },
  { titulo: "Documentos", sub: "Contrato, certidões", Icone: IconePasta },
];

const IA = [
  "Posso emitir pra esse cliente?",
  "Quanto vou pagar esse mês?",
  "Meu Fator R está seguro?",
  "O que é esse imposto?",
];

const NOTAS = [
  { titulo: "Nota #0012 · Maria Costa", valor: "R$ 1.200", tags: ["Serviço", "Paga"], quando: "há 2h" },
  { titulo: "Nota #0011 · João Lima", valor: "R$ 3.000", tags: ["Serviço", "Paga"], quando: "28/05" },
];

/* ─── 1. Profile row → virou "Você" (Link, dot verde, chevron único) ─────── */
export function ProfileRow() {
  return (
    <Link
      href="/perfil"
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      <span className="relative shrink-0">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark text-body font-bold text-text-on-dark">
          AB
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-surface-card bg-state-success" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-text-primary">Ana Beatriz</p>
        <p className="truncate text-caption text-text-tertiary">
          Sua conta · e-mail, senha e notificações
        </p>
      </div>
      <span className="shrink-0 text-text-tertiary">
        <ChevronDireita />
      </span>
    </Link>
  );
}

/* ─── 2. Search bar (sem mic — input funcional + botão limpar) ────────────── */
export function SearchMic() {
  const [busca, setBusca] = useState("");
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border-hairline bg-surface-card px-4 py-3">
      <Lupa />
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar nota, cliente, imposto…"
        className="flex-1 bg-transparent text-caption text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      {busca !== "" && (
        <button
          type="button"
          onClick={() => setBusca("")}
          aria-label="Limpar busca"
          className="shrink-0 text-text-tertiary transition-colors hover:text-text-primary"
        >
          <IconeX />
        </button>
      )}
    </div>
  );
}

/* ─── 3. Grid de ações — formato "pasta" (28/08, aprovado com o Pedro em
   `components/lab/validados.tsx`, promovido pra produção aqui). Canto
   superior direito cortado por um chanfro reto (não curva), com as 2 pontas
   da diagonal arredondadas no MESMO raio dos outros 3 cantos — geometria
   traçada a partir de um export do Illustrator do Pedro, não estimada a
   olho. Card "ativo" usa o degradê da marca (mesmos 2 stops do CTA de
   `CartaoStatus`); os outros 3, fundo branco liso.
   CSS `linear-gradient`/clip-path não servem de contorno pra um SVG `fill`
   — por isso o path é desenhado à mão (`contornoPasta`) e o degradê vira um
   `<linearGradient>` nativo. O cartão fica num container com `aspect-ratio`
   travado na proporção do desenho (168:132) pra caber fluido no grid de 2
   colunas sem distorcer a curva. */
function fileteCantoPasta(
  vx: number,
  vy: number,
  dirVoltaX: number,
  dirVoltaY: number,
  dirFrenteX: number,
  dirFrenteY: number,
  r: number,
) {
  const cos = dirVoltaX * dirFrenteX + dirVoltaY * dirFrenteY;
  const angulo = Math.acos(Math.max(-1, Math.min(1, cos)));
  const t = r / Math.tan(angulo / 2);
  return {
    inicio: { x: vx + dirVoltaX * t, y: vy + dirVoltaY * t },
    fim: { x: vx + dirFrenteX * t, y: vy + dirFrenteY * t },
  };
}

function contornoPasta({
  w,
  h,
  r,
  chanfroTopo,
  chanfroLateral,
  rChanfro,
}: {
  w: number;
  h: number;
  r: number;
  chanfroTopo: number;
  chanfroLateral: number;
  rChanfro: number;
}) {
  const v1x = w - chanfroTopo;
  const v1y = 0;
  const v2x = w;
  const v2y = chanfroLateral;
  const dx = v2x - v1x;
  const dy = v2y - v1y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;

  const filete1 = fileteCantoPasta(v1x, v1y, -1, 0, ux, uy, rChanfro);
  const filete2 = fileteCantoPasta(v2x, v2y, -ux, -uy, 0, 1, rChanfro);

  const n = (v: number) => Math.round(v * 100) / 100;

  return [
    `M0,${n(r)}`,
    `A${n(r)},${n(r)} 0 0 1 ${n(r)},0`,
    `L${n(filete1.inicio.x)},${n(filete1.inicio.y)}`,
    `A${n(rChanfro)},${n(rChanfro)} 0 0 1 ${n(filete1.fim.x)},${n(filete1.fim.y)}`,
    `L${n(filete2.inicio.x)},${n(filete2.inicio.y)}`,
    `A${n(rChanfro)},${n(rChanfro)} 0 0 1 ${n(filete2.fim.x)},${n(filete2.fim.y)}`,
    `L${n(w)},${n(h - r)}`,
    `A${n(r)},${n(r)} 0 0 1 ${n(w - r)},${n(h)}`,
    `L${n(r)},${n(h)}`,
    `A${n(r)},${n(r)} 0 0 1 0,${n(h - r)}`,
    "Z",
  ].join(" ");
}

/* 🔄 28/08 (correção do Pedro, `pasta3.png` com linha vermelha sobre os
   cards reais) — proporção mais larga/curta (era 168:104 ≈1.6:1, ficou
   180:110 ≈1.64:1, bate com o traçado) e chanfro mais curto nas 2 bordas
   (20% da largura / 27% da altura, não 30%/34%). */
const PASTA_W = 180;
const PASTA_H = 110;
const PASTA_R = 24;
const CAMINHO_PASTA = contornoPasta({
  w: PASTA_W,
  h: PASTA_H,
  r: PASTA_R,
  chanfroTopo: PASTA_W * 0.2,
  chanfroLateral: PASTA_H * 0.27,
  rChanfro: PASTA_R,
});

/* ─── 3. Grid de ações (card ativo, formato pasta) ────────────────────────── */
export function AcoesRapidas() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACOES.map((a, i) => {
        const filtroId = `sombra-acao-${i}`;
        const gradienteId = `gradiente-acao-${i}`;
        return (
          <button key={a.titulo} className="relative text-left" style={{ aspectRatio: `${PASTA_W} / ${PASTA_H}` }}>
            <svg viewBox={`0 0 ${PASTA_W} ${PASTA_H}`} className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <filter id={filtroId} x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="rgba(20,23,18,0.10)" />
                </filter>
                <linearGradient id={gradienteId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-action-primary)" />
                  <stop offset="100%" stopColor="var(--color-action-primary-hover)" />
                </linearGradient>
              </defs>
              <path d={CAMINHO_PASTA} style={{ fill: a.ativo ? `url(#${gradienteId})` : "#FFFFFF" }} filter={`url(#${filtroId})`} />
            </svg>
            <div className={`relative flex h-full flex-col px-4 py-3 ${a.ativo ? "text-text-on-brand" : "text-text-primary"}`}>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  a.ativo ? "bg-white/20" : "bg-surface-alt text-action-primary-sm"
                }`}
              >
                <a.Icone />
              </span>
              <div className="mt-auto">
                <p className="text-caption font-bold">{a.titulo}</p>
                <p className={`text-micro ${a.ativo ? "text-text-on-brand/80" : "text-text-tertiary"}`}>
                  {a.sub}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── 4. Emitir por voz (dark + waveform) ─────────────────────────────────── */
export function EmitirPorVoz() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
        <Mic />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-bold">Emitir por voz</p>
        <p className="text-micro text-text-on-dark/60">Fale o que faturou, a IA monta a nota</p>
      </div>
      <Onda />
    </div>
  );
}

/* ─── 5. Pergunte à IA ────────────────────────────────────────────────────── */
export function PergunteIA() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-action-primary-sm"><Estrela /></span>
        <p className="text-body-strong font-semibold text-text-primary">Pergunte à IA</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {IA.map((q) => (
          <button key={q} className="text-left">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border-hairline bg-surface-card p-3">
              <span className="text-action-primary-sm"><Estrela /></span>
              <p className="mt-3 text-caption font-medium leading-snug text-text-primary">{q}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── 6. Notas recentes (com tags) ────────────────────────────────────────── */
export function NotasRecentes() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Notas recentes</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
      </div>
      <div className="flex flex-col gap-2">
        {NOTAS.map((n) => (
          <div key={n.titulo} className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-caption font-semibold text-text-primary">{n.titulo}</p>
              <p className="text-caption font-semibold text-text-primary">{n.valor}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-micro font-medium text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-micro text-text-tertiary">{n.quando}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── auxiliares ──────────────────────────────────────────────────────────── */
function Onda() {
  const alturas = [8, 14, 20, 12, 22, 16, 10, 18, 24, 14, 8, 16];
  return (
    <div className="flex h-7 items-center gap-[3px]">
      {alturas.map((h, i) => (
        <span key={i} style={{ height: h }} className="w-[3px] rounded-full bg-action-primary" />
      ))}
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function ChevronDireita() {
  return <svg {...ic()}><path d="m9 18 6-6-6-6" /></svg>;
}
function IconeX() {
  return <svg {...ic()} width={16} height={16}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}
function Lupa() {
  return <svg {...ic()} className="text-text-tertiary"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function Mic() {
  return <svg {...ic()}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
}
function Estrela() {
  return <svg {...ic()} width={16} height={16}><path d="M12 3l1.8 4.6L18 9l-3.6 2.7L15 16l-3-2.4L9 16l.6-4.3L6 9l4.2-1.4z" /></svg>;
}
function IconeNota() {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeBanco() {
  return <svg {...ic()}><path d="M3 9 12 4l9 5" /><path d="M5 9v9M10 9v9M14 9v9M19 9v9" /><path d="M3 20h18" /></svg>;
}
function IconeCarteira() {
  return <svg {...ic()}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1.1" /></svg>;
}
function IconePasta() {
  return <svg {...ic()}><path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></svg>;
}
