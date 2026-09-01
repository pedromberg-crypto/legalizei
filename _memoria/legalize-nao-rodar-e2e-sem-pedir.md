---
name: legalize-nao-rodar-e2e-sem-pedir
description: Playwright só roda quando o Pedro pedir — regra travada 30/08 e reforçada 01/09 no CLAUDE.md do projeto.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-01T13:32:15.758Z
---

**Nunca rodar Playwright/E2E por iniciativa própria.** Nem "pra conferir", nem ao fim de uma leva de alterações, nem porque a mudança parece arriscada. O padrão de verificação é `tsc` + `eslint`. Se parecer que vale rodar, **perguntar** — não rodar.

Um "pode rodar" vale **só pra aquela rodada**; não vira permissão permanente. Foi exatamente o erro de 01/09: o Pedro autorizou uma passada de Playwright e eu continuei rodando a suíte inteira em todas as levas seguintes, até ele repetir a regra.

**Why:** a suíte sobe `next dev`, leva minutos e devolve ruído (flake de compilação sob carga) no meio de uma conversa de produto. Quem decide quando gastar esse tempo é ele.

**How to apply:** verificação padrão = `npx tsc --noEmit` + `npx eslint`. Pra conferir comportamento de UI sem rodar a suíte, um spec temporário pontual também é E2E — vale a mesma regra. Regra escrita em `CLAUDE.md` do projeto (§Regras de trabalho), junto do escopo ME.

Relacionado: [[legalize-escopo-so-me-abrir]], [[legalize-pedro-confere-ui-sozinho]].
