---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, balanco, contabilidade, api, prolabore, sensivel]
---

# 📊 Balanço Patrimonial — a série mensal, conta a conta

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** aba *Relatórios → Balanço*, conta logada, 14/09/2026. As **9 competências** (12/2025 a 08/2026) lidas pelo endpoint, conta a conta, **50 contas por competência**. Leitura integral, sem amostra.

🔑 **Este é o relatório mais rico do estudo até aqui.** As declarações diziam *quanto de imposto*. O balanço diz **como a contabilidade do líder enxerga a empresa por dentro** — e revela três coisas que nenhuma tela mostra.

---

## 1 · 🔌 A camada técnica

### Endpoint

```
GET /api/plataforma/relatorios-ms/gerarbalanco/{ano}/{mes}
GET /api/plataforma/relatorios-ms/gerardre/{ano}/{mes}
```

`relatorios-**ms**` = microserviço próprio, separado do resto da plataforma. O verbo é **`gerar`**, não `obter` — e o escopo do Angular carrega `statusPendente: ["PENDENTE","PROCESSANDO","GERANDO_ARQUIVO"]`. ⚠️ **Relatório contábil é geração assíncrona com máquina de estados**, não consulta. Quem desenhar a nossa tela precisa de estado de espera de verdade, não spinner.

### 🐛 Dois contratos no mesmo microserviço

| Rota | Formato |
|---|---|
| `gerarbalanco` | **árvore** de 50 contas (`id`, `idContaPai`, `nivel`, `listaLancamento`) |
| `gerardre` | **DTO plano**, ~40 campos nomeados (`prestacaoServicoMercadoInterno`, `totalDeducoes`…) |

Mesmo serviço, duas modelagens. Razão, Diário e Balancete respondem **404** nesses nomes — usam outras rotas, que ficam para a varredura deles.

### 🔴 O sinal do saldo IGNORA a natureza da conta

Medido nas 5 contas-chave: **`saldoExercicio` é sempre `crédito − débito`**, independentemente de a conta ser DEVEDORA ou CREDORA.

| Conta | Natureza | D | C | `saldoExercicio` |
|---|---|---:|---:|---:|
| Caixa Geral | DEVEDORA | 318,48 | 5.331,31 | **5.012,83** |
| Clientes Diversos | DEVEDORA | 43.910,00 | 0 | **−43.910,00** |
| Pró-Labore a Pagar | CREDORA | 1.811,04 | 16.464,00 | **14.652,96** |

⚠️ **Consequência prática:** um "Caixa Geral" com saldo **positivo** no payload é caixa **negativo** na contabilidade. Quem consumir esse campo sem inverter pelo `natureza` mostra o sinal trocado em metade das contas do ativo. 🔨 Na nossa API isso é decisão a tomar de propósito: ou o campo já vem na convenção contábil, ou o nome dele diz que é `creditoMenosDebito`.

### 📡 Stack: AngularJS **1.4.8**

O app `/sistema/` (onde vivem os 5 relatórios) roda **AngularJS 1.4.8** — versão de 2015, framework sem suporte desde 2022. O `/painel-de-controle/` é Vue. 🔑 **São duas aplicações de gerações diferentes** costuradas pelo mesmo menu, e a contábil é a velha. Também apareceu `POST /api/{hash}/engage/?verbose=1&ip=1` — **Mixpanel proxiado pelo domínio próprio** (o escopo tem `trackMixpanel`), padrão para escapar de bloqueador de anúncio.

### 🐛 A lupa precisa de DOIS cliques

🔴 Defeito relatado pelo Pedro e **confirmado aqui por instrumentação**: escolhido mês e ano, **um clique na lupa não pesquisa**. Eu cliquei uma vez por coordenada e o interceptador de rede registrou **zero requisições**; a chamada só saiu quando invoquei `changeCompetencia()` direto no escopo do Angular.

🔑 **Por que importa mais do que parece:** o botão é `navCompetenciaLoading({mes, ano}, 0, changeCompetencia)` — ele lê `mesCompetencia`/`anoCompetencia` do escopo, e o `ng-model` do `<select>` só propaga no ciclo seguinte. O primeiro clique gasta-se sincronizando o modelo; o segundo é que busca. ⚠️ **É sintoma da stack velha** (AngularJS 1.4.8, abaixo), não descuido isolado — e o cliente que clica uma vez conclui que **não existe balanço naquele mês**.

✅ **Lição de método para a varredura:** varrer pela API em vez de pela UI **contorna o defeito da UI**, mas também o **esconde**. Os dois olhares são necessários: o endpoint dá o dado certo, a tela dá o que o cliente vive.

### 🔍 Sete tipos de relatório, cinco no menu

`ltTipo = ["RAZAO","DIARIO","BALANCETE","BALANCETE_PERIODO","BALANCO","DRE","LIST"]`

**`BALANCETE_PERIODO`** e **`LIST`** existem no código e não estão na navegação. O seletor de ano vai de **2010 a 2029**, fixo no código.

---

## 2 · 🔑🔑 O ACHADO CENTRAL: a contabilidade não vê dinheiro

Três contas contam a mesma história:

| Conta | 08/2026 | O que significa |
|---|---:|---|
| **Clientes Diversos** (a receber) | **−43.910,00** | 🔴 **nenhuma nota foi baixada como recebida** |
| **Pró-Labore a Pagar** | **+14.652,96** | 🔴 **quase nada foi baixado como pago** |
| **Caixa Geral** | **negativo em 5.012,83** | consequência das duas de cima |

A receita de 2026 inteira (R$43.910) está registrada como **direito a receber**, e o pró-labore de 2026 inteiro está registrado como **obrigação a pagar**. Nos livros, o cliente nunca pagou a empresa e a empresa nunca pagou o sócio.

🔑 **A causa é a ausência de extrato bancário.** Sem conciliação, o sistema lança o fato gerador (a nota, a folha) e **nunca encontra a contrapartida**. O caixa fica negativo porque saem os pagamentos que o próprio sistema conhece (impostos, honorários) e não entram os que ele não vê.

🔴 **Isto responde a P2.3**, aberta desde 13/09 (*"como o lucro entra nos cálculos sem extrato"*). A resposta é: **não entra**. O balanço é competência pura, sem lastro de caixa. Por isso `recuperardadosdistribuicaocliente` devolvia `saldo: 0` e `totalDistribuido: 0` — o lucro contábil existe (**R$22.917,38** em 2026 pela DRE), mas não há caixa apurado que o suporte.

⚖️ **Para o nosso produto isso é decisão de arquitetura, não detalhe:** ou temos conciliação bancária (e o balanço vale), ou não temos (e ele é peça formal que não deve ser apresentada como retrato financeiro). 🔴 **O caminho perigoso é o do meio:** exibir "Caixa" e "Lucro disponível" calculados só por competência, como se fossem dinheiro. É exatamente o que produz um cliente sacando lucro que não existe.

---

## 3 · 🔑 O MOTOR DE PRÓ-LABORE, AGORA COM O PISO MEDIDO

Custo acumulado de pró-labore, por competência:

| Comp. | Acumulado | **Δ do mês** | Receita acum. |
|---|---:|---:|---:|
| 12/2025 | 100,00 | 100,00 | 0 |
| 01/2026 | 0 | — | 0 |
| 02/2026 | 3.260,00 | **3.260,00** | 12.000 |
| 03/2026 | 6.620,00 | **3.360,00** | 24.000 |
| 04/2026 | 9.980,00 | **3.360,00** | 36.000 |
| 05/2026 | 11.601,00 | **1.621,00** | 36.000 |
| 06/2026 | 13.222,00 | **1.621,00** | 36.000 |
| 07/2026 | 14.843,00 | **1.621,00** | 36.000 |
| 08/2026 | 16.464,00 | **1.621,00** | 43.910 |

✅ **Confirma o motor de 4 regras** ([[legalize-motor-fiscal-arredonda-por-tributo]] e o ADR de 14/09), agora por uma **quarta fonte independente** — os livros contábeis, não o recibo nem a API de Fator R:
1. fev = `28% × 12.000 = 3.360`, **menos os R$100 de dezembro** = 3.260 ✓
2. mar e abr = 3.360 cada, fechando o alvo acumulado ✓
3. mai a ago = **R$1.621,00 fixos** — a receita parou de crescer, o alvo foi atingido, o motor **desceu para o piso** ✓
4. **nunca devolveu** ✓

🔑 **O piso é R$1.621,00.** Antes era "salário mínimo" como conceito; agora é número medido, repetido em 4 competências. 🕓 Bate com a expectativa de salário mínimo de 2026, mas **não confirmei em fonte oficial** — fica como número medido, não como lei citada.

### ✅ E prova que o Fator R atravessa a virada de ano

- Pró-labore **de 2026** (DRE): **16.464,00** → `16.464 ÷ 43.910 = 37,49%`
- Pró-labore **+ os R$100 de dez/2025**: **16.564,00** → `16.564 ÷ 43.910 = **37,72%**`

E `37,72` é exatamente o `percentualFatorR` lido na API em 09/09, por caminho completamente diferente. 🔑 **Os R$100 de dezembro estão dentro do numerador do Fator R e fora da DRE de 2026** — prova aritmética de que a janela do Fator R é de **13 meses cruzando o exercício**, não o ano-calendário. 🔨 Um motor que zere o acumulado em 1º de janeiro erra o Fator R de todo cliente que abriu no fim do ano.

### 💰 E o "a pagar" é o LÍQUIDO

`16.464,00 × 11% = 1.811,04` — exatamente o débito da conta *Pró-Labore a Pagar*, e o saldo remanescente é 14.652,96. 🔑 **A conta guarda o valor líquido do sócio; os 11% de INSS saem para *Retenções Federais Unificadas*.** É o desenho a copiar quando modelarmos pró-labore: bruto no custo, INSS na retenção, líquido na obrigação.

---

## 4 · 🔴 A ESCADA DE PREÇO DO LÍDER, MÊS A MÊS, NOS PRÓPRIOS LIVROS

Conta `3.01.01.08.01.39 — Serviços Contábeis`, o que a Contabilizei cobrou da persona zero:

| Comp. | Acum. | **Mês** | |
|---|---:|---:|---|
| 01/2026 | 139,00 | **139,00** | promoção |
| 02/2026 | 278,00 | **139,00** | promoção (3ª e última parcela) |
| 03/2026 | 473,00 | **195,00** | 🔴 **reversão ao integral** |
| 04/2026 | 668,00 | **195,00** | |
| 05/2026 | 878,90 | **210,90** | ⚠️ +15,90 |
| 06/2026 | 1.089,80 | **210,90** | ⚠️ |
| 07/2026 | 1.300,70 | **210,90** | ⚠️ |
| 08/2026 | 1.495,70 | **195,00** | voltou |

🔑 **A reversão R$139 → R$195 aparece em março, contabilizada.** Não é letra miúda do recibo: é lançamento. O cliente pagou **40% a mais** no 4º mês sem nova negociação, e os livros dele registram isso. ✅ Confirma [[legalize-benchmark-padrao-195]] com prova contábil, e reforça o argumento comercial nosso: **as 3 coortes (R$79 / R$99 / R$139) são preço cheio, não isca**.

❓ **Os R$15,90 extras em mai/jun/jul não têm explicação** nesta fonte. Três meses, valor idêntico, some depois. Fica como pergunta ao Pedro (serviço avulso contratado? reajuste aplicado e revertido?).

🕓 E o **modal de aumento por IGP-DI está embarcado na tela**, invisível agora: *"O valor da sua mensalidade vai mudar: De ___ para ___ a partir do mês de Outubro"*, com botão **"Aceito"**. 🐛 Os dois valores vêm **em branco** — quarto merge tag quebrado que encontro em produção. ⚠️ Não cliquei em "Aceito": é aceite de reajuste, decisão do Pedro.

---

## 5 · 🔴 R$229,85 DE MULTA E JUROS POR IMPOSTO EM ATRASO

Conta `3.01.02.01.02.09 — (-) Multas e Juros sobre impostos em atraso`:

| Comp. | Acum. | Δ |
|---|---:|---:|
| 04/2026 | 74,85 | **74,85** |
| 05/2026 | 161,31 | **86,46** |
| 06/2026 | 229,85 | **68,54** |
| 07-08/2026 | 229,85 | 0 |

🔴 **Entre abril e junho a empresa pagou imposto em atraso três vezes.** Isso nunca apareceu em nenhuma tela do painel, em nenhum e-mail lido, e **nem no `RESOLUCAO_DEBITOS_IMPOSTOS_2025 = NAO_POSSUI_IMPOSTOS_DEVIDOS`** — que fala de 2025 e de débito *em aberto*, não de multa já paga.

🔑 **É o tipo de fato que só o livro conta.** Para o produto, vira funcionalidade nomeada: **"você pagou R$229,85 de multa este ano"** é informação que o cliente quer e que nenhuma tela do líder entrega. ✅ E é INFORMAR, não tutelar — cabe na doutrina.

---

## 6 · 📋 O restante do quadro, 08/2026

| Conta | Valor | Nota |
|---|---:|---|
| Receita de serviços (acum. 2026) | **43.910,00** | |
| (−) Simples Nacional | **2.634,59** | |
| (−) Custo com pró-labore | **16.464,00** | |
| (−) Serviços contábeis | **1.495,70** | §4 |
| (−) Outras taxas (TFE) | **168,48** | bate com o TFE do e-mail de 19/01 |
| (−) Multas e juros | **229,85** | §5 |
| **Resultado líquido do exercício** | **22.917,38** | lucro contábil de 2026 |
| Simples a Recolher (saldo) | **474,59** | ✅ o DAS arredondado por tributo |
| Capital Social Realizado | **1.000,00** | 🔒 nossa decisão de 10k está travada; isto é só o dado real, não divergência a reabrir |
| (−) Prejuízos Acumulados | **−100,00** | 🔑 dezembro fechou com prejuízo de exatamente o pró-labore de R$100 e receita zero |
| Créditos com Pessoas Ligadas — FÍSICAS | **−592,52** | conta-corrente do sócio, parada desde janeiro |

🔑 **`Simples a Recolher` fecha em 474,59** — o mesmo centavo que provamos vir da soma de 6 parcelas arredondadas. Quinta aparição do mesmo número, agora no livro.

---

## 7 · ❌ O que este balanço NÃO prova

| Não prova | Por quê |
|---|---|
| que a empresa está sem caixa | o caixa negativo é **artefato da falta de extrato**, não situação financeira real |
| que o sócio não recebeu pró-labore | os livros não registram o pagamento; o pagamento pode ter ocorrido |
| que o cliente não pagou as notas | idem |
| que a multa de R$229,85 é erro do líder | não sei **quem** atrasou nem **qual** guia |
| que R$1.621 é o salário mínimo legal de 2026 | é o valor **medido** no lançamento; não conferi fonte oficial |

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-14-api-relatorios-endpoints]] · [[2026-09-14-declaracoes-mensais-serie-completa]] · [[legalize-motor-fiscal-arredonda-por-tributo]] · [[legalize-benchmark-padrao-195]] · [[HOME]]
