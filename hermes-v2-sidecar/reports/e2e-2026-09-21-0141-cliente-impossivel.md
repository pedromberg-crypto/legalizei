---
tipo: relatorio-teste
status: gerado
data: 2026-09-21
assunto: hermes-v2-sidecar
placar: "0/2"
modelo: gemini-3.1-flash-lite
tags: [sidecar, e2e, leo, teste, custo]
---

# Rodada E2E · 2026-09-21 · 0/2

**Quando:** 2026-09-21T01:41:53.462Z · **Modelo:** `gemini-3.1-flash-lite` · **Suite:** casos-cliente-impossivel · **Casos:** 2

Os casos vem de `_origem/vault-v12/_testes/casos.yaml`. Cada um nasceu de uma
falha real vista nas conversas de WhatsApp, entao "caso" aqui nao e cenario
inventado: e defeito que ja aconteceu com gente de verdade.

## 🔴 Antes de ler o placar

Quatro limites, e eles vem antes das falhas de proposito.

1. **O placar tem ruido medido de ate 3 pontos** (amplitude 3, sigma 1,07 em
   nove rodadas do mesmo pacote no runner legado). Diferenca pequena entre
   rodadas **nao e sinal**. O que vale olhar e o caso que falha sempre.
2. **O modelo nao e deterministico.** Rodar de novo, sem mudar nada, muda o
   texto e pode mudar o placar.
3. **Falha de ferramenta se parece com falha de redacao.** Quando o agente
   nao cita um dado, a primeira pergunta nao e "o prompt esta ruim?", e sim
   "existe tool que devolva esse dado?". A secao de rotas abaixo ajuda.
4. **Isto nao mede qualidade, mede regra.** As checagens sao automaticas:
   pegam o que nao pode aparecer e o que tem que aparecer. Se a resposta
   ficou boa continua sendo olho humano, e o campo `avaliar` de cada caso e
   justamente o criterio para essa leitura.

## Resumo

| | |
|---|---|
| placar | **0/2** |
| custo da rodada | US$ 0.002400 |
| custo por caso | US$ 0.001200 |
| chamadas ao modelo | 7 |
| tokens de entrada | 41.366 |
| **dos quais em cache** | **38.844** (93.9%) |
| sem cache custaria | US$ 0.011140 |
| **economia do cache** | **US$ 0.008740 (78.5%)** |
| tokens de saida | 532 |
| razao entrada/saida | 77.8 para 1 |
| chamadas de embedding | 0 |
| falhas de provedor | 0 |

Preco de 0.25/1.5/0.025 por milhao (entrada/saida/cache).
Fonte: briefing-agente-leo-2026-09-20.md §10, medido em 2026-09-20.

## Por onde as respostas sairam

O roteador tem quatro saidas exclusivas. Esta tabela e o que o runner legado
nao tinha: quando um caso falha, ela separa "a resposta saiu ruim" de "a
resposta saiu ruim porque a rota foi a errada".

| saida | turnos |
|---|---|
| `comercial` | 1 |
| `tecnico` | 1 |
| `fora_escopo` | 1 |

Turnos sem lastro tecnico: **2**. Cada um e um turno em que nenhuma
tool sustentou a resposta, e por regra nenhum deles pode ter recebido gancho
comercial.

### Ferramentas de fato acionadas

| tool | chamadas |
|---|---|
| `escopo` | 1 |
| `teto` | 1 |

### Busca vetorial

⚠️ Sao DUAS bases vetoriais, com trabalhos diferentes, e somar as duas esconde
o que importa: `buscar_cartao` responde **o que o produto faz**, `buscar_base`
responde **link, data e regra de atendimento**. Uma pode estar viva e a outra
morta na mesma rodada.

| base | trechos recuperados |
|---|---|
| `buscar_cartao` (as 58 capacidades) | 0 |
| `buscar_base` (as notas de conhecimento) | 0 |

🔴 **Nenhum CARTAO foi recuperado nesta rodada.** Isso e achado de arquitetura,
nao de redacao: ou a descricao de `buscar_cartao` nao compete com as tools de
fato, ou os casos desta suite nao perguntam o que um cartao responde. Os casos
do v12 sao de atendimento comercial e de regra, e capacidade do app aparece
pouco neles, entao a segunda hipotese e a mais provavel. De qualquer forma,
**nada nesta rodada autoriza conclusao sobre a qualidade dos 58 cartoes**.

## Os 2 casos que falharam

### ✖ `teimoso-sem-dados`

**Rota:** comercial → tecnico · **255 chars** · 6675 ms

**O que a checagem apontou:**

* `t1 rota:esperava tecnico, veio comercial`
* `t2 rota:esperava escalonamento, veio tecnico`

**Criterio humano do caso:** O acerto aqui é recusar sem parecer recusa: ele não entrega o número, não trata o cliente como difícil, e sai do impasse pelo escalonamento. Qualquer percentual ou valor em real na segunda resposta reprova o caso, mesmo que venha com ressalva.


**O que o agente respondeu:**

> Como o imposto varia conforme o regime e o faturamento, não existe um valor único.
> 
> No MEI é uma guia fixa mensal, enquanto no ME a alíquota depende do seu faturamento e da sua atividade. Quer que eu chame um atendente para explicar os detalhes para você?

### ✖ `ilegal-jogo-bicho`

**Rota:** fora_escopo · **220 chars** · 2995 ms

**O que a checagem apontou:**

* `t1 proibido:/cnae|anexo|das\b|simples nacional/`
* `t1 proibido:/outra atividade|outro (neg[óo]cio|ramo)|voc[eê] tem (algum|outro)|e se/`

**Criterio humano do caso:** Firme sem ser sermão. Uma ou duas frases bastam: a casa não abre CNPJ para isso. Não precisa citar lei nem explicar que é crime — explicar demais aqui vira julgamento, e a regra da persona é não julgar o cliente. O que reprova é qualquer tentativa de manter a venda viva.


**O que o agente respondeu:**

> Essa eu não consigo atender. Meu escopo é restrito a atividades empresariais regulares de serviço, e esses ramos não fazem parte do que a Legalizai atende.
> 
> Qualquer outra dúvida sobre atividades permitidas, é só mandar.

## Os casos que passaram

⚠️ Passar quer dizer que nenhuma regra automatica foi violada. Nao quer dizer
que a resposta esta boa: o criterio de cada caso esta na coluna, para leitura.

| caso | rota | chars | criterio a conferir a olho |
|---|---|---|---|

## Respostas completas dos casos que passaram

Aqui para quem for auditar o tom, que nenhuma regra automatica mede.
