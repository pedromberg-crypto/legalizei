---
tipo: verdade
status: vivo
data: 2026-09-15
assunto: cobertura-situacional-das-vidas
autoridade: fonte-verdade
tags: [execucao, motor-fiscal, persona, cobertura]
---

# 🎯 O que as 16 vidas exercitam — e o que ainda não

> 🧭 **A régua.** Não é "temos personas suficientes?", é **"existe código no motor que nenhuma vida faz rodar?"**. Código sem vida é código sem prova, e foi assim que o erro dos sócios (M-012) sobreviveu: `darfDoProLabore` era chamado todo dia e **nunca** com mais de um sócio de verdade.

## Onde estamos, medido em 15/09

| | |
|---|---|
| Vidas | **16** (P01–P14, P16, P18) · P15 e P17 nunca abrem · P19 e P20 não acrescentam |
| Dinâmicas (Fator R decide) | **6** — P01, P02, P04, P06, P16, P18 |
| `III-fixo` | **10** |
| Com 2+ sócios | **8** — P02, P04, P06, P09, P11, P13, P14, P18 |
| Com CLT do sócio | **3** — P02 (6k), P09 (9k), P14 (3k) |
| Competências | de 4 (P12) a 26 (P18) |

## 🔑 Uma descoberta de escopo que simplifica o produto

**O ME só alcança as faixas 1 e 2 da tabela.** A faixa 1 vai até R$180 mil de RBT12, a faixa 2 até R$360 mil, e R$360 mil **é o teto do ME**. O RBT12 máximo de todo o elenco é R$359.000 (P16), e isso não é limitação do elenco: é o limite do enquadramento.

As faixas **3, 4, 5 e 6** da tabela só existem para quem **sai** para EPP — que na nossa persona é porta de saída, nunca permanência. Elas seguem implementadas e conferidas contra a lei (e o invariante da 6ª faixa continua valendo), mas **não precisam de vida**. É trabalho que não precisa ser feito.

---

## 🔒 O que está TRAVADO fora, por decisão

**Colaboradores = ZERO em todas as 16 vidas.** Decisão do Pedro em 15/09: *"quero que todas as personas rodem liso sem terem colaboradores; depois iremos acrescentar folha em algumas delas, mas quando desenharmos melhor a funcionalidade. Prefiro validar o fluxo sem essa variável nesse momento."*

🔑 O campo `colaboradores` existe na identidade **travado em 0**, e o `verificar-vidas.mjs` derruba a rodada se alguém puser um. Assim "nenhuma persona tem funcionário" deixa de ser ausência silenciosa e vira **declaração** — o item **B1** abaixo continua descrito para quando destravar, mas saiu da fila.

---

## ✅ Fechados em 15/09, depois de rever

### A1 · ⏰ Guia paga em atraso — **FEITO**
`guiaVencida()` agora roda pelo estado: a **P09** tem 3 competências seguidas pagas com 14, 21 e 14 dias de atraso, espelhando o padrão da conta real. O atraso é **derivado** (dias entre o vencimento e a baixa), nunca guardado. Custo apurado: **R$393,32** em 3 meses.
🐛 **E o motor pegou um erro meu na hora:** eu marquei os pagamentos para o início do mês seguinte achando que o DAS vencia no mês da competência. Ele vence no dia **20 do mês seguinte**, então meus pagamentos caíam **antes** do vencimento e o motor devolveu `emDia` em vez de inventar atraso. O olho não teria pego.

### A2 e A4 · 🔒 SAÍRAM DESTA LISTA — assunto encerrado [ENCERRADO]

Os dois itens que eu tinha escrito aqui sobre retenção **não eram buracos de cobertura**, eram assunto já resolvido em 14/09 que eu reabri. O registro completo, com a regra, a fonte e a decisão de produto, vive em **`execucao/motor-fiscal/_encerrados.mjs` · E-ISS**, e o `verificar-encerrados.mjs` derruba a rodada se voltarem para cá.

🔴 **Decisão de produto do Pedro, 15/09:** o assunto não é cálculo, tela, pergunta nem decisão do usuário. Nada dele aparece para o cliente.

⚠️ **O que segue aberto é OUTRA coisa, com outro nome:** `SUBSTITUTOS_BH` é **paráfrase**, não texto literal da Lei 8.725/2003. Isso é pendência de **leitura integral**, não de pesquisa nem de persona — e mora na fila de leitura.

---

## ⬜ O que falta — A · o motor tem código e nenhuma vida faz rodar

> Esta é a lista que importa. Cada linha é um pedaço do motor que nunca foi exercitado por uma história completa.

### A1 · ✅ Guia paga em ATRASO — **FEITO em 15/09** (ver a seção de fechados acima)

### A3 · 🟡 Rateio DESIGUAL de pró-labore entre sócios
`darfDaFolha()` nasceu hoje e aceita valor por sócio, mas as 8 vidas com 2+ sócios usam **rateio igual**. O caminho desigual é código novo sem prova nenhuma. ⚠️ Depende da **D-02** com o contador: se rateio desigual for raro, isso desce de prioridade.

### A4 · 🔒 REMOVIDO — assunto encerrado, ver `_encerrados.mjs` · E-ISS [ENCERRADO]

---

## ⬜ O que falta — B · nem código, nem vida

### B1 · 🔴 Folha de COLABORADOR (o maior buraco)
Nenhuma das 16 tem funcionário. E o `FATOR_R_NUMERADOR` declara que entram **salário CLT, 13º, férias + 1/3 e FGTS** — quatro itens que **nada no motor produz**. O contrato já cobra **R$39 por colaborador ativo** e nada cria um. É o limite **PP5** do piloto.
🔑 **Impacto no piloto:** com folha de colaborador, o Fator R sobe sem mexer no pró-labore — e o piloto hoje só sabe mexer no pró-labore. A recomendação dele passaria a ser **errada para mais** numa empresa com funcionário.

### B2 · 🔴 O 13º e as férias, mesmo sem colaborador
Mesmo empresa só de sócio tem 13º de pró-labore? (⚠️ **isto é dúvida real** — o pró-labore não gera 13º nem férias como o salário CLT, mas a folha do Fator R lista os dois.) Vale virar pergunta ao contador antes de virar vida.

### B3 · 🟡 Sócio que ENTRA ou SAI no meio da vida
Todas as 16 têm quadro societário congelado. Entrada e saída de sócio muda quem recebe pró-labore, muda o `sociosComProLabore`, e a nossa persona admite **1 a 4 sócios**.

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
| 🔒 | ~~B1 · colaborador~~ | **travado fora** por decisão do Pedro — volta quando a funcionalidade for desenhada |
| 🔒 | ~~A2 e A4~~ | **encerrados**, ver `_encerrados.mjs` · E-ISS [ENCERRADO] |
| **1º** | **B5 · desenquadramento** | Fecha a porta de saída para EPP, a única hipótese de EPP na persona |
| **2º** | **B6 · nota cancelada** | Aconteceu na conta real e me fez ler a série errada |
| **3º** | **B4 · CLT que muda no tempo** | Exporia com número um defeito que hoje é só comentário |
| depois | A3, B2, B3, B7 | Dependem de decisão (D-02, B2 é dúvida de contador) ou de campo que o app não coleta |

## Links
[[_achados-do-motor]] · [[_duvidas-contador]] · [[PERSONA]] · [[personas-entrada-me]]
