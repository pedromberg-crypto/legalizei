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
 * legal e o código tem prazo, então é feita AO VIVO, com alguém do seu lado.
 * 🔴 E nunca o vazio "nossa equipe entra em contato". Sem nome pra dar, sobra
 * o que dá pra afirmar sem mentir, que ainda é bastante: é gente da CASA (não
 * robô, não terceirizado), é ao vivo, tem hora marcada, e existe uma janela de
 * atendimento conhecida.
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
          conduz ao vivo, e a mesma promessa em dois tamanhos de fonte no mesmo
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
          {/* Fato, não desculpa: o GOV.BR manda um código que expira em 10
              minutos, e a assinatura vale como documento. Por isso é ao vivo. */}
          A partir daqui um consultor conduz com você. A assinatura é feita ao vivo
          porque o GOV.BR manda um código que vale 10 minutos, e alguém precisa estar
          do seu lado na hora.
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
 * Vale um cartão inteiro porque, neste estado, o horário é a única coisa que a
 * pessoa precisa reter — o resto da tela é progresso que ela não move. Ele
 * responde as três perguntas de um compromisso, na ordem em que se pergunta:
 * QUANDO (em destaque), COM QUEM e QUANTO TEMPO (pra saber se cabe no dia).
 *
 * Branco com hairline e a cor só no rótulo, seguindo o padrão travado pros
 * cartões de aviso: bloco tingido inteiro grita, e aqui não há alarme nenhum —
 * é uma boa notícia.
 */
export function CardCompromisso({ quando }: { quando: string }) {
  return (
    <div className="rounded-md border border-border-hairline bg-surface-card p-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-action-primary-sm">
        Sua assinatura
      </p>
      {/* O dado que a pessoa veio conferir, no maior tamanho do cartão. */}
      <p className="mt-1 text-h2 font-bold leading-tight text-text-primary">{quando}</p>

      <div className="mt-3 flex items-center gap-2 border-t border-border-hairline pt-3">
        <SeloConsultor tamanho={28} />
        <p className="min-w-0 flex-1 text-caption text-text-secondary">
          {/* 🔄 05/09 — era "Com a Larissa Andrade". Sem consultor designado, o
              que se afirma é a CASA: quem atende é gente nossa, e isso continua
              sendo diferente de um robô ou de um call center terceirizado. */}
          Com um <span className="font-semibold text-text-primary">consultor Legalizai</span>
        </p>
        {/* Duração à direita, do mesmo jeito que a janela de atendimento no
            cartão de apresentação: é etiqueta, não frase. */}
        <p className="shrink-0 text-micro text-text-tertiary">cerca de 15 min</p>
      </div>
    </div>
  );
}
