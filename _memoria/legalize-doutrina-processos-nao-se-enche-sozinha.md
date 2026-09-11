---
name: legalize-doutrina-processos-nao-se-enche-sozinha
description: "11/09 — a §6 da doutrina de processos é a casa das lições da frente /processos, e ela NÃO se atualiza sozinha; o gerador agora avisa depois de 3 levas sem edição."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2688ec1e-65f2-4a08-be2f-0e4bac11906a
  modified: 2026-09-11T13:54:21.161Z
---

O Pedro preparou `execucao/processos/_doutrina-processos.md` como arquivo-base da frente `/processos`, e a **§6 é a casa das lições** ("erros que eu já cometi nesta frente", uma linha por erro, com data). Ele perguntou em 11/09 se isso se atualizava sozinho enquanto a gente mexia. **Não se atualizava** — e a prova estava na mesa: no mesmo dia em que a §6 nasceu, dois erros meus ficaram de fora dela.

O que roda sozinho na frente é só o par fonte→saída: `processos-data.mjs` → `gerar-processos.mjs` → `processos-graph.json` (board) + `PROCESSOS.md` (dev). **Prosa nenhuma se gera**: §6, `HOME §Agora` e a auto-memória dependem de alguém escrever.

Desde 11/09 o `gerar-processos.mjs` tem um **vigia**: conta as levas (commit, ou a árvore suja de agora) que tocaram `/processos`, `api/e2e`, `e2e/` e `processos-medidas.ts` desde a última edição da doutrina, e imprime um bloco chamando a §6 quando passa de 3. Cala sozinho quando a doutrina já está sendo editada. `PROCESSOS_LIMITE=1` força o aviso pra conferir que ainda aparece.

**Why:** o pedido original que criou a doutrina foi *"não quero ter que ficar vendo erros básicos sendo repetidos com frequência"*. Lição que mora só no comentário do arquivo que quebrou não previne nada — ninguém lê o comentário antes de errar. E a §6 dependia da minha lembrança, que é justamente o que falhou.

**How to apply:** ao fechar uma leva em `/processos`, perguntar *"o que quebrou por um motivo que vai voltar?"* e escrever a linha na §6 **antes do commit**, com data. Erro que tem raiz comum com outro vira subseção (§6.1, §6.2), não duas linhas soltas. Se o vigia gritar e nada tiver quebrado, ignorar é resposta legítima. Ver [[legalize-processo-antes-da-tela]] e [[legalize-metodo-alteracao-tela-travado]].
