"use client";

/**
 * COMPONENTES VALIDADOS DA ref7 (saúde). Fonte única.
 * saudação · search-serviço · chips-categoria · card marketing · checklist compliance.
 */

const CATS = ["Notas", "Impostos", "Pró-labore", "Documentos", "Relatórios"];

const COMPLIANCE = [
  { nome: "Declarações do mês", sub: "Entregues pela gente", estado: "ok" },
  { nome: "DAS", sub: "Em dia até junho", estado: "ok" },
  { nome: "Certificado digital", sub: "Precisa fazer", estado: "pendente" },
];

/* ─── 1. Saudação + avatar ────────────────────────────────────────────────── */
export function Saudacao() {
  return (
    <div className="flex items-start justify-between">
      <h1 className="text-h1 leading-tight text-text-primary">
        Bem-vinda de volta,
        <br />
        Ana Beatriz
      </h1>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
        AB
      </span>
    </div>
  );
}

/* ─── 2. Search bar (botão dark) ──────────────────────────────────────────── */
export function SearchServico() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-surface-alt p-1.5 pl-4">
      <span className="flex-1 text-caption text-text-muted">Buscar um serviço</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dark text-text-on-dark">
        <Lupa />
      </span>
    </div>
  );
}

/* ─── 3. Chips de categoria ───────────────────────────────────────────────── */
export function CategoriaChips() {
  return (
    <div className="-mx-6 flex items-center gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
        <Filtro />
      </span>
      {CATS.map((c) => (
        <span
          key={c}
          className="shrink-0 rounded-full border border-border-hairline bg-surface-card px-4 py-2 text-caption font-medium text-text-primary"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

/* ─── 4. Card de marketing (indique e ganhe) ──────────────────────────────── */
export function IndiqueGanhe() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-dark p-4 text-text-on-dark">
      <div className="min-w-0">
        <p className="text-body font-bold">Indique e ganhe 🎁</p>
        <p className="mt-0.5 text-caption text-text-on-dark/70">
          Cada amigo que abrir empresa vira 1 mês grátis pra você.
        </p>
        <button className="mt-2 text-caption font-semibold text-action-primary">Como funciona</button>
      </div>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-action-primary text-text-on-brand">
        <Presente />
      </span>
    </div>
  );
}

/* ─── 5. Checklist de compliance (Sua situação) ───────────────────────────── */
export function SuaSituacao() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">Sua situação</p>
        <button className="text-caption font-semibold text-action-primary-sm">Ver tudo</button>
      </div>
      <div className="flex flex-col gap-2">
        {COMPLIANCE.map((c) => {
          const ok = c.estado === "ok";
          return (
            <div key={c.nome} className="flex items-center gap-3 rounded-2xl bg-surface-alt p-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  ok
                    ? "bg-state-success-tint text-state-success-text"
                    : "bg-state-warning-tint text-state-warning-text"
                }`}
              >
                {ok ? <Check /> : <Alerta />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-text-primary">{c.nome}</p>
                <p className="mt-0.5 text-micro text-text-tertiary">{c.sub}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-micro font-semibold ${
                  ok
                    ? "bg-state-success-tint text-state-success-text"
                    : "bg-state-warning-tint text-state-warning-text"
                }`}
              >
                {ok ? "Em dia" : "Pendente"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ícones ──────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function Lupa() {
  return <svg {...ic()} width={20} height={20}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function Filtro() {
  return <svg {...ic()}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
}
function Presente() {
  return <svg {...ic()} width={26} height={26}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v9h14v-9M12 8v13" /><path d="M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z" /></svg>;
}
function Check() {
  return <svg {...ic()}><path d="m6 12 4 4 8-9" /></svg>;
}
function Alerta() {
  return <svg {...ic()}><path d="M12 9v4M12 17v.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>;
}
