---
name: legalize-leo-personalidade-4-copias
description: "04/09: a personalidade do Léo vive em 4 lugares e 2 já divergiram (pilares v3 x v4, polo com L x com check); fonte-verdade é marca/personagem-leo.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: 115ac965-35bf-4b2f-9442-7203ca25be16
  modified: 2026-09-04T12:25:31.044Z
---

A personalidade do Léo está em **4 arquivos**, com papéis diferentes:
1. `marca/personagem-leo.md` — 🟢 **fonte-verdade** (bíblia, 15 seções).
2. `atelie/ds/legalizai/personagem-leo.md` + `personagem.json` + `voz.json` — cópia estruturada pro motor de posts.
3. `execucao/handoffs/handoff-leo-agente-whatsapp.md` — extração pro dev montar o `SOUL.md` do agente.
4. `execucao/agente-whatsapp-vault/00-DIRETRIZES-SEGURANCA.md` §2 — resumo operacional que o bot lê em runtime.

**Drift já confirmado na cópia do Ateliê (2 pontos, 04/09):** §11 dos pilares congelou na v3 de 26/08 enquanto a fonte está na v4 de 01/09 (pilares 6 e 7 em standby, novos 16 e 17); e §12 ainda descreve o polo do Léo com **"L"** no peito, quando a fonte corrigiu pra **o check** da Legalizai em 29/08. Gerar imagem pela cópia produz o Léo errado.

**Why:** é o mesmo padrão de defeito já corrigido 3x no projeto (CNAE de um dígito, `03`+`06` do vault do agente, contador de passos de 19/07): **informação repetida sem dono declarado diverge**, e o custo aparece longe da causa.

**How to apply:** editar sempre em `marca/personagem-leo.md` e ressincronizar os derivados no mesmo dia. 🟡 O carimbo de "derivado, não editar" nos 3 e a ressincronização da cópia do Ateliê foram **propostos ao Pedro em 04/09 e ainda não têm ok** — não aplicar sem ele mandar. Ver [[legalize-agente-whatsapp-vault-isolado]].
