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

## 📌 O que ficou de fora de propósito

| | Por quê |
|---|---|
| Folha de colaborador, 13º, férias, FGTS | 🔒 travado fora por decisão do Pedro — nenhuma persona tem funcionário |
| ISS, retenção, local de recolhimento | assunto encerrado, ver `_encerrados.mjs` · E-ISS [ENCERRADO] |
| CPP no numerador do Fator R | encerrado, mas 🔴 **já foi reportado errado ao Mauro em 13/09** e a correção está no `evolucao-para-mauro` de 15/09 |
| Faixas 3 a 6 da tabela | o ME não alcança — a faixa 2 termina em R$360 mil, que é o teto |

## Links
[[PENDENCIAS]] · [[fila-validacao-humana]] · [[indice-autoridade]] · [[_achados-do-motor]] · [[_encerrados]] · [[ciclo-do-cnpj]]
