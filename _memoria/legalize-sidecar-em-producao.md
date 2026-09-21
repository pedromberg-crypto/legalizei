---
name: legalize-sidecar-em-producao
description: "21/09 02:20 - o Leo trocou de motor. Node+Postgres+pgvector no ar, Python desligado. E o codigo de producao NAO esta no repo."
metadata: 
  node_type: memory
  type: project
  originSessionId: b17ec379-f0f6-464c-95b9-46921b343a5b
  modified: 2026-09-21T03:27:37.995Z
---

O agente de WhatsApp roda desde **21/09, 02:20:51**, no `hermes-v2-sidecar`: Node + Postgres (Supabase) + pgvector + Gemini, com tool calling. O `hermes-gateway-leo` (Python) está **parado e desabilitado**, e a ponte Baileys foi emancipada em unidade própria (`whatsapp-bridge.service`).

A linha que organiza o desenho: **fato duro nunca se recupera por semântica, texto nunca guarda número**. Três esquemas no banco (`fatos` relacional por tool calling · `conhecimento` vetorizado · `conversa` estado do diálogo), roteador de 4 saídas exclusivas (escalonamento vence tudo → fora de escopo vence comercial → comercial só depois de sucesso técnico), e a trava comercial vivendo em 3 lugares: código, constraint `comercial_exige_tecnica_ok` e regra escrita.

Números medidos: cache com **91,5% de acerto e 78,2% de economia**; conversa comercial de 10 turnos custa **US$ 0,0152**; ~99% do input é o prompt de sistema reenviado.

🔴 **A dívida aberta, e ela é urgente:** o código que **está atendendo cliente** não está no repositório. `PERSONA.md`, `RULES.md`, `server.ts`, `tools-def.ts`, `e2e.ts`, `relatorio.ts`, um cartão reescrito e a coluna `tokens_cache` vivem só em `/opt/hermes-v2-sidecar` na VPS (acesso por `ssh legalize-vps`, chave `~/.ssh/legalize_vps`). Os 28 relatórios em `hermes-v2-sidecar/reports/` descrevem um código que não possuímos.

**Why:** duas sessões trabalharam em paralelo (esta máquina e uma na VPS) e só os relatórios foram resgatados. Perder aquela VPS agora significa perder o motor em produção, não só histórico.

**How to apply:** trazer o código é a primeira coisa de qualquer janela nova — `git diff` arquivo a arquivo antes de sobrescrever, porque os nossos também mudaram. ⚠️ E **nunca** apontar o `server.ts` local para a ponte de produção "só para testar": a fila é de leitura destrutiva e isso rouba mensagens de clientes reais; existe `scripts/ponte-falsa.mjs` para isso. Lições de método em [[legalize-regra-negativa-nao-impede-alucinacao]]; o retrato do agente antes da troca em [[legalize-agente-whatsapp-vault-isolado]].
