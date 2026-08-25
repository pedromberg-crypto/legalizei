---
tipo: derivado
status: vivo
data: 2026-08-17
assunto: margem-x-trafego
deriva_de: [2026-07-30-flow-2-construido-e-pente-fino, economia-preco-cac, trafego-pago-contabilidade-mercado]
tags: [pesquisa, economia, trafego, puntel, margem]
---

# 🔗 Margem × custo de tráfego — unificação (nossa conta + CPC do Puntel)

> **O que é:** primeira junção de duas coisas que viviam separadas. De um lado a matemática de planos/margem que foi pro Mauro em 30/07 (`execucao/apresentacao-mauro.html` bloco 6, [[2026-07-30-flow-2-construido-e-pente-fino]]). Do outro a estimativa de custo de mídia que o **Pedro Puntel** levantou (tabela `TabelaPlataformas`, recebida 17/08).
>
> **Escopo desta versão:** unificar e ver o que bate. **Não é** plano de mídia, não trava budget e não reabre decisão nenhuma. Anti-guru: cada número abaixo tem origem declarada; o que é derivado está marcado como derivado.

## 1. O que cada lado trouxe

### 1a. O dado do Puntel (fonte: tabela dele, 17/08)

| Plataforma | Custo médio por clique | Foco estratégico | Viabilidade p/ ticket R$49 / R$139 |
|---|---|---|---|
| Meta Ads (IG/FB) | **R$1,00 a R$5,00** | venda direta do app; vídeo focado na "dor" da burocracia | ✅ Alta |
| Google Ads (Search) | **R$3,00 a R$10,00** | intenção ativa; quem busca "contabilidade online MEI" | ✅ Alta |

> ⚠️ **2 ressalvas de leitura da fonte.** (1) No print recebido o cabeçalho da última coluna está **cortado** ("Viabilidade para Ticket R$ 49/R$…") — assumi R$49 (MEI) e R$139 (ME); confirmar com ele. (2) A tabela usa "Legalize Group" e "LegalizaiApp"; a marca é **Legalizai** ([[decisoes-marca]]).

### 1b. A nossa conta de margem (fonte: `execucao/apresentacao-mauro.html` bloco 6, 30/07)

Plano ME R$139 × 12 meses, cliente cumpre a fidelidade:

| Item | Valor |
|---|---:|
| Receita do contrato | R$ 1.668,00 |
| Certificado digital (único custo duro que sobrou; usava R$200 estimado) | − R$ 200,00 |
| **Sobra** | **+ R$ 1.468,00** (margem 88%) |

Taxa da Junta (R$268,51) ficou fora porque **o cliente paga todas as taxas públicas** (decisão 30/07, espelhando a cláusula 4.3"h" do contrato do líder).

## 2. As duas contas que existiam não eram a mesma conta

Antes de cruzar com mídia, os dois docs de margem precisavam virar um. Eles usam **bases de custo diferentes e complementares**:

| Doc | Custo que inclui | Custo que ESQUECE |
|---|---|---|
| [[2026-07-30-flow-2-construido-e-pente-fino]] · `execucao/apresentacao-mauro.html` (30/07) | certificado digital, uma vez (usava R$200 estimado) | custo técnico mensal |
| [[economia-preco-cac]] (05/08) | técnico R$15/mês (API R$10 + sistema R$5) | certificado digital |

**Unificando os dois (derivado, 17/08):**

| | ME R$139 | MEI R$49,90 |
|---|---:|---:|
| Receita 12 meses | R$ 1.668,00 | R$ 598,80 |
| − certificado digital (valor real, 18/08) | − R$ 209,00 | − R$ 209,00 |
| − técnico (R$15 × 12) | − R$ 180,00 | − R$ 180,00 |
| **= margem bruta 12m** | **R$ 1.279,00** | **R$ 209,80** |
| margem % | 76,7% | 35,0% |
| **CAC-alvo (33% da margem)** | **R$ 422,07** | **R$ 69,23** |

> A régua dos 33% sobre LTV vem de [[economia-preco-cac]] §9. A margem unificada do ME (R$1.279) fica **12,9% abaixo** do que a apresentação mostrou ao Mauro (R$1.468) e **14,0% abaixo** do LTV técnico de 12m do doc de economia (R$1.488) — porque é a primeira vez que os dois custos entram juntos, e porque o certificado custa **R$209,00 de verdade** (valor real confirmado 18/08), não os R$200 estimados.
>
> ⚠️ **Ainda de fora dos dois lados:** honorário contábil real (dado do Mauro, 🔴 pendente), taxa Asaas, imposto e horas de operação. Segue sendo **margem bruta**, não lucro.

## 3. O cruzamento — o CPC dele vira CPL na nossa régua

O CPC sozinho não fecha conta nenhuma: falta o passo clique → lead. Usando a conversão por origem de tráfego já registrada em [[trafego-pago-contabilidade-mercado]] (Leadster Panorama 2026, conf. alta):

| Plataforma | CPC (Puntel) | Conversão clique→lead | **CPL derivado** |
|---|---|---:|---:|
| Meta Ads | R$1,00 – R$5,00 | 4,68% | **R$ 21,37 – R$ 106,84** |
| Google Search | R$3,00 – R$10,00 | 3,46% | **R$ 86,71 – R$ 289,02** |

**Confronto com o CPL que já tínhamos:** Meta R$40–150 e Google R$50–200 ([[trafego-pago-contabilidade-mercado]]). O CPL derivado do Puntel **entra dentro da nossa faixa no Meta** (e estica pra baixo, o que é boa notícia) e **estoura o teto no Google** (R$289 contra R$200).

## 4. A pergunta que isso responde: quanto precisa converter?

Como `CAC = CPL ÷ conversão lead→cliente`, dá pra inverter e perguntar **qual conversão lead→cliente o CAC-alvo exige**:

### ME (CAC-alvo R$422,07)

| Cenário | CPL | Conversão lead→cliente necessária | Leitura |
|---|---:|---:|---|
| Meta, CPC R$1 | R$ 21,37 | **5,1%** | confortável (média do setor é 2,5–5%) |
| Meta, CPC R$5 | R$ 106,84 | **25,3%** | fora da realidade de tráfego frio |
| Google, CPC R$3 | R$ 86,71 | **20,5%** | fora da realidade |
| Google, CPC R$10 | R$ 289,02 | **68,5%** | impossível |

### MEI (CAC-alvo R$69,23)

| Cenário | CPL | Conversão lead→cliente necessária |
|---|---:|---:|
| Meta, CPC R$1 (melhor caso) | R$ 21,37 | **30,9%** |
| Meta, CPC R$5 | R$ 106,84 | **154,3%** |
| Google, CPC R$3 | R$ 86,71 | **125,2%** |
| Google, CPC R$10 | R$ 289,02 | **417,5%** |

## 5. Os 3 pontos onde o dado dele e o nosso não fecham

1. 🔴 **O "✅ Alta viabilidade para ticket R$49" não sobrevive à nossa conta.** No **melhor caso dele** (Meta a R$1/clique), o MEI ainda exige **30,9%** de conversão lead→cliente. Nos outros três cenários, exige **mais de 100%**, o que é aritmeticamente impossível. Duas fontes independentes do vault já tinham cravado ~30% como *"métrica irreal para aquisição fria"* ([[trafego-pago-contabilidade-mercado]] §5 e [[economia-preco-cac]] §9), e é por isso que existe a decisão de 05/08 de **manter MEI fora de tráfego pago frio** ([[decisoes-marca]]). O dado do Puntel **não derruba** essa decisão; ele bate de frente com ela e perde na conta.

2. 🟡 **O CPC de Google dele é menos da metade do nosso teto.** Ele diz R$3–10; nossa fonte (Webcer, via [[trafego-pago-contabilidade-mercado]]) diz **R$4–22**. Não dá pra saber quem está certo sem saber o recorte dele (nicho? geo? termo?). Pergunta direta pra ele.

3. 🟡 **Ele propõe as duas plataformas; o V0 só tem budget pra uma.** Decisão de 05/08: **100% do V0 em Meta**, porque R$3.500/mês não alimenta os mínimos de Meta (R$800–2.000) e Google (R$1.500–3.000) ao mesmo tempo ([[estrutura-funil-trafego]]). Google Search entra no V1. Isso não contradiz o dado dele, contradiz o **sequenciamento** — e é exatamente o tipo de coisa que ele foi chamado pra validar.

## 6. O que o budget do V0 produz com o CPC dele

Budget V0 = R$3.500/mês, 100% Meta. Líquido do repasse tributário Meta de 12,15% = **R$3.074,75 de mídia efetiva** ([[estrutura-funil-trafego]]).

| CPC | Cliques/mês | Leads/mês (4,68%) | Clientes/mês a 5% | Clientes/mês a 10% |
|---:|---:|---:|---:|---:|
| R$ 1,00 | 3.075 | 144 | **7,2** | **14,4** |
| R$ 3,00 | 1.025 | 48 | 2,4 | 4,8 |
| R$ 5,00 | 615 | 29 | 1,4 | 2,9 |

Meta do MVP = **25–30 clientes fundadores em 3 meses** ≈ 8–10/mês. Ela só é alcançada **na ponta barata da faixa dele** (CPC ~R$1) e com conversão lead→cliente perto de 10%. No meio da faixa dele (R$3) o V0 entrega menos de metade da meta.

> ⚠️ **A conversão de 4,68% é proxy, não é o nosso funil.** Ela mede **landing page** por origem de tráfego, e nosso desenho é **anúncio → WhatsApp → humano**, justamente porque converte melhor nesse nicho ([[trafego-pago-contabilidade-mercado]]). O número real só sai do teste do V0.

## 7. O que fica aberto

- [ ] Confirmar com o Puntel o cabeçalho cortado da coluna de viabilidade (R$49 / R$139?) e o **recorte** do CPC dele (nicho, geo, termos) — resolve o conflito nº2.
- [ ] Levar a ele o confronto do item nº1 (MEI exige 29,6% no melhor caso): ele mantém "Alta viabilidade" vendo a margem, ou o "Alta" era sobre custo de clique isolado?
- [ ] Honorário contábil real (Mauro) — 🔴 a pendência que ainda segura toda a conta.
- [ ] Custo unitário do assistente virtual do MEI ([[economia-preco-cac]] §6) — hoje não medido.

> **Nota sobre a decisão de 17/08 (contador CRC só a partir do Simples).** Ela **não melhora** os números de MEI acima. O honorário contábil nunca esteve dentro da sobra de R$34,90/mês do MEI (o custo técnico de R$15 é só API + sistema). A decisão evita que a margem do MEI **piore** quando o dado do Mauro chegar; ela não cria folga nova pra bancar aquisição.

## Links
- [[2026-07-30-flow-2-construido-e-pente-fino]] · [[economia-preco-cac]] · [[trafego-pago-contabilidade-mercado]] · [[estrutura-funil-trafego]] · [[funil-conversao]] · [[decisoes-marca]] · [[HOME]]
