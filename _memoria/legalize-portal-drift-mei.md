---
name: legalize-portal-drift-mei
description: "Portal (telas internas) TEM flow salvo simétrico ao de entrada, mas portal-data.mjs congelou 28/07 e não conhece a variante MEI que existe no código desde 04/08"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-08-28T02:37:01.748Z
---

O portal (telas internas / dia-2) tem sim fonte-única de flow, **simétrica ao flow de entrada**: `produto/me/viver/portal/portal-data.mjs` + `gerar-mapa-portal.mjs` → `produto/me/viver/portal/mapa-portal-mermaid.md`. 36 nós, nomenclatura P do ADR de 03/08 (P-INI · P-IMP · P-NOT · P-EMI · P-MAIS · P-GER). Diferença de natureza: entrada é linear, portal é **grafo de navegação** (4 abas + CTA central Emitir + drill-downs + sheets). Autoridade da estrutura = `app/src/app/(app)/(portal)/layout.tsx`.

**Mas está defasado (descoberto 27/08):**

1. `portal-data.mjs` teve última mudança de conteúdo em **28/07** — o `flow-data.mjs` de entrada é de 27/08.
2. A **variante Plano MEI existe no código desde 04/08 e NÃO está no mapa**: `layout.tsx` esconde a aba Impostos pro MEI · `inicio/page.tsx` tem `FOCO_MEI` (DAS fixo, sem Fator R) · `mais/page.tsx` troca o PlanoCard · `/mais/colaborador` é tela exclusiva do MEI. `portal-data.mjs` tem **zero** menção a MEI. Rodar `node produto/me/viver/portal/gerar-mapa-portal.mjs` acusa o drift de `/mais/colaborador` sozinho.
3. O portal foi **desenhado pra ME/Simples**: Declarações = PGDAS-D + DEFIS (MEI não tem nenhuma das duas, tem DASN-SIMEI) · Alíquota efetiva + Fator R (não existe pro MEI, DAS é fixo) · Pró-labore (MEI não tem, tem retirada de lucro 8%/32%).

**Why:** qualquer trabalho de tela interna pro MEI parte de um mapa que mente por omissão — vai parecer que não existe nada de MEI construído, quando existe parcialmente, e vai parecer que o portal serve pro MEI, quando conceitualmente não serve.

**How to apply:** antes de mexer em tela interna, rode o gerador pra ver o drift atual, e leia o código (não só o mapa) pra saber o que já existe de MEI. Ao adicionar nó novo, editar `portal-data.mjs` e rodar o gerador — **nunca** editar o `.md` gerado à mão. Ver [[legalize-portal-telas-construidas]] e [[legalize-mapa-flow-vivo]].
