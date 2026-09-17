---
name: legalize-reorganizacao-flow-design-em-curso
description: Reorganização de docs de flow/telas/design em curso (30-31/07) — Storybook fechou Design/Componentes; pergunta grande do Pedro sobre separar o vault por categoria ainda em aberto
metadata: 
  node_type: memory
  type: project
  originSessionId: 08f36f5b-e369-47bd-8358-547022ddfc18
  modified: 2026-08-25T17:40:00.272Z
---

**Frente aberta 2026-07-30, retomada 2026-07-31: reorganização das fontes de flow/telas/design system**, motivada por múltiplas representações paralelas do flow e do design system espalhadas por 3 repos: `legalize` (este vault), `legalizeiapp` (produto real, parado em 21/07) e `CRM_app` (painel interno).

**Regra original (30/07):** enquanto o veredito não fecha, só `reorganizacao-flow-design/HOME-reorganizacao.md` é editada — debate lá, execução só depois. **Na prática (31/07), o Pedro foi confirmando execução real item a item** (Storybook, remoção de código morto, tema escuro) — a regra virou "propõe, ele confirma, executa e registra na mesma nota", não mais "só debate". Segue perguntando antes de itens grandes/destrutivos (ex: apagar o acervo `/componentes`, mexer no raio 16×18).

**31/07 — fechou a categoria Design/Componentes:** Storybook (`@storybook/nextjs-vite`) virou a vitrine renderizada de componentes E telas (ver [[legalize-storybook-fonte-verdade]]); tema escuro conectado entre `legalizai-story-book` e `CRM_app` pelo token (ver [[legalize-tema-escuro-legalizai-story-book-crm]]).

**⚠️ 31/07 — PERGUNTA GRANDE DO PEDRO, NÃO RESOLVIDA.** Ele disse querer Design/Telas/Flow **"separados individualmente por essas categorias"**, e que o vault `legalize` **"tem muito mais coisa que isso"** (BASE-ESTRATEGICA, pesquisa, marca/conceito, execução de negócio — tudo que não é design/telas/flow). Isso pode significar: (a) repos/pastas próprias FORA deste vault, (b) pastas isoladas DENTRO do vault mas sem cross-link com estratégia/pesquisa, ou (c) as pastas já são as certas (`marca/`, `app/`, `execucao/flow`+`portal` — superado em 17/09) e só falta arrumar dentro delas. **Tentei perguntar (3 opções) e ele dispensou sem responder** — disse que ia explicar do jeito dele. **Não presumir qual leitura é certa na próxima janela.**

**Escopo do Pedro nesta frente:** flow, telas, design system. **Banco de dados e backend estão fora.**

**Why:** sensação de "entregas desconexas" — múltiplas cópias/versões do mapa de flow e do design system sem link cruzado, apesar de substância parecida.

**How to apply:** primeiro ler `reorganizacao-flow-design/HOME-reorganizacao.md` pra saber o estado atual. Não presumir a resposta da pergunta grande do Pedro — perguntar ou esperar ele trazer. Achado ainda pendente: path `C:\Obsidian Legalizai Story Book` (citado pelo `legalizeiapp/CLAUDE.md`) não existe nesta máquina — fechado como "não é item nosso, vira pergunta ao dev".

**25/08 — Pedro respondeu.** Retomou como PM, pediu reorg do repo inteiro (não só flow/telas/design). Ver [[legalize-reorg-repo-inteiro-25-08]] pro estado vigente.

**✅ 17/09 — A PERGUNTA GRANDE FECHOU, e a resposta foi a (b) com um eixo que ninguém tinha proposto.** Não são repos separados nem as pastas antigas arrumadas por dentro: o vault ganhou `produto/`, dividido por **REGIME** (`me/`, `mei/`) e depois por **CICLO DE VIDA** (`entrar` · `viver` · `desenquadrar`), com o que atravessa os regimes em pasta `_`-prefixada. O flow inteiro saiu de `execucao/flow/` e virou `produto/_flow/` — fora dos ramos porque as 150 arestas cruzam `abrir`, `mei` e `migrar`. Ver [[legalize-arvore-produto-me-mei]].

Ver [[legalize-objetivo-e-papel-pedro]] · [[legalize-storybook-fonte-verdade]] · [[legalize-tema-escuro-legalizai-story-book-crm]].
