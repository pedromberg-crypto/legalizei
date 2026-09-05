---
name: legalize-edicao-simples-editar-direto
description: 05/09 - pedido de layout/copy pontual se resolve com Edit direto; nada de script Python nem suite de testes. Pedro cobrou lentidao 2x na mesma sessao.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3ba5f17b-581d-4f18-a6b4-3ef365ad2501
  modified: 2026-09-05T20:43:26.789Z
---

Pedido pontual de layout ou copy (mover bloco, trocar frase, remover card, cor)
resolve-se com **Edit direto no arquivo**. Nada de script Python de patch, nada
de rodar suite de e2e, nada de auditoria por iniciativa própria.

**Why:** em 05/09 o Pedro cobrou duas vezes na mesma sessão ("por que vc está a
cada prompt fazendo testes?" e depois "vc está voltando a demorar com edições
simples"). As duas causas foram minhas: (1) rodei a suíte Playwright completa
(~9 min) depois de mudanças de layout, quando o padrão da casa é `tsc`+`eslint`;
(2) apliquei edições de 3 linhas via scripts Python com `assert` de trecho
exato, que falhavam quando o Prettier tinha reformatado o alvo e exigiam 2-3
rodadas de conserto cada. Seis retrabalhos numa sessão.

**How to apply:**
- Edit/Write direto. Script só quando a mesma transformação repete em muitos
  pontos, e mesmo aí ancorando em trecho curto e estável.
- Verificação padrão: `tsc` + `eslint`. Só isso.
- Playwright: só quando o Pedro pedir (ver [[legalize-nao-rodar-e2e-sem-pedir]]),
  ou uma medição pontual quando o que está em jogo é geometria de layout, que
  `tsc` não pega — uma medição, não a suíte.
- Ele revisa a UI sozinho (ver [[legalize-pedro-confere-ui-sozinho]]): entregar
  a rota pra ele olhar vale mais que eu tentar provar por teste.
