"use client";

import { useState } from "react";
import Link from "next/link";
import { AcoesRapidas } from "@/components/lab/ref11-blocks";
import { LinhaNota, type Nota } from "@/components/nota-linha";

/**
 * COMPONENTES HÍBRIDOS DA CAMPEÃ — nascem aqui quando o Pedro pede um conteúdo
 * de uma referência com o DESIGN de outra, ou um ajuste na composição. Fonte
 * única, reutilizável.
 */

const CNPJ = "54.321.000/0001-09";

/**
 * Cabeçalho da Campeã: a Saudação (ref7) + 2 pills — o CNPJ (toca e copia, com
 * feedback) e um selo verde de status fiscal. Pedido do Pedro na lapidação.
 */
export function CabecalhoCampea() {
  return (
    <div>
      {/* Saudação PRÓPRIA da campeã (não a `Saudacao` do ref7): o avatar precisa
          ser clicável pra abrir o Perfil, e o ref7 é compartilhado com as outras
          versões + o acervo. Mesmo visual; o avatar virou Link. */}
      <div className="flex items-start justify-between">
        <h1 className="text-h1 leading-tight text-text-primary">
          Bem-vinda de volta,
          <br />
          Ana Beatriz
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          {/* Sino → central de Avisos. Badge coral = há não-lidos. */}
          <Link
            href="/avisos"
            aria-label="Ver avisos"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary transition-colors hover:border-border-strong active:bg-surface-alt"
          >
            <SinoIcone />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-surface-card bg-action-primary" />
          </Link>
          <Link
            href="/perfil"
            aria-label="Ver meu perfil"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark transition-opacity hover:opacity-90"
          >
            AB
          </Link>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PillCnpj />
      </div>
    </div>
  );
}

function SinoIcone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

/** Exportada: a tela de Perfil reusa a mesma pill (fonte única). */
export function PillCnpj() {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(CNPJ)
      .then(() => {
        setCopiado(true);
        window.setTimeout(() => setCopiado(false), 1500);
      })
      .catch(() => {});
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className="flex items-center gap-1.5 rounded-full border border-border-hairline bg-surface-card px-3 py-1.5 text-caption text-text-secondary transition-colors active:bg-surface-alt"
    >
      <span className={copiado ? "text-state-success-text" : "text-text-tertiary"}>
        {copiado ? <IconeCheck /> : <IconeCopiar />}
      </span>
      <span className="font-medium text-text-primary">{CNPJ}</span>
      <span className="text-micro text-text-tertiary">
        {copiado ? "copiado" : "copiar"}
      </span>
    </button>
  );
}

function IconeCopiar() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

/**
 * Grid de ações (ref11) com o título de seção "Atalhos rápidos", no mesmo
 * padrão/fonte do "Notas recentes" (text-body-strong). Pedido do Pedro.
 */
export function AtalhosRapidos() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">
          Atalhos rápidos
        </p>
        <button className="text-caption font-semibold text-action-primary-sm">
          Ver tudo
        </button>
      </div>
      <AcoesRapidas />
    </div>
  );
}

/**
 * "Aprenda com a gente" com o design do print de referência do Pedro: card com
 * GRADIENTE ESCURO de baixo pra cima (a nossa cor escura, mesma família do
 * HeroDark), tag no topo + título/tempo no rodapé em branco. Substitui o
 * BlogCarousel claro (ref5) na Campeã.
 */
/* Overlay COM ALPHA (não sólido): opaco embaixo → o texto fica legível; quase
   transparente em cima → a imagem aparece. Mesma família escura do HeroDark. */
const GRAD_OVERLAY =
  "linear-gradient(to top, rgba(21,23,28,0.96) 0%, rgba(21,23,28,0.72) 42%, rgba(42,46,55,0.18) 100%)";

/* ⚠️ Imagens de MOCK (placeholder externo, precisa de internet). Trocar por
   arte própria em /public quando existir. */
const POSTS_G = [
  {
    titulo: "Entenda o Fator R sem dor de cabeça",
    meta: "3 min de leitura",
    tag: "FISCAL",
    img: "https://picsum.photos/seed/legalizai-fatorr/400/320",
  },
  {
    titulo: "Sua 1ª nota fiscal, passo a passo",
    meta: "2 min de leitura",
    tag: "GUIA",
    img: "https://picsum.photos/seed/legalizai-nota/400/320",
  },
  {
    titulo: "Reforma tributária 2026: o que muda",
    meta: "5 min de leitura",
    tag: "NOVIDADE",
    img: "https://picsum.photos/seed/legalizai-reforma/400/320",
  },
];

export function AprendaGradiente() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">
          Aprenda com a gente
        </p>
        <Link
          href="/blog"
          className="text-caption font-semibold text-action-primary-sm"
        >
          Ver tudo
        </Link>
      </div>
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {POSTS_G.map((p) => (
          <Link key={p.titulo} href="/blog" className="text-left">
            <div
              className="flex h-[168px] w-[190px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-surface-dark p-4 text-text-on-dark"
              style={{
                backgroundImage: `${GRAD_OVERLAY}, url("${p.img}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="self-start rounded-full bg-action-primary px-2.5 py-1 text-micro font-bold text-text-on-brand">
                {p.tag}
              </span>
              <div>
                <p className="text-body font-bold leading-snug">{p.titulo}</p>
                <p className="mt-1 text-micro text-text-on-dark/60">{p.meta}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Notas recentes (conteúdo da ref11) com o DESIGN das Movimentações (ref6):
 * ícone circular escuro + nome/data + valor à direita. Notas = entrada → verde.
 */
const NOTAS: Nota[] = [
  { id: "12", numero: "0012", tomador: "Maria Costa", valor: 120000, data: "há 2h", status: "emitida" },
  { id: "11", numero: "0011", tomador: "João Lima", valor: 300000, data: "28/05", status: "emitida" },
  { id: "10", numero: "0010", tomador: "Rita Souza", valor: 85000, data: "22/05", status: "emitida" },
];

export function NotasRecentesMov() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">
          Notas recentes
        </p>
        <button className="text-caption font-semibold text-action-primary-sm">
          Ver tudo
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {NOTAS.map((n) => (
          <LinhaNota key={n.id} nota={n} statusNoTexto={false} />
        ))}
      </div>
    </div>
  );
}
