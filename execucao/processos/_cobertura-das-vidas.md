---
tipo: verdade
status: vivo
data: 2026-09-17
assunto: cobertura-situacional-das-vidas
autoridade: fonte-verdade
tags: [execucao, motor-fiscal, persona, cobertura]
---

# 🎯 O que as 18 vidas exercitam — e o que ainda não

> 🧭 **A régua.** Não é "temos personas suficientes?", é **"existe código no motor que nenhuma vida faz rodar?"**. Código sem vida é código sem prova, e foi assim que o erro dos sócios (M-012) sobreviveu: `darfDoProLabore` era chamado todo dia e **nunca** com mais de um sócio de verdade.

## Onde estamos, medido em 17/09

> 🔁 **Os números desta tabela são conferidos a cada rodada** pelo `verificar-defasagem.mjs`, que compara o que está escrito aqui com o que o `vidas.mjs` tem de fato. Se divergirem, a rodada cai.

| | |
|---|---|
| Vidas | **18** (P01–P14, P16, P18, P21, P22) · P15 e P17 nunca abrem · P19 e P20 não acrescentam |
| Competências rodadas | **169** |
| Dinâmicas (Fator R decide) | **7** — P01, P02, P04, P06, P16, P18, **P21** |
| `III-fixo` | **10** |
| Com 2+ sócios **no quadro** | **9** — P02, P04, P06, P09, P11, P13, P14, P18, **P21** |
| Com 2+ sócios **recebendo** | **6** — P02, P06, P09, P11, P13, P18 |
| Com CLT do sócio | **3** — P02 (6k), P09 (9k), P14 (3k) |
| Competências por vida | de 4 (P12) a 26 (P18) |

🔑 **As duas linhas de sócio são coisas diferentes, e passaram a ser desde 16/09.** `sociosTotal` responde *"de quantos"*; `sociosComProLabore` responde *"quantos recebem"*. A regra validada pelo contador é que **recebe quem administra** — por isso P04 (1 de 2), P14 (1 de 3) e P21 (1 de 2) têm quadro de 2+ e folha de um só. Antes disso o motor pagava a todos, e era o erro **M-012**.

## 🔑 Uma descoberta de escopo que simplifica o produto

**O ME só alcança as faixas 1 e 2 da tabela.** A faixa 1 vai até R$180 mil de RBT12, a faixa 2 até R$360 mil, e R$360 mil **é o teto do ME**. O RBT12 máximo de todo o elenco é R$359.000 (P16), e isso não é limitação do elenco: é o limite do enquadramento.

As faixas **3, 4, 5 e 6** da tabela só existem para quem **sai** para EPP — que na nossa persona é porta de saída, nunca permanência. Elas seguem implementadas e conferidas contra a lei (e o invariante da 6ª faixa continua valendo), mas **não precisam de vida**. É trabalho que não precisa ser feito.

---

## 🔒 O que está TRAVADO fora, por decisão

**Colaboradores = ZERO em todas as 18 vidas.** Decisão do Pedro em 15/09: *"quero que todas as personas rodem liso sem terem colaboradores; depois iremos acrescentar folha em algumas delas, mas quando desenharmos melhor a funcionalidade. Prefiro validar o fluxo sem essa variável nesse momento."*

🔑 O campo `colaboradores` existe na identidade **travado em 0**, e o `verificar-vidas.mjs` derruba a rodada se alguém puser um. Assim "nenhuma persona tem funcionário" deixa de ser ausência silenciosa e vira **declaração** — o item **B1** abaixo continua descrito para quando destravar, mas saiu da fila.

---

## ✅ Fechados em 16/09, depois da reunião com o contador

### A5 · 🗓️ Constitui e fatura no MESMO mês — **FEITO, nasceu a P21**

O buraco que a reunião expôs: **nenhuma vida do elenco de então abria e emitia nota na mesma competência**. Todas faturavam a partir do mês seguinte, que é o padrão da persona — e por isso o Fator R já nascia com janela para ler.

A **P21** faz o caso raro: abre em **16/09/2026**, emite no próprio setembro, CNAE `6201-5/01` (Fator R decide), **1 de 2 sócios** recebendo, 6 competências. Ela existe para provar três coisas de uma vez:

| | O que ela prova |
|---|---|
| **Janela vazia → Anexo V** | sem folha em competência anterior, o Fator R não tem o que ler. O motor **resolve para V**, não grita |
| **O alerta A1** | `alertas-internos.mjs` dispara em `faturouSemJanela`, com prazo **15/10** (eSocial) e o valor em jogo na mão |
| **O mês seguinte fluido** | com pró-labore pago no mês da abertura, a 2ª competência já tem base e o Anexo III entra |

🔑 **A 1ª versão dela modelava o cliente RECUSANDO a oferta** — folha zero no mês da abertura. A vida inteira ficou no Anexo V e provou o contrário do que existia para provar. O que ela precisa exercitar é o caminho em que **o contato funciona**.

⚠️ **O invariante do bloco 8 inverteu junto:** ele dizia *"NENHUMA vida exercita o caso"* e passava; agora afirma o contrário e é ele que segura a P21 no lugar.

---

## ✅ Fechados em 15/09, depois de rever

### A1 · ⏰ Guia paga em atraso — **FEITO**
`guiaVencida()` agora roda pelo estado: a **P09** tem 3 competências seguidas pagas com 14, 21 e 14 dias de atraso, espelhando o padrão da conta real. O atraso é **derivado** (dias entre o vencimento e a baixa), nunca guardado. Custo apurado: **R$393,32** em 3 meses.
🐛 **E o motor pegou um erro meu na hora:** eu marquei os pagamentos para o início do mês seguinte achando que o DAS vencia no mês da competência. Ele vence no dia **20 do mês seguinte**, então meus pagamentos caíam **antes** do vencimento e o motor devolveu `emDia` em vez de inventar atraso. O olho não teria pego.

### A2 e A4 · 🔒 SAÍRAM DESTA LISTA — assunto encerrado [ENCERRADO]

Os dois itens que eu tinha escrito aqui sobre retenção **não eram buracos de cobertura**, eram assunto já resolvido em 14/09 que eu reabri. O registro completo, com a regra, a fonte e a decisão de produto, vive em **`produto/me/viver/motor/provar/_encerrados.mjs` · E-ISS**, e o `verificar-encerrados.mjs` derruba a rodada se voltarem para cá.

🔴 **Decisão de produto do Pedro, 15/09:** o assunto não é cálculo, tela, pergunta nem decisão do usuário. Nada dele aparece para o cliente.

⚠️ **O que segue aberto é OUTRA coisa, com outro nome:** `SUBSTITUTOS_BH` é **paráfrase**, não texto literal da Lei 8.725/2003. Isso é pendência de **leitura integral**, não de pesquisa nem de persona — e mora na fila de leitura.

---

## ⬜ O que falta — A · o motor tem código e nenhuma vida faz rodar

> Esta é a lista que importa. Cada linha é um pedaço do motor que nunca foi exercitado por uma história completa.

### A1 · ✅ Guia paga em ATRASO — **FEITO em 15/09** (ver a seção de fechados acima)

### A3 · 🟢 Rateio DESIGUAL de pró-labore — **desceu de prioridade em 16/09, com razão declarada**
`darfDaFolha()` aceita valor por sócio, mas as 6 vidas com 2+ sócios **recebendo** usam **rateio igual**. O caminho desigual segue sem vida.

✅ **A D-02 foi respondida pelo contador, e a resposta muda o peso disto:** o rateio **igual é o default e é o tecnicamente certo** — desigual empurra um dos sócios para faixa de IRRF mais alta. Desigual só cabe quando **o outro sócio não trabalha efetivamente** na empresa, e a decisão travada é que ele **não é campo de tela**: sai por contato.

🔑 **Então o caminho desigual não é um fluxo do produto**, é uma exceção operada por fora. Código sem vida continua sendo código sem prova — mas a vida que faltava aqui vale menos que as de B5 e B6.

🔴 **O que a D-02 abriu de verdade não é cobertura, é tela:** o app hoje **deduz o rateio do percentual de participação**, e aquele campo governa **lucro**, não pró-labore. Isso é item de produto, não de elenco.

### A4 · 🔒 REMOVIDO — assunto encerrado, ver `_encerrados.mjs` · E-ISS [ENCERRADO]

---

## ⬜ O que falta — B · nem código, nem vida

### B1 · 🔴 Folha de COLABORADOR (o maior buraco)
Nenhuma das 18 tem funcionário. E o `FATOR_R_NUMERADOR` declara que entram **salário CLT, 13º, férias + 1/3 e FGTS** — quatro itens que **nada no motor produz**. O contrato já cobra **R$39 por colaborador ativo** e nada cria um. É o limite **PP5** do piloto.
🔑 **Impacto no piloto:** com folha de colaborador, o Fator R sobe sem mexer no pró-labore — e o piloto hoje só sabe mexer no pró-labore. A recomendação dele passaria a ser **errada para mais** numa empresa com funcionário.

### B2 · 🔴 O 13º e as férias, mesmo sem colaborador
Mesmo empresa só de sócio tem 13º de pró-labore? (⚠️ **isto é dúvida real** — o pró-labore não gera 13º nem férias como o salário CLT, mas a folha do Fator R lista os dois.) Vale virar pergunta ao contador antes de virar vida.

### B3 · 🟡 Sócio que ENTRA ou SAI no meio da vida
Todas as 18 têm quadro societário congelado. Entrada e saída de sócio muda quem recebe pró-labore, muda o `sociosComProLabore`, e a nossa persona admite **1 a 4 sócios**.

🔑 **Ficou mais interessante depois de 16/09:** com a regra de que **recebe quem administra**, um sócio que entra pode entrar administrando ou não — e são dois efeitos diferentes no Fator R. A P04, a P14 e a P21 já têm quadro maior que a folha; nenhuma delas mexe nisso no tempo.

### B4 · 🟡 O CLT do sócio que MUDA no tempo
Hoje `cltDoSocio` mora na **identidade**, não na competência — de propósito, porque é assim que o app capta (uma vez, no C2, e nunca revalida; achado de 27/08). Uma vida em que o sócio sai do emprego no meio **exporia esse defeito com número** em vez de deixá-lo como comentário.

### B5 · 🟡 Desenquadramento: passar dos R$360 mil
A P16 encosta em R$359.000 e não passa, de propósito. Ninguém atravessa. A porta de saída para EPP (a única hipótese de EPP na nossa persona) nunca foi percorrida — e é ela que dá sentido às faixas 3-6.

### B6 · 🟡 Nota CANCELADA ou receita retificada
Aconteceu na conta real: uma NF de R$12.000 cancelada que **não deixou nenhum lançamento no Diário**, e que me fez ler a série errada. O motor trata `receita` como número fechado do mês; retificação não existe.

### B7 · ⬜ Mudança de CNAE principal
Uma empresa que troca de `III-fixo` para `fator-r-dinamico` (ou o contrário) muda o comportamento do piloto de um mês para o outro. Nenhuma vida muda de CNAE.

---

## 📋 Ordem que eu proponho

| | O quê | Por quê primeiro |
|---|---|---|
| ~~1º~~ | ~~A1 · atrasos~~ | ✅ **feito em 15/09** |
| ~~1º~~ | ~~A5 · constitui e fatura no mesmo mês~~ | ✅ **feito em 16/09** — nasceu a **P21** |
| 🔒 | ~~B1 · colaborador~~ | **travado fora** por decisão do Pedro — volta quando a funcionalidade for desenhada |
| 🔒 | ~~A2 e A4~~ | **encerrados**, ver `_encerrados.mjs` · E-ISS [ENCERRADO] |
| **1º** | **B5 · desenquadramento** | Fecha a porta de saída para EPP, a única hipótese de EPP na persona |
| **2º** | **B6 · nota cancelada** | Aconteceu na conta real e me fez ler a série errada |
| **3º** | **B4 · CLT que muda no tempo** | Exporia com número um defeito que hoje é só comentário |
| depois | B2, B3, B7 | Dependem de dúvida de contador (B2) ou de campo que o app não coleta |
| por último | **A3** | A D-02 respondeu: desigual **não é fluxo do produto**, sai por contato |

<!-- MATRIZ:INICIO — gerado por cru/gerar-cru.mjs, não editar à mão -->

## 📐 Matriz de prontidão — o desenho de processo contra as 58 funcionalidades

> 🧭 **Outra pergunta, mesmo assunto.** O resto desta nota pergunta *"existe código no motor que nenhuma vida faz rodar?"*. Esta tabela pergunta *"existe funcionalidade do painel que nenhum processo desenhado sustenta?"*. As duas medem cegueira; uma pelo cálculo, a outra pelo desenho.

**24 das 58 funcionalidades têm pelo menos um nó de processo.**

| Categoria | Com nó | Nós apontando | Estado |
|---|:--:|:--:|---|
| 🏠 **Home e navegação** | 0/5 | — | ⬜ **não varrida** |
| 🏛 **Impostos** | 8/8 | 20 | 🟢 varrida inteira |
| 🧾 **Notas fiscais** | 9/9 | 17 | 🟢 varrida inteira |
| 👥 **Pró-labore e sócios** | 7/7 | 14 | 🟢 varrida inteira |
| ✅ **Estar em dia** | 0/6 | — | ⬜ **não varrida** |
| 📄 **Documentos e certificado** | 0/6 | — | ⬜ **não varrida** |
| 💳 **Plano e cobrança** | 0/7 | — | ⬜ **não varrida** |
| 👷 **Folha de pagamento** | 0/10 | — | ⬜ **não varrida** |

🔑 **A cobertura é CATEGÓRICA, não parcial — e isso é a boa notícia.** Dentro das categorias varridas ela é **integral**: nenhum item ficou para trás. O que falta são **5 categorias inteiras** que o modo cru nunca varreu, e que estão declaradas como não varridas desde 12/09, quando o método cronológico assumiu.

⚠️ **Então o número que interessa não é "24 de 58", é "3 de 8 categorias".** Ler como 41% de prontidão sugere buraco espalhado; o buraco é de fronteira, e retomar as categorias que faltam é **decisão aberta do Pedro**, não dívida esquecida.

🔒 **E a Folha é a maior delas de propósito:** colaborador está **travado fora** por decisão dele em 15/09, e as 10 funcionalidades da categoria dependem dessa destrava.

<!-- MATRIZ:FIM -->

## Links
[[_achados-do-motor]] · [[_duvidas-contador]] · [[PERSONA]] · [[personas-entrada-me]]
