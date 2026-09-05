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
      <div className="flex items-center gap-3">
        <AvatarConsultor />
        <div className="min-w-0">
          <p className="text-body-strong font-semibold text-text-primary">{CONSULTOR.nome}</p>
          <p className="text-micro text-text-secondary">{CONSULTOR.papel}</p>
          {/* O registro é o que separa "atendente" de "contadora". Quem vai
              assinar um documento com valor legal repara nisso. */}
          <p className="text-micro text-text-tertiary mt-0.5">{CONSULTOR.registro}</p>
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

      <p className="text-micro text-text-tertiary mt-3">{CONSULTOR.atendimento}</p>
    </div>
  );
}
