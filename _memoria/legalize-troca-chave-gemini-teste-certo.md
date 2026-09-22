---
name: legalize-troca-chave-gemini-teste-certo
description: "22/09 - trocar a GEMINI_API_KEY: `GET /v1beta/models` com 200 NAO prova nada (catalogo e quase publico). O teste que vale e generateContent + embedContent. Chave nunca passa pelo chat; EnvironmentFile so vale apos restart."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-22T14:41:22.565Z
---

🔴 **`GET /v1beta/models` devolver `200` NÃO prova que a chave do Gemini serve.** Medido em 22/09/2026, e derrubou o Léo por ~15 segundos: a chave nova passou no catálogo e devolveu **`403 PERMISSION_DENIED · "Your project has been denied access"`** na subida do serviço. Catálogo é endpoint quase público; **gerar conteúdo exige projeto habilitado** (a *Generative Language API* não estava ativa no projeto novo).

**Why:** eu mesmo escrevi o teste errado no prompt que mandei para a VPS — *"200 → chave boa, siga"*. O teste tem que bater no endpoint que o produto usa, não num que qualquer chave alcança.

**How to apply:** antes de reiniciar, testar **`generateContent`** no modelo em uso (`gemini-3.1-flash-lite`) **e `embedContent`** (`gemini-embedding-001`). Os dois `200`, aí sim restart. O procedimento completo está no §1.1 do `hermes-v2-sidecar/CLAUDE.md`.

Outros três fatos da mesma operação:
- 🔑 **`EnvironmentFile` é lido no START**: editar o `.env` não muda nada até o restart, e chave ruim não aparece no boot — derruba na primeira chamada ao LLM.
- 🔒 **A chave nunca passa pelo chat de um agente** (vai para o transcript e é relida a cada turno). Quem edita é o Pedro, por `nano .env` no terminal SSH; o agente testa, reinicia e confere comparando **comprimento e os 4 últimos caracteres**.
- ⚠️ **Backup de `.env` é segredo igual**: `cp -a` preserva o `600`, e some com `shred -u`, não `rm`. E revogar a chave velha no console — trocada e não revogada continua valendo.

Ver [[legalize-leo-numero-em-teste]] (o número está em teste, então restart não pede janela de silêncio).
