"use client";

import { CONSULTOR } from "@/app/(app)/dossie/mock";
import { SimboloLegalizai, NomeLegalizai } from "@/components/logo";
import {
  fimDoSlot,
  type Compromisso,
  type RodadaAssinatura,
} from "@/lib/compromisso";
import { rotuloSocios } from "@/lib/socios";

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
 *
 * 🆕 05/09 (pedido do Pedro) — `rodada` 2 é a assinatura QUE GERA O CNPJ, e o
 * motivo dela é outro: além do código de 10 minutos, entra o CONTADOR, que
 * assina o mesmo ato do nosso lado. Repetir só o argumento do código na 2ª
 * faria a pessoa ler "de novo a mesma coisa" numa etapa que na verdade tem uma
 * exigência a mais.
 */
export function CardConsultor({
  motivo = true,
  rodada = 1,
  socios = [],
}: {
  motivo?: boolean;
  rodada?: RodadaAssinatura;
  /**
   * 🆕 05/09 (achado do Pedro) — PRIMEIRO NOME DO SÓCIO, quando a empresa tem
   * um. O contrato social é o acordo ENTRE os sócios: todos assinam, sejam
   * administradores ou não (art. 997/999 CC). A qualificação 49×22 decide quem
   * REPRESENTA a empresa depois de aberta, não quem assina a constituição —
   * são camadas diferentes, e ler uma como a outra é o erro que só aparece no
   * cartório.
   *
   * Isso muda o ato inteiro: não é uma pessoa com um consultor, são duas
   * pessoas e um consultor, no mesmo código de 10 minutos.
   */
  socios?: string[];
}) {
  /* Como citar os outros sócios nesta frase: 1 → o nome, 2+ → a contagem.
     Ver o racional inteiro em `lib/socios`. */
  const outros = rotuloSocios(socios);
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
          <p className="text-body-strong font-semibold text-text-primary">
            {CONSULTOR.papel} <NomeLegalizai />
          </p>
        </div>
        {/* O rótulo diz de quem é a janela: é o atendimento da casa, não a
            agenda de uma pessoa. `shrink-0` + `text-right` pra ela nunca
            quebrar sozinha no meio de "Seg a" / "sex". */}
        <div className="shrink-0 text-right">
          <p className="text-micro text-text-muted">Atendimento</p>
          <p className="text-micro text-text-tertiary">
            {CONSULTOR.atendimentoDias}
          </p>
          <p className="text-micro text-text-tertiary">
            {CONSULTOR.atendimentoHoras}
          </p>
        </div>
      </div>

      {motivo && (
        <p className="text-caption text-text-secondary mt-3">
          {/* ✍️ 05/09 (pente-fino do Pedro) — eram 3 linhas, e a primeira
              ("A partir daqui um consultor conduz com você") repetia o hero
              logo acima. Ficou só o que este cartão é o único a explicar: POR
              QUE precisa de alguém junto. Fato, não desculpa. */}
          {rodada === 2
            ? /* ✍️ 05/09 (pente-fino) — o cartão dizia de novo que o sócio não
                 precisa vir, terceira vez na mesma tela (hero, cartão e etapa).
                 Ele volta a carregar só o POR QUÊ, que é o que nenhum outro
                 bloco diz. A dispensa explícita mora na AGENDA, que é onde ela
                 muda o que a pessoa faz. */
              "O código do GOV.BR vale 10 minutos e vale pro ato inteiro, então o contador assina do nosso lado na mesma hora que você."
            : outros
              ? /* 🆕 05/09 — com sócio, o código de 10 minutos deixa de ser
                   curiosidade e vira a razão de existir hora marcada: todos
                   precisam estar no mesmo momento, e "cada um assina quando
                   puder" simplesmente não funciona. */
                /* 🐛 05/09 (pente-fino) — dois defeitos numa frase só:
                   (1) `toLowerCase()` no sujeito inteiro derrubava o NOME do
                       sócio pra minúscula ("você e carlos");
                   (2) ela repetia o hero logo acima quase palavra por palavra,
                       inclusive o fecho "com um consultor conduzindo".
                   O cartão volta a dizer só o que só ele diz: POR QUE tem que
                   ser no mesmo momento. Quem já está no ato é assunto do hero. */
                "O GOV.BR manda um código que vale 10 minutos, e ele vale pra assinatura de todos. Por isso o horário é o mesmo pra todo mundo."
              : "O GOV.BR manda um código que vale 10 minutos, então a assinatura é feita com alguém do seu lado."}
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
 * 🗑️ 05/09 (pedido do Pedro) — SAIU o botão circular de WhatsApp do rodapé do
 * cartão. Ele tinha vindo pra cá no mesmo dia, do rodapé da tela, e mesmo aqui
 * continuava sendo um alvo de toque genérico ("fale com alguém") competindo
 * com o único dado que o cartão existe pra afirmar: o horário. Quem tem hora
 * marcada não precisa de um canal aberto na mesma caixa que diz a hora.
 * O rodapé do cartão fica só com a identificação de quem conduz.
 */
export function CardCompromisso({
  quando,
  rodada = 1,
  socios = [],
}: {
  quando: Compromisso;
  /** 🆕 05/09 — a 2ª assinatura é outra coisa, e o cartão precisa dizer qual. */
  rodada?: RodadaAssinatura;
  /** Os outros sócios: o cartão precisa dizer quantas pessoas o horário ocupa. */
  socios?: string[];
}) {
  const outros = rotuloSocios(socios);
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
            {quando.hora} – {fimDoSlot(quando.hora)}
          </p>
          <p className="text-caption text-text-primary mt-1.5">
            {/* 🆕 05/09 (pedido do Pedro) — a 2ª assinatura NÃO é "mais uma":
                é a que gera o CNPJ, e tem o contador junto. Um cartão que diz
                a mesma frase nas duas faria a pessoa achar que remarcou a
                primeira por engano. */}
            {rodada === 2
              ? "A assinatura que gera seu CNPJ"
              : outros
                ? `Sua assinatura e a de ${outros}`
                : "Sua assinatura, feita junto com você"}
          </p>
          {/* 🗑️ 05/09 — saiu o "cerca de 15 min": com a faixa de 30 minutos
              logo acima, os dois números na mesma caixa liam como contradição.
              A duração real continua dita na tela ANTERIOR, que é onde ela
              ajuda a decidir o horário. */}
          <p className="text-micro text-text-secondary mt-0.5">
            {rodada === 2
              ? outros
                ? `Só você e o contador, sem ${socios.length === 1 ? "o sócio" : "os sócios"}`
                : "Com você, um consultor e seu contador"
              : outros
                ? /* 🆕 05/09 — o horário é de TODOS os sócios. Sem isto, o
                     cartão marcava uma hora que parecia só dela, e os outros
                     viravam surpresa no dia. */
                  `${socios.length === 1 ? "Os dois" : "Todos"} no mesmo horário, por telefone ou WhatsApp`
                : "Por telefone ou WhatsApp"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border-hairline pt-3">
        <SeloConsultor tamanho={28} />
        <p className="min-w-0 flex-1 text-caption font-semibold text-text-primary">
          {CONSULTOR.papel} <NomeLegalizai />
        </p>
      </div>
    </div>
  );
}
