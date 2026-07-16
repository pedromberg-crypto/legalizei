---
name: legalize-preco-deferido-custo-real
description: Preço do plano Legalizei DEFERIDO até ter custo unitário real (DB+API); B3 constrói com placeholder ~R$195 marcado FAKE.
metadata: 
  node_type: memory
  type: project
  originSessionId: 9ed32b22-c0c2-4d31-9354-2092b528a734
---

Decisão do Pedro em 2026-07-16: **o preço do nosso plano não se define agora**. Só volta à mesa depois de **testes reais de uso de banco de dados e API** — ou seja, com custo unitário medido (por empresa aberta / por mês ativo), não estimado.

Desdobramento travado na mesma conversa:
- **B3 (T16–T19) sai do bloqueio e entra em placeholder**: construir as telas de cobrança com **~R$195 marcado explicitamente como FAKE** (é o benchmark do plano Padrão da Contabilizei, ver [[legalize-benchmark-padrao-195]], **não** o nosso preço).
- Motivo de escolher placeholder em vez de parar em T15: mantém o flow **navegável ponta a ponta** pro E2E, sem travar a construção.
- Risco aceito: se o preço final mudar a **estrutura** (parcelamento, mais de um plano), T16–T19 sofrem retrabalho. Trade-off assumido conscientemente.

**Why:** precificar sem custo unitário é chute; o Pedro barrou por coerência com o padrão anti-guru do vault (número sem fonte não entra) — aqui aplicado à própria precificação, não só à pesquisa.

**How to apply:** não reabrir a discussão de preço nem cobrar "forçar a decisão com o Mauro" até o Pedro mencionar ou até existir dado de custo real. Ao construir/tocar B3, manter o R$195 sinalizado como placeholder no código/spec. Relacionado: [[legalize-benchmark-padrao-195]] · [[legalize-mlp-nao-mvp]].
