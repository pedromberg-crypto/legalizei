---
name: legalize-alfa-premultiplicado-halo-escuro
description: 01/09 — PNG que fica bom no Photoshop e com halo escuro no app tem alfa premultiplicado; medir a cor da borda antes de culpar cache ou posição.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-02T01:09:04.400Z
---

PNG gerado por IA costuma vir com **alfa premultiplicado** (cor já multiplicada pelo alfa, resquício de ter sido renderizado sobre preto ou branco). Navegador compõe alfa **straight** — e a diferença entre os dois modelos vira halo em volta do objeto.

**Diagnóstico em 1 comando:** comparar a cor média dos pixels de borda (`0 < alpha < 235`) com a dos sólidos (`alpha > 250`).
- Folhas voando: borda `(63,66,69)` vs sólido `(224,227,232)` → halo ESCURO sobre coral (fundo era preto).
- Léo do muro: borda `(198,181,178)` vs sólido → halo CLARO, auréola (fundo era branco).

**Correções:**
- Fundo preto (premultiplicado): `cor = rgb / alpha`, com clamp — sem clamp, alfa quase zero explode em ruído colorido.
- Fundo branco: `cor = (rgb − (1−alpha)×255) / alpha`.
- **Melhor que as duas:** se o objeto vive sobre cor chapada, achatar fundo + objeto numa imagem só (foi a saída do Pedro pro hero da E3.3: 1,6 MB → 69 KB, e o problema deixa de poder existir).

⚠️ Antes de culpar cache do Next: `.convert("RGB")` em PIL achata sobre preto e destrói o alfa — eu fiz isso e passei a tratar um problema que não existia. Checar `im.mode` e a contagem de transparentes primeiro.

Relacionado: [[legalize-encaixe-asset-medido-nao-no-olho]]
