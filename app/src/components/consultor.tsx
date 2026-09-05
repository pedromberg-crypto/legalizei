"use client";

import { CONSULTOR, CONSULTOR_INICIAIS, CONSULTOR_PRIMEIRO_NOME } from "@/app/(app)/dossie/mock";

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
 * ─── A REGRA DE COPY DESTA ROTA ───────────────────────────────────────────
 * 🔴 NUNCA enquadrar como limitação ("nosso sistema não consegue", "a partir
 * daqui é manual"). O motivo real é bom e é checável: assinatura tem valor
 * legal e o código tem prazo, então é feita AO VIVO, com alguém do seu lado.
 * 🔴 E nunca "nossa equipe entra em contato" — essa é a frase de quem não tem
 * ninguém pra apresentar. A pessoa tem nome, registro e horário.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Avatar de iniciais. Sem foto de propósito: rosto falso de pessoa que não
 *  existe é o tipo de mock que vaza pra produção e vira problema de verdade. */
export function AvatarConsultor({ tamanho = 44 }: { tamanho?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: tamanho, height: tamanho }}
      className="flex shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-brand"
    >
      <span className="text-body font-bold">{CONSULTOR_INICIAIS}</span>
    </span>
  );
}

/**
 * O cartão de apresentação. Aparece na tela em que ela assume (A3.H) e na de
 * agendamento, pra pessoa saber com quem vai falar antes de escolher a hora.
 *
 * `motivo` é opcional porque na 2ª aparição a explicação já foi dada: repetir
 * o porquê em toda tela transforma um argumento bom em ladainha.
 */
export function CardConsultor({ motivo = true }: { motivo?: boolean }) {
  return (
    <div className="rounded-md border border-border-hairline bg-surface-card p-4">
      {/* 🔄 04/09 (pedido do Pedro) — a janela de atendimento subiu pra LATERAL
          DIREITA, em 2 linhas. Embaixo e em largura cheia ela lia como mais
          uma frase do cartão; do lado do nome ela vira o que é: a etiqueta de
          quando essa pessoa existe. `items-start` porque o bloco da direita
          tem 2 linhas e o da esquerda tem 3 — centralizar desalinharia os dois
          topos, que é o que o olho usa pra parear as colunas. */}
      <div className="flex items-start gap-3">
        <AvatarConsultor />
        <div className="min-w-0 flex-1">
          <p className="text-body-strong font-semibold text-text-primary">{CONSULTOR.nome}</p>
          <p className="text-micro text-text-secondary">{CONSULTOR.papel}</p>
          {/* O registro é o que separa "atendente" de "contadora". Quem vai
              assinar um documento com valor legal repara nisso. */}
          <p className="text-micro text-text-tertiary mt-0.5">{CONSULTOR.registro}</p>
        </div>
        {/* `shrink-0` + `text-right`: a janela nunca quebra sozinha no meio de
            "Seg a" / "sex" — quem cede espaço numa tela estreita é o bloco do
            nome, que tem `min-w-0` e trunca sem estragar a leitura.

            🐛 04/09 (na esteira do achado do Pedro sobre disponibilidade) — sem
            rótulo, duas linhas de horário coladas no nome dela liam como a
            AGENDA DELA ("a Larissa está livre seg a sex, 9h às 18h"), que é
            falso e é o motivo de a tela seguinte existir pra marcar horário. O
            rótulo diz de quem é a janela: é o atendimento da casa. */}
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
          A partir daqui a {CONSULTOR_PRIMEIRO_NOME} conduz com você. A assinatura é feita
          ao vivo porque o GOV.BR manda um código que vale 10 minutos, e ela precisa
          estar do seu lado na hora.
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
 * QUANDO (em destaque), COM QUEM (rosto e nome, não "a equipe") e QUANTO
 * TEMPO (pra ela saber se cabe no dia).
 *
 * Branco com hairline e a cor só no rótulo, seguindo o padrão travado hoje
 * pros cartões de aviso: bloco tingido inteiro grita, e aqui não há alarme
 * nenhum — é uma boa notícia.
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
        <AvatarConsultor tamanho={28} />
        <p className="min-w-0 flex-1 text-caption text-text-secondary">
          Com a <span className="font-semibold text-text-primary">{CONSULTOR.nome}</span>
        </p>
        {/* Duração à direita, do mesmo jeito que a janela de atendimento no
            cartão de apresentação: é etiqueta, não frase. */}
        <p className="shrink-0 text-micro text-text-tertiary">cerca de 15 min</p>
      </div>
    </div>
  );
}
