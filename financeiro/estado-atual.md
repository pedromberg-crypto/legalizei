---
tipo: verdade
status: vivo
data: 2026-08-25
assunto: precificacao-cac-margem
tags: [financeiro, preco, cac, margem, fonte-verdade]
---

# 💰 Estado atual — preço, CAC, margem

**Isto NÃO é um log.** Diferente de [[decisoes-marca]] (ADR cronológico, tem que ler até o fim pra saber o que vale), este arquivo é editado NO LUGAR toda vez que uma decisão financeira nova trava — sempre reflete só o estado atual. Pra ver a história/racional completo de como cada número chegou aqui, os links de cada seção apontam pra entrada correspondente no ADR.

## TL;DR — cite isto, não procure em outro lugar

- **Preço ME:** R$139/mês
- **Preço MEI:** R$49/mês (redondo, sem centavos)
- **Oferta de lançamento** (3 primeiros meses, qualquer cliente): MEI R$19→49 · ME R$99→139
- **Oferta da campanha** (lista de espera, exclusiva de quem entra antes): ME R$79→139 · MEI é a mesma (R$19→49)
- **Validade de toda promoção:** até 31/12/2026
- **CAC-alvo:** R$30 a R$100/cliente (custo único, medido contra LTV de 12 meses)
- **Contador CRC de verdade:** só a partir do plano ME (R$139). MEI (R$49) tem assistente virtual de contabilidade.
- **Split de tráfego:** 30% MEI / 70% ME — condicionado ao MEI seguir com assistente virtual (sem atendente humano dedicado, a margem vira negativa)

## Preço dos planos

| Plano | Preço padrão | Oferta lançamento (3 meses) | Oferta campanha (3 meses) |
|---|---|---|---|
| MEI | R$49/mês | R$19 → R$49 | R$19 → R$49 (mesma) |
| ME | R$139/mês | R$99 → R$139 | R$79 → R$139 |

Toda peça de **anúncio** da campanha usa ME R$79, nunca R$99 — R$99 é só o preço de quem chega depois do lançamento, fora da campanha. Validade de toda promoção: **31/12/2026** (gatilho de escassez real, pode entrar na copy como data concreta).

Fonte: [[decisoes-marca]] entradas de 05/08, 17/08 e 20/08 (2x).

## CAC-alvo e LTV

**R$30 a R$100 por cliente, custo ÚNICO** (paga-se uma vez na entrada, não é gasto recorrente), medido contra **LTV de 12 meses** (prazo da fidelidade). Taxa de conversão pressuposta: 2% a 8% dos cliques virando pagante — meta, não medição confirmada.

- ME fecha com folga: 2,3%–7,8% do LTV.
- MEI também fecha: 14,3%–47,7% do LTV, payback 1,7–5,7 meses — **desde que siga com assistente virtual**, não atendente humano (com atendente a margem do MEI é negativa).

Fonte: [[decisoes-marca]] entradas de 18/08 (CAC-alvo) e 18/08 (MEI destravado do tráfego pago).

## Estrutura de custo e margem

- **Atendente contábil:** R$3.500/mês para 30-40 usuários (a variável de maior alavancagem do negócio).
- **Honorário CRC:** 1 salário mínimo fixo (ruído no cálculo — R$5,40/cliente diluído em 300).
- Com atendente no modelo, margem do ME cai de 76,7% pra **9,8% a 1:40** ou **prejuízo a 1:30**. Breakeven em **1:35**; margem de 33% exige **1:63**.
- **MEI só empataria em 1:290** — confirma por aritmética por que MEI segue com assistente virtual, não atendente humano.
- Razão usuários-por-atendente real ainda não medida — descobrir isso vale mais que qualquer negociação de preço.

Fonte: [[decisoes-marca]] entrada de 18/08 ("mão de obra entra no modelo").

## ⚠️ Docs que ainda citam o preço MEI antigo (R$49,90)

Não presumir corrigido até tocar em cada um: `mkt/estrategia/posicionamento.md`, `mkt/estrategia/estrategia-organica.md`, `mkt/estrategia/frente-1-captacao-meta-bh.md`, `app/.../wizard-dinheiro.tsx`. Se for editar qualquer um desses por outro motivo, aproveita e corrige pro R$49 redondo.

## Pesquisa que sustenta essas decisões

`financeiro/pesquisa/`: [[economia-preco-cac]] · [[2026-08-17-margem-x-custo-de-trafego]] · [[2026-08-18-custos-margem-decisao]] · [[2026-08-20-simulacao-oferta-lancamento]] · [[2026-08-24-rascunho-apresentacao-custos-valores]]
