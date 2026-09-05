"use client";

import { CONSULTOR } from "@/app/(app)/dossie/mock";
import { SimboloLegalizai } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O CONSULTOR — rota assistida (🆕 04/09, decisão do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * No lançamento, o app conduz sozinho até a guia da Junta ser paga (A3′). Da
 * assinatura em diante quem assume é uma pessoa da casa, por WhatsApp.
 *
 * ─── POR QUE O CORTE É AQUI, E NÃO ANTES OU DEPOIS ────────────────────────
 * O A3′ é o último ponto em que tudo que falta ainda é NOSSO. O que vem
 * depois é o que a gente não controla: nível de conta GOV.BR (que nem
 * conseguimos ler), CAPTCHA, 2FA, um código que vale 10 minutos, e o contador
 * assinando junto na segunda. Automatizar isso é onde mora o risco, e é a
 * menor parte do valor — o flow automático até aqui já entrega mais do que a
 * contabilidade digital que existe hoje.
 *
 * ─── 🔄 05/09: NÃO HÁ CONSULTOR EXCLUSIVO ─────────────────────────────────
 * A 1ª versão destas telas dava nome, sobrenome e CRC a uma consultora fixa.
 * O Pedro corrigiu: a operação não tem profissional designado com agenda
 * própria. Quem atende é quem estiver disponível — e a tela que promete o
 * contrário cria uma expectativa que o primeiro atendimento desmente.
 *
 * ─── A REGRA DE COPY DESTA ROTA ───────────────────────────────────────────
 * 🔴 NUNCA enquadrar como limitação ("nosso sistema não consegue", "a partir
 * daqui é manual"). O motivo real é bom e é checável: assinatura tem valor
 * legal e o código tem prazo, então é feita JUNTO, com alguém do seu lado.
 * 🔴 E nunca o vazio "nossa equipe entra em contato". Sem nome pra dar, sobra
 * o que dá pra afirmar sem mentir, que ainda é bastante: é gente da CASA (não
 * robô, não terceirizado), é junto com a pessoa, tem hora marcada, e existe
 * uma janela de atendimento conhecida.
 * 🔴 E nunca "AO VIVO" (proibido pelo Pedro, 05/09): o termo é de
 * transmissão, e aqui não há nada sendo transmitido — são duas pessoas
 * fazendo uma coisa ao mesmo tempo. Diga "junto", "na hora", "com você".
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Selo do consultor: o SÍMBOLO DA MARCA.
 *
 * 🔄 05/09 (pedido do Pedro) — passou por avatar de iniciais ("LA", enquanto
 * existia uma consultora nomeada) e por uma silhueta de pessoa. Agora é a
 * própria logo, e faz mais sentido do que as duas: o que o cartão afirma não é
 * QUEM atende (não há pessoa fixa), é DE ONDE vem quem atende. Um símbolo de
 * pessoa genérica dizia "alguém"; a marca diz "nosso".
 *
 * O círculo tint saiu junto — a logo já é uma forma fechada, com fundo coral e
 * cantos próprios, e emoldurá-la num segundo fundo faria dois recipientes
 * concêntricos.
 */
export function SeloConsultor({ tamanho = 44 }: { tamanho?: number }) {
  return <SimboloLegalizai tamanho={tamanho} />;
}

/**
 * O cartão de apresentação. Aparece na tela em que a casa assume (A3.H) e na
 * de agendamento, pra pessoa saber com quem vai falar antes de escolher a hora.
 *
 * `motivo` é opcional porque na 2ª aparição a explicação já foi dada: repetir
 * o porquê em toda tela transforma um argumento bom em ladainha.
 */
export function CardConsultor({ motivo = true }: { motivo?: boolean }) {
  return (
    <div className="rounded-md border border-border-hairline bg-surface-card p-4">
      {/* 🗑️ 05/09 (pedido do Pedro) — saiu o subtítulo "Gente da nossa equipe,
          ao vivo com você": o parágrafo logo abaixo já diz que um consultor
          conduz junto, e a mesma promessa em dois tamanhos de fonte no mesmo
          cartão vira eco, não ênfase.
          Com o título sozinho à esquerda, o alinhamento volta a ser
          `items-center`: são 1-2 linhas contra 3 do bloco de horário, e aí
          quem pareia as colunas é o meio, não o topo. */}
      <div className="flex items-center gap-3">
        <SeloConsultor />
        <div className="min-w-0 flex-1">
          <p className="text-body-strong font-semibold text-text-primary">{CONSULTOR.titulo}</p>
        </div>
        {/* O rótulo diz de quem é a janela: é o atendimento da casa, não a
            agenda de uma pessoa. `shrink-0` + `text-right` pra ela nunca
            quebrar sozinha no meio de "Seg a" / "sex". */}
        <div className="shrink-0 text-right">
          <p className="text-micro text-text-muted">Atendimento</p>
          <p className="text-micro text-text-tertiary">{CONSULTOR.atendimentoDias}</p>
          <p className="text-micro text-text-tertiary">{CONSULTOR.atendimentoHoras}</p>
        </div>
      </div>

      {motivo && (
        <p className="text-caption text-text-secondary mt-3">
          {/* ✍️ 05/09 (pente-fino do Pedro) — eram 3 linhas, e a primeira
              ("A partir daqui um consultor conduz com você") repetia o hero
              logo acima. Ficou só o que este cartão é o único a explicar: POR
              QUE precisa de alguém junto. Fato, não desculpa. */}
          O GOV.BR manda um código que vale 10 minutos, então a assinatura é feita
          com alguém do seu lado.
        </p>
      )}
    </div>
  );
}

/**
 * O COMPROMISSO — cartão do horário marcado (A3.H2).
 *
 * 🆕 04/09 (pedido do Pedro) — entra logo abaixo do hero escuro e TOMA O LUGAR
 * do subtítulo dele: com os dois, "Hoje às 15:00" apareceria duas vezes em
 * blocos colados.
 *
 * 🔄 05/09 (referência do Pedro) — REDESENHADO no formato de cartão de
 * compromisso: bloco de data à esquerda (semana · número · mês), horário
 * grande à direita com o contexto embaixo, divisor, e o rodapé dizendo quem
 * conduz com o atalho de contato ao lado.
 *
 * Por que esse formato ganha do anterior: o bloco de data é a coisa que a
 * pessoa procura quando abre o app pela terceira vez pra conferir o
 * compromisso, e como bloco ele se acha de relance, sem ler frase nenhuma.
 *
 * 🔒 O botão de contato mora AQUI, junto de quem atende, e por isso saiu do
 * rodapé da tela — a mesma ação em dois lugares na mesma tela faz a pessoa
 * achar que são coisas diferentes. No rodapé sobrou "Remarcar", que é ação de
 * app e tem outro destino.
 */
export function CardCompromisso({
  quando,
  onFalar,
}: {
  quando: { numero: number; semana: string; mes: string; hora: string; hoje?: boolean };
  /** Href do WhatsApp (o botão circular do rodapé do cartão). */
  onFalar?: string;
}) {
  return (
    <div className="rounded-md border border-border-hairline bg-surface-card p-4">
      <div className="flex items-start gap-3.5">
        {/* Bloco de data: mesma anatomia do cartão de dia da tela anterior
            (semana em cima, número grande, mês embaixo). Repetir a forma faz a
            pessoa reconhecer o que escolheu, em vez de reler. */}
        {/* 🔄 05/09 (pedido do Pedro) — `gap-1` entre as 3 linhas: coladas,
            "SEX 5 SET" lia como um bloco de texto só, e o número perdia o
            destaque que justifica o bloco existir. */}
        <div className="flex w-[68px] shrink-0 flex-col items-center gap-1 rounded-md bg-surface-alt py-2.5">
          {/* 🆕 05/09 (pedido do Pedro) — no DIA do compromisso a sigla da
              semana dá lugar a "HOJE". A pessoa que abre o app hoje não está
              perguntando que dia da semana é: ela quer saber se é agora. */}
          {/* 🔄 05/09 (correção do Pedro) — "HOJE" fica CINZA, como a sigla
              que ele substitui. Eu tinha posto em coral pra dar urgência, mas
              a linha é etiqueta de data, não alerta: colorir só ela criava um
              segundo foco dentro de um bloco cuja única estrela é o número. */}
          <span className="text-micro font-semibold uppercase tracking-wide text-text-tertiary">
            {quando.hoje ? "Hoje" : quando.semana}
          </span>
          <span className="text-h1 font-bold leading-none tabular-nums text-text-primary">
            {quando.numero}
          </span>
          <span className="text-micro font-semibold uppercase tracking-wide text-text-tertiary">
            {quando.mes}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {/* O horário no maior tamanho do cartão: é o dado que a pessoa veio
              conferir. */}
          {/* 🆕 05/09 (pedido do Pedro) — FAIXA, não instante. A agenda é de
              30 em 30, então "15:00" sozinho não diz até quando o compromisso
              ocupa o dia da pessoa — e é isso que ela precisa saber pra
              encaixar o resto.
              ⚠️ O traço é EN DASH (–), a convenção tipográfica de intervalo.
              Não confundir com a regra dura da casa, que proíbe o TRAVESSÃO
              (—) como pontuação de frase em texto público. */}
          <p className="text-h1 font-bold leading-none tabular-nums text-text-primary">
            {quando.hora} – {maisMeiaHora(quando.hora)}
          </p>
          <p className="text-caption text-text-primary mt-1.5">
            Sua assinatura, feita junto com você
          </p>
          {/* 🗑️ 05/09 — saiu o "cerca de 15 min": com a faixa de 30 minutos
              logo acima, os dois números na mesma caixa liam como contradição.
              A duração real continua dita na tela ANTERIOR, que é onde ela
              ajuda a decidir o horário. */}
          <p className="text-micro text-text-secondary mt-0.5">Por telefone ou WhatsApp</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border-hairline pt-3">
        <SeloConsultor tamanho={28} />
        <p className="min-w-0 flex-1 text-caption font-semibold text-text-primary">
          Consultor oficial Legalizai
        </p>
        {onFalar && (
          <a
            href={onFalar}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com um consultor no WhatsApp"
            /* 40px de alvo: botão circular pequeno é onde o toque erra mais,
               e este é o único atalho de contato da tela. */
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-hairline text-text-primary transition-colors hover:border-border-strong"
          >
            <IconeConversa />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Fim do slot: começo + 30 minutos, que é o passo da agenda.
 *
 * Calculado aqui em vez de virar mais um campo na querystring: é derivação
 * pura de um dado que já existe, e dado derivado que viaja é dado que um dia
 * chega divergente do original.
 */
function maisMeiaHora(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const total = h * 60 + m + 30;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Balão de conversa: o atalho é WhatsApp, não ligação. */
function IconeConversa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L3 21l1.9-6a8.4 8.4 0 1 1 16.1-3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
