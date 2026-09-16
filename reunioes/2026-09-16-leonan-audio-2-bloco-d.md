---
tipo: ata
data: 2026-09-16
fonte: Rua Satélite 50
participantes: [Pedro Maia, Leonan (Léo)]
audio: 2 de 3
---

# 🎙️ Áudio 2/3 — Leonan, 16/09: o ciclo do mês e o buraco do 1º mês

> 📖 **Leitura integral cumprida.** Transcript de **36.987 caracteres / 273 linhas**, lido **100%**. Notas do Plaud: 4.025 caracteres, lidas 100%. Literais em [[2026-09-16-rua-satelite-50-transcript-LITERAL]] e [[2026-09-16-rua-satelite-50-notas-plaud]].
>
> 🧭 **Onde este áudio pega.** Retomada depois do almoço, entrando no **Bloco D**. Percorreu a legenda das etiquetas, a tabela do **ciclo do mês** e a regra do **cálculo automático ligado**. Chegou na **P01** e **parou no meio** — o áudio corta na linha dos R$1.798.
>
> ⚠️ **É um áudio curto e denso.** Cinco vezes menor que o primeiro, e mesmo assim trouxe **a descoberta mais grave dos três**.

---

# 🔴 A DESCOBERTA — o Fator R lê a competência ANTERIOR, e o 1º mês não tem

Foi a discussão central, e ela **abre um buraco no motor**.

> *"Tudo no mesmo mês, o Fator R só considera o mês anterior. Vamos supor, você vai fazer a apuração ali do mês 8. **O Fator R só leva em consideração o mês 7. O mês 7 a empresa não existia.**"*
>
> *"Para reduzir de 15,5 para 6 naquele faturamento do mês 8, **eu teria que ter uma folha no mês 7**. Então ali ela vai ser tributada normal, nos 15,5. E a partir do mês seguinte, aí ele vai ser desbarrado."*

## 🔴 O que o nosso motor faz hoje, e por que não é contradição — é LACUNA

Testei em 16/09. Com a janela vazia, `fatorR` devolve:

```json
{ "fr": null, "anexo": null,
  "motivo": "sem receita e sem folha — a razão não existe, e não há o que tributar" }
```

🔑 **O motor não erra: ele se recusa a decidir.** Devolve `anexo: null` e entrega a decisão para quem chamou. E ninguém chamou — o `pilotar()` devolve `sem-receita-na-janela` e não atua.

**O Leonan preencheu a lacuna:** é **Anexo V, 15,5%**, obrigatoriamente, no mês da abertura com faturamento. Não é escolha, é consequência de não existir folha na competência anterior.

⚠️ **Nenhuma das nossas 16 vidas de teste exercita isso.** Todas abrem com receita zero no 1º mês. A P03, que fatura R$14.000 no mês da abertura, é **Anexo III fixo** — o Fator R não a toca. **O caso existe e nunca rodou.**

## 💰 O que custa, com os números dele

Empresa fatura **R$12.000** no mês em que abriu:

| | Valor |
|---|---:|
| DAS no Anexo V, 15,5% | **R$ 1.860,00** |
| DAS no Anexo III, 6% | **R$ 720,00** |
| **Diferença só na guia** | **R$ 1.140,00** |

E a conta completa, comparando os dois caminhos:

| | DAS | INSS | Total |
|---|---:|---:|---:|
| Sem o benefício *(pró-labore mínimo)* | R$ 1.860,00 | R$ 178,31 | **R$ 2.038,31** |
| Com o benefício *(folha de 28% = R$3.360)* | R$ 720,00 | R$ 369,60 | **R$ 1.089,60** |
| | | **economia** | **R$ 948,71** |

✅ Os números do Leonan batem com o motor ao centavo: ele disse 1.860, 720, 369,60 e 1.089,60.

## 🩹 O único conserto possível, e ele tem preço

> *"Só se eu for lá mandar o eSocial com a nova folha, **retificando**. Aí obviamente já vai ter passado do prazo de vencimento… eu vou ter que retificar essa informação, falar que meu débito era maior, e mandar uma **guia complementar** para ele que já tinha passado o vencimento, **com juros e multa**."*

🔑 **E a retificação não é opcional: ela acontece de qualquer jeito.**

> *"De qualquer forma, eu ia ter que mandar uma guia complementar. **De qualquer jeito? De qualquer jeito. Independente.**"*

---

# 🔴 E em 2027 a janela PULA UM MÊS

Ele soltou isso de passagem e é a mudança de regra mais pesada dos três áudios:

> *"Quando eu chegar na virada de 2027… soltaram uma atualização lá, de que agora **não é mais o mês anterior à competência, agora são dois meses anteriores**."*
>
> *"Na hora que eu chegar lá em janeiro, a competência de janeiro que eu vou apurar em fevereiro, **eu não considero janeiro a dezembro de 2026. Eu vou considerar dezembro de 2025 a novembro de 2026. Ele vai pular um mês.**"*
>
> *"**Daqui quatro meses vai mudar isso aí.**"*

⏳ **Não mexi em nada.** É citação de memória, sem norma nomeada, e muda `fatorRDeCompetencias` inteiro. Mas se confirmar, é a terceira coisa que muda em 2027, junto com a morte da DEFIS e o fim do regime de caixa. ⇢ **P8**

---

# ✅ O que ele ratificou no ciclo do mês

| Linha do ciclo | Veredito |
|---|---|
| **Competência fecha no último dia** | ✅ *"No último dia do mês."* E nota emitida **domingo** conta no mês: *"se for domingo, último dia de setembro, ela conta no mês nove"* |
| **Revisar o pró-labore todo mês** | ✅ *"Nós também vamos fazer todo mês. Não tem como te correr"* ⇢ fecha **🏢1** |
| **Vigiar o Fator R mês a mês** | ✅ E ele explicou por quê: *"se eu calculo 28% do mês, eu também estou calculando os 12 últimos"* |
| **DARF dia 20 antecipa · DAS dia 20 prorroga** | ✅ |
| **Pagar a guia é do cliente** | ✅ |
| **Conferir o pagamento e recalcular** | ✅ |
| **eSocial vence ANTES do DAS** | ✅ *"a guia dele para ser gerada, ele tem a data de vencimento da entrega do eSocial, dia 15"* |
| **Cálculo automático ligado por padrão, com aviso ao desligar** | ✅ *"a gente vai avisar. Não vai deixar passar. Tudo a gente vai avisar"* |

🔑 **Correção de vocabulário que ele fez duas vezes:** não se "cai para o Anexo V". A empresa **é** do Anexo V e **perde o benefício** de ser tributada pelo III.

> *"Não necessariamente o seu anexo de atividade é o 3. **O seu anexo é o 5, mas você recebe o benefício fiscal de ser tributado na alíquota menor.**"*

⚠️ O nosso documento inteiro diz "cai para o Anexo V". Não está errado no cálculo, mas está errado no nome — e é o nome que vai para a tela do cliente.

---

# 🔴 BH deixa emitir nota com competência RETROATIVA

Não sabíamos disso, e explica por que a trava importa:

> *"A nota de BH, normalmente, ela tem a **data de emissão** e a **data de competência**. Se o cara quiser informar hoje, dia 16 do nove, **uma competência de janeiro de 2026, ele pode fazer isso**."*

E o caso real que ele viveu:

> *"Já peguei uma vez o cara, ele emitiu muita nota retroativa… **ficou um milhão de reais sem levar para a tributação**. Aí, ou seja, era multa, juros."*

✅ **Confirma a nossa trava** de não permitir emissão retroativa. Mas ⚠️ **o cliente pode fazer isso por fora, direto no portal da prefeitura**, e o nosso app não vai saber. ⇢ **P9**

---

# ✅ O dia 5, e por que o robô só roda no dia 6

> **Léo:** *"Se eu der pro cara 5 dias depois, em tese eu só posso rodar o robô no dia 6. **Se você processou antes, a culpa vira minha.**"*

🔑 **Isso fecha o desenho da janela**, que estava com o dia de corte em aberto desde o áudio 1:

```
até o dia 5      →  cliente cancela/substitui livre
dia 6            →  o robô roda
até o dia 15     →  entrega da obrigação acessória
dia 20           →  vencimento das guias
```

⏳ Continua aberto só o dia de corte das alterações **pagas** (10 ou 12).

---

# ⚠️ A "gambiarra" — ele mostrou, e não fechou

O Pedro perguntou se dá para declarar o Anexo III no 1º mês mesmo sem folha anterior.

> *"Você consegue declarar lá no Anexo 3 sem precisar fazer que o cara seria do 5º. **Na gambiarra você consegue fazer isso. Só que não é legal. Pode dar problema.**"*
>
> *"Nunca vi um problema relacionado a isso… um fato da Receita ter cobrado 'esse mês aqui você colocou que era anexo com benefício de Fator R'. **Nunca vi ele fazer isso. Ainda não vi.**"*

**Pedro:** *"A gente assume esse risco?"*
**Léo:** *"Eu acho que a gente pode deixar isso à carga do usuário… **tem que ter um aceite. O contrato vai resguardar.**"*

🔴 **Não decidido, e eu NÃO tratei como decisão.** É a mesma família do que ele já tinha recusado no áudio 1 (*"aqui tudo tem que ser responsabilidade do cara do outro lado"*). ⇢ **P10, decisão do Pedro**

---

# 🔑 A razão pela qual isso talvez não importe

Depois de 25 minutos no problema, ele desarmou:

> *"Lá no outro escritório, abria 100 CNPJs. **Dificilmente eu pegaria um cara que faturava no mesmo mês. Muito difícil.** Eu não tenho nem lembrança de como que foi isso."*

E o Pedro achou o motivo estrutural:

> *"O nosso nicho, que é prestador de serviço, ele de fato vai ter que **cumprir a competência dos 30 dias trabalhados** para emitir a nota."*

> **Léo:** *"Se eu trabalho e depois eu recebo, o cara vai emitir essa nota só no outro mês."*

**✅ Decisão:** não construir automação para isso. **Alerta interno** quando um CNPJ faturar no mês da abertura, e tratamento humano caso a caso.

> *"Se eu ligar para ele e explicar o que ocorreu, ele vai entender melhor do que se eu só mandar a guia."*

---

# 🆕 A tela nova da Contabilizei, e a regra que ele tirou dela

O Pedro mostrou uma página nova deles que destrincha a alíquota. O Leonan gostou, com ressalva:

> *"Eu acho que manter isso aí, às vezes não sei se confunde o usuário… **mas isso aí já é um indicativo.**"*

E derivou a regra do vigia fiscal:

> *"**Qualquer coisa que eu tiver menor do que 28, já tem que me gerar um alerta** de fazer o ajuste na folha desse cara. Ele faz o 28% do seu faturamento, e o seu pró-labore total tem que ser aquilo **menos os pró-labores dos outros meses** — é o proporcional que ele tem que gerar naquele mês."*

✅ **É exatamente a fórmula do nosso piloto:** `alvo × receita da janela − folha já paga`. Ele descreveu a nossa conta sem ter visto o código. ⇢ **ratifica a conta 7 do Bloco E**

---

# 🕵️ O mistério da guia de R$168 — resolvido por hipótese

O Pedro tinha uma guia de R$168 sem explicação, logo depois da constituição. O Leonan reconheceu o número:

> *"R$168 é basicamente o valor do salário mínimo, dos 11%… quando era R$1.518, era R$166."*

E ligou com os R$11 do pró-labore de R$100:

> *"Às vezes eles foram lá, **retificaram a sua folha, gerou esse R$11 positivo e abateu esses R$11 na sua guia do mês** no próximo período."*

🟡 **Hipótese, não prova** — nem ele afirmou. Mas encaixa: R$166,98 de 11% sobre o mínimo, menos os R$11 pagos a mais em dezembro. ⇢ conferir na conta real

---

# ⏳ Onde o áudio corta

Na P01, exatamente na linha dos R$1.798 e R$2.158. Nem o Leonan nem o Pedro entenderam de onde saíam:

> **Léo:** *"Ele está falando de INSS, em 1.798? É um cálculo, eu perdi também."*
> **Pedro:** *"Não entendi, na verdade… Deve ser de pró-labore, será que não? Ou eu estou panguando aqui?"*

🔑 **Isto já foi resolvido em 16/09, depois da reunião:** são `28% × 18.000 − 3.242 = 1.798` e `30% × 18.000 − 3.242 = 2.158`, onde os R$3.242 são a folha já paga em março e abril. A redação da persona foi corrigida para mostrar a conta na própria linha. ⇢ ver commit `1a5175e`

⚠️ **Mas o fato de dois leitores terem travado na mesma linha é dado de usabilidade**, não coincidência. O briefing precisa mostrar a conta onde ela aparece, não só no bloco de cálculos.

---

# ⏳ Pendências novas deste áudio

| | O que falta | Peso |
|---|---|---|
| **P8** | 🔴 A janela do Fator R pula um mês em 2027. Citação de memória, **sem norma nomeada** | crítico |
| **P9** | 🔴 O cliente pode emitir nota retroativa **direto no portal de BH** e o app não saber | 🔴 |
| **P10** | 🔴 A "gambiarra" do Anexo III no 1º mês: assumimos ou não? | 🔴 Pedro |
| **P11** | 🟡 O motor devolve `anexo: null` com janela vazia e **ninguém trata**. Precisa decidir V | produto |
| **P12** | 🟡 Nenhuma vida de teste fatura no mês da abertura com CNAE de Fator R | testes |
| **P13** | ⚪ Trocar "cai para o Anexo V" por "perde o benefício do Anexo III" em todo o vocabulário | copy |

---

## Links
[[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[_duvidas-contador]] · [[2026-09-16-rua-satelite-50-transcript-LITERAL]] · [[_achados-do-motor]] · [[PENDENCIAS]]
