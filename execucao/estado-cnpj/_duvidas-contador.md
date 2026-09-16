---
tipo: derivado
status: vivo
data: 2026-09-15
assunto: briefing-para-a-conversa-com-o-contador
autoridade: derivado
tags: [execucao, motor-fiscal, briefing, mauro, larissa]
---

# 🧑‍🏫 Briefing da conversa com o contador

> 🔴 **ESTE DOC NÃO É FILA.** A fila de quem-resolve-o-quê é **[[PENDENCIAS]]**, alimentada por **[[fila-validacao-humana]]**. Aqui ficam os **parágrafos de contexto** que a fila não carrega — para o Pedro não sentar com pergunta solta. O **status e o número** de cada item vivem lá.
>
> 🧭 **Como o Pedro usa:** vai batendo pergunta por pergunta. Cada item traz **o caso concreto**, **onde a dúvida apareceu**, **por que apareceu** e **a pergunta**.
>
> 📐 **A separação (pedido do Pedro, 15/09):** o **Bloco A** vale para o cliente travado inteiro — resposta muda o produto para todo mundo. O **Bloco B** nasceu de uma persona específica, e pode ser que a resposta só afete aquele caso.

## 📌 Antes de começar — o que JÁ foi respondido por pesquisa

Três rodadas de pesquisa em fonte primária fecharam parte do que estava aqui. **Não perguntar de novo:**

| Já respondido | Onde |
|---|---|
| Sócio com **emprego CLT** não impede nada no Simples — só ajusta o teto do INSS | varredura de LC 123 arts. 3º, 15, 17, 30, 31 e Res. CGSN 140/2018: *"total inexistência de comando jurídico"* |
| **DEFIS**: sem multa por atraso, mas **bloqueia o PGDAS-D** a partir de março do ano seguinte | Manual do PGDAS-D e DEFIS 2018 v4 |
| **DEFIS morre em 01/01/2027**, absorvida pelo PGDAS-D | Res. CGSN nº 190, de 04/08/2026 |
| Empresa aberta em dezembro declara o **ano-calendário inteiro** | Res. CGSN 140/2018 art. 2º V + recibo real |
| **Livro Caixa basta** para a DEFIS, salvo se distribuir lucro acima da presunção | Res. CGSN 140/2018 |
| Sócio que **sai** não apaga o pró-labore do Fator R — a folha histórica não muda | LC 123 · pesquisa de elegibilidade |
| Sócio que **entra** afeta o Fator R **já na competência da formalização** | idem |
| Canais: **Integra-SN, Integra-Sicalc, Integra-DCTFWeb, Integra-Sitfis** cobrem tudo; eSocial é SOAP gratuito | Loja SERPRO + Manual do eSocial |

---

## 🗣️ Abertura da conversa, em 30 segundos

*"Construímos um motor que calcula o imposto e a guia do sócio mês a mês, e um piloto que ajusta o pró-labore sozinho para manter a empresa no Anexo III. Para testar, criamos 16 empresas fictícias com histórias completas de faturamento — abrindo em todos os 12 meses do ano, de 1 a 4 sócios, algumas atravessando a virada de ano — e rodamos o motor na vida inteira de cada uma. Foram 156 competências. As perguntas abaixo saíram daí."*

---

# 🅰️ BLOCO A — vale para o cliente travado inteiro

> ME no Simples, Anexo III ou V, serviço, BH, 1 a 4 sócios pessoa física, **sem funcionário**.

## A1 · 🔴 O teto do INSS e a tabela do IRRF são por sócio ou por empresa? `#70`

**O caso.** Empresa com 4 sócios, cada um recebendo R$3.500 de pró-labore. Folha total: R$14.000.

**Onde apareceu.** Rodando uma empresa de teste com 2 sócias. Nosso sistema somava o pró-labore de todos e calculava a guia **como se fosse uma pessoa só**.

**Por que apareceu.** O erro vai para os dois lados e é grande: nesse exemplo o sistema cobrava **R$3.617,19** onde calculamos que o correto seja **R$1.540,00** de INSS. A tabela do IR é progressiva por pessoa, e R$14.000 numa pessoa cai numa faixa que R$3.500 em quatro não alcança. No INSS o erro era ao contrário, para menos, porque o teto também é por pessoa e aplicávamos um teto só para a soma. **Já corrigimos.**

### A conta, linha a linha — as duas do mesmo caso

> 4 sócios × R$3.500 · folha total R$14.000 · sem CLT por fora · competência 2026

| Passo | ❌ Como o sistema fazia (soma como **1 pessoa**) | ✅ Como passou a fazer (**por sócio**) |
|---|---:|---:|
| Base do INSS | R$ 14.000,00, limitada ao teto **R$ 8.475,55** | R$ 3.500,00 (abaixo do teto) |
| **INSS (11%)** | **R$ 932,31** | **R$ 385,00** por sócio |
| Dedução aplicada no IRRF | o próprio INSS, R$ 932,31 | desconto simplificado, **R$ 607,20** *(é o maior dos dois)* |
| Base do IRRF | R$ 13.067,69 | R$ 2.892,80 |
| Faixa da tabela | **27,5%** | 15% |
| Imposto pela tabela | R$ 2.684,88 | R$ 39,76 |
| Redutor do art. 3º-A (Lei 15.270/2025) | R$ 0,00 *(não alcança)* | **− R$ 39,76** *(zera)* |
| **IRRF** | **R$ 2.684,88** | **R$ 0,00** |
| **Total por sócio** | — | **R$ 385,00** |
| 🔴 **TOTAL DA EMPRESA** | **R$ 3.617,19** | **R$ 1.540,00** |

🔑 **Diferença: R$ 2.077,19 por mês**, cobrados a mais de 4 pessoas que juntas não chegariam nem na 2ª faixa da tabela.

**A pergunta:** confirma que o teto do INSS (R$8.475,55) e a tabela do IRRF se aplicam **individualmente a cada sócio**, e que a guia da empresa é a **soma** dessas contas individuais? Existe alguma situação em que se calcula sobre o total?

### ⚠️ E aqui precisamos de um desempate

No INSS nós e a pesquisa que rodamos batemos: **R$1.540,00**. No IRRF, não:

| | Desconto simplificado | Redutor da Lei 15.270/2025 | IRRF por sócio | IRRF da empresa |
|---|---:|---|---:|---:|
| **Nosso motor** | R$ 607,20 | aplicado, zera | **R$ 0,00** | **R$ 0,00** |
| **A pesquisa** | R$ 564,80 | não citado | R$ 46,12 | R$ 184,48 |

O R$564,80 é a dedução de uma tabela **anterior**, e a pesquisa não menciona a Lei 15.270/2025 em nenhum ponto. Achamos que o certo é o nosso, mas **não queremos apostar** num número que sai na guia de todo cliente.

**A pergunta:** qual é o desconto simplificado vigente em 2026, e o redutor do art. 3º-A se aplica ao pró-labore de R$3.500?

## A2 · 🟡 O pró-labore pode ser desigual entre os sócios? `#71`

**O caso.** Empresa com 3 sócios que paga R$6.000 de pró-labore no mês. O nosso sistema assume R$2.000 para cada.

**Onde apareceu.** Ao consertar o erro do A1 — porque o imposto depende de quanto **cada pessoa** recebeu, não do total.

**Por que apareceu.** A divisão igual **não é neutra**: R$14.000 em R$7.000+R$7.000 gera um IRRF; em R$11.000+R$3.000 gera outro, maior. E não temos de onde deduzir o rateio: o app coleta o **percentual de participação**, que governa **lucro**, não pró-labore. Assumimos igual por conveniência de tela, e isso tem preço.

**A pergunta:** com que frequência, na prática, os sócios dividem desigual? Exige formalidade (alteração contratual, ata, registro em folha)? E o risco está em dividir **desigual**, ou em dividir **igual quando o trabalho é desigual**?

## A3 · 🟡 "Administrar" é a mesma coisa que "prestar serviço"? `#72`

**O caso.** Empresa com 3 sócios, 1 administrador e 2 que trabalham sem serem administradores.

**Onde apareceu.** Montando as empresas de teste. Duas delas foram descritas como *"só o titular administra"* e mesmo assim pagavam pró-labore a todos os sócios.

**Por que apareceu.** A Lei 8.212/91 art. 12 V "f" fala em **prestar serviço**. O nosso app, na abertura, pergunta **quem administra** (a qualificação 49 × 22 do DBE). Dá para trabalhar na empresa sem ser administrador — e aí a inferência do app erra. 🔑 **Nossa decisão de produto foi:** o default é **todos os sócios recebem**, e a exceção é declarada. Queremos saber se isso está seguro.

**A pergunta:** para efeito de pró-labore e INSS, o que vale é **administrar** ou **trabalhar**? Se for trabalhar, o nosso app está perguntando a coisa errada e precisa de uma pergunta a mais na constituição.

## A4 · 🔴 Pró-labore de R$100, abaixo do salário mínimo `#21`

**O caso.** Na conta real que analisamos, dezembro/2025 tem pró-labore de **R$100,00**, com INSS de R$11,00. Confirmado por **três fontes independentes**: a DCTFWeb, o Informe de Rendimentos e a aritmética do acumulado.

**Onde apareceu.** Na varredura cronológica da conta real.

**Por que apareceu.** A Lei 8.212/91 art. 28 §3º diz que o salário de contribuição não pode ser inferior ao mínimo. Travamos isso como o **único bloqueio duro** da tela de pró-labore, mas o valor do piso veio de **fonte única** na nossa pesquisa.

### As três fontes que confirmam o mesmo R$100

| Fonte | O que traz | Valor |
|---|---|---:|
| **DCTFWeb** de 12/2025 | base declarada | R$ 100,00 |
| **Informe de Rendimentos** 2025 | *"Total dos rendimentos (inclusive férias)"* | R$ 100,00 |
| idem | *"Contribuição previdenciária oficial"* | R$ 11,00 *(11% exatos)* |
| **Aritmética do acumulado** do Fator R | fecha com os R$100 na série | R$ 100,00 |

⚠️ E o piso legal, para comparação: o salário mínimo de 2026 é **R$ 1.621,00** — o que sairia de INSS seria **R$ 178,31**, e não R$ 11,00.

**A pergunta:** isso é irregular? Existe hipótese em que um valor abaixo do mínimo é aceito? E travar no salário mínimo está correto?

## A5 · 🟡 Quanto tempo uma empresa nova pode ficar sem pró-labore? `#8`

**O caso.** A conta real passou **3 meses sem pagar pró-labore** no início.

**Onde apareceu.** Na reconstituição mês a mês dessa conta.

**Por que apareceu.** Não pagar **trava o numerador do Fator R** (que é regime de caixa), e isso empurra a empresa para o Anexo V 12 meses depois. Nossa decisão de produto foi **forçar pró-labore já na primeira competência**, mas queremos saber se a tese do escritório é outra.

**A pergunta:** qual o risco real de ficar meses sem pró-labore no início, e qual a tese do escritório hoje?

## A6 · 🔴 Transmitir com a qualificação cadastral PENDENTE `#4`

**O caso.** Na conta real, o cadastro do sócio está como `FALTA DADOS`, sem PIS informado — e **9 competências já foram transmitidas assim**.

**Onde apareceu.** Lendo o JSON da plataforma.

**Por que apareceu.** A DCTFWeb é **confissão de dívida irretratável**. Transmitir com cadastro pendente pode ser problema, e o cliente **não sabe** que está assim — só aparece no JSON, nunca na tela.

**A pergunta:** qual o risco concreto? Isso precisa ser regularizado retroativamente, ou basta corrigir daqui pra frente?

## A7 · 🟡 A base do IRRF vem ZERO nas declarações `#5`

**O caso.** Na conta real, o campo `salarioBaseIRRF` vem **zero em todas as competências**, inclusive nas de R$3.360.

**Onde apareceu.** Na leitura dos dados da plataforma.

**Por que apareceu.** Precisamos saber se isso é **base declarada zero** (o que seria errado) ou **base calculada com imposto zero** (o que seria certo, e é o que o nosso motor faz). Se o campo é para ficar preenchido, não podemos copiar o comportamento deles — essa base alimenta o eSocial e a DCTFWeb.

**A pergunta:** esse campo deve trazer a base de cálculo ou pode vir zerado quando não há imposto a reter?

## A8 · 🟡 A ME unipessoal precisa de ata de aprovação anual de contas? `#9`

**O caso.** 7 das nossas 16 empresas de teste têm sócio único.

**Onde apareceu.** Mapeando as obrigações anuais.

**Por que apareceu.** O contrato social da conta real (cláusula nona) diz que o exercício encerra em 31/12 e o administrador **presta contas com inventário, balanço patrimonial e resultado econômico**. Numa empresa de um sócio só, isso vira ato formal ou fica invisível?

**A pergunta:** ME unipessoal precisa de ata registrada de aprovação de contas? Se sim, é obrigação nossa ou do cliente?

## A9 · 🟡 A DEFIS de 2026 sai no formato velho ou no novo? 🆕

**O caso.** A Resolução CGSN nº 190/2026 extingue a DEFIS a partir de **01/01/2027**, passando as informações para dentro do PGDAS-D, entre janeiro e março.

**Onde apareceu.** Na pesquisa de canais de transmissão de 15/09.

**Por que apareceu.** O ano-calendário **2026** é entregue em **março de 2027** — ou seja, depois da norma entrar em vigor, mas sobre fatos anteriores a ela. A própria pesquisa declarou que **não encontrou regra transitória expressa** e marcou como incerto. Isso decide se implementamos um formato ou dois.

**A pergunta:** a DEFIS do ano-calendário 2026 vai pelo sistema antigo ou já pelo PGDAS-D novo? Você já viu alguma orientação do CGSN sobre a transição?

## A10 · 🟡 A carta de responsabilidade é a Resolução CFC 1.590/2020? `#22`

**O caso.** Usamos a Resolução CFC "1.590/2020" como base da carta de responsabilidade do cliente — o documento que transfere a responsabilidade pelo que ele declara.

**Onde apareceu.** Numa pesquisa anterior.

**Por que apareceu.** As próprias referências da pesquisa citam **CFC 987/2003** e **1493/2015**, não a 1.590. Pode ser **citação trocada**, e esse documento sustenta a nossa proteção jurídica inteira sobre lucro declarado.

**A pergunta:** qual é a norma correta da carta de responsabilidade? A 1.590/2020 existe?

## A11 · ⚪ Double-check do calendário 🆕

**O caso.** Travamos os prazos assim, e todo o produto depende deles:

| | dia | desloca | norma |
|---|---|---|---|
| eSocial + DCTFWeb | **15** | antecipa | Manual eSocial · IN RFB 2.005/2021 |
| DARF (INSS + IRRF do sócio) | **20** | **antecipa** | IN RFB 2.005/2021 art. 13 |
| DAS + PGDAS-D | **20** | **prorroga** | Res. CGSN 140/2018 art. 40 §3º |
| DEFIS | **31/03** | prorroga | Res. CGSN 140/2018 art. 72 §1º |

**Por que perguntar.** O DARF **antecipa** e o DAS **prorroga** — no mesmo dia 20, caindo em fim de semana, eles vão para lados opostos. Na competência 08/2026 o DARF venceu 18 e o DAS venceu 21. Se isso estiver invertido, erramos todo mês.

**A pergunta:** confirma os quatro prazos e, principalmente, que o DARF antecipa e o DAS prorroga? E o feriado **municipal** de BH desloca guia federal?

## A12 · 🔴 PEJOTIZAÇÃO — o único risco crítico do nosso perfil 🆕

**O caso.** Um dev, um designer ou um consultor abre a ME para prestar serviço a **um cliente só**, cumprindo horário e recebendo ordens.

**Onde apareceu.** Na pesquisa de elegibilidade ao Simples, de 15/09.

**Por que apareceu.** O art. 3º §4º inciso **XI** da LC 123 veda o Simples quando o sócio guarda com o contratante, **cumulativamente**, relação de *pessoalidade, subordinação e habitualidade*. A pesquisa classificou como **risco CRÍTICO** justamente para TI, design e consultoria — que é o nosso público inteiro. E é a única vedação que a autodeclaração pega mal, porque depende da sinceridade de quem responde.

**A pergunta:** na prática do escritório, com que frequência isso aparece? Como você orienta o cliente que tem um cliente só? E qual o risco real — exclusão do Simples, reclamação trabalhista, ou os dois?

## A13 · 🔴 Não existe consulta prévia por CPF — o gate é 100% autodeclaração 🆕

**O caso.** Antes de cobrar do cliente e abrir a empresa, queremos saber se ele **pode** optar pelo Simples.

**Onde apareceu.** Mesma pesquisa. Ela declarou **ausência normativa**: nenhum serviço, portal ou API do governo permite testar um CPF antes de o CNPJ existir.

**Por que apareceu.** Se passar batido, a empresa nasce, a opção é **indeferida**, e ela começa a vida no **Lucro Presumido** — que para uma ME de serviço é fatal. E o estouro de faturamento global muitas vezes **só aparece meses depois**, gerando exclusão retroativa.

**A pergunta:** você tem algum caminho prático de checagem prévia que a gente não conheça? E quando o indeferimento acontece, qual o prazo e o rito para recorrer? O recurso suspende a cobrança pelo Lucro Presumido enquanto corre?

## A14 · 🟡 Servidor público e MEI ativo 🆕

**O caso.** Dois perfis que aparecem no funil e que hoje passam direto pelo nosso cadastro.

**Onde apareceu.** Mesma pesquisa.

**Por que apareceu.** **Servidor público ativo** pode ser sócio quotista mas **não pode administrar** — o que muda a qualificação 49 × 22 e quem assina pela empresa. E **MEI ativo** não impede abrir a ME, mas **obriga baixa ou desenquadramento** antes, sob pena de exclusão de ofício (Res. CGSN 140/2018 art. 115 §2º IV).

**A pergunta:** confirma os dois? No caso do MEI, a baixa precisa ser **antes** da abertura ou dá para fazer depois, dentro de algum prazo? E servidor **municipal de BH** segue a mesma regra do federal?

---

# 🅱️ BLOCO B — nasceu de uma persona específica

> Aqui a resposta pode afetar só aquele caso. Cada um traz a empresa fictícia onde apareceu.

## B1 · 🔴 O sócio com CLT acima do teto — e o outro sócio que paga

**O caso — "Lima Eventos", 2 sócios.** Um deles tem emprego CLT de **R$9.000**, acima do teto do INSS (R$8.475,55). Os dois recebem R$1.621 de pró-labore.

**Onde apareceu.** Consertando o erro do A1. Nosso teste afirmava *"o INSS desta empresa é zero, porque o CLT passou do teto"* — e **passava**, porque o motor tratava os dois sócios como uma pessoa só.

**Por que apareceu.** O teto é **da pessoa**. O sócio com CLT não recolhe nada; o **outro** não tem CLT e recolhe normalmente. Zerar a guia inteira isentava quem não tinha direito.

### A conta

> 2 sócios × R$1.621 · folha total R$3.242 · **um deles** tem CLT de R$9.000

| | Folga até o teto | Base do INSS | **INSS** |
|---|---:|---:|---:|
| Sócio **com** CLT de R$9.000 | R$ 0,00 *(o CLT já passou do teto)* | R$ 0,00 | **R$ 0,00** |
| Sócio **sem** CLT | R$ 8.475,55 | R$ 1.621,00 | **R$ 178,31** |
| ❌ Como o motor fazia *(soma os dois e aplica o CLT de um só)* | — | — | **R$ 0,00** |
| ✅ Correto | | | **R$ 178,31** |

🔑 O erro **isentava quem não tinha direito**: o sócio sem CLT deixava de recolher porque o colega dele tinha emprego.

**A pergunta:** confirma que o CLT de um sócio não alivia em nada o INSS do outro? E o sócio com CLT acima do teto realmente não recolhe nada sobre o pró-labore?

## B2 · 🟡 Pró-labore declarado e não pago

**O caso — "Marta, artista plástica", sócia única.** Em 3 competências ela **declarou** o pró-labore e **não pagou**, por caixa apertado.

**Onde apareceu.** Foi desenhado de propósito, para testar a glosa.

**Por que apareceu.** O Fator R é **regime de caixa**: declarado e não pago não conta. Se a Receita cruzar eSocial com PGDAS-D, é glosa, reclassificação de ofício para o Anexo V, recálculo de todas as competências, Selic e multa. Nosso motor separa os dois campos e não conta o não pago.

**A pergunta:** na prática, esse cruzamento acontece? E o que se faz quando o cliente já declarou e não pagou — paga atrasado e conta, ou perdeu a competência?

## B3 · 🟡 Abriu em novembro, e a primeira obrigação anual é em março

**O caso — três empresas abrem em nov/2025, dez/2025 e out/2026.** A conta real abriu em **12/12/2025** e entregou DEFIS do **ano-calendário 2025 inteiro**, transmitida em 08/02/2026.

**Onde apareceu.** No recibo real da DEFIS.

**Por que apareceu.** **19 dias de empresa geram uma obrigação anual completa.** Para quem abre em novembro ou dezembro, a primeira obrigação anual cai poucas semanas depois — e o cliente ainda nem entendeu o que é DAS.

**A pergunta:** confirma que a empresa aberta em dezembro declara o ano-calendário inteiro? E o que exatamente se informa do período anterior à existência dela?

## B4 · 🟡 Onze meses presos no Anexo V depois de corrigir

**O caso — "Bruno, dev".** Fatura R$18.000/mês, se paga o mínimo, cai no Anexo V. Corrige o pró-labore em setembro e **só volta ao Anexo III em agosto do ano seguinte**.

**Onde apareceu.** Simulando a vida dele mês a mês.

**Por que apareceu.** O Fator R olha os **12 meses anteriores** — consertar hoje não conserta hoje. São 11 meses pagando 15,5% já com a folha certa. É por isso que o nosso produto **ajusta o pró-labore desde o mês 1** em vez de avisar depois.

### A linha do tempo

| | Pró-labore | Fator R | Anexo | Alíquota |
|---|---:|---:|---|---:|
| mar–ago/2026 | R$ 1.621 | 9,0% | **V** | 15,5% |
| **set/2026** — ele corrige | **R$ 5.400** | 13,5% | **V** | 15,5% |
| out/2026 – jul/2027 | R$ 5.400 | subindo | **V** | 15,5% |
| **ago/2027** | R$ 5.400 | ≥ 28% | **III** | 6% |

🔑 **Onze meses pagando 15,5% com a folha já certa.** O Fator R lê os 12 meses **anteriores**, então a janela precisa rolar até os meses ruins saírem dela. É por isso que o nosso produto ajusta desde o mês 1 em vez de avisar depois.

**A pergunta:** está certo que não há como acelerar essa volta? Existe algum caminho (retificação, pagamento retroativo) que encurte?

## B5 · 🟡 Guia paga em atraso, três meses seguidos

**O caso — "Lima Eventos".** Três competências pagas com **14, 21 e 14 dias** de atraso, espelhando o que vimos na conta real (que levou **R$229,85 de multa em 3 meses seguidos**).

**Onde apareceu.** Na conta real, e depois reproduzido no teste.

**Por que apareceu.** Nosso motor calcula multa de **0,33% ao dia até o teto de 20%**, mais juros de Selic acumulada **mais 1%** no mês do pagamento. Precisamos confirmar a fórmula e de onde vem a Selic.

### A conta das três competências

| Competência | Venceu | Pagou | Dias | DAS | Multa | Juros | **Total pago** |
|---|---|---|---:|---:|---:|---:|---:|
| 03/2026 | 20/04 | 04/05 | 14 | R$ 1.182,04 | R$ 54,61 *(4,62%)* | R$ 24,70 *(2,09%)* | **R$ 1.261,35** |
| 04/2026 | 20/05 | 10/06 | 21 | R$ 1.528,34 | R$ 105,91 *(6,93%)* | R$ 48,60 *(3,18%)* | **R$ 1.682,85** |
| 05/2026 | **22/06** | 06/07 | 14 | R$ 1.794,22 | R$ 82,89 *(4,62%)* | R$ 76,61 *(4,27%)* | **R$ 1.953,72** |
| | | | | | | **custo do atraso** | **R$ 393,32** |

⚠️ Repare no **22/06**: o dia 20 caiu em sábado e o DAS **prorroga** para o próximo dia útil. É o mesmo dia 20 em que o DARF **antecipa** — ver o item **A11**.

**A pergunta:** a fórmula está certa (0,33% ao dia até 20%, mais Selic acumulada, mais 1% no mês do pagamento)? A Selic é a do período entre vencimento e pagamento? E o 1% entra sempre ou só quando o pagamento sai do mês do vencimento?

## B6 · 🟡 Meses seguidos sem faturar

**O caso — três empresas** têm 5 e 6 meses zerados; a conta real teve 3 seguidos.

**Onde apareceu.** No padrão real de quem presta serviço: fatura em soco, com seca no meio.

**Por que apareceu.** Vimos em produção que **mês sem faturar não pausa a obrigação**: o PGDAS e a DCTFWeb são transmitidos igual. E descobrimos que o eSocial tem "sem movimento" (S-1299 com flag), enviado **só no primeiro mês** — não se repete todo janeiro.

**A pergunta:** confirma que o PGDAS zerado é transmitido igual? E o "sem movimento" do eSocial se aplica mesmo quando a empresa continua pagando pró-labore, ou só quando não há fato gerador nenhum?

## B7 · 🟡 Quatro sócios — o caso extremo do IRRF

**O caso — "Cléber, aluguel de equipamentos", 4 sócios**, 25% cada.

**Onde apareceu.** É a empresa onde o erro do A1 fica mais caro: R$3.617,19 contra R$1.540,00.

**Por que apareceu.** É o teto do nosso escopo (1 a 4 sócios) e o caso onde agregar bases causa o maior estrago.

**A pergunta:** com 4 sócios, existe alguma obrigação acessória extra que não exista com 1 ou 2? Alguma coisa muda na DCTFWeb ou no eSocial?

## B8 · ⚪ A data de admissão do sócio, antes de a empresa existir `#6`

**O caso.** Na conta real, a `dataAdmissao` do sócio é **01/12/2025** — onze dias **antes** de a empresa existir (12/12/2025).

**Onde apareceu.** Lendo o cadastro na plataforma.

**Por que apareceu.** É a data que decide a **competência do primeiro pró-labore**. Se for erro deles, não podemos copiar.

**A pergunta:** é escolha ou erro? Qual data deve constar?

## B9 · ⚪ "Anexo: 5" e 6,00% na mesma linha `#7`

**O caso.** Uma nota da conta real traz o campo `anexoEscolhido: 5` e, no mesmo documento, *"o percentual total de impostos é de aproximadamente 6,00%"*.

**Onde apareceu.** Na leitura da nota fiscal.

**Por que apareceu.** 6% é Anexo **III**. Nós já concluímos que o "5" é **id interno do sistema deles**, não o anexo — e confirmamos por duas vias independentes. Mas é confirmação que vale ter.

**A pergunta:** faz sentido um sistema guardar "anexo 5" para uma empresa tributada a 6%? Existe leitura em que "anexo de origem" e "anexo efetivo pós-Fator R" sejam campos diferentes?

---

---

# 🅲 BLOCO C — o fluxo de obrigações, do dia 1 ao fim do ano

> 🧭 Nasceu de uma releitura das personas no motor em **16/09**, procurando o que mais ele poderia destravar **fora da folha de pagamento**. São perguntas de **operação e obrigação acessória**, não de cálculo.
>
> 🔑 Em cada passo já dizemos **por qual ferramenta** ele sai — Integra Contador (SERPRO), eSocial, Emissor Nacional ou InfoSimples —, então o que falta dele é a **regra**, não o encanamento.

## C1 · 🔴 O alvará e o Corpo de Bombeiros em BH saem sozinhos?

**O caso.** Nas nossas personas a empresa é de serviço, atividade inócua, exercida fora do estabelecimento. Assumimos que em BH o alvará sai automático depois do CNPJ.

**Onde apareceu.** Montando a linha do tempo do dia 1. Fui conferir e **a nossa própria matriz marca o alvará como 🔴 "a mapear" desde 09/07** — nunca foi validado.

**Por que importa.** O que temos de concreto é a conta real: CNPJ em **12/12**, alvará em **15/12**, dispensas só em **02/01**, e a **taxa da Prefeitura (R$168) chegou no dia 40** com 4 dias para pagar. Se for automático, o dia 1 do cliente é uma coisa; se depender de requerimento e vistoria, é outra bem diferente — e a nossa promessa de prazo muda.

**A pergunta:** para ME de serviço inócuo em BH, o **alvará de localização e funcionamento** e a **licença do Corpo de Bombeiros** saem automaticamente com o registro, ou precisam de requerimento? Há vistoria? Em quanto tempo, na sua experiência? E a taxa de R$168 chega sempre nesse prazo?

## C2 · 🟡 A inscrição municipal (CCM) nasce sozinha ou se pede?

**O caso.** A CCM não vem no pacote da constituição: no nosso mapa de dados ela é **"órgão, depois do CNPJ"**, e está marcada como **ninguém combinou quem entrega**.

**Onde apareceu.** No mapa de dependência de dados entre o time do dev e o app interno.

**Por que importa.** Já sabemos que **empresa aberta depois de dez/2025 emite NFS-e sem informar a inscrição** — isso destravou a primeira nota. Mas também sabemos que **inscrição municipal irregular derruba a emissão pela API**. Ou seja: não trava o começo, mas trava depois, e não sabemos quando.

**A pergunta:** a CCM é gerada automaticamente com o CNPJ em BH, ou é requerimento à parte? Em quanto tempo? E o que caracteriza "irregular" a ponto de derrubar a emissão de nota?

## C3 · 🔴 O cliente pode faturar antes das licenças?

**O caso.** A **nossa própria minuta** obriga o cliente a *"não exercer atividade empresarial antes da conclusão do registro da empresa e da obtenção das licenças e alvarás"*.

**Onde apareceu.** Lendo o contrato ao montar a linha do tempo.

**Por que importa.** Se o alvará leva dias e o cliente já tem CNPJ e certificado, ele **consegue** emitir nota — e estaria descumprindo o que assinou com a gente. Isso muda a competência da primeira nota e pode virar problema do cliente.

**A pergunta:** na prática, prestador de serviço em BH pode emitir nota entre o CNPJ e o alvará? A cláusula é proteção jurídica nossa ou regra que o cliente precisa mesmo cumprir? E se ele emitir antes, qual o risco real?

## C4 · 🟡 A primeira competência é cheia ou proporcional?

**O caso.** A **P01** abre em **março** e não fatura nada nos dois primeiros meses. A **P03** abre em **novembro** e já fatura **R$14.000 no mês da abertura** — o motor calcula o acumulado como *receita do próprio mês × 12*, dando R$168.000 logo de cara.

**Onde apareceu.** Rodando as 16 personas: **11 delas abrem sem faturar no mês 1**, e a exceção muda a alíquota.

**Por que importa.** Essa é a regra do art. 24 e nós a implementamos. O que não sabemos é o lado **operacional**: se a empresa abre no dia 20, a competência do mês de abertura é declarada normalmente? E se ela abre e não fatura, ainda assim transmitimos.

**A pergunta:** a competência do mês de abertura é declarada cheia, mesmo que a empresa só exista por 10 dias dele? Há algo de proporcional? *(O cálculo já está fechado; queremos confirmar a operação.)*

## C5 · 🟡 Quem escritura o Livro Caixa, e com que frequência?

**O caso.** A pesquisa confirmou que **o Livro Caixa basta** para o Simples, salvo se distribuir lucro acima da presunção — aí vira escrituração completa.

**Onde apareceu.** Na pesquisa da DEFIS, em 15/09.

**Por que importa.** É obrigação que **ninguém no nosso desenho está fazendo**. Não está em nenhuma das 10 obrigações do nosso ciclo, e não tem tela.

**A pergunta:** o Livro Caixa é obrigação nossa ou do cliente? Se é nossa, com que periodicidade se escritura, e o que ele precisa nos mandar? E a partir de quando a distribuição de lucro obriga a contabilidade completa, na prática?

## C6 · 🟡 Retificação: o que dá para desfazer, e até quando

**O caso.** Uma nota emitida com valor errado, ou a receita de uma competência já apurada que muda.

**Onde apareceu.** É um processo inteiro do nosso board (**P6 · cancelar, corrigir ou substituir nota**), e ele tem **4 perguntas abertas** que não são de tela.

**Por que importa.** 🔑 Já sabemos uma coisa dura: para optante do Simples, **a regra E0061 do leiaute nacional proíbe substituir nota por erro de valor**. Então o caminho é outro, e não sabemos qual.

**A pergunta:** nota com valor errado de empresa do Simples — cancela e emite outra, ou há prazo/limite? E o PGDAS-D já transmitido: retifica-se como, e há custo ou risco? Se o imposto já foi pago a maior, como se recupera?

## C7 · 🟡 Certidões negativas: quando o cliente vai precisar

**O caso.** No nosso catálogo, emitir CND é um serviço. Na conta real, o cliente precisou de **declaração para abrir conta no banco** logo no começo.

**Onde apareceu.** No catálogo de serviços e no estudo da conta real.

**Por que importa.** É o serviço mais pedido nos primeiros 30 dias e não sabemos a periodicidade nem a validade. **Pela API:** federal via InfoSimples (`Emissão de CND`); estadual e municipal seguem sem caminho mapeado.

**A pergunta:** quais certidões o cliente novo precisa nos primeiros meses, quais têm validade curta, e qual é a que mais gera pedido? Vale emitir por antecipação ou só sob demanda?

## C8 · 🔴 Dependentes de IRRF — ninguém coleta

**O caso.** O cálculo do IR do sócio admite dedução por dependente, e **o nosso app não pergunta**. No mapa de dados isso está marcado como *"ninguém produz, não existe em lugar nenhum"*.

**Onde apareceu.** No mapa de dependência, e de novo agora ao revisar o que o motor consome.

**Por que importa.** Hoje calculamos **sem dependentes** para todo mundo — o que cobra a mais de quem tem. ⚠️ E como o redutor de 2026 zera o IR de boa parte das nossas personas, pode ser que não mude nada no nosso escopo. Não sabemos.

**A pergunta:** no perfil dos nossos clientes (pró-labore em torno de 1 a 3 salários mínimos), declarar dependentes muda alguma coisa depois do redutor? Vale coletar, ou é campo que só gera trabalho?

## C9 · 🟡 O domicílio eletrônico, e quem lê por ele

**O caso.** Na conta real achamos uma **intimação não lida** no DTE do cliente.

**Onde apareceu.** Na varredura da conta do concorrente, em 13/09.

**Por que importa.** É por ali que chega o **Termo de Exclusão do Simples**, e o cliente não olha. **Pela API:** o InfoSimples tem `ECAC / Caixa Postal` — então **conseguimos ler**. O que não sabemos é a obrigação e o prazo.

**A pergunta:** qual o prazo de ciência tácita no DTE-SN, e o que muda se perdermos uma intimação? Monitorar isso é obrigação do contador responsável ou cortesia?

---

# 🅳 BLOCO D — cinco clientes, do dia 1 ao fim do contrato

> 🧭 **Para que serve na conversa.** Em vez de discutir regra no abstrato, o contador acompanha **cinco empresas** pelo tempo em que elas ficaram conosco e diz onde o que fazemos está certo, onde falta passo e onde falta pergunta.
>
> 📐 **Como ler.** Cada linha é **o que a casa faz**, com a data, a ferramenta e a dúvida ligada (⇢ **C3**, ⇢ **A1**…). Onde não há dúvida ligada, é porque está fechado.
>
> 🔧 **As ferramentas, uma vez só:** `Integra-SN` apura e emite a guia do DAS e a DEFIS · `Integra-Sicalc` emite o DARF do sócio · `Integra-DCTFWeb` transmite a DCTFWeb · `Integra-Sitfis` consulta se a guia foi paga · `eSocial WS` transmite a folha do sócio (SOAP, gratuito) · `Emissor Nacional` emite a NFS-e · `InfoSimples` consulta cadastro, CND e caixa postal. Os quatro `Integra-*` são da **API Integra Contador do SERPRO**.
>
> ⚠️ **O que é real e o que é simulado:** as empresas são fictícias e as datas são de simulação. Os **cálculos são do motor**, conferido ao centavo contra recibos reais da Receita. As **regras de prazo** são de norma. O que está em dúvida está marcado.

## O ciclo que vale para todas — o mês padrão

| Dia | O que a casa faz | Ferramenta |
|---|---|---|
| **último do mês** | A competência fecha. Somamos as notas emitidas | — |
| **até o 15** | Decidimos o pró-labore do mês e transmitimos a folha do sócio | `eSocial WS` + `Integra-DCTFWeb` |
| **até o 15** | Vigiamos o Fator R — só nos CNAEs que podem virar Anexo V | motor |
| **até o 18-20** | Emitimos o DARF do INSS e do IR do sócio. 🔑 **Antecipa** se cair em fim de semana | `Integra-Sicalc` |
| **até o 20-21** | Apuramos, transmitimos o PGDAS-D e emitimos a guia do DAS. 🔑 **Prorroga** se cair em fim de semana | `Integra-SN` |
| **depois** | Conferimos se a guia anterior foi paga; se venceu, recalculamos com multa e juros | `Integra-Sitfis` |
| **31/03** | DEFIS do ano anterior. 🔴 **Morre em 2027**, vira campo do PGDAS-D | `Integra-SN` |

🔑 **O eSocial vence ANTES do DAS.** Quem mira o dia 20 entrega 5 dias atrasado, todo mês. ⇢ **A11**

---

## 👤 P01 · Bruno, dev freelancer solo — *o que acontece quando ninguém avisa*

**Cadastro:** desenvolvimento de software · **1 sócio** · sem emprego CLT · endereço próprio · faixa de faturamento R$10-20 mil · CNAE **6201-5/01**, dos **15 que podem virar Anexo V**. Abre em **março/2026**, fica **8 meses** conosco.

| Quando | O que a casa faz | Dúvida |
|---|---|---|
| **Dia 1** | Constituição concluída, CNPJ na mão. Emitimos a **inscrição municipal** e as **licenças**, e publicamos os documentos na plataforma | ⇢ **C1 C2** |
| **Dia 1** | Certificado digital emitido pela parceira. **Sem ele o app não libera a emissão de nota** — não existe procuração na NFS-e | — |
| **Dia 1** | 🔑 **Definimos o pró-labore já na 1ª competência.** É decisão nossa, não exigência legal — e trava o Fator R desde o começo | ⇢ **A3 A5** |
| mar–abr | Dois meses **sem faturar**. Mesmo assim transmitimos PGDAS-D e a folha do sócio: **mês sem receita não pausa obrigação** | ⇢ **B6** |
| **mai** | 1ª nota: R$18.000. Pró-labore no mínimo (R$1.621), folha em **9%** | — |
| **jun** | 🔴 **Cai para o Anexo V.** A alíquota vai de 6% para 15,5% | ⇢ **A3** |
| **set** | Ele corrige o pró-labore para R$5.400 | ⇢ **A2** |
| **ago/2027** | 🔴 **Só então voltaria ao Anexo III** — 11 meses pagando a mais, com a folha já certa | ⇢ **B4** |
| **31/03/2027** | DEFIS do ano-calendário 2026 | ⇢ **A9** |
| **Total** | Faturou **R$108.000** · pagou **R$15.030** de DAS · **5 meses no Anexo V** | |

🔑 **É a persona que justifica o produto:** com o nosso piloto ligado desde o mês 1, ela **nunca** teria ido ao Anexo V. A diferença é de **R$6.795** no bolso do cliente.

---

## 👤 P03 · Rafael, filmagem de eventos — *abre em novembro, e a obrigação anual é em março*

**Cadastro:** filmagem de festas e eventos · **1 sócio** · **endereço fiscal da Legalizai** (+R$49/mês) · CNAE **7420-0/04**, **Anexo III fixo** — o Fator R não muda nada nele. Abre em **novembro/2025**, fica **11 meses**.

| Quando | O que a casa faz | Dúvida |
|---|---|---|
| **Dia 1** | Inscrição municipal, licenças, certificado, documentos na plataforma | ⇢ **C1 C2** |
| **Dia 1** | 🔑 **A tela dele NÃO fala em Fator R nem em 28%.** CNAE fixo: sugerir esse risco seria mentir por omissão | — |
| **nov/2025** | Já fatura **R$14.000 no mês da abertura**. O acumulado vira R$168.000 de cara *(receita do mês × 12)* | ⇢ **C4** |
| **jan–fev/2026** | Dois meses secos. Transmitimos igual | ⇢ **B6** |
| 🔴 **31/03/2026** | **DEFIS do ano-calendário 2025** — com **41 dias de empresa**. Ele mal entendeu o que é DAS e já tem obrigação anual | ⇢ **B3 A9** |
| mai–jul | Temporada cheia: R$12k, R$19k, R$17k | — |
| **31/03/2027** | DEFIS de 2026 | ⇢ **A9** |
| **Total** | Faturou **R$102.000** · **R$6.120** de DAS · **zero** meses no Anexo V | |

---

## 👤 P09 · Gustavo, eventos corporativos — *dois sócios, um com CLT, e três guias atrasadas*

**Cadastro:** organização de feiras e congressos · **2 sócios**, ambos administram · um deles tem **CLT de R$9.000**, acima do teto do INSS · 3 CNAEs secundários · **Anexo III fixo**. Abre em **setembro/2025**, fica **13 meses**.

| Quando | O que a casa faz | Dúvida |
|---|---|---|
| **Dia 1** | Inscrição municipal, licenças, certificado, documentos | ⇢ **C1 C2** |
| **Dia 1** | 🔑 **O DARF sai sócio a sócio, e só depois soma.** O do CLT alto não recolhe nada; o outro recolhe normal | ⇢ **A1 B1** |
| out–dez/2025 | Escala rápido: R$12k, R$28k, R$35k no pico de confraternização | — |
| **31/03/2026** | DEFIS de 2025 | ⇢ **B3** |
| **mar, abr, mai/2026** | 🔴 **Três guias seguidas em atraso** (14, 21 e 14 dias). Recalculamos com multa de 0,33%/dia e juros | ⇢ **B5** |
| | Custo do atraso: **R$393,32**. É o caso de uso do lembrete de vencimento, com número | — |
| **set/2026** | O acumulado cruza **R$180 mil** e ele muda de faixa | — |
| **out/2026** | 13º mês: a regra do acumulado troca de *média × 12* para **soma dos 12** | ⇢ **C4** |
| **Total** | Faturou **R$266.000** · **R$17.514** de DAS · **R$2.318** de DARF | |

---

## 👤 P11 · Cléber, aluguel de equipamentos — *quatro sócios, o caso caro*

**Cadastro:** aluguel de máquinas para escritório · 🔴 **4 sócios** — o teto do nosso contrato —, **25% cada**, todos administram · 2 CNAEs secundários · **Anexo III fixo**. Abre em **março/2026**, fica **6 meses**.

| Quando | O que a casa faz | Dúvida |
|---|---|---|
| **Dia 1** | Inscrição municipal, licenças, **as 4 assinaturas dos sócios**, documentos | ⇢ **C1** |
| **Dia 1** | 🔑 **Quatro pró-labores, quatro cálculos, uma guia.** É aqui que o nosso erro de 15/09 custava **R$2.077 por mês** | 🔴 ⇢ **A1 B7** |
| todo mês | **4 eventos de remuneração e 4 de pagamento** no eSocial, um por sócio | ⇢ **A2** |
| todo mês | ⚠️ Assumimos **rateio igual** (R$405,25 para cada). Se o trabalho for desigual, isso é risco | 🔴 ⇢ **A2 A3** |
| **31/03/2027** | DEFIS de 2026, com os **rendimentos de cada sócio** discriminados | ⇢ **A9** |
| **Total** | Faturou **R$47.500** · **R$2.850** de DAS · **R$4.279** de DARF | |

🔑 **Repare na inversão:** é a única das cinco em que o **DARF dos sócios é maior que o imposto da empresa**. Quatro pessoas recolhendo INSS sobre uma receita modesta.

---

## 👤 P16 · Vitor, consultoria em TI — *dois anos, e o Anexo V que cresce*

**Cadastro:** consultoria em TI · **1 sócio** · CNAE **6204-0/00**, dos **15 que podem virar Anexo V**. Abre em **junho/2025**, fica **22 meses** — o percurso mais longo, atravessando **três anos-calendário**.

| Quando | O que a casa faz | Dúvida |
|---|---|---|
| **Dia 1** | Inscrição municipal, licenças, certificado, documentos | ⇢ **C1 C2** |
| jul/2025 → | Cresce de R$8 mil a R$42 mil/mês, sempre se pagando o mínimo | — |
| **set/2025** | 🔴 Cai para o **Anexo V** e **fica lá 19 dos 22 meses** | ⇢ **A3** |
| **mar/2026** | O acumulado cruza **R$180 mil** e ele entra na **2ª faixa**: a alíquota efetiva começa a subir de 15,5% rumo a 16,75% | — |
| **31/03/2026** | DEFIS de 2025 | ⇢ **A9** |
| **jun/2026** | 13º mês: a regra do acumulado troca para soma dos 12 | ⇢ **C4** |
| **31/03/2027** | DEFIS de 2026 | ⇢ **A9** |
| **mar/2027** | Acumulado em **R$359.000** — a **R$1.000 do teto do ME**. Passar é desenquadramento para EPP | 🔴 |
| **Total** | Faturou **R$551.000** · pagou **R$87.083** de DAS · **19 meses no Anexo V** | |

🔑 **O contraste que fecha o argumento:** com o piloto ligado desde o mês 1, ele teria pago **R$40.502** em vez de **R$87.083**. E ele encosta no teto do ME sem passar — é o único caso em que a porta de saída para EPP aparece.

---

## O que estas cinco cobrem, juntas

| | |
|---|---|
| Regimes | 2 dinâmicas (podem virar Anexo V) · 3 Anexo III fixo |
| Sócios | 1 · 1 · 2 · **4** · 1 |
| Mês de abertura | março · **novembro** · setembro · março · junho |
| Duração | 6 a **22** meses · 1 a **3** anos-calendário |
| Situações | meses sem faturar · **guias em atraso** · mudança de faixa · 13º mês · CLT acima do teto · endereço fiscal · **encostar no teto do ME** |
| DEFIS devidas | 1 · 2 · 2 · 1 · **3** |

⚠️ **O que elas NÃO cobrem, de propósito:** nenhuma tem **colaborador** (travado fora por decisão), nenhuma **muda de CNAE**, nenhuma tem **entrada ou saída de sócio**, e nenhuma **ultrapassa** o teto do ME. Se o contador achar que algum desses casos é comum no escritório, é sinal de que falta persona — e isso é resposta valiosa.

---

---

## 📌 O que ficou de fora de propósito

| | Por quê |
|---|---|
| Folha de colaborador, 13º, férias, FGTS | 🔒 travado fora por decisão do Pedro — nenhuma persona tem funcionário |
| ISS, retenção, local de recolhimento | assunto encerrado, ver `_encerrados.mjs` · E-ISS [ENCERRADO] |
| CPP no numerador do Fator R | encerrado, mas 🔴 **já foi reportado errado ao Mauro em 13/09** e a correção está no `evolucao-para-mauro` de 15/09 |
| Faixas 3 a 6 da tabela | o ME não alcança — a faixa 2 termina em R$360 mil, que é o teto |

## Links
[[PENDENCIAS]] · [[fila-validacao-humana]] · [[indice-autoridade]] · [[_achados-do-motor]] · [[_encerrados]] · [[ciclo-do-cnpj]]
