---
name: legalize-encaixe-asset-medido-nao-no-olho
description: "01/09 — pra encaixar personagem PNG numa borda da UI, medir o pixel do corte no arquivo e derivar o offset por fórmula; ajustar no olho gasta rodadas e não converge."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-02T01:08:50.391Z
---

Quando um asset PNG precisa "encostar" numa superfície da interface (Léo espiando por cima do muro na E3.3, Léo escorado na folha da E6), **medir o arquivo** e derivar o posicionamento por fórmula. Nunca ir empurrando 10px por vez.

Método que fechou o encaixe em 1 rodada depois de ~6 tentativas no olho:

1. Achar a linha reta do corte: pra cada coluna, o último pixel opaco (`alpha > 128`); a linha é o valor de `y` compartilhado por mais colunas. Na E6 deu `y=626` de 864 = **72,45%**, atravessando x=15→742.
2. O que desce além dela é o que fica POR CIMA da superfície (na E6, a pata: x=393→665, 27,55% da altura).
3. Offset = `folha_overlap − (1 − corte%) × altura_na_tela`. Na E6: `20 − 0,2755 × 240 = −46px`.
4. Deixar a fórmula escrita no componente, não o número: quem mudar a altura recalcula.

**Por quê:** o corte do asset é dado objetivo que está no arquivo. Estimar gera ping-pong ("desce um pouco", "sobe um pouco") que não converge, e o Pedro teve que me lembrar disso — "vc consegue ler a imagem, basta pegar o pixel em que a blusa termina e alinhar com a borda branca".

**Como aplicar:** antes de posicionar qualquer PNG de personagem/objeto contra uma borda, rodar a medição e escrever a conta. Vale também pra simular a composição em PIL e OLHAR o resultado antes de mandar o Pedro recarregar — foi o que revelou, no caso das folhas, que o problema não era posição e sim alfa premultiplicado.

Relacionado: legalize-muro-que-nao-existe-e3-3 · [[legalize-alfa-premultiplicado-halo-escuro]]
