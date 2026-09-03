"use client";

import { TelaHeader, Rodape } from "@/components/ui/tela";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N7 — A CONTA DA ABERTURA · EXPLORAÇÃO "PREMIUM" (28/08) — PREVIEW.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08 (pedido do Pedro: "tá feia, quero algo mais premium que nos
 * valorize mais") — primeira de várias rodadas de referência visual. Mesmo
 * padrão de `/plano-v2`/`/plano-v2-robusto`: PREVIEW isolado, cópia própria,
 * NÃO conectado ao flow real nem à `/apresentacao` — não decide nada sozinho.
 *
 * ─── A REFERÊNCIA (print de app de viagem) — o que foi TRADUZIDO, não copiado
 * ─────────────────────────────────────────────────────────────────────────
 * Não copiei a paleta (azul/laranja de foto de viagem) nem os elementos que
 * não fazem sentido aqui (abas Ásia/América/Europa, carrossel de destino).
 * O que a referência tem de estrutural — e que dá a sensação de "caro" — foi
 * isso, adaptado aos NOSSOS tokens (`globals.css`, Sora, ink/coral):
 *   · Título BICOLOR/BIPESO: 1ª linha bold escura, 2ª linha bold em tom
 *     secundário — mesma gramática do "Find the trip / of your dreams".
 *   · Card-herói com profundidade real (`shadow-2xl`, raio grande
 *     `rounded-[28px]`), não só borda fina — é isso que lê como "prêmium" e
 *     não "formulário".
 *   · Badge/chip FLUTUANTE sobre o card (o "$400/Person" da referência vira
 *     "Certificado digital grátis"), em vez de linha de texto solta.
 *   · Lista de inclusos como CARTÕES-LINHA com avatar-ícone circular (o
 *     idioma do "Nearby Destination"), não checkmark+texto plano.
 *   · CTA como barra flutuante escura/coral com profundidade, ecoando a
 *     navbar flutuante escura do rodapé da referência.
 *
 * Copy e números são os MESMOS do `/plano` real (`PlanoOferta`,
 * `wizard-dinheiro.tsx`) — cenário ME, não MEI. Nenhum valor novo inventado.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const INCLUSO_PREMIUM = [
  {
    // 🔄 28/08 (pedido do Pedro: "quero mostrar o valor real do que estamos
    // dando") — "incluso, sem custo extra" era verdade mas invisível: não
    // dizia QUANTO isso vale. R$209 é o piso real do certificado A1
    // (R$209-229/ano), validado com a contadora Izabela em 09/07
    // (`execucao/processo-abertura-empresa-bh.md`). Usei o piso da faixa,
    // não o teto — número real, não estimativa otimista.
    titulo: "Certificado digital",
    sub: "Você está economizando R$209/ano com a gente.",
    icone: <IconeCadeado />,
  },
  { titulo: "Imposto e declarações", sub: "Guia pronta todo mês e obrigação entregue no prazo.", icone: <IconeDoc /> },
  { titulo: "Notas fiscais sem limite", sub: "Emite pelo app, em segundos.", icone: <IconeRaio /> },
  { titulo: "Pró-labore de até 2 sócios", sub: "Calculado junto com o seu imposto.", icone: <IconePessoas /> },
  { titulo: "Contador de verdade", sub: "Uma pessoa com nome, no WhatsApp.", icone: <IconeChat /> },
];

export default function PlanoPremiumPage() {
  const hoje = CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="A conta da abertura" semVoltar />
      <main className="app-main">
        <div className="shrink-0">
          {/* Eyebrow — o "Good Morning!" da referência vira a garantia da
              abertura, no lugar de saudação (não faz sentido aqui).
              🆕 28/08 (pedido do Pedro) — aumentada: px/py maiores, bolinha e
              texto maiores (era text-micro, virou text-caption). */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-state-success-tint px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-state-success" aria-hidden />
            <span className="text-caption font-semibold text-state-success-text">
              Abrir sua empresa é 100% grátis
            </span>
          </div>

          {/* Título bicolor/bipeso — gramática "Find the trip / of your dreams" */}
          <h1 className="text-[1.75rem] leading-[1.1] tracking-tight">
            <span className="block font-bold text-text-primary">Quanto custa</span>
            <span className="block font-bold text-text-tertiary">manter em dia</span>
          </h1>
        </div>

        <div className="mt-5 flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ── CARD-HERÓI — profundidade real, não borda fina ────────────── */}
          <div
            className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--color-surface-dark)",
              backgroundImage:
                "radial-gradient(120% 90% at 85% -10%, color-mix(in srgb, var(--color-brand) 30%, transparent), transparent 60%)",
            }}
          >
            {/* 🔴 28/08 (pedido do Pedro) — badge "Certificado grátis" REMOVIDO
                daqui: ele já aparece no card da lista "O que está incluso"
                logo abaixo, e duplicar a mesma informação em 2 lugares da
                MESMA tela é ruído, não reforço. */}

            <p className="text-caption text-text-on-dark/60">Depois, todo mês</p>
            {/* 🆕 28/08 (pedido do Pedro) — preço sem centavos ("R$ 139", não
                "R$ 139,00") + aumentado: 2.75rem → 3.5rem. */}
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-[3.5rem] font-bold leading-none text-text-on-dark">
                {brl(hoje)}
              </p>
              <span className="text-h2 text-text-on-dark/60">/mês</span>
            </div>
            <p className="mt-3 text-caption text-text-on-dark/70">
              A 1ª mensalidade já é o seu 1º mês. Se a empresa crescer muito, a
              gente conversa antes.
            </p>
          </div>

          {/* ── LISTA DE INCLUSOS — cartões-linha, idioma "Nearby Destination" */}
          <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
            O que está incluso
          </p>
          <div className="flex flex-col gap-2.5">
            {INCLUSO_PREMIUM.map((i) => (
              <div
                key={i.titulo}
                className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5 shadow-sm"
              >
                {/* 🆕 28/08 (pedido do Pedro) — ícones em verde: tom de
                    "sucesso/incluso" (`state-success`) em vez de coral, que
                    fica reservado pra ação (CTA). */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                  {i.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">{i.titulo}</p>
                  <p className="text-micro text-text-tertiary">{i.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Taxa da Junta — honesto, mas discreto (não é nossa margem).
              🆕 28/08 (pedido do Pedro) — o card sozinho, sem explicação,
              ficava "estranho" (parecia mais uma cobrança do que um aviso).
              Adicionei a frase que diz o que ele É: não é cobrado agora, é só
              pra não virar surpresa lá na frente. */}
          <div className="mt-4 rounded-2xl bg-surface-alt px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-caption text-text-secondary">Taxa da Junta Comercial</p>
              <p className="text-caption font-semibold text-text-primary">
                {brl(CUSTOS.DAE_JUCEMG, true)}
              </p>
            </div>
            <p className="mt-1 text-micro text-text-tertiary">
              Não é cobrada agora, é só um aviso pra não virar surpresa
              depois.
            </p>
          </div>
        </div>

        {/* ── CTA FLUTUANTE — ecoa a navbar escura flutuante da referência ──
            🐛 28/08 — o bug que o Pedro viu (tira roxa vazando embaixo da
            pill) era isto aqui não usar o `Rodape` compartilhado: sem ele, o
            rodapé não tinha o fundo sólido (`--color-surface-page`) nem o
            respiro de safe-area (`--safe-bottom`) que `.app-footer-cta` dá
            de graça — a pill ficava colada na borda de baixo do vidro, sem
            nada cobrindo o que existe atrás dela. `Rodape` resolve os dois:
            a "pill flutuante" vira o CONTEÚDO decorativo dentro do rodapé de
            verdade, não o rodapé em si. */}
        <Rodape>
          <div className="flex items-center justify-between gap-4 rounded-full bg-surface-dark py-2.5 pl-6 pr-2.5 shadow-2xl">
            <div className="min-w-0">
              <p className="text-micro text-text-on-dark/60">Você paga hoje</p>
              <p className="text-h2 font-bold text-text-on-dark">{brl(hoje, true)}</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full bg-action-primary px-6 py-3.5 text-body font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
            >
              Ótimo, continuar
            </button>
          </div>
        </Rodape>
      </main>
    </>
  );
}

function ic18() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function IconeCadeado() {
  return <svg {...ic18()}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function IconeDoc() {
  return <svg {...ic18()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h3" /></svg>;
}
function IconeRaio() {
  return <svg {...ic18()}><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>;
}
function IconePessoas() {
  return <svg {...ic18()}><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><path d="M14.5 14.2c2.5.3 4.5 2.4 4.5 5.8" /></svg>;
}
function IconeChat() {
  return <svg {...ic18()}><path d="M4 4h16v12H8l-4 4z" /></svg>;
}
