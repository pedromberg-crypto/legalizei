"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { TelaHeader, Rolagem, Rodape } from "@/components/ui/tela";
import { CUSTOS } from "@/lib/fiscal";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M5 · SEU PLANO — a conta honesta do MEI, no layout aprovado do E7.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no MESMO dia (pedido do Pedro: *"traga os layouts de
 * ME aprovados, mantendo as copys daqui"*, com esta tela como exemplo).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do E7 versão **oferta** (`PlanoOferta` em `wizard-dinheiro.tsx`), que é o
 * que roda em produção no caminho ME e foi validado com o Pedro entre 28/08 e
 * 01/09, em várias rodadas: título bicolor em linha única, card-herói escuro
 * com o brilho coral saindo do canto inferior esquerdo, o Léo emergindo da
 * lateral direita, pill coral, preço sem centavos, inclusos como
 * cartões-linha, e o total COM centavos só no rodapé, junto da decisão.
 *
 * ⚠️ NÃO É IMPORT, E NÃO PODE SER. A trava de fronteira
 * (`verificar-fronteira-mei.mjs`) proíbe o ramo MEI de importar tela de ME —
 * foi essa herança que fez o MEI acumular 4 defeitos em 8 dias. O que se
 * herda aqui é o DESENHO, reescrito com os mesmos tokens do DS. Se o Pedro
 * mudar o card-herói no ME, esta tela não muda sozinha: é o preço combinado
 * de ter dois caminhos que não se quebram entre si.
 *
 * ─── O QUE MUDA EM RELAÇÃO AO E7, E POR QUÊ ─────────────────────────────────
 * O E7 se chama "a conta da abertura" e existe pra fechar 3 baldes: grátis
 * (honorário) · taxa de governo (repasse) · mensalidade. **No MEI o balde do
 * meio não existe** — a abertura é gratuita em todas as instâncias, e o
 * honorário já é zero desde 14/07.
 *
 * Então o título muda de assunto: não é "quanto custa abrir", é *"se abrir é
 * grátis e eu mesmo clico, o que eu estou pagando?"*. É a tese do produto
 * (`cruzamento-flow-mei-vs-me.md`): não errar agora, e o ano seguinte.
 *
 * O bloco "o que ainda tem de custo pra abrir o CNPJ" FICA, com "Não tem" —
 * responder a pergunta antes dela ser feita vale mais que omitir a seção.
 *
 * 🔴 O CERTIFICADO NÃO VEM INCLUSO (decisão do Pedro, 28/08) e aparece na
 * MESMA lista onde a pessoa lê o que está incluso, num cartão próprio. Igual
 * ao E7: esconder seria o oposto da doutrina de honestidade antes do toque.
 *
 * 🔴 PENDÊNCIA DE NEGÓCIO, ANOTADA E NÃO INVENTADA: tirando o certificado do
 * plano, a fidelidade de 12 meses ficou **sem contrapartida escrita** (o ADR
 * de 04/08 dizia que ela ERA a contrapartida de pagar o certificado). O número
 * segue valendo porque não foi revogado, e a copy usa a formulação genérica.
 * Precisa de decisão Pedro/Mauro. Ver `execucao/flow/rastreio-mei.md`.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Ícone glossy, mesmo tratamento dos cartões-linha do E7. */
function IconeGlossy({ src }: { src: string }) {
  return <Image src={src} alt="" width={26} height={26} aria-hidden />;
}

/**
 * O que o plano MEI entrega. Escopo LIMITADO de propósito (nota do
 * `CUSTOS.MENSALIDADE_MEI`): não é o plano ME com preço menor, é escopo menor
 * mesmo — o teto legal do MEI é 1 colaborador.
 *
 * ✍️ A ORDEM não é a do E7. Lá o 1º item é a abertura grátis, porque é o que
 * a pessoa veio comprar. Aqui a abertura é grátis por LEI, não por escolha
 * nossa, então liderar com ela seria cobrar crédito por algo que não é nosso.
 * O 1º item é a ocupação: é o erro caro que a gente resolve, e é o que
 * justifica existir uma mensalidade num serviço cuja abertura é gratuita.
 */
const INCLUSO_MEI: { titulo: string; sub: string; icone: ReactNode }[] = [
  {
    titulo: "A ocupação certa, com o que ela cobre",
    sub: "A lista do governo tem armadilha: a ocupação é mais estrita que o código que ela mapeia. A gente escolhe com você e escreve o que você pode e não pode fazer.",
    icone: <IconeGlossy src="/icones/certificado-check-teste.png" />,
  },
  {
    titulo: "Notas fiscais sem limite",
    sub: "Emite pelo app, em segundos.",
    icone: <IconeGlossy src="/icones/certificado-raio-teste.png" />,
  },
  {
    titulo: "Guia mensal e declaração do ano",
    sub: "O DAS pronto todo mês, e a DASN-SIMEI entregue no prazo, sem você caçar nada no site do governo.",
    icone: <IconeGlossy src="/icones/certificado-papel-teste.png" />,
  },
  {
    titulo: "Monitor do teto",
    sub: "A gente acompanha seu faturamento e avisa ANTES de você estourar os R$ 81 mil. Nenhuma ferramenta oficial faz isso.",
    icone: <IconeGlossy src="/icones/certificado-gps-teste.png" />,
  },
  {
    titulo: "1 colaborador",
    sub: "O único que a lei permite ao MEI. FGTS e INSS patronal inclusos.",
    icone: <IconeGlossy src="/icones/certificado-pessoas-teste.png" />,
  },
  {
    titulo: "Assistente de contabilidade",
    sub: "Tira dúvida e resolve a rotina do MEI, a qualquer hora.",
    icone: <IconeGlossy src="/icones/certificado-balao-teste.png" />,
  },
];

export function PlanoMeiView({
  meta,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const mensalidade = CUSTOS.MENSALIDADE_MEI;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        {/* Título bicolor em linha única, igual ao E7. O assunto é outro: lá
            é "quanto custa abrir", aqui abrir é grátis por lei. */}
        <div className="shrink-0">
          {/* 🐛→🔒 07/09 (E2E do ramo, pedido do Pedro) — O TÍTULO ESTOURAVA
              55px NO iPhone SE. Ele herdou o `whitespace-nowrap` do E7 mas não
              a outra metade da decisão: lá o comentário diz que o texto foi
              **encurtado, não só diminuído** ("copy comprida encolhida fica
              ilegível antes de caber numa linha só"). "Depois é com a gente"
              tem 382px de largura natural num espaço de 327px.
              📐 MEDIDO, não estimado (método de 01/09): 6 alternativas passaram
              por régua antes desta. "Manter, não" dá 277px, 50px de folga — e
              diz a tese da tela melhor que a anterior, que só anunciava quem
              cuida. O contraste é o argumento: abrir não custa, manter custa. */}
          <h1 className="text-[1.375rem] leading-tight tracking-tight whitespace-nowrap">
            <span className="font-bold text-text-primary">Abrir é grátis.</span>{" "}
            <span className="font-bold text-text-tertiary">Manter, não</span>
          </h1>
          <p className="text-body text-text-secondary mt-2 whitespace-nowrap">
            Sem letra miúda, sem surpresa depois.
          </p>
        </div>

        {/* `Rolagem` no lugar do hook duplicado do E7: o degradê de
            continuidade virou componente do DS em 02/09, justamente porque
            toda tela com contêiner próprio nascia sem ele. */}
        <Rolagem className="mt-5 pb-4">
          {/* ═══ O CARD-HERÓI ═══════════════════════════════════════════════
              Mesma anatomia validada no E7: quina de 28px, ink com o brilho
              coral saindo de baixo à esquerda (atrás do preço), e o Léo
              emergindo da lateral direita — o `overflow-hidden` é o que faz a
              quina recortá-lo e sustentar a leitura de que ele está DENTRO. */}
          <div
            className="relative mt-4 overflow-hidden rounded-[28px] p-6"
            style={{
              backgroundColor: "var(--color-surface-dark)",
              backgroundImage:
                "radial-gradient(110% 85% at 2% 105%, color-mix(in srgb, var(--color-brand) 32%, transparent), transparent 62%)",
            }}
          >
            <Image
              src="/leo/leo-parede.png"
              alt=""
              aria-hidden
              width={240}
              height={468}
              className="pointer-events-none absolute -bottom-10 right-0 h-[190px] w-auto"
            />

            <div className="flex items-center gap-3">
              <span
                className="rounded-full bg-action-primary px-4 py-1.5 text-caption font-semibold text-text-on-brand"
                style={{ boxShadow: "0 3px 10px rgba(0,0,0,.35)" }}
              >
                Plano MEI
              </span>
            </div>

            {/* Preço SEM centavos aqui (decisão de 28/08): o valor com
                centavos vive no rodapé, que é onde precisão importa. */}
            <div className="mt-5 flex items-baseline gap-2">
              <p className="text-[2.75rem] font-bold leading-none text-text-on-dark">
                {reais(mensalidade)}
              </p>
              <span className="text-h2 text-text-on-dark/60">/mês</span>
            </div>
            <p className="mt-3 text-caption text-text-on-dark/70">
              A 1ª mensalidade já é o seu 1º mês.
            </p>
          </div>

          {/* ═══ O QUE ESTÁ INCLUSO ═════════════════════════════════════════ */}
          <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
            O que está incluso
          </p>
          <div className="flex flex-col gap-2.5">
            {INCLUSO_MEI.map((i) => (
              <div
                key={i.titulo}
                className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  {i.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">
                    {i.titulo}
                  </p>
                  <p className="text-micro text-text-tertiary">{i.sub}</p>
                </div>
              </div>
            ))}

            {/* 🔴 O QUE NÃO ESTÁ INCLUSO, na mesma lista onde ela lê o que
                está — mesmo tratamento do E7. Aqui COM o valor, porque desde
                30/08 o preço da certificadora parceira está fechado. */}
            <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-tertiary">
                <span className="text-body font-bold" aria-hidden>
                  !
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-text-primary">
                  Certificado digital: por sua conta
                </p>
                <p className="text-micro text-text-tertiary">
                  {/* ✍️ 07/09 — a frase dizia "fora daqui, certificadoras
                      cobram", o que deixou de ser verdade quando ele passou a
                      ser cobrado no app. Aqui ele ainda é só aviso de custo
                      futuro: a decisão mesmo acontece na M14. */}
                  Não precisa dele pra abrir. Precisa pra gente cuidar do dia a
                  dia sem te pedir senha, e o app só libera tudo com ele. São{" "}
                  {reais(CUSTOS.CERTIFICADO_PRECO)}/ano, cobrados depois que
                  seu CNPJ sair.
                </p>
              </div>
            </div>
          </div>

          {/* ═══ O CUSTO DE ABRIR ═══════════════════════════════════════════
              A seção FICA, mesmo o valor sendo zero: no E7 ela existe pra que
              o repasse de governo nunca se esconda dentro do preço. Aqui ela
              existe pelo motivo espelhado — a pessoa chega achando que abrir
              custa, e responder antes vale mais que omitir. */}
          <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
            O que ainda tem de custo pra abrir o CNPJ
          </p>
          <div className="rounded-2xl bg-surface-alt px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-caption text-text-secondary">Taxa de registro</p>
              <p className="text-caption font-semibold text-text-primary">Não tem</p>
            </div>
            <p className="mt-1 text-micro text-text-tertiary">
              O MEI não passa pela Junta Comercial: o registro é direto no
              Portal do Empreendedor, e é gratuito por lei em todas as
              instâncias.{" "}
              <strong className="font-bold text-text-secondary">
                A gente também não cobra nada pra abrir.
              </strong>{" "}
              Depois disso, o único custo é a sua mensalidade.
            </p>
          </div>

          <p className="mt-4 text-micro text-text-tertiary px-1">
            Período mínimo de permanência de {CUSTOS.FIDELIDADE_MESES} meses,
            contado a partir da emissão do seu CNPJ. Cancelando antes, a multa é
            de {Math.round(CUSTOS.MULTA_CANCELAMENTO_PCT * 100)}% sobre as
            mensalidades que faltam, nunca sobre o que você já pagou.
          </p>
        </Rolagem>

        {/* ═══ O TOTAL — no rodapé, junto da decisão ═══ */}
        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">
              {mensalidade.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <Button full onClick={onSeguir}>
            Ótimo, continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
