---
name: legalize-portal-interno-lab-acervo
description: Portal interno (dia-2) construído + laboratório de layout (/mockup-inicio) + acervo de ~29 componentes validados (/componentes). Próximo = montar a home final mesclando os campeões.
metadata: 
  node_type: memory
  type: project
  originSessionId: 264d5a1b-ca99-4d1b-969d-e6c48eeaef92
  modified: 2026-07-22T19:55:26.234Z
---

**O portal PÓS-ABERTURA (o "dia-2") foi construído como mockup** no app (`app/`, Next 16), commit `37eb994` no `main`. Estado em 2026-07-22.

**Matriz-fonte:** `execucao/matriz-portal-interno.md` — telas P0–P14 só do **grátis-R$195** (cruzamento com o dossiê da Contabilizei), ciclo mensal como espinha, espinha de dados N→P (o flow de abertura semeia o portal), e **P0 Certificado = gate universal** (destrava emitir nota/DAS/e-CAC; exige validação de identidade por vídeo; dep. de provider).

**Portal construído** em `app/src/app/(app)/(portal)/`:
- **Shell** (`layout.tsx`): navbar FLUTUANTE com **CTA central "Emitir NF-e"**, 4 abas (Início·Impostos·Notas·Mais), **preservação de versão por sessionStorage** (voltar pra aba retorna à mesma versão), seta "voltar" no detalhe. É um route group próprio dentro do `(app)` pra a nav NÃO vazar na cauda linear da abertura (painel/termo/ativa).
- **Telas:** `certificado` (P0 gate) · `inicio` (home P1) · `impostos` (+`impostos/pagar`) · stubs `notas`/`pro-labore`/`mais` · **`obrigacoes`** (calendário de obrigações: day-strip + timeline). ⚠️ `obrigacoes` abre sem aba ativa (decisão de IA pendente).

**LABORATÓRIO de layout** `/mockup-inicio` (`app/src/app/mockup-inicio/`): board que **empilha ~12 explorações de home** a partir de referências que o Pedro mandou (nexobank · fintech-dark · reservas/ticket · saúde · wellness · SaaS · analytics-gauge · AI-notes · health-warm…). Cada ref virou uma home DIFERENTE (não replicar o padrão, adaptar os componentes distintos). Renderiza em phone-frames via `components/lab/versao-board.tsx` (`Versao.feito` = **✓ verde** = já lapidada). As não-escolhidas foram DESCARTADAS.

**ACERVO** `/componentes` (`app/src/app/(app)/(portal)/componentes/`): **~29 componentes VALIDADOS** pelo Pedro, extraídos pra `components/lab/*-blocks.tsx` (**fonte única reutilizável**) e agrupados por origem. Páginas garimpadas: Mais·v1 · ref5 · ref6 · ref7 · ref9 · ref11 · ref12 · mais·completa · impostos·v1 · impostos·v2. Destaques: DAS-ticket (sem barcode, com Pix) · hero-dark · swipe-to-pay · pergunte-à-IA · day-strip fiscal · gauge do teto · insight proativo · quem-cuida-de-você. Charts próprios em `components/lab/charts.tsx` (line/bar/donut/gauge).

**➡️ PRÓXIMO PASSO (onde paramos):** **montar a HOME FINAL** = mesclagem inteligente dos componentes campeões do acervo numa peça só, coerente. Pedro ainda não travou os "must-have"; ele vai escolher (ou eu proponho uma composição).

**Regras que valeram:** paleta estrita (coral=marca/ação, verde/âmbar=estado; tints de estado usados como pastéis decorativos = desvio marcado a decidir); tudo mockup sem preço real ([[legalize-preco-deferido-custo-real]]); verificar com `tsc`+eslint, o Pedro confere UI ([[legalize-pedro-confere-ui-sozinho]]). Base do portal = [[legalize-contabilizei-dossie-coverage]] (o subconjunto grátis-R$195). Mapa das telas do FLOW DE ABERTURA (≠ portal) = [[legalize-telas-padrao-layout]].
