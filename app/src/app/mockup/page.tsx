"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GRUPOS, type Tela } from "@/lib/telas-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /mockup — prancha de review das telas, em moldura de celular.
 * ═══════════════════════════════════════════════════════════════════════════
 * NÃO É PRODUTO. É ferramenta de review do Pedro: ver as telas como mockup,
 * com a borda do aparelho em volta, em vez de página solta no browser.
 *
 * Mora FORA dos route groups (wizard)/(app) de propósito: não pertence a
 * nenhum dos dois shells. É chrome de ferramenta.
 *
 * Por isso também é o ÚNICO arquivo do app que pode usar cor fora dos tokens:
 * a moldura é um objeto físico (alumínio, vidro, barra de status do iOS), não
 * superfície do produto. Se ela usasse `surface-card`, o token estaria
 * mentindo sobre o que é.
 *
 * ─── O que mudou em 16/07 e por quê ───────────────────────────────────────
 * A v1 desenhava a Dynamic Island como ADESIVO por cima do iframe, e o app
 * pintava embaixo dela sem saber que existia. A moldura tinha cara de iPhone
 * e espaço de browser: mentia nas duas pontas (topo, embaixo da Island;
 * rodapé, embaixo da barra de gesto, justo onde o CTA NÃO pode estar).
 *
 * Agora a moldura SIMULA o aparelho: injeta --safe-top/--safe-bottom dentro
 * do documento do iframe. O app então respeita a inset igual respeitaria num
 * telefone. Os números não são estética, são o que o `useSafeAreaInsets()` do
 * React Native vai devolver no aparelho de verdade (stack travada 09/07).
 *
 * Injetar de fora, em vez de o app ler um `?mockup=1`, é de propósito: a tela
 * não fica sabendo que existe prancheta. Quem sabe de aparelho é a moldura.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Topo = "island" | "notch" | "barra";

interface Aparelho {
  id: string;
  nome: string;
  porque: string;
  /** Pontos lógicos (o que o CSS e o RN chamam de px). Não é pixel físico. */
  w: number;
  h: number;
  safeTop: number;
  safeBottom: number;
  raio: number;
  topo: Topo;
}

const APARELHOS: Aparelho[] = [
  {
    id: "15-pro-max",
    nome: "iPhone 15 Pro Max",
    porque: "o aparelho do Pedro. É nele que a review acontece.",
    w: 430,
    h: 932,
    safeTop: 59,
    safeBottom: 34,
    raio: 55,
    topo: "island",
  },
  {
    id: "13-mini",
    nome: "iPhone 13 mini",
    porque: "o alvo antigo do mapa-telas-mobile. Notch, e a inset é menor.",
    w: 375,
    h: 812,
    safeTop: 44,
    safeBottom: 34,
    raio: 44,
    topo: "notch",
  },
  {
    id: "se",
    nome: "iPhone SE",
    porque: 'o chão. 667 de altura é onde a regra "sem scroll" morre primeiro.',
    w: 375,
    h: 667,
    safeTop: 20,
    safeBottom: 0,
    raio: 6,
    topo: "barra",
  },
];

/** Altura da barra de status. Não é a safe area: na Island sobram ~5pt embaixo. */
const BARRA_H: Record<Topo, number> = { island: 54, notch: 44, barra: 20 };

/**
 * Telas AGRUPADAS NA ORDEM DO FLOW. Cada grupo é uma esteira horizontal: as
 * telas dele aparecem lado a lado e, quando passam da largura, viram scroll
 * lateral (clicar-segurar-arrastar).
 *
 * 🆕 06/08 — `GRUPOS` (rota+rótulo+ordem) mudou de casa: agora mora em
 * `@/lib/telas-flow` (importado no topo do arquivo), FONTE ÚNICA também
 * consumida pela `/apresentacao` (rótulos do painel lateral). Editar uma
 * tela — nova rota, rótulo, ordem — aqui equivale a editar lá; os dois
 * lugares ficam sempre iguais. `nota` (comentário de review) só é lido
 * aqui e pelo mapa mental embutido abaixo, não pela apresentação.
 *
 * 🆕 03/08 — nomenclatura E·C·A·P (ADR em [[decisoes-marca]]): letra por
 * flow + numeração fluida + decimal em condicional/saída. A ordem dos
 * GRUPOS segue `flow/flow-data.mjs` + `portal/portal-data.mjs` (fontes-
 * únicas): Entrada (E1–E4, com Migrar fundido como decimal do fork E4) →
 * E5 porta+veredito → saídas da triagem → dinheiro (E6–E9) → Migrar
 * pós-pagamento (E9.3–E9.4, decimal de E9) → pausas (C0.1/E9.1) →
 * Constituição/dossiê (C1–C7) → Aprovação (A1–A5) → Portal (P-INI/P-IMP/
 * P-NOT/P-EMI/P-MAIS/P-GER) → fora do flow. Onde o flow bifurca, o ramo
 * entra logo depois do nó que o gera — não no fim.
 */

/**
 * 🔄 26/08 (pedido do Pedro) — o "mapa mental" que morava aqui (SVG desenhado
 * à mão sobre `MAPA_EDGES`, uma lista traduzida à mão de `flow-data.mjs` e
 * que ficava desatualizada) foi APOSENTADO. Virou `/mapa`: board interativo
 * de verdade (React Flow + dagre), lendo `flow-graph.json` — gerado por
 * `produto/_flow/gerar-mapa.mjs`, nunca editado à mão. Zero lista pra ficar
 * velha de novo. Ver `app/src/app/mapa/page.tsx`.
 */

export default function MockupPage() {
  const [nonce, setNonce] = useState(0);
  const [apId, setApId] = useState(APARELHOS[0].id);
  // 75% é o default porque a prancheta cresceu: com 11 grupos e o flow inteiro,
  // 100% obriga a rolar pra ver uma esteira inteira. O zoom é da MOLDURA, não do
  // conteúdo (o iframe segue renderizando em 430pt), então nada do que o Pedro
  // revisa muda de tamanho relativo — só cabe mais na mesa.
  const [escala, setEscala] = useState(0.75);
  const [insets, setInsets] = useState(true);

  const ap = APARELHOS.find((a) => a.id === apId) ?? APARELHOS[0];

  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <header className="mb-8">
          <p className="text-micro text-text-tertiary mb-1">
            Legalizai · prancha de review
          </p>
          <h1 className="text-h1 text-text-primary">Telas na ordem do flow</h1>
          <p className="text-body text-text-secondary mt-2 max-w-[60ch]">
            Ordem real do flow, por esteira. Arraste pra passar tela por tela.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* 🔄 26/08 — visão panorâmica virou rota própria (`/mapa`), board
                interativo de verdade (zoom/arrastar/clicar), não mais overlay
                que abria por cima desta página. Ver comentário acima. */}
            <a
              href="/mapa"
              className="rounded-xl bg-action-primary px-4 py-2.5 text-caption font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
            >
              🗺️ Ver mapa do flow (todas as telas + conexões)
            </a>
            {/* Laboratório de VERSÕES de página (todas as explorações num board). */}
            <p className="text-caption">
              <a
                href="/mockup-inicio"
                className="font-semibold text-action-primary-sm underline underline-offset-4"
              >
                → Laboratório de versões (Início, Mais, e as próximas)
              </a>
            </p>
          </div>
        </header>

        {/* ── Controles da prancheta ── */}
        <div className="mb-10 flex flex-wrap items-end gap-x-8 gap-y-5">
          <Campo rotulo="Aparelho">
            <Segmentado
              opcoes={APARELHOS.map((a) => ({ id: a.id, label: a.nome }))}
              valor={apId}
              onChange={setApId}
            />
          </Campo>

          <Campo rotulo="Zoom">
            <Segmentado
              opcoes={[
                { id: "1", label: "100%" },
                { id: "0.75", label: "75%" },
                { id: "0.5", label: "50%" },
              ]}
              valor={String(escala)}
              onChange={(v) => setEscala(Number(v))}
            />
          </Campo>

          {/* O A/B que prova a correção: desligar tem que fazer o conteúdo
              subir pra debaixo da Island. Se não mexer, a inset não chegou. */}
          <Campo rotulo="Safe area">
            <Segmentado
              opcoes={[
                { id: "on", label: "Respeitando" },
                { id: "off", label: "Ignorando" },
              ]}
              valor={insets ? "on" : "off"}
              onChange={(v) => setInsets(v === "on")}
            />
          </Campo>

          <button
            onClick={() => setNonce((n) => n + 1)}
            className="min-h-10 rounded-md border border-border-strong bg-surface-card
                       px-4 text-caption font-semibold text-text-secondary
                       transition-colors hover:bg-surface-alt"
          >
            Recarregar as duas
          </button>
        </div>

        <p className="text-caption text-text-tertiary mb-8 max-w-[68ch]">
          <strong className="text-text-secondary">{ap.nome}</strong> · {ap.w}×
          {ap.h}pt · inset {ap.safeTop} em cima, {ap.safeBottom} embaixo.{" "}
          {ap.porque}
        </p>

        <div className="flex flex-col gap-6">
          {GRUPOS.map((a) => (
            <Grupo
              key={a.id}
              a={a}
              ap={ap}
              escala={escala}
              insets={insets}
              nonce={nonce}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ESTEIRA POR GRUPO (ordem do flow) — telas lado a lado, scroll lateral por arrasto.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Clicar-segurar-arrastar pra rolar a esteira na horizontal.
 * ⚠️ Limite conhecido: o <iframe> engole os eventos que COMEÇAM sobre o vidro
 * (a tela em si continua clicável, bom pra validar). Então o arrasto pega o
 * ALUMÍNIO da moldura, a legenda e o vão entre telas — sobra superfície de
 * sobra. `window` nos move/up: o arrasto continua mesmo saindo da esteira.
 */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const stop = () => {
      down = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, []);
  return ref;
}

interface EsteiraProps {
  ap: Aparelho;
  escala: number;
  insets: boolean;
  nonce: number;
}

function Grupo({
  a,
  ...rest
}: EsteiraProps & {
  a: (typeof GRUPOS)[number];
}) {
  const dragRef = useDragScroll();
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-h2 text-text-primary">{a.nome}</h2>
        <p className="text-caption text-text-secondary mt-1 max-w-[72ch]">
          {a.descricao}
        </p>
      </div>

      {a.telas.length === 0 ? (
        <div
          className="flex h-[180px] items-center justify-center rounded-lg border
                     border-dashed border-border-strong text-caption text-text-tertiary"
        >
          Aguardando as telas deste arquétipo (construção na próxima sessão).
        </div>
      ) : (
        // A esteira: mesmo gap-x-10 e mesma moldura de antes; overflow-x-auto +
        // arrasto. Poucas telas cabem lado a lado; da 3ª/4ª em diante, rola.
        <div
          ref={dragRef}
          className="flex cursor-grab select-none gap-x-10 overflow-x-auto pb-4"
        >
          {a.telas.map((t) => (
            <PhoneFigure key={t.rota} t={t} {...rest} />
          ))}
        </div>
      )}
    </section>
  );
}

function PhoneFigure({
  t,
  ap,
  escala,
  insets,
  nonce,
}: EsteiraProps & { t: Tela }) {
  // ── Lazy-mount ────────────────────────────────────────────────────────────
  // Cada <iframe> é um DOCUMENTO inteiro (árvore React + conexão HMR próprias).
  // Montar as ~26 (logo ~40, com o portal) de uma vez é o que estoura a RAM do
  // note. Aqui a figura só monta o Phone quando entra perto da viewport; fora de
  // vista fica um placeholder do MESMO tamanho (sem iframe), então a esteira não
  // pula e a RAM fica limitada ao que está à vista — não cresce com o nº de telas.
  //
  // rootMargin generoso ("600px 250px") pré-carrega o que está prestes a entrar,
  // pra não dar flash em rolagem normal. O clipping das esteiras horizontais já
  // é considerado pelo IntersectionObserver (root = viewport), então tela fora de
  // vista NA HORIZONTAL também desmonta.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setPerto(entries[0]?.isIntersecting ?? false),
      { rootMargin: "600px 250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="flex shrink-0 flex-col items-center gap-4">
      {/* Duas caixas (idêntico ao que era): a de fora reserva o rastro já
          escalado; a de dentro fica no tamanho natural e só o transform encolhe.
          A largura explícita evita a moldura espremer o vidro fora do 100%. */}
      <div
        ref={wrapRef}
        style={{
          width: (ap.w + 24) * escala,
          height: (ap.h + 24) * escala,
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: ap.w + 24,
            height: ap.h + 24,
            transform: `scale(${escala})`,
            transformOrigin: "top left",
          }}
        >
          {perto ? (
            <Phone
              // ⚠️ 28/07: rota pode JÁ ter querystring (?etapa=, ?s=, ?id=).
              // `?v=` fixo dava dois `?` (etapa=triagem?v=0) — quebrava o
              // parse e a tela sempre caía no default. `&` quando já tem `?`.
              src={`${t.rota}${t.rota.includes("?") ? "&" : "?"}v=${nonce}`}
              ap={ap}
              insets={insets}
              statusClaro={t.statusClaro}
            />
          ) : (
            <PhonePlaceholder ap={ap} nome={t.nome} />
          )}
        </div>
      </div>

      <figcaption className="max-w-[300px] text-center">
        <p className="text-body font-semibold text-text-primary">{t.nome}</p>
        {/* 🆕 03/08 (Pedro): a nota some por padrão — texto grande embaixo de
            cada tela confundia o programador escaneando o flow. Continua a 1
            clique (fonte pro Pedro), só não fica exposta o tempo todo. */}
        <details className="group mt-1.5 text-left">
          <summary className="cursor-pointer list-none text-micro font-semibold text-text-tertiary marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block transition-transform group-open:rotate-90">▸</span>
              nota
            </span>
          </summary>
          <p className="text-caption text-text-secondary mt-1.5">{t.nota}</p>
        </details>
      </figcaption>
    </figure>
  );
}

/**
 * Placeholder do MESMO tamanho da moldura, SEM iframe. Segura o layout (a esteira
 * não pula) e a RAM (nenhum documento montado) enquanto a tela está fora de vista.
 * Mesma moldura de alumínio do Phone; o vidro é uma superfície neutra com o nome,
 * pra dar de relance qual tela vai aparecer ali quando rolar até ela.
 */
function PhonePlaceholder({ ap, nome }: { ap: Aparelho; nome: string }) {
  return (
    <div
      className="relative shrink-0 p-3"
      style={{
        width: "fit-content",
        borderRadius: ap.raio + 12,
        background:
          "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden bg-surface-alt"
        style={{ width: ap.w, height: ap.h, borderRadius: ap.raio }}
      >
        <span className="text-caption text-text-tertiary px-6 text-center">
          {nome}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOLDURA
   ═══════════════════════════════════════════════════════════════════════════ */

function Phone({
  src,
  ap,
  insets,
  statusClaro = false,
}: {
  src: string;
  ap: Aparelho;
  insets: boolean;
  statusClaro?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  /**
   * O coração da coisa. `env()` dentro de um iframe é sempre 0: o iframe não
   * herda a safe area de ninguém, e nem saberia de qual aparelho herdar.
   * Então a moldura escreve o valor dentro do documento do iframe. Mesma
   * origem + allow-same-origin = pode.
   *
   * Via <style> no <head>, e NÃO via style inline no <html>: o <html> é
   * renderizado pelo RootLayout, então o React reconcilia os atributos dele e
   * acusa hydration mismatch a cada Fast Refresh. Um <style> que a gente
   * anexa está fora da árvore do React, que nem sabe que ele existe.
   *
   * `:root:root` dobrado de propósito: sobe a especificidade pra (0,2,0) e
   * ganha do `:root` do globals.css sem depender de quem foi injetado por
   * último no head (em dev, o HMR reinjeta CSS a qualquer momento).
   */
  const aplicarInsets = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.head) return;
    const top = insets ? ap.safeTop : 0;
    const bottom = insets ? ap.safeBottom : 0;

    let tag = doc.getElementById("mockup-insets") as HTMLStyleElement | null;
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "mockup-insets";
      doc.head.appendChild(tag);
    }
    tag.textContent = `:root:root{--safe-top:${top}px;--safe-bottom:${bottom}px}`;
  }, [ap, insets]);

  // Dois gatilhos, e os dois importam: onLoad pega o boot e o "recarregar";
  // este effect pega a troca de aparelho, que NÃO recarrega o iframe.
  useEffect(() => {
    aplicarInsets();
  }, [aplicarInsets]);

  return (
    <div
      className="relative shrink-0 p-3"
      style={{
        // A moldura se mede pelo vidro, nunca pelo pai. `width: auto` num div
        // de bloco vira "a largura de quem me contém", e aí o alumínio encolhe
        // enquanto o vidro (fixo em ap.w) fica do tamanho que era. Aparelho
        // não é elástico: quem manda no tamanho dele é ele.
        width: "fit-content",
        borderRadius: ap.raio + 12,
        // alumínio: gradiente sutil, não chapado. É objeto físico, não UI.
        background:
          "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        // Sem sombra de projeção (pedido do Pedro 17/07). Fica só o filete
        // interno que define a borda do alumínio — é o aparelho, não sombra.
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      {/* botões laterais */}
      <span className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -left-[3px] top-[168px] h-12 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -right-[3px] top-[150px] h-16 w-[3px] rounded-r bg-[#0e1013]" />

      <div
        className="relative overflow-hidden bg-white"
        style={{ width: ap.w, height: ap.h, borderRadius: ap.raio }}
      >
        <iframe
          ref={ref}
          src={src}
          title={src}
          onLoad={aplicarInsets}
          className="h-full w-full border-0"
          // allow-same-origin não é conveniência: é o que deixa a moldura
          // escrever a inset no documento de dentro.
          sandbox="allow-scripts allow-same-origin allow-forms"
        />

        {/* Cromo do iOS. pointer-events-none em tudo: a tela continua clicável. */}
        <BarraDeStatus ap={ap} claro={statusClaro} />
        {ap.topo === "island" && <Island />}
        {ap.topo === "notch" && <Notch />}
        {ap.safeBottom > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-[8px]">
            <div className="h-[5px] w-[139px] rounded-full bg-black/85" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Relógio + sinal + wifi + bateria. É o "tem dados na parte de cima" — o
 * motivo de a tela não começar em y=0. Fixo em 9:41 de propósito: relógio vivo
 * é ruído numa prancheta, e 9:41 é a convenção de mockup da Apple.
 *
 * ✅ 19/07 — a variante CLARA nasceu junto com a tela que a exigia (E1 splash,
 * coral cheio). Era o que o comentário anterior deixava reservado: não se
 * constrói variante antes da tela existir (design-system.md §6), mas quando a
 * tela chega, o cromo tem que acompanhar — senão a prancheta mostra um relógio
 * preto ilegível sobre coral e o Pedro revisa um artefato que não existe.
 */
function BarraDeStatus({ ap, claro = false }: { ap: Aparelho; claro?: boolean }) {
  const h = BARRA_H[ap.topo];
  const lado = ap.topo === "barra" ? 12 : ap.w >= 430 ? 24 : 21;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex
                 items-center justify-between ${claro ? "text-white" : "text-black"}`}
      style={{ height: h, paddingLeft: lado, paddingRight: lado }}
    >
      <span
        className="font-semibold tracking-[-.2px]"
        style={{ fontSize: ap.topo === "barra" ? 13 : 15 }}
      >
        9:41
      </span>

      <span className="flex items-center gap-[5px]">
        <Sinal />
        <Wifi />
        <Bateria />
      </span>
    </div>
  );
}

function Island() {
  // 125×36.7 a 11pt do topo. Idle — o print do Itaú mostra ela EXPANDIDA
  // (Live Activity tocando som), que é estado do sistema, não da nossa tela.
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
      <div className="h-[37px] w-[125px] rounded-full bg-black" />
    </div>
  );
}

function Notch() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
      <div className="h-[30px] w-[209px] rounded-b-[20px] bg-black" />
    </div>
  );
}

function Sinal() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <path d="M8 11.5 6.1 9.2a2.9 2.9 0 0 1 3.8 0L8 11.5Z" />
      <path d="M8 5.9c1.4 0 2.7.5 3.7 1.4l1.3-1.6A7.8 7.8 0 0 0 8 3.8a7.8 7.8 0 0 0-5 1.9l1.3 1.6A5.6 5.6 0 0 1 8 5.9Z" />
      <path d="M8 .4C5.1.4 2.5 1.4.5 3.1l1.3 1.6A9.6 9.6 0 0 1 8 2.4c2.4 0 4.6.8 6.2 2.3l1.3-1.6A11.4 11.4 0 0 0 8 .4Z" />
    </svg>
  );
}

function Bateria() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
      <rect
        x=".7"
        y=".7"
        width="21.6"
        height="11.6"
        rx="3.6"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1"
      />
      <rect x="2.2" y="2.2" width="14" height="8.6" rx="2.1" fill="currentColor" />
      <path
        d="M24.3 4.4a2.6 2.6 0 0 1 0 4.2V4.4Z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTROLES — chrome de ferramenta, não componente de produto.
   Não promover pro DS: a regra dos 3 não bateu, e prancheta não é produto.
   ═══════════════════════════════════════════════════════════════════════════ */

function Campo({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-micro text-text-tertiary mb-1.5">{rotulo}</p>
      {children}
    </div>
  );
}

function Segmentado({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: { id: string; label: string }[];
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border-hairline bg-surface-card p-1">
      {opcoes.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-8 rounded-sm px-3 text-caption font-semibold transition-colors ${
            valor === o.id
              ? "bg-surface-dark text-text-on-dark"
              : "text-text-secondary hover:bg-surface-alt"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
