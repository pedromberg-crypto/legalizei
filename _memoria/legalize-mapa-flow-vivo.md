---
name: legalize-mapa-flow-vivo
description: mapa-flow-mermaid.md é GERADO — fonte única flow-data.mjs + gerador node; não editar a nota à mão; versiona sozinho
metadata: 
  node_type: memory
  type: project
  originSessionId: 6c899588-095f-4bf2-906d-43b8b76de430
  modified: 2026-07-21T13:08:52.364Z
---

`execucao/mapa-flow-mermaid.md` é uma nota **GERADA, não editar à mão** (edição some na próxima geração).

**Fonte única:** `execucao/flow/flow-data.mjs` (NODES + EDGES + SUBGRAFOS, com status por nó: `construida/planejada`, `validado: oficial/ux/pendente`, `falta`).
**Gerador:** `node execucao/flow/gerar-mapa.mjs` (criado 2026-07-21). Faz 3 coisas:
1. Re-renderiza o diagrama Mermaid **e** a tabela "validação tela por tela" dentro da nota, entre marcadores `<!-- FLOW:MAPA -->`, `<!-- FLOW:TABELA -->`, `<!-- FLOW:VERSOES -->`.
2. **Checa drift** — todo nó com `rota` tem que ter `page.tsx` real em `app/src/app/**`; rota órfã ou nó sem rota vira aviso. `rotasCobre: [...]` = 1 nó cobre N rotas (o N5 teaser cobre swap/fator-r/serviço).
3. **Versiona ("commit interno"):** só bumpa se mudou `id/label/status/validado/falta` ou as conexões. Grava snapshot em `flow/versoes/` (`.json` p/ diff + `.mmd` legível) e prepende linha no histórico da nota com **resumo do diff**. Igual não muda → não versiona.

**Fluxo de uso:** muda `flow-data.mjs` → roda o gerador → mapa + tabela + versão atualizam juntos. **Auto-trigger** (rodar sozinho no commit/fechar) ficou como decisão aberta do Pedro em 2026-07-21 (hook vs passo no `/fechar`).

Relacionado: [[legalize-telas-padrao-layout]] (as 26 telas em código) · [[legalize-vault-organizado]] (verificar.js audita o vault do mesmo jeito).
