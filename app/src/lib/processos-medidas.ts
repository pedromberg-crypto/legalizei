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
export const LINHA_SAIDA = 26;
export const FAIXA_PADDING = 10;

/** A faixa só existe quando o passo bifurca: uma saída não precisa de escolha. */
export function alturaDo(nSaidas: number) {
  return nSaidas > 1 ? PASSO_H + FAIXA_PADDING + nSaidas * LINHA_SAIDA : PASSO_H;
}

/** Onde fica o centro da bolinha da saída `i`, medido do topo do cartão. */
export function topoDaSaida(i: number, nSaidas: number) {
  return alturaDo(nSaidas) - FAIXA_PADDING - (nSaidas - i) * LINHA_SAIDA + LINHA_SAIDA / 2;
}
