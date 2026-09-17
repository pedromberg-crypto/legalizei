---
name: legalize-entrega-dev-e-centavos
description: "17/09: a fixture É o contrato (não existe doc de contrato), todo dinheiro do motor é inteiro em centavos, e a rede dos legíveis congelados é como se refatora com segurança"
metadata: 
  node_type: memory
  type: project
  originSessionId: 137c5c62-5907-425e-84f8-713185c5d706
  modified: 2026-09-17T15:27:00.247Z
---

**Três decisões travadas em 2026-09-17**, da provocação do Pedro: *"sinto tudo ainda meio solto… precisamos abraçar essa complexidade e organizar enquanto há tempo"*.

## 1 · A fixture É o contrato

Eu propus declarar contrato escrito ao lado de cada uma das 38 funções, com trava. **O Pedro recusou o atrito e estava certo:** prosa à mão foi o que envelheceu em 7 de 7 docs, e **exemplo diz melhor que prosa**. Ninguém escreve *"recebe reais, devolve centavos"* se a fixture mostra `5400` entrando e `59400` saindo.

`execucao/entrega/` — **back** (38 funções + 162 competências, entrada → esperado) e **front** (as mesmas 162 como tela, com o que **não** mostrar). Ligados pelo campo `caso`. Gerado por `gerar-entrega.mjs`, nunca escrito à mão.

## 2 · Todo dinheiro do motor é INTEIRO EM CENTAVOS

Duas portas declaradas e só duas: `competencia()`/`identidade()` convertem a autoria, e `daTabela()` lê a tabela da lei — **que fica em reais de propósito**, porque `TETO_INSS: 8475.55` é conferível contra a Portaria e `847555` não é.

**How to apply:** ao chamar qualquer função do motor, passar centavos. As suítes autoram em reais com `R()` visível **em cada chamada** — a unidade fica no lugar onde o erro acontece.

## 3 · 🔑 A rede dos legíveis — como refatorar com segurança aqui

Antes de mexer, gerar as fixtures e **congelar o campo `legivel`** de cada valor. `"R$ 2.790,01"` é **independente de unidade**: se a refatoração for pura, diff zero. Saiu de **1190 diffs → 0**, e cada rodada apontou caso e campo.

⚠️ **O congelado é escrito UMA VEZ e depois só conferido** (`--recongelar` é ato deliberado). A 1ª versão se reescrevia a cada rodada — na pipeline isso daria diff zero por construção **justamente enquanto tudo mudava**.

⚠️ **Confiar só nas suítes não basta:** elas também migram, e suíte migrada junto com o código pode encodar o bug (foi o M-013).

**Why:** a rede achou dois bugs que **não eram da migração** — o arredondamento decidindo empate de meio centavo por acaso (M-030, latente desde 14/09) e a porta de entrada convertendo duas vezes quem já estava dentro (M-031, e **nenhuma suíte reclamou** — quem pegou foi a trava de defasagem comparando com prosa).

✅ **Nenhum valor com documento atrás se moveu:** as 46 conferências do teste dourado passam idênticas.

Relacionado: [[legalize-trava-defasagem-e-ordem]], [[legalize-motor-fiscal-arredonda-por-tributo]], [[legalize-motor-fiscal-apurador-existe]], [[legalize-contador-valida-o-motor]].
