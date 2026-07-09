---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 4.8
tags: [concorrente, ux]
---

# Tela: Rotinas Mensais — Contabilizei

## Notas (0–10)
| Eixo | Nota | Justificativa (1 linha) |
|---|---|---|
| Clareza | 5 | Título claro, mas "Sem informações" não diz se está tudo em dia, se nada é devido ou se algo falhou. |
| Eficiência | 6 | Poucos controles (competência ‹ › + selects), fácil trocar mês — porém nada acionável na tela. |
| Feedback | 4 | Empty state "Sem informações" é frio e sem próximo passo; não tranquiliza nem orienta. |
| Linguagem | 4 | Contabilês puro em caixa-alta: "DECLARAÇÕES MENSAIS TRANSMITIDAS", "COMPETÊNCIA". |
| Confiança | 5 | Imenso vazio branco abaixo do card parece tela quebrada/inacabada; sub-nav caixa-alta é datado. |
| Mobile | 5 | Card empilha e selects legíveis, mas a sub-nav superior transborda ("DECLARAÇÃO MENSAL DECLA...") sem scroll óbvio. |
| **Média** | **4.8** | |

## O que vi (fatos)
- Sub-nav escura em caixa-alta: **VOLTAR · DECLARAÇÃO MENSAL · DECLARAÇÃO ANUAL · INFORME DE RENDIMENTOS**.
- Card com ícone de "joinha" (👍): **"DECLARAÇÕES MENSAIS TRANSMITIDAS"**.
- Seletor **COMPETÊNCIA**: setas ‹ › + dropdown "Julho" + dropdown "2026".
- Corpo: apenas o texto **"Sem informações"**.
- Restante da página é um grande espaço branco vazio + botão flutuante "Fale conosco".
- Mobile: mesmo card; a fita de abas superior corta o texto no lado direito ("...DECLA").

## 👍 Forças (o que copiar)
- Navegação por **competência (mês/ano) com setas** é rápida e reconhecível.
- Agrupar Mensal / Anual / Informe de rendimentos numa mesma sub-nav dá senso de "central de declarações".
- O ícone de joinha tenta comunicar "obrigação cumprida" (intenção certa, execução fraca).

## 👎 Fraquezas (nossa oportunidade)
- **"Sem informações" é o pior tipo de empty state**: ambíguo. O ME de serviço não sabe se relaxa ("nada a declarar este mês") ou se preocupa ("faltou transmitir?").
- **Vazio visual enorme** passa sensação de app quebrado — desperdício de espaço que poderia mostrar histórico/status.
- **Linguagem cartorial em caixa-alta**, distante do dono de negócio.
- **Mobile: abas transbordam** e escondem "Declaração Anual/Informe" sem affordance de scroll.

## 🎯 Contraproposta Legalizei
- **Trocar "Sem informações" por status humano e tranquilizador**: "✅ Este mês não há declaração mensal a transmitir — está tudo em dia." ou, se houver pendência, "⚠️ Falta transmitir X, prazo dia Y" com botão. Transparência = dizer o estado, não sumir.
- **Preencher o vazio com uma timeline de obrigações do mês** (o que já foi feito pela Legalizei por você, com data e recibo) — proatividade visível: "nós cuidamos disto".
- **Linguagem de gente**, sem caixa-alta cartorial: "Suas declarações do mês".
- **Mobile: abas em scroll horizontal com indicador** ou menu, nunca cortadas. Nota deles é 4.8 — é a tela mais fácil de superar; alvo ~8.0 só com empty state útil + timeline proativa.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
