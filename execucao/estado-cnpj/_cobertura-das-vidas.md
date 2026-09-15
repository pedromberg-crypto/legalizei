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

## ⬜ O que falta — A · o motor tem código e nenhuma vida faz rodar

> Esta é a lista que importa. Cada linha é um pedaço do motor que nunca foi exercitado por uma história completa.

### A1 · 🔴 Guia paga em ATRASO (multa + Selic)
`guiaVencida()` existe, com multa, juros e Selic — e **nenhuma das 16 vidas paga nada em atraso**. Todas pagam em dia, o que é exatamente o cenário que não dói. 🔑 **E o caso real contradiz o elenco:** a conta que analisamos tem **R$229,85 de multa em 3 competências seguidas**, com as duas guias atrasadas todas as vezes (~13, ~21 e ~14 dias). Atraso não é exceção, é o comportamento comum — e é o caso de uso mais forte do lembrete de vencimento.
**Proposta:** uma vida com atrasos recorrentes de 10-20 dias, espelhando a conta real.

### A2 · 🟡 Retenção de ISS de tomador de FORA de BH
`retencaoLegitima()` decide se a retenção é válida pelo município do tomador, e a resposta importante é que tomador de outro município reter é ato *"eivado de nulidade"*. A P04 tem ISS retido, mas **só de tomador dentro de BH**. O caminho que rejeita a retenção ilegítima nunca rodou.
**Proposta:** dar à P04 (ou a uma nova) competências com tomador de fora, para o motor ter que recusar.

### A3 · 🟡 Rateio DESIGUAL de pró-labore entre sócios
`darfDaFolha()` nasceu hoje e aceita valor por sócio, mas as 8 vidas com 2+ sócios usam **rateio igual**. O caminho desigual é código novo sem prova nenhuma. ⚠️ Depende da **D-02** com o contador: se rateio desigual for raro, isso desce de prioridade.

### A4 · 🟡 Anexo V **com** ISS retido, na faixa 2
A P16 é Anexo V e não tem retenção. A P04 tem retenção e é Anexo III. A combinação — alíquota de 15,5%+ com segregação do ISS — nunca rodou, e é onde a repartição por tributo do V encontra a regra do art. 21 §4º.

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
| **1º** | **A1 · atrasos** | Código pronto, caso real documentado, e é o argumento do lembrete de vencimento |
| **2º** | **B1 · colaborador** | O maior buraco, e o único que faz o **piloto recomendar errado** |
| **3º** | **A2 · retenção ilegítima** | Código pronto, caminho de rejeição nunca rodou |
| **4º** | **B5 · desenquadramento** | Fecha a porta de saída e dá sentido às faixas 3-6 |
| **5º** | **A4 · Anexo V com retenção** | Combinação que nenhuma vida cobre |
| depois | A3, B3, B4, B6, B7 | Dependem de decisão (D-02) ou de campo que o app ainda não coleta |

## Links
[[_achados-do-motor]] · [[_duvidas-contador]] · [[PERSONA]] · [[personas-entrada-me]]
