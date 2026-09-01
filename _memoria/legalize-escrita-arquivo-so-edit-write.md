---
name: legalize-escrita-arquivo-so-edit-write
description: "01/09 — escrever arquivo do vault via script Python truncou 2 arquivos; usar só Edit/Write, e node quando precisar de script."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-01T03:19:03.533Z
---

Neste vault, **nunca escrever arquivo por script Python** (`python - <<EOF` com `io.open(...,'w')`). Duas vezes em 01/09 o arquivo foi truncado pra 0 byte: o `open('w')` trunca ANTES de falhar, e falha sempre que a string tem emoji escrito como escape `\uXXXX` de surrogate (`🔴`) ou quando o stdout do Windows é cp1252. Perdi edições não commitadas do `checklist-validacao-jucemg.html` e tive que refazer.

**Why:** o vault é cheio de emoji (🔴🟢🆕🗑️) em praticamente todo comentário e nota, então a chance de acertar essa armadilha é alta, não marginal.

**How to apply:** editar com Edit/Write. Quando precisar mesmo de script (splice de linha, regex em massa), usar `node -e` — e ali cuidado com **backtick**, que o bash interpreta como substituição de comando: passar o texto por arquivo (`fs.readFileSync` de um `.txt` no scratchpad) em vez de embutir na string. Se truncar mesmo assim, `git checkout -- <arquivo>` recupera o que estava commitado — o que não estava, se perde.

Relacionado: [[legalize-nao-rodar-e2e-sem-pedir]], [[legalize-mapa-estatico-apresentacao-junto]].
