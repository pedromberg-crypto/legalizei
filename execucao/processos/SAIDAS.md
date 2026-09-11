---
tipo: derivado
status: vivo
data: 2026-09-11
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
