---
name: legalize-travas-de-metodo-15-09
description: "15/09 — 3 travas nascidas de 3 erros meus no mesmo dia: verde vazio, assunto reaberto, fonte sem dono"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-16T01:49:49.339Z
---

🔴 **Três erros meus no mesmo dia viraram três travas.** O Pedro travou cada uma depois de me pegar repetindo o mesmo tipo de falha.

## 1 · `_afirmar.mjs` — teste que passa a vazio

Os três verdes falsos de 15/09 têm a **mesma raiz**: a asserção olhava a **consequência** e nunca exigia prova de que houve **caso**.

- `.filter()` sobre campo com nome errado (`fr`, não `fatorR`) → lista vazia → `every()` devolve `true`
- invariante do Fator R passando com **1 competência**, que era razão infinita, outro fenômeno
- *"o INSS do P09 é zero"* passando **porque o motor tinha o bug** de somar sócios

`todos(colecao, pred, minimoDeCasos)` derruba se a coleção for menor que o mínimo **declarado**. `numero()` recusa `undefined`/`NaN`. `porque()` exige causa junto da consequência.
🔑 **Verde sem evidência é pior que vermelho — ele tapa o buraco.**

## 2 · `_encerrados.mjs` — assunto encerrado não volta pra fila

Reabri o ISS **3 vezes** depois de encerrado. 🔑 **E o código nunca esteve errado** — as reincidências foram em **PROSA**, eu escrevendo o assunto em listas de "o que falta" e "dúvidas com o contador". Trava que olhasse código não pegaria nada.

Por isso ela varre os **documentos de pendência**. Na estreia pegou **4 reaberturas vivas**, todas minhas, do mesmo dia.

⚠️ Quando o Pedro perguntou *"como você me garante que não ocorrerá mais?"*, a resposta honesta foi: **não garanto meu julgamento** — prometi 3× e falhei 3×. O que dá é tornar a falha **mecanicamente detectável**, pra custar a rodada em vez da conversa dele.

## 3 · `verificar-autoridade.mjs` — fonte sem dono declarado

Provocação: *"você busca fontes de verdade em lugares diferentes e se contradiz"*. **Medido:** o `_sistema/indice-autoridade.md` existe desde 16/07, estava atualizado até **12/09**, e o motor fiscal nasceu em **14/09** — nenhum arquivo dele tinha linha lá.

🔑 **Não era falta de documentação, era documentação sem dono declarado.** Sem linha dizendo onde olhar, eu procurava; procurando em lugares diferentes, achava respostas diferentes.

**Why:** as três protegem contra o **deslize**, nunca contra o **engano** — mesma fronteira da trava de escopo e da de anatomia do MEI.

**How to apply:** antes de procurar fonte nesta área, ler o `indice-autoridade`. Antes de escrever pendência, conferir se o assunto não está em `_encerrados`. E toda afirmação sobre coleção declara o mínimo de casos.

Relacionado: [[legalize-vault-organizado]] · [[legalize-regua-de-prova-fonte-oficial]] · [[legalize-achados-do-motor-por-persona]].
