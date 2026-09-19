---
tipo: original
status: vivo
data: 2026-09-17
assunto: agente-whatsapp-vault
ordem: 5
papel: "Conceito de CNAE, anexos, Fator R"
tags: [agente, leo, rag, cnae, tributario, simples, fator-r]
---

# DICIONÁRIO DE CNAE E TRIBUTAÇÃO

Conceitos pra você explicar bem. Regra de decisão sobre um código específico não está aqui, está na consulta ([[11-COMO-CONSULTAR-CNAE]]).

## 1. O que é CNAE
É o código que diz oficialmente o que a empresa faz. Ele define o imposto, o registro e às vezes a exigência de conselho de classe. No app, a pessoa descreve a atividade com as próprias palavras e a gente encontra o código certo, ela não precisa saber o número.

Sem contabilês: é o RG da atividade da empresa. Errar ele é como nascer com o nome trocado na certidão.

## 2. Simples Nacional e os anexos (ME)
A Legalizai atende **só o Anexo III e o Anexo V**.

| Anexo | Quem cai nele | Alíquota inicial (aproximada) |
|---|---|---|
| **III** | Serviços em geral (marketing, manutenção, ensino, muitos serviços técnicos) | começa em 6% |
| **V** | Serviços intelectuais que não batem o Fator R | começa em 15,5% |

🔴 **Fora do nosso escopo:** Anexo I (comércio), Anexo II (indústria) e **Anexo IV** (construção civil, limpeza, vigilância, advocacia). Se a atividade do cliente cair num desses, a gente não atende. Não ofereça e não cite alíquota deles. Ver [[09-ESCOPO-E-LIMITES]].

* 6% e 15,5% são **ordem de grandeza da faixa inicial**, não o cálculo. Pode usar, dizendo que é aproximado.
* A alíquota **não é fixa**: começa nesse patamar e sobe conforme a empresa cresce. **Nunca diga "6% fixo".**
* O cálculo real de cada mês é do **sistema**, automático, não do cliente e não de um contador fazendo conta na mão. Detalhe em [[06-CALCULO-FISCAL]].

## 3. Fator R (o pulo do gato)
Algumas atividades ficam entre o Anexo III e o Anexo V. Quem decide é o **Fator R**: a proporção entre a folha de pagamento (incluindo o pró-labore do sócio) e o faturamento.

* **A lei:** folha dos últimos 12 meses igual ou maior que **28%** do faturamento dos últimos 12 meses leva pro Anexo III (por volta de 6%). Abaixo disso, Anexo V (por volta de 15,5%).
* 🔴 **Não existe margem de segurança na lei. O limiar é seco.** Por isso a Legalizai trabalha com **30%**, não 28% cravado. Os 30% são recomendação nossa, **não são a lei**.
* 🔴 **Só vale pra atividade que o Fator R decide.** A maior parte das atividades de serviço que a gente atende já é Anexo III fixo, e pra elas Fator R não muda nada: **não fale de Fator R nem de 28% pra quem é III fixo** (ver [[09-ESCOPO-E-LIMITES]] §4).
* **Quem acompanha é o sistema**, mês a mês, ajustando o pró-labore sozinho desde o primeiro mês. O cliente não calcula, não acompanha e não precisa pedir. Por que tem que ser desde o mês 1: [[06-CALCULO-FISCAL]] §3.

Sem contabilês: é o degrau entre pagar por volta de 6% e pagar por volta de 15,5%. Quem fica de olho pra sua empresa ficar do lado bom sou eu, todo mês.

## 4. MEI x ME: qual recomendar (você responde, não passa pra frente)

* MEI: guia fixa mensal, teto de faturamento próprio (R$ 81 mil por ano), lista fechada de ocupações permitidas.
* ME no Simples: imposto proporcional ao faturamento, muito mais atividade permitida, e é onde entram as profissões intelectuais.
* A separação entre os dois é jurídica, não é só tamanho. Ver [[03-REGRAS-DOS-ORGAOS]] §4.

🔴 **Quem conta o que faz e quanto fatura quer uma indicação.** Responder "cabe nos dois" e parar aí não ajuda, e mandar pro atendente é erro. A régua:

**A. Fatura até o teto do MEI (R$ 81 mil por ano, média de R$ 6.750 por mês) e a atividade pode ser MEI → recomende o MEI.** Pode dizer que também caberia como ME, mas indique o MEI e mostre por que vale mais a pena neste momento, com foco no imposto:
* o imposto do MEI é uma **guia fixa por mês**, que não cresce junto com cada nota. Na ME o imposto é percentual: quem fatura R$ 5 mil no mês paga por volta de 6% disso, perto de R$ 300, e na guia fixa do MEI sai bem menos (o valor exato você não cita, o app mostra)
* o plano também é mais barato: R$ 49 por mês no MEI contra R$ 139 no ME (valores e promoção em [[01-PLANOS-E-OFERTAS]])
* rotina mais leve: uma declaração por ano, e não precisa de certificado digital pra emitir nota
* eu fico de olho no teto (R$ 81 mil por ano) e aviso antes de estourar. Se o negócio crescer, a gente migra pra ME
* no MEI o suporte é assistente virtual, sem contador humano. Diga isso sem ser perguntado

**B. Passa do teto do MEI, ou a atividade não pode ser MEI → ME, como boa notícia.** Se for atividade que pode cair em duas alíquotas (as que o Fator R decide), fale simples, sem aula:
"Essa atividade pode cair em duas alíquotas de imposto, uma por volta de 6% e outra por volta de 15,5%. A gente tem um time especializado, e o meu sistema acompanha isso todo mês, justamente pra te deixar no melhor cenário."
Pra atividade que já é Anexo III fixo, nem toque em Fator R.

**C. O que você sabe sobre profissões:**
* **Fotógrafo pode ser MEI**, e foto, vídeo e áudio é categoria que a gente atende.
* As 15 categorias de serviço do app ([[11-COMO-CONSULTAR-CNAE]] §4) a gente atende. Pra quem está numa delas, a resposta de "vocês atendem?" é sim.
* **Não podem ser MEI** (vão de ME): atividade intelectual regulamentada, como desenvolvimento de software, medicina, engenharia, arquitetura, advocacia, contabilidade e consultoria.
* 🔴 **Não especule sobre a lista do MEI.** Fora o que está escrito aqui (fotógrafo pode, as intelectuais regulamentadas acima não podem), você **não afirma nem sugere** que uma ocupação "costuma" ou "raramente" entra no MEI. Isso é conhecimento de fora da base, e pode estar errado.
* Profissão que você não sabe se está na lista do MEI: **não trave e não chame atendente.** Diga que pelo faturamento caberia no MEI, que a ocupação exata é confirmada no app quando a pessoa descreve o que faz, e que se não couber no MEI o ME resolve. Siga a conversa.

## 5. 🔴 Regra de conduta com códigos
Você **não crava o anexo nem a alíquota exata de um código de CNAE específico** de memória. Quando o cliente trouxer um código, pergunte o que ele faz no dia a dia e oriente pela régua do §4. Só se ele insistir no anexo exato daquele código é que um atendente confirma. Orientar por profissão e faturamento (§4) não é afirmar código: isso você faz sempre.
