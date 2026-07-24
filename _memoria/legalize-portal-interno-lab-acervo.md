---
name: legalize-portal-interno-lab-acervo
description: Portal interno (dia-2) construído + laboratório (/mockup-inicio, PODADO) + acervo de ~29 componentes (/componentes). Parte interna DEFINIDA em spec (cruzamento-portal-interno). Próximo = reconciliar spec × matriz P0–P14 (conflito no certificado), depois telas × acervo = home final.
metadata: 
  node_type: memory
  type: project
  originSessionId: 264d5a1b-ca99-4d1b-969d-e6c48eeaef92
  modified: 2026-07-24T15:15:45.581Z
---

**O portal PÓS-ABERTURA (o "dia-2") foi construído como mockup** no app (`app/`, Next 16), commit `37eb994` no `main`. Estado em 2026-07-22.

**Matriz-fonte:** `execucao/matriz-portal-interno.md` — telas P0–P14 só do **grátis-R$195** (cruzamento com o dossiê da Contabilizei), ciclo mensal como espinha, espinha de dados N→P (o flow de abertura semeia o portal), e **P0 Certificado = gate universal** (destrava emitir nota/DAS/e-CAC; exige validação de identidade por vídeo; dep. de provider).

**Portal construído** em `app/src/app/(app)/(portal)/`:
- **Shell** (`layout.tsx`): navbar FLUTUANTE com **CTA central "Emitir NF-e"**, 4 abas (Início·Impostos·Notas·Mais), **preservação de versão por sessionStorage** (voltar pra aba retorna à mesma versão), seta "voltar" no detalhe. É um route group próprio dentro do `(app)` pra a nav NÃO vazar na cauda linear da abertura (painel/termo/ativa).
- **Telas:** `certificado` (P0 gate) · `inicio` (home P1) · `impostos` (+`impostos/pagar`) · stubs `notas`/`pro-labore`/`mais` · **`obrigacoes`** (calendário de obrigações: day-strip + timeline). ⚠️ `obrigacoes` abre sem aba ativa (decisão de IA pendente).

**LABORATÓRIO de layout** `/mockup-inicio` (`app/src/app/mockup-inicio/`): board que **empilha ~12 explorações de home** a partir de referências que o Pedro mandou (nexobank · fintech-dark · reservas/ticket · saúde · wellness · SaaS · analytics-gauge · AI-notes · health-warm…). Cada ref virou uma home DIFERENTE (não replicar o padrão, adaptar os componentes distintos). Renderiza em phone-frames via `components/lab/versao-board.tsx` (`Versao.feito` = **✓ verde** = já lapidada). As não-escolhidas foram DESCARTADAS.

**ACERVO** `/componentes` (`app/src/app/(app)/(portal)/componentes/`): **~29 componentes VALIDADOS** pelo Pedro, extraídos pra `components/lab/*-blocks.tsx` (**fonte única reutilizável**) e agrupados por origem. Páginas garimpadas: Mais·v1 · ref5 · ref6 · ref7 · ref9 · ref11 · ref12 · mais·completa · impostos·v1 · impostos·v2. Destaques: DAS-ticket (sem barcode, com Pix) · hero-dark · swipe-to-pay · pergunte-à-IA · day-strip fiscal · gauge do teto · insight proativo · quem-cuida-de-você. Charts próprios em `components/lab/charts.tsx` (line/bar/donut/gauge).

**➡️ 13º FLOW (22/07) — a parte interna foi DEFINIDA (não mais só mockup):** [[legalize-portal-monetizacao-baldes]] (os 3 baldes) + spec canônica `execucao/cruzamento-portal-interno.md` (nav 4 abas + CTA · **home em 2 estados dia-1×regime** · abas por dentro · faseamento). Laboratório `/mockup-inicio` **podado** (removidas 5 explorações sem ✓: inicio-v2/v3/v4, mais-v2, impostos-completa; `/obrigacoes` fica; acervo intacto). Auto-auditoria de 10 achados aplicada (gauge→**vigília preditiva**; economia-acumulada travada anti-guru; hierarquia 1-herói).

**➡️ 15º FLOW (23–24/07) — o portal virou app** → [[2026-07-24-portal-home-final-emitir-gestao-apis]]. **HOME FINAL montada** (a ★Campeã, peça a peça com o Pedro) no visualizador novo `/mockup-home` (6 versões A–F + a campeã) · **Perfil** (`/perfil`, currículo da empresa, absorve P12+P13+P14) · **Emitir NF-e** (`/emitir`, autofill por CNPJ, ⏸️ em edição). Navbar flutuante corrigida (o "fundo fixo" era painel morto que EU criei). Híbridos em `campea-blocks.tsx` + `vigilancia-blocks.tsx`. Certificado (parceiro terceirizado) travado; branches `debate`+`dash-adm` mescladas na main + limpas.

**➡️ PRÓXIMO PASSO (onde paramos):** **continuar editando a tela Emitir NF-e** (`/emitir` — paramos no meio). Depois o resto da **Onda 1** ([[backlog-telas-portal]]): Pagar DAS · Pró-labore/N18 · Notas · Impostos · Mais. Ainda pendente: reconciliar spec-portal × matriz P0–P14 (o certificado já foi resolvido) · #2 telas×acervo (a Campeã já é isso) · flow #2 migrar. ⚠️ **Regra nova:** qualquer autofill/consulta → checar `pesquisa/integracoes-apis/` primeiro ([[legalize-apis-orgaos-autoridade]]).

**Regras que valeram:** paleta estrita (coral=marca/ação, verde/âmbar=estado; tints de estado usados como pastéis decorativos = desvio marcado a decidir); tudo mockup sem preço real ([[legalize-preco-deferido-custo-real]]); verificar com `tsc`+eslint, o Pedro confere UI ([[legalize-pedro-confere-ui-sozinho]]). Base do portal = [[legalize-contabilizei-dossie-coverage]] (o subconjunto grátis-R$195). Mapa das telas do FLOW DE ABERTURA (≠ portal) = [[legalize-telas-padrao-layout]].
