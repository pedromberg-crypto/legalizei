"use client";

import { useState } from "react";

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
 * a moldura é um objeto físico (alumínio, vidro), não superfície do produto.
 * Se ela usasse `surface-card`, o token estaria mentindo sobre o que é.
 *
 * As telas rodam em <iframe> de 375×812 — então é o app real renderizando no
 * tamanho real, não print nem screenshot.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TELAS = [
  {
    rota: "/gate",
    nome: "N4 · Gate-CNAE",
    farol: "farol simples",
    shell: "wizard (fora do app)",
    nota: "A porta do produto. Textarea + typewriter, veredito 🟢/🟡/🔴, triagem, faixa.",
  },
  {
    rota: "/simulador",
    nome: "N18 · Simulador",
    farol: "farol complexa",
    shell: "app (dentro)",
    nota: 'O clímax. "Fator R" nunca aparece. Sugestão mira 30%, avisa a borda.',
  },
];

export default function MockupPage() {
  const [nonce, setNonce] = useState(0);

  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <header className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-micro text-text-tertiary mb-1">
              Legalizei · prancha de review
            </p>
            <h1 className="text-h1 text-text-primary">As 2 telas-farol</h1>
            <p className="text-body text-text-secondary mt-2 max-w-[52ch]">
              Uma de cada lado da fronteira do N9. A tensão entre elas é o que
              gera o Design System.
            </p>
          </div>
          <button
            onClick={() => setNonce((n) => n + 1)}
            className="min-h-10 rounded-md border border-border-strong bg-surface-card
                       px-4 text-caption font-semibold text-text-secondary
                       transition-colors hover:bg-surface-alt"
          >
            Recarregar as duas
          </button>
        </header>

        <div className="flex flex-wrap justify-center gap-12">
          {TELAS.map((t) => (
            <figure key={t.rota} className="flex flex-col items-center gap-4">
              <Phone src={`${t.rota}?v=${nonce}`} />
              <figcaption className="text-center max-w-[300px]">
                <p className="text-body-strong font-semibold text-text-primary">
                  {t.nome}
                </p>
                <p className="text-micro text-text-tertiary mt-1">
                  {t.farol} · shell: {t.shell}
                </p>
                <p className="text-caption text-text-secondary mt-2">{t.nota}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Moldura de iPhone. Medidas reais: viewport 375×812 (iPhone X/11 Pro/13 mini),
 * que é o preset "mobile" e o alvo do mapa-telas-mobile.
 * O bezel de 12px e o raio externo de 54px são o que dá a leitura de "aparelho";
 * sem isso o olho lê "site estreito".
 */
function Phone({ src }: { src: string }) {
  return (
    <div
      className="relative shrink-0 rounded-[54px] p-3"
      style={{
        // alumínio: gradiente sutil, não chapado. É objeto físico, não UI.
        background: "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        boxShadow:
          "0 40px 80px -20px rgba(27,30,36,.45), 0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      {/* botões laterais */}
      <span className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -left-[3px] top-[168px] h-12 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -right-[3px] top-[150px] h-16 w-[3px] rounded-r bg-[#0e1013]" />

      <div className="relative h-[812px] w-[375px] overflow-hidden rounded-[42px] bg-white">
        <iframe
          src={src}
          title={src}
          className="h-full w-full border-0"
          // sandbox permite o React rodar, mas isola a prancha da tela
          sandbox="allow-scripts allow-same-origin allow-forms"
        />

        {/* Dynamic island. pointer-events-none pra não roubar clique da tela. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-2">
          <div className="h-[26px] w-[100px] rounded-full bg-black" />
        </div>

        {/* home indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-2">
          <div className="h-[5px] w-[134px] rounded-full bg-black/25" />
        </div>
      </div>
    </div>
  );
}
