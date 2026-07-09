---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 5.2
tags: [concorrente, ux]
---

# Tela: Emitir Nota — passo 1 (seleção de tomador) — Contabilizei

> Primeiro passo do wizard de emissão (`#/emissor/tomadores`): escolher o cliente antes do formulário. Capturado sem emitir.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 6 | Busca simples (nome/CPF/CNPJ) + "Novo Cliente" + "Não informar cliente"; ok, mas o modal de cobrança rouba o foco |
| Eficiência | 6 | 1 passo extra antes do formulário; "Não informar cliente" é atalho bom |
| Feedback | 6 | Estado ok, mas o interstitial de dívida atropela a tarefa |
| Linguagem | 5 | Modal usa medo: "Aqui está o que você perde", "riscos de ficar sem contador", "Multas federais superiores a…" |
| Confiança | 5 | 🔴 **Dark pattern:** bloqueia/pressiona a emissão porque a mensalidade está atrasada — erode confiança no momento de trabalhar |
| Mobile | 4 | Mesmo problema de nav flutuante do resto |
| **Média** | **5.2** | |

## O que vi (fatos)
- Input: "Busque pelo nome, e-mail, CPF ou CNPJ" · botões "Não informar cliente", "Novo Cliente".
- **Modal de cobrança sobreposto** (mensalidade do Pedro está atrasada): "Sua mensalidade está atrasada. Aqui está o que você perde" + lista com ❌ (distribuição de lucro, geração de impostos, emissão de NF, atendimento) + "Conheça os riscos de ficar sem contador — Multas federais superiores a…" + botões "Regularizar mensalidade", "Solicitar mais dias de cobertura", "Entendi".

## 👍 Forças (o que copiar)
- "Não informar cliente" como atalho para quem não precisa de tomador nomeado.
- Busca unificada (nome/email/CPF/CNPJ).

## 👎 Fraquezas (nossa oportunidade)
- **Cobrança por medo no meio da tarefa** — pressiona no pior momento (quando o cliente quer trabalhar).
- Passo de seleção separado adiciona atrito ao caso recorrente.

## 🎯 Contraproposta Legalizei
- **Cobrança com dignidade:** aviso discreto e não-bloqueante ("sua fatura venceu — regularize quando puder"); NUNCA bloquear/assustar no meio da emissão. Coerente com nosso princípio de confiança = produto.
- Pular a seleção de tomador no caso recorrente (lembrar o último cliente).

## Links
- [[nf-emissao-2]] · [[nf-listagem]] · [[_relatorio-auditoria]] · [[HOME]]
