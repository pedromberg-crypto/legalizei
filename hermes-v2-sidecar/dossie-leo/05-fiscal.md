---
tipo: conhecimento
status: vivo
data: 2026-09-25
assunto: dossie-super-leo
consultor: tributario
papel: "Como o imposto funciona, o Fator R, o pró-labore, e como ler o resultado da consulta de atividade."
tags: [dossie, leo, rag, fiscal, das, anexo, fator-r, pro-labore, critico]
historico: "Unifica o que estava partido em duas notas: o dicionario explicava anexo e Fator R, e a nota de calculo explicava os mesmos dois de novo, com os mesmos numeros. Duas casas do mesmo fato."
---

# FISCAL (COMO O IMPOSTO FUNCIONA)

> A lista dos 1.332 CNAEs não está aqui e nunca estará: ela é consultada por ferramenta, tem estrutura própria e já validada. O que esta nota ensina é **como ler o que a consulta devolve**.

## 1. O que é CNAE, sem contabilês

É o código que diz **o que a empresa faz**. Ele decide três coisas de uma vez: se a casa atende, em qual anexo do Simples a empresa cai, e quanto ela paga.

O cliente **não escolhe código**. Ele descreve o que faz com as palavras dele, e o sistema encontra. No WhatsApp é igual: pergunte o que ele faz, não peça que ele saiba um número.

## 2. Os anexos, e os dois patamares

| Anexo | Quem cai nele | Patamar inicial |
|---|---|---|
| **III** | serviços em geral: marketing, manutenção, ensino, muitos serviços técnicos | por volta de **6%** |
| **V** | serviços intelectuais que não batem o Fator R | por volta de **15,5%** |

* Os dois números são **ordem de grandeza da faixa inicial**, não o cálculo. Pode usar, dizendo que é aproximado.
* 🔴 **Nunca diga "6% fixo".** A alíquota começa nesse patamar e **sobe** conforme a empresa cresce.
* Quais anexos a casa atende e quais estão fora: `01-escopo.md` §4. Não cite alíquota de anexo que a casa não atende.

## 3. A alíquota sobe com o acumulado, não com o mês

Ela é calculada sobre o faturamento acumulado dos **últimos 12 meses** (nome técnico: RBT12), e a fórmula é da lei.

Para o ME que a casa atende só existem **duas faixas**:

| Faixa | Acumulado em 12 meses | Anexo III | Anexo V |
|---|---|---|---|
| 1ª | até R$ 180 mil | 6,00% | 15,50% |
| 2ª | de R$ 180 mil até o teto do ME | sobe a partir de 6% | sobe a partir de 15,5% |

O valor do teto está em `01-escopo.md` §3, e você lê de lá: ele é fato de fronteira e tem uma casa só. O sistema recalcula a alíquota sozinho todo mês, e acima daquele teto é EPP.

## 4. O DAS não é "faturamento vezes alíquota"

* O DAS é a **soma de seis tributos** (IRPJ, CSLL, COFINS, PIS, CPP e ISS), cada um arredondado **separadamente**. Fazer "faturamento vezes 6%" erra centavo em toda guia.
* Prova real, de uma empresa conferida: R$ 7.910 vezes 6% daria R$ 474,60, e a guia da Receita saiu **R$ 474,59**.
* Você **pode** usar os patamares como ordem de grandeza. Você **não pode** apresentar isso como o cálculo.

Fala de referência, o meio-termo certo:
> "Na faixa inicial, serviço no Anexo III paga por volta de 6% e no Anexo V por volta de 15,5%. A conta exata tem seis tributos dentro e muda conforme o acumulado do ano, mas isso é problema meu, não seu: eu calculo e te entrego a guia certa, no centavo."

## 5. O Fator R, dito certo

Algumas atividades ficam **entre** o Anexo III e o Anexo V. Quem decide é o Fator R.

| | |
|---|---|
| **O que é** | folha paga nos últimos 12 meses dividida pelo faturamento dos últimos 12 meses. A folha inclui o pró-labore do sócio |
| **Limiar da lei** | **28%**. Igual ou acima, Anexo III. Abaixo, Anexo V |
| **Margem da casa** | trabalha-se com **30%**, não 28% cravado. É recomendação nossa, **não é a lei**. Não existe margem de segurança no texto legal: o limiar é seco |
| 🔴 **É retrovisor** | lê os **12 meses anteriores**. Pró-labore pago hoje só faz efeito nos meses seguintes |
| 🔴 **É regime de caixa** | só entra o que foi **efetivamente pago**. Declarar e não pagar infla o número, e a Receita desconsidera |

🔴 **A consequência que justifica o produto:** quem descobre o problema tarde **não conserta no mês seguinte**. Numa simulação da casa, corrigir em setembro só devolveu o Anexo III em **agosto do ano seguinte**: onze meses pagando a alíquota alta já com a folha certa.

**É por isso que o sistema ajusta o pró-labore desde o mês 1, sozinho.** Não é comodidade, é a única intervenção que funciona.

> "O Fator R olha os 12 meses pra trás. Por isso eu não espero você perceber o problema: eu já vou ajustando o seu pró-labore todo mês pra sua empresa nunca chegar perto do degrau."

## 6. 🔴 Quando NÃO falar de Fator R

**Só se aplica a quem oscila entre os dois anexos.** A maior parte das atividades de serviço que a casa atende já é **Anexo III fixo**, e para elas o Fator R não muda nada.

🔴 **Não puxe o assunto do nada.** Explicar Fator R para quem já está no Anexo III por regra inventa um risco que não existe e assusta à toa. Só entre no assunto se o cliente perguntar, ou se a atividade dele depender disso.

🔑 **E quando o cliente puxar o assunto e não se aplicar, negue e explique.** Silêncio aqui deixa a premissa errada dele de pé. Quem diz se a atividade oscila é o resultado da consulta (§9).

## 7. O pró-labore e as guias do sócio

| | |
|---|---|
| **Piso** | o salário mínimo **do mês de competência** (R$ 1.621 em 2026, R$ 1.518 em 2025) |
| **INSS** | 11% sobre o pró-labore, limitado ao teto de **R$ 8.475,55** (INSS máximo de R$ 932,31 por mês) |
| 🔴 **O teto é da PESSOA** | quem já tem carteira assinada em outra empresa consome parte do teto, e o INSS do pró-labore cai |
| **IRRF** | tabela progressiva **por sócio**. Você não cita valor nem faixa: o cálculo é do sistema e aparece no app |
| 🔴 **A guia é por sócio** | com 2 ou mais sócios, **nunca** se soma a folha para calcular como se fosse uma pessoa só. O teto é individual e a tabela do IR é progressiva por beneficiário |

Você explica **como funciona** e que **o sistema calcula**. Valor fechado do caso da pessoa, não (`10-conduta.md`).

## 8. O gancho que nasce do cálculo

> "Quem faz essa conta aqui sou eu, e eu bato no centavo. A gente conferiu contra a guia real da Receita e o valor fechou exato."

É **verdade verificável** e pode ser dita: foram 46 conferências contra documento emitido e 162 meses de empresa simulados, sem falha.

**Estimativa é permitida, valor fechado não.** Sobre o faturamento que a pessoa deu, faça a conta e diga o número como aproximação ("uns 600", "por volta de 600"), sempre com o que sobra ("aproximadamente 9.400 no bolso"). O proibido é apresentar como valor definitivo do caso dela.

🔴 Imposto de guia já emitida, cobrança errada ou multa **nunca** é estimativa: é escalação.

## 9. Como ler o resultado da consulta de atividade

A consulta devolve até 5 linhas, da mais parecida para a menos. Os campos que decidem a resposta:

| Campo | Como usar |
|---|---|
| `titulo` | o nome em linguagem de gente. É o que você mostra |
| `titulo_oficial` | o nome do IBGE, em caixa alta. Serve para desambiguar |
| `casa_atende_me` | `true` libera dizer que a casa atende como ME |
| `casa_atende_mei` | 🔴 leia o §11. **Não é** "pode ser MEI" |
| `motivo_nao_atende` | quando `casa_atende_me` é `false`, **isto é a resposta**. Tradução em `02-triagem.md` §7 |
| `pode_afirmar_anexo` | 🔴 o gate. Ver §10 |
| `anexo` | `III` · `III-ou-V` · `IV` · `nao-se-aplica` |
| `fator_r` | `true` só em `III-ou-V`. `false` significa que Fator R **não muda nada** (§6) |
| `exige_conselho` | a abertura ganha uma etapa de registro em conselho |
| `familia` | a categoria do app |
| `achou_por` | o quanto o casamento é forte. Ver §12 |

Campo fora desta tabela não existe. **Nunca diga que consultou alíquota de ISS ou lista de ocupação do MEI: nada disso volta.**

⚠️ **Nome de campo é bastidor.** Existe para você decidir, nunca para aparecer na mensagem.

## 10. 🔴 O gate: `pode_afirmar_anexo`

**`true`** libera falar de anexo e de Fator R daquela atividade.
**`false`** proíbe: nada de anexo, de alíquota ou de Fator R. Pergunte o que a pessoa faz no dia a dia e oriente sem cravar.

## 11. 🔴 `casa_atende_mei` não quer dizer "não pode ser MEI"

São duas coisas, e confundir as duas afirma regra jurídica falsa:

* `casa_atende_mei: false` = **a casa não confirmou essa atividade no MEI**. É escopo comercial nosso.
* "essa ocupação não pode ser MEI" = **regra federal**, lista fechada do governo (`06-orgaos.md`), que **não está aqui**.

🔴 **`casa_atende_mei: false` nunca é motivo de recusa.** Boa parte do que a casa atende como ME está nessa condição, inclusive tecnologia, áudio e vídeo. Quem decide se a casa atende é o `casa_atende_me`.

## 12. O quanto o casamento é forte

| `achou_por` | O que é | O que fazer |
|---|---|---|
| `codigo` · `sinonimo` | exato | pode seguir |
| `titulo` | forte | siga, confirmando o nome na frase |
| `termos` | fraco, bateu numa palavra solta da lista do IBGE | 🔴 **confirme antes de concluir** |

🔴 **Título que não é exatamente o que a pessoa disse, você não crava.** Devolva a dúvida: *"Você quis dizer [título]?"*. A mecânica completa de desambiguação está em `02-triagem.md` §8.

🔴 **Zero linhas é resultado válido, e nunca significa que a casa atende.** Diga que não encontrou a profissão pelo nome e peça o dia a dia. Depois de duas buscas sem achar, pare de buscar e escale.

## 13. Conduta com códigos

* Você **não crava o anexo nem a alíquota de um código específico de memória**, nunca, com ferramenta ligada ou desligada.
* Quando o cliente traz um código, pergunte o que ele faz no dia a dia e oriente pela régua de `03-comercial.md` §6.
* **Orientar por profissão não é afirmar código.** Travar a conversa ou mandar ao atendente por causa de profissão é erro, e custa venda.
