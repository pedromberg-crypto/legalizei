---
tipo: derivado
status: vivo
data: 2026-09-12
assunto: cru-notas
gerado_por: execucao/processos/cru/gerar-cru.mjs
tags: [execucao, processos, cru, notas]
---

# 🧾 Notas fiscais — varredura crua

> ⚠️ **Nota gerada.** Não editar à mão: `node execucao/processos/cru/gerar-cru.mjs notas`. A fonte é `cru/notas.mjs`. Regras do modo: [[_como-funciona]].
>
> 🥩 **Modo cru:** aqui só mora **o que precisa acontecer** e **o que decide o caminho**. Sem quem executa, sem tela, sem API, sem semáforo — tudo isso é a fase seguinte, e adiar é o ponto.

## Estado da varredura

**🟩 FECHADA** · 55 nós · 26 variáveis · 5 entradas · 15 fins · 11 fronteiras

✅ **Todos os 9 itens da categoria foram tocados.**

🔁 **15 nós já existem no formato completo** (P1–P6): N10→P3.4 · N18→P3.9 · N20→P3.11 · N21→P3.5 · N25→P3.6 · N27→P3.8 · N26→P3.7 · N23→P6.2 · N24→P6.3 · N32→P6.7 · N35→P6.9 · N39→P6.11 · N40→P6.17 · N30→P3.10 · N33→P6.14. Não é duplicata: é o mapa dizendo onde já há desenho pronto. No fim da varredura a gente decide se absorve.

## Por onde essa categoria começa

> 5 fatos diferentes disparam alguma coisa aqui dentro.

- **N1** · Prestou um serviço e precisa faturar
- **N29** · Abre uma nota que já existe
- **N30** · Traz pra cá uma nota que foi emitida fora do app
- **N34** · A empresa recebeu uma nota de um fornecedor
- **N44** · Pede que a equipe emita a nota no lugar da pessoa

## O mapa

| | O que acontece | A variável | As saídas |
|:--:|---|---|---|
| · | **N1** · Prestou um serviço e precisa faturar | — | → N2 |
| ◆ | **N2** · Identifica pra quem é a nota | Quem é o tomador? | **é cliente que já emiti antes** → N5<br/>**é cliente novo** → N3<br/>**é consumidor final, sem identificar** → N4 |
| ◆ | **N3** · Cadastra o cliente novo | É empresa ou pessoa física? | **PJ — basta o CNPJ, o resto vem do cadastro público** → N5<br/>**PF — nome e CPF** → N5<br/>**está fora do Brasil** → N8 |
| · | **N4** · Segue sem identificar o tomador, com a consequência dita antes | — | → N6 |
| ◆ | **N5** · Confirma onde o serviço foi prestado | Em qual município o serviço foi prestado? | **na cidade da empresa — já vem preenchido assim** → N6<br/>**em outro município** → N7<br/>**fora do Brasil** → N8 |
| ◆ | **N7** · Resolve onde o imposto é devido quando o cliente é de fora | O município do cliente exige cadastro de prestador de fora? | **não exige** → N6<br/>**exige e a empresa tem** → N6<br/>**exige e a empresa não tem** → N9 |
| · | **N8** · Trata a nota de exportação de serviço | — | → N6 |
| · | **N9** · Avisa que o cliente vai reter o imposto, e o que fazer pra evitar | — | → N6 |
| ◆ | **N6** · Define qual serviço está sendo faturado | É o serviço de sempre? | **sim, o mesmo de sempre** → N11<br/>**é outro serviço** → N10<br/>**é a primeira nota da empresa** → N10 |
| ◆ | **N10** · Escolhe o serviço, partindo do que a empresa faz | A atividade da empresa aponta pra um serviço só? | **sim, só um** → N11<br/>**mais de um possível** → N12<br/>**nenhum corresponde** → N13 |
| · | **N12** · Desempata entre os serviços possíveis, em português | — | → N11 |
| ■ | **N13** · Nenhum serviço corresponde ao que foi feito | — | _termina aqui_ |
| · | **N11** · Informa o valor do serviço e o desconto, se houver | — | → N57 |
| · | **N57** · A nota nasce com a competência do dia em que foi emitida | — | → N14 |
| ◆ | **N14** · Resolve se alguém retém imposto na fonte | Essa atividade está na lista de retenção do município? | **não está na lista** → N16<br/>**está, e o cliente passa a ser o responsável pelo ISS** → N15 |
| · | **N15** · Mostra o que o cliente vai reter e o que sobra | — | → N16 |
| ◆ | **N16** · Confere o que esse faturamento faz com a empresa antes de emitir | Esse valor encosta em algum limite? | **não encosta em nada** → N53<br/>**aproxima do teto do regime** → N17<br/>**ultrapassa o teto do regime** → N17<br/>**muda a faixa de faturamento** → N17 |
| ◆ | **N17** · Diz o que muda antes de a nota existir, e deixa decidir | A pessoa quer emitir assim mesmo? | **emitir assim mesmo** → N53<br/>**mudar o valor** → N11<br/>**desistir por ora** → N19 |
| ■ | **N19** · Desistiu: nada é emitido e nada é cobrado | — | _termina aqui_ |
| ◆ | **N53** · Resolve sob qual regime esta nota sai | A empresa ainda apura tudo pelo Simples? | **sim, tudo pelo Simples** → N58<br/>**passou de um sublimite: o ISS sai pela regra do município** → N58<br/>**passou do limite: federais e ISS saem por fora do Simples** → N58 |
| ◆ | **N58** · Oferece guardar essa combinação como padrão | Guardar pra próxima? | **guardar: da próxima vez já vem preenchido** → N18<br/>**não guardar: só vale pra esta nota** → N18 |
| ◆ | **N18** · Confere se a empresa pode emitir agora | Falta alguma condição pra emitir? | **não falta nada** → N59<br/>**a empresa não está habilitada no sistema nacional** → N20<br/>**falta a identidade digital da empresa** → N20<br/>**a empresa está impedida por pendência no órgão** → N20<br/>**o órgão está fora do ar** → N22 |
| ◆ | **N20** · Emissão parada: diz o que falta, de quem é, e o que destrava | O impedimento foi resolvido? | **resolvido, dá pra tentar de novo** → N18<br/>**depende de terceiro e não resolve agora** → N22 |
| ■ | **N22** · Não dá pra emitir por aqui agora: entrega o caminho alternativo pronto | — | _termina aqui_ |
| ◆ | **N59** · Pergunta se manda a nota direto pro cliente | Envia cópia pro cliente? | **sim, manda pro e-mail dele** → N21<br/>**não, eu mesmo mando depois** → N21 |
| · | **N21** · Transmite a nota ao órgão | — | → N25 |
| ◆ | **N25** · Lê a resposta do órgão | Como o órgão respondeu? | **processou com sucesso, sem ressalva** → N26<br/>**processou, mas com ressalva na atividade** → N56<br/>**recusou por dado errado** → N27<br/>**não respondeu a tempo** → N28 |
| · | **N56** · A nota valeu, mas o órgão marcou ressalva na atividade | — | → N26 |
| · | **N27** · Recusou: traduz o erro e deixa corrigir sem redigitar tudo | — | → N11 |
| ◆ | **N28** · Sem resposta: descobre se a nota nasceu antes de deixar tentar de novo | A nota existe no órgão? | **existe, foi só a resposta que se perdeu** → N26<br/>**não existe** → N21 |
| ■ | **N26** · A nota existe, e a receita da empresa muda | — | _termina aqui_ |
| ◆ | **N29** · Abre uma nota que já existe | O que precisa fazer com ela? | **só ver, baixar ou mandar pro cliente** → N31<br/>**emitir outra igual a essa** → N54<br/>**ver o que já aconteceu com ela** → N55<br/>**tem alguma coisa errada** → N23 |
| · | **N54** · Duplica a nota: nasce uma nova com os mesmos dados | — | → N11 |
| ■ | **N55** · Mostra tudo o que já aconteceu com a nota | — | _termina aqui_ |
| ■ | **N31** · Entrega o documento pelo canal escolhido | — | _termina aqui_ |
| ◆ | **N23** · Achou um erro numa nota já emitida | A nota nasceu aqui ou veio de fora? | **nasceu aqui** → N24<br/>**veio de fora** → N33 |
| ◆ | **N24** · Confere se ainda dá pra mexer nessa nota | O que o município permite para esta nota? | **dentro de 2 anos e sem bloqueio: dá pra resolver sozinho** → N32<br/>**passou de 2 anos da emissão** → N41<br/>**o Fisco bloqueou o caminho automático desta nota** → N41 |
| · | **N32** · Diz o motivo e a justificativa do cancelamento | — | → N35 |
| ◆ | **N35** · Pede o cancelamento da nota | O município aceitou? | **cancelou** → N40<br/>**recusou, e dá pra pedir análise** → N41<br/>**recusou em definitivo** → N39 |
| ◆ | **N41** · Pede análise do cancelamento a quem decide | A análise voltou como? | **deferida** → N40<br/>**indeferida** → N39<br/>**ainda não voltou** → N41 |
| ■ | **N39** · Não dá pra mexer nessa nota: diz por quê e o que sobrou de caminho | — | _termina aqui_ |
| ■ | **N40** · A nota deixou de valer, e a receita do mês cai | — | _termina aqui_ |
| ◆ | **N30** · Traz pra cá uma nota que foi emitida fora do app | De onde ela vem? | **a pessoa tem o documento em mãos** → N42<br/>**está no órgão e dá pra buscar** → N42<br/>**a pessoa não tem e não sabe onde está** → N43 |
| ■ | **N42** · Registra a nota de fora na receita do mês | — | _termina aqui_ |
| ■ | **N43** · A nota existe e não chegou: a receita do mês fica incompleta | — | _termina aqui_ |
| ■ | **N33** · Registra que uma nota de fora foi cancelada lá fora | — | _termina aqui_ |
| · | **N34** · A empresa recebeu uma nota de um fornecedor | — | → N36 |
| ◆ | **N36** · Diz se reconhece o serviço que está na nota recebida | A empresa reconhece essa nota? | **reconhece e confirma** → N45<br/>**não reconhece e rejeita** → N46<br/>**não faz nada, e o prazo corre** → N47 |
| ■ | **N45** · Confirmou: a nota recebida vale, com efeito na contabilidade | — | _termina aqui_ |
| ◆ | **N46** · Rejeitou: a nota recebida é contestada | A rejeição se mantém? | **se mantém** → N48<br/>**foi anulada** → N45 |
| ■ | **N48** · Rejeição mantida: a nota não produz efeito pra empresa | — | _termina aqui_ |
| ■ | **N47** · Ninguém se manifestou e o prazo passou: vale como confirmada | — | _termina aqui_ |
| ◆ | **N44** · Pede que a equipe emita a nota no lugar da pessoa | A equipe tem tudo o que precisa? | **tem tudo** → N21<br/>**falta informação da pessoa** → N49 |
| ◆ | **N49** · A equipe precisa de informação que só a pessoa tem | A informação chegou? | **chegou** → N21<br/>**não chegou e o mês está acabando** → N50 |
| ■ | **N50** · O mês virou sem a nota sair | — | _termina aqui_ |

## As variáveis, uma a uma

> É o que o modo cru existe pra responder: **toda condicional tem todas as respostas escritas?**

**N2 · Quem é o tomador?**

- é cliente que já emiti antes → **N5** · Confirma onde o serviço foi prestado
- é cliente novo → **N3** · Cadastra o cliente novo
- é consumidor final, sem identificar → **N4** · Segue sem identificar o tomador, com a consequência dita antes

**N3 · É empresa ou pessoa física?**

- PJ — basta o CNPJ, o resto vem do cadastro público → **N5** · Confirma onde o serviço foi prestado
- PF — nome e CPF → **N5** · Confirma onde o serviço foi prestado
- está fora do Brasil → **N8** · Trata a nota de exportação de serviço

**N5 · Em qual município o serviço foi prestado?**

- na cidade da empresa — já vem preenchido assim → **N6** · Define qual serviço está sendo faturado
- em outro município → **N7** · Resolve onde o imposto é devido quando o cliente é de fora
- fora do Brasil → **N8** · Trata a nota de exportação de serviço

**N7 · O município do cliente exige cadastro de prestador de fora?**

- não exige → **N6** · Define qual serviço está sendo faturado
- exige e a empresa tem → **N6** · Define qual serviço está sendo faturado
- exige e a empresa não tem → **N9** · Avisa que o cliente vai reter o imposto, e o que fazer pra evitar

**N6 · É o serviço de sempre?**

- sim, o mesmo de sempre → **N11** · Informa o valor do serviço e o desconto, se houver
- é outro serviço → **N10** · Escolhe o serviço, partindo do que a empresa faz
- é a primeira nota da empresa → **N10** · Escolhe o serviço, partindo do que a empresa faz

**N10 · A atividade da empresa aponta pra um serviço só?**

- sim, só um → **N11** · Informa o valor do serviço e o desconto, se houver
- mais de um possível → **N12** · Desempata entre os serviços possíveis, em português
- nenhum corresponde → **N13** · Nenhum serviço corresponde ao que foi feito

**N14 · Essa atividade está na lista de retenção do município?**

- não está na lista → **N16** · Confere o que esse faturamento faz com a empresa antes de emitir
- está, e o cliente passa a ser o responsável pelo ISS → **N15** · Mostra o que o cliente vai reter e o que sobra

**N16 · Esse valor encosta em algum limite?**

- não encosta em nada → **N53** · Resolve sob qual regime esta nota sai
- aproxima do teto do regime → **N17** · Diz o que muda antes de a nota existir, e deixa decidir
- ultrapassa o teto do regime → **N17** · Diz o que muda antes de a nota existir, e deixa decidir
- muda a faixa de faturamento → **N17** · Diz o que muda antes de a nota existir, e deixa decidir

**N17 · A pessoa quer emitir assim mesmo?**

- emitir assim mesmo → **N53** · Resolve sob qual regime esta nota sai
- mudar o valor → **N11** · Informa o valor do serviço e o desconto, se houver
- desistir por ora → **N19** · Desistiu: nada é emitido e nada é cobrado

**N53 · A empresa ainda apura tudo pelo Simples?**

- sim, tudo pelo Simples → **N58** · Oferece guardar essa combinação como padrão
- passou de um sublimite: o ISS sai pela regra do município → **N58** · Oferece guardar essa combinação como padrão
- passou do limite: federais e ISS saem por fora do Simples → **N58** · Oferece guardar essa combinação como padrão

**N58 · Guardar pra próxima?**

- guardar: da próxima vez já vem preenchido → **N18** · Confere se a empresa pode emitir agora
- não guardar: só vale pra esta nota → **N18** · Confere se a empresa pode emitir agora

**N18 · Falta alguma condição pra emitir?**

- não falta nada → **N59** · Pergunta se manda a nota direto pro cliente
- a empresa não está habilitada no sistema nacional → **N20** · Emissão parada: diz o que falta, de quem é, e o que destrava
- falta a identidade digital da empresa → **N20** · Emissão parada: diz o que falta, de quem é, e o que destrava
- a empresa está impedida por pendência no órgão → **N20** · Emissão parada: diz o que falta, de quem é, e o que destrava
- o órgão está fora do ar → **N22** · Não dá pra emitir por aqui agora: entrega o caminho alternativo pronto

**N20 · O impedimento foi resolvido?**

- resolvido, dá pra tentar de novo → **N18** · Confere se a empresa pode emitir agora
- depende de terceiro e não resolve agora → **N22** · Não dá pra emitir por aqui agora: entrega o caminho alternativo pronto

**N59 · Envia cópia pro cliente?**

- sim, manda pro e-mail dele → **N21** · Transmite a nota ao órgão
- não, eu mesmo mando depois → **N21** · Transmite a nota ao órgão

**N25 · Como o órgão respondeu?**

- processou com sucesso, sem ressalva → **N26** · A nota existe, e a receita da empresa muda
- processou, mas com ressalva na atividade → **N56** · A nota valeu, mas o órgão marcou ressalva na atividade
- recusou por dado errado → **N27** · Recusou: traduz o erro e deixa corrigir sem redigitar tudo
- não respondeu a tempo → **N28** · Sem resposta: descobre se a nota nasceu antes de deixar tentar de novo

**N28 · A nota existe no órgão?**

- existe, foi só a resposta que se perdeu → **N26** · A nota existe, e a receita da empresa muda
- não existe → **N21** · Transmite a nota ao órgão

**N29 · O que precisa fazer com ela?**

- só ver, baixar ou mandar pro cliente → **N31** · Entrega o documento pelo canal escolhido
- emitir outra igual a essa → **N54** · Duplica a nota: nasce uma nova com os mesmos dados
- ver o que já aconteceu com ela → **N55** · Mostra tudo o que já aconteceu com a nota
- tem alguma coisa errada → **N23** · Achou um erro numa nota já emitida

**N23 · A nota nasceu aqui ou veio de fora?**

- nasceu aqui → **N24** · Confere se ainda dá pra mexer nessa nota
- veio de fora → **N33** · Registra que uma nota de fora foi cancelada lá fora

**N24 · O que o município permite para esta nota?**

- dentro de 2 anos e sem bloqueio: dá pra resolver sozinho → **N32** · Diz o motivo e a justificativa do cancelamento
- passou de 2 anos da emissão → **N41** · Pede análise do cancelamento a quem decide
- o Fisco bloqueou o caminho automático desta nota → **N41** · Pede análise do cancelamento a quem decide

**N35 · O município aceitou?**

- cancelou → **N40** · A nota deixou de valer, e a receita do mês cai
- recusou, e dá pra pedir análise → **N41** · Pede análise do cancelamento a quem decide
- recusou em definitivo → **N39** · Não dá pra mexer nessa nota: diz por quê e o que sobrou de caminho

**N41 · A análise voltou como?**

- deferida → **N40** · A nota deixou de valer, e a receita do mês cai
- indeferida → **N39** · Não dá pra mexer nessa nota: diz por quê e o que sobrou de caminho
- ainda não voltou → **N41** · Pede análise do cancelamento a quem decide

**N30 · De onde ela vem?**

- a pessoa tem o documento em mãos → **N42** · Registra a nota de fora na receita do mês
- está no órgão e dá pra buscar → **N42** · Registra a nota de fora na receita do mês
- a pessoa não tem e não sabe onde está → **N43** · A nota existe e não chegou: a receita do mês fica incompleta

**N36 · A empresa reconhece essa nota?**

- reconhece e confirma → **N45** · Confirmou: a nota recebida vale, com efeito na contabilidade
- não reconhece e rejeita → **N46** · Rejeitou: a nota recebida é contestada
- não faz nada, e o prazo corre → **N47** · Ninguém se manifestou e o prazo passou: vale como confirmada

**N46 · A rejeição se mantém?**

- se mantém → **N48** · Rejeição mantida: a nota não produz efeito pra empresa
- foi anulada → **N45** · Confirmou: a nota recebida vale, com efeito na contabilidade

**N44 · A equipe tem tudo o que precisa?**

- tem tudo → **N21** · Transmite a nota ao órgão
- falta informação da pessoa → **N49** · A equipe precisa de informação que só a pessoa tem

**N49 · A informação chegou?**

- chegou → **N21** · Transmite a nota ao órgão
- não chegou e o mês está acabando → **N50** · O mês virou sem a nota sair

## Onde essa categoria toca as outras

> 🔴 Fronteira é **nota, não ligação**. Ligar agora seria adivinhar; as conexões são a fase final.

- **N9** · Avisa que o cliente vai reter o imposto, e o que fazer pra evitar
  ↗ plano e cobrança · o cadastro no outro município é serviço avulso
- **N13** · Nenhum serviço corresponde ao que foi feito
  ↗ plano e cobrança · alteração contratual é serviço avulso
- **N57** · A nota nasce com a competência do dia em que foi emitida
  ↗ impostos · é a competência, não a descrição, que decide em qual apuração a receita entra
- **N16** · Confere o que esse faturamento faz com a empresa antes de emitir
  ↗ estar em dia · a vigília do teto vive lá · impostos · a faixa muda a alíquota
- **N26** · A nota existe, e a receita da empresa muda
  ↗ impostos · a receita entra na apuração do mês · pró-labore · muda o Fator R · plano e cobrança · pode mudar a faixa de preço
- **N40** · A nota deixou de valer, e a receita do mês cai
  ↗ impostos · a apuração daquele mês muda, e pode já ter virado guia · pró-labore · o Fator R cai · plano e cobrança · a faixa de preço pode mudar
- **N42** · Registra a nota de fora na receita do mês
  ↗ impostos · entra na apuração igual a nota nascida aqui
- **N33** · Registra que uma nota de fora foi cancelada lá fora
  ↗ impostos · a receita do mês cai
- **N45** · Confirmou: a nota recebida vale, com efeito na contabilidade
  ↗ estar em dia · a nota tomada entra na escrita
- **N44** · Pede que a equipe emita a nota no lugar da pessoa
  ↗ plano e cobrança · é serviço avulso, e o pedido nasce lá
- **N50** · O mês virou sem a nota sair
  ↗ plano e cobrança · o avulso foi pago e não foi entregue
## ⏳ Ramos com prazo

> Caminhos que existem hoje e têm data ou condição externa pra deixar de existir. Não é dúvida nossa: é relógio de fora.

**N2 · Identifica pra quem é a nota**

⏳ A terceira saída tem prazo, e ele já começou. Desde 03/08/2026 os grupos IBS/CBS e suas validações são obrigatórios, e é lá que mora o código de operação (cIndOp). A regra E0187 do leiaute nacional diz: em 13 códigos de operação o grupo do tomador **tem que** ser informado. São justamente aqueles em que o imposto é devido no endereço do ADQUIRENTE — sem tomador identificado, não há como saber onde tributar.

**N4 · Segue sem identificar o tomador, com a consequência dita antes**

⏳ ESTE RAMO TEM DATA, E NÃO É NO FUTURO — ele já fechou pro nosso ICP.

A pergunta certa não é *até quando ele existe*, é **para quais operações**. Quem decide é o código de operação (cIndOp), e a regra E0187 exige o tomador em 13 deles. O `100301` — *“demais serviços, em operações onerosas”*, cujo local é o domicílio do adquirente — está na lista, e é exatamente o caso do prestador de serviço remoto de BH.

📅 Duas datas, e elas não são a mesma: a obrigatoriedade dos grupos IBS/CBS é de **03/08/2026**; a migração da ME/EPP do Simples pro Emissor Nacional é **01/11/2026** (Res. CGSN 191/2026). Até lá quem manda no nosso cliente é o BHISS, então a data prática é 01/11 — **a menos que BH já exija antes**.

✅ O ramo SOBREVIVE onde o local não é o endereço do adquirente: serviço sobre imóvel (local do imóvel), serviço prestado fisicamente sobre pessoa ou bem móvel (local da prestação), transporte. Nenhum deles é o nosso escopo.


## O que a varredura achou

**N4 · Segue sem identificar o tomador, com a consequência dita antes**

Duas consequências, e as duas precisam aparecer ANTES: o imposto passa a ser responsabilidade de quem emite, e em município que exija identificação a nota não poderá ser cancelada nem substituída depois (recusas E0824 e E0056). ↗ a segunda só morde no N24.

**N5 · Confirma onde o serviço foi prestado**

🔴 CORRIGIDO EM 12/09 — a pergunta anterior era “o cliente fica onde?”, e isso confunde DOMICÍLIO DO CLIENTE com LOCAL DA PRESTAÇÃO. Não é a mesma coisa: o imposto segue o local da prestação em boa parte das atividades, e só coincide com o endereço do cliente nos códigos de operação em que o local é o domicílio do adquirente — que é o nosso caso (100301), mas não o de todo mundo. 🔑 Vem PRÉ-PREENCHIDO com a cidade da empresa e só se altera quando o serviço saiu de casa. A ajuda condicional explica quando: “em certas atividades, como serviços que exigem a presença física do prestador, o imposto pertence à cidade onde o serviço foi de fato realizado, e não ao município onde a sua empresa está estabelecida”.

**N7 · Resolve onde o imposto é devido quando o cliente é de fora**

É o CPOM/CEPOM. Sem ele, o cliente é obrigado a reter o ISS, e o valor que a pessoa recebe cai sem ela entender por quê.

**N8 · Trata a nota de exportação de serviço**

Exportação é caso de primeira classe, não exceção: precisa de moeda, cotação, valor em moeda estrangeira e data da invoice. ⚠️ Pode virar mais de um passo — quem define a cotação e em que data é variável que ainda não foi aberta. ↗ impostos: exportação de serviço tem tratamento próprio na apuração.

**N6 · Define qual serviço está sendo faturado**

🔑 A sequência salva é o que faz isso durar: escolhe uma vez, e nunca mais pensa. A primeira nota não tem sequência salva, por isso ela cai no caminho longo.

**N12 · Desempata entre os serviços possíveis, em português**

Uma atividade pode cair em mais de um item da lista de serviço, e é o item que decide o imposto. Desempatar é escolha de negócio, não de código. 🔴 12/09 — A CASCATA É MAIOR DO QUE ESTE NÓ DIZ. No líder são CINCO campos encadeados: CNAE → Código Nacional → Código Municipal → NBS → IndOp. E o último **não se escolhe, se DERIVA**: a API recebe os dois códigos anteriores e devolve o indicador (`cindop?codigoNacionalItemServico=…&nbs=…`). No nosso caso voltou uma opção só — “No endereço do meu cliente ou online”, que é o `100301`. 🔑 O Código Municipal é o `cTribMun` que a PBH exige e o IndOp é o `cIndOp` da regra E0187. Decisão do Pedro em 12/09: manter assim no mapa, e **achar mais pra frente de onde conectamos os dados que derivam** — é trabalho da fase de conexão, não desta.

**N13 · Nenhum serviço corresponde ao que foi feito**

🔴 Caminho sem saída declarado. Ou a atividade da empresa não cobre o que ela está vendendo (e aí é alteração contratual), ou o de-para está incompleto. ⚠️ Pode virar mais de um passo.

**N11 · Informa o valor do serviço e o desconto, se houver**

🆕 12/09 — o DESCONTO INCONDICIONADO faltava no mapa e não é detalhe: a ajuda do líder diz que ele “abate diretamente do valor da nota e REDUZ A BASE DE CÁLCULO DOS IMPOSTOS”. Ou seja, muda o imposto. Decisão do Pedro: o campo entra, e o valor tem que ficar GUARDADO — a guia do DAS é calculada sobre a base, não sobre o valor bruto. ↗ sai daqui pra impostos. ⚠️ Decidido em 12/09 NÃO fazer o cálculo do imposto ao vivo nesta fase: pede-se só o valor, igual ao líder. A prévia viva fica como feature.

**N57 · A nota nasce com a competência do dia em que foi emitida**

🔒 12/09 (Pedro): SEM PERGUNTA E SEM CAMPO. A competência é a data da emissão e pronto; o mês de referência do serviço vai na DESCRIÇÃO, em texto livre. O nó perdeu a pergunta e virou passo, mas o trabalho sobreviveu: a casa carimba a competência, e é ela que decide a apuração. 🔑 O PADRÃO, validado nas duas notas reais: emite-se no mês seguinte ao serviço. A nota 5 saiu em 11/08 dizendo “mês de julho” e ficou na competência agosto; a nota 6 saiu em 12/09 dizendo “mês de agosto” e ficou na competência setembro. Sempre M−1 na descrição. É a prática de quem fecha 30 dias e fatura depois, e o Pedro confirmou que é assim que se trabalha. 🔑 O QUE DE FATO SE VIGIA (Pedro, 12/09): não é o rótulo do mês, é se o IMPOSTO SAI CERTO. E, mês a mês, o deslocamento é NEUTRO: se toda nota de serviço do mês M sai no mês M+1, a receita inteira anda um mês de forma uniforme, cada competência apura sobre as notas que têm aquela competência, e o valor do DAS sai correto. ⚠️ O risco mora nas BORDAS, não no meio: (1) VIRADA DE ANO — serviço de dezembro emitido em janeiro joga receita pro exercício seguinte e mexe no RBT12 e na declaração anual; (2) PERTO DO TETO — o acumulado de 12 meses é por competência, então um mês deslocado muda quando a empresa estoura; (3) VIRADA DE FAIXA OU DE ANEXO — a receita cai na faixa do mês da emissão, não do serviço, e é isso que o `anexoEscolhido` congela na nota; (4) PRIMEIRO E ÚLTIMO MÊS — quem abre tem um mês sem receita, quem encerra tem um mês com sobra. ↗ as quatro bordas são vigília, e vigília mora em impostos e em estar em dia, não aqui.

**N14 · Resolve se alguém retém imposto na fonte**

🔴 CORRIGIDO EM 12/09 — antes a pergunta era “o cliente retém algum imposto?”, como se fosse escolha dele. NÃO É: a retenção é definida por LISTA FECHADA na lei municipal. Em BH são as atividades dos incisos I a XXV — obras de construção civil, demolição, limpeza, manutenção, conservação, varrição, diversão, lazer, entretenimento, guarda e estacionamento de veículos, entre outras. 🔑 Retenção muda o que CAI NA CONTA sem mudar o que foi faturado, e quem não entende isso acha que a nota saiu errada.

**N16 · Confere o que esse faturamento faz com a empresa antes de emitir**

🔑 Esta é a variável mais valiosa da categoria inteira, e ela não existia no desenho anterior: é o único momento em que dá pra avisar ANTES, porque depois de emitida a nota não volta atrás sem custo.

**N53 · Resolve sob qual regime esta nota sai**

🔑 VARIÁVEL NOVA, achada em 12/09 no leiaute oficial, e ela não estava em lugar nenhum nosso. O optante ME/EPP declara EM CADA NOTA sob qual regime de apuração ela sai — é o campo `regApTribSN`, que existe justamente pra quem ultrapassou sublimite ou limite. Não é decorativo: muda duas outras regras. Quando a apuração é toda pelo Simples, o regime especial municipal tem que ser “Nenhum” (E0175) e NÃO se pode informar dedução nem redução de base, exceto numa lista fechada de subitens (E0398). ⚠️ Liga com o teto do N16: lá a gente avisa que o faturamento VAI estourar; aqui a nota já sai diferente porque estourou.

**N58 · Oferece guardar essa combinação como padrão**

🆕 12/09 — o mapa ASSUMIA que existe “o serviço de sempre” (N6) sem ter o passo que cria isso. É a sequência salva, e é o que faz a segunda emissão durar segundos. 🔑 Decisão do Pedro: a gente já nasce melhor que o líder, porque na constituição temos o dossiê completo — então a sugestão vem PRÉ-PREENCHIDA e pertinente, com a pessoa podendo alterar. ⚠️ Ele nunca mexeu nesses campos na Contabilizei em nota nenhuma, o que confirma que pré-preencher certo resolve o caso comum. 🔍 A investigar: o líder cruza a sugestão com o CNAE principal e, provavelmente, com os secundários — mas isso é leitura nossa, não confirmada. Vale abrir antes de copiar a régua. ⚠️ O campo do IndOp NÃO pode ser salvo como favorito no líder, e é justamente o que decide onde o imposto é devido. Se a gente conseguir guardar, é vantagem direta.

**N18 · Confere se a empresa pode emitir agora**

🔑 Quatro impedimentos diferentes, e o desenho anterior conhecia um só (a identidade digital). 🔴 CORRIGIDO EM 12/09 pelo FAQ oficial da PBH: eu tinha escrito “falta a habilitação no município” pensando em inscrição municipal, e para o nosso caso ela NÃO entra na nota — empresa com atividade iniciada depois de 12/2025 em BH emite SEM informar a IM. O que sobra é a habilitação no sistema nacional, que é outra coisa. ⚠️ E a identidade digital é a trava de verdade: não existe procuração nem delegação na NFS-e Nacional, e não há data pra existir — só emite quem tem o certificado da própria empresa.

**N22 · Não dá pra emitir por aqui agora: entrega o caminho alternativo pronto**

🔑 Degradação é rotina, não exceção. O caminho alternativo entrega os dados já prontos pra copiar, não um pedido de desculpas. ↗ o que for emitido por fora volta pela entrada N30.

**N59 · Pergunta se manda a nota direto pro cliente**

🆕 12/09 — no líder é um toggle na revisão, JÁ LIGADO, que dispara o comprovante pro e-mail do tomador (e uma cópia pro emitente). O nosso modelo hoje é link pra copiar e mandar na mão. 🔑 Decisão do Pedro: adotar, e como escolha explícita durante a emissão em vez de trabalho depois. ⚠️ Vir ligado por padrão é decisão em aberto: manda e-mail em nome do cliente sem ele pedir.

**N25 · Lê a resposta do órgão**

🔴 CORRIGIDO EM 12/09 — “aceitou?” era binário, e a resposta do órgão não é. A nota carrega TRÊS SITUAÇÕES INDEPENDENTES, vistas na nota real que emitimos: `situacaoNota` (processou?), `situacaoNFe` e `situacaoCnae` (a atividade da nota está correta?). Na nossa nota vieram “PROCESSADO_SUCESSO” e “Cnae da nota correto” — mas nada impede processar com sucesso E ter ressalva de CNAE. ⚠️ E “não respondeu” continua não sendo “recusou”: tratar igual gera nota duplicada.

**N56 · A nota valeu, mas o órgão marcou ressalva na atividade**

🆕 12/09 — a nota existe e produz efeito, mas fica com uma marca de que a atividade declarada não confere. Não é erro de emissão, é risco fiscal guardado: aparece na nota e ninguém é obrigado a olhar. 🔑 Quem não avisa aqui deixa o cliente descobrir na fiscalização.

**N28 · Sem resposta: descobre se a nota nasceu antes de deixar tentar de novo**

🔴 Variável que não existia em lugar nenhum do desenho anterior.

**N26 · A nota existe, e a receita da empresa muda**

🔴 A NOTA CONGELA O ENQUADRAMENTO. Visto na nota real de 12/09: o campo `anexoEscolhido` veio com **5**, e as notas de agosto e setembro mostram o mesmo valor — é o Anexo V do Simples gravado NA NOTA, não contagem de anexo. Decisão do Pedro: a gente também grava. 🔑 Sem isso, o dia em que o Fator R virar o histórico passa a mentir sobre qual alíquota valeu em cada competência. 🆕 E o número da nota é atribuído pela Sefin Nacional, não pela casa — a numeração PODE TER PULOS, e o órgão diz que isso “não representa irregularidade fiscal”. A lista não pode alarmar ninguém com buraco de sequência.

**N29 · Abre uma nota que já existe**

🔒 TRAVADO EM 12/09 (Pedro): são estas QUATRO ações e mais nenhuma. Nota emitida NÃO se edita nem se altera. A decisão bate com o princípio que a própria PBH escreve — *a nota emitida é imutável, ressalvadas as hipóteses de cancelamento ou substituição* — e com o leiaute nacional, onde não existe carta de correção.

**N54 · Duplica a nota: nasce uma nova com os mesmos dados**

🆕 AÇÃO QUE FALTAVA NO MAPA, e ela é a resposta prática pro caso mais comum: o mesmo cliente, o mesmo serviço, todo mês. Duplicar não conserta nada — cria documento NOVO, com número novo. 🔑 Por isso ela cai de volta no caminho de emissão e passa por todas as travas de novo: retenção, teto, regime e o que impede emitir. Duplicata que pula validação é nota errada nascendo rápido.

**N55 · Mostra tudo o que já aconteceu com a nota**

🆕 No modelo nacional isso tem nome: são os EVENTOS vinculados à chave de acesso — cancelamento, substituição, manifestação do tomador, bloqueio do Fisco. Não é log interno nosso, é o que o órgão registrou. 🔑 É também a única janela do cliente pra enxergar que o tomador dele rejeitou ou confirmou uma nota.

**N31 · Entrega o documento pelo canal escolhido**

⚠️ Pode virar mais de um passo: 'mandar pro cliente' por canal é coisa diferente de 'baixar', e o registro de que foi enviado pode importar depois.

**N24 · Confere se ainda dá pra mexer nessa nota**

🔴 REESCRITO EM 12/09 com o texto da Portaria SMFA 075/2025 na mão (art. 5º, transcrito no FAQ oficial da PBH). Em BH as condições do caminho automático são só DUAS, cumulativas: emissão há no máximo 730 dias, e o Fisco não ter bloqueado esta nota. A terceira que constava — “CPF ou CNPJ do tomador informado” — foi REVOGADA pela Portaria 88/2025, art. 3º. ⚠️ O leiaute nacional lista mais recusas (valor acima do permitido, tributos já recolhidos): ele descreve o que o sistema PODE recusar, a portaria diz o que BH parametrizou. Para BH, manda a portaria. 🔑 E não atender as condições NÃO é fim de linha: o §3º manda pra análise do Fisco.

**N32 · Diz o motivo e a justificativa do cancelamento**

🔒 12/09 (Pedro): SEM SUBSTITUIÇÃO. O menu do líder tem quatro ações pra nota emitida — ver, duplicar, ver atualizações e cancelar — e a casa espelha isso. Com uma saída só, este nó DEIXOU DE SER DECISÃO; virou passo, porque o trabalho sobreviveu à pergunta: o cancelamento exige MOTIVO (lista) e JUSTIFICATIVA (texto), os dois obrigatórios. ⚠️ O que se perde é real e fica registrado: substituir é UMA operação e deixa as duas notas amarradas no registro do fisco (`numeroNotaSubstituta` ↔ `numeroNotaSubstituida`); cancelar e duplicar são dois eventos soltos, com uma janela em que a velha morreu e a nova não nasceu. O art. 5º §2º da Portaria 075/2025 permite substituir. A regra E0061 é que esvazia o ganho: no nosso regime a substituição não carrega valor, competência nem tomador, então sobraria pra corrigir código de serviço — erro que quase ninguém comete.

**N41 · Pede análise do cancelamento a quem decide**

🔑 É o único trecho da categoria que ESPERA — e o prazo NÃO EXISTE: o FAQ oficial da PBH diz que os prazos da análise fiscal “ainda não foram estabelecidos pelo Conselho Gestor do IBS”. Não é lacuna nossa, é fato do órgão, e o produto não pode prometer prazo nenhum. ⚠️ Pode virar mais de um passo.

**N40 · A nota deixou de valer, e a receita do mês cai**

🔴 É o único caminho da categoria que anda PRA TRÁS. Tudo o mais soma.

**N30 · Traz pra cá uma nota que foi emitida fora do app**

🔑 Importar não é favor, é o que faz a receita do mês fechar. Sem isso o imposto sai a menor e a conta é de quem emitiu.

**N42 · Registra a nota de fora na receita do mês**

⚠️ Tem variável escondida aqui: se a competência já fechou, importar tem consequência igual à de cancelar. ↗ ver N24.

**N43 · A nota existe e não chegou: a receita do mês fica incompleta**

🔴 Caminho sem saída declarado, e é o pior tipo: nada quebra, o imposto simplesmente sai errado. Quem responde é quem emitiu, mas quem calculou fomos nós.

**N33 · Registra que uma nota de fora foi cancelada lá fora**

Quem cancelou foi o órgão, não a casa. Aceitar a palavra de quem avisa, ou conferir antes de mexer na receita, é variável em aberto.

**N36 · Diz se reconhece o serviço que está na nota recebida**

🔴 MÁQUINA DE ESTADOS QUE NÃO EXISTIA EM LUGAR NENHUM NOSSO, e ela não é opcional: quem emite, quem toma e quem intermedeia podem confirmar ou rejeitar, e existe confirmação por decurso de prazo. Achado de 12/09, na documentação oficial.

**N46 · Rejeitou: a nota recebida é contestada**

A rejeição pode ser anulada depois, então o estado não é final na hora em que acontece.

**N47 · Ninguém se manifestou e o prazo passou: vale como confirmada**

🔑 Silêncio tem consequência. Se a pessoa nunca abre o app, ela concorda com tudo por omissão — e isso precisa ser dito antes, não depois.

**N50 · O mês virou sem a nota sair**

🔴 Quem responde pelo atraso quando o serviço foi contratado e a informação não veio? Não é pergunta de tela, é de responsabilidade.

## Nota de fonte

Gerado de `cru/notas.mjs`. O gerador só verifica o que é de dentro: saída apontando pra nó que existe, nó que termina declarando que termina, variável com pelo menos duas respostas, toda saída com condição escrita, e nenhum item da categoria esquecido. **Não** pergunta API, tela nem prazo — isso é a fase seguinte.
