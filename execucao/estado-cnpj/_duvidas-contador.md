---
tipo: derivado
status: vivo
data: 2026-09-15
assunto: briefing-para-a-conversa-com-o-contador
autoridade: derivado
tags: [execucao, motor-fiscal, briefing, mauro, larissa]
---

# 🧑‍🏫 Briefing da conversa com o contador

> 🔴 **ESTE DOC NÃO É FILA, E ISSO É CORREÇÃO DE UM ERRO MEU DE 15/09.**
>
> A fila de quem-resolve-o-quê já existe e tem dono: **[[PENDENCIAS]]** (consolidada, por pessoa) alimentada por **[[fila-validacao-humana]]**, cujo próprio texto diz ser *"o lugar único onde esses valores vivem, pra que a validação seja uma conversa só em vez de arqueologia"*. Eu criei este arquivo como um **terceiro** lugar, no mesmo dia em que o Pedro apontou que eu busco fonte-verdade em lugares diferentes e me contradigo. Era exatamente o vício, cometido de novo.
>
> 🔑 **O que ele é agora:** o **briefing** — os parágrafos de contexto que a fila não carrega, para o Pedro não sentar com uma pergunta solta. O **status e o número** de cada item vivem em `PENDENCIAS`, e é de lá que se lê o que está aberto.

## 📋 O resultado da varredura de 15/09

Conferi as 10 dúvidas que eu tinha escrito contra os documentos que o **[[indice-autoridade]]** aponta como donos de cada assunto. Resultado:

| | |
|---|---|
| Já **respondidas** no vault, e eu perguntei de novo | **4** (D-07, D-08, D-09, e metade da D-01) |
| Já **na fila**, com número, e eu dupliquei | **3** (D-04 → item 21 · D-06 → item 30 · D-10 → item 17) |
| **Genuinamente novas** | **3** → viraram os itens **70**, **71** e **72** |

🔴 **Sete de dez não deviam existir.** O material estava no repo o tempo todo; faltava eu olhar onde o índice manda olhar. É a prova que o Pedro pediu — e ela prova nos dois sentidos: o método funciona, e sem ele eu refaço trabalho e gero contradição.

---

## ✅ As que já tinham resposta — e onde ela estava

### D-07 · Retirada de lucro sem extrato bancário
**Estava TRAVADA em 14/09**, item **30** de `PENDENCIAS`, e eu reabri no dia seguinte. A resposta em duas partes: **mostrar, não mostramos** (sem conciliação bancária, qualquer número de "lucro disponível" seria errado — item 31); **declarar é obrigatório**, o lucro é declarado pelo cliente num campo com prazo mensal e vai para a EFD-Reinf. Retirada acima do que a contabilidade suporta cai no item **32** (empréstimo ao sócio, copiado do líder). ⏳ Sobra só o **prazo** (dia 15, como o líder, ou o nosso).

### D-08 · A CPP no numerador do Fator R
**Encerrada em 14/09** e registrada em `_encerrados.mjs` · **E-CPP**. Não entra nos Anexos III e V (Res. CGSN 140/2018 art. 26 §2º I "a" nomeia o Anexo IV; o silêncio é vedação). A ratificação já estava na fila como parte do item **17** (os 7 pontos fiscais da Larissa). 🔴 **O que continua valendo é a CORREÇÃO ao Mauro:** em 13/09 reportamos a ele o contrário, e isso já foi para o `evolucao-para-mauro` de 15/09.

### D-09 · Recibo de PGDAS-D em Anexo V
**Recalibrada em 15/09** no `_SUFICIENCIA.md` §2: deixou de ser bloqueio. A regra fecha por fonte oficial e a convenção de arredondamento é herdada do Anexo III, que tem recibo. Segue 🟡 desejável, sem fila.

### D-01 · Sócio que não administra pode receber pró-labore?
**Metade estava respondida em 13/09**, em `execucao/processos/cru/PROLABORE.md`, com norma: *"só o sócio que presta serviço à sociedade é segurado obrigatório como contribuinte individual (Lei 8.212/91 art. 12 V 'f'). O sócio que só investiu capital e não exerce gestão não precisa receber pró-labore."*
🔑 **A metade que sobrou é mais fina, e virou o item 72:** a lei fala em **prestar serviço**, e o nosso app coleta **quem administra** (qualificação 49 × 22). Trabalhar sem administrar é possível, e é aí que a inferência do app pode errar.

---

## 🔁 As que já estavam na fila, com número

| Eu escrevi | Já era | Estado |
|---|---|---|
| **D-04** · piso do pró-labore / o R$100 da conta real | item **21** | 🔴 não-ratificado, com o Mauro |
| **D-06** · pró-labore × lucro sob a Lei 15.270/2025 | item **30** (+ ratificação do texto legal no **17**) | ⚠️ a Lei veio por citação em tela de concorrente; quer texto legal antes de virar tela |
| **D-10** · os 7 CNAEs `requer-revisao` | item **17**, e o `indice-autoridade` já diz que a coluna `anexo_fator_r_grupo` espera a Larissa | 🟡 com a Larissa |

---

## 🆕 As três que sobraram — o briefing de verdade

> Estas são as que vão para a conversa. Cada uma com o parágrafo de contexto, porque pergunta solta não se responde bem.

### Item 70 · 🔴 Confirmar o conserto do maior erro do motor

**O que aconteceu.** O nosso sistema estava somando o pró-labore de todos os sócios e calculando a guia de INSS e Imposto de Renda **como se fosse uma pessoa só**. Encontramos rodando uma empresa de teste com 2 sócias. O estrago vai para os dois lados: numa empresa com 4 sócios recebendo R$3.500 cada, o sistema cobrava **R$3.617** quando o correto é **R$1.540** — porque a tabela do Imposto de Renda é progressiva **por pessoa**, e R$14.000 numa pessoa cai numa faixa alta que R$3.500 em quatro pessoas não alcança. No INSS o erro era ao contrário, para menos, porque o teto também é **por pessoa** e nós aplicávamos um teto só para a soma. Já corrigimos: o sistema calcula a guia de cada sócio separadamente e soma no fim.

**A pergunta:** a leitura está correta? O teto do INSS (R$8.475,55 em 2026) e a tabela progressiva do IRRF se aplicam **individualmente a cada sócio**, e a guia da empresa é a soma dessas contas individuais? Existe alguma situação em que se calcula sobre o total?

### Item 71 · 🟡 O pró-labore pode ser dividido de forma desigual?

**O que aconteceu.** O nosso sistema assume que, se a empresa tem 3 sócios e paga R$6.000 de pró-labore, cada um recebeu R$2.000. Assumimos divisão igual porque é o que o aplicativo coleta hoje — ele pergunta o valor total, não o de cada um. Isso virou problema com o erro acima: o imposto depende de quanto **cada pessoa** recebeu. E a divisão igual **não é neutra**: R$14.000 em R$7.000+R$7.000 dá um imposto; em R$11.000+R$3.000 dá outro, maior. ⚠️ E não há de onde deduzir o rateio: o app coleta o **percentual de participação**, que governa a **distribuição de lucro**, não o pró-labore — pró-labore é remuneração por **trabalho**, e trabalho não é proporcional a quota. Usar o percentual das quotas para ratear seria justamente o erro clássico de confundir os dois.

**A pergunta:** com que frequência, na prática, os sócios dividem o pró-labore de forma desigual? Exige formalidade (alteração contratual, ata, registro em folha)? E o risco está em dividir desigual, ou em dividir igual quando o trabalho é desigual?

### Item 72 · 🟡 "Administrar" e "prestar serviço" não são a mesma coisa

**O que aconteceu.** Ao montar as empresas de teste, definimos quantos sócios cada uma tem e quem administra. Duas delas foram descritas como *"só o titular administra"*, e mesmo assim nós fizemos a empresa pagar pró-labore a todos os sócios. Ao conferir, achamos a resposta já travada no nosso material desde 13/09: quem só entrou com dinheiro e não exerce gestão **não precisa** receber. Só que a lei fala em **prestar serviço à sociedade**, e o nosso aplicativo coleta **quem administra** — e dá para trabalhar na empresa sem ser administrador. Não mexemos no dado das duas empresas, porque alterá-lo muda o cálculo do imposto delas.

**A pergunta:** para efeito de pró-labore e INSS, o que vale é **administrar** ou **trabalhar**? Se for trabalhar, o nosso aplicativo está perguntando a coisa errada, e precisa de uma pergunta a mais na constituição.

## Links
[[PENDENCIAS]] · [[fila-validacao-humana]] · [[indice-autoridade]] · [[_achados-do-motor]] · [[_encerrados]]
