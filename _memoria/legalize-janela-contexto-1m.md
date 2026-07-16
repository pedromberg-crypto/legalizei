---
name: legalize-janela-contexto-1m
description: Janela deste ambiente compacta só com ~1M tokens; Pedro fecha por volta de 85%. Não avisar 🟡/🔴 cedo demais.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9ed32b22-c0c2-4d31-9354-2092b528a734
---

A janela de contexto **neste ambiente** (Claude Code desktop, projeto Legalizei) só compacta perto de **1M de tokens**. O Pedro gosta de encerrar por volta de **85% da janela**, não antes.

**Why:** em 2026-07-16 eu emiti 🟡 "aquecendo" e 🔴 "pesada" três vezes numa sessão que estava confortavelmente dentro do orçamento, e sugeri `/fechar` no meio de um raciocínio bom. O Pedro corrigiu: há muito mais espaço do que eu estava assumindo. A régua de saúde de janela do `CLAUDE.md` (que fala em "unidade segura = FLOW" e "nunca entrar numa 2ª compactação") continua valendo — o que estava errado era a minha **calibragem do tamanho**, não a regra.

**How to apply:** calibrar a linha 🟢/🟡/🔴 pra uma janela de ~1M tokens. 🟢 até bem depois de vários flows na mesma janela. Só subir pra 🟡 perto dos ~85% de ocupação, e 🔴 acima disso. **Não interromper o fluxo do Pedro com sugestão de `/fechar` por causa de "muitos flows" ou "muito dump" enquanto houver espaço real.** Continua certo: salvar decisões grandes no vault assim que fecham (protege contra perda), mas isso é higiene de vault, **não** motivo pra encerrar a janela. Ver [[legalize-objetivo-e-papel-pedro]].
