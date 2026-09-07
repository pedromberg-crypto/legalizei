"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Rolagem, Rodape } from "@/components/ui/tela";
import { StatusIcon, type StatusEstado } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M12 · ACOMPANHAMENTO — o status do MEI, finalmente alcançável.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09.
 *
 * ─── O QUE TINHA ACONTECIDO ─────────────────────────────────────────────────
 * O pipeline do MEI existia e estava CERTO (`ETAPAS_MEI` em
 * `app/(app)/painel/page.tsx`, reescrito em 28/08 justamente pra parar de
 * prometer que a Legalizai registra o MEI). O problema era o caminho até ele:
 * em 31/08 o status do ME migrou de `/painel` pra `/aguardando?fase=junta`
 * (fusão A3+E9), e a navegação passou a mandar o MEI pra lá também. Quem fazia
 * o caminho MEI via **"fase Junta"** — órgão pelo qual ele não passa — e a
 * tela certa virou inalcançável, viva só por URL direta.
 *
 * ─── POR QUE 4 ETAPAS, E NÃO AS 9 DO ME ─────────────────────────────────────
 * Não é versão simplificada: é outro processo. O ME tem dossiê de 9 passos,
 * viabilidade, guia da Junta, protocolo e assinatura. O MEI tem conferência
 * humana e o clique do titular. Foi por isso que ele ficou de fora da fusão
 * A3+E9 de 31/08, de propósito — e é por isso que ele não podia continuar
 * caindo na tela que nasceu dela.
 *
 * ─── OS ESTADOS ────────────────────────────────────────────────────────────
 * Herdados do `StatusIcon` do DS, que é o vocabulário visual da casa:
 *   ✅ feito · ⟳ girando (a vez é nossa, não sua) · ⬜ a-fazer
 * Não existe `recusa` aqui, e a ausência é fato, não esquecimento: no MEI
 * nenhum órgão pode recusar nada nesta fase — ninguém protocolou nada ainda.
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
 * O pipeline concierge. Recuperado de `ETAPAS_MEI` (28/08), agora no ramo.
 *
 * ✍️ REGRA DE COPY DURA: **nenhuma etapa pode dizer que a Legalizai registra
 * o MEI.** Não há API nem procuração que permita, e a senha gov.br é
 * intransferível. Ver `pesquisa/abertura-mei/abertura-mei-processo.md`.
 */
export const ETAPAS_MEI: EtapaMei[] = [
  { nome: "Recebemos seus dados" },
  {
    nome: "Nosso time está conferindo tudo",
    sub: "A conferência é humana: alguém lê sua ocupação e o que ela cobre, campo por campo. Costuma sair no mesmo dia útil.",
  },
  { nome: "Seus próximos passos ficam prontos" },
  { nome: "Empresa aberta" },
];

export function StatusMeiView({
  etapas = ETAPAS_MEI,
  /** Índice da etapa em andamento. */
  emAndamento,
  onVerProximosPassos,
}: {
  etapas?: EtapaMei[];
  emAndamento: number;
  /** Só habilita quando a conferência termina (etapa 2 em diante). */
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
        <Titulo sub="Enviamos seus dados pro nosso time. Assim que a conferência terminar, a gente te mostra os próximos passos, que são simples.">
          Estamos conferindo tudo
        </Titulo>

        <Rolagem className="flex flex-col gap-3">
          {etapas.map((e, i) => {
            const estado: StatusEstado =
              i < emAndamento ? "feito" : i === emAndamento ? "girando" : "a-fazer";
            const daVez = i === emAndamento;

            return (
              <div key={e.nome} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  <StatusIcon estado={estado} />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-body ${
                      daVez
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {e.nome}
                  </p>
                  {daVez && e.sub && (
                    <p className="text-caption text-text-secondary mt-1">
                      {e.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* ⚠️ Nenhum prazo em dias aqui, e isso é regra anti-guru, não
              descuido: a conferência depende de gente, e prometer "24h" numa
              tela de espera é a promessa mais fácil de quebrar do app. */}
          <Card>
            <p className="text-caption text-text-secondary">
              Enquanto a gente confere, você não precisa fazer nada. Assim que
              estiver pronto, te avisamos no WhatsApp e o botão abaixo libera.
            </p>
          </Card>
        </Rolagem>

        <Rodape>
          <Button full disabled={!liberado} onClick={onVerProximosPassos}>
            {liberado ? "Ver meus próximos passos" : "Aguardando a conferência"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
