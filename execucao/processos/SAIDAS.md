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

## P4 · Adicionar um serviço avulso à fatura aberta

### 🟢 P4.2 · Aceita o serviço, na sheet

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| aceitou | as duas | P4.13 · Guarda o comprovante do aceite | P4.11 · A competência fecha e a fatura soma tudo · P4.9 · E se o serviço não puder ser entregue? · P4.10 · E se cancelar o plano com avulso em andamento? · P4.19 · Entregue, e já estava pago · P4.17 · Expirou, e vira histórico |
| fechou a sheet | as duas | P4.12 · Fechou a sheet, e nada acontece | P4.12 · Fechou a sheet, e nada acontece |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P4.3 · Custa mais de R$ 50?

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| até R$ 50 · vai pra fatura | as duas | P4.6 · Existe fatura ABERTA na competência? | P4.11 · A competência fecha e a fatura soma tudo · P4.9 · E se o serviço não puder ser entregue? · P4.10 · E se cancelar o plano com avulso em andamento? · P4.19 · Entregue, e já estava pago |
| acima de R$ 50 · paga agora | as duas | P4.14 · Paga na hora | P4.9 · E se o serviço não puder ser entregue? · P4.10 · E se cancelar o plano com avulso em andamento? · P4.11 · A competência fecha e a fatura soma tudo · P4.19 · Entregue, e já estava pago · P4.17 · Expirou, e vira histórico |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🔴 P4.6 · Existe fatura ABERTA na competência?

Chega aqui por uma trilha: **na fatura**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| fatura aberta | as duas | P4.7 · Entra como item de linha | P4.9 · E se o serviço não puder ser entregue? · P4.10 · E se cancelar o plano com avulso em andamento? · P4.11 · A competência fecha e a fatura soma tudo · P4.19 · Entregue, e já estava pago |
| já fechou · ❓ | as duas | P4.11 · A competência fecha e a fatura soma tudo | P4.11 · A competência fecha e a fatura soma tudo |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.

### 🟢 P4.8 · O trabalho começa. Não dá pra remover.

Chega aqui por 2 trilhas: **na fatura** e **já pago**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| não deu certo | as duas | P4.9 · E se o serviço não puder ser entregue? | P4.9 · E se o serviço não puder ser entregue? |
| cancelou o plano | na fatura | P4.10 · E se cancelar o plano com avulso em andamento? | P4.10 · E se cancelar o plano com avulso em andamento? |
| cancelou o plano | já pago | P4.18 · Cancelou com o avulso já pago | P4.9 · E se o serviço não puder ser entregue? |
| correu bem | na fatura | P4.11 · A competência fecha e a fatura soma tudo | P4.11 · A competência fecha e a fatura soma tudo |
| correu bem | já pago | P4.19 · Entregue, e já estava pago | P4.19 · Entregue, e já estava pago |

🔴 **Cobertura incompleta:**

- o caminho de **não deu certo** para no P4.9, que não é um fim declarado
- o caminho de **cancelou o plano** para no P4.10, que não é um fim declarado

### 🟡 P4.15 · O pagamento confirmou?

Chega aqui por uma trilha: **já pago**.

| Condição | Vale na trilha | Leva para | Onde esse caminho termina |
|---|---|---|---|
| pago | as duas | P4.8 · O trabalho começa. Não dá pra remover. | P4.9 · E se o serviço não puder ser entregue? · P4.10 · E se cancelar o plano com avulso em andamento? · P4.11 · A competência fecha e a fatura soma tudo · P4.19 · Entregue, e já estava pago |
| não pagou | as duas | P4.16 · Fica aguardando dentro do prazo | P4.17 · Expirou, e vira histórico |

✅ **Cobertura completa:** toda condição responde em toda trilha que chega aqui, e todo caminho termina.
