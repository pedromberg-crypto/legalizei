"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ImagemZoom — documento inteiro na tela, com zoom no ponto que importa
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 03/09 (pedido do Pedro) — nasceu na guia do IPTU (sheet do índice
 * cadastral da C4). A 1ª versão mostrava só a faixa recortada com o número, e
 * ele derrubou por um motivo prático: **a pessoa precisa reconhecer a folha
 * inteira pra saber que é aquele papel** — mesmo pequena. Recorte sozinho
 * responde "onde fica" pra quem já sabe qual documento é.
 *
 * Então a foto entra encaixada, completa, e a pill de zoom faz o resto: um
 * toque aproxima no ponto exato (`foco`), outro devolve a folha inteira.
 *
 * O ponto de foco (`focoX`/`focoY`, em % da própria imagem) é MEDIDO no
 * arquivo, não chutado no olho (doutrina do encaixe de asset:
 * `legalize-encaixe-asset-medido-nao-no-olho`).
 *
 * 🐛 03/09 — a 1ª versão usava só `transform-origin` no ponto de foco. Isso
 * ANCORA o ponto onde ele já estava (a 14% da largura, ou seja, colado na
 * borda esquerda) em vez de trazê-lo pro meio. O certo é origem no centro +
 * `translate` da distância entre o foco e o centro: aí o que a pessoa quer
 * ver aparece no meio do quadro.
 */
export function ImagemZoom({
  src,
  alt,
  largura,
  altura,
  focoX,
  focoY,
  escala = 2.4,
  rotuloZoom = "Zoom",
  rotuloVoltar = "Ver a folha toda",
}: {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** Ponto que o zoom traz PRO CENTRO, em % da imagem (0-100). */
  focoX: number;
  focoY: number;
  escala?: number;
  rotuloZoom?: string;
  rotuloVoltar?: string;
}) {
  const [ampliado, setAmpliado] = useState(false);

  // Distância do foco até o centro, nas coordenadas da própria imagem. O
  // `translate` roda ANTES do `scale` (transform lê da direita pra esquerda),
  // então a conta não muda com o fator de zoom.
  const dx = 50 - focoX;
  const dy = 50 - focoY;

  return (
    <div className="relative overflow-hidden rounded-md border border-border-hairline bg-surface-card">
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        className="h-auto w-full transition-transform duration-300 ease-out"
        style={{
          transform: ampliado
            ? `scale(${escala}) translate(${dx}%, ${dy}%)`
            : "scale(1)",
          transformOrigin: "center",
        }}
      />

      {/* A pill fica DENTRO da imagem, no canto: é ação sobre ela, não sobre
          o sheet. Fundo sólido porque ela pousa em cima de papel branco e de
          traço colorido, e precisa ser legível nos dois. */}
      <button
        type="button"
        onClick={() => setAmpliado((v) => !v)}
        aria-pressed={ampliado}
        /* 🔄 03/09 (pedido do Pedro) — +20%: a pill some em cima da folha
           num aparelho pequeno, e ela é a única affordance de zoom. */
        className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-text-primary/85 px-3 py-1.5 text-caption font-semibold text-text-on-brand backdrop-blur-sm"
      >
        <IconeLupa ampliado={ampliado} />
        {ampliado ? rotuloVoltar : rotuloZoom}
      </button>
    </div>
  );
}

function IconeLupa({ ampliado }: { ampliado: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
      {/* "+" quando dá pra aproximar, "−" quando já está aproximado. */}
      <path d="M8 11h6" />
      {!ampliado && <path d="M11 8v6" />}
    </svg>
  );
}
