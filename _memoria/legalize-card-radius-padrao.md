---
name: legalize-card-radius-padrao
description: raio dos cards = rounded-2xl (16px); NUNCA rounded-xl (24px) — a escala do DS é invertida
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c1f12df9-c52e-4ad8-89b1-9a68f64bfb1e
  modified: 2026-07-27T13:35:11.479Z
---

Cards (conteúdo/boxes) no app usam **`rounded-2xl` = 16px** — o mesmo raio dos cards de NF ([[legalize-telas-padrao-layout]]), que o Pedro travou como padrão (24/07).

**⚠️ Pegadinha:** o DS remapeia a escala de raio no `globals.css` (`@theme`), e ela ficou **invertida** vs. o Tailwind:
- `--radius-sm: 8px` · `--radius-md: 12px` · `--radius-lg: 16px` · `--radius-xl: **24px**`
- `--radius-2xl` NÃO é redefinido → cai no default do Tailwind = **16px**.
- Logo **`rounded-xl` (24px) > `rounded-2xl` (16px)**. Usar `rounded-xl` num card deixa ele **redondo demais**.

**Regra:** card interno = `rounded-2xl` (ou `rounded-lg`, também 16px). **Não** `rounded-xl`.
**Exceção:** inputs, ícones-container (quadradinho do ícone) e controles seguem `rounded-xl` — são outra coisa, não cards.

**Why:** o Pedro pegou os cards internos da vigília fiscal / perfil mais arredondados que os de NF e mandou padronizar. **How to apply:** ao criar/editar box de conteúdo, usar `rounded-2xl`; se achar `rounded-xl` num card de conteúdo, trocar. Já corrigido em `vigilancia-blocks`, `perfil`, `emitir` (aviso CNPJ baixado).
