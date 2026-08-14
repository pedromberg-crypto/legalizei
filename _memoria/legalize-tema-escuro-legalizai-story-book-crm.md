---
name: legalize-tema-escuro-legalizai-story-book-crm
description: "Tema escuro é código real no CRM_app (tema fixo, sem toggle); legalizai-story-book/globals.css virou fonte canônica de claro+escuro; CRM/tokens.css é espelho"
metadata: 
  node_type: memory
  type: project
  originSessionId: 08f36f5b-e369-47bd-8358-547022ddfc18
  modified: 2026-08-03T12:02:43.399Z
---

31/07: Pedro perguntou se o tema escuro proposto na `design-system.html` já estava aprovado. Resposta, confirmada com código real: **sim — no CRM_app**, não no app `legalizai-story-book`.

`CRM_app/index.html` trava `<html data-theme="dark">`, sem toggle nenhum — dark é o tema fixo do sistema interno, não uma opção. Os valores hex batem exatamente com a proposta antiga da `design-system.html §escuro`.

**Decisão travada:** conectar os 2 produtos pelo TOKEN, não pelo componente — eles têm componentes próprios de verdade (CRM = desktop denso/sidebar/KPI/tabela; legalizai-story-book = mobile wizard/portal), só a paleta é espelho.

- `legalizai-story-book/app/src/app/globals.css` ganhou `:root[data-theme="dark"]` — **fonte canônica de claro E escuro** agora.
- `CRM_app/src/tokens.css` — comentário reescrito: **deixou de ser cópia independente**, é espelho declarado (sincroniza à mão; build-time import fica pra se isso virar dor de verdade).
- `design-system.html §escuro` — badge trocado de "PROPOSTA" pra "CÓDIGO REAL — no CRM".

⚠️ **O app `legalizai-story-book` continua 100% light-only na prática** — nada seta `data-theme` nele. O bloco dark é token disponível, não modo ligado. Não confundir "token existe" com "app tem dark mode".

**Why:** cópia independente de token é o mesmo problema de cópia de componente já corrigido 3x nesta sessão — diverge em silêncio.

**How to apply:** se um valor de cor mudar, muda em `legalizai-story-book/globals.css` primeiro, depois sincroniza manualmente em `CRM_app/tokens.css`. Ver [[legalize-storybook-fonte-verdade]] · [[legalize-design-system-html]].
