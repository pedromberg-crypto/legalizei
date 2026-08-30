---
name: legalize-nao-rodar-e2e-sem-pedir
description: Não rodar a suíte Playwright e2e automaticamente após cada ajuste pequeno; só tsc+eslint por padrão.
metadata: 
  node_type: memory
  type: feedback
  status: active
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-08-30T20:59:52.696Z
---

Não rodar `npm run test:e2e` (suíte Playwright completa) como parte automática do "loop de verificação" depois de todo edit pequeno (copy, cor, layout). 30/08: Pedro interrompeu explicitamente — "N sei pq rodou um e2e se n pedi!".

**Why:** e2e demora (~15s) e reinicia/mexe no dev server; rodar depois de cada micro-ajuste de UI (mudar um texto, trocar cor) é ruído, não verificação útil — o teste não cobre a tela sendo mexida na maioria dos casos.

**How to apply:** Verificação padrão por edit = `npx tsc --noEmit` + `npx eslint <arquivo>` (rápidos, sempre ok rodar sem pedir). `npm run test:e2e` SÓ quando o Pedro pedir explicitamente — sem exceção. 30/08, correção reforçada: nem mudança estrutural de fluxo (rota removida/adicionada, edge do mapa, navegação entre telas) justifica rodar sozinho. "trave isso ai" — regra dura, não julgamento caso a caso.
