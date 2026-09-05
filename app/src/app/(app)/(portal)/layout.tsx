"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { comRegime } from "@/lib/regime";

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
 *
 * 🆕 04/08 — Plano MEI (`?regime=mei`) esconde a aba **Impostos**: não existe
 * dashboard fiscal pro MEI (DAS-MEI é fixo, sem Anexo/Fator R pra vigiar) —
 * o lembrete de guia já mora no Início. Sobra Início · Notas · Mais + o CTA
 * central de emitir. A navegação entre abas preserva o `?regime=mei`.
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

/**
 * Qual aba está ativa. Regra base = PREFIXO (`/inicio` cobre `/inicio-ref5`…).
 * ⚠️ As explorações de home nasceram como `/home-*` (campeã + A–F) e NÃO batem
 * no prefixo `/inicio` — sem este mapeamento, nenhuma aba acende nessas telas.
 */
function abaAtiva(pathname: string): string | null {
  if (pathname.startsWith("/home-")) return "/inicio";
  const aba = ABAS.find((a) => pathname.startsWith(a.href));
  return aba ? aba.href : null;
}

// A barra só nas telas-raiz. /pro-labore + as versões da Início (exploração)
// entram como raiz pra mostrar a barra. Detalhe (ex: /impostos/pagar) esconde.
const RAIZES = new Set([
  ...ABAS.map((a) => a.href),
  "/pro-labore",
  "/home-campea",
  "/home-a",
  "/home-b",
  "/home-c",
  "/home-d",
  "/home-e",
  "/home-f",
  "/inicio-ref5",
  "/inicio-ref6",
  "/inicio-ref7",
  "/inicio-ref9",
  "/inicio-ref11",
  "/inicio-ref12",
  "/mais-v1",
  "/mais-completa",
  "/obrigacoes",
  "/impostos-v1",
  "/impostos-v2",
  "/componentes",
  /**
   * 🆕 05/09 (pedido do Pedro: "trave o menu como nas outras telas") — A HOME
   * DIA-1 MOSTRA A BARRA, TRAVADA.
   *
   * Ela não mostrava nenhuma: "a pessoa não navega livre até liberar o acesso".
   * O racional continua valendo, mas esconder a barra resolvia o errado — a
   * própria tela promete, na última linha da trilha, que "tudo se abre" quando
   * a ativação terminar. Sem barra, a promessa não tem objeto: a pessoa não vê
   * o que está esperando. Com a barra travada, vê — e ela mesma explica por
   * que ainda não clica, do mesmo jeito que o avatar do cabeçalho já fazia.
   */
  "/home-dia1",
]);

/** As telas que mostram a barra mas ainda NÃO deixam navegar. */
const TRAVADAS = new Set(["/home-dia1"]);

export default function PortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mei = searchParams.get("regime") === "mei";
  const mostrarAbas = RAIZES.has(pathname);
  return (
    <>
      {children}
      {mostrarAbas && (
        <BarraAbas
          pathname={pathname}
          mei={mei}
          travada={TRAVADAS.has(pathname)}
        />
      )}
    </>
  );
}

function BarraAbas({
  pathname,
  mei,
  travada = false,
}: {
  pathname: string;
  mei: boolean;
  /** Barra à vista, navegação fechada (ver `TRAVADAS`). */
  travada?: boolean;
}) {
  // 🆕 04/08 — Plano MEI não tem dashboard de impostos (DAS-MEI é fixo).
  const abas = mei ? ABAS.filter((a) => a.href !== "/impostos") : ABAS;
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
    // Preserva o plano MEI ao trocar de aba — senão a 1ª troca perde o
    // `?regime=mei` e o resto do portal volta a mostrar o plano ME.
    router.push(comRegime(destino, mei));
  };

  /* A MESMA frase do avatar desativado no cabeçalho da home dia-1: dois
     elementos travados pelo mesmo motivo não podem dar dois motivos. */
  const motivoTrava = "Disponível quando sua empresa estiver ativada";

  /**
   * 🐛→🔒 05/09 — A ALTURA DO RODAPÉ SE MEDE, NÃO SE CHUTA.
   *
   * Na tela travada a barra sobe pra cima do CTA, e eu vinha cravando esse
   * espaço à mão: 112px, depois 80px. Na terceira mudança do rodapé (entrou um
   * link de WhatsApp acima do botão, e ele passou a ter 132px) a barra cobriu o
   * CTA — o mesmo bug pela terceira vez, que é o sinal de que o número não
   * devia estar no código. Agora ele vem do próprio rodapé, e muda junto com
   * ele. O `offsetHeight` já inclui a safe-area, que o `app-footer-cta` embute
   * no padding — por isso não somamos nada aqui.
   */
  const [alturaRodape, setAlturaRodape] = useState(0);
  useEffect(() => {
    if (!travada) return;
    const rodape = document.querySelector<HTMLElement>(".app-footer-cta");
    if (!rodape) return;
    const medir = () => setAlturaRodape(rodape.offsetHeight);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(rodape);
    return () => ro.disconnect();
  }, [travada, pathname]);

  const esquerda = abas.slice(0, Math.ceil(abas.length / 2));
  const direita = abas.slice(Math.ceil(abas.length / 2));
  return (
    // Wrapper transparente: dá a margem lateral (flutua), reserva o topo pra o
    // CTA elevado (pt-7 = a protrusão) e respeita o home-indicator (var safe,
    // não env — pra o /mockup conseguir simular o inset, igual ao footer-cta).
    <div
      className="app-navbar pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pt-7"
      /**
       * 🆕 05/09 (correção do Pedro) — NA TELA TRAVADA A BARRA SOBE.
       *
       * A home dia-1 tem um CTA no rodapé, e ele fica na MESMA altura do CTA de
       * todas as outras telas — anatomia fixa é o que faz a pessoa não procurar
       * o botão. Quem cede é a barra: aqui ela está travada, não navega, e não
       * pode disputar a thumb zone com o único elemento acionável da tela.
       * 80px = a altura do `app-footer-cta` (botão de 48 + 16 de padding em
       * cima e embaixo); a safe-area já vem no `bottom` e sai do padding.
       */
      style={{
        paddingBottom: travada ? "10px" : "calc(10px + var(--safe-bottom))",
        ...(travada && alturaRodape ? { bottom: `${alturaRodape}px` } : {}),
      }}
    >
      <nav
        className="pointer-events-auto relative flex h-16 items-stretch rounded-[28px] border border-border-hairline bg-surface-card"
        style={{
          // Barra docada no rodapé: a sombra PRECISA subir (y negativo). Uma
          // sombra pra baixo cai fora da tela e some — foi o bug do "parece
          // colado". Esta projeta sobre o conteúdo acima = float visível.
          boxShadow:
            "0 -8px 30px -8px rgba(20,23,28,0.22), 0 -2px 8px -4px rgba(20,23,28,0.12)",
        }}
      >
        {esquerda.map((a) => (
          <Aba
            key={a.href}
            a={a}
            pathname={pathname}
            onIr={ir}
            travada={travada}
            motivo={motivoTrava}
          />
        ))}

        {/* vão central: o CTA elevado ocupa este espaço (absoluto, por cima) */}
        <div className="w-16 shrink-0" aria-hidden />

        {direita.map((a) => (
          <Aba
            key={a.href}
            a={a}
            pathname={pathname}
            onIr={ir}
            travada={travada}
            motivo={motivoTrava}
          />
        ))}

        {/* CTA ELEVADO — Emitir NF-e. Sobe metade pra fora da barra (o notch do
            print). → /emitir (P6, a tela de emissão em 1 passo). */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          {/* 🆕 05/09 — travado também: emitir nota é justamente o que a
              ativação destrava. Vira `span` em vez de `Link` desativado — link
              que não leva a lugar nenhum continua sendo link pro leitor de tela.
              Some a sombra junto: o que está travado não flutua. */}
          {travada ? (
            <span
              aria-disabled
              title={motivoTrava}
              className="flex h-[62px] w-[62px] cursor-not-allowed items-center justify-center rounded-[18px] bg-surface-alt text-text-muted"
            >
              <span className="text-h2 font-bold leading-none tracking-tight">
                NF-e
              </span>
            </span>
          ) : (
            <Link
              href={comRegime("/emitir", mei)}
              aria-label="Emitir nota fiscal"
              className="flex h-[62px] w-[62px] items-center justify-center rounded-[18px] bg-action-primary text-text-on-brand shadow-lg transition-colors hover:bg-action-primary-hover active:bg-action-primary-hover"
            >
              {/* Sigla no lugar do ícone (pedido do Pedro). 20px BOLD não é
                estética: branco sobre coral-600 só passa AA em texto grande
                (≥18,66px bold) — ver o token text-on-brand no globals. */}
              <span className="text-h2 font-bold leading-none tracking-tight">
                NF-e
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

function Aba({
  a,
  pathname,
  onIr,
  travada = false,
  motivo,
}: {
  a: (typeof ABAS)[number];
  pathname: string;
  onIr: (base: string) => void;
  travada?: boolean;
  motivo?: string;
}) {
  const { Icone, label } = a;
  // Ativa pela BASE (/inicio cobre as versões /inicio-ref5… e as /home-*); a
  // navegação (onIr) resolve a última versão visitada daquela aba.
  const ativo = !travada && abaAtiva(pathname) === a.href;
  return (
    <button
      type="button"
      onClick={() => !travada && onIr(a.href)}
      disabled={travada}
      title={travada ? motivo : undefined}
      aria-current={ativo ? "page" : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
        travada
          ? "cursor-not-allowed text-text-muted"
          : ativo
            ? "text-action-primary-sm"
            : "text-text-tertiary"
      }`}
    >
      {/* Sem filete: o "você está aqui" é o ÍCONE + RÓTULO em coral (decisão do
          Pedro). O ícone usa currentColor, então herda a cor do botão.
          `action-primary-sm` (coral-700) = o coral AA pra elemento pequeno. */}
      <Icone />
      <span className={`text-micro ${ativo ? "font-semibold" : ""}`}>
        {label}
      </span>
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
