"use client";

import { useEffect } from "react";
import { Lottie } from "@/components/lottie";
import { Logo } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPLASH DE MENSAGEM — transitório, SEM CTA, auto-avança sozinho
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 30/08 (pedido do Pedro) — 2 telas novas do mapa (E5F.1 "conseguimos te
 * atender" e E9.S "pagamento confirmado") compartilham este mesmo esqueleto:
 * poucos segundos na tela, nenhum toque esperado, some sozinho.
 *
 * ⚠️ Diferente da SplashView (N1): aquela decide de propósito NÃO
 * auto-navegar (ver doutrina em `splash.tsx`) porque é a 1ª tela do produto e
 * o /mockup a usa isolada. Esta aqui é o oposto — vive NO MEIO do fluxo,
 * confirmando algo que já aconteceu (atendemos você · pagamento caiu), então
 * segurar o dedo da pessoa não soma nada. Arte provisória (Pedro revisa).
 *
 * 🐛 30/08 (achado do Pedro no `/mapa`) — o board tem PRÉVIA AO VIVO por
 * iframe (`components/mapa/tela-node.tsx`, `PreviaTela`). Uma splash que
 * auto-navega DENTRO do iframe se substitui pela tela seguinte em ~1.8s: o
 * card fica com o rótulo "Splash" mas o preview já mostra a tela de depois —
 * exatamente o bug que a doutrina do N1 evitava (ver acima), só que esta tela
 * violava a mesma regra por precisar de auto-avanço de verdade em produção.
 * Corrigido detectando `window.self !== window.top`: dentro de iframe (o
 * board, o /mockup), o auto-avanço desliga e a splash fica parada — fora de
 * iframe (uso real), avança normal.
 */
export function SplashMensagemView({
  titulo,
  sub,
  onAutoAvancar,
  duracaoMs = 1800,
  variante = "sucesso",
  cta,
  passos,
  nota,
}: {
  titulo: string;
  sub?: string;
  /** Ausente = não navega sozinho (útil no Storybook/preview estático). */
  onAutoAvancar?: () => void;
  duracaoMs?: number;
  /**
   * 🆕 01/09 (pedido do Pedro) — 2ª variante: pagamento RECUSADO.
   *
   * Mesmo layout (logo, ícone grande, título, sub, auto-avanço), outra pele:
   * fundo escuro com o gradiente coral no canto, o mesmo do hero do status.
   * Coral cheio ("sucesso") pra confirmar e escuro pra recusar não é decoração:
   * a tela de recusa não pode ter a MESMA cara da de sucesso, senão a pessoa
   * lê o layout antes de ler a palavra e comemora errado. E o ícone vira um
   * "x" — check em tela de falha seria o pior tipo de ruído.
   */
  variante?: "sucesso" | "recusado";
  /**
   * 🆕 01/09 (pedido do Pedro) — quando presente, a tela DEIXA de ser splash:
   * ganha CTA fixo embaixo e não avança sozinha. É o caso do aviso de
   * irreversibilidade que roda depois do A1 — ali a passagem tem que ser um
   * ATO da pessoa, não um relógio. Mantive no mesmo componente porque o que
   * dá o peso é justamente a pele de splash (coral cheio, tela inteira); só
   * o gesto de saída muda.
   */
  cta?: { label: string; onClick?: () => void };
  /**
   * 🆕 04/09 (pedido do Pedro, no A2) — OS PRÓXIMOS PASSOS COMO LISTA.
   *
   * O A2 tinha 4 frases num parágrafo só: disparo da viabilidade, paralelismo
   * da guia, o que fazer se a Junta pedir ajuste e a irreversibilidade. Cada
   * uma é verdadeira e necessária, mas empilhadas viram um bloco de texto que
   * ninguém lê na tela mais tensa do flow. Em lista, a pessoa vê o CAMINHO (é
   * o que tranquiliza) e lê o detalhe só do passo que lhe interessa.
   *
   * Desenho emprestado da timeline do status (`painel.tsx`): bolinha, linha
   * conectando e detalhe embaixo do nome. Aqui em versão clara, sobre o coral.
   */
  passos?: { titulo: string; detalhe: string }[];
  /**
   * Nota em corpo miúdo, embaixo da lista. Nasceu pro "se a Junta pedir um
   * ajuste, a gente resolve": é reforço de tranquilidade, não instrução, então
   * não pode disputar peso com os passos.
   */
  nota?: string;
}) {
  const recusado = variante === "recusado";
  useEffect(() => {
    if (!onAutoAvancar || cta) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const t = setTimeout(onAutoAvancar, duracaoMs);
    return () => clearTimeout(t);
  }, [onAutoAvancar, duracaoMs, cta]);

  return (
    // 🎓 lição do `welcome.tsx` (29/08): `absolute inset-0` ancorado no
    // `.app-page` (já `position:relative`) em vez de `fixed inset-0` —
    // sangra até o vidro do aparelho sem precisar de wrapper com `transform`
    // pra criar containing block (o que a SplashView/N1 ainda precisa).
    <div
      /* Com `passos` a tela deixa de ser cartaz: o conteúdo cresce, encosta no
         topo (abaixo do logo) e rola se o aparelho for baixo. Sem eles, nada
         muda — as 5 splashes de sempre seguem centradas. */
      className={`absolute inset-0 z-50 flex flex-col items-center px-10 ${
        passos
          ? "justify-start gap-4 overflow-y-auto pt-20 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "justify-center gap-5 text-center"
      } ${recusado ? "bg-surface-dark" : "bg-brand"}`}
      style={
        recusado
          ? {
              // Mesmo gradiente do hero escuro do status (painel.tsx): coral
              // no canto, escuro no resto — a família visual do "estamos
              // cuidando disso", não a do "deu certo".
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }
          : undefined
      }
    >
      <Logo variante="negativa" className="absolute top-8 h-7 w-auto" />
      {/* 🧪 01/09 (pedido do Pedro) — o check parado dá lugar ao LOTTIE de
          check+confete (`success-confetti`, a 1ª camada dele chama "Tick").
          Só no caso de sucesso: na recusa continua o "x" estático, porque
          confete em tela de erro seria comemorar o problema da pessoa.
          🐛 01/09 (achado do Pedro) — o check é branco no arquivo, mas o
          CÍRCULO atrás dele tinha sido recolorido pro mesmo coral do fundo do
          splash: sumia no fundo e levava o check junto, por falta de contorno.
          Daí a variante `check-splash`, com as cores INVERTIDAS em relação ao
          original: disco BRANCO e check CORAL. Sobre o fundo coral do splash é
          o branco que precisa fazer o recorte — é ele que separa o símbolo do
          fundo. O `success-confetti` original segue intocado no veredito, onde
          o fundo é claro e a lógica se inverte.
          O Lottie roda em loop; se ficar repetitivo demais numa tela que dura
          poucos segundos, o ajuste é no player, não aqui. */}
      {recusado ? (
        /* 🆕 01/09 (pedido do Pedro) — o "x" estático deu lugar ao lottie
           "Bouncy Fail" (vinha vermelho). Recolorido em DUAS cores, não uma:
           o círculo em branco e o X no ink do fundo (#1B1E24). Pintar tudo de
           branco apagava o X — ele vira o vazio dentro do disco, mesma lógica
           do check do sucesso, onde o disco é que faz o recorte.
           Vermelho ficou fora de propósito: sobre o fundo escuro-com-coral da
           recusa seria alarme em cima de alarme.
           Fica menor que o check do sucesso (h-40 × h-52) de propósito: erro
           não merece o mesmo palco que a comemoração. */
        <Lottie
          path="/lottie/fail-splash-legalizai-story-book.json"
          fps={30}
          // 🔄 01/09 (pedido do Pedro) — 160 → 128 → 115 → 104px.
          className="h-[104px] w-[104px]"
        />
      ) : (
        <Lottie
          path="/lottie/check-splash-legalizai-story-book.json"
          fps={60}
          // 🔄 01/09 (pedido do Pedro) — +30%: 160 → 208px. O confete do
          // lottie ocupa boa parte do quadro, então o disco desenhado é bem
          // menor que a caixa: pra o CHECK crescer 30%, a caixa cresce junto.
          // 🔄 04/09 — com lista ele encolhe (o protagonista aqui é o caminho,
          // não a comemoração), mas 128px ficou miúdo demais na tela: 160px,
          // que empurra o conteúdo pra baixo na mesma medida.
          className={passos ? "h-40 w-40 shrink-0" : "h-52 w-52"}
        />
      )}
      <div className={passos ? "w-full max-w-sm" : undefined}>
        <h1 className={`text-h1 ${recusado ? "text-text-on-dark" : "text-text-on-brand"}`}>
          {titulo}
        </h1>
        {sub && (
          <p
            className={`text-body mt-2 ${
              recusado ? "text-text-on-dark/80" : "text-text-on-brand/80"
            }`}
          >
            {sub}
          </p>
        )}
      </div>

      {/* ── OS PRÓXIMOS PASSOS ────────────────────────────────────────────
          Mesma gramática da timeline do status: bolinha, linha conectando,
          detalhe embaixo do nome. Aqui em branco sobre o coral, e sem estado
          (nada aconteceu ainda) — é um roteiro, não um progresso. */}
      {passos && (
        <ol className="w-full max-w-sm">
          {passos.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-3 pb-5 last:pb-0">
              {/* A linha para no último item: ela conecta passos, e depois do
                  último não há o que conectar. */}
              {i < passos.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[7px] top-5 bottom-1 w-px bg-text-on-brand/30"
                />
              )}
              <span
                aria-hidden
                className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-text-on-brand/70"
              />
              <span className="min-w-0">
                <span className="block text-body font-semibold text-text-on-brand">
                  {p.titulo}
                </span>
                <span className="mt-0.5 block text-caption text-text-on-brand/70">
                  {p.detalhe}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}

      {nota && (
        <p className="w-full max-w-sm text-micro text-text-on-brand/70">{nota}</p>
      )}

      {/* CTA fixo, só na variante de aviso. Fica no rodapé (thumb zone) e não
          no meio da tela: é decisão, não confirmação — e decisão a gente toma
          com o polegar onde ele já está. */}
      {cta && (
        <div className="absolute inset-x-0 bottom-0 px-6 pb-[calc(24px+var(--safe-bottom))]">
          <button
            type="button"
            onClick={cta.onClick}
            /**
             * 🔄 04/09 (pedido do Pedro) — o rótulo passou de coral-700
             * (`action-primary-sm`) pro CORAL DA MARCA (`text-brand`,
             * coral-500), o mesmo tom do fundo da tela: o botão vira um
             * recorte do fundo, não um elemento com cor própria.
             *
             * 🔴 DÍVIDA DE CONTRASTE, registrada: coral-500 sobre branco dá
             * ~3,0:1, e a regra travada em 12/07 pede 4,5:1 pra texto de 16px
             * bold (o coral-700 dava 5,64:1). Qualquer coral mais claro que o
             * 700 reprova nesse tamanho; as saídas seriam voltar ao 700 ou
             * subir o rótulo pra ≥18,66px bold, que é quando 3:1 passa a
             * valer. O Pedro pediu o claro sabendo do custo.
             */
            className="flex min-h-12 w-full items-center justify-center rounded-md bg-surface-card
                       px-4 text-body font-bold text-brand transition-opacity
                       hover:opacity-90"
          >
            {cta.label}
          </button>
        </div>
      )}
    </div>
  );
}

/** O par do check, pra variante de recusa. Mesmo peso visual, outro sinal. */
function XGrandeSplash() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.16" />
      <path
        d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckGrandeSplash() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.16" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
