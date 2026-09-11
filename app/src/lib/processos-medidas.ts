/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEDIDAS DO BOARD /processos — FONTE ÚNICA. Não repetir número em outro lugar.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🐛 O BUG QUE ISTO EXISTE PRA IMPEDIR (achado pelo Pedro em 11/09):
 * "os cards da ponta também estão um em cima do outro".
 *
 * A causa foi eu ter escrito o tamanho do cartão DUAS VEZES, em lugares
 * diferentes, com números diferentes:
 *   · no componente, a altura nascia do conteúdo (dava ~280px);
 *   · no layout, eu informava ao dagre `height: 190`.
 * O dagre então empilhava os cartões achando que cada um ocupava 190, e os
 * 90px de diferença viravam sobreposição. Quanto mais texto no passo, pior —
 * e é por isso que os três últimos (que são os de dúvida, os mais escritos)
 * eram justamente os que encavalavam.
 *
 * 🔴 A TRAVA: o cartão tem ALTURA FIXA, e é a mesma constante que o dagre
 * recebe. Não é "altura mínima", não é "mais ou menos": é `PASSO_H`, e o
 * conteúdo que não couber é cortado por `line-clamp` no componente. Layout
 * automático só funciona quando o tamanho declarado é o tamanho real — deixar
 * o conteúdo mandar na altura é justamente o que quebra.
 *
 * ⚠️ Consequência aceita: passo com texto muito longo aparece truncado no
 * cartão. É de propósito. O texto inteiro está sempre a um clique, no painel
 * lateral, e um passo que não cabe em quatro linhas provavelmente deveria ser
 * dois passos (`_doutrina-processos.md` §2).
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Largura do cartão. Cabe ~46 caracteres por linha no corpo. */
export const PASSO_W = 300;

/** Altura FIXA do cartão. Mudou aqui, muda no board inteiro — e só aqui. */
export const PASSO_H = 286;

/**
 * Respiro entre cartões. Os dois eixos têm números diferentes de propósito:
 * o cartão é largo (300) e baixo (286), então "a distância entre fileiras"
 * pesa diferente conforme o board esteja de pé ou deitado.
 *
 *  · `entre` — cartões da MESMA fileira (irmãos de um mesmo nível)
 *  · `fileiras` — de um nível pro próximo. É aqui que o rótulo da aresta
 *    ("acima de R$ 50", "já fechou") precisa caber sem encostar em cartão.
 */
export const RESPIRO = {
  TB: { entre: 90, fileiras: 150 },
  LR: { entre: 80, fileiras: 220 },
} as const;

/** Folga entre rótulos de arestas paralelas, pra não empilharem um no outro. */
export const RESPIRO_ARESTA = 34;

/**
 * ── A FAIXA DE SAÍDAS (11/09, pedido do Pedro) ─────────────────────────────
 * *"no card que tem uma pergunta e uma condicional, podemos criar na parte de
 * baixo do card um campo com 2 CTAs com as variáveis, e na lateral direita do
 * card, em frente a cada um dos CTAs, uma bolinha de onde sai a linha guia até
 * o próximo card, pra eu identificar mais fácil o que cada variável segue."*
 *
 * 🔑 O problema real que isso resolve: hoje todas as linhas saem do MESMO
 * ponto do cartão, e o rótulo da condição viaja no meio do fio, longe da
 * origem. Num board com bifurcação, saber qual condição leva a qual cartão
 * exige seguir a linha com o olho. Com uma saída por condição, a resposta
 * está no cartão.
 *
 * 🔴 Cartão com faixa é MAIS ALTO, e essa altura também mora aqui — o mesmo
 * número vai pro componente e pro dagre. Foi exatamente isso que quebrou em
 * 11/09 (altura em dois lugares, cartões sobrepostos): a regra não é "altura
 * fixa", é "UM número, em um lugar".
 */
/**
 * A faixa é uma pilha de FATIAS de altura igual. O CTA não preenche a fatia
 * inteira: sobra `FOLGA_CTA` em cima e embaixo, e é essa sobra que vira o
 * respiro entre um CTA e o outro. Assim a bolinha continua no centro exato da
 * fatia — se o respiro fosse `gap` do flex, a conta do centro mudaria e a
 * bolinha sairia do lugar.
 */
export const LINHA_SAIDA = 36;
export const ALTURA_CTA = 28;
export const FOLGA_CTA = (LINHA_SAIDA - ALTURA_CTA) / 2;

/** Respiro entre a borda de cima da faixa e o primeiro CTA. */
export const FAIXA_TOPO = 12;
/** Respiro embaixo do último CTA. */
export const FAIXA_PADDING = 12;

/**
 * Cabeçalho de grupo, quando as saídas são separadas por TRILHA ("na fatura" /
 * "já pago"). Sem ele o cartão teria duas linhas "cancelou o plano" e nada
 * dizendo o que as diferencia — foi a provocação do Pedro em 11/09.
 */
export const CABECA_TRILHA = 22;

/** Respiro entre um bloco de saídas e o seguinte. */
export const GRUPO_GAP = 10;

export type GrupoFaixa = { comCabeca: boolean; n: number };

/**
 * 🔴 UMA FUNÇÃO SÓ CALCULA A FAIXA INTEIRA — altura do cartão e o centro de
 * cada bolinha, na mesma passada.
 *
 * Antes eram duas contas separadas (`alturaDo` e `topoDaSaida`) que precisavam
 * concordar. Enquanto a faixa era uma pilha simples isso deu certo; quando
 * entraram cabeçalho de trilha e respiro entre blocos, virou três variáveis
 * pra manter em sincronia em dois lugares — e é exatamente assim que nasce o
 * defeito das duas alturas (11/09, cartões sobrepostos).
 *
 * Agora o layout é percorrido UMA vez, de cima pra baixo, na mesma ordem em
 * que o componente desenha. O que sai daqui é a verdade para o dagre e para o
 * CSS, sem chance de divergirem.
 */
export function layoutFaixa(grupos: GrupoFaixa[]) {
  const total = grupos.reduce((a, g) => a + g.n, 0);
  if (total < 2) return { altura: PASSO_H, tops: grupos.map((g) => new Array(g.n).fill(0)) };

  let y = PASSO_H + FAIXA_TOPO;
  const tops: number[][] = [];
  grupos.forEach((g, gi) => {
    if (gi > 0) y += GRUPO_GAP;
    if (g.comCabeca) y += CABECA_TRILHA;
    const meus: number[] = [];
    for (let k = 0; k < g.n; k += 1) {
      meus.push(y + LINHA_SAIDA / 2);
      y += LINHA_SAIDA;
    }
    tops.push(meus);
  });
  return { altura: y + FAIXA_PADDING, tops };
}

