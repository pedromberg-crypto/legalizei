---
tipo: original
status: vivo
data: 2026-08-05
assunto: economia-preco
tags: [pesquisa, preco, cac, economia]
---

# 💰 Economia — margem, CAC, breakeven

> Fonte única de números econômicos do produto. Outros docs citam este, não recopiam valor. **Anti-guru: valor + fonte + confiança; 🔴 quando não tem dado, nunca chute.**

⚠️ **Doc PARCIAL por decisão consciente (05/08, Pedro).** Honorário contábil real (maior custo variável do negócio) fica **fora do cálculo por ora** — depende de dado do Mauro. Toda margem/CAC aqui é calculada só com custo técnico conhecido → é **teto inflado**, não número final. Supera a decisão anterior de 16/07 ([[legalize-preco-deferido-custo-real]], que adiava até ter tudo) — aqui já rodamos a planilha com o que dá, e travamos preço.

---

## 1. Estrutura de custos do produto (mensal, por cliente)

| Item | Valor | Fonte | Conf. |
|---|---:|---|---|
| API (integrações órgãos/consultas) | R$ 10,00/mês | simbólico, decisão Pedro 05/08 | 🟡 placeholder |
| Sistemas (fiscal/gestão) | R$ 5,00/mês | simbólico, decisão Pedro 05/08 | 🟡 placeholder |
| Honorário contábil (Mauro) | — | **fora do cálculo, decisão 05/08** | 🔴 pendente — maior custo, destrava CAC real |
| **Custo técnico conhecido/unidade** | **R$ 15,00/mês** | soma das 2 linhas acima | 🟡 parcial |

### Taxas de transação
| Forma de pagamento | Taxa | Fonte | Conf. |
|---|---|---|---|
| Asaas (Pix/cartão/boleto) | — | sem dado levantado ainda | 🔴 pendente |

### Impostos
Regime tributário da Legalize Digital (CNPJ que fatura o cliente final) — % sobre faturamento não levantado. 🔴 pendente.

---

## 2. Preço de venda por oferta

| Oferta | Preço | Histórico | Conf. |
|---|---:|---|---|
| **ME** | **R$ 139,00/mês** | revisado de R$ 195,00 → R$ 139,00 em 05/08/2026 (decisão Pedro) | 🟢 travado |
| **MEI** | R$ 49,90/mês | placeholder desde 16/07 ([[legalize-preco-deferido-custo-real]]), não revisado nesta sessão | 🟡 placeholder |

---

## 3. Margem PARCIAL (só custo técnico — NÃO é margem líquida)

| | ME (R$139,00) | MEI (R$49,90) |
|---|---:|---:|
| Receita bruta | R$ 139,00 | R$ 49,90 |
| (−) Custo técnico (API+sistema) | R$ 15,00 | R$ 15,00 |
| **= Sobra técnica** | **R$ 124,00** | **R$ 34,90** |
| **% sobre receita** | 89,2% | 69,9% |

⚠️ **Isso não é lucro líquido.** Falta honorário contábil (o maior custo variável de um negócio de contabilidade), taxa de transação Asaas e imposto sobre faturamento próprio. Todo cálculo abaixo herda esse teto inflado — usar como **teto teórico**, nunca como CAC-alvo definitivo pra escalar ads de verdade.

---

## 4. Budget disponível (referência)

Já travado em `BASE-ESTRATEGICA.md` §13, não recalculado aqui — citar, não recopiar: V0 R$3.500/mês (teste), V1 R$5.000/mês.

---

## 5. Ponto de equilíbrio preliminar (parcial, otimista)

Fórmula: vendas p/ empatar = budget ÷ sobra técnica.

| Cenário budget | Vendas ME/mês p/ empatar | Vendas MEI/mês p/ empatar |
|---|---:|---:|
| R$ 3.500/mês (V0) | ~28 | ~101 |
| R$ 5.000/mês (V1) | ~41 | ~144 |

---

## 6. CAC-alvo (regra dos 3) — PARCIAL, teto inflado

**Fórmula:** CAC-alvo = sobra técnica × 0,33.

| Oferta | Sobra técnica | CAC-alvo (33%) | Conf. |
|---|---:|---:|---|
| ME | R$ 124,00 | **R$ 40,92** | 🔴 inflado — real será menor após honorário entrar |
| MEI | R$ 34,90 | **R$ 11,52** | 🔴 inflado — margem já é apertada mesmo sem honorário |

MEI já mostra o problema: mesmo SEM contar honorário contábil, a sobra é curta. Se o honorário por cliente ficar perto ou acima de R$34,90, **o plano MEI pode não sustentar CAC nenhum** — sinal de alerta antecipado, não esperar dado real do Mauro pra suspeitar disso.

> ✅ **Atacado em 17/08 — o MEI deixa de carregar honorário contábil.** Decisão de escopo: **contador CRC só a partir do plano ME/Simples (R$139)**; o MEI passa a ter **assistente virtual de contabilidade**. Sustentado por lei, não só por margem: **MEI é o único regime dispensado de contador** (sem escrituração obrigatória, DASN-SIMEI autodeclaratória).
>
> **O que isso muda de fato:** o alerta acima era "o honorário pode comer os R$34,90 inteiros". Com a decisão, o custo variável do MEI vira **custo de assistente (infra/IA), não hora de contador** — ordem de grandeza menor e que **não cresce por cliente** do mesmo jeito.
>
> ⚠️ **Não recalculei a tabela.** O custo do assistente ainda não foi medido, e trocar um número não-medido por outro não-medido não melhora nada. O que muda hoje é a **natureza** do custo, não o valor. Fica na fila junto do honorário do Mauro:
> - [ ] medir custo unitário real do assistente virtual por cliente MEI/mês (tokens + infra)
> - [ ] com esse número, refazer §6 e §9 **só pra linha MEI**
>
> ⚠️ Também **não reabre** a decisão de 05/08 de manter MEI fora de tráfego pago frio ([[decisoes-marca]]). Ela pendia do CAC-alvo, que segue sem número novo. Quando o custo do assistente for medido, é gatilho pra revisitar — não antes.

---

## 7. Leituras estratégicas

- **Preço ME caiu 28,7%** (R$195 → R$139) — sai da faixa Contabilizei (R$195) e chega perto da Contaja (R$137, entrada mais barata do mercado mapeado). Reposiciona a régua de preço pra baixo, mais perto do challenger barato que do líder.
- **MEI a R$49,90** segue ~2,8x mais barato que ME — coerente com plano simplificado. Era a oferta que **primeiro ia quebrar** quando o honorário real entrasse na conta; a decisão de 17/08 (assistente virtual no lugar do contador dedicado, ver §6) tira o honorário dessa linha e ataca a causa. Custo do assistente ainda não medido.
- **Pendência crítica única:** honorário contábil real (Mauro) é o próximo dado que destrava CAC-alvo de verdade. Até lá, qualquer decisão de escalar budget de ads usando os números deste doc corre risco de queimar caixa — use os CAC-alvo daqui só como teto de teste pequeno, não meta de escala.

---

## 9. Correção — CAC-alvo precisa ser sobre LTV, não margem de 1 mês 🔴

> Adicionado 05/08 após pesquisa externa ([[perfil-microempreendedor-mercado]]). O §6 original calculou CAC-alvo sobre a sobra técnica de **1 mês só** — resultado (R$40,92 ME / R$11,52 MEI) fica **abaixo até do custo de 1 lead** no mercado real (CPL SaaS B2B Brasil: R$80-400 mediana). Contabilidade é assinatura recorrente — CAC precisa ser comparado contra **LTV** (valor ao longo da retenção), não 1 mensalidade.

### Recálculo com horizonte de retenção

| Horizonte | LTV técnico ME (sobra×meses) | CAC-alvo (33%) ME | LTV técnico MEI | CAC-alvo (33%) MEI |
|---|---:|---:|---:|---:|
| 1 mês (original, §6) | R$124,00 | R$40,92 | R$34,90 | R$11,52 |
| 12 meses (fidelidade mínima MEI travada) | R$1.488,00 | R$491,04 | R$418,80 | R$138,20 |
| 24 meses | R$2.976,00 | R$982,08 | R$837,60 | R$276,41 |

### Confronto com benchmark de mercado real ([[perfil-microempreendedor-mercado]] §4)

- CAC típico do nicho contábil BR: **R$500-4.000** (5% conversão lead→cliente) — [[PESQUISA-MERCADO]] §M
- CAC SMB internacional (proxy): R$1.500-7.300
- CPL SaaS B2B Brasil: R$80-400 mediana (R$15-50 só em Google Search de alta intenção)

**Leitura honesta:** mesmo com horizonte de 24 meses, nosso CAC-alvo técnico (R$982 ME) fica na ponta baixa do CAC típico de mercado (R$500-4.000) — e isso é **antes** de subtrair honorário contábil real, taxa Asaas e imposto (ainda 🔴 pendentes, §1). Quando esses entrarem, a sobra técnica cai e o CAC-alvo aperta mais.

### Implicação estratégica

1. **Canais caros (Meta/Google de topo, CPL R$200-400) provavelmente não fecham a conta** com a margem atual — só se a conversão lead→cliente for bem acima da média do setor (2,5-5%) ou o horizonte de retenção for longo (24m+).
2. **Canais baratos ganham peso estrutural, não só ganham "quando der":** Google Search de alta intenção (CPL R$15-50), orgânico/SEO, indicação (WhatsApp, [[insights-estrategicos]] achado nº1 sobre confiança) — esses viram prioridade, não plano B.
3. **MEI (CAC-alvo R$138-276 mesmo em 24m) segue sendo a oferta mais frágil** — reforça o alerta já registrado em [[insights-estrategicos]] achado 6.
4. Isso não muda o preço travado (R$139,00 ME) — muda **onde investir o budget de aquisição**. Ver quando [[metodologia-descoberta]]/V0 rodar o teste real de tráfego.

---

## Resumo executivo (parcial)

| Indicador | Valor | Conf. |
|---|---|---|
| Preço ME | R$ 139,00/mês | 🟢 |
| Preço MEI | R$ 49,90/mês | 🟡 |
| Custo técnico conhecido/unidade | R$ 15,00/mês | 🟡 |
| Sobra técnica ME | R$ 124,00 (89,2%) | 🟡 parcial |
| Sobra técnica MEI | R$ 34,90 (69,9%) | 🟡 parcial |
| CAC-alvo ME (1 mês, teto inflado) | R$ 40,92 | 🔴 conceitualmente errado — ver §9 |
| CAC-alvo ME (LTV 24 meses) | R$ 982,08 | 🟡 mais realista, ainda antes do honorário |
| CAC-alvo MEI (LTV 24 meses) | R$ 276,41 | 🔴 aperta contra benchmark de mercado (§9) |
| Honorário contábil | não calculado | 🔴 pendente Mauro |
| Taxa Asaas | não levantada | 🔴 pendente |
| Imposto s/ faturamento próprio | não levantado | 🔴 pendente |
