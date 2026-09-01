"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";

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
   * 🆕 26/08 (reunião Rua Satélite 36, item 6) — presente quando a etapa é a
   * VEZ DO CLIENTE agir (não do órgão, não é recusa) — hoje só o pagamento da
   * DAE usa isto. Ao chegar nesta etapa (`i === emAndamento`), em vez do anel
   * girando aparece um bloco com CTA. Ícone segue "a-fazer" (não é estado novo
   * — coral nunca é estado, ver `ui/status.tsx`); o que muda é o texto+botão.
   */
  acaoCliente?: { label: string; onClick?: () => void };
  /**
   * 🆕 31/08 (pedido do Pedro) — sub-descrição mostrada SÓ quando a etapa é a
   * atual: o que ela envolve + quanto tempo costuma levar ("leva cerca de 2
   * minutos"). Orienta pro que vem pela frente em vez de deixar a pessoa
   * adivinhar o tamanho do passo. Nas outras etapas fica escondida, senão a
   * timeline vira parede de texto.
   */
  detalhe?: string;
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
    nome: "Pague a guia da Junta (DAE)",
    acaoCliente: { label: "Pagar a guia agora" },
    detalhe: "Taxa obrigatória da Junta. Pagamento leva cerca de 1 minuto.",
  },
  {
    nome: "Agora é só assinar",
    detalhe: "Assinatura pelo GOV.BR, no seu celular. Leva cerca de 3 minutos.",
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

export function PainelView({
  concluidas,
  emAndamento,
  recusa,
  socios = 1,
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
}: {
  /** Quantas etapas já fecharam (verde). */
  concluidas: number;
  /** Índice da etapa girando agora. Ignorado quando há recusa. */
  emAndamento: number;
  /** Presente = pipeline parado numa recusa de órgão (rota /painel/recusa). */
  recusa?: Recusa;
  /** Muda a faixa de notificação: com 2, o andamento vai pros dois. */
  socios?: number;
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
  ctaNormal?: { label: string; onClick?: () => void; desabilitado?: boolean };
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
              <p className="mt-1.5 text-caption text-text-on-dark/70">
                {recusa ? s.recusa : s.normal}
              </p>
              {!recusa && heroExtra}
              {!recusa && (
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

        <div className="flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

          {/* ── A TIMELINE ─────────────────────────────────────────────────
              Cada etapa carrega seu estado. A linha vertical conecta os pontos
              pra ler como uma jornada, não uma lista solta. */}
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
              const girando = ehAVez && !e.acaoCliente;
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

          {/* ── IDEMPOTÊNCIA VISÍVEL (UX-38) ────────────────────────────────
              O motor já é idempotente na retomada; aqui a UI finalmente DIZ.
              Mata o medo de quem pagou, fechou o app e não sabe se "processou". */}
          <div className="mt-2 flex items-start gap-2.5 rounded-md bg-surface-alt p-3">
            <Cadeado />
            <p className="text-micro text-text-secondary">
              {idempotencia ??
                "A abertura roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou."}
            </p>
          </div>

          {/* Com 2 sócios, o outro também precisa saber que anda (T20). */}
          {socios > 1 && (
            <p className="text-micro text-text-tertiary mt-3">
              O andamento vai pros dois sócios, não só pra você.
            </p>
          )}

          {/* K6: numa tela de STATUS não há ação primária, então nada de botão
              sticky (ele prometeria uma ação que não existe e competiria com a
              timeline). O canal humano fica como link leve no fim do conteúdo.
              O rodapé fixo volta só quando há AÇÃO de verdade: a recusa. */}
          {!recusa && (
            <div className="mt-4 flex justify-center">
              <Button variant="ghost">Tirar uma dúvida no WhatsApp</Button>
            </div>
          )}
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
