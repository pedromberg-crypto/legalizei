---
name: legalize-worktree-reorg-branches
description: "layout dos worktrees do repo legalizai-story-book — branches viram irmãs do vault em _branches-legalizai-story-book/, nunca aninhadas (.obsidian é trackeado)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: b8216530-8fb5-43da-a7bf-40e46a9a0119
  modified: 2026-07-23T11:53:28.675Z
---

O repo `legalizai-story-book.git` tem 3 worktrees + 2 repos separados na pasta `pessoal/`. Reorg decidida 23/07 pra organizar.

**Regra dura — `.obsidian` é TRACKEADO no git** → cada worktree carrega cópia completa do vault. Se aninhar um worktree de branch DENTRO da pasta do vault (main = `legalize`), o Obsidian indexa pra baixo e **duplica todas as notas** (`[[links]]` quebram). Então branches têm que ser **irmãs** do vault, nunca filhas.

**Layout-alvo:**
```
pessoal/
├── legalize/                 [main = VAULT, Obsidian abre aqui] ← intocado
├── _branches-legalizai-story-book/      ← pasta dedicada (‗ ordena primeiro)
│      ├── debate/            [worktree debate/exploracao] ✓ movido 23/07
│      └── dash-adm/          [worktree dash-adm] ← FALTA mover
├── legalizai-story-book-app/            [repo SEPARADO do app UI]
└── base-flow-legalizai-story-book/      [repo SEPARADO handoff dev]
```

**Constraints de execução:**
- Mover worktree = `git worktree move` (conserta ponteiro de path absoluto do `.git`; move manual no explorer quebra). Reversível.
- `git worktree move` **recusa mover o worktree main** — por isso o main fica onde está.
- **Não dá pra mover o worktree que é o cwd da sessão ativa** (Windows lock → "Permission denied"). O `dash-adm` ficou pendente por isso; `.bat` em `pessoal/mover-dash-adm.bat` roda com a janela fechada.

Ligado a [[legalize-dashboard-adm-priorizacao]] (as notas do dashboard vivem na branch `dash-adm`, só entram no vault main após merge).
