"use client";

import { useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Lottie } from "@/components/lottie";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N3 — ENTRADA (fork de 3 rotas) · FONTE ÚNICA · UX-55 ✅ 16/07
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO de `(wizard)/entrada/page.tsx` em 29/07, mesmo padrão que
 * `VereditoView`/`EncaixeView` já seguiam. Motivo: a `/apresentacao` precisa
 * renderizar a tela APROVADA, não uma cópia — cópia diverge em silêncio (o N3
 * da demo tinha perdido o Lottie, os ícones e o layout dos cards). Agora a
 * page de produção e a demo consomem o MESMO componente: mudou aqui, mudou
 * nos dois. A navegação entra por props, porque é o único ponto onde os dois
 * contextos legitimamente diferem (router × estado da demo).
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
 *
 * ─── 🆕 GATE DE CIDADE (28/07, reunião Rua Satélite 9) ──────────────────────
 * MLP só atende Belo Horizonte/MG — nenhum outro município ainda. "Abrir" e
 * "já tenho empresa" passam por uma confirmação de cidade ANTES de navegar
 * (mesma tela, 2º passo — não é rota nova, é etapa). "Entrar na conta" pula
 * o gate: quem já é cliente já passou por isso. Fora de BH → saída graciosa
 * dedicada (`/saida/fora-bh`), mesmo template A9 das outras saídas.
 *
 * Migrar (flow #2) confirma a cidade igual, mas não tem pra onde navegar
 * ainda (flow #2 não construído) — mostra um estado "em breve" honesto em
 * vez de 404 ou clique morto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Intencao = "abrir" | "migrar";

export function EntradaView({
  intencao,
  onIntencao,
  onSeguir,
  onForaBh,
  onLogin,
  destaqueCoral600 = false,
}: {
  /** null = passo 1 (fork). Preenchido = passo 2 (gate de cidade). */
  intencao: Intencao | null;
  onIntencao: (i: Intencao | null) => void;
  /** BH confirmado + intenção "abrir" → segue pro N4. */
  onSeguir: () => void;
  onForaBh: () => void;
  onLogin: () => void;
  /**
   * 🔓 UX-63 (29/07, pedido do Pedro na validação tela a tela) — usa o coral-600
   * do botão primário no card de destaque, em vez do coral-700.
   *
   * ⚠️ TRADEOFF MEDIDO, não opinião: branco sobre coral-600 dá **4,04:1** e o
   * título do card é `text-body` bold = 16px, que NÃO conta como texto grande
   * (o piso é 18,66px bold). AA exige 4,5:1 → falha. Sobre coral-700 dá 5,64:1
   * → passa. É exatamente a regra travada em 12/07, e o motivo do token
   * `action-primary-sm` existir.
   *
   * Fica como prop opcional (default = comportamento aprovado) pra a decisão
   * ser do Pedro sem contaminar a produção.
   */
  destaqueCoral600?: boolean;
}) {
  const [migrarEmBreve, setMigrarEmBreve] = useState(false);

  /**
   * 🐛 FIX 29/07 — o "em breve" do migrar VAZAVA entre escolhas.
   * `migrarEmBreve` é estado interno e ninguém o zerava ao trocar de intenção.
   * Repro: "Já tenho empresa" → "Sim, é em BH" → card "essa parte ainda não
   * existe" → voltar → "Quero abrir minha empresa" → **aparecia o card do
   * migrar**. Ou seja: quem escolheu ABRIR via a tela de MIGRAR.
   *
   * Padrão oficial do React pra "ajustar estado quando a prop muda": comparar
   * com o valor anterior durante o render (não em effect — effect deixaria um
   * frame com a tela errada pintada, que é exatamente o bug).
   */
  const [intencaoAnterior, setIntencaoAnterior] = useState(intencao);
  if (intencao !== intencaoAnterior) {
    setIntencaoAnterior(intencao);
    setMigrarEmBreve(false);
  }

  function confirmarCidade(bh: boolean) {
    if (!bh) {
      onForaBh();
      return;
    }
    if (intencao === "abrir") {
      onSeguir();
    } else {
      // Flow #2 não construído — estado honesto, sem clique morto nem 404.
      setMigrarEmBreve(true);
    }
  }

  // ─── PASSO 2: confirma cidade (só depois de escolher abrir/migrar) ───────
  if (intencao) {
    return (
      <>
        <header className="pt-6 pb-2">
          <Logo className="h-8 w-auto" />
        </header>
        <main className="app-main">
          <div className="flex-1 min-h-0 flex flex-col justify-center">
            {migrarEmBreve ? (
              <Card>
                <h2 className="text-h2 mb-1">Essa parte ainda não existe</h2>
                <p className="text-body text-text-secondary">
                  Migrar de contador é um fluxo que ainda estamos construindo.
                  Fala com a gente no WhatsApp que a gente te ajuda na mão
                  enquanto isso.
                </p>
              </Card>
            ) : (
              <>
                <h1 className="text-h1 mb-2">Onde fica a sua empresa?</h1>
                <p className="text-body text-text-secondary mb-6">
                  Hoje a gente só abre em Belo Horizonte/MG — é a fase de
                  testes do produto.
                </p>
                <div className="flex gap-2">
                  <Button full onClick={() => confirmarCidade(true)}>
                    Sim, é em BH
                  </Button>
                  <Button
                    full
                    variant="secondary"
                    onClick={() => confirmarCidade(false)}
                  >
                    Não é em BH
                  </Button>
                </div>
              </>
            )}
          </div>
          {!migrarEmBreve && (
            <div className="app-footer-cta">
              <Button full variant="ghost" onClick={() => onIntencao(null)}>
                Voltar
              </Button>
            </div>
          )}
        </main>
      </>
    );
  }

  // ─── PASSO 1: as 3 rotas ──────────────────────────────────────────────────
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
              Um escritório de contabilidade de verdade, em BH.
            </p>
          </div>
        </div>

        <div className="app-footer-cta">
          <Escolha
            destaque
            coral600={destaqueCoral600}
            icone={<Mais />}
            titulo="Quero abrir minha empresa"
            sub="Ainda não tenho CNPJ. Quero começar do zero."
            onClick={() => onIntencao("abrir")}
          />
          <Escolha
            icone={<Predio />}
            titulo="Já tenho empresa"
            sub="Tenho CNPJ e quero que vocês cuidem da contabilidade."
            onClick={() => onIntencao("migrar")}
          />
          <p className="text-caption text-text-tertiary mt-5 text-center">
            Já é cliente?{" "}
            <button
              onClick={onLogin}
              className="font-semibold text-text-primary underline underline-offset-4"
            >
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
  coral600 = false,
  onClick,
}: {
  icone: ReactNode;
  titulo: string;
  sub: string;
  destaque?: boolean;
  /** Ver `destaqueCoral600` no EntradaView — troca o fill e custa contraste. */
  coral600?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mt-3 flex w-full items-start gap-4 rounded-lg p-4 text-left
                  transition-colors ${
                    destaque
                      ? `${coral600 ? "bg-action-primary" : "bg-action-primary-sm"} text-text-on-brand hover:bg-action-primary-hover`
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
