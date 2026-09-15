---
tipo: verdade
status: vivo
data: 2026-09-15
assunto: duvidas-para-o-especialista-contabil
autoridade: fila-humana
tags: [execucao, motor-fiscal, duvida, mauro, larissa, contador]
---

# 🧑‍🏫 Dúvidas para o especialista contábil — com o contexto inteiro

> 🧭 **Como usar.** Cada item tem **um parágrafo de contexto antes da pergunta**, em português de gente, explicando o que a gente estava fazendo e o que apareceu. Pedido do Pedro em 15/09: *"não quero que você apenas registre a dúvida, quero que explique o que aconteceu para chegarmos nessa dúvida, para quando eu sentar com ele não ficar uma pergunta solta."*
>
> 🔑 **O que a gente estava fazendo, em uma frase:** construímos um motor que calcula o imposto e a guia do sócio mês a mês, e um "piloto" que ajusta o pró-labore sozinho para manter a empresa no Anexo III. Para testar, criamos **16 empresas fictícias** (as "personas") com histórias completas de faturamento, e rodamos o motor na vida inteira de cada uma. Foi rodando essas vidas que as dúvidas abaixo apareceram.
>
> 🏷️ **Etiqueta de cada item:** ⚖️ obrigação legal (a lei decide, só precisamos confirmar a leitura) · 🏢 decisão de negócio (a lei permite os dois, precisamos escolher) · 🐛 divergência (achamos coisas que não batem entre si).

---

## D-01 · ⚖️ Sócio que não administra pode receber pró-labore?

**O que aconteceu.** Quando desenhamos as 16 empresas de teste, definimos para cada uma quantos sócios ela tem e quem administra. Duas delas — uma agência de publicidade com 2 sócios e uma pensão com 3 — foram descritas como *"só o titular administra"*. Mas na hora de simular o dia a dia, nós fizemos a empresa pagar pró-labore para **todos** os sócios, inclusive os que não administram. Depois percebemos que a Lei 8.212/91, no artigo 12, inciso V, alínea "f", trata como segurado obrigatório o sócio que **presta serviço** à sociedade — o que sugere que quem só entrou com dinheiro e não trabalha não deveria receber pró-labore. Não mexemos no dado, porque mudar isso altera o cálculo do imposto dessas duas empresas e queríamos a sua opinião antes.

**A pergunta:** o sócio que só aportou capital e não exerce gestão **pode** receber pró-labore se a empresa quiser pagar, ou isso é irregular? E se puder, esse valor entra no Fator R normalmente?

---

## D-02 · 🏢 O pró-labore pode ser dividido de forma desigual entre os sócios?

**O que aconteceu.** O nosso sistema hoje assume que, se a empresa tem 3 sócios e paga R$6.000 de pró-labore no mês, cada um recebeu R$2.000. Assumimos divisão igual porque é o que o nosso aplicativo coleta hoje — ele pergunta o valor total, não o valor de cada um. Mas isso virou problema quando descobrimos um erro grave no nosso cálculo (ver o D-03 abaixo): o imposto do sócio depende de quanto **cada pessoa** recebeu, não do total. Se na prática é comum um sócio receber mais que o outro, o nosso aplicativo precisa perguntar valor por valor, e isso muda a tela.

**A pergunta:** na prática de escritório, com que frequência os sócios dividem o pró-labore de forma **desigual**? Isso exige alguma formalidade (alteração contratual, ata, registro)? E existe algum risco fiscal em dividir desigual?

---

## D-03 · 🐛 Confirmação de um erro grave que encontramos, e do conserto

**O que aconteceu.** Este é o mais importante da lista, e é **confirmação**, não dúvida aberta. O nosso sistema estava somando o pró-labore de todos os sócios e calculando a guia de INSS e Imposto de Renda **como se fosse uma pessoa só**. Encontramos rodando uma empresa de teste com 2 sócias. O estrago é grande e vai para os dois lados: numa empresa com 4 sócios recebendo R$3.500 cada, o sistema cobrava **R$3.617** quando o correto é **R$1.540** — porque a tabela do Imposto de Renda é progressiva **por pessoa**, e R$14.000 numa pessoa cai numa faixa alta que R$3.500 em quatro pessoas não alcança. No INSS o erro era ao contrário, para menos, porque o teto de contribuição também é **por pessoa** e nós aplicávamos um teto só para a soma. Já corrigimos: agora o sistema calcula a guia de cada sócio separadamente e soma no fim.

**A pergunta:** a nossa leitura está correta? O teto do INSS (R$8.475,55 em 2026) e a tabela progressiva do IRRF se aplicam **individualmente a cada sócio**, e a guia da empresa é a soma dessas contas individuais? Existe alguma situação em que se calcula sobre o total?

---

## D-04 · ⚖️ O piso do pró-labore é mesmo o salário mínimo?

**O que aconteceu.** O nosso aplicativo vai deixar o cliente digitar o pró-labore dele à mão, e nós precisamos saber o que **bloquear** e o que apenas **avisar**. Definimos que o único bloqueio é o valor abaixo do salário mínimo, com base na Lei 8.212/91 artigo 28 §3º, que diz que o salário de contribuição não pode ser inferior ao mínimo. Só que esse valor (R$1.621) chegou até nós por uma fonte só, numa pesquisa de 13/09, e nós marcamos internamente como "conferir antes de virar trava". Como isso vira uma trava dura na tela, queremos confirmação antes.

**A pergunta:** está correto travar o pró-labore no salário mínimo? E na conta real que analisamos apareceu um pró-labore de **R$100** lançado em dezembro de 2025 — isso é irregular, ou existe alguma hipótese em que um valor abaixo do mínimo é aceito?

---

## D-05 · 🏢 Qual é a régua prática para "pró-labore desproporcional"?

**O que aconteceu.** O nosso piloto calcula o menor pró-labore que mantém a empresa no Anexo III. Em empresas que faturam pouco, esse valor dá abaixo do salário mínimo, então ele paga o mínimo. Aí chegamos num cenário desconfortável: uma empresa faturando R$18.000 por mês pagando R$1.621 de pró-labore, o que é legal e é exatamente o que os concorrentes fazem, mas é a combinação que a jurisprudência olha como possível distribuição de lucro disfarçada. Nós colocamos um alerta na tela, mas **sem número**, porque não temos régua. Preferimos avisar sem inventar um limite a inventar um limite errado.

**A pergunta:** qual régua você usa na prática para dizer que um pró-labore está baixo demais em relação ao faturamento? Existe percentual de referência, ou é caso a caso? *(Esta pergunta já estava aberta desde 13/09.)*

---

## D-06 · 🏢 Pró-labore contra distribuição de lucro, e o que muda em 2026

**O que aconteceu.** O nosso piloto sabe calcular quanto de pró-labore segura o Anexo III, e sabe comparar isso com a economia no imposto da empresa. O que ele **não** sabe é se vale a pena de verdade — porque o dinheiro que vira pró-labore deixa de sair como lucro, e o lucro tem tratamento próprio. Com a Lei 15.270/2025 esse tratamento muda, e nós não temos como fechar a conta sem saber como fica.

**A pergunta:** como você compara hoje, na prática, as duas saídas de dinheiro para o sócio (pró-labore × distribuição de lucro)? E o que muda a partir de 2026 com a nova lei?

---

## D-07 · 🏢 Como se declara uma retirada de lucro sem extrato bancário

**O que aconteceu.** Analisando a conta real de um cliente na plataforma concorrente, vimos que eles deduzem o lucro **do extrato bancário** do cliente, e nunca conversam com ele sobre o assunto. Nós decidimos que não teremos conta bancária nem integração bancária, então esse caminho não existe para a gente. Sem extrato, a única via é o cliente declarar.

**A pergunta:** como se formaliza uma retirada de lucro sem extrato bancário? E qual é o limite isento de verdade num ME de serviço: o teto por presunção, ou a escrituração contábil completa derruba esse teto? *(Aberta desde 13/09.)*

---

## D-08 · ⚖️ A CPP que está dentro do DAS entra no Fator R? (correção de um erro nosso)

**O que aconteceu.** 🔴 **Precisamos desfazer uma informação que já te passamos.** Em 13/09 nós reportamos que a CPP paga dentro do DAS entra no cálculo do Fator R, e dissemos que era "ponto pacífico". Em 14/09, pesquisando direto na norma, vimos que estava errado: a Resolução CGSN 140/2018, artigo 26 §2º inciso I alínea "a", manda contar a CPP recolhida dentro do Simples **apenas em relação ao Anexo IV** — e o silêncio sobre o Anexo III e o V funciona como vedação. A Solução de Consulta que o mercado cita para defender o contrário trata de outro assunto. Corrigimos o sistema, mas como isso muda o valor de pró-labore que o app vai recomendar, queremos sua ratificação.

**A pergunta:** confirma que, para empresa do Anexo III ou V, a CPP embutida no DAS **não** compõe a folha do Fator R? O numerador é só pró-labore, salários, 13º, férias com o terço e FGTS?

---

## D-09 · ⚖️ Um recibo de PGDAS-D de empresa no Anexo V

**O que aconteceu.** Nós conferimos o motor contra recibos reais de uma empresa no Anexo III, e ele bate ao centavo. No Anexo V não temos nenhum recibo, e por um tempo tratamos isso como bloqueio. Depois percebemos que não é: as alíquotas e as regras saem da lei, e a única coisa que o recibo prova de verdade — o jeito de arredondar — nós já provamos com o recibo do Anexo III, porque o cálculo é o mesmo nos dois. Então deixou de ser urgente, mas ainda ajudaria.

**A pergunta:** você tem, em algum cliente, um recibo de PGDAS-D de empresa enquadrada no **Anexo V** que a gente possa conferir? Não trava nada, é confirmação.

---

## D-10 · ⚖️ Sete CNAEs que a nossa tabela não sabe classificar

**O que aconteceu.** Nós temos uma tabela com os 87 CNAEs que pretendemos atender. Para cada um, ela diz se a empresa é Anexo III fixo (65 casos) ou se depende do Fator R (15 casos). Sobram **7** que a tabela marca como "requer revisão" — nós não sabemos dizer nem qual anexo é. Hoje o sistema se recusa a calcular para esses, o que é o comportamento seguro, mas significa que não podemos atender esses clientes.

**A pergunta:** dá para resolver esses 7 caso a caso? *(Lista à parte — é trabalho de bancada, e provavelmente da Larissa.)*

## Links
[[_achados-do-motor]] · [[PENDENCIAS]] · [[evolucao-para-mauro]] · [[PERSONA]]
