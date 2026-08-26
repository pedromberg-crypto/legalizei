---
tipo: derivado
status: vivo
data: 2026-08-20
assunto: simulacao-oferta-lancamento
deriva_de: [2026-08-18-custos-margem-decisao]
tags: [economia, margem, campanha, simulacao]
---

# 📐 Simulação — oferta de lançamento (primeira campanha)

> Deriva de [[2026-08-18-custos-margem-decisao]], mas usa premissas próprias, ajustadas pelo Pedro (20/08) pro contexto específico da primeira campanha de tráfego. **Não substitui o doc original** — os dois convivem, cada um com sua base de custo.

## Premissas desta simulação (diferentes do doc-mãe)

| Item | Aqui | No doc-mãe (18/08) |
|---|---|---|
| Honorário CRC diluído | **fora da conta** | R$5,40/mês, nos dois planos |
| Técnico (API+sistema) | **ME R$15/mês · MEI R$5/mês** (MEI consome bem menos) | R$15/mês, nos dois planos |
| Certificado digital | **ME sim (R$209) · MEI NÃO dá** | R$209, nos dois planos |
| Atendente | **R$4.000/mês ÷ (50 usuários/dia × 22 dias = 1.100/mês) = R$3,63/usuário/mês**, nos dois planos | R$3.500/mês ÷ 30-40 usuários = R$87,50-116,67/usuário/mês |
| CAC-alvo | **10% da receita bruta 12m** (escala com o plano) | R$30-100 fixo |
| LTV | margem líquida 12m (técnico+certificado+atendente) | varia por bloco do doc (bruta em alguns, líquida em outros) |

⚠️ **A razão 1:1.100/atendente é bem mais generosa que a estimativa original do doc-mãe (1:30-40).** O doc-mãe chama essa razão de "a variável de maior alavancagem do negócio, nunca medida de verdade". Vale confirmar se o modelo de atendimento real (1:1 tipo WhatsApp vs. suporte assíncrono/triagem em volume) sustenta 1.100/mês antes de tratar esta simulação como final.

## 1. Cenários de preço (fidelidade 12 meses)

| Cenário | Estrutura | Receita 12m |
|---|---|---:|
| **MEI A** | 3m R$19 + 9m R$49 | R$ 498,00 |
| **MEI B** | 6m R$9,90 + 6m R$49 | R$ 353,40 |
| **ME A** | 3m R$99 + 9m R$139 | R$ 1.548,00 |
| **ME B** | 6m R$99 + 6m R$139 | R$ 1.428,00 |
| **ME C** | 3m R$79 + 9m R$139 | R$ 1.488,00 |

## 2. Margem líquida 12m

| Cenário | Receita | (−) técnico | (−) certificado | (−) atendente | Margem líquida | % |
|---|---:|---:|---:|---:|---:|---:|
| MEI A | 498,00 | 60,00 | — | 43,56 | **394,44** | 79,2% |
| MEI B | 353,40 | 60,00 | — | 43,56 | **249,84** | 70,7% |
| ME A | 1.548,00 | 180,00 | 209,00 | 43,56 | **1.115,44** | 72,0% |
| ME B | 1.428,00 | 180,00 | 209,00 | 43,56 | **995,44** | 69,7% |
| ME C | 1.488,00 | 180,00 | 209,00 | 43,56 | **1.055,44** | 70,9% |

## 3. CAC (10% da receita bruta) × payback

| Cenário | CAC | CAC/margem líquida | Payback |
|---|---:|---:|---:|
| MEI A | 49,80 | 12,6% | 1,5 mês |
| MEI B | 35,34 | 14,1% | 1,7 mês |
| ME A | 154,80 | 13,9% | 1,7 mês |
| ME B | 142,80 | 14,3% | 1,7 mês |
| ME C | 148,80 | 14,1% | 1,7 mês |

CAC proporcional à receita (não fixo) converge os 5 cenários pra leitura quase idêntica: ~12-14% da margem, payback ~1,5-1,7 mês.

## 4. Pior caso — cancela cedo, multa 30% do saldo restante (sem CAC, só economia do contrato)

| Cenário | Cancela em | Pago até lá | Saldo | Multa 30% | Receita total | (−) custos período | Resultado |
|---|---|---:|---:|---:|---:|---:|---:|
| MEI A | mês 1 | 19,00 | 479,00 | 143,70 | 162,70 | 8,63 | **+154,07** |
| MEI A | fim mês 3 | 57,00 | 441,00 | 132,30 | 189,30 | 25,89 | **+163,41** |
| MEI B | mês 1 | 9,90 | 343,50 | 103,05 | 112,95 | 8,63 | **+104,32** |
| MEI B | fim mês 6 | 59,40 | 294,00 | 88,20 | 147,60 | 51,78 | **+95,82** |
| ME A | mês 1 | 99,00 | 1.449,00 | 434,70 | 533,70 | 227,63 | **+306,07** |
| ME A | fim mês 3 | 297,00 | 1.251,00 | 375,30 | 672,30 | 264,89 | **+407,41** |
| ME B | mês 1 | 99,00 | 1.329,00 | 398,70 | 497,70 | 227,63 | **+270,07** |
| ME B | fim mês 6 | 594,00 | 834,00 | 250,20 | 844,20 | 320,78 | **+523,42** |
| ME C | mês 1 | 79,00 | 1.409,00 | 422,70 | 501,70 | 227,63 | **+274,07** |
| ME C | fim mês 3 | 237,00 | 1.251,00 | 375,30 | 612,30 | 264,89 | **+347,41** |

Todos os 5 cenários fecham positivo em qualquer ponto de cancelamento.

## 🟢 Decisão final (Pedro + Mauro, por telefone, 20/08)

| Uso | Plano | Cenário escolhido |
|---|---|---|
| **Preço de LANÇAMENTO** (fora desta campanha) | MEI | Cenário A — 3m R$19, depois R$49 |
| **Preço de LANÇAMENTO** (fora desta campanha) | ME/Simples | Cenário A — 3m R$99, depois R$139 |
| **Preço da CAMPANHA** (lista de espera, esta peça) | MEI | Cenário A — mesmo do lançamento, só tem 1 aprovado |
| **Preço da CAMPANHA** (lista de espera, esta peça) | ME/Simples | **Cenário C** — 3m R$79, depois R$139 (mais agressivo, exclusivo de quem entra na lista antes) |

**Validade de toda promoção: até 31/12/2026.** Registrado como ADR em `marca/decisoes-marca.md` (2026-08-20). Aplicado em `mkt/campanhas/2026-08-primeira-campanha/brief.md` e `copy.md` (MOTE C corrigido de R$99 para R$79).

## Leitura

- **MEI B (6 meses a R$9,90) é o mais arriscado dos dois MEI** — não por prejuízo, mas por margem menor (70,7% × 79,2%) e exposição dobrada ao preço baixo (6 vs 3 meses).
- **ME A/B/C ficam próximos entre si** (69,7%-72,0%, payback 1,7 mês) — escolher entre eles é mais questão de atratividade da oferta pro lead do que risco financeiro.
- Achado que não existia na simulação anterior (com honorário + certificado no MEI + atendente caro): **MEI deixava de fechar conta em CAC alto e cancelamento cedo.** Tirando honorário, tirando certificado do MEI e baixando o custo de atendente, o MEI vira tão seguro quanto o ME.

## Cross-refs
[[2026-08-18-custos-margem-decisao]] · [[../mkt/campanhas/2026-08-primeira-campanha/brief|brief da primeira campanha]] · [[HOME]]
