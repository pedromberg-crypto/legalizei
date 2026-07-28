---
name: legalize-design-system-html
description: "Design system em HTML autocontido (marca/identidade-visual/design-system.html) — referência viva pra Mauro/dev, sem instalar nada. Espelha globals.css + componentes reais do app. Tem tema escuro (toggle, contraste WCAG VERIFICADO por número, não estimado) e aba de gradiente (4 famílias extraídas do código real, não inventadas). Pedro aprovou o dark como \"com segurança\" só depois do teste de contraste pegar 1 bug real (botão pequeno furava AA)."
metadata: 
  node_type: memory
  type: reference
  modified: 2026-07-28T19:05:41.097Z
  originSessionId: 879b8d71-f7ed-423d-b2cc-81cea99f165f
---

**Onde:** `marca/identidade-visual/design-system.html` — um arquivo só, abre no navegador, zero dependência. Espelha `app/src/app/globals.css` (tokens) + `app/src/components/ui/*` (primitivos: Button, Card, form, StatusIcon, esqueleto de tela). Nada é inventado — cada token/componente foi lido do código real antes de entrar na página.

**Tema escuro (28/07):** remapeia só a camada 2 (`--color-*`), zero primitivo/componente tocado — prova viva da arquitetura de 2 camadas do DS. Contraste **medido, não estimado**: texto primário 13,4:1 · secundário 7,7:1 · terciário 4,8:1 · os 4 estados 7,3–9,1:1 · botão grande 3,15:1 (AA-grande) · botão pequeno 5,64:1. O teste pegou um bug real (o fill do botão pequeno furava AA no dark) — corrigido antes de o Pedro aprovar. Separação de card no dark vem da **borda** (hairline forte), não de sombra — é como data-UI escura densa separa elementos.

**Aba de gradiente:** 4 famílias já usadas no código (card "Aprenda com a gente", hero do blog, moldura do certificado, glow do login) — não é decoração nova. Regra: gradiente é acento sobre escuro, nunca UI nem fill de botão.

**Uso pretendido:** referência contínua pra qualquer desenvolvimento visual — Pedro pode abrir e mostrar direto, sem Claude Code, sem instalar Node.
