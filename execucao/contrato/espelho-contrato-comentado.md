---
tipo: verdade
status: vivo
data: 2026-09-10
assunto: contrato
tags: [juridico, contrato, espelho, advogada, briefing]
---

# ⚖️ Espelho de contrato comentado — briefing para a advogada

> 🎯 **O que é:** o material para a redação do **contrato de prestação de serviços da Legalizai**. Cada bloco traz o que o concorrente de referência faz, o que nós decidimos, **de onde veio cada dado** e o que fica em aberto.
>
> 🔴 **ESCOPO: plano ME apenas.** Este documento **não cobre MEI**, que é caminho próprio do produto e será tratado depois. Nada aqui deve ser lido como aplicável ao MEI.
>
> 📚 **De onde vem a referência:** contrato da Contabilizei **lido na íntegra** (74.700 caracteres, 11 cláusulas + 3 anexos), mais o "Plano Contratado" (1.500), a Carta de Responsabilidade (6.418) e o Termo de lucro (4.615). **87.233 caracteres, 100% de cada documento.** Os textos literais estão em `produto/evidencias/fontes/`.
>
> ⚠️ **Nós não redigimos a minuta.** Este é o briefing; a minuta é produto da advogada.

## Como ler cada bloco

| Marcador | Significa |
|---|---|
| 📄 | o que o concorrente faz, com o número da cláusula |
| ✍️ | o que propomos |
| 📌 | **origem do dado** — de onde veio e quem decidiu |
| 🎯 | por que aqui é diferente |
| ⚖️ | 🟢 copiar · 🔴 não copiar · 🕓 decidir |
| ❓ | pergunta endereçada à advogada |

🔑 **A linha 📌 é a mais importante do documento.** Ela separa três coisas que normalmente vêm misturadas: o que é **norma** (e não se negocia), o que é **prática do concorrente** (e é opinável) e o que é **decisão dos sócios** (e não cabe à advogada mudar).

---

# 1. Partes e estrutura societária

📄 **Contabilizei.** Duas empresas no mesmo instrumento: Contabilizei Contabilidade (CRC/PR) presta o serviço contábil; Contabilizei Tecnologia licencia o software. Foro de Curitiba/PR (cláusula 11.13).

✍️ **Legalizai.** Mesma arquitetura, um instrumento, duas partes:

| **LEGALIZAI TECNOLOGIA LTDA** | **LEGALIZE AUDITORIA E CONSULTORIA CONTÁBIL LTDA** |
|---|---|
| CNPJ 41.569.345/0001-48 | CNPJ 12.423.332/0001-68 · **CRC-MG 007900/O** |
| CNAE 62.03-1-00 (licenciamento de software) | contador responsável: Mauro Lopes de Faria, CRC-MG 094967/O-0 |
| licencia a plataforma e executa funcionalidade | presta o que é **privativo de contador** |

**Foro: Belo Horizonte/MG.**

📌 Cartão CNPJ emitido em 10/09/2026 e dados passados pelo Pedro. Fonte-verdade: `execucao/entidades-legais.md`.

🎯 O corte é **por natureza do ato**, não fiscal-cosmético. O que exige registro no CRC fica na Auditoria; o resto é funcionalidade de software. É esse desenho que permite oferecer a **abertura com honorário zero** sem esbarrar em tabela de honorários do CRC. O CNAE 62.03-1-00 corresponde ao **item 1.05 da LC 116/2003**, e o secundário **74.90-1-04 (intermediação e agenciamento)** dá lastro cadastral à cláusula de mandato do bloco 10.

⚖️ 🟢 **Copiar a arquitetura.** 🔴 Foro é o nosso, não o deles.

❓ **Um instrumento com duas partes, ou dois instrumentos?** A recomendação é um só, para o cliente assinar uma vez. As notas fiscais saem separadas por empresa, como na cláusula 3.5 deles.

---

# 2. Objeto — o que está incluído

📄 **Contabilizei.** Quatro listas: **4.1** (abertura, 3 alíneas) · **4.2 "NÃO ESTÃO INCLUSOS"** (6 alíneas, nominal) · **5.2** (software, 9 alíneas) · **5.3** (contábil, 3 alíneas). Mas os **serviços adicionais ficam fora do instrumento**: as cláusulas 1.8, 5.4 e 11.1 remetem "à Plataforma".

🔥 **E isso produziu uma contradição real:** a **ECD** está nomeada como incluída na cláusula 5.3-a **e** vendida na loja à-la-carte por **R$197,90**. Ninguém consegue dizer qual vale. Ainda: a **5.4 remete ao "Anexo I"** para a tabela de adicionais, e o Anexo I é *"Termos dos Planos Experts"* — **não tem tabela nenhuma**. A remissão aponta para o lugar errado.

✍️ **Legalizai.** Mesma estrutura de quatro listas, com **duas correções**:

1. **Lista de exclusão nominal**, no modelo da 4.2. É a melhor peça do contrato deles.
2. 🔑 **A tabela de adicionais é ANEXO do contrato, não "está na plataforma"** — com data de versão. E vale a regra: **item que aparece na lista de incluso não pode existir na tabela de adicionais.** É verificável por teste automático contra o nosso catálogo.

📌 Contrato do líder lido integralmente em 10/09; contradição da ECD cruzada com a loja à-la-carte capturada em 09/09.

⚖️ 🟢 Copiar as quatro listas e a técnica da 4.2. 🔴 **Não copiar a remissão à plataforma** — é a origem do defeito.

❓ **A tabela de adicionais como anexo versionado resolve?** Ou há forma melhor de permitir que o preço mude sem reabrir o contrato, mantendo a fronteira do escopo dita?

---

# 3. Prazo e fidelidade

📄 **Contabilizei.** 12 meses contados da **emissão do CNPJ** quando a abertura vem junto com a assessoria (2.1-b, 2.2). Sem abertura, 12 meses da responsabilidade técnica. Renovação automática. Prazo máximo de 90 dias para o cliente completar o cadastro, sob pena de encerramento sem devolução.

✍️ **Legalizai.** Igual: **12 meses da emissão do CNPJ**, renovação automática.

📌 Decisão do Pedro em 27/08, já no código (`fiscal.ts`, `CUSTOS.FIDELIDADE_MESES: 12`).

⚖️ 🟢 Copiar.

---

# 4. Preço e pagamento

## 4.1 A grade completa

✍️ **Três coortes no ME, uma tabela única no EPP.**

| Coorte ME | Preço | Garantia |
|---|---:|---|
| **Fundador** (lista de espera) | R$ 79/mês | 12 meses da ativação |
| **Lançamento** | R$ 99/mês | 12 meses da ativação |
| **Base** | R$ 139/mês | — |

| Faixa EPP (RBT12) | Referência mensal | Preço |
|---|---|---:|
| até R$ 360 mil | até 30 mil | R$ 139 (ME) |
| R$ 360 mil a R$ 600 mil | 30 a 50 mil | **R$ 189** |
| R$ 600 mil a R$ 1,2 mi | 50 a 100 mil | **R$ 239** |
| R$ 1,2 mi a R$ 2,4 mi | 100 a 200 mil | **R$ 309** |
| R$ 2,4 mi a R$ 3,6 mi | 200 a 300 mil | **R$ 399** |
| R$ 3,6 mi a R$ 4,8 mi | 300 a 400 mil | **R$ 519** |

🔑 **A faixa é apurada pela RBT12 (receita bruta dos últimos 12 meses), não pelo faturamento do mês.** É a mesma régua da LC 123, e evita que negócio sazonal pule de faixa todo mês. O valor mensal é referência visual.

🔑 **A faixa acompanha nos dois sentidos:** subida na competência seguinte com aviso de 30 dias; **queda automática, sem necessidade de pedido do cliente.**

📌 Coortes e tabela EPP: decisões do Pedro em 10/09. Preço ME de R$139: decisão de 20/08, no código.

🎯 **Preço de coorte, não desconto temporário.** Depende de **quando** o cliente entrou, não de há quanto tempo está. O preço dele está escrito no contrato dele.

⚖️ 🔴 **Não copiar** a mecânica deles, que intercepta a escolha do cliente por um plano mais barato e reverte silenciosamente para o mais caro depois de 3 meses.

❓ **A tabela de duas dimensões (coorte no ME, faixa única no EPP) fica clara num anexo só?**

## 4.2 🔴 O desconto é preço, não adiantamento

📄 **Contabilizei, cláusula 7.6:** *"Se você tiver aproveitado de alguma outra condição promocional, a Contabilizei poderá cobrar a devolução dos valores correspondentes aos benefícios concedidos e usufruídos caso você solicite o término antecipado."* O mesmo vale em downgrade antes de 6 meses.

✍️ **Legalizai.** **Desconto de plano é preço e não se devolve.** Quem sai antes paga a multa de fidelidade, e só.

**A exceção:** benefício **pontual concedido fora do plano** (cortesia de taxa, mês grátis de endereço fiscal, avulso liberado, e **o certificado digital emitido**) é recuperável no cancelamento antecipado.

🎯 Quatro razões: a promo já está protegida pela fidelidade + multa de 30%; com preço de coorte travado por 12 meses não existe janela de arbitragem; empilhar clawback sobre multa é punir duas vezes o mesmo fato; e calcular "benefício usufruído" gera disputa que custa mais que o valor.

⚖️ 🔴 **Não copiar a 7.6 como está.** 🟢 Copiar só a parte do benefício concedido.

❓ **A redação "desconto de plano integra o preço e não constitui liberalidade reembolsável" sustenta?**

## 4.3 Reajuste

📄 **Contabilizei.** Dois mecanismos empilhados: reajuste por índice com aviso de 30 dias (3.7) **e** reajuste automático por aumento de carga tributária da Reforma Tributária, limitado ao impacto líquido, com memória de cálculo (3.8 a 3.12). Mora 2% + juros 0,033%/dia (3.6).

✍️ **Legalizai.** Adotar os dois, incluindo a cláusula de Reforma Tributária.

📌 Decisão do Pedro em 27/08 (ADR `marca/decisoes-marca.md`).

🎯 Com IBS/CBS valendo para todo mundo, sem essa cláusula a gente absorve aumento de carga como prejuízo silencioso.

⚖️ 🟢 Copiar os dois, com a memória de cálculo obrigatória.

❓ **O aviso de 30 dias precisa vir com direito de sair sem multa**, como na 11.2 deles? A recomendação é sim, e é o que separa reajuste de armadilha.

## 4.4 Empresa inativa e inadimplência

📄 **3.13:** mensalidade devida mesmo com empresa inativa, porque a obrigação acessória de "sem movimento" existe. **3.15:** falta de pagamento suspende serviço, cancela benefícios e autoriza negativação e cessão de crédito.

✍️ Adotar as duas.

⚖️ 🟢 Copiar. É verdadeiro e defensável.

---

# 5. Abertura de empresa

📄 **4.1** lista o que o software faz; **4.2** lista o que **não** está incluído (protocolo físico, registro em órgão de classe, vistoria de bombeiros, projeto de alvará, PGRSS/CNES/Habite-se, INPI). **4.3-h:** todas as taxas públicas são do cliente.

✍️ **Legalizai.** Mesma estrutura. **Honorário de abertura: R$0.**

🎯 **Diferença de modelo:** eles absorvem a taxa e chamam de "Custo Zero", mas o valor pago no checkout é adiantamento de mensalidade resgatado como crédito, e a cláusula 4.3-h joga a taxa pro cliente — **a copy e o instrumento divergem**. Nós cobramos a taxa da Junta separada, explicada, e sem honorário nenhum sobre a abertura.

📌 Decisão D1, 14/07. `HONORARIO_ABERTURA: 0` no código. Taxa DAE JUCEMG: R$281,08.

⚖️ 🟢 Copiar a estrutura e a lista de exclusão. 🔴 Não copiar o "Custo Zero".

---

# 6. Serviços mensais — a divisão entre as duas empresas

📄 **5.2** (Tecnologia, 9 alíneas): guias, pró-labore, SPED, DIRF/DIMOB/DMED, FGTS/INSS/IRRF, folha e holerite, contrato de experiência, rescisão, sindicato, férias.
📄 **5.3** (Contabilidade, 3 alíneas): escrituração contábil (balancete, balanço, DRE, ECD), escrituração fiscal, e o que é **privativo de contador**.

✍️ **Legalizai.** Mesmo corte, com a lista adaptada ao que a plataforma realmente entrega hoje.

✅ **Rota definida (Pedro, 10/09):** as funções desta lista são construídas **pelo nosso dev, direto por API**, dentro do aplicativo. **Não vamos contratar serviço externo intermediário** para executar o que é nosso. Isso fecha a dúvida que estava aberta sobre a lista do objeto.

⚖️ 🟢 Copiar o corte, com a lista adaptada ao que a plataforma entrega.

❓ **Como redigir de forma que a lista possa crescer sem aditar o contrato, mas sem cair na armadilha de "conforme disponível na plataforma"?**

---

# 7. Certificado digital — é benefício, não repasse

📄 **Contabilizei.** O cliente **compra** o certificado (5.1, 4.3-c), e a falta dele pode gerar cancelamento. A **5.8** autoriza a Contabilizei a **armazenar e solicitar a senha** do A1.

✍️ **Legalizai. O certificado está INCLUÍDO no plano.** Seis travas:

| | Cláusula | O que fecha |
|:--:|---|---|
| a | custeado **enquanto o contrato estiver ativo e adimplente**, renovado anualmente | senão "incluso" vira vitalício |
| b | 🔑 **não vira desconto, crédito ou reembolso** se o cliente já tiver certificado | senão todo cliente que já tem um pede abatimento |
| c | emissão **depende de ato pessoal do titular** (videochamada com certificadora parceira); ausência não gera devolução nem prorroga prazo | o passo depende do cliente atender |
| d | 🔑 cancelamento dentro da fidelidade: **certificado emitido é benefício usufruído e é devido**, além da multa | senão o cliente assina, tira o certificado e cancela no 2º mês |
| e | custódia da senha autorizada, uso restrito às obrigações da empresa | espelha a 5.8 |
| f | inadimplência suspende a renovação | senão pagamos certificado de quem não paga |

📌 Custódia da senha: decisão do Pedro em 27/08. Certificado como benefício e videochamada por parceira: decisões de 04/08 e 05/09. Custo de referência: R$209/ano.

⚖️ 🟢 Copiar a 5.8 (custódia). 🔴 O resto é desenho nosso, o modelo deles não serve.

❓ **A custódia de senha de certificado A1 exige alguma formalidade além da autorização em contrato?** É o ponto que mais nos expõe se houver uso indevido.

---

# 8. Folha de pagamento — serviço adicional

📄 **Contabilizei.** Folha só existe no plano **Experts Essencial (R$395)**, a **R$50 por funcionário**. Os outros três planos dizem literalmente *"esse plano não permite a inclusão de funcionários"*. E existe avulso de *"GFIP/DCTFWeb/eSocial **Sem Movimento**"* por **R$71,90**.

⚠️ **Precisão sobre o teto deles, porque são duas coisas diferentes:** no **Plano Contratado** (o documento do aceite) a linha é *"50,00 por funcionário"*, **sem limite numérico** — o preço é linear. Mas a **cláusula 11.5-c do contrato recusa cliente com mais de 20 empregados**, como critério de elegibilidade. Ou seja: **não há teto de preço, há teto de atendimento.**

✍️ **Legalizai.**

```
a) Contratável no app, após a abertura. Não integra o plano base.

b) R$ 39,00 por colaborador, por competência processada.
   PREÇO DE LANÇAMENTO, vigente até <data>. Findo o período, passa
   ao valor vigente, comunicado com 30 dias, com direito de
   descontratar o serviço sem multa.

c) Limite de 10 colaboradores por assinatura.

d) 🔑 Cobrado por colaborador ATIVO na competência, ainda que não
   haja pagamento no mês, porque eSocial, EFD-Reinf e DCTFWeb são
   devidos mesmo sem movimento.

e) Admissão exige antecedência; rescisão, comunicação imediata.
   Ambas conduzidas pela equipe. SST (exames, ASO, laudos) é do
   cliente.
```

📌 Decisão do Pedro em 10/09, **revogando** a decisão de 08/09 que deixava folha fora do escopo.

🎯 **Teto de 10 colaboradores, contra os 20 do líder.** Fica abaixo do limite deles de propósito: é o alcance que atende o nosso ICP sem trazer a carga de uma folha grande. **Teto de receita: R$390/mês** por cliente com folha cheia.

🎯 **O (d) é a peça que protege a margem, e ela nasceu do defeito deles:** o líder transforma "sem movimento" em **upsell surpresa de R$71,90**. Nós transformamos em **regra escrita antes**. Mais honesto e mais seguro.

🎯 **O (b) usa a mesma mecânica do preço de coorte:** prazo declarado, aviso de 30 dias, saída sem punição. Uma regra de preço só no contrato inteiro.

⚖️ 🟢 Copiar as obrigações de SST e os prazos (cláusula 5.6-s deles). 🔴 Não copiar a mecânica de cobrança por evento.

❓ **"Preço de lançamento vigente até <data>" é suficiente**, ou precisa de prazo determinado em meses a contar da contratação de cada cliente?

---

# 9. Serviços adicionais e a régua de cobrança

✍️ **Legalizai.** Duas regras:

1. **Teto de R$50,00 para embutir na fatura.** Acima disso, pagamento na hora, com aceite explícito.
2. Preço e **momento da cobrança** aparecem juntos, antes do aceite.

Na prática, com o catálogo atual só três serviços entram na fatura: CND (R$35,90), verificação de pendências (R$24,90) e reemissão de guia (R$15,90). Todo o resto é decisão consciente no ato.

📌 Teto definido pelo Pedro em 10/09. Regra de tela travada em 08/09.

🎯 **Micro-serviço automatizado entra na fatura; qualquer coisa com órgão, humano ou valor relevante é escolha na hora.**

⚖️ 🔴 Não copiar. Eles embutem sem teto declarado.

---

# 10. Repasse de taxa pública — cláusula de mandato

📄 **Contabilizei.** Não existe. A **4.3-h** joga todas as taxas para o cliente e a **11.3** pede reembolso de despesas mediante comprovante.

✍️ **Legalizai.** Nós **recebemos e repassamos** a taxa da Junta (DAE JUCEMG, R$281,08). Cinco elementos:

```
1. OUTORGA        poderes específicos para pagar taxas públicas em
                  nome e por conta do cliente
2. NATUREZA       🔑 esses valores NÃO integram o preço dos serviços
                  e NÃO constituem receita da Legalizai
3. VALOR          exatamente o repassado, sem acréscimo. Taxa de
                  conveniência, se houver, é serviço nosso, separada
                  e explícita
4. PRESTAÇÃO      comprovante do pagamento ao órgão, no app
   DE CONTAS
5. DEVOLUÇÃO      se o ato não se realizar, o valor volta
```

Base: mandato, Código Civil arts. 653 e seguintes. **Lastro cadastral:** CNAE secundário 74.90-1-04 (intermediação e agenciamento) já consta do cartão CNPJ da Legalizai Tecnologia.

⚠️ **O certificado digital NÃO entra aqui.** Ele é benefício incluído (bloco 7), portanto **custo nosso**, não dinheiro de terceiro. São regimes opostos.

📌 Decisão de receber e repassar: 08/09. Diagnóstico fiscal: receber R$281,08 no nosso CNPJ sem distinção pode ser lido como faturamento de serviço.

⚖️ 🔴 Sem paralelo no contrato deles. É construção nossa.

❓ **A redação de mandato basta para afastar a natureza de receita**, ou é preciso outra figura? **É a pergunta jurídica mais importante do documento.** ⚠️ O caminho operacional do dinheiro (split no gateway) segue aberto e é problema separado.

---

# 11. Elegibilidade e superveniência

📄 **Contabilizei.** A **11.5** lista sete casos que eles não atendem (filial, importação/exportação, +20 empregados, indústria, regime de caixa, cessão de mão de obra, sócio PJ). A **11.6** permite rescindir *"independente de notificação e aviso prévio"* se qualquer condição mudar.

✍️ **Legalizai.** Mesma lista, conteúdo nosso, **e uma régua diferente para a consequência**.

## 🔑 A régua: característica × conduta

```
MUDOU DE CARACTERÍSTICA         TEVE CONDUTA
(cresceu, contratou, virou      (mentiu, não pagou, usou
 outra coisa)                    indevidamente)

→ nunca rescisão                → rescisão, com as consequências
→ PERMANECE ou ENCAMINHADO
→ sempre SEM MULTA
```

🎯 **Ninguém é punido por crescer ou por contratar alguém.** Isso é sucesso do cliente. Punição existe para quem quebra o combinado.

## Os 11 critérios e a saída de cada um

| # | Se deixar de valer | Saída | Por quê |
|:--:|---|:--:|---|
| 1 | Sai do Simples (LP/Real) | 🟡 encaminhado | produto é só Simples |
| 2 | **Ultrapassa R$360 mil/ano → EPP** | 🟢 **permanece** | ver bloco 12 |
| 3 | Passa a exercer comércio ou indústria | 🟡 encaminhado | exige estoque, IE, NF-e |
| 4 | Muda sede para fora de BH/MG | 🟢 permanece, com endereço fiscal | solução de produto (27/08) |
| 5 | Abre filial | 🟡 encaminhado | multiplica obrigação municipal |
| 6 | Entra o 5º sócio | 🟡 encaminhado | teto do produto é **4** |
| 7 | Entra sócio PJ | 🟡 encaminhado | 🔴 **tira do Simples** (LC 123 art. 17) |
| 8 | Sócio passa a residir no exterior | 🟡 encaminhado | idem |
| 9 | Contrata o 11º empregado | 🟡 encaminhado | teto do produto é **10** · o líder recusa a partir de 20 (11.5-c) |
| 10 | Passa a fazer cessão de mão de obra | 🟡 encaminhado | retenção de INSS, R-2099 |
| 11 | Adota regime de caixa | 🟡 encaminhado | muda a apuração |

🔴 **Rescisão fica reservada a conduta:** atividade ilegal · informação falsa ou omitida · não pagamento de 2 mensalidades · uso da plataforma para prestar serviço a terceiro · assédio ou discriminação.

## O que "encaminhado" significa

```
a) Comunicação em até 15 dias
b) 🔑 A Legalize Auditoria mantém a responsabilidade técnica
   SEM SOLUÇÃO DE CONTINUIDADE
c) Proposta específica em até 30 dias
d) Cliente aceita ou encerra SEM MULTA, mesmo na fidelidade
e) Até resolver, seguem preço e escopo atuais por até 3 competências
f) Livros e documentos entregues (Res. CFC 1.590/2020)
```

🔑 **O (b) é o mais importante: responsabilidade técnica não pode ter buraco, nem por um dia.**

📌 Régua e classificação: decisões do Pedro em 10/09. Teto de 4 sócios: decisão de 29/08, no código.

⚖️ 🟢 Copiar a estrutura da 11.5. 🔴 **Não copiar a 11.6** — rescindir sem aviso quem mudou de característica é o oposto do que decidimos.

❓ **"Sem multa" quando o cliente muda de característica precisa de redação específica** para não conflitar com a cláusula de fidelidade?

---

# 12. Mudança de porte ME → EPP

🔑 **Este bloco existe porque o cliente que cresce CONTINUA CONOSCO.** Não há transferência, não há encerramento, e o contrato não deve conter uma linha sugerindo o contrário.

**E contratualmente não há mesmo transição:** a Legalize Auditoria **já é parte do contrato desde o dia 1**. Quem conduz o desenquadramento internamente é detalhe de operação.

```
a) Ultrapassado o limite de receita bruta do ME (LC 123, art. 3º),
   a empresa passa à condição de EPP.

b) A LEGALIZAI CONDUZ O DESENQUADRAMENTO e MANTÉM INTEGRALMENTE a
   prestação dos serviços, sem interrupção e sem alteração de
   escopo. O cliente segue atendido pela plataforma.

c) Pelo desenquadramento: honorário de R$ 139,00, mais a taxa da
   Junta Comercial de R$ 290,00, informada e cobrada em separado.

d) A partir da competência seguinte, aplica-se a mensalidade da
   faixa EPP da tabela do Plano Contratado, apurada pela RBT12.

e) A diferença de faixa decorre do maior volume de operações, notas
   fiscais e movimentações a processar, E DA ALTERAÇÃO DAS OBRIGAÇÕES
   ACESSÓRIAS DECORRENTE DA MUDANÇA DE PORTE, e NÃO constitui reajuste
   na acepção da cláusula de reajuste anual.

f) Ultrapassado o limite do Simples Nacional (R$ 4,8 milhões),
   aplica-se a cláusula de superveniência.
```

📌 Taxa da JUCEMG (R$290): confirmada pelo Ademar em 10/09. Honorário (R$139) e tabela EPP: decisões do Pedro em 10/09.

🔑 **A obrigação acessória muda por PORTE, não por faixa de receita.** 📌 Confirmado pelo Pedro em 10/09. Isso **reforça a causa objetiva** do item (e): o desenquadramento não traz só mais volume, traz **outro conjunto de obrigações a cumprir**. É o argumento mais forte que a faixa EPP tem, e vale escrever com essa palavra.

🎯 **Por que não escrevemos "poderá haver reajuste de até 30%":** o **CDC art. 51, X** considera abusiva a cláusula que permita ao fornecedor variação unilateral do preço. Preço definido em **tabela prévia** e disparado por **fato objetivo** não é variação unilateral — é o contrato funcionando como combinado. O item (e) declara a **causa objetiva**, que é o que sustenta a faixa.

📌 **Comparação de mercado:** a Contabilizei cobra **R$156,40** de honorário pelo mesmo ato, com a taxa pública por conta do cliente (≈ R$446,40 no total). ⚠️ Eles **não cobram por porte**, cobram por faixa de faturamento — o "30% a mais" que circulava não tem fonte no que capturamos.

⚖️ 🔴 Sem paralelo. Construção nossa.

❓ **O item (e) é suficiente para afastar a leitura de reajuste unilateral**, ou a tabela EPP precisa estar no corpo do contrato e não no anexo?

---

# 13. Responsabilidade

📄 **Contabilizei.** **5.10:** responde por multa só se houver *"culpa exclusiva e comprovada"*. **5.11 e 5.11.1:** não responde por multa que o cliente der causa, nem solidária nem subsidiariamente, inclusive IBS/CBS e split payment. **8.1:** doze declarações do cliente. **7.9 e 11.11:** dever de indenizar com direito de regresso.

✍️ **Legalizai.** Adotar a estrutura. As doze declarações da 8.1 e as 24 obrigações da 5.6 são a parte mais reaproveitável do documento inteiro, e estão literais em `produto/evidencias/fontes/`.

⚠️ **Duas obrigações da 5.6 precisam de adaptação**, porque conta PJ e extrato integrado **estão fora do nosso escopo** (decisão de 09/09): a **5.6-e** (importar extrato até o 5º dia útil) e a **5.6-w** (classificar saques aos sócios). Sem trilho bancário próprio, **o envio pelo cliente é o mecanismo, não o plano B** — e a consequência do não envio precisa ser mais explícita que na deles.

⚖️ 🟢 Copiar quase tudo. 🕓 Adaptar 5.6-e e 5.6-w.

---

# 14. LGPD, licença de software e condições gerais

📄 Cláusulas **9** (LGPD), **10** (licença) e **11** (gerais) do contrato deles, todas literais em `produto/evidencias/fontes/`.

⚖️ 🟢 Copiar a estrutura, com dois ajustes:
- **11.3** (reembolso de materiais como correios, carimbos e cópias) precisa ser conferida: no nosso modelo digital pode não fazer sentido, e ela **contradiz** a promessa de custo transparente.
- **11.2** (extinguir plano ou alterar valor com 30 dias e **direito de sair sem multa**) é a melhor peça deles nesse tema. Adotar.

---

# 15. Anexos

| Anexo | O que é | Modelo capturado? |
|---|---|:--:|
| **I — Plano Contratado** | tabela de preço **e escopo** (coortes ME + faixas EPP + folha + adicionais) | ✅ o deles só tem preço; o nosso corrige isso |
| **II — Carta de Responsabilidade da Administração** | 🔴 **obrigatória** por Res. CFC nº 1.590/2020, art. 3º | ✅ literal, 6.418 caracteres |
| **III — Termo sobre distribuição de lucros** | Lei nº 15.270/2025, EFD-Reinf, IRRF antecipado | ✅ literal, 4.615 caracteres |
| **IV — Escritório Virtual** | endereço fiscal, R$49/mês, **aprovação automática** | ✅ Anexo III deles |

🔴 **Sobre a Carta:** o próprio texto deles diz que *"a confecção e assinatura das demonstrações contábeis pelos nossos contadores **depende da assinatura desta Carta pelo cliente**"*. **É norma do CFC, não política de empresa** — vale idêntico para a Legalize Auditoria. **Sem Carta assinada, o contábil não fecha.**

🔑 **Arquitetura de aceites.** O contrato é o tronco; os Termos são galhos que crescem depois, cada um com aceite próprio e trilha de data, IP e navegador. É assim que a relação evolui **sem aditar o contrato**. Precisamos do mesmo mecanismo, e ele é **requisito de engenharia**: cada cliente fica preso à versão que aceitou, e com três coortes de preço convivendo isso deixa de ser hipótese.

---

# 16. ❓ Perguntas consolidadas para a advogada

| # | Pergunta | Bloco |
|:--:|---|:--:|
| 1 | Um instrumento com duas partes, ou dois instrumentos? | 1 |
| 2 | Tabela de adicionais como anexo versionado resolve a fronteira do escopo? | 2 |
| 3 | "Desconto de plano integra o preço e não constitui liberalidade reembolsável" sustenta? | 4.2 |
| 4 | Reajuste com 30 dias precisa vir com direito de sair sem multa? | 4.3 |
| 5 | Como redigir a lista de serviços para poder crescer sem aditar, sem cair em "conforme a plataforma"? | 6 |
| 6 | Custódia de senha de certificado A1 exige formalidade além da autorização em contrato? | 7 |
| 7 | "Preço de lançamento vigente até data" basta, ou precisa ser prazo por cliente? | 8 |
| 8 | 🔴 **A cláusula de mandato afasta a natureza de receita no repasse da taxa da Junta?** | 10 |
| 9 | "Sem multa" na mudança de característica conflita com a cláusula de fidelidade? | 11 |
| 10 | O item (e) da mudança de porte afasta a leitura de variação unilateral (CDC 51, X)? | 12 |
| 11 | A tabela EPP deve ficar no corpo do contrato ou no anexo? | 12 |
| 12 | 🕓 A **Lei nº 15.270/2025** e a janela da **ATA até 31/01/2026** ainda valem, e como refletir no Termo? | 15 |

---

# 17. Lacunas declaradas

> 🔒 O que **não** foi verificado, para ninguém tratar como fechado.

| | Lacuna | Quem resolve |
|:--:|---|---|
| 🕓 | A **Lei nº 15.270/2025** (distribuição de lucro na EFD-Reinf a partir de 2026, com IRRF antecipado) e o **art. 32 da Lei nº 4.357/64** (multa de 50%) são **citações do concorrente**, lidas em tela do produto deles. **Não ratificadas em fonte primária.** Antes de virarem cláusula, texto de anexo ou copy, precisam da confirmação da advogada | Advogada |

✅ **Fechadas em 10/09, no fim desta rodada:**

| | O que estava aberto | Como fechou |
|:--:|---|---|
| ✅ | Obrigação acessória entra por porte ou por faixa? | **Por PORTE.** Confirmado pelo Pedro. Reforça a causa objetiva da faixa EPP (bloco 12) |
| ✅ | O R$1.100 da Legalize tradicional é comparável? | **Não é dúvida.** O preço está travado: **R$290 de taxa da Junta + R$139 de honorário** |
| ✅ | Margem da folha | **Travada:** R$39 por colaborador, teto de **10** |
| ✅ | A lista do bloco 6 depende de contratação externa? | **Não.** Construída pelo dev, direto por API, dentro do app |

---

## Links
[[entidades-legais]] · [[2026-09-10-contabilizei-contrato-integral]] · [[2026-09-10-contabilizei-contrato-LITERAL]] · [[2026-09-10-contabilizei-plano-contratado-LITERAL]] · [[2026-09-10-contabilizei-aceites-LITERAL]] · [[_inventario-documentos]] · [[decisoes-marca]] · [[HOME]]
