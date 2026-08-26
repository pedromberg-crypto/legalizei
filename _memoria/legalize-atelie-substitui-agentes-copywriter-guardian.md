---
name: legalize-atelie-substitui-agentes-copywriter-guardian
description: 25/08 — pipeline de copy orgânica trocou de agentes Claude Code (legalizai-copywriter/guardian) para engine atelie/ dentro do próprio vault Legalizai
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-08-26T01:25:12.115Z
---

Em 2026-08-25, os subagentes `.claude/agents/legalizai-copywriter.md` e `legalizai-guardian.md` foram arquivados (`git mv` para `_arquivo/agentes-antigos-marketing/`, ADR novo em `marca/decisoes-marca.md` dizendo explicitamente não usar/recriar). Substituídos por engine novo em `atelie/` (dentro de `pessoal/legalize/`, não confundir com o produto Ateliê em `Projetos/atelie/`).

**Why:** os agentes tinham path morto (frontmatter apontava `pesquisa/posicionamento.md` etc., arquivos reais viviam em `mkt/estrategia/` desde reorg anterior). Em vez de só corrigir o path, Pedro trocou de abordagem no mesmo dia pro engine `atelie/`, que lê os arquivos-fonte originais direto (`../marca/`, `../mkt/estrategia/`, `../pesquisa/`) via regra no `atelie/CLAUDE.md`, não cópia congelada.

**Estrutura do `atelie/`:** `CLAUDE.md` (ritual/ordem de leitura pra pedido de post/copy) · `dados/legalizai/tipos.md` (schema Peça, campos novos persona-alvo + dial-ironia que Ateliê/Presente Sonoro não tinham) · `dados/legalizai/primeira-campanha/` (12 peças da campanha migradas pra JSON, texto literal) · `ds/legalizai/*.json` (voz/regras/ctas/personas/tokens/templates extraídos e estruturados, com QA determinístico por regex tipo `lib/qa.ts`) · `demo/index.html` (demo local sem servidor).

**How to apply:** se pedido for de post/copy orgânica, o fluxo agora é o engine `atelie/`, não mais os 2 subagentes (que não existem mais como agent type — ver system reminder "no longer available"). Templates de imagem em `ds/legalizai/templates-imagem.json` têm aviso de baixa compatibilidade (portados do PS que usa foto real; Legalizai usa Léo ilustrado/device 3D). Nada disso commitado ainda em 25/08 — confirmar com Pedro antes de commit/push. Ver [[legalize-primeira-campanha-fechada]].
