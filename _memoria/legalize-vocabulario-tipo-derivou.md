---
name: legalize-vocabulario-tipo-derivou
description: "09/09: indice-autoridade fecha `tipo` em 6 valores, o vault tem 34. Doutrina sem verificador. Próximo flow começa por aqui."
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T15:01:21.189Z
---

**O `_sistema/indice-autoridade.md` diz que `tipo` é vocabulário FECHADO em 6 valores** (`hub` · `verdade` · `derivado` · `fato` · `historico` · `operacao`) e que "se não couber, discute antes de inventar". `status` fecha em 5.

**A varredura de 09/09 achou 34 valores distintos de `tipo` no vault:**
`fato` (101) · `derivado` (83) · `historico` (77) · `original` (40) · `referencia` (33) · `marco` (31) · `hub` (29) · `artefato` (16) · `teardown` (12) · `spec` (8) · e mais 24 caudas de 1 a 7 usos.

⚠️ **Eu mesmo inventei 4** (`spec`, `funcionalidade`, `evidencia`, `metodo`) ao criar a pasta `produto/`, e corrigi antes de entregar:
- spec de funcionalidade → `tipo: verdade`
- teardown de concorrente → `tipo: fato` (a definição no índice é "dado externo, datado. Não muda, só ganha data")
- a discriminação real virou **propriedade nova `dominio`**, que é o que a `.base` filtra

🔑 **A regra:** `tipo` e `status` são fechados. **Propriedade pode crescer.** Quando precisar discriminar, criar propriedade, não valor de `tipo`.

🔴 **A doutrina existe e não é aplicada por nada.** O Pedro pediu pra voltar nisso: proposta é um **verificador rodando junto com o `gerar-mapa.mjs`**, na mesma família das 3 travas do MEI (`verificar-fronteira-mei` · `verificar-mei` · `verificar-anatomia-mei`), avisando quando uma nota usa `tipo`/`status` fora do vocabulário. **A próxima janela começa por aqui.**

Relacionado: [[legalize-vault-organizado]] · [[legalize-pasta-produto-fonte-verdade]] · [[legalize-replica-de-tela-se-porta]]
