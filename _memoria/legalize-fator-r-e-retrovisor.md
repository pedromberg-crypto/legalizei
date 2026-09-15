---
name: legalize-fator-r-e-retrovisor
description: 15/09 — corrigir o pro-labore NAO devolve o anexo no mes seguinte; e um invariante que passava pelo motivo errado
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-15T03:58:36.755Z
---

🔑 **O Fator R é RETROVISOR.** Ele olha os 12 meses anteriores, então **consertar hoje não conserta hoje**. O P01 corrige o pró-labore em set/2026 e só volta ao Anexo III em **ago/2027** — 11 meses pagando 15,5% já com o pró-labore certo.

**Why:** é o que a tela precisa dizer, e era exatamente o que nenhum teste afirmava. O cliente que descobre o problema e corrige espera alívio no mês seguinte; não vem.

**How to apply:** nunca escrever copy que sugira efeito imediato ao corrigir o pró-labore. A promessa honesta é "a partir de ~11 meses", e o produto deveria mostrar a **data** em que o anexo vira.

## O invariante que passava pelo motivo errado

O `verificar-vidas.mjs` afirmava *"e VOLTA pro III quando corrige o pró-labore"* e **passava** — com 1 competência em Anexo III. Só que essa competência era mai/2026, onde o Fator R é **infinito** porque não havia receita anterior. Nada a ver com correção nenhuma.

**Why:** teste que passa pelo motivo errado é **pior que teste que falha** — ele cobre o buraco em vez de mostrar. Descoberto só porque o Pedro pediu a projeção do mês seguinte.

**How to apply:** invariante que "passa" com contagem baixa (1 de N) merece checar **qual** caso passou, não só que passou. E o comportamento de razão infinita (receita anterior zero + folha paga → **Anexo III**) merece afirmação **própria** — é o que salvou fev/2026 da persona zero de virar Anexo V indevidamente, cobrado a 6%.

Relacionado: [[legalize-anexo-v-duas-lacunas]], [[legalize-motor-fiscal-arredonda-por-tributo]], [[legalize-estado-recorrente-cnpj]].
