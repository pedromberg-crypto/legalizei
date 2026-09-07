---
name: legalize-certificado-vira-gate-e-cobranca
description: "07/09: no MEI o certificado digital virou GATE (sem ele o app não libera) e passou a ser cobrado DENTRO do app; inverte 2 coisas que estavam escritas e pede cláusula com o Mauro"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-07T22:56:01.631Z
---

Decisão do Pedro em 07/09, em duas partes, e as duas **invertem** o que o vault
dizia antes:

1. **Virou gate.** Sem certificado o app não libera o acesso total, e a jornada
   PARA no status (`/mei/status?fase=certificado&certificado=pendente`). Até
   então a M14 dizia "não é gate, dá pra seguir sem" e despejava na casa.
2. **Virou cobrança nossa.** Deixa de ser "pago direto na certificadora" e
   passa pelo app (M14.P), valor da parceira repassado sem acréscimo. O que
   muda não é o preço: é por onde o dinheiro entra, e portanto quem pode dizer
   "está pago" sem depender de aviso de terceiro.

A implementação espelha a família da guia da Junta do ME: M14.P (mesmo
`PagamentoMeiView` no modo `certificado`) + splash de recusa + retry + splashes
de pago/boleto + 4 estados de status (pendente · boleto · pronto · liberado).

**Why:** é a única cobrança do ramo além da mensalidade, e a M5/M6 vinham
prometendo o contrário desde 28/08. Copy que descreve o mundo antigo é pior que
copy ausente — a pessoa lê as duas e lembra da que prometeu menos trabalho.

**How to apply:**
- 🔴 **Pendente com o Mauro:** repassar cobrança de terceiro dentro do app pede
  cláusula. A copy da M5 e do contrato da M6 já foi alinhada, mas não passou
  por ele. Não tratar como fechado.
- A M14 continua abrindo por dizer que a **abertura** dispensou o certificado
  (é a dúvida mais provável de quem acabou de abrir); o gate vale daí pra
  frente. Ver [[legalize-reta-final-certificado-e-assinaturas]].
- Segue aberto de antes: a fidelidade de 12 meses do MEI ficou sem contrapartida
  escrita quando o certificado saiu do plano.
