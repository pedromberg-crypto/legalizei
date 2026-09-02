"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { IconeApple, IconeGoogle } from "@/components/marcas-sociais";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN — **sem número N, e isso é a informação principal desta tela.**
 * ═══════════════════════════════════════════════════════════════════════════
 * Colhida do protótipo `ux-ui/prototipo/login.html` (aprovada 12/07).
 *
 * A numeração N1–N25 cobre a trilha de quem está ABRINDO empresa. O login é a
 * **saída terminal A1** do mapa de ramificações: diverge no N3 ("já sou
 * cliente"), sai do fluxo de abertura e **não reconverge**. Dar um número a
 * ela mentiria sobre a topologia do produto.
 *
 * ─── POR QUE NÃO É O TEMPLATE A9 (saída graciosa) ─────────────────────────
 * O A9 é "barra + explica + captura + roteia", desenhado pras saídas que são
 * uma RECUSA (waitlist, comercial, exterior, 3+ sócios): ali o trabalho é não
 * queimar a relação com quem a gente não pode atender agora. O login é o
 * oposto — é rota feliz, alguém que já é cliente voltando pra casa. Usar o
 * mesmo template trataria um retorno como uma negativa.
 *
 * ─── POR QUE NÃO SE FUNDE COM O N6 ────────────────────────────────────────
 * A spec velha (T5) tinha UMA tela "Login / criar conta". A reordenação
 * separou: o **N6 é criar** (dentro do wizard, sai com credencial nova), este
 * é **voltar** (fora do wizard, credencial já existe). Compartilham o social
 * login e nada mais: o N6 pergunta a coorte e avisa do GOV.BR, este não
 * pergunta nada, porque não há o que descobrir sobre quem já é cliente.
 * Fundir as duas devolveria o problema que a separação resolveu — a tela teria
 * que decidir, no meio, qual dos dois fluxos está rodando.
 *
 * ─── LAYOUT: 2 PAINÉIS, NÃO O ESQUELETO DE 3 PARTES ───────────────────────
 * Painel escuro que sangra (marca + saudação) + folha clara sobreposta (o
 * formulário). É a única tela do produto com essa estrutura, e ela existe pra
 * marcar que aqui é OUTRO lugar: quem chega no login não está no meio de um
 * processo, está entrando em casa. O esqueleto A1 (título fixo/corpo rola/CTA
 * fixo) diria "você está num passo de N", que é exatamente o que não é.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN — a tela, FONTE ÚNICA
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔄 02/09 — extraída da page (`(wizard)/login`) pelo mesmo motivo de sempre:
 * a `/apresentacao` renderiza a tela APROVADA, não uma cópia. Ela era a única
 * do flow que o Pedro não conseguia revisar na demo — existia no mapa, não na
 * apresentação — e a auditoria de nomes de 02/09 expôs isso.
 * A page virou wrapper fino; nenhum pixel mudou na extração.
 */
export function LoginView() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);

  return (
    <main className="app-main">
      {/*
        PAINEL ESCURO. Sangra nos 3 lados: `-mx-6` fura o padding lateral do
        `.app-page`, e a margem negativa no topo desfaz o `padding-top:
        var(--safe-top)` do shell pra COR chegar na borda do vidro — enquanto o
        padding devolve a inset pro CONTEÚDO. É a regra do globals.css aplicada
        literalmente: "o fundo pode e deve ir até a borda, o conteúdo não".

        O glow radial coral usa `--color-brand` via var(): é atmosfera de marca,
        não superfície de produto nem elemento clicável, então não pede token
        semântico próprio. Criar um pra um uso só seria a abstração
        especulativa que o design-system.md §6 proíbe.
      */}
      <div
        className="-mx-6 flex min-h-0 flex-1 flex-col bg-surface-dark px-7 pb-12"
        style={{
          marginTop: "calc(-1 * var(--safe-top))",
          // 1.5rem = o mesmo `pt-6` do header das outras telas. A inset entra
          // por cima disso, não no lugar dele: o aparelho e o design somam.
          paddingTop: "calc(var(--safe-top) + 1.5rem)",
          backgroundImage:
            "radial-gradient(120% 80% at 15% 0%, color-mix(in srgb, var(--color-brand) 22%, transparent), transparent 60%)",
        }}
      >
        {/* Logo ANCORADO no topo-esquerda, como em toda tela que o mostra
            (N2, N3). É a assinatura da casa: ela não flutua conforme a altura
            do aparelho. */}
        <Logo variante="escura" className="h-8 w-auto shrink-0" />

        {/* `mt-auto` joga a saudação pro pé do painel escuro, encostada na
            folha clara. Assim o vazio do painel fica ENTRE marca e saudação —
            é ele que absorve a diferença de altura entre o SE e o 15 Pro Max,
            e nenhum dos dois elementos precisa se mover. */}
        <div className="mt-auto">
          <h1 className="text-h1 text-text-on-dark">Bem-vindo de volta.</h1>
          <p className="text-caption text-text-on-dark/70 mt-1.5">
            Sua empresa em dia começa por aqui.
          </p>
        </div>
      </div>

      {/*
        FOLHA CLARA. `-mt-5` a sobrepõe ao painel escuro (o canto arredondado
        "monta" em cima da cor), e `shrink-0` garante que ela nunca ceda espaço:
        num iPhone SE quem encolhe é o painel de cima, nunca o formulário.
      */}
      <div className="-mx-6 -mt-5 shrink-0 rounded-t-xl bg-surface-page px-7 pt-8">
        <CampoIcone icone={<IconeEmail />}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 flex-1 bg-transparent text-body text-text-primary
                       outline-none placeholder:text-text-muted"
          />
        </CampoIcone>

        <div className="mt-3.5">
          <CampoIcone icone={<IconeCadeado />}>
            <input
              type={verSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="min-h-12 flex-1 bg-transparent text-body text-text-primary
                         outline-none placeholder:text-text-muted"
            />
            {/* Mostrar a senha não é conveniência, é anti-punição (UX-12):
                errar a senha escondida gasta uma tentativa e nada ensina. */}
            <button
              type="button"
              onClick={() => setVerSenha((v) => !v)}
              aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
              className="shrink-0 text-text-muted transition-colors hover:text-text-secondary"
            >
              {verSenha ? <IconeOlhoFechado /> : <IconeOlho />}
            </button>
          </CampoIcone>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-[18px] w-[18px] accent-[var(--color-action-primary)]"
            />
            <span className="text-caption text-text-tertiary">Lembrar de mim</span>
          </label>
          <button className="text-caption font-semibold text-text-primary underline underline-offset-4">
            Esqueci a senha
          </button>
        </div>

        <div className="mt-6">
          <Button full>Entrar</Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border-hairline" />
          <span className="text-micro text-text-tertiary">ou entre com</span>
          <span className="h-px flex-1 bg-border-hairline" />
        </div>

        {/* O `gap-2` do Button já separa ícone e rótulo: nada de margem aqui. */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary">
            <IconeGoogle />
            Google
          </Button>
          <Button variant="secondary">
            <IconeApple />
            Apple
          </Button>
        </div>

        {/* Volta pro N3, fechando o ciclo: de lá se chega aqui, e daqui se
            volta pra lá. Ninguém fica preso na tela errada. */}
        <p className="text-caption text-text-tertiary py-6 text-center">
          Ainda não tem conta?{" "}
          <button className="font-semibold text-text-primary underline underline-offset-4">
            Criar conta
          </button>
        </p>
      </div>
    </main>
  );
}

/**
 * Campo com ícone à esquerda. Local, não DS: o `Texto` de `ui/form.tsx` é
 * rótulo-em-cima (o padrão do dossiê, universal UX-48). Aqui o rótulo É o
 * placeholder, porque com 2 campos conhecidos ("E-mail", "Senha") o rótulo
 * externo vira ruído. É a exceção que só o login justifica.
 */
function CampoIcone({
  icone,
  children,
}: {
  icone: ReactNode;
  children: ReactNode;
}) {
  return (
    <label
      className="flex items-center gap-3 rounded-lg border border-border-hairline
                 bg-surface-card px-4 transition-colors
                 focus-within:border-border-focus"
    >
      <span className="shrink-0 text-text-muted">{icone}</span>
      {children}
    </label>
  );
}

/* ─── Ícones, locais. ─────────────────────────────────────────────────────── */

function IconeEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconeCadeado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconeOlho() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconeOlhoFechado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.4 3.4M6.6 6.6A17.8 17.8 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" />
      <path d="m2 2 20 20" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
