---
tipo: derivado
status: vivo
data: 2026-09-18
assunto: cru-prolabore
gerado_por: produto/me/viver/processos/cru/gerar-cru.mjs
tags: [execucao, processos, cru, prolabore]
---

# 👥 Pró-labore e sócios — varredura crua

> ⚠️ **Nota gerada.** Não editar à mão: `node produto/me/viver/processos/cru/gerar-cru.mjs prolabore`. A fonte é `cru/prolabore.mjs`. Regras do modo: [[_como-funciona]].
>
> 🥩 **Modo cru:** aqui só mora **o que precisa acontecer** e **o que decide o caminho**. Sem quem executa, sem tela, sem API, sem semáforo — tudo isso é a fase seguinte, e adiar é o ponto.

## Estado da varredura

**🟩 FECHADA** · 34 nós · 14 variáveis · 6 entradas · 13 fins · 14 fronteiras

✅ **Todos os 7 itens da categoria foram tocados.**

🔁 **12 nós já existem no formato completo** (P1–P6): L1→P5.1 · L2→P5.4 · L3→P5.5 · L4→P5.2 · L6→P5.3 · L10→P5.6 · L11→P5.7 · L12→P5.8 · L13→P5.9 · L14→P5.10 · L15→P5.11 · L33→P5.7. Não é duplicata: é o mapa dizendo onde já há desenho pronto. No fim da varredura a gente decide se absorve.

## Por onde essa categoria começa

> 6 fatos diferentes disparam alguma coisa aqui dentro.

- **L0** · 1º acesso: quando começar a pagar pró-labore
- **L15** · Acompanha o Fator R dos 12 meses, mês a mês
- **L19** · O sócio quer tirar lucro da empresa
- **L23** · Muda alguma coisa na situação do sócio
- **L28** · O sócio precisa comprovar o que recebeu
- **L33** · Quer mudar o pró-labore de um mês que já foi declarado

## O mapa

| | O que acontece | A variável | As saídas |
|:--:|---|---|---|
| ◆ | **L0** · 1º acesso: quando começar a pagar pró-labore | Gerar desde a constituição, ou esperar a 1ª nota? | **aguardar o 1º faturamento (default)** → L1<br/>**gerar já, desde a constituição** → L1 |
| · | **L1** · Chega o mês e o pró-labore precisa ser decidido | — | → L2 |
| ◆ | **L2** · Olha se houve faturamento no mês | A empresa faturou nesta competência? | **faturou** → L4<br/>**não faturou nada** → L3 |
| ◆ | **L3** · Mês sem faturamento: oferece não pagar, e diz o preço disso | Pagar mesmo assim? | **não pagar neste mês** → L14<br/>**pagar mesmo sem faturar, pra segurar o Fator R** → L6 |
| ◆ | **L4** · Calcula quanto mantém a empresa no anexo mais barato | A empresa tem 13 meses de vida? | **tem: janela cheia de 12 meses** → L5<br/>**não tem: a conta é ANUALIZADA dos dois lados** → L4b |
| · | **L4b** · Anualiza a folha também, e não só a receita | — | → L5 |
| ◆ | **L5** · Resolve se o alvo é alcançável neste mês | Dá pra chegar nos 28%? | **dá, e o valor cabe** → L6<br/>**dá, mas o valor é alto demais pra empresa** → L6<br/>**não dá: nem o teto do INSS fecha a conta** → L7 |
| ◆ | **L6** · Mostra o valor sugerido e deixa mexer, vendo o imposto mudar | A pessoa aceita o valor sugerido? | **aceita o sugerido** → L9<br/>**quer outro valor** → L8 |
| · | **L7** · Explica que o mês fecha no Anexo V, e o que muda daqui pra frente | — | → L6 |
| · | **L8** · A pessoa escolhe outro valor | — | → L9 |
| ◆ | **L9** · Confere se o valor respeita os limites | O valor cabe nas regras? | **cabe** → L10<br/>**está abaixo do piso do salário mínimo** → L8<br/>**passa do teto de contribuição do INSS** → L8<br/>**o sócio já contribui por fora e tem folga no teto** → L10 |
| · | **L10** · Trava o valor do mês e monta o que vai ser declarado | — | → L11 |
| · | **L11** · Declara o pró-labore e gera a guia do INSS | — | → L12 |
| ◆ | **L12** · Confere se o dinheiro saiu de fato da empresa pro sócio | O pró-labore foi efetivamente pago? | **foi pago** → L13<br/>**foi declarado e não foi pago** → L14<br/>**ainda não dá pra saber** → L12 |
| ■ | **L13** · Entra na folha dos 12 meses e o anexo se sustenta | — | _termina aqui_ |
| ■ | **L14** · Fica FORA do Fator R, e a pessoa precisa saber o que isso custa | — | _termina aqui_ |
| ◆ | **L15** · Acompanha o Fator R dos 12 meses, mês a mês | O que a janela móvel mostra? | **folgado, e continua folgado** → L16<br/>**perto de perder a tributação pelo Anexo III** → L17<br/>**o mês que vai SAIR da janela tinha folha alta** → L17<br/>**já perdeu a tributação pelo III e dá pra recuperar** → L18 |
| ■ | **L16** · Nada a avisar neste mês | — | _termina aqui_ |
| ■ | **L17** · Avisa ANTES de virar, com o valor exato que resolve | — | _termina aqui_ |
| ■ | **L18** · Mostra o caminho de volta pro Anexo III, se houver | — | _termina aqui_ |
| · | **L19** · O sócio quer tirar lucro da empresa | — | → L20 |
| ◆ | **L20** · Diz o que a pessoa precisa saber antes de sacar | Há débito federal em aberto? | **está em dia: nada a alertar** → L22<br/>**há guia federal não paga: avisa o risco** → L21 |
| ■ | **L21** · Avisa o risco, e o que o elimina | — | _termina aqui_ |
| ■ | **L22** · O lucro sai, e precisa ficar identificado pra conta fechar | — | _termina aqui_ |
| ◆ | **L23** · Muda alguma coisa na situação do sócio | O que mudou? | **passou a ter (ou deixou de ter) vínculo CLT por fora** → L24<br/>**entrou ou saiu um sócio** → L27 |
| ■ | **L24** · Recalcula a folga no teto do INSS | — | _termina aqui_ |
| ■ | **L27** · Muda quem recebe pró-labore na empresa | — | _termina aqui_ |
| ◆ | **L28** · O sócio precisa comprovar o que recebeu | Qual documento? | **o recibo do mês** → L29<br/>**o informe de rendimentos do ano** → L30 |
| ■ | **L29** · Entrega o recibo do mês | — | _termina aqui_ |
| ◆ | **L30** · Confere se o informe do ano pode ser fechado | Tem alguma pendência travando? | **nada trava: o informe sai** → L31<br/>**o período contábil está fechado** → L32<br/>**há outra pendência no caminho** → L32 |
| ■ | **L31** · Entrega o informe de rendimentos do ano | — | _termina aqui_ |
| ■ | **L32** · Diz o que trava o informe e o que custa destravar | — | _termina aqui_ |
| ◆ | **L33** · Quer mudar o pró-labore de um mês que já foi declarado | Em que pé está aquela competência? | **ainda não foi declarada** → L10<br/>**já foi declarada** → L34 |
| ■ | **L34** · Retifica a declaração do mês, com o efeito que isso arrasta | — | _termina aqui_ |

## As variáveis, uma a uma

> É o que o modo cru existe pra responder: **toda condicional tem todas as respostas escritas?**

**L0 · Gerar desde a constituição, ou esperar a 1ª nota?**

- aguardar o 1º faturamento (default) → **L1** · Chega o mês e o pró-labore precisa ser decidido
- gerar já, desde a constituição → **L1** · Chega o mês e o pró-labore precisa ser decidido

**L2 · A empresa faturou nesta competência?**

- faturou → **L4** · Calcula quanto mantém a empresa no anexo mais barato
- não faturou nada → **L3** · Mês sem faturamento: oferece não pagar, e diz o preço disso

**L3 · Pagar mesmo assim?**

- não pagar neste mês → **L14** · Fica FORA do Fator R, e a pessoa precisa saber o que isso custa
- pagar mesmo sem faturar, pra segurar o Fator R → **L6** · Mostra o valor sugerido e deixa mexer, vendo o imposto mudar

**L4 · A empresa tem 13 meses de vida?**

- tem: janela cheia de 12 meses → **L5** · Resolve se o alvo é alcançável neste mês
- não tem: a conta é ANUALIZADA dos dois lados → **L4b** · Anualiza a folha também, e não só a receita

**L5 · Dá pra chegar nos 28%?**

- dá, e o valor cabe → **L6** · Mostra o valor sugerido e deixa mexer, vendo o imposto mudar
- dá, mas o valor é alto demais pra empresa → **L6** · Mostra o valor sugerido e deixa mexer, vendo o imposto mudar
- não dá: nem o teto do INSS fecha a conta → **L7** · Explica que o mês fecha no Anexo V, e o que muda daqui pra frente

**L6 · A pessoa aceita o valor sugerido?**

- aceita o sugerido → **L9** · Confere se o valor respeita os limites
- quer outro valor → **L8** · A pessoa escolhe outro valor

**L9 · O valor cabe nas regras?**

- cabe → **L10** · Trava o valor do mês e monta o que vai ser declarado
- está abaixo do piso do salário mínimo → **L8** · A pessoa escolhe outro valor
- passa do teto de contribuição do INSS → **L8** · A pessoa escolhe outro valor
- o sócio já contribui por fora e tem folga no teto → **L10** · Trava o valor do mês e monta o que vai ser declarado

**L12 · O pró-labore foi efetivamente pago?**

- foi pago → **L13** · Entra na folha dos 12 meses e o anexo se sustenta
- foi declarado e não foi pago → **L14** · Fica FORA do Fator R, e a pessoa precisa saber o que isso custa
- ainda não dá pra saber → **L12** · Confere se o dinheiro saiu de fato da empresa pro sócio

**L15 · O que a janela móvel mostra?**

- folgado, e continua folgado → **L16** · Nada a avisar neste mês
- perto de perder a tributação pelo Anexo III → **L17** · Avisa ANTES de virar, com o valor exato que resolve
- o mês que vai SAIR da janela tinha folha alta → **L17** · Avisa ANTES de virar, com o valor exato que resolve
- já perdeu a tributação pelo III e dá pra recuperar → **L18** · Mostra o caminho de volta pro Anexo III, se houver

**L20 · Há débito federal em aberto?**

- está em dia: nada a alertar → **L22** · O lucro sai, e precisa ficar identificado pra conta fechar
- há guia federal não paga: avisa o risco → **L21** · Avisa o risco, e o que o elimina

**L23 · O que mudou?**

- passou a ter (ou deixou de ter) vínculo CLT por fora → **L24** · Recalcula a folga no teto do INSS
- entrou ou saiu um sócio → **L27** · Muda quem recebe pró-labore na empresa

**L28 · Qual documento?**

- o recibo do mês → **L29** · Entrega o recibo do mês
- o informe de rendimentos do ano → **L30** · Confere se o informe do ano pode ser fechado

**L30 · Tem alguma pendência travando?**

- nada trava: o informe sai → **L31** · Entrega o informe de rendimentos do ano
- o período contábil está fechado → **L32** · Diz o que trava o informe e o que custa destravar
- há outra pendência no caminho → **L32** · Diz o que trava o informe e o que custa destravar

**L33 · Em que pé está aquela competência?**

- ainda não foi declarada → **L10** · Trava o valor do mês e monta o que vai ser declarado
- já foi declarada → **L34** · Retifica a declaração do mês, com o efeito que isso arrasta

## Onde essa categoria toca as outras

> 🔴 Fronteira é **nota, não ligação**. Ligar agora seria adivinhar; as conexões são a fase final.

- **L2** · Olha se houve faturamento no mês
  ↗ notas · a receita da competência vem de lá
- **L4** · Calcula quanto mantém a empresa no anexo mais barato
  ↗ impostos · o anexo que sai daqui é o que a apuração usa
- **L4b** · Anualiza a folha também, e não só a receita
  ↗ impostos · a receita anualizada da mesma competência tem que ser a MESMA dos dois lados
- **L7** · Explica que o mês fecha no Anexo V, e o que muda daqui pra frente
  ↗ impostos · a alíquota deste mês sai mais cara, e a apuração precisa saber
- **L11** · Declara o pró-labore e gera a guia do INSS
  ↗ impostos · a guia do INSS chega na mesma lista do DAS e da taxa municipal
- **L13** · Entra na folha dos 12 meses e o anexo se sustenta
  ↗ impostos · é este número que decide o anexo da apuração
- **L14** · Fica FORA do Fator R, e a pessoa precisa saber o que isso custa
  ↗ impostos · a alíquota do mês muda · estar em dia · vira pendência
- **L18** · Mostra o caminho de volta pro Anexo III, se houver
  ↗ impostos · voltar de anexo muda a alíquota das competências seguintes, não das passadas
- **L20** · Diz o que a pessoa precisa saber antes de sacar
  ↗ impostos · a situação das guias é o que muda o AVISO, não a permissão
- **L21** · Avisa o risco, e o que o elimina
  ↗ impostos · quitar a guia é o que tira o risco
- **L22** · O lucro sai, e precisa ficar identificado pra conta fechar
  ↗ estar em dia · o lucro sacado entra na EFD-Reinf
- **L27** · Muda quem recebe pró-labore na empresa
  ↗ documentos · entrada ou saída de sócio é alteração contratual, e isso é outro rito
- **L32** · Diz o que trava o informe e o que custa destravar
  ↗ plano e cobrança · reabrir o balanço é serviço avulso, e caro
- **L34** · Retifica a declaração do mês, com o efeito que isso arrasta
  ↗ impostos · muda a folha dos 12 meses, logo muda o Fator R, logo pode mudar o anexo de várias competências · plano e cobrança · retificação é serviço avulso

## O que a varredura achou

**L0 · 1º acesso: quando começar a pagar pró-labore**

🆕 NASCEU EM 16/09, da reunião com o contador, e é pergunta ÚNICA: acontece no 1º acesso, não todo mês. 🔑 A lei manda gerar desde a constituição (*'se o cara está ali e não tem receita mas está tentando fazer essa receita, em tese ele já é contribuinte obrigatório'*), mas a prática de escritório espera a 1ª nota, porque forçar gera guia de INSS para quem não faturou: *'você me mandou uma guia de R$178 aqui e eu não tive faturamento. Tem muito, em todos os escritórios'*. ⚠️ O argumento a favor de gerar já NÃO é fiscal, é humano, e foi ele quem trouxe: contribuição contínua protege auxílio e maternidade. Então damos a opção e avisamos, não decidimos por ele. 🔒 UMA VEZ LIGADO, NÃO PARA: quem esquece de emitir e dobra a nota no mês seguinte precisaria de folha dobrada também. 🔴 E ISTO REVOGA A DECISÃO 36, travada em 14/09 como 'o app FORÇA o pró-labore no dia 1'.

**L1 · Chega o mês e o pró-labore precisa ser decidido**

🔑 Quem abre a decisão é a casa, não a pessoa. Esperar ela lembrar é o desenho que produz o mês esquecido — e mês esquecido de pró-labore quebra a contagem do Fator R.

**L3 · Mês sem faturamento: oferece não pagar, e diz o preço disso**

🔴 EU TINHA A LÓGICA INVERTIDA AQUI, e a conta real do Pedro provou em 13/09. Estava escrito que não pagar 'derruba o Fator R'. 🔑 O QUE DERRUBA É NÃO PAGAR. Mês sem FATURAR, com o pró-labore pago, EMPURRA o Fator R PRA CIMA — o numerador anda e o denominador não. São duas coisas opostas que eu tinha juntado numa frase só. Na plataforma do líder, maio/2026 teve receita zero e o Fator R melhorou tanto que o motor pôde BAIXAR o pró-labore de R$ 3.360 (que era 0,28 × 12.000, o alvo exato) para R$ 1.621 (o piso legal) sem perder o Anexo III. ✅ E a base legal da escolha existe: pró-labore NÃO é obrigatório todo mês, a obrigação nasce da remuneração efetivamente paga ou creditada (Lei 8.212/91 art. 12 V 'f' e art. 22 III · IN RFB 2.110/2022 art. 8º · SC COSIT 120/2016 e 251/2024). Empresa sem faturamento e sem caixa pode não pagar, sem infração. 🔴 O que NÃO pausa, e isso foi VISTO em produção: maio com receita zero tem PGDAS e DCTFWeb transmitidos igual a qualquer outro mês. Sem transmitir, multa mínima de R$ 200 (IN RFB 2.005/2021 art. 14 §3º I). ⚠️ A pesquisa diz que o 'sem movimento' se declara UMA VEZ por ano, não mês a mês — e o caso do Pedro NÃO testa isso, porque em maio ele pagou pró-labore e houve fato gerador. Continua pra conferir.

**L4 · Calcula quanto mantém a empresa no anexo mais barato**

🔑 A CONTA, na forma simples: pró-labore necessário = **30%** da receita dos 12 meses menos a folha já paga nos 12 meses. ⚠️ MIRAMOS 30%, NÃO OS 28% DA LEI, e o contador ratificou isso em 16/09 com caso de campo: *'é melhor você pecar nos 2% a mais do que chegar lá na frente e falar: faltou 0,1%. Tô com um caso lá embaixo, faltou 60 reais pra esse cara aqui'*. Faltar um centavo tira a tributação pelo Anexo III do mês inteiro, então a folga de 2 pontos é deliberada. ⚠️ JANELA MÓVEL: pagar hoje afeta os próximos 12 meses, e todo mês um mês antigo SAI da janela. Se o mês que sai tinha folha alta, o Fator R cai sozinho sem ninguém mexer em nada — é por isso que 'quanto falta' muda todo mês, e é aí que mora o diferencial nº 2. 🔴 A CPP **NÃO** ENTRA NO NUMERADOR — e este nó afirmava o contrário até 16/09. A leitura de 13/09 (*'conta no numerador, é ponto pacífico, SC COSIT 17/2021'*) foi **refutada em 14/09** contra norma literal: a Res. CGSN 140/2018 art. 26 §2º I 'a' nomeia **só o Anexo IV**, e o silêncio sobre III e V é vedação; a SC COSIT que o mercado cita trata de matéria diversa. O Fator R usa só a **folha efetivamente paga**. ⚠️ ESTA ERA A TERCEIRA CÓPIA da leitura errada: a 1ª foi corrigida no `_tabelas.mjs` em 15/09, a 2ª virou o assunto encerrado `E-CPP`, e esta sobreviveu porque a trava de reabertura varre só os 4 docs de pendência, não as fontes do cru. 🔒 E em 16/09 o Pedro fechou a segunda camada: o contador descreveu a manobra de somar a CPP para fechar a porcentagem, e a decisão foi **não fazer** — *'o CPP continuará sendo apenas gerado dentro da guia normal'*.

**L4b · Anualiza a folha também, e não só a receita**

✅ PROVADO NA CONTA REAL DO PEDRO EM 13/09, e não só na pesquisa. Empresa de 9 meses: receita anualizada ≈ R$ 74.547, folha anualizada ≈ R$ 22.085, Fator R ≈ 29,6% → Anexo III, 6%. Se a folha fosse somada CRUA (R$ 16.564) contra a receita anualizada, daria 22,2% → Anexo V, 15,5%. 🔴 O erro custaria, nesta empresa, mais que o dobro de imposto. ⚠️ A conta assume o pró-labore de fev = 3.360 e dez/jan = 0, porque o histórico da plataforma só devolve 6 meses. 🔴 NÓ NOVO EM 13/09, E É O MAIOR ACHADO DA PESQUISA. Empresa com menos de 13 meses não tem 12 meses de histórico, então a receita é anualizada (média dos meses anteriores × 12). 🔑 O QUE NINGUÉM SABIA AQUI: a FOLHA é anualizada pelo MESMO critério — Res. CGSN 140/2018 art. 26 §4º, que manda adotar 'os mesmos critérios' do art. 22. ⚠️ A pesquisa nomeia o erro oposto como falha comum de sistema: anualizar a receita e somar a folha crua. Aí a razão despenca perto de zero e a empresa recém-aberta perde a tributação pelo Anexo III sem merecer. 🔴 E ISSO É O NOSSO CLIENTE TÍPICO, não um caso de canto: o produto nasce da constituição, então a maioria entra com menos de 13 meses de vida. A persona zero tem 9 meses. ⚠️ Detalhe da regra: o mês de abertura conta INTEIRO, sem proporcionalizar por dias.

**L5 · Resolve se o alvo é alcançável neste mês**

🔴 O terceiro caminho não estava em lugar nenhum e é real: empresa que faturou muito num mês pode não conseguir atingir 28% nem pagando o máximo. Aí a resposta certa não é 'pague mais', é 'este mês você fica no Anexo V, e olha o que dá pra fazer nos próximos'.

**L6 · Mostra o valor sugerido e deixa mexer, vendo o imposto mudar**

🥇 É O DIFERENCIAL-ÂNCORA do produto. O líder tem 4 presets em radio button e esconde a conta atrás de 'confie na gente'. Aqui a pessoa move e vê INSS, IRRF, Fator R e a alíquota do DAS mudarem na hora. ⚠️ E o `percentualFatorR` viaja no payload do líder enquanto a tela dele só desenha '≥28%' — esconder é DECISÃO DE PRODUTO dele, não limitação técnica. 🔴 A PESQUISA DE 13/09 ACRESCENTOU UM RISCO QUE O SLIDER PRECISA CONHECER: arrastar o valor pro mínimo enquanto a empresa fatura alto não é neutro. A Receita e o CARF tratam isso como **Distribuição Disfarçada de Lucros** (Decreto-Lei 1.598/77 art. 60): reclassificam o que foi chamado de lucro isento em remuneração de trabalho, com IRRF de até 35%, INSS patronal e do segurado, e multa de ofício de 75% — que vira 150% se caracterizarem simulação. ⚠️ Cuidado com o que isso NÃO autoriza: a própria pesquisa sugere 'parametrizar o software para IMPEDIR', e isso contraria a régua travada pelo Pedro no mesmo dia. Aqui o slider AVISA, mostra o risco de um valor desproporcional, e deixa a pessoa decidir. INFORMAR, nunca TUTELAR.

**L9 · Confere se o valor respeita os limites**

✅ OS DOIS LIMITES AGORA TÊM VALOR E PORTARIA (pesquisa de 13/09): piso = o salário mínimo **DA COMPETÊNCIA**, e isso virou tabela com vigência em 16/09 (R$1.518 em 2025 · R$1.621 em 2026). 🔴 Com valor único, competência de 2025 era comparada com o piso de 2026, e um pró-labore de R$1.518 pago em dez/2025 — que era EXATAMENTE o mínimo daquele mês — saía bloqueado como irregular. 5 das 18 vidas começam em 2025. O contador levantou como manutenção (*'todo ano você vai rodar um código pra atualizar?'*) e o achado era de correção — o salário de contribuição não pode ser menor, mesmo para contribuinte individual. Teto = **R$ 8.475,55**, fixado pela Portaria Interministerial MPS/MF nº 13 de 09/01/2026, art. 2º. 🔑 E ISSO FECHA UMA DÚVIDA QUE EU TINHA DEIXADO EM ABERTO: o `valorMaximoInss: 932.3105` do líder, com 4 casas, NÃO é arredondamento tosco — é 11% × 8.475,55 exato. Fonte externa e plataforma do líder batendo na quarta decimal, então o número certo a guardar é 932,3105 e o arredondamento acontece só na exibição. ⚠️ O piso de R$ 1.621,00 veio de fonte única: conferir antes de virar trava. 🔑 O duplo vínculo entra AQUI, e não como funcionalidade separada: quem já contribui como CLT tem folga no teto, e isso muda quanto sai de INSS. O dado é captado na constituição (tela C2).

**L10 · Trava o valor do mês e monta o que vai ser declarado**

🔴 E aqui entra o que a evidência revelou e o P5 não sabia: o recibo tem LINHAS, e nem toda linha conta pro Fator R. O líder marca `incideINSS` por rubrica — 296 de 606 incidem. ⚠️ Mas ATENÇÃO ao tamanho disso no NOSSO caso: as 606 rubricas dele existem porque a plataforma dele atende folha completa e benefício, que são FORA DO ESCOPO aqui. Nosso sócio recebe pró-labore e ponto, então o recibo tem pouquíssimas linhas. O que fica de pé é a REGRA (somar por rubrica, não por total), não o volume.

**L12 · Confere se o dinheiro saiu de fato da empresa pro sócio**

🔴 CONTINUA SENDO O VERMELHO DA CATEGORIA, E A PESQUISA DE 13/09 DEIXOU ELE PIOR, NÃO MELHOR. Agora está confirmado com norma: o numerador do Fator R é **REGIME DE CAIXA**, valor efetivamente PAGO, qualquer que seja o regime de apuração da receita (Res. CGSN 140/2018 art. 26 §6º · SC COSIT 17/2021 e 251/2024). Pró-labore transmitido no eSocial e parado como 'obrigação com sócios' no passivo **NÃO CONTA**, e a Receita cruza EFD-Reinf, e-Financeira e PGDAS-D pra achar. 🔴 O preço, agora com artigo: glosa → **reclassificação de ofício** pro Anexo V → recálculo de TODAS as competências afetadas → diferença de alíquota (6% vira 15,5%) + Selic + **multa de ofício de 75%** (Lei 9.430/96 art. 44 I). ⚠️ E o caminho continua não existindo: o dinheiro vai da empresa pro sócio sem passar por nós nem pelo governo, não há API, e o único rastro previsto é o extrato que o cliente envia até o 5º dia útil (cláusula 5.4). 🔑 A pesquisa dá o requisito de arquitetura: o Fator R só pode ser alimentado DEPOIS da baixa do título, nunca no fechamento da folha. Ou seja, o app precisa de um estado 'declarado mas não pago' que hoje não existe em lugar nenhum.

**L14 · Fica FORA do Fator R, e a pessoa precisa saber o que isso custa**

⚠️ Serve pros dois casos: o mês em que se decidiu não pagar, e o mês em que se declarou e não se pagou. O segundo é mais perigoso, porque parece resolvido. ✅ E a pesquisa de 13/09 fechou COMO o mês vazio entra na conta: ele entra como **ZERO**, não é removido da janela. O calendário não pula mês — a receita continua somando no denominador enquanto o numerador registra 0,00, e o quociente comprime na hora. É a mecânica exata que o alerta do L17 precisa projetar.

**L15 · Acompanha o Fator R dos 12 meses, mês a mês**

🔑 A terceira saída é a que ninguém tem, inclusive o líder: o Fator R pode cair SEM NINGUÉM MEXER EM NADA, só porque um mês de folha alta saiu da janela de 12 meses. Vigiar o saldo de hoje não pega isso — só pega quem olha o mês que está prestes a sair.

**L17 · Avisa ANTES de virar, com o valor exato que resolve**

🔑 Aviso sem o número que resolve é susto. Tem que dizer quanto falta de pró-labore, não que 'o Fator R está caindo'. ⚠️ E o tempo importa: avisar em janeiro não ajuda, avisar em dezembro não dá tempo — a régua de antecedência não existe e é a mesma da vigília fiscal.

**L19 · O sócio quer tirar lucro da empresa**

🔑 LUCRO NÃO É PRÓ-LABORE, e o mapa precisa separar: pró-labore é remuneração de trabalho, entra na folha e paga INSS; lucro é resultado, não entra no Fator R. A pessoa não faz essa distinção, e o app precisa fazer por ela. ✅ Confirmado com norma em 13/09: distribuição de lucro NÃO compõe o numerador do Fator R (Res. CGSN 140/2018 art. 26 §2º). O mesmo dispositivo tira o aluguel pago ao sócio. ⚠️ Requisito que sai disso: as contas de patrimônio líquido e de distribuição precisam ser CEGAS pro acumulador do Fator R, senão a conta infla sozinha.

**L20 · Diz o que a pessoa precisa saber antes de sacar**

🔴 REESCRITO EM 13/09 — EU TINHA DESENHADO UMA FECHADURA, E NÃO É NOSSO PAPEL. A versão anterior dizia 'confere se a empresa PODE distribuir' e mandava pra uma porta travada. O Pedro corrigiu a doutrina: *'não é nosso papel regular como é usado esse faturamento, temos apenas que fazer nossa parte de cálculos e guias corretas nas datas corretas'*. 🔑 O fato legal continua de pé — débito federal em aberto torna a distribuição irregular, com multa de 50% sobre o distribuído — mas ele é INFORMAÇÃO QUE A PESSOA PRECISA TER, não permissão que a gente concede. A régua nova, que vale pro produto inteiro: INFORMAR, nunca TUTELAR.

**L21 · Avisa o risco, e o que o elimina**

⚠️ Aviso, não bloqueio. A pessoa decide, e decide sabendo. O que não pode acontecer é ela sacar sem nunca ter lido isso em lugar nenhum — que é exatamente o que acontece hoje no líder, onde o assunto não é citado.

**L22 · O lucro sai, e precisa ficar identificado pra conta fechar**

✅ **FECHADO EM 14/09 (Pedro) — o lucro é DECLARADO, nunca inferido.** A pergunta se partiu em duas e só uma era de verdade. **(1) MOSTRAR: não mostramos.** Nada de painel de 'lucro disponível' — o líder também não mostra, e sem conciliação (decisão 31) qualquer número seria errado. **(2) DECLARAR: obrigatório.** O cliente declara num campo, com prazo mensal, e a casa leva pra EFD-Reinf. Retirada acima do que a contabilidade suporta cai na decisão 32 (empréstimo ao sócio em *Créditos com Pessoas Ligadas*, sem bloquear e sem avisar). 🔑 **A responsabilidade tem instrumento pronto e não é nosso pra inventar:** a Carta de Responsabilidade da Administração (Res. CFC 1.590/2020 art. 3º) faz o cliente declarar que a informação é completa e verdadeira, e sem a assinatura dela o contábil não fecha. Nossa parte é PERGUNTAR EM TEMPO e DECLARAR O QUE FOI RESPONDIDO. ⏳ Sobra só o PRAZO (dia 15 como o líder, ou o nosso). ⚠️ A Lei 15.270/2025 chegou por citação em tela de concorrente: quer o texto legal ou o ok da Larissa antes de virar tela. ── O HISTÓRICO DO BURACO, que explica por que a resposta é essa: na plataforma do líder o lucro é INFERIDO DO EXTRATO — 'qualquer retirada que não seja pró-labore nem devolução de empréstimo' — silenciosamente, sem nunca perguntar nada ao cliente. O Pedro confirmou de dentro: *'em momento nenhum nem cita sobre retirada de lucro'*. ⚠️ A casa travou em 09/09 que NÃO terá conta nem integração bancária, então esse caminho não existe pra nós. Ou o lucro vira ato DECLARADO no app, ou a gente não sabe que ele saiu — e identificar não é vigiar: é o que faz a conta fechar. 📅 Desde 2026 (Lei 15.270/2025) o lucro sacado vai pra EFD-Reinf com IRRF antecipado. ✅ **14/09 — O BALANÇO DA CONTA REAL MOSTROU O QUE ACONTECE SEM EXTRATO, e é pior do que eu supunha:** a receita inteira de 2026 (R$43.910) fica como *Clientes a Receber* **nunca baixado**, o pró-labore inteiro fica como *Pró-Labore a Pagar* (R$14.652,96) **nunca baixado**, e o Caixa Geral vai a **−5.012,83**. O lucro contábil de 2026 é **R$22.917,38** e mesmo assim a API de distribuição devolve `saldo: 0`. 🔑 Ou seja: **sem conciliação, o balanço é competência pura e não serve como retrato financeiro.** ⚠️ O líder infere do extrato **só para quem usa a conta dele** (`BETA_CONTA_CONTABILIZEI`); a persona zero não usa, e por isso os livros dela ficam assim. 🔴 **A decisão segue nossa e segue aberta (B1 em `produto/me/persona-zero/acionaveis.md`)** — mas o caminho do meio está agora **descartado por evidência**: exibir 'Caixa' e 'Lucro disponível' calculados só por competência produz cliente sacando lucro que não existe.

**L23 · Muda alguma coisa na situação do sócio**

❌ Tinha QUATRO saídas aqui, e DUAS foram removidas em 13/09 pela trava de persona: 'entrou ou saiu um benefício' (FORA DO ESCOPO, junto com o L26) e 'mudou o número de dependentes' (junto com o L25). As duas moravam aqui porque eu copiei o cadastro do líder, não porque alguém pediu.

**L24 · Recalcula a folga no teto do INSS**

⚠️ Quem já contribui por fora não recolhe duas vezes até o teto. Muda o valor líquido do sócio sem mudar o valor declarado.

**L27 · Muda quem recebe pró-labore na empresa**

✅ CONFIRMADO COM NORMA EM 13/09 e RATIFICADO PELO CONTADOR EM 16/09: quem recebe pró-labore é quem ADMINISTRA — só o sócio que presta serviço à sociedade é segurado obrigatório como contribuinte individual (Lei 8.212/91 art. 12 V 'f'). *'O cara que não trabalha, às vezes é um sócio só de investimento; eu não tenho obrigatoriedade de gerar um pró-labore'*. 🔑 ESTE NÓ ESTAVA CERTO E O MOTOR É QUE TINHA DERIVADO: em 15/09 o `_modelo.mjs` passou a assumir 'todo sócio recebe', e em 16/09 voltou para cá. O desenho de processo sabia antes do código. ⚠️ O dado vem da constituição (qualificação 49 × 22), e o contador avisou que o app NUNCA vai saber sozinho: *'às vezes o cara pode colocar que um é administrador, mas quem está trabalhando é o outro'* — inclusive por motivo legítimo, como bloqueio judicial no nome de quem administra. Administrar é o DEFAULT, não a verdade. 🔴 E TEM UM EFEITO QUE NINGUÉM ESPERAVA, medido em 16/09: concentrar a folha em menos gente pode custar MAIS imposto, porque a tabela do IRRF é progressiva por pessoa. Folha de R$5.600 custa R$616,00 repartida entre dois e R$844,86 num sócio só; abaixo de R$5.000 por pessoa a diferença é zero. As duas coisas que o contador validou no mesmo dia colidem aqui, e a decisão do Pedro foi aplicar a regra E mostrar a conta: o motor avalia todos os arranjos e pergunta se algum outro sócio também TRABALHA. Pergunta sobre fato, nunca sobre conveniência fiscal.

**L30 · Confere se o informe do ano pode ser fechado**

🔴 O líder tem CINCO estados de bloqueio do informe, e o mapa anterior não conhecia nenhum. O informe não é documento que se imprime: é documento que depende da contabilidade estar fechada.

**L32 · Diz o que trava o informe e o que custa destravar**

⚠️ São DUAS reaberturas diferentes, e confundi-las custa dinheiro: reabrir o MÊS (R$21,90 no líder) é o que se faz pra mexer numa nota; reabrir o BALANÇO (R$142,90) é o que destrava o informe anual. Sete vezes mais caro.

**L34 · Retifica a declaração do mês, com o efeito que isso arrasta**

🔴 É o efeito dominó desta categoria, e ele é pior que o de Notas: mexer num mês de folha altera a JANELA DE 12 MESES inteira, então pode mudar o anexo de vários meses de uma vez. ⚠️ E retificação exige contador — é responsabilidade técnica, não botão.

## Nota de fonte

Gerado de `cru/prolabore.mjs`. O gerador só verifica o que é de dentro: saída apontando pra nó que existe, nó que termina declarando que termina, variável com pelo menos duas respostas, toda saída com condição escrita, e nenhum item da categoria esquecido. **Não** pergunta API, tela nem prazo — isso é a fase seguinte.
