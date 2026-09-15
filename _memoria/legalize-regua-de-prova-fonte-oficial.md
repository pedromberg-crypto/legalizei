---
name: legalize-regua-de-prova-fonte-oficial
description: "15/09 — documento nao e portao universal: fonte oficial fecha a REGRA, documento fecha a CONVENCAO. 2a vez que o Pedro corrige a mesma confusao."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-15T11:15:34.234Z
---

🔴 **Cada pergunta tem a fonte que a fecha, e só ela.** Travado pelo Pedro em 15/09: *"não teremos sempre um recibo ou um contrato social à mão para poder validar como verdade absoluta apenas após ele… se veio de fonte de governo é confiável desde que esteja atualizado e não seja um dado antigo."*

| Pergunta | Quem fecha | Quem NÃO fecha |
|---|---|---|
| **Qual é a regra?** | fonte oficial vigente (lei, resolução, manual) | documento de um caso; conta do líder |
| **Como o órgão executa na prática?** | documento emitido (recibo, guia, protocolo) | a lei, que é silenciosa sobre arredondamento |
| **O que o concorrente faz?** | evidência — **nunca** autoridade | — |

**O caso que gerou:** eu marcava ⛔ no motor fiscal por falta de recibo de PGDAS-D em **Anexo V**. Não era portão: as 6 faixas, a repartição, o RBT12 e o Fator R saem de fonte oficial, e a convenção de arredondamento é **herdada do Anexo III**, que tem recibo — o DAS é soma de 6 parcelas arredondadas nos dois anexos, **mesmo código**, diferença de 1 centavo. Virou 🟡 desejável.

🔴 **É a 2ª vez.** A 1ª foi 14/09, no ISS retido, quando eu marquei 🟡 uma regra provada com controle + texto legal literal. Mesma confusão: *"não temos recibo deste caso"* tratado como *"não sabemos a regra"*.

**Why:** exigir documento onde a regra já está fechada trava construção sem reduzir risco — e cria fila de pendência falsa com terceiros (Mauro, Larissa) que não têm o que resolver.

**How to apply:** antes de marcar algo como bloqueado por falta de documento, decompor: qual peça vem de norma (fecha sozinha) e qual vem de prática do órgão (aí sim precisa de documento). Se a peça de prática já foi provada num caso vizinho pelo mesmo código, é herança, não lacuna.

🐛 **E o corolário do mesmo dia:** correção que entra no **código** e não entra na **fonte de dados** vira armadilha. A CPP fora do Fator R foi corrigida em 14/09 no `apurador.mjs` e o `_tabelas.mjs` seguiu listando `cpp-embutida-no-das` em `entra`; eu li o dado e afirmei o oposto pro Pedro. Nenhum número saiu errado, mas o dado induzia. Ver [[legalize-escrita-arquivo-so-edit-write]] para a outra armadilha de processo.

Relacionado: [[legalize-anexo-v-duas-lacunas]] · [[legalize-motor-fiscal-apurador-existe]] · [[legalize-piloto-pro-labore-automatico]] · [[legalize-leitura-integral-documento]].
