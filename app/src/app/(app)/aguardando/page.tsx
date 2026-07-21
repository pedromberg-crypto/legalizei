"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { CUSTOS, brl } from "@/lib/fiscal";
import { passosDoCliente } from "@/lib/passos";
import { ListaPassos } from "@/components/lista-passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P2 — AGUARDANDO O BOLETO · arquétipo A7 (Espera) · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → T19 (dunning) · UX-45 · UX-38
 * Persona-guarda: `knife` (paga por boleto e some por 3 dias).
 *
 * ─── ESTA TELA EXISTE PORQUE O BOLETO FICOU (decisão do Pedro) ────────────
 * Cortar boleto simplificaria o sistema e mataria esta pausa inteira, mas
 * perde cliente. Ficou, **fora do happy path**, com a mecânica travada:
 *   > boleto gerado no N9 → entra no app assim mesmo → faz o dossiê inteiro
 *   > (N10–N18) enquanto espera → **N19 e N20 travam** até compensar →
 *   > compensou, destrava.
 *
 * ─── A REGRA QUE MANDA AQUI: "SEM SENSAÇÃO DE TRAVOU" (spec T19) ──────────
 * O erro óbvio seria uma tela de bloqueio: "aguardando pagamento" e um
 * spinner. Isso é limbo, e limbo faz o cliente achar que perdeu o dinheiro.
 *
 * Então a tela inteira é construída ao contrário — ela abre com **o que dá pra
 * fazer agora**, não com o que está parado. O trabalho útil (o dossiê) está
 * liberado; só os dois atos que dependem de dinheiro estão retidos. Espera com
 * tarefa não é espera, é andamento.
 *
 * ─── ⚠️ UX-45 · O GANCHO DA ECONOMIA NÃO MORA NESTA TELA (corrigido 19/07) ─
 * A v1 repetia aqui o número do teaser ("continua valendo: R$1.425/mês").
 * Estava errado por dois motivos, e o Pedro achou perguntando se aquele número
 * já tinha aparecido antes no flow.
 *
 * **1. Cravava o número errado pra 2 dos 3 modos.** O N5 promete coisas com
 * graus de certeza diferentes de propósito (UX-51): `swap` dá número fechado,
 * `fator-r` dá **faixa começando em R$0**, `servico` **não dá número nenhum**
 * (UX-49). Repetir o teto fixo aqui ressuscitava a `promessa-quebrada` que a
 * faixa existia pra desarmar — e, no modo `servico`, inventava do nada uma
 * economia que a gente tinha decidido não prometer.
 *
 * **2. O UX-45 fala da NOTIFICAÇÃO, não da tela.** A coluna de entrada dele é
 * `push/WhatsApp`. A distinção é real:
 *   · **Notificação** — é interrupção, precisa de motivo forte pra justificar
 *     o incômodo. Gancho de economia é certo lá, e como é gerada no backend
 *     com o dado real, respeita os 3 modos naturalmente.
 *   · **Tela** — ele já voltou. O gancho já funcionou. O trabalho aqui é
 *     remover fricção, não convencer de novo alguém que já emitiu boleto.
 *
 * No lugar entrou **progresso**, que é verdade nos 3 modos, não promete nada e
 * puxa mais forte no contexto: quem já investiu 5 passos não quer perdê-los.
 * 🚧 Quando a régua de CRM existir, a notificação PRECISA herdar o modo do
 * teaser. Se ela cravar o teto pra todo mundo, o bug só mudou de lugar.
 *
 * ─── UX-38 · IDEMPOTÊNCIA VISÍVEL ────────────────────────────────────────
 * O motor já é idempotente; aqui a UI finalmente diz isso. "Não cobramos duas
 * vezes" é a frase que desarma quem pagou e fechou o app com medo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Viria do estado do wizard. Mock pra prancheta.
    ⚠️ O TOTAL não mora aqui: vem de `lib/passos`. Ele foi digitado à mão nesta
    tela e na P1, com números diferentes (9 × 6), e o Pedro pegou as duas lado a
    lado na prancheta. Contagem de passos é promessa de esforço — duas telas do
    mesmo app discordando derruba a confiança em todo o resto dos números. */
const BOLETO = { passosFeitos: 5, temCnaeOtimo: true };

export default function AguardandoPage() {
  const total = passosDoCliente(BOLETO.temCnaeOtimo).length;

  return (
    <>
      <TelaHeader meta="Seu pagamento" />

      <main className="app-main">
        {/* O título fala do PRAZO, não do bloqueio ("aguardando pagamento"
            descreveria o estado do sistema, não o do cliente), e o subtítulo
            emenda direto no convite. O card que antes dizia "você já pode
            adiantar os dados" saiu: ele gastava um bloco inteiro pra fazer um
            convite que cabe numa pergunta, logo acima da lista que o responde. */}
        <Titulo sub="Boleto leva de 1 a 3 dias úteis pra cair. Enquanto isso, vamos adiantar algumas informações?">
          Seu boleto está a caminho
        </Titulo>

        <Corpo>
          {/* ═══ ATÉ ONDE ELE PODE IR ═══
              A lista mostra, item a item, o que está liberado e o que espera o
              pagamento. Substituiu duas coisas de uma vez: a barra de progresso
              (que dava o número sem dizer ONDE ele para) e o aviso em texto
              "o que só acontece depois que cair" — o cadeado no item certo diz
              a mesma coisa no lugar em que a dúvida nasce.

              Só o último passo trava, e isso é a informação principal: o
              cliente com boleto pode fazer o dossiê INTEIRO enquanto espera.
              Uma tela que travasse tudo mentiria na direção oposta. */}
          <div>
            {/* Mesmo cabeçalho da P1, palavra por palavra: são telas irmãs e o
                cliente pode ver as duas na mesma semana. */}
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-body font-semibold text-text-primary">
                Onde você está
              </p>
              <span className="text-caption text-text-tertiary">
                {BOLETO.passosFeitos} de {total}
              </span>
            </div>
            <ListaPassos
              concluidos={BOLETO.passosFeitos}
              temCnaeOtimo={BOLETO.temCnaeOtimo}
              pagamentoPendente
              mostrarDestino
            />
          </div>

          {/* Ação concreta: quem quer resolver agora, resolve. O Pix é
              oferecido como atalho porque é verdade que acelera, não como
              pressão — e o boleto continua válido do lado. */}
          <div className="flex flex-col gap-2">
            <Button variant="secondary" full>
              Ver o boleto de {brl(CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE, true)}
            </Button>
            <Button variant="ghost">Prefiro pagar por Pix e adiantar</Button>
          </div>

          {/* UX-38: meia-linha (R1). O N9 é o dono forte da idempotência; aqui
              é eco curto, com o ângulo do boleto (pode ter caído sem ele saber). */}
          <p className="text-micro text-text-tertiary">
            Seu progresso está salvo. Se você já pagou, não cobramos de novo.
          </p>
        </Corpo>

        <Rodape>
          <Button full>Continuar preenchendo</Button>
        </Rodape>
      </main>
    </>
  );
}
