"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";
import { BLOCOS } from "@/lib/passos";
import { Rolagem } from "@/components/ui/tela";
import { linkWhatsApp } from "@/lib/contato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N21 — PAINEL DE ACOMPANHAMENTO (B4) · o coração da constituição · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/spec-telas-b3-b4-aterrissagem.md → Tela 20 (4.0)
 * Motor: b6 (erro-orgao / recuperação no pipeline)
 *
 * O B4 é LONGO e ASSÍNCRONO (junta, receita, prefeitura, certificado — dias).
 * Sem painel, quem pagou acha que "comprou e nada acontece". Esta é a tela que
 * transforma a espera em ANDAMENTO visível.
 *
 * ─── FONTE ÚNICA DE DUAS ROTAS ──────────────────────────────────────────────
 * `/painel` (andamento) e `/painel/recusa` (o 4º estado, UX-40) renderizam o
 * MESMO componente com props diferentes — mesmo padrão do VereditoView/SaidaView.
 * Dois vocabulários visuais pro mesmo pipeline fariam a recusa parecer outro
 * app, e é justo na recusa que a confiança está mais frágil.
 *
 * ─── OS 4 ESTADOS DE UMA ETAPA (UX-40) ──────────────────────────────────────
 *   ✅ feito     — check verde. Já passou.
 *   ⟳ girando   — anel girando (info). É a vez do órgão, não sua.
 *   ⬜ a fazer   — círculo vazio. Está no caminho, ainda não é a vez.
 *   ‼ recusa    — vermelho + "precisa de você" + a AÇÃO concreta. Recuperação
 *                  DENTRO do pipeline, nunca um limbo "em andamento" que travou.
 *
 * ⚠️ O vermelho aqui É danger, e é a exceção à regra do template de saída (onde
 * bloqueio usa info/azul). Lá o desfecho é "nosso time resolve"; aqui um órgão
 * externo REALMENTE parou a fila e a bola está com o cliente. A copy educa (o
 * nome reprovado não é falha dele), mas o estado precisa gritar "aja", senão
 * vira o limbo que a UX-40 existe pra matar. Coral, esse sim, nunca é estado.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Uma etapa do pipeline. `orgao` é recibo discreto (zero jargão na frente). */
export interface Etapa {
  nome: string;
  orgao?: string;
  /**
   * 🆕 01/09 — a que bloco a etapa pertence (ver `BLOCOS` em `lib/passos.ts`).
   * Quando presente, a timeline agrupa; ausente, cai na lista corrida de
   * sempre (é o caso do Migrar, que passa `etapas` próprias).
   */
  bloco?: number;
  /**
   * 🆕 26/08 (reunião Rua Satélite 36, item 6) — presente quando a etapa é a
   * VEZ DO CLIENTE agir (não do órgão, não é recusa) — hoje só o pagamento da
   * DAE usa isto. Ao chegar nesta etapa (`i === emAndamento`), em vez do anel
   * girando aparece um bloco com CTA. Ícone segue "a-fazer" (não é estado novo
   * — coral nunca é estado, ver `ui/status.tsx`); o que muda é o texto+botão.
   */
  acaoCliente?: { label: string; onClick?: () => void };
  /**
   * 🗑️ 01/09 — `acaoSecundaria` e `aguardando` existiram por algumas horas
   * (guia paga por boleto mostrava "ver boleto"/"Pix" dentro da etapa).
   * Saíram na correção do Pedro: as 2 ações subiram pro hero como chips, e a
   * etapa embaixo ficou só girando. Sem consumidor, o campo sai — capacidade
   * dormindo no DS é dívida, não preparo.
   */
  /**
   * 🆕 31/08 (pedido do Pedro) — sub-descrição mostrada SÓ quando a etapa é a
   * atual: o que ela envolve + quanto tempo costuma levar ("leva cerca de 2
   * minutos"). Orienta pro que vem pela frente em vez de deixar a pessoa
   * adivinhar o tamanho do passo. Nas outras etapas fica escondida, senão a
   * timeline vira parede de texto.
   */
  detalhe?: string;
  /**
   * 🆕 04/09 (pedido do Pedro, no A3″) — ETAPA EM CURSO SEM SER "A VEZ".
   *
   * A timeline tinha um único ponteiro (`emAndamento`), o que bastava
   * enquanto a jornada era uma fila. Com viabilidade e guia correndo em
   * PARALELO (regra travada hoje no A2), existem dois passos acontecendo ao
   * mesmo tempo: a Junta analisando e o banco compensando o boleto. Sem isto,
   * quem pagou por boleto voltava e via a guia CINZA, como se o pagamento não
   * tivesse acontecido.
   *
   * Liga o anel girando e o peso de texto da etapa atual, sem mover o
   * `emAndamento` (que segue mandando no bloco aberto e no CTA do rodapé).
   */
  emCurso?: boolean;
  /**
   * 🆕 04/09 (Pedro — rota assistida) — A VEZ É DE UM CONSULTOR NOSSO.
   *
   * Liga o 5º estado do `StatusIcon` (`com-a-casa`, silhueta de pessoa) e dá à
   * etapa o mesmo peso de texto da atual: ela ACONTECEU de chegar, só que quem
   * conduz é gente da casa, ao vivo com o cliente. Cinza aqui leria "ainda não
   * chegou" e o anel leria "o órgão está processando" — nenhum dos dois é
   * verdade quando existe uma pessoa com nome cuidando do passo.
   */
  comConsultor?: boolean;
}

/**
 * O pipeline, do jeito que a spec T20 lista, traduzido pra linguagem de gente.
 * O código do órgão fica como recibo (micro), nunca como o nome do passo — quem
 * abre a 1ª empresa não sabe o que é DAE nem e-CAC, e não precisa saber.
 *
 * ─── 🔓 REDUZIDO 29/07 (decisão do Pedro, em 2 passadas) ──────────────────
 * Era uma lista de 9 passos, do "conferir o nome" ao "deixar tudo pronto pra
 * sua 1ª nota". Ficaram 3:
 *
 *   1ª passada — cortou tudo que vinha DEPOIS do registro (pagar taxa, tirar
 *   CNPJ, Simples, certificado, liberar nota, deixar pronto). O certificado já
 *   ganhou tela própria (P0, `wizard-cauda.tsx`), e o resto virou passos
 *   demais pra uma timeline que existe pra tranquilizar, não pra instruir.
 *   "Registrar a empresa" virou **"Analisando viabilidade"** — nome mais
 *   honesto pro que a Junta de fato faz aqui (é onde a recusa de nome
 *   acontece, ver `/painel/recusa`). Entrou **"Agora é só assinar"**, cinza
 *   (a-fazer) até a Junta deferir — o StatusIcon já faz isso sozinho por não
 *   estar `< concluidas` nem `=== emAndamento`; quando defere, `emAndamento`
 *   avança pra este índice e ele acende, apontando pro N22.
 *
 *   2ª passada — "Conferir o nome" e "Montar o contrato social" (os 2 passos
 *   ANTES da análise) viraram **1 só: "Documentação completa preenchida"**,
 *   já `feito` (verde) assim que a pessoa chega no painel. Do ponto de vista
 *   de quem preencheu o dossiê inteiro (N10–N16), os dois eram trabalho NOSSO
 *   nos bastidores, não passos que ela reconhece ter feito — a granularidade
 *   servia à spec, não à leitura do cliente. Um check único diz "o que era seu
 *   já está feito", sem fingir que ela participou de "montar contrato".
 *
 *   3ª passada (🆕 26/08, reunião Rua Satélite 36, item 6) — voltou a ter 4.
 *   Até aqui o pagamento da DAE (taxa da Junta) era timing de BACKEND: o
 *   cliente pagava lá atrás, no checkout (E9), junto da mensalidade, e a
 *   Legalizaí segurava o valor até a viabilidade sair — sem tela nova. A
 *   reunião de 25/08 mudou isso: **o cliente só paga a DAE DEPOIS que a
 *   viabilidade é deferida**, através de um CTA visível aqui no painel
 *   ("pagardar", coral, literal da reunião). Por isso "Agora é só assinar"
 *   não libera mais sozinho quando a Junta defere — libera depois que ESSA
 *   etapa nova ("Pague a guia da Junta") for concluída. Ver `acaoCliente` na
 *   interface `Etapa` acima e o bloco de render mais abaixo.
 *
 *   4ª passada (🔒 31/08, reunião Rua Satélite 38-40, pedido do Pedro) — voltou
 *   a 3: **"Documentação completa preenchida" SAIU**. O painel (A3) fundiu
 *   com a tela de status do E9 (`AguardandoView`, `wizard-cauda.tsx`) numa
 *   ÚNICA jornada: os 9 passos do dossiê (`PASSOS_CLIENTE`, `lib/passos.ts`)
 *   agora vêm ANTES destas 3 etapas, na MESMA lista/tela — dizer de novo
 *   "documentação completa" logo depois de mostrar os 9 já concluídos seria
 *   repetir a mesma informação duas vezes. Quem monta a lista combinada é
 *   `AguardandoView`; esta constante virou só a CAUDA (pós-dossiê) do
 *   pipeline, exportada pra ele importar. `/painel` (rota isolada, caminho
 *   ME) foi RETIRADA — só sobrevive pro MEI (`etapas` próprio) e pro Migrar.
 */
export const ETAPAS_ABERTURA: Etapa[] = [
  {
    nome: "Analisando viabilidade",
    orgao: "Junta Comercial",
    detalhe: "A Junta confere nome e endereço. Não precisa fazer nada, a gente te avisa.",
  },
  {
    /* ✍️ 04/09 (auditoria) — a sigla saiu do NOME e virou tradução no detalhe.
       "DAE" era o único jargão do bloco que nunca se explicava, e o nome da
       etapa competia com o da tela de pagamento ("Taxa da Junta"): duas
       nomenclaturas pra mesma coisa. */
    nome: "Pague a guia da Junta",
    acaoCliente: { label: "Pagar a guia agora" },
    /* 🔄 04/09 — a frase "não precisa esperar a análise" SAIU: ela já está no
       hero da mesma tela, dita com as mesmas palavras. Aqui fica o que só a
       etapa entrega — o que é a taxa e quanto custa de tempo. */
    detalhe: "É a taxa que a Junta cobra pra registrar (DAE). Pagar leva cerca de 1 minuto.",
  },
  /* ═══════════ 🆕 04/09 (Pedro, destrinchando o processo real) ═══════════
   * SÃO DUAS ASSINATURAS, NÃO UMA.
   *
   * A etapa era uma só ("Agora é só assinar") e o A4 dizia, logo depois dela,
   * "é ela que fecha o registro na Junta, depois disso o CNPJ sai". Falso: até
   * o CNPJ existir a pessoa assina DUAS vezes, e a segunda não é igual à
   * primeira.
   *
   *   1ª — só ela. Formaliza o contrato social da empresa.
   *   2ª — ela + o CONTADOR, que assina junto e se responsabiliza. É esta que
   *        gera o CNPJ.
   *
   * (Bate com a Izabela em 09/07: o CRC assina "na finalização do CNPJ", no
   * campo em que se declara o regime tributário. O app nunca mostrou isso.)
   *
   * Ficam como 2 etapas, e não como 1 com detalhe comprido, porque são 2
   * momentos separados no tempo — entre elas a pessoa fecha o app e volta. Uma
   * etapa que a pessoa cumpre duas vezes não fecha nunca, e "fechar um assunto
   * por vez" é o motivo de a timeline existir em blocos.
   * ═══════════════════════════════════════════════════════════════════════ */
  {
    nome: "Assinar o contrato social",
    detalhe: "Assinatura pelo GOV.BR, no seu celular. Leva cerca de 3 minutos.",
  },
  {
    nome: "Assinar a abertura do CNPJ",
    /* Por que dizer que o contador assina junto: é a única etapa do flow em
       que alguém de dentro da casa põe o nome no documento. Some daqui e a
       pessoa lê "de novo?"; dito, vira o motivo de existir uma segunda vez. */
    detalhe: "A última. Seu contador assina junto com você, e é ela que gera o CNPJ.",
  },
];

export interface Recusa {
  /** Índice da etapa que o órgão recusou. */
  etapa: number;
  /** O que aconteceu, em linguagem de gente. Sem culpar o cliente. */
  titulo: string;
  motivo: string;
  /** O rótulo do botão de recuperação. */
  acao: string;
}


/* ═══════════ A TIMELINE EM BLOCOS ══════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — a lista corrida de 13 passos era assustadora
 * ("olha o tanto que falta") e não dava a sensação de terminar nada. Agrupada
 * em 5 blocos, a pessoa fecha um assunto por vez.
 *
 * Regras de exibição, e o porquê de cada uma:
 * · Bloco CONCLUÍDO colapsa numa linha só (check + "3 de 3"). O detalhe do
 *   que já passou não ajuda mais ninguém — atrapalha.
 * · Bloco ATUAL abre e mostra as subetapas, que é onde a pessoa está.
 * · Blocos FUTUROS ficam fechados e apagados: existem pra dar noção do
 *   caminho, não pra serem lidos agora.
 * · Qualquer bloco pode ser aberto no toque — fechar não é esconder.
 *
 * O CTA é por BLOCO, não por subetapa (decisão do Pedro: "é simples e mantemos
 * menos poluído"). Num bloco concluído ele vira "Ajustar", e é o caminho de
 * voltar a corrigir. 🔴 Some depois do protocolo (`podeAjustar={false}`): a
 * partir dali não há volta, e a pessoa aceitou isso explicitamente na tela de
 * aviso que roda depois do A1.
 * ═════════════════════════════════════════════════════════════════════════ */

function TimelineEmBlocos({
  etapas,
  concluidas,
  emAndamento,
  recusa,
  podeAjustar,
  onIrParaBloco,
  titulosBloco,
}: {
  etapas: Etapa[];
  concluidas: number;
  emAndamento: number;
  recusa?: Recusa;
  podeAjustar: boolean;
  onIrParaBloco?: (rota: string, blocoId: number) => void;
  /**
   * 🆕 04/09 (pedido do Pedro) — renomear um bloco SEM mexer em `BLOCOS`.
   *
   * Nasceu da fase Junta: lá os 4 blocos do dossiê viram um só (ver
   * `AguardandoView`), e o cartão fundido não pode se chamar "Conta e plano",
   * que é o nome de um quarto do que ele passou a conter. `BLOCOS` continua
   * sendo a fonte da divisão em quem coleta; isto é só a etiqueta de quem
   * mostra.
   */
  titulosBloco?: Record<number, string>;
}) {
  // Índice global de cada etapa preservado: os estados (feito/girando/recusa)
  // continuam vindo de `concluidas`/`emAndamento`, que contam a lista inteira.
  const grupos = BLOCOS.map((b) => ({
    ...b,
    titulo: titulosBloco?.[b.id] ?? b.titulo,
    itens: etapas
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => (e.bloco ?? 0) === b.id),
  })).filter((g) => g.itens.length > 0);

  const blocoAtual =
    grupos.find((g) => g.itens.some(({ i }) => i === emAndamento))?.id ??
    grupos.find((g) => g.itens.some(({ i }) => i >= concluidas))?.id ??
    grupos[grupos.length - 1]?.id;

  /**
   * 🔄 04/09 (pedido do Pedro: "quando chegar aqui, trave pra ele vir aberto")
   * — DE ACORDEÃO ÚNICO PRA ABERTURA INDEPENDENTE.
   *
   * Antes era um estado só (`aberto: number | null`): abrir um bloco FECHAVA o
   * atual. Na fase Junta isso quebrava a tela — abrir "Informações
   * confirmadas" pra dar uma conferida fechava "Registro nos órgãos", que é
   * onde está a etapa da vez e a única ação da tela; pra reabrir, a pessoa
   * tinha que perceber que ela mesma fechou.
   *
   * Agora cada bloco guarda o próprio estado, e o mapa só registra o que a
   * PESSOA tocou: sem toque, vale o default (o bloco atual e o de recusa
   * nascem abertos, os concluídos fechados). O bloco da vez continua aberto
   * enquanto ninguém o fechar de propósito.
   */
  const [tocados, setTocados] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col gap-2.5">
      {grupos.map((g) => {
        const total = g.itens.length;
        const feitos = g.itens.filter(({ i }) => i < concluidas).length;
        const temRecusa = recusa != null && g.itens.some(({ i }) => i === recusa.etapa);
        const concluido = feitos === total && !temRecusa;
        const ehAtual = g.id === blocoAtual && !concluido;
        const expandido = tocados[g.id] ?? (ehAtual || temRecusa);

        const estado: StatusEstado = temRecusa
          ? "recusa"
          : concluido
            ? "feito"
            : ehAtual
              ? "girando"
              : "a-fazer";

        return (
          <div
            key={g.id}
            // 🔄 01/09 — a borda verde no bloco concluído foi testada e
            // RECUSADA pelo Pedro: com 5 blocos empilhados, 5 bordas verdes
            // viram poluição (no E9 são 3 cards e funciona). O check no ícone
            // e o "concluído" no contador já dizem o mesmo, sem pintar a tela.
            className={`rounded-md border transition-colors ${
              temRecusa
                ? /* 🔄 04/09 (pedido do Pedro) — SEM BORDA VERMELHA no bloco.
                     Ela pintava o cartão inteiro de alerta, e dentro dele os
                     ícones já são vermelhos: o contorno só somava barulho num
                     lugar onde a mensagem é "a gente resolve", não "deu ruim".
                     Mesma lição da borda VERDE no bloco concluído, recusada em
                     01/09 pelo mesmo motivo (5 bordas viram poluição). O sinal
                     fica onde ele é preciso: no ícone e no texto da etapa. */
                  "border-border-hairline bg-surface-card"
                : ehAtual
                  ? "border-border-strong bg-surface-card"
                  : "border-border-hairline bg-surface-card"
            }`}
          >
            {/* 🐛 01/09 (achado do Pedro) — o "Ajustar" vivia DENTRO do bloco
                expandido, e bloco concluído nasce fechado: ninguém achava. Ele
                sobe pro cabeçalho, visível sem precisar abrir nada. A linha
                deixou de ser um botão só (botão dentro de botão é HTML
                inválido): o toggle é a área do título, o Ajustar é irmão. */}
            <div className="flex items-center gap-2 p-3.5">
            <button
              type="button"
              onClick={() => setTocados((m) => ({ ...m, [g.id]: !expandido }))}
              aria-expanded={expandido}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="shrink-0">
                <StatusIcon estado={estado} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-body ${
                    concluido
                      ? "text-text-tertiary"
                      : ehAtual || temRecusa
                        ? "font-semibold text-text-primary"
                        : "text-text-muted"
                  }`}
                >
                  {g.titulo}
                </span>
                {/* O contador é o que transforma "faltam 13 coisas" em "3 de 3
                    aqui dentro": mostra tamanho do bloco, não da jornada. */}
                <span className="mt-0.5 block text-micro text-text-tertiary">
                  {concluido ? `${total} de ${total} · concluído` : `${feitos} de ${total}`}
                </span>
              </span>
            </button>
            {/* 🔄 01/09 (pedido do Pedro) — de link sublinhado pra PILL coral:
                alvo de toque de verdade (min-h-8 + padding lateral) e peso
                visual suficiente pra ser encontrado sem procurar. Tint de
                marca, não fill cheio — o CTA do rodapé continua sendo a ação
                principal da tela, e dois corais sólidos brigariam. */}
            {/* 🔒 02/09 — `telas: []` = bloco não editável (o 1, pós-pago, e
                o 5, pós-protocolo). Antes só o `podeAjustar` global segurava,
                e o bloco 1 escapava: aparecia concluído com o botão,
                prometendo uma edição que o fluxo não faz. */}
            {concluido && podeAjustar && g.telas.length > 0 && onIrParaBloco && (
              <button
                type="button"
                onClick={() => onIrParaBloco(g.rota, g.id)}
                className="flex min-h-8 shrink-0 items-center rounded-full bg-surface-tint-brand px-3.5
                           text-caption font-semibold text-action-primary-sm transition-colors
                           hover:bg-action-primary hover:text-text-on-brand"
              >
                Ajustar
              </button>
            )}
            <button
              type="button"
              onClick={() => setTocados((m) => ({ ...m, [g.id]: !expandido }))}
              aria-label={expandido ? "Fechar bloco" : "Abrir bloco"}
              /* 🔄 04/09 (auditoria) — o alvo era o próprio chevron (18px),
                 metade do mínimo da WCAG 2.5.8. O ícone não muda; cresce a
                 área, com margem negativa pra não mexer no alinhamento. */
              className="-m-2.5 flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <ChevronBloco aberto={expandido} />
            </button>
            </div>

            {expandido && (
              <div className="px-3.5 pb-3.5">
                <ol className="relative flex flex-col">
                  {g.itens.map(({ e, i }, idx) => {
                    const feito = i < concluidas;
                    const recusada = recusa?.etapa === i;
                    /* `emCurso` entra aqui junto com o ponteiro: pro desenho,
                       "é a vez" e "está rodando em paralelo" são o mesmo anel
                       girando e o mesmo peso de texto. */
                    /* 🐛 04/09 (pedido do Pedro, na A3.1) — o `!recusa` valia
                       pra lista inteira e apagava TODOS os anéis quando havia
                       exigência: a guia ficava cinza no meio de uma tela de
                       alerta, como se nem existisse. O que a recusa suspende é
                       o PONTEIRO (`emAndamento`), não o que está em curso por
                       conta própria — a etapa marcada com `emCurso` segue
                       girando, e a recusa continua mandando na sua etapa (o
                       `recusada` é checado antes). */
                    /* 🆕 04/09 — a etapa com consultor conta como "a vez" pro
                       peso de texto e pro detalhe, mas NÃO gira: quem está
                       nela é uma pessoa, não um órgão. */
                    const ehAVez =
                      (!recusa && i === emAndamento) || !!e.emCurso || !!e.comConsultor;
                    const ultima = idx === g.itens.length - 1;
                    const st: StatusEstado = recusada
                      ? "recusa"
                      : feito
                        ? "feito"
                        : e.comConsultor
                          ? "com-a-casa"
                          : ehAVez
                            ? "girando"
                            : "a-fazer";
                    return (
                      <li key={e.nome} className="relative flex gap-3 pb-4 last:pb-0">
                        {!ultima && (
                          <span
                            className={`absolute left-[8px] top-[22px] bottom-0 w-px ${
                              feito ? "bg-state-success" : "bg-border-hairline"
                            }`}
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10 mt-0.5 shrink-0">
                          <StatusIcon estado={st} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-caption ${
                              recusada
                                ? "font-semibold text-state-danger-text"
                                : ehAVez
                                  ? "font-semibold text-text-primary"
                                  : feito
                                    ? "text-text-tertiary"
                                    : "text-text-muted"
                            }`}
                          >
                            {e.nome}
                          </p>
                          {e.orgao && (
                            <p className="text-micro text-text-tertiary mt-0.5">{e.orgao}</p>
                          )}
                          {ehAVez && e.detalhe && (
                            <p className="text-micro text-text-secondary mt-1">{e.detalhe}</p>
                          )}
                          {ehAVez && !e.detalhe && (
                            <p className="text-micro text-state-info-text mt-1">
                              {/* 🐛 04/09 — "Em andamento agora" é a frase do
                                  ÓRGÃO processando. Numa etapa conduzida por
                                  consultor ela mentiria: não tem nada rodando,
                                  tem alguém pra falar com você. */}
                              {e.comConsultor
                                ? "Sua consultora conduz este passo com você."
                                : "Em andamento agora. Te avisaremos quando terminar."}
                            </p>
                          )}
                          {ehAVez && e.acaoCliente && (
                            /* 🔄 04/09 (pedido do Pedro) — CARTÃO BRANCO com
                               borda hairline, o padrão da casa. Era coral
                               tingido (`surface-tint-brand`): o botão dentro
                               dele já é coral cheio, então o fundo repetia a
                               cor de ação e o cartão inteiro virava um bloco
                               de destaque dentro de outro. Mesma correção que
                               o `CardNota` do C3 recebeu hoje. */
                            <div className="mt-2 rounded-md border border-border-hairline bg-surface-card p-3">
                              {/* 🐛 04/09 — "A Junta aprovou" era FIXO, e desde
                                  hoje este cartão também aparece na tela de
                                  EXIGÊNCIA (onde a Junta justamente não
                                  aprovou) e no A3, onde a análise ainda está
                                  rodando. A frase passa a dizer só o que vale
                                  nos três estados: a guia é o que destrava a
                                  assinatura, e ela não espera a análise. */}
                              <p className="text-micro font-semibold text-text-primary mb-2">
                                A guia não espera a análise. Pagar agora libera a
                                assinatura mais cedo.
                              </p>
                              <Button onClick={e.acaoCliente.onClick}>
                                {e.acaoCliente.label}
                              </Button>
                            </div>
                          )}
                          {recusada && recusa && (
                            /* 🔄 04/09 (pedido do Pedro) — CARTÃO BRANCO com
                               borda hairline, igual ao de cima e ao resto da
                               casa. O fundo vermelho tingido pintava o bloco
                               inteiro de alarme; o vermelho fica onde ele
                               significa alguma coisa (o ícone da etapa e o
                               TÍTULO), e o corpo do texto volta a ser texto.
                               Mesma decisão da borda vermelha do bloco, tirada
                               nesta mesma rodada. */
                            <div className="mt-2 rounded-md border border-border-hairline bg-surface-card p-3">
                              <p className="text-caption font-semibold text-state-danger-text mb-0.5">
                                {recusa.titulo}
                              </p>
                              <p className="text-micro text-text-secondary">{recusa.motivo}</p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChevronBloco({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 text-text-tertiary transition-transform ${aberto ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * 🆕 04/09 — anel do CTA em espera. Mesma gramática do `Girando` do
 * `ui/status.tsx` (borda fina, topo colorido, `animate-spin`), mas herdando a
 * cor do botão em vez do token de info: dentro de um CTA desabilitado, azul
 * seria uma segunda cor sem significado.
 */
function AnelCta() {
  return (
    <span
      aria-hidden
      className="block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/30 border-t-current"
    />
  );
}

export function PainelView({
  concluidas,
  emAndamento,
  podeAjustar = true,
  onIrParaBloco,
  titulosBloco,
  recusa,
  etapas,
  onPagarDae,
  eyebrow = "Sua abertura",
  titulo,
  sub,
  prazo,
  idempotencia,
  ctaNormal,
  onAcaoRecusa,
  escuro = false,
  heroExtra,
  antesDaTimeline,
  semAvisoWhats = false,
  ajudaWhats,
  acaoExtra,
}: {
  /** Quantas etapas já fecharam (verde). */
  concluidas: number;
  /** Índice da etapa girando agora. Ignorado quando há recusa. */
  emAndamento: number;
  /** Presente = pipeline parado numa recusa de órgão (rota /painel/recusa). */
  recusa?: Recusa;
  /**
   * 🆕 01/09 — libera o "Ajustar este bloco" nos blocos já concluídos. Vira
   * `false` a partir do protocolo: dali em diante não há volta, e oferecer o
   * botão seria prometer o que a Junta não deixa mais fazer.
   */
  podeAjustar?: boolean;
  /** Navegação do CTA de bloco (continuar de onde parou / voltar e corrigir). */
  onIrParaBloco?: (rota: string, blocoId: number) => void;
  /** 🆕 04/09 — renomeia blocos na exibição (ver `TimelineEmBlocos`). */
  titulosBloco?: Record<number, string>;
  /* 🗑️ 04/09 — `socios` saiu junto com a faixa de notificação: era o único
     consumidor da prop. Capacidade sem uso é dívida, não preparo. */
  /**
   * 🔁 30/07 — parametrizado para o FLOW #2 (migração) reusar a máquina de 4
   * estados sem duplicar timeline. O default é o pipeline de ABERTURA, então
   * `/painel` e `/painel/recusa` não mudaram nada.
   *
   * A migração tem outro pipeline (distrato → TTRT → Evento 232 → procuração) e
   * uma diferença de natureza: lá a espera é por um CONCORRENTE (o contador
   * antigo valida o TTRT), não por um órgão neutro. Mesma UI, tensão diferente.
   */
  etapas?: Etapa[];
  /**
   * 🆕 26/08 (item 6) — chamado quando o cliente clica "Pagar a guia agora"
   * na etapa da DAE. Só é usado quando `etapas` NÃO é passado (default =
   * pipeline de abertura) — a migração não tem DAE, então nunca precisa disto.
   */
  onPagarDae?: () => void;
  eyebrow?: string;
  titulo?: { normal: string; recusa: string };
  sub?: { normal: string; recusa: string };
  /** Texto do card "quanto tempo leva". Default = o da abertura (órgãos). */
  prazo?: string;
  /** Faixa de idempotência (UX-38). Default fala de "abertura". */
  idempotencia?: string;
  /** Rodapé fixo quando NÃO há recusa (a abertura não tem; a migração tem). */
  /** 🆕 31/08 — `desabilitado` trava o CTA sem escondê-lo (o cliente precisa
   *  VER que existe um próximo passo, só não pode agir ainda). Usado enquanto
   *  o boleto não compensa. */
  ctaNormal?: {
    label: string;
    onClick?: () => void;
    desabilitado?: boolean;
    /** 🆕 04/09 — anel girando dentro do botão: travado POR ESPERA, não por erro. */
    carregando?: boolean;
  };
  onAcaoRecusa?: () => void;
  /**
   * 🆕 31/08 (pedido do Pedro, fusão A3+E9) — hero escuro (gradiente coral no
   * canto, fundo `surface-dark`), o mesmo do antigo `AguardandoView`. Opt-in:
   * MEI e Migrar continuam com o header claro de sempre, só quem pede vê o
   * escuro. Troca SÓ a casca do eyebrow+título+subtítulo — timeline, prazo e
   * rodapé não mudam nada.
   */
  escuro?: boolean;
  /**
   * 🆕 31/08 — conteúdo extra DENTRO do hero escuro (só renderiza com
   * `escuro`). Existe pros chips de boleto/Pix que o antigo `AguardandoView`
   * tinha: eles pertencem ao hero, não à timeline, e só fazem sentido na fase
   * de pagamento pendente.
   */
  heroExtra?: ReactNode;
  /**
   * 🆕 04/09 (rota assistida) — bloco que entra ACIMA da timeline, dentro da
   * rolagem. Nasceu pro cartão da consultora no A3.H: ele precisa vir antes
   * das etapas (é quem explica por que elas mudaram de dono), mas depois do
   * hero — dentro do hero escuro ele viraria um cartão claro sobre fundo
   * escuro, que é outro componente, não este.
   */
  antesDaTimeline?: ReactNode;
  /** 🆕 05/09 — esconde a linha "a gente te avisa no WhatsApp" do hero. Ver o
   *  comentário no próprio bloco: ela é promessa de espera de órgão. */
  semAvisoWhats?: boolean;
  /**
   * 🆕 04/09 — troca o rótulo e a mensagem do link de WhatsApp do rodapé.
   *
   * Nasceu pro status com horário marcado (A3.H2): ali a dúvida provável não é
   * genérica, é REMARCAR. Continua sendo um link só — remarcar acontece pelo
   * WhatsApp com a consultora, que é o mesmo canal de qualquer outra dúvida, e
   * dois links pro mesmo destino seriam duas portas pra mesma sala.
   */
  ajudaWhats?: { label: string; mensagem: string };
  /**
   * 🆕 04/09 — ação de APP ao lado do link de WhatsApp, na linha acima do CTA.
   * Existe pro "Remarcar" do A3.H2: ele volta pra tela de agendamento, e não
   * tem nada a ver com o canal humano que divide a linha com ele.
   */
  acaoExtra?: { label: string; onClick?: () => void };
}) {
  // 🆕 26/08 (item 6) — se `etapas` não veio (caso da abertura), usa o default
  // COM o callback do CTA de DAE já ligado (a migração, que passa `etapas`
  // próprio, nunca cai aqui — não tem DAE).
  const ETAPAS =
    etapas ??
    ETAPAS_ABERTURA.map((e) =>
      e.acaoCliente ? { ...e, acaoCliente: { ...e.acaoCliente, onClick: onPagarDae } } : e,
    );
  const t = titulo ?? {
    normal: "Estamos abrindo sua empresa",
    recusa: "Precisamos de você num ponto",
  };
  const s = sub ?? {
    normal:
      "A parte chata é com a gente. Você acompanha por aqui e a gente avisa no WhatsApp a cada passo.",
    recusa:
      "A abertura seguiu bem até aqui. Um órgão pediu um ajuste, e é rápido de resolver.",
  };

  return (
    <>
      {!escuro && (
        <header className="pt-6 pb-4">
          <p className="text-micro text-text-tertiary">{eyebrow}</p>
        </header>
      )}

      <main className="app-main">
        <div className="shrink-0">
          {escuro ? (
            // 🆕 31/08 — hero escuro (mesmo gradiente do antigo AguardandoView):
            // eyebrow some sozinho (o título já carrega o contexto), título
            // maior e branco, subtítulo em baixa opacidade.
            // 🔒 31/08 (correções do Pedro, ao vivo): título maior (`text-h1`,
            // "precisa de mais destaque"), respiro maior embaixo (`mb-5`) pra
            // não colar na timeline, e a linha do WhatsApp absorvida do card
            // claro que sumiu (ver comentário logo abaixo).
            <div
              className="mt-4 mb-5 rounded-2xl p-5 text-text-on-dark"
              style={{
                background:
                  "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
              }}
            >
              <p className="text-h1 font-bold leading-tight">{recusa ? t.recusa : t.normal}</p>
              {/* 🆕 04/09 — o subtítulo pode vir VAZIO. Acontece no A3.H2: o
                  compromisso ganhou cartão próprio logo abaixo do hero, e
                  repetir "Hoje às 15:00" aqui seria a mesma informação duas
                  vezes em dois blocos colados. Sem a guarda, string vazia
                  deixaria um parágrafo invisível empurrando o resto. */}
              {(recusa ? s.recusa : s.normal) && (
                <p className="mt-1.5 text-caption text-text-on-dark/70">
                  {recusa ? s.recusa : s.normal}
                </p>
              )}
              {!recusa && heroExtra}
              {/* 🗑️ 05/09 (pedido do Pedro, na A3.H) — a linha "Assim que um
                  passo anda, a gente atualiza aqui e te avisa no WhatsApp" SAI
                  na rota assistida. Ela é a promessa de quem espera um ÓRGÃO:
                  vale enquanto a vez é da Junta ou do banco. Na rota assistida
                  o contato humano já é a promessa da tela inteira (o cartão
                  diz quem conduz, o CTA marca a hora, e o compromisso tem
                  horário), então ela vira mais uma frase dizendo que a gente
                  avisa — numa tela que já explicou como. */}
              {!recusa && !semAvisoWhats && (
                <p className="mt-3 text-micro text-text-on-dark/50">
                  Assim que um passo anda, a gente atualiza aqui e te avisa no WhatsApp.
                </p>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-h1 mb-2">{recusa ? t.recusa : t.normal}</h1>
              <p className="text-body text-text-secondary mb-4">
                {recusa ? s.recusa : s.normal}
              </p>
            </>
          )}
        </div>

        {/* 🐛 01/09 (achado do Pedro) — este contêiner rola mas nascia SEM o
            degradê de continuidade das outras telas (o `Corpo` do DS traz de
            fábrica; aqui a timeline tem rolagem própria). Mesma correção do
            E6: usa o hook, então desbota no topo quando há conteúdo acima e no
            pé quando há conteúdo abaixo. */}
        <Rolagem className="pb-4">
          <div>
          {/* ── Quanto tempo leva ──
              K1 (anti-guru): o "cerca de 8 dias úteis" era número INVENTADO, e
              justo na tela mais ansiosa do flow. O prazo de abertura é o que o
              concorrente não divulga (oportunidade nossa), então cravar um e
              furar destruiria confiança onde ela é mais frágil. Fica qualitativo
              e honesto até o pipeline do dev devolver tempo real por órgão — aí
              volta como estimativa COM fonte, não chute.

              🐛→🔒 31/08 (correção do Pedro, viu ao vivo: "esses 2 cards
              parecem brigar entre si") — com o hero ESCURO, este card branco
              repetia o mesmo prazo que o subtítulo do hero já dava. Sumiu:
              no modo escuro o hero absorve a informação (subtítulo + a linha
              do WhatsApp), e só o modo claro (MEI/Migrar) mantém o card. */}
          {!recusa && !escuro && (
            <Card className="mb-4">
              <p className="text-caption text-text-secondary">Quanto tempo leva</p>
              <p className="text-body text-text-primary mt-0.5">
                {prazo ??
                  "Depende de cada órgão, e o tempo deles a gente não controla."}
              </p>
              <p className="text-micro text-text-tertiary mt-1">
                Assim que um passo anda, a gente atualiza aqui e te avisa no
                WhatsApp.
              </p>
            </Card>
          )}

          {antesDaTimeline && <div className="mb-4">{antesDaTimeline}</div>}

          {/* ── A TIMELINE ─────────────────────────────────────────────────
              Cada etapa carrega seu estado. A linha vertical conecta os pontos
              pra ler como uma jornada, não uma lista solta. */}
          {ETAPAS.some((e) => e.bloco) ? (
            <TimelineEmBlocos
              etapas={ETAPAS}
              concluidas={concluidas}
              emAndamento={emAndamento}
              recusa={recusa}
              podeAjustar={podeAjustar}
              onIrParaBloco={onIrParaBloco}
              titulosBloco={titulosBloco}
            />
          ) : (
          <ol className="relative flex flex-col">
            {ETAPAS.map((e, i) => {
              const feito = i < concluidas;
              const recusada = recusa?.etapa === i;
              const ehAVez = !recusa && i === emAndamento;
              // 🆕 26/08 (item 6): quando a etapa-da-vez é do CLIENTE agir
              // (acaoCliente presente), mostra CTA em vez do anel girando —
              // girando é "vez do órgão", isso aqui é "vez do cliente, sem
              // problema nenhum" (diferente de recusa, que é vez do cliente
              // POR TER DADO ERRADO).
              const aguardaAcaoCliente = ehAVez && !!e.acaoCliente;
              // 🔄 01/09 (pedido do Pedro) — a etapa-da-vez GIRA mesmo quando
              // a ação é do cliente. Antes o CTA suprimia o anel e a etapa
              // ficava com cara de "a-fazer" (cinza), igual às que nem
              // começaram — sendo que ela é justamente onde a jornada parou.
              // O anel diz "é aqui"; o card embaixo diz o que fazer.
              const girando = ehAVez;
              const ultima = i === ETAPAS.length - 1;
              // PainelView usa {feito, girando, a-fazer, recusa} do StatusIcon.
              const estado: StatusEstado = recusada
                ? "recusa"
                : feito
                  ? "feito"
                  : girando
                    ? "girando"
                    : "a-fazer";
              return (
                <li key={e.nome} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* fio que liga um ponto ao próximo (não desenha no último) */}
                  {!ultima && (
                    <span
                      className={`absolute left-[8px] top-[22px] bottom-0 w-px ${
                        feito ? "bg-state-success" : "bg-border-hairline"
                      }`}
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 mt-0.5 shrink-0">
                    <StatusIcon estado={estado} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-body ${
                        recusada
                          ? "font-semibold text-state-danger-text"
                          : girando
                            ? "font-semibold text-text-primary"
                            : feito
                              ? "text-text-tertiary"
                              : "text-text-muted"
                      }`}
                    >
                      {e.nome}
                    </p>
                    {e.orgao && (
                      <p className="text-micro text-text-tertiary mt-0.5">
                        {e.orgao}
                      </p>
                    )}

                    {/* 🆕 31/08 (pedido do Pedro) — sub-descrição do passo
                        ATUAL: o que ele envolve + tempo estimado. Só na etapa
                        da vez (nas outras vira parede de texto). Quando existe,
                        substitui o genérico "Em andamento agora" — é mais
                        específico e diz a mesma coisa melhor. */}
                    {ehAVez && e.detalhe && (
                      <p className="text-micro text-text-secondary mt-1">{e.detalhe}</p>
                    )}

                    {/* Girando: diz que a bola está com o órgão, não travou.
                        ✍️ 29/07 — "Não precisa fazer nada" descrevia ausência
                        de ação; "Te avisaremos quando terminar" promete o quê
                        vem a seguir (o WhatsApp), que é o que tranquiliza de
                        verdade quem está esperando. */}
                    {girando && !e.detalhe && (
                      <p className="text-micro text-state-info-text mt-1">
                        Em andamento agora. Te avisaremos quando terminar.
                      </p>
                    )}

                    {/* 🆕 26/08 (item 6): vez do cliente, sem ser problema —
                        CTA coral inline ("pagardar", literal da reunião Rua
                        Satélite 36). Tinta de marca (surface-tint-brand), não
                        de estado — reforça que isto não é um alerta. */}
                    {aguardaAcaoCliente && e.acaoCliente && (
                      <div className="mt-2 rounded-md bg-surface-tint-brand p-3">
                        <p className="text-micro font-semibold text-text-primary mb-2">
                          A Junta aprovou. Falta só pagar a guia pra liberar a
                          assinatura.
                        </p>
                        <Button onClick={e.acaoCliente.onClick}>
                          {e.acaoCliente.label}
                        </Button>
                      </div>
                    )}

                    {/* ── O 4º ESTADO (UX-40): recuperação inline, aqui mesmo. ── */}
                    {recusada && recusa && (
                      <div className="mt-2 rounded-md bg-state-danger-tint p-3">
                        <p className="text-caption font-semibold text-state-danger-text mb-0.5">
                          {recusa.titulo}
                        </p>
                        <p className="text-micro text-text-secondary">
                          {recusa.motivo}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          )}

          {/* ── IDEMPOTÊNCIA VISÍVEL (UX-38) ────────────────────────────────
              O motor já é idempotente na retomada; aqui a UI finalmente DIZ.
              Mata o medo de quem pagou, fechou o app e não sabe se "processou". */}
          <div className="mt-2 flex items-start gap-2.5 rounded-md bg-surface-alt p-3">
            <Cadeado />
            {/* O texto vem de quem chama (o `AguardandoView` varia por estado,
                inclusive na exigência); o default abaixo serve MEI e Migrar. */}
            <p className="text-micro text-text-secondary">
              {idempotencia ??
                "A abertura roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou."}
            </p>
          </div>

          {/* 🗑️ 04/09 (decisão do Pedro) — SAIU "O andamento vai pros dois
              sócios, não só pra você". Ela vinha da spec T20 e prometia uma
              coisa que a gente NÃO vai fazer: mandar o acompanhamento do
              processo pro sócio. O sócio é chamado uma vez, na assinatura (A4),
              e o dono do processo é quem abriu. Promessa de notificação que não
              existe é a pior classe de copy — ninguém reclama do que não
              recebeu, só deixa de confiar no resto. */}
          </div>
        </Rolagem>

        {/* 🔄 01/09 (pedido do Pedro) — o link do WhatsApp saiu do fim do
            conteúdo ROLÁVEL e virou item FIXO do rodapé, acima do CTA. Motivo:
            numa tela de status a pessoa fica esperando, e o canal humano é
            justamente o que ela procura quando cansa de esperar — enterrado no
            fim da timeline, ele só existia pra quem rolasse até o fim.
            K6 preservado: continua link leve, não botão cheio, então não
            inventa ação primária nem compete com a timeline.
            🔄 04/09 (auditoria do bloco A3) — ANTES SAÍA NA RECUSA, e era o
            contrário do certo: a recusa é a ÚNICA tela do bloco em que algo
            deu errado, e era a única sem canal humano. O argumento de 30/07
            ("lá já existe uma ação de verdade") confundia ação do PROCESSO
            (sugerir mais 3 nomes) com saída pra DÚVIDA — quem não sabe o que
            escrever depois de 3 nomes reprovados não é atendido pelo mesmo
            botão. Fica nos dois estados. */}
        <div className="app-footer-cta flex items-center justify-center gap-3 pb-0">
            {/* 🆕 04/09 (achado do Pedro) — DOIS DESTINOS, DOIS LINKS.
                No A3.H2 a linha era um link só ("Remarcar ou falar com outro
                consultor") apontando pro WhatsApp — mas remarcar é ação DENTRO
                do app (a agenda é nossa, a tela existe) e falar é canal
                externo. Um link com dois verbos manda a pessoa pro WhatsApp
                pedir à mão o que ela faria em dois toques. */}
            {acaoExtra && (
              <>
                <button
                  type="button"
                  onClick={acaoExtra.onClick}
                  className="flex min-h-11 items-center justify-center text-center text-caption font-medium text-text-secondary underline underline-offset-4"
                >
                  {acaoExtra.label}
                </button>
                <span aria-hidden className="text-caption text-text-muted">
                  ·
                </span>
              </>
            )}
            <a
              href={linkWhatsApp(
                ajudaWhats?.mensagem ??
                  "Oi! Estou acompanhando a abertura da minha empresa no app da Legalizai e queria tirar uma dúvida.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              /* 🔄 04/09 (auditoria) — 20px de alvo, abaixo do mínimo. O
                 sublinhado e a posição continuam iguais. */
              className={`flex min-h-11 items-center justify-center text-center text-caption font-medium text-text-secondary underline underline-offset-4 ${
                acaoExtra ? "" : "w-full"
              }`}
            >
            {ajudaWhats?.label ?? "Tirar uma dúvida no WhatsApp"}
          </a>
        </div>

        {recusa ? (
          <Rodape>
            <Button full onClick={onAcaoRecusa}>
              {recusa.acao}
            </Button>
          </Rodape>
        ) : (
          /* 30/07 — a ABERTURA não tem CTA aqui de propósito (K6: tela de status
             não inventa ação primária). A MIGRAÇÃO tem: quando a transferência
             fecha, existe um próximo passo real (entrar no app já migrado), e
             aí o botão não é decorativo. Só aparece se quem chama passar. */
          ctaNormal && (
            <Rodape>
              <Button full disabled={ctaNormal.desabilitado} onClick={ctaNormal.onClick}>
                {/* 🆕 04/09 (pedido do Pedro) — CTA travado por ESPERA mostra
                    que algo está rodando. Sem o anel, "Aguardando compensar"
                    num botão apagado lê como botão quebrado; com ele, lê como
                    relógio andando. Só aparece quando quem pede diz que é
                    espera (`carregando`), não em todo botão desabilitado. */}
                {ctaNormal.carregando && <AnelCta />}
                {ctaNormal.label}
              </Button>
            </Rodape>
          )
        )}
      </main>
    </>
  );
}

/* O cadeado da faixa de idempotência NÃO é status de passo: é ícone decorativo
   de "seu progresso está guardado". Fica local de propósito, fora do StatusIcon
   (que é vocabulário de ESTADO de etapa, não de reforço em texto). */
function Cadeado() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-text-tertiary"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/* Rodapé local: o mesmo do esqueleto, sem arrastar o import só por uma div. */
function Rodape({ children }: { children: ReactNode }) {
  return <div className="app-footer-cta">{children}</div>;
}
