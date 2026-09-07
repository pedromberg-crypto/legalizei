"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Rolagem, Rodape } from "@/components/ui/tela";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M12 · ACOMPANHAMENTO — no layout aprovado do status do ME.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do status do caminho ME (`PainelView` em `painel.tsx`, no modo `escuro` que
 * o `AguardandoView` usa desde a fusão A3+E9 de 31/08): **hero escuro** com o
 * gradiente coral saindo do canto superior esquerdo, e a **timeline com fio
 * ligando os pontos** — não uma lista solta.
 *
 * As regras que vieram junto, todas testadas e algumas já revertidas uma vez:
 *   · no modo escuro o hero ABSORVE o prazo e a linha do WhatsApp; o card
 *     branco de "quanto tempo leva" some, porque com o hero escuro os dois
 *     cards "brigavam entre si" (correção do Pedro em 31/08);
 *   · o `detalhe` só aparece na etapa DA VEZ — nas outras vira parede de
 *     texto;
 *   · quando a vez é do CLIENTE agir, a etapa continua GIRANDO e ganha o CTA
 *     dentro dela: o anel diz "é aqui", o card diz o que fazer (correção de
 *     01/09 — antes o CTA suprimia o anel e a etapa ficava cinza, com cara de
 *     "nem começou", justamente onde a jornada parou).
 *
 * ⚠️ Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de
 * importar tela de ME.
 *
 * ─── O QUE TINHA ACONTECIDO COM ESTA TELA ───────────────────────────────────
 * O pipeline do MEI estava CERTO desde 28/08, mas em 31/08 o status do ME
 * migrou pro `/aguardando?fase=junta` e levou a navegação do MEI junto: quem
 * fazia o caminho MEI via **"fase Junta"**, órgão pelo qual ele não passa, e a
 * tela certa virou inalcançável, viva só por URL direta.
 *
 * ─── POR QUE 4 ETAPAS, E NÃO AS 9 DO ME ─────────────────────────────────────
 * Não é versão simplificada: é outro processo. O ME tem dossiê de 9 passos,
 * viabilidade, guia da Junta, protocolo e assinatura. O MEI tem conferência
 * humana e o clique do titular. Foi por isso que ele ficou fora da fusão A3+E9
 * de propósito — e por isso não podia continuar caindo na tela que nasceu
 * dela. Sem blocos colapsáveis pelo mesmo motivo: 4 etapas não pedem
 * agrupamento, e agrupar 4 em 1 seria cerimônia sem função.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EtapaMei {
  nome: string;
  /** Aparece só quando a etapa é a da vez. */
  sub?: string;
  /** A ação, quando a vez é do CLIENTE (não do nosso time). */
  acao?: { label: string; onClick?: () => void };
}

/**
 * O pipeline concierge, recuperado do `ETAPAS_MEI` de 28/08.
 *
 * ✍️ REGRA DE COPY DURA: **nenhuma etapa pode dizer que a Legalizai registra
 * o MEI.** Não há API nem procuração que permita, e a senha gov.br é
 * intransferível. A palavra "contador" também não aparece: o plano MEI tem
 * atendente, e contador CRC é o que sustenta o preço do ME.
 * Ver `pesquisa/abertura-mei/abertura-mei-processo.md`.
 */
export const ETAPAS_MEI: EtapaMei[] = [
  { nome: "Recebemos seus dados" },
  {
    nome: "Nosso time está conferindo tudo",
    sub: "A conferência é humana: alguém lê sua ocupação e o que ela cobre, campo por campo.",
  },
  {
    nome: "Seus próximos passos ficam prontos",
    sub: "Aí é com você: são 3 passos no Portal, com os seus dados prontos pra colar.",
  },
  { nome: "Empresa aberta" },
];

export function StatusMeiView({
  etapas = ETAPAS_MEI,
  /** Índice da etapa em andamento. */
  emAndamento,
  /** Só habilita quando a conferência termina (etapa 2 em diante). */
  onVerProximosPassos,
}: {
  etapas?: EtapaMei[];
  emAndamento: number;
  onVerProximosPassos?: () => void;
}) {
  const liberado = emAndamento >= 2;

  return (
    <>
      {/* 🔒 Terminal por natureza: é a tela de espera, não um passo do wizard.
          Voltar daqui significaria desfazer a autorização, que não é o que a
          seta faz em lugar nenhum do app. */}
      <TelaHeader meta="Seu MEI" semVoltar />

      <main className="app-main">
        <div className="shrink-0">
          {/* ═══ O HERO ESCURO ═══════════════════════════════════════════════
              Mesmo gradiente e mesma anatomia do status do ME. No modo escuro
              ele absorve o prazo e a promessa de aviso — por isso não existe
              card branco de "quanto tempo leva" logo abaixo. */}
          <div
            className="mt-4 mb-5 rounded-2xl p-5 text-text-on-dark"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }}
          >
            <p className="text-h1 font-bold leading-tight">
              {liberado ? "Está pronto pra você finalizar" : "Estamos conferindo tudo"}
            </p>
            <p className="mt-1.5 text-caption text-text-on-dark/70">
              {liberado
                ? "Conferimos seus dados e a ocupação. O registro em si é você quem faz, com a sua conta gov.br."
                : "Enviamos seus dados pro nosso time. A conferência depende de gente, e costuma sair no mesmo dia útil."}
            </p>
            {/* ⚠️ Nenhum prazo em horas aqui, e isso é regra anti-guru: a
                conferência depende de pessoa, e prometer "24h" numa tela de
                espera é a promessa mais fácil de quebrar do app. */}
            <p className="mt-3 text-micro text-text-on-dark/50">
              Assim que um passo anda, a gente atualiza aqui e te avisa no
              WhatsApp.
            </p>
          </div>
        </div>

        <Rolagem className="pb-4">
          {/* ═══ A TIMELINE ══════════════════════════════════════════════════
              O fio vertical liga os pontos pra ler como jornada, não como
              lista solta. Sem blocos colapsáveis: 4 etapas não pedem isso. */}
          <ol className="relative flex flex-col">
            {etapas.map((e, i) => {
              const feito = i < emAndamento;
              const ehAVez = i === emAndamento;
              const ultima = i === etapas.length - 1;
              /* ⚠️ Não existe o estado `recusa` neste pipeline, e a ausência é
                 fato, não esquecimento: no MEI nenhum órgão pode recusar nada
                 nesta fase — ninguém protocolou nada ainda. */
              const estado: StatusEstado = feito
                ? "feito"
                : ehAVez
                  ? "girando"
                  : "a-fazer";

              return (
                <li key={e.nome} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* Fio que liga um ponto ao próximo (não desenha no último). */}
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
                        ehAVez
                          ? "font-semibold text-text-primary"
                          : feito
                            ? "text-text-tertiary"
                            : "text-text-muted"
                      }`}
                    >
                      {e.nome}
                    </p>

                    {/* Sub-descrição só na etapa da vez: nas outras vira parede
                        de texto. */}
                    {ehAVez && e.sub && (
                      <p className="text-micro text-text-secondary mt-1">
                        {e.sub}
                      </p>
                    )}

                    {/* Girando: diz que a bola está com a gente, não que travou. */}
                    {ehAVez && !e.sub && (
                      <p className="text-micro text-text-tertiary mt-1">
                        Em andamento agora. Te avisamos quando terminar.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-2 text-micro text-text-tertiary">
            Enquanto a gente confere, você não precisa fazer nada. Seus dados
            ficam guardados: pode fechar o app que nada se perde.
          </p>
        </Rolagem>

        <Rodape>
          {/* O CTA fica VISÍVEL e travado enquanto espera, não escondido: a
              pessoa precisa VER que existe um próximo passo, só não pode agir
              ainda (regra de 31/08 do ME). */}
          <Button full disabled={!liberado} onClick={onVerProximosPassos}>
            {liberado ? "Ver meus próximos passos" : "Aguardando a conferência"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
