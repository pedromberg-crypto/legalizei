---
name: legalize-placar-do-reporte-gerado
description: 15/09 — o reporte ao socio ganhou placar gerado que se confronta com o git; agosto tinha 20 dias de commit e 9 entradas
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-16T01:51:23.884Z
---

`execucao/mauro/gerar-placar-mauro.mjs`, **plugado no `/fechar`** (passo 4). Conta entregas, status e dias trabalhados a partir das próprias tabelas do `evolucao-para-mauro.md` e reescreve o bloco entre `PLACAR:INICIO` e `PLACAR:FIM`, **no topo** do doc.

🔑 **É gerado de propósito.** Placar escrito à mão envelhece no flow seguinte e passa a mentir com cara de resumo — o defeito que o `portal-data.mjs` teve por um mês e meio.

## 🔴 E ele confessou um buraco de 14 dias

Pergunta do Pedro: *"agosto constatou poucos dias trabalhados, e eu trabalhei normalmente"*. Conferi contra o **git**, que é fonte independente:

| | reportados | com commit |
|---|---:|---:|
| agosto/2026 | **9** | **20** |

**O placar estava certo; o reporte é que parou de ser escrito.** 14 dias no total (11 em agosto), incluindo **27/08 com 36 commits** (a matriz dos 1.332 CNAEs) e **14/09 com 37** (o motor fiscal fechando) — os dois maiores dias do projeto, e o sócio nunca soube que existiram.

Reconstituí as 14 entradas a partir dos commits de cada dia, com **selo ↩️** para nunca passarem por relato escrito na época. Autorizado pelo Pedro.

**O gerador agora confronta doc × git** e tem uma seção *"⚠️ O que o sócio não viu"*. ⚠️ O contrário também aparece, **sem alarme**: dia com entrada e sem commit é reunião, pesquisa, decisão — trabalho que não vira código.

## Duas decisões de contagem

- **Intervalos expandem:** `07–10/07` conta **4 dias**, não 1.
- **"Parte 2" não dobra o dia:** 46 entradas davam 44 dias, porque houve dias com dois flows.

## Depois da varredura da fila (15/09)

| | antes | depois |
|---|---:|---:|
| ⏳ aguarda autorização | 2 | **0** |
| 🕓 aguarda pessoa | 11 | **2** |
| 🔴 trava | 13 | **5** |
| ✅ estava parado, foi resolvido | 0 | **15** |

🔑 **A varredura achou perguntas duplicadas** — a certificadora e o SLU×LTDA apareciam em semanas diferentes perguntando a mesma coisa, e ninguém percebia porque estavam distantes no log.

⚠️ **O que ele NÃO faz:** não julga se o item foi entregue nem se o status está certo. Conta o que está escrito. **Protege contra desatualização, não contra otimismo.**

**How to apply:** nunca digitar número no bloco do placar. Depois de escrever o reporte, rodar o gerador — o `/fechar` já manda.

Relacionado: [[legalize-travas-de-metodo-15-09]] · [[legalize-objetivo-e-papel-pedro]].
