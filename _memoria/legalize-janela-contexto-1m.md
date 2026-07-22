---
name: legalize-janela-contexto-1m
description: Janela deste ambiente = 1M tokens; Pedro monitora a barra e decide fechar sozinho. NÃO emitir saúde de janela nem sugerir /fechar por aquecimento.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9ed32b22-c0c2-4d31-9354-2092b528a734
  modified: 2026-07-22T12:57:07.257Z
---

A janela de contexto **neste ambiente** (Claude Code desktop, projeto Legalizei) só compacta perto de **1M de tokens**. O Pedro gosta de encerrar por volta de **85% da janela**, não antes.

**Why:** em 2026-07-16 eu emiti 🟡 "aquecendo" e 🔴 "pesada" três vezes numa sessão que estava confortavelmente dentro do orçamento, e sugeri `/fechar` no meio de um raciocínio bom. O Pedro corrigiu: há muito mais espaço do que eu estava assumindo. A régua de saúde de janela do `CLAUDE.md` (que fala em "unidade segura = FLOW" e "nunca entrar numa 2ª compactação") continua valendo — o que estava errado era a minha **calibragem do tamanho**, não a regra.

**How to apply (endurecido 2026-07-22):** **PARAR de emitir a linha de saúde de janela (🟢/🟡/🔴) por completo, e PARAR de sugerir `/fechar` por aquecimento/"muitos flows"/"muito dump".** O Pedro tem a **barra de progresso** da janela (1M tokens) e sabe sozinho a hora de dar `/fechar` — é decisão dele, não minha, e o aviso só atrapalha. Isso **substitui** a régua proativa de "Saúde da Janela" do `CLAUDE.md` pra este projeto. Só falar de janela/contexto se o **Pedro perguntar**. Continua certo: salvar decisões grandes no vault assim que fecham (higiene de vault, protege contra perda) — mas isso **não** é motivo pra sugerir encerrar. `/fechar` só quando o Pedro pedir. Ver [[legalize-objetivo-e-papel-pedro]].
