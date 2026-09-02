---
name: legalize-card-radius-padrao
description: raio dos cards = rounded-2xl (16px); NUNCA rounded-xl (24px) — a escala do DS é invertida
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c1f12df9-c52e-4ad8-89b1-9a68f64bfb1e
  modified: 2026-09-02T16:57:03.301Z
---

Cards (conteúdo/boxes) no app usam **`rounded-2xl` = 16px** — o mesmo raio dos cards de NF ([[legalize-telas-padrao-layout]]), que o Pedro travou como padrão (24/07).

**⚠️ Pegadinha:** o DS remapeia a escala de raio no `globals.css` (`@theme`), e ela ficou **invertida** vs. o Tailwind:
- `--radius-sm: 8px` · `--radius-md: 12px` · `--radius-lg: 16px` · `--radius-xl: **24px**`
- `--radius-2xl` NÃO é redefinido → cai no default do Tailwind = **16px**.
- Logo **`rounded-xl` (24px) > `rounded-2xl` (16px)**. Usar `rounded-xl` num card deixa ele **redondo demais**.

**Regra:** card interno = `rounded-2xl` (ou `rounded-lg`, também 16px). **Não** `rounded-xl`.

**🔴 Correção 02/09 — CAMPO DE FORMULÁRIO É `rounded-md` (12px), não `rounded-xl`.** Esta nota dizia "inputs seguem `rounded-xl`" e me levou a criar o textarea da C0 com 24px; o Pedro pegou na hora ("parece mais redonda que o dropdown acima, n temos um padrão?"). O padrão real está em `components/ui/form.tsx` e é unânime: `Texto`, `Select` (gatilho e lista), `Checkbox` e o botão de opção usam **todos** `rounded-md`. Antes de escolher raio de campo, olhar o `form.tsx` — ele é a régua, não esta memória.

**Ícones-container** (quadradinho do ícone) seguem `rounded-xl` — esses sim.

**Why:** o Pedro pegou os cards internos da vigília fiscal / perfil mais arredondados que os de NF e mandou padronizar. **How to apply:** ao criar/editar box de conteúdo, usar `rounded-2xl`; se achar `rounded-xl` num card de conteúdo, trocar. Já corrigido em `vigilancia-blocks`, `perfil`, `emitir` (aviso CNPJ baixado).
