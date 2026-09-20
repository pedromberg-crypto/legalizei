---
tipo: indice
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [estrutura, leo, agente, arquitetura, inventario]
---

# ESTRUTURA — o retrato do agente Léo

Quatro vistas do mesmo agente, medidas em **2026-09-20**, no commit `69f2acb`.

As duas primeiras são **retrato**; as duas últimas são **resposta a quem perguntou de
fora**. Nenhuma delas decide nada: decisão mora no ADR (`marca/decisoes-marca.md`).

| nota | responde |
|---|---|
| [[01-arvore-de-arquivos]] | **o que existe em disco**, por nível, com tamanho medido |
| [[02-arquitetura-vs-realidade]] | **o que o diagrama de arquitetura promete** e quanto disso está construído |
| [[03-perguntas-de-arquitetura-respondidas]] | **quatro perguntas de fora** — routing, RAG, máquina de estado, orquestração — respondidas com o que existe. Pronta para sair do vault |
| [[04-perguntas-da-arquitetura-sidecar]] | **três perguntas sobre a proposta Sidecar** — fallback técnico, quebra do SOUL, o que salvar no SQLite. Recomendação com evidência; **nada decidido** |

## Por que esta pasta fica na raiz, e não dentro do vault

`execucao/agente-whatsapp-vault/` é sincronizado para o VPS pelo `sync-vps.sh`, e tudo
que mora lá entra no universo que o agente pode abrir. Documento **sobre** o agente não
é documento **do** agente. Por isso ESTRUTURA fica fora.

## Régua

🔴 **Número aqui é medido, nunca lembrado.** Todo tamanho desta pasta saiu de um único
comando, e quem atualizar a nota roda o mesmo comando antes:

```bash
find execucao/agente-whatsapp-vault -type f -not -path "*_arquivo*" \
  -printf "%8s  %p\n" | sort -k2
```

A unidade é **caractere**, não token nem linha. A razão medida no Léo é de
**3,747 chars por token** (115,9M chars contra 30,9M tokens, 662 sessões) — está no
[[briefing-agente-leo-2026-09-20]] §10.

⚠️ **Isto é uma foto com data.** Envelhece a cada commit no vault. Se a data acima
divergir do último commit que toca `execucao/agente-whatsapp-vault/`, remedir antes de
usar como argumento.

## Vizinhança

* [[briefing-agente-leo-2026-09-20]] — o contexto completo da frente, para quem entra sem histórico
* [[handoff-leo-ajustes-2026-09-17]] — o handoff mais recente antes do briefing
* [[2026-09-19-leo-respondia-de-memoria]] — o marco que explica por que o SOUL não guarda número
* [[personagem-leo]] — a fonte da personalidade (fora do vault do agente)
