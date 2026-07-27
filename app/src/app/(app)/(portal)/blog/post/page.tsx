"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { postPorId, sugeridos, type Post } from "../dados";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG · leitura do post (27/07) — ref. print 2 (hero + sheet), remixada.
 * ═══════════════════════════════════════════════════════════════════════════
 * Orientação do Pedro sobre a referência:
 *   · Imagem em DESTAQUE no topo (full-bleed), com voltar + curtir, igual ao
 *     print. Mais um CTA de COMPARTILHAR discreto (review não entra agora).
 *   · O corpo do post no MEIO.
 *   · O carrossel que no print fica em cima ("Upcoming tours") vai pro FIM,
 *     como POSTS SUGERIDOS.
 *
 * `?id=` via useSearchParams (dentro de Suspense — exigência do App Router);
 * sem id → cai no 1º post. Drill-down (sem navbar; o back é o do hero).
 * ⚠️ Imagem = picsum mock · conteúdo = farol.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const GRAD =
  "linear-gradient(to top, rgba(21,23,28,0.55) 0%, rgba(21,23,28,0.10) 40%, rgba(21,23,28,0.28) 100%)";

export default function PostPage() {
  return (
    <Suspense fallback={<div className="app-main" />}>
      <PostConteudo />
    </Suspense>
  );
}

function PostConteudo() {
  const params = useSearchParams();
  const post = postPorId(params.get("id"));
  const relacionados = sugeridos(post.id);

  return (
    <main className="app-main">
      {/* O SCROLL leva o -mx-6 (box = largura total do app-page), pra o hero
          sangrar de borda a borda: com o -mx-6 no filho, o overflow-x:auto
          implícito do container recortava 24px de cada lado. marginTop negativo
          cancela o padding-top de safe-area do shell, pra a imagem transbordar
          até o topo do vidro. Em browser comum --safe-top=0 → inócuo. */}
      <div
        className="-mx-6 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ marginTop: "calc(-1 * var(--safe-top))" }}
      >
        {/* HERO full-bleed (largura total + alto) + ações sobrepostas */}
        <div className="relative">
          <div
            className="h-[48dvh] min-h-[340px] w-full"
            style={{
              backgroundImage: `${GRAD}, url("${post.img}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-4"
            style={{ paddingTop: "calc(var(--safe-top) + 14px)" }}
          >
            <Link
              href="/blog"
              aria-label="Voltar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-page/90 text-text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-page"
            >
              <IconeVoltar />
            </Link>
            <div className="flex items-center gap-2">
              <Compartilhar titulo={post.titulo} />
              <Curtir />
            </div>
          </div>
        </div>

        {/* CORPO — sheet arredondado que sobe sobre a imagem (ref. print 2).
            Sem -mx-6: o scroll já é largura total, então o px-6 aqui insere o
            texto e o bg/rounded ocupam a largura toda. */}
        <article
          className="relative -mt-20 rounded-t-[28px] bg-surface-page px-6 pt-3"
          style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
        >
          {/* grabber da referência */}
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-strong/70" />
          <span className="text-micro font-bold uppercase tracking-wide text-action-primary-sm">
            {post.categoria}
          </span>
          <h1 className="mt-1.5 text-h1 leading-tight text-text-primary">
            {post.titulo}
          </h1>
          <p className="mt-2 text-micro text-text-tertiary">
            {post.tempo} · {post.data}
          </p>

          <p className="mt-4 text-body font-medium text-text-secondary">
            {post.resumo}
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {post.corpo.map((par, i) => (
              <p key={i} className="text-body leading-relaxed text-text-primary">
                {par}
              </p>
            ))}
          </div>

          {/* Assinatura de confiança */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-surface-tint-brand p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
              <IconeCoracaoCheio />
            </span>
            <p className="text-caption text-text-secondary">
              Escrito pelo time de contadores da Legalizai. Dúvida no seu caso?
              <Link href="/mais" className="font-semibold text-action-primary-sm">
                {" "}
                Fala com a gente no WhatsApp.
              </Link>
            </p>
          </div>

          {/* POSTS SUGERIDOS — o carrossel que no print fica em cima, agora no fim */}
          <div className="mt-8">
            <p className="mb-2 text-body-strong font-semibold text-text-primary">
              Leia também
            </p>
            <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {relacionados.map((p) => (
                <SugeridoCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

/* ─── Curtir (toggle) ──────────────────────────────────────────────────────── */
function Curtir() {
  const [curtido, setCurtido] = useState(false);
  return (
    <button
      type="button"
      aria-label={curtido ? "Descurtir" : "Curtir"}
      aria-pressed={curtido}
      onClick={() => setCurtido((v) => !v)}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-page/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-page"
    >
      {curtido ? (
        <span className="text-state-danger-text">
          <IconeCoracaoCheio />
        </span>
      ) : (
        <span className="text-text-primary">
          <IconeCoracao />
        </span>
      )}
    </button>
  );
}

/* ─── Compartilhar (discreto) ──────────────────────────────────────────────── */
function Compartilhar({ titulo }: { titulo: string }) {
  const [feito, setFeito] = useState(false);
  const compartilhar = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setFeito(true);
      window.setTimeout(() => setFeito(false), 1500);
    } catch {
      /* cancelado/indisponível — silencioso */
    }
  };
  return (
    <button
      type="button"
      aria-label="Compartilhar"
      onClick={compartilhar}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-page/90 text-text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-page"
    >
      {feito ? <IconeCheck /> : <IconeCompartilhar />}
    </button>
  );
}

/* ─── Card de post sugerido ────────────────────────────────────────────────── */
function SugeridoCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/post?id=${p.id}`} className="w-[68%] shrink-0 snap-start">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
        <span
          className="h-28 w-full bg-surface-alt"
          style={{
            backgroundImage: `url("${p.img}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="flex flex-1 flex-col p-3">
          <span className="text-micro font-semibold text-action-primary-sm">
            {p.categoria}
          </span>
          <p className="mt-0.5 line-clamp-2 flex-1 text-caption font-semibold text-text-primary">
            {p.titulo}
          </p>
          <p className="mt-1.5 text-micro text-text-tertiary">{p.tempo}</p>
        </div>
      </div>
    </Link>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeVoltar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function IconeCoracao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7-4.5-9-9c-1.5-3.5 1-6.5 4-6.5 2 0 3.5 1.5 5 3.5 1.5-2 3-3.5 5-3.5 3 0 5.5 3 4 6.5-2 4.5-9 9-9 9z" />
    </svg>
  );
}
function IconeCoracaoCheio() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 20s-7-4.5-9-9c-1.5-3.5 1-6.5 4-6.5 2 0 3.5 1.5 5 3.5 1.5-2 3-3.5 5-3.5 3 0 5.5 3 4 6.5-2 4.5-9 9-9 9z" />
    </svg>
  );
}
function IconeCompartilhar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
