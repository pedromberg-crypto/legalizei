---
name: legalize-git-pr-automatico
description: "Pedro autoriza commit + criação de PR automáticos quando ele pedir um PR, sem passo manual no GitHub"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b4be8b66-8eb3-43a9-876a-98f5b36f7c30
  modified: 2026-08-05T19:14:16.624Z
---

Quando Pedro pedir um PR (não só um commit), fazer commit + `gh pr create` automaticamente, sem perguntar confirmação antes e sem esperar ele ir no GitHub clicar em nada.

**Why:** Pedro deu autorização explícita 05/08 ("vc já tem acesso ao repositório e ao meu github... pode vc mesmo fazer automático") depois de eu ter perguntado sobre push. Ele não quer o passo extra de abrir o GitHub pra criar o PR manualmente.

**How to apply:** Vale só pra **criar** o PR (commit + push + `gh pr create`). Não inclui merge/aceitar o PR na main — isso é ação mais destrutiva (altera main direto) e ele não pediu isso explicitamente; a linha "aceitar e executar" no pedido dele lia como "não quero clicar pra criar o PR", não necessariamente "não quero revisar antes de mergear". Se ele pedir merge automático também no futuro, atualizar esta memória. Continua valendo a regra geral: nunca force-push, nunca mexer em `main` sem pedido explícito, sempre confirmar antes de merge.
