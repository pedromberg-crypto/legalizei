---
tipo: derivado
status: vivo
data: 2026-09-16
assunto: o-que-erravamos-e-o-que-acertamos-depois-da-reuniao
tags: [execucao, motor-fiscal, validacao, leonan, relatorio]
---

# 📊 Antes e depois: o que o motor errava, e o que passou a acertar

> 🧭 **Para que serve.** A reunião de 16/09 com o contador ratificou quase tudo e corrigiu quatro coisas. Este documento mede **o que cada correção mudou**, com número, e diz onde **nada mudou** — que é a parte que dá crédito ao resto.
>
> 🔑 **Todos os números saíram do motor rodando em 16/09**, comparando a série com o parâmetro antigo contra a mesma série com o novo. Nenhum foi digitado.
>
> ⚠️ **A honestidade que este doc precisa ter:** três das quatro correções mudaram **zero reais**. Se este relatório só mostrasse o que mexeu, ele mentiria por seleção.

---

## 🎯 O placar

| | Antes | Depois |
|---|---:|---:|
| Vidas de teste | 16 | **17** |
| Competências rodadas | 156 | **162** |
| Invariantes | 32 | **54** |
| Auditoria de agregação | 142 | **154** |
| Conferências do apurador | 45 | 45 |
| Conferências do piloto | 67 | 67 |
| **Falhas** | 0 | **0** |

---

## 💰 O que mudou de dinheiro

### P04 · a única cujo imposto mudou

Ela sempre disse *"administra só o titular"* no `personas-entrada-me`, e mesmo assim pagava pró-labore aos dois sócios. Era a tensão que o `M-013` deixou anotada em 15/09 e que ninguém resolvia.

| | DARF nas 7 competências |
|---|---:|
| Antes · 2 sócios recebiam | R$ 2.930,62 |
| Depois · só o administrador | **R$ 3.159,48** |
| | **+ R$ 228,86** |

🔴 **Repare no sinal: a regra CERTA cobra MAIS.** E a diferença inteira mora num mês só — maio, quando a folha de R$5.600 concentrada numa pessoa cruza a faixa do IRRF que o rateio evitava. Nos outros seis meses a diferença é **zero**.

🔑 **É a colisão que a reunião produziu sem querer.** O contador validou no mesmo dia que *"paga quem trabalha"* e que *"dividir meia a meia é o ótimo tributário"* — e as duas apontam para lados opostos quando só um sócio administra.

✅ **A decisão do Pedro foi não escolher por ele:** aplicamos a regra e **mostramos a conta**. O `ganhoDeIncluirSocio()` avisa que incluir outro sócio **que de fato trabalhe** sairia R$228,86 mais barato naquele mês. A pergunta é sobre **fato**, nunca sobre conveniência fiscal.

### P14 · mudou a regra, não mudou o imposto

Mesmo caso: 3 sócios, administra só o titular, passou a pagar a 1.

| | DARF nas 9 competências |
|---|---:|
| Antes · 3 recebiam | R$ 4.814,37 |
| Depois · 1 recebe | **R$ 4.814,37** |
| | **R$ 0,00** |

🔑 **E isso é resultado, não anticlímax.** A folha de R$4.863 dividida por 3 dá R$1.621 cada; concentrada dá R$4.863 numa pessoa. Nos dois casos o INSS é 11% linear e o IRRF é zero, porque ninguém passa de R$5.000. **A regra mudou, o dinheiro não.**

⚠️ Foi justamente aqui que a primeira versão do sinal de concentração disparou **R$0,01 em 9 meses seguidos** — arredondamento virando sugestão de tela. O limiar virou semântico por causa disto.

---

## 🆕 O caminho que não existia em persona nenhuma

### P21 · Tiago, que fatura no mês em que abre

**Nasceu porque um invariante afirmava que ela faltava.** As 16 vidas abriam **todas** sem faturar no mês 1, então o caminho da janela vazia só existia em teste sintético meu — exatamente o tipo de prova que o Pedro mandou parar de aceitar.

| Competência | Receita | Folha | Anexo | DAS |
|---|---:|---:|:---:|---:|
| **2026-09** *(abre e fatura)* | 12.000 | 3.600 | 🔴 **V** | **R$ 1.860,00** |
| 2026-10 | 12.000 | 3.600 | III | R$ 720,00 |
| 2026-11 | 12.000 | 3.600 | III | R$ 720,00 |
| 2026-12 | 18.000 | 5.600 | III | R$ 1.080,00 |
| 2027-01 | 12.000 | 3.600 | III | R$ 720,00 |
| 2027-02 | 12.000 | 3.600 | III | R$ 720,00 |

**O que ela prova, e nenhuma outra provava:**

| | |
|---|---|
| 🔴 **O mês da abertura é tributado pelo Anexo V** | não existe competência anterior com folha. Até 15/09 o motor **gritava** aqui |
| 🔔 **O alerta A1 dispara**, com prazo `2026-10-15` | e o prazo é o do **eSocial**, não o do DAS |
| ✅ **O prejuízo é de UM mês** | R$1.860 contra R$720 no mês seguinte. **R$1.140, uma vez** |
| 💡 **A conta da concentração aparece** | dezembro sinaliza R$228,86 |

### ⚠️ E ela quase provou o contrário do que devia

A primeira versão dela tinha **folha zero** no mês da abertura. Resultado: **a vida inteira ficou no Anexo V**, seis meses seguidos.

🔑 Sem perceber, eu tinha modelado **o cliente recusando a oferta do alerta**. A folha de setembro é o ponto inteiro da vida — ela não salva setembro, salva outubro em diante. Hoje existe invariante cravando isso:

> *"e ela tem folha no mês da abertura, senão modela o cliente RECUSANDO a oferta"*

---

## 🟰 Onde NÃO mudou nada — e por que isso importa

> 🔑 Duas das quatro correções do contador **não moveram um centavo** em nenhuma das 17 vidas. Elas consertaram o motor para casos que as vidas não exercitam, e é honesto dizer isso.

| Correção | Efeito nas vidas | Por que ainda assim importa |
|---|---|---|
| **Janela vazia → Anexo V** | só a P21, que nasceu para isso | Antes o motor **lançava erro**. Um cliente real que faturasse no mês da abertura **quebrava a apuração** |
| **Salário mínimo por vigência** | **zero** | 🔴 Bug **latente**: R$1.518 em dez/2025 era o mínimo legal e o motor bloqueava. Nenhuma vida paga exatamente o mínimo de 2025 — mas um cliente real pagaria |
| **Vocabulário do Anexo V** | zero | É o nome que vai para a tela do cliente |
| **CPP fora do numerador** | zero | Já estava certo no cálculo desde 15/09. O que mudou é que a **terceira cópia** da leitura errada parou de ensinar |

---

## 🔬 O que as 17 vidas somam hoje

| | |
|---|---:|
| Competências | **162** |
| DAS apurado | R$ 241.044,90 |
| DARF dos sócios | R$ 51.061,63 |
| Vidas com sócio fora da folha | **3** *(P04, P14, P21)* |
| Alertas A1 disparados | **1** |
| Sinais de concentração | **2** |

⚠️ **Os totais acima não são "o que erramos" nem "o que economizamos".** São a soma de 17 empresas fictícias com histórias diferentes, e servem para uma coisa só: **detectar mudança**. Se alguém mexer no motor e este número andar sem explicação, é regressão.

---

## 🔴 Cinco erros meus, todos pegos por invariante

> 🔑 Nenhum foi pego por eu reler o código. Todos foram pegos por algo que **falha**.

| | O erro | O que o pegou |
|---|---|---|
| **1** | Medi a regra do administrador comparando **folhas totais diferentes**, e reportei "R$178/mês" | eu mesmo, ao ler como o modelo divide a folha — **antes** de escrever |
| **2** | `emCentavos()` numa soma que **já estava em centavos** | releitura antes de rodar. Multiplicaria a guia por 100 sem quebrar teste |
| **3** | Sinal de concentração disparando com **R$0,01** em 9 meses | a P14, ao rodar |
| **4** | Prazo do alerta saiu **15/09** em vez de 15/10 | invariante novo |
| **5** | A P21 com **folha zero**, provando o oposto | o resultado não bater com a história |

⚠️ **O 4 é o mais instrutivo.** Prazo errado num alerta é **pior que alerta nenhum**: a casa liga depois de a janela ter fechado, com a confiança de quem foi avisado.

---

## ⏳ O que este relatório NÃO prova

| | |
|---|---|
| 🔴 **O redutor do IRRF** | A régua que o contador descreveu (até R$3.500 zera · R$3.500-5.000 redutor · **acima de R$5.000 sem redutor**) **diverge do motor**, e não foi tocada. Exige a Lei 15.270/2025 literal |
| 🔴 **As três mudanças de 2027** | regime de caixa, janela do Fator R e ISS no local da prestação vieram **só da memória** dele |
| ⚠️ **Anexo V não tem recibo** | continua sem documento emitido. O comportamento é provado por invariante, não por guia |
| ⚠️ **As vidas são fictícias** | a única conferida contra documento real é a persona zero, e é ela que ancora o centavo do arredondamento |

## Links
[[_duvidas-contador]] · [[_RETOMADA-pos-contador]] · [[_achados-do-motor]] · [[2026-09-16-tres-conflitos-do-contador-resolvidos]] · [[PENDENCIAS]]
