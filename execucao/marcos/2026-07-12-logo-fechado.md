---
tipo: marco
data: 2026-07-12
tags: [marco, marca, design, simbolo, logo]
validado_por: [Pedro]
---

# 🧱 Marco — logo do Legalizei fechado

> Símbolo + logotipo travados por Pedro (designer/sócio) em 2026-07-12, após iteração guiada por régua de proporção. Fecha a frente que estava 🟡 desde 2026-07-10. Master vetorial no vault: [[legalizei-logo-horizontal.svg]] (check branco) + variante negativa [[legalizei-logo-horizontal-check-negativo.svg]].

## O que ficou

**Símbolo:** quadrado coral (`#F2643C`, raio ~0,27× lado) com **check vazado** — recorte negativo que **sangra pelo canto superior-direito** (a conquista "não cabe na caixa"). Terminais arredondados. Fundo do check preenchido em **branco sólido** (`#FFF`) pra robustez sobre foto/fundo escuro; a versão transparente (check herda o fundo) fica derivável do mesmo arquivo apagando o path branco.

**Logotipo:** wordmark "Legalizei" em **Sora** estilizada (terminais suaves do "z", i-stems consistentes), ink `#1B1E24`. **Três pontos de coral** intencionais — ícone + pingo dos dois "i" (ritmo coral ícone → i → i). Pingos como círculos r13,24 (~1,77× a haste do i).

## Specs travadas (verificadas no SVG)
- **Proporção ícone = 1,4× H** (H = altura da capitular "L"). Ícone ≈ 211px / cap ≈ 151px.
- **Alinhamento vertical:** centro do ícone = centro da faixa capitular (105,5 = 105,5, exato). Sobra simétrica ~⅕ H acima do L e abaixo da baseline.
- **Espaçamento ícone→wordmark = 1× largura da haste do L** (33,85px) — espaço por módulo, não chute.
- **Cores on-token:** ink `#1B1E24`, coral `#F2643C`, check `#FFF`. Zero cor solta.
- **Check branco alinhado ao recorte coral com precisão sub-pixel** (~0,03px de folga). Empilhamento correto (branco por cima).

## Origem da direção
Não é o "L vira check" (descartado, virava ponteiro de relógio) nem o "pingo-i = check" isolado. É a fusão das duas variações mais fortes da prancha de exploração: **recorte negativo (D) + sangrado (A)** dentro de um selo quadrado (linha C1 refinada). Wordmark preserva o "-i" coral como assinatura do naming (Legalize**i** = "eu fiz/consegui").

## Pendências (não bloqueiam o fecho)
- **Teste de fogo:** rodar em 16/24px (favicon) e sobre foto pra confirmar leitura em tamanho pequeno.
- **Limpeza de export:** id `Camada_1` (default Illustrator) → semântico; adicionar `<title>`/`<desc>` no master.
- **Derivados:** favicon, ícone de app (coral/branco + papel/coral), versões mono e sobre-ink.
- **Tipografia do sistema** (além do wordmark) + Design System (tokens finais + componentes).

## Links
- [[decisoes-marca]] · [[simbolo-exploracao]] · [[paleta-cores]] · [[conceito-marca]] · [[evolucao-para-mauro]] · [[HOME]]
