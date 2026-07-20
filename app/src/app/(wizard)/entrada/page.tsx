import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Lottie } from "@/components/lottie";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N3 — ENTRADA (fork de 3 rotas) · shell WIZARD · UX-55 ✅ 16/07
 * ═══════════════════════════════════════════════════════════════════════════
 * Colhida do protótipo `ux-ui/prototipo/fluxo-entrada.html`, mas com a COPY
 * corrigida pela UX-55 (ver abaixo). Spec: reordenacao-flow-cobranca-cedo §N3.
 *
 * A tela que divide o produto em dois: quem não tem CNPJ vai pro flow de
 * abertura (N4→N25); quem já tem vai pro **flow #2**. Toda a máquina depende
 * de o lead escolher certo aqui.
 *
 * ─── ⚠️ A PALAVRA "MIGRAR" NÃO APARECE, E É REGRA ─────────────────────────
 * O protótipo dizia "Migrar de contador / já tenho CNPJ e quero trocar pra
 * vocês". A UX-55 derrubou isso por dois motivos:
 *   1. "Migrar" é jargão — quem nunca ouviu não se reconhece na opção.
 *   2. "Trocar de contador" pressupõe que existe um contador antigo, e exclui
 *      justamente o MELHOR cliente do flow #2: quem não tem contador nenhum.
 *      Nesse caso o risco do TTRT nem existe, então é o caso mais fácil que a
 *      gente tem — e a copy velha o mandava embora.
 * A copy pergunta pelo FATO ("já tenho empresa"), nunca pela operação.
 *
 * ─── HIERARQUIA DAS 3 SAÍDAS (não é estética) ─────────────────────────────
 * · **Abrir** = card coral, primário. É o flow que o MVP resolve inteiro.
 * · **Já tenho empresa** = card branco, secundário. Existe e é legível, mas
 *   não compete: o flow #2 ainda tem 3 personas contra 16.
 * · **Entrar na conta** = LINK, não botão (spec). Quem já é cliente procura
 *   ativamente; dar peso de botão roubaria atenção dos dois de cima, que são
 *   os que trazem receita nova.
 *
 * ⚠️ Fill dos cards = `action-primary-sm` (coral-700), não coral-600: o texto
 * aqui é menor que 18,66px bold, e sobre coral-600 daria 4,04:1 (falha AA em
 * texto normal). A regra travada em 12/07 diz que texto menor exige fill mais
 * escuro. É o mesmo motivo do variant `primarySm` do Button.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EntradaPage() {
  return (
    <>
      <header className="pt-6 pb-2">
        {/* Logo estático: a marca já se apresentou animada na splash (N1).
            Repetir a animação aqui gastaria o gesto. */}
        <Logo className="h-8 w-auto" />
      </header>

      <main className="app-main">
        {/* A ilustração absorve a sobra e encolhe primeiro quando a tela é
            baixa: nada aqui é informação, então é a primeira a ceder espaço. */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-2">
          <Lottie
            path="/lottie/paperplane-legalizei.json"
            fps={50}
            className="h-full max-h-[240px] w-full max-w-[380px]"
          />
        </div>

        <div className="shrink-0">
          <h1 className="text-h1">
            Como a gente pode te ajudar?{" "}
            <span className="text-text-tertiary">
              A parte chata fica com a gente.
            </span>
          </h1>

          {/* Selo de confiança: o diferencial que nenhum concorrente digital
              tem. Vem ANTES das opções porque é o que autoriza a escolha. */}
          <div
            className="mt-4 flex items-center gap-2.5 rounded-md border
                       border-border-hairline bg-surface-tint-brand px-3.5 py-2.5"
          >
            <Escudo />
            <p className="text-caption font-semibold text-text-secondary">
              22 anos de escritório por trás do app.
            </p>
          </div>
        </div>

        <div className="app-footer-cta">
          <Escolha
            destaque
            icone={<Mais />}
            titulo="Quero abrir minha empresa"
            sub="Ainda não tenho CNPJ. Quero começar do zero."
          />
          <Escolha
            icone={<Predio />}
            titulo="Já tenho empresa"
            sub="Tenho CNPJ e quero que vocês cuidem da contabilidade."
          />
          <p className="text-caption text-text-tertiary mt-5 text-center">
            Já é cliente?{" "}
            <button className="font-semibold text-text-primary underline underline-offset-4">
              Entrar na minha conta
            </button>
          </p>
        </div>
      </main>
    </>
  );
}

/**
 * Card de escolha. Local, não DS: a regra dos 3 não bateu (só o N3 usa este
 * formato de "card clicável com ícone + título + explicação").
 *
 * Alvo de toque enorme de propósito — a tela inteira tem 2 decisões, e errar
 * aqui joga o lead no flow errado.
 */
function Escolha({
  icone,
  titulo,
  sub,
  destaque = false,
}: {
  icone: ReactNode;
  titulo: string;
  sub: string;
  destaque?: boolean;
}) {
  return (
    <button
      className={`mt-3 flex w-full items-start gap-4 rounded-lg p-4 text-left
                  transition-colors ${
                    destaque
                      ? "bg-action-primary-sm text-text-on-brand hover:bg-action-primary-hover"
                      : "border border-border-hairline bg-surface-card hover:bg-surface-alt"
                  }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
          destaque ? "bg-white/20" : "bg-surface-tint-brand"
        }`}
      >
        {icone}
      </span>
      <span className="flex-1">
        <span
          className={`block text-body font-bold ${
            destaque ? "text-text-on-brand" : "text-text-primary"
          }`}
        >
          {titulo}
        </span>
        {/* Branco puro, sem opacidade: transparência sobre coral derrubaria o
            contraste abaixo de AA justo na linha que explica a escolha. */}
        <span
          className={`mt-0.5 block text-caption ${
            destaque ? "text-text-on-brand" : "text-text-secondary"
          }`}
        >
          {sub}
        </span>
      </span>
      <Chevron />
    </button>
  );
}

/* ─── Ícones. Inline e locais: 3 usos, nenhum fora desta tela. ───────────── */

function Escudo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-action-primary"
      aria-hidden
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Mais() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Prédio, não setas de troca: o ícone tem que dizer "empresa existe", não
    "operação de migração" — mesma razão da copy. */
function Predio() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-action-primary"
      aria-hidden
    >
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
      <path d="M15 9h4a1 1 0 0 1 1 1v11" />
      <path d="M2 21h20M8 8h2M8 12h2M8 16h2" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0 opacity-70"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
