---
tipo: derivado
status: vivo
data: 2026-09-17
assunto: cru-impostos
gerado_por: execucao/processos/cru/gerar-cru.mjs
tags: [execucao, processos, cru, impostos]
---

# 🏛 Impostos — varredura crua

> ⚠️ **Nota gerada.** Não editar à mão: `node execucao/processos/cru/gerar-cru.mjs impostos`. A fonte é `cru/impostos.mjs`. Regras do modo: [[_como-funciona]].
>
> 🥩 **Modo cru:** aqui só mora **o que precisa acontecer** e **o que decide o caminho**. Sem quem executa, sem tela, sem API, sem semáforo — tudo isso é a fase seguinte, e adiar é o ponto.

## Estado da varredura

**🟩 FECHADA** · 36 nós · 10 variáveis · 7 entradas · 14 fins · 13 fronteiras

✅ **Todos os 8 itens da categoria foram tocados.**

🔁 **6 nós já existem no formato completo** (P1–P6): I8→P2.1 · I9→P2.2 · I11→P2.3 · I12→P2.4 · I13→P2.6 · I14→P2.7. Não é duplicata: é o mapa dizendo onde já há desenho pronto. No fim da varredura a gente decide se absorve.

## Por onde essa categoria começa

> 7 fatos diferentes disparam alguma coisa aqui dentro.

- **I1** · A competência fecha e é hora de apurar
- **I17** · Chega o prazo de uma taxa municipal
- **I19** · Chega a guia do INSS do pró-labore
- **I20** · Acompanha o acumulado da empresa, mês a mês
- **I25** · A receita de uma competência já apurada mudou
- **I28** · A pessoa abre para entender quanto vai pagar
- **I33** · A pessoa pede para o app pagar por ela

## O mapa

| | O que acontece | A variável | As saídas |
|:--:|---|---|---|
| · | **I1** · A competência fecha e é hora de apurar | — | → I2 |
| ◆ | **I2** · Reúne o que a competência tem | Teve faturamento nesta competência? | **teve receita** → I4<br/>**nenhuma nota emitida no mês** → I3 |
| · | **I3** · Mês sem faturamento: apura zero, e a obrigação não pausa | — | → I6 |
| · | **I4** · Soma a receita da competência e desconta o que reduz a base | — | → I5 |
| ◆ | **I5** · Resolve qual anexo vale nesta competência | O Fator R dos últimos 12 meses fechou em quanto? | **28% ou mais: tributa pelo Anexo III** → I6<br/>**abaixo de 28%: tributa pelo Anexo V** → I6<br/>**não há mês anterior: faturou no mês em que abriu** → I5b |
| · | **I5b** · Faturou no mês em que abriu: tributa pelo Anexo V e a casa liga | — | → I6 |
| · | **I6** · Calcula o imposto da competência | — | → I7 |
| · | **I7** · A guia existe, mas ainda não está disponível | — | → I8 |
| · | **I8** · A guia fica disponível, com valor, vencimento e código de barras | — | → I9 |
| ◆ | **I9** · A pessoa paga a guia fora do app | O que ela faz agora? | **paga e avisa que pagou** → I10<br/>**paga e não avisa nada** → I11<br/>**não paga** → I11 |
| · | **I10** · Marca como quitada na palavra da pessoa, e segue conferindo por baixo | — | → I11 |
| ◆ | **I11** · Espera o vencimento passar | Já passou o vencimento? | **ainda não** → I11<br/>**passou** → I12 |
| ◆ | **I12** · Consulta a arrecadação e descobre sozinha | O órgão diz que foi paga? | **foi paga** → I13<br/>**não foi paga** → I14<br/>**a consulta não respondeu** → I12 |
| ■ | **I13** · Guia quitada: a competência fecha com a data real do pagamento | — | _termina aqui_ |
| ◆ | **I14** · Venceu sem pagar: o valor de hoje não é mais o da guia | A pessoa quer a guia refeita? | **quer, com multa e juros já calculados** → I15<br/>**não agora** → I16 |
| · | **I15** · Refaz a guia com o valor atualizado | — | → I11 |
| ■ | **I16** · A guia segue vencida, e a dívida cresce todo dia | — | _termina aqui_ |
| · | **I17** · Chega o prazo de uma taxa municipal | — | → I18 |
| ■ | **I18** · A guia da taxa entra na mesma lista das outras | — | _termina aqui_ |
| · | **I19** · Chega a guia do INSS do pró-labore | — | → I18 |
| ◆ | **I20** · Acompanha o acumulado da empresa, mês a mês | O acumulado encosta em alguma borda? | **está longe de tudo** → I21<br/>**o Fator R está perto de virar a faixa** → I22<br/>**o faturamento está perto do teto do Simples** → I23<br/>**a virada de ano muda o acumulado** → I24 |
| ■ | **I21** · Nada a avisar neste mês | — | _termina aqui_ |
| ■ | **I22** · Avisa que o Anexo pode virar, e quanto falta pra evitar | — | _termina aqui_ |
| ■ | **I23** · Avisa que o teto está perto, e o que acontece se estourar | — | _termina aqui_ |
| ■ | **I24** · A virada de ano mexe no acumulado e na declaração | — | _termina aqui_ |
| ◆ | **I25** · A receita de uma competência já apurada mudou | A guia daquela competência está em que pé? | **ainda não foi apurada** → I6<br/>**foi apurada mas não foi paga** → I26<br/>**já foi paga** → I27 |
| · | **I26** · Refaz a apuração antes de a guia virar dinheiro | — | → I7 |
| ■ | **I27** · Retifica a declaração de uma competência já paga | — | _termina aqui_ |
| ◆ | **I28** · A pessoa abre para entender quanto vai pagar | O que ela quer saber? | **quanto é a guia deste mês** → I29<br/>**por que a alíquota é essa** → I30<br/>**o que já foi pago** → I31<br/>**quanto vai pagar no mês que vem** → I32 |
| ■ | **I29** · Mostra a guia do mês com valor, vencimento e o que fazer | — | _termina aqui_ |
| ■ | **I30** · Abre a composição da alíquota: anexo, ISS e Fator R | — | _termina aqui_ |
| ■ | **I31** · Mostra o histórico do que já foi pago | — | _termina aqui_ |
| ■ | **I32** · Simula o mês seguinte com o que ela imaginar faturar | — | _termina aqui_ |
| ◆ | **I33** · A pessoa pede para o app pagar por ela | Dá pra fazer isso? | **pagar a guia dentro do app: não fazemos** → I34<br/>**débito automático: benefício de plano, não existe ainda** → I35 |
| ■ | **I34** · Explica por que a casa não paga a guia, e o que ela faz no lugar | — | _termina aqui_ |
| ■ | **I35** · Débito automático: registra o interesse e diz que ainda não existe | — | _termina aqui_ |

## As variáveis, uma a uma

> É o que o modo cru existe pra responder: **toda condicional tem todas as respostas escritas?**

**I2 · Teve faturamento nesta competência?**

- teve receita → **I4** · Soma a receita da competência e desconta o que reduz a base
- nenhuma nota emitida no mês → **I3** · Mês sem faturamento: apura zero, e a obrigação não pausa

**I5 · O Fator R dos últimos 12 meses fechou em quanto?**

- 28% ou mais: tributa pelo Anexo III → **I6** · Calcula o imposto da competência
- abaixo de 28%: tributa pelo Anexo V → **I6** · Calcula o imposto da competência
- não há mês anterior: faturou no mês em que abriu → **I5b** · Faturou no mês em que abriu: tributa pelo Anexo V e a casa liga

**I9 · O que ela faz agora?**

- paga e avisa que pagou → **I10** · Marca como quitada na palavra da pessoa, e segue conferindo por baixo
- paga e não avisa nada → **I11** · Espera o vencimento passar
- não paga → **I11** · Espera o vencimento passar

**I11 · Já passou o vencimento?**

- ainda não → **I11** · Espera o vencimento passar
- passou → **I12** · Consulta a arrecadação e descobre sozinha

**I12 · O órgão diz que foi paga?**

- foi paga → **I13** · Guia quitada: a competência fecha com a data real do pagamento
- não foi paga → **I14** · Venceu sem pagar: o valor de hoje não é mais o da guia
- a consulta não respondeu → **I12** · Consulta a arrecadação e descobre sozinha

**I14 · A pessoa quer a guia refeita?**

- quer, com multa e juros já calculados → **I15** · Refaz a guia com o valor atualizado
- não agora → **I16** · A guia segue vencida, e a dívida cresce todo dia

**I20 · O acumulado encosta em alguma borda?**

- está longe de tudo → **I21** · Nada a avisar neste mês
- o Fator R está perto de virar a faixa → **I22** · Avisa que o Anexo pode virar, e quanto falta pra evitar
- o faturamento está perto do teto do Simples → **I23** · Avisa que o teto está perto, e o que acontece se estourar
- a virada de ano muda o acumulado → **I24** · A virada de ano mexe no acumulado e na declaração

**I25 · A guia daquela competência está em que pé?**

- ainda não foi apurada → **I6** · Calcula o imposto da competência
- foi apurada mas não foi paga → **I26** · Refaz a apuração antes de a guia virar dinheiro
- já foi paga → **I27** · Retifica a declaração de uma competência já paga

**I28 · O que ela quer saber?**

- quanto é a guia deste mês → **I29** · Mostra a guia do mês com valor, vencimento e o que fazer
- por que a alíquota é essa → **I30** · Abre a composição da alíquota: anexo, ISS e Fator R
- o que já foi pago → **I31** · Mostra o histórico do que já foi pago
- quanto vai pagar no mês que vem → **I32** · Simula o mês seguinte com o que ela imaginar faturar

**I33 · Dá pra fazer isso?**

- pagar a guia dentro do app: não fazemos → **I34** · Explica por que a casa não paga a guia, e o que ela faz no lugar
- débito automático: benefício de plano, não existe ainda → **I35** · Débito automático: registra o interesse e diz que ainda não existe

## Onde essa categoria toca as outras

> 🔴 Fronteira é **nota, não ligação**. Ligar agora seria adivinhar; as conexões são a fase final.

- **I2** · Reúne o que a competência tem
  ↗ notas · a receita vem de lá, pela competência de cada nota
- **I4** · Soma a receita da competência e desconta o que reduz a base
  ↗ notas · o desconto incondicionado de cada nota reduz a base de cálculo
- **I5** · Resolve qual anexo vale nesta competência
  ↗ pró-labore · a folha dos 12 meses é o numerador, e só entra o que foi efetivamente pago
- **I5b** · Faturou no mês em que abriu: tributa pelo Anexo V e a casa liga
  ↗ pró-labore · a folha desta competência é o que salva a competência SEGUINTE
- **I13** · Guia quitada: a competência fecha com a data real do pagamento
  ↗ estar em dia · é isto que sustenta o 'você está em dia'
- **I14** · Venceu sem pagar: o valor de hoje não é mais o da guia
  ↗ plano e cobrança · refazer guia é serviço avulso, e abaixo de R$ 50 entra na fatura
- **I16** · A guia segue vencida, e a dívida cresce todo dia
  ↗ estar em dia · guia vencida derruba a prova de regularidade e aparece na vigília
- **I19** · Chega a guia do INSS do pró-labore
  ↗ pró-labore · a guia nasce lá, na declaração do mês, e aparece aqui
- **I22** · Avisa que o Anexo pode virar, e quanto falta pra evitar
  ↗ pró-labore · o que resolve é aumentar a folha, e a decisão mora lá
- **I23** · Avisa que o teto está perto, e o que acontece se estourar
  ↗ estar em dia · a vigília do teto mora lá · plano e cobrança · estourar muda o enquadramento e o preço
- **I24** · A virada de ano mexe no acumulado e na declaração
  ↗ estar em dia · a declaração anual é obrigação com data própria
- **I27** · Retifica a declaração de uma competência já paga
  ↗ plano e cobrança · retificação pode ser serviço avulso · estar em dia · a declaração retificada entra no histórico
- **I35** · Débito automático: registra o interesse e diz que ainda não existe
  ↗ plano e cobrança · exige mandato bancário, e é o mesmo problema da cobrança recorrente

## O que a varredura achou

**I1 · A competência fecha e é hora de apurar**

🔑 A competência de uma nota é a data em que ela foi EMITIDA, não o mês do serviço (travado em 12/09, visto na nota real). Então o que entra aqui é tudo que foi faturado no mês, independente de quando o serviço aconteceu.

**I3 · Mês sem faturamento: apura zero, e a obrigação não pausa**

🔴 Declarar zero é obrigação, não cortesia: quem não declara paga multa mesmo sem ter faturado. E o app precisa dizer isso ANTES, porque a pessoa sem receita é justamente a que acha que não tem nada a fazer.

**I4 · Soma a receita da competência e desconta o que reduz a base**

🆕 12/09 — o desconto incondicionado entrou no mapa de Notas justamente porque termina aqui: ele abate da base, e a guia é calculada sobre a base, não sobre o valor bruto.

**I5 · Resolve qual anexo vale nesta competência**

🔑 É a decisão mais cara da categoria: Anexo III começa em 6% e Anexo V em 15,5%. E o anexo apurado aqui é o mesmo que cada nota congela no campo `anexoEscolhido` — confirmado em produção em 12/09. ⚠️ O limiar de 28% é seco, sem margem legal: 27,99% é Anexo V.

**I5b · Faturou no mês em que abriu: tributa pelo Anexo V e a casa liga**

🆕 NASCEU EM 16/09. Até 15/09 o motor GRITAVA aqui, porque não podia escolher entre 6% e 15,5% sem informação. O contador deu a informação: *'para reduzir de 15,5 para 6 naquele faturamento do mês 8, eu teria que ter uma folha no mês 7. O mês 7 a empresa não existia. Então ali ela vai ser tributada normal, nos 15,5'*. 🔒 O Pedro travou: a competência da constituição fica em 15,5%, sem promessa de reverter. ⚠️ NÃO É 'V POR PRECAUÇÃO', que continua proibido — é a regra: quem não tem competência anterior não tem como exibir folha, e sem folha no numerador o resultado é o Anexo V. 🔴 O QUE AINDA DÁ PRA SALVAR é o mês SEGUINTE, e é por isso que este nó dispara ALERTA INTERNO, não tela: a casa liga e oferece gerar a folha desta competência. 🔑 E ISSO NÃO É RETROATIVO — cabe no prazo normal do eSocial, até o dia 15 do mês seguinte, sem retificação, juros ou multa. Por isso o alerta tem que disparar na EMISSÃO DA NOTA, não no fechamento do mês: é a emissão que abre a janela de 15 dias. ⚠️ Raro por construção: prestador de serviço cumpre 30 dias de competência antes de emitir, e o contador disse que *'dificilmente eu pegaria um cara que faturava no mesmo mês'*. Sobre R$12.000 a diferença é R$1.860 contra R$720.

**I6 · Calcula o imposto da competência**

🔴 O motor de cálculo NÃO EXISTE — é o buraco declarado na nota da funcionalidade. E ele precisa saber: receita do mês, RBT12, anexo, alíquota efetiva, a parcela de ISS e a repartição do DAS. 🔑 A ORDEM DA CONTA É REGRA, não detalhe de implementação (13/09, recibo do PGDAS-D da conta real): base → reparte nos 6 tributos → **arredonda CADA parcela** → soma. Quem faz `receita × alíquota` e arredonda no fim erra centavo em toda guia: 7.910 × 6% dá 474,60, e a Receita cobra 474,59 (IRPJ 18,98 + CSLL 16,61 + COFINS 60,84 + PIS 13,19 + CPP 205,98 + ISS 158,99). Guia diferente do PGDAS-D é divergência com a Receita, e o cliente descobre pela Receita, não por nós. ⚠️ Empresa com menos de 12 meses tem RBT12 proporcionalizado, e essa regra nunca foi escrita (pergunta aberta com o Mauro desde 12/09). ✅ A metade da FOLHA dessa pergunta já fechou em 13/09: empresa com menos de 13 meses anualiza a folha junto com a receita (Res. CGSN 140/2018 art. 26 §4º) — ver `L4b` em pró-labore. Falta só a metade da RECEITA.

**I7 · A guia existe, mas ainda não está disponível**

🔑 ESTADO PRÓPRIO, copiado do líder: a guia é criada ANTES de poder ser paga. Ele mostra o botão de pagar desabilitado com a frase 'Disponível até o dia 15'. Sem esse estado, a pessoa acha que a casa esqueceu dela.

**I8 · A guia fica disponível, com valor, vencimento e código de barras**

⚠️ TRÊS DATAS DIFERENTES, e o líder mistura as três na mesma palavra: quando a guia fica DISPONÍVEL (dias 15-16), quando ela VENCE (18-21), e a janela genérica que a tela dele chama de 'entre 15 e 20'. O nosso desenho tem que separar disponibilização de vencimento — é a confusão nº 1 da categoria.

**I9 · A pessoa paga a guia fora do app**

🔴 A CASA NÃO INTERMEDIA O PAGAMENTO — travado em 27/07. Quem recebe é o governo, e a gente nem vê o dinheiro. Por isso 'a pessoa disse que pagou' e 'a casa sabe que foi pago' são duas coisas diferentes, e a segunda é o diferencial nº 1.

**I10 · Marca como quitada na palavra da pessoa, e segue conferindo por baixo**

Um toque, sem formulário e sem anexo. ⚠️ Mas a marcação é provisória: quem confirma é a consulta do I12, e o desenho precisa aguentar a divergência entre o que a pessoa disse e o que o órgão diz.

**I11 · Espera o vencimento passar**

🔑 A data é conhecida desde a emissão, porque a guia sai sempre no mesmo dia com o mesmo prazo. Não precisa vigiar em tempo real: precisa acordar UMA vez, no dia certo.

**I12 · Consulta a arrecadação e descobre sozinha**

🔴 É O MAIOR BURACO DA CATEGORIA, E NÃO É TÉCNICO — É DECISÃO. A nota da funcionalidade diz com todas as letras: 'não é descoberta, é decisão: ou a gente consulta arrecadação com atraso, ou possui o trilho'. O líder resolveu tendo banco próprio; a casa travou em 09/09 que NÃO seremos uma financeira. Então sobra a consulta com atraso — e o atraso precisa ser aceitável.

**I15 · Refaz a guia com o valor atualizado**

Volta a esperar o vencimento novo. 🔑 O ciclo pode repetir, e o desenho precisa aguentar a segunda e a terceira rodada sem virar labirinto.

**I16 · A guia segue vencida, e a dívida cresce todo dia**

⚠️ Aqui mora uma decisão de POSICIONAMENTO que a casa já travou: não vender pânico. O líder faz dunning por medo, e isso está na lista do que a gente NÃO faz.

**I17 · Chega o prazo de uma taxa municipal**

🔴 ACHADO DE 09/09 QUE NÃO ESTAVA NO RADAR: a TFE — Taxa de Fiscalização de Estabelecimentos — é municipal de BH, aparece na mesma lista das guias federais no líder, e tem vencimento próprio (visto: competência abril, vencimento 11/05, R$ 168,48). 🟡 Regra, base de cálculo e periodicidade em BH NÃO estão mapeadas.

**I18 · A guia da taxa entra na mesma lista das outras**

🔑 Decisão de desenho: uma lista só. Separar 'imposto' de 'taxa' é vocabulário de contador; pra quem paga, é tudo conta com data.

**I19 · Chega a guia do INSS do pró-labore**

⚠️ A guia do INSS não é apurada aqui: ela vem do pró-labore declarado. Mas chega na mesma lista e no mesmo lugar, e a pessoa não distingue. 🕓 E tem um achado esquisito esperando ratificação: o `DARF_UNIFICADO_ATIVACAO_FATOR_R` de R$ 11,00, que seria um pró-labore simbólico de R$ 100 no primeiro mês só pra abrir a contagem do Fator R. Observado em produção, nunca ratificado, e fica abaixo do mínimo do INSS.

**I20 · Acompanha o acumulado da empresa, mês a mês**

🔑 É O DIFERENCIAL Nº 2 e a razão de a categoria existir além da guia: avisar ANTES. O líder tem o cálculo e não tem o alerta. ⚠️ As quatro bordas vieram da varredura de Notas: elas são onde o deslocamento da competência deixa de ser neutro e passa a mudar o valor do imposto.

**I22 · Avisa que o Anexo pode virar, e quanto falta pra evitar**

🔑 Aviso sem o número que resolve é susto. Tem que dizer quanto falta de folha, não que 'o Fator R está caindo'.

**I23 · Avisa que o teto está perto, e o que acontece se estourar**

⚠️ Estourar o teto não é multa, é mudança de regime — e o efeito é retroativo em parte dos casos. Dizer 'você estourou' depois não serve pra nada.

**I24 · A virada de ano mexe no acumulado e na declaração**

🔴 É a borda mais silenciosa: serviço de dezembro faturado em janeiro joga receita pro exercício seguinte, mexe no RBT12 e na declaração anual. Ninguém percebe no mês, só no fechamento.

**I25 · A receita de uma competência já apurada mudou**

🔴 CHEGA DE NOTAS, pelo único caminho do produto que anda PRA TRÁS: nota cancelada, substituída ou importada tarde. 🔑 Esta decisão é a que o P6.15 procurava e não achava — e a resposta é que o estado da competência precisa existir do NOSSO lado. O líder modela em 10 status; a casa não modela nenhum.

**I26 · Refaz a apuração antes de a guia virar dinheiro**

🔑 É a janela barata, e o desenho anterior não a distinguia: entre o fecho contábil e a disponibilização da guia dá pra recalcular sem retificar nada.

**I27 · Retifica a declaração de uma competência já paga**

🔴 QUATRO PERGUNTAS ABERTAS, e nenhuma é de tela. (1) o PGDAS-D aceita retificação por API ou é trabalho humano no e-CAC? (2) se o imposto foi pago a maior, vira crédito ou pedido de restituição, e quem conduz? (3) é serviço avulso ou entra no plano? (4) quem assina, já que é responsabilidade técnica do contador e a Carta do CFC encosta aqui.

**I30 · Abre a composição da alíquota: anexo, ISS e Fator R**

🔑 É o que separa a casa do líder: ele mostra o número, a gente mostra a conta. E a conta são SEIS LINHAS, não uma alíquota (13/09): IRPJ · CSLL · COFINS · PIS · CPP · ISS, cada uma já arredondada, somando o valor da guia. Mostrar só `6%` é o que obriga o cliente a ligar perguntando o centavo. ⚠️ E a parcela de ISS que aparece na nota NÃO é cobrança separada — é a fatia de ISS que já está dentro do DAS. Confirmado três vezes no teardown.

**I32 · Simula o mês seguinte com o que ela imaginar faturar**

🔑 Mesma engine da apuração rodando com notas hipotéticas — sem dependência de terceiro, é trabalho nosso. ⚠️ E é a resposta à pergunta que a pessoa realmente faz, que nunca é 'qual minha alíquota' e sim 'se eu fechar esse contrato, quanto sobra'.

**I33 · A pessoa pede para o app pagar por ela**

⚠️ Este nó existe para o caminho recusado ficar VISÍVEL. 'Pagar o DAS pelo app' foi decidido NÃO fazer em 27/07, e some da lista de 58; o débito automático sobrevive como benefício de plano e exige mandato bancário.

**I34 · Explica por que a casa não paga a guia, e o que ela faz no lugar**

🔑 Recusar sem explicar é o que a gente critica no líder. A resposta honesta é: a gente não toca no seu dinheiro, mas descobre sozinha que você pagou — que é o 2.4.

## Nota de fonte

Gerado de `cru/impostos.mjs`. O gerador só verifica o que é de dentro: saída apontando pra nó que existe, nó que termina declarando que termina, variável com pelo menos duas respostas, toda saída com condição escrita, e nenhum item da categoria esquecido. **Não** pergunta API, tela nem prazo — isso é a fase seguinte.
