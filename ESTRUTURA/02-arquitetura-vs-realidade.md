---
tipo: diagnostico
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [estrutura, leo, agente, arquitetura, lacuna]
---

# 02 — A arquitetura recomendada × o que existe

O diagrama "Arquitetura recomendada" que circulou é **alvo, não retrato**. Esta nota
mapeia caixa por caixa.

**Placar:** de 8 caixas, **4 existem**, **3 não existem** e **1 existe desligada**.

---

## O diagrama, com o estado real de cada caixa

```
WHATSAPP                                    ✅ EXISTE
  │                                            ponte baileys (Node), dentro do gateway
  ▼
HERMES Orquestrador                         ✅ EXISTE
  │                                            /usr/local/lib/hermes-agent
  │                                            perfil em ~/.hermes/profiles/leo
  ├──────────────┬──────────────────┐
  ▼              ▼                  ▼
PERSONALIDADE  CONTEXTO           MEMÓRIA                ❌ NÃO EXISTE
SOUL.md        Vault              Long-term
  ✅ 23.297      ✅ 214.788           o toolset `memory` aparece em
  sempre no       13 notas +         known_builtin_toolsets, mas FORA de
  prompt          4 skills           platform_toolsets. Tirado no v12 de propósito.
                                     Zero memória entre conversas.
  └──────────────┴──────────────────┘
                 ▼
        CONVERSATION ENGINE                  ⚠️ EXISTE E ESTÁ DESLIGADO
                 │                              `context_engine` do Hermes traz
                 │                              select_context() · prune_tool_results_only()
                 │                              on_turn_complete(). Nunca foi ligado.
                 │                              No lugar dele rodam 2 plugins — e eles brigam.
        ┌────────┼────────┐
        ▼        ▼        ▼
      Skills    MCPs     LLM
        │         │       │
        │         │       └── ✅ gemini-3.1-flash-lite
        │         │            fallback: gemini-3.5-flash-lite
        │         │
        │         └── ❌ NENHUM MCP EXISTE — 0 de 4
        │              CRM/API · Cliente · Produtos · Leads
        │
        └── 🟡 3 de 4
             Atendimento  ✅ 11.358
             Vendas       ✅ 19.403   5% de aproveitamento
             Escalação    ✅  9.224
             Follow-up    ❌ zero ocorrência no vault inteiro
```

---

## A prova de cada veredito

Tudo abaixo saiu do `config.yaml` do runtime, versionado em
`execucao/agente-whatsapp-vault/_arquivo/pacote-v12-2026-09-20/runtime/config.yaml`.

### ❌ MEMÓRIA long-term

```yaml
platform_toolsets:
  whatsapp:
  - skills          # ← a lista inteira
```

`memory` está em `known_builtin_toolsets` (o catálogo do que o Hermes sabe fazer), e
**não** em `platform_toolsets` (o que está ligado). Catálogo não é ligação.

### ⚠️ CONVERSATION ENGINE

Mesmo caso: `context_engine` é conhecido, não está ligado. O que roda hoje:

```yaml
plugins:
  enabled:
  - leo-formatador     # filtro de saída
  - leo-cadencia       # quebra em 2 mensagens, só no WhatsApp
```

🔴 **E os dois se atrapalham:** o `leo-formatador` converte tabela em lista, e o
`leo-cadencia` desiste de quebrar em duas mensagens se houver lista.

### ❌ MCPs

Nenhum. `connections`, `file`, `cronjob` e `session_search` existem no catálogo e estão
todos fora de `platform_toolsets`. A única ferramenta prometida — `consultar_cnae` —
é **spec**: aparece em `11-COMO-CONSULTAR-CNAE.md` e no `README.md`, e em nenhum código.
Prometida desde julho.

⚠️ Ligar o toolset `file` traz junto `write_file` e `patch`, **e o Hermes roda como
root**. Não é decisão de conveniência.

### ❌ Follow-up

`grep -ril "follow.up"` no vault inteiro: **zero ocorrência**.

### 🟡 A 5ª skill que o diagrama não mostra

`base-legalizai/SKILL.md` (950 chars) não está no desenho, mas existe e é estrutural:
é debaixo dela que moram as 13 notas de conhecimento. O diagrama desenha 4 skills de
**ação** e esquece a de **conhecimento**, que é justamente a mais cara.

---

## O que o diagrama não desenha e é metade do trabalho atual

| | chars | por que fica de fora do desenho |
|---|---|---|
| `_testes/` | 68.092 | 2 suítes (58 casos de 1 turno · 3 conversas de 12 turnos) |
| `sync-vps.sh` | 5.539 | repo → VPS, com `diff` obrigatório e backup |

Nenhum dos dois roda dentro do agente, e os dois decidem se uma mudança entra ou não.

---

## Leitura

🔑 **Os 214.788 chars são quase todos duas caixas: PERSONALIDADE e CONTEXTO.** As três
caixas que o diagrama chama de arquitetura — memória, conversation engine, MCPs — não
têm um arquivo sequer no repo. O que temos hoje é **documentação bem organizada com um
roteador fraco**, não uma arquitetura de agente.

🔴 **Isto não é uma lista de tarefas.** O Léo não está com cliente (só com a equipe
interna), então nada aqui é urgente por dor de usuário — ver
[[legalize-agente-whatsapp-vault-isolado]]. A ordem de valor medida está no
[[briefing-agente-leo-2026-09-20]] §9.

Ver também [[01-arvore-de-arquivos]].
