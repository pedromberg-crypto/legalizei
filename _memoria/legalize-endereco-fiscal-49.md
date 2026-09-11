---
name: legalize-endereco-fiscal-49
description: "Endereço fiscal é R$49/mês (revisado de R$60 em 11/09); ficar abaixo de R$50 resolve a contradição da cláusula 6.3, e o valor colide com o preço do plano MEI"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-10T19:32:23.173Z
---

**Endereço fiscal da Legalizai = R$ 49/mês**, fechado pelo Pedro em 2026-09-11. Revoga o R$60/mês travado em 04/09, que nunca foi conta nossa: era o preço do Escritório Virtual do concorrente, adotado como benchmark.

**Why:** dois efeitos que não são óbvios pelo número.

1. **Resolve de graça uma contradição do nosso contrato.** A cláusula **6.3** da minuta manda lançar em fatura só serviço de até **R$50**; acima disso exige aceite no ato. A R$60 o **Anexo I** dizia "fatura" e contrariava a própria 6.3 — era pendência de redação pra advogada. A R$49 o lançamento em fatura passa a ser legítimo pela regra geral, sem exceção redigida pra serviço recorrente.
2. ⚠️ **R$49 é também o preço do plano MEI.** Um chunk isolado ("R$ 49 por mês") não diz de qual dos dois se trata, e endereço fiscal **não se vende pro MEI** (existe pra resolver o gate de BH, que o MEI não tem). O vault do Léo ganhou aviso explícito de desambiguação em `01-PLANOS-E-OFERTAS.md`.

**How to apply:** fonte única é `CUSTOS.ENDERECO_FISCAL` em `app/src/lib/fiscal.ts` — nunca hardcodar em tela. A propagação de 11/09 pegou 13 arquivos: fiscal.ts, `flow-data.mjs` (+3 derivados regerados pelo `gerar-mapa.mjs`), 4 comentários de tela, 1 story, 4 arquivos do vault do Léo, minuta (Anexo I), espelho e `fila-validacao-humana.md`. No site, a constante é `var ENDERECO_FISCAL` nos dois `atendimento.js` (`lp/` e `lp/_lab/`).

🔴 **Os R$60 que ainda existem no vault são do CONCORRENTE** (`pesquisa/concorrentes/**`, `evolucao-para-mauro.md:225`) e não se mexe neles. Também ficam os registros históricos datados (marcos de julho, specs antigas, ADR de 04/09) — são o que era verdade naquele dia.

🔴 **Anexo IV (Escritório Virtual) da minuta continua não redigido:** só existe a linha de preço no Anexo I, sem termos. Ver [[legalize-contrato-proprio-decisoes]].

Relacionado: [[legalize-preco-deferido-custo-real]], [[legalize-agente-whatsapp-vault-isolado]], [[legalize-entidades-duas-empresas]].
