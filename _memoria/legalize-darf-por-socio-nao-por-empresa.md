---
name: legalize-darf-por-socio-nao-por-empresa
description: 15/09 — o motor somava o pro-labore dos socios e cobrava a guia como se fosse UMA pessoa; erro de R$2.077 numa empresa de 4
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-16T01:51:05.737Z
---

🔴 **O maior erro do dia, e ele estava no motor desde sempre.** `retratoDoMes` chamava `darfDoProLabore(folha somada)` — um teto de INSS e uma tabela progressiva de IRRF para **todos os sócios juntos**.

Achado rodando a **P02** (2 sócias), a pedido do Pedro: *"rode a persona 2 no modelo que validamos e veja se achamos mais alguma coisa"*.

| | motor antes | correto | erro |
|---|---|---|---|
| **P02** · 2 sócias × R$1.621 | R$ 272,31 | R$ 356,62 | −R$ 84,31 |
| **P11** · 4 sócios × R$3.500 | **R$ 3.617,19** | R$ 1.540,00 | **+R$ 2.077,19** |

🔑 **Erra para os dois lados, por razões diferentes:** o **INSS erra para MENOS** porque o teto é **da pessoa** (Lei 8.212/91 art. 28 §5º) — somar dois sócios faz a soma bater num teto que nenhum dos dois atingiu. O **IRRF erra para MAIS, muito**, porque a tabela é progressiva **por beneficiário**: R$14.000 numa pessoa cai em faixa alta que R$3.500 em quatro não alcança.

⚠️ **O Fator R não era afetado** — ele usa a folha **total**, que é o número certo lá. O erro era só na guia. Atingia **7 das 16 vidas** e todo o escopo de 1 a 4 sócios.

🔑 **É a mesma família da suspeita do Pedro sobre "ignorar um montante de vários meses"** — um agregado tratado como valor individual. Só que o eixo é **pessoas**, não meses. Ele estava certo sobre a forma do erro; o eixo é que era outro.

**Conserto:** `darfDaFolha({ socios })` calcula sócio a sócio e soma no fim. `sociosComProLabore` na identidade. ⚠️ Premissa declarada: **rateio igual**, que é o que o app coleta hoje — e que **não é neutro** (R$14 mil em 7+7 e em 11+3 dão IRRF diferente).

## 🔴 E o invariante da P09 passava PORQUE encodava o bug

O teste afirmava *"o INSS do P09 é ZERO — o CLT de R$9.000 já passou do teto"* e passava **verde**. Só passava porque o motor tratava os dois sócios como uma pessoa e aplicava o CLT de um deles à soma. O correto: o sócio **com** CLT não recolhe; o **outro** recolhe. Zerar a guia inteira **isentava quem não tinha direito**.

**Confirmado por pesquisa** (15/09, norma primária, confiança ALTA) e levado ao contador como item **70** de `PENDENCIAS`.

**Why:** é o erro mais caro que o motor já teve, e ficou invisível porque `darfDoProLabore` era chamado todo dia — **nunca com mais de um sócio de verdade**.

**How to apply:** código sem vida é código sem prova. A régua do `_cobertura-das-vidas` nasceu disso: *"existe código que nenhuma vida faz rodar?"*.

Relacionado: [[legalize-achados-do-motor-por-persona]] · [[legalize-travas-de-metodo-15-09]] · [[legalize-piloto-pro-labore-automatico]].
