---
name: legalize-espelho-mapa-apresentacao
description: "02/09 — mapa e apresentação são duas vistas da MESMA coleção de telas; a fita de pills deriva do flow-data, e o Pedro só revisa por esses dois lugares."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-02T16:30:51.581Z
---

O Pedro revisa o produto **só** por `/apresentacao` e `/mapa`. Nunca abre código nem `flow-data`. Um pedido dele pode ser layout, flow, ou os dois juntos, e vem de onde ele estiver olhando.

**A regra travada (02/09):** mapa é ESPELHO da apresentação. Mesma coleção de telas, duas vistas — uma conectada e em ordem de flow, a outra navegável. Nada existe num sem existir no outro.

Mecânica: `NODES` em `produto/_flow/flow-data.mjs` é a coleção única (campo `caminho` = abrir/migrar/mei/dev, **declarado** porque MEI e ME compartilham o tronco e o grafo não separa). A fita de pills da apresentação **deriva** dela via `TELAS_DO_FLOW`; o vínculo nó↔demo é `MOMENTO_POR_NO`, indexado por **`id`, nunca por rota** (`/gate?etapa=triagem` é a Triagem do ME e a tela de impedimentos do MEI). `gerar-mapa.mjs` audita o espelho a cada rodada.

**Por quê:** existiam duas listas (77 nós × 54 pills à mão) e divergiram em 12 telas invisíveis na demo. O Pedro virou o detector de bug sistêmico — apontava sintoma numa tela, eu corrigia só ali, reaparecia na próxima (degradê de rolagem pedido **4 vezes**).

**Como aplicar:**
- Tela nova = nó no `flow-data` + render + linha no `MOMENTO_POR_NO`, depois rodar o gerador. Sem render, vira pill "sem tela ainda" (buraco visível é o ponto).
- **Pré-voo** antes de editar qualquer tela: código/nome, rota, o que coleta, o que recebe de antes, o que passa adiante, variantes, onde aparece.
- Lote por tela, não rodada por micro-ajuste.
- Sintoma repetido na 2ª tela = parar e corrigir a raiz.

Relacionado: [[legalize-mapa-flow-vivo]] · [[legalize-mapa-estatico-apresentacao-junto]] · [[legalize-apresentacao-gestao]]
