---
name: legalize-persona-unica-vidas-mjs
description: 17/09 travado pelo Pedro — persona do motor fiscal e SO `estado-cnpj/vidas.mjs` (18 vidas). O elenco de `testes-flutter/personas-entrada-me.md` (24) NAO tem relacao com esse fluxo.
metadata:
  type: project
---

**A persona do fluxo do motor fiscal e `produto/me/viver/motor/vidas/vidas.mjs` — 18 vidas (P01-P14, P16, P18, P21, P22). So essa.**

O outro elenco, `execucao/testes-flutter/personas-entrada-me.md` (24 personas, P01-P24), **nao tem a ver com esse fluxo** — ele e do flow de ENTRADA no app Flutter, coisa do Leo/dev.

**Why:** em 17/09 eu medi os dois e achei colisao de ID — P16 e "BH" num e "fora de BH" no outro; P21 e Tiago Moreira Bastos num e Debora Almeida Ferraz no outro; P22 e Rafael Nunes Prado num e Ronaldo Teixeira Amaral no outro. So o P01 (Bruno Almeida Souza) bate. Eu levantei isso como se fosse divergencia a reconciliar; o Pedro cortou: sao dois assuntos, nao um elenco que derivou.

**How to apply:** ao falar de "persona" em motor fiscal, apuracao, Fator R, DAS, pro-labore ou ciclo do CNPJ, referenciar SEMPRE `vidas.mjs`. Nao propor reconciliacao entre os dois elencos, nao tratar a colisao de ID como bug, e nao trazer as personas do Flutter (P15, P17, P19, P20, P23, P24 — recusa, CPF suspenso, pagamento, gate) para dentro do motor. Ver [[legalize-suite-teste-flutter-personas]] e [[legalize-motor-fiscal-apurador-existe]].
