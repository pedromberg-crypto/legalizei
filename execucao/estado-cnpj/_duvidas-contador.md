---
tipo: derivado
status: validado
data: 2026-09-16
assunto: regras-validadas-com-o-contador
autoridade: ratificado
validado-por: Leonan (contador), 16/09/2026, 3 áudios, ~5h
tags: [execucao, motor-fiscal, validado, leonan, mauro]
---

# ✅ As regras do motor, validadas com o contador

> 🔴 **ESTE DOC MUDOU DE NATUREZA EM 16/09.** Ele nasceu como **briefing de perguntas** para a conversa com o contador. A conversa aconteceu — **~5 horas, 3 áudios, 293.345 caracteres de transcript, lidos 100%** — e agora ele é o **registro do que foi ratificado, corrigido e decidido**.
>
> 🧭 **Como ler agora.** Cada item preserva o **caso concreto**, **onde a dúvida apareceu** e **a pergunta que foi feita** — porque é isso que dá rastreabilidade. E ganhou embaixo o **veredito**, com a fala literal dele.
>
> 🔴 **ESTE DOC NÃO É FILA.** A fila de quem-resolve-o-quê é **[[PENDENCIAS]]**. Aqui ficam o contexto e a decisão.

## 🎯 O placar da validação

| | Bloco A | Bloco B | Bloco C | **Total** |
|---|:---:|:---:|:---:|:---:|
| ✅ **Ratificado como estava** | 6 | 7 | 7 | **20** |
| 🔴 **Corrigido — estávamos errados** | 2 | 1 | 1 | **4** |
| 🆕 **Respondido e virou decisão nova** | 3 | 1 | 1 | **5** |
| ⏳ **Segue aberto** | 3 | 0 | 0 | **3** |

🔑 **E o Bloco E — as sete contas do motor — passou 7 de 7.** A conta do DAS foi conferida contra a guia real dele: *"bateu 100% do valor, que é o que eu paguei lá."*

## 📖 As três legendas que este doc usa

| | |
|---|---|
| ✅ **RATIFICADO** | ele confirmou o que já fazíamos. Nada muda |
| 🔴 **CORRIGIDO** | estávamos errados. **Muda produto ou motor** |
| 🆕 **DECIDIDO** | ele respondeu e o Pedro travou uma decisão nova |
| ⏳ **ABERTO** | ele não soube, hesitou, ou pediu para confirmar |

---

## 📌 O que já estava respondido por pesquisa — e uma que a reunião DERRUBOU

Três rodadas de pesquisa em fonte primária tinham fechado parte disto. **A reunião confirmou quase tudo e desmentiu uma:**

| Item | Onde | Veredito do Leonan |
|---|---|---|
| Sócio com **emprego CLT** não impede nada no Simples | LC 123 arts. 3º, 15, 17, 30, 31 | ✅ **ratificado**, com um adendo: pode custar o **seguro-desemprego** dele ⇢ **N1** |
| **DEFIS** bloqueia o PGDAS-D a partir de março | Manual do PGDAS-D e DEFIS 2018 v4 | ✅ *"eu não consigo mandar o Simples. O PGDAS fica travado"* |
| **DEFIS morre em 01/01/2027** | Res. CGSN nº 190/2026 | ✅ ratificado ⇢ mas a transição segue incerta, ver **A9** |
| **DEFIS não gera multa por atraso** | mesma pesquisa | 🔴 **DERRUBADO.** *"Ele não gerava multa nenhuma… esse ano passou a gerar"* ⇢ **A9** |
| Empresa aberta em dezembro declara o **ano-calendário inteiro** | Res. CGSN 140/2018 art. 2º V | 🔴 **DERRUBADO.** Declara **a partir da data de abertura** ⇢ **B3** |
| **Livro Caixa basta** para a DEFIS | Res. CGSN 140/2018 | ✅ e nem é do nosso perfil ⇢ **C5** |
| Sócio que **sai** não apaga o pró-labore do Fator R | LC 123 | ✅ *"o que gerou para ele de folha permanece"* |
| Sócio que **entra** afeta o Fator R na competência da formalização | idem | ✅ *"tem que ser a partir da competência que ele entrou"* |
| Canais **Integra-*** cobrem tudo; eSocial é SOAP gratuito | Loja SERPRO | ✅ não contestado |

---

## 🗣️ Como a conversa foi aberta

*"Construímos um motor que calcula o imposto e a guia do sócio mês a mês, e um piloto que ajusta o pró-labore sozinho para manter a empresa no Anexo III. Para testar, criamos 16 empresas fictícias com histórias completas de faturamento — abrindo em todos os 12 meses do ano, de 1 a 4 sócios, algumas atravessando a virada de ano — e rodamos o motor na vida inteira de cada uma. Foram 156 competências. As perguntas abaixo saíram daí."* `[HISTÓRICO]`

> 🔢 **Este parágrafo não se atualiza, de propósito** — é o que foi dito ao contador em **16/09**, e reescrever falsificaria a abertura da conversa. O elenco de hoje é **18 vidas · 169 competências**: a **P21** nasceu *depois* desta reunião, e nasceu **por causa dela** (constituir e faturar no mesmo mês). Os números vivos estão em [[_cobertura-das-vidas]], e o `verificar-defasagem.mjs` confere a cada rodada.

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

> ## ✅ RATIFICADO · e o desempate ficou PELA METADE
>
> **Sobre o por-sócio, sem ressalva:**
>
> > *"É **por CPF**, então é por pessoa. É por pessoa esse cálculo… e depois os dois somam e geram **uma guia só**. Soma de todos e gera uma guia só."*
>
> 🔑 E ele detalhou a mecânica que faltava: **a distribuição ao eSocial é individual por CPF, a guia é consolidada por CNPJ.** *"A distribuição do envio é individual. Por CPF. Manda lá para a base do eSocial de forma individual."*
>
> **Pergunta direta feita:** *"existe alguma situação em que se calcula sobre o total?"* → **Não.**
>
> ✅ **O conserto de 15/09 está certo.** Nada muda no motor.
>
> ### ⏳ Mas o desempate do IRRF abriu OUTRA divergência
>
> Ele confirmou o **desconto simplificado** e o redutor, mas descreveu uma **régua de faixas** que **não é a do nosso motor**:
>
> > *"De R$3.500 para baixo, ele **zera o imposto, direto**. Não tem necessidade [de calcular]. De R$3.500 a R$5.000, ele usa o redutor. **Passou de R$5.000, aí o cálculo é normal**, sem o redutor."*
>
> | | Até R$3.500 | R$3.500 a R$5.000 | Acima de R$5.000 |
> |---|---|---|---|
> | **Leonan** | zera direto | redutor | **sem** redutor |
> | **Nosso motor** | redutor zera | redutor | redutor em rampa até R$7.350 |
>
> ## ✅ RESOLVIDO EM 16/09 — o motor estava certo, e o R$3.500 não existe
>
> Consulta externa em 16/09, com os 7 pontos conferidos contra o motor: **7 de 7 batem**.
>
> ### 🔑 O R$3.500 que ele repetiu seis vezes não tem lastro
>
> > *"**Não existe.** Esse número não tem lastro na sistemática vigente para 2026. Provavelmente está confundindo com **antigas propostas de campanha ou projetos de lei defasados** que sugeriam isenção de até R$3.500."*
>
> Os marcos reais são **R$5.000** (início da rampa) e **R$7.350** (fim).
>
> ### 🔴 E o corte seco que ele descreveu criaria um PENHASCO
>
> Medido no nosso motor, sem depender de opinião:
>
> | Pró-labore | Regra dele *(corte seco)* | Nossa regra *(rampa)* |
> |---:|---:|---:|
> | R$ 5.000,00 | líquido R$ 4.450,00 | líquido R$ 4.450,00 |
> | **R$ 5.000,01** | líquido **R$ 4.137,12** 🔴 | líquido **R$ 4.450,01** ✅ |
>
> Varrendo R$4.900 a R$7.500 de um em um real: a régua seca faz o sócio **perder R$312,23 de líquido ao ganhar R$1 a mais**; a rampa **nunca** inverte.
>
> 🔑 **É a mesma engenharia da parcela a deduzir do Simples**, que existe para não haver salto na borda dos R$180 mil. Legislação tributária não cria penhasco desses de propósito. ✅ Virou **conferência G10b** no motor.
>
> ### ✅ E o desconto simplificado fechou com texto literal
>
> **Lei 11.482/2007 art. 4º §2º**, redação da **Lei 14.663/2023**: *"desconto simplificado mensal, correspondente a **25% do valor máximo da faixa com alíquota zero**… **caso seja mais benéfico ao contribuinte**"*.
>
> 🔑 Ele **deriva** da 1ª faixa: `25% × 2.428,80 = 607,20`. Não é número solto.
>
> ### 🟡 O que SEGUE aberto, e por que não bloqueia
>
> ⚠️ **Ninguém nos mostrou o texto do art. 3º-A.** A consulta declarou que a Lei 15.270/2025 é posterior ao corte dela e **recusou-se a colar o texto** em vez de arriscar inventar. Os quatro parâmetros (`312,89` · `978,62` · `0,133145` · `7.350`) seguem **sem fonte primária** — é a única peça do motor assim.
>
> 🔑 **Não bloqueia porque toda a nossa persona está protegida nas duas leituras:** pró-labore de 1 a 3 salários mínimos zera o IRRF em qualquer régua. A divergência só toca quem tira mais de R$5.000, e aí o piloto mostra a conta antes.
>
> 📌 Evidência completa: [[2026-09-16-redutor-irrf-consulta-LITERAL]]
>
> ✅ **O que ficou fechado:** o limite é **por CPF**. *"Em tese, quatro sócios poderiam ficar isentos dentro de uma base de 20 mil."*

## A2 · 🟡 O pró-labore pode ser desigual entre os sócios? `#71`

**O caso.** Empresa com 3 sócios que paga R$6.000 de pró-labore no mês. O nosso sistema assume R$2.000 para cada.

**Onde apareceu.** Ao consertar o erro do A1 — porque o imposto depende de quanto **cada pessoa** recebeu, não do total.

**Por que apareceu.** A divisão igual **não é neutra**: R$14.000 em R$7.000+R$7.000 gera um IRRF; em R$11.000+R$3.000 gera outro, maior. E não temos de onde deduzir o rateio: o app coleta o **percentual de participação**, que governa **lucro**, não pró-labore. Assumimos igual por conveniência de tela, e isso tem preço.

**A pergunta:** com que frequência, na prática, os sócios dividem desigual? Exige formalidade (alteração contratual, ata, registro em folha)? E o risco está em dividir **desigual**, ou em dividir **igual quando o trabalho é desigual**?

> ## 🆕 RESPONDIDO · e o rateio igual deixou de ser "conveniência de tela"
>
> **A premissa que mais nos incomodava virou a escolha tecnicamente certa:**
>
> > *"Se desses R$3.242, R$3.000 ficasse para um sócio e R$242 para o outro, **o outro cara está chegando numa linha de pagar mais imposto** mais próxima do que eu estou com o valor meia a meia. **Então o ideal seria fazer a divisão meia a meia.**"*
>
> 🔴 **E isso INVALIDA uma inferência do nosso app.** Hoje o sistema deduz o rateio do **percentual de participação** coletado no dossiê:
>
> > *"Não necessariamente eu tendo 20% da empresa e o outro tendo 80%, os nossos pró-labores têm que ser proporcionais à participação. **Não tem.** Eu posso decidir como eu vou distribuir isso."*
>
> **Frequência do desigual:** baixa, e com causa específica.
>
> > *"Só tem a possibilidade de fazer desigual quando **o outro sócio não trabalha efetivamente** na empresa."*
>
> **Formalidade:** ⇢ ver **A2b** logo abaixo.
>
> **Risco:** nenhum dos dois, se estiver no contrato. *"Não vai ter risco. Vai gerar risco **se não tiver esse acordo**."*
>
> ### ✅ DECIDIDO
>
> | | |
> |---|---|
> | **Default** | rateio **igual** entre os sócios que recebem, **independente da participação** |
> | **Desigual** | só a pedido, por contato — não é campo de tela |
> | 🔴 **A mudar no app** | **parar de deduzir o rateio do percentual de participação**. Aquele campo governa **lucro**, não pró-labore |
>
> ## 🆕 A2b · A cláusula do contrato social prevê AS DUAS distribuições
>
> Pergunta do Pedro: *"e se a gente assumir que no contrato social quem colocou um sócio vai ser distribuição igual?"*
>
> > **Léo:** *"Aí você pode colocar **os dois**. 'A distribuição pode ser igualitária **ou** desproporcional' — é um critério dos administradores, como um acordo entre si."*
>
> 🔑 **O porquê é operacional e economiza dinheiro do cliente:** se o contrato disser só "igualitária" e amanhã eles distribuírem desigual, a fiscalização cobra a formalidade. Com a cláusula dupla, **não precisa refazer contrato social** quando o cliente quiser mudar.
>
> > *"Se amanhã o Estado ou a Receita me cobra essa formalidade e começa a ver que os valores não estão batendo… aí existe essa chatice. **Melhor já deixar de um jeito que cobre os dois.**"*
>
> ✅ **Decidido:** cláusula padrão prevendo ambas, na minuta com a advogada.

## A3 · 🟡 "Administrar" é a mesma coisa que "prestar serviço"? `#72`

**O caso.** Empresa com 3 sócios, 1 administrador e 2 que trabalham sem serem administradores.

**Onde apareceu.** Montando as empresas de teste. Duas delas foram descritas como *"só o titular administra"* e mesmo assim pagavam pró-labore a todos os sócios.

**Por que apareceu.** A Lei 8.212/91 art. 12 V "f" fala em **prestar serviço**. O nosso app, na abertura, pergunta **quem administra** (a qualificação 49 × 22 do DBE). Dá para trabalhar na empresa sem ser administrador — e aí a inferência do app erra. 🔑 **A decisão de produto que levamos à mesa era:** o default é **todos os sócios recebem**, e a exceção é declarada. ⚠️ **Ela foi derrubada na reunião — ver o veredito abaixo.**

**A pergunta:** para efeito de pró-labore e INSS, o que vale é **administrar** ou **trabalhar**? Se for trabalhar, o nosso app está perguntando a coisa errada e precisa de uma pergunta a mais na constituição.

> ## 🔴 CORRIGIDO · vale TRABALHAR, e o nosso default estava errado
>
> > *"A lei do 212 fala que **o cara que trabalha, que efetivamente trabalha, ele é obrigado a ser um contribuinte obrigatório** do INSS. O cara que não trabalha, às vezes ele é um sócio só de investimento — eu só aporto e faço essa retirada de lucro —, **eu não tenho obrigatoriedade de gerar um pró-labore**."*
>
> 🔴 **O nosso default era "todos os sócios recebem". Está errado**, e cobra INSS de quem não deve.
>
> ⚠️ **E ele avisou que o app nunca vai saber sozinho:**
>
> > *"**E ele não vai saber também.** Às vezes o cara pode colocar que um é administrador, mas quem está trabalhando é o outro."*
>
> Pior: existe motivo **legítimo** para o administrador não ser quem recebe.
>
> > *"Às vezes o administrador não é o cara que vai fazer o recolhimento porque é o outro, que tem **um impedimento no nome, um bloqueio judicial**, ele não quer se comprometer."*
>
> **Para que serve, então, indicar o administrador?** Para outra coisa:
>
> > *"A parte mais importante de indicar um administrador é **quando ele vai resolver alguma burocracia**. Uma assinatura do banco, um processo na Receita. Se eu colocar que todo mundo é administrador, **qualquer processo que eu faço eu preciso da assinatura dos três**."*
>
> ### ✅ DECIDIDO — substitui o default anterior
>
> | Perfil | O que a casa faz |
> |---|---|
> | Sócio **administrador** | 🔑 pró-labore gerado **automaticamente** |
> | Sócio **cotista** *(código 22)* | **nada**. Nasce sem pró-labore |
> | Cotista que passa a trabalhar | habilita **a pedido**, depois |
>
> > **Pedro:** *"A gente trava de início os administradores, gera automaticamente o pró-labore. E os que não são administradores, a gente não faz."*
> > **Léo:** *"Faz sentido."*
>
> 🔴 **Muda o motor:** hoje `sociosComProLabore` é só uma contagem — não distingue administrador de cotista.

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

> ## ✅ RATIFICADO · o bloqueio fica, e os R$100 são defeito deles
>
> 🔑 **Era o único item onde suspeitávamos que a Contabilizei estivesse certa e nós errados. Estamos certos.**
>
> Ele explicou a intenção por trás dos R$100 — e ela é fraca:
>
> > *"**E R$100 ali era só para ele não falar que não gerou nada.** Porque o sistema da Receita me aceita mandar com um valor menor."*
>
> E desmontou a própria utilidade da manobra:
>
> > *"Não ia fazer diferença. **28% de 10 mil é 2.800, os seus R$100 não iam fazer diferença.** Os caras iam ter que aumentar esse valor de 100 para 2.800 de qualquer jeito."*
>
> ✅ **O bloqueio abaixo do salário mínimo fica**, como único bloqueio duro da tela.
>
> ### ⚠️ A nuance que ele acrescentou, e que não está em lugar nenhum nosso
>
> O piso legal é a **hora**, não o mês:
>
> > *"Ele pode até ganhar menos que um salário mínimo no mês. **Ele não pode ganhar menos que a hora mínima.** O salário mínimo de 2025 era R$1.518; dividido por 220, a hora é R$6,90. Ele não pode ganhar R$6,80 na hora."*
>
> 🔑 **Para o nosso escopo não muda nada** — sócio não tem jornada declarada —, mas **explica por que o sistema da Receita aceita** os R$100 sem reclamar. ⇢ fecha **🏢3**

## A5 · 🟡 Quanto tempo uma empresa nova pode ficar sem pró-labore? `#8`

**O caso.** A conta real passou **3 meses sem pagar pró-labore** no início.

**Onde apareceu.** Na reconstituição mês a mês dessa conta.

**Por que apareceu.** Não pagar **trava o numerador do Fator R** (que é regime de caixa), e isso faz a empresa **perder o benefício do Anexo III** 12 meses depois. 🔑 **A decisão de produto que levamos à mesa era:** forçar pró-labore já na primeira competência. ⚠️ **Ela foi substituída na reunião — ver o veredito abaixo.**

**A pergunta:** qual o risco real de ficar meses sem pró-labore no início, e qual a tese do escritório hoje?

> ## 🆕 RESPONDIDO · a lei diz uma coisa, a prática diz outra, e nós perguntamos ao cliente
>
> **A lei, segundo ele:**
>
> > *"Na lei, é a partir do momento do trabalho. Se o cara está ali e não tem receita mas **está tentando fazer essa receita, em tese ele já é contribuinte obrigatório**. Eu deveria gerar a partir do momento da constituição da empresa."*
>
> **Por que a prática é outra:**
>
> > *"Eu vou gerar uma guia a mais para esse cara [que não faturou]… **'você me mandou uma guia de R$178 aqui e eu não tive faturamento'. Tem muito, em todos os escritórios.**"*
>
> **O risco de esperar** é real e é o do Fator R:
>
> > *"Quando você não emite [o pró-labore], **você perde histórico dos 28**."*
>
> ### ✅ DECIDIDO — pergunta obrigatória no 1º acesso
>
> Depois de ~25 minutos, a decisão virou **uma pergunta só**, no onboarding:
>
> > *"Você quer já gerar pró-labore a partir desse mês da sua constituição, **ou você quer aguardar seu primeiro faturamento?**"*
>
> | Escolha | O que a casa faz |
> |---|---|
> | **Aguardar o faturamento** *(default)* | nada até a 1ª nota. Na 1ª nota, calcula os 28% e gera |
> | **Gerar agora** | pró-labore no **salário mínimo** desde a constituição |
>
> 🔑 **O argumento para a opção "gerar agora" não é fiscal, é humano** — e foi ele quem trouxe:
>
> > *"Essa contribuição contínua dá a ele o benefício de você precisar de algum seguro, recorrer a algum seguro por acidente… **tinha muito caso da mulher** que não contribuiu por um período. Ela estava acostumada a receber 6 mil, aí ia cair para um salário no mês."*
>
> ✅ **Damos a opção e avisamos. Não decidimos por ele.**
>
> 🔒 **E uma vez ligado, não para:** *"o ideal seria manter o pró-labore"* — porque o cliente que esquece de emitir e **dobra a nota no mês seguinte** precisaria de folha dobrada também.
>
> ⚠️ **A responsabilidade é dele, declarada:** *"o que o cara colocar lá da previsibilidade dele é o que a gente vai ter que levar como verdade."*

## A6 · 🔴 Transmitir com a qualificação cadastral PENDENTE `#4`

**O caso.** Na conta real, o cadastro do sócio está como `FALTA DADOS`, sem PIS informado — e **9 competências já foram transmitidas assim**.

**Onde apareceu.** Lendo o JSON da plataforma.

**Por que apareceu.** A DCTFWeb é **confissão de dívida irretratável**. Transmitir com cadastro pendente pode ser problema, e o cliente **não sabe** que está assim — só aparece no JSON, nunca na tela.

**A pergunta:** qual o risco concreto? Isso precisa ser regularizado retroativamente, ou basta corrigir daqui pra frente?

> ## ✅ RESPONDIDO · não é problema, e não gera multa
>
> > *"Mas é **só informação cadastral**, e ele gerou a informação. Então **não iria gerar essa dívida por multa**, por falta de informação dessa técnica."*
>
> **Pedro:** *"Então também não é um gargalo, um B.O. grande."* → confirmado.
>
> ✅ **Fecha sem pendência.** Não precisa de regularização retroativa. Coletamos o PIS por higiene de cadastro, não por risco fiscal.

## A7 · 🟡 A base do IRRF vem ZERO nas declarações `#5`

**O caso.** Na conta real, o campo `salarioBaseIRRF` vem **zero em todas as competências**, inclusive nas de R$3.360.

**Onde apareceu.** Na leitura dos dados da plataforma.

**Por que apareceu.** Precisamos saber se isso é **base declarada zero** (o que seria errado) ou **base calculada com imposto zero** (o que seria certo, e é o que o nosso motor faz). Se o campo é para ficar preenchido, não podemos copiar o comportamento deles — essa base alimenta o eSocial e a DCTFWeb.

**A pergunta:** esse campo deve trazer a base de cálculo ou pode vir zerado quando não há imposto a reter?

> ## ✅ RESPONDIDO · não era defeito deles. Era o ANO
>
> > **Léo:** *"Aí você pegou essa base em **2026**. **Mas se fosse em 2025, te geraria.**"*
> > **Pedro:** *"Então, na verdade, ele quis apontar como um erro, e não é um erro."*
> > **Léo:** *"Era 2025, era de um jeito, e em 2026 passou para outro."*
>
> ✅ **Zero é o valor correto em 2026**, com o redutor do art. 3º-A já vigente. Não é bug deles, não é para copiar nem para evitar — é a lei nova.
>
> 🔑 **Fecha A7 sem pendência**, e retira a suspeita que estava no documento.

## A8 · 🟡 A ME unipessoal precisa de ata de aprovação anual de contas? `#9`

**O caso.** 9 das 18 vidas têm sócio único.

**Onde apareceu.** Mapeando as obrigações anuais.

**Por que apareceu.** O contrato social da conta real (cláusula nona) diz que o exercício encerra em 31/12 e o administrador **presta contas com inventário, balanço patrimonial e resultado econômico**. Numa empresa de um sócio só, isso vira ato formal ou fica invisível?

**A pergunta:** ME unipessoal precisa de ata registrada de aprovação de contas? Se sim, é obrigação nossa ou do cliente?

> ## ✅ RESPONDIDO · não precisa
>
> > **Pedro:** *"A ME unipessoal precisa de ata de aprovação anual de contas?"*
> > **Léo:** *"**Não.** Só a S.A., a sociedade anônima, que precisaria."*
>
> ✅ **Fecha sem pendência.** Nenhuma das nossas vidas de teste tem essa obrigação, e nenhuma tela precisa existir para isso.
>
> ## 🆕 A8b · E daí saiu uma decisão que não estava na pauta: **LTDA sempre**
>
> O Pedro emendou perguntando por que a Contabilizei abriu a empresa dele como **LTDA** mesmo sendo sócio único, quando a Izabela havia sugerido travar **SLU** para quem não tem sócio.
>
> > *"Se você já inclui como limitada, o cara vai estar sozinho — **e tudo bem também, não tem problema. Dentro do Simples Nacional roda tudo normal.**"*
> >
> > *"Porque o cara que é SLU, se ele resolve ter sócio, **você tem que fazer a transformação da SLU para limitada**. A inclusão de sócio, já sendo LTDA, é mais simples. **Eliminou uma burocracia.**"*
>
> ✅ **Decidido: travar LTDA sempre**, inclusive com sócio único. ⚠️ **Contraria a sugestão da Izabela** de 
 travar SLU para unipessoal — vale alinhar com ela antes de virar tela.

## A9 · 🟡 A DEFIS de 2026 sai no formato velho ou no novo? 🆕

**O caso.** A Resolução CGSN nº 190/2026 extingue a DEFIS a partir de **01/01/2027**, passando as informações para dentro do PGDAS-D, entre janeiro e março.

**Onde apareceu.** Na pesquisa de canais de transmissão de 15/09.

**Por que apareceu.** O ano-calendário **2026** é entregue em **março de 2027** — ou seja, depois da norma entrar em vigor, mas sobre fatos anteriores a ela. A própria pesquisa declarou que **não encontrou regra transitória expressa** e marcou como incerto. Isso decide se implementamos um formato ou dois.

**A pergunta:** a DEFIS do ano-calendário 2026 vai pelo sistema antigo ou já pelo PGDAS-D novo? Você já viu alguma orientação do CGSN sobre a transição?

> ## ⏳ ABERTO · ele também não sabe, e disse isso
>
> > *"**Isso aí eu também não tenho certeza de como é que eles vão fazer.** Na hora que a gente chegar lá em 2027… eu não sei se essa mudança vai ser integrada quando eu estiver em 2028, ou se em 2027 eles já vão fazer a integração de 2026."*
>
> A inclinação dele, sem afirmar:
>
> > *"Eu entendo que ele já vai ter essa integração lá já pronta, porque como ele passou para a web… **aí eu não sei.** A Receita já está promovendo muitas mudanças."*
>
> ✅ **Decidido, por prudência:** **manter o formato antigo para 2026** e monitorar. *"É melhor ficar em stand-by, porque na hora que começar a exigir na prática, nós vamos ver como ele vai estar buscando esses dados."*
>
> ### 🔴 E aqui ele DERRUBOU uma das nossas "já respondidas"
>
> A pesquisa dizia: **DEFIS não gera multa por atraso.**
>
> > *"Ele não gerava multa nenhuma, podia entregar fora do prazo. **Esse ano, a partir desse ano, ele passou a gerar.** Então tem que achar onde é que está essa multa."*
>
> Valores que ele citou, **com incerteza declarada**: R$50 sem movimento, R$200 com movimento, caindo à metade se pago até o vencimento.
>
> ⏳ **Ele mesmo pediu para confirmar a fonte.** ⇢ **P3**

## A10 · 🟡 A carta de responsabilidade é a Resolução CFC 1.590/2020? `#22`

**O caso.** Usamos a Resolução CFC "1.590/2020" como base da carta de responsabilidade do cliente — o documento que transfere a responsabilidade pelo que ele declara.

**Onde apareceu.** Numa pesquisa anterior.

**Por que apareceu.** As próprias referências da pesquisa citam **CFC 987/2003** e **1493/2015**, não a 1.590. Pode ser **citação trocada**, e esse documento sustenta a nossa proteção jurídica inteira sobre lucro declarado.

**A pergunta:** qual é a norma correta da carta de responsabilidade? A 1.590/2020 existe?

> ## ⏳ ABERTO · ele não confirmou a norma, e apontou outro caminho
>
> Ele não validou a citação. Achou que o conteúdo já está coberto em outro lugar:
>
> > *"Deve estar falando sobre a tratativa do próprio cliente, na questão de dispor de documentação. Mas isso aí, **o próprio contrato já vai ter essas cláusulas**."*
>
> ⏳ **A norma segue sem confirmação.** Não removi a referência, mas ela **não pode ser citada como fundamento** enquanto não for verificada.
>
> ## 🆕 A10b · E daí saiu a decisão sobre a PROCURAÇÃO
>
> O Pedro contou que assinou a procuração da Contabilizei só em **março/2026**, com a empresa aberta em **12/12/2025** — três meses de buraco.
>
> A explicação dele:
>
> > *"A procuração em si é **eletrônica**. Quando eu habilito no site da Receita uma procuração eletrônica, essa assinatura também é eletrônica, então **eu já fico como procurador**. Talvez essa carta assinada já seja para ele te representar em algum órgão **caso precisasse ir presencial**."*
>
> E a recomendação dele foi antecipar:
>
> > *"**É uma coisa que agiliza a sua vida lá na frente.** Hoje você pode fazer sob demanda, porque a base é menor. **Mas na hora que a base começar a inflar, como é que vai ser essa demanda?** Você vai ter que ter um setor só para executar essa busca."*
>
> ✅ **Decidido:** coletar a procuração **no onboarding**, junto da **2ª assinatura** — a que já reúne contador e representante. *"Lá dentro do app ele veria dois documentos para assinar: a procuração mais o documento final da constituição."*

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

> ## ✅ RATIFICADO · os quatro prazos, e o deslocamento em sentidos opostos
>
> > *"**O Simples é que sempre prorroga.** Se der final de semana e um feriado, ele vai prorrogar pro próximo dia. **O restante, tudo é dia útil [anterior].** Se deu final de semana e está vencendo na segunda, ele pede para você pagar na sexta."*
>
> ✅ Confirmado: **DAS prorroga · DARF antecipa**, no mesmo dia 20.
>
> ### 🔑 E ele resolveu isso de um jeito que nos poupa código
>
> > *"Mas **a própria guia já vem com a informação regulada**. Quando ela é gerada, ela já vem com a data certa. **Eu não preciso avisar isso pra ele.**"*
>
> 🔑 **Não precisamos calcular o deslocamento** — o órgão entrega a guia já com a data ajustada. Nosso `vencimentoDe()` serve para **antecipar a rotina interna**, não para informar o cliente.
>
> ⚠️ **Guia estadual é exceção** — e não é nosso escopo: *"os do Estado eu já não consigo fazer isso… o próprio sistema deles não consegue identificar se é para gerar naquele dia ou não."*
>
> ### ✅ E o dia 15 ficou definido como o que é
>
> > *"**Dia 15 é o seu limite máximo**" [da obrigação acessória]. "A DCTFWeb tem que ser transmitida dia 15, para as guias que vencem no dia 20. A minha obrigação acessória é dia 15, mas a minha guia é dia 20."*
>
> E a prática do escritório dele:
>
> > *"Lá no outro escritório, como a gente fazia? **Dia 1 a gente já começava.** Quanto antes você tiver a informação, melhor — **você antecipa uma possibilidade de multa** que vai chegar depois do dia 15."*
>
> ⏳ **O feriado municipal de BH não foi respondido.** Segue como lacuna `L7b` do motor.

## A12 · 🔴 PEJOTIZAÇÃO — o único risco crítico do nosso perfil 🆕

**O caso.** Um dev, um designer ou um consultor abre a ME para prestar serviço a **um cliente só**, cumprindo horário e recebendo ordens.

**Onde apareceu.** Na pesquisa de elegibilidade ao Simples, de 15/09.

**Por que apareceu.** O art. 3º §4º inciso **XI** da LC 123 veda o Simples quando o sócio guarda com o contratante, **cumulativamente**, relação de *pessoalidade, subordinação e habitualidade*. A pesquisa classificou como **risco CRÍTICO** justamente para TI, design e consultoria — que é o nosso público inteiro. E é a única vedação que a autodeclaração pega mal, porque depende da sinceridade de quem responde.

**A pergunta:** na prática do escritório, com que frequência isso aparece? Como você orienta o cliente que tem um cliente só? E qual o risco real — exclusão do Simples, reclamação trabalhista, ou os dois?

> ## ⏳ NÃO RESPONDIDO · a pergunta passou batida
>
> 🔴 **Sendo honesto: este item não foi respondido.** O Pedro leu o caso e ele mesmo respondeu por cima — *"isso aqui é um alerta, mas que o Brasil todo pratica"* — e a conversa seguiu para o A13 sem o Leonan se manifestar.
>
> ⚠️ **É o item de maior risco declarado do nosso perfil** (LC 123 art. 3º §4º XI, classificado como **CRÍTICO** justamente para TI, design e consultoria) e **continua sem opinião de contador**.
>
> ⏳ **Precisa voltar à pauta.** Não foi respondido por pesquisa nem por ele.

## A13 · 🔴 Não existe consulta prévia por CPF — o gate é 100% autodeclaração 🆕

**O caso.** Antes de cobrar do cliente e abrir a empresa, queremos saber se ele **pode** optar pelo Simples.

**Onde apareceu.** Mesma pesquisa. Ela declarou **ausência normativa**: nenhum serviço, portal ou API do governo permite testar a **elegibilidade ao Simples** de um CPF antes de o CNPJ existir. ⚠️ **Isso segue verdade, mas o enunciado original era largo demais** — a *regularidade* do CPF é consultável, e nós já a consultamos. Ver o veredito abaixo.

**Por que apareceu.** Se passar batido, a empresa nasce, a opção é **indeferida**, e ela começa a vida no **Lucro Presumido** — que para uma ME de serviço é fatal. E o estouro de faturamento global muitas vezes **só aparece meses depois**, gerando exclusão retroativa.

**A pergunta:** você tem algum caminho prático de checagem prévia que a gente não conheça? E quando o indeferimento acontece, qual o prazo e o rito para recorrer? O recurso suspende a cobrança pelo Lucro Presumido enquanto corre?

> ## 🔴 CORRIGIDO EM PARTE · a checagem existe, e nós já a construímos
>
> O enunciado deste item dizia *"não existe consulta prévia por CPF"*. **Existe uma que importa**, e o Pedro já a tinha implementado sem constar aqui:
>
> > **Pedro:** *"A gente fala que não tem essa consulta, mas tem. Pelo **InfoSimples** você sabe se o CPF é regular ou irregular. **CPF irregular inviabiliza a abertura na Junta — ele indefere.**"*
>
> **Como está no app hoje:** a consulta roda no botão final do **Revisar**, antes de disparar a viabilidade, usando **nome completo + data de nascimento**. Se algum sócio estiver irregular, devolve mensagem nominal e o fluxo não segue.
>
> ⚠️ **O que continua verdade:** não existe consulta de **elegibilidade ao Simples** por CPF antes do CNPJ. A regularidade do CPF é outra coisa — e é a que trava a Junta.
>
> ### 🆕 E ele acrescentou um segundo bloqueio que não conhecíamos
>
> > *"A Junta também tem uma possibilidade de você travar a abertura de CNPJ. Se o cara tiver tido **algum golpe no passado** e estiver com esse CPF bloqueado para abertura de empresa, ele também trava. Aí **ele mesmo tem que ir lá na Junta**, autorizar a abertura, tirar esse bloqueio."*
>
> ⏳ **Sem API conhecida** para esse segundo bloqueio: *"eu acho que não, acho que fica muito interno."* Ambos concordaram que é raro.
>
> ✅ **Saída de produto já validada:** se um sócio trava, o cliente pode **voltar e removê-lo** — *"às vezes ele tira um cara e abre com o outro"*.

## A14 · 🟡 Servidor público e MEI ativo 🆕

**O caso.** Dois perfis que aparecem no funil e que hoje passam direto pelo nosso cadastro.

**Onde apareceu.** Mesma pesquisa.

**Por que apareceu.** **Servidor público ativo** pode ser sócio quotista mas **não pode administrar** — o que muda a qualificação 49 × 22 e quem assina pela empresa. E **MEI ativo** não impede abrir a ME, mas **obriga baixa ou desenquadramento** antes, sob pena de exclusão de ofício (Res. CGSN 140/2018 art. 115 §2º IV).

**A pergunta:** confirma os dois? No caso do MEI, a baixa precisa ser **antes** da abertura ou dá para fazer depois, dentro de algum prazo? E servidor **municipal de BH** segue a mesma regra do federal?

> ## 🔴 CORRIGIDO · o texto dizia que MEI ativo NÃO impede. Impede
>
> O enunciado acima afirmava *"MEI ativo não impede abrir a ME"*. **Está errado.**
>
> > *"**Se ele tiver um MEI ativo, ele não pode ter uma sociedade em outro CNPJ.** O MEI só pode ter um CNPJ ativo, que é o dele mesmo."*
>
> ### 🔑 Mas a dobra é o que decide o produto: proibido ≠ bloqueado
>
> > *"O problema é que às vezes **ele vai conseguir abrir a empresa. Porque a Receita deixa você correr o risco.** Ela não vai te travar falando 'opa, você já tem um CNPJ aberto'. **Não, ele vai deixar você abrir.** Só que ele vai te dar a condição de **desenquadrar o MEI**."*
>
> **O Pedro perguntou se travamos. Ele foi contra:**
>
> > *"Se você constatar isso, **você já trava o cara num problema** que vai gerar um processo administrativo pra mim executar. Agora, se eu estiver olhando na perspectiva de ganhar… **a gente faria o desenquadramento do cara**."*
>
> ### ✅ DECIDIDO
>
> | | |
> |---|---|
> | **Não travamos** a abertura | 🔑 travar cria problema onde o órgão não cria |
> | **Avisamos**, com aceite | *"que te coloca no risco de desenquadrar o seu atual MEI"* |
> | O desenquadramento | vira **serviço** nosso, não obstáculo |
>
> > **Léo:** *"Já fazendo essa informação, **já se resguarda** — 'ninguém me avisou'."*
>
> ### ✅ Servidor público: confirmado como estava
>
> > *"Servidor público fica muito vedado… **ele pode ser sócio cotista, mas não pode administrar.**"*
>
> Então entra como **código 22**, nunca 49. ⏳ Servidor **municipal de BH** não foi perguntado.

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

> ## ✅ RATIFICADO · é individual, e o conserto está certo
>
> > **Pedro:** *"Como o motor fazia? Soma os dois e aplica o CLT de um só."*
> > **Léo:** *"**Ele faz individual.** Se igual o primeiro lá, que ele já tirava oito, nove mil, ele não gera INSS — **mas eu teria que gerar o INSS do outro.**"*
> >
> > *"Quem já atinge o teto não tem obrigatoriedade de fazer o recolhimento do INSS, porque já atingiu a contribuição máxima."*
>
> ✅ Os **R$178,31** do sócio sem CLT estão certos, e zerar a guia inteira era erro nosso.
>
> ### 🆕 E ele acrescentou como o app descobre isso
>
> O motor precisa saber que existe CLT por fora — e isso **o cliente tem que declarar**:
>
> > *"Ele vai ter que informar 'eu já contribuo em algum lugar, eu já sou contribuinte do INSS'. Aí automaticamente **ele teria como opção não contribuir, seria à toa**. Ou ele põe o valor e eu não gero."*
>
> ⚠️ **Campo de coleta que hoje não existe na tela:** *"já contribuo ao INSS em outro vínculo — valor"*. Sem ele o motor cobra INSS de quem já bateu o teto.

## B2 · 🟡 Pró-labore declarado e não pago

**O caso — "Marta, artista plástica", sócia única.** Em 3 competências ela **declarou** o pró-labore e **não pagou**, por caixa apertado.

**Onde apareceu.** Foi desenhado de propósito, para testar a glosa.

**Por que apareceu.** O Fator R é **regime de caixa**: declarado e não pago não conta. Se a Receita cruzar eSocial com PGDAS-D, é glosa, reclassificação de ofício para o Anexo V, recálculo de todas as competências, Selic e multa. Nosso motor separa os dois campos e não conta o não pago.

**A pergunta:** na prática, esse cruzamento acontece? E o que se faz quando o cliente já declarou e não pagou — paga atrasado e conta, ou perdeu a competência?

> ## 🔴 RESPONDIDO · e a resposta é mais branda do que supúnhamos
>
> Nós tínhamos desenhado o pior cenário: glosa, reclassificação de ofício, recálculo de tudo. **Não é o que acontece.**
>
> > *"Na verdade, **ele manteria o fator**. Ele pode até não pagar… **ele vai continuar usufruindo do Fator R, sem problema nenhum.** As dívidas vão continuar."*
>
> **O que acontece de verdade é a exclusão, e ela tem calendário:**
>
> > *"Mas ele vai sair do Simples se ele não pagar lá na época. Porque gera um **termo de exclusão**: 'você não pagou essas competências do INSS. Se você não regularizar, não fizer um parcelamento, você vai ser excluído do Simples'. **Então ele vai ter que regularizar aquilo de qualquer jeito.**"*
>
> ### 🆕 E aqui veio um fato novo que muda o nosso calendário
>
> > *"Hoje a gente vai ter **dois períodos de regularização: setembro e março**. Antes era a cada 12 meses, **hoje vai ser a cada seis meses.**"*
>
> 🔴 **O vigia fiscal precisa saber disso.** Não é uma janela anual, são duas.
>
> ### ✅ O que a casa faz
>
> > **Pedro:** *"Da parte nossa continua a operação normal, só que a gente tem na nossa página de guias as guias atrasadas, e a pessoa sabendo que está rendendo juros e multa."*
> > **Léo:** *"E ela vai ter que regularizar em algum momento."*
>
> 🔑 **Não retificamos o passado para "limpar" o Fator R.** *"Não necessariamente eu preciso voltar lá nos meses que não pagou e tirar o pró-labore."*

## B3 · 🟡 Abriu em novembro, e a primeira obrigação anual é em março

**O caso — três empresas abrem em nov/2025, dez/2025 e out/2026.** A conta real abriu em **12/12/2025** e entregou DEFIS do **ano-calendário 2025 inteiro**, transmitida em 08/02/2026.

**Onde apareceu.** No recibo real da DEFIS.

**Por que apareceu.** **19 dias de empresa geram uma obrigação anual completa.** Para quem abre em novembro ou dezembro, a primeira obrigação anual cai poucas semanas depois — e o cliente ainda nem entendeu o que é DAS.

**A pergunta:** confirma que a empresa aberta em dezembro declara o ano-calendário inteiro? E o que exatamente se informa do período anterior à existência dela?

> ## 🔴 CORRIGIDO · ela NÃO declara o ano inteiro
>
> Esta estava na nossa tabela de *"já respondido por pesquisa, não perguntar de novo"*. **A pesquisa errou, e ele corrigiu:**
>
> > *"Eu acho que deve estar havendo alguma confusão. Quando a empresa abriu ali, 12 de 12, **eu vou transmitir essa declaração com 12 de 12 como data inicial. Eu não transmito ela com 1 de 1 de 2025.** Então a minha declaração vai ser **de abertura**."*
> >
> > *"O sistema vai me permitir colocar 12 do 12. **Ele não me permite colocar 11 do 12.** Ele é só a partir da abertura."*
>
> 🔑 **A obrigação existe com 19 dias de empresa — isso estava certo.** O que estava errado é *o que se declara*: o período é **da abertura ao 31/12**, não o ano-calendário inteiro. Não se informa nada do período anterior à existência da empresa, porque **o sistema não aceita**.
>
> ✅ **Nos anos seguintes**, aí sim é o ano inteiro: *"as próximas, ele vai considerar o ano inteiro, se a empresa tiver ficado do primeiro dia do ano até o último."*
>
> ### 🆕 E o caso de EXTINÇÃO, que não estava mapeado
>
> > *"Se ela extinguir: mantenho a data inicial e paro ela na última data de existência. **Só que a extinção eu tenho que mandar no mesmo ano** — até o **último dia útil do mês seguinte** ao fechamento."*
>
> Exemplo dele: baixa em 16/09 → entrega até **30/10**.
>
> ⏳ **Com uma exceção que ele não confirmou:** *"se essa empresa sofre a extinção de janeiro a abril, ela entrega até o último dia de junho. **Tem que avaliar essas datas.**"* ⇢ **P4**

## B4 · 🟡 Onze meses presos no Anexo V depois de corrigir

**O caso — "Bruno, dev".** Fatura R$18.000/mês. 🔑 **O nosso automático sugeria R$5.400; ele desligou e fixou o mínimo**, avisado de que isso o derrubaria. Cai no Anexo V. Em setembro reconsidera e religa — e **só volta ao Anexo III em agosto do ano seguinte**.

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

> ## 🆕 RESPONDIDO · TEM como acelerar, e a tabela acima estava incompleta
>
> A linha do tempo mostrava 11 meses presos como se fossem inevitáveis. **Não são.**
>
> > *"Ele pode aumentar o pró-labore dele de uma forma que **ele já caia para os 3 de uma forma mais rápida**. Só que o que ele deixou de pagar anterior, ele paga agora."*
> >
> > *"Quanto que eu preciso para a minha média dar 28? **Eu preciso recolher um salário de 7 mil** e já teria que ir lá e informar 7 mil, que aí **daqui pra frente, próximo mês, eu já regularizava ele pro Anexo 3**."*
>
> 🔑 **A "paulada" devolve o Anexo III no mês seguinte**, em vez de esperar a janela rolar. É exatamente o que o nosso piloto já calcula em `paraVirarJa`.
>
> ⚠️ **Com um limite que ele apontou:**
>
> > *"Aí o teto do INSS é oito e tanto. **Não compensa nem ele** [subir demais]. Ele consegue gerar um salário maior, mas o INSS fica limitado nos oito mil. **Aí o que pesa vai ser o imposto de renda.**"*
>
> ### 🔴 E aqui ficou uma divergência que NÃO fechei a favor dele
>
> Ele concluiu que a paulada **compensa sempre**: *"perto do cara faturar 18 mil, para ele regularizar, **compensa demais**"*, calculando `11% × 43.000 = R$4.730` de cabeça.
>
> **Essa conta deixa duas coisas de fora**, e eu recomputei no motor:
>
> | Pró-labore de R$46.969 num mês só | |
> |---|---:|
> | INSS — **travado no teto** | R$ 932,31 |
> | IRRF | **R$ 11.751,36** |
> | **Guia do mês, cheia** | **R$ 12.683,67** |
> | *menos* a guia que ele já pagaria no mínimo *(R$1.621 → R$178,31)* | − R$ 178,31 |
> | **Custo extra da paulada** | **R$ 12.505,36** |
> | Economia no DAS | R$ 1.629,00/mês |
> | **Saldo** | **− R$ 10.876,36** |
>
> 🔴 **Correção de 17/09, e é de COERÊNCIA, não de cálculo.** Esta tabela dizia saldo **− R$10.311,02**, que é o saldo da tabela do item **A6** logo adiante — e as duas usam **bases diferentes**. Aqui a comparação é contra quem vinha pagando **o mínimo de R$1.621** (é o cenário que o contador descreveu); lá é contra quem paga **o sustentável de R$5.400** (é o que o piloto faria). Cada número estava certo sozinho; a tabela é que não fechava com ela mesma. Agora **a base está escrita em cada linha**, que é o que faltava.
>
> O teto do INSS faz o custo ser **menor** do que ele calculou (R$932 e não R$4.730); o **IRRF**, que ele não contou, faz ser **muito maior**.
>
> 🔑 **O que quebra a conta é concentrar num mês**, por causa da progressividade do IRRF. **Diluir em 3 ou 4 meses** mantém o INSS no teto e derruba o IRRF — o Pedro chegou a propor isso e ele descartou sem fazer a conta. ⇢ **P16, a simular**
>
> ✅ **Correção legítima que ele fez, e que vale para a redação:** os R$41.569 de déficit são **base de pró-labore**, não desembolso de imposto. *"Ele não vai gerar um débito de 40 mil. Aquela é a base dele pra calcular 11%."*

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

> ## ✅ RATIFICADO
>
> > **Pedro:** *"Nosso motor calcula multa de 0,33 ao dia até o teto de 20%, mais juros da Selic acumulada, mais 1% no mês de pagamento."*
> > **Léo:** *"**É isso mesmo.**"*
>
> ✅ A fórmula passa. E ele ratificou o **22/06** da tabela: dia 20 em sábado, o DAS **prorroga** — mesmo dia em que o DARF antecipa.
>
> ⏳ **A fonte da Selic continua sendo a lacuna `L9b`**: a arquitetura está certa (entra por parâmetro), falta plugar o Ato Declaratório mensal da RFB.

## B6 · 🟡 Meses seguidos sem faturar

**O caso — três empresas** têm 5 e 6 meses zerados; a conta real teve 3 seguidos.

**Onde apareceu.** No padrão real de quem presta serviço: fatura em soco, com seca no meio.

**Por que apareceu.** Vimos em produção que **mês sem faturar não pausa a obrigação**: o PGDAS e a DCTFWeb são transmitidos igual. E descobrimos que o eSocial tem "sem movimento" (S-1299 com flag), enviado **só no primeiro mês** — não se repete todo janeiro.

**A pergunta:** confirma que o PGDAS zerado é transmitido igual? E o "sem movimento" do eSocial se aplica mesmo quando a empresa continua pagando pró-labore, ou só quando não há fato gerador nenhum?

> ## ✅ RATIFICADO · e com uma multa nova que não tínhamos
>
> > **Pedro:** *"Todo mês eu tenho que entregar aquilo, mesmo sem movimento?"*
> > **Léo:** *"**O PGDAS tem que mandar todo mês. Se tem ou não tem pró-labore.** Se ele não tem nota emitida, manda sem movimento. Se ele tem nota, manda um faturamento."*
>
> ✅ Mês zerado transmite igual, e **independe** de haver pró-labore.
>
> ### 🔴 O fato novo: o PGDAS zerado passou a gerar multa
>
> > *"**Antigamente não gerava multa. Hoje em dia, em 2026, ele passou a gerar multa de R$50, se não me engano, por mês.**"*
>
> ⏳ Mesma incerteza da DEFIS — ele mesmo hesitou no valor. ⇢ **P3**
>
> 🔑 **E isso reforça a arquitetura do ciclo:** a obrigação acessória não é opcional nem em mês seco, e agora tem preço.
>
> ✅ **A separação DAS × DARF que ele explicou, e que vale para a tela:**
>
> > *"É mais fácil ele **não ter o DAS** — porque não tem faturamento — **e ter o INSS**, do que o contrário. O PGDAS zerado, ele vai ser zerado. **É normal.**"*

## B7 · 🟡 Quatro sócios — o caso extremo do IRRF

**O caso — "Cléber, aluguel de equipamentos", 4 sócios**, 25% cada.

**Onde apareceu.** É a empresa onde o erro do A1 fica mais caro: R$3.617,19 contra R$1.540,00.

**Por que apareceu.** É o teto do nosso escopo (1 a 4 sócios) e o caso onde agregar bases causa o maior estrago.

**A pergunta:** com 4 sócios, existe alguma obrigação acessória extra que não exista com 1 ou 2? Alguma coisa muda na DCTFWeb ou no eSocial?

> ## ✅ RESPONDIDO · nada muda
>
> > *"**O que vale para um sócio a mais, vale para quatro. Vale para todo mundo.** Às vezes não pode ter informação de pró-labore de um sócio, mas vai ter de outros dois. **Mas a informação é a mesma.**"*
>
> ✅ Nenhuma obrigação acessória extra. O que muda é só o **volume**: *"quatro eventos de remuneração e quatro de pagamento no eSocial, um por sócio"*, transmitidos **individualmente por CPF** no mesmo CNPJ — o que ele confirmou expressamente.
>
> ✅ **O teto de 4 sócios do nosso contrato não esbarra em nada fiscal.** É limite comercial nosso, não legal.

## B8 · ⚪ A data de admissão do sócio, antes de a empresa existir `#6`

**O caso.** Na conta real, a `dataAdmissao` do sócio é **01/12/2025** — onze dias **antes** de a empresa existir (12/12/2025).

**Onde apareceu.** Lendo o cadastro na plataforma.

**Por que apareceu.** É a data que decide a **competência do primeiro pró-labore**. Se for erro deles, não podemos copiar.

**A pergunta:** é escolha ou erro? Qual data deve constar?

> ## ✅ RESPONDIDO · é a data da ABERTURA, e o deles é erro
>
> > **Léo:** *"Eu considero **data de admissão a mesma data da abertura**."*
> > **Pedro:** *"A data da abertura é a data de quê?"*
> > **Léo:** *"**A data da constituição, o dia que o CNPJ vai sair.**"*
>
> E sobre o `01/12` da conta real:
>
> > *"Ele apontou ali: data de admissão, dia 12 do 12. **Faz mais sentido.** Eu acho até engraçado o eSocial aceitar isso."*
>
> ✅ **Não copiamos.** Data de admissão = data de saída do CNPJ. *"Evita questionamento."*

## B9 · ⚪ "Anexo: 5" e 6,00% na mesma linha `#7`

**O caso.** Uma nota da conta real traz o campo `anexoEscolhido: 5` e, no mesmo documento, *"o percentual total de impostos é de aproximadamente 6,00%"*.

**Onde apareceu.** Na leitura da nota fiscal.

**Por que apareceu.** 6% é Anexo **III**. Nós já concluímos que o "5" é **id interno do sistema deles**, não o anexo — e confirmamos por duas vias independentes. Mas é confirmação que vale ter.

**A pergunta:** faz sentido um sistema guardar "anexo 5" para uma empresa tributada a 6%? Existe leitura em que "anexo de origem" e "anexo efetivo pós-Fator R" sejam campos diferentes?

> ## ✅ RESPONDIDO · e a resposta corrige o VOCABULÁRIO do produto inteiro
>
> Não era id interno nem bug. **São dois campos diferentes mesmo, e ele nomeou a distinção:**
>
> > *"A **atividade** fica enquadrada no Anexo 5. **Ela é do 5** — mas quando ela recebe o pró-labore, **ela recebe o benefício de tributar no Anexo 3**."*
> >
> > *"Não necessariamente o seu anexo de atividade é o 3. **O seu anexo é o 5, mas você recebe o benefício fiscal de ser tributado na alíquota menor**, conforme o Anexo 3."*
>
> ### 🔴 E isso derruba como escrevemos as coisas
>
> Ele corrigiu isso **duas vezes** na reunião: **não se "cai para o Anexo V"**.
>
> | ❌ Como dizemos hoje | ✅ Como é |
> |---|---|
> | "cai para o Anexo V" | **perde o benefício** do Anexo III |
> | "sobe para o Anexo III" | **passa a ter** o benefício |
> | "empresa do Anexo III" | empresa **do Anexo V** tributada pelo III |
>
> ⚠️ **Não está errado no cálculo — está errado no nome.** E é o nome que vai para a tela do cliente, para a copy e para este documento inteiro. ⇢ **P13**

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

> ## ✅ RESPONDIDO EM PARTE · quase automático, mas alguém preenche
>
> > *"**Basicamente, a dispensa sim, é praticamente automática.** [Mas] tem que ter o comando para poder entrar lá na prefeitura e fazer a emissão dos alvarás."*
>
> **E os dados que faltam são poucos:**
>
> > *"Com os dados que a gente já vai ter da constituição, a gente consegue puxar. **A maior parte do que tem no CNPJ já vai constar lá.** Vai ter alguma coisinha, um campo ou outro a mais."*
>
> ⚠️ **Ele declarou que a informação pode estar velha:**
>
> > *"Agora eu não sei te falar como está hoje. Isso há um tempo atrás, quando eu executava mesmo, **você tinha que digitar todas as informações**. **Seria bom a gente validar com a Isabela quais são os campos necessários ali.**"*
>
> ⏳ **Fica para a Izabela:** a lista exata de campos. ⇢ **P6**
>
> ⚠️ **A taxa de R$168 e o prazo de vistoria não foram respondidos.** 🔑 E veja a coincidência que ele resolveu por outro caminho: os **R$168** que o Pedro tinha como taxa da Prefeitura são, quase exatos, **11% do salário mínimo de 2025** — ver `A4`. Vale reconferir de qual das duas coisas era essa guia.

## C2 · 🟡 A inscrição municipal (CCM) nasce sozinha ou se pede?

**O caso.** A CCM não vem no pacote da constituição: no nosso mapa de dados ela é **"órgão, depois do CNPJ"**, e está marcada como **ninguém combinou quem entrega**.

**Onde apareceu.** No mapa de dependência de dados entre o time do dev e o app interno.

**Por que importa.** Já sabemos que **empresa aberta depois de dez/2025 emite NFS-e sem informar a inscrição** — isso destravou a primeira nota. Mas também sabemos que **inscrição municipal irregular derruba a emissão pela API**. Ou seja: não trava o começo, mas trava depois, e não sabemos quando.

**A pergunta:** a CCM é gerada automaticamente com o CNPJ em BH, ou é requerimento à parte? Em quanto tempo? E o que caracteriza "irregular" a ponto de derrubar a emissão de nota?

> ## ✅ RESPONDIDO · em BH nasce sozinha
>
> > *"**Aqui em BH, a inscrição municipal já é gerada.** Na hora que você faz a sincronização com a prefeitura, **ele já gera essa inscrição lá**."*
> >
> > **Pedro:** *"Eu não tenho que entrar com um pedido pra gerar isso?"* → **Não.**
>
> ✅ **Não é requerimento à parte em BH.** Sai na sincronização.
>
> ⚠️ **E ele deu o contraexemplo que delimita o nosso gate de cidade:**
>
> > *"Tem prefeitura que **não** gera. Na prefeitura de **Betim**, dependendo da atividade, ele não gera a inscrição e eu tenho que ir lá no site da prefeitura e solicitar. **Mas BH já é mais tecnológico.**"*
>
> 🔑 **Isso justifica o gate BH/MG por um motivo novo:** não é só proximidade, é que **o fluxo automático não sobrevive à troca de município**. ⏳ O que caracteriza "irregular" não foi respondido.

## C3 · 🔴 O cliente pode faturar antes das licenças?

**O caso.** A **nossa própria minuta** obriga o cliente a *"não exercer atividade empresarial antes da conclusão do registro da empresa e da obtenção das licenças e alvarás"*.

**Onde apareceu.** Lendo o contrato ao montar a linha do tempo.

**Por que importa.** Se o alvará leva dias e o cliente já tem CNPJ e certificado, ele **consegue** emitir nota — e estaria descumprindo o que assinou com a gente. Isso muda a competência da primeira nota e pode virar problema do cliente.

**A pergunta:** na prática, prestador de serviço em BH pode emitir nota entre o CNPJ e o alvará? A cláusula é proteção jurídica nossa ou regra que o cliente precisa mesmo cumprir? E se ele emitir antes, qual o risco real?

> ## ✅ RESPONDIDO · o que trava a nota é a INSCRIÇÃO MUNICIPAL, não o alvará
>
> > **Pedro:** *"Um alvará de bombeiro, já talvez não [impeça]?"*
> > **Léo:** *"**Não. Aí você pode tirar isso depois.** Não necessariamente você precisa ter tudo isso emitido para poder emitir uma nota, depois que o CNPJ já está autorizado."*
>
> ✅ **A sequência que libera o faturamento ficou clara:**
>
> ```
> CNPJ  →  inscrição municipal  →  ✅ pode emitir nota
>                                   alvará e bombeiros podem vir depois
> ```
>
> > **Pedro:** *"A inscrição municipal é necessária para a emissão de nota?"* → *"É."*
>
> E confirmado contra a conta real: *"o meu mesmo acho que chega um pouco depois."* → *"É, chega depois."*
>
> ⚠️ **A cláusula da nossa minuta** — *"não exercer atividade antes da obtenção das licenças e alvarás"* — **é mais restritiva do que a prática.** Ela vira proteção jurídica nossa, não regra operacional. ⏳ Vale alinhar com a advogada para não prometer atraso que não existe.

## C4 · 🟡 A primeira competência é cheia ou proporcional?

**O caso.** A **P01** abre em **março** e não fatura nada nos dois primeiros meses. A **P03** abre em **novembro** e já fatura **R$14.000 no mês da abertura** — o motor calcula o acumulado como *receita do próprio mês × 12*, dando R$168.000 logo de cara.

**Onde apareceu.** Rodando o elenco: **14 das 18 vidas não faturam no mês da abertura**, e a exceção muda a alíquota.

**Por que importa.** Essa é a regra do art. 24 e nós a implementamos. O que não sabemos é o lado **operacional**: se a empresa abre no dia 20, a competência do mês de abertura é declarada normalmente? E se ela abre e não fatura, ainda assim transmitimos.

### 🔑 E tem um degrau no 1º mês que ninguém vê

No 1º mês não há histórico, então a lei manda **projetar**: acumulado = receita do próprio mês × 12. Isso cria um degrau logo na primeira nota:

| 1ª nota | Acumulado projetado | Faixa | Alíquota | DAS |
|---:|---:|:---:|---:|---:|
| R$ 0 | R$ 0 | 1ª | 6,0000% | R$ 0 |
| R$ 14.000 | R$ 168.000 | 1ª | 6,0000% | R$ 840,00 |
| **R$ 15.000** | R$ 180.000 | **1ª** | **6,0000%** | R$ 900,00 |
| **R$ 16.000** | R$ 192.000 | **2ª** | **6,3250%** | R$ 1.012,01 |
| R$ 30.000 | R$ 360.000 | 2ª | 8,6000% | R$ 2.580,00 |

⚠️ **Mil reais a mais na primeira nota muda a faixa da empresa inteira naquele mês.** E enquanto ela não emite nota nenhuma, não há acumulado nem guia — **14 das 18 vidas não faturam no mês da abertura**, e para elas isso não existe.

**A pergunta:** a competência do mês de abertura é declarada cheia, mesmo que a empresa só exista por 10 dias dele? Há algo de proporcional? E sobre o degrau acima: **isso é conversa que se tem com o cliente** — *"se a sua primeira nota for maior que R$15 mil, você paga uma alíquota maior neste mês"* — ou é orientação que um contador não dá? *(O cálculo já está fechado; o que queremos é a postura.)*

> ## 🔴 CORRIGIDO · a competência é CHEIA, mas a projeção ×12 estava generalizada errado
>
> **A parte que estava certa:**
>
> > *"**Considera o mês.** Mesmo que a empresa tenha aberto hoje, dia 16, **eu considero o mês fechado** para cálculo. Ele vai considerar o mês inteiro. **Ele não vai ter proporcionalidade** do faturamento, dividir por 16 dias."*
>
> ✅ Sem proporcional de dias. E mês sem faturar transmite igual.
>
> ### 🔴 O que estava errado: os R$168.000 só valem se a nota sair no MÊS DA ABERTURA
>
> > *"Se eu abri no mês 9 e faturei no mês 9, R$14 mil — eu multiplico por 12 e chego em 168. **Só que se eu tenho o segundo mês e eu não faturei no primeiro, aí eu tenho que pegar 14 e dividir por 2**, porque eu tenho o mês anterior e o meu mês atual. Aí chego na média de 7, e faço 7 × 12. **Ou seja, a minha faixa não é 168, é 84.000.**"*
>
> 🔑 **O divisor é a idade da empresa, não o número de meses com receita.** Dois meses parados e a nota no 3º: `14.000 ÷ 3 × 12`.
>
> ✅ **O motor já faz isso certo** (`rbt12De`, regra `proporcional`). **O que estava errado era a narrativa da P03**, que apresentava os R$168.000 como se fosse a regra geral do 1º mês. ⇢ **corrigido no Bloco D**
>
> ### 🆕 E ele deu de graça uma TESE COMERCIAL que não estava em nenhum documento nosso
>
> > *"Por isso que eu sempre falo: **se você tem tempo pra se programar, abre agora.** Porque isso vai te dar uma economia por alguns meses… ao invés de eu já começar na faixa de 160, **eu mantenho os meses. Quando eu começar a faturar, essa média fica diluída.**"*
> >
> > *"Quanto mais tempo aberto esse CNPJ e eu faturar isso depois, é melhor, **porque eu perco uma média menor por mais 12 meses**."*
>
> 🔑 **Abrir o CNPJ antes de precisar dilui a média e segura a alíquota nos 12 primeiros meses.** É argumento de venda **e** é a regra do art. 24. ⚠️ Com prazo de validade declarado por ele: *"esse benefício acaba em algum momento, depois de 12 meses."*
>
> ⏳ **A postura sobre o degrau** (conversar ou não com o cliente) **não foi respondida.**

## C5 · 🟡 Quem escritura o Livro Caixa, e com que frequência?

**O caso.** A pesquisa confirmou que **o Livro Caixa basta** para o Simples, salvo se distribuir lucro acima da presunção — aí vira escrituração completa.

**Onde apareceu.** Na pesquisa da DEFIS, em 15/09.

**Por que importa.** É obrigação que **ninguém no nosso desenho está fazendo**. Não está em nenhuma das 10 obrigações do nosso ciclo, e não tem tela.

**A pergunta:** o Livro Caixa é obrigação nossa ou do cliente? Se é nossa, com que periodicidade se escritura, e o que ele precisa nos mandar? E a partir de quando a distribuição de lucro obriga a contabilidade completa, na prática?

> ## ✅ RESPONDIDO · não é do nosso perfil, e some em 2027
>
> Ele explicou que Livro Caixa é instrumento de **pessoa física autônoma**, não de PJ do Simples:
>
> > *"Livro Caixa normalmente é cartório, médico… o cara é autônomo, faz várias consultas, mas não tem uma clínica nem formalização de um CNPJ. **É o meu fluxo de caixa normal**, e ele é tributado na pessoa física."*
>
> > **Pedro:** *"Para a nossa persona de prestador de serviços, não é obrigação nossa?"*
> > **Léo:** *"**E também não é obrigação nossa.** Só se pegasse uma regulamentada."*
>
> ✅ **Fica fora do ciclo das 10 obrigações.** Não precisa de tela.
>
> ### 🔴 E aqui apareceu a mudança de 2027 mais escondida das quatro
>
> > *"O Livro Caixa vai existir. **Mas o regime de caixa, ele vai sumir.** Hoje a gente tem lá no Simples Nacional competência e caixa. **A partir de 2027 não vai existir mais regime caixa.**"*
>
> Ele explicou a diferença e o risco da transição:
>
> > *"Se ele tinha um recebimento de 50 mil no mês, mas tem 2 milhões e meio **a receber**, chegar lá em dezembro **ele tem que tributar 2 milhões e meio**. Porque em 2027 vai acabar o caixa."*
>
> ✅ **Decidido, e é decisão de simplificação:** *"eu nem sugeriria para o cara que existe isso. **Vai com competência que vai dar certo.**"* Não oferecemos regime de caixa.
>
> ⚠️ 🔴 **Mas o nosso Fator R é regime de caixa** (só conta o que foi **pago**). Precisa confirmar se essa mudança o atinge. ⇢ **P5**

## C6 · 🟡 Retificação: o que dá para desfazer, e até quando

**O caso.** Uma nota emitida com valor errado, ou a receita de uma competência já apurada que muda.

**Onde apareceu.** É um processo inteiro do nosso board (**P6 · cancelar, corrigir ou substituir nota**), e ele tem **4 perguntas abertas** que não são de tela.

**Por que importa.** 🔑 Já sabemos uma coisa dura: para optante do Simples, **a regra E0061 do leiaute nacional proíbe substituir nota por erro de valor**. Então o caminho é outro, e não sabemos qual.

**A pergunta:** nota com valor errado de empresa do Simples — cancela e emite outra, ou há prazo/limite? E o PGDAS-D já transmitido: retifica-se como, e há custo ou risco? Se o imposto já foi pago a maior, como se recupera?

> ## ✅ RESPONDIDO · e ele trouxe uma terceira via que não conhecíamos
>
> **Nós tínhamos duas opções na cabeça: alterar (proibido) ou cancelar. Existe uma terceira, e ela é melhor:**
>
> > *"Lá na Prefeitura de Belo Horizonte, **se eu clicar na opção de substituir, ele já cancela a nota válida e já subscreve**, já muda o status. **De imediato, sem custo, sem processo burocrático.**"*
>
> **Por que as duas existem:**
>
> > *"A substituição **me exige informar os mesmos valores de uma nova nota**. Mas às vezes eu só quero cancelar. Por isso que existem as duas opções."*
>
> ⚠️ **Carta de correção não serve para valor:**
>
> > *"Emitir uma carta de correção para corrigir um valor que **altere imposto** — não. **É mais dados cadastrais.**"*
>
> ### ✅ DECIDIDO — não existe "editar nota" no produto
>
> | Ação | Existe? |
> |---|---|
> | **Cancelar** | ✅ |
> | **Substituir** *(cancela + reemite num passo, onde a prefeitura permite)* | ✅ em BH |
> | **Alterar / editar** | ❌ nunca |
>
> ### 🔑 E a janela de prazo FECHOU
>
> Combinando com o que já sabíamos da Contabilizei (dia 5, R$21,90 de reabertura):
>
> ```
> até o dia 5     →  cliente cancela/substitui livre
> dia 6           →  o robô roda
> dia 10 ou 12    →  ⏳ limite para alteração PAGA (a definir)
> dia 15          →  entrega da obrigação acessória
> dia 20          →  vencimento das guias
> ```
>
> > **Léo:** *"Se eu der pro cara 5 dias depois, em tese **eu só posso rodar o robô no dia 6**. **Se você processou antes, a culpa vira minha.**"*
>
> ⚠️ **E ele explicou por que a Contabilizei cobra a reabertura:** *"a ferramenta dele começa a fazer a transmissão a partir do dia 6. Quando ele cobra a reabertura… **ele vai ter que recalcular**."* Não é taxa arbitrária — é retrabalho real.

> ## ✅ P7 FECHADO EM 17/09 — e não era "10 ou 12", eram os dois
>
> **Decisão do Pedro:** a competência anterior aceita cancelamento de nota **até o dia 10**, e a apuração do DAS roda **no dia 12**.
>
> ```
> até o dia 10    →  cliente cancela/substitui a nota da competência anterior
> dia 11          →  a janela fecha. Cancelar vira atendimento humano
> dia 12          →  a casa roda a apuração
> dia 15          →  entrega da obrigação acessória
> dia 20          →  vencimento das guias
> ```
>
> 🔑 **Os dois dias de folga são a regra, não sobra.** Nada é apurado enquanto a janela do cliente está aberta, que é exatamente o princípio que o Leonan enunciou: *"se você processou antes, a culpa vira minha"*. Nós damos **10** e rodamos no **12**, mais folgado que a régua da referência.
>
> ### 🔴 E isso destravou três passos de processo que estavam vermelhos
>
> O **P6.15 · P6.16 · P6.17** existiam para desenhar o que acontece quando a receita de uma competência **já apurada** muda: refazer apuração, retificar declaração, e mover RBT12, Fator R, anexo e até a mensalidade do cliente, tudo para trás.
>
> **Com a janela travada antes da apuração, esse caminho deixa de existir.** Não há dominó retroativo porque nada foi apurado ainda. Os três saíram do vermelho, e o que sobrou em cada um é trabalho de tela, não de regra.
>
> ⚠️ **O caso raro continua existindo** e passou a ter dono humano: cancelamento fora do prazo não é botão, é atendimento, e aí sim valem as quatro perguntas de retificação que estavam abertas no P6.16 (PGDAS-D por API ou e-CAC · DAS pago a maior · avulso ou incluso · quem assina).

## C7 · 🟡 Certidões negativas: quando o cliente vai precisar

**O caso.** No nosso catálogo, emitir CND é um serviço. Na conta real, o cliente precisou de **declaração para abrir conta no banco** logo no começo.

**Onde apareceu.** No catálogo de serviços e no estudo da conta real.

**Por que importa.** É o serviço mais pedido nos primeiros 30 dias e não sabemos a periodicidade nem a validade. **Pela API:** federal via InfoSimples (`Emissão de CND`); estadual e municipal seguem sem caminho mapeado.

**A pergunta:** quais certidões o cliente novo precisa nos primeiros meses, quais têm validade curta, e qual é a que mais gera pedido? Vale emitir por antecipação ou só sob demanda?

> ## ✅ RESPONDIDO · cliente pequeno quase não pede
>
> > *"A **CND**, o cara que é pequeno, **ele não precisa muito de CND não**. O CND é tranquilo, ele não vai precisar tanto."*
>
> E confirmou que é serviço à parte, com coleta extra:
>
> > **Pedro:** *"É um serviço adicional que, pra fazer, a gente vai precisar entrar em contato com esse cara, precisar de muito mais do que só o que a gente tem no aplicativo."*
> > **Léo:** *"**Isso aí com certeza.**"*
>
> ✅ **Só sob demanda.** Não vale emitir por antecipação, e não entra no core.
>
> 🔑 **O que ele valorizou no lugar** foi outra coisa: *"mas é **monitoramento de CNPJ** mesmo"* — o que empurra o esforço para o `C9`, não para cá.

## C8 · 🔴 Dependentes de IRRF — ninguém coleta

**O caso.** O cálculo do IR do sócio admite dedução por dependente, e **o nosso app não pergunta**. No mapa de dados isso está marcado como *"ninguém produz, não existe em lugar nenhum"*.

**Onde apareceu.** No mapa de dependência, e de novo agora ao revisar o que o motor consome.

**Por que importa.** Hoje calculamos **sem dependentes** para todo mundo — o que cobra a mais de quem tem. ⚠️ E como o redutor de 2026 zera o IR de boa parte das nossas personas, pode ser que não mude nada no nosso escopo. Não sabemos.

**A pergunta:** no perfil dos nossos clientes (pró-labore em torno de 1 a 3 salários mínimos), declarar dependentes muda alguma coisa depois do redutor? Vale coletar, ou é campo que só gera trabalho?

> ## ✅ RESPONDIDO · não coletar está certo
>
> > **Pedro:** *"A gente pode deixar travado que não vai ter dependente?"*
> > **Léo:** *"**O dependente é muito importante quando ele tem funcionário.** No pró-labore, não."*
> > **Pedro:** *"Então aqui pode deixar setado que não tem mesmo, da forma que a gente está fazendo."*
> > **Léo:** *"**Pode.**"*
>
> ✅ **Fecha sem pendência.** Calcular sem dependentes está correto para o nosso escopo, e o campo não precisa existir na tela.
>
> ⚠️ **Com validade declarada:** a resposta vale porque **não temos folha de colaborador**. Se a folha entrar no escopo, o dependente volta — e aí é do **empregado**, não do sócio.

## C9 · 🟡 O domicílio eletrônico, e quem lê por ele

**O caso.** Na conta real achamos uma **intimação não lida** no DTE do cliente.

**Onde apareceu.** Na varredura da conta do concorrente, em 13/09.

**Por que importa.** É por ali que chega o **Termo de Exclusão do Simples**, e o cliente não olha. **Pela API:** o InfoSimples tem `ECAC / Caixa Postal` — então **conseguimos ler**. O que não sabemos é a obrigação e o prazo.

**A pergunta:** qual o prazo de ciência tácita no DTE-SN, e o que muda se perdermos uma intimação? Monitorar isso é obrigação do contador responsável ou cortesia?

> ## ✅ RESPONDIDO · é cortesia por norma, e necessidade por operação
>
> **A postura dele foi clara, e vale citar inteira:**
>
> > *"Essa é a maior dor que os caras sentem hoje. **Os caras acham que a contabilidade é financeira. A contabilidade não é financeira. Eu não tenho que ficar te avisando.** Eu te aviso só pra ciência mesmo."*
> >
> > *"Se eu tiver esse aviso, é pra eu falar: 'cara, aqui, você não pagou, isso pode te gerar um problema maior lá pra frente'. **O cara vai se sentir satisfeito se ele receber essa informação.**"*
>
> 🔑 **Então monitorar não é obrigação — é diferencial.** E ele explicou por que não faz hoje:
>
> > *"Eu acho que eu tenho que ficar lá consultando o CNPJ todo mês? **Se eu tivesse uma ferramenta que fizesse, sem problema.** Eu mandaria e disparava isso por e-mail. **Mas eu não tenho uma ferramenta adaptada hoje, apesar dela existir.**"*
>
> ### 🔑 O ganho de escala que ele descreveu é o argumento do produto
>
> > *"Existem aplicativos que baixam, **até por API mesmo**, buscam na caixa postal e importam tudo que tiver escrito como termo de exclusão. **E ele já te dá: 30 de 2 mil receberam o termo. E eu só ataco os 30. Eu não preciso visitar os 2 mil.**"*
>
> ### ⚠️ E o timing importa mais que o aviso
>
> > *"O cara recebeu o termo lá em março. Se eu notificar em abril: 'opa, tranquilo, o cara me avisou'. **Mas se eu avisar lá em agosto, setembro, aí ele fala: 'pô, mas vocês estão me avisando agora'.**"*
>
> ✅ **Decidido:** varredura da caixa postal **uma vez por mês**, no último dia útil, notificando **só a leva nova**. *"Com 30 dias é bom ainda."*
>
> ### 🆕 E daí saiu um upsell precificado por ele
>
> > **Léo:** *"Como é que a gente usa nesse escritório? **A mensalidade do mês vezes a quantidade de tempo que tem que regularizar.** Porque em tese eu já fiz aquele trabalho — você não pagou; se quer regularizar esse período, eu te cobro a mensalidade."*
>
> ⚠️ **E ele avisou onde a margem morre:** *"para mil clientes eu vou ter que fazer isso mil vezes. **Aí tem que ter API.** Se tiver, vai ser um serviço que eu posso cobrar até mais barato — R$199, está tudo automatizado. Aí é claro que é tudo requisição de API também, **tem que calcular o custo que vai gerar de requisição**."*
>
> 🔑 **Isto conecta com o `C9` por outro lado:** o mesmo dado que evita a exclusão do cliente é o que vende o serviço de regularização. Ver também **B2**, que fixou as duas janelas: **setembro e março**.

---

# 🅳 BLOCO D — cinco clientes, do dia 1 ao fim do contrato

> 🧭 **Para que serve na conversa.** Em vez de discutir regra no abstrato, o contador acompanha **cinco empresas** pelo tempo em que elas ficaram conosco e diz onde o que fazemos está certo, onde falta passo e onde falta pergunta.
>
> 📐 **Como ler.** Cada linha tem a data, **de quem é aquilo**, o que acontece e a dúvida ligada (⇢ **C3**, ⇢ **A1**…). Onde não há dúvida ligada, é porque está fechado.
>
> 🔴 **A coluna que mais importa nesta conversa é a do meio.** Ela separa três coisas que costumam se misturar num relato e que o senhor precisa poder julgar separadamente:
>
> | | | O que queremos do senhor |
> |:---:|---|---|
> | ⚖️ | **A lei.** Ninguém escolheu, ninguém pode mudar | **Ratificar** — está certo ou está errado |
> | 🏠 | **Nós.** Decisão ou cálculo da casa. Poderia ser diferente | **Contestar** — o senhor faria de outro jeito? |
> | 👤 | **O cliente.** Escolha dele, feita depois de ver a conta | **Nada.** Só nos diga se o escritório recusaria executar |
> | 🏢 | **Espelho da Contabilizei.** Prática do concorrente que copiamos **porque não achamos a regra**, não porque a lei manda | 🔴 **Decidir** — seguimos eles, ou fixamos a nossa? |
> | ⏳ | **Não existe ainda.** O caso aparece e o produto não responde | **Confirmar** que faz falta |
>
> 🔴 **O 🏢 é o que mais precisa da sua opinião.** São datas e cadências que **ninguém nos obrigou a adotar** — copiamos porque o concorrente faz assim e funcionou. Elas estão listadas juntas logo abaixo das personas, porque a decisão é a mesma para todas: **seguir eles, ou fixar a nossa régua em cima da deles, sempre dentro da lei.**
>
> ⚠️ **Nenhuma linha fica sem etiqueta** — um script confere isso a cada rodada, porque a primeira versão deste documento marcava a autoria em duas personas e esquecia nas outras três.
>
> 🔧 **As ferramentas, uma vez só:** `Integra-SN` apura e emite a guia do DAS e a DEFIS · `Integra-Sicalc` emite o DARF do sócio · `Integra-DCTFWeb` transmite a DCTFWeb · `Integra-Sitfis` consulta se a guia foi paga · `eSocial WS` transmite a folha do sócio (SOAP, gratuito) · `Emissor Nacional` emite a NFS-e · `InfoSimples` consulta cadastro, CND e caixa postal. Os quatro `Integra-*` são da **API Integra Contador do SERPRO**.
>
> ⚠️ **O que é real e o que é simulado:** as empresas são fictícias e as datas são de simulação. Os **cálculos são do motor**, conferido ao centavo contra recibos reais da Receita. As **regras de prazo** são de norma. O que está em dúvida está marcado.

## O ciclo que vale para todas — o mês padrão

| Dia | Quem | O que acontece | Ferramenta |
|---|:---:|---|---|
| **último do mês** | 🏠 | A competência fecha. Somamos as notas emitidas | — |
| **até o 15** | 🏢 | **Revisamos o pró-labore TODO MÊS** e transmitimos a folha do sócio. 🔴 **A cadência mensal é espelho da Contabilizei**, não exigência legal ⇢ **🏢1** | `eSocial WS` + `Integra-DCTFWeb` |
| **até o 15** | 🏠 | Vigiamos o Fator R — só nos CNAEs que podem virar Anexo V | motor |
| **até o 18-20** | ⚖️ | Emitimos o DARF do INSS e do IR do sócio. 🔑 **Antecipa** se cair em fim de semana | `Integra-Sicalc` |
| **até o 20-21** | ⚖️ | Apuramos, transmitimos o PGDAS-D e emitimos a guia do DAS. 🔑 **Prorroga** se cair em fim de semana | `Integra-SN` |
| **até o vencimento** | 👤 | 🔴 **Pagar a guia é ele.** Não temos como pagar por ele, e não existe débito automático de DAS | — |
| **na emissão da nota** | 🏠 | 🆕 **Se a empresa faturar no mês em que abriu, dispara alerta INTERNO** e a casa liga. Não é tela do cliente ⇢ **C4** | motor |
| **depois** | 🏠 | Conferimos se a guia anterior foi paga; se venceu, recalculamos com multa e juros | `Integra-Sitfis` |
| **31/03** | ⚖️ | DEFIS do ano anterior. 🔴 **Morre em 2027**, vira campo do PGDAS-D | `Integra-SN` |

🔑 **O eSocial vence ANTES do DAS.** Quem mira o dia 20 entrega 5 dias atrasado, todo mês. ⇢ **A11**

## 🎚️ E uma regra que atravessa as cinco: o cálculo automático vem LIGADO

O pró-labore é calculado e ajustado por nós **todo mês, por padrão**. O cliente não precisa entender nada disso — ele emite nota e paga guia.

Mas **ele pode desligar e digitar o próprio valor**. Se fizer isso, o app mostra **o efeito com os números dele**, não um aviso genérico: *"para seguir no Anexo III você precisa pagar pelo menos R$X este mês. Com o valor que você digitou, a alíquota sai de 6% para 15,5%, cerca de R$Y a mais por mês — e começa na competência Z."*

🔴 **Isso muda de quem é a responsabilidade, e o documento marca isso em cada linha.** Quando uma empresa abaixo **perde o benefício do Anexo III**, **não foi falha de cálculo nosso**: foi escolha dela, tomada depois de ver a conta. O único bloqueio que aplicamos é o legal — pró-labore abaixo do salário mínimo **da competência** o app não aceita. ⇢ **A4**

⚠️ **E é aqui que ele pode nos ajudar:** queremos saber se avisar e deixar passar é a postura certa, ou se em algum desses casos o escritório **recusaria** executar.

---

## 👤 P01 · Bruno, dev freelancer solo — *o que acontece quando o cliente decide contra o aviso*

**Cadastro:** desenvolvimento de software · **1 sócio** · sem emprego CLT · endereço próprio · faixa de faturamento R$10-20 mil · CNAE **6201-5/01**, dos **15 que podem virar Anexo V**. Abre em **março/2026**, fica **8 meses** conosco.

| Quando | Quem | O que acontece | Dúvida |
|---|:---:|---|---|
| **Dia 1** | 🏠 | Constituição concluída, CNPJ na mão. Emitimos a **inscrição municipal** e as **licenças**, e publicamos os documentos na plataforma | ⇢ **C1 C2** |
| **Dia 1** | ⚖️ | Certificado digital emitido pela parceira. **Sem ele o app não libera a emissão de nota** — não existe procuração na NFS-e | — |
| **Dia 1** | 🏠 | 🔄 **Perguntamos quando começar o pró-labore:** *"desde a constituição, ou a partir da 1ª nota?"*. **Default: aguardar a 1ª nota.** ⚠️ Até 16/09 nós **forçávamos** desde a 1ª competência, copiando a Contabilizei; o contador mostrou que forçar gera guia de INSS para quem não faturou ⇢ **A5 · 🏢2** | ⇢ **A3 A5** |
| mar–abr | ⚖️ | Dois meses **sem faturar**. Mesmo assim transmitimos PGDAS-D e a folha do sócio: **mês sem receita não pausa obrigação** | ⇢ **B6** |
| **mai** | 🏠 | 1ª nota: R$18.000. 🔑 **O nosso cálculo pede R$1.798 no mínimo e sugere R$2.158.** Parece pouco e não é erro: a janela tem 3 meses, a receita dela é só os R$18.000 deste mês, e ele **já tem R$3.242 de folha paga** em março e abril — dois meses sem faturar em que o mínimo saiu igual. A conta é `28% × 18.000 − 3.242 = 1.798`, e `30% × 18.000 − 3.242 = 2.158` | ⇢ **conta 7** |
| 🔴 **mai** | 👤 | **Ele DESLIGA o automático e digita R$1.621**, o mínimo legal. Quer tirar menos da empresa. Fica **R$177 abaixo** do que a conta pedia | ⇢ **A2** |
| **mai** | 🏠 | 🔑 **Nós avisamos, com os números dele:** *"para seguir no Anexo III você precisa pagar pelo menos R$1.798 este mês. Com R$1.621 a alíquota sai de 6% para 15,5%, cerca de R$1.710 a mais por mês."* Ele confirma assim mesmo | — |
| **jun** | ⚖️ | 🔴 **Cai para o Anexo V.** A janela cresce para R$36.000 de receita e o mínimo sobe para **R$5.217** *(sugerido R$5.937)*, enquanto ele segue nos R$1.621. 🔑 **A dívida cresce sozinha:** cada mês faturado sem folha proporcional aumenta o que falta no mês seguinte. A queda é da lei; **quem a provocou foi ele**, e o alerta fica registrado | ⇢ **A3** |
| **set** | 👤 | Ele reconsidera e **religa o automático**. O pró-labore volta para R$5.400 | ⇢ **A2** |
| **ago/2027** | ⚖️ | 🔴 **Só então voltaria ao Anexo III** — 11 meses pagando a mais, com a folha já certa. 🔑 **É por isso que avisamos na hora da escolha, e não depois**: o Fator R olha para trás, então quando o erro aparece na guia já é tarde | ⇢ **B4** |
| **31/03/2027** | ⚖️ | DEFIS do ano-calendário 2026 | ⇢ **A9** |
| **Total** | — | Faturou **R$108.000** · pagou **R$15.030** de DAS · **5 meses no Anexo V** | |

🔑 **É a persona que justifica o produto:** com o nosso piloto ligado desde o mês 1, ela **nunca** teria perdido o benefício do Anexo III. A diferença é de **R$6.795** no bolso do cliente — já descontado o DARF a mais que o pró-labore maior gera.

⚠️ **Esse R$6.795 é simulação nossa, não histórico.** É o mesmo motor rodando a mesma empresa com o automático ligado. Os R$15.030 de DAS acima, esses aconteceram.

---

## 👤 P03 · Rafael, filmagem de eventos — *abre em novembro, e a obrigação anual é em março*

**Cadastro:** filmagem de festas e eventos · **1 sócio** · **endereço fiscal da Legalizai** (+R$49/mês) · CNAE **7420-0/04**, **Anexo III fixo** — o Fator R não muda nada nele. Abre em **novembro/2025**, fica **11 meses**.

| Quando | Quem | O que acontece | Dúvida |
|---|:---:|---|---|
| **antes do dia 1** | 👤 | 🔑 **Ele contrata o nosso endereço fiscal** (+R$49/mês) em vez de usar o dele. Escolha dele na contratação, e é ela que define onde a empresa fica domiciliada | ⇢ **C2** |
| **Dia 1** | 🏠 | Inscrição municipal, licenças, certificado, documentos na plataforma | ⇢ **C1 C2** |
| **Dia 1** | 🏠 | 🔑 **A tela dele NÃO fala em Fator R nem em 28%.** Decisão nossa de produto: o CNAE é fixo, e sugerir esse risco seria mentir por omissão | — |
| **nov/2025** | 👤 | Já fatura **R$14.000 no mês da abertura** — emitida a 1ª nota pelo `Emissor Nacional` | — |
| **nov/2025** | ⚖️ | 🔑 No 1º mês não existe histórico, então a lei manda **projetar**: acumulado = receita do mês × 12 = R$168.000. **Não é faturamento, é projeção.** E aqui ela **não muda nada**: R$168 mil ainda está na 1ª faixa (até R$180 mil), então ele paga os mesmos **6%**. DAS de **R$840** | ⇢ **C4** |
| **jan–fev/2026** | ⚖️ | Dois meses secos. Transmitimos igual | ⇢ **B6** |
| 🔴 **31/03/2026** | ⚖️ | **DEFIS do ano-calendário 2025** — com **41 dias de empresa**. Ele mal entendeu o que é DAS e já tem obrigação anual | ⇢ **B3 A9** |
| abr–jun | 👤 | Temporada cheia: R$12k, R$19k, R$17k | — |
| **31/03/2027** | ⚖️ | DEFIS de 2026 | ⇢ **A9** |
| **Total** | — | Faturou **R$102.000** · **R$6.120** de DAS · **zero** meses no Anexo V | |

🔑 **É a única das cinco sem nenhuma decisão do cliente depois da contratação.** Tudo o que acontece com ele é ⚖️ ou 🏠 — e mesmo assim ele tem DEFIS com 41 dias de empresa. Serve para mostrar que o produto precisa funcionar para quem **não decide nada**, que é a maioria.

---

## 👤 P09 · Gustavo, eventos corporativos — *dois sócios, um com CLT, e três guias atrasadas*

**Cadastro:** organização de feiras e congressos · **2 sócios**, ambos administram · um deles tem **CLT de R$9.000**, acima do teto do INSS · 3 CNAEs secundários · **Anexo III fixo**. Abre em **setembro/2025**, fica **13 meses**.

| Quando | Quem | O que acontece | Dúvida |
|---|:---:|---|---|
| **Dia 1** | 🏠 | Inscrição municipal, licenças, certificado, documentos | ⇢ **C1 C2** |
| **Dia 1** | ⚖️ | 🔑 **O DARF sai sócio a sócio, e só depois soma.** Não é escolha nossa: o teto do INSS é **da pessoa** e a tabela do IR é progressiva **por beneficiário**. O do CLT alto não recolhe nada; o outro recolhe normal | ⇢ **A1 B1** |
| todo mês | 🏠 | ⚠️ **Mesma premissa da P11, e ela é nossa:** os dois sócios recebem **R$1.621 cada**, porque o app pergunta só o total e nós rateamos igual. Se um trabalha mais que o outro, quem assumiu o risco fomos nós | 🔴 ⇢ **A2 A3** |
| out–dez/2025 | 👤 | Escala rápido: R$12k, R$28k, R$35k no pico de confraternização | — |
| **31/03/2026** | ⚖️ | DEFIS de 2025 | ⇢ **B3** |
| **mar, abr, mai/2026** | 🏠 | 🔑 **Emitimos as três guias em dia**, dentro do prazo | ⇢ **B5** |
| **mar, abr, mai/2026** | 👤 | 🔴 **Ele paga com 14, 21 e 14 dias de atraso.** Pagar é ação dele, fora do app — não existe débito automático de DAS | ⇢ **B5** |
| | 🏠 | Detectamos o atraso na consulta de arrecadação e **recalculamos** com multa de 0,33%/dia e juros | ⇢ **B5** |
| | ⏳ | Custo do atraso: **R$393,32**, que **não teria existido**. 🔴 **O lembrete de vencimento que evitaria isso ainda NÃO está construído** — esta linha é o caso de uso dele, com número, não uma funcionalidade nossa | — |
| **jan/2026** | ⚖️ | Depois do pico de dezembro, o acumulado chega a **R$225.000** e ele **passa para a 2ª faixa** — a alíquota efetiva deixa de ser 6% e começa a subir | — |
| **set/2026** | ⚖️ | 13º mês de atividade: a regra do acumulado troca de *média × 12* para **soma dos 12**. 🔑 Troca pelo **mês de atividade**, não pela virada do ano | ⇢ **C4** |
| **Total** | — | Faturou **R$266.000** · **R$17.514** de DAS · **R$2.318** de DARF | |

---

## 👤 P11 · Cléber, aluguel de equipamentos — *quatro sócios, o caso caro*

**Cadastro:** aluguel de máquinas para escritório · 🔴 **4 sócios** — o teto do nosso contrato —, **25% cada**, todos administram · 2 CNAEs secundários · **Anexo III fixo**. Abre em **março/2026**, fica **6 meses**.

| Quando | Quem | O que acontece | Dúvida |
|---|:---:|---|---|
| **antes do dia 1** | 👤 | 🔑 **Eles decidiram ser quatro sócios com 25% cada**, todos administrando. É o teto do nosso contrato, e tudo o que vem abaixo é consequência dessa escolha societária | ⇢ **A3** |
| **Dia 1** | 🏠 | Inscrição municipal, licenças, **as 4 assinaturas dos sócios**, documentos | ⇢ **C1** |
| **Dia 1** | ⚖️ | 🔑 **Quatro pró-labores, quatro cálculos, uma guia.** É aqui que o nosso erro de 15/09 custava **R$2.077 por mês** — nós errávamos, mas a regra que nos condenava é da lei | 🔴 ⇢ **A1 B7** |
| todo mês | ⚖️ | **4 eventos de remuneração e 4 de pagamento** no eSocial, um por sócio | ⇢ **A2** |
| todo mês | 🏠 | ⚠️ **Aqui a premissa é NOSSA, não escolha dele:** assumimos **rateio igual** — R$1.621 para cada, o salário mínimo, **R$6.484 de folha por mês** — porque o app pergunta só o total. Se o trabalho for desigual, o risco é nosso de ter assumido | 🔴 ⇢ **A2 A3** |
| todo mês | ⚖️ | 🔑 **E é o piso que manda aqui, não o Fator R.** Sendo Anexo III fixo, o pró-labore não defende alíquota nenhuma: os R$6.484 saem porque cada sócio é segurado obrigatório, não porque a conta pediu. **A folha vira mais da metade do faturamento dela** | 🔴 ⇢ **A4** |
| **31/03/2027** | ⚖️ | DEFIS de 2026, com os **rendimentos de cada sócio** discriminados | ⇢ **A9** |
| **Total** | — | Faturou **R$47.500** · **R$2.850** de DAS · **R$4.279** de DARF | |

🔑 **Repare na inversão:** é a única das cinco em que o **DARF dos sócios é maior que o imposto da empresa**. Quatro pessoas recolhendo INSS sobre uma receita modesta.

---

## 👤 P16 · Vitor, consultoria em TI — *dois anos decidindo contra o aviso*

**Cadastro:** consultoria em TI · **1 sócio** · CNAE **6204-0/00**, dos **15 que podem virar Anexo V**. Abre em **junho/2025**, fica **22 meses** — o percurso mais longo, atravessando **três anos-calendário**.

| Quando | Quem | O que acontece | Dúvida |
|---|:---:|---|---|
| **Dia 1** | 🏠 | Inscrição municipal, licenças, certificado, documentos | ⇢ **C1 C2** |
| **jul/2025** | 🏠 | 1ª nota. 🔑 O automático sugere **R$1.621** — que por acaso é o mínimo, porque a janela ainda tem 2 meses. **A divergência só começa em agosto**, quando ele pede R$2.758 | — |
| 🔴 **jul/2025** | 👤 | **Ele desliga o automático logo no começo** e fixa o pró-labore no mínimo, para tirar o máximo como lucro. Avisamos com os números dele; ele mantém | ⇢ **A2** |
| jul/2025 → | 👤 | Cresce de R$8 mil a **R$42 mil/mês** e **nunca religa o automático** — a cada mês o aviso reaparece e ele segue | ⇢ **A5** |
| **set/2025** | ⚖️ | 🔴 **Perde o benefício do Anexo III** e fica tributado pelo **V em 19 dos 22 meses**. **Escolha dele, sustentada mês a mês** | ⇢ **A3** |
| **fev/2026** | ⚖️ | O acumulado chega a **R$187.500** e ele entra na **2ª faixa**: a alíquota efetiva começa a subir de 15,5% rumo a 16,75%, sem nunca chegar lá | — |
| **31/03/2026** | ⚖️ | DEFIS de 2025 | ⇢ **A9** |
| **jun/2026** | ⚖️ | 13º mês: a regra do acumulado troca para soma dos 12 | ⇢ **C4** |
| **31/03/2027** | ⚖️ | DEFIS de 2026 | ⇢ **A9** |
| **mar/2027** | ⚖️ | Acumulado em **R$359.000** — a **R$1.000 do teto do ME**, com a efetiva em 16,7465%. Passar é desenquadramento para EPP | 🔴 |
| **mar/2027** | ⏳ | 🔴 **E aqui a casa não faz nada — porque não existe.** Nenhuma tela avisa que ele está a R$1.000 do teto, nenhum aviso dispara. **É o buraco que esta persona achou** | 🔴 ⇢ **A3** |
| **Total** | — | Faturou **R$551.000** · pagou **R$87.083** de DAS · **19 meses no Anexo V** | |

🔑 **O contraste que fecha o argumento — e a conta inteira, não só a metade boa.** Com o piloto ligado desde o mês 1 o DAS cairia de **R$87.083** para **R$40.502**. Mas o pró-labore subiria de R$35.662 para **R$165.300**, e com ele o DARF do sócio de R$3.923 para **R$38.204**:

| | Sem o piloto | Com o piloto |
|---|---:|---:|
| DAS | R$ 87.083 | R$ 40.502 |
| DARF do sócio | R$ 3.923 | R$ 38.204 |
| **Soma dos impostos** | **R$ 91.006** | **R$ 78.706** |
| **Saldo real no bolso dele** | | **R$ 12.299** |

⚠️ **E os R$165.300 não são imposto, são dinheiro dele saindo da empresa como pró-labore** — tributado na pessoa física em vez de sair como lucro isento. A conta acima só mede imposto. Se o senhor achar que essa comparação está incompleta, é exatamente o que queremos ouvir. ⇢ **A2**

🔑 E ele **encosta no teto do ME sem passar**: acumulado de R$359.000 contra o limite de R$360.000, com a efetiva em 16,7465%. É o único caso em que a porta de saída para EPP aparece.

---

## 🏢 O que ERA espelho da Contabilizei — os quatro, decididos

> ✅ **Esta seção foi respondida em 16/09.** Ela nasceu com quatro perguntas de método — *seguimos a data deles, ou fixamos a nossa?* — e saiu da reunião com os quatro fechados. **Nenhum ficou como imitação.**
>
> | | O que decidimos | |
> |:---:|---|---|
> | **🏢1** | revisar todo mês | ✅ **seguimos**, e ele confirmou que não há alternativa |
> | **🏢2** | lançar já na abertura | 🔄 **divergimos** — agora perguntamos ao cliente |
> | **🏢3** | lançar R$100 abaixo do mínimo | ❌ **recusamos** — é defeito deles |
> | **🏢4** | zerar em mês sem receita | ✅ coerente, e o nosso piloto faz melhor |
>
> 🔑 **O placar que importa:** dos quatro, **só um continuamos copiando**. Dois viraram decisão nossa e um foi recusado. A tabela abaixo fica como registro de onde cada resposta veio.
>
> 🔑 **De onde saiu esta lista.** Não é o que eles **dizem** no site: é o que a plataforma deles **fez**, mês a mês, numa empresa real cuja conta nós auditamos — CNPJ aberto em **12/12/2025**, acompanhado até agosto/2026. ⚠️ **É UMA empresa.** Não sabemos se é política da casa ou se foi o contador daquele cliente.

| | O que eles fazem | O que vimos na conta real | ✅ A resposta que ele deu |
|---|---|---|---|
| **🏢1** | **Revisam o pró-labore todo mês** | O valor mudou sozinho: **R$3.260 → R$3.360 → R$3.360 → R$1.621**, sem o cliente pedir | ✅ **SEGUIMOS.** *"Nós também vamos fazer todo mês. Não tem como te correr."* E ele explicou por quê: *"se eu calculo 28% do mês, eu também estou calculando os 12 últimos"* — a janela é móvel, então quem não revisa mensalmente descobre tarde |
| **🏢2** | **Lançam pró-labore já no mês da abertura** | CNPJ aberto em **12/12/2025** e dezembro já saiu com pró-labore — **19 dias de empresa**, com a receita ainda em zero | 🔄 **DIVERGIMOS, e viramos a pergunta para o cliente.** A lei manda desde a constituição (*"em tese ele já é contribuinte obrigatório"*), mas forçar cria guia de INSS para quem não faturou: *"você me mandou uma guia de R$178 e eu não tive faturamento. Tem muito, em todos os escritórios"*. **Default: aguardar a 1ª nota** ⇢ **A5** |
| **🏢3** | **Lançaram R$100 no mês da abertura** | Dezembro/2025 saiu com **R$100** de pró-labore, muito abaixo do salário mínimo | ❌ **RECUSAMOS — é defeito deles, com intenção declarada.** *"Os R$100 ali era só **para ele não falar que não gerou nada**."* E não servia para nada: *"28% de 10 mil é 2.800, **os seus R$100 não iam fazer diferença**"*. 🔑 Era o único item em que suspeitávamos estar errados. **O nosso bloqueio fica** ⇢ **A4** |
| **🏢4** | **Zeram o pró-labore em mês sem receita** | Janeiro/2026 saiu com **R$0,00**; de maio a agosto, com o faturamento em zero, caiu para o mínimo | ✅ **COERENTE, e o nosso piloto faz melhor.** Eles zeraram porque só começaram na 1ª nota. 🔑 Uma vez ligado, o pró-labore **não para** — *"o ideal seria manter"* —, porque quem esquece de emitir e dobra a nota no mês seguinte precisaria de folha dobrada. ⚠️ E zerar **não derruba** o Fator R: mês sem faturar com folha paga **empurra a razão para cima** ⇢ **A5** |

⚠️ **Uma quinta dependência, que não é data e por isso não entra na tabela:** a **tabela do IRRF** que usamos foi capturada da plataforma deles em 14/09 e conferida contra uma guia real. Ela bate, mas queremos a fonte oficial ratificada pelo senhor, não o print do concorrente. 🔑 E já achamos **uma divergência**: a calculadora deles cobra **R$93,76** num caso em que, aplicado o redutor do art. 3º-A da Lei 15.270/2025, o imposto é **R$0,00**. Ou eles não aplicam o redutor, ou nós o aplicamos onde não cabe. ⇢ **A1**

🔑 **O princípio que propomos, e que queremos o senhor ratificar:** onde a lei fixa, seguimos a lei e ponto. Onde a lei cala, **não copiamos o concorrente por imitação** — adotamos a régua que defende melhor o cliente, e registramos por escrito que foi escolha nossa. Hoje temos quatro casos rodando por imitação, e este documento existe para que eles parem de rodar assim.

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

# 🅴 BLOCO E — as sete contas do motor, com número e porquê

> 🧭 **Para que serve.** As personas acima mostram o **quando**; este bloco mostra o **como**. São as sete contas que o motor faz, cada uma com número real, a porcentagem usada e a razão dela. É o double-check do cálculo.
>
> 🔑 **Todos os números abaixo saíram do motor rodando em 16/09**, nenhum foi digitado à mão. E a conta 1 tem **recibo oficial da Receita** para conferir contra.

---

## 1 · O imposto do mês — e o centavo que prova que está certo

**O caso real:** agosto/2026. Receita de **R$7.910,00**, acumulado de R$54.000, Anexo III, 1ª faixa → alíquota de **6%**.

```
7.910,00 × 6%  =  474,60      ← a conta que todo mundo faz
Guia oficial da Receita        =  474,59      ← o que o recibo traz
```

🔑 **O centavo não é erro de arredondamento nosso — é a regra.** O imposto do Simples **não** é um percentual sobre a receita: é a **soma de seis tributos, cada um arredondado**. A repartição entre eles é fixada em lei por anexo e por faixa:

| Tributo | % do DAS *(Anexo III, 1ª faixa)* | Valor |
|---|---:|---:|
| IRPJ | 4,00% | R$ 18,98 |
| CSLL | 3,50% | R$ 16,61 |
| COFINS | 12,82% | R$ 60,84 |
| PIS | 2,78% | R$ 13,19 |
| CPP | 43,40% | R$ 205,98 |
| ISS | 33,50% | R$ 158,99 |
| | **100,00%** | **R$ 474,59** |

⚠️ Quem programa `receita × alíquota` erra um centavo em **toda** guia, e guia diferente do PGDAS-D é divergência com a Receita.

**O que queremos ouvir:** a repartição e o arredondamento por tributo estão certos?

---

## 2 · A alíquota efetiva — por que ela quase nunca é a da tabela

A partir da 2ª faixa a tabela traz dois números: uma alíquota **nominal** e uma **parcela a deduzir**. O que se paga é o resultado da conta entre os dois.

```
efetiva  =  ( RBT12 × nominal  −  parcela a deduzir )  ÷  RBT12
```

**Anexo III, 2ª faixa:** nominal **11,20%**, parcela a deduzir **R$9.360**.

| Acumulado (RBT12) | Alíquota efetiva |
|---:|---:|
| R$ 180.000 | **6,0000%** |
| R$ 192.000 | 6,3250% |
| R$ 216.000 | 6,8667% |
| R$ 225.000 | 7,0400% |
| R$ 300.000 | 8,0800% |
| R$ 360.000 | **8,6000%** |

🔑 **Repare na primeira linha:** em R$180.000 exatos, a 2ª faixa devolve **exatamente 6%** — o mesmo da 1ª. A parcela a deduzir é **calibrada** para não haver salto na borda, e conferimos isso em **8 bordas** dos dois anexos, ao 12º decimal. Ninguém paga a mais por ter cruzado a linha por um real.

**O que queremos ouvir:** a fórmula e a leitura da parcela a deduzir estão corretas?

---

## 3 · O Fator R — a conta que decide 6% ou 15,5%

```
Fator R  =  folha PAGA dos 12 meses  ÷  receita dos 12 meses
```

**Exemplo** — empresa faturando R$18.000/mês por 12 meses:

| Pró-labore mensal | Folha 12m | Receita 12m | Fator R | Anexo |
|---:|---:|---:|---:|:---:|
| R$ 5.400 | R$ 64.800 | R$ 216.000 | **30,00%** | **III** |
| R$ 1.621 *(mínimo)* | R$ 19.452 | R$ 216.000 | **9,01%** | **V** |

**Limiar: 28%.** Acima, Anexo III; abaixo, Anexo V.

Três regras que aplicamos e que valem confirmar:

| | |
|---|---|
| **Regime de caixa** | Só entra o que foi **efetivamente pago**. Declarado no eSocial e não pago **não conta** |
| **A CPP não entra** | A CPP embutida no DAS **não** compõe a folha nos Anexos III e V — só no IV. 🔒 **Duas camadas desde 16/09:** a norma diz que não entra (Res. CGSN 140/2018 art. 26 §2º I 'a'), **e** decidimos não fazer a manobra de somá-la mesmo que alguém interprete que entra ⇢ [[2026-09-16-tres-conflitos-do-contador-resolvidos]] |
| **Empresa nova anualiza os dois lados** | Com menos de 13 meses, folha e receita são anualizadas juntas. Anualizar só a receita joga o recém-aberto no Anexo V sem merecer |

---

## 4 · A guia do sócio — INSS e Imposto de Renda

**Exemplo: pró-labore de R$5.400, sócio sem outro emprego.**

| Passo | Conta | Valor |
|---|---|---:|
| INSS do sócio | 11% × R$5.400 *(teto de R$8.475,55 não alcançado)* | **R$ 594,00** |
| Dedução no IR | a **maior** entre o INSS (R$594,00) e o desconto simplificado (R$607,20) | R$ 607,20 |
| Base do IR | R$5.400,00 − R$607,20 | R$ 4.792,80 |
| Imposto pela tabela | faixa de 27,5%, menos a dedução da faixa | R$ 409,29 |
| **Redutor** do art. 3º-A | Lei 15.270/2025, aplicado **depois** da tabela, sobre o bruto | **− R$ 259,64** |
| **IRRF devido** | | ✅ **R$ 149,65** |

> ✅ **Este era o único número do Bloco E que não tinha saído validado, e fechou em 16/09.** O Leonan afirmou que acima de R$5.000 o redutor não se aplicaria, o que daria IRRF maior — mas ele mesmo hesitou (*"aí eu não vou lembrar o certo"*), e a consulta externa confirmou **os 7 pontos contra o motor, este inclusive**.
>
> 🔑 **E o que decide não é a consulta, é a aritmética:** a régua sem rampa faria o sócio **perder R$312,88 de líquido ao ganhar um centavo a mais** de bruto. Legislação tributária não cria penhasco desses. ⇢ virou a conferência **G10b**.
>
> ⚠️ **Mas os quatro parâmetros da rampa seguem sem fonte primária** — ninguém nos mostrou o texto do art. 3º-A. Ver a ressalva no item **A1**.

🔑 **Três coisas que erramos antes e hoje aplicamos:**
1. **A ordem importa.** O INSS sai primeiro e vira dedução da base do IR. Quem calcula o IR sobre o bruto cobra a mais do sócio.
2. **A dedução é a maior das duas**, não sempre o INSS. A fonte pagadora é obrigada a aplicar a mais benéfica.
3. **O redutor vem por último** e zera o imposto de quem ganha até R$5.000, decaindo até R$7.350. Ele **não** é uma faixa isenta nova.

🔴 **E o mais importante: a conta é POR SÓCIO.** O teto do INSS é da pessoa e a tabela do IR é progressiva por beneficiário. Numa empresa de 4 sócios × R$3.500:

| | INSS | IRRF | Total |
|---|---:|---:|---:|
| Somando a folha e calculando uma vez | R$ 932,31 | R$ 2.684,88 | **R$ 3.617,19** |
| Calculando sócio a sócio e somando | — | — | **R$ 1.540,00** |

Erra para os dois lados: o **INSS para menos**, porque a soma bate num teto que nenhum dos quatro atingiu sozinho; o **IRRF para muito mais**, porque R$14.000 numa pessoa cai numa faixa que R$3.500 em quatro não alcança. ⇢ **A1**

---

## 5 · O acumulado (RBT12) — três regras, não uma

| Momento | Regra | Exemplo |
|---|---|---|
| **1º mês** | receita do próprio mês × 12 | R$14.000 → **R$168.000** |
| **2º ao 12º** | média dos meses **anteriores** × 12 | 7 meses somando R$90.000 → média R$12.857,14 → **R$154.285,71** |
| **13º em diante** | soma simples dos 12 anteriores | 12 × R$18.000 → **R$216.000** |

🔴 **Duas armadilhas que a intuição erra, e que aplicamos:**
- **O mês corrente NÃO entra** no cálculo — nem no numerador, nem no divisor. Ele é só a base sobre a qual a alíquota cai depois.
- **Mês com receita zero ENTRA como zero e conta no divisor.** Excluí-lo infla a média, sobe a faixa e faz pagar a maior. No exemplo do meio há **2 meses zerados** entre os 7.

🔑 E a troca de regra acontece pelo **mês de atividade**, não pela virada do ano.

---

## 6 · Guia paga em atraso

**Exemplo real de uma das personas:** guia de **R$1.182,04**, paga com **14 dias** de atraso.

| Parcela | Conta | Valor |
|---|---|---:|
| Multa | 0,33% **por dia** × 14 dias = 4,62% *(teto de 20%)* | R$ 54,61 |
| Juros | Selic acumulada 1,09% **+ 1%** do mês do pagamento = 2,09% | R$ 24,70 |
| **Total** | | **R$ 1.261,35** |

⚠️ O **1%** só entra quando o pagamento sai do mês do vencimento — pago dentro dele, os juros são **zero** e só a multa corre (R$1.236,65). O teto de 20% da multa é alcançado no **61º dia**. ⇢ **B5**

---

## 7 · O piloto do pró-labore — a conta que roda antes, não depois

🔑 **Por que ela existe:** o Fator R lê os **12 meses anteriores**. O pró-labore pago hoje só produz efeito nas competências seguintes — quem descobre o problema em setembro e corrige em setembro **só volta ao Anexo III em agosto do ano seguinte**. Alerta chega tarde por construção; a única intervenção que funciona é **pagar o valor certo desde o mês 1**.

**Mesma empresa nos dois cenários:** receita R$18.000/mês, 12 meses na janela = R$216.000.

**Cenário A — vinha pagando R$5.400/mês** *(modo: manutenção)*

| | |
|---|---:|
| Folha já paga nos 11 meses fechados | R$ 59.400,00 |
| Alvo da janela: **30%** × R$216.000 | R$ 64.800,00 |
| **Mínimo a pagar neste mês** | **R$ 1.080,00** |
| O que o piloto sugere *(o sustentável)* | R$ 5.400,00 |
| Folga acima do alvo | R$ 4.320,00 |

**Cenário B — pagou só o salário mínimo (R$1.621) por 11 meses** *(modo: recuperação)*

| | |
|---|---:|
| Folha já paga | R$ 17.831,00 |
| Para virar **já**, pelo alvo de 30% | R$ 46.969,00 |
| Para virar já, pelo **mínimo legal de 28%** | R$ 42.649,00 |
| Déficit acumulado | R$ 41.569,00 |
| O que o piloto sugere mesmo assim | **R$ 5.400,00** |

🔴 **E aqui está a decisão que mais queremos ouvir o senhor sobre.** O piloto **não** manda quitar o déficit de uma vez, mesmo sendo o que devolveria o Anexo III no mês seguinte. Ele compara:

| | Valor |
|---|---:|
| Economia no DAS ao ficar no III em vez do V *(6,8667% contra 15,9167% sobre R$18.000)* | R$ 1.629,00 |
| Custo extra na guia do sócio para pagar os R$46.969 de uma vez *(guia cheia R$12.683,67 **menos** o que ele já pagaria no sustentável de R$5.400 → R$743,65)* | R$ 11.940,02 |
| **Saldo** | **− R$ 10.311,02** |

⚠️ **A base desta tabela é o SUSTENTÁVEL (R$5.400)**, porque a pergunta aqui é *"o piloto deve saltar em vez de pagar o que ele pagaria?"*. Na tabela do **A5** a base é **o mínimo (R$1.621)**, porque lá a pergunta é a do contador: *"compensa regularizar de uma vez?"*. **Duas bases, duas perguntas** — e até 17/09 as duas tabelas trocavam de base sem dizer.

> *"Quitar o déficit de uma vez custaria mais do que economiza. O sustentável segue valendo; o salto é decisão do sócio, não do robô."*

No cenário sustentável a conta se inverte e fica favorável: economia de R$1.629,00 contra R$565,34 de custo extra na guia, **saldo de +R$1.063,66 por mês**.

Duas decisões nossas que valem confirmação:

| | |
|---|---|
| **Miramos 30%, não os 28% da lei** | Faltar um centavo derruba a empresa para o Anexo V no mês inteiro. A folga de 2 pontos é deliberada |
| **Em 65 dos 87 CNAEs o piloto não atua** | São `Anexo III fixo` por decisão do governo: o Fator R não muda nada neles, e a tela **não pode** falar em 28% — sugeriria um risco que não existe |

---

## 📐 Como isso é conferido, por dentro

| | |
|---|---:|
| Conferências automáticas no motor de imposto | **46** |
| No piloto de pró-labore | **67** |
| No estado do CNPJ | **14** |
| Invariantes nas 18 vidas de teste | **58** |
| Auditoria de agregação *(recomputa tudo na unha, sem chamar o motor)* | **142** |
| Verificações do ciclo completo | **1.092** |
| **Falhas** | **0** |

🔑 **A régua que separa os dois tipos de prova:** o que vem de **documento emitido** (o centavo do arredondamento) é provado contra **recibo real**. O que vem de **norma** (as faixas, o Fator R, o RBT12) é provado por **invariante** — relações que precisam valer em qualquer empresa do perfil. Um não substitui o outro.

⚠️ **E o que ainda não temos:** um recibo de PGDAS-D de empresa no **Anexo V**. As regras dele saem da lei e o arredondamento é herdado do Anexo III — mesmo código —, então não trava nada. Mas se o senhor tiver um em algum cliente, conferimos contra ele. ⇢ **A1**

---

## 📌 O que ficou de fora de propósito

| | Por quê |
|---|---|
| Folha de colaborador, 13º, férias, FGTS | 🔒 travado fora por decisão do Pedro — nenhuma persona tem funcionário |
| ISS, retenção, local de recolhimento | assunto encerrado, ver `_encerrados.mjs` · E-ISS [ENCERRADO] |
| CPP no numerador do Fator R | encerrado, mas 🔴 **já foi reportado errado ao Mauro em 13/09** e a correção está no `evolucao-para-mauro` de 15/09 |
| Faixas 3 a 6 da tabela | o ME não alcança — a faixa 2 termina em R$360 mil, que é o teto |

---

# 📋 O que a validação deixou EM ABERTO

> 🔑 **Nada aqui é bloqueio de produto.** São itens que pedem fonte, decisão ou uma pergunta a mais — e cada um está nomeado para não sumir.

## ⏳ Precisa de FONTE — o contador não soube ou pediu para confirmar

| | O quê | Por que importa |
|---|---|---|
| ~~P1~~ | ✅ **Redutor do IRRF — RESOLVIDO 16/09.** O motor estava certo: 7 de 7 pontos conferem, o **R$3.500 não existe** (era projeto de lei antigo) e o corte seco criaria **penhasco de R$312,88 num centavo**. Virou a conferência **G10b** | 🟡 sobra a fonte primária do art. 3º-A, que **não bloqueia** |
| **P3** | Multa da **DEFIS** e do **PGDAS zerado** — valores e norma | Ele hesitou nos dois. Vira aviso e vira tela |
| **P4** | Prazo da DEFIS de **extinção entre janeiro e abril** | *"Tem que avaliar essas datas"* |
| **P5** | 🔴 O **regime de caixa acaba em 2027** — isso atinge o Fator R? | Nosso Fator R **é** regime de caixa |
| **P21** | Qual leitura do Fator R é a da norma: competência anterior ou o próprio mês? | Já **não bloqueia** — a ação é a mesma nas duas ⇢ [[2026-09-16-tres-conflitos-do-contador-resolvidos]] |

## 🔴 As QUATRO mudanças de 2027 — e só uma tem norma nomeada

| | O que muda | Fonte |
|---|---|---|
| **1** | DEFIS morre, vira campo do PGDAS-D | ✅ Res. CGSN 190/2026 |
| **2** | **Regime de caixa** acaba no Simples | ⏳ memória do contador |
| **3** | A **janela do Fator R pula um mês** *(dois meses anteriores)* | ⏳ memória do contador |
| **4** | **ISS** passa a ser no **local da prestação** | ⏳ memória do contador |

⚠️ **Três das quatro vieram de memória, sem norma citada, e todas mexem no motor.** Isso é frente de pesquisa própria, não item de fila.

## ⏳ Não foi perguntado, ou passou batido

| | O quê |
|---|---|
| **A12** | 🔴 **Pejotização** — o item de maior risco declarado do nosso perfil, e **ficou sem opinião de contador** |
| **A10** | A norma da **carta de responsabilidade** segue sem confirmação |
| **A11** | **Feriado municipal** de BH desloca guia federal? *(lacuna `L7b`)* |
| **C1** | Campos do **alvará de bombeiros** — fica com a **Izabela** |
| **C2** | O que caracteriza inscrição municipal **"irregular"** |
| **C4** | A **postura** sobre o degrau da 1ª nota: conversa-se com o cliente ou não? |
| **A14** | Servidor **municipal de BH** segue a regra do federal? |

## 🔧 Decisões que ainda precisam virar código ou tela

| | O quê | Onde | Estado |
|---|---|---|---|
| **1** | Pró-labore só para **sócio-administrador** | motor + tela | ✅ **motor feito** · falta tela |
| **2** | Parar de deduzir o rateio do **percentual de participação** | tela | ⏳ tela |
| **3** | Campo *"já contribuo ao INSS em outro vínculo"* | tela | ⏳ tela |
| **4** | **Alerta interno** quando constitui e fatura no mesmo mês | motor | ✅ **feito** `alertas-internos.mjs` |
| **5** | Janela vazia → decidir **Anexo V** em vez de `null` | motor | ✅ **feito** |
| **6** | **Salário mínimo** com vigência anual, não constante | motor | ✅ **feito** `salarioMinimoDe()` |
| **7** | Pergunta de onboarding do pró-labore | tela | ✅ **desenhada** *(nó `L0`)* · falta tela |
| **8** | CNAE secundário travado em **5** · **LTDA** sempre · **10 m²** | tela | ⏳ tela |
| **9** | Robô roda no **dia 6**; janela de nota até o dia 5 | motor | ⏳ |
| **10** | Trocar *"cai para o Anexo V"* por *"perde o benefício do Anexo III"* | copy, tudo | ✅ **feito** · zero ocorrências nas fontes |

🔑 **O que sobrou é quase todo TELA**, e tela é o que o Pedro revisa por `/apresentacao` e `/mapa`. O motor e o desenho de processo estão em dia com a reunião.

⚠️ **Menos o item 9**, que é motor e ficou aberto de propósito: o dia de corte das alterações pagas (10 ou 12) **não foi decidido**.

## 🆕 E uma conta nova que a reunião não pediu, mas produziu

O **`ganhoDeIncluirSocio()`**. Quando a regra do sócio-administrador concentra a folha em pouca gente, o IRRF progressivo pode cobrar mais do que o rateio cobrava. O motor mede isso e a tela pode perguntar — sobre **fato**, nunca sobre conveniência:

> *"algum outro sócio também trabalha na empresa?"*

📌 Medido na P04: folha de R$5.600 custa **R$616,00** repartida entre dois e **R$844,86** num sócio só. Nos outros meses dela, **zero de diferença**.

## Links
[[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[2026-09-16-leonan-audio-2-bloco-d]] · [[2026-09-16-leonan-audio-3-bloco-d-e-e]] · [[2026-09-16-tres-conflitos-do-contador-resolvidos]] · [[PENDENCIAS]] · [[_achados-do-motor]] · [[_encerrados]] · [[ciclo-do-cnpj]]
