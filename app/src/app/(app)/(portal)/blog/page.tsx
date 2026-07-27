"use client";

import Link from "next/link";
import { useState } from "react";
import { TelaHeader } from "@/components/ui/tela";
import { CATEGORIAS, POSTS, type Post } from "./dados";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG · home dos posts (27/07) — ref. visual TripGlide. Drill-down de /home.
 * ═══════════════════════════════════════════════════════════════════════════
 * A "home" do "Aprenda com a gente". Traduz a referência:
 *   · Busca + chips de CATEGORIA (no lugar dos continentes) — o chip ativo é a
 *     pílula escura, filtra a lista.
 *   · Carrossel-HERÓI (os posts em destaque) = o card grande da ref, com imagem,
 *     categoria, título, tempo de leitura e "Ler post" → abre a leitura.
 *   · Abaixo, a LISTA de todas as publicações (pedido do Pedro), filtrada pelo
 *     chip + busca.
 *
 * ⚠️ Imagens = picsum mock (igual AprendaGradiente). Conteúdo = farol.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const GRAD =
  "linear-gradient(to top, rgba(21,23,28,0.94) 4%, rgba(21,23,28,0.55) 46%, rgba(42,46,55,0.10) 100%)";

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function BlogPage() {
  const [cat, setCat] = useState("Todos");
  const [busca, setBusca] = useState("");

  const destaques = POSTS.filter((p) => p.destaque);

  const termo = norm(busca.trim());
  const lista = POSTS.filter((p) => {
    const okCat = cat === "Todos" || p.categoria === cat;
    const okBusca =
      termo === "" || norm(`${p.titulo} ${p.resumo} ${p.categoria}`).includes(termo);
    return okCat && okBusca;
  });

  return (
    <>
      <TelaHeader meta="Aprenda com a gente" voltar="/home-campea" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-5 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Aprenda com a gente</h1>
              <p className="mt-1 text-body text-text-secondary">
                Guias e novidades pra entender sua empresa sem juridiquês.
              </p>
            </div>

            {/* Busca (ref) */}
            <div className="flex items-center gap-2 rounded-2xl border border-border-hairline bg-surface-card px-3.5 focus-within:border-border-focus">
              <span className="shrink-0 text-text-tertiary">
                <IconeLupa />
              </span>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar publicação"
                aria-label="Buscar publicação"
                className="w-full bg-transparent py-3 text-body text-text-primary outline-none placeholder:text-text-muted"
              />
              {busca && (
                <button
                  type="button"
                  aria-label="Limpar"
                  onClick={() => setBusca("")}
                  className="shrink-0 text-text-tertiary hover:text-text-primary"
                >
                  <IconeX />
                </button>
              )}
            </div>

            {/* Chips de categoria */}
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIAS.map((c) => {
                const ativo = c === cat;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    aria-pressed={ativo}
                    className={`shrink-0 rounded-full px-4 py-2 text-caption font-semibold transition-colors ${
                      ativo
                        ? "bg-surface-dark text-text-on-dark"
                        : "border border-border-hairline text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Carrossel-herói (destaques) — só quando não está buscando/filtrando */}
            {cat === "Todos" && busca === "" && (
              <div>
                <p className="mb-2 text-body-strong font-semibold text-text-primary">
                  Em destaque
                </p>
                <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {destaques.map((p) => (
                    <HeroCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Lista de publicações */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                {cat === "Todos" && busca === "" ? "Todas as publicações" : "Resultados"}
              </p>
              {lista.length === 0 ? (
                <p className="py-10 text-center text-caption text-text-tertiary">
                  Nada encontrado. Tenta outra busca ou categoria.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {lista.map((p) => (
                    <PostLinha key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Card-herói do carrossel (o card grande da ref) ───────────────────────── */
function HeroCard({ p }: { p: Post }) {
  return (
    <Link
      href={`/blog/post?id=${p.id}`}
      className="w-[82%] shrink-0 snap-start"
    >
      <div
        className="flex h-[300px] flex-col justify-end overflow-hidden rounded-3xl bg-surface-dark p-5 text-text-on-dark"
        style={{
          backgroundImage: `${GRAD}, url("${p.img}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span className="mb-2 self-start rounded-full bg-action-primary px-2.5 py-1 text-micro font-bold text-text-on-brand">
          {p.categoria}
        </span>
        <p className="text-h2 font-bold leading-tight">{p.titulo}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-micro text-text-on-dark/70">{p.tempo}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-caption font-semibold backdrop-blur-sm">
            Ler post
            <IconeSeta />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Linha da lista (thumbnail + meta) ────────────────────────────────────── */
function PostLinha({ p }: { p: Post }) {
  return (
    <Link
      href={`/blog/post?id=${p.id}`}
      className="relative flex items-stretch overflow-hidden rounded-2xl border border-border-hairline bg-surface-card transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      {/* imagem transborda esquerda/topo/base (cantos recortados pelo card);
          direita é reta, encostando no texto. */}
      <span
        className="w-24 shrink-0 self-stretch bg-surface-alt"
        style={{
          backgroundImage: `url("${p.img}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      {/* filete coral na divisa imagem × card (detalhe) */}
      <span
        className="pointer-events-none absolute left-24 top-1/2 h-[30%] w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action-primary"
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-3.5 pr-3">
        <div className="min-w-0 flex-1">
          <span className="text-micro font-semibold text-action-primary-sm">
            {p.categoria}
          </span>
          <p className="mt-0.5 line-clamp-2 text-caption font-semibold text-text-primary">
            {p.titulo}
          </p>
          <p className="mt-1 text-micro text-text-tertiary">
            {p.tempo} · {p.data}
          </p>
        </div>
        <span className="shrink-0 text-text-tertiary">
          <IconeChevron />
        </span>
      </div>
    </Link>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
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
function IconeSeta() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
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
