---
name: legalize-motor-fiscal-arredonda-por-tributo
description: "13/09 - o DAS e soma de 6 parcelas arredondadas, o Fator R e regime de CAIXA, e empresa nova anualiza a FOLHA junto com a receita"
metadata: 
  node_type: memory
  type: project
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-13T18:36:53.982Z
---

Quatro regras do motor fiscal, todas confirmadas em 13/09 contra documento oficial e conta real.

**1. O DAS e a SOMA DE SEIS PARCELAS ARREDONDADAS, nao o arredondamento do produto.**
`7.910 × 6% = 474,60`, mas o recibo do PGDAS-D da Receita traz **R$ 474,59**. A conta bate ao centavo repartindo por tributo e arredondando cada um (Anexo III faixa 1: IRPJ 18,98 · CSLL 16,61 · COFINS 60,84 · PIS 13,19 · CPP 205,98 · ISS 158,99). Isso resolve o **5,99987%** que estava pendurado como misterio desde 12/09 — nao era proporcionalizacao de RBT12, era arredondamento. Quem calcula `receita × aliquota` erra centavo em toda guia, e guia diferente do PGDAS e divergencia com a Receita.

**2. O Fator R e REGIME DE CAIXA.** Pro-labore declarado no eSocial e nao pago NAO conta (Res. CGSN 140/2018 art. 26 §6o · SC COSIT 17/2021 e 251/2024). Preco: glosa, reclassificacao **de oficio** pro Anexo V, recalculo de todas as competencias, Selic e **multa de 75%** (Lei 9.430/96 art. 44 I). Requisito: so alimentar o Fator R **depois da baixa do titulo**, nunca no fechamento da folha. Exige um estado "declarado mas nao pago" que nao existe em tela nossa.

**3. Empresa com menos de 13 meses anualiza a FOLHA junto com a receita** (Res. CGSN 140/2018 art. 26 §4o). `FS12 = media da folha anterior × 12`, espelho exato da receita. Somar folha crua contra receita anualizada joga o cliente recem-aberto no Anexo V sem merecer — e recem-aberto e a MAIORIA nossa, porque o produto nasce da constituicao. Provado na empresa do Pedro: anualizado 29,6% (Anexo III, 6%), cru 22,2% (Anexo V, 15,5%).

**4. A CPP dentro do DAS CONTA no numerador do Fator R**, e e pacifico (SC COSIT 17/2021). Metodo: % de reparticao da CPP no anexo × DAS pago. Efeito colateral: como essa parcela e proporcional a receita, ela entra no numerador E no denominador e amortece o proprio Fator R.

⚠️ **Piso e teto 2026:** salario minimo R$ 1.621,00 · teto INSS R$ 8.475,55 (Portaria Interministerial MPS/MF 13/2026). O `valorMaximoInss: 932.3105` do lider e 11% × 8.475,55 exato — guardar com 4 casas, arredondar so na exibicao.

🔴 **`anexoEscolhido: 5` no payload do lider NAO e o Anexo V** — e id interno. Eu afirmei errado em 12/09 e propaguei pra persona. A empresa do Pedro esta no **Anexo III, 6%**, confirmado pelo recibo da Receita, pelo texto da Lei 12.741 na nota e pela aritmetica do ISS (6% × 33,5% = 2,01%).

Evidencia: `produto/evidencias/2026-09-13-teardown-prolabore-e-pgdas-conta-real.md`
Relacionado: [[legalize-trava-persona-produto]] · [[legalize-uso-real-corrige-o-mapa]] · [[legalize-anexos-simples-etiquetas]]
