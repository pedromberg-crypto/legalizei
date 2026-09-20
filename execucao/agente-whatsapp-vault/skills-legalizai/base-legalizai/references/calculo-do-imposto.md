---
assunto: calculo-do-imposto
momento: [explicar, ofertar]
status: vivo
data: 2026-09-20
papel: "Como o DAS se forma, a alíquota efetiva, e as guias do sócio"
tags: [agente, leo, rag, calculo, das, pro-labore, critico]
---

# COMO O IMPOSTO É CALCULADO (E QUEM FAZ A CONTA)

Tudo aqui foi conferido contra guia real da Receita e validado por contador especializado em 16/09/2026.

🔴 **Isto não é pra você recitar pro cliente.** É pra você **não dar explicação errada** e saber **o que o sistema faz sozinho**. Pro cliente, a mensagem continua curta.

🔴 **Você não dá valor de imposto do caso da pessoa.** Você explica como funciona e diz que o sistema calcula. Valor do caso específico é do app ou do contador com CRC.

## 1. O DAS não é "faturamento vezes alíquota"

* O DAS é a **soma de seis tributos** (IRPJ, CSLL, COFINS, PIS, CPP e ISS), cada um **arredondado separadamente**. Fazer "faturamento vezes 6%" erra centavo em toda guia.
* **Prova real, de uma empresa conferida:** R$ 7.910 vezes 6% daria R$ 474,60, e a guia da Receita saiu **R$ 474,59**.
* Você **pode** usar 6% e 15,5% como **ordem de grandeza** ([[anexos-e-fator-r]] §1), dizendo que é aproximado. Você **não pode** apresentar isso como o cálculo.

Fala de referência, o meio-termo certo:

> "Na faixa inicial, serviço no Anexo III paga por volta de 6% e no Anexo V por volta de 15,5%. A conta exata tem seis tributos dentro e muda conforme o acumulado do ano, mas isso é problema meu, não seu: eu calculo e te entrego a guia certa, no centavo."

## 2. A alíquota sobe conforme a empresa fatura

A alíquota é calculada sobre o **faturamento acumulado dos últimos 12 meses** (o nome técnico é RBT12), e a fórmula é da lei.

Pro ME que a gente atende, só existem **duas faixas**:

| Faixa | Acumulado em 12 meses | Anexo III | Anexo V |
|---|---|---|---|
| 1ª | até R$ 180 mil | 6,00% | 15,50% |
| 2ª | de R$ 180 mil a R$ 360 mil | sobe a partir de 6% | sobe a partir de 15,5% |

* 🔴 **Nunca diga "6% fixo".** Diga que **começa em 6%** e sobe conforme a empresa cresce, e que o sistema recalcula sozinho todo mês.
* Acima da 2ª faixa é EPP, fora do escopo. Os valores dos dois tetos estão em [[tetos-de-faturamento]].

## 3. O pró-labore e as guias do sócio

| | |
|---|---|
| **Piso** | o salário mínimo **do mês de competência** (R$ 1.621 em 2026, R$ 1.518 em 2025) |
| **INSS** | 11% sobre o pró-labore, limitado ao teto de **R$ 8.475,55** (INSS máximo de R$ 932,31 por mês) |
| 🔴 **O teto é da PESSOA** | quem já tem carteira assinada em outra empresa consome parte do teto, e o INSS do pró-labore cai. É por isso que o app pergunta o vínculo ([[dossie-campos]] §7) |
| **IRRF** | tabela progressiva **por sócio**. Você **não cita valor nem faixa de IRRF**: o cálculo é do sistema e aparece no app |
| 🔴 **A guia é POR SÓCIO** | em empresa com 2 ou mais sócios, **nunca** se soma a folha pra calcular como se fosse uma pessoa só. O teto é individual e a tabela do IR é progressiva por beneficiário |

Você explica **como funciona** e que **o sistema calcula**. Valor do caso da pessoa, não.

## 4. O gancho de venda que nasce disso

Quando o assunto for cálculo, conecte com quem faz:

> "Quem faz essa conta aqui sou eu, e eu bato no centavo. A gente conferiu contra a guia real da Receita e o valor fechou exato."

* Isso é **verdade verificável** e pode ser dito: foram 46 conferências contra documento emitido e 162 meses de empresa simulados, sem falha.
* ✅ **Estimativa é permitida, valor fechado não.** Sobre o faturamento que a pessoa te deu, faça a conta e diga o número como **aproximação** ("uns 600", "por volta de 600"), sempre acompanhado do que sobra ("aproximadamente 9.400 no bolso"). O proibido é apresentar como valor **fechado, definitivo ou oficial** do caso dela: isso sai do cálculo do mês, com a nota real.
* 🔴 Imposto de guia **já emitida**, cobrança errada ou multa **nunca** é estimativa sua: é escalação ([[escalacao]]).
* Você conversa em nome do app: "eu calculo", "eu emito a guia". O limite é o canal: **pelo WhatsApp você não envia guia nem boleto**, ela aparece no app.

## 5. Prazos

Estão em [[rotina-mensal]] §5. Você cita o dia do vencimento, **não calcula a data exata de um caso**, porque o app mostra.
