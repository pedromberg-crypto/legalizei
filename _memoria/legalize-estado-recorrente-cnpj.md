---
name: legalize-estado-recorrente-cnpj
description: "14/09 - nasce execucao/estado-cnpj/ com a regra \"derivado nao se guarda\"; o extrato inteiro pegou 2 bugs que teste de um mes nao pega."
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-15T02:49:12.040Z
---

`execucao/estado-cnpj/` — a espinha que faltava. O motor fiscal existia e **ninguem o chamava com dado de verdade**. Achado de 27/08 (`equacao-viva-camada-2-vars-cnpj`) que ficou aberto 18 dias, e o tamanho real e pior do que a nota dizia:

- `/pro-labore` roda com `FAT = 6000` **fixo no componente**
- `/notas` tem 26 notas proprias (mai-jul/2026)
- `/impostos` exibe **STRINGS**: *"R$ 178,31"*, *"Faturou R$ 4.200"* — e e inconsistente consigo mesmo (4.200 × 6% = 252) e mostra pro-labore de R$932, **abaixo do salario minimo**

Tres telas, tres faturamentos para a mesma empresa.

## 🔑 A regra que o modelo cria

**GUARDADO** = o que alguem informou ou o orgao devolveu: nota emitida, pro-labore declarado, baixa do pagamento, data de abertura no CNPJ.

**DERIVADO** = tudo que sai de conta: RBT12, Fator R, anexo vigente, DAS, aliquota, vencimento. **Nada disso se guarda.**

🔴 **Guardar derivado e como o produto passa a mentir quando a regra muda** — e a regra mudou **duas vezes so em 14/09** (a CPP saiu do Fator R, o IRRF virou zero).

Consequencia: nenhuma tela guarda numero fiscal proprio. Ela pede ao estado, o estado chama o motor. Se duas telas mostram numeros diferentes para a mesma empresa, e **bug**, nao "mock diferente".

## 🔴 O extrato inteiro pegou 2 bugs que teste de um mes nao pega

**(1) Fevereiro saia Anexo V com DAS de R$1.860,00.** A guia real foi **R$720,00**. Causa: com receita de 12 meses igual a zero o `fatorR` devolvia `null` e eu caia no **"V por precaucao"**. Mas **receita zero COM folha e razao infinita**, logo ≥28%, logo Anexo III — e a conta real confirma. *"Na duvida cobre mais"* e o oposto de cuidado: **dobrava o imposto do cliente**.

**(2) `aliquotaEfetiva` lancava erro com RBT12 zero.** Mas RBT12 zero e caso real — e o **3o mes da persona zero**. A resposta existe: cai na 1a faixa, que nao tem parcela a deduzir, logo a efetiva E a nominal. Confirmado: fev/2026 pagou 12.000 × 6% = R$720,00.

## A folga virou dinheiro do mes

Com menos de 13 meses, numerador e denominador estao anualizados — e uma folga anualizada de R$5.692 e numero que o cliente nao usa. Ele decide quanto tirar **por mes**. A tela diz **R$474,36**, sem citar "Fator R", "Anexo III" nem "RBT12" (travado no `_mapa-de-cruzamentos`).

## Estado

**9 conferencias.** O extrato fecha com o PGDAS-D competencia a competencia: fev/mar/abr R$720,00 e ago R$474,59, total R$2.634,59.

⚠️ **Fechado como MODELO, nao como produto.** Nasceu agnostico de cliente de proposito — o Next.js e prototipo e o Flutter e o produto real. Plugar e decisao aberta.

Relacionado: [[legalize-motor-fiscal-apurador-existe]] · [[legalize-dois-motores-fiscais-duplicados]] · [[legalize-uso-real-corrige-o-mapa]]
