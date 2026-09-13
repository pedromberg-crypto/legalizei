---
tipo: derivado
status: vivo
data: 2026-09-13
assunto: saidas-por-decisao
gerado_por: execucao/processos/gerar-processos.mjs
tags: [execucao, processos, cobertura, dev]
---

# 🚦 Tabela de saídas — todas as portas de cada decisão

> ⚠️ **Nota gerada.** Não editar à mão. A fonte é `processos-data.mjs`.
>
> **Pra que serve:** o board mostra por onde o caminho passa; esta tabela responde se ele **cobre todos os casos**. É a pergunta que grafo nenhum responde, e é onde os dois buracos de 11/09 estavam.

## P1 · A competência fecha, a fatura é emitida e cobrada

### 🟡 P1.2 · O preço mudou neste ciclo?

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o preço é o mesmo | as duas | P1.4 · Emite a fatura e cobra na forma cadastrada | P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| mudou de faixa, acabou a oferta ou teve reajuste | as duas | P1.3 · Avisa o preço novo, 30 dias antes | P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟡 P1.5 · A fatura foi paga?

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| pagou | as duas | P1.6 · Dá baixa e o ciclo segue | P1.6 · Dá baixa e o ciclo segue |
| não pagou | as duas | P1.7 · Venceu: entra multa e juros | P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟡 P1.8 · Tenta de novo, e avisa sem assustar

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| tentou de novo | as duas | P1.5 · A fatura foi paga? | P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| segue sem pagar | as duas | P1.9 · Suspende o acesso, sem apagar o dado | P1.10 · Duas mensalidades: a casa pode encerrar |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

## P2 · Emitir a guia do DAS e saber que ela foi paga

### 🟡 P2.5 · A guia foi paga?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| foi paga | as duas | P2.6 · Guia quitada, e o mês fecha | P2.6 · Guia quitada, e o mês fecha |
| não foi paga | as duas | P2.7 · Venceu sem pagar: oferece refazer a guia | P4.12 · Fechou a sheet, e nada acontece · P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.23 · Entrega e cobra na fatura final · P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

## P3 · Emitir a nota fiscal

### 🟢 P3.2 · Emite aqui, ou já emitiu fora?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| emite aqui | as duas | P3.3 · Pede só o valor e o cliente | P3.7 · Nota emitida, e a receita entra na conta |
| já emitiu fora | as duas | P3.10 · Emitiu fora: a nota precisa entrar aqui | P3.7 · Nota emitida, e a receita entra na conta |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P3.6 · O órgão aceitou?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| autorizada | as duas | P3.7 · Nota emitida, e a receita entra na conta | P3.7 · Nota emitida, e a receita entra na conta |
| voltou com erro | as duas | P3.8 · Voltou com erro, e a pessoa entende o porquê | P3.7 · Nota emitida, e a receita entra na conta |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P3.9 · O certificado está válido?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| válido | as duas | P3.5 · Transmite ao Emissor Nacional | P3.7 · Nota emitida, e a receita entra na conta |
| vencido ou ausente | as duas | P3.11 · Emissão parada: falta o certificado | P3.7 · Nota emitida, e a receita entra na conta |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

## P4 · Adicionar um serviço avulso à fatura aberta

### 🟢 P4.2 · Aceita o serviço, na sheet

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| aceitou | as duas | P4.13 · Guarda o comprovante do aceite | P4.19 · Entregue, e já estava pago · P4.17 · Expirou, e vira histórico · P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.23 · Entrega e cobra na fatura final · P4.22 · Estorna o que já foi pago · P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| fechou a sheet | as duas | P4.12 · Fechou a sheet, e nada acontece | P4.12 · Fechou a sheet, e nada acontece |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P4.3 · Custa mais de R$ 50?

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| até R$ 50 · vai pra fatura | as duas | P4.6 · Acha ou abre a fatura do próximo ciclo | P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.23 · Entrega e cobra na fatura final · P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| acima de R$ 50 · paga agora | as duas | P4.14 · Paga na hora | P4.19 · Entregue, e já estava pago · P4.17 · Expirou, e vira histórico · P4.20 · A cobrança fica de pé · P4.22 · Estorna o que já foi pago |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P4.8 · O trabalho começa. Não dá pra remover.

Chega aqui por 2 trilhas: **na fatura** e **já pago**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| não deu certo | as duas | P4.9 · O serviço não pôde ser entregue | P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.22 · Estorna o que já foi pago |
| cancelou o plano | na fatura | P4.10 · Cancelou com avulso na fatura | P4.23 · Entrega e cobra na fatura final · P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte |
| cancelou o plano | já pago | P4.18 · Cancelou com o avulso já pago | P4.20 · A cobrança fica de pé · P4.22 · Estorna o que já foi pago |
| correu bem | na fatura | P4.24 · O ciclo vira no dia da assinatura | P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| correu bem | já pago | P4.19 · Entregue, e já estava pago | P4.19 · Entregue, e já estava pago |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟡 P4.9 · O serviço não pôde ser entregue

Chega aqui por 2 trilhas: **na fatura** e **já pago**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o cliente deu causa | as duas | P4.20 · A cobrança fica de pé | P4.20 · A cobrança fica de pé |
| falha nossa ou do órgão | na fatura | P4.21 · Tira da fatura, ou credita na seguinte | P4.21 · Tira da fatura, ou credita na seguinte |
| falha nossa ou do órgão | já pago | P4.22 · Estorna o que já foi pago | P4.22 · Estorna o que já foi pago |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P4.10 · Cancelou com avulso na fatura

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o serviço sobrevive ao fim do CNPJ | as duas | P4.23 · Entrega e cobra na fatura final | P4.23 · Entrega e cobra na fatura final |
| o serviço morre com a baixa do CNPJ | as duas | P4.9 · O serviço não pôde ser entregue | P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.22 · Estorna o que já foi pago |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟡 P4.15 · O pagamento confirmou?

Chega aqui por 2 trilhas: **na fatura** e **já pago**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| pago | as duas | P4.8 · O trabalho começa. Não dá pra remover. | P4.19 · Entregue, e já estava pago · P4.20 · A cobrança fica de pé · P4.21 · Tira da fatura, ou credita na seguinte · P4.22 · Estorna o que já foi pago · P4.23 · Entrega e cobra na fatura final · P1.6 · Dá baixa e o ciclo segue · P1.10 · Duas mensalidades: a casa pode encerrar |
| não pagou | as duas | P4.16 · Fica aguardando dentro do prazo | P4.17 · Expirou, e vira histórico |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

## P5 · Definir e pagar o pró-labore

### 🟢 P5.4 · Faturou neste mês?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| faturou | as duas | P5.3 · Mexe e vê o imposto mudar | P5.10 · Lançado e não pago: avisa antes de virar multa · P5.5 · Sem faturamento, sem pró-labore |
| não faturou | as duas | P5.5 · Sem faturamento, sem pró-labore | P5.5 · Sem faturamento, sem pró-labore |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🔴 P5.8 · O dinheiro saiu da conta pro sócio?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o dinheiro saiu | as duas | P5.9 · Entra no Fator R, e a alíquota se sustenta | P5.5 · Sem faturamento, sem pró-labore · P5.10 · Lançado e não pago: avisa antes de virar multa |
| declarado e não pago | as duas | P5.10 · Lançado e não pago: avisa antes de virar multa | P5.10 · Lançado e não pago: avisa antes de virar multa |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

## P6 · Cancelar, corrigir ou substituir uma nota já emitida

### 🟢 P6.2 · ◆ A nota nasceu aqui ou veio de fora?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| a nota nasceu aqui | as duas | P6.3 · ◆ Ainda está dentro do prazo legal? | P6.4 · ■ Passou de 2 anos: não dá mais · P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log · P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move · P6.11 · ■ Recusou: a nota continua valendo |
| veio de fora, importada | as duas | P6.14 · Registra o cancelamento que o portal já fez | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P6.3 · ◆ Ainda está dentro do prazo legal?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| dentro dos 2 anos | as duas | P6.5 · ◆ A competência está fechada? | P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log · P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move · P6.11 · ■ Recusou: a nota continua valendo |
| passou de 730 dias | as duas | P6.4 · ■ Passou de 2 anos: não dá mais | P6.4 · ■ Passou de 2 anos: não dá mais |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P6.5 · ◆ A competência está fechada?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| mês ainda aberto | as duas | P6.7 · ◆ Cancelar, substituir ou corrigir? | P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log · P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move · P6.11 · ■ Recusou: a nota continua valendo |
| mês já fechado | as duas | P6.6 · Mês fechado: diz o custo ANTES de deixar seguir | P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log · P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move · P6.11 · ■ Recusou: a nota continua valendo |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P6.7 · ◆ Cancelar, substituir ou corrigir?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| essa nota não deveria existir | as duas | P6.8 · Confirma com a nota inteira na tela | P6.11 · ■ Recusou: a nota continua valendo · P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |
| o valor ou o serviço está errado | as duas | P6.12 · Substitui: nasce a nota nova, ligada à velha | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |
| só o texto está errado | as duas | P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log | P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟡 P6.10 · ◆ O município aceitou?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o município cancelou | as duas | P6.15 · ◆ Aquela competência já virou imposto? | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |
| o município recusou | as duas | P6.11 · ■ Recusou: a nota continua valendo | P6.11 · ■ Recusou: a nota continua valendo |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🔴 P6.15 · ◆ Aquela competência já virou imposto?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| o DAS daquele mês já saiu | as duas | P6.16 · Refaz a apuração da competência que já tinha fechado | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |
| a competência ainda não apurou | as duas | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move | P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.
