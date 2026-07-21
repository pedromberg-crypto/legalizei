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

/** Uma etapa do pipeline de abertura. `orgao` é recibo discreto (zero jargão na frente). */
interface Etapa {
  nome: string;
  orgao?: string;
}

/**
 * O pipeline, do jeito que a spec T20 lista, traduzido pra linguagem de gente.
 * O código do órgão fica como recibo (micro), nunca como o nome do passo — quem
 * abre a 1ª empresa não sabe o que é DAE nem e-CAC, e não precisa saber.
 */
const ETAPAS: Etapa[] = [
  { nome: "Conferir o nome", orgao: "Junta Comercial" },
  { nome: "Montar o contrato social" },
  { nome: "Registrar a empresa", orgao: "Junta Comercial" },
  // "com o que você já pagou": a cobrança foi no N9. Aqui a gente REPASSA a taxa
  // pra Junta, não cobra de novo. O rótulo tem que deixar isso explícito, senão
  // o painel reabre o "paguei duas vezes?" que o N20 acabou de fechar.
  { nome: "Pagar a taxa na Junta", orgao: "com o que você já pagou" },
  { nome: "Tirar o CNPJ", orgao: "Receita Federal" },
  { nome: "Entrar no Simples", orgao: "Receita Federal" },
  { nome: "Emitir o certificado digital" },
  { nome: "Liberar a emissão de nota", orgao: "Prefeitura de BH" },
  { nome: "Deixar tudo pronto pra sua 1ª nota" },
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
}: {
  /** Quantas etapas já fecharam (verde). */
  concluidas: number;
  /** Índice da etapa girando agora. Ignorado quando há recusa. */
  emAndamento: number;
  /** Presente = pipeline parado numa recusa de órgão (rota /painel/recusa). */
  recusa?: Recusa;
  /** Muda a faixa de notificação: com 2, o andamento vai pros dois. */
  socios?: number;
}) {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Sua abertura</p>
      </header>

      <main className="app-main">
        <div className="shrink-0">
          <h1 className="text-h1 mb-2">
            {recusa ? "Precisamos de você num ponto" : "Estamos abrindo sua empresa"}
          </h1>
          <p className="text-body text-text-secondary mb-4">
            {recusa
              ? "A abertura seguiu bem até aqui. Um órgão pediu um ajuste, e é rápido de resolver."
              : "A parte chata é com a gente. Você acompanha por aqui e a gente avisa no WhatsApp a cada passo."}
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
                Depende de cada órgão, e o tempo deles a gente não controla.
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

                    {/* Girando: diz que a bola está com o órgão, não travou. */}
                    {girando && (
                      <p className="text-micro text-state-info-text mt-1">
                        Em andamento agora. Não precisa fazer nada.
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
              A abertura roda uma vez só. Pode fechar o app que o processo segue
              sozinho, de onde parou.
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

        {recusa && (
          <Rodape>
            <Button full>{recusa.acao}</Button>
          </Rodape>
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
