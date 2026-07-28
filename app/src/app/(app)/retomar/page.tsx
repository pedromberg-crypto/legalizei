"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { passosDoCliente } from "@/lib/passos";
import { ListaPassos } from "@/components/lista-passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P1 — RETOMAR DE ONDE PAROU · arquétipo A7 (Espera) · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: UX-46 (reorientação ao reabrir) · UX-23 (estimativa perecível) ·
 * UX-38 (idempotência visível). Persona-guarda: `cida`.
 *
 * A pausa mais comum de todas e a que não aparece em nenhum diagrama: o
 * cliente fecha o app no meio e volta dias depois. Antes da reordenação isso
 * acontecia no wizard e não tinha onde morar; agora **a pausa tem casa** — ele
 * já pagou, o shell existe, e voltar é entrar em vez de recomeçar.
 *
 * ─── UX-46 · REORIENTAR ≠ RESTAURAR ──────────────────────────────────────
 * O erro fácil é achar que retomar é técnico: guardar o estado e devolver a
 * tela onde ele estava. Isso funciona pra quem lembra o que estava fazendo.
 * A `cida` não lembra — ela abriu, foi interrompida, e voltou sem contexto.
 *
 * Então a tela responde três perguntas, nesta ordem:
 *   1. **O que eu já fiz?** (não perdi nada)
 *   2. **O que falta?** (quanto ainda tem)
 *   3. **O que eu faço agora?** — e a resposta é **UM passo só**. Devolver
 *      uma lista de 4 pendências recria a paralisia que fez ela sair.
 *
 * ─── ⚠️ UX-23 NÃO MORA MAIS AQUI (removido 19/07) ────────────────────────
 * Esta tela chegou a ter o aviso de "a estimativa envelheceu": salário mínimo,
 * teto do INSS e faixa do IRRF viram na passagem de ano, e a economia que a
 * gente prometeu vira junto. A regra continua certa. O LUGAR estava errado, e
 * o Pedro achou por dois caminhos:
 *
 * **1. Falava de um número que ele nunca viu.** O aviso explicava mudança em
 * "quanto você se paga" — que é o passo 9. Quem retoma no passo 3 ainda não
 * chegou lá. O UX-23 pede "revalidar e avisar se mudou", e avisar só funciona
 * se a pessoa tiver visto a coisa antes; eu apliquei a regra sem checar essa
 * condição.
 *
 * **2. Pró-labore fora de contexto assusta.** O dono de PJ parte do princípio
 * de que todo o faturamento é dele — o conceito de "se pagar um salário" é
 * contraintuitivo. Jogar isso numa tela de reorientação, sem contexto e sem
 * nenhuma ação possível, é criar dúvida e não dar saída.
 *
 * ⚠️ 28/07: o N18 (simulador dedicado, com slider) foi DISSOLVIDO do wizard —
 * gerava mais dúvida que clareza antes de a empresa existir. O número agora
 * é só uma SUGESTÃO dentro do card "Seu enquadramento" no **N19**, com aviso
 * de que pode ser ajustado depois da constituição. Onde o conceito é
 * explicado de verdade e ele pode mexer no valor é **pós-constituição, no
 * app** (aba Impostos > Pró-labore, `/pro-labore`, mesma engine `lib/fiscal`).
 * A revalidação (UX-23) acontece lá, não mais numa tela de retomada do wizard.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Viria do estado salvo. Mock pra prancheta. */
const ESTADO = {
  diasFora: 6,
  /** Quantos passos ele já concluiu. A LISTA vem de `lib/passos`, não daqui:
      inventar os nomes aqui foi exatamente o que fez a P1 e a P2 divergirem. */
  concluidos: 3,
};

export default function RetomarPage() {
  const passos = passosDoCliente();
  const feito = ESTADO.concluidos;
  const total = passos.length;

  return (
    <>
      <TelaHeader meta="Continuando" />

      <main className="app-main">
        <Titulo sub={`Você saiu há ${ESTADO.diasFora} dias e está tudo salvo, do jeitinho que deixou. Vamos continuar?`}>
          Bem-vindo de volta
        </Titulo>

        <Corpo>
          {/* ═══ O QUE JÁ FOI FEITO ═══
              Vem antes do que falta, de propósito: a primeira coisa que quem
              volta precisa sentir é que não perdeu nada. */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-body font-semibold text-text-primary">
                Onde você está
              </p>
              <span className="text-caption text-text-tertiary">
                {feito} de {total}
              </span>
            </div>
            {/* Sem `pagamentoPendente`: quem chega nesta tela pagou por cartão
                ou Pix, então nada trava e o caminho aparece inteiro liberado.
                O caso do boleto é a P2, que usa a mesma lista com o cadeado. */}
            <ListaPassos concluidos={feito} mostrarDestino />
          </div>

          {/* UX-38: meia-linha (R1). O ângulo daqui é "pagamento registrado",
              que é o medo de quem pausou. O dono forte da idempotência é o N9. */}
          <p className="text-micro text-text-tertiary">
            Seu pagamento está registrado. Nada é cobrado nem aberto duas vezes.
          </p>
        </Corpo>

        <Rodape>
          <Button full>Continuar de onde parei</Button>
        </Rodape>
      </main>
    </>
  );
}
