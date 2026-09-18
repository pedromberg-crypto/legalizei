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

## 6. A lista completa dos 80, para conferência

Esta é a lista que usamos hoje, organizada por seção da CNAE. Cada linha traz o anexo do Simples que aplicamos e se a atividade também é permitida ao MEI.

Na coluna **Anexo**: **III** significa Anexo III de forma fixa, por enquadramento da própria lei, sem depender de folha; **III / V** significa que o anexo depende do **Fator R** — a relação entre a folha de pagamento e a receita dos últimos 12 meses.

**Informação e comunicação** · 17 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 5811-5/00 | Edição de livros | III | sim |
| 5812-3/01 | Edição de jornais diários | III | sim |
| 5812-3/02 | Edição de jornais não diários | III | sim |
| 5813-1/00 | Edição de revistas | III | sim |
| 5819-1/00 | Edição de cadastros, listas e de outros produtos gráficos | III | sim |
| 5912-0/01 | Serviços de dublagem | III | sim |
| 5912-0/02 | Serviços de mixagem sonora em produção audiovisual | III | — |
| 5920-1/00 | Atividades de gravação de som e de edição de música | III | — |
| 6201-5/01 | Desenvolvimento de programas de computador sob encomenda | III / V | — |
| 6201-5/02 | Web design | III / V | — |
| 6202-3/00 | Desenvolvimento e licenciamento de programas de computador customizáveis | III / V | — |
| 6203-1/00 | Desenvolvimento e licenciamento de programas de computador não customizáveis | III / V | — |
| 6204-0/00 | Consultoria em tecnologia da informação | III / V | — |
| 6209-1/00 | Suporte técnico, manutenção e outros serviços em tecnologia da informação | III | — |
| 6311-9/00 | Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet | III | — |
| 6319-4/00 | Portais, provedores de conteúdo e outros serviços de informação na internet | III | — |
| 6391-7/00 | Agências de notícias | III | — |

**Atividades profissionais, científicas e técnicas** · 17 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 7210-0/00 | Pesquisa e desenvolvimento experimental em ciências físicas e naturais | III | — |
| 7220-7/00 | Pesquisa e desenvolvimento experimental em ciências sociais e humanas | III | — |
| 7311-4/00 | Agências de publicidade | III / V | — |
| 7312-2/00 | Agenciamento de espaços para publicidade, exceto em veículos de comunicação | III / V | — |
| 7319-0/02 | Promoção de vendas | III | sim |
| 7319-0/03 | Marketing direto | III | — |
| 7319-0/04 | Consultoria em publicidade | III / V | — |
| 7320-3/00 | Pesquisas de mercado e de opinião pública | III | — |
| 7410-2/02 | Design de interiores | III / V | — |
| 7410-2/03 | Design de produto | III / V | — |
| 7420-0/01 | Atividades de produção de fotografias, exceto aérea e submarina | III | sim |
| 7420-0/03 | Laboratórios fotográficos | III | sim |
| 7420-0/04 | Filmagem de festas e eventos | III | sim |
| 7420-0/05 | Serviços de microfilmagem | III | — |
| 7490-1/01 | Serviços de tradução, interpretação e similares | III / V | — |
| 7490-1/04 | Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários | III / V | — |
| 7490-1/05 | Agenciamento de profissionais para atividades esportivas, culturais e artísticas | III / V | — |

**Atividades administrativas e serviços complementares** · 14 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 7721-7/00 | Aluguel de equipamentos recreativos e esportivos | III | sim |
| 7722-5/00 | Aluguel de fitas de vídeo, DVDs e similares | III | sim |
| 7723-3/00 | Aluguel de objetos do vestuário, jóias e acessórios | III | sim |
| 7729-2/01 | Aluguel de aparelhos de jogos eletrônicos | III / V | sim |
| 7729-2/02 | Aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal; instrumentos musicais | III | sim |
| 7729-2/03 | Aluguel de material médico | III | sim |
| 7733-1/00 | Aluguel de máquinas e equipamentos para escritórios | III | sim |
| 8219-9/01 | Fotocópias | III | sim |
| 8220-2/00 | Atividades de teleatendimento | III | — |
| 8230-0/01 | Serviços de organização de feiras, congressos, exposições e festas | III | sim |
| 8291-1/00 | Atividades de cobranças e informações cadastrais | III | sim |
| 8292-0/00 | Envasamento e empacotamento sob contrato | III | sim |
| 8299-7/03 | Serviços de gravação de carimbos, exceto confecção | III | sim |
| 8299-7/07 | Salas de acesso à internet | III | sim |

**Outras atividades de serviços** · 12 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 9511-8/00 | Reparação e manutenção de computadores e de equipamentos periféricos | III | sim |
| 9512-6/00 | Reparação e manutenção de equipamentos de comunicação | III | sim |
| 9521-5/00 | Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico | III | sim |
| 9529-1/01 | Reparação de calçados, de bolsas e artigos de viagem | III | sim |
| 9529-1/02 | Chaveiros | III | sim |
| 9529-1/03 | Reparação de relógios | III | sim |
| 9529-1/04 | Reparação de bicicletas, triciclos e outros veículos não motorizados | III | sim |
| 9529-1/05 | Reparação de artigos do mobiliário | III | sim |
| 9529-1/06 | Reparação de jóias | III | sim |
| 9529-1/99 | Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos não especificados anteriormente | III | sim |
| 9602-5/01 | Cabeleireiros, manicure e pedicure | III | sim |
| 9609-2/02 | Agências matrimoniais | III | sim |

**Artes, cultura, esporte e recreação** · 10 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 9001-9/01 | Produção teatral | III | sim |
| 9001-9/02 | Produção musical | III | sim |
| 9001-9/03 | Produção de espetáculos de dança | III | — |
| 9001-9/04 | Produção de espetáculos circenses, de marionetes e similares | III | — |
| 9002-7/01 | Atividades de artistas plásticos, jornalistas independentes e escritores | III | — |
| 9002-7/02 | Restauração de obras de arte | III | sim |
| 9102-3/02 | Restauração e conservação de lugares e prédios históricos | III | — |
| 9319-1/01 | Produção e promoção de eventos esportivos | III | — |
| 9329-8/03 | Exploração de jogos de sinuca, bilhar e similares | III | sim |
| 9329-8/04 | Exploração de jogos eletrônicos recreativos | III / V | sim |

**Educação** · 8 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 8591-1/00 | Ensino de esportes | III | — |
| 8592-9/01 | Ensino de dança | III | — |
| 8592-9/02 | Ensino de artes cênicas, exceto dança | III | sim |
| 8592-9/03 | Ensino de música | III | sim |
| 8593-7/00 | Ensino de idiomas | III | sim |
| 8599-6/03 | Treinamento em informática | III | sim |
| 8599-6/04 | Treinamento em desenvolvimento profissional e gerencial | III | sim |
| 8599-6/05 | Cursos preparatórios para concursos | III | sim |

**Alojamento e alimentação** · 2 atividades

| CNAE | Atividade | Anexo | MEI |
|---|---|---|---|
| 5590-6/01 | Albergues, exceto assistenciais | III | sim |
| 5590-6/03 | Pensões(alojamento) | III | sim |

> **❓ Pergunta de validação**
> Olhando a lista inteira: alguma atividade aqui **não** deveria estar, seja porque na prática exige alvará, licença ou conselho em BH, seja porque o anexo que aplicamos está errado? E no sentido inverso: sente falta de alguma atividade comum de prestador de serviço que deveria estar e não está?

---

## 7. Resumo do que precisamos

| | |
|---|---|
| Seção 1 | conferir se os sete filtros e a ordem deles fazem sentido |
| Seção 2 | dizer se as **cinco** atividades entram, para o perfil descrito |
| Seção 3 | definir o anexo (III ou V) das **sete** travadas, com fundamento |
| Seção 4 | ajudar a obter os **dois** documentos de BH, ou dizer se divergem na prática |
| Seção 5 | confirmar o entendimento sobre alvará municipal × habilitação federal |
| Seção 6 | passar o olho na **lista inteira dos 80**: sobra alguma? falta alguma? |

> Onde a resposta for "não tenho certeza", preferimos ouvir isso e saber o que falta verificar, do que receber uma resposta fechada. Trabalhamos com a regra de que todo número e toda classificação precisam ter uma fonte atrás — e "não sei" é uma resposta que nos serve.
