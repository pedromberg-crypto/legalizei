---
name: legalize-log-ux-flow-e-regra-ui
description: "Log vivo das otimizações de UX do flow (compilado-ux-flow.md) + regra: UI registrada inline por tela, NÃO construída agora. Lapida-se UX/flow primeiro; UI = fase-2."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6d4b1dfa-c914-4006-955f-849ab88053e4
---

Decisão 2026-07-15 (Pedro), duas regras de trabalho pro flow de abertura:

**1. Log-UX vivo** — `execucao/compilado-ux-flow.md` ([[compilado-ux-flow]]) é a fonte única do que otimizar no flow + o que já foi feito. Nasce das sugestões "olhar leigo" das personas do motor (coluna Sugestão dos relatórios). Cada item: 🔴 aberto → ✅ aplicado (com ONDE + data) → status atualizado **no `/fechar`** de cada flow. Toda sugestão nova (rodada futura ou ideia solta) entra aqui.

**2. Regra UI-inline** — a partir de agora, a UI de cada tela/passo é **registrada** (bloco `🎨 UI (a construir)` colado ao passo, na spec), **não construída**. Ordem: lapidar UX/flow/lógica agora (barato, no motor + spec de comportamento); **UI vira fase-2** só depois do flow robusto. **Não mexer em UI ainda.**

**Why:** separa "o que a tela FAZ" (comportamento) de "como ela SE PARECE" (UI), foca energia no que é barato de mudar (flow) e deixa a UI pré-especificada pra quando for construir. UI fica como intenção, não pixel travado; ancorar em [[paleta-cores]]/Sora/Lotties quando registrar.

**How to apply:** ao lapidar qualquer tela, atualizar comportamento na spec + anotar o bloco UI inline + logar a mudança no [[compilado-ux-flow]]. **4 rodadas rodadas (15/07):** #1 compreensão (16) → #2 confiança/reversibilidade (13) → #3 cauda/dia-2 (7, criou a spec [[spec-telas-b3-b4-aterrissagem]]) → #4 recuperação/decisão (7 ✅ +1 motor UX-43, 1 🟡 UX-42=produto). **Acumulado 45 ✅ / 1 🟡.** Método por rodada: curar `sugestoes` dos JSONs → `node run.js` nas 11 → compilado → aplicar na spec. Métrica de **% otimizado por persona** (rubrica ✅=1/🟡=0,4/🔴=0) rastreada em 3 snapshots; tabuleiro convergiu 76-92→88-95%. **Veio das 11 esgotado** — próximo lever = blind spots + Larissa + Mauro (UX-42). Liga em [[legalize-motor-testes-arquitetura]] · [[legalize-spec-telas-entrada-b1-b2]] · [[legalize-prototipo-ux]].
