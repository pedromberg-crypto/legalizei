---
tipo: referencia
status: vivo
data: 2026-09-18
assunto: validacoes-cnae-fila-contador
tags: [cnae, validacao, contador, risco, simples, bh]
---

> Somos uma contabilidade digital em construção, com foco em **microempresa de prestação de serviço, optante pelo Simples Nacional, sediada em Belo Horizonte**. Estamos montando a lista de atividades (CNAE) que conseguimos atender com segurança do início ao fim: abrir a empresa, emitir a nota e apurar o imposto certo todo mês.
>
> Chegamos a **80 CNAEs** por um método próprio, com fonte legal em cada critério. Restaram **quatro dúvidas** que não se resolvem com pesquisa — precisam de quem faz isso na prática, em BH. É o que este documento pede.
>
> Não há urgência de prazo. O que importa é a resposta estar certa, e sabermos em que ela se apoia.

---

## 1. Como chegamos aos 80, para você conferir o raciocínio

Partimos dos **1.332 CNAEs** da tabela do IBGE e aplicamos sete filtros em sequência, cada um com base legal:

| | |
|---|---|
| 1.332 | todos os CNAEs da CNAE 2.3 (IBGE) |
| 632 | só **prestação de serviço** (comércio e indústria fora) |
| 540 | não **vedados** ao Simples Nacional — Resolução CGSN 140/2018, Anexo VI |
| 523 | não **ambíguos** quanto ao Simples — CGSN 140/2018, Anexo VII |
| 120 | **baixo risco**, com dispensa de vistoria e alvará — Resolução CGSIM 51/2019, Anexo I |
| 94 | não exigem registro em **conselho profissional** — Lei 6.839/1980 e leis de cada conselho |
| 87 | não exigem **registro setorial federal** (CADASTUR, Polícia Federal, Bacen/CVM/SUSEP) |
| **80** | destes, os que conseguimos **apurar o imposto** sem ambiguidade de anexo |

Dos 80, **48 também são permitidos ao MEI** (CGSN 140/2018, Anexo XI).

> ⚠️ A diferença entre 87 e 80 é o item da seção 3: em sete deles não conseguimos definir com segurança se o imposto cai no Anexo III ou no Anexo V. Enquanto não se define, não sabemos dizer ao cliente quanto ele vai pagar.

O perfil de operação que assumimos em toda a análise: **escritório administrativo, 20 m², 100% remoto, sem atendimento ao público no local, sem estoque, sem manipulação de alimento, sem uso de fogo, sem produto químico**, com 1 a 4 sócios pessoas físicas e sem funcionários na abertura.

> **❓ Pergunta de validação**
> Algum desses sete filtros está mal formulado, na ordem errada, ou faltando? Existe um critério que você usa na prática e que não aparece aqui?

---

## 2. Cinco atividades que parecem entrar, e queremos confirmar

Estas cinco ficaram de fora da nossa lista por **não constarem** da lista federal de baixo risco (Resolução CGSIM 51/2019). Ao ler o **Decreto Municipal de BH nº 17.245/2019**, encontramos as cinco nominalmente no **Anexo I** — o das atividades dispensadas de Alvará de Localização e Funcionamento.

| CNAE | Atividade | Anexo do Simples | MEI |
|---|---|---|---|
| 5911-1/01 | Estúdios cinematográficos | III | não |
| 5911-1/99 | Atividades de produção cinematográfica, de vídeos e de programas de TV n.e. | III | não |
| 5912-0/99 | Atividades de pós-produção cinematográfica, de vídeos e de programas de TV n.e. | III | **sim** |
| 5913-8/00 | Distribuição cinematográfica, de vídeo e de programas de TV | III | não |
| 8299-7/01 | Medição de consumo de energia elétrica, gás e água | III | não |

O que já verificamos: as cinco estão no Anexo I do Decreto 17.245/2019, são prestação de serviço, não são vedadas ao Simples, não exigem conselho profissional nem registro setorial federal, e caem no Anexo III de forma fixa.

> ⚠️ O que **não** conseguimos verificar: o **risco sanitário**. A classificação sanitária de BH está na Portaria SMSA/SUS-BH nº 0221/2022, e não conseguimos obter os anexos dela (o arquivo público não permite extrair o texto). Também vale registrar que lemos o Decreto 17.245 por uma **cópia de terceiro**, não pelo Diário Oficial.

> **❓ Pergunta de validação**
> Para o perfil descrito na seção 1, estas cinco atividades abrem e operam em BH sem exigência prévia de alvará, licença sanitária ou vistoria? Alguma delas tem armadilha que a leitura do decreto não mostra?

---

## 3. Sete atividades travadas na definição do anexo

Estas sete passam em todos os nossos filtros de atendimento. O que nos impede de aceitá-las é outra coisa: **não conseguimos determinar com segurança se a tributação cai no Anexo III ou no Anexo V** da Lei Complementar 123/2006.

São, quase todas, atividades "não especificadas anteriormente" — os CNAEs guarda-chuva, onde a redação da lei não fecha de maneira evidente.

| CNAE | Atividade | Já confirmado no Anexo I de BH |
|---|---|---|
| 5911-1/02 | Produção de filmes para publicidade | ✅ sim |
| 8211-3/00 | Serviços combinados de escritório e apoio administrativo | ✅ sim |
| 8219-9/99 | Preparação de documentos e serviços especializados de apoio administrativo n.e. | ✅ sim |
| 7410-2/99 | Atividades de design não especificadas anteriormente | não localizado |
| 7490-1/99 | Outras atividades profissionais, científicas e técnicas n.e. | não localizado |
| 7729-2/99 | Aluguel de outros objetos pessoais e domésticos n.e. | não localizado |
| 8592-9/99 | Ensino de arte e cultura não especificado anteriormente | não localizado |

No caso do **5911-1/02**, nossa checagem automática encontrou enquadramento em dois dispositivos diferentes ao mesmo tempo, o que é justamente o sintoma da dúvida.

> Por que isso trava a operação, e não é preciosismo: o Anexo III começa em **6%** e o Anexo V em **15,5%**. Além disso, o Anexo V pode migrar para o III quando a folha de pagamento atinge 28% da receita (o Fator R), e o III fixo não. Sem saber em qual anexo a atividade cai, não conseguimos nem dizer o valor da guia, nem orientar o pró-labore.

> **❓ Pergunta de validação**
> Para cada um dos sete: qual anexo se aplica, e com base em qual dispositivo da LC 123/2006 (artigo, parágrafo, inciso)? Onde a resposta for "depende", queremos saber **do que** depende, para transformarmos isso em pergunta ao cliente.

---

## 4. Dois documentos que não conseguimos obter

Toda a nossa classificação de risco está apoiada na **Resolução CGSIM nº 51/2019**, que é a norma **federal**. Ao estudar o tema, encontramos que a Lei 13.874/2019 determina que essa lista vale **na ausência de legislação municipal própria** — e Belo Horizonte tem a sua.

| Documento | O que classifica | Situação |
|---|---|---|
| Decreto Municipal nº 17.245/2019, Anexo I | atividades dispensadas do Alvará de Localização e Funcionamento | obtivemos **111 de 276 itens**, por cópia de terceiro |
| Portaria SMSA/SUS-BH nº 0221/2022, Anexos I a VII | classificação de risco sanitário em BH (alto, médio, baixo) | **não obtivemos** |

> ⚠️ Isso não significa que nossa lista esteja errada. Significa que **ainda não sabemos** se está certa para BH. Se a lista municipal for mais restritiva que a federal em algum ponto, existe a chance de termos aceitado uma atividade que na prática trava na abertura — e o cliente descobriria isso depois de já ter contratado e pago.

> **❓ Pergunta de validação**
> Você tem acesso a esses dois anexos na íntegra, ou sabe onde obtê-los de forma confiável? E, pela sua experiência de abertura em BH: a classificação municipal costuma divergir da federal a ponto de mudar o resultado?

---

## 5. Uma confirmação de entendimento

Ao cruzar os dados, chegamos a uma conclusão que queremos validar antes de virar regra no nosso sistema.

Encontramos **Agências de viagens (7911-2/00)** e **Operadores turísticos (7912-1/00)** no Anexo I do Decreto 17.245/2019 — ou seja, dispensados de alvará em BH. Ainda assim, mantivemos as duas **fora** da nossa lista, porque exigem cadastro no **CADASTUR**, do Ministério do Turismo.

Nosso entendimento: **dispensa de alvará municipal e habilitação federal são coisas independentes.** Uma atividade pode não precisar de alvará na prefeitura e ainda assim precisar de registro em órgão federal para operar legalmente.

> **❓ Pergunta de validação**
> O entendimento está correto? E existe algum outro cadastro ou habilitação, federal ou estadual, que costuma passar despercebido nesse tipo de análise e que deveríamos ter na régua?

---

## 6. Resumo do que precisamos

| | |
|---|---|
| Seção 1 | conferir se os sete filtros e a ordem deles fazem sentido |
| Seção 2 | dizer se as **cinco** atividades entram, para o perfil descrito |
| Seção 3 | definir o anexo (III ou V) das **sete** travadas, com fundamento |
| Seção 4 | ajudar a obter os **dois** documentos de BH, ou dizer se divergem na prática |
| Seção 5 | confirmar o entendimento sobre alvará municipal × habilitação federal |

> Onde a resposta for "não tenho certeza", preferimos ouvir isso e saber o que falta verificar, do que receber uma resposta fechada. Trabalhamos com a regra de que todo número e toda classificação precisam ter uma fonte atrás — e "não sei" é uma resposta que nos serve.
