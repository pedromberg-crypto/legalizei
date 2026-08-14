---
tipo: marco
status: vivo
data: 2026-07-31
assunto: storybook · reorganizacao · tema-escuro · codigo-morto
tags: [storybook, design-system, reorganizacao, tema-escuro, crm]
---

# 🏁 21º flow — Storybook fecha Design/Componentes + tema escuro conectado

## 1. Storybook — vitrine viva do design system

Reorganização (pausada desde o 20º flow) **voltou a andar**: a `design-system.html` tinha virado risco de divergência (2 abas "Componentes"/"Sistema" hand-coded). Decisão: `@storybook/nextjs-vite`, mesmo repo `legalizai-story-book`, zero cópia de componente.

**33+ arquivos de story**, cobrindo:
- Todo o DS promovido (`Button`, `Card`, `StatusIcon`, `Aviso`, `Form/*`, `Esqueleto de tela`)
- Os 4 componentes reais achados em produção (`Vigilancia`, `QuemCuida`, `AprendaGradiente`, `SecaoLista`)
- **Todas as telas do produto**: entrada (N3) · gate (N4) · veredito · painel (N21) · saída (A9) · dinheiro B3 (N6-N9) · dossiê B4 completo (N10-N16) · cauda N19-N22+P0 · migrar M1-M6 inteiro · splash (N1) · welcome (N2)

**Splash e Welcome foram extraídos hoje** — únicos 2 que ainda viviam soltos no `page.tsx` (todo o resto já seguia fidelidade-por-construção desde 29/07).

## 2. 🐛 3 bugs achados na extração/auditoria

1. CTA "Começar" do último slide do Welcome **não navegava** (mesma classe de CTA morto já corrigida 3x nesta sessão) — corrigido com `onSeguir` opcional.
2. `SecaoLista` (usada de verdade em `/mais`) tinha ficado fora do Storybook — auditoria anterior classificou como "só exploração" por engano.
3. `SaidaView` tinha uma 3ª variação real não coberta: lista de espera "fora de BH" (autocomplete de município).

## 3. 🧹 Código morto removido de vez

`/encaixe` (rota + `EncaixeView` + etapa do `/gate`) — redundante desde que o veredito 🟢 ganhou cards clicáveis (UX-65). `/certificado` e `/ativa` (N24) — órfãos confirmados rastreando `router.push`/`href` no código real, desde o swap do P0 (29/07). `flow-data.mjs`/`portal-data.mjs` regenerados (v9→v12, v1→v3).

## 4. 📊 Auditoria do acervo `/componentes`

Dos 32 itens "validados", **só 4 são produção real**: `SecaoLista`, `Vigilancia`, `QuemCuida`, `AprendaGradiente`. Os outros 28 são exploração pura (rodadas home-a...f, inicio-ref5...12) e **2 são órfãos totais** (`NudgeCertificado`, `ProfileHeader`, zero uso em qualquer lugar, nem na exploração de origem).

⚠️ **Achado colateral, fora do acervo:** `/inicio` (a home REAL de produção) **não usa nenhum bloco do "Home Campeã"** — a decisão de qual home vencia já foi tomada e documentada (`portal-data.mjs`), mas o arquivo de produção nunca foi atualizado pra refletir ela.

## 5. 🌗 Tema escuro conectado — legalizai-story-book ↔ CRM_app

Pergunta do Pedro: "o dark que a gente usou pro CRM já não está aprovado?" — confirmado com código real: **sim, o CRM roda 100% dark** (`index.html` trava `data-theme="dark"`, sem toggle, é o tema fixo do sistema interno). Os valores batem exatamente com a proposta antiga da `design-system.html`.

**Decisão: conectar pelo TOKEN, não pelo componente** (os 2 produtos têm componentes próprios — CRM é desktop denso, legalizai-story-book é mobile wizard/portal; só a paleta é espelho de verdade):
- `legalizai-story-book/app/src/app/globals.css` ganha `:root[data-theme="dark"]` — vira **fonte canônica de claro e escuro**.
- `CRM_app/src/tokens.css` — comentário reescrito: deixa de ser cópia independente, vira **espelho declarado** (sincroniza à mão, sem build-time import ainda).
- `design-system.html` §escuro: badge "PROPOSTA" → "CÓDIGO REAL — no CRM".
- ⚠️ O app `legalizai-story-book` **continua light-only na prática** — nada seta `data-theme` nele. É token disponível, não modo ligado.

## 6. Pushes

- `legalizai-story-book` (`main`): 4 commits — Storybook completo · 2 gaps do acervo/apresentação · tema escuro.
- `CRM_app` (`feat/ui-tema-escuro-e-dossie-cliente`): 1 commit — `tokens.css` vira espelho declarado.

## 7. ⚠️ Pergunta grande do Pedro — NÃO resolvida

Ele disse: quer Design/Telas/Flow **"separados individualmente por essas categorias"**, e que este vault (`legalize`) **"tem muito mais coisa que isso"** (BASE-ESTRATEGICA, pesquisa, marca/conceito, execução de negócio — tudo o que não é design/telas/flow).

Tentei uma pergunta de esclarecimento (3 leituras possíveis: repo próprio fora do vault · pasta isolada dentro do vault · já são as pastas certas, falta só arrumar dentro) — **ele dispensou sem responder**: *"fico esperando você explicar do seu jeito"*.

**Fica em aberto.** Próxima janela: não presumir qual das 3 leituras é — perguntar nomeado de novo ou esperar ele trazer.

## Links
[[HOME]] · [[HOME-reorganizacao]] · [[decisoes-marca]]
