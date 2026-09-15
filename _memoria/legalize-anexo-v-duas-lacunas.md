---
name: legalize-anexo-v-duas-lacunas
description: "15/09 — o Anexo V tinha DUAS lacunas e simulacao so fecha uma; e a efetiva e continua nas bordas de faixa, menos na 6a"
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-15T11:15:40.047Z
---

O Anexo V tinha **duas** lacunas, e confundi-las infla o placar:

1. **Comportamento** — ele só tinha rodado na **1ª faixa** (pelo P01), e na 1ª faixa a parcela a deduzir é **zero**, então a efetiva é igual à nominal e metade da tabela nunca era tocada. ✅ **FECHADA em 15/09** pela vida simulada do **P16** (consultoria em TI, RBT12 de R$0 a R$359 mil em 22 competências), com 8 invariantes deriváveis da LC 123.
2. **Documento** — nenhum recibo de PGDAS-D em Anexo V. 🟡 **RECALIBRADA EM 15/09: era 🔴 bloqueio e não é.** O Pedro derrubou a exigência (*"se veio de fonte de governo é confiável desde que esteja atualizado"*): faixas, repartição, RBT12 e Fator R saem de fonte oficial, e a convenção de arredondamento é **herdada do Anexo III**, que tem recibo — mesmo código nos dois anexos, diferença de 1 centavo. Segue desejável com o Mauro, deixou de travar. Ver [[legalize-regua-de-prova-fonte-oficial]].

**Why:** eu já inflei esse placar uma vez ("7 de 8" que era 4 de 8, corrigido em 14/09). Uma vida simulada prova **relação**, nunca **valor** — misturar as duas colunas repete o mesmo erro com cara de progresso.

**How to apply:** ao dizer que algo "fechou" no motor fiscal, dizer **qual das duas**. A tabela do `_SUFICIENCIA.md` §2 separa "exercitado por invariância" de "testado contra documento real" justamente por isso.

## 🔴 O achado das bordas (15/09)

A alíquota efetiva é **contínua ao 12º decimal** nas bordas de faixa: em R$180.000 exatos, a faixa 1 e a faixa 2 dão o **mesmo** número (15,5000% no V, 6,0000% no III). Vale em f1→f2, f2→f3, f3→f4 e f4→f5, nos **dois** anexos — 8 bordas. A parcela a deduzir é **calibrada** pra isso, não é número solto, e ler a faixa errada por um centavo não muda a conta.

**E quebra na 6ª**, nos dois anexos, no mesmo ponto (R$3,6 mi) e **para baixo**: Anexo III cai 2,51pp (17,5100% → 15,0000%), Anexo V cai 5,7750pp (21,2750% → 15,5000%). Quem atravessa paga efetiva **menor** que quem fica logo abaixo.

**Why:** é propriedade da **tabela da LC 123**, não do motor — aparece idêntica nas duas tabelas, que estão conferidas contra a lei. Fica registrado e **não vira regra**: está a 10× do teto do ME (R$360 mil).

**How to apply:** o invariante afirma que a quebra é **só** na 6ª faixa. Se um dia aparecer numa borda de baixo, é erro de digitação em `_tabelas.mjs` e o teste derruba a rodada.

Relacionado: [[legalize-motor-fiscal-arredonda-por-tributo]], [[legalize-motor-fiscal-apurador-existe]], [[legalize-estado-recorrente-cnpj]], [[legalize-fator-r-e-retrovisor]].
