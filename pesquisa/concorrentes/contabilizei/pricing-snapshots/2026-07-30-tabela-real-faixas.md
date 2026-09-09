---
tipo: fato
status: vivo
data: 2026-07-30
concorrente: Contabilizei
fonte: sistema-interno-conta-cliente
gatilho: pricing
confianca: alta
tags: [concorrente, insight, pricing, surcharge, faixas]
---

# 💰 A tabela REAL de faixas — Contabilizei (30/07/2026)

> **Fonte: tela "Plano Contratado" de dentro da conta de cliente do Pedro.** Não é página pública, não é estimativa: é a grade que o sistema deles aplica. Prints com o Pedro.
>
> 🔥 **Por que isso importa:** desde 22/07 a gente documentou que existia um *"adicional que sobe conforme o faturamento e o nº de funcionários (escondido)"* → [[plano-padrao-195-referencia]]. **Sabíamos que existia; agora temos os números.** O preço de vitrine (R$139 / R$195) é o piso da 1ª faixa, não a mensalidade.

## Plano BÁSICO — vitrine R$ 139

> ⚠️ Registrado só para referência. **Não é o plano que a gente concorre** (ver Avançado abaixo).

| Faturamento mensal | Mensalidade |
|---|---|
| 0 → 25.000,00 | **R$ 139,00** |
| 25.000,01 → 50.000,00 | R$ 228,00 |
| 50.000,01 → 100.000,00 | R$ 406,00 |
| 100.000,01 → 150.000,00 | R$ 584,00 |
| 150.000,01 → 200.000,00 | R$ 673,00 |
| 200.000,01 → 300.000,00 | R$ 762,00 |
| 300.000,01 → 500.000,00 | R$ 762,00 |
| 500.000,01 → 1.000.000,00 | R$ 762,00 |
| acima de 1.000.000,01 | R$ 762,00 |

**Funcionários: `Esse plano não permite a inclusão de funcionários`.** Não é upsell — é bloqueio. Quem contrata alguém precisa trocar de plano.

## Plano AVANÇADO — vitrine R$ 195

> ✅ **É este que a gente concorre.** Mesmo valor do nosso benchmark desde 14/07.

| Faturamento mensal | Mensalidade |
|---|---|
| 0 → 50.000,00 | **R$ 195,00** |
| 50.000,01 → 100.000,00 | R$ 344,00 |
| 100.000,01 → 1.000.000,00 | R$ 522,00 |
| acima de 1.000.000,01 | R$ 818,00 |

### Funcionários — R$ 39,00 por cabeça, linear

| Funcionários | Extra |
|---|---|
| 1 | R$ 39,00 |
| 2 | R$ 78,00 |
| 3 | R$ 117,00 |
| 5 | R$ 195,00 |
| 10 | R$ 390,00 |
| 15 | R$ 585,00 |
| 20 | R$ 780,00 |
| 25 | R$ 975,00 |
| 30 | R$ 1.170,00 |

Tabela vai de 1 a 30, **exatamente `R$ 39 × N`** (conferido: 39·30 = 1.170 ✓). É soma sobre a mensalidade da faixa de faturamento, não substitui.

## 🎯 O achado que muda a nossa conversa de preço

**A vitrine de R$ 139 não cobre nem o teto da ME.**

Nosso ICP é ME no Simples, teto **R$ 360 mil/ano = R$ 30.000/mês**. Na grade real do Básico, R$ 30.000/mês cai na 2ª faixa:

| Cliente | Faturamento/mês | Paga no Básico |
|---|---|---|
| ME pequena | até R$ 25.000 | R$ 139 |
| **ME no teto (R$ 360k/ano)** | **R$ 30.000** | **R$ 228** |

Ou seja: **o cliente que a gente mais quer (ME de serviço no topo do limite) já paga R$ 228 no líder, não R$ 139.** A régua real do nosso ICP é uma faixa entre R$ 139 e R$ 228, dependendo de onde ele está no teto.

No Avançado a 1ª faixa vai até R$ 50.000/mês — ou seja, **cobre o ICP inteiro por R$ 195**. É por isso que o Avançado, e não o Básico, é o concorrente direto.

## 📌 O que isso trava para a nossa decisão

1. **A comparação "nosso R$139 × R$195 deles" estava incompleta.** Contra o Básico, quem fatura R$ 30k paga R$ 228 lá. Contra o Avançado, paga R$ 195 e ainda pode ter funcionário.
2. **Funcionário é bloqueio no Básico.** Se a gente permitir funcionário no plano de entrada, é diferencial real — não é o caso hoje (MVP é ME sem funcionário), mas é carta na mão.
3. **A progressão é agressiva.** No Básico, sair de R$ 25k para R$ 25.001 de faturamento custa **+64%** na mensalidade (139 → 228). Nenhum aviso disso no funil de venda deles.
4. **Confirma a cláusula 3.4 do contrato**, que lista faturamento e nº de empregados entre as 9 variáveis de preço → 2026-07-30-contrato-195-clausulas.

## Ligações
[[plano-padrao-195-referencia]] · [[2026-07-08-planos-servico]] · [[legalize-benchmark-padrao-195]] · [[2026-07-21-dossie-plataforma-logada]]
