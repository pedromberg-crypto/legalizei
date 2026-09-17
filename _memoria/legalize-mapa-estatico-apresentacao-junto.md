---
name: legalize-mapa-estatico-apresentacao-junto
description: "Pedido de reposição/layout \"no mapa\" (/mapa React Flow) precisa mexer também na /apresentacao, sempre junto — o mapa é só diagrama estático, não roda funcionalidade"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-08-28T14:07:48.833Z
---

Quando o Pedro pede pra reposicionar telas ou mudar layout "no mapa" (`/mapa`, o board React Flow), a mudança **tem que entrar em dois lugares ao mesmo tempo**:

1. `produto/_flow/flow-data.mjs` — fonte única do `/mapa` e do `mapa-flow-mermaid.md` gerado.
2. O state machine real da `/apresentacao` (`type Etapa`/`type Momento`, `ROTA_POR_MOMENTO`, os blocos de render) — é ali que a tela de verdade roda.

`/mockup` fica **fora** dessa régua: ele é iframe ao vivo das rotas de produção, reflete sozinho quando as rotas mudam — não precisa de wiring manual.

**Why:** o `/mapa` é só diagrama (retângulos + setas via `@xyflow/react`), sem renderizar nenhum componente real — mudar só ali é cosmético e não "funciona". O Pedro pediu antes pra mexer só no mapa e deixar a apresentação pra depois (28/08), mas ao testar percebeu que isso quebra a expectativa: ele olha o mapa achando que já reflete a experiência real, e não reflete. A régua nova substitui a antiga.

**How to apply:** todo pedido de reposição/troca de layout que mencionar "o mapa" dispara as DUAS frentes (`flow-data.mjs` + `/apresentacao`) na mesma resposta, sem esperar um "agora atualiza a apresentação" separado. Se o pedido for sobre uma tela nova / conteúdo de campo (não ordem/layout), a régua antiga ainda pode valer — confirmar se ficar em dúvida. Ver [[legalize-mapa-flow-vivo]] (o `/mapa` é gerado, nunca editado à mão) e [[legalize-reordenacao-e-telas-em-codigo]].
