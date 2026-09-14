---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, dre, diario, razao, balancete, api, lucro, sensivel]
---

# 📒 DRE · Balancete · Razão · Diário — as 4 categorias restantes

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** aba *Relatórios* da conta logada, 14/09/2026, varredura pelos endpoints. Fecha os **7 relatórios** junto com [[2026-09-14-balanco-patrimonial-serie-mensal]].

🔑 **Método que mudou no meio:** as 4 categorias foram varridas **de uma vez**, direto pelas rotas, e o relatório foi validado pelo Pedro **antes** de virar documentação. As três dúvidas que sobraram foram respondidas por ele na hora (NF 4, salário mínimo) — o que só aconteceu porque a leitura foi apresentada crua, em tabela, em vez de já registrada.

---

## 1 · 🔌 As rotas

```
GET /api/plataforma/relatorios-ms/gerardre/{ano}/{mes}
GET /api/plataforma/relatorios-ms/gerar-balancete/{ano}/{mes}     ← com hífen
GET /api/plataforma/relatorios-ms/gerarrazaotipoa/{ano}/{mes}
GET /api/plataforma/relatorios-ms/list/{ano}/{mes}                ← o Diário
```

⚠️ **Todas devolvem ACUMULADO do exercício até o mês pedido**, não o mês isolado. Medido: `list/2025/12` = 7 lançamentos (12/12 a 31/12) · `list/2026/3` = 17 (01/01 a 31/03) · `list/2026/8` = 55. 🔨 **Contrato da nossa API:** um relatório contábil pedido "de agosto" devolve janeiro-a-agosto. Se o nosso devolver só agosto, o número não fecha com o do contador.

🐛 **Bug de produção deles:** `carregarListaRazao` monta `GET /api/plataforma/relatorios-ms/**undefined**/2026/8` — variável não resolvida virou segmento de URL. Essa lista **não foi acessada**.

---

## 2 · 📉 DRE — e o lucro que CAI sem perder venda

Série acumulada:

| Comp. | Receita | (−) Deduções | (−) Pró-labore | (−) Desp. adm. | (−) Multas | **Resultado** |
|---|---:|---:|---:|---:|---:|---:|
| 12/2025 | 0 | 0 | 100,00 | 0 | 0 | **−100,00** |
| 01/2026 | 0 | 0 | 0 | 139,00 | 0 | **−139,00** |
| 02/2026 | 12.000 | 720,00 | 3.260,00 | 278,00 | 0 | **7.742,00** |
| 03/2026 | 24.000 | 1.440,00 | 6.620,00 | 473,00 | 0 | **15.467,00** |
| 04/2026 | 36.000 | 2.160,00 | 9.980,00 | 836,48 | 74,85 | **22.948,67** |
| 05/2026 | 36.000 | 2.160,00 | 11.601,00 | 1.047,38 | 161,31 | **21.030,31** |
| 06/2026 | 36.000 | 2.160,00 | 13.222,00 | 1.258,28 | 229,85 | **19.129,87** |
| 07/2026 | 36.000 | 2.160,00 | 14.843,00 | 1.469,18 | 229,85 | **17.297,97** |
| 08/2026 | 43.910 | 2.634,59 | 16.464,00 | 1.664,18 | 229,85 | **22.917,38** |

### 🔴 O lucro cai 5.650,70 entre abril e julho, e nenhuma venda foi perdida

De **22.948,67** (abr) para **17.297,97** (jul). A receita ficou parada em 36.000 e o **pró-labore no piso continuou acumulando** (1.621/mês), junto com mensalidade e multas.

🔑 **Para o produto isso é um problema de tela, não de conta.** Um painel que mostre "seu lucro" mês a mês vai exibir **queda que o cliente não causou** — e quem não entende contabilidade liga achando que erramos. ⚖️ A decisão é: ou não mostramos lucro acumulado sem explicação, ou mostramos **junto com o porquê** ("seu pró-labore de R$1.621 continua correndo mesmo sem faturamento novo"). ✅ Isso é INFORMAR, e é exatamente o tipo de coisa que o líder não faz.

### ✅ E a 6ª aparição do arredondamento por tributo

Deduções são **exatos 6%** da receita em todas as competências — exceto que em agosto dá **2.634,59** e não 2.634,60. `43.910 × 6% = 2.634,60`. O centavo some pela soma das 6 parcelas arredondadas. Sexta fonte independente do mesmo mecanismo.

### 🧩 Contrato genérico demais

O DTO tem ~40 campos e a maioria vive zerada: `prestacaoServicoExportacao`, `prestacaoServicoRoyalts`, `vendaDeMercadoriasMercadoInterno`, `receitasEquivalenciaPatrimonial`, `receitasSCP`, `receitasCapitalExterior`. 🔑 **É contrato desenhado para regimes que não atendemos.** O nosso pode ser uma fração disso — e é argumento a favor de modelar do nosso escopo para fora, não copiando o deles.

---

## 3 · 📋 Balancete — mesmo contrato do Balanço

Devolve as **mesmas 50 contas**, os mesmos campos, a mesma árvore. A única diferença observável é `saldoAnterior` preenchido (−911 na raiz do Ativo).

🔨 **Decisão de produto:** Balanço e Balancete **não são dois relatórios, são dois modos de exibição do mesmo dado**. Construir duas telas é duplicar trabalho e criar duas fontes de divergência.

🐛 Detalhe de costura: a rota é `gerar-balancete` **com hífen**, enquanto as irmãs são `gerarbalanco`/`gerardre`/`gerarrazaotipoa` sem. Times e épocas diferentes no mesmo microserviço.

---

## 4 · 📗 Razão — 16 contas descrevem a empresa inteira

Devolve só contas **analíticas (tipo A) com movimento**. São 16, e elas dão conta de 9 meses de operação:

| Grupo | Contas |
|---|---|
| **Ativo** | Caixa Geral · Clientes Diversos · Créditos com Pessoas Ligadas — FÍSICAS |
| **Passivo** | Honorários a Pagar · Simples a Recolher · Retenções Federais Unificadas · Outros tributos a recolher · Pró-Labore a Pagar |
| **PL** | Capital Social Realizado no País · (−) Prejuízos Acumulados |
| **Resultado** | Receita da Prestação de Serviços · (−) Simples Nacional · (−) Custo com Pró-labore · Outras Taxas e Contribuições · Serviços Contábeis · (−) Multas e Juros |

🔑 **O plano de contas de um ME de serviço no Simples é PEQUENO.** Dezesseis contas. 🔨 Dá para modelar sem importar plano contábil genérico, e dá para **nomear cada uma em português de gente** na nossa tela — o que é inviável num plano de 500 contas.

---

## 5 · 📖 Diário — 55 lançamentos, o relatório mais revelador

### 5.1 · 🔑🔑 Dezembro inteiro: retirada sem lucro vira EMPRÉSTIMO ao sócio

Os 7 lançamentos do mês da constituição:

| Data | Valor | Débito | Crédito | Histórico |
|---|---:|---|---|---|
| 12/12 | 1.000,00 | Caixa Geral | Capital Realizado | **Capital social** |
| 31/12 | 100,00 | Custo Pró-labore | Pró-Labore a Pagar | VLR Pro-Labore 12/2025 |
| 31/12 | 11,00 | Pró-Labore a Pagar | Retenções Federais | VLR INSS Pro-Labore 12/2025 |
| 31/12 | 89,00 | Pró-Labore a Pagar | Caixa Geral | Pagamento de pró-labore |
| 31/12 | **911,00** | **Créditos com Pessoas Ligadas** | Caixa Geral | 🔑 **"Retirada para sócio"** |
| 31/12 | 100,00 ×2 | — | — | Apuração do resultado |

Sobrou exatamente `1.000 − 89 = **911**`, e o sócio retirou tudo.

🔑🔑 **O líder classificou a retirada como CRÉDITO DA EMPRESA CONTRA O SÓCIO — ou seja, empréstimo — e não como distribuição.** A conta é *Créditos com Pessoas Ligadas — FÍSICAS*, e ela vive no **ativo**. Em **01/01/2026** entra *"Devolução do sócio à empresa - PEDRO MAIA BERG DE OLIVEIRA"* de **R$318,48**, baixando o saldo para **592,52**, onde está parado até hoje.

⚖️ **É a resposta mecânica para a pergunta que está aberta no nosso desenho:** *o que acontece quando sai dinheiro sem lucro apurado?* Resposta do líder: **vira dívida do sócio com a empresa, e fica no balanço até devolver.** Não é bloqueio, não é aviso, não é pergunta ao cliente — é uma reclassificação silenciosa.

🏢 **Etiqueta: decisão deles.** Não é obrigação legal citada em lugar nenhum; é escolha contábil. Mas é uma escolha **defensável e barata**, e resolve o problema sem tutelar ninguém — o oposto da trava do Informe de Rendimentos. 🔴 **Vale considerar copiar esta**, e é decisão do Pedro + Mauro.

### 5.2 · 🔴 A nota fiscal cancelada NÃO deixa rastro na contabilidade

As notas que aparecem no Diário:

| Nº | Data | Valor | Tomador |
|---|---|---:|---|
| 1 | 27/02 | 12.000 | MCP DIGITAL LTDA. |
| 2 | 31/03 | 12.000 | ACCELLERA HUB DE CRESCIMENTO LTDA. |
| 3 | 27/04 | 12.000 | ACCELLERA HUB DE CRESCIMENTO LTDA. |
| **4** | — | — | 🔴 **ausente** |
| 5 | 11/08 | 7.910 | LEGALIZE DIGITAL LTDA |

**A nota 4 existe.** Confirmado pelo Pedro, na tela *Consultar notas fiscais*:

> Emitida **03/06/2026 06:19:59** · Núm **4** · **ACCELLERA HUB DE CRESCIMENTO LTDA** (57.413.251/0001-15) · **R$ 12.000,00** · situação **`cancelada`** · **Anexo: 5**
> Descrição: *"CEO da empresa com responsabilidades gerais de gestão e escalabilidade da empresa."*
> Código: `NFS31062002264037271000102000000000000426065746878879`

🔴 **E ela não deixou UM ÚNICO lançamento no Diário.** Nem o registro original, nem o estorno. Busquei nos 55 lançamentos por *"No.: 4"*, *"cancel"* e *"estorn"*: nada.

🔑 **Três consequências:**
1. **Explica a receita travada em 36.000** de abril a julho. Eu tinha lido isso como "o cliente parou de faturar". **Era uma nota emitida e cancelada.** ⚠️ Foi a leitura errada que o dado sozinho não corrigiria — corrigiu porque o Pedro olhou.
2. 🔨 **O Diário não é fonte completa do que aconteceu com as notas.** Quem quiser reconstituir o histórico fiscal precisa da lista de NFS-e **também** — são duas fontes, e só uma delas sabe de cancelamento.
3. ⚖️ **Decisão nossa:** cancelamento deve deixar rastro contábil? O líder diz não. Mas um cliente que pergunte *"cadê a nota 4?"* não tem resposta no relatório que ele baixa.

🕓 **E uma observação que não fecho aqui:** a nota diz **"Anexo: 5"** e ao mesmo tempo declara *"o percentual total de impostos é de aproximadamente **6,00%**"* (Lei 12.741/2012). Os 6% são alíquota de **Anexo III**. A leitura provável é que o rótulo mostra o **anexo de origem do CNAE** e o percentual mostra o **efetivo depois do Fator R** — mas **não confirmei**, e as duas informações aparecem lado a lado na mesma linha sem distinção. 🔨 Se for isso, é exatamente o tipo de ambiguidade que a nossa tela precisa resolver com uma palavra.

### 5.3 · 🔴 As multas, com competência e guia nomeadas

| Pago em | Competência | DARF | SIMPLES | Atraso aprox. |
|---|---|---:|---:|---|
| 02/04 | **02/2026** | 24,88 | 49,97 | ~13 dias |
| 11/05 | **03/2026** | 31,74 | 54,72 | ~21 dias |
| 03/06 | **04/2026** | 28,08 | 40,46 | ~14 dias |
| | **Total** | | **229,85** | |

🔑 **Três competências seguidas, com as DUAS guias atrasadas todas as vezes.** Não é esquecimento pontual: é padrão de três meses. E todos os seis lançamentos vêm marcados **"(Confirmado via Plataforma)"** — pagos fora do sistema e confirmados à mão, exatamente o buraco de conciliação já mapeado ([[legalize-portal-lista-consolidada]]).

🔨 **É o caso de uso mais forte que temos para o lembrete de vencimento**, e ele tem número: **R$229,85 em três meses**, numa empresa de uma nota por mês, com contador contratado. ⚠️ E nenhuma tela do painel mostra esse total — só o livro.

### 5.4 · A mecânica do pró-labore, lançamento a lançamento

Todo mês, três lançamentos:

```
VLR Pro-Labore MM/AAAA   →  D: (-) Custo com Pró-labore     C: Pró-Labore a Pagar
VLR INSS Pro-Labore      →  D: Pró-Labore a Pagar           C: Retenções Federais
(pagamento)              →  D: Pró-Labore a Pagar           C: Caixa Geral
```

INSS bate **11,00% exato** em todos: `3.360 → 369,60` · `1.621 → 178,31`.

🔴 **E em 2026 inteiro não existe o terceiro lançamento.** Nenhum pagamento de pró-labore foi registrado; só dezembro/2025 teve (os R$89). É a mesma ausência de extrato de [[2026-09-14-balanco-patrimonial-serie-mensal]] §2, agora vista lançamento a lançamento.

✅ **R$1.621,00 é o salário mínimo**, confirmado pelo Pedro — e o motor usa como piso e como ajuste de pró-labore. Deixa de ser número medido e vira regra com nome.

---

## 6 · ❌ O que estas 4 categorias NÃO provam

| Não prova | Por quê |
|---|---|
| que o cliente parou de faturar entre abr e jul | a nota 4 foi emitida e **cancelada**; o Diário não mostra nenhuma das duas coisas |
| que o sócio não recebeu pró-labore em 2026 | os livros não registram o pagamento; não há extrato |
| que a empresa deve R$592,52 ao sócio, ou o contrário | é saldo de conta-corrente de sócio, parado desde janeiro; não sei a intenção por trás |
| quem atrasou as guias | sei a competência e o valor da multa, não a causa nem o responsável |
| que "Anexo: 5" na nota está errado | as duas informações convivem; a leitura de anexo-de-origem × efetivo é **hipótese não confirmada** |
| o que há em `BALANCETE_PERIODO` e `LIST` | tipos existentes no código, fora do menu, **não explorados** |

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-14-balanco-patrimonial-serie-mensal]] · [[2026-09-14-api-relatorios-endpoints]] · [[legalize-motor-fiscal-arredonda-por-tributo]] · [[HOME]]
