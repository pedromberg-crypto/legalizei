# DICIONÁRIO DE CNAE E TRIBUTAÇÃO

Conceitos pra você explicar bem. Regra de decisão sobre um código específico não está aqui, está na consulta (`11-COMO-CONSULTAR-CNAE`).

## 1. O que é CNAE
É o código que diz oficialmente o que a empresa faz. Ele define o imposto, o registro e às vezes a exigência de conselho de classe. No app, a pessoa descreve a atividade com as próprias palavras e a gente encontra o código certo, ela não precisa saber o número.

Em suricato: é o RG da atividade da empresa. Errar ele é como nascer com o nome trocado na certidão.

## 2. Simples Nacional e os anexos (ME)
| Anexo | Quem cai nele | Alíquota inicial |
|---|---|---|
| **III** | Serviços em geral (marketing, manutenção, ensino, muitos serviços técnicos) | 6% |
| **IV** | Construção civil, limpeza, vigilância, advocacia | 4,5% |
| **V** | Serviços intelectuais que não batem o Fator R | 15,5% |

Alíquota inicial é a da primeira faixa de faturamento. Ela sobe conforme a empresa fatura mais, e o cálculo real de cada mês é do contador.

## 3. Fator R (o pulo do gato)
Algumas atividades ficam entre o Anexo III e o Anexo V. Quem decide é o **Fator R**: a proporção entre a folha de pagamento (incluindo o pró-labore do sócio) e o faturamento.

* **A lei:** folha igual ou maior que **28%** do faturamento leva pro Anexo III (6%). Abaixo disso, Anexo V (15,5%).
* 🔴 **Não existe margem de segurança na lei. O limiar é seco.** Por isso a nossa recomendação nunca é ficar em 28% cravado: quem fica na linha muda de anexo em qualquer mês de oscilação. A Legalizai trabalha com folga em cima do limiar, e é o contador que calibra isso com o cliente.
* A Legalizai monitora esse número mês a mês. Esse é um dos motivos reais de existir um contador com CRC no plano ME.

Em suricato: é o degrau entre pagar 6% e pagar 15,5%. Dá pra escolher o lado do degrau, desde que alguém esteja olhando todo mês.

## 4. MEI x ME
* MEI: guia fixa mensal, teto de faturamento próprio, lista fechada de ocupações permitidas.
* ME no Simples: imposto proporcional ao faturamento, muito mais atividade permitida, e é onde entram as profissões intelectuais.
* A separação entre os dois é jurídica, não é só tamanho. Ver `03-REGRAS-DOS-ORGAOS` §4.

## 5. 🔴 Regra de conduta com códigos
Você **nunca** afirma anexo, alíquota ou elegibilidade de MEI de memória, nem por semelhança de profissão. Toda pergunta sobre um código ou atividade específica passa pela consulta descrita em `11-COMO-CONSULTAR-CNAE`, e quando ela devolver `escalar: true`, quem responde é o contador humano.
