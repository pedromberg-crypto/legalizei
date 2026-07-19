"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti } from "@/components/confetti";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQUÉTIPO A2 — VEREDITO 🟢/🟡/🔴
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte ÚNICA do veredito do CNAE. Vivia dentro do gate (N4); extraído em
 * 17/07 pra o gate E a esteira A2 do /mockup usarem o MESMO componente.
 *
 * Regra de ouro (spec T4): NUNCA dar veredito com baixa confiança.
 * ⚠️ Coral NUNCA é erro: 🟡/🔴 usam os tokens de ESTADO, nunca o coral.
 *
 * ─── PRINCÍPIO DA FACE (decidido 17/07 com o Pedro) ────────────────────────
 * **O card vende RECONHECIMENTO, não economia.** O ativo de conversão aqui é
 * "eles me entenderam". O dinheiro tem dono: o N5 (teaser), calibrado em 3
 * modos justamente pra não prometer demais. Duas fontes pra mesma promessa
 * ressuscitariam a `promessa-quebrada` dois passos antes de ter conserto.
 *
 * Por isso a ALÍQUOTA SAIU DA FACE. Motivos, em ordem de peso:
 *   1. Era ERRADA — dizia "Anexo III" fixo; o dado real do 6201-5/02 é
 *      `anexos:[III,V]` + `fator_r:true`. O anexo DEPENDE do Fator R, que é a
 *      feature-âncora. O exemplo-vitrine achatava justo a mecânica do produto.
 *   2. É jargão (regra dura: nunca "Anexo III" cru pro leigo).
 *   3. É `nao-ratificado` (afirmação do líder, fila-Larissa). Cravar número
 *      fiscal pré-pagamento não é poluição, é passivo.
 *
 * ─── PROFUNDIDADE A 1 CLIQUE (UX-48) ──────────────────────────────────────
 * Expander default FECHADO: quem quer, abre; quem não quer, nem vê. Sem flag,
 * sem rotular ninguém de "leigo". O item mais valioso lá dentro é o
 * **"o que NÃO entra aqui"**: é o guarda-corpo do falso-🟢 no último momento
 * em que corrigir ainda é de graça (depois do N9 vira reembolso).
 *
 * ─── TRANSPARÊNCIA FISCAL (decidido 17/07 com o Pedro) ────────────────────
 * Tese dele, e está certa: o líder ancora no piso ("a partir de 6%") e esconde
 * o resto. A gente mostra **as duas tabelas**, inclusive a cara. É o
 * diferencial: "A conta inteira, sem asterisco".
 *
 * O que ficou de fora, e por quê:
 *   · **O teto de 33% NÃO é citado** (decisão do Pedro). Assusta e não é o caso
 *     dos nossos usuários: exigiria ~R$4,8mi/ano, 13× o teto da ME (R$360k/ano)
 *     que ele está abrindo. Mostrar seria o pecado espelhado do concorrente.
 *   · **"X% dos clientes pagam 6%" VETADO** — não temos base de clientes nem
 *     distribuição de Fator R. Número sem fonte não entra (regra dura).
 *
 * ⚠️ ORDEM: a faixa de faturamento é perguntada DEPOIS deste card
 * (veredito → triagem → faixa). Então aqui NÃO dá pra dizer "no seu
 * faturamento, 6%": a 1ª faixa do Simples vai até R$180k/ano (R$15k/mês) e
 * quem fatura R$25k/mês já está na 2ª. Aqui vai a MECÂNICA (as duas tabelas +
 * a alavanca); a alíquota personalizada é do **N5**, onde a faixa já existe.
 * Fonte das entradas: fiscal-simples-bh-2026 (🟢, LC 123 Anexos III e V).
 *
 * 🔗 Fronteira com A9: 🟡 e 🔴 usam o TEMPLATE de saída graciosa; quando A9 for
 * construído, viram `SaidaGraciosa` e este arquivo delega.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Veredito = "atende" | "waitlist" | "nao-atende";

export interface Resultado {
  humano: string;
  explica: string;
  cnae: string;
  veredito: Veredito;
  /**
   * O que o código oficialmente cobre (CONCLA/IBGE).
   * 🚚 NÃO renderizado aqui desde 17/07: a linha `explica` da FACE já faz esse
   * trabalho em linguagem dele, e repetir dentro da gaveta era peso sem ganho.
   * Fica no modelo porque o N14 (CNAE secundários) vai consumir.
   */
  compreende?: string[];
  /**
   * Atividades VIZINHAS — as que a classificação oficial não põe neste código.
   *
   * ⚠️ NÃO é "o que a gente não faz" (erro corrigido 17/07). Listar isso como
   * exclusão mentia sobre o produto: os 4 vizinhos do 6201-5/02 — inclusive
   * design gráfico (7410-2/99) — são ATENDIDOS, mesmo anexo, mesma abertura
   * lisa. Dizer "não entra" faria o designer que também faz web achar que a
   * gente recusa metade dele.
   *
   * A pergunta certa não é "isso está fora?", é **"isso é a sua principal ou é
   * adicional?"**. Adicional vira CNAE secundário (é pra isso que o N14
   * existe); principal errada é que manda pro refazer.
   */
  vizinhas?: {
    oque: string;
    cnae: string;
    /**
     * Consequência de adicionar como SECUNDÁRIA. Derivado do dado, NUNCA fixo:
     *  · `mesmo-imposto` — atendida e mesmo anexo → entra sem mexer no imposto
     *  · `muda-imposto`  — atendida, anexo diferente → entra, mas recalcula
     *                      (o caso da persona `instrutora`: 15,5% × 6%)
     *  · `fora`          — não atendida / regulada / comércio → conversa outra
     */
    comoSecundaria: "mesmo-imposto" | "muda-imposto" | "fora";
  }[];
  /**
   * Tributação. `entradas` = alíquota de ENTRADA de cada tabela possível (%).
   *
   * 🚚 NÃO É RENDERIZADO AQUI (decisão 17/07). O bloco fiscal saiu do veredito
   * e migrou pro N5/N18. Motivo: nesta tela QUALQUER número machuca.
   *   · mostrar **6%** → a `promessa-quebrada` ancora no melhor caso e se
   *     machuca 3 telas depois (ela já pagou);
   *   · mostrar **15,5%** → a `cida` vê o número ruim ANTES de saber que existe
   *     alavanca, e desiste antes de pagar;
   *   · mostrar **"6% a 11,2%"** (a régua real do Anexo III dentro da ME) →
   *     esconde o 15,5%, que é exatamente a jogada que a gente acusa o
   *     concorrente de fazer. Sairíamos de "eles escondem o teto" pra "nós
   *     escondemos o risco".
   * No N18 o número é CALCULADO, os dois cenários aparecem lado a lado e a
   * pessoa mexe na alavanca e vê mudar. É lá que "a conta inteira, sem
   * asterisco" se PROVA em vez de ser prometida.
   *
   * 🕓 Antes de virar UI no N5/N18: o 11,2% (2ª faixa do Anexo III) e o teto ME
   * de R$360k/ano ainda NÃO estão ratificados no vault (só o 6% está 🟢) →
   * fila-Larissa. E "grande parte das pessoas paga X%" segue VETADO: não temos
   * base de clientes nem distribuição de Fator R.
   */
  fiscal?: { entradas: number[]; dependeProLabore: boolean };
}

export function VereditoView({
  r,
  onRefazer,
  onSeguir,
}: {
  r: Resultado;
  // Opcionais: o gate passa a navegação real; o mock do /mockup não precisa.
  onRefazer?: () => void;
  onSeguir?: () => void;
}) {
  const [celebrar, setCelebrar] = useState(false);
  // Captura das saídas 🟡/🔴 (spec T4 + UX-35). Hooks no topo: não podem viver
  // dentro do ramo, e o caminho feliz simplesmente não usa.
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (r.veredito === "atende") {
    return (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Selo tipo="sucesso" />

          <Card>
            {/* UX-05: linguagem humana ANTES do código. O leigo não decora número. */}
            <h2 className="text-h2 mb-1">{r.humano}</h2>
            <p className="text-body text-text-secondary mb-4">{r.explica}</p>
            {/* O código fica como RECIBO discreto: prova de que existe um
                enquadramento oficial, sem virar jargão na cara dele. */}
            <div className="pt-3 border-t border-border-hairline">
              <p className="text-micro text-text-tertiary mb-0.5">
                Sua atividade na Receita
              </p>
              <p className="text-caption text-text-secondary">CNAE {r.cnae}</p>
            </div>
          </Card>

          <Detalhe r={r} />

          {/* UX-14: em 1 linha, o que vem agora. Sem prometer número (o N5 é
              quem promete, e em 3 modos calibrados). */}
          <p className="text-body text-text-secondary mt-4">
            É disso que a gente cuida, do jeito certo, no Simples. Agora faltam
            duas perguntas rápidas.
          </p>
        </div>

        <div className="app-footer-cta">
          {/* 🌾 colhido: "refazer" ACIMA do CTA, sem perder o texto digitado.
              Ao celebrar, some INSTANTÂNEO (invisible, sem transição): a pessoa
              já confirmou, não faz sentido oferecer voltar durante o confete. É
              `invisible`, não removido, pra não dar reflow e empurrar o burst. */}
          <div className={`flex justify-center mb-1 ${celebrar ? "invisible" : ""}`}>
            <Button variant="ghost" onClick={onRefazer}>
              Não é bem isso, refazer
            </Button>
          </div>
          {/* 🌾 colhido: ao confirmar, o botão ENCOLHE até virar um ponto e o
              confete (Lottie da marca) assume o círculo ali no rodapé. */}
          <div className="relative">
            <div
              style={{
                transition:
                  "transform .32s cubic-bezier(.22,1,.36,1), opacity .32s",
                transformOrigin: "center",
                transform: celebrar ? "scale(.18)" : "scale(1)",
                opacity: celebrar ? 0 : 1,
              }}
            >
              <Button full disabled={celebrar} onClick={() => setCelebrar(true)}>
                É isso mesmo
              </Button>
            </div>
            {celebrar && (
              <Confetti
                onDone={() => {
                  setCelebrar(false);
                  onSeguir?.();
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  // 🟡 waitlist e 🔴 comercial compartilham o TEMPLATE de saída graciosa (A9):
  // barra + explica + CAPTURA + roteia.
  const waitlist = r.veredito === "waitlist";
  // Baixa fricção de propósito: quem foi recusado não preenche formulário longo.
  const contatoOk = /@/.test(contato) || contato.replace(/\D/g, "").length >= 10;
  const podeEnviar = nome.trim().length >= 2 && contatoOk;

  /* ── ESTADO 2: confirmado ──────────────────────────────────────────────
     Terminal. O selo vira VERDE porque o que deu certo foi a AÇÃO (entrou na
     lista), não o veredito — e a copy deixa isso explícito pra não confundir
     com "a gente te atende". */
  if (enviado) {
    return (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Selo tipo="sucesso" />
          <Card>
            <h2 className="text-h2 mb-1">
              {waitlist ? "Pronto, você está na lista" : "Seu contato já foi"}
            </h2>
            <p className="text-body text-text-secondary">
              {waitlist
                ? "Assim que a gente abrir para a sua atividade, você é avisado em primeira mão e entra na frente da fila."
                : "Nosso time contábil recebeu o seu caso e vai te chamar no WhatsApp."}
            </p>
          </Card>

          {/* UX-35: o lead vai COM contexto. É o que diferencia de um e-mail
              solto numa planilha, e o que evita pedir tudo de novo depois. */}
          <div className="mt-4 rounded-md bg-state-info-tint p-4">
            <p className="text-caption font-semibold text-state-info-text mb-1">
              Você não vai repetir nada
            </p>
            <p className="text-caption text-text-secondary">
              A gente já anotou o que você faz e o enquadramento que encontramos
              ({r.cnae}). Quando falarmos com você, começamos daí.
            </p>
          </div>

          {/* UX-22: waitlist não pode ser beco — dar o "enquanto isso". */}
          {waitlist && (
            <p className="text-body text-text-secondary mt-4">
              Enquanto isso, se você precisar abrir agora, nosso escritório
              atende o seu caso do jeito tradicional.
            </p>
          )}
        </div>

        {waitlist && (
          <div className="app-footer-cta">
            <Button full variant="secondary">
              Falar com um contador agora
            </Button>
          </div>
        )}
      </>
    );
  }

  /* ── ESTADO 1: veredito + captura ─────────────────────────────────────── */
  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Mesmo esqueleto do 🟢: selo centralizado → card → próximo passo.
            O selo carrega o STATUS; o card carrega o RECONHECIMENTO (a gente
            entendeu o que você faz), igual no caminho feliz. */}
        <Selo tipo={waitlist ? "espera" : "humano"} />

        <Card>
          <h2 className="text-h2 mb-1">{r.humano}</h2>
          <p className="text-body text-text-secondary mb-4">{r.explica}</p>
          <div className="pt-3 border-t border-border-hairline">
            <p className="text-micro text-text-tertiary mb-0.5">
              Sua atividade na Receita
            </p>
            <p className="text-caption text-text-secondary">CNAE {r.cnae}</p>
          </div>
        </Card>

        {/* UX-22: não é um "não" seco. Honestidade + o convite. */}
        <p className="text-body text-text-secondary mt-4 mb-4">
          {waitlist
            ? "A gente ainda não abre esse tipo sozinho, e não vamos fingir que abre. Quer ser avisado quando abrir?"
            : "A gente cuida de quem vive de prestar serviço, e o seu caso o nosso time contábil resolve. Quer que a gente te conecte?"}
        </p>

        {/* Captura na PRÓPRIA tela (spec T4): 2 campos, sem conta, sem senha. */}
        <div className="flex flex-col gap-3">
          <CampoSaida
            rotulo="Seu nome"
            valor={nome}
            onChange={setNome}
            placeholder="Como a gente te chama"
          />
          <CampoSaida
            rotulo="WhatsApp ou e-mail"
            valor={contato}
            onChange={setContato}
            placeholder="(31) 90000-0000"
          />
          {/* 🕓 LGPD: opt-in pela ação + aviso. Se o jurídico exigir checkbox
              explícito, vira checkbox (decisão Mauro/Larissa). */}
          <p className="text-micro text-text-tertiary">
            A gente usa isso só pra te avisar sobre isso aqui. Sem spam, e você
            pode pedir pra sair quando quiser.
          </p>
        </div>
      </div>

      <div className="app-footer-cta">
        <div className="flex justify-center mb-1">
          <Button variant="ghost" onClick={onRefazer}>
            Não é bem isso, refazer
          </Button>
        </div>
        <Button
          full
          variant="dark"
          disabled={!podeEnviar}
          onClick={() => setEnviado(true)}
        >
          {waitlist ? "Me avisa quando abrir" : "Falar com o time"}
        </Button>
      </div>
    </>
  );
}

/** Campo mínimo das telas de saída. Local: não é o form do dossiê. */
function CampoSaida({
  rotulo,
  valor,
  onChange,
  placeholder,
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-text-primary mb-1.5">
        {rotulo}
      </p>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-md border border-border-hairline bg-surface-card
                   px-3 text-body text-text-primary placeholder:text-text-muted
                   focus:border-border-focus focus:outline-none"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SELO DE SUCESSO — o momento de vitória do 🟢.
   Era discreto demais (círculo de 24px em tint + texto de 14px) pra uma
   notícia que é o payoff da tela inteira. Agora: 44px SÓLIDO + check desenhado.

   O peso vem do SELO, não do tipo: o título da atividade (h2, dentro do card)
   precisa continuar sendo o maior elemento — é ele que converte. Subir a frase
   pra h2 criaria dois h2 competindo.

   A animação é o que faz parecer conquistado: o selo entra com overshoot
   (cubic-bezier de "back-out") e o check se desenha em seguida. Transição em
   estado React, não keyframe global — fica local, sem tocar o DS.
   `prefers-reduced-motion` já zera a duração pelo globals.css, e o estado
   final é o visível, então degrada pra "aparece pronto".
   ⚠️ Verde = token de ESTADO. Coral nunca é status (regra dura da paleta).
   ───────────────────────────────────────────────────────────────────────── */
type SeloTipo = "sucesso" | "espera" | "humano";

/**
 * Os 3 estados usam o MESMO esqueleto (selo centralizado + frase abaixo +
 * respiro grande). Muda o símbolo, a cor de estado e a frase.
 *
 * ⚠️ ESCOLHA DE COR NO 🔴: ele usa **info (azul)**, não danger (vermelho).
 * O desfecho ali não é "você falhou", é "nosso time resolve o seu caso" — a
 * pessoa continua sendo atendida, só não pelo app. X vermelho leria como
 * rejeição e violaria a regra do template de saída graciosa ("bloqueio que
 * EDUCA, não pune"). Danger fica reservado pro que de fato barra (exterior,
 * 3+ sócios). E coral nunca é estado.
 */
const SELO: Record<SeloTipo, { fundo: string; texto: string; frase: string }> = {
  sucesso: {
    fundo: "bg-state-success",
    texto: "text-state-success-text",
    frase: "Achei o seu encaixe",
  },
  espera: {
    fundo: "bg-state-warning",
    texto: "text-state-warning-text",
    frase: "Ainda não, por enquanto",
  },
  humano: {
    fundo: "bg-state-info",
    texto: "text-state-info-text",
    frase: "Seu caso pede uma pessoa",
  },
};

function Selo({ tipo }: { tipo: SeloTipo }) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const s = SELO[tipo];

  return (
    // Centralizado e empilhado: vira MOMENTO, não status de canto. O respiro
    // grande embaixo (mb-8) é o que separa a comemoração da informação e faz
    // o card abaixo ler como bloco próprio, com destaque.
    <div className="mt-2 mb-8 flex flex-col items-center text-center">
      <span
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full
                    text-text-on-dark ${s.fundo}`}
        style={{
          transform: entrou ? "scale(1)" : "scale(.6)",
          opacity: entrou ? 1 : 0,
          transition:
            "transform .42s cubic-bezier(.34,1.56,.64,1), opacity .22s ease",
        }}
      >
        <Simbolo tipo={tipo} entrou={entrou} />
      </span>
      <p className={`mt-3 text-body font-semibold ${s.texto}`}>{s.frase}</p>
    </div>
  );
}

/**
 * O símbolo desenha-se depois do selo entrar (delay .16s), o que dá a sensação
 * de "carimbo". Cada traço tem seu comprimento aproximado em `strokeDasharray`
 * pra animação de traçado funcionar.
 */
function Simbolo({ tipo, entrou }: { tipo: SeloTipo; entrou: boolean }) {
  const traco = (comprimento: number, atraso = 0.16) => ({
    strokeDasharray: comprimento,
    strokeDashoffset: entrou ? 0 : comprimento,
    transition: `stroke-dashoffset .4s ease ${atraso}s`,
  });
  const comum = {
    stroke: "currentColor",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      {tipo === "sucesso" && (
        <path d="M5 12.5 10 17.5 19 7" {...comum} style={traco(24)} />
      )}
      {/* Relógio: "ainda não" é sobre TEMPO, não sobre erro. */}
      {tipo === "espera" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...comum} style={traco(54)} />
          <path d="M12 7.5v5l3.5 2" {...comum} style={traco(12, 0.4)} />
        </>
      )}
      {/* Pessoa: o desfecho é "alguém do time te atende", não uma recusa. */}
      {tipo === "humano" && (
        <>
          <circle cx="12" cy="8" r="3.4" {...comum} style={traco(22)} />
          <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" {...comum} style={traco(21, 0.34)} />
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PROFUNDIDADE A 1 CLIQUE (UX-48) — default FECHADO.

   UMA gaveta só (era duas até 17/07). Duas gavetas custam decisão mesmo
   fechadas: pra `cida`, gaveta fechada não é opção, é dever de casa — ela
   acha que está perdendo algo importante se não abrir.

   O rótulo mudou de "Isso é mesmo o meu caso?" pra a pergunta que a gaveta
   de fato responde. O antigo plantava DÚVIDA no exato momento em que a tela
   pede CONFIRMAÇÃO — trabalhava contra o próprio CTA.
   ───────────────────────────────────────────────────────────────────────── */
function Expander({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group mt-3 rounded-md border border-border-hairline bg-surface-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-caption font-semibold text-text-secondary">
        {titulo}
        <svg
          className="shrink-0 text-text-tertiary transition-transform group-open:rotate-180"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>
    </details>
  );
}

/**
 * A gaveta virou PARÁGRAFO, não lista (decisão do Pedro, 17/07). A lista de 4
 * vizinhas × 2 linhas pesava mais do que informava numa tela cujo único
 * trabalho é arrancar um "sim, sou eu". Os exemplos entram inline, em negrito.
 *
 * ⚠️ O fecho é DERIVADO do dado, nunca fixo: prometer "sem mexer no seu
 * imposto" pra quem tem vizinha de anexo diferente seria mentir com a
 * `instrutora` (treinamento 6% × consultoria 15,5%).
 */
function Detalhe({ r }: { r: Resultado }) {
  const vz = r.vizinhas ?? [];
  if (vz.length === 0) return null;

  const exemplos = vz.slice(0, 3).map((v) => v.oque);
  const todasIguais = vz.every((v) => v.comoSecundaria === "mesmo-imposto");
  const algumaFora = vz.some((v) => v.comoSecundaria === "fora");

  return (
    <Expander titulo="E se eu faço mais de uma coisa?">
      <p className="text-caption text-text-secondary">
        Você não fica preso à atividade principal. Se você também faz{" "}
        {exemplos.map((e, i) => (
          <span key={e}>
            <strong className="text-text-primary">{e}</strong>
            {i < exemplos.length - 1 ? ", " : " "}
          </span>
        ))}
        ou outra coisa, dá pra incluir mais pra frente como{" "}
        <strong className="text-text-primary">atividade secundária</strong>
        {todasIguais ? (
          <>
            ,{" "}
            <strong className="text-text-primary">
              sem mexer no seu imposto
            </strong>
            .
          </>
        ) : algumaFora ? (
          <>. Algumas a gente precisa ver junto com você.</>
        ) : (
          <>
            . Algumas podem mudar seu imposto, e a gente{" "}
            <strong className="text-text-primary">recalcula com você</strong>.
          </>
        )}
      </p>

      {/* 🛡️ O guarda-corpo do falso-🟢 sobrevive à simplificação: sem ele, quem
          errou a atividade PRINCIPAL segue e só descobre depois de pagar. */}
      <p className="text-caption text-text-secondary">
        Se a sua atividade <strong className="text-text-primary">principal</strong>{" "}
        for outra, toca em &ldquo;não é bem isso&rdquo; que a gente acerta agora.
      </p>

      <div className="border-t border-border-hairline pt-3">
        <p className="text-micro text-text-tertiary">
          Classificação oficial do IBGE/CONCLA.
        </p>
      </div>
    </Expander>
  );
}
