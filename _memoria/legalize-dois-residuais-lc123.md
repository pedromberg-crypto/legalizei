---
name: legalize-dois-residuais-lc123
description: "24/09 travado — a LC 123 tem DOIS residuais que se completam, entao \"nao achei inciso\" e resposta, nao duvida; `requer-revisao` morreu e o motor foi de 80/87 para 87/87."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-24T19:48:10.765Z
---

A LC 123, art. 18, tem **dois residuais e entre eles nao sobra buraco**:

- **§5º-F** — "demais servicos sem previsao expressa" → **Anexo III fixo**
- **§5º-I XII** — "outras atividades de natureza **intelectual**, tecnica, cientifica, artistica ou cultural, desde que nao sujeitas ao III ou IV" → **Fator R**

🔑 Entao **nao achar inciso nominado E a resposta**, nao a falta dela. Sobra uma pergunta so: *a atividade e intelectual?*

O classificador de 27/08 mandava "ambiguo → marcar `requer-revisao`, nao chutar" — prudente, e **errado na premissa**. `requer-revisao` virou estado terminal e o `apurador.anexoDoCnae()` recusava calcular o DAS de **7 dos 87** CNAEs que atendemos.

**Quem pegou foi o Pedro**, perguntando: *"como a gente consegue ter duvida sobre um CNAE de design? E o mais padrao e simples de todos."* Estava certo — o **§5º-I VI nomeia "design, desenho" em letra**, e `7410-2/99` (design de UI/UX, ancora de busca) estava indefinido.

**Os 7 fechados em 24/09:** `7410-2/99` §5º-I VI · `7490-1/99` §5º-I XII · `5911-1/02` §5º-B XV · `8592-9/99` §5º-B I · `7729-2/99` · `8211-3/00` · `8219-9/99` §5º-F. **Motor: 80/87 → 87/87.**

**Why:** a categoria `requer-revisao` nao descrevia a lei, descrevia o quanto do nosso dever de casa tinha ficado pronto — e cobrava o preco em cliente sem resposta de quanto vai pagar.

**How to apply:** ao classificar anexo, rodar a cascata §5º-C → §5º-B → §5º-D → §5º-I I-XI → §5º-I XII → §5º-F. O fim da cascata e sempre um dos dois residuais; `requer-revisao` nao e resultado valido. Script: `pesquisa/cnae-matriz/reclassificar-anexo.mjs`. Ver [[legalize-coerencia-de-classe-cnae]] e [[legalize-anexos-simples-etiquetas]].
