"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHELL DO PORTAL (dia-2) — a nav que o (app)/layout adiou até existir spec.
 * ═══════════════════════════════════════════════════════════════════════════
 * O (app)/layout.tsx dizia: "a nav persistente NÃO está aqui ainda... o portal
 * ainda não tem spec... o route group já reserva o lugar dela pra quando o
 * requisito existir." O requisito nasceu com a matriz-portal-interno.md (22/07).
 *
 * ─── POR QUE UM SUB-SHELL, E NÃO no (app) ───────────────────────────────────
 * O (app) hospeda a cauda LINEAR da abertura (painel/termo/assinatura/ativa —
 * você não pode "pular de aba" no meio de constituir) E o PORTAL navegável. A
 * barra só pode viver no portal → ele é um route group próprio dentro do (app).
 * A fronteira é o N24: "Ir pro meu painel" ENTRA aqui, e a barra aparece.
 *
 * ─── NAVBAR FLUTUANTE + CTA CENTRAL ELEVADO (ref. do Pedro 22/07) ───────────
 * Pílula flutuante (margem das bordas, cantos arredondados, sombra) com um
 * botão ELEVADO no meio = a AÇÃO principal: **Emitir NF-e**. É ação, não seção,
 * então ocupa o slot central e sobe metade pra fora (o "notch" do print). As 4
 * SEÇÕES ficam 2 à esquerda, 2 à direita: Início · Impostos | Notas · Mais.
 * Pró-labore sai da barra (abre o slot central pra ação; segue como atalho no
 * Início e mora no Mais).
 *
 * A sombra aqui é LEGÍTIMA (design-system §1: "sombra só onde algo flutua de
 * verdade" — e a barra flutua). Coral do CTA = ação (600), não a marca (500).
 * Mantivemos os RÓTULOS nas abas (o print é sem, mas nosso ICP abre a 1ª
 * empresa: ícone-só confunde leigo — UX-12). Fácil tirar se o Pedro preferir.
 *
 * ─── DOIS MODELOS DE "VOLTAR" ───────────────────────────────────────────────
 *   · entre seções = troca de aba.  · num detalhe = seta "voltar" (TelaHeader).
 * A barra aparece só nas telas-RAIZ; no detalhe some e o back assume.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// 4 abas + o CTA central (Emitir NF-e). Pró-labore sai da barra pra abrir o
// slot central pra AÇÃO — o padrão do print (navbar flutuante, botão no meio).
const ABAS: { href: string; label: string; Icone: () => ReactNode }[] = [
  { href: "/inicio", label: "Início", Icone: IconeInicio },
  { href: "/impostos", label: "Impostos", Icone: IconeImpostos },
  { href: "/notas", label: "Notas", Icone: IconeNotas },
  { href: "/mais", label: "Mais", Icone: IconeMais },
];

// A barra só nas telas-raiz. /pro-labore + as versões da Início (exploração)
// entram como raiz pra mostrar a barra. Detalhe (ex: /impostos/pagar) esconde.
const RAIZES = new Set([
  ...ABAS.map((a) => a.href),
  "/pro-labore",
  "/inicio-v2",
  "/inicio-v3",
  "/inicio-v4",
  "/inicio-ref5",
  "/inicio-ref6",
  "/inicio-ref7",
  "/inicio-ref9",
  "/inicio-ref11",
  "/inicio-ref12",
  "/mais-v1",
  "/mais-v2",
  "/mais-completa",
  "/obrigacoes",
  "/impostos-v1",
  "/impostos-v2",
  "/impostos-completa",
  "/componentes",
]);

export default function PortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mostrarAbas = RAIZES.has(pathname);
  return (
    <>
      {children}
      {mostrarAbas && <BarraAbas pathname={pathname} />}
    </>
  );
}

function BarraAbas({ pathname }: { pathname: string }) {
  // Lembra a ÚLTIMA rota visitada de cada aba (por iframe, via sessionStorage).
  // Sem isso, no laboratório trocar de aba e voltar caía na home canônica
  // (/inicio) em vez da VERSÃO que estava sendo revisada (ex: /inicio-ref6).
  // No app real (sem rotas -v/-ref) o valor guardado é só "/inicio" → inócuo.
  const router = useRouter();
  // Só ESCREVE a última rota da aba atual (external system, sem setState → sem
  // cascading render). A leitura acontece no clique, sempre fresca.
  useEffect(() => {
    const atual = ABAS.find((a) => pathname.startsWith(a.href));
    if (atual) {
      try {
        sessionStorage.setItem(`lab:${atual.href}`, pathname);
      } catch {
        // sessionStorage indisponível: navegação cai no href canônico.
      }
    }
  }, [pathname]);

  const ir = (base: string) => {
    let destino = base;
    try {
      destino = sessionStorage.getItem(`lab:${base}`) || base;
    } catch {
      destino = base;
    }
    router.push(destino);
  };

  const esquerda = ABAS.slice(0, 2);
  const direita = ABAS.slice(2);
  return (
    // Wrapper transparente: dá a margem lateral (flutua), reserva o topo pra o
    // CTA elevado (pt-7 = a protrusão) e respeita o home-indicator (var safe,
    // não env — pra o /mockup conseguir simular o inset, igual ao footer-cta).
    <div
      className="relative shrink-0 px-4 pt-7"
      style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}
    >
      <nav className="relative flex h-16 items-stretch rounded-[28px] border border-border-hairline bg-surface-card shadow-lg">
        {esquerda.map((a) => (
          <Aba key={a.href} a={a} pathname={pathname} onIr={ir} />
        ))}

        {/* vão central: o CTA elevado ocupa este espaço (absoluto, por cima) */}
        <div className="w-16 shrink-0" aria-hidden />

        {direita.map((a) => (
          <Aba key={a.href} a={a} pathname={pathname} onIr={ir} />
        ))}

        {/* CTA ELEVADO — Emitir NF-e. Sobe metade pra fora da barra (o notch do
            print). → /notas por ora (a emissão P6 mora lá; vira /emitir depois). */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/notas"
            aria-label="Emitir nota fiscal"
            className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-action-primary text-text-on-brand shadow-lg transition-colors hover:bg-action-primary-hover active:bg-action-primary-hover"
          >
            <IconeEmitir />
          </Link>
        </div>
      </nav>
    </div>
  );
}

function Aba({
  a,
  pathname,
  onIr,
}: {
  a: (typeof ABAS)[number];
  pathname: string;
  onIr: (base: string) => void;
}) {
  const { Icone, label } = a;
  // Ativa pela BASE (/inicio cobre as versões /inicio-v1…); a navegação (onIr)
  // resolve a última versão visitada daquela aba.
  const ativo = pathname.startsWith(a.href);
  return (
    <button
      type="button"
      onClick={() => onIr(a.href)}
      aria-current={ativo ? "page" : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
        ativo ? "text-text-primary" : "text-text-tertiary"
      }`}
    >
      {/* filete de aba ativa (indicador do print), sem pular layout */}
      <span
        className={`h-1 w-5 rounded-full ${ativo ? "bg-text-primary" : "bg-transparent"}`}
      />
      <Icone />
      <span className={`text-micro ${ativo ? "font-semibold" : ""}`}>{label}</span>
    </button>
  );
}

/* ─── Ícones da barra — traço, currentColor (a cor vem do estado da aba) ────── */

function svgProps() {
  return {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function IconeInicio() {
  return (
    <svg {...svgProps()}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
    </svg>
  );
}

function IconeImpostos() {
  return (
    <svg {...svgProps()}>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
      <path d="M3 20h18" />
    </svg>
  );
}

function IconeNotas() {
  return (
    <svg {...svgProps()}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h5" />
    </svg>
  );
}

function IconeMais() {
  return (
    <svg {...svgProps()}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

/* CTA central: nota + "novo". Traço branco (text-on-brand) sobre o coral. */
function IconeEmitir() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M12 11.5v5M9.5 14h5" />
    </svg>
  );
}
