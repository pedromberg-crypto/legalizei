---
name: legalize-motor-fiscal-apurador-existe
description: "14/09 - nasce execucao/motor-fiscal/, o apurador que bate com a Receita ao centavo; e as 3 lacunas fecharam por fonte primaria."
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-15T01:08:44.961Z
---

`execucao/motor-fiscal/` — **apurador**, coisa diferente do `app/src/lib/fiscal.ts`, que e **estimador de abertura**. Estimador diz quanto alguem provavelmente vai pagar antes de abrir; apurador diz quanto quem ja opera deve NESTE mes. Nao se substituem.

3 arquivos: `_tabelas.mjs` (dado puro — 6 faixas de III e V + a REPARTICAO por tributo por faixa), `apurador.mjs` (motor), `verificar-apurador.mjs` (teste dourado). **18 conferencias passam.**

🔴 **A regra que funda:** `7.910 × 6% = 474,60` e a guia real da Receita e **R$ 474,59**. O DAS e **soma de 6 parcelas arredondadas por tributo**, nao arredondamento do produto. Tudo anda em **centavos inteiros** porque em JS `7910 * 0.06` devolve `474.59999999999997`.

## As 3 lacunas, fechadas em 14/09 por fonte primaria

**L1 · RBT12 de empresa nova** (Res. CGSN 140/2018 art. 24): 1º mes = receita do proprio mes ×12 · 2º ao 12º = media dos meses **ANTERIORES** ×12 · 13º+ = soma dos 12. O mes corrente nao entra nem no numerador nem no divisor. 🔴 **Mes com receita ZERO entra como zero E conta no divisor** — excluir infla a media e faz pagar a maior ("erro material sistemico"); na persona zero, tirar os 3 zerados daria RBT12 **167% maior**. 🔴 **O marco e a data de ABERTURA no CNPJ** (art. 2º V), nao a assinatura nem a Junta — responde os itens 44/45/46 do PENDENCIAS. A folha anualiza pelo mesmo criterio (art. 26 §4º).

**L2 · ISS retido**: e **SEGREGACAO, nao compensacao** (LC 123 art. 21 §4º). 🎯 **E a resposta DIMINUIU o escopo:** para as nossas atividades (consultoria, publicidade, TI, design, ensino, traducao) o ISS e devido no **local do estabelecimento prestador** (LC 116 art. 3º) — elas nao estao nas 25 excecoes. Tomador de outro municipio reter e ato *"eivado de nulidade"*. So precisa tratar tomador **dentro de BH** pelos arts. 20/21/24 da Lei Municipal 8.725/2003, e o **art. 24 pega agencia de publicidade**, categoria nossa. ⚠️ A lista de substitutos e **parafrase**, nao texto legal — ler a lei antes de virar tela.

**L3 · Sublimite**: `nao se aplica ao porte ME` (R$3,6mi × teto de R$360k). Fechada **sem virar codigo**. ⚠️ Mas corrigi uma suposicao minha: sublimite **nao e so ICMS**, atinge ISS de servico — so nao nos atinge enquanto ME.

## 🔑 A licao de metodo

**A pesquisa de fonte primaria ERROU o DAS e o motor acertou.** Confianca alta, citacao literal, e mesmo assim calculou 474,60. Porque **a lei nao fala de arredondamento; so o recibo fala**. Regua do teste dourado: expectativa vem de **documento emitido**, nunca de calculo derivado da norma. Reforca [[legalize-uso-real-corrige-o-mapa]].

⚠️ Consequencia: o caso COM retencao (motor diz R$315,60, pesquisa diz R$315,61) **nao tem guia real que confirme**. Fica 🟡 ate aparecer uma.

## Lacunas abertas

**L4** — Res. CGSN 190/2026 mudaria "data de abertura" para "data de inscricao" no CNPJ a partir de 01/01/2027. **Citada de site secundario**; conferir no Diario Oficial. **L5** — LC 214/2025 (CBS e IBS no Simples), sem data e sem numero.

Relacionado: [[legalize-motor-fiscal-arredonda-por-tributo]] · [[legalize-trava-persona-produto]]
