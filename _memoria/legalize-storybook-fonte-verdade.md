---
name: legalize-storybook-fonte-verdade
description: "Storybook (@storybook/nextjs-vite) é a vitrine renderizada de componentes E telas do legalizai-story-book — 33+ stories, zero cópia"
metadata: 
  node_type: memory
  type: project
  originSessionId: 08f36f5b-e369-47bd-8358-547022ddfc18
  modified: 2026-08-03T12:02:29.954Z
---

31/07: reorganização (categoria Design/Componentes) fechou com **Storybook**. Instalado no mesmo repo `legalizai-story-book` (`app/`, `@storybook/nextjs-vite`), zero componente duplicado — RSC quase não se aplica (29/37 arquivos de `components/` já são `"use client"`).

**33+ arquivos `.stories.tsx`**, organizados em 3 namespaces:
- `DS/*` — os primitivos promovidos (Button, Card, StatusIcon, Aviso, Form/*, Esqueleto de tela, Logo)
- `Produção/*` — componentes soltos confirmados em uso real (Vigilancia, QuemCuida, AprendaGradiente, SecaoLista, LinhaNota)
- `Telas/*` — **todas** as telas do produto: entrada (N3), gate (N4), veredito, painel (N21), saída (A9), dinheiro B3 (N6-N9), dossiê B4 (N10-N16), cauda N19-N22+P0, migrar M1-M6, splash (N1), welcome (N2)

**Comando:** `npm run storybook` (porta 6006) dentro de `app/`. Build estático: `npm run build-storybook` → `storybook-static/` (gitignorado).

Substituiu 2 coisas: (1) as 7 seções hand-coded de componentes da `design-system.html` (viraram "· histórico" + banner apontando pro Storybook); (2) parcialmente o acervo `/componentes` (achado: dos 32 itens "validados" lá, só 4 eram produção real — `SecaoLista`/`Vigilancia`/`QuemCuida`/`AprendaGradiente` — o resto é exploração ou órfão total; `/componentes` **não foi apagado**, decisão pendente).

**Deploy no Vercel: pendente**, precisa do login do Pedro (projeto novo e separado do app, mesmo repo, root `app/`, build `npm run build-storybook`, output `storybook-static`).

**Why:** HTML hand-coded arrisca divergir do código real — já achou 2 lacunas concretas (física de spring motion, conflito de raio 16×18) que só existiam no repo do dev, nunca no nosso. Storybook renderiza o componente de verdade.

**How to apply:** qualquer tela/componente novo que entrar em produção ganha story junto (mesma disciplina de sempre — nunca deixar 2ª fonte desatualizada). Ver [[legalize-reorganizacao-flow-design-em-curso]] · [[legalize-vault-organizado]].
