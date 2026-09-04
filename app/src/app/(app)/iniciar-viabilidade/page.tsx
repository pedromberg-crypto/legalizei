"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SplashMensagemView } from "@/components/splash-mensagem";
import { ehMei, comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A3.0 — PONTO SEM VOLTA (aviso antes da viabilidade)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — a única tela do flow cujo trabalho é FAZER A
 * PESSOA PARAR.
 *
 * ─── POR QUE ELA EXISTE ────────────────────────────────────────────────────
 * Até o A1, corrigir qualquer dado é de graça: a tela de status deixa voltar
 * a qualquer bloco. Depois que a viabilidade entra na JUCEMG, acabou — mudar
 * nome ou endereço protocolado significa CANCELAR a viabilidade e refazer o
 * pedido. Isso não é teoria: foi o que aconteceu ao vivo na gravação de
 * 31/08, quando o endereço em apartamento indeferiu e o processo teve que ser
 * cancelado e recomeçado do zero.
 *
 * O aceite já está no contrato, mas contrato ninguém lê. Uma tela inteira,
 * coral cheio, com um CTA que a pessoa precisa tocar, é o que transforma uma
 * cláusula num momento — e é justamente o que a gente quer que ela lembre se
 * um dia pedir pra mudar algo.
 *
 * ─── POR QUE NÃO É SPLASH ──────────────────────────────────────────────────
 * Usa a pele de splash (é ela que dá o peso), mas NÃO auto-avança: passar
 * daqui tem que ser um ato, não um relógio. Por isso o `cta` — a única
 * variante do `SplashMensagemView` que espera o dedo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function IniciarViabilidadePage() {
  const router = useRouter();
  const mei = ehMei(useSearchParams());

  return (
    <SplashMensagemView
      /**
       * 🔄 04/09 (pedido do Pedro) — DE AVISO PRA ENTREGA.
       *
       * Era "Daqui não dá pra voltar" + "mudar nome ou endereço exige CANCELAR
       * e refazer o pedido". Verdade, mas dito na voz do cartório: a última
       * coisa que a pessoa lê antes de o processo dela começar era uma ameaça,
       * numa tela que tem confete na tela. O fato não saiu (a Junta passa a
       * ser dona do dado e mudança pede pedido novo), mudou quem fala: agora é
       * a casa assumindo o processo, contando o que vai fazer e prometendo o
       * retorno. A irreversibilidade vira a última frase, no lugar do título.
       *
       * ⚠️ O que NÃO pode voltar: prometer que a gente resolve mudança depois
       * "numa boa". A gravação de 31/08 mostrou o custo real (viabilidade
       * indeferida por endereço, processo cancelado e refeito do zero).
       */
      /**
       * 🔄 04/09 (2ª rodada, decisão do Pedro) — A TELA PASSOU A DIZER O QUE
       * ACONTECE DEPOIS DO TOQUE, E O QUE NÃO DEPENDE DELE.
       *
       * Regra nova travada hoje: viabilidade e guia da Junta correm em
       * PARALELO. O toque aqui dispara a análise de nome e endereço; a guia
       * pode ser paga antes ou depois, e o resultado da Junta pode chegar
       * primeiro (o Integrador com contrato padrão defere por robô, em
       * minutos). A tela precisava dizer isso, senão a pessoa espera o
       * resultado pra pagar (ou o contrário) achando que existe uma fila.
       *
       * Vocabulário travado: "a Junta pediu um ajuste", com a palavra
       * EXIGÊNCIA aparecendo uma vez, entre parênteses. É o termo que ela vai
       * reencontrar no e-mail do órgão, e não reconhecer lá é pior do que ler
       * uma palavra difícil aqui. Fonte dos fatos: `pesquisa/exigencias-jucemg.md`
       * (indeferir na hora é raro; o padrão é exigência com 30 dias pra
       * corrigir, e a taxa só se perde se ninguém corrigir).
       */
      /**
       * 🔄 04/09 (3ª rodada, pedido do Pedro) — O PARÁGRAFO VIROU LISTA.
       *
       * As 4 frases eram todas necessárias e, juntas num bloco só, viravam
       * texto que ninguém lê na tela mais tensa do flow. Em lista, a pessoa vê
       * o CAMINHO inteiro de uma vez (é isso que tranquiliza) e lê o detalhe
       * só do passo que lhe interessa. O subtítulo ficou com o único fato que
       * não é passo: a partir daqui os dados são da Junta.
       */
      titulo="Sua abertura está em boas mãos."
      sub="Daqui pra frente nome e endereço já seguem com a Junta, e mudar um deles pede um pedido novo. O caminho é este:"
      passos={[
        {
          titulo: "Análise de viabilidade",
          detalhe: "A Junta confere nome e endereço. Pode sair em minutos.",
        },
        {
          /* Neutro por decisão do Pedro (04/09): a tela não recomenda pagar
             antes nem esperar o resultado. Só diz que não existe fila. */
          titulo: "Guia da Junta",
          detalhe: "Pague quando quiser. Ela não espera a análise, e a análise não espera ela.",
        },
        {
          titulo: "Assinatura",
          detalhe: "Você assina pelo GOV.BR e a empresa é constituída.",
        },
      ]}
      /* Fonte dos fatos: `pesquisa/exigencias-jucemg.md`. Indeferir na hora é
         raro; o padrão é a Junta pedir ajuste, com 30 dias pra corrigir. Por
         isso a nota tranquiliza sem mentir: ajuste é rotina, e é nossa. */
      nota="Se a Junta pedir um ajuste (exigência, no vocabulário dela), não se preocupe: é comum, a gente já sabe resolver e cuida disso com você."
      cta={{
        /* 🔄 04/09 (levantamento de CTAs, validado pelo Pedro) — era "Iniciar
           viabilidade". "Viabilidade" é jargão de Junta, e a lista logo acima
           já nomeou o passo ("Análise de viabilidade") com a explicação junto:
           o botão não precisa repetir o termo técnico, precisa dar a partida. */
        label: "Pode começar",
        onClick: () => router.push(comRegime("/aguardando?fase=junta", mei)),
      }}
    />
  );
}
