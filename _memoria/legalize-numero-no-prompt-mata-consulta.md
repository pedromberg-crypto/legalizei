---
name: legalize-numero-no-prompt-mata-consulta
description: "19/09: numero escrito no que esta SEMPRE no contexto mata a regra de consultar a fonte; o 10-CONTRATO foi aberto 1 vez em 632 porque o SOUL entregava os numeros dele"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ef03a14d-3945-45eb-b9b1-7675bfc90245
  modified: 2026-09-19T15:06:14.864Z
---

Regra travada 19/09 no agente Léo, e ela vale para qualquer sistema com carregamento sob demanda: **número escrito no que está sempre no contexto mata a regra de consultar a fonte.**

O `SOUL.md` está no system prompt de toda chamada. Ele guardava `12 meses`, `30% do saldo`, `R$ 281,08`, `R$ 49`, `R$ 139`, `R$ 99` — inclusive **dentro da própria linha que mandava ler o `10-CONTRATO`**. Resultado medido no `state.db`: `10-CONTRATO` aberto **1 vez em 632** chamadas de `skill_view` (e a única foi teste ad-hoc); `08-MAPA-DO-DOSSIE`, **zero**.

🔑 **Do ponto de vista do modelo ele não estava respondendo de memória: estava lendo no prompt.** A instrução "número nunca sai de memória" é inaplicável quando o próprio prompt entrega o valor.

**Why:** o custo não é teórico. Os **7 dias de arrependimento** existem só no `10`, então o agente vinha respondendo fidelidade com a parte que assusta (12 meses, multa de 30%) e omitindo a que tranquiliza. Meia verdade no assunto em que o cliente menos perdoa. Mesmo defeito em `vendas` (aberto 314×) e `04-QUEBRA-OBJECOES`.

**How to apply:** exemplo em arquivo sempre-carregado ensina **forma**, nunca valor — use marcador (`[mensalidade]`, `[a data]`) e mande ler a nota. Isso torna a consulta **necessária, não garantida**: o que garante é roteador determinístico por regex antes do turno, e isso é runtime, não documento. Três camadas independentes, não confundir: (1) o valor existir num lugar só, (2) o modelo decidir consultar, (3) o modelo obedecer ao que leu — a 3ª é **aderência**, e se resolve com posição e brevidade, não com mais regra. Em 19/09, 2 das 3 falhas da bateria eram aderência: o agente **abriu** o arquivo e violou regra que estava no §5 de 10 KB. Efeito colateral bom: casos de teste que checam número por regex passam a medir de verdade se a nota foi aberta, em vez de passar por cópia. Ver [[legalize-agente-whatsapp-vault-isolado]].
