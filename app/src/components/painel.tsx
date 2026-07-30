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
 */
const ETAPAS_ABERTURA: Etapa[] = [
  { nome: "Documentação completa preenchida" },
  { nome: "Analisando viabilidade", orgao: "Junta Comercial" },
  { nome: "Agora é só assinar" },
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
  etapas = ETAPAS_ABERTURA,
  eyebrow = "Sua abertura",
  titulo,
  sub,
  prazo,
  idempotencia,
  ctaNormal,
  onAcaoRecusa,
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
  eyebrow?: string;
  titulo?: { normal: string; recusa: string };
  sub?: { normal: string; recusa: string };
  /** Texto do card "quanto tempo leva". Default = o da abertura (órgãos). */
  prazo?: string;
  /** Faixa de idempotência (UX-38). Default fala de "abertura". */
  idempotencia?: string;
  /** Rodapé fixo quando NÃO há recusa (a abertura não tem; a migração tem). */
  ctaNormal?: { label: string; onClick?: () => void };
  onAcaoRecusa?: () => void;
}) {
  const ETAPAS = etapas;
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
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">{eyebrow}</p>
      </header>

      <main className="app-main">
        <div className="shrink-0">
          <h1 className="text-h1 mb-2">{recusa ? t.recusa : t.normal}</h1>
          <p className="text-body text-text-secondary mb-4">
            {recusa ? s.recusa : s.normal}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ── Quanto tempo leva ──
              K1 (anti-guru): o "cerca de 8 dias úteis" era número INVENTADO, e
              justo na tela mais ansiosa do flow. O prazo de abertura é o que o
              concorrente não divulga (oportunidade nossa), então cravar um e
              furar destruiria confiança onde ela é mais frágil. Fica qualitativo
              e honesto até o pipeline do dev devolver tempo real por órgão — aí
              volta como estimativa COM fonte, não chute. */}
          {!recusa && (
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
              const girando = !recusa && i === emAndamento;
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

                    {/* Girando: diz que a bola está com o órgão, não travou.
                        ✍️ 29/07 — "Não precisa fazer nada" descrevia ausência
                        de ação; "Te avisaremos quando terminar" promete o quê
                        vem a seguir (o WhatsApp), que é o que tranquiliza de
                        verdade quem está esperando. */}
                    {girando && (
                      <p className="text-micro text-state-info-text mt-1">
                        Em andamento agora. Te avisaremos quando terminar.
                      </p>
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
              <Button full onClick={ctaNormal.onClick}>
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
