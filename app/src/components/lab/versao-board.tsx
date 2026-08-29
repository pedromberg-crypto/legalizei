"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VERSAO-BOARD — laboratório de versões de página (exploração de layout)
 * ═══════════════════════════════════════════════════════════════════════════
 * Padrão do Pedro (22/07): TODAS as explorações num board só (/mockup-inicio),
 * EMPILHADAS — cada referência de página é uma SEÇÃO (BoardSecao) com suas
 * versões lado a lado; as novas descem no fim. Cada versão é uma rota (vive no
 * shell do portal → já vem com A NAVBAR que a gente construiu). Injeta o inset
 * do 15 Pro Max pra a navbar flutuar certo. `statusClaro` = relógio branco
 * (seções com topo escuro).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const W = 430;
const H = 932;
const SAFE_TOP = 59;
const SAFE_BOTTOM = 34;

export type Versao = {
  rota: string;
  v: string;
  titulo: string;
  nota: string;
  /** true = já lapidada (componentes salvos no acervo) → ✓ verde no nome. */
  feito?: boolean;
};

/** Moldura da página do laboratório: cabeçalho + as seções empilhadas. */
export function BoardPagina({
  eyebrow,
  titulo,
  subtitulo,
  children,
}: {
  eyebrow: string;
  titulo: string;
  subtitulo: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <header className="mb-10">
          <p className="text-micro text-text-tertiary mb-1">{eyebrow}</p>
          <h1 className="text-h1 text-text-primary">{titulo}</h1>
          <p className="text-body text-text-secondary mt-2 max-w-[64ch]">
            {subtitulo}
          </p>
        </header>
        <div className="flex flex-col gap-14">{children}</div>
      </div>
    </div>
  );
}

/** Uma seção = uma referência de página, com suas versões lado a lado. */
export function BoardSecao({
  titulo,
  subtitulo,
  versoes,
  statusClaro = false,
  escala = 0.75,
}: {
  titulo: string;
  subtitulo?: ReactNode;
  versoes: Versao[];
  statusClaro?: boolean;
  escala?: number;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-h2 text-text-primary">{titulo}</h2>
        {subtitulo && (
          <p className="text-caption text-text-secondary mt-1 max-w-[72ch]">
            {subtitulo}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-x-10 gap-y-8">
        {versoes.map((ver) => (
          <VersaoPhone
            key={ver.rota}
            ver={ver}
            statusClaro={statusClaro}
            escala={escala}
          />
        ))}
      </div>
    </section>
  );
}

function VersaoPhone({
  ver,
  statusClaro,
  escala,
}: {
  ver: Versao;
  statusClaro: boolean;
  escala: number;
}) {
  return (
    <figure className="flex shrink-0 flex-col items-center gap-4">
      <div style={{ width: (W + 24) * escala, height: (H + 24) * escala }}>
        <div
          style={{
            width: W + 24,
            height: H + 24,
            transform: `scale(${escala})`,
            transformOrigin: "top left",
          }}
        >
          <Aparelho src={ver.rota} statusClaro={statusClaro} />
        </div>
      </div>

      <figcaption className="max-w-[300px] text-center">
        <p className="flex items-center justify-center gap-1.5 text-body font-semibold text-text-primary">
          {ver.feito && <CheckVerde />}
          {ver.v} · {ver.titulo}
        </p>
        <p className="text-caption text-text-secondary mt-2">{ver.nota}</p>
      </figcaption>
    </figure>
  );
}

/**
 * 🆕 28/08 (pedido do Pedro) — versão SOLTA: em vez de `rota` (iframe pra uma
 * página de produção, ainda navegável de verdade), recebe a VIEW já
 * desconectada — sem router, sem `onSeguir`/`onVoltar` reais, só a casca
 * visual pra olhar. Pra grupos de telas DIFERENTES lado a lado (não variações
 * da mesma tela), que é o caso da seção "Teste".
 */
export type VersaoSolta = {
  titulo: string;
  nota: string;
  /** true = já lapidada (componentes salvos no acervo) → ✓ verde no nome. */
  feito?: boolean;
  render: () => ReactNode;
  /**
   * 🔧 28/08 (correção do Pedro: "borda estranha" nas telas de referência) —
   * `.app-page` tem `padding-inline: 24px` + `padding-top: var(--safe-top)`
   * embutidos (globals.css), pensados pra views de PRODUÇÃO que NÃO pintam
   * o próprio fundo (confiam no `body` por trás). Views que JÁ implementam
   * casca própria full-bleed (fundo, header e safe-area tratados por conta
   * própria — caso de `referencia-interior-v1.tsx`) ficavam com uma faixa do
   * fundo ERRADO (o `bg-surface-page` da moldura) vazando nesse padding, à
   * mostra como uma borda. `semAppPage: true` pula o wrapper `.app-page` e
   * deixa a view ocupar o aparelho inteiro, sem inset nenhum por fora.
   */
  semAppPage?: boolean;
};

/** Como `BoardSecao`, mas cada versão é renderizada solta (ver `VersaoSolta`). */
export function BoardSecaoSolta({
  titulo,
  extra,
  subtitulo,
  versoes,
  statusClaro = false,
  escala = 0.75,
}: {
  titulo: string;
  /** 🆕 28/08 — acessório ao lado do título (ex: indicador claro/escuro). */
  extra?: ReactNode;
  subtitulo?: ReactNode;
  versoes: VersaoSolta[];
  statusClaro?: boolean;
  escala?: number;
}) {
  return (
    <section>
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-h2 text-text-primary">{titulo}</h2>
          {extra}
        </div>
        {subtitulo && (
          <p className="text-caption text-text-secondary mt-1 max-w-[72ch]">
            {subtitulo}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-x-10 gap-y-8">
        {versoes.map((ver, i) => (
          <VersaoSoltaPhone key={i} ver={ver} statusClaro={statusClaro} escala={escala} />
        ))}
      </div>
    </section>
  );
}

function VersaoSoltaPhone({
  ver,
  statusClaro,
  escala,
}: {
  ver: VersaoSolta;
  statusClaro: boolean;
  escala: number;
}) {
  return (
    <figure className="flex shrink-0 flex-col items-center gap-4">
      <div style={{ width: (W + 24) * escala, height: (H + 24) * escala }}>
        <div
          style={{
            width: W + 24,
            height: H + 24,
            transform: `scale(${escala})`,
            transformOrigin: "top left",
          }}
        >
          <MolduraAparelho statusClaro={statusClaro}>
            {ver.semAppPage ? (
              ver.render()
            ) : (
              /* `.app-page` usa height:100dvh (viewport) — aqui vira 100% da
                 moldura, mesmo truque do /apresentacao. */
              <div className="app-page" style={{ height: "100%" }}>
                {ver.render()}
              </div>
            )}
          </MolduraAparelho>
        </div>
      </div>

      <figcaption className="max-w-[300px] text-center">
        <p className="flex items-center justify-center gap-1.5 text-body font-semibold text-text-primary">
          {ver.feito && <CheckVerde />}
          {ver.titulo}
        </p>
        <p className="text-caption text-text-secondary mt-2">{ver.nota}</p>
      </figcaption>
    </figure>
  );
}

/** ✓ verde = versão já lapidada (componentes salvos no acervo). */
function CheckVerde() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-state-success"
      aria-label="lapidada"
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * MOLDURA do 15 Pro Max SEM iframe — mesma casca visual do `Aparelho`, mas o
 * conteúdo entra como children e roda no MESMO React tree do pai. Nasceu pra
 * /apresentacao (28/07): lá o painel de explicação precisa reagir ao estado da
 * tela, e iframe isola o estado. Injeta os insets como CSS vars locais, então
 * `.app-page`/`.app-footer-cta` leem os mesmos 59/34 do board.
 */
export function MolduraAparelho({
  children,
  statusClaro = false,
}: {
  children: ReactNode;
  statusClaro?: boolean;
}) {
  return (
    <div
      className="relative p-3"
      style={{
        width: "fit-content",
        borderRadius: 60,
        background: "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      <div
        className="relative overflow-hidden bg-surface-page"
        style={
          {
            width: W,
            height: H,
            borderRadius: 52,
            "--safe-top": `${SAFE_TOP}px`,
            "--safe-bottom": `${SAFE_BOTTOM}px`,
          } as React.CSSProperties
        }
      >
        {children}

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[54px] items-center justify-between px-6 ${
            statusClaro ? "text-white" : "text-black"
          }`}
        >
          <span className="text-[15px] font-semibold tracking-[-.2px]">9:41</span>
          <span className="text-[13px]">●●●</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
          <div className="h-[37px] w-[125px] rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function Aparelho({ src, statusClaro }: { src: string; statusClaro: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);

  // Injeta o inset do aparelho no doc do iframe (mesma origem). Sem isso o env()
  // lê 0: a navbar colava embaixo e o header não subia sob a status bar.
  const aplicar = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.head) return;
    let tag = doc.getElementById("mk-insets") as HTMLStyleElement | null;
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "mk-insets";
      doc.head.appendChild(tag);
    }
    tag.textContent = `:root:root{--safe-top:${SAFE_TOP}px;--safe-bottom:${SAFE_BOTTOM}px}`;
  }, []);

  useEffect(() => {
    aplicar();
  }, [aplicar]);

  return (
    <div
      className="relative p-3"
      style={{
        width: "fit-content",
        borderRadius: 60,
        background: "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      <div
        className="relative overflow-hidden bg-white"
        style={{ width: W, height: H, borderRadius: 52 }}
      >
        <iframe
          ref={ref}
          src={src}
          title={src}
          onLoad={aplicar}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />

        {/* status bar: branca sobre topo escuro, preta sobre topo claro */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[54px] items-center justify-between px-6 ${
            statusClaro ? "text-white" : "text-black"
          }`}
        >
          <span className="text-[15px] font-semibold tracking-[-.2px]">9:41</span>
          <span className="text-[13px]">●●●</span>
        </div>
        {/* dynamic island */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
          <div className="h-[37px] w-[125px] rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
