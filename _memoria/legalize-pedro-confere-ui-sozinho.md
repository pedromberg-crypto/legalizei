---
name: legalize-pedro-confere-ui-sozinho
description: "Em UI do Legalizei, não abrir o navegador pra conferir — o Pedro confere no browser dele e reporta."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d8a3e7a3-16ca-4581-bed7-1c454d019eb2
---

**Não abrir o navegador pra "ver se ficou bom"** no app do Legalizei (`app/`). O Pedro tem o `/mockup` aberto na máquina dele, olha e reporta. Instrução dada 2026-07-16.

**Why:** o loop dele é mais rápido que o meu. Ele vê a tela inteira num olhar; eu gasto vários tool calls e ainda erro. Nesta sessão o `computer{screenshot}` estourou 30s duas vezes e um `left_click` não despachou — a mesma instabilidade de captura já estava anotada em `app/src/app/(wizard)/gate/page.tsx`, onde ela chegou a produzir um falso-positivo (culpar o typewriter por um timeout da ferramenta). Tempo meu no browser = tempo dele esperando por uma leitura pior.

**How to apply:** escrever o código, dizer o que mudou e o que olhar, e **parar**. Ele reporta o que quebrou. O hook do preview server vai pedir verificação a cada Edit — a instrução do Pedro ganha do hook.

Continua valendo medir por DOM (`javascript_tool`) **quando o número É a resposta** e o olho não resolveria: provar que um inset de 59px chegou dentro do iframe, medir se a tela estoura a altura. Isso é medição, não review. O que morre é o "abrir pra ver".

Ver [[legalize-reordenacao-e-telas-em-codigo]] · [[legalize-prototipo-ux]].
