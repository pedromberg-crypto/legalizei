---
tipo: operacao
status: vivo
data: 2026-08-24
assunto: apresentacao-custos-valores
deriva_de: [2026-08-18-custos-margem-decisao, 2026-08-20-simulacao-oferta-lancamento]
tags: [economia, margem, apresentacao, rascunho]
---

# 🧱 Rascunho — nova apresentação PDF de custos/valores

> Doc de acúmulo. Vai juntando peças isoladas do PDF [[2026-08-18-custos-margem-decisao]] + da [[2026-08-20-simulacao-oferta-lancamento]] até fechar o roteiro da nova apresentação. Lapidando aos poucos — não travar nada aqui ainda.

## 🗒️ Pauta pra bater com o Mauro (lista viva)

> Trazido de `execucao/pauta-mauro.md` — vive aqui agora, no topo. Itens levantados entre sessões pra tratar na próxima conversa/call com o Mauro. Riscar/mover pra "Resolvido" depois de bater.

### Em aberto

| # | Item | Detalhe | Levantado em |
|---|---|---|---|
| 1 | **Crédito no Meta Ads** | Colocar crédito até chegar no cartão R$1.000 ou R$2.000, ou rodar o mês todo com R$3.000 — decidir mecânica de aporte do budget de tráfego | 2026-08-24 |
| 2 | **Assessoria de imprensa** | Proposta de ~R$8k, mas **personalizado** (não pacote padrão) — avaliar escopo/vale a pena | 2026-08-24 |
| 3 | **Animações e peças gráficas** | Ainda estamos criando o personagem (Léo) e os movimentos dele — alinhar expectativa de prazo/entrega com o Mauro | 2026-08-24 |
| 4 | **Migração do Pedro Melo pra design/vídeo** | Alinhar a mudança de frente dele | 2026-08-24 |
| 5 | **Meta de lançamento do MVP: outubro** | Explicar que já não é mais "MVP" no sentido raso — está bem avançado (app ponta a ponta navegável, cadastro+constituição+pagamento especificados/construídos). Por isso precisa de uma **decisão do programador sobre prazo mais real**, não a meta antiga | 2026-08-24 |
| 6 | **Pagamento das contas Apple/Android** | Precisa pagar as contas de desenvolvedor (Apple Developer + Google Play) pra começar o desenvolvimento de fato do app nas lojas | 2026-08-24 |
| 7 | **Escopo de regime: Simples + MEI agora, Lucro Presumido depois de rodar** | Alinhar que o MVP atende só Simples Nacional (ME) e MEI; Lucro Presumido fica fora até o produto rodar (não é corte definitivo, é ordem de entrada) | 2026-08-24 |

### Referência de apoio pra pauta (preço + fidelidade)

**Última documentação travada sobre preços com recorrência** (`marca/decisoes-marca.md`, entrada 2026-08-20, fechada por telefone com o Mauro):
- **Preço de LANÇAMENTO oficial:** MEI R$19 → R$49/mês · ME R$99 → R$139/mês (valor promocional nos 3 primeiros meses, depois volta ao preço cheio — MEI R$49, ME R$139)
- **Preço de CAMPANHA** (lista de espera, exclusivo de quem entra antes do lançamento): MEI R$19 → R$49 (mesmo do lançamento) · **ME R$79 → R$139** (mais agressivo que o R$99 do lançamento)
- Validade de toda promoção: **até 31/12/2026**
- Fonte de suporte: [[2026-08-20-simulacao-oferta-lancamento]] (5 cenários testados, 3 aprovados: MEI A, ME A, ME C)

**Prática de mercado sobre fidelidade (pesquisado):** os 2 concorrentes que expõem o termo usam **fidelidade de 12 meses** — Contabilizei (`fidelidade mínima de 12 meses`, contrapartida da abertura grátis) e Contabilivre (mesmo prazo, contrapartida de taxa de antecipação R$99,90 creditada nas mensalidades). Nosso CAC-alvo (18/08) já foi travado medido contra **LTV de 12 meses**, alinhado a essa prática — mas o **prazo de fidelidade do nosso contrato em si segue sem decisão formal registrada**, vale levar pra fechar com o Mauro.

### Resolvido (histórico)
_(mover item aqui quando bater com ele, com data)_

---

## Peças já separadas

### 1. Custo do atendente por usuário
**R$3,63/usuário/mês, confirmado** — mesmo valor pros dois planos (ME e MEI).
Conta: R$4.000/mês ÷ (50 usuários/dia × 22 dias úteis = 1.100 usuários/mês) = R$3,63.
✅ **Resolvido (Pedro, 24/08):** o R$3,63 é o custo real de atendente. O valor maior do doc-mãe 18/08 (R$87,50-116,67/usuário) **não é o mesmo componente** — é referente a um **honorário** que não entra na conta por ora. Não é uma divergência de premissa, são duas coisas diferentes.

### 2. Outros custos por plano (insumo da margem líquida)
| Custo | ME/Simples | MEI |
|---|---:|---:|
| Técnico (API+sistema) | R$15,00/mês | R$5,00/mês |
| Certificado digital | R$209,00 (único) | não dá (fora do plano) |
| Atendente | R$3,63/usuário/mês | R$3,63/usuário/mês |
| Honorário CRC | fora da conta nesta simulação | fora da conta (MEI não tem contador dedicado) |

### 3. Margem líquida 12 meses (cenários vivos, MEI B/ME B já descartados)
| Cenário | Receita 12m | Margem líquida | % |
|---|---:|---:|---:|
| MEI A (3m R$19→R$49) | R$498,00 | R$394,44 | 79,2% |
| ME A (3m R$99→R$139) | R$1.548,00 | R$1.115,44 | 72,0% |
| ME C (3m R$79→R$139) | R$1.488,00 | R$1.055,44 | 70,9% |

### 4. CAC (10% da receita bruta) × payback — método OFICIAL (confirmado 24/08)
| Cenário | CAC | CAC/margem líquida | Payback |
|---|---:|---:|---:|
| MEI A | R$49,80 | 12,6% | 1,5 mês |
| ME A | R$154,80 | 13,9% | 1,7 mês |
| ME C ← escolhido pra campanha | R$148,80 | 14,1% | 1,7 mês |

### 5. Bloco 1/9 — "O terreno de preço" (print colado pelo Pedro, 24/08)
> Origem: apresentação PDF já existente (bloco 1 de 9) — "onde cada player está e por que o preço anunciado não é a conta". Transcrito da imagem, não veio de nota `.md` do vault ainda — localizar o `.md`-fonte do deck de 9 blocos numa próxima rodada.

**A vitrine do mercado**

| Player | Entrada | Onde o humano aparece | Confiança |
|---|---:|---|---|
| **Legalizai** | R$139 ME · R$49,90 MEI | R$139, o primeiro plano do Simples | 🟢 travado |
| Contaja | R$137 Simples · R$49,90 MEI | não nomeia | 🟢 |
| Contabilizei | R$195 na vitrine pública | R$395 (Experts) | 🟢 |
| Agilize | R$259 fixo | R$450 | 🟢 |
| Facilite | R$199,90 | R$1.249,90 (Black) | 🟢 |
| Contabilivre | R$209 | R$359 (Enterprise) | 🟢 |

**Lucro Presumido, quando entrar:** o líder pratica ~30% acima do plano base. No nosso caso isso põe o plano entre **R$179 e R$189**. Adiado por complexidade (mais de uma guia por mês, escrituração completa), não descartado.

**Leitura do bloco:** somos o 2º mais barato do mercado e o único que põe contador nomeado no plano de entrada. Os outros cobram entre R$359 e R$1.249,90 pela mesma camada humana.

⚠️ **MEI R$49,90 nesse print está desatualizado** — preço travado 20/08 é **R$49 redondo**. Corrigir antes de reusar este bloco na nova apresentação.

### 6. CPC e CPL — últimos dados validados (18/08)
Fonte: [[2026-08-18-custos-margem-decisao]] §"O que essa régua pressupõe" + análise do Puntel.

**Régua do vault (a que sustenta o CAC-alvo R$30-100):**
| Métrica | Faixa | Confiança |
|---|---:|---|
| CPC de mercado | R$2,00 – R$8,00 | 🟢 |
| CPL de mercado | R$30,00 – R$100,00 | 🟢 |

**Dado trazido pelo Puntel (CPC real por plataforma):**
| Plataforma | CPC | Foco proposto | Veredito dele |
|---|---|---|---|
| Meta Ads (IG/FB) | R$1,00 – R$5,00 | venda direta, vídeo na dor da burocracia | ✅ Alta |
| Google Search | R$3,00 – R$10,00 | — | — |

**CPL derivado do CPC do Puntel** (aplicando conversão clique→lead por origem, Leadster Panorama 2026):
| Plataforma | CPC | Conversão clique→lead | CPL derivado |
|---|---|---:|---:|
| Meta Ads | R$1,00 – R$5,00 | 4,68% | **R$21,37 – R$106,84** |
| Google Search | R$3,00 – R$10,00 | 3,46% | **R$86,71 – R$289,02** |

**Leitura:** o Meta do Puntel cabe dentro da nossa faixa (CPL vault R$40-150 pra Meta) e estica pra baixo — boa notícia. O Google dele estoura o teto (R$289 contra R$200 do vault) — ainda não reconciliado, 🟡 pendente pedir recorte (nicho/geografia/termos) direto pro Puntel.

⚠️ **A conversão de 4,68%/3,46% é proxy** (mede landing page por origem, não o nosso funil). Nosso desenho real é anúncio → app/WhatsApp → pagamento; o número de verdade só sai medindo no V0.

## 🔍 Cruzamento — o que NÃO bate (pra debater)

Cruzando as seções 1-6 entre si (excluída a pauta 1-7). **Itens 1 e 3 resolvidos por você em 24/08** — mantidos aqui como histórico da checagem.

1. ✅ **RESOLVIDO — CAC-alvo oficial é o método de 10% da receita bruta** (§4). Doc-mãe 18/08 tinha um teto fixo antigo de R$30-100; passa a valer só o método de 20/08, que gera CAC de R$49,80 (MEI A) e R$148,80-154,80 (ME).

2. **O CPL de Google sozinho pode estourar o CAC inteiro do MEI.** CAC-alvo MEI A = R$49,80 (§4). CPL de Google derivado do Puntel = R$86,71-289,02 (§6) — maior que o CAC INTEIRO, antes até de converter lead em pagante. Ou seja: com os números que temos hoje, **Google não fecha conta nenhuma pro MEI**, e pro ME (CAC R$148-155) só fecha na ponta mais barata do Google (R$86,71) — sem margem de erro. Isso não está dito em lugar nenhum do jeito direto que precisa estar pra apresentar.

3. ✅ **RESOLVIDO — R$3,63 é o custo real de atendente**, confirmado (§1). O valor maior do doc-mãe (R$87,50-116,67) não é o mesmo componente — é um honorário à parte, fora da conta por ora (ver item 4).

4. **Honorário contábil real do Mauro segue fora de TODAS as tabelas de margem que temos pra mostrar.** §2 confirma: "fora da conta" nos dois planos — e o item 3 acima reforça que o número que parecia ser esse honorário (R$87-117) nem é custo de atendente, é o próprio honorário que falta contabilizar. A margem de 70-79% que vamos apresentar **não desconta esse custo** — vale pelo menos um rodapé de honestidade no slide, já que é o insumo mais óbvio que o Mauro vai perguntar primeiro.

5. **MEI R$49,90 no bloco 1/9 (§5) já está desatualizado** — preço travado 20/08 é R$49 redondo. Confirmado, só reforçando que precisa corrigir antes de subir o slide.

## 📊 Visual simplificado — custo dentro de cada plano (pro Mauro)

Proposta de stack por plano, mês cheio (pós-promoção), pra virar gráfico de barra empilhada ou waterfall no design:

| Componente | ME/Simples (R$139/mês) | MEI (R$49/mês) |
|---|---:|---:|
| Mensalidade cobrada | R$139,00 | R$49,00 |
| (−) Técnico (API + sistema) | R$15,00 | R$5,00 |
| (−) Atendente (rateio) | R$3,63 | R$3,63 |
| (−) Certificado digital (rateado em 12m, one-off R$209) | R$17,42 | R$0 (não incluso) |
| **= Margem antes do honorário real** | **R$102,95 (74,1%)** | **R$40,37 (82,4%)** |
| Honorário contábil (Mauro) | ⚠️ fora da conta | ⚠️ fora da conta |

**Leitura pro slide, em 1 frase por componente:**
- **Técnico** = o que a gente paga de API (consulta CNPJ/Receita) + hospedagem/sistema pra rodar a conta de cada cliente.
- **Atendente** = rateio de quem atende o cliente no dia a dia (WhatsApp/suporte), R$3,63/usuário — confirmado, 1 atendente pra até 1.100 usuários/mês.
- **Certificado** = custo único de emissão, só existe no ME, diluído em 12 parcelas pra caber no gráfico mensal.
- **Honorário** = a peça que falta: sem o valor real do Mauro, a margem no slide é otimista por construção — não é custo de atendente, é honorário à parte que não entra na conta por ora.

## Fila (o que ainda falta separar do PDF/docs-fonte)
- Localizar o `.md`/deck-fonte dos 9 blocos (este é só o bloco 1) — provavelmente `pesquisa/2026-08-12-estrategia-mkt-para-validacao.md` ou pipeline próprio; conferir.
- Corrigir MEI R$49,90 → R$49 no bloco 1 antes de reusar.
- Próximos blocos (2-9) — colar conforme o Pedro for mandando.

## Links
- [[2026-08-18-custos-margem-decisao]] · [[2026-08-20-simulacao-oferta-lancamento]] · [[HOME]]
